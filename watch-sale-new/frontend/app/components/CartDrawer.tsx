"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, Truck, User } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartDrawer = ({ isOpen, onClose }: CartDrawerProps) => {
  const { cart, updateQuantity, removeFromCart, getCartTotal, getCartCount } = useCart();
  const router = useRouter();
  const [user, setUser] = React.useState<any>(null);

  React.useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      setUser(null);
    }
  }, [isOpen]); // Re-check when drawer opens

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-[0_0_100px_rgba(0,0,0,0.5)] z-[101] flex flex-col"
          >
            {/* Header - High Contrast */}
            <div className="p-8 bg-black text-white flex items-center justify-between relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-zinc-200 via-transparent to-transparent" />
              <div className="flex items-center gap-4 relative z-10">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-md border border-white/10">
                  <ShoppingBag size={18} className="text-white" />
                </div>
                <div className="flex flex-col">
                   <h2 className="text-[11px] font-black uppercase tracking-[0.4em] leading-none">Your Collection</h2>
                   <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest mt-1.5">{getCartCount()} Exquisite Timepieces</span>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-2.5 hover:bg-white/10 rounded-full transition-all group relative z-10"
              >
                <X size={20} className="text-zinc-500 group-hover:text-white transition-colors" />
              </button>
            </div>

            {/* Free Shipping Indicator */}
            {user && cart.length > 0 && (
              <div className="px-8 py-4 bg-zinc-50 border-b border-zinc-100">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500">
                    {getCartTotal() >= 50000 ? "Complimentary Shipping Unlocked" : `Add Rs. ${(50000 - getCartTotal()).toLocaleString()} for Free Shipping`}
                  </span>
                  <Truck size={14} className={getCartTotal() >= 50000 ? "text-indigo-600" : "text-zinc-300"} />
                </div>
                <div className="h-1 w-full bg-zinc-200 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((getCartTotal() / 50000) * 100, 100)}%` }}
                    className={`h-full ${getCartTotal() >= 50000 ? 'bg-indigo-600' : 'bg-black'}`}
                  />
                </div>
              </div>
            )}

            {/* List */}
            <div className="flex-1 overflow-y-auto p-8 scrollbar-hide bg-white">
              {!user ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-12">
                  <div className="w-20 h-20 bg-zinc-50 rounded-full flex items-center justify-center mb-8 border border-zinc-100 shadow-inner">
                    <User size={30} className="text-zinc-300" />
                  </div>
                  <h3 className="text-xs font-black uppercase tracking-[0.3em] text-black mb-4">Identity Verification</h3>
                  <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest leading-relaxed max-w-[240px]">Access your curated collection and personalized offers by signing into your account.</p>
                  <button 
                    onClick={() => {
                      onClose();
                      router.push('/login');
                    }}
                    className="mt-10 bg-black text-white px-10 py-4 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-zinc-800 transition-all shadow-[0_20px_40px_-10px_rgba(0,0,0,0.3)] active:scale-95"
                  >
                    Authenticate
                  </button>
                </div>
              ) : cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-12">
                  <motion.div 
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="w-20 h-20 bg-zinc-50 rounded-full flex items-center justify-center mb-8 border border-zinc-100"
                  >
                    <ShoppingBag size={30} className="text-zinc-200" />
                  </motion.div>
                  <h3 className="text-xs font-black uppercase tracking-[0.3em] text-black mb-4">Collection Empty</h3>
                  <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest leading-relaxed max-w-[240px]">Your masterpiece hasn't been chosen yet. Discover our latest arrivals.</p>
                  <button 
                    onClick={onClose}
                    className="mt-10 text-[10px] font-black uppercase tracking-[0.3em] text-black border-b-2 border-black pb-1 hover:text-zinc-500 hover:border-zinc-200 transition-all"
                  >
                    Explore Catalog
                  </button>
                </div>
              ) : (
                <div className="space-y-10">
                  {cart.map((item, idx) => (
                    <motion.div 
                      key={item.id}
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="flex gap-6 group"
                    >
                      <div className="w-28 h-36 bg-zinc-50 rounded-sm overflow-hidden flex-shrink-0 relative shadow-sm group-hover:shadow-lg transition-all duration-500">
                        <img 
                          src={item.imageUrl?.split('|')[0]} 
                          alt={item.name} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                        />
                      </div>
                      <div className="flex-1 flex flex-col pt-1">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-[9px] font-black text-indigo-600 uppercase tracking-[0.3em]">{item.brand || 'PREMIUM'}</span>
                          <button 
                            onClick={() => removeFromCart(item.id)}
                            className="w-8 h-8 rounded-full bg-zinc-50 flex items-center justify-center text-zinc-300 hover:bg-red-50 hover:text-red-500 transition-all"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                        <h4 className="text-[11px] font-black text-black uppercase tracking-widest mb-2 line-clamp-2 leading-relaxed">{item.name}</h4>
                        <p className="text-xs font-black text-black mb-6 tracking-tighter">Rs. {item.price.toLocaleString()}</p>
                        
                        <div className="mt-auto flex items-center justify-between">
                          <div className="flex items-center bg-zinc-50 rounded-full p-1 border border-zinc-100">
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-white hover:shadow-sm text-zinc-400 hover:text-black transition-all"
                            >
                              <Minus size={10} />
                            </button>
                            <span className="text-[10px] font-black px-3 min-w-[30px] text-center text-black">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-white hover:shadow-sm text-zinc-400 hover:text-black transition-all"
                            >
                              <Plus size={10} />
                            </button>
                          </div>
                          <span className="text-[8px] font-black text-zinc-300 uppercase tracking-[0.2em]">Quantity</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer - Luxury Black */}
            {user && cart.length > 0 && (
              <div className="p-8 bg-zinc-950 text-white space-y-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-5 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
                
                <div className="flex justify-between items-end relative z-10 px-2">
                  <div className="flex flex-col gap-2">
                    <span className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.4em]">Investment Total</span>
                    <span className="text-[8px] text-zinc-600 font-bold uppercase tracking-widest">Inclusive of Luxury Tax & Insurance</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <motion.span 
                      key={getCartTotal()}
                      initial={{ scale: 1.1, opacity: 0.5 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-2xl font-black tracking-tighter"
                    >
                      Rs. {getCartTotal().toLocaleString()}
                    </motion.span>
                  </div>
                </div>
                
                <button 
                  onClick={() => {
                    onClose();
                    router.push('/checkout');
                  }}
                  className="w-full bg-white text-black py-5 text-[11px] font-black uppercase tracking-[0.4em] flex items-center justify-center gap-4 hover:bg-zinc-200 transition-all shadow-[0_20px_50px_rgba(0,0,0,0.3)] active:scale-95 group relative z-10"
                >
                  Confirm & Checkout
                  <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform duration-500" />
                </button>
                
                <div className="flex items-center justify-center gap-4 relative z-10 pt-2">
                   <div className="h-px flex-1 bg-white/5" />
                   <p className="text-[8px] text-zinc-600 font-black uppercase tracking-[0.3em]">
                     Encrypted Secure Transaction
                   </p>
                   <div className="h-px flex-1 bg-white/5" />
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
