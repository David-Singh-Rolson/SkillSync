import { useState, useEffect } from "react"
import ForumFilter from "../components/ForumFilter"
import PostCard from "../components/PostCard"
import { Tv, MessageSquareDiff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import { useGetAllPostsQuery } from "../api/forumApi"
import { PostCardSkeleton } from "../components/SkeletonTemplate"

const ForumHome = () => {
  const navigate = useNavigate()
  const {
    data: postData,
    isSuccess: fetchedPosts,
    isError: postError,
    isLoading: fetchingPosts,
  } = useGetAllPostsQuery()

  const [posts, setPosts] = useState([])

  const [filters, setFilters] = useState({
    roles: [], // ["student", "instructor", "admin"]
    timeSort: "newest", // or "oldest"
  })

  // Apply filters & sort whenever postData or filters change
  useEffect(() => {
    if (fetchedPosts && postData?.posts?.length > 0) {
      let filtered = [...postData.posts]

      // Filter by selected roles
      if (filters.roles.length > 0) {
        filtered = filtered.filter(post =>
  filters.roles.map(r => r.toLowerCase()).includes(post.role?.toLowerCase())
)
      }

      // Sort by creation time
      filtered.sort((a, b) => {
        const dateA = new Date(a.createdAt)
        const dateB = new Date(b.createdAt)

        return filters.timeSort === "newest"
          ? dateB - dateA
          : dateA - dateB
      })

      setPosts(filtered)
    }
  }, [fetchedPosts, postData, filters])

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters)
  }

  const handleCreateForum = () => {
    navigate("/create/forum")
  }

  return (
    <div className="px-6 py-8">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-3">
          <Tv className="w-9 h-9 text-blue-500 dark:text-blue-400" />
          <h3 className="text-3xl font-semibold text-gray-800 dark:text-white tracking-wide">
            Forum
          </h3>
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
        <div className="w-full lg:w-64">
          <ForumFilter onFilterChange={handleFilterChange} />
        </div>

        <div className="flex-1 space-y-6">
          {fetchingPosts ? (
            <PostCardSkeleton/>
          ) : postError ? (
            <p className="text-red-500 dark:text-red-400">Failed to load posts.</p>
          ) : posts.length > 0 ? (
            posts.map((post) => <PostCard key={post._id}  {...post} />)
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
