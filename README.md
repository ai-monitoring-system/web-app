# **AI-Powered Monitoring System**

Transforming old devices into smart, AI-driven security monitors using real-time video streaming, detection, and notifications.

---

## Description

The **AI-Powered Monitoring System** is a web-based application that allows users to view real-time video streams from repurposed devices, receive alerts when a person is detected via AI, and manage their monitoring setup.

This frontend interacts with a backend Python-based video processing system that handles detection using YOLO, and with Firebase for authentication, database, and notifications.

---

## Features

- **Live Video Streaming**: Peer-to-peer video feed via WebRTC.
- **AI Detection Alerts**: Receive browser notifications when a person is detected.
- **Firebase Integration**:
  - Firestore for call session management and token storage.
  - Firebase Authentication for user login/logout.
  - Firebase Cloud Messaging (FCM) for real-time push notifications.

---

## Setup & Installation

### Prerequisites

- Node.js and npm
- Firebase project setup with:
  - Firestore
  - Firebase Auth
  - FCM enabled with a Web Push certificate
- The backend Python server must be running (see [backend README](https://github.com/ai-monitoring-system/back-end))

### Installation

```bash
git clone https://github.com/your-username/AI-Powered-Monitoring-System.git
cd AI-Powered-Monitoring-System/web-app
npm install
npm start
```

---

## How It Works

1. **Login** using Firebase Authentication.
2. Once authenticated, the app checks for an active video stream session in Firestore.
3. When the user joins a stream, WebRTC connects the user to the backend peer.
4. If AI detects a person, the backend writes a `notifications` document and sends an FCM push to the user's browser.
5. Notifications are received even when the app is in the foreground.

---

## File Overview

- `src/pages/Viewer.js`: Main streaming page with notification logic.
- `src/hooks/useFCM.js`: Handles FCM token registration and foreground alert display.
- `firebase-messaging-sw.js`: Service worker for background push notifications.
- `utils/config.js`: Firebase setup and configuration.

---

## Deployment

The frontend is a standard React app and can be deployed using:

- Firebase Hosting
- Vercel
- Or served locally at `http://localhost:3000`

---

## Notes

- Make sure the backend is started before joining a call.
- Tokens must be stored correctly in Firestore (`users/{userId}/fcmTokens`).
- Browser must grant notification permissions to receive alerts.

---

## License

MIT License.
