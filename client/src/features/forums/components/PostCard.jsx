import { Clock, Heart, Share2 } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const PostCard = ({
  timestamp,
  title,
  content,
  author = { name: "Name", role: "Admin" },
  tags,
  likes,
  postId,
  isLoading = false,
}) => {
  // Role badge color mapping
  const roleBadgeColors = {
    student: "bg-blue-100 text-blue-800",
    instructor: "bg-purple-100 text-purple-800",
    admin: "bg-red-100 text-red-800",
  };
  const roleBadgeColor =
    roleBadgeColors[author.role?.toLowerCase()] || roleBadgeColors.student;
    const handleLike = (e) => {
        // your like logic
        toast.success("Liked")
};
  const handleShare = () => {
    const url = `${window.location.origin}/forum/${postId}`;
    navigator.clipboard
      .writeText(url)
      .then(() => {
        toast.success("Share Link copied to clipboard");
      })
      .catch((err) => {
        console.error("Copy failed", err);
        toast.error(" Something went wrong ! Unable to copy link");
      });
  };

  if (isLoading) {
    return <PostCardSkeleton />;
  }
  return (
    <div
      className="max-w-3xl mx-auto overflow-hidden rounded-xl shadow-lg bg-gradient-to-br from-white to-gray-50  border-gray-100 dark:from-gray-800 dark:to-gray-900 
  border dark:border-gray-700 transition-transform duration-300 ease-in-out transform hover:scale-[1.015]"
    >
      {/* Card Header with gradient */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-3"></div>

      <div className="p-6 ">
        {/* Post Header - Time and Role Badge */}
        <div className=" text-gray-500 dark:text-gray-400 flex justify-between items-center mb-3">
          <div className="text-gray-500 text-sm flex items-center">
            <Clock className="h-4 w-4 mr-1 text-blue-500" />
            <span>
              {timestamp || (
                <span className="text-gray-400 italic">
                  No timestamp available
                </span>
              )}
            </span>
          </div>

          {/* Role Badge */}
          <div
            className={`px-3 py-1 rounded-full text-xs font-medium ${roleBadgeColor}`}
          >
            {author.role || "Student"}
          </div>
        </div>

        {/* Post Title */}
    <Link to={`/forum/${postId}`} className="block group">

        <h2 className="text-2xl font-bold text-gray-800 dark:text-white  mb-4 hover:text-blue-600 hover:underline transition-colors">
          {title || (
            <span className="text-gray-400 italic">No Title available</span>
          )}
        </h2>
</Link>
        {/* Post Content */}
        <div className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
          <p>
            {content || (
              <span className="text-gray-400 italic">No content available</span>
            )}
          </p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          {(tags || []).map((tag, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs font-medium rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              {tag || "N/A"}
            </span>
          ))}
        </div>

        {/* Interaction Bar */}
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            {/* <button className="flex items-center space-x-1 text-gray-500 hover:text-red-500 transition-colors"> */}
            <button onClick={handleLike} className="flex items-center space-x-1 text-gray-500 dark:text-gray-300 hover:text-red-500 transition-colors dark:hover:text-red-500 transition-colors">
              <Heart className="h-5 w-5" />
              <span>{likes}</span>
            </button>
          </div>
          <button
            onClick={handleShare}
            className="flex items-center space-x-1 text-gray-500 hover:text-green-500 transition-colors"
          >
            <Share2 className="h-5 w-5" />
            <span>Share</span>
          </button>
        </div>
      </div>
    </div>

  );
};

export default PostCard;

const PostCardSkeleton = () => {
  return (
      <div className="max-w-3xl mx-auto overflow-hidden rounded-xl shadow-lg bg-white border border-gray-100 animate-pulse">
        {/* Card Header with gradient */}
        <div className="bg-gray-200 h-3"></div>
        <div className="bg-gray-200 dark:bg-gray-700 h-3"></div>
        <div className="p-6">
          {/* Post Header - Time and Role Badge */}
          <div className="flex justify-between items-center mb-3">
            <div className="bg-gray-200 h-4 w-24 rounded"></div>
            <div className="bg-gray-200 h-6 w-20 rounded-full"></div>
          </div>

          {/* Post Title */}
          <div className="bg-gray-300 h-8 w-3/4 rounded mb-4"></div>

          {/* Post Content */}
          <div className="space-y-2 mb-6">
            <div className="bg-gray-200 h-4 w-full rounded"></div>
            <div className="bg-gray-200 h-4 w-full rounded"></div>
            <div className="bg-gray-200 h-4 w-2/3 rounded"></div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            <div className="bg-gray-200 h-6 w-16 rounded-full"></div>
            <div className="bg-gray-200 h-6 w-20 rounded-full"></div>
            <div className="bg-gray-200 h-6 w-24 rounded-full"></div>
          </div>

          {/* Interaction Bar */}
          <div className="flex justify-between items-center">
            <div className="bg-gray-200 h-6 w-16 rounded"></div>
            <div className="bg-gray-200 h-6 w-20 rounded"></div>
          </div>
        </div>
      </div>
  );
};
