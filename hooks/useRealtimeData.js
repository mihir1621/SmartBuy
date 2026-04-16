import { useState, useEffect, useCallback } from 'react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, orderBy, where, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';

/**
 * Custom hook for real-time Firestore data updates and interactions.
 * @param {string} collectionName - name of the firestore collection
 * @param {Object} options - filtration and sorting options
 */
export function useRealtimeData(collectionName, options = {}) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!collectionName) return;

    let q = collection(db, collectionName);

    // Apply basic filtering if provided in options
    if (options.where) {
      q = query(q, where(options.where.field, options.where.operator, options.where.value));
    }

    // Apply sorting if provided
    if (options.orderBy) {
      q = query(q, orderBy(options.orderBy.field, options.orderBy.direction || 'asc'));
    }

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const items = [];
        snapshot.forEach((doc) => {
          items.push({ id: doc.id, ...doc.data() });
        });
        setData(items);
        setLoading(false);
      },
      (err) => {
        console.error(`Error in useRealtimeData (${collectionName}):`, err);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [collectionName, JSON.stringify(options)]);

  // Mutation functions
  const addData = useCallback(async (newData) => {
    try {
      const docRef = await addDoc(collection(db, collectionName), {
        ...newData,
        createdAt: new Date()
      });
      return docRef.id;
    } catch (err) {
      console.error("Error adding document:", err);
      throw err;
    }
  }, [collectionName]);

  const updateData = useCallback(async (id, updatedFields) => {
    try {
      const docRef = doc(db, collectionName, id);
      await updateDoc(docRef, updatedFields);
    } catch (err) {
      console.error("Error updating document:", err);
      throw err;
    }
  }, [collectionName]);

  const deleteData = useCallback(async (id) => {
    try {
      const docRef = doc(db, collectionName, id);
      await deleteDoc(docRef);
    } catch (err) {
      console.error("Error deleting document:", err);
      throw err;
    }
  }, [collectionName]);

  return { data, loading, error, addData, updateData, deleteData };
}
