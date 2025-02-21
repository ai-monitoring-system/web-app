// src/hooks/useFCM.js

import { messaging, db } from "../utils/config"; // <-- update path as needed
import { getToken } from "firebase/messaging";
import { doc, setDoc, arrayUnion } from "firebase/firestore";

/**
 * This function requests the user's permission for notifications,
 * fetches the FCM token, and stores it in Firestore.
 * @param {string} userId - The current user's UID (from Firebase Auth).
 */
export async function requestPermissionAndGetToken(userId) {
  try {
    // 1. Ask the user for permission to show browser notifications:
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.log("Notification permission not granted");
      return null;
    }
    console.log("Notification permission granted.");

    // 2. Retrieve the token from FCM
    // Make sure you have your public VAPID key here:
    const VAPID_KEY = "BB9pSKDXbFXEDemZpqkrkoYg7ooOfmLOXx1SEexruQWpaHL-OidcsyEl324SQIW4F-qgh-hlVbOFJ1yQ2L43fOE	"; 
    // (You get this from Firebase Console > Project Settings > Cloud Messaging > Web Push certificates)

    const token = await getToken(messaging, { vapidKey: VAPID_KEY });
    console.log("FCM Token:", token);

    if (!token) {
      console.log("No FCM token retrieved. Check your VAPID key or browser settings.");
      return null;
    }

    // 3. Store the token in Firestore, e.g. in the user's doc:
    // If you want multiple tokens (for multiple devices), use arrayUnion.
    await setDoc(
      doc(db, "users", userId),
      {
        fcmTokens: arrayUnion(token),
      },
      { merge: true }
    );

    return token;
  } catch (err) {
    console.error("Error requesting notification permission or storing token:", err);
    return null;
  }
}
