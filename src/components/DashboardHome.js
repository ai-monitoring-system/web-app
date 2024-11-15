import React, { useState, useEffect } from "react";
import Streamer from "../Streamer";
import Viewer from "../Viewer";
import { FaVideo, FaEye, FaChartLine } from "react-icons/fa";
import { useInView } from "react-intersection-observer";

const DashboardHome = () => {
  const [mode, setMode] = useState(null);

  // Scroll animations for sections
  const { ref: heroRef, inView: heroInView } = useInView({ triggerOnce: true, threshold: 0.2 });
  const { ref: statsRef, inView: statsInView } = useInView({ triggerOnce: true, threshold: 0.1 });

  useEffect(() => {
    // Cleanup logic to ensure resources are released when switching modes
    return () => {
      if (mode) {
        console.log(`Cleaning up resources for mode: ${mode}`);
        // Call specific cleanup functions for Streamer or Viewer if needed
      }
    };
  }, [mode]);

  const renderQuickActionCard = ({ modeType, title, description, color, Icon }) => (
    <div
      onClick={() => setMode(modeType)}
      className={`flex flex-col items-center justify-center p-6 border rounded-lg shadow-md cursor-pointer ${color} hover:shadow-lg transition duration-200 ease-in-out transform hover:scale-105`}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && setMode(modeType)}
    >
      <Icon className="text-4xl mb-4" />
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      <p className="text-sm text-gray-700 dark:text-gray-300 text-center">{description}</p>
    </div>
  );

  return (
    <div className="p-6 space-y-8 animate__animated animate__fadeInUp">
      {/* Hero Section */}
      <section
        ref={heroRef}
        className={`bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 text-center transition-all duration-500 ${heroInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
      >
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">
          Welcome to Your Dashboard
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Monitor, stream, and manage your videos in real-time with ease.
        </p>
      </section>

      {/* Quick Action Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {renderQuickActionCard({
          modeType: "streamer",
          title: "Streamer Mode",
          description: "Start a live stream for others to view in real-time.",
          color: "bg-green-100 dark:bg-green-900",
          Icon: FaVideo,
        })}
        {renderQuickActionCard({
          modeType: "viewer",
          title: "Viewer Mode",
          description: "Watch a live stream with a unique call ID.",
          color: "bg-blue-100 dark:bg-blue-900",
          Icon: FaEye,
        })}
      </section>

      {/* Stats Overview */}
      <section
        ref={statsRef}
        className={`grid grid-cols-1 sm:grid-cols-3 gap-6 mt-6 transition-all duration-500 ${statsInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
      >
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md flex items-center space-x-4">
          <FaChartLine className="text-3xl text-blue-500" />
          <div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Total Streams</p>
            <p className="text-lg font-bold text-gray-800 dark:text-gray-100">120</p>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md flex items-center space-x-4">
          <FaEye className="text-3xl text-green-500" />
          <div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Total Viewers</p>
            <p className="text-lg font-bold text-gray-800 dark:text-gray-100">450</p>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md flex items-center space-x-4">
          <FaVideo className="text-3xl text-yellow-500" />
          <div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Recorded Videos</p>
            <p className="text-lg font-bold text-gray-800 dark:text-gray-100">75</p>
          </div>
        </div>
      </section>

      {/* Render Streamer or Viewer Components */}
      <div className="mt-8">
        {mode === "streamer" && <Streamer />}
        {mode === "viewer" && <Viewer />}
        {!mode && <p className="text-center text-gray-600 dark:text-gray-400">Select a mode to begin.</p>}
      </div>
    </div>
  );
};

export default DashboardHome;