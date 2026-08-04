import { initializeApp, getApps, getApp } from "firebase/app";
import { getMessaging, getToken, isSupported } from "firebase/messaging";

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const getFcmToken = async () => {
    try {
        if (typeof window === "undefined") return null;
        
        const supported = await isSupported();
        if (!supported) return null;
        
        const messaging = getMessaging(app);
        
        if ("serviceWorker" in navigator) {
            const registration = await navigator.serviceWorker.register("/firebase-messaging-sw.js");
            
            // Wait for service worker to be ready
            await navigator.serviceWorker.ready;

            const token = await getToken(messaging, {
                vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
                serviceWorkerRegistration: registration,
            });
            return token;
        }
        return null;
    } catch (err) {
        console.error("FCM Token Error:", err);
        return null;
    }
};
