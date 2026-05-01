"use client";

import React from 'react';
import { useParams } from 'next/navigation';
import Navbar from '@/app/components/Navbar';
import ProductGrid from '@/app/components/ProductGrid';
import { motion } from 'framer-motion';

const CategoryPage = () => {
  const { type } = useParams();
  
  // Format the title (e.g., men -> MEN'S WATCHES)
  const getTitle = (t: string | string[]) => {
    const name = Array.isArray(t) ? t[0] : t;
    switch(name.toLowerCase()) {
      case 'men': return "MEN'S WATCHES";
      case 'women': return "WOMEN'S WATCHES";
      case 'couple': return "COUPLE WATCHES";
      case 'smart': return "SMART WATCHES";
      case 'vintage': return "VINTAGE EDITION";
      default: return name.toUpperCase() + " COLLECTION";
    }
  };

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Header */}
      <div className="bg-zinc-50 pt-32 pb-20 border-b border-zinc-100">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center text-center"
          >
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-400 mb-6 italic">Curated Selection</span>
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter uppercase italic leading-none mb-4">
              {getTitle(type as string)}
            </h1>
            <div className="h-1 w-24 bg-black mt-4" />
          </motion.div>
        </div>
      </div>

      {/* Product List Section */}
      <div className="container mx-auto px-6 py-24">
        <div className="mb-16 flex justify-between items-end border-b border-zinc-100 pb-8">
           <div>
              <h2 className="text-xs font-black uppercase tracking-[0.4em] text-zinc-400">Exquisite Timepieces</h2>
              <p className="text-sm font-medium text-zinc-500 mt-1 uppercase tracking-widest">Showing our finest {type} collection</p>
           </div>
        </div>
        
        {/* Pass the type as categoryType to ProductGrid */}
        <ProductGrid categoryType={Array.isArray(type) ? type[0] : type} showFilters={true} />
      </div>

      {/* Footer Branding */}
      <footer className="py-20 border-t border-zinc-50 text-center">
         <p className="text-[10px] font-black text-zinc-300 uppercase tracking-[0.6em]">ANIX OFFICIAL BOUTIQUE</p>
      </footer>
    </main>
  );
};

export default CategoryPage;
