"use client";

import React, { useEffect, useState, Suspense } from 'react';
import { useCart } from '@/context/CartContext';
import { motion } from 'framer-motion';
import { Check, Package, Truck, ArrowRight, Heart, MessageCircle, Loader2 } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import Navbar from '@/app/components/Navbar';

const SuccessContent = () => {
    const { clearCart } = useCart();
    const router = useRouter();
    const searchParams = useSearchParams();
    const isBank = searchParams.get('method') === 'bank';
    const [orderDetails, setOrderDetails] = useState<any>(null);

    useEffect(() => {
        // Clear the cart on success
        clearCart();
        
        // Get order details from storage
        const stored = localStorage.getItem('lastOrder');
        if (stored) {
            setOrderDetails(JSON.parse(stored));
        }
    }, []);

    const sendWhatsAppReceipt = () => {
        if (!orderDetails) return;
        const phone = "94762388479"; // Your Business Phone
        const message = `Hello NEXORA HUB! I just placed an order. 
Order ID: #${orderDetails.orderId}
Total Amount: Rs. ${orderDetails.total.toLocaleString()}
Payment Method: Bank Transfer

I am sending the payment receipt below:`;
        const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    };

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
                    {isBank ? 'Order Reserved' : 'Acquisition Complete'}
                </h1>
                
                <p className="text-[11px] font-black uppercase tracking-[0.4em] text-zinc-400 mb-12 text-center max-w-lg leading-loose">
                    {isBank 
                        ? "Your timepiece is reserved. Please complete the bank transfer and send us the receipt via WhatsApp to finalize your acquisition."
                        : "Your masterpiece has been secured and is currently undergoing its final inspection. You will receive a confirmation shortly."
                    }
                </p>

                {isBank && orderDetails && (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="w-full max-w-xl bg-zinc-50 border border-zinc-100 p-10 mb-16 rounded-sm text-center"
                    >
                        <h4 className="text-[11px] font-black uppercase tracking-[0.3em] mb-6">Payment Required</h4>
                        <div className="flex flex-col gap-4 items-center mb-10">
                            <span className="text-[10px] text-zinc-400 font-bold uppercase">Amount to Transfer:</span>
                            <span className="text-3xl font-black tracking-tighter">Rs. {orderDetails.total.toLocaleString()}</span>
                            <span className="text-[10px] bg-black text-white px-3 py-1 font-bold uppercase">Order #{orderDetails.orderId}</span>
                        </div>
                        
                        <button 
                          onClick={sendWhatsAppReceipt}
                          className="w-full bg-green-500 text-white py-5 text-[11px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-4 hover:bg-green-600 transition-all shadow-xl"
                        >
                            <MessageCircle size={18} fill="white" />
                            Send Receipt via WhatsApp
                        </button>
                    </motion.div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl mb-20">
                    <div className="p-8 border border-zinc-100 rounded-sm flex flex-col items-center text-center group hover:bg-zinc-50 transition-colors">
                        <div className="w-12 h-12 rounded-full bg-zinc-50 flex items-center justify-center mb-6 group-hover:bg-white transition-colors">
                            <Package size={20} className="text-zinc-300 group-hover:text-black transition-colors" />
                        </div>
                        <h3 className="text-[10px] font-black uppercase tracking-widest mb-3">Order Logged</h3>
                        <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-widest">
                            Transaction #NEXORA-{orderDetails?.orderId || Math.floor(Math.random() * 90000) + 10000}
                        </p>
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
                      onClick={() => router.push('/')}
                      className="border border-zinc-200 text-black px-12 py-5 text-[11px] font-black uppercase tracking-[0.3em] hover:bg-zinc-50 transition-all"
                    >
                        Manage Collection
                    </button>
                </div>
            </main>

            <footer className="bg-white border-t border-zinc-100 py-12">
                <div className="container mx-auto px-6 text-center text-[9px] font-black text-zinc-300 uppercase tracking-[0.4em]">
                    Thank you for choosing NEXORA HUB
                </div>
            </footer>
        </div>
    );
};

const SuccessPage = () => {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-white flex items-center justify-center">
                <Loader2 size={40} className="animate-spin text-zinc-200" />
            </div>
        }>
            <SuccessContent />
        </Suspense>
    );
};

export default SuccessPage;
