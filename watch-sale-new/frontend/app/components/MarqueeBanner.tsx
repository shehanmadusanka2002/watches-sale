"use client";

import React from 'react';
import { motion } from 'framer-motion';

const MarqueeBanner = () => {
  // Array of watch images (using high-quality placeholder-like products or existing ones)
  const watches = [
    { src: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=400', name: 'Premium Edition' },
    { src: 'https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?auto=format&fit=crop&q=80&w=400', name: 'Classic Chrono' },
    { src: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&q=80&w=400', name: 'Smart Tech' },
    { src: 'https://images.unsplash.com/photo-1548171916-c0ea98836371?auto=format&fit=crop&q=80&w=400', name: 'Sport Master' },
    { src: 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&q=80&w=400', name: 'Luxury Gold' },
    { src: 'https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?auto=format&fit=crop&q=80&w=400', name: 'Ocean Diver' },
  ];

  // Duplicate the array to create the infinite effect
  const doubledWatches = [...watches, ...watches, ...watches];

  return (
    <section className="py-24 bg-white overflow-hidden relative">
      {/* Background Decorative Text */}
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
        <span className="text-[20vw] font-black uppercase tracking-tighter">COLLECTION</span>
      </div>

      <div className="container mx-auto px-6 mb-16 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h2 className="text-6xl font-black tracking-tighter uppercase leading-none">
              Featured <br /> <span className="text-zinc-300">Timepieces</span>
            </h2>
            <div className="w-20 h-1.5 bg-black mt-8" />
          </div>
          <p className="text-[10px] text-zinc-400 font-black uppercase tracking-[0.4em] max-w-[200px] leading-relaxed italic">
            Experience the seamless flow of master engineering and aesthetic perfection.
          </p>
        </div>
      </div>

      <div className="relative flex overflow-x-hidden">
        <motion.div 
          className="flex whitespace-nowrap gap-12 py-10"
          animate={{
            x: [0, -1920], // Move left
          }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 40,
              ease: "linear",
            },
          }}
        >
          {doubledWatches.map((watch, index) => (
            <div 
              key={index} 
              className="inline-block group cursor-pointer"
            >
              <div className="relative w-[300px] h-[400px] bg-zinc-50 rounded-2xl overflow-hidden transition-all duration-700 group-hover:bg-zinc-100 shadow-[0_20px_50px_rgba(0,0,0,0.05)] group-hover:shadow-[0_40px_80px_rgba(0,0,0,0.1)]">
                {/* Floating Effect Image */}
                <motion.img 
                  src={watch.src} 
                  alt={watch.name}
                  className="w-full h-full object-cover mix-blend-multiply group-hover:scale-110 transition-transform duration-700"
                  whileHover={{ y: -10 }}
                />
                
                {/* Overlay Info */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8">
                   <span className="text-white text-xs font-black uppercase tracking-widest translate-y-4 group-hover:translate-y-0 transition-transform duration-500">{watch.name}</span>
                   <span className="text-white/60 text-[9px] font-bold uppercase tracking-tighter mt-1 translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75 italic">Boutique Selection</span>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
      
      {/* Scroll indicator line */}
      <div className="container mx-auto px-6 mt-12">
        <div className="w-full h-px bg-zinc-100 relative">
          <motion.div 
            className="absolute top-0 left-0 h-full bg-black"
            animate={{ width: ["0%", "100%"] }}
            transition={{ repeat: Infinity, duration: 40, ease: "linear" }}
          />
        </div>
      </div>
    </section>
  );
};

export default MarqueeBanner;
