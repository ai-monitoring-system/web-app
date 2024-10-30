import React, { useState } from "react";

import Streamer from "./Streamer";
import Viewer from "./Viewer";

const App = () => {
  const [mode, setMode] = useState(null);

  const renderButton = (modeType, label, color) => (
    <button
      onClick={() => setMode(modeType)}
      className={`px-4 py-2 ${color} text-white rounded-md mr-4 transition duration-150 ease-out hover:opacity-80 active:text-blue-200`}
    >
      {label}
    </button>
  );

  if (mode === "streamer") {
    return <Streamer />;
  } else if (mode === "viewer") {
    return <Viewer />;
  } else {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-4">
          AI-Powered Monitoring System
        </h1>
        <p>Please select a mode:</p>
        <div className="mt-4">
          {renderButton("streamer", "Streamer", "bg-green-500")}
          {renderButton("viewer", "Viewer", "bg-blue-500")}
        </div>
      </div>
    );
  }
};

export default App;
