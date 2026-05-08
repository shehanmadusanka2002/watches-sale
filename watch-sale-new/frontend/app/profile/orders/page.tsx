"use client";

import React, { useEffect, useState } from 'react';
import { useCart } from '@/context/CartContext';
import Navbar from '@/app/components/Navbar';
import { Package, Truck, CheckCircle, Clock, ChevronRight, ShoppingBag, ArrowLeft, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { API_BASE_URL } from '@/lib/api';

const UserOrdersPage = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchMyOrders = async () => {
      const storedUser = localStorage.getItem('user');
      const user = storedUser ? JSON.parse(storedUser) : null;

      if (!user?.id) {
        router.push('/login');
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/orders/user/${user.id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch orders: ${response.status}`);
        }

        const data = await response.json();
        setOrders(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    fetchMyOrders();
  }, [router]);

  return (
    <div className="min-h-screen bg-white font-sans text-black">
      <Navbar />

      <main className="container mx-auto px-6 py-12 md:py-20 max-w-5xl">
         <div className="mb-12">
            <button 
              onClick={() => router.push('/')}
              className="flex items-center gap-2 text-zinc-400 hover:text-black transition-colors mb-8 group"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              <span className="text-[10px] font-black uppercase tracking-widest">Back to Boutique</span>
            </button>
            <h1 className="text-4xl font-black tracking-tighter uppercase mb-2">My Portfolio</h1>
            <p className="text-[10px] text-zinc-400 font-black uppercase tracking-[0.2em]">Track your luxury acquisitions</p>
         </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-40">
               <Loader2 size={40} className="animate-spin text-zinc-100 mb-6" />
               <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Syncing Collection Data...</p>
            </div>
         ) : orders.length === 0 ? (
            <div className="text-center py-32 border-2 border-dashed border-zinc-50 rounded-2xl">
               <div className="w-20 h-20 bg-zinc-50 rounded-full flex items-center justify-center mx-auto mb-8">
                  <ShoppingBag size={32} className="text-zinc-200" />
               </div>
               <h3 className="text-xl font-black uppercase tracking-tight mb-4">Portfolio is Empty</h3>
               <p className="text-[11px] text-zinc-400 font-bold uppercase tracking-[0.2em] mb-10 max-w-xs mx-auto leading-relaxed">Your journey through time starts with your first masterpiece.</p>
               <button 
                  onClick={() => router.push('/')}
                  className="bg-black text-white px-12 py-5 text-[10px] font-black uppercase tracking-[0.4em] hover:bg-zinc-800 transition-all shadow-xl"
               >
                  Explore Collection
               </button>
            </div>
         ) : (
            <div className="space-y-10 pb-32">
               {orders.map((order, orderIdx) => {
                  const statusMap: { [key: number]: { label: string, color: string, icon: any } } = {
                    0: { label: 'PENDING', color: 'bg-amber-50 text-amber-600 border-amber-100', icon: Clock },
                    1: { label: 'SHIPPED', color: 'bg-blue-50 text-blue-600 border-blue-100', icon: Truck },
                    2: { label: 'DELIVERED', color: 'bg-emerald-50 text-emerald-600 border-emerald-100', icon: CheckCircle },
                    3: { label: 'CANCELLED', color: 'bg-rose-50 text-rose-600 border-rose-100', icon: X }
                  };
                  const status = statusMap[order.status] || statusMap[0];
                  const StatusIcon = status.icon;

                  return (
                    <motion.div 
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: orderIdx * 0.1 }}
                      key={order.id}
                      className="bg-white border border-zinc-100 rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.02)] hover:shadow-[0_30px_60px_rgba(0,0,0,0.04)] transition-all duration-700"
                    >
                       {/* Header Section */}
                       <div className="p-8 md:p-10 border-b border-zinc-50">
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                             <div className="flex items-center gap-6">
                                <div className="w-16 h-16 bg-zinc-950 rounded-2xl flex items-center justify-center text-white shadow-2xl transition-transform group-hover:scale-110">
                                   <Package size={24} />
                                </div>
                                <div>
                                   <div className="flex items-center gap-3 mb-2">
                                      <p className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.4em]">Acquisition</p>
                                      <div className={`px-2.5 py-0.5 rounded-full border ${status.color} text-[8px] font-black uppercase tracking-widest flex items-center gap-1.5`}>
                                         <StatusIcon size={10} />
                                         {status.label}
                                      </div>
                                   </div>
                                   <h3 className="text-lg font-black uppercase tracking-tight">#WH-{order.id.toString().padStart(6, '0')}</h3>
                                </div>
                             </div>

                             <div className="grid grid-cols-2 md:flex md:items-center gap-12 md:gap-16">
                                <div className="flex flex-col">
                                   <p className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.4em] mb-2">Investment</p>
                                   <p className="text-xl font-black tracking-tighter">Rs. {order.payment?.amount?.toLocaleString() || '0'}</p>
                                </div>
                                <div className="flex flex-col">
                                   <p className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.4em] mb-2">Date</p>
                                   <p className="text-[11px] font-black uppercase tracking-widest">{new Date(order.orderDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                                </div>
                             </div>
                          </div>
                       </div>
                       
                       {/* Items List Section */}
                       <div className="bg-zinc-50/30 p-8 md:p-10 space-y-6">
                          <p className="text-[8px] font-black text-zinc-300 uppercase tracking-[0.5em] mb-4">Included Masterpieces</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {order.orderItems?.map((item: any, idx: number) => (
                               <div key={idx} className="flex items-center gap-5 group/item">
                                  <div className="w-16 h-20 bg-white rounded-lg border border-zinc-100 overflow-hidden flex-shrink-0 shadow-sm group-hover/item:shadow-md transition-all">
                                     <img 
                                        src={item.product?.imageUrl?.split('|')[0] || 'https://images.unsplash.com/photo-1524592094714-0f0654e20314'} 
                                        className="w-full h-full object-cover transition-transform group-hover/item:scale-110 duration-700"
                                        alt={item.product?.name}
                                     />
                                  </div>
                                  <div className="flex flex-col gap-1.5 overflow-hidden">
                                     <span className="text-[10px] font-black uppercase tracking-widest text-black truncate leading-tight">{item.product?.name || 'Luxury Timepiece'}</span>
                                     <div className="flex items-center gap-3">
                                        <span className="text-[9px] font-black text-zinc-400">QTY: {item.quantity}</span>
                                        <div className="w-1 h-1 bg-zinc-200 rounded-full" />
                                        <span className="text-[9px] font-black text-zinc-600 tracking-tighter">Rs. {item.price.toLocaleString()}</span>
                                     </div>
                                  </div>
                               </div>
                            ))}
                          </div>
                       </div>

                       {/* Action Bar */}
                       <div className="px-8 py-5 border-t border-zinc-50 flex items-center justify-between">
                          <button className="flex items-center gap-3 text-[9px] font-black uppercase tracking-[0.3em] text-zinc-400 hover:text-black transition-all group/btn">
                             Digital Certificate
                             <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                          </button>
                          <button 
                            onClick={() => router.push(`/profile/orders/${order.id}`)}
                            className="bg-zinc-50 hover:bg-black hover:text-white px-6 py-2.5 rounded-full text-[8px] font-black uppercase tracking-widest transition-all duration-500"
                          >
                            View Experience
                          </button>
                       </div>
                    </motion.div>
                  );
               })}
            </div>
         )}
      </main>

      {/* Footer Placeholder */}
      <footer className="bg-white border-t border-zinc-100 py-12">
          <div className="container mx-auto px-6 text-center">
              <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.5em]">ANIX OFFICIAL BOUTIQUE &copy; 2026</p>
          </div>
      </footer>
    </div>
  );
};

export default UserOrdersPage;
