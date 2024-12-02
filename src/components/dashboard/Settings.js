import React, { useState, useEffect } from "react";
import { FaCog, FaBell, FaShieldAlt, FaPalette, FaVideo, FaMoon, FaGlobe, FaDatabase, FaUserCog, FaSignal, FaRobot, FaEye, FaBrain, FaSlidersH, FaEnvelope, FaMobile, FaUser } from "react-icons/fa";
import { auth } from "../../utils/config";
import { useTheme } from '../../context/ThemeContext';

const Settings = () => {
  const {
    themeSettings,
    stagedSettings,
    updateStagedTheme,
    applySettings,
    discardChanges
  } = useTheme();
  const [notifications, setNotifications] = useState({
    emailAlerts: {
      enabled: true,
      frequency: 'immediate',
      types: {
        motionDetection: true,
        objectDetection: true,
        faceDetection: true,
        anomalyDetection: true,
        systemAlerts: true
      }
    },
    smsAlerts: {
      enabled: false,
      frequency: 'immediate',
      types: {
        motionDetection: false,
        objectDetection: false,
        faceDetection: false,
        anomalyDetection: true,
        systemAlerts: true
      },
      phoneNumber: ''
    },
    pushNotifications: {
      enabled: true,
      types: {
        motionDetection: true,
        objectDetection: true,
        faceDetection: true,
        anomalyDetection: true,
        systemAlerts: true
      }
    },
    preferences: {
      quietHours: {
        enabled: false,
        start: '22:00',
        end: '07:00'
      },
      minConfidenceScore: 75
    }
  });
  const [videoSettings, setVideoSettings] = useState({
    defaultQuality: "720p",
    autoplay: true,
    hardwareAcceleration: true,
  });
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const [streamSettings, setStreamSettings] = useState({
    defaultResolution: "1080p",
    bitrateLimit: "6000",
    encoderPreset: "balanced",
    audioQuality: "high",
  });
  const [storageSettings, setStorageSettings] = useState({
    autoDeleteAfter: "30",
    saveStreamRecordings: true,
    compressionLevel: "medium",
    backupEnabled: false,
  });
  const [aiSettings, setAiSettings] = useState({
    selectedModel: 'standard',
    detectionThreshold: 0.75,
    enabledDetectors: {
      motion: true,
      object: true,
      face: true,
      anomaly: true
    },
    processingQuality: 'balanced',
    autoAdjust: true
  });

  // Simulate loading settings from a backend/localStorage
  useEffect(() => {
    // Here you would typically fetch user settings
    const loadSettings = () => {
      // Simulated delay to demonstrate loading state
      setTimeout(() => {
        setIsPageLoaded(true);
      }, 100);
    };

    loadSettings();
  }, []);

  const handleNotificationChange = (category, setting, value) => {
    setNotifications(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value
      }
    }));
  };

  const handleNotificationTypeChange = (category, type, value) => {
    setNotifications(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        types: {
          ...prev[category].types,
          [type]: value
        }
      }
    }));
  };

  const handleVideoSettingChange = (key, value) => {
    setVideoSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleStreamSettingChange = (key, value) => {
    setStreamSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleStorageSettingChange = (key, value) => {
    setStorageSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleAppearanceChange = (key, value) => {
    if (key !== 'darkMode') {
      updateStagedTheme({ [key]: value });
    }
  };

  const handleSaveChanges = () => {
    applySettings();
    // Show success message
    // You can add a toast notification here
  };

  const handleCancel = () => {
    discardChanges();
    // Optionally show a notification that changes were discarded
  };

  const handleAISettingChange = (key, value) => {
    setAiSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleDetectorToggle = (detector) => {
    setAiSettings(prev => ({
      ...prev,
      enabledDetectors: {
        ...prev.enabledDetectors,
        [detector]: !prev.enabledDetectors[detector]
      }
    }));
  };

  const SettingsSection = ({ title, icon: Icon, children, color = "blue" }) => {
    // Define color schemes for different sections
    const colorSchemes = {
      blue: {
        light: "bg-blue-100 dark:bg-blue-900/30",
        icon: "text-blue-500 dark:text-blue-400",
        gradient: "from-blue-600 to-blue-400 dark:from-blue-400 dark:to-blue-300",
        glow: "hover:border-blue-200 dark:hover:border-blue-500/30 hover:shadow-blue-100/40 dark:hover:shadow-blue-500/20",
        blur: "bg-blue-50 dark:bg-blue-900/20"
      },
      purple: {
        light: "bg-purple-100 dark:bg-purple-900/30",
        icon: "text-purple-500 dark:text-purple-400",
        gradient: "from-purple-600 to-purple-400 dark:from-purple-400 dark:to-purple-300",
        glow: "hover:border-purple-200 dark:hover:border-purple-500/30 hover:shadow-purple-100/40 dark:hover:shadow-purple-500/20",
        blur: "bg-purple-50 dark:bg-purple-900/20"
      },
      green: {
        light: "bg-green-100 dark:bg-green-900/30",
        icon: "text-green-500 dark:text-green-400",
        gradient: "from-green-600 to-green-400 dark:from-green-400 dark:to-green-300",
        glow: "hover:border-green-200 dark:hover:border-green-500/30 hover:shadow-green-100/40 dark:hover:shadow-green-500/20",
        blur: "bg-green-50 dark:bg-green-900/20"
      }
    };

    const colors = colorSchemes[color];

    return (
      <div 
        className="h-full bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-lg 
        transition-all duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)] 
        hover:shadow-2xl hover:-translate-y-0.5 hover:scale-[1.003] 
        relative overflow-hidden will-change-transform"
      >
        {/* Decorative background elements */}
        <div 
          className={`absolute top-0 right-0 w-32 h-32 ${colors.blur} rounded-full 
          -translate-x-16 -translate-y-16 blur-2xl transition-all duration-1000 
          ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:blur-3xl group-hover:opacity-80`}
        />
        <div 
          className={`absolute bottom-0 left-0 w-32 h-32 ${colors.blur} rounded-full 
          translate-x-16 translate-y-16 blur-2xl transition-all duration-1000 
          ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:blur-3xl group-hover:opacity-80`}
        />

        {/* Content container */}
        <div className="relative">
          <div className="flex items-center gap-3 mb-6">
            <div className={`p-2.5 ${colors.light} rounded-2xl shadow-sm`}>
              <Icon className={`text-2xl ${colors.icon}`} />
            </div>
            <h3 
              className={`text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${colors.gradient} transition-all duration-300`}
            >
              {title}
            </h3>
          </div>

          <div className="space-y-4">
            {/* Wrap each direct child in a styled container */}
            {React.Children.map(children, child => (
              <div className={`group p-4 rounded-xl border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:shadow-lg ${colors.glow}`}>
                {child}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      className={`p-6 space-y-6 transform transition-all duration-300 ${
        isPageLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
    >
      {/* Header with buttons */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
            Settings
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Customize your experience and preferences
          </p>
        </div>
        
        {/* Save and Cancel Buttons */}
        <div className="flex space-x-4">
          <button
            onClick={handleCancel}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200 flex items-center space-x-2"
          >
            <span>Cancel</span>
          </button>
          <button
            onClick={handleSaveChanges}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 flex items-center space-x-2"
          >
            <span>Save Changes</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 grid-flow-row-dense grid-auto-rows-min">
        {/* Appearance Settings */}
        <SettingsSection title="Appearance" icon={FaPalette} color="purple">
          <div className="space-y-6">
            {/* Color Settings */}
            <div className="group transition-all duration-200">
              <div className="mb-4">
                <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">Color Settings</h3>
                <p className="text-base text-gray-500 dark:text-gray-400">Customize your interface colors</p>
              </div>

              <div className="space-y-6">
                {/* Sidebar Color */}
                <div>
                  <label className="text-base font-bold text-gray-700 dark:text-gray-300 block mb-2">
                    Sidebar Color
                  </label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="color"
                      value={stagedSettings.sidebarColor}
                      onChange={(e) => handleAppearanceChange('sidebarColor', e.target.value)}
                      className="h-10 w-10 rounded-lg cursor-pointer border border-gray-200 dark:border-gray-700"
                    />
                    <input
                      type="text"
                      value={stagedSettings.sidebarColor}
                      onChange={(e) => handleAppearanceChange('sidebarColor', e.target.value)}
                      className="flex-1 px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 transition-all duration-300"
                      placeholder="#3B82F6"
                    />
                  </div>
                </div>

                {/* Color Presets */}
                <div>
                  <label className="text-base font-bold text-gray-700 dark:text-gray-300 block mb-2">
                    Preset Colors
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {[
                      { color: '#3B82F6', label: 'Blue' },
                      { color: '#10B981', label: 'Green' },
                      { color: '#8B5CF6', label: 'Purple' },
                      { color: '#EF4444', label: 'Red' },
                      { color: '#F59E0B', label: 'Orange' },
                      { color: '#EC4899', label: 'Pink' },
                      { color: '#6B7280', label: 'Gray' },
                      { color: '#1E40AF', label: 'Dark Blue' }
                    ].map(({ color, label }) => (
                      <button
                        key={color}
                        onClick={() => handleAppearanceChange('sidebarColor', color)}
                        className="relative group"
                        title={label}
                      >
                        <div
                          className={`w-10 h-10 rounded-lg transition-all duration-300 transform 
                            group-hover:scale-105 group-hover:shadow-lg group-active:scale-95
                            ${stagedSettings.sidebarColor.toLowerCase() === color.toLowerCase()
                              ? 'ring-2 ring-offset-2 ring-purple-500 dark:ring-offset-gray-800'
                              : 'hover:ring-2 hover:ring-offset-2 hover:ring-gray-300 dark:hover:ring-gray-500 dark:ring-offset-gray-800'
                            }`}
                          style={{ backgroundColor: color }}
                        >
                          {stagedSettings.sidebarColor.toLowerCase() === color.toLowerCase() && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <svg
                                className="w-6 h-6 text-white drop-shadow-md"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            </div>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Preview */}
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <label className="text-base font-bold text-gray-700 dark:text-gray-300 block mb-3">
                    Preview
                  </label>
                  <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-4">
                      <div
                        className="w-16 h-32 rounded-lg overflow-hidden shadow-lg"
                        style={{ backgroundColor: stagedSettings.sidebarColor }}
                      >
                        <div className="p-2 space-y-2">
                          <div className="w-8 h-8 bg-white bg-opacity-20 rounded-lg"></div>
                          <div className="w-8 h-8 bg-white bg-opacity-20 rounded-lg"></div>
                          <div className="w-8 h-8 bg-white bg-opacity-20 rounded-lg"></div>
                        </div>
                      </div>
                      <div
                        className="w-96 h-32 rounded-lg overflow-hidden shadow-lg"
                        style={{ backgroundColor: stagedSettings.sidebarColor }}
                      >
                        <div className="p-4 space-y-2">
                          <div className="h-6 bg-white bg-opacity-20 rounded-lg w-3/4"></div>
                          <div className="h-6 bg-white bg-opacity-20 rounded-lg w-1/2"></div>
                          <div className="h-6 bg-white bg-opacity-20 rounded-lg w-2/3"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Reset Button */}
                <button
                  onClick={() => handleAppearanceChange('sidebarColor', '#3B82F6')}
                  className="inline-flex items-center space-x-2 text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors duration-200"
                >
                  <svg
                    className="w-4 h-4 transform group-hover:rotate-180 transition-transform duration-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  <span>Reset to Default Color</span>
                </button>
              </div>
            </div>
          </div>
        </SettingsSection>

        {/* Notification Settings */}
        <SettingsSection title="Notifications" icon={FaBell} color="blue">
          <div className="space-y-6">
            {/* Email Notifications */}
            <div className="group transition-all duration-200">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">Email Notifications</h3>
                  <p className="text-base text-gray-500 dark:text-gray-400">Receive AI detection alerts via email</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={notifications.emailAlerts.enabled}
                    onChange={(e) => handleNotificationChange('emailAlerts', 'enabled', e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300/20 dark:peer-focus:ring-blue-800/20 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>

              {notifications.emailAlerts.enabled && (
                <div className="space-y-4">
                  {/* Alert Types Grid */}
                  <div>
                    <label className="text-base font-bold text-gray-700 dark:text-gray-300 block mb-2">
                      Alert Types
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {Object.entries(notifications.emailAlerts.types).map(([type, enabled]) => (
                        <div 
                          key={type}
                          className="flex items-center justify-between p-2.5 rounded-lg bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                        >
                          <span className="text-base text-gray-600 dark:text-gray-400">
                            {type.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                          </span>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              className="sr-only peer"
                              checked={enabled}
                              onChange={(e) => {
                                // Prevent propagation to stop the container from triggering hover effects
                                e.stopPropagation();
                                handleNotificationTypeChange('emailAlerts', type, e.target.checked);
                              }}
                            />
                            <div className="w-8 h-4 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300/20 dark:peer-focus:ring-blue-800/20 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-transform dark:border-gray-600 peer-checked:bg-blue-500"></div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Frequency Selector */}
                  <div>
                    <label className="text-base font-bold text-gray-700 dark:text-gray-300 block mb-2">
                      Alert Frequency
                    </label>
                    <select
                      value={notifications.emailAlerts.frequency}
                      onChange={(e) => handleNotificationChange('emailAlerts', 'frequency', e.target.value)}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 transition-all duration-300"
                    >
                      <option value="immediate">Immediate</option>
                      <option value="hourly">Hourly Digest</option>
                      <option value="daily">Daily Summary</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* SMS Notifications */}
            <div className="group transition-all duration-200">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">SMS Notifications</h3>
                  <p className="text-base text-gray-500 dark:text-gray-400">Get instant alerts via text message</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={notifications.smsAlerts.enabled}
                    onChange={(e) => handleNotificationChange('smsAlerts', 'enabled', e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300/20 dark:peer-focus:ring-blue-800/20 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>

              {notifications.smsAlerts.enabled && (
                <div className="space-y-4">
                  {/* Phone Number Input */}
                  <div>
                    <label className="text-base font-bold text-gray-700 dark:text-gray-300 block mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={notifications.smsAlerts.phoneNumber}
                      onChange={(e) => handleNotificationChange('smsAlerts', 'phoneNumber', e.target.value)}
                      placeholder="+1 (555) 000-0000"
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 text-sm"
                    />
                  </div>

                  {/* SMS Alert Types */}
                  <div>
                    <label className="text-base font-bold text-gray-700 dark:text-gray-300 block mb-2">
                      SMS Alert Types
                    </label>
                    <div className="space-y-2">
                      {Object.entries(notifications.smsAlerts.types).map(([type, enabled]) => (
                        <div key={type} className="flex items-center justify-between p-2.5 rounded-lg bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                          <span className="text-base text-gray-600 dark:text-gray-400">
                            {type.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                          </span>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              className="sr-only peer"
                              checked={enabled}
                              onChange={(e) => handleNotificationTypeChange('smsAlerts', type, e.target.checked)}
                            />
                            <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Advanced Preferences */}
            <div className="group transition-all duration-200">
              <div className="mb-4">
                <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">Advanced Preferences</h3>
                <p className="text-base text-gray-500 dark:text-gray-400">Fine-tune your notification settings</p>
              </div>

              <div className="space-y-4">
                {/* Quiet Hours */}
                <div>
                  <label className="text-base font-bold text-gray-700 dark:text-gray-300 block mb-2">
                    Quiet Hours
                  </label>
                  <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Pause notifications during specific hours</p>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={notifications.preferences.quietHours.enabled}
                          onChange={(e) => handleNotificationChange('preferences', 'quietHours', {
                            ...notifications.preferences.quietHours,
                            enabled: e.target.checked
                          })}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    {notifications.preferences.quietHours.enabled && (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm text-gray-600 dark:text-gray-400">Start Time</label>
                          <input
                            type="time"
                            value={notifications.preferences.quietHours.start}
                            onChange={(e) => handleNotificationChange('preferences', 'quietHours', {
                              ...notifications.preferences.quietHours,
                              start: e.target.value
                            })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 text-sm"
                          />
                        </div>
                        <div>
                          <label className="text-sm text-gray-600 dark:text-gray-400">End Time</label>
                          <input
                            type="time"
                            value={notifications.preferences.quietHours.end}
                            onChange={(e) => handleNotificationChange('preferences', 'quietHours', {
                              ...notifications.preferences.quietHours,
                              end: e.target.value
                            })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 text-sm"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Minimum Confidence Score */}
                <div>
                  <label className="text-base font-bold text-gray-700 dark:text-gray-300 block mb-2">
                    Minimum AI Confidence Score
                  </label>
                  <div className="flex items-center space-x-4">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={notifications.preferences.minConfidenceScore}
                      onChange={(e) => handleNotificationChange('preferences', 'minConfidenceScore', parseInt(e.target.value))}
                      className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                    />
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400 w-12 text-center">
                      {notifications.preferences.minConfidenceScore}%
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Only receive notifications when AI detection confidence exceeds this threshold
                  </p>
                </div>
              </div>
            </div>
          </div>
        </SettingsSection>

        {/* Video Settings */}
        <SettingsSection title="Video Settings" icon={FaVideo} color="green">
          <div className="space-y-6">
            {/* Quality Settings */}
            <div className="group transition-all duration-200">
              <div className="mb-4">
                <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">Quality Settings</h3>
                <p className="text-base text-gray-500 dark:text-gray-400">Configure video playback quality</p>
              </div>

              <div className="space-y-6">
                {/* Default Quality Selector */}
                <div>
                  <label className="text-base font-bold text-gray-700 dark:text-gray-300 block mb-2">
                    Default Quality
                  </label>
                  <select
                    value={videoSettings.defaultQuality}
                    onChange={(e) => handleVideoSettingChange('defaultQuality', e.target.value)}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 text-sm"
                  >
                    <option value="1080p">1080p (Full HD)</option>
                    <option value="720p">720p (HD)</option>
                    <option value="480p">480p (SD)</option>
                    <option value="360p">360p (Low)</option>
                  </select>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Higher quality requires more bandwidth
                  </p>
                </div>

                {/* Performance Options */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-base font-bold text-gray-700 dark:text-gray-300">Autoplay</span>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Automatically play videos when loaded
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={videoSettings.autoplay}
                        onChange={() => handleVideoSettingChange('autoplay', !videoSettings.autoplay)}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300/20 dark:peer-focus:ring-green-800/20 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div>
                      <span className="text-base font-bold text-gray-700 dark:text-gray-300">Hardware Acceleration</span>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Use GPU for better performance
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={videoSettings.hardwareAcceleration}
                        onChange={() => handleVideoSettingChange('hardwareAcceleration', !videoSettings.hardwareAcceleration)}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300/20 dark:peer-focus:ring-green-800/20 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
                    </label>
                  </div>
                </div>

                {/* Performance Status */}
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-4">Performance Status</h4>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600 dark:text-gray-400 font-medium">Buffer Health</span>
                        <span className="text-gray-900 dark:text-gray-100">Excellent</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '95%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600 dark:text-gray-400 font-medium">Playback Smoothness</span>
                        <span className="text-gray-900 dark:text-gray-100">60 fps</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '90%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </SettingsSection>

        {/* Stream Settings */}
        <SettingsSection title="Stream Settings" icon={FaSignal} color="purple">
          <div className="space-y-6">
            {/* Stream Configuration */}
            <div className="group transition-all duration-200">
              <div className="mb-4">
                <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">Stream Configuration</h3>
                <p className="text-base text-gray-500 dark:text-gray-400">Configure your stream output settings</p>
              </div>

              <div className="space-y-6">
                {/* Resolution Settings */}
                <div>
                  <label className="text-base font-bold text-gray-700 dark:text-gray-300 block mb-2">
                    Default Resolution
                  </label>
                  <select
                    value={streamSettings.defaultResolution}
                    onChange={(e) => handleStreamSettingChange('defaultResolution', e.target.value)}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 dark:bg-gray-700 dark:border-gray-600 text-sm"
                  >
                    <option value="1080p">1080p (Full HD)</option>
                    <option value="1440p">1440p (2K)</option>
                    <option value="2160p">2160p (4K)</option>
                  </select>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Higher resolutions require more processing power
                  </p>
                </div>

                {/* Bitrate Settings */}
                <div>
                  <label className="text-base font-bold text-gray-700 dark:text-gray-300 block mb-2">
                    Bitrate Limit (kbps)
                  </label>
                  <div className="flex items-center space-x-4">
                    <input
                      type="range"
                      min="1000"
                      max="12000"
                      step="500"
                      value={streamSettings.bitrateLimit}
                      onChange={(e) => handleStreamSettingChange('bitrateLimit', e.target.value)}
                      className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                    />
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400 w-20">
                      {streamSettings.bitrateLimit} kbps
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Adjust based on your internet upload speed
                  </p>
                </div>

                {/* Quality Presets */}
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div>
                    <label className="text-base font-bold text-gray-700 dark:text-gray-300 block mb-2">
                      Encoder Preset
                    </label>
                    <select
                      value={streamSettings.encoderPreset}
                      onChange={(e) => handleStreamSettingChange('encoderPreset', e.target.value)}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 dark:bg-gray-700 dark:border-gray-600 text-sm"
                    >
                      <option value="quality">Quality (Higher CPU Usage)</option>
                      <option value="balanced">Balanced</option>
                      <option value="performance">Performance (Lower CPU Usage)</option>
                    </select>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      Balance between quality and performance
                    </p>
                  </div>
                </div>

                {/* Audio Settings */}
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <label className="text-base font-bold text-gray-700 dark:text-gray-300 block mb-2">
                    Audio Quality
                  </label>
                  <select
                    value={streamSettings.audioQuality}
                    onChange={(e) => handleStreamSettingChange('audioQuality', e.target.value)}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 dark:bg-gray-700 dark:border-gray-600 text-sm"
                  >
                    <option value="high">High (256 kbps)</option>
                    <option value="medium">Medium (192 kbps)</option>
                    <option value="low">Low (128 kbps)</option>
                  </select>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Higher quality audio requires more bandwidth
                  </p>
                </div>
              </div>
            </div>
          </div>
        </SettingsSection>

        {/* Storage Management */}
        <SettingsSection title="Storage Management" icon={FaDatabase} color="green">
          <div className="space-y-6">
            {/* Storage Configuration */}
            <div className="group transition-all duration-200">
              <div className="mb-4">
                <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">Storage Settings</h3>
                <p className="text-base text-gray-500 dark:text-gray-400">Configure storage and retention preferences</p>
              </div>

              <div className="space-y-6">
                {/* Auto-Delete Settings */}
                <div>
                  <label className="text-base font-bold text-gray-700 dark:text-gray-300 block mb-2">
                    Auto-Delete Recordings
                  </label>
                  <select
                    value={storageSettings.autoDeleteAfter}
                    onChange={(e) => handleStorageSettingChange('autoDeleteAfter', e.target.value)}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 text-sm"
                  >
                    <option value="7">After 7 days</option>
                    <option value="30">After 30 days</option>
                    <option value="90">After 90 days</option>
                    <option value="never">Never delete</option>
                  </select>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Automatically remove old recordings to save space
                  </p>
                </div>

                {/* Storage Usage Visualization */}
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <label className="text-base font-bold text-gray-700 dark:text-gray-300 block mb-3">
                    Storage Usage
                  </label>
                  <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                    <div className="space-y-4">
                      {/* Total Storage */}
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-base font-medium text-gray-600 dark:text-gray-400">Total Storage</span>
                          <div className="text-right">
                            <span className="text-base font-bold text-gray-900 dark:text-gray-100">6.5 GB</span>
                            <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">/ 10 GB</span>
                          </div>
                        </div>
                        <div className="relative w-full h-3 bg-gray-200 rounded-full overflow-hidden dark:bg-gray-700">
                          <div 
                            className="absolute top-0 left-0 h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full transition-all duration-500 ease-in-out"
                            style={{ width: '65%' }}
                          >
                            <div className="absolute inset-0 bg-white opacity-20 animate-pulse"></div>
                          </div>
                        </div>
                      </div>

                      {/* Storage Breakdown */}
                      <div className="grid grid-cols-2 gap-4 pt-2">
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-base text-gray-600 dark:text-gray-400">Event Clips</span>
                            <span className="text-base font-medium text-gray-900 dark:text-gray-100">4.2 GB</span>
                          </div>
                          <div className="relative w-full h-2 bg-gray-200 rounded-full overflow-hidden dark:bg-gray-700">
                            <div 
                              className="absolute top-0 left-0 h-full bg-blue-500 rounded-full transition-all duration-500 ease-in-out"
                              style={{ width: '42%' }}
                            ></div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-base text-gray-600 dark:text-gray-400">Recordings</span>
                            <span className="text-base font-medium text-gray-900 dark:text-gray-100">2.3 GB</span>
                          </div>
                          <div className="relative w-full h-2 bg-gray-200 rounded-full overflow-hidden dark:bg-gray-700">
                            <div 
                              className="absolute top-0 left-0 h-full bg-purple-500 rounded-full transition-all duration-500 ease-in-out"
                              style={{ width: '23%' }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Compression Settings */}
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-base font-bold text-gray-700 dark:text-gray-300">Video Compression</span>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Optimize storage usage with compression
                      </p>
                    </div>
                    <select
                      value={storageSettings.compressionLevel}
                      onChange={(e) => handleStorageSettingChange('compressionLevel', e.target.value)}
                      className="w-48 rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 text-sm"
                    >
                      <option value="low">Low Compression</option>
                      <option value="medium">Balanced</option>
                      <option value="high">High Compression</option>
                    </select>
                  </div>
                </div>

                {/* Backup Settings */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div>
                    <span className="text-base font-bold text-gray-700 dark:text-gray-300">Automatic Backup</span>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Keep a backup of important recordings
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={storageSettings.backupEnabled}
                      onChange={() => handleStorageSettingChange('backupEnabled', !storageSettings.backupEnabled)}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300/20 dark:peer-focus:ring-green-800/20 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </SettingsSection>

        {/* AI Monitoring System */}
        <SettingsSection title="AI Monitoring System" icon={FaRobot} color="purple">
          <div className="space-y-6">
            {/* AI Configuration */}
            <div className="group transition-all duration-200">
              <div className="mb-4">
                <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">AI Configuration</h3>
                <p className="text-base text-gray-500 dark:text-gray-400">Configure AI detection and monitoring settings</p>
              </div>

              <div className="space-y-6">
                {/* Model Selection */}
                <div>
                  <label className="text-base font-bold text-gray-700 dark:text-gray-300 block mb-2">
                    Detection Model
                  </label>
                  <select
                    value={aiSettings.selectedModel}
                    onChange={(e) => handleAISettingChange('selectedModel', e.target.value)}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 dark:bg-gray-700 dark:border-gray-600 text-sm"
                  >
                    <option value="standard">Standard (Balanced)</option>
                    <option value="lightweight">Lightweight (Faster)</option>
                    <option value="advanced">Advanced (More Accurate)</option>
                  </select>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Select the AI model that best suits your monitoring needs
                  </p>
                </div>

                {/* Detection Types */}
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <label className="text-base font-bold text-gray-700 dark:text-gray-300 block mb-3">
                    Active Detectors
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(aiSettings.enabledDetectors).map(([detector, enabled]) => (
                      <div
                        key={detector}
                        className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-purple-200 dark:hover:border-purple-800/50 transition-all duration-300"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                            {detector === 'motion' && <FaVideo className="text-purple-500 dark:text-purple-400" />}
                            {detector === 'object' && <FaEye className="text-purple-500 dark:text-purple-400" />}
                            {detector === 'face' && <FaUser className="text-purple-500 dark:text-purple-400" />}
                            {detector === 'anomaly' && <FaBrain className="text-purple-500 dark:text-purple-400" />}
                          </div>
                          <span className="text-base text-gray-600 dark:text-gray-400 capitalize">
                            {detector}
                          </span>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={enabled}
                            onChange={() => handleDetectorToggle(detector)}
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300/20 dark:peer-focus:ring-purple-800/20 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Detection Threshold */}
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <label className="text-base font-bold text-gray-700 dark:text-gray-300 block mb-2">
                    Detection Threshold
                  </label>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={aiSettings.detectionThreshold}
                        onChange={(e) => handleAISettingChange('detectionThreshold', parseFloat(e.target.value))}
                        className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                      />
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400 w-16 text-center">
                        {(aiSettings.detectionThreshold * 100).toFixed(0)}%
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Adjust the sensitivity of the detection system
                    </p>
                  </div>
                </div>

                {/* Processing Quality */}
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-base font-bold text-gray-700 dark:text-gray-300">Processing Quality</span>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Balance between accuracy and performance
                      </p>
                    </div>
                    <select
                      value={aiSettings.processingQuality}
                      onChange={(e) => handleAISettingChange('processingQuality', e.target.value)}
                      className="w-48 rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 dark:bg-gray-700 dark:border-gray-600 text-sm"
                    >
                      <option value="low">Low (Fastest)</option>
                      <option value="balanced">Balanced</option>
                      <option value="high">High (Most Accurate)</option>
                    </select>
                  </div>
                </div>

                {/* Auto-Adjust */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div>
                    <span className="text-base font-bold text-gray-700 dark:text-gray-300">Auto-Adjust Settings</span>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Automatically optimize based on system performance
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={aiSettings.autoAdjust}
                      onChange={() => handleAISettingChange('autoAdjust', !aiSettings.autoAdjust)}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300/20 dark:peer-focus:ring-purple-800/20 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </SettingsSection>
      </div>
    </div>
  );
};

export default Settings;
