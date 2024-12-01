import React, { useState, useEffect } from "react";
import { signInWithPopup, signOut, onAuthStateChanged, updateProfile } from "firebase/auth";
import { auth, provider } from "../../utils/config";
import { FaInfoCircle, FaKey, FaRegSmile, FaRegEdit, FaLock, FaShieldAlt, FaSignOutAlt, FaGoogle } from "react-icons/fa";

const Profile = () => {
  const [user, setUser] = useState(null); // Tracks the current user
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [message, setMessage] = useState("");
  const [isPageLoaded, setIsPageLoaded] = useState(false); // Track animation state

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setDisplayName(currentUser?.displayName || "");
      setPhotoURL(currentUser?.photoURL || "");
    });

    // Trigger animation when the component is mounted
    setTimeout(() => setIsPageLoaded(true), 100); // Delay to ensure animation triggers

    return () => unsubscribe(); // Cleanup the listener on unmount
  }, []);

  // Sign in function
  async function mySignIn() {
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Error signing in:", error);
      setMessage("Failed to sign in. Please try again.");
    }
  }

  // Sign out function
  async function mySignOut() {
    try {
      await signOut(auth);
      setMessage("You have successfully signed out.");
    } catch (error) {
      console.error("Error signing out:", error);
      setMessage("Failed to sign out. Please try again.");
    }
  }

  // Save updated profile information
  const handleSave = async () => {
    if (!displayName || !photoURL) {
      setMessage("Name and Photo URL cannot be empty.");
      return;
    }

    try {
      // Ensure user is authenticated
      if (!user) {
        throw new Error("No authenticated user found.");
      }

      // Update profile using Firebase's modular `updateProfile`
      await updateProfile(user, {
        displayName,
        photoURL,
      });

      setMessage("Profile updated successfully.");
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error); // Log the actual error
      setMessage(error.message || "Failed to update profile. Please try again.");
    }
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleString();
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };

  return (
    <div
      className={`min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-200 dark:from-gray-900 dark:to-gray-800 text-gray-800 dark:text-gray-100 transform transition-all duration-700 ${
        isPageLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
    >
      {/* Profile Header */}
      <div className="relative bg-gradient-to-r from-blue-600 via-blue-500 to-blue-700 text-white py-12 px-6 text-center rounded-b-[50px] shadow-lg">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-700/50 via-blue-600/30 to-transparent"></div>
        {/* Decorative circles */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-2xl"></div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-400/10 rounded-full translate-x-1/2 -translate-y-1/2 blur-2xl"></div>
        
        <div className="relative z-10 container mx-auto animate-fadeInDown">
          {user ? (
            <div className="flex flex-col items-center space-y-4">
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-300 to-blue-400 rounded-full opacity-75 group-hover:opacity-100 blur transition duration-500"></div>
                <img
                  src={user.photoURL}
                  alt={user.displayName}
                  className="relative rounded-full h-32 w-32 border-4 border-white shadow-lg transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="space-y-1">
                <p className="text-blue-200 font-medium tracking-wider">Welcome back</p>
                <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100">
                  {user.displayName}
                </h1>
                <p className="text-lg text-blue-100 opacity-90">{user.email}</p>
              </div>
              <div className="flex items-center gap-3 mt-4">
                <button
                  onClick={mySignOut}
                  className="px-6 py-2 bg-red-500/90 hover:bg-red-600 text-white font-semibold rounded-full shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 flex items-center gap-2"
                >
                  <FaSignOutAlt className="text-sm" />
                  Sign Out
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100">
                Welcome to Your Profile
              </h1>
              <p className="text-blue-100 text-lg">Sign in to access your profile and settings</p>
              <button
                onClick={mySignIn}
                className="mt-4 px-8 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-full shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 backdrop-blur-sm flex items-center gap-2 mx-auto"
              >
                <FaGoogle className="text-sm" />
                Sign in with Google
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow container mx-auto px-4 py-8">
        {user ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-fadeIn">
            {/* User Information */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">
              {/* Decorative background elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 dark:bg-blue-900/20 rounded-full -translate-x-16 -translate-y-16 blur-2xl"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-50 dark:bg-blue-900/20 rounded-full translate-x-16 translate-y-16 blur-2xl"></div>
              
              <div className="relative">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2.5 bg-blue-100 dark:bg-blue-900/30 rounded-2xl shadow-sm">
                    <FaInfoCircle className="text-blue-500 dark:text-blue-400" />
                  </div>
                  <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400 dark:from-blue-400 dark:to-blue-300">Your Information</h2>
                </div>
                
                <div className="space-y-4">
                  <div className="group p-4 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-blue-100/40 dark:hover:shadow-blue-500/20">
                    <div className="flex flex-col space-y-1">
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Full Name</span>
                      <span className="text-lg font-semibold">{user.displayName}</span>
                    </div>
                  </div>

                  <div className="group p-4 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-blue-100/40 dark:hover:shadow-blue-500/20">
                    <div className="flex flex-col space-y-1">
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Email Address</span>
                      <span className="text-lg font-semibold">{user.email}</span>
                    </div>
                  </div>

                  <div className="group p-4 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-blue-100/40 dark:hover:shadow-blue-500/20">
                    <div className="flex flex-col space-y-1">
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">User ID</span>
                      <span className="font-mono text-sm bg-white dark:bg-gray-700 p-2 rounded-xl overflow-x-auto shadow-inner">
                        {user.uid}
                      </span>
                    </div>
                  </div>

                  <div className="group p-4 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-blue-100/40 dark:hover:shadow-blue-500/20">
                    <div className="flex flex-col space-y-1">
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Last Login</span>
                      <span className="text-lg font-semibold">
                        {formatDate(user.metadata.lastSignInTime)}
                      </span>
                    </div>
                  </div>

                  <div className="group p-4 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-blue-100/40 dark:hover:shadow-blue-500/20">
                    <div className="flex flex-col space-y-1">
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Account Created</span>
                      <span className="text-lg font-semibold">
                        {formatDate(user.metadata.creationTime)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-2xl">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                      <FaKey className="text-blue-500 dark:text-blue-400" />
                    </div>
                    <span>Account verified and secured</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-green-50 dark:bg-green-900/20 rounded-full -translate-x-16 -translate-y-16 blur-2xl"></div>
              
              <div className="relative">
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-2xl shadow-sm">
                    <FaRegSmile className="text-green-500 dark:text-green-400" />
                  </div>
                  <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-green-400 dark:from-green-400 dark:to-green-300">Recent Activity</h2>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-6 text-center">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaRegSmile className="text-green-500 dark:text-green-400 text-2xl" />
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">
                    No recent activity yet. Start streaming or watching videos to see updates here.
                  </p>
                </div>
              </div>
            </div>

            {/* Account Settings */}
            <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                  <FaKey className="text-purple-500 text-xl" />
                </div>
                <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-purple-400 dark:from-purple-400 dark:to-purple-300">Account Settings</h2>
              </div>

              <div className="space-y-4">
                {/* Profile Management Section */}
                <div className="group p-4 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-purple-200 dark:hover:border-purple-800/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-100/40 dark:hover:shadow-purple-900/40">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <FaRegEdit className="text-purple-500" />
                        <span className="font-semibold">Profile Management</span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
                        Update your profile information, photo, and display name
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="w-full px-4 py-2.5 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold rounded-lg shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 flex items-center justify-center gap-2"
                  >
                    <FaRegEdit className="text-white text-sm" />
                    Edit Profile
                  </button>
                </div>

                {/* Security Settings Section */}
                <div className="group p-4 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-purple-200 dark:hover:border-purple-800/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-100/40 dark:hover:shadow-purple-900/40">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <FaLock className="text-purple-500" />
                        <span className="font-semibold">Security Settings</span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
                        Manage your password and security preferences
                      </p>
                    </div>
                  </div>
                  <button 
                    className="w-full px-4 py-2.5 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-semibold rounded-lg shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 flex items-center justify-center gap-2"
                  >
                    <FaLock className="text-white text-sm" />
                    Change Password
                  </button>
                </div>

                {/* Privacy Controls Section */}
                <div className="group p-4 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-purple-200 dark:hover:border-purple-800/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-100/40 dark:hover:shadow-purple-900/40">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <FaShieldAlt className="text-purple-500" />
                        <span className="font-semibold">Privacy Controls</span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
                        Manage your privacy settings and data preferences
                      </p>
                    </div>
                  </div>
                  <button 
                    className="w-full px-4 py-2.5 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-semibold rounded-lg shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 flex items-center justify-center gap-2"
                  >
                    <FaShieldAlt className="text-white text-sm" />
                    Privacy Settings
                  </button>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <div className="p-1.5 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <FaInfoCircle className="text-purple-500 text-sm" />
                  </div>
                  <span>All changes are automatically saved and secured</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Please sign in to view your profile information.
            </p>
          </div>
        )}
      </div>

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg w-full max-w-lg scale-95 transition-transform duration-200 ease-out"
            style={{ animation: "zoomIn 0.3s ease-out forwards" }}
          >
            <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-2">
                  Display Name
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
                />
              </div>
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-2">
                  Photo URL
                </label>
                <input
                  type="text"
                  value={photoURL}
                  onChange={(e) => setPhotoURL(e.target.value)}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
                />
              </div>
              {message && <p className="text-sm text-red-500">{message}</p>}
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-full transition-transform duration-300 hover:scale-105"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-full transition-transform duration-300 hover:scale-105"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;