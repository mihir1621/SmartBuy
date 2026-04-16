import { useEffect, useState } from 'react';
import { useNetworkStatus } from './useNetworkStatus';
import { offlineQueue } from '@/utils/offlineQueue';
import { useNotifications } from './useNotifications';

/**
 * Custom hook to automatically sync queued offline actions when connectivity returns.
 */
export function useOfflineSync() {
  const isOnline = useNetworkStatus();
  const { notify } = useNotifications();
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    const processQueue = async () => {
      const queue = offlineQueue.get();
      if (queue.length === 0) return;

      setIsSyncing(true);
      const toastId = notify(`Syncing ${queue.length} pending actions...`, 'info', { autoClose: false });

      for (const action of queue) {
        try {
          const response = await fetch(action.url, {
            method: action.method || 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...action.headers
            },
            body: JSON.stringify(action.body)
          });

          if (response.ok) {
            offlineQueue.remove(action.id);
          } else {
            console.error(`Failed to sync action ${action.id}:`, await response.text());
          }
        } catch (err) {
          console.error(`Sync error for action ${action.id}:`, err);
          break; // Stop processing if we lost connection again
        }
      }

      setIsSyncing(false);
      // Close processing toast and show success
      notify("Offline synchronization complete!", "success");
    };

    if (isOnline) {
      processQueue();
    }
  }, [isOnline]);

  return { isSyncing, isOnline };
}
