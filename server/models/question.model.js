// import mongoose from "mongoose";

// const questionSchema = new mongoose.Schema({
//   questionText: { type: String, required: true },
//   options: [{ type: String, required: true }],
//   correctOptionIndex: { type: Number, required: true },
//   topic: { type: String, required: true }, // e.g., "DBMS", "OOPs", "Maths"
//   difficulty: { type: String, enum: ["Easy", "Medium", "Hard"], default: "Medium" },
// });

// export const Question = mongoose.model("Question", questionSchema);


import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: true,
  },
  options: [
    {
      type: String,
      required: true,
    },
  ],
  correctOptionIndex: {
    type: Number,
    required: true,
  },
  topic: {
    type: String, // e.g. "DBMS", "Maths", "OOPs"
    required: true,
  },
  difficulty: {
    type: String,
    enum: ["Easy", "Medium", "Hard"],
    default: "Medium",
  },
  marks: {
    type: Number,
    default: 1,
  },
  questionType: {
    type: String,
    enum: ["MCQ", "TrueFalse", "ShortAnswer"],
    default: "MCQ",
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

export const Question = mongoose.model("Question", questionSchema);
