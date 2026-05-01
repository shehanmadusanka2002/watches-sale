"use client";

import React, { useEffect, useState } from 'react';
import { useCart } from '@/context/CartContext';
import Navbar from '@/app/components/Navbar';
import { Package, Truck, CheckCircle, Clock, ChevronRight, ShoppingBag, ArrowLeft, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

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
        const response = await fetch(`http://localhost:8080/api/orders/user/${user.id}`, {
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
               <Loader2 size={40} className="animate-spin text-zinc-200 mb-6" />
               <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Syncing Collection Data...</p>
            </div>
         ) : orders.length === 0 ? (
            <div className="text-center py-32 border border-dashed border-zinc-100 rounded-sm">
               <ShoppingBag size={48} className="mx-auto mb-6 text-zinc-100" />
               <h3 className="text-lg font-black uppercase tracking-tight mb-2">No Acquisitions Yet</h3>
               <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mb-8">Your horological journey starts here.</p>
               <button 
                  onClick={() => router.push('/')}
                  className="bg-black text-white px-12 py-4 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-zinc-800 transition-all"
               >
                  Explore Collection
               </button>
            </div>
         ) : (
            <div className="space-y-6">
               {orders.map((order) => {
                  const statusMap: { [key: number]: string } = {
                    0: 'PENDING',
                    1: 'SHIPPED',
                    2: 'DELIVERED',
                    3: 'CANCELLED'
                  };
                  const currentStatus = statusMap[order.status] || 'PENDING';

                  return (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      key={order.id}
                      className="border border-zinc-100 rounded-sm overflow-hidden hover:border-black transition-all group"
                    >
                       <div className="p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                          <div className="flex items-center gap-6">
                             <div className="w-16 h-16 bg-zinc-50 rounded-sm flex items-center justify-center text-zinc-300 group-hover:bg-black group-hover:text-white transition-all duration-500">
                                <Package size={24} />
                             </div>
                             <div>
                                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Acquisition ID</p>
                                <h3 className="text-sm font-black uppercase">#WH-{order.id.toString().padStart(6, '0')}</h3>
                             </div>
                          </div>

                          <div className="grid grid-cols-2 md:flex md:items-center gap-10">
                             <div>
                                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Status</p>
                                <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${
                                  currentStatus === 'DELIVERED' ? 'bg-emerald-50 text-emerald-600' : 'bg-zinc-100 text-zinc-600'
                                }`}>
                                  {currentStatus === 'PENDING' ? <Clock size={10} /> : <CheckCircle size={10} />}
                                  {currentStatus}
                                </span>
                             </div>
                             <div>
                                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Value</p>
                                <p className="text-sm font-black italic">Rs. {order.payment?.amount?.toLocaleString() || '0'}</p>
                             </div>
                          </div>

                          <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest group-hover:gap-4 transition-all">
                             Details
                             <ChevronRight size={14} className="text-zinc-300" />
                          </button>
                       </div>
                       
                       {/* Item Summary */}
                       <div className="bg-zinc-50/50 px-8 py-4 border-t border-zinc-50 flex gap-8 overflow-x-auto scrollbar-hide">
                          {order.orderItems?.map((item: any, idx: number) => (
                             <div key={idx} className="flex flex-col gap-1 flex-shrink-0">
                                <span className="text-[9px] font-black uppercase tracking-tighter truncate max-w-[200px]">{item.product?.name || 'Timepiece'}</span>
                                <span className="text-[8px] text-zinc-400 font-bold uppercase tracking-widest">Qty: {item.quantity} &bull; Rs. {item.price.toLocaleString()}</span>
                             </div>
                          ))}
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
