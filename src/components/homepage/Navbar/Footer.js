import React from "react";
import { FaGithub } from "react-icons/fa"; // Import GitHub icon
import styles from "../styles/Footer.module.scss"; // Updated import path

const AppConfig = {
  siteName: "AI Monitoring System",
  siteLogo: "/images/logo.png",
  githubUrl: "https://github.com/ai-monitoring-system/web-app",
};

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className={styles.footerWrapper}>
      <div className={styles.footer}>
        {/* Logo */}
        <div className={styles.logoContainer}>
          <button
            onClick={scrollToTop}
            aria-label="Home"
            className={styles.logoButton}
          >
            <img
              src={AppConfig.siteLogo}
              alt={`${AppConfig.siteName} Logo`}
              className={styles.logo}
            />
          </button>
        </div>

        {/* Social Icons */}
        <div className={styles.socialIcons}>
          <a
            href={AppConfig.githubUrl}
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
            className={styles.iconLink} // Added class for styling
          >
            <FaGithub className={styles.icon} />
          </a>
        </div>

        {/* Footer Text */}
        <div className={styles.text}>
          <span>
            &copy; {new Date().getFullYear()} {AppConfig.siteName}. All rights
            reserved.
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;