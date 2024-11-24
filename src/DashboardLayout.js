import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import {
  FaCog,
  FaHeart,
  FaVideo,
  FaHome,
  FaBars,
  FaMoon,
  FaSun,
  FaBell,
  FaUser,
} from "react-icons/fa";
import SidebarButton from "./components/layout/SidebarButton";
import Profile from "./components/dashboard/Profile";
import Settings from "./components/dashboard/Settings";
import VideoStorage from "./components/dashboard/VideoStorage";
import DashboardHome from "./components/dashboard/DashboardHome";

const DashboardLayout = ({ user, darkMode, toggleDarkMode }) => {
  const [selectedPage, setSelectedPage] = useState("home");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => setIsSidebarCollapsed(!isSidebarCollapsed);

  return (
    <div className={`${darkMode ? "dark" : ""}`}>
      <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 animate__animated animate__fadeIn">
        {/* Sidebar */}
        <aside
          className={`bg-gradient-to-b from-blue-800 to-blue-600 dark:from-gray-800 dark:to-gray-700 text-white p-4 shadow-lg transition-all duration-300 ease-in-out ${
            isSidebarCollapsed ? "w-20" : "w-64"
          }`}
        >
          <button
            onClick={toggleSidebar}
            className="flex items-center justify-center mb-6 w-full bg-blue-700 dark:bg-gray-700 rounded-md p-2 text-xl transition duration-150 ease-in-out hover:bg-blue-800 dark:hover:bg-gray-600 focus:outline-none"
            aria-label="Toggle Sidebar"
          >
            <FaBars />
          </button>

          <div className="flex-grow">
            <SidebarButton
              path="/"
              label="Dashboard"
              icon={<FaHome />}
              onClick={() => setSelectedPage("home")}
              isSelected={selectedPage === "home"}
              isCollapsed={isSidebarCollapsed}
            />
            <SidebarButton
              path="/videoStorage"
              label="Video Storage"
              icon={<FaVideo />}
              onClick={() => setSelectedPage("videoStorage")}
              isSelected={selectedPage === "videoStorage"}
              isCollapsed={isSidebarCollapsed}
            />
            <SidebarButton
              path="/profile"
              label="Profile"
              icon={<FaUser />}
              onClick={() => setSelectedPage("profile")}
              isSelected={selectedPage === "profile"}
              isCollapsed={isSidebarCollapsed}
            />
            <SidebarButton
              path="/settings"
              label="Settings"
              icon={<FaCog />}
              onClick={() => setSelectedPage("settings")}
              isSelected={selectedPage === "settings"}
              isCollapsed={isSidebarCollapsed}
            />
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex flex-col flex-grow">
          {/* Header */}
          <header className="bg-white dark:bg-gray-800 shadow-md p-4 flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                {selectedPage.charAt(0).toUpperCase() + selectedPage.slice(1)}
              </h1>
            </div>

            <div className="flex items-center space-x-8">
              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className="flex items-center space-x-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-100 font-semibold py-2 px-4 rounded-md focus:outline-none"
                aria-label="Toggle Dark Mode"
              >
                {darkMode ? <FaSun /> : <FaMoon />}
                <span>{darkMode ? "Light Mode" : "Dark Mode"}</span>
              </button>
              <FaBell className="text-gray-800 dark:text-gray-300 text-xl cursor-pointer hover:scale-110 transition-transform" />
              <FaHeart className="text-red-500 text-xl cursor-pointer hover:scale-110 transition-transform" />
              <FaCog className="text-gray-800 dark:text-gray-300 text-xl cursor-pointer hover:scale-110 transition-transform" />
              {user ? (
                <img
                  src={user.photoURL || "https://via.placeholder.com/40"}
                  alt={user.displayName || "Profile"}
                  className="h-10 w-10 rounded-full object-cover cursor-pointer hover:scale-110 transition-transform"
                />
              ) : (
                <div className="h-10 w-10 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center text-gray-800 dark:text-gray-300 text-xl">
                  <FaUser />
                </div>
              )}
            </div>
          </header>

          {/* Main Content Routes */}
          <main className="flex-grow p-6 animate__animated animate__fadeIn">
            <Routes>
              <Route path="/" element={<DashboardHome />} />
              <Route path="/videoStorage" element={<VideoStorage />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </main>

          {/* Footer */}
          <footer className="text-center text-gray-500 text-sm py-4 opacity-0 animate__animated animate__fadeIn animate__delay-1s">
            &copy; {new Date().getFullYear()} AI Monitoring System
          </footer>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;