"use client";

import React from 'react';
import { motion } from 'framer-motion';

const MarqueeBanner = () => {
  const watches = [
    { src: '/images/marquee/watch1.png', name: 'Grand Master' },
    { src: '/images/marquee/watch2.png', name: 'Modern Chrono' },
    { src: '/images/marquee/watch3.png', name: 'Elite Diamond' },
    { src: '/images/marquee/watch4.png', name: 'Pure Minimalist' },
    { src: '/images/marquee/watch5.png', name: 'Ocean Heritage' },
    { src: '/images/marquee/watch6.png', name: 'Next-Gen Smart' },
  ];

  const doubledWatches = [...watches, ...watches, ...watches];

  return (
    <section className="py-32 bg-[#0A0A0A] overflow-hidden relative border-y border-white/5">
      {/* Background Decorative Text */}
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.01] pointer-events-none select-none">
        <span className="text-[25vw] font-serif uppercase tracking-tighter italic">Elegance</span>
      </div>

      <div className="container mx-auto px-6 mb-24 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-12">
          <div>
            <div className="flex items-center gap-6 mb-8">
              <div className="w-12 h-px bg-gold" />
              <span className="text-gold text-[9px] font-black uppercase tracking-[0.8em]">Curated Excellence</span>
            </div>
            <h2 className="text-6xl md:text-8xl font-serif text-white leading-none">
              Featured <br /> <span className="text-gold italic">Timepieces</span>
            </h2>
          </div>
          <p className="max-w-[280px] text-[11px] text-[#8A8A8A] font-sans tracking-widest leading-loose uppercase italic opacity-60">
            Experience the seamless flow of master engineering and aesthetic perfection. Each piece tells a story of precision.
          </p>
        </div>
      </div>

      <div className="relative flex overflow-x-hidden">
        <motion.div 
          className="flex whitespace-nowrap gap-16 py-10"
          animate={{ x: [0, -1920] }}
          transition={{ x: { repeat: Infinity, repeatType: "loop", duration: 60, ease: "linear" } }}
        >
          {doubledWatches.map((watch, index) => (
            <div key={index} className="inline-block group cursor-pointer">
              <div className="relative w-[320px] h-[450px] bg-[#1A1A1A] border border-white/5 overflow-hidden transition-all duration-1000 group-hover:border-gold/30 group-hover:shadow-[0_40px_100px_rgba(0,0,0,0.8)]">
                <motion.img 
                  src={watch.src} 
                  alt={watch.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 grayscale opacity-20 group-hover:opacity-60"
                  whileHover={{ y: -10 }}
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 flex flex-col justify-end p-10">
                   <span className="text-gold text-[10px] font-black uppercase tracking-[0.4em] mb-4">{watch.name}</span>
                   <div className="w-8 h-px bg-gold/50 mb-4 group-hover:w-16 transition-all duration-700" />
                   <span className="text-white/40 text-[8px] font-bold uppercase tracking-[0.2em] italic">Private Collection</span>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default MarqueeBanner;
