import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./styles/index.css";
import "rsuite/dist/rsuite.min.css"; // Import rsuite styles
import AppRouter from "./app/(Startup)/Router";

ReactDOM.render(
  <React.StrictMode>
    <AppRouter />
  </React.StrictMode>,
  document.getElementById("root")
);