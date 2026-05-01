"use client";

import React, { useEffect, useState } from 'react';
import { Plus, Tag, Trash2, Edit2, Loader2, LayoutGrid } from 'lucide-react';
import { motion } from 'framer-motion';
import { Toast } from '@/app/components/Toast';
import { ConfirmModal } from '@/app/components/ConfirmModal';


const CategoriesPage = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newCatName, setNewCatName] = useState('');
  const [newCatDescription, setNewCatDescription] = useState('');
  const [creating, setCreating] = useState(false);

  const [toast, setToast] = useState({ isVisible: false, message: '', type: 'success' as 'success' | 'error' });

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ isVisible: true, message, type });
  };

  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    categoryId: null as number | null
  });

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/categories', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch');

      const text = await response.text();
      if (!text) {
        setCategories([]);
        return;
      }

      const data = JSON.parse(text);
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    setCreating(true);
    try {
      const response = await fetch('http://localhost:8080/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          name: newCatName,
          description: newCatDescription
        }),
      });

      if (response.ok) {
        setNewCatName('');
        setNewCatDescription('');
        await fetchCategories();
        showToast('Category created successfully', 'success');
      } else {
        const errText = await response.text();
        let errMsg = 'Failed to create category.';

        try {
          const errObj = JSON.parse(errText);
          errMsg = errObj.message || errMsg;
        } catch (e) {
          errMsg = errText || errMsg;
        }

        showToast(errMsg, 'error');
      }
    } catch (error) {
      console.error('Error creating category:', error);
      showToast('A network error occurred', 'error');
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = (id: number) => {
    setConfirmModal({ isOpen: true, categoryId: id });
  };

  const performDelete = async () => {
    if (!confirmModal.categoryId) return;
    const id = confirmModal.categoryId;

    try {
      const response = await fetch(`http://localhost:8080/api/categories/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        showToast('Category deleted successfully', 'success');
        await fetchCategories();
      } else {
        showToast('Failed to delete category', 'error');
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      showToast('A network error occurred', 'error');
    }
  };

  return (
    <div className="space-y-10 text-left max-w-5xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tighter uppercase">Product Categories</h1>
          <p className="text-xs text-zinc-400 font-bold uppercase tracking-widest mt-1">Organize your luxury watch collection</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Create Form */}
        <div className="lg:col-span-1">
          <form onSubmit={handleCreate} className="bg-white p-8 border border-zinc-100 shadow-sm rounded-sm sticky top-32">
            <h3 className="text-sm font-black uppercase tracking-widest mb-6 flex items-center gap-2">
              <Plus size={16} /> New Category
            </h3>
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Category Name</label>
                <input
                  type="text"
                  required
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  placeholder="e.g. Automatic Watches"
                  className="w-full bg-zinc-50 border border-zinc-100 py-3 px-4 text-sm font-bold focus:border-black outline-none transition-all"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Description</label>
                <textarea
                  value={newCatDescription}
                  onChange={(e) => setNewCatDescription(e.target.value)}
                  placeholder="Briefly describe this timepiece category..."
                  className="w-full bg-zinc-50 border border-zinc-100 py-3 px-4 text-sm font-bold focus:border-black outline-none transition-all h-24"
                />
              </div>
              <button
                disabled={creating}
                className="w-full bg-black text-white py-4 text-xs font-black uppercase tracking-[0.2em] hover:bg-zinc-800 transition-all flex items-center justify-center gap-2 disabled:bg-zinc-400 shadow-xl"
              >
                {creating ? <Loader2 size={16} className="animate-spin" /> : 'Create Category'}
              </button>
            </div>
          </form>
        </div>

        {/* Categories List */}
        <div className="lg:col-span-2 space-y-4">
          {loading ? (
            <div className="flex justify-center py-20"><Loader2 className="animate-spin text-zinc-200" size={32} /></div>
          ) : categories.length === 0 ? (
            <div className="bg-zinc-50 border border-dashed border-zinc-200 py-20 text-center rounded-sm">
              <LayoutGrid size={48} className="mx-auto text-zinc-200 mb-4" />
              <p className="text-xs font-black uppercase tracking-widest text-zinc-400">No categories found in the system</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {categories.map((cat) => (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  key={cat.id}
                  className="bg-white p-6 border border-zinc-100 flex items-center justify-between group hover:border-black transition-all shadow-sm"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-zinc-50 flex items-center justify-center text-zinc-300 group-hover:bg-black group-hover:text-white transition-all">
                      <Tag size={18} />
                    </div>
                    <div>
                      <h4 className="text-sm font-black uppercase tracking-tight">{cat.name}</h4>
                      <p className="text-[10px] text-zinc-400 font-medium line-clamp-1">{cat.description || 'No description provided'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleDelete(cat.id)}
                      className="p-2 text-zinc-300 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
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
        title="Delete Category"
        message="Are you sure you want to delete this category? Any watches associated with this category might be orphaned or removed. This action cannot be undone."
        confirmText="Confirm Delete"
      />
    </div>
  );
};

export default CategoriesPage;
