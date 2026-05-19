importScripts('https://www.gstatic.com/firebasejs/9.15.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.15.0/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker.
firebase.initializeApp({
  apiKey: "AIzaSyBxEAHoeL5GkbHojHXczyovB1ejPeZKnqY",
  authDomain: "smartbuy-c1da0.firebaseapp.com",
  projectId: "smartbuy-c1da0",
  storageBucket: "smartbuy-c1da0.firebasestorage.app",
  messagingSenderId: "154213146796",
  appId: "1:154213146796:web:c6975c03df73156ba63f09"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Background message ', payload);
  const notificationTitle = payload.notification.title || "SmartBuy Notification";
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/ai-bot-icon.png',
    badge: '/ai-bot-icon.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
