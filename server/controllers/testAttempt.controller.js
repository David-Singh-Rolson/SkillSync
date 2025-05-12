import { Test } from "../models/test.model.js";
import { TestAttempt } from "../models/testAttempt.model.js";
import { Question } from "../models/question.model.js"; 
import { getAvailableTopics } from "../utils/topics.js";
import { getMLRecommendedCourse } from "../utils/mlService.js";
import axios from "axios";
export const getQuestionForAttempt = async (req, res) => {
  try {
    const { assessmentId, userId } = req.body;
    // const studentId = req.body.user?._id;
    // console.log("taapiii",req.body);

    const test = await Test.findById(assessmentId)
      .populate({
        path: "questions",
        select: "questionText options marks topic difficulty questionType",
      })
      .populate("createdBy", "name");

    if (!test) {
      return res.status(404).json({ message: "Test not found" });
    }

    if (!test.isPublished) {
      return res.status(403).json({ message: "Test is not published yet" });
    }

    const now = new Date();
    if (test.isScheduled) {
      if (now < new Date(test.startTime) || now > new Date(test.endTime)) {
        return res
          .status(403)
          .json({ message: "Test is not currently available" });
      }
    }

    if (req.body.role !== "student") {
      return res
        .status(403)
        .json({ message: "Only students can attempt tests" });
    }

    // Check for existing attempt
    if (!assessmentId || !userId) {
      return res
        .status(400)
        .json({ message: "Missing assessmentId or userId" });
    }

    let attempt = await TestAttempt.findOne({
      student: userId,
      test: assessmentId,
    });

    if (attempt) {
      if (attempt.status === "Submitted") {
        return res
          .status(403)
          .json({ message: "You have already submitted this test." });
      }

      return res.status(200).json({
        message: "Resuming your test...",
        attemptId: attempt._id,
        assessmentTitle: test.testTitle,
        timeLimit: test.timeLimit,
        totalMarks: test.totalMarks,
        startedAt: attempt.createdAt,
        questions: test.questions,
      });
    }

    // Create new attempt
    attempt = new TestAttempt({
      student: userId,
      test: assessmentId,
      responses: [],
      totalMarks: test.totalMarks,
      score: 0,
      status: "Incomplete",
    });

    await attempt.save();

    return res.status(200).json({
      message: "Test started",
      test,
      attemptId: attempt._id,
      startedAt: attempt.createdAt,
    });

    // return res.status(200).json({message:"Ok",test})
  } catch (error) {
    console.error("getQuestionForAttempt error:", error.message, error.stack);

    return res.status(500).json({ message: "Internal server error" });
  }
};

