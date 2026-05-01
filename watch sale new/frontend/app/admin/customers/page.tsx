"use client";

import React, { useEffect, useState } from 'react';
import { Users, Mail, Shield, UserX, Search, Loader2 } from 'lucide-react';
import { Toast } from '@/app/components/Toast';
import { ConfirmModal } from '@/app/components/ConfirmModal';

const CustomersPage = () => {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [toast, setToast] = useState({ isVisible: false, message: '', type: 'success' as 'success' | 'error' });
  const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean; user: any | null }>({
    isOpen: false,
    user: null,
  });

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ isVisible: true, message, type });
  };

  const fetchCustomers = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/users', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch customers: ${response.status}`);
      }

      const data = await response.json();
      setCustomers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching customers:', error);
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleDeleteCustomer = async (user: any) => {
    if (user.role !== 'CUSTOMER') {
      showToast('Only customer accounts can be deleted', 'error');
      return;
    }

    setConfirmModal({ isOpen: true, user });
  };

  const confirmDeleteCustomer = async () => {
    const user = confirmModal.user;
    if (!user) return;

    try {
      setDeletingId(user.id);
      const response = await fetch(`http://localhost:8080/api/users/${user.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const message = errorData?.message || 'Failed to delete customer';
        throw new Error(message);
      }

      setCustomers((prev) => prev.filter((c) => c.id !== user.id));
      showToast(`Customer "${user.username}" deleted successfully`, 'success');
    } catch (error) {
      console.error('Error deleting customer:', error);
      showToast(error instanceof Error ? error.message : 'Failed to delete customer', 'error');
    } finally {
      setDeletingId(null);
      setConfirmModal({ isOpen: false, user: null });
    }
  };

  const filteredCustomers = customers.filter(c => 
    (c?.username ?? '').toLowerCase().includes(searchTerm.toLowerCase()) || 
    (c?.email ?? '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 text-left">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tighter uppercase">Customer Directory</h1>
          <p className="text-xs text-zinc-400 font-bold uppercase tracking-widest mt-1">Manage your premium membership base</p>
        </div>
        <div className="relative group w-full md:w-80">
           <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300 group-focus-within:text-black transition-colors" />
           <input 
              type="text" 
              placeholder="Search by name or email..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-zinc-100 py-3 pl-12 pr-4 text-xs font-bold focus:border-black outline-none transition-all shadow-sm"
           />
        </div>
      </div>

      <div className="bg-white border border-zinc-100 rounded-sm shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-zinc-100 bg-zinc-50/50">
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-400">Customer Details</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-400">Role</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-400">ID Reference</th>
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
            ) : filteredCustomers.map((user) => (
              <tr key={user.id} className="hover:bg-zinc-50/50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-zinc-100 rounded-sm flex items-center justify-center text-zinc-400 font-black group-hover:bg-black group-hover:text-white transition-all">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="text-sm font-black uppercase">{user.username}</h4>
                      <p className="text-xs text-zinc-400 font-medium">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                    user.role === 'ADMIN' ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'
                  }`}>
                    {user.role === 'ADMIN' ? <Shield size={10} /> : <Users size={10} />}
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-xs font-mono text-zinc-300">#USR-{user.id.toString().padStart(4, '0')}</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => handleDeleteCustomer(user)}
                    disabled={deletingId === user.id || user.role !== 'CUSTOMER'}
                    title={user.role !== 'CUSTOMER' ? 'Only customers can be deleted' : 'Delete customer'}
                    className="text-zinc-300 hover:text-red-500 transition-colors p-2 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <UserX size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, user: null })}
        onConfirm={confirmDeleteCustomer}
        title="Delete Customer"
        message={`Are you sure you want to remove "${confirmModal.user?.username ?? 'this customer'}"? This action cannot be undone.`}
        confirmText={deletingId ? 'Deleting...' : 'Delete Customer'}
      />
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={() => setToast((prev) => ({ ...prev, isVisible: false }))}
      />
    </div>
  );
};

export default CustomersPage;
