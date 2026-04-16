const QUEUE_KEY = 'smartbuy_offline_queue';

/**
 * Utility to manage a queue of pending actions for offline support.
 */
export const offlineQueue = {
  get: () => {
    if (typeof window === 'undefined') return [];
    try {
      const queue = localStorage.getItem(QUEUE_KEY);
      return queue ? JSON.parse(queue) : [];
    } catch (e) {
      console.error("Failed to parse offline queue", e);
      return [];
    }
  },

  add: (action) => {
    if (typeof window === 'undefined') return;
    const queue = offlineQueue.get();
    const newAction = {
      id: Date.now().toString(),
      ...action,
      timestamp: new Date().toISOString()
    };
    queue.push(newAction);
    localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
    return newAction;
  },

  remove: (id) => {
    if (typeof window === 'undefined') return;
    const queue = offlineQueue.get().filter(item => item.id !== id);
    localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
  },

  clear: () => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(QUEUE_KEY);
  }
};
