import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaInfoCircle, FaSignInAlt, FaSignOutAlt } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import { LoadingSpinner } from "../shared/LoadingSpinner";

const Profile = () => {
  const { user, logout, authLoading } = useAuth();
  const [copySuccess, setCopySuccess] = useState(false);
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await logout();
    } catch (err) {
      console.error("Error signing out:", err);
    }
  };

  const handleCopyUserId = async () => {
    try {
      await navigator.clipboard.writeText(user.uid);
      setCopySuccess(true);
      setTimeout(() => {
        setCopySuccess(false);
      }, 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col overflow-hidden bg-gradient-to-br from-gray-50 to-gray-200 dark:from-gray-900 dark:to-gray-800 text-gray-800 dark:text-gray-100 transform transition-all duration-300 z-0 opacity-100 translate-y-0">
      <div className="relative bg-gradient-to-r from-blue-600 via-blue-500 to-blue-700 text-white py-12 px-6 text-center rounded-b-[50px] shadow-lg">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-700/50 via-blue-600/30 to-transparent"></div>
        <div className="relative z-10 container mx-auto animate-fadeInDown">
          {user ? (
            <div className="flex flex-col items-center space-y-4">
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-300 to-blue-400 rounded-full opacity-75 group-hover:opacity-100 blur transition duration-500"></div>
                <img
                  src={user.photoURL || "https://via.placeholder.com/100"}
                  alt={user.displayName}
                  className="relative rounded-full h-32 w-32 border-4 border-white shadow-lg transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="space-y-1">
                <p className="text-blue-200 font-medium tracking-wider">
                  Welcome back
                </p>
                <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100">
                  {user.displayName}
                </h1>
                <p className="text-lg text-blue-100 opacity-90">{user.email}</p>
              </div>
              <div className="flex items-center gap-3 mt-4">
                <button
                  onClick={handleSignOut}
                  disabled={authLoading}
                  className="px-6 py-2 bg-red-500/90 hover:bg-red-600 text-white font-semibold rounded-full shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {authLoading ? (
                    <LoadingSpinner size="sm" light />
                  ) : (
                    <>
                      <FaSignOutAlt className="text-sm" />
                      Sign Out
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100">
                Welcome to Your Profile
              </h1>
              <p className="text-blue-100 text-lg">
                Sign in to access your profile
              </p>
              <button
                onClick={() => navigate("/signin")}
                className="mt-4 px-8 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-full shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 backdrop-blur-sm flex items-center gap-2 mx-auto"
              >
                <FaSignInAlt className="text-sm" />
                Sign In
              </button>
            </div>
          )}
        </div>
      </div>

      {user && (
        <div className="container mx-auto px-4 py-8">
          {/* Your Information Section Only */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-lg transition-all duration-500">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 bg-blue-100 dark:bg-blue-900/30 rounded-2xl">
                <FaInfoCircle className="text-blue-500 dark:text-blue-400" />
              </div>
              <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400 dark:from-blue-400 dark:to-blue-300">
                Your Information
              </h2>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-gray-100 dark:border-gray-700">
                <div className="flex flex-col space-y-1">
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Full Name
                  </span>
                  <span className="text-lg font-semibold">
                    {user.displayName}
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-gray-100 dark:border-gray-700">
                <div className="flex flex-col space-y-1">
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Email Address
                  </span>
                  <span className="text-lg font-semibold">{user.email}</span>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-gray-100 dark:border-gray-700">
                <div className="flex flex-col space-y-1">
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    User ID
                  </span>
                  <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg border border-gray-200 dark:border-gray-700 font-mono text-sm">
                    <span className="text-blue-600 dark:text-blue-400 select-all">
                      {user.uid}
                    </span>
                    <button
                      onClick={handleCopyUserId}
                      className={`ml-2 p-2 rounded-md transition-all duration-300 ${
                        copySuccess
                          ? "text-green-500 dark:text-green-400 bg-green-50 dark:bg-green-900/20"
                          : "text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                      title={copySuccess ? "Copied!" : "Copy to clipboard"}
                    >
                      {copySuccess ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
