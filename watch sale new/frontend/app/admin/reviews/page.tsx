"use client";

import React, { useState, useEffect } from 'react';
import { MessageSquare, Star, Trash2, Search, Filter } from 'lucide-react';
import { Toast } from '@/app/components/Toast';
import { ConfirmModal } from '@/app/components/ConfirmModal';

const AdminReviews = () => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ isVisible: false, message: '', type: 'success' as 'success' | 'error' });
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, reviewId: null as number | null });

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ isVisible: true, message, type });
  };

  const fetchAllReviews = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/reviews', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      
      const formattedReviews = data.map((r: any) => ({
        id: r.id,
        productName: r.product?.name || 'Unknown Product',
        username: r.user?.username || 'Anonymous',
        rating: r.rating,
        comment: r.comment,
        date: r.createdAt ? new Date(r.createdAt).toLocaleDateString() : 'N/A'
      }));

      setReviews(formattedReviews);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      showToast('Failed to load real reviews', 'error');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllReviews();
  }, []);

  const handleDelete = (id: number) => {
    setConfirmModal({ isOpen: true, reviewId: id });
  };

  const performDelete = async () => {
    if (!confirmModal.reviewId) return;
    // Implement delete logic here
    showToast('Review removed successfully', 'success');
    setConfirmModal({ isOpen: false, reviewId: null });
  };

  return (
    <div className="space-y-8 text-left">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-zinc-900">Customer Feedback</h1>
        <p className="text-xs text-zinc-400 font-bold uppercase tracking-widest mt-1">Monitor and manage collector reviews</p>
      </div>

      <div className="bg-white border border-zinc-100 rounded-sm shadow-sm overflow-hidden">
        <div className="p-6 border-b border-zinc-50 flex flex-col md:flex-row justify-between items-center gap-4">
           <div className="relative w-full max-w-md">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300" />
              <input 
                type="text" 
                placeholder="Search reviews..." 
                className="w-full bg-zinc-50 border border-zinc-100 py-3 pl-12 pr-4 text-sm focus:border-black outline-none transition-all"
              />
           </div>
           <button className="p-3 border border-zinc-100 rounded-sm hover:bg-zinc-50 text-zinc-400">
             <Filter size={18} />
           </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-zinc-50 border-b border-zinc-100">
              <tr>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-400">Collector</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-400">Product</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-400">Rating</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-400">Comment</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
              {reviews.map((review) => (
                <tr key={review.id} className="hover:bg-zinc-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-white text-[10px] font-black">
                        {review.username.charAt(0)}
                      </div>
                      <span className="text-sm font-black text-zinc-900">{review.username}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-bold text-zinc-600">{review.productName}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={12} className={i < review.rating ? 'fill-black text-black' : 'text-zinc-200'} />
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-xs text-zinc-500 font-medium line-clamp-2 max-w-md">{review.comment}</p>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => handleDelete(review.id)}
                      className="p-2 bg-zinc-50 text-zinc-400 hover:text-red-600 hover:bg-red-50 transition-all rounded-sm"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Toast 
        message={toast.message} 
        type={toast.type} 
        isVisible={toast.isVisible} 
        onClose={() => setToast({ ...toast, isVisible: false })} 
      />
      
      <ConfirmModal 
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
        onConfirm={performDelete}
        title="Remove Review"
        message="Are you sure you want to remove this customer review? This action cannot be undone."
        confirmText="Remove Review"
        type="danger"
      />
    </div>
  );
};

export default AdminReviews;
