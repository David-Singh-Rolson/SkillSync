
export const  PostCardSkeleton = () => {
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

          {/* Post PostTitle */}
          <div className="bg-gray-300 h-8 w-3/4 rounded mb-4"></div>

          {/* Post PostContent */}
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
