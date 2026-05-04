"use client";

import React from 'react';
import { motion, useScroll, useTransform, Variants } from 'framer-motion';

const Hero = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  const words = "Crafted for Legends".split(" ");

  const container: Variants = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.5 * i },
    }),
  };

  const child: Variants = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        damping: 12,
        stiffness: 100,
      },
    },
    hidden: {
      opacity: 0,
      y: 40,
    },
  };

  return (
    <section className="relative h-screen flex items-center bg-black overflow-hidden">
      {/* Cinematic Background with Parallax */}
      <motion.div style={{ y: y1 }} className="absolute inset-0 z-0">
        <motion.div 
          initial={{ scale: 1.3, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.5 }}
          transition={{ duration: 3, ease: "easeOut" }}
          className="w-full h-full bg-[url('https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
      </motion.div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div style={{ opacity }} className="max-w-4xl">
          <div className="flex items-center gap-6 mb-12">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: 60 }}
              transition={{ duration: 1, delay: 1 }}
              className="h-px bg-gold" 
            />
            <span className="text-gold text-[10px] font-black uppercase tracking-[0.8em] overflow-hidden whitespace-nowrap">
              Geneva • London • Colombo
            </span>
          </div>

          <motion.h1 
            variants={container}
            initial="hidden"
            animate="visible"
            className="text-7xl md:text-[10rem] font-serif text-white leading-[0.85] mb-12 flex flex-wrap gap-x-8"
          >
            {words.map((word, index) => (
              <motion.span key={index} variants={child} className={index === 2 ? "text-gold italic" : ""}>
                {word}
              </motion.span>
            ))}
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 0.6, y: 0 }}
            transition={{ duration: 1, delay: 1.5 }}
            className="max-w-xl text-lg md:text-2xl text-zinc-400 font-light leading-relaxed mb-16 font-sans italic"
          >
            A legacy forged in precision. Discover the pinnacle of horological excellence in Sri Lanka's most exclusive private boutique.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 2 }}
            className="flex flex-wrap gap-12 items-center"
          >
            <button className="luxury-button">
              Explore The Vault
            </button>
            
            <button className="group flex items-center gap-6 text-white text-[10px] font-black uppercase tracking-[0.4em] transition-all hover:text-gold">
              <span className="w-12 h-px bg-white/20 group-hover:bg-gold transition-all duration-500" />
              The Heritage
            </button>
          </motion.div>
        </motion.div>
      </div>

      {/* Floating Detail Indicators */}
      <div className="absolute left-10 top-1/2 -translate-y-1/2 hidden xl:flex flex-col gap-20 z-20">
         {[1, 2, 3].map((i) => (
           <div key={i} className="flex items-center gap-4 group cursor-pointer">
              <div className="w-1.5 h-1.5 rounded-full border border-gold/40 group-hover:bg-gold transition-all" />
              <span className="text-[8px] text-zinc-600 font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all">0{i}</span>
           </div>
         ))}
      </div>
      
      {/* Scroll indicator with Cinematic Shimmer */}
      <div className="absolute right-10 bottom-24 flex flex-col items-center gap-8 z-20">
         <span className="text-[8px] font-black text-gold/30 uppercase tracking-[0.8em] [writing-mode:vertical-lr]">Scroll To Discover</span>
         <motion.div 
           animate={{ height: [0, 100, 0], y: [0, 0, 100] }}
           transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
           className="w-[1px] bg-gradient-to-b from-gold via-gold/40 to-transparent" 
         />
      </div>

      {/* Grain Overlay for Realism */}
      <div className="grain-overlay" />
    </section>
  );
};

export default Hero;
