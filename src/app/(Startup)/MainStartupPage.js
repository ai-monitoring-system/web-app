import React, { useEffect, useState } from "react";
import Navbar from "../../components/homepage/Navbar/Navbar";
import HeroSection from "../../components/homepage/HomeSection";
import Section from "../../components/homepage/Section";
import Footer from "../../components/homepage/Navbar/Footer";
import { sections } from "../../utils/HomeData";

const MainStartupPage = () => {
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="bg-[#FFFBF0] min-h-screen flex flex-col">
      {/* Navbar */}
      <header
        className={`fixed top-0 left-0 w-full z-20 transition-transform duration-300 ${
          isSticky ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <Navbar />
      </header>

      {/* Hero Section */}
      <HeroSection
        description="Transforming Old Devices into Intelligent AI Monitoring Solutions."
        actionLabel={
          <span className="font-bold text-xl text-white hover:text-white focus:text-white no-underline">
            Get Started
          </span>
        }
        actionHref="/signup"
        buttonStyle="bg-[#FFB700] text-black font-extrabold text-2xl py-6 px-12 rounded-xl shadow-xl flex items-center justify-center space-x-4 hover:bg-yellow-600 transition duration-200 no-underline"
        icon={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 24 24"
            className="w-8 h-8 text-black hover:text-black focus:text-black"
          >
            <path d="M5 12h13l-4-4m0 8l4-4m-4 4h0" />
          </svg>
        }
      />

      {/* Dynamic Sections */}
      <main className="py-0 space-y-0 flex-grow"> {/* Remove gap between sections */}
        {sections.map((section, index) => (
          <Section
            key={index}
            heading={section.heading}
            description={section.description}
            buttonLabel={section.buttonLabel} // Use null-safe access from the data
            buttonHref={section.buttonHref} // Pass only if provided in the data
            image={section.image}
            reverse={section.reverse}
          />
        ))}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default MainStartupPage;