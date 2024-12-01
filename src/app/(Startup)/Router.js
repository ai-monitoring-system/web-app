import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "../../DashboardLayout";
import SignIn from "../(Auth)/signin/SignIn";
import SignUp from "../(Auth)/signup/SignUp";
import MainStartupPage from "./MainStartupPage";
import DashboardHome from "../../components/dashboard/DashboardHome";
import VideoStorage from "../../components/dashboard/VideoStorage";
import Profile from "../../components/dashboard/Profile";
import Settings from "../../components/dashboard/Settings";
import Viewer from "../../Viewer";
import NotFound from "../../components/shared/NotFound";
import InternalError from "../../components/shared/InternalError";

const Router = ({ user }) => {
  // Development bypass - set to true to access protected routes without auth
  const DEV_MODE = true;  // TODO: Remove in production
  const isAuthenticated = DEV_MODE || user;

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/welcome" element={<MainStartupPage />} />

      {/* Error Pages */}
      <Route path="/404" element={<NotFound />} />
      <Route path="/500" element={<InternalError />} />

      {/* Protected Routes */}
      <Route
        path="/*"
        element={
          isAuthenticated ? (
            <DashboardLayout
              user={user}
              isStreaming={false}
              viewerMode={false}
              streamerMode={false}
            />
          ) : (
            <Navigate to="/welcome" />
          )
        }
      />
      {/* Catch-all route */}
      <Route path="*" element={<Navigate to="/welcome" />} />
    </Routes>
  );
};

export default Router;