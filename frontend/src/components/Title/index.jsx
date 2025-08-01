import React from "react";

export default function Title({ children, className = "" }) {
  return (
    <h1
      className={`text-xl ml-4 font-semibold text-gray-900 dark:text-white ${className}`}
    >
      {children}
    </h1>
  );
}
