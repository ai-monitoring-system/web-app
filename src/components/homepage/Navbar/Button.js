"use client";

import React from "react";
import styles from "../styles/Button.module.scss";

const Button = ({
  icon: Icon, // Icon component (optional)
  label, // Text label for the button
  href, // URL for navigation (optional)
  full, // Full-width button
  xl, // Extra-large button
  sm, // Small button
  secondary, // Secondary style
  tertiary, // Tertiary style
  onClick, // Click handler (optional)
}) => {
  // Construct dynamic class names
  let btnClass = `${styles.btn}`;
  if (full) btnClass += ` ${styles["btn-full"]}`;
  if (xl) btnClass += ` ${styles["btn-xl"]}`;
  if (sm) btnClass += ` ${styles["btn-sm"]}`;
  if (secondary) btnClass += ` ${styles["btn-secondary"]}`;
  else if (tertiary) btnClass += ` ${styles["btn-tertiary"]}`;
  else btnClass += ` ${styles["btn-primary"]}`; // Default to primary style

  if (!xl && !sm && !Icon) btnClass += ` ${styles["btn-base"]}`;
  if (Icon && !label) btnClass += ` ${styles["btn-icon"]}`;
  if (Icon && label) btnClass += ` ${styles["btn-gap"]}`;

  return (
    <>
      {href ? (
        <a href={href} className={btnClass} onClick={onClick}>
          {Icon && <Icon />}
          {label}
        </a>
      ) : (
        <button className={btnClass} onClick={onClick}>
          {Icon && <Icon />}
          {label}
        </button>
      )}
    </>
  );
};

export default Button;