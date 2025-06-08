// View post + comments
"use client";

import { useEffect, useState } from "react";
import {
  Heart,
  MessageSquare,
  Share2,
  Bookmark,
  MoreHorizontal,
} from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import CommentCard from "../components/CommentCard";
import ReplyBox from "../components/ReplyBox";
import { useParams } from "react-router-dom";
import { useGetPostDetailsByIdQuery } from "../api/forumApi";
import { useDispatch, useSelector } from "react-redux";
import {
  useCreateCommentMutation,
  useGetCommentsByPostIdQuery,
} from "../api/commentApi";
import { formatDistanceToNow } from "date-fns";

const PostDetails = () => {
  // Sample data - in a real app this would come from props or API
  const user = useSelector((state) => state.auth.user?._id);
  const currentUser = useSelector((state) => state.auth.user);
  const { postId } = useParams();
  const [createComment, {}] = useCreateCommentMutation();
  const {
    data: postDetails,
    isLoading: detailLoading,
    isError: detailError,
    isSuccess: detailSuccess,
  } = useGetPostDetailsByIdQuery(postId);
  // const{data:commentData,isError:getCommentError,isSuccess:getCommentSuccess}=useGetCommentsByPostIdQuery(postId)
  // useEffect(() => {
  console.log("comments", postDetails);
  // }, [commentData]);
  const dispatch = useDispatch();
  const [imgError, setImgError] = useState(false);

  const [activeReplyBoxes, setActiveReplyBoxes] = useState({});

  // Toggle reply box visibility
  const toggleReplyBox = (commentId) => {
    setActiveReplyBoxes((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  // Add a new comment
  const addComment = async (content) => {
    if (!content.trim()) return;
    const newComment = {
      commentContent: content,
      postId,
      commentedBy: user,
    };
    try {
      const { data } = await createComment(newComment);

      if (data?.comment) {
        dispatch(
          forumApi.util.updateQueryData(
            "getPostDetailsById",
            postId,
            (draft) => {
              // Push the new comment to the cached commentIds
              draft.post.commentIds.push(data.comment);
            }
          )
        );
      }
    } catch (error) {
      console.log("Error creating comment:", error);
    }
  };

  // Add a reply to a comment
  const addReply = (commentId, content) => {
    if (!content.trim()) return;
    const newReply={
      replyContent:content,
      commentId,
      repliedBy:user,
    }

    try {
      
    } catch (error) {
      console.log("Error creating reply:", error);
    }
    
  };

  const time = postDetails?.post?.updatedAt;
  console.log("time", currentUser);

  // const timeAgoRaw = formatDistanceToNow(new Date(time), {
  //     addSuffix: true,
  //   });
  //   const timestamp = timeAgoRaw.replace(/^about\s/, "");

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-4 max-w-7xl mx-auto bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 min-h-screen">
      {/* Main content area */}
      <div className="flex-1">
        {/* Main post */}
        <Card className="mb-6 overflow-hidden border-none shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div className="bg-gradient-to-r from-purple-500 to-blue-500 h-2"></div>
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12 ring-2 ring-purple-100 dark:ring-purple-900">
                  {!postDetails?.createdBy?.photoUrl || imgError ? (
                    <div className="bg-purple-200 text-purple-800 dark:bg-purple-900 dark:text-purple-200 w-full h-full flex items-center justify-center font-semibold">
                      {postDetails?.createdBy?.name
                        ?.split(" ")
                        .map((w) => w[0])
                        .join("")
                        .toUpperCase()}
                    </div>
                  ) : (
                    <img
                      src={postDetails?.createdBy?.photoUrl}
                      alt={postDetails?.createdBy?.name}
                      className="object-cover w-full h-full"
                      onError={() => setImgError(true)}
                    />
                  )}
                </Avatar>
                <div>
                  <h3 className="font-semibold text-lg">
                    {postDetails?.post?.createdBy?.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {"h"}
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="rounded-full">
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            </div>

            <h2 className="text-2xl font-bold mb-3 text-gray-800 dark:text-gray-100">
              {postDetails?.post?.postTitle}
            </h2>

            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
              {postDetails?.post?.postContent}
            </p>

            <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-1 text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20"
                >
                  <Heart className="h-5 w-5" />
                  <span>{postDetails?.post?.likes}</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-1 text-blue-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                >
                  <MessageSquare className="h-5 w-5" />
                  {/* <span>{comments.length}</span> */}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-1 text-green-500 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20"
                >
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-1 text-amber-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20"
              >
                <Bookmark className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </Card>

        {/* Add comment section */}
        <div className="mb-8">
          <ReplyBox
            placeholder="Add a comment..."
            onSubmit={addComment}
            avatarUrl={currentUser?.photoUrl}
            avatarInitials={currentUser?.name
              ?.split(" ")
              .map((w) => w[0])
              .join("")}
          />
        </div>

        {/* Comments */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
            {/* Comments ({comments.length}) */}
          </h3>

          {postDetails?.post?.commentIds?.map((comment) => (
            <div key={comment._id} className="mb-6">
              <CommentCard
                comment={comment}
                onReplyClick={() => toggleReplyBox(comment._id)}
              />

              {Array.isArray(comment.replies) && comment.replies.length > 0 && (
                <div className="ml-12 mt-4 space-y-4">
                  {comment.replies.map((reply) => (
                    <CommentCard
                      key={reply.id}
                      comment={reply}
                      isReply={true}
                    />
                  ))}
                </div>
              )}

              {activeReplyBoxes[comment._id] && (
                <div className="ml-12 mt-4">
                  <ReplyBox
                    placeholder="Write a reply..."
                    onSubmit={(content) => addReply(comment._id, content)}
                    avatarUrl={currentUser?.photoUrl}
                    avatarInitials={currentUser?.name
                      ?.split(" ")
                      .map((w) => w[0])
                      .join("")}
                    isReply={true}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Sidebar */}
      <div className="w-full lg:w-80 space-y-6">
        <Card className="overflow-hidden border-none shadow-lg">
          <div className="bg-gradient-to-r from-purple-500 to-blue-500 h-2"></div>
          <div className="p-6">
            <h3 className="text-lg font-semibold flex items-center gap-2 mb-4 text-gray-800 dark:text-gray-200">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-purple-500"
              >
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
              AUTHORED BY
            </h3>
            <div className="flex items-center gap-3">
              <Avatar className="h-14 w-14 ring-2 ring-purple-100 dark:ring-purple-900">
                <img
                  src={postDetails?.createdBy?.photoUrl || "h"}
                  alt={postDetails?.post?.createdBy?.name}
                  className="object-cover"
                />
              </Avatar>
              <div>
                <p className="font-medium text-lg">
                  {postDetails?.post?.createdBy?.name}
                </p>
                <p className="text-sm text-gray-500">
                  {postDetails?.createdAt}
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="overflow-hidden border-none shadow-lg">
          <div className="bg-gradient-to-r from-purple-500 to-blue-500 h-2"></div>
          <div className="p-6">
            <h3 className="text-lg font-semibold flex items-center gap-2 mb-4 text-gray-800 dark:text-gray-200">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-purple-500"
              >
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
              PARTICIPANTS LIST
            </h3>
            <div className="flex flex-wrap gap-2">
              {postDetails?.post?.participants?.map((role, idx) => {
                let badgeStyle = "bg-gray-100 text-gray-800 hover:bg-gray-200"; // Default

                if (role === "student")
                  badgeStyle = "bg-gray-100 text-gray-800 hover:bg-gray-200";
                else if (role === "instructor")
                  badgeStyle = "bg-blue-100 text-blue-800 hover:bg-blue-200";
                else if (role === "admin")
                  badgeStyle = "bg-red-100 text-red-800 hover:bg-red-200";

                return (
                  <Badge
                    key={idx}
                    variant="outline"
                    className={`${badgeStyle} px-3 py-1 rounded-full capitalize`}
                  >
                    {role}
                  </Badge>
                );
              })}
            </div>
          </div>
        </Card>

        <Card className="overflow-hidden border-none shadow-lg">
          <div className="bg-gradient-to-r from-purple-500 to-blue-500 h-2"></div>
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
              Related Posts
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3 pb-3 border-b border-gray-100 dark:border-gray-800">
                <div className="w-12 h-12 rounded-md bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center text-white font-bold">
                  H
                </div>
                <div>
                  <p className="font-medium text-sm">
                    Hackathon team for AI project
                  </p>
                  <p className="text-xs text-gray-500">2 days ago</p>
                </div>
              </div>
              <div className="flex items-start gap-3 pb-3 border-b border-gray-100 dark:border-gray-800">
                <div className="w-12 h-12 rounded-md bg-gradient-to-br from-green-400 to-teal-500 flex items-center justify-center text-white font-bold">
                  T
                </div>
                <div>
                  <p className="font-medium text-sm">
                    TensorFlow workshop this weekend
                  </p>
                  <p className="text-xs text-gray-500">1 week ago</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-md bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold">
                  C
                </div>
                <div>
                  <p className="font-medium text-sm">
                    Computer Vision study group
                  </p>
                  <p className="text-xs text-gray-500">2 weeks ago</p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default PostDetails;
