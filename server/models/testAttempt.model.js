// import mongoose from "mongoose";

// const responseSchema = new mongoose.Schema({
//   question: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Question",
//     required: true,
//   },
//   selectedOptionIndex: Number,
//   isCorrect: Boolean,
//   topic: String,
//   marksAwarded: {
//     type: Number,
//     default: 0,
//   }
// });

// const testAttemptSchema = new mongoose.Schema({
//   student: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//     required: true,
//   },
//   test: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Test",
//     required: true,
//   },
//   responses: [responseSchema],
//   totalMarks: {
//     type: Number,
//     required: true,
//   },
//   score: {
//     type: Number,
//     required: true,
//   },
//   percentage: {
//     type: Number,
//   },
//   status: {
//     type: String,
//     enum: ["Submitted", "Incomplete"],
//     default: "Submitted",
//   },
//   timeTaken: Number, // in seconds
//   topicWisePerformance: {
//     type: Map,
//     of: Number, // percentage score per topic
//     default: {},
//   },
//   remarks: {
//     type: String,
//   },
// }, { timestamps: true });

// export const TestAttempt = mongoose.model("TestAttempt", testAttemptSchema);

import mongoose from "mongoose";
import { type } from "os";

// const responseSchema = new mongoose.Schema({
//   question: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Question",
//     required: true,
//   },
//   selectedOptionIndex: Number,
//   isCorrect: Boolean,
//   topic: String,
//   marksAwarded: {
//     type: Number,
//     default: 0,
//   }
// });


const responseSchema = new mongoose.Schema({
  question: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Question",
    required: true,
  },
  selectedOptionIndex: Number, // for SingleCorrect, TrueFalse
  selectedOptionIndexes: [Number], // for MultiCorrect
  selectedIntegerAnswer: Number, // for Integer-type exact answers (optional)
  selectedCorrectAnswer:String,
  isCorrect: Boolean,
  quesLevel:String,
  topic: String,
  marksAwarded: {
    type: Number,
    default: 0,
  },
});

const questionLevelStatsSchema = new mongoose.Schema({
  easy: {
    attempted: { type: Number, default: 0 },
    correct: { type: Number, default: 0 },
    accuracy: { type: Number, default: 0 },
  },
  medium: {
    attempted: { type: Number, default: 0 },
    correct: { type: Number, default: 0 },
    accuracy: { type: Number, default: 0 },
  },
  hard: {
    attempted: { type: Number, default: 0 },
    correct: { type: Number, default: 0 },
    accuracy: { type: Number, default: 0 },
  },
}, { _id: false }); // No separate _id for sub-schema

const testAttemptSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  test: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Test",
    required: true,
  },
  responses: [responseSchema],
  totalMarks: {
    type: Number,
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
  avgTopicDifficulty: {
    type: Number,
    default: 0,
  },
  overallAccuracy:{
    type:Number
  },
  percentage: {
    type: Number,
  },
  status: {
    type: String,
    enum: ["Submitted", "Incomplete"],
    default: "Submitted",
  },
  timeTaken: {
    type:Number
  }, // in seconds
  questionLevelStats:questionLevelStatsSchema,
  topicWisePerformance: {
    type: Map,
    of: Number, // percentage score per topic
    default: {},
  },
  avgQuestionDifficulty: {
    type: Number,
    default: 0, // range: 1 (Easy) to 3 (Hard)
  },
  avgPreviousPerformance: {
    type: Number,
    default: null,
  },
  labelCourseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    default: null, // Only used for ML training
  },
  testType:{
    type: String,
    enum: ["Topic", "Mixed"],
    default: "Topic",
  },
  testLevel: {// new field
    type: String,
    enum: ["Beginner", "Medium","Advance"],
    default: "Beginner",
    // required:true
  },
  performanceTrend: {
    type: String,
    enum: ['Improving', 'Declining', 'Stable'],
  },
  remarks: {
    type: String,
  },
}, { timestamps: true });

export const TestAttempt = mongoose.model("TestAttempt", testAttemptSchema);