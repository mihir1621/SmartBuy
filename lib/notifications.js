import { messaging, db } from './firebase';
import { getToken, onMessage } from "firebase/messaging";
import { doc, setDoc, arrayUnion } from "firebase/firestore";

const VAPID_KEY = 'BAx4BIe1wXqetYvFxvm_mdlPNhmLnMsuqJOKWqnYGrBd2x4xbuA3-HQZnuano6xWBv_yqRJHbkL4mCwSTidIeFM';

/**
 * Requests notification permission from the user and retrieves the FCM token.
 */
export const requestNotificationPermission = async (userId) => {
    if (!messaging || typeof window === 'undefined') return;

    try {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
            const token = await getToken(messaging, { vapidKey: VAPID_KEY });
            
            if (token && userId) {
                // Use setDoc with merge:true to create document if it doesn't exist
                const userRef = doc(db, "users", userId);
                await setDoc(userRef, {
                    fcmTokens: arrayUnion(token),
                    lastActive: new Date().toISOString()
                }, { merge: true });
                
                console.log('Firebase Cloud Messaging token saved successfully.');
            }
            
            return token;
        } else {
            console.warn('User denied notification permissions.');
        }
    } catch (error) {
        console.error('An error occurred while retrieving FCM token:', error);
    }
};

/**
 * Listener for foreground messages.
 */
export const onForegroundMessage = () => {
    if (!messaging) return;
    
    onMessage(messaging, (payload) => {
        console.log('Foreground message received:', payload);
        // This is where you can trigger a custom-styled alert or toast
        // Example logic:
        // const { notification } = payload;
        // alert(`${notification.title}\n${notification.body}`);
    });
};
