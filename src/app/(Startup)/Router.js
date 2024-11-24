import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import App from "../../App"; // Main Application
import SignIn from "../(Auth)/signin/SignIn"; // SignIn Component
import SignUp from "../(Auth)/signup/SignUp"; // SignUp Component
import MainStartupPage from "../../app/(Startup)/MainStartupPage"; // Main Startup Page
import NotFound from "../../components/shared/NotFound";
import InternalError from "../../components/shared/InternalError";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../config"; // Firebase config

const AppRouter = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // For authentication state loading

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
      setIsLoading(false); // Set loading to false once authentication state is determined
    });

    return () => unsubscribe();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        {/* Unauthenticated Routes */}
        <Route path="/" element={<MainStartupPage />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Authenticated Routes */}
        <Route
          path="/*"
          element={isAuthenticated ? <App /> : <Navigate to="/signin" />}
        />

        {/* Error Pages */}
        <Route path="/404" element={<NotFound />} />
        <Route path="/500" element={<InternalError />} />

        {/* Redirect all unmatched routes to 404 */}
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;