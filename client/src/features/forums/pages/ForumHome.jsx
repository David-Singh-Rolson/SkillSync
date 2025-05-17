// // List all posts

// import React from "react";
// import PostCard from "../components/PostCard";
// import { Tv, MessageSquareDiff } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import {  useNavigate } from "react-router-dom";

// const ForumHome = () => {
//     const navigate = useNavigate();
  
//   const posts = [
//   {
//     _id: "1",
//     timestamp: "8 months ago",
//     title: "Looking for internship to boost my skills",
//     content: "Hello, my name is Mohd Arsh... (same as above)",
//     author: { name: "Mohd Arsh", role: "Student" },
//     tags: ["Data Science", "Web Development", "Internship"],
//     likes: 12,
//   },
//   {
//     _id: "2",
//     timestamp: "2 weeks ago",
//     title: "How to start with MERN stack?",
//     content: "I'm confused where to begin with MERN. Should I go MongoDB first or React?",
//     author: { name: "Ishaan Verma", role: "Admin" },
//     tags: ["MERN", "React", "MongoDB"],
//     likes: 8,
//   },
//   {
//     _id: "3",
//     timestamp: "3 days ago",
//     title: "Important JavaScript topics for interviews",
//     content: "Can someone list down the most important JS topics for placements?",
//     author: { name: "Ritika Sharma", role: "Instructor" },
//     tags: ["JavaScript", "Interview Prep"],
//     likes: 17,
//   },
// ];

//   const handleCreateForum=()=>{
//     navigate("/create/forum")
    
//   }
//   return (
//     <div className="px-6 py-8">
//       {/* button and title */}
//       <div className="flex items-center justify-between mb-2">
//         <div className="flex items-center space-x-3 ">
//           <Tv className="w-9 h-9 text-blue-500 dark:text-blue-400" />
//           <h3 className="text-3xl font-semibold text-gray-800 dark:text-white tracking-wide">
//             Forum
//           </h3>
//         </div>
//         <Button onClick={handleCreateForum} className="flex items-center space-x-2">
//           <MessageSquareDiff className="w-5 h-5" />
//           <span>Create Forum</span>
//         </Button>
//       </div>
//       <p className="text-gray-600 dark:text-gray-300 text-sm mb-6">
//         Share your doubts, ideas, and experiences. Students, teachers & admins
//         can all participate!
//       </p>
//       <div>

//       </div>
      
//       <div className="m-5 space-y-6">
//         {(posts || []).map((post,index)=>{
//           return <PostCard key={post._id} postId={post._id} {...post}/>
//         })}
//       </div>
//     </div>
//   );
// };

// export default ForumHome;

"use client"

import { useState, useEffect } from "react"
import ForumFilter from "../components/ForumFilter"
import PostCard from "../components/PostCard"
import { Tv, MessageSquareDiff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"

const ForumHome = () => {
  const navigate = useNavigate()

  const initialPosts = [
    {
      _id: "1",
      timestamp: "8 months ago",
      title: "Looking for internship to boost my skills",
      content: "Hello, my name is Mohd Arsh... (same as above)",
      author: { name: "Mohd Arsh", role: "Student" },
      tags: ["Data Science", "Web Development", "Internship"],
      likes: 12,
    },
    {
      _id: "2",
      timestamp: "2 weeks ago",
      title: "How to start with MERN stack?",
      content: "I'm confused where to begin with MERN. Should I go MongoDB first or React?",
      author: { name: "Ishaan Verma", role: "Admin" },
      tags: ["MERN", "React", "MongoDB"],
      likes: 8,
    },
    {
      _id: "3",
      timestamp: "3 days ago",
      title: "Important JavaScript topics for interviews",
      content: "Can someone list down the most important JS topics for placements?",
      author: { name: "Ritika Sharma", role: "Instructor" },
      tags: ["JavaScript", "Interview Prep"],
      likes: 17,
    },
  ]

  const [posts, setPosts] = useState(initialPosts)
  const [filters, setFilters] = useState({
    roles: [],
    timeSort: "newest",
  })

  // Apply filters whenever they change
  useEffect(() => {
    let filteredPosts = [...initialPosts]

    // Filter by roles if any are selected
    if (filters.roles.length > 0) {
      filteredPosts = filteredPosts.filter((post) => filters.roles.includes(post.author.role))
    }

    // Sort by time
    filteredPosts.sort((a, b) => {
      const timeMap = {
        "3 days ago": 3,
        "2 weeks ago": 14,
        "8 months ago": 240,
      }

      const timeA = timeMap[a.timestamp ] || 0
      const timeB = timeMap[b.timestamp ] || 0

      return filters.timeSort === "newest" ? timeA - timeB : timeB - timeA
    })

    setPosts(filteredPosts)
  }, [filters])

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters)
  }

  const handleCreateForum = () => {
    navigate("/create/forum")
  }

  return (
    <div className="px-6 py-8">
      {/* button and title */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-3 ">
          <Tv className="w-9 h-9 text-blue-500 dark:text-blue-400" />
          <h3 className="text-3xl font-semibold text-gray-800 dark:text-white tracking-wide">Forum</h3>
        </div>
        <Button onClick={handleCreateForum} className="flex items-center space-x-2">
          <MessageSquareDiff className="w-5 h-5" />
          <span>Create Forum</span>
        </Button>
      </div>
      <p className="text-gray-600 dark:text-gray-300 text-sm mb-6">
        Share your doubts, ideas, and experiences. Students, teachers & admins can all participate!
      </p>

      <div className="flex flex-col lg:flex-row gap-6 ml-5">
        {/* Filter panel */}
        <div className="w-full lg:w-64">
          <ForumFilter onFilterChange={handleFilterChange} />
        </div>

        {/* Posts list */}
        <div className="flex-1 space-y-6">
          {posts.length > 0 ? (
            posts.map((post) => <PostCard key={post._id} postId={post._id} {...post} />)
          ) : (
            <div className="text-center py-10 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-gray-500 dark:text-gray-400">No posts match your filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ForumHome

