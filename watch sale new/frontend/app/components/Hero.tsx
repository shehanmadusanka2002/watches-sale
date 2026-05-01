"use client";

import React from 'react';
import { motion } from 'framer-motion';

const Hero = () => {
  return (
    <section className="relative min-h-[500px] md:min-h-[700px] flex items-center bg-black overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <motion.div 
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.7 }}
          transition={{ duration: 1.5 }}
          className="w-full h-full bg-[url('https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent" />
      </div>

      <div className="container mx-auto px-6 relative z-10 grid grid-cols-1 gap-0 items-center">
        {/* Text Content */}
        <div className="text-left py-20">
           <motion.div
             initial={{ opacity: 0, y: 30 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.8, delay: 0.2 }}
           >
              <span className="inline-block px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 text-[10px] font-black uppercase tracking-[0.3em] text-white/70 mb-6 transition-all hover:bg-white/20 cursor-default">
                Elegance in Motion
              </span>
              <h1 className="text-6xl md:text-8xl font-black text-white leading-[0.9] tracking-tighter mb-8 italic drop-shadow-2xl">
                CRAFTED <br /> FOR <br /> <span className="text-zinc-500">LEGENDS.</span>
              </h1>
              <p className="max-w-md text-sm md:text-base text-zinc-400 font-medium leading-relaxed mb-10 italic">
                Discover the pinnacle of Swiss precision and avant-garde design. Sri Lanka's most exclusive watch collective.
              </p>
              
              <div className="flex flex-wrap gap-4">
                 <motion.button 
                   whileHover={{ scale: 1.05 }}
                   whileTap={{ scale: 0.95 }}
                   className="px-10 py-4 bg-white text-black text-[11px] font-black uppercase tracking-[0.2em] hover:bg-zinc-200 transition-all shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                 >
                   Explore Full Collection
                 </motion.button>
                 <button className="px-10 py-4 bg-transparent border border-white/30 text-white text-[11px] font-black uppercase tracking-[0.2em] hover:bg-white/10 transition-all backdrop-blur-sm">
                   Our Heritage
                 </button>
              </div>
           </motion.div>
        </div>

      </div>

      {/* Side Scroll Indicator */}
      <div className="absolute right-10 bottom-10 flex flex-col items-center gap-4 z-20">
         <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.5em] [writing-mode:vertical-lr]">Scroll</span>
         <div className="w-[1px] h-20 bg-gradient-to-b from-white/40 to-transparent" />
      </div>
    </section>
  );
};

export default Hero;
