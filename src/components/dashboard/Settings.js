import React, { useState, useEffect } from "react";
import { FaCog, FaBell, FaShieldAlt, FaPalette, FaVideo, FaMoon, FaGlobe, FaDatabase, FaUserCog, FaSignal, FaRobot, FaEye, FaBrain, FaSliders } from "react-icons/fa";
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
    emailNotifs: true,
    streamNotifs: true,
    updateNotifs: false,
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
  const [privacySettings, setPrivacySettings] = useState({
    allowDiscovery: true,
    showViewerCount: true,
    enableChat: true,
    moderationLevel: "medium",
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

  const handleNotificationChange = (key) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key],
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

  const handlePrivacySettingChange = (key, value) => {
    setPrivacySettings(prev => ({
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
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">
        {/* Decorative background elements */}
        <div className={`absolute top-0 right-0 w-32 h-32 ${colors.blur} rounded-full -translate-x-16 -translate-y-16 blur-2xl`}></div>
        <div className={`absolute bottom-0 left-0 w-32 h-32 ${colors.blur} rounded-full translate-x-16 translate-y-16 blur-2xl`}></div>

        <div className="relative">
          <div className="flex items-center gap-3 mb-6">
            <div className={`p-2.5 ${colors.light} rounded-2xl shadow-sm`}>
              <Icon className={`text-xl ${colors.icon}`} />
            </div>
            <h3 className={`text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${colors.gradient}`}>
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
      className={`p-6 space-y-6 transform transition-all duration-700 ${isPageLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
    >
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
          Settings
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Customize your experience and preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Appearance Settings */}
        <SettingsSection title="Appearance" icon={FaPalette} color="purple">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Sidebar Color
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="color"
                  value={stagedSettings.sidebarColor}
                  onChange={(e) => handleAppearanceChange('sidebarColor', e.target.value)}
                  className="h-8 w-8 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={stagedSettings.sidebarColor}
                  onChange={(e) => handleAppearanceChange('sidebarColor', e.target.value)}
                  className="flex-1 px-3 py-1.5 text-sm border rounded-md focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                  placeholder="#3B82F6"
                />
              </div>

              {/* Color Presets */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Preset Colors
                </label>
                <div className="flex flex-wrap gap-3">
                  {[
                    { color: '#3B82F6' },
                    { color: '#10B981' },
                    { color: '#8B5CF6' },
                    { color: '#EF4444' },
                    { color: '#F59E0B' },
                    { color: '#EC4899' },
                    { color: '#6B7280' },
                    { color: '#1E40AF' }
                  ].map(({ color }) => (
                    <button
                      key={color}
                      onClick={() => handleAppearanceChange('sidebarColor', color)}
                      className="relative group"
                    >
                      <div
                        className={`w-10 h-10 rounded-full transition-all duration-300 transform 
                          group-hover:scale-110 group-hover:shadow-lg group-active:scale-95
                          ${stagedSettings.sidebarColor.toLowerCase() === color.toLowerCase()
                            ? 'ring-2 ring-offset-2 ring-purple-500 dark:ring-offset-gray-800 shadow-md'
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

              {/* Reset Button */}
              <button
                onClick={() => handleAppearanceChange('sidebarColor', '#3B82F6')}
                className="mt-8 text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 flex items-center space-x-1 transition-colors duration-200 group"
              >
                <svg
                  className="w-4 h-4 transform group-hover:rotate-180 transition-transform duration-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
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

            {/* Preview Section */}
            <div className="mt-4 border rounded-lg p-4 dark:border-gray-600">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Preview</h4>
              <div className="flex items-center space-x-4">
                <div
                  className="w-16 h-32 rounded-lg overflow-hidden"
                  style={{ backgroundColor: stagedSettings.sidebarColor }}
                >
                  <div className="p-2">
                    <div className="w-8 h-8 bg-white bg-opacity-20 rounded-lg mb-2"></div>
                    <div className="w-8 h-8 bg-white bg-opacity-20 rounded-lg mb-2"></div>
                    <div className="w-8 h-8 bg-white bg-opacity-20 rounded-lg"></div>
                  </div>
                </div>
                <div
                  className="w-48 h-32 rounded-lg overflow-hidden"
                  style={{ backgroundColor: stagedSettings.sidebarColor }}
                >
                  <div className="p-3">
                    <div className="h-6 bg-white bg-opacity-20 rounded mb-2"></div>
                    <div className="h-6 bg-white bg-opacity-20 rounded mb-2"></div>
                    <div className="h-6 bg-white bg-opacity-20 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </SettingsSection>

        {/* Notification Settings */}
        <SettingsSection title="Notifications" icon={FaBell} color="blue">
          <div className="space-y-4">
            {Object.entries(notifications).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <span className="text-gray-700 dark:text-gray-300">
                  {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                </span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={value}
                    onChange={() => handleNotificationChange(key)}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>
            ))}
          </div>
        </SettingsSection>

        {/* Video Settings */}
        <SettingsSection title="Video Settings" icon={FaVideo} color="green">
          <div className="space-y-4">
            <div className="flex flex-col space-y-2">
              <label className="text-gray-700 dark:text-gray-300">
                Default Quality
              </label>
              <select
                value={videoSettings.defaultQuality}
                onChange={(e) => handleVideoSettingChange('defaultQuality', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
              >
                <option value="1080p">1080p</option>
                <option value="720p">720p</option>
                <option value="480p">480p</option>
                <option value="360p">360p</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-700 dark:text-gray-300">Autoplay</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={videoSettings.autoplay}
                  onChange={() => handleVideoSettingChange('autoplay', !videoSettings.autoplay)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-700 dark:text-gray-300">Hardware Acceleration</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={videoSettings.hardwareAcceleration}
                  onChange={() => handleVideoSettingChange('hardwareAcceleration', !videoSettings.hardwareAcceleration)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </SettingsSection>

        {/* Stream Settings */}
        <SettingsSection title="Stream Settings" icon={FaSignal}>
          <div className="space-y-4">
            <div className="flex flex-col space-y-2">
              <label className="text-gray-700 dark:text-gray-300">
                Default Stream Resolution
              </label>
              <select
                value={streamSettings.defaultResolution}
                onChange={(e) => handleStreamSettingChange('defaultResolution', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
              >
                <option value="1080p">1080p (Full HD)</option>
                <option value="1440p">1440p (2K)</option>
                <option value="2160p">2160p (4K)</option>
              </select>
            </div>

            <div className="flex flex-col space-y-2">
              <label className="text-gray-700 dark:text-gray-300">
                Bitrate Limit (kbps)
              </label>
              <input
                type="number"
                value={streamSettings.bitrateLimit}
                onChange={(e) => handleStreamSettingChange('bitrateLimit', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                min="1000"
                max="12000"
              />
            </div>

            <div className="flex flex-col space-y-2">
              <label className="text-gray-700 dark:text-gray-300">
                Encoder Preset
              </label>
              <select
                value={streamSettings.encoderPreset}
                onChange={(e) => handleStreamSettingChange('encoderPreset', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
              >
                <option value="quality">Quality</option>
                <option value="balanced">Balanced</option>
                <option value="performance">Performance</option>
              </select>
            </div>
          </div>
        </SettingsSection>

        {/* Privacy Settings */}
        <SettingsSection title="Privacy & Moderation" icon={FaUserCog}>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-700 dark:text-gray-300">Allow Channel Discovery</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={privacySettings.allowDiscovery}
                  onChange={() => handlePrivacySettingChange('allowDiscovery', !privacySettings.allowDiscovery)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex flex-col space-y-2">
              <label className="text-gray-700 dark:text-gray-300">
                Chat Moderation Level
              </label>
              <select
                value={privacySettings.moderationLevel}
                onChange={(e) => handlePrivacySettingChange('moderationLevel', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
              >
                <option value="low">Low - Basic Filtering</option>
                <option value="medium">Medium - Smart Moderation</option>
                <option value="high">High - Strict Rules</option>
                <option value="custom">Custom Rules</option>
              </select>
            </div>
          </div>
        </SettingsSection>

        {/* Storage Management */}
        <SettingsSection title="Storage Management" icon={FaDatabase}>
          <div className="space-y-4">
            <div className="flex flex-col space-y-2">
              <label className="text-gray-700 dark:text-gray-300">
                Auto-Delete Recordings After (days)
              </label>
              <select
                value={storageSettings.autoDeleteAfter}
                onChange={(e) => handleStorageSettingChange('autoDeleteAfter', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
              >
                <option value="7">7 days</option>
                <option value="30">30 days</option>
                <option value="90">90 days</option>
                <option value="never">Never</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-700 dark:text-gray-300">Save Stream Recordings</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={storageSettings.saveStreamRecordings}
                  onChange={() => handleStorageSettingChange('saveStreamRecordings', !storageSettings.saveStreamRecordings)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="mt-4">
              <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Storage Used</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">65%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-600">
                  <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '65%' }}></div>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  6.5 GB of 10 GB used
                </p>
              </div>
            </div>
          </div>
        </SettingsSection>

        {/* Security Settings */}
        <SettingsSection title="Security" icon={FaShieldAlt}>
          <div className="space-y-4">
            <button
              onClick={() => auth.currentUser?.sendEmailVerification()}
              className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Verify Email
            </button>
            <button
              onClick={() => auth.currentUser?.sendPasswordResetEmail(auth.currentUser.email)}
              className="w-full px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Reset Password
            </button>
          </div>
        </SettingsSection>

        {/* AI Monitoring System */}
        <SettingsSection title="AI Monitoring System" icon={FaRobot}>
          <div className="space-y-6">
            {/* Model Selection */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Detection Model
              </label>
              <select
                value={aiSettings.selectedModel}
                onChange={(e) => handleAISettingChange('selectedModel', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
              >
                <option value="standard">Standard (Balanced)</option>
                <option value="lightweight">Lightweight (Faster)</option>
                <option value="advanced">Advanced (More Accurate)</option>
                <option value="custom">Custom Model</option>
              </select>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Select the AI model that best suits your monitoring needs
              </p>
            </div>

            {/* Detection Threshold */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Detection Threshold ({(aiSettings.detectionThreshold * 100).toFixed(0)}%)
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={aiSettings.detectionThreshold}
                onChange={(e) => handleAISettingChange('detectionThreshold', parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
              />
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Adjust the sensitivity of the detection system
              </p>
            </div>

            {/* Enabled Detectors */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Active Detectors
              </label>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(aiSettings.enabledDetectors).map(([detector, enabled]) => (
                  <div key={detector} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">
                      {detector} Detection
                    </span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={enabled}
                        onChange={() => handleDetectorToggle(detector)}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Processing Quality */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Processing Quality
              </label>
              <select
                value={aiSettings.processingQuality}
                onChange={(e) => handleAISettingChange('processingQuality', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
              >
                <option value="low">Low (Fastest)</option>
                <option value="balanced">Balanced</option>
                <option value="high">High (Best Quality)</option>
                <option value="ultra">Ultra (Resource Intensive)</option>
              </select>
            </div>

            {/* Auto-Adjust Settings */}
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Auto-Adjust Settings
                </span>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Automatically optimize settings based on system performance
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={aiSettings.autoAdjust}
                  onChange={() => handleAISettingChange('autoAdjust', !aiSettings.autoAdjust)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {/* Performance Metrics */}
            <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                System Performance
              </h4>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600 dark:text-gray-400">Processing Speed</span>
                    <span className="text-gray-900 dark:text-gray-100">30 fps</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600 dark:text-gray-400">Detection Accuracy</span>
                    <span className="text-gray-900 dark:text-gray-100">92%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '92%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </SettingsSection>
      </div>

      {/* Save and Cancel Buttons */}
      <div className="mt-8 flex justify-end space-x-4">
        <button
          onClick={handleCancel}
          className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200"
        >
          Cancel
        </button>
        <button
          onClick={handleSaveChanges}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default Settings;
