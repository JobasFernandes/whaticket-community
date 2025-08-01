import React from "react";

const MainContainer = ({ children }) => {
  return (
    <div className="flex-1 h-full pb-2 max-w-none">
      <div className="h-full overflow-hidden flex flex-col bg-white dark:bg-[#1e1e1e] rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
        {children}
      </div>
    </div>
  );
};

export default MainContainer;
