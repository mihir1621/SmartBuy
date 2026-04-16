import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';

/**
 * Custom hook for fetching and managing user-specific profile data.
 * @param {string} userId - current user ID
 */
export function useUserData(userId) {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setUserData(null);
      setLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(doc(db, 'users', userId), (doc) => {
      if (doc.exists()) {
        setUserData({ id: doc.id, ...doc.data() });
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userId]);

  return { userData, loading };
}
