'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Gift, ChevronRight, Sparkles } from 'lucide-react';
import Link from 'next/link';

const FestiveCollections = () => {
  const collections = [
    {
      id: 'avurudu',
      title: 'Avurudu Special',
      subtitle: 'New Beginnings, Timeless Style',
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop',
      color: 'from-red-600/20 to-orange-600/20',
      badge: 'Limited Edition',
      link: '/category/new-arrivals' // For now redirecting to new arrivals
    },
    {
      id: 'wedding',
      title: 'Wedding Collection',
      subtitle: 'Luxury Gifts for Eternal Bonds',
      image: 'https://images.unsplash.com/photo-1542491595-30013b619711?q=80&w=1000&auto=format&fit=crop',
      color: 'from-yellow-600/20 to-amber-900/20',
      badge: 'Gift Packaging Included',
      link: '/category/couple' // Redirecting to couple watches
    }
  ];

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16">
          <div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase mb-4 italic">
              Curated <span className="text-zinc-200">Collections</span>
            </h2>
            <p className="text-[10px] text-zinc-400 font-black uppercase tracking-[0.4em]">Special timepieces for your most memorable moments</p>
          </div>
          <div className="hidden md:flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-zinc-400">
             Explore All <ChevronRight size={14} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {collections.map((col, idx) => (
            <motion.div
              key={col.id}
              initial={{ opacity: 0, x: idx === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="group relative h-[450px] overflow-hidden rounded-sm cursor-pointer shadow-2xl"
            >
              {/* Background Image */}
              <img 
                src={col.image} 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                alt={col.title}
              />
              
              {/* Gradient Overlay */}
              <div className={`absolute inset-0 bg-gradient-to-br ${col.color} mix-blend-multiply opacity-60 group-hover:opacity-40 transition-opacity`} />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80" />

              {/* Content */}
              <div className="absolute inset-0 p-12 flex flex-col justify-end items-start">
                <span className="bg-white text-black text-[9px] font-black px-4 py-2 uppercase tracking-[0.2em] mb-6 shadow-xl">
                  {col.badge}
                </span>
                <h3 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase mb-2 group-hover:translate-x-2 transition-transform duration-500 italic">
                  {col.title}
                </h3>
                <p className="text-white/60 text-[11px] font-bold uppercase tracking-[0.3em] mb-10 max-w-xs leading-relaxed">
                  {col.subtitle}
                </p>
                
                <Link 
                  href={col.link}
                  className="flex items-center gap-4 text-white text-[10px] font-black uppercase tracking-[0.4em] group/btn"
                >
                  Discover Selection 
                  <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center group-hover/btn:bg-white group-hover/btn:text-black transition-all">
                    <ChevronRight size={16} />
                  </div>
                </Link>
              </div>

              {/* Sparkle effects on hover */}
              <div className="absolute top-10 right-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                <Sparkles className="text-white animate-pulse" size={40} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FestiveCollections;
