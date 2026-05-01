"use client";

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, X } from 'lucide-react';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  isVisible: boolean;
  onClose: () => void;
}

export const Toast = ({ message, type, isVisible, onClose }: ToastProps) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onClose, 4000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
          className="fixed bottom-10 right-10 z-[1000]"
        >
          <div className={`flex items-center gap-4 px-6 py-4 rounded-sm shadow-2xl border ${
            type === 'success' ? 'bg-black border-zinc-800' : 'bg-red-600 border-red-500'
          } text-white min-w-[300px]`}>
            {type === 'success' ? (
              <CheckCircle size={20} className="text-emerald-400" />
            ) : (
              <XCircle size={20} className="text-white" />
            )}
            
            <div className="flex-grow">
              <p className="text-[10px] font-black uppercase tracking-widest opacity-50 mb-0.5">
                {type === 'success' ? 'Transaction Complete' : 'Acquisition Alert'}
              </p>
              <p className="text-xs font-bold leading-tight uppercase tracking-tight">{message}</p>
            </div>

            <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-full transition-colors">
              <X size={16} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
