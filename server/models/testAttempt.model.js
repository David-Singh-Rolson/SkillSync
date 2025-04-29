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
  topic: String,
  marksAwarded: {
    type: Number,
    default: 0,
  },
});

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
  percentage: {
    type: Number,
  },
  status: {
    type: String,
    enum: ["Submitted", "Incomplete"],
    default: "Submitted",
  },
  // timeTaken: Number, // in seconds
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
  remarks: {
    type: String,
  },
}, { timestamps: true });

export const TestAttempt = mongoose.model("TestAttempt", testAttemptSchema);