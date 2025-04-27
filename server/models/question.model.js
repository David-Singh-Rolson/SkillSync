
import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: true,
  },
  options: [// options of the ques if available
    {
      type: String,
      // required: true,
    },
  ],
  correctOptionIndex: { // for single correct
    type: Number,
    // required: true,
  },
  correctOptionIndexes: { // for multicorrect
    type: [Number],
    // required: true,
  },
  correctIntegerAnswer:{ // for integer
    type :Number
  },
  correctAnswer:{// for short answer
    type :String
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
