const SkeletonLoader = ({ count = 6, columns = 3 }) => {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${columns} gap-6`}>
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className="bg-white rounded-xl border border-gray-300 overflow-hidden animate-pulse">
          {/* Image Skeleton */}
          <div className="aspect-square bg-gray-200"></div>

          {/* Content Skeleton */}
          <div className="p-4 space-y-3">
            {/* Brand */}
            <div className="h-3 bg-gray-200 rounded w-20"></div>

            {/* Title */}
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>

            {/* Model */}
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>

            {/* Features Box */}
            <div className="bg-gray-100 p-3 rounded-lg space-y-2">
              <div className="h-3 bg-gray-200 rounded w-full"></div>
              <div className="h-3 bg-gray-200 rounded w-5/6"></div>
              <div className="h-3 bg-gray-200 rounded w-4/5"></div>
              <div className="h-3 bg-gray-200 rounded w-3/4"></div>
            </div>

            {/* Feature Tags */}
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-6 bg-gray-200 rounded w-16"></div>
              ))}
            </div>

            {/* Stock Status */}
            <div className="h-3 bg-gray-200 rounded w-24"></div>

            {/* Price */}
            <div className="space-y-1">
              <div className="h-6 bg-gray-200 rounded w-1/3"></div>
            </div>

            {/* Buttons */}
            <div className="flex gap-2 pt-2">
              <div className="h-10 bg-gray-200 rounded flex-1"></div>
              <div className="h-10 bg-gray-200 rounded flex-1"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SkeletonLoader;
