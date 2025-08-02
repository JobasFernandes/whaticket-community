import React from "react";

const TicketsSkeleton = () => {
  const SkeletonItem = () => (
    <div className="relative">
      <div className="relative flex items-center px-3 py-2 border-l-4 border-l-transparent">
        {/* Avatar skeleton */}
        <div className="flex-shrink-0 mr-3 relative">
          <div className="w-8 h-8 bg-gray-200 dark:bg-gray-600 rounded-full animate-pulse"></div>
          {/* Badge skeleton occasionally */}
          {Math.random() > 0.7 && (
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-gray-300 dark:bg-gray-500 rounded-full animate-pulse"></div>
          )}
        </div>

        {/* Content skeleton */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded animate-pulse w-24"></div>
            <div className="flex items-center gap-2 flex-shrink-0">
              {/* Status badge skeleton */}
              {Math.random() > 0.6 && (
                <div className="h-5 bg-gray-200 dark:bg-gray-600 rounded animate-pulse w-16"></div>
              )}
              {/* Button skeleton */}
              {Math.random() > 0.7 && (
                <div className="h-6 bg-gray-200 dark:bg-gray-600 rounded animate-pulse w-14"></div>
              )}
              {/* Time skeleton */}
              <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded animate-pulse w-10"></div>
            </div>
          </div>

          {/* Message and footer */}
          <div className="flex items-center justify-between mt-1">
            <div className="flex-1 min-w-0">
              <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded animate-pulse w-36"></div>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              {/* Accept button skeleton for pending */}
              {Math.random() > 0.8 && (
                <div className="h-6 bg-gray-200 dark:bg-gray-600 rounded animate-pulse w-12"></div>
              )}
              {/* Queue badge skeleton */}
              {Math.random() > 0.5 && (
                <div className="h-5 bg-gray-200 dark:bg-gray-600 rounded animate-pulse w-12"></div>
              )}
              {/* Connection badge skeleton */}
              {Math.random() > 0.4 && (
                <div className="h-5 bg-gray-200 dark:bg-gray-600 rounded animate-pulse w-16"></div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-b border-gray-200 dark:border-gray-600 ml-11" />
    </div>
  );

  return (
    <>
      <SkeletonItem />
      <SkeletonItem />
      <SkeletonItem />
      <SkeletonItem />
      <SkeletonItem />
    </>
  );
};

export default TicketsSkeleton;
