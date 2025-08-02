import React from "react";

const TableRowSkeleton = ({ avatar, columns }) => {
  return (
    <tr className="border-b border-gray-200 dark:border-gray-700">
      {avatar && (
        <>
          {/* Avatar - hidden on mobile */}
          <td className="hidden md:table-cell px-4 py-2">
            <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
          </td>
          {/* Name with avatar on mobile */}
          <td className="px-4 py-2">
            <div className="flex items-center gap-3 md:block">
              {/* Avatar on mobile */}
              <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse md:hidden flex-shrink-0"></div>
              <div className="flex-1 min-w-0 space-y-2">
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-20"></div>
                {/* Contact info on mobile */}
                <div className="md:hidden space-y-1">
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-24"></div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-32"></div>
                </div>
              </div>
            </div>
          </td>
        </>
      )}
      {/* Desktop columns - hidden on mobile */}
      {Array.from({ length: columns }, (_, index) => (
        <td key={index} className="hidden md:table-cell px-4 py-2 text-center">
          <div className="flex items-center justify-center">
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-16"></div>
          </div>
        </td>
      ))}
      {/* Actions column - always visible */}
      <td className="px-4 py-2 text-center">
        <div className="flex items-center justify-center gap-1">
          <div className="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          <div className="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          <div className="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        </div>
      </td>
    </tr>
  );
};

export default TableRowSkeleton;
