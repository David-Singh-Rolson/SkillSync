

import mongoose from "mongoose";

const testSchema = new mongoose.Schema({
  testTitle: {
    type: String,
    required: true,
  },
  description: String,
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    default: null,
  },
  testType: {
    type: String,
    enum: ["Mixed", "Topic"],
    default: "Topic",
    required:true
  },
  timeLimit: {
    type: Number, // in minutes
    required: true,
  },
  totalMarks: {
    type: Number,
    default: 0,
  },
  instructions: {
    type: String,
    default: "",
  },
  questions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
    },
  ],
  isPublished: {
    type: Boolean,
    default: false,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Teacher now, can be Admin later
    required: true,
  },
}, { timestamps: true });

export const Test = mongoose.model("Test", testSchema);
