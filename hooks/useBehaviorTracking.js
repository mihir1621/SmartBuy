import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useCallback } from 'react';

/**
 * Custom hook for tracking user behavioral actions.
 * Logs interactions to Firestore for personalization.
 */
export function useBehaviorTracking() {
  const trackAction = useCallback(async (userId, actionType, metadata = {}) => {
    if (!userId) return;

    try {
      // Lightweight async tracking
      await addDoc(collection(db, 'user_activity'), {
        userId,
        actionType, // 'VIEW', 'CLICK', 'SEARCH', 'PURCHASE'
        metadata,
        timestamp: serverTimestamp(),
      });
    } catch (err) {
      console.warn("Tracking failed:", err);
    }
  }, []);

  return { trackAction };
}
