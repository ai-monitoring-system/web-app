"use client";

import React, { useEffect, useRef } from "react";
import styles from "./styles/WelcomePageHome.module.scss";
import Button from "./Navbar/Button";

const Section = ({ heading, description, buttonLabel, buttonHref, image, reverse }) => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const section = sectionRef.current;
      if (section) {
        const rect = section.getBoundingClientRect();
        if (rect.top >= 0 && rect.bottom <= window.innerHeight) {
          section.classList.add(styles.visible);
        } else {
          section.classList.remove(styles.visible);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className={styles.sectionWrapper} ref={sectionRef}>
      <div className={`${styles.section} ${reverse ? styles.reverse : ""}`}>
        {/* Image */}
        {image && (
          <div className={styles.imageContainer}>
            <img
              src={image}
              alt={heading || ""}
              className="rounded-lg shadow-lg max-w-full h-auto"
            />
          </div>
        )}

        {/* Text Content */}
        <div className={styles.contentContainer}>
          {heading && <h2 className={styles.heading}>{heading}</h2>}
          {description && <p className={styles.description}>{description}</p>}

          {buttonLabel && (
            <Button
              xl
              href={buttonHref}
              label={buttonLabel}
              className={styles.button} // Apply button styles from SCSS
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Section;