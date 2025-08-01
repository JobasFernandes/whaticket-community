import React from "react";

const MainHeaderButtonsWrapper = ({ children }) => {
  return (
    <div className="flex items-center justify-center md:justify-end gap-2 w-full md:w-auto md:ml-auto">
      {children}
    </div>
  );
};

export default MainHeaderButtonsWrapper;
