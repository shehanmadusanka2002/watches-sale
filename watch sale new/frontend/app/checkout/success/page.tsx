"use client";

import React, { useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { motion } from 'framer-motion';
import { Check, Package, Truck, ArrowRight, Heart } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Navbar from '@/app/components/Navbar';

const SuccessPage = () => {
    const { clearCart } = useCart();
    const router = useRouter();

    useEffect(() => {
        // Clear the cart on success
        clearCart();
    }, []);

    return (
        <div className="min-h-screen bg-white font-sans text-black">
            <Navbar />
            
            <main className="container mx-auto px-6 py-20 flex flex-col items-center">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="w-24 h-24 bg-zinc-950 rounded-full flex items-center justify-center mb-10 shadow-2xl"
                >
                    <Check size={40} className="text-white" />
                </motion.div>

                <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase mb-6 text-center italic">
                    Acquisition Complete
                </h1>
                
                <p className="text-[11px] font-black uppercase tracking-[0.4em] text-zinc-400 mb-12 text-center max-w-lg leading-loose">
                    Your masterpiece has been secured and is currently undergoing its final inspection. You will receive a confirmation shortly.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl mb-20">
                    <div className="p-8 border border-zinc-100 rounded-sm flex flex-col items-center text-center group hover:bg-zinc-50 transition-colors">
                        <div className="w-12 h-12 rounded-full bg-zinc-50 flex items-center justify-center mb-6 group-hover:bg-white transition-colors">
                            <Package size={20} className="text-zinc-300 group-hover:text-black transition-colors" />
                        </div>
                        <h3 className="text-[10px] font-black uppercase tracking-widest mb-3">Order Logged</h3>
                        <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-widest">Transaction #WH-{Math.floor(Math.random() * 90000) + 10000}</p>
                    </div>

                    <div className="p-8 border border-zinc-100 rounded-sm flex flex-col items-center text-center group hover:bg-zinc-50 transition-colors">
                        <div className="w-12 h-12 rounded-full bg-zinc-50 flex items-center justify-center mb-6 group-hover:bg-white transition-colors">
                            <Truck size={20} className="text-zinc-300 group-hover:text-black transition-colors" />
                        </div>
                        <h3 className="text-[10px] font-black uppercase tracking-widest mb-3">White Glove Delivery</h3>
                        <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-widest">Estimated 2-3 Business Days</p>
                    </div>

                    <div className="p-8 border border-zinc-100 rounded-sm flex flex-col items-center text-center group hover:bg-zinc-50 transition-colors">
                        <div className="w-12 h-12 rounded-full bg-zinc-50 flex items-center justify-center mb-6 group-hover:bg-white transition-colors">
                            <Heart size={20} className="text-zinc-300 group-hover:text-black transition-colors" />
                        </div>
                        <h3 className="text-[10px] font-black uppercase tracking-widest mb-3">Priority Support</h3>
                        <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-widest">Available 24/7 for you</p>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-6">
                    <button 
                      onClick={() => router.push('/')}
                      className="bg-black text-white px-12 py-5 text-[11px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-4 hover:shadow-2xl transition-all group"
                    >
                        Continue Browsing
                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                    <button 
                      onClick={() => router.push('/')} // Should be to profile/orders in future
                      className="border border-zinc-200 text-black px-12 py-5 text-[11px] font-black uppercase tracking-[0.3em] hover:bg-zinc-50 transition-all"
                    >
                        Manage Collection
                    </button>
                </div>
            </main>

            <footer className="bg-white border-t border-zinc-100 py-12">
                <div className="container mx-auto px-6 text-center text-[9px] font-black text-zinc-300 uppercase tracking-[0.4em]">
                    Thank you for choosing Watch Haven Boutique
                </div>
            </footer>
        </div>
    );
};

export default SuccessPage;
