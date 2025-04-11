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

## Testing

To test the system:

1. **Start the backend Python server** and begin streaming.
2. **Open the frontend**, log in, and click **Join Call**.
3. Once connected, **approach the camera** or move into its field of view.
4. The YOLO model will detect a person approaching and trigger a push notification.
5. Ensure notification permission is granted in your browser.

> If no notification appears, check the browser's notification settings and the console for any errors.

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
