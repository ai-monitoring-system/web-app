import React from "react";
import Router from "./app/(Startup)/Router";
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { NotificationSettingsProvider } from './context/NotificationSettingsContext';

const App = () => {
  return (
    <AuthProvider>
      <ThemeProvider>
        <NotificationSettingsProvider>
          <Router />
        </NotificationSettingsProvider>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;