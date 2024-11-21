import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./index.css"; // Your custom styles (if any)
import "rsuite/dist/rsuite.min.css"; // Import rsuite styles
import AppRouter from "./Router"; // Import the router

ReactDOM.render(
  <React.StrictMode>
    <AppRouter />
  </React.StrictMode>,
  document.getElementById("root")
);