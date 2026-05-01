"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning';
}

export const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'danger'
}: ConfirmModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white w-full max-w-md overflow-hidden rounded-sm shadow-2xl"
          >
            {/* Header / Accent Bar */}
            <div className={`h-1.5 w-full ${type === 'danger' ? 'bg-red-600' : 'bg-black'}`} />
            
            <div className="p-8">
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-full ${type === 'danger' ? 'bg-red-50 text-red-600' : 'bg-zinc-50 text-black'}`}>
                  <AlertTriangle size={24} />
                </div>
                
                <div className="flex-grow">
                  <h3 className="text-xl font-black uppercase tracking-tight text-zinc-900 border-b border-zinc-100 pb-2 mb-4">
                    {title}
                  </h3>
                  <p className="text-sm font-bold text-zinc-400 leading-relaxed tracking-tight">
                    {message}
                  </p>
                </div>

                <button 
                  onClick={onClose}
                  className="p-1 text-zinc-300 hover:text-black transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Action Buttons */}
              <div className="mt-10 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => {
                    onConfirm();
                    onClose();
                  }}
                  className={`flex-1 py-4 text-xs font-black uppercase tracking-[0.2em] transition-all shadow-lg ${
                    type === 'danger' 
                      ? 'bg-red-600 text-white hover:bg-red-700 shadow-red-200' 
                      : 'bg-black text-white hover:bg-zinc-800 shadow-zinc-200'
                  }`}
                >
                  {confirmText}
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 py-4 text-xs font-black uppercase tracking-[0.2em] bg-zinc-50 text-zinc-400 border border-zinc-100 hover:bg-zinc-100 hover:text-black transition-all"
                >
                  {cancelText}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
