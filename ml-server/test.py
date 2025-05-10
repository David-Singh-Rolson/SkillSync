from flask import Flask, request, jsonify
import joblib
import json
import numpy as np
import os
import pandas as pd
from pymongo import MongoClient

app = Flask(_name_)

# 🔌 Connect to MongoDB for rule-based fallback
client = MongoClient("mongodb+srv://davidsinghrolson:l0kjL6nobVBEGKkB@cluster0.ruleu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
db = client["test"]

# 📦 Load ML model
model = joblib.load("recommendation_model.pkl")

# 📁 Load topics and course ID map
BASE_DIR = os.path.dirname(os.path.abspath(_file_))
with open(os.path.join(BASE_DIR, 'topics.json'), 'r') as f:
    available_topics = json.load(f)

with open(os.path.join(BASE_DIR, 'courses.json'), 'r') as f:
    valid_course_ids = json.load(f)

# 🔁 Fallback: Get courseId by topic name
def get_course_by_topic(topic_name):
    course = db.courses.find_one({"category": topic_name})
    if course:
        return str(course["_id"])
    return None

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()

    # 🎯 Build input vector
    features = [data.get(topic, 0) for topic in available_topics]
    features.append(0 if data.get("testType") == "Topic" else 1)
    features.append(data.get("avgPreviousPerformance", 0))
    features.append(data.get("avgQuestionDifficulty", 2))

    input_df = pd.DataFrame([features], columns=available_topics + [
        "testType", "avgPreviousPerformance", "avgQuestionDifficulty"
    ])

    # 🔮 Predict with ML
    probas = model.predict_proba(input_df)[0]
    class_indices = np.argsort(probas)[::-1]

    recommendations = []
    threshold = 0.3
    for idx in class_indices:
        if probas[idx] >= threshold:
            recommendations.append({
                "courseId": model.classes_[idx],
                "confidence": float(probas[idx])
            })

    # 🚨 If no ML prediction passes threshold → fallback to rule-based
    if not recommendations:
        sorted_topics = sorted(
            [(topic, data.get(topic, 0)) for topic in available_topics],
            key=lambda x: x[1],
            reverse=True
        )
        top_topic = sorted_topics[0][0] if sorted_topics else None
        fallback_course_id = get_course_by_topic(top_topic)
        if fallback_course_id:
            recommendations.append({
                "courseId": fallback_course_id,
                "confidence": 0.25  # default for rule-based
            })

    return jsonify({
        "recommendedCourses": recommendations
    })

if _name_ == "_main_":
    app.run(host="0.0.0.0", port=5000)
    
    
    
    
    
    
    
    
    
    
    import { TestAttempt } from "../models/TestAttempt.js";
import { Question } from "../models/Question.js";
import axios from "axios";

export const submitTestAttempt = async (req, res) => {
  const difficultyMap = { Easy: 1, Medium: 2, Hard: 3 };

  try {
    const { attemptId, responses, testType, testLevel, timeTaken } = req.body;

    if (!attemptId || !responses || typeof responses !== "object") {
      return res.status(400).json({ message: "Invalid request data" });
    }

    const attempt = await TestAttempt.findById(attemptId).populate("test");
    if (!attempt) return res.status(404).json({ message: "Test not found" });
    if (attempt.status === "Submitted") return res.status(403).json({ message: "Already submitted" });

    let structuredResponses = [];
    let topicWiseMarks = {};
    let topicPerformance = {};
    let questionLevelStats = { Easy: 0, Medium: 0, Hard: 0 };
    let totalDifficulty = 0;
    let totalMarksAwarded = 0;
    let totalMarksPossible = 0;
    let correctAns = 0;

    // 🧠 1. Process each response
    for (const [questionId, data] of Object.entries(responses)) {
      const question = await Question.findById(questionId);
      if (!question) continue;

      const newResp = {
        question: questionId,
        topic: question.topic,
        isCorrect: false,
        marksAwarded: 0,
        testType: testType,
      };

      totalDifficulty += difficultyMap[question.difficulty];
      questionLevelStats[question.difficulty] += 1;

      // Evaluate correctness
      const qType = data.questionType;
      const correctAns = question.correctAnswer;
      const correctIndex = question.correctOptionIndex;
      const correctIndexes = question.correctOptionIndexes;

      if (qType === "SingleCorrect" || qType === "TrueFalse") {
        newResp.selectedOptionIndex = data.response[0];
        if (newResp.selectedOptionIndex === correctIndex) {
          newResp.isCorrect = true;
          newResp.marksAwarded = question.marks;
        }
      } else if (qType === "MultiCorrect") {
        newResp.selectedOptionIndexes = data.response;
        const isCorrect = newResp.selectedOptionIndexes.length === correctIndexes.length &&
          newResp.selectedOptionIndexes.sort().every((val, i) => val === correctIndexes.sort()[i]);
        if (isCorrect) {
          newResp.isCorrect = true;
          newResp.marksAwarded = question.marks;
        }
      } else if (qType === "Integer") {
        newResp.selectedIntegerAnswer = data.response;
        if (data.response == correctAns) {
          newResp.isCorrect = true;
          newResp.marksAwarded = question.marks;
        }
      } else if (qType === "ShortAnswer") {
        newResp.selectedCorrectAnswer = data.response;
        if (
          newResp.selectedCorrectAnswer &&
          correctAns &&
          newResp.selectedCorrectAnswer.toLowerCase() === correctAns.toLowerCase()
        ) {
          newResp.isCorrect = true;
          newResp.marksAwarded = question.marks;
        }
      }

      totalMarksPossible += question.marks;
      totalMarksAwarded += newResp.marksAwarded;
      if (newResp.marksAwarded > 0) correctAns++;

      // 🌐 topic-wise data
      if (!topicWiseMarks[newResp.topic]) {
        topicWiseMarks[newResp.topic] = { totalMarks: 0, marksAwarded: 0 };
      }
      topicWiseMarks[newResp.topic].totalMarks += question.marks;
      topicWiseMarks[newResp.topic].marksAwarded += newResp.marksAwarded;

      structuredResponses.push(newResp);
    }

    // 🧠 2. Post-processing metrics
    const totalQues = structuredResponses.length;
    const percentage = (totalMarksAwarded / totalMarksPossible) * 100;
    const overallAccuracy = correctAns / totalQues;
    const avgQuestionDifficulty = totalQues > 0 ? totalDifficulty / totalQues : 0;

    for (const topic in topicWiseMarks) {
      const t = topicWiseMarks[topic];
      topicPerformance[topic] = Math.round((t.marksAwarded / t.totalMarks) * 100);
    }

    // 📈 3. Performance Trend
    const previousAttempts = await TestAttempt.find({
      student: attempt.student,
      status: "Submitted",
      _id: { $ne: attempt._id }
    }).sort({ createdAt: -1 }).limit(2);

    let avgPreviousPerformance = null;
    if (previousAttempts.length > 0) {
      const total = previousAttempts.reduce((acc, val) => acc + val.score, 0);
      avgPreviousPerformance = total / previousAttempts.length;
    }

    let performanceTrend = "Stable";
    const past = previousAttempts.map(p => p.percentage || 0).reverse();
    past.push(percentage);

    if (past.length >= 2) {
      const [a, b, c] = past;
      if (past.length === 3 && a < b && b < c) performanceTrend = "Improving";
      else if (past.length === 3 && a > b && b > c) performanceTrend = "Declining";
      else if (a < b) performanceTrend = "Improving";
      else if (a > b) performanceTrend = "Declining";
    }

    // 🧠 4. ML Prediction + store labelCourseId
    try {
      const mlPayload = {
        ...topicPerformance,
        avgPreviousPerformance: avgPreviousPerformance || 0,
        avgQuestionDifficulty,
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

    // ✅ 5. Update attempt
    attempt.status = "Submitted";
    attempt.responses = structuredResponses;
    attempt.score = totalMarksAwarded;
    attempt.percentage = percentage;
    attempt.avgPreviousPerformance = avgPreviousPerformance;
    attempt.overallAccuracy = overallAccuracy;
    attempt.avgQuestionDifficulty = avgQuestionDifficulty;
    attempt.performanceTrend = performanceTrend;
    attempt.topicWisePerformance = topicPerformance;
    attempt.testLevel = testLevel;
    attempt.timeTaken = timeTaken || 0;
    attempt.questionLevelStats = questionLevelStats;

    await attempt.save();

    return res.status(200).json({ message: "Test submitted successfully", attempt });

  } catch (err) {
    console.error("submitTestAttempt error:", err.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};