import React, { useState, useEffect } from "react";
import Router from "./app/(Startup)/Router";
import { auth } from "./utils/config";
import { onAuthStateChanged } from "firebase/auth";
import { ThemeProvider } from './context/ThemeContext';

const App = () => {
  const [user, setUser] = useState(null);

  // Monitor authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  return (
    <ThemeProvider>
      <Router user={user} />
    </ThemeProvider>
  );
};

export default App;