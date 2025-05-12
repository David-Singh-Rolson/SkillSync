// This file contains the mock data for the student dashboard
// In a real application, this would be fetched from an API

 const studentData = {
  _id: "681c7eb5433399fe0f6700ce",
  student: "681652ae2fdba37dacb03f64",
  test: "6816f717d763eff485d04801",
  responses: [
    {
      question: "681729f0dfb1a16336e938d0",
      selectedOptionIndex: 0,
      selectedOptionIndexes: [],
      isCorrect: false,
      quesLevel: "Easy",
      topic: "DBMS",
      marksAwarded: 0,
      _id: "681c7f85da586ee2c044ed31",
    },
    // Other responses would be here
  ],
  totalMarks: 20,
  score: 0,
  avgTopicDifficulty: 0,
  status: "Submitted",
  topicWisePerformance: {
    DBMS: 0,
    "Data Structures": 0.4,
    Algorithms: 0.6,
    "Operating Systems": 0.3,
  },
  avgQuestionDifficulty: 1,
  avgPreviousPerformance: "20",
  labelCourseId: "681651432fdba37dacb03f4b",
  testType: "Topic",
  testLevel: "Medium",
  createdAt: "2025-05-08T09:51:49.854+00:00",
  updatedAt: "2025-05-08T09:55:17.679+00:00",
  __v: 1,
  overallAccuracy: 0,
  percentage: 0,
  performanceTrend: "Stable",
  questionLevelStats: {
    easy: {
      attempted: 5,
      correct: 1,
      accuracy: 0.2,
    },
    medium: {
      attempted: 3,
      correct: 2,
      accuracy: 0.67,
    },
    hard: {
      attempted: 2,
      correct: 0,
      accuracy: 0,
    },
  },
}

export default studentData