import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
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
  FaQuestionCircle,
  FaCircle,
  FaVideo as FaStreaming,
  FaPowerOff,
  FaEye,
  FaSearch,
  FaSignOutAlt,
} from "react-icons/fa";
import SidebarButton from "./components/layout/SidebarButton";
import Profile from "./components/dashboard/Profile";
import Settings from "./components/dashboard/Settings";
import VideoStorage from "./components/dashboard/VideoStorage";
import DashboardHome from "./components/dashboard/DashboardHome";
import { useTheme } from './context/ThemeContext';
import { adjustColor } from './utils/colorUtils';
import { useAuth } from './context/AuthContext';
import { LoadingSpinner } from './components/shared/LoadingSpinner';

const DashboardLayout = () => {
  const location = useLocation();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [viewerMode, setViewerMode] = useState(false);
  const [streamerMode, setStreamerMode] = useState(false);

  const { user, logout, authLoading } = useAuth();

  const isStreamer = user?.role === 'streamer';

  const [currentStatus, setCurrentStatus] = useState({ 
    type: 'offline',
    label: 'Offline',
    icon: <FaCircle className="text-gray-400" />,
    description: isStreamer ? 'Not streaming' : 'Not watching'
  });
  const navigate = useNavigate();

  const { themeSettings, toggleDarkMode } = useTheme();

  const handleDarkModeToggle = () => {
    document.body.classList.add('theme-transition');
    document.body.classList.add(themeSettings.darkMode ? 'to-light' : 'to-dark');
    
    toggleDarkMode(!themeSettings.darkMode);
    
    setTimeout(() => {
      document.body.classList.remove('theme-transition');
      document.body.classList.remove('to-light', 'to-dark');
    }, 300);
  };

  useEffect(() => {
    if (isStreamer) {
      if (streamerMode) {
        if (isStreaming) {
          setCurrentStatus({
            type: 'live',
            label: 'Live Streaming',
            icon: <FaStreaming className="text-red-500" />,
            description: 'Currently streaming'
          });
        } else {
          setCurrentStatus({
            type: 'offline',
            label: 'Offline',
            icon: <FaCircle className="text-gray-400" />,
            description: 'Not streaming'
          });
        }
      } else {
        setCurrentStatus({
          type: 'offline',
          label: 'Offline',
          icon: <FaCircle className="text-gray-400" />,
          description: 'Not streaming'
        });
      }
    } else {
      if (viewerMode) {
        setCurrentStatus({
          type: 'watching',
          label: 'Watching Stream',
          icon: <FaEye className="text-green-500" />,
          description: 'Currently watching'
        });
      } else {
        setCurrentStatus({
          type: 'offline',
          label: 'Offline',
          icon: <FaCircle className="text-gray-400" />,
          description: 'Not watching'
        });
      }
    }
  }, [isStreaming, viewerMode, streamerMode, isStreamer]);

  const streamerStatuses = [
    { 
      type: 'live', 
      label: 'Live Streaming', 
      icon: <FaStreaming className="text-red-500" />,
      description: 'Currently streaming'
    },
    { 
      type: 'offline', 
      label: 'Offline', 
      icon: <FaCircle className="text-gray-400" />,
      description: 'Not streaming'
    },
  ];

  const viewerStatuses = [
    { 
      type: 'watching', 
      label: 'Watching Stream', 
      icon: <FaEye className="text-green-500" />,
      description: 'Currently watching'
    },
    { 
      type: 'offline', 
      label: 'Offline', 
      icon: <FaCircle className="text-gray-400" />,
      description: 'Not watching'
    },
  ];

  const statusOptions = isStreamer ? streamerStatuses : viewerStatuses;

  const toggleSidebar = () => setIsSidebarCollapsed(!isSidebarCollapsed);

  const handleHelp = () => {
    window.open('https://github.com/ai-monitoring-system/web-app/blob/main/README.md', '_blank');
  };

  const getSelectedPage = (path) => {
    switch (path) {
      case '/':
        return 'Home';
      case '/videoStorage':
        return 'Video Storage';
      case '/profile':
        return 'Profile';
      case '/settings':
        return 'Settings';
      default:
        return 'Home';
    }
  };

  const selectedPage = getSelectedPage(location.pathname);

  return (
    <div className={`${themeSettings.darkMode ? "dark" : ""}`}>
      <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 animate__animated animate__fadeIn">
        {/* Sidebar */}
        <aside
          className="text-white p-4 shadow-lg transition-all duration-300 ease-in-out"
          style={{
            background: themeSettings.darkMode 
              ? `linear-gradient(to bottom, ${adjustColor(themeSettings.sidebarColor, -40, true)}, ${adjustColor(themeSettings.sidebarColor, -60, true)})`
              : `linear-gradient(to bottom, ${themeSettings.sidebarColor}, ${adjustColor(themeSettings.sidebarColor, -20)})`,
            width: isSidebarCollapsed ? "5rem" : "16rem"
          }}
        >
          <button
            onClick={toggleSidebar}
            className={`flex items-center justify-center mb-6 w-full rounded-md p-2 text-xl transition duration-150 ease-in-out focus:outline-none ${
              themeSettings.darkMode 
                ? 'bg-opacity-20 hover:bg-opacity-30 bg-gray-900' 
                : 'bg-opacity-20 hover:bg-opacity-30 bg-white'
            }`}
            aria-label="Toggle Sidebar"
          >
            <FaBars />
          </button>

          <div className="flex-grow">
            <SidebarButton
              path="/"
              label="Dashboard"
              icon={<FaHome />}
              isSelected={selectedPage === "Dashboard"}
              isCollapsed={isSidebarCollapsed}
            />
            <SidebarButton
              path="/videoStorage"
              label="Video Storage"
              icon={<FaVideo />}
              isSelected={selectedPage === "videoStorage"}
              isCollapsed={isSidebarCollapsed}
            />
            <SidebarButton
              path="/profile"
              label="Profile"
              icon={<FaUser />}
              isSelected={selectedPage === "profile"}
              isCollapsed={isSidebarCollapsed}
            />
            <SidebarButton
              path="/settings"
              label="Settings"
              icon={<FaCog />}
              isSelected={selectedPage === "settings"}
              isCollapsed={isSidebarCollapsed}
            />
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex flex-col flex-grow">
          {/* Header */}
          <header className="bg-white dark:bg-gray-800 shadow-md p-4 flex justify-between items-center relative z-[9999]">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                {selectedPage}
              </h1>
            </div>

            <div className="flex items-center space-x-8 relative">
              {/* Dark Mode Toggle */}
              <button
                onClick={handleDarkModeToggle}
                className="flex items-center space-x-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-100 font-semibold py-2 px-4 rounded-md focus:outline-none"
                aria-label="Toggle Dark Mode"
              >
                {themeSettings.darkMode ? <FaSun /> : <FaMoon />}
                <span>{themeSettings.darkMode ? "Light Mode" : "Dark Mode"}</span>
              </button>
              
              {/* Search Icon */}
              <FaSearch 
                className="text-gray-800 dark:text-gray-300 text-xl cursor-pointer hover:scale-110 transition-transform" 
                onClick={() => {/* Add search functionality */}}
                title="Search"
              />
              
              <FaBell className="text-gray-800 dark:text-gray-300 text-xl cursor-pointer hover:scale-110 transition-transform" title="Notifications" />
              <FaHeart className="text-red-500 text-xl cursor-pointer hover:scale-110 transition-transform" title="Favorites" />
              <FaCog 
                className="text-gray-800 dark:text-gray-300 text-xl cursor-pointer hover:scale-110 transition-transform" 
                onClick={() => navigate('/settings')}
                title="Settings"
              />
              
              <div className="relative">
                {user ? (
                  <img
                    src={user.photoURL || "https://via.placeholder.com/40"}
                    alt={user.displayName || "Profile"}
                    className="h-10 w-10 rounded-full object-cover cursor-pointer hover:scale-110 transition-transform"
                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  />
                ) : (
                  <div 
                    className="h-10 w-10 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center text-gray-800 dark:text-gray-300 text-xl cursor-pointer"
                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  >
                    <FaUser />
                  </div>
                )}

                {/* Profile Dropdown Menu */}
                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-gray-800 rounded-md shadow-md py-1 z-[9999] border border-gray-200 dark:border-gray-700">
                    <div className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200 border-b dark:border-gray-700">
                      Signed in as<br />
                      <span className="font-bold">{user?.displayName || user?.email || "Guest"}</span>
                    </div>
                    
                    <div className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                      <div className="flex items-center">
                        {currentStatus.icon}
                        <div className="ml-2">
                          <div>{currentStatus.label}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {currentStatus.description}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <button onClick={() => navigate('/profile')} className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                      Profile & Account
                    </button>
                    
                    <button className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                      Feedback
                    </button>
                    
                    <div className="border-t dark:border-gray-700">
                      <button onClick={() => navigate('/settings')} className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                        Settings
                      </button>
                      
                      <button 
                        onClick={logout}
                        disabled={authLoading}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 flex items-center"
                      >
                        {authLoading ? (
                          <LoadingSpinner size="sm" />
                        ) : (
                          <>
                            <FaSignOutAlt className="mr-2" />
                            Sign out
                          </>
                        )}
                      </button>
                      
                      <button className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700" onClick={handleHelp}>
                        <div className="flex items-center">
                          <FaQuestionCircle className="mr-2" />
                          Help
                        </div>
                      </button>
                    </div>
                  </div>
                )}
              </div>
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