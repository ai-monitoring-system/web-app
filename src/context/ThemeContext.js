import React, { createContext, useState, useContext, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [themeSettings, setThemeSettings] = useState(() => {
    const savedSettings = localStorage.getItem('themeSettings');
    return savedSettings ? JSON.parse(savedSettings) : {
      darkMode: false,
      sidebarColor: '#3B82F6',
      accentColor: '#2563EB',
    };
  });

  const [stagedSettings, setStagedSettings] = useState(themeSettings);

  const toggleDarkMode = (value) => {
    const newSettings = { ...themeSettings, darkMode: value };
    setThemeSettings(newSettings);
    setStagedSettings(prev => ({ ...prev, darkMode: value }));
    localStorage.setItem('themeSettings', JSON.stringify(newSettings));
  };

  const updateStagedTheme = (newSettings) => {
    setStagedSettings(prev => ({ ...prev, ...newSettings }));
  };

  const applySettings = () => {
    setThemeSettings(stagedSettings);
    localStorage.setItem('themeSettings', JSON.stringify(stagedSettings));
  };

  const discardChanges = () => {
    setStagedSettings(themeSettings);
  };

  return (
    <ThemeContext.Provider value={{ 
      themeSettings,
      stagedSettings,
      updateStagedTheme,
      applySettings,
      discardChanges,
      toggleDarkMode
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext); 