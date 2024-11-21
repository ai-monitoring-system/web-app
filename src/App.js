import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
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
import "animate.css";
import "./animations.css";
import SidebarButton from "./components/SidebarButton";
import Profile from "./components/Profile";
import Settings from "./components/Settings";
import VideoStorage from "./components/VideoStorage";
import DashboardHome from "./components/DashboardHome";
import SignIn from "./components/SignIn"; // Import SignIn component
import SignUp from "./components/SignUp"; // Import SignUp component
import { auth } from "./config"; // Import Firebase auth object
import { onAuthStateChanged } from "firebase/auth";


const App = () => {
  const [selectedPage, setSelectedPage] = useState("home");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true" // Load user preference
  );
  const [user, setUser] = useState(null); // Track the authenticated user

  useEffect(() => {
    // Monitor the authentication state
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser); // Update the user state when auth state changes
    });

    // Cleanup subscription on component unmount
    return () => unsubscribe();
  }, []);

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
              icon={<FaUser />} // Restored icon for Profile
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

              {/* Notification Bell */}
              <FaBell className="text-gray-800 dark:text-gray-300 text-xl cursor-pointer hover:scale-110 transition-transform" />

              {/* Heart Icon */}
              <FaHeart className="text-red-500 text-xl cursor-pointer hover:scale-110 transition-transform" />

              {/* Gear/Settings Icon */}
              <FaCog className="text-gray-800 dark:text-gray-300 text-xl cursor-pointer hover:scale-110 transition-transform" />

              {/* Profile Placeholder or Image */}
              {user ? (
                <img
                  src={user.photoURL || "https://via.placeholder.com/40"} // Fallback to placeholder
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