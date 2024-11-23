import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import App from "./App";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";

const AppRouter = () => {
//   const isAuthenticated = !!localStorage.getItem("userToken"); // Replace with your auth logic
    const isAuthenticated = true; 

  return (
    <Router>
      <Routes>
        {/* Authentication Routes */}
        
        {/* UNCOMMENT FOR SIGNIN/SIGNUP PAGE */}
        {/* <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} /> */}

        {/* Protected Route */}
        <Route
          path="/*"
          element={isAuthenticated ? <App /> : <Navigate to="/signin" />}
        />
      </Routes>
    </Router>
  );
};

export default AppRouter;