import React from 'react';
import { WifiOff, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';

export default function OfflineIndicator() {
  const isOnline = useNetworkStatus();

  return (
    <AnimatePresence>
      {!isOnline && (
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] w-[calc(100%-2rem)] max-w-sm"
        >
          <div className="bg-red-600 text-white p-4 rounded-2xl shadow-2xl flex items-center gap-4 border border-red-500/50 backdrop-blur-md">
            <div className="bg-white/20 p-2 rounded-xl">
              <WifiOff className="w-6 h-6 animate-pulse" />
            </div>
            <div className="flex-1">
              <p className="font-black text-sm uppercase tracking-tight">Offline Mode</p>
              <p className="text-[10px] font-medium text-red-100">Actions will be queued and synced later.</p>
            </div>
            <AlertCircle className="w-5 h-5 opacity-50" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
