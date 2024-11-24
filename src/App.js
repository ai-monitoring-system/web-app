import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "./DashboardLayout";
import SignIn from "./app/(Auth)/signin/SignIn";
import SignUp from "./app/(Auth)/signup/SignUp";
import MainStartupPage from "./app/(Startup)/MainStartupPage";
import DashboardHome from "./components/dashboard/DashboardHome";
import VideoStorage from "./components/dashboard/VideoStorage";
import Profile from "./components/dashboard/Profile";
import Settings from "./components/dashboard/Settings";
import Viewer from "./Viewer";
import { auth } from "./utils/config";
import { onAuthStateChanged } from "firebase/auth";

const App = () => {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );
  const [user, setUser] = useState(null);

  // Monitor authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Toggle dark mode and persist preference
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    localStorage.setItem("darkMode", !darkMode);
  };

  return (
    <div className={`${darkMode ? "dark" : ""}`}>
      <Routes>
        {/* Public Routes */}
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/welcome" element={<MainStartupPage />} />

        {/* Protected Routes */}
        <Route
          path="/*"
          element={
            user ? (
              <DashboardLayout
                user={user}
                darkMode={darkMode}
                toggleDarkMode={toggleDarkMode}
              >
                <Routes>
                  <Route path="/" element={<DashboardHome />} />
                  <Route path="/videoStorage" element={<VideoStorage />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/viewer" element={<Viewer />} />
                </Routes>
              </DashboardLayout>
            ) : (
              <Navigate to="/welcome" />
            )
          }
        />
        {/* Catch-all route */}
        <Route path="*" element={<Navigate to="/welcome" />} />
      </Routes>
    </div>
  );
};

export default App;