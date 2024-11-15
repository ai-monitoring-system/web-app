import React, { useState } from "react";
import { FaUser, FaCog, FaVideo, FaHome, FaBars } from "react-icons/fa";
import "animate.css"; // Import animate.css for animations
import "./animations.css"; // Import custom animations
import SidebarButton from "./components/SidebarButton";
import Profile from "./components/Profile";
import Settings from "./components/Settings";
import VideoStorage from "./components/VideoStorage";
import DashboardHome from "./components/DashboardHome";

const App = () => {
  const [selectedPage, setSelectedPage] = useState("home");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => setIsSidebarCollapsed(!isSidebarCollapsed);

  const renderSidebarButton = ({ page, label, icon }) => (
    <SidebarButton
      onClick={() => setSelectedPage(page)}
      isSelected={selectedPage === page}
      isCollapsed={isSidebarCollapsed}
      icon={icon}
      label={label}
    />
  );

  return (
<div className="flex min-h-screen bg-gray-100 animate__animated animate__fadeIn">
      {/* Collapsible Sidebar */}
      <aside
        className={`bg-gradient-to-b from-blue-800 to-blue-600 text-white p-4 shadow-lg transition-all duration-300 ease-in-out ${
          // Toggle sidebar width based on state
          isSidebarCollapsed? "w-20" : "w-64"
        }`}
      >
        {/* Toggle Sidebar Button */}
        <button
          onClick={toggleSidebar}
          className="flex items-center justify-center mb-6 w-full bg-blue-700 rounded-md p-2 text-xl transition duration-150 ease-in-out hover:bg-blue-800 focus:outline-none"
          aria-label="Toggle Sidebar"
        >
          <FaBars />
        </button>

        <div className="flex-grow">
          {renderSidebarButton({
            page: "home",
            label: "Dashboard",
            icon: <FaHome />,
          })}
          {renderSidebarButton({
            page: "videoStorage",
            label: "Video Storage",
            icon: <FaVideo />,
          })}
          {renderSidebarButton({
            page: "profile",
            label: "Profile",
            icon: <FaUser />,
          })}
          {renderSidebarButton({
            page: "settings",
            label: "Settings",
            icon: <FaCog />,
          })}
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-col flex-grow">
        {/* Header */}
        <header className="bg-white shadow-md p-4">
          <h1 className="text-xl font-semibold text-gray-800">
            {selectedPage.charAt(0).toUpperCase() + selectedPage.slice(1)}
          </h1>
        </header>

        {/* Main View */}
        <main className="flex-grow p-6 animate__animated animate__fadeIn">
          {selectedPage === "home" && <DashboardHome />}
          {selectedPage === "videoStorage" && <VideoStorage />}
          {selectedPage === "profile" && <Profile />}
          {selectedPage === "settings" && <Settings />}
        </main>

        {/* Footer Integrated into Main Content */}
        <div className="text-center text-gray-500 text-sm py-4 opacity-0 animate__animated animate__fadeIn animate__delay-1s">
          &copy; {new Date().getFullYear()} AI Monitoring System
        </div>
      </div>
    </div>
  );
};

export default App;
