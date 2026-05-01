"use client";

import React, { useEffect, useState } from 'react';
import { Package, Truck, CheckCircle, Clock, Search, MoreHorizontal, Loader2, Trash2 } from 'lucide-react';
import { ConfirmModal } from '@/app/components/ConfirmModal';
import { OrderDetailsModal } from '@/app/components/OrderDetailsModal';
import { Toast } from '@/app/components/Toast';
import { API_BASE_URL } from '@/lib/api';

const OrdersPage = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Custom Alert States
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, orderId: 0 });
  const [detailsModal, setDetailsModal] = useState({ isOpen: false, order: null });
  const [toast, setToast] = useState({ isVisible: false, message: '', type: 'success' as 'success' | 'error' });

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/orders`, {
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

  const statusMap: { [key: number]: string } = {
    0: 'PENDING',
    1: 'SHIPPED',
    2: 'DELIVERED',
    3: 'CANCELLED'
  };

  const reverseStatusMap: { [key: string]: number } = {
    'PENDING': 0,
    'SHIPPED': 1,
    'DELIVERED': 2,
    'CANCELLED': 3
  };

  const handleStatusUpdate = async (orderId: number, newStatus: string) => {
    try {
      const statusValue = reverseStatusMap[newStatus];
      const response = await fetch(`${API_BASE_URL}/orders/${orderId}/status?status=${statusValue}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        fetchOrders();
        setToast({ isVisible: true, message: 'Order status synchronized successfully.', type: 'success' });
      } else {
        setToast({ isVisible: true, message: 'Fulfillment synchronization failed.', type: 'error' });
      }
    } catch (error) {
      console.error('Status update error:', error);
      setToast({ isVisible: true, message: 'Network error during status update.', type: 'error' });
    }
  };

  const handleDeleteOrder = async (orderId: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        fetchOrders();
        setToast({ isVisible: true, message: 'Acquisition archived and removed from log.', type: 'success' });
      } else {
        setToast({ isVisible: true, message: 'Order archival failed.', type: 'error' });
      }
    } catch (error) {
      console.error('Delete order error:', error);
      setToast({ isVisible: true, message: 'Critical failure during archival.', type: 'error' });
    }
  };

  return (
    <div className="space-y-8 text-left">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tighter uppercase">Order Log</h1>
          <p className="text-xs text-zinc-400 font-bold uppercase tracking-widest mt-1">Monitor and fulfill your global timepiece shipments</p>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
           <div className="relative group flex-1 md:w-64">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300 group-focus-within:text-black transition-colors" />
              <input type="text" placeholder="Find by order ID..." className="w-full bg-white border border-zinc-100 py-3 pl-12 pr-4 text-xs font-bold focus:border-black outline-none transition-all shadow-sm" />
           </div>
        </div>
      </div>

      <div className="bg-white border border-zinc-100 rounded-sm shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-zinc-100 bg-zinc-50/50">
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-400">Order Reference</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-400">Status</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-400 text-right">Amount (LKR)</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-400 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-50">
            {loading ? (
              <tr>
                <td colSpan={4} className="px-6 py-20 text-center">
                  <Loader2 size={24} className="animate-spin inline-block text-zinc-200" />
                </td>
              </tr>
            ) : orders.length === 0 ? (
               <tr>
                <td colSpan={4} className="px-6 py-20 text-center text-zinc-400">
                  <Package size={48} className="mx-auto mb-4 opacity-10" />
                  <p className="text-xs font-black uppercase tracking-widest">No orders recorded in the archives</p>
                </td>
              </tr>
            ) : orders.map((order) => {
              const currentStatusString = statusMap[order.status] || 'PENDING';
              return (
                <tr 
                  key={order.id} 
                  className="hover:bg-zinc-50/50 transition-colors cursor-pointer group"
                  onClick={() => setDetailsModal({ isOpen: true, order })}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-zinc-100 rounded-sm flex items-center justify-center text-zinc-400 group-hover:bg-black group-hover:text-white transition-all">
                        <Package size={18} />
                      </div>
                      <div>
                        <h4 className="text-sm font-black uppercase">Order #WH-{order.id.toString().padStart(6, '0')}</h4>
                        <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">{order.orderDate ? new Date(order.orderDate).toLocaleDateString() : 'N/A'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                    <select 
                      value={currentStatusString}
                      onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                      className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border-none outline-none cursor-pointer ${
                        currentStatusString === 'SHIPPED' ? 'bg-blue-50 text-blue-600' : 
                        currentStatusString === 'DELIVERED' ? 'bg-emerald-50 text-emerald-600' :
                        currentStatusString === 'CANCELLED' ? 'bg-red-50 text-red-600' :
                        'bg-zinc-100 text-zinc-600'
                      }`}
                    >
                      <option value="PENDING">Pending</option>
                      <option value="SHIPPED">Shipped</option>
                      <option value="DELIVERED">Delivered</option>
                      <option value="CANCELLED">Cancelled</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-sm font-black italic">Rs. {order.payment?.amount?.toLocaleString() || '0'}</span>
                  </td>
                  <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => setConfirmModal({ isOpen: true, orderId: order.id })}
                        className="p-2 text-zinc-300 hover:text-red-600 hover:bg-red-50 rounded-sm transition-all"
                        title="Archive Order"
                      >
                        <Trash2 size={16} />
                      </button>
                      <button className="p-2 text-zinc-300 hover:text-black transition-colors">
                        <MoreHorizontal size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      {/* Interactive Alerts */}
      <ConfirmModal 
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
        onConfirm={() => handleDeleteOrder(confirmModal.orderId)}
        title="Archive Acquisition"
        message="Are you certain you wish to archive this order reference? This operation is permanent and cannot be reversed in the archives."
        confirmText="Confirm Archival"
        type="danger"
      />

      <OrderDetailsModal 
        isOpen={detailsModal.isOpen}
        onClose={() => setDetailsModal({ ...detailsModal, isOpen: false })}
        order={detailsModal.order}
      />

      <Toast 
        isVisible={toast.isVisible}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, isVisible: false })}
      />
    </div>
  );
};

export default OrdersPage;
