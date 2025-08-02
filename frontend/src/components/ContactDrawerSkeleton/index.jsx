import React from "react";
import { i18n } from "../../translate/i18n.js";

const ContactDrawerSkeleton = () => {
  return (
    <div className="flex flex-col h-full overflow-y-auto bg-gray-50 dark:bg-gray-800">
      {/* Contact Info Card Skeleton */}
      <div className="bg-white dark:bg-gray-900 m-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col items-center p-6 space-y-4">
          {/* Avatar Skeleton */}
          <div className="w-40 h-40 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse ring-4 ring-gray-100 dark:ring-gray-700"></div>

          {/* Name Skeleton */}
          <div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>

          {/* Phone Skeleton */}
          <div className="h-5 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>

          {/* Button Skeleton */}
          <div className="h-10 w-20 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
        </div>
      </div>

      {/* Extra Info Section Skeleton */}
      <div className="bg-white dark:bg-gray-900 m-4 mt-0 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-4">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white uppercase tracking-wide mb-4">
            {i18n.t("contactDrawer.extraInfo")}
          </h4>

          <div className="space-y-3">
            {/* Skeleton Info Items */}
            {[1, 2, 3].map(item => (
              <div
                key={item}
                className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700"
              >
                <div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded mb-2 animate-pulse"></div>
                <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactDrawerSkeleton;
