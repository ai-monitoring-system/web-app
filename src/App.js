import React, { useState } from "react";

import Streamer from "./Streamer";
import Viewer from "./Viewer";

const App = () => {
  const [mode, setMode] = useState(null);

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
          <button
            onClick={() => setMode("streamer")}
            className="px-4 py-2 bg-green-500 text-white rounded-md mr-4"
          >
            Streamer
          </button>
          <button
            onClick={() => setMode("viewer")}
            className="px-4 py-2 bg-blue-500 text-white rounded-md"
          >
            Viewer
          </button>
        </div>
      </div>
    );
  }
};

export default App;
