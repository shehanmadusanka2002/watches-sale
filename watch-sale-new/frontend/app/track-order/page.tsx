'use client';

import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Package, Truck, CheckCircle2, Clock, AlertCircle, ChevronRight, MapPin, Phone, User } from 'lucide-react';
import { API_BASE_URL } from '@/lib/api';

const TrackOrder = () => {
  const [orderId, setOrderId] = useState('');
  const [phone, setPhone] = useState('');
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setOrder(null);

    try {
      const response = await fetch(`${API_BASE_URL}/orders/track/public?id=${orderId}&phone=${phone}`);
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Order not found');
      }
      const data = await response.json();
      setOrder(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusSteps = (status: number) => {
    const steps = [
      { id: 'PENDING', label: 'Ordered', icon: Clock, description: 'Order received & pending' },
      { id: 'CONFIRMED', label: 'Confirmed', icon: Package, description: 'Verified by boutique' },
      { id: 'SHIPPED', label: 'Shipped', icon: Truck, description: 'In transit to destination' },
      { id: 'DELIVERED', label: 'Delivered', icon: CheckCircle2, description: 'Successfully received' },
    ];

    const currentStatus = order?.orderStatus || 'PENDING';
    const statusOrder = ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED'];
    let currentStepIndex = statusOrder.indexOf(currentStatus.toUpperCase());
    
    if (currentStatus.toUpperCase() === 'CANCELLED') return [];

    return steps.map((step, index) => ({
      ...step,
      active: index <= currentStepIndex,
      current: index === currentStepIndex
    }));
  };

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      
      <div className="container mx-auto px-6 pt-32 pb-24">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl font-black tracking-tighter uppercase mb-4 italic"
            >Track <span className="text-zinc-200">Acquisition</span></motion.h1><p className="text-[10px] text-zinc-400 font-black uppercase tracking-[0.4em]">Monitor your luxury timepiece&apos;s journey</p>
          </div>

          {/* Search Form */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-zinc-50 p-8 md:p-12 rounded-sm border border-zinc-100 shadow-xl mb-12"
          >
            <form onSubmit={handleTrack} className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Order ID / Acquisition ID</label>
                <div className="relative">
                  <Package className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300" size={18} />
                  <input 
                    type="text"
                    placeholder="e.g. #WH-000023"
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                    required
                    className="w-full bg-white border border-zinc-100 py-4 pl-12 pr-4 text-sm font-bold focus:border-black outline-none transition-all uppercase"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300" size={18} />
                  <input 
                    type="tel"
                    placeholder="077 123 4567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="w-full bg-white border border-zinc-100 py-4 pl-12 pr-4 text-sm font-bold focus:border-black outline-none transition-all"
                  />
                </div>
              </div>
              <div className="md:col-span-2">
                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full bg-black text-white py-5 text-[10px] font-black uppercase tracking-[0.4em] hover:bg-zinc-800 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {loading ? 'Consulting Records...' : (
                    <>
                      <Search size={14} /> Track Journey
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>

          {/* Results Area */}
          <AnimatePresence mode="wait">
            {error && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-red-50 border border-red-100 p-6 rounded-sm flex items-center gap-4 text-red-600"
              >
                <AlertCircle size={20} />
                <p className="text-xs font-bold uppercase tracking-widest">{error}</p>
              </motion.div>
            )}

            {order && (
              <motion.div 
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                {/* Progress Bar */}
                <div className="bg-white border border-zinc-100 p-8 md:p-12 rounded-sm shadow-sm overflow-hidden relative">
                   {order?.orderStatus?.toUpperCase() === 'CANCELLED' ? (
                      <div className="text-center py-8">
                         <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600">
                            <AlertCircle size={32} />
                         </div>
                         <h3 className="text-xl font-black uppercase italic">Order Cancelled</h3>
                         <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mt-2">This acquisition has been terminated</p>
                      </div>
                   ) : (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 relative">
                        {/* Connecting Line (Desktop) */}
                        <div className="hidden md:block absolute top-7 left-0 right-0 h-[2px] bg-zinc-100 -z-0" />
                        
                        {getStatusSteps(order.status).map((step, idx) => (
                          <div key={idx} className="flex flex-col items-center text-center relative z-10">
                            <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 transition-all duration-700 ${step.active ? 'bg-black text-white shadow-xl scale-110' : 'bg-zinc-50 text-zinc-200'}`}>
                              <step.icon size={24} />
                            </div>
                            <h4 className={`text-[10px] font-black uppercase tracking-widest mb-1 ${step.active ? 'text-black' : 'text-zinc-300'}`}>{step.label}</h4>
                            <p className="text-[8px] text-zinc-400 font-bold uppercase tracking-tighter max-w-[100px]">{step.description}</p>
                          </div>
                        ))}
                      </div>
                   )}
                </div>

                {/* Order Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                   {/* Shipping Info */}
                   <div className="md:col-span-2 bg-zinc-50 p-8 rounded-sm border border-zinc-100">
                      <h3 className="text-xs font-black uppercase tracking-[0.3em] mb-8 flex items-center gap-2">
                         <MapPin size={14} /> Destination Details
                      </h3>
                      <div className="space-y-4">
                         <div className="flex items-start gap-4">
                            <User size={14} className="text-zinc-400 mt-1" />
                            <div>
                               <p className="text-[10px] font-black uppercase text-zinc-400 mb-1">Consignee</p>
                               <p className="text-sm font-bold uppercase">{order.firstName} {order.lastName}</p>
                            </div>
                         </div>
                         <div className="flex items-start gap-4">
                            <MapPin size={14} className="text-zinc-400 mt-1" />
                            <div>
                               <p className="text-[10px] font-black uppercase text-zinc-400 mb-1">Delivery Address</p>
                               <p className="text-sm font-bold uppercase leading-relaxed">{order.shippingAddress}, {order.city}</p>
                            </div>
                         </div>
                      </div>
                   </div>

                   {/* Quick Summary */}
                   <div className="bg-black text-white p-8 rounded-sm shadow-2xl flex flex-col justify-between">
                      <div>
                        <p className="text-[9px] font-black uppercase tracking-[0.4em] text-zinc-500 mb-2">Total Value</p>
                        <h2 className="text-3xl font-black italic tracking-tighter">Rs. {order.payment?.amount?.toLocaleString()}</h2>
                      </div>
                      <div className="mt-8 pt-8 border-t border-zinc-800">
                        <p className="text-[9px] font-black uppercase tracking-[0.4em] text-zinc-500 mb-2">Payment Method</p>
                        <p className="text-xs font-bold uppercase tracking-widest">{order.payment?.paymentMethod?.replace('_', ' ')}</p>
                      </div>
                   </div>
                </div>

                {/* Items List */}
                <div className="bg-white border border-zinc-100 p-8 rounded-sm">
                   <h3 className="text-xs font-black uppercase tracking-[0.3em] mb-8">Acquisition Items</h3>
                   <div className="space-y-6">
                      {order.orderItems?.map((item: any, idx: number) => (
                        <div key={idx} className="flex items-center gap-6 group">
                           <div className="w-16 h-20 bg-zinc-50 rounded-sm overflow-hidden">
                              <img src={item.product?.imageUrl?.split('|')[0]} alt={item.product?.name} className="w-full h-full object-cover" />
                           </div>
                           <div className="flex-grow">
                              <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-1">{item.product?.brand}</p>
                              <h4 className="text-sm font-black uppercase tracking-widest">{item.product?.name}</h4>
                              <p className="text-xs font-bold text-zinc-400 mt-1">QTY: {item.quantity} • RS. {item.price?.toLocaleString()}</p>
                           </div>
                           <div className="text-right">
                              <p className="text-sm font-black italic">Rs. {(item.price * item.quantity).toLocaleString()}</p>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
};

export default TrackOrder;
