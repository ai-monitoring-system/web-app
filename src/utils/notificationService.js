import { messaging } from "./config";
import { onMessage } from "firebase/messaging";

// Store for notification listeners
let listeners = [];

// Default notification settings
let notificationSettings = {
  enabled: true,
  sound: true,
  desktop: true,
  types: {
    motion: true,
    person: true,
    animal: true,
    system: true,
    stream: true
  }
};

// Load settings from localStorage if available
try {
  const savedSettings = localStorage.getItem('notificationSettings');
  if (savedSettings) {
    notificationSettings = { ...notificationSettings, ...JSON.parse(savedSettings) };
  }
} catch (err) {
  console.error('Error loading notification settings:', err);
}

// Save settings to localStorage
const saveSettings = () => {
  try {
    localStorage.setItem('notificationSettings', JSON.stringify(notificationSettings));
  } catch (err) {
    console.error('Error saving notification settings:', err);
  }
};

// Initialize notification service
export const initNotificationService = () => {
  // Listen for FCM messages
  const unsubscribe = onMessage(messaging, (payload) => {
    console.log('Notification service received message:', payload);
    
    // Check if notifications are enabled globally
    if (!notificationSettings.enabled) {
      console.log('Notifications are disabled globally');
      return;
    }
    
    // Check if this type of notification is enabled
    const notificationType = payload.data?.type || 'system';
    if (!notificationSettings.types[notificationType]) {
      console.log(`Notifications of type ${notificationType} are disabled`);
      return;
    }
    
    // Format the notification
    const notification = {
      id: Date.now().toString(),
      title: payload.notification?.title || 'New Notification',
      message: payload.notification?.body || '',
      timestamp: Date.now(),
      read: false,
      type: notificationType,
      data: payload.data || {}
    };
    
    // Notify all listeners
    listeners.forEach(listener => listener(notification));
    
    // Show system notification if app is in background and desktop notifications enabled
    if (document.visibilityState === 'hidden' && 
        Notification.permission === 'granted' &&
        notificationSettings.desktop) {
      const notification = new Notification(payload.notification?.title || 'New Notification', {
        body: payload.notification?.body || '',
        icon: '/favicon.ico',
        data: payload.data
      });
      
      // Play sound if enabled
      if (notificationSettings.sound) {
        playNotificationSound();
      }
    }
  });
  
  return unsubscribe;
};

// Play notification sound
const playNotificationSound = () => {
  try {
    const audio = new Audio('/sounds/notification.mp3');
    audio.play();
  } catch (err) {
    console.error('Error playing notification sound:', err);
  }
};

// Update notification settings
export const updateNotificationSettings = (settings) => {
  notificationSettings = { ...notificationSettings, ...settings };
  saveSettings();
  return notificationSettings;
};

// Get current notification settings
export const getNotificationSettings = () => {
  return { ...notificationSettings };
};

// Add a notification listener
export const addNotificationListener = (callback) => {
  listeners.push(callback);
  
  // Return function to remove listener
  return () => {
    listeners = listeners.filter(listener => listener !== callback);
  };
};

// Generate a notification locally (for testing or app events)
export const generateLocalNotification = (title, message, type = 'info', data = {}) => {
  // Check if this type of notification is enabled
  if (!notificationSettings.enabled || !notificationSettings.types[type]) {
    console.log(`Notifications of type ${type} are disabled`);
    return null;
  }
  
  const notification = {
    id: Date.now().toString(),
    title,
    message,
    timestamp: Date.now(),
    read: false,
    type,
    data
  };
  
  // Notify all listeners
  listeners.forEach(listener => listener(notification));
  
  // Show system notification if app is in background and desktop notifications enabled
  if (document.visibilityState === 'hidden' && 
      Notification.permission === 'granted' &&
      notificationSettings.desktop) {
    new Notification(title, {
      body: message,
      icon: '/favicon.ico',
      data
    });
    
    // Play sound if enabled
    if (notificationSettings.sound) {
      playNotificationSound();
    }
  }
  
  return notification;
};

// Helper functions for notification types
export const notifyInfo = (title, message, data = {}) => generateLocalNotification(title, message, 'info', data);
export const notifySuccess = (title, message, data = {}) => generateLocalNotification(title, message, 'success', data);
export const notifyWarning = (title, message, data = {}) => generateLocalNotification(title, message, 'warning', data);
export const notifyError = (title, message, data = {}) => generateLocalNotification(title, message, 'error', data);
export const notifyMotion = (title, message, data = {}) => generateLocalNotification(title, message, 'motion', data);
export const notifyPerson = (title, message, data = {}) => generateLocalNotification(title, message, 'person', data);
export const notifyStream = (title, message, data = {}) => generateLocalNotification(title, message, 'stream', data);
