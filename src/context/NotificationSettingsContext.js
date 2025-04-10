// NotificationSettingsContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import { auth, db } from "../utils/config";
import { doc, setDoc, getDoc } from "firebase/firestore";

// Default notification settings with a slider value corresponding to "1 minute"
const defaultNotifSettings = {
  enabled: true,
  cooldown: 2, // slider value: 0->1s, 1->10s, 2->60s, 3->600s, 4->3600s
};

// Mapping from slider index to seconds
const cooldownMapping = [1, 10, 60, 600, 3600];

const NotificationSettingsContext = createContext();

export const NotificationSettingsProvider = ({ children }) => {
  const [notifSettings, setNotifSettings] = useState(defaultNotifSettings);
  const [stagedNotifSettings, setStagedNotifSettings] = useState(defaultNotifSettings);

  // Fetch current user notification settings from Firestore when user is available.
  useEffect(() => {
    const fetchSettings = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const userRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(userRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            const newSettings = {
              enabled: data.notificationsEnabled !== undefined
                ? data.notificationsEnabled
                : defaultNotifSettings.enabled,
              // Determine the slider index from the stored cooldown in seconds.
              cooldown: cooldownMapping.indexOf(data.notifCooldown) !== -1
                ? cooldownMapping.indexOf(data.notifCooldown)
                : defaultNotifSettings.cooldown,
            };
            setNotifSettings(newSettings);
            setStagedNotifSettings(newSettings);
          }
        } catch (err) {
          console.error("Error fetching notification settings from Firestore:", err);
        }
      }
    };

    fetchSettings();
  }, [auth.currentUser]);

  const updateStagedNotifSettings = (newSettings) => {
    setStagedNotifSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const applyNotifSettings = async () => {
    setNotifSettings(stagedNotifSettings);
    const user = auth.currentUser;
    if (user) {
      try {
        const userRef = doc(db, "users", user.uid);
        await setDoc(userRef, {
          notifCooldown: cooldownMapping[stagedNotifSettings.cooldown],
          notificationsEnabled: stagedNotifSettings.enabled,
        }, { merge: true });
      } catch (err) {
        console.error("Error updating notification settings in Firestore:", err);
      }
    }
  };

  const discardNotifChanges = () => {
    setStagedNotifSettings(notifSettings);
  };

  return (
    <NotificationSettingsContext.Provider value={{
      notifSettings,
      stagedNotifSettings,
      updateStagedNotifSettings,
      applyNotifSettings,
      discardNotifChanges,
    }}>
      {children}
    </NotificationSettingsContext.Provider>
  );
};

export const useNotifSettings = () => useContext(NotificationSettingsContext);
