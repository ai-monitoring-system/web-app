import React, { useState } from "react";
import { FaPalette, FaBell } from "react-icons/fa";
import { useTheme } from "../../context/ThemeContext";
import { useNotifSettings } from "../../context/NotificationSettingsContext";

const SettingsSection = ({ title, icon: Icon, children, color = "blue" }) => {
  const colorSchemes = {
    blue: {
      gradient: "from-blue-600 to-blue-400",
      icon: "text-blue-500",
      light: "bg-blue-100"
    },
    purple: {
      gradient: "from-purple-600 to-purple-400",
      icon: "text-purple-500",
      light: "bg-purple-100"
    }
  };

  const colors = colorSchemes[color];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-lg transition-all duration-500">
      <div className="flex items-center gap-3 mb-4">
        <div className={`p-2.5 ${colors.light} rounded-lg`}>
          <Icon className={`text-2xl ${colors.icon}`} />
        </div>
        <h3 className={`text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${colors.gradient}`}>
          {title}
        </h3>
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
};

const Settings = () => {
  const { stagedSettings, updateStagedTheme, applySettings, discardChanges } = useTheme();
  const { stagedNotifSettings, updateStagedNotifSettings, applyNotifSettings, discardNotifChanges } = useNotifSettings();
  const [isEditing, setIsEditing] = useState(false);

  const colorPresets = [
    { color: "#3B82F6", label: "Blue" },
    { color: "#10B981", label: "Green" },
    { color: "#8B5CF6", label: "Purple" },
    { color: "#EF4444", label: "Red" },
    { color: "#F59E0B", label: "Orange" },
    { color: "#EC4899", label: "Pink" },
    { color: "#6B7280", label: "Gray" },
    { color: "#1E40AF", label: "Dark Blue" }
  ];

  // Appearance handlers
  const handleAppearanceChange = (key, value) => {
    updateStagedTheme({ [key]: value });
    setIsEditing(true);
  };

  // Notification handlers
  const handleNotificationToggle = (e) => {
    updateStagedNotifSettings({ enabled: e.target.checked });
    setIsEditing(true);
  };

  const handleCooldownChange = (e) => {
    updateStagedNotifSettings({ cooldown: parseInt(e.target.value, 10) });
    setIsEditing(true);
  };

  const getCooldownLabel = (value) => {
    const mapping = ["1 second", "10 seconds", "1 minute", "10 minutes", "1 hour"];
    return mapping[value] || "";
  };

  const handleSaveChanges = () => {
    applySettings();
    applyNotifSettings();
    setIsEditing(false);
  };

  const handleCancel = () => {
    discardChanges();
    discardNotifChanges();
    setIsEditing(false);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header with conditional Save/Cancel buttons */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Settings</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Customize your experience</p>
        </div>
        {isEditing && (
          <div className="flex space-x-4">
            <button onClick={handleCancel} className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition duration-200">
              Cancel
            </button>
            <button onClick={handleSaveChanges} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200">
              Save Changes
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Appearance Section */}
        <SettingsSection title="Appearance" icon={FaPalette} color="purple">
          <div>
            <p className="text-gray-600 dark:text-gray-400 mb-3">
              Select a preset theme color:
            </p>
            <div className="flex flex-wrap gap-3">
              {colorPresets.map(({ color, label }) => (
                <button
                  key={color}
                  onClick={() => handleAppearanceChange("sidebarColor", color)}
                  title={label}
                  className={`w-10 h-10 rounded-lg transition-transform duration-300 ${
                    stagedSettings.sidebarColor.toLowerCase() === color.toLowerCase()
                      ? "ring-2 ring-offset-2 ring-purple-500"
                      : "hover:ring-2 hover:ring-offset-2 hover:ring-gray-300"
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            <button
              onClick={() => handleAppearanceChange("sidebarColor", "#3B82F6")}
              className="mt-4 inline-flex items-center space-x-2 text-sm text-purple-600 hover:text-purple-700 transition-colors"
            >
              <span>Reset to Default Color</span>
            </button>
          </div>
        </SettingsSection>

        {/* Notifications Section */}
        <SettingsSection title="Notifications" icon={FaBell} color="blue">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-base font-semibold text-gray-700 dark:text-gray-300">
                Enable Notifications
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={stagedNotifSettings.enabled}
                  onChange={handleNotificationToggle}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300/20 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>
            {stagedNotifSettings.enabled && (
              <div>
                <label className="block text-base font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Notification Cooldown
                </label>
                <input
                  type="range"
                  min="0"
                  max="4"
                  step="1"
                  value={stagedNotifSettings.cooldown}
                  onChange={handleCooldownChange}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mt-2">
                  <span>1s</span>
                  <span>10s</span>
                  <span>1m</span>
                  <span>10m</span>
                  <span>1h</span>
                </div>
                <div className="mt-2 text-gray-700 dark:text-gray-300">
                  {getCooldownLabel(stagedNotifSettings.cooldown)}
                </div>
              </div>
            )}
          </div>
        </SettingsSection>
      </div>
    </div>
  );
};

export default Settings;
