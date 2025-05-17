"use client"

import { useState } from "react"
import { Heart, MessageSquare, MoreHorizontal } from "lucide-react"
import { Avatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

const CommentCard = ({ comment, onReplyClick, isReply = false }) => {
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(comment.likes || 0)

  const handleLike = () => {
    if (liked) {
      setLikeCount(likeCount - 1)
    } else {
      setLikeCount(likeCount + 1)
    }
    setLiked(!liked)
  }

  return (
    <Card
      className={`border-none shadow-md hover:shadow-lg transition-shadow duration-300 ${isReply ? "bg-gray-50 dark:bg-gray-900" : ""}`}
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          <Avatar className={`${isReply ? "h-8 w-8" : "h-10 w-10"} ring-2 ring-purple-100 dark:ring-purple-900`}>
            {comment.author.avatar ? (
              <img
                src={comment.author.avatar || "/placeholder.svg"}
                alt={comment.author.name}
                className="object-cover"
              />
            ) : (
              <div className="bg-purple-200 text-purple-800 dark:bg-purple-900 dark:text-purple-200 w-full h-full flex items-center justify-center font-semibold">
                {comment.author.initials}
              </div>
            )}
          </Avatar>

          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <h4 className={`font-semibold ${isReply ? "text-sm" : "text-base"}`}>{comment.author.name}</h4>
                <p className="text-xs text-gray-500">{comment.createdAt}</p>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>

            {comment.content && (
              <p className={`mt-2 text-gray-700 dark:text-gray-300 ${isReply ? "text-sm" : ""}`}>{comment.content}</p>
            )}

            {comment.details && comment.details.length > 0 && (
              <div className="mt-2 space-y-1">
                {comment.details.map((detail, index) => (
                  <p key={index} className="text-gray-700 dark:text-gray-300">
                    {detail.includes("@") ? (
                      <a href={`mailto:${detail}`} className="text-blue-500 hover:underline">
                        {detail}
                      </a>
                    ) : (
                      detail
                    )}
                  </p>
                ))}
              </div>
            )}

            <div className="flex items-center gap-2 mt-3">
              <Button
                variant="ghost"
                size="sm"
                className={`flex items-center gap-1 text-xs px-2 py-1 h-auto ${
                  liked
                    ? "text-rose-500 bg-rose-50 dark:bg-rose-900/20"
                    : "text-gray-500 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20"
                }`}
                onClick={handleLike}
              >
                <Heart className="h-3.5 w-3.5" fill={liked ? "currentColor" : "none"} />
                <span>{likeCount}</span>
              </Button>

              {!isReply && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-1 text-xs px-2 py-1 h-auto text-gray-500 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                  onClick={onReplyClick}
                >
                  <MessageSquare className="h-3.5 w-3.5" />
                  <span>Reply</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}

export default CommentCard
