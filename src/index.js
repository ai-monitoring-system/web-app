import React from "react";
import ReactDOM from "react-dom/client"; // Use React 18+ compatible method
import { BrowserRouter as Router } from "react-router-dom"; // Ensure Router is wrapped here
import App from "./App";
import "./styles/index.css";
import "rsuite/dist/rsuite.min.css"; // Import rsuite styles

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <Router>
      <App />
    </Router>
  </React.StrictMode>
);