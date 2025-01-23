import React from "react";
import HeaderIcons from "./HeaderIcons";

const Header = () => {
  return (
    <header className="flex justify-between items-center p-4 bg-gray-100 dark:bg-gray-800">
      {/* Left side: Dark Mode Toggle */}
      <div className="flex items-center">
        <label htmlFor="darkModeToggle" className="mr-2 text-gray-600 dark:text-gray-300">
          Dark Mode
        </label>
        <input
          type="checkbox"
          id="darkModeToggle"
          className="cursor-pointer"
          onChange={() => {
            document.documentElement.classList.toggle("dark");
          }}
        />
      </div>

      {/* Right side: Icons */}
      <HeaderIcons />
    </header>
  );
};

export default Header;