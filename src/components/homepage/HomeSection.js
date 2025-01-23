"use client";

import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import styles from "./styles/WelcomePageHome.module.scss";
import HeroBackground from "./HomeBackground";
import { MdOutlineLogin } from "react-icons/md";

const HeroSection = ({ description, actionLabel }) => {
  const navigate = useNavigate(); // Initialize navigate hook

  const handleButtonClick = () => {
    navigate("/signin"); // Navigate to the signin page
  };

  return (
    <>
      <HeroBackground />
      <div className={styles.heroSectionWrapper}>
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
          className="bg-blue-500 text-white font-bold py-4 px-8 rounded-lg shadow-md flex items-center justify-center space-x-3 hover:bg-blue-600 transition duration-200 no-underline focus:outline-none focus:ring-0"
        >
          <MdOutlineLogin className="w-6 h-6 text-white hover:text-white" />
          <span className="font-bold text-white hover:text-white no-underline">
            {actionLabel}
          </span>
        </button>
      </div>
    </>
  );
};

export default HeroSection;