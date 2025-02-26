 // Scripts for firebase and firebase messaging
 importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js");
 importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js");

 // Initialize the Firebase app in the service worker by passing the generated config
 const firebaseConfig = {
  apiKey: "AIzaSyDW-vTVTDaoaAzCgVCegs2d_JUyaj-g7Js",
  authDomain: "apms-python-server.firebaseapp.com",
  projectId: "apms-python-server",
  storageBucket: "apms-python-server.firebasestorage.app",
  messagingSenderId: "104880636657",
  appId: "1:104880636657:web:b1e4c0524d076c6fbd5f50",
  measurementId: "G-V69FMTBMNG"
 };

 firebase.initializeApp(firebaseConfig);

 // Retrieve firebase messaging
 const messaging = firebase.messaging();

 messaging.onBackgroundMessage(function(payload) {
   console.log("Received background message ", payload);

   const notificationTitle = payload.notification.title;
   const notificationOptions = {
     body: payload.notification.body,
   };

   self.registration.showNotification(notificationTitle, notificationOptions);
 });