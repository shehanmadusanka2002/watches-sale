'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Preloader = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate initial loading time
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2500); // 2.5 seconds of elegance

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0,
            y: -100,
            transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] }
          }}
          className="fixed inset-0 z-[9999] bg-white flex flex-col items-center justify-center"
        >
          {/* Central Watch Animation Container */}
          <div className="relative w-48 h-48 flex items-center justify-center">
            {/* Outer Ring */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="absolute inset-0 border-[1px] border-zinc-100 rounded-full"
            />
            
            {/* Pulsing Core */}
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                opacity: [0.3, 0.6, 0.3]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
              className="absolute w-32 h-32 border-[1px] border-zinc-200 rounded-full"
            />

            {/* Watch Hands Animation */}
            <div className="relative w-full h-full">
               {/* Center Dot */}
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-black rounded-full z-20" />
               
               {/* Hour Hand */}
               <motion.div 
                 initial={{ rotate: 0 }}
                 animate={{ rotate: 360 }}
                 transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                 className="absolute top-1/2 left-1/2 w-1 h-12 bg-black origin-bottom -translate-x-1/2 -translate-y-full rounded-full"
               />

               {/* Minute Hand */}
               <motion.div 
                 initial={{ rotate: 90 }}
                 animate={{ rotate: 450 }}
                 transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                 className="absolute top-1/2 left-1/2 w-[0.5px] h-16 bg-zinc-400 origin-bottom -translate-x-1/2 -translate-y-full rounded-full"
               />
            </div>

            {/* Brand Logo Text */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="absolute -bottom-20 flex flex-col items-center"
            >
              <span className="text-3xl font-black tracking-tighter italic">
                ANIX<span className="text-zinc-200">.</span>
              </span>
              <div className="flex items-center gap-4 mt-4">
                 <div className="h-px w-8 bg-zinc-100" />
                 <span className="text-[8px] font-black uppercase tracking-[0.6em] text-zinc-300">
                   Official Boutique
                 </span>
                 <div className="h-px w-8 bg-zinc-100" />
              </div>
            </motion.div>
          </div>

          {/* Progress Indicator */}
          <div className="absolute bottom-12 w-48 h-[1px] bg-zinc-50 overflow-hidden">
             <motion.div 
               initial={{ x: "-100%" }}
               animate={{ x: "0%" }}
               transition={{ duration: 2.2, ease: "easeInOut" }}
               className="h-full bg-black w-full"
             />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Preloader;
