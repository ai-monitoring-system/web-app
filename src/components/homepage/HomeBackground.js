import React from "react";
import styles from "./styles/WelcomePageHome.module.scss";
import background from "../../assets/images/background.png";

const HeroBackground = () => (
  <>
    <div className={styles.background}></div>
    <div className={styles.backgroundImage}>
      <img
        alt="Background"
        src={background}
        style={{
          objectFit: "cover",
          width: "100%",
          height: "100vh",
          position: "absolute",
        }}
      />
    </div>
  </>
);

export default HeroBackground;