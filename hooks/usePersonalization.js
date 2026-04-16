import { useState, useEffect, useMemo } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, where, orderBy, limit, onSnapshot } from 'firebase/firestore';

/**
 * Custom hook for computing simple personalized recommendations.
 * @param {string} userId - current user's ID
 * @param {Array} allProducts - list of all available products
 */
export function usePersonalization(userId, allProducts = []) {
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'user_activity'),
      where('userId', '==', userId),
      orderBy('timestamp', 'desc'),
      limit(30)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => doc.data());
      setActivity(docs);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userId]);

  const recommendations = useMemo(() => {
    if (!activity.length || !allProducts.length) return [];

    // Simple frequency analysis
    const categoryFreq = {};
    const brandFreq = {};

    activity.forEach(act => {
      const cat = act.metadata?.category;
      const brand = act.metadata?.brand;
      if (cat) categoryFreq[cat] = (categoryFreq[cat] || 0) + 1;
      if (brand) brandFreq[brand] = (brandFreq[brand] || 0) + 1;
    });

    // Sort to get top categories
    const topCategories = Object.entries(categoryFreq)
      .sort((a, b) => b[1] - a[1])
      .map(entry => entry[0]);

    // Simple Logic: Find products in top categories that haven't been viewed too many times recently
    // (Or just return products from those categories)
    return allProducts.filter(p => topCategories.includes(p.category))
      .sort((a, b) => (categoryFreq[b.category] || 0) - (categoryFreq[a.category] || 0))
      .slice(0, 10);
  }, [activity, allProducts]);

  const isNewUser = activity.length === 0 && !loading;

  return { recommendations, isNewUser, loadingActivity: loading };
}
