import React from "react";
import PropTypes from "prop-types";
import styles from "./components/homepage/Navbar/OutlineStructure.module.scss";

const Skeleton = ({ width = "100%", height = "1rem", margin = "0" }) => {
  return (
    <div
      className={styles.skeleton}
      style={{
        width: width,
        height: height,
        marginBottom: margin,
      }}
    />
  );
};

Skeleton.propTypes = {
  width: PropTypes.string,
  height: PropTypes.string,
  margin: PropTypes.string,
};

export default Skeleton;