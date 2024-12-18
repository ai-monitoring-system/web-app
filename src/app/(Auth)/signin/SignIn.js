import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaGoogle, FaGithub } from "react-icons/fa";
import { useAuth } from '../../../context/AuthContext';
import "animate.css";
import { LoadingSpinner } from '../../../components/shared/LoadingSpinner';

const SignIn = () => {
  const navigate = useNavigate();
  const { signInWithGoogle, signInWithGithub, authLoading, error } = useAuth();
  const [localError, setLocalError] = useState("");

  const handleGoogleSignIn = async () => {
    try {
      setLocalError("");
      await signInWithGoogle();
    } catch (err) {
      setLocalError(err.message);
    }
  };

  const handleGithubSignIn = async () => {
    try {
      setLocalError("");
      await signInWithGithub();
    } catch (err) {
      setLocalError(err.message);
    }
  };

  const displayError = error || localError;

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-700 p-8 animate__animated animate__fadeIn"
    >
      <div
        className="bg-white dark:bg-gray-800 px-16 py-12 rounded-lg shadow-lg w-full max-w-2xl animate__animated animate__zoomIn animate__faster"
      >
        <h1 className="text-4xl font-bold text-center text-gray-800 dark:text-gray-100 mb-8">
          Welcome Back
        </h1>
        <p className="text-center text-lg text-gray-500 dark:text-gray-400 mb-10">
          Sign in to your account to continue
        </p>

        {/* Email Input */}
        <div className="mb-6">
          <label
            htmlFor="email"
            className="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Email Address
          </label>
          <input
            type="email"
            id="email"
            placeholder="Enter your email"
            className="w-full px-4 py-3 text-lg border rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Password Input */}
        <div className="mb-6">
          <label
            htmlFor="password"
            className="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            placeholder="Enter your password"
            className="w-full px-4 py-3 text-lg border rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {displayError && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
            {displayError}
          </div>
        )}

        {/* Sign In Button */}
        <button
          className="w-full py-3 bg-blue-600 text-white text-lg rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
        >
          Sign In
        </button>

        {/* Social Sign-In */}
        <div className="mt-10">
          <p className="text-center text-lg text-gray-500 dark:text-gray-400 mb-6">
            Or sign in with
          </p>
          <div className="flex justify-center space-x-6">
            <button
              onClick={handleGoogleSignIn}
              disabled={authLoading}
              className="flex items-center justify-center px-6 py-3 bg-red-500 text-white text-lg font-medium rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {authLoading ? (
                <LoadingSpinner size="sm" light />
              ) : (
                <>
                  <FaGoogle className="mr-3 text-2xl" />
                  Sign in with Google
                </>
              )}
            </button>
            <button
              onClick={handleGithubSignIn}
              disabled={authLoading}
              className="flex items-center justify-center px-6 py-3 bg-gray-800 text-white text-lg font-medium rounded-md hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {authLoading ? (
                <LoadingSpinner size="sm" light />
              ) : (
                <>
                  <FaGithub className="mr-3 text-2xl" />
                  Sign in with GitHub
                </>
              )}
            </button>
          </div>
        </div>

        {/* Sign Up Link */}
        <p className="text-center text-lg mt-8 text-gray-500 dark:text-gray-400">
          Don’t have an account?{" "}
          <span
            onClick={() => navigate("/signup")}
            className="text-blue-600 dark:text-blue-400 font-bold cursor-pointer hover:underline"
          >
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
};

export default SignIn;