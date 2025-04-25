import { Test } from "../models/test.model.js";
import { TestAttempt } from "../models/testAttempt.model.js";
import { Question } from "../models/question.model.js"; // Assuming you have this model
import { evaluateAnswer } from "../utils/evaluteAnswer.js";
export const getQuestionForAttempt = async (req, res) => {
  try {
    const { assessmentId,userId } = req.body;
    // const studentId = req.body.user?._id;
    // console.log("taapiii",req.body);
    

    const test = await Test.findById(assessmentId).populate({
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
        return res.status(403).json({ message: "Test is not currently available" });
      }
    }

    if (req.body.role !== "student") {
      return res.status(403).json({ message: "Only students can attempt tests" });
    }

    // Check for existing attempt
    if (!assessmentId || !userId) {
      return res.status(400).json({ message: "Missing assessmentId or userId" });
    }    
    let attempt = await TestAttempt.findOne({ student: userId, test: assessmentId });

    if (attempt) {
      if (attempt.status === "Submitted") {
        return res.status(403).json({ message: "You have already submitted this test." });
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
      attemptId:attempt._id,
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
    easy: 1,
    medium: 2,
    hard: 3,
  };
  try {
    const { attemptId, responses } = req.body;

    if (!attemptId || !responses || typeof responses !== 'object') {
      return res.status(400).json({ message: "Invalid request data" });
    }
    console.log("responsessss",responses);
    
    const attempt = await TestAttempt.findById(attemptId).populate("test");
    
    if (!attempt) {
      return res.status(404).json({ message: "Test attempt not found" });
    }

    if (attempt.status === "Submitted") {
      return res.status(403).json({ message: "Test already submitted" });
    }

    
    // Convert responses object into an array
    const responseArray = Object.entries(responses).map(([questionId, selectedOption]) => ({
      question: questionId,
      selectedOptionIndex: selectedOption,
    }));
    
    const questionIds = responseArray.map((r) => r.question);
    const questions = await Question.find({ _id: { $in: questionIds } });
    
    console.log("responseArray",responseArray);
    let score = 0;
    const topicScores = {};
    const topicMarks = {};
    let totalDifficulty = 0;
    console.log("Mapping over responses:", responses);

    const processedResponses = responseArray.map((response) => {
      const question = questions.find((q) => q._id.toString() === response.question);
      // console.warn("Question not found for response:", response);
      if (!question) return null;
      
      //
      console.log("ques",question);

    const { isCorrect, marksAwarded } = evaluateAnswer(response, question);

      score += marksAwarded;

      // Track topic-wise performance
      if (!topicScores[question.topic]) {
        topicScores[question.topic] = 0;
        topicMarks[question.topic] = 0;
      }
      topicScores[question.topic] += marksAwarded;
      topicMarks[question.topic] += question.marks;

       // Map difficulty string to numeric value
  const difficultyValue = difficultyMap[question.difficulty] || 0; // Default to 0 if difficulty is undefined or invalid

  // Add to totalDifficulty
  totalDifficulty += difficultyValue;
      // totalDifficulty += question.difficulty;

      return {
        question: question._id,
        selectedOptionIndex: response.selectedOptionIndex,
        isCorrect,
        topic: question.topic,
        marksAwarded,
      };
    }).filter(Boolean);

    // Calculate topic-wise percentage
    const topicWisePerformance = {};
    Object.keys(topicScores).forEach((topic) => {
      topicWisePerformance[topic] = Math.round((topicScores[topic] / topicMarks[topic]) * 100);
    });

    const percentage = Math.round((score / attempt.totalMarks) * 100);
    const avgQuestionDifficulty = questions.length > 0 ? totalDifficulty / questions.length : 0; 

    // Update attempt
    attempt.responses = processedResponses;
    attempt.score = score;
    attempt.percentage = percentage;
    attempt.status = "Submitted";
    // attempt.timeTaken = timeTaken;
    attempt.topicWisePerformance = topicWisePerformance;
    attempt.avgQuestionDifficulty = avgQuestionDifficulty;

    await attempt.save();

    return res.status(200).json({
      message: "Test submitted successfully",
      score,
      percentage,
      topicWisePerformance,
    });
  } catch (error) {
    console.error("submitTestAttempt error:", error.message, error.stack);
    return res.status(500).json({ message: "Internal server error" });
  }
};
