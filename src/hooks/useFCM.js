import { messaging, db } from "../utils/config"; // Adjust path if needed
import { getToken, onMessage } from "firebase/messaging";
import { doc, setDoc, arrayUnion } from "firebase/firestore";

/**
 * Requests permission, fetches the FCM token, and listens for notifications.
 * @param {string} userId - The current user's UID.
 */
export async function requestPermissionAndGetToken(userId) {
  try {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.log("❌ Notification permission not granted");
      return null;
    }

    console.log("✅ Notification permission granted");

    const VAPID_KEY = "BB9pSKDXbFXEDemZpqkrkoYg7ooOfmLOXx1SEexruQWpaHL-OidcsyEl324SQIW4F-qgh-hlVbOFJ1yQ2L43fOE"; // Update this!

    // Register service worker before getting the token
    await registerServiceWorker();
    
    const token = await getToken(messaging, { vapidKey: VAPID_KEY });

    if (!token) {
      console.log("❌ No FCM token retrieved. Check browser settings.");
      return null;
    }

    console.log("🔥 FCM Token:", token);

    if (userId) {
      await setDoc(
        doc(db, "users", userId),
        { fcmTokens: arrayUnion(token) },
        { merge: true }
      );
      console.log(`📌 Stored FCM token in Firestore for user: ${userId}`);
    }

    return token;
  } catch (err) {
    console.error("⚠️ Error retrieving FCM token:", err);
    return null;
  }
}

/**
 * Handles foreground notifications.
 * When the app is open, manually show an alert or system notification.
 */
export function listenForForegroundMessages() {
  onMessage(messaging, (payload) => {
    console.log("📩 Foreground message received:", payload);

    if (Notification.permission === "granted") {
      new Notification(payload.notification.title, {
        body: payload.notification.body,
        icon: "/favicon.ico",
      });
    } else {
      alert(`🔔 ${payload.notification.title}: ${payload.notification.body}`);
    }
  });
}

/**
 * Registers the Firebase Service Worker for push notifications.
 */
export async function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    try {
      const registration = await navigator.serviceWorker.register("/firebase-messaging-sw.js");
      console.log("✅ Service Worker Registered:", registration);
      return registration;
    } catch (error) {
      console.error("❌ Service Worker registration failed:", error);
    }
  } else {
    console.warn("⚠️ Service Worker not supported in this browser.");
  }
}
