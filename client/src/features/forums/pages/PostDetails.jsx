// View post + comments
import React from 'react'

"use client"

import { useState } from "react"
import { Heart, MessageSquare, Share2, Bookmark, MoreHorizontal } from "lucide-react"
import { Avatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import CommentCard from '../components/CommentCard'
import ReplyBox from '../components/ReplyBox'

const PostDetails = () => {
  // Sample data - in a real app this would come from props or API
  const [post] = useState({
    id: 1,
    title: "Member required for graph-e-thon",
    content:
      "hello, i am looking for 2 team members for graph-e-thon preferably from deemed/hill campus who are familiar or willing to work with technologies like android, computer vision, tensor flow lite and who are available on the dates and enthusiastic for the hackathon. Interested one's can drop their LinkedIn or message me to discuss the idea further.",
    author: {
      name: "Shivam Mahendru",
      avatar: "/placeholder.svg?height=48&width=48",
      createdAt: "a year ago",
    },
    likes: 24,
    bookmarked: false,
  })

  const [comments, setComments] = useState([
    {
      id: 1,
      author: {
        name: "Gaurav Jugran",
        avatar: "/placeholder.svg?height=40&width=40",
        initials: "GJ",
      },
      content: "Interested: Gaurav Jugran",
      details: ["B.Tech CSE", "8218527934", "ggauri588@gmail.com"],
      createdAt: "a year ago",
      likes: 3,
      showReplyBox: false,
      replies: [],
    },
    {
      id: 2,
      author: {
        name: "Priyanka Sharma",
        avatar: "",
        initials: "PS",
      },
      content: "",
      createdAt: "a year ago",
      likes: 0,
      showReplyBox: false,
      replies: [],
    },
  ])

  // Toggle reply box visibility
  const toggleReplyBox = (commentId) => {
    setComments(
      comments.map((comment) =>
        comment.id === commentId ? { ...comment, showReplyBox: !comment.showReplyBox } : comment,
      ),
    )
  }

  // Add a new comment
  const addComment = (content) => {
    if (!content.trim()) return

    const newComment = {
      id: comments.length + 1,
      author: {
        name: "Current User",
        avatar: "/placeholder.svg?height=40&width=40",
        initials: "CU",
      },
      content,
      createdAt: "just now",
      likes: 0,
      showReplyBox: false,
      replies: [],
    }

    setComments([...comments, newComment])
  }

  // Add a reply to a comment
  const addReply = (commentId, content) => {
    if (!content.trim()) return

    setComments(
      comments.map((comment) => {
        if (comment.id === commentId) {
          const newReply = {
            id: comment.replies.length + 1,
            author: {
              name: "Current User",
              avatar: "/placeholder.svg?height=32&width=32",
              initials: "CU",
            },
            content,
            createdAt: "just now",
            likes: 0,
          }
          return {
            ...comment,
            replies: [...comment.replies, newReply],
            showReplyBox: false,
          }
        }
        return comment
      }),
    )
  }

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
                  <img src={post.author.avatar || "/placeholder.svg"} alt={post.author.name} className="object-cover" />
                </Avatar>
                <div>
                  <h3 className="font-semibold text-lg">{post.author.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{post.author.createdAt}</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="rounded-full">
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            </div>

            <h2 className="text-2xl font-bold mb-3 text-gray-800 dark:text-gray-100">{post.title}</h2>

            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">{post.content}</p>

            <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-1 text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20"
                >
                  <Heart className="h-5 w-5" />
                  <span>{post.likes}</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-1 text-blue-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                >
                  <MessageSquare className="h-5 w-5" />
                  <span>{comments.length}</span>
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
            avatarUrl="/placeholder.svg?height=40&width=40"
            avatarInitials="CU"
          />
        </div>

        {/* Comments */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Comments ({comments.length})</h3>

          {comments.map((comment) => (
            <div key={comment.id} className="mb-6">
              <CommentCard comment={comment} onReplyClick={() => toggleReplyBox(comment.id)} />

              {comment.replies.length > 0 && (
                <div className="ml-12 mt-4 space-y-4">
                  {comment.replies.map((reply) => (
                    <CommentCard key={reply.id} comment={reply} isReply={true} />
                  ))}
                </div>
              )}

              {comment.showReplyBox && (
                <div className="ml-12 mt-4">
                  <ReplyBox
                    placeholder="Write a reply..."
                    onSubmit={(content) => addReply(comment.id, content)}
                    avatarUrl="/placeholder.svg?height=32&width=32"
                    avatarInitials="CU"
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
                <img src={post.author.avatar || "/placeholder.svg"} alt={post.author.name} className="object-cover" />
              </Avatar>
              <div>
                <p className="font-medium text-lg">{post.author.name}</p>
                <p className="text-sm text-gray-500">{post.author.createdAt}</p>
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
              <Badge variant="outline" className="bg-gray-100 text-gray-800 hover:bg-gray-200 px-3 py-1 rounded-full">
                Student
              </Badge>
              <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-200 px-3 py-1 rounded-full">
                Instructor
              </Badge>
            </div>
          </div>
        </Card>

        <Card className="overflow-hidden border-none shadow-lg">
          <div className="bg-gradient-to-r from-purple-500 to-blue-500 h-2"></div>
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">Related Posts</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3 pb-3 border-b border-gray-100 dark:border-gray-800">
                <div className="w-12 h-12 rounded-md bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center text-white font-bold">
                  H
                </div>
                <div>
                  <p className="font-medium text-sm">Hackathon team for AI project</p>
                  <p className="text-xs text-gray-500">2 days ago</p>
                </div>
              </div>
              <div className="flex items-start gap-3 pb-3 border-b border-gray-100 dark:border-gray-800">
                <div className="w-12 h-12 rounded-md bg-gradient-to-br from-green-400 to-teal-500 flex items-center justify-center text-white font-bold">
                  T
                </div>
                <div>
                  <p className="font-medium text-sm">TensorFlow workshop this weekend</p>
                  <p className="text-xs text-gray-500">1 week ago</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-md bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold">
                  C
                </div>
                <div>
                  <p className="font-medium text-sm">Computer Vision study group</p>
                  <p className="text-xs text-gray-500">2 weeks ago</p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default PostDetails
