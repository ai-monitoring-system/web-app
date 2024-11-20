import React, { useState, useEffect } from "react";
import { signInWithPopup, signOut, onAuthStateChanged, updateProfile } from "firebase/auth";
import { auth, provider } from "../config";
import { FaInfoCircle, FaKey, FaRegSmile } from "react-icons/fa";

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

  return (
    <div
      className={`min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-200 dark:from-gray-900 dark:to-gray-800 text-gray-800 dark:text-gray-100 transform transition-all duration-700 ${
        isPageLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
    >
      {/* Profile Header */}
      <div
        className="relative bg-gradient-to-r from-blue-600 via-blue-500 to-blue-700 text-white py-12 px-6 text-center rounded-b-[50px] shadow-lg"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-blue-700 via-transparent to-transparent opacity-80"></div>
        <div className="relative z-10 container mx-auto animate-fadeInDown">
          {user ? (
            <div className="flex flex-col items-center space-y-4">
              <img
                src={user.photoURL}
                alt={user.displayName}
                className="rounded-full h-32 w-32 border-4 border-white shadow-lg transition-transform duration-500 hover:scale-110"
              />
              <h1 className="text-4xl font-extrabold">{user.displayName}</h1>
              <p className="text-lg">{user.email}</p>
              <button
                onClick={mySignOut}
                className="mt-4 px-6 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-full shadow-md transition-transform duration-300 hover:scale-105"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div>
              <h1 className="text-3xl font-bold">Welcome to Your Profile</h1>
              <p>Sign in to access your profile and settings</p>
              <button
                onClick={mySignIn}
                className="mt-4 px-6 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-full shadow-md transition-transform duration-300 hover:scale-105"
              >
                Sign in with Google
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow container mx-auto px-4 py-8">
        {user ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* User Information */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300 hover:-translate-y-1">
              <h2 className="text-2xl font-bold flex items-center gap-2 mb-4">
                <FaInfoCircle className="text-blue-500" /> Your Information
              </h2>
              <ul className="space-y-3">
                <li>
                  <span className="font-semibold">Name:</span> {user.displayName}
                </li>
                <li>
                  <span className="font-semibold">Email:</span> {user.email}
                </li>
                <li>
                  <span className="font-semibold">User ID:</span> {user.uid}
                </li>
                <li>
                  <span className="font-semibold">Last Login:</span>{" "}
                  {user.metadata.lastSignInTime || "N/A"}
                </li>
                <li>
                  <span className="font-semibold">Account Created:</span>{" "}
                  {user.metadata.creationTime || "N/A"}
                </li>
              </ul>
            </div>

            {/* Recent Activity */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300 hover:-translate-y-1">
              <h2 className="text-2xl font-bold flex items-center gap-2 mb-4">
                <FaRegSmile className="text-green-500" /> Recent Activity
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                No recent activity yet. Start streaming or watching videos to
                see updates here.
              </p>
            </div>

            {/* Account Settings */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300 hover:-translate-y-1">
              <h2 className="text-2xl font-bold flex items-center gap-2 mb-4">
                <FaKey className="text-gray-500" /> Account Settings
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Customize your account preferences.
              </p>
              <button
                className="mt-4 w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-full shadow-md transition-transform duration-300 hover:scale-105"
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </button>
              <button className="mt-4 w-full px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-full shadow-md transition-transform duration-300 hover:scale-105">
                Change Password
              </button>
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