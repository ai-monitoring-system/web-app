import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from '../../context/AuthContext';
import DashboardLayout from "../../DashboardLayout";
import SignIn from "../(Auth)/signin/SignIn";
import SignUp from "../(Auth)/signup/SignUp";
import MainStartupPage from "./MainStartupPage";
import NotFound from "../../components/shared/NotFound";
import InternalError from "../../components/shared/InternalError";
import { PageLoader } from '../../components/shared/LoadingSpinner';

const Router = () => {
  const { user, loading } = useAuth();
  const DEV_MODE = true;
  const isAuthenticated = DEV_MODE || user;

  if (loading) {
    return <PageLoader />;
  }

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
            <DashboardLayout />
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