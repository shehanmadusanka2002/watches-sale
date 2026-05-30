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
            transition: { duration: 1, ease: [0.76, 0, 0.24, 1] }
          }}
          className="fixed inset-0 z-[9999] bg-zinc-950 flex flex-col items-center justify-center overflow-hidden"
        >
          {/* Ambient Background Glow */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-transparent to-transparent opacity-50" />

          {/* 3D Watch Container */}
          <div className="relative w-64 h-64 flex items-center justify-center">
            {/* 3D Shadow/Glow */}
            <motion.div 
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute w-40 h-40 bg-indigo-600/30 blur-[80px] rounded-full"
            />

            {/* Watch Case (Gold 3D) */}
            <motion.div
              initial={{ rotateY: 45, rotateX: 10, scale: 0.8, opacity: 0 }}
              animate={{ rotateY: 0, rotateX: 0, scale: 1, opacity: 1 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="relative w-48 h-48 rounded-full bg-gradient-to-br from-amber-200 via-amber-500 to-amber-900 p-[3px] shadow-[0_20px_50px_rgba(0,0,0,0.5),inset_0_-5px_15px_rgba(0,0,0,0.5)]"
            >
              {/* Inner Dial (Royal Blue) */}
              <div className="w-full h-full rounded-full bg-[#0a1128] relative overflow-hidden flex items-center justify-center shadow-inner">
                {/* Dial Texture/Pattern */}
                <div className="absolute inset-0 opacity-20 bg-[repeating-conic-gradient(from_0deg,_#1e3a8a_0deg_10deg,_transparent_10deg_20deg)]" />
                
                {/* Sunray Effect */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(59,130,246,0.2)_0%,_transparent_70%)]" />

                {/* Hour Markers */}
                {[...Array(12)].map((_, i) => (
                  <div 
                    key={i} 
                    className="absolute w-1 h-3 bg-amber-400/80 rounded-full"
                    style={{ transform: `rotate(${i * 30}deg) translateY(-85px)` }}
                  />
                ))}

                {/* Brand Name on Dial */}
                <span className="absolute top-1/3 text-[6px] font-black tracking-[0.4em] text-amber-500/50 uppercase">NEXORA HUB</span>

                {/* Center Hub */}
                <div className="absolute w-4 h-4 bg-gradient-to-br from-amber-300 to-amber-600 rounded-full z-30 shadow-lg border border-amber-800/20" />

                {/* Watch Hands */}
                {/* Hour Hand */}
                <motion.div 
                  initial={{ rotate: 45 }}
                  animate={{ rotate: 405 }}
                  transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                  className="absolute top-1/2 left-1/2 w-1.5 h-14 bg-gradient-to-t from-amber-400 to-white origin-bottom -translate-x-1/2 -translate-y-full rounded-full z-20 shadow-md"
                />

                {/* Minute Hand */}
                <motion.div 
                  initial={{ rotate: 180 }}
                  animate={{ rotate: 540 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="absolute top-1/2 left-1/2 w-1 h-20 bg-gradient-to-t from-zinc-200 to-white origin-bottom -translate-x-1/2 -translate-y-full rounded-full z-10 shadow-sm"
                />

                {/* Second Hand (Colorful Accents) */}
                <motion.div 
                  initial={{ rotate: 0 }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="absolute top-1/2 left-1/2 w-[1px] h-22 bg-red-500 origin-bottom -translate-x-1/2 -translate-y-full z-40"
                >
                  <div className="w-1 h-4 bg-red-500 rounded-full -translate-y-2 translate-x-[-0.5px]" />
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* Luxury Text Reveal */}
          <motion.div 
            initial={{ opacity: 0, letterSpacing: "1em" }}
            animate={{ opacity: 1, letterSpacing: "0.5em" }}
            transition={{ delay: 0.5, duration: 1.5, ease: "easeOut" }}
            className="mt-12 flex flex-col items-center"
          >
            <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-500 to-amber-200 uppercase tracking-[0.5em] italic">
              NEXORA HUB
            </h1>
            <div className="h-[1px] w-32 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent mt-4" />
            <span className="text-[8px] font-black text-zinc-500 uppercase tracking-[0.8em] mt-4">
              Legacy of Excellence
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Preloader;
