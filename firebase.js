import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyBtCtmQkmGQBpnc_zW-yzZ4fC015bj5H5g",
  authDomain: "nexus-e578a.firebaseapp.com",
  projectId: "nexus-e578a",
  storageBucket: "nexus-e578a.firebasestorage.app",
  messagingSenderId: "214169198041",
  appId: "1:214169198041:web:e8bcae6523968d21868dc8",
  measurementId: "G-L6TTMMDC6P"
};

const app = initializeApp(firebaseConfig);

export const messaging = getMessaging(app);

export const generateToken = async () => {
  try {
    const permission = await Notification.requestPermission();

    if (permission === "granted") {

      const token = await getToken(messaging, {
        vapidKey: "BAtohCzbzEYqaKl6iXLh5Jbi9vtu-eXN23iwN0EN8G_sYLnbzx93FmJ5L4vXhThqNJrB6DJ5Lfy3lU4u0iqTKGc"
      });

      return token;
    } else {
      console.log("Notification permission denied");
    }

  } catch (error) {
    console.log("Token error:", error);
  }
};

export const listenForMessages = () => {
  onMessage(messaging, (payload) => {
    console.log("Message received: ", payload);
    
    // Show notification when app is in foreground
    if (Notification.permission === "granted") {
      new Notification(payload.notification.title, {
        body: payload.notification.body,
        icon: payload.notification.icon || "/logo192.png"
      });
    }
  });
};