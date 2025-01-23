import React, { useState } from "react";
import { FaBell, FaCog, FaUser } from "react-icons/fa";

const HeaderIcons = ({ user }) => {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="flex items-center space-x-6">
      {/* Bell Icon with Badge */}
      <div className="relative">
        <FaBell className="text-gray-600 dark:text-gray-300 text-xl cursor-pointer hover:scale-110 transition-transform" />
        <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
          5
        </span>
      </div>

      {/* Gear/Settings Icon */}
      <FaCog className="text-gray-600 dark:text-gray-300 text-xl cursor-pointer hover:scale-110 transition-transform" />

      {/* Profile Picture or Fallback */}
      {user && !imageError ? (
        <img
          src={user.photoURL ? user.photoURL : "https://via.placeholder.com/40"} // Use Google photoURL
          alt={user.displayName || "Profile"}
          className="h-10 w-10 rounded-full object-cover cursor-pointer hover:scale-110 transition-transform"
          onError={() => setImageError(true)} // Fallback on error
        />
      ) : (
        <div className="h-10 w-10 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center text-gray-800 dark:text-gray-300 text-xl">
          <FaUser />
        </div>
      )}
    </div>
  );
};

export default HeaderIcons;