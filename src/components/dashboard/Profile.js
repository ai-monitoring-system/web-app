import React, { useState, useEffect, useRef } from "react";
import { signInWithPopup, signOut, onAuthStateChanged, updateProfile } from "firebase/auth";
import { auth, googleProvider } from "../../utils/config";
import { useNavigate } from "react-router-dom";
import { FaInfoCircle, FaKey, FaRegSmile, FaRegEdit, FaLock, FaShieldAlt, FaSignOutAlt, FaGoogle, FaUserCog, FaCamera } from "react-icons/fa";
import { useAuth } from '../../context/AuthContext';
import { LoadingSpinner } from '../shared/LoadingSpinner';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../utils/config";

const Profile = () => {
  const navigate = useNavigate();
  const { user, logout, authLoading, error, updateUserProfile } = useAuth();
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Add local loading state
  // Add color schemes definition
  const colorSchemes = {
    blue: {
      light: "bg-blue-100 dark:bg-blue-900/30",
      icon: "text-blue-500 dark:text-blue-400",
      gradient: "from-blue-600 to-blue-400 dark:from-blue-400 dark:to-blue-300",
      glow: "hover:border-blue-200 dark:hover:border-blue-500/30 hover:shadow-blue-100/40 dark:hover:shadow-blue-500/20",
      blur: "bg-blue-50 dark:bg-blue-900/20"
    },
    green: {
      light: "bg-green-100 dark:bg-green-900/30",
      icon: "text-green-500 dark:text-green-400",
      gradient: "from-green-600 to-green-400 dark:from-green-400 dark:to-green-300",
      glow: "hover:border-green-200 dark:hover:border-green-500/30 hover:shadow-green-100/40 dark:hover:shadow-green-500/20",
      blur: "bg-green-50 dark:bg-green-900/20"
    },
    purple: {
      light: "bg-purple-100 dark:bg-purple-900/30",
      icon: "text-purple-500 dark:text-purple-400",
      gradient: "from-purple-600 to-purple-400 dark:from-purple-400 dark:to-purple-300",
      glow: "hover:border-purple-200 dark:hover:border-purple-500/30 hover:shadow-purple-100/40 dark:hover:shadow-purple-500/20",
      blur: "bg-purple-50 dark:bg-purple-900/20"
    }
  };

  // Then update the references in the JSX to use the correct color scheme
  // For "Your Information" section:
  const infoColors = colorSchemes.blue;
  // For "Recent Activity" section:
  const activityColors = colorSchemes.green;
  // For "Account Settings" section:
  const settingsColors = colorSchemes.purple;

  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [isPageLoaded, setIsPageLoaded] = useState(false); // Track animation state
  const [copySuccess, setCopySuccess] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);

  // Add these animation classes at the top of your component
  const fadeIn = "transition-all duration-300 ease-in-out";
  const slideUp = "transform transition-all duration-500 ease-out";
  const scaleIn = "transition-all duration-300 ease-in-out transform";

  // Update effect to use user from context
  useEffect(() => {
    // Set initial values from user context
    setDisplayName(user?.displayName || "");
    setPhotoURL(user?.photoURL || "");
    
    // Trigger animation when the component is mounted
    setTimeout(() => setIsPageLoaded(true), 100);
  }, [user]);

  // Sign in function
  async function mySignIn() {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Error signing in:", error);
      setMessage("Failed to sign in. Please try again.");
    }
  }

  // Sign out function
  const handleSignOut = async () => {
    try {
      await logout();
      // Navigation is handled by AuthContext
    } catch (err) {
      setMessage(err.message);
    }
  };

  // Handle file selection
  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setMessage("Image size should be less than 5MB");
      return;
    }

    // Validate file type
    if (!file.type.match('image.*')) {
      setMessage("Please select an image file");
      return;
    }

    // Clear any previous error messages
    setMessage("");
    setImageFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.onerror = () => {
      setMessage("Error reading file");
    };
    reader.readAsDataURL(file);
  };

  // Handle image upload
  const uploadImage = async () => {
    if (!imageFile) return null;

    try {
      // Create a unique filename using timestamp
      const timestamp = Date.now();
      const filename = `${timestamp}_${imageFile.name}`;
      const storageRef = ref(storage, `profile-photos/${user.uid}/${filename}`);
      
      // Upload the file
      const snapshot = await uploadBytes(storageRef, imageFile);
      console.log('Image uploaded successfully');
      
      // Get the download URL
      const downloadURL = await getDownloadURL(snapshot.ref);
      console.log('Download URL obtained:', downloadURL);
      
      return downloadURL;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw new Error(`Failed to upload image: ${error.message}`);
    }
  };

  // Update save handler to use local loading state
  const handleSave = async () => {
    if (!displayName) {
      setMessage("Name cannot be empty.");
      return;
    }

    try {
      setIsLoading(true);
      setMessage(""); // Clear any previous messages

      let updatedPhotoURL = user.photoURL;

      // Only attempt upload if there's a new image
      if (imageFile) {
        console.log('Uploading new image...');
        updatedPhotoURL = await uploadImage();
        console.log('New photo URL:', updatedPhotoURL);
      }

      // Update profile with new information
      await updateUserProfile({
        displayName,
        photoURL: updatedPhotoURL,
      });

      console.log('Profile updated successfully');
      setMessage("Profile updated successfully.");
      setIsEditing(false);
      setImageFile(null);
      setImagePreview("");
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage(error.message || "Failed to update profile. Please try again.");
    } finally {
      setIsLoading(false);
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

  const handleCopyUserId = async () => {
    try {
      await navigator.clipboard.writeText(user.uid);
      setCopySuccess(true);
      
      // Reset the success state after 2 seconds
      setTimeout(() => {
        setCopySuccess(false);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  // Show either context error or local message
  const displayMessage = error || message;

  return (
      <div
        className={`min-h-screen flex flex-col overflow-hidden bg-gradient-to-br from-gray-50 to-gray-200 dark:from-gray-900 dark:to-gray-800 text-gray-800 dark:text-gray-100 transform transition-all duration-300 z-0 ${
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
            <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-lg 
              transition-all duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)] 
              hover:shadow-2xl hover:-translate-y-0.5 hover:scale-[1.003] 
              relative overflow-hidden will-change-transform">
              {/* Decorative background elements */}
              <div className={`absolute top-0 right-0 w-32 h-32 ${infoColors.blur} rounded-full 
                -translate-x-16 -translate-y-16 blur-2xl transition-all duration-1000 
                ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:blur-3xl group-hover:opacity-80`}>
              </div>
              <div className={`absolute bottom-0 left-0 w-32 h-32 ${infoColors.blur} rounded-full 
                translate-x-16 translate-y-16 blur-2xl transition-all duration-1000 
                ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:blur-3xl group-hover:opacity-80`}>
              </div>
              
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
                      <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg border border-gray-200 dark:border-gray-700 font-mono text-sm">
                        <div className="flex items-center space-x-2 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
                          <span className="text-blue-600 dark:text-blue-400 select-all">
                            {user.uid}
                          </span>
                        </div>
                        <button
                          onClick={handleCopyUserId}
                          className={`ml-2 p-2 rounded-md transition-all duration-300 ${
                            copySuccess 
                              ? 'text-green-500 dark:text-green-400 bg-green-50 dark:bg-green-900/20' 
                              : 'text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                          }`}
                          title={copySuccess ? 'Copied!' : 'Copy to clipboard'}
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
                      <div className="flex items-center mt-1 text-xs">
                        <p className="text-gray-500 dark:text-gray-400">
                          This is your unique identifier in our system
                        </p>
                        {copySuccess && (
                          <span className="ml-2 text-green-500 dark:text-green-400 flex items-center">
                            <svg 
                              xmlns="http://www.w3.org/2000/svg" 
                              className="h-3 w-3 mr-1" 
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
                            Copied to clipboard!
                          </span>
                        )}
                      </div>
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
            <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-lg 
              transition-all duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)] 
              hover:shadow-2xl hover:-translate-y-0.5 hover:scale-[1.003] 
              relative overflow-hidden will-change-transform">
              <div className={`absolute top-0 right-0 w-32 h-32 ${activityColors.blur} rounded-full 
                -translate-x-16 -translate-y-16 blur-2xl transition-all duration-1000 
                ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:blur-3xl group-hover:opacity-80`}>
              </div>
              
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
            <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-lg 
              transition-all duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)] 
              hover:shadow-2xl hover:-translate-y-0.5 hover:scale-[1.003] 
              relative overflow-hidden will-change-transform">
              {/* Decorative background elements */}
              <div className={`absolute top-0 right-0 w-32 h-32 ${settingsColors.blur} rounded-full 
                -translate-x-16 -translate-y-16 blur-2xl transition-all duration-1000 
                ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:blur-3xl group-hover:opacity-80`}>
              </div>
              <div className={`absolute bottom-0 left-0 w-32 h-32 ${settingsColors.blur} rounded-full 
                translate-x-16 translate-y-16 blur-2xl transition-all duration-1000 
                ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:blur-3xl group-hover:opacity-80`}>
              </div>
              
              <div className="relative">
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-2xl">
                    <FaUserCog className="text-purple-500 dark:text-purple-400 text-2xl" />
                  </div>
                  <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-purple-400 dark:from-purple-400 dark:to-purple-300">
                    Account Settings
                  </h2>
                </div>

                <div className="space-y-6">
                  {/* Profile Management */}
                  <div className="group p-4 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-purple-200 dark:hover:border-purple-500/30 transition-all duration-300 hover:shadow-lg">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                        <FaRegEdit className="text-purple-500 text-lg" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Profile Management</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          Update your profile information, photo, and display name
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="w-full mt-4 px-4 py-2.5 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold rounded-lg shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 flex items-center justify-center gap-2"
                    >
                      <FaRegEdit className="text-white text-sm" />
                      <span>Edit Profile</span>
                    </button>
                  </div>

                  {/* Security Settings */}
                  <div className="group p-4 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-purple-200 dark:hover:border-purple-500/30 transition-all duration-300 hover:shadow-lg">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                        <FaLock className="text-purple-500 text-lg" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Security Settings</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          Manage your password and security preferences
                        </p>
                      </div>
                    </div>
                    <button 
                      className="w-full mt-4 px-4 py-2.5 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 flex items-center justify-center gap-2"
                    >
                      <FaLock className="text-white text-sm" />
                      <span>Change Password</span>
                    </button>
                  </div>

                  {/* Privacy Controls */}
                  <div className="group p-4 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-purple-200 dark:hover:border-purple-500/30 transition-all duration-300 hover:shadow-lg">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                        <FaShieldAlt className="text-purple-500 text-lg" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Privacy Controls</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          Manage your privacy settings and data preferences
                        </p>
                      </div>
                    </div>
                    <button 
                      className="w-full mt-4 px-4 py-2.5 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 flex items-center justify-center gap-2"
                    >
                      <FaShieldAlt className="text-white text-sm" />
                      <span>Privacy Settings</span>
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
        <div 
          className={`fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 backdrop-blur-sm
            ${fadeIn} ${isEditing ? 'opacity-100' : 'opacity-0'}`}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsEditing(false);
              setImageFile(null);
              setImagePreview("");
              setMessage("");
            }
          }}
        >
          <div 
            className={`bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-lg overflow-hidden
              ${slideUp} ${isEditing ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
          >
            {/* Header with gradient animation */}
            <div 
              className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4
                relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent
                animate-shimmer" />
              <h2 className="text-2xl font-bold text-white relative z-10">Edit Profile</h2>
            </div>

            <div className="p-6">
              {/* Profile Photo Section with hover effects */}
              <div className="mb-8">
                <label className="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-3">
                  Profile Photo
                </label>
                <div className="flex items-center space-x-6">
                  <div className="relative group">
                    <div className={`w-24 h-24 rounded-full overflow-hidden ring-4 ring-blue-100 
                      dark:ring-blue-900 ${scaleIn} group-hover:ring-blue-400 dark:group-hover:ring-blue-600`}>
                      <img
                        src={imagePreview || user.photoURL || "https://via.placeholder.com/100"}
                        alt="Profile"
                        className={`w-full h-full object-cover ${scaleIn} group-hover:scale-110`}
                      />
                    </div>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className={`absolute inset-0 flex items-center justify-center bg-black/50 
                        rounded-full ${fadeIn} opacity-0 group-hover:opacity-100`}
                    >
                      <div className={`bg-white/10 p-2 rounded-full backdrop-blur-sm ${scaleIn} 
                        group-hover:scale-110`}>
                        <FaCamera className="text-white text-xl" />
                      </div>
                    </button>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Upload new photo
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Click the image to change your profile photo. Maximum file size: 5MB
                    </p>
                  </div>
                </div>
              </div>

              {/* Display Name Input with focus animation */}
              <div className="mb-6">
                <label className="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-2">
                  Display Name
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className={`w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-700/50 
                    focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-gray-100
                    ${fadeIn} focus:scale-[1.01]`}
                  placeholder="Enter your display name"
                />
              </div>

              {/* Message with animation */}
              {displayMessage && (
                <div 
                  className={`mb-6 p-4 rounded-lg text-sm font-medium ${fadeIn}
                    ${displayMessage.includes('success')
                      ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                      : 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400'}`}
                >
                  {displayMessage}
                </div>
              )}

              {/* Action Buttons with hover animations */}
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setImageFile(null);
                    setImagePreview("");
                    setMessage("");
                  }}
                  className={`px-5 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 
                    dark:text-gray-200 font-medium rounded-lg ${fadeIn} hover:-translate-y-0.5
                    hover:bg-gray-200 dark:hover:bg-gray-600`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={isLoading || authLoading}
                  className={`px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg 
                    ${fadeIn} hover:-translate-y-0.5 hover:bg-blue-700
                    disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0
                    flex items-center space-x-2`}
                >
                  {isLoading ? (
                    <>
                      <LoadingSpinner size="sm" light />
                      <span>Saving...</span>
                    </>
                  ) : (
                    'Save Changes'
                  )}
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