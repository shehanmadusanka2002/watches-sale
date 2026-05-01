"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Package, User, CreditCard, Calendar, Hash, MapPin, Phone, Mail } from 'lucide-react';

interface OrderDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: any;
}

export const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({ isOpen, onClose, order }) => {
  if (!order) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-4xl bg-white shadow-2xl rounded-sm overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="px-8 py-6 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-black text-white flex items-center justify-center rounded-sm">
                  <Package size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-black uppercase tracking-tighter">Order Details</h2>
                  <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">Acquisition Reference #WH-{order.id.toString().padStart(6, '0')}</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-zinc-100 rounded-full transition-colors text-zinc-400 hover:text-black"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                
                {/* Left Column: Customer & Payment */}
                <div className="lg:col-span-1 space-y-10">
                  <section>
                    <div className="flex items-center gap-2 mb-4">
                      <User size={14} className="text-zinc-400" />
                      <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Customer Identity</h3>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center text-[10px] font-black uppercase">
                          {(order.firstName || order.user?.firstName)?.[0] || 'U'}
                        </div>
                        <div>
                          <p className="text-sm font-black uppercase">
                            {order.firstName || order.user?.firstName} {order.lastName || order.user?.lastName}
                          </p>
                          <div className="flex items-center gap-2 text-[10px] text-zinc-400 font-bold mt-0.5">
                            <Mail size={10} />
                            <span>{order.email || order.user?.email}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>

                  <section>
                    <div className="flex items-center gap-2 mb-4">
                      <MapPin size={14} className="text-zinc-400" />
                      <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Shipping Logistics</h3>
                    </div>
                    <div className="p-4 bg-zinc-50 border border-zinc-100 rounded-sm space-y-3">
                      <div>
                        <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400 mb-1">Destination Address</p>
                        <p className="text-[11px] font-bold uppercase leading-relaxed">{order.shippingAddress || 'N/A'}</p>
                        <p className="text-[11px] font-black uppercase mt-1">{order.city}</p>
                      </div>
                      <div className="pt-3 border-t border-zinc-200 flex items-center gap-2">
                        <Phone size={12} className="text-zinc-400" />
                        <span className="text-[11px] font-black">{order.phone || 'N/A'}</span>
                      </div>
                    </div>
                  </section>

                  <section>
                    <div className="flex items-center gap-2 mb-4">
                      <CreditCard size={14} className="text-zinc-400" />
                      <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Financial Summary</h3>
                    </div>
                    <div className="p-4 bg-zinc-50 border border-zinc-100 rounded-sm space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Total Amount</span>
                        <span className="text-sm font-black">Rs. {order.payment?.amount?.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Method</span>
                        <span className="text-[10px] font-black uppercase tracking-widest bg-white px-2 py-1 border border-zinc-200">
                          {order.payment?.method?.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Transaction ID</span>
                        <span className="text-[9px] font-mono font-bold text-zinc-400 truncate max-w-[120px]">
                          {order.payment?.transactionId}
                        </span>
                      </div>
                    </div>
                  </section>

                  <section>
                    <div className="flex items-center gap-2 mb-4">
                      <Calendar size={14} className="text-zinc-400" />
                      <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Timestamp</h3>
                    </div>
                    <p className="text-sm font-black uppercase">
                      {new Date(order.orderDate).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </section>
                </div>

                {/* Right Column: Order Items */}
                <div className="lg:col-span-2">
                  <div className="flex items-center gap-2 mb-6">
                    <Package size={14} className="text-zinc-400" />
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Acquired Timepieces</h3>
                  </div>
                  
                  <div className="space-y-4">
                    {order.orderItems?.map((item: any) => (
                      <div key={item.id} className="flex gap-6 p-4 border border-zinc-100 rounded-sm hover:border-zinc-300 transition-colors">
                        <div className="w-20 h-24 bg-zinc-50 border border-zinc-200 rounded-sm overflow-hidden flex-shrink-0">
                          <img 
                            src={item.product?.imageUrl?.split('|')[0]} 
                            alt={item.product?.name} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 flex flex-col justify-center">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="text-xs font-black uppercase tracking-tight">{item.product?.name}</h4>
                              <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-widest mt-1">{item.product?.brand}</p>
                            </div>
                            <span className="text-xs font-black italic text-zinc-400">x{item.quantity}</span>
                          </div>
                          <div className="mt-4 flex justify-between items-center">
                             <span className="text-[10px] font-black uppercase tracking-widest px-2 py-1 bg-zinc-100 rounded-sm">
                                {item.product?.movementType || 'QUARTZ'}
                             </span>
                             <span className="text-sm font-black">Rs. {(item.price * item.quantity).toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-10 pt-6 border-t-2 border-zinc-100 flex justify-between items-center">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Total Valuation</p>
                    <p className="text-2xl font-black italic tracking-tighter">Rs. {order.payment?.amount?.toLocaleString()}</p>
                  </div>
                </div>

              </div>
            </div>

            {/* Footer */}
            <div className="px-8 py-6 bg-zinc-50 border-t border-zinc-100 flex justify-end">
              <button 
                onClick={onClose}
                className="bg-black text-white px-8 py-3 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-zinc-800 transition-all shadow-xl"
              >
                Close Log
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
