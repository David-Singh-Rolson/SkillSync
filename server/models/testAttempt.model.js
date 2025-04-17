// import mongoose from "mongoose";

// const testAttemptSchema = new mongoose.Schema({
//   student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//   test: { type: mongoose.Schema.Types.ObjectId, ref: "Test", required: true },
//   responses: [
//     {
//       question: { type: mongoose.Schema.Types.ObjectId, ref: "Question" },
//       selectedOptionIndex: { type: Number },
//       isCorrect: { type: Boolean },
//     },
//   ],
//   score: { type: Number, required: true },
//   totalMarks: { type: Number, required: true },
//   timeTaken: { type: Number }, // in seconds
//   submittedAt: { type: Date, default: Date.now },
// });

// export const TestAttempt = mongoose.model("TestAttempt", testAttemptSchema);

import mongoose from "mongoose";

const responseSchema = new mongoose.Schema({
  question: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Question",
    required: true,
  },
  selectedOptionIndex: Number,
  isCorrect: Boolean,
  topic: String,
  marksAwarded: {
    type: Number,
    default: 0,
  }
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
  timeTaken: Number, // in seconds
  topicWisePerformance: {
    type: Map,
    of: Number, // percentage score per topic
    default: {},
  },
  remarks: {
    type: String,
  },
}, { timestamps: true });

export const TestAttempt = mongoose.model("TestAttempt", testAttemptSchema);

