import mongoose from "mongoose";
import { Comment } from "../models/comment.model.js";
import { Post } from "../models/forumPost.model.js";

export const createComment = async (req, res) => {
  const session = await mongoose.startSession(); // 1. Start session
  session.startTransaction(); // 2. Start transaction

  try {
    const { commentContent, postId, commentedBy } = req.body;
    if (!commentContent || !postId || !commentedBy) {
      return res.status(400).json({
        message: "All fields are required!",
      });
    }

    // 3. Create comment inside transaction
    const commentData = { commentContent, postId, commentedBy };
    const newComment = await Comment.create([commentData], { session });
    console.log("new comment",newComment);
    
    const comment = newComment[0]; // since `create` returns an array

    // 4. Update the post with comment ID
    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { $push: { commentIds: comment._id } },
      { new: true, session }
    );

    if (!updatedPost) {
      throw new Error("Post not found or failed to update");
    }

    await session.commitTransaction(); // 5. All successful, commit
    session.endSession();

    return res.status(201).json({
      message: "Comment created and linked to post successfully",
      comment,
    });

  } catch (error) {
    await session.abortTransaction(); // 6. Rollback on any error
    session.endSession();
    console.error("Transaction failed:", error);

    return res.status(500).json({
      message: "Failed to create comment and update post",
    });
  }
};

// redundant api
export const getCommentByPostId = async (req, res) => {
  try {
    const { postId } = req.params;

    const response = await Comment.find({ postId }).populate(
      "commentedBy",
      "name photoUrl role"
    );
    //   .populate({
    //     path: "replyIds",
    //     populate: {
    //       path: "repliedBy",
    //       select: "name photoUrl role",
    //     },
    //   });
    if (!response) {
      return res.status(404).json({
        message: "Comments not found",
      });
    }
    return res.status(200).json({
      message: "Comments found",
      comment: response,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to get comments!",
      error: error.message,
    });
  }
};
