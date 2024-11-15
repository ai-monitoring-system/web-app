import React, { useState } from "react";
import { FaUser, FaCog, FaVideo, FaHome, FaBars, FaMoon, FaSun } from "react-icons/fa";
import "animate.css";
import "./animations.css";
import SidebarButton from "./components/SidebarButton";
import Profile from "./components/Profile";
import Settings from "./components/Settings";
import VideoStorage from "./components/VideoStorage";
import DashboardHome from "./components/DashboardHome";

const App = () => {
  const [selectedPage, setSelectedPage] = useState("home");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true" // Load user preference
  );

  const toggleSidebar = () => setIsSidebarCollapsed(!isSidebarCollapsed);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    localStorage.setItem("darkMode", !darkMode); // Save preference
  };

  return (
    <div className={`${darkMode ? "dark" : ""}`}>
      <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 animate__animated animate__fadeIn">
        {/* Collapsible Sidebar */}
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
              page="home"
              label="Dashboard"
              icon={<FaHome />}
              onClick={() => setSelectedPage("home")}
              isSelected={selectedPage === "home"}
              isCollapsed={isSidebarCollapsed}
            />
            <SidebarButton
              page="videoStorage"
              label="Video Storage"
              icon={<FaVideo />}
              onClick={() => setSelectedPage("videoStorage")}
              isSelected={selectedPage === "videoStorage"}
              isCollapsed={isSidebarCollapsed}
            />
            <SidebarButton
              page="profile"
              label="Profile"
              icon={<FaUser />}
              onClick={() => setSelectedPage("profile")}
              isSelected={selectedPage === "profile"}
              isCollapsed={isSidebarCollapsed}
            />
            <SidebarButton
              page="settings"
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
            <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
              {selectedPage.charAt(0).toUpperCase() + selectedPage.slice(1)}
            </h1>
            <button
              onClick={toggleDarkMode}
              className="flex items-center space-x-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-100 font-semibold py-2 px-4 rounded-md focus:outline-none"
              aria-label="Toggle Dark Mode"
            >
              {darkMode ? <FaSun /> : <FaMoon />}
              <span>{darkMode ? "Light Mode" : "Dark Mode"}</span>
            </button>
          </header>

          {/* Main View */}
          <main className="flex-grow p-6 animate__animated animate__fadeIn">
            {selectedPage === "home" && <DashboardHome />}
            {selectedPage === "videoStorage" && <VideoStorage />}
            {selectedPage === "profile" && <Profile />}
            {selectedPage === "settings" && <Settings />}
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

export default App;