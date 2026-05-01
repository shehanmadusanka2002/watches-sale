"use client";

import React from 'react';
import Navbar from '@/app/components/Navbar';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import { ShoppingCart, Trash2, ArrowRight, Heart } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

const WishlistPage = () => {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      
      <div className="container mx-auto px-6 py-20">
        <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16 border-b border-zinc-100 pb-12">
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400 mb-4 block">Personal Gallery</span>
            <h1 className="text-6xl font-black tracking-tighter uppercase italic">My Wishlist</h1>
          </div>
          <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-zinc-400">
             <span>{wishlist.length} Timepieces Saved</span>
          </div>
        </div>

        {wishlist.length === 0 ? (
          <div className="py-40 text-center flex flex-col items-center justify-center">
             <div className="w-20 h-20 rounded-full bg-zinc-50 flex items-center justify-center mb-8">
                <Heart size={32} className="text-zinc-200" />
             </div>
             <p className="text-xl font-black tracking-tight text-zinc-900 mb-4">Your wishlist is empty</p>
             <p className="text-xs text-zinc-400 uppercase font-black tracking-widest mb-12 italic">Discover our curated collection and save your favorites</p>
             <Link href="/#collection" className="bg-black text-white px-12 py-5 text-[10px] font-black uppercase tracking-[0.25em] hover:bg-zinc-800 transition-all shadow-2xl flex items-center gap-4">
                Explore The Collection <ArrowRight size={16} />
             </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-20">
            <AnimatePresence>
              {wishlist.map((product) => (
                <motion.div 
                    key={product.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="group flex flex-col"
                >
                  <div className="relative aspect-[3/4] bg-zinc-50 overflow-hidden mb-8 group-hover:shadow-2xl transition-all duration-700 rounded-sm">
                    <button 
                      onClick={() => removeFromWishlist(product.id)}
                      className="absolute top-4 right-4 z-10 bg-white/80 hover:bg-red-500 hover:text-white p-2.5 rounded-full backdrop-blur-md transition-all shadow-lg"
                    >
                      <Trash2 size={16} />
                    </button>
                    
                    <Link href={`/product/${product.id}`} className="block w-full h-full">
                      <img 
                        src={product.imageUrl?.split('|')[0] || 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=1000'}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                      />
                    </Link>

                    <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                       <button 
                         onClick={() => addToCart(product)}
                         className="w-full bg-black text-white py-4 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-zinc-800 transition-colors shadow-2xl"
                       >
                         <ShoppingCart size={14} /> Buy Now
                       </button>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <span className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.3em]">{product.brand}</span>
                    <h3 className="text-sm font-black text-black uppercase tracking-widest line-clamp-1">{product.name}</h3>
                    <div className="flex items-center justify-between mt-2 pt-4 border-t border-zinc-50">
                       <span className="text-sm font-black text-black tracking-tight">Rs. {product.price?.toLocaleString()}</span>
                       <span className="text-[9px] font-black text-zinc-300 uppercase tracking-widest italic">{product.movementType || 'QUARTZ'}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Footer is same as main... skipping full footer duplication for brevity but it's inherited from layout/components if we used one */}
    </main>
  );
};

export default WishlistPage;
