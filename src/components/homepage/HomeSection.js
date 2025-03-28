"use client";

import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./styles/WelcomePageHome.module.scss";
import { MdOutlineLogin } from "react-icons/md";

const HeroSection = ({ description, actionLabel }) => {
  const navigate = useNavigate();
  const [hasScrolled, setHasScrolled] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const videoRef = useRef(null);
  
  const handleButtonClick = () => {
    navigate("/signin");
  };
  
  // Handle scroll events
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setHasScrolled(true);
      } else {
        setHasScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Handle video loading
  useEffect(() => {
    const video = videoRef.current;
    
    if (video) {
      // Event handlers for video
      const handleLoadedData = () => setVideoLoaded(true);
      const handleError = () => setVideoError(true);
      
      // Try to preload the video
      video.preload = "auto";
      
      // Add event listeners
      video.addEventListener('loadeddata', handleLoadedData);
      video.addEventListener('error', handleError);
      
      // Check if video is already loaded (happens with cached videos)
      if (video.readyState >= 3) {
        setVideoLoaded(true);
      }
      
      // Cleanup
      return () => {
        video.removeEventListener('loadeddata', handleLoadedData);
        video.removeEventListener('error', handleError);
      };
    }
  }, []);

  return (
    <div className={styles.heroSectionWrapper}>
      {/* Static background fallback (shows until video loads or if video fails) */}
      <div className={`${styles.fallbackBackground} ${videoLoaded && !videoError ? styles.hidden : ''}`}></div>
      
      {/* Background Video */}
      <video
        ref={videoRef}
        className={`${styles.videoBackground} ${videoLoaded && !videoError ? '' : styles.hidden}`}
        autoPlay
        loop
        muted
        playsInline
        onCanPlay={() => setVideoLoaded(true)}
        onError={() => setVideoError(true)}
      >
        <source src="/video/background-video.mp4" type="video/mp4" />
        {/* Additional video format for better browser compatibility */}
        <source src="/video/background-video.webm" type="video/webm" />
      </video>
      
      <div className={styles.videoOverlay}></div>
      
      {/* Content starts here */}
      <h1 className={styles.heading}>AI Monitoring System</h1>

      <div className={styles.description}>
        {description.split("_").map((word, index) =>
          index % 2 ? (
            <span key={index} className={styles.highlight}>
              {word}
            </span>
          ) : (
            <span key={index}>{word}</span>
          )
        )}
      </div>

      {/* Button with navigation */}
      <button
        onClick={handleButtonClick}
        className="bg-blue-500 text-white font-bold py-4 px-10 rounded-lg shadow-lg flex items-center justify-center space-x-3 hover:bg-blue-600 transition-all duration-300 transform hover:-translate-y-1 no-underline focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
      >
        <MdOutlineLogin className="w-6 h-6 text-white" />
        <span className="font-bold text-white text-xl no-underline">
          {actionLabel}
        </span>
      </button>
      
      {/* Scroll indicator */}
      {!hasScrolled && (
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce transition-opacity duration-300">
          <svg className="w-6 h-6 text-white opacity-70" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
            <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
          </svg>
        </div>
      )}
      
      {/* Loading indicator for video */}
      {!videoLoaded && !videoError && (
        <div className={styles.videoLoadingIndicator}>
          <div className={styles.loadingSpinner}></div>
        </div>
      )}
    </div>
  );
};

export default HeroSection;