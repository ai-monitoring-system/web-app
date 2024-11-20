import React from "react";
import { FaBell, FaCog } from "react-icons/fa";

const HeaderIcons = () => {
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

      {/* Profile Picture */}
      <img
        src="https://via.placeholder.com/40" // Replace with your profile image URL
        alt="Profile"
        className="h-10 w-10 rounded-full object-cover cursor-pointer hover:scale-110 transition-transform"
      />
    </div>
  );
};

export default HeaderIcons;