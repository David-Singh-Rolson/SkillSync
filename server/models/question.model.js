
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
    // required: true,
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
    enum: ["SingleCorrect", "TrueFalse", "ShortAnswer","Integer","MultiCorrect"],
    default: "SingleCorrect",
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Teacher now, can be Admin later
      required: true,
    },
}, { timestamps: true });

export const Question = mongoose.model("Question", questionSchema);
