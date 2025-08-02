import React from "react";

const TicketHeaderSkeleton = () => {
  return (
    <div className="flex items-center bg-white dark:bg-[#1e1e1e] border-b border-gray-200 dark:border-gray-700 px-2 py-3 flex-shrink-0 max-h-[61px]">
      {/* Back button skeleton (TicketHeader) */}
      <div className="w-8 h-8 bg-gray-200 dark:bg-gray-600 rounded-lg animate-pulse mr-1"></div>

      {/* TicketInfo skeleton */}
      <div className="flex items-center rounded-lg px-1 py-1 max-h-[47px] flex-1">
        {/* Avatar skeleton */}
        <div className="flex-shrink-0 mr-2">
          <div className="w-8 h-8 bg-gray-200 dark:bg-gray-600 rounded-full animate-pulse"></div>
        </div>

        {/* Contact Info skeleton */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <div className="h-3.5 w-20 bg-gray-200 dark:bg-gray-600 rounded animate-pulse"></div>
            <div className="h-3 w-8 bg-gray-200 dark:bg-gray-600 rounded animate-pulse"></div>
          </div>
          {/* Assigned user skeleton (sometimes) */}
          {Math.random() > 0.5 && (
            <div className="h-3 w-24 bg-gray-200 dark:bg-gray-600 rounded animate-pulse"></div>
          )}
        </div>
      </div>

      {/* TicketActionButtons skeleton */}
      <div className="flex items-center gap-2 ml-auto">
        {/* Primary action button skeleton */}
        <div className="h-8 w-16 bg-gray-200 dark:bg-gray-600 rounded-lg animate-pulse"></div>

        {/* Secondary action button skeleton (sometimes) */}
        {Math.random() > 0.6 && (
          <div className="h-8 w-20 bg-gray-200 dark:bg-gray-600 rounded-lg animate-pulse"></div>
        )}

        {/* Menu button skeleton (sometimes) */}
        {Math.random() > 0.7 && (
          <div className="w-8 h-8 bg-gray-200 dark:bg-gray-600 rounded-lg animate-pulse"></div>
        )}
      </div>
    </div>
  );
};

export default TicketHeaderSkeleton;