export const submitTestAttempt = async (req, res) => {
  const difficultyMap = {
    Easy: 1,
    Medium: 2,
    Hard: 3,
  };
  try {
    const { attemptId, responses, testType, testLevel } = req.body;

    if (!attemptId || !responses || typeof responses !== "object") {
      return res.status(400).json({ message: "Invalid request data" });
    }

    const attempt = await TestAttempt.findById(attemptId).populate("test");

    if (!attempt) {
      return res.status(404).json({ message: "Test attempt not found" });
    }

    if (attempt.status === "Submitted") {
      return res.status(403).json({ message: "Test already submitted" });
    }

    const questionLevelStats = {
      easy: { attempted: 0, correct: 0, accuracy: 0 },
      medium: { attempted: 0, correct: 0, accuracy: 0 },
      hard: { attempted: 0, correct: 0, accuracy: 0 },
    };

    const structuredResponses = [];
    let totalDifficulty = 0;
    let topicPerformance = {};
    let topicWiseMarks = {};
    let totalMarksPossible = 0;
    let totalMarksAwarded = 0;
    for (const [questionId, data] of Object.entries(responses)) {
      const question = await Question.findById(questionId);
      

      let newResponse = {
        question: questionId,
        isCorrect: false, // calculate below
        topic: question.topic,
        marksAwarded: 0,
        testType: testType,
        quesLevel: question.difficulty,
      };
      totalDifficulty += difficultyMap[question.difficulty];
      if (data.questionType === "SingleCorrect") {
        newResponse.selectedOptionIndex = data.response[0];
        // check if correct...
        if (newResponse.selectedOptionIndex === question.correctOptionIndex) {
          newResponse.isCorrect = true;
          newResponse.marksAwarded = question.marks;
        }
      } else if (data.questionType === "MultiCorrect") {
        newResponse.selectedOptionIndexes = data.response;
        // check if correct...
        const areEqual =
          newResponse.selectedOptionIndexes.length ===
            question.correctOptionIndexes.length &&
          newResponse.selectedOptionIndexes
            .sort()
            .every(
              (value, index) =>
                value === question.correctOptionIndexes.sort()[index]
            );
        if (areEqual) {
          newResponse.isCorrect = true;
          newResponse.marksAwarded = question.marks;
        }
      } else if (data.questionType === "TrueFalse") {
        newResponse.selectedOptionIndex = data.response[0];
        // check if correct...
        if (newResponse.selectedOptionIndex == question.correctOptionIndex) {
          newResponse.isCorrect = true;
          newResponse.marksAwarded = question.marks;
        }
      } else if (data.questionType === "Integer") {
        newResponse.selectedIntegerAnswer = data.response;
        // check if correct...
        if (newResponse.selectedIntegerAnswer == question.correctAnswer) {
          newResponse.isCorrect = true;
          newResponse.marksAwarded = question.marks;
        }
      } else if (data.questionType === "ShortAnswer") {
        newResponse.selectedCorrectAnswer = data.response;
        // check if correct...
        if (newResponse.selectedCorrectAnswer && question.correctAnswer) {
          if (
            newResponse.selectedCorrectAnswer.toLowerCase() ==
            question.correctAnswer.toLowerCase()
          ) {
            newResponse.isCorrect = true;
            newResponse.marksAwarded = question.marks;
          }
        }
      }
      // Update question level stats
      const difficultyKey = question.difficulty.toLowerCase();
      if (questionLevelStats[difficultyKey]) {
        questionLevelStats[difficultyKey].attempted += 1;
        if (newResponse.isCorrect) {
          questionLevelStats[difficultyKey].correct += 1;
        }
      }
      if (!topicWiseMarks[newResponse.topic]) {
        topicWiseMarks[newResponse.topic] = { totalMarks: 0, marksAwarded: 0 };
      }

      topicWiseMarks[newResponse.topic].totalMarks += question.marks;
      topicWiseMarks[newResponse.topic].marksAwarded +=
        newResponse.marksAwarded;

      totalMarksPossible += question.marks;
      totalMarksAwarded += newResponse.marksAwarded;
      structuredResponses.push(newResponse);
    }

    // Compute accuracy for each difficulty level
    for (const level in questionLevelStats) {
      const stats = questionLevelStats[level];
      stats.accuracy =
        stats.attempted > 0 ? stats.correct / stats.attempted : 0;
    }

    let totalScore = 0,
      correctAns = 0,
      totalQues = 0;
    structuredResponses.forEach((response) => {
      if (response.marksAwarded > 0) {
        correctAns++;
      }
      totalScore += response.marksAwarded;
      totalQues++;
    });
    const testPercentage = (totalScore / attempt.totalMarks) * 100;


    let avgQuestionDiffi =
      structuredResponses.length > 0
        ? totalDifficulty / structuredResponses.length
        : 0;
    // for (let topic in topicWiseMarks) {
    //   // doubt how and why
    //   const { totalMarks, marksAwarded } = topicWiseMarks[topic];
    //   const performancePercentage = (marksAwarded / totalMarks) * 100;
    //   topicPerformance[topic] = performancePercentage;
    // }

    // Calculate avgPreviousPerformance----------- not tested yet
    const previousAttempts = await TestAttempt.find({
      student: attempt.student,
      status: "Submitted",
      _id: { $ne: attempt._id },
    });

    let avgPreviousPerformance = null;
    if (previousAttempts.length > 0) {
      const totalScore = previousAttempts.reduce(
        (acc, attempt) => acc + attempt.score,
        0
      );
      avgPreviousPerformance = totalScore / previousAttempts.length;
    }

    const overallAccuracy = correctAns / totalQues;

    // STEP: Get last 2 attempts (excluding current one)
    const lastTwoAttempts = await TestAttempt.find({
      student: attempt.student,
      status: "Submitted",
      _id: { $ne: attempt._id },
    })
      .sort({ createdAt: -1 }) // most recent first
      .limit(2);

    const pastPercentages = lastTwoAttempts
      .map((a) => a.percentage || 0)
      .reverse(); // oldest to newest
    pastPercentages.push(testPercentage);

    // Calculate trend
    let performanceTrend = "Stable";

    if (pastPercentages.length >= 2) {
      const [a, b, c] = pastPercentages;
      if (pastPercentages.length === 3 && a < b && b < c) {
        performanceTrend = "Improving";
      } else if (pastPercentages.length === 3 && a > b && b > c) {
        performanceTrend = "Declining";
      } else if (
        pastPercentages.length === 2 &&
        pastPercentages[0] < pastPercentages[1]
      ) {
        performanceTrend = "Improving";
      } else if (
        pastPercentages.length === 2 &&
        pastPercentages[0] > pastPercentages[1]
      ) {
        performanceTrend = "Declining";
      }
    }

    attempt.status = "Submitted";
    attempt.score = totalScore;
    attempt.responses = structuredResponses;
    attempt.avgQuestionDifficulty = avgQuestionDiffi;
    attempt.topicWisePerformance = topicPerformance;
    attempt.avgPreviousPerformance = avgPreviousPerformance;
    attempt.percentage = testPercentage;
    attempt.overallAccuracy = overallAccuracy;
    attempt.testLevel = testLevel;
    attempt.performanceTrend = performanceTrend;
    attempt.questionLevelStats = questionLevelStats;





    try {
      const mlPayload = {
        ...topicPerformance,
        avgPreviousPerformance: avgPreviousPerformance || 0,
        avgQuestionDiffi,
        testType: testType === "Topic" ? "Topic" : "Mixed"
      };

      const mlResponse = await axios.post("http://localhost:5000/predict", mlPayload);
      const recommended = mlResponse.data.recommendedCourses?.[0];
      if (recommended) {
        attempt.labelCourseId = recommended.courseId;
      }
    } catch (err) {
      console.log("⚠ ML fallback error", err.message);
    }


    await attempt.save();
    return res.status(200).json({
      message: "Test submitted successfully",
      attempt,
      // recommendedCourseId: recommendedCourseId
      // recommendedTopics
    });
  } catch (error) {
    console.error("submitTestAttempt error:", error.message, error.stack);
    return res.status(500).json({ message: "Internal server error" });
  }
};
