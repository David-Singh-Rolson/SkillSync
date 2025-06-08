import mongoose from "mongoose";

const replySchema = new mongoose.Schema(
  {
    replyContent: { type: String, required: true },
    commentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
      required: true,
    },
    repliedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    likes: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export const Reply = mongoose.model("Reply", replySchema);
