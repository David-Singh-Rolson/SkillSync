"use client"

import { useState } from "react"
import { Send } from "lucide-react"
import { Avatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

const ReplyBox = ({ placeholder, onSubmit, avatarUrl, avatarInitials, isReply = false }) => {
  const [content, setContent] = useState("")
  const [isFocused, setIsFocused] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (content.trim()) {
      onSubmit(content)
      setContent("")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-3 w-full">
      <Avatar className={`${isReply ? "h-8 w-8" : "h-10 w-10"} ring-2 ring-purple-100 dark:ring-purple-900`}>
        {avatarUrl ? (
          <img src={avatarUrl || "/placeholder.svg"} alt="Your avatar" className="object-cover" />
        ) : (
          <div className="bg-purple-200 text-purple-800 dark:bg-purple-900 dark:text-purple-200 w-full h-full flex items-center justify-center font-semibold">
            {avatarInitials}
          </div>
        )}
      </Avatar>

      <div className="flex-1 relative">
        <div
          className={`border rounded-lg overflow-hidden transition-all duration-200 ${
            isFocused
              ? "ring-2 ring-purple-200 dark:ring-purple-800 border-transparent"
              : "border-gray-200 dark:border-gray-700"
          }`}
        >
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={placeholder}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="w-full p-3 pr-12 focus:outline-none resize-none bg-transparent text-gray-800 dark:text-gray-200"
            rows={isReply ? 2 : 3}
          />

          <div className="flex justify-between items-center px-3 py-2 bg-gray-50 dark:bg-gray-900">
            <div className="flex gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 p-1 h-auto"
                onClick={() => setContent(content + "😊")}
              >
                😊
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 p-1 h-auto"
                onClick={() => setContent(content + "👍")}
              >
                👍
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 p-1 h-auto"
                onClick={() => setContent(content + "🎉")}
              >
                🎉
              </Button>
            </div>

            <Button
              type="submit"
              size="sm"
              className={`rounded-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-4 ${
                !content.trim() ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={!content.trim()}
            >
              <Send className="h-4 w-4 mr-1" />
              {isReply ? "Reply" : "Post"}
            </Button>
          </div>
        </div>
      </div>
    </form>
  )
}

export default ReplyBox
