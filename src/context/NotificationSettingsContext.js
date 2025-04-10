// NotificationSettingsContext.js
import React, { createContext, useState, useContext, useEffect } from "react";
import { auth, db } from "../utils/config";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

// Default notification settings with a slider value corresponding to "1 minute"
const defaultNotifSettings = {
  enabled: true,
  cooldown: 2, // slider value: 0->1s, 1->10s, 2->60s, 3->600s, 4->3600s
};

const cooldownMapping = [1, 10, 60, 600, 3600];

const NotificationSettingsContext = createContext();

export const NotificationSettingsProvider = ({ children }) => {
  const [notifSettings, setNotifSettings] = useState(defaultNotifSettings);
  const [stagedNotifSettings, setStagedNotifSettings] =
    useState(defaultNotifSettings);

  const fetchSettings = async (user) => {
    try {
      const userRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(userRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        const settings = data.settings || {};
        const newSettings = {
          enabled:
            settings.notificationsEnabled !== undefined
              ? settings.notificationsEnabled
              : defaultNotifSettings.enabled,
          cooldown:
            settings.notifCooldown &&
            cooldownMapping.indexOf(settings.notifCooldown) !== -1
              ? cooldownMapping.indexOf(settings.notifCooldown)
              : defaultNotifSettings.cooldown,
        };
        setNotifSettings(newSettings);
        setStagedNotifSettings(newSettings);
      }
    } catch (err) {
      console.error(
        "Error fetching notification settings from Firestore:",
        err
      );
    }
  };

  // Fetch settings when the user is authenticated
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchSettings(user);
      }
    });
    return unsubscribe;
  }, []);

  const updateStagedNotifSettings = (newSettings) => {
    setStagedNotifSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const applyNotifSettings = async () => {
    setNotifSettings(stagedNotifSettings);
    const user = auth.currentUser;
    if (user) {
      try {
        const userRef = doc(db, "users", user.uid);
        await setDoc(
          userRef,
          {
            settings: {
              notifCooldown: cooldownMapping[stagedNotifSettings.cooldown],
              notificationsEnabled: stagedNotifSettings.enabled,
            },
          },
          { merge: true }
        );
      } catch (err) {
        console.error(
          "Error updating notification settings in Firestore:",
          err
        );
      }
    }
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
