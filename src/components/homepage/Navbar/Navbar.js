import React, { useState, useEffect } from "react";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    // Event listener for scroll
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    // Cleanup event listener on component unmount
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Function to scroll to the top of the page
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // Smooth scrolling effect
    });
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-10 transition-all duration-300 ${
        isScrolled
          ? "bg-white/80 backdrop-blur-md shadow-md py-1.5" // Reduced padding for scrolled state
          : "bg-transparent py-3" // Reduced padding for default state
      }`}
    >
      {/* Navbar Content Wrapper */}
      <div className="flex justify-between items-center w-full max-w-6xl mx-auto">
        {/* Logo */}
        <div
          className={`text-2xl font-extrabold mr-3 cursor-pointer ${
            isScrolled ? "text-gray-800" : "text-white"
          }`}
          onClick={scrollToTop}
        >
          <img
            src="/Images/logo.png"
            alt="Logo"
            className="inline-block h-12 w-12 mr-2" // Reduced logo size slightly
          />
          <span className="text-blue-500">AI</span>{" "}
          <span className={isScrolled ? "text-gray-800" : "text-white"}>
            Monitoring System
          </span>
        </div>

        {/* Navigation Links */}
        <div className="space-x-4 flex items-center">
          {/* Sign In Button */}
          <a
            href="/signin"
            className={`nav-link text-xl font-semibold py-2 px-6 rounded-lg transition duration-200 ease-in-out hover:shadow-lg focus:outline-none no-underline hover:no-underline ${
              isScrolled 
                ? "text-gray-800 hover:text-blue-500" 
                : "text-white hover:text-white"
            }`}
          >
            Sign In
          </a>
          {/* Sign Up Button */}
          <a
            href="/signup"
            className="nav-link bg-blue-500 text-white text-xl font-semibold py-2 px-6 rounded-lg shadow-md transition duration-300 ease-in-out hover:bg-blue-600 hover:text-white focus:outline-none no-underline hover:no-underline"
          >
            Sign Up
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;