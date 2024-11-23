import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import App from "../../App"; // Main Application
import SignIn from "../(Auth)/signin/SignIn"; // SignIn Component
import SignUp from "../(Auth)/signup/SignUp"; // SignUp Component
//app/shared/NotFound
import NotFound from "../../components/shared/NotFound";
import InternalError from "../../components/shared/InternalError";

// Router component to manage routes and authentication
const AppRouter = () => {
  // Authentication Logic (Modify this logic based on your app's requirements)
  const isAuthenticated = true; // Change to your authentication condition
  
  return (
    <Router>
      <Routes>
        {/* Authentication Routes */}
        {/* UNCOMMENT FOR SIGNIN/SIGNUP PAGE */}
        {/* <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} /> */}
        
        {/* Protected Route for authenticated users */}
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