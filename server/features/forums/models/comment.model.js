import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  commentContent: { type: String, required: true },
  postId: { type: mongoose.Schema.Types.ObjectId, ref: "ForumPost",required: true  },
  commentedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" ,required: true },
  replyIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Reply" }],
  likes:{
      type:Number,
      default:0
    },
}, { timestamps: true });

export const Comment= mongoose.model("Comment", commentSchema);

