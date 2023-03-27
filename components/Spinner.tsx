import React from "react";

function LoadingSpinner() {
  return (
    <div
      className="w-12 h-12 rounded-full animate-spin
            border border-solid border-red-700 border-t-transparent shadow-md"
    ></div>
  );
}

export default LoadingSpinner;
