import React from "react";

const MainHeader = ({ children }) => {
  return (
    <div className="flex items-center justify-center md:justify-between px-2 py-3 bg-white dark:bg-[#1e1e1e] border-b border-gray-200 dark:border-gray-700 rounded-t-xl">
      {children}
    </div>
  );
};

export default MainHeader;
