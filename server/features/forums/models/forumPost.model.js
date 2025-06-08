import mongoose from "mongoose";

const forumPostSchema = new mongoose.Schema(
  {
    postTitle: { type: String, required: true },
    postContent: { type: String, required: true },
    tags: { type: [String], required: true },
    participants: {
      type: [String],
      required: true,
    },
    role: {
      type: String,
      enum: ["instructor", "student", "admin"],
      default: "student",
      required:true
    },
    likes: {
      type: Number,
      default: 0,
    },
    commentIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export const Post= mongoose.model("ForumPost", forumPostSchema);
