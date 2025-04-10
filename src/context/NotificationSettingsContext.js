import React, { createContext, useState, useContext } from "react";

const NotificationSettingsContext = createContext();

export const NotificationSettingsProvider = ({ children }) => {
  const initialSettings = {
    enabled: true,
    frequency: "immediate",
  };

  const [notifSettings, setNotifSettings] = useState(() => {
    const saved = localStorage.getItem("notifSettings");
    return saved ? JSON.parse(saved) : initialSettings;
  });

  const [stagedNotifSettings, setStagedNotifSettings] = useState(notifSettings);

  const updateStagedNotifSettings = (newSettings) => {
    setStagedNotifSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const applyNotifSettings = () => {
    setNotifSettings(stagedNotifSettings);
    localStorage.setItem("notifSettings", JSON.stringify(stagedNotifSettings));
  };

  const discardNotifChanges = () => {
    setStagedNotifSettings(notifSettings);
  };

  return (
    <NotificationSettingsContext.Provider
      value={{
        notifSettings,
        stagedNotifSettings,
        updateStagedNotifSettings,
        applyNotifSettings,
        discardNotifChanges,
      }}
    >
      {children}
    </NotificationSettingsContext.Provider>
  );
};

export const useNotifSettings = () => useContext(NotificationSettingsContext);
