import React from "react";

const InternalError = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100">
      <h1 className="text-6xl font-bold mb-4">500</h1>
      <p className="text-lg mb-8">Something went wrong. Please try again later.</p>
      <a
        href="/"
        className="bg-red-600 text-white py-2 px-4 rounded-md shadow-md hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600"
      >
        Refresh Page
      </a>
    </div>
  );
};

export default InternalError;