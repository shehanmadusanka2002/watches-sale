"use client";

import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Edit, Trash2, Watch as WatchIcon, Package, DollarSign, Tag } from 'lucide-react';
import { fetchProducts, API_BASE_URL } from '@/lib/api';
import { Toast } from '@/app/components/Toast';
import { ConfirmModal } from '@/app/components/ConfirmModal';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [selectedProductForView, setSelectedProductForView] = useState<any | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    price: '',
    stockQuantity: '',
    description: '',
    movementType: '',
    caseMaterial: '',
    waterResistance: '',
    warranty: '',
    imageUrls: ['', '', '', '', ''],
    categoryId: '',
    categoryType: ''
  });

  const CATEGORY_TYPES = [
    "MEN'S WATCHES",
    "WOMEN'S WATCHES",
    "COUPLE WATCHES",
    "SMART WATCHES",
    "VINTAGE EDITION",
    "NEW ARRIVALS",
    "CHILDREN WATCHES"
  ];

  const [toast, setToast] = useState({ isVisible: false, message: '', type: 'success' as 'success' | 'error' });

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ isVisible: true, message, type });
  };

  const [confirmModal, setConfirmModal] = useState({ 
    isOpen: false, 
    productId: null as number | null 
  });

  const getProducts = async () => {
    const data = await fetchProducts();
    setProducts(data);
  };

  const getCategories = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/categories`);
      if (!response.ok) throw new Error('Failed to fetch categories');
      
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
    }
  };

  useEffect(() => {
    const initData = async () => {
       await Promise.all([getProducts(), getCategories()]);
       setLoading(false);
    };
    initData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.categoryId) {
        alert("Please select a category");
        return;
    }
    try {
      const url = isEditMode 
        ? `${API_BASE_URL}/products/${selectedProductId}`
        : `${API_BASE_URL}/products`;
      
      const method = isEditMode ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
        ...formData,
        imageUrl: formData.imageUrls.filter(url => url.trim() !== '').join('|')
      }),
      });

      if (response.ok) {
        setShowAddModal(false);
        setIsEditMode(false);
        setSelectedProductId(null);
        setFormData({ name: '', brand: '', price: '', stockQuantity: '', description: '', movementType: '', caseMaterial: '', waterResistance: '', warranty: '', imageUrls: ['', '', '', '', ''], categoryId: '', categoryType: '' });
        getProducts();
        showToast(isEditMode ? 'Timepiece updated successfully' : 'Watch added to collection successfully', 'success');
      } else {
        showToast(isEditMode ? 'Failed to update product' : 'Failed to add product', 'error');
      }
    } catch (error) {
      console.error('Error saving product:', error);
      showToast('A network error occurred', 'error');
    }
  };

  const handleEdit = (product: any) => {
    setIsEditMode(true);
    setSelectedProductId(product.id);
    const imageUrls = product.imageUrl ? product.imageUrl.split('|') : [];
    // Ensure we have 5 slots
    const paddedUrls = [...imageUrls];
    while (paddedUrls.length < 5) paddedUrls.push('');
    
    setFormData({
      name: product.name || '',
      brand: product.brand || '',
      price: product.price?.toString() || '',
      stockQuantity: product.stockQuantity?.toString() || '',
      description: product.description || '',
      movementType: product.movementType || '',
      caseMaterial: product.caseMaterial || '',
      waterResistance: product.waterResistance || '',
      warranty: product.warranty || '',
      imageUrls: paddedUrls.slice(0, 5) as [string, string, string, string, string],
      categoryId: product.category?.id?.toString() || '',
      categoryType: product.categoryType || ''
    });
    setShowAddModal(true);
  };

  const handleRowClick = (product: any) => {
    setSelectedProductForView(product);
  };
  const handleDelete = (id: number) => {
    setConfirmModal({ isOpen: true, productId: id });
  };

  const performDelete = async () => {
    if (!confirmModal.productId) return;
    const id = confirmModal.productId;
    
    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        showToast('Product removed from collection', 'success');
        getProducts();
      } else {
        showToast('Failed to delete product', 'error');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      showToast('A network error occurred', 'error');
    }
  };

  return (
    <div className="space-y-8 text-left">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-zinc-900">Product Inventory</h1>
          <p className="text-xs text-zinc-400 font-bold uppercase tracking-widest mt-1">Manage and update your luxury collection</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-black text-white px-8 py-3 text-xs font-black uppercase tracking-[0.2em] rounded-sm shadow-xl hover:bg-zinc-800 transition-all flex items-center gap-2"
        >
          <Plus size={18} />
          Add New Watch
        </button>
      </div>

      {/* Stats Quick View */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {(() => {
           const avgPrice = products.length > 0 
             ? products.reduce((acc: number, p: any) => acc + (p.price || 0), 0) / products.length 
             : 0;
           
           return [
             { label: 'Total Products', value: products.length, icon: Package, color: 'text-blue-600' },
             { label: 'Avg. Price', value: `Rs. ${Math.round(avgPrice).toLocaleString()}`, icon: DollarSign, color: 'text-green-600' },
             { label: 'Total Categories', value: categories.length, icon: Tag, color: 'text-purple-600' }
           ].map((stat) => (
             <div key={stat.label} className="bg-white p-6 rounded-sm border border-zinc-100 flex items-center gap-6 shadow-sm">
                <div className={`p-4 rounded-full bg-zinc-50 ${stat.color}`}>
                   <stat.icon size={24} />
                </div>
                <div className="flex flex-col">
                   <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">{stat.label}</span>
                   <span className="text-2xl font-black">{stat.value}</span>
                </div>
             </div>
           ));
         })()}
      </div>

      {/* Main Table Container */}
      <div className="bg-white border border-zinc-100 rounded-sm shadow-sm overflow-hidden text-left">
        <div className="p-6 border-b border-zinc-50 flex flex-col md:flex-row justify-between items-center gap-4">
           <div className="relative w-full max-w-md">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300" />
              <input 
                type="text" 
                placeholder="Search by brand or reference..." 
                className="w-full bg-zinc-50 border border-zinc-100 py-3 pl-12 pr-4 text-sm focus:border-black outline-none transition-all"
              />
           </div>
           <div className="flex items-center gap-3">
              <button className="p-3 border border-zinc-100 rounded-sm hover:bg-zinc-50 text-zinc-400"><Filter size={18} /></button>
           </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-zinc-50 border-b border-zinc-100">
              <tr>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-400">Watch Details</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-400">Description</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-400">Section</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-400">Movement</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-400">Price (LKR)</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-400">Stock</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
              {products.map((product: any) => (
                <tr 
                  key={product.id} 
                  onClick={() => handleRowClick(product)}
                  className="hover:bg-zinc-50/50 transition-colors group cursor-pointer"
                >
                  <td className="px-6 py-4">
                     <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-zinc-100 rounded-sm flex items-center justify-center p-2">
                           {product.imageUrl ? <img src={product.imageUrl.split('|')[0]} className="w-full h-full object-contain" /> : <WatchIcon className="text-zinc-300" />}
                        </div>
                        <div className="flex flex-col">
                           <span className="text-sm font-black text-zinc-900">{product.name}</span>
                           <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{product.brand || 'LuxuryBrand'}</span>
                        </div>
                     </div>
                  </td>
                  <td className="px-6 py-4">
                     <p className="text-xs text-zinc-500 font-medium line-clamp-2 max-w-[200px]">{product.description || 'No description'}</p>
                  </td>
                  <td className="px-6 py-4">
                     <span className="text-[10px] font-black uppercase tracking-widest text-zinc-900 bg-zinc-100 px-2 py-1 rounded-sm">
                        {product.categoryType || 'Unassigned'}
                     </span>
                  </td>
                  <td className="px-6 py-4">
                     <span className="text-[9px] font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 px-2 py-1 rounded-sm">
                        {product.movementType || 'Not Set'}
                     </span>
                  </td>
                  <td className="px-6 py-4">
                     <span className="text-sm font-black text-zinc-900">Rs. {product.price?.toLocaleString()}</span>
                  </td>
                  <td className="px-6 py-4">
                     <div className="flex flex-col gap-1">
                        <div className="w-24 h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                           <div 
                             className={`h-full ${product.stockQuantity < 5 ? 'bg-red-500' : 'bg-green-500'}`} 
                             style={{ width: `${Math.min(product.stockQuantity * 5, 100)}%` }} 
                           />
                        </div>
                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{product.stockQuantity} Units</span>
                     </div>
                  </td>
                   <td className="px-6 py-4 text-right">
                       <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={(e) => {
                               e.stopPropagation();
                               handleEdit(product);
                            }}
                            className="p-2 bg-zinc-50 text-zinc-400 hover:text-black hover:bg-zinc-100 transition-all rounded-sm"
                          >
                             <Edit size={14} />
                          </button>
                          <button 
                           onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(product.id);
                           }}
                           className="p-2 bg-zinc-50 text-zinc-400 hover:text-red-600 hover:bg-red-50 transition-all rounded-sm"
                          >
                             <Trash2 size={14} />
                          </button>
                       </div>
                   </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Simple Add Modal Overlay */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 md:p-10">
           <form 
             onSubmit={handleSubmit} 
             className="bg-white w-full max-w-2xl p-6 md:p-10 rounded-sm shadow-2xl relative max-h-[90vh] overflow-y-auto scrollbar-hide"
           >
              <button 
                type="button" 
                onClick={() => {
                  setShowAddModal(false);
                  setIsEditMode(false);
                  setSelectedProductId(null);
                  setFormData({ name: '', brand: '', price: '', stockQuantity: '', description: '', movementType: '', caseMaterial: '', waterResistance: '', warranty: '', imageUrls: ['', '', '', '', ''], categoryId: '', categoryType: '' });
                }} 
                className="absolute top-6 right-6 text-zinc-300 hover:text-black"
              >
                <Plus size={24} className="rotate-45" />
              </button>
              <h2 className="text-2xl font-black mb-1">{isEditMode ? 'Update Timepiece' : 'Add Premium Watch'}</h2>
              <p className="text-xs text-zinc-400 font-bold uppercase tracking-widest mb-8">
                {isEditMode ? 'Modify the details of this masterpiece' : 'Fill in the details for the luxury timepiece'}
              </p>
              
              <div className="grid grid-cols-2 gap-6 text-left">
                 <div className="space-y-1 text-left">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Watch Name</label>
                    <input 
                      type="text" 
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-zinc-50 border border-zinc-100 py-3 px-4 text-sm focus:border-black outline-none transition-all" 
                      placeholder="e.g. Naviforce NF9117" 
                    />
                 </div>
                 <div className="space-y-1 text-left">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Brand</label>
                    <input 
                      type="text" 
                      required
                      value={formData.brand}
                      onChange={(e) => setFormData({...formData, brand: e.target.value})}
                      className="w-full bg-zinc-50 border border-zinc-100 py-3 px-4 text-sm focus:border-black outline-none transition-all" 
                      placeholder="e.g. CASIO" 
                    />
                 </div>
                 <div className="space-y-1 text-left">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Display Section</label>
                    <select 
                      required
                      className="w-full bg-zinc-50 border border-zinc-100 py-3 px-4 text-sm focus:border-black outline-none transition-all appearance-none"
                      value={formData.categoryType}
                      onChange={(e) => setFormData({...formData, categoryType: e.target.value})}
                    >
                       <option value="">Select Section</option>
                       {CATEGORY_TYPES.map(type => (
                         <option key={type} value={type}>{type}</option>
                       ))}
                    </select>
                 </div>
                 <div className="space-y-1 text-left">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Price (LKR)</label>
                    <input 
                      type="number" 
                      required
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      className="w-full bg-zinc-50 border border-zinc-100 py-3 px-4 text-sm focus:border-black outline-none transition-all" 
                      placeholder="e.g. 14500" 
                    />
                 </div>
                 <div className="space-y-1 text-left">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Category</label>
                    <select
                      required
                      value={formData.categoryId}
                      onChange={(e) => setFormData({...formData, categoryId: e.target.value})}
                      className="w-full bg-zinc-50 border border-zinc-100 py-3 px-4 text-sm focus:border-black outline-none transition-all appearance-none"
                    >
                      <option value="">Select Category</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                 </div>
                 <div className="space-y-1 text-left">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Stock Quantity</label>
                    <input 
                      type="number" 
                      required
                      value={formData.stockQuantity}
                      onChange={(e) => setFormData({...formData, stockQuantity: e.target.value})}
                      className="w-full bg-zinc-50 border border-zinc-100 py-3 px-4 text-sm focus:border-black outline-none transition-all" 
                      placeholder="e.g. 10" 
                    />
                 </div>
                 <div className="space-y-1 text-left">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Movement Type</label>
                     <select 
                       required
                       className="w-full bg-zinc-50 border border-zinc-100 py-3 px-4 text-sm focus:border-black outline-none transition-all appearance-none"
                       value={formData.movementType}
                       onChange={(e) => setFormData({...formData, movementType: e.target.value})}
                     >
                        <option value="">Select Movement</option>
                        <option value="Automatic">Automatic</option>
                        <option value="Quartz">Quartz</option>
                        <option value="Manual">Manual</option>
                        <option value="Solar">Solar</option>
                        <option value="Kinetic">Kinetic</option>
                     </select>
                  </div>
                  <div className="space-y-1 text-left">
                     <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Case Material</label>
                     <input 
                       type="text" 
                       value={formData.caseMaterial}
                       onChange={(e) => setFormData({...formData, caseMaterial: e.target.value})}
                       className="w-full bg-zinc-50 border border-zinc-100 py-3 px-4 text-sm focus:border-black outline-none transition-all" 
                       placeholder="e.g. Brushed St. Steel" 
                     />
                  </div>
                  <div className="space-y-1 text-left">
                     <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Water Resistance</label>
                     <input 
                       type="text" 
                       value={formData.waterResistance}
                       onChange={(e) => setFormData({...formData, waterResistance: e.target.value})}
                       className="w-full bg-zinc-50 border border-zinc-100 py-3 px-4 text-sm focus:border-black outline-none transition-all" 
                       placeholder="e.g. 100M / 330FT" 
                     />
                  </div>
                  <div className="space-y-1 text-left">
                     <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Warranty</label>
                     <input 
                       type="text" 
                       value={formData.warranty}
                       onChange={(e) => setFormData({...formData, warranty: e.target.value})}
                       className="w-full bg-zinc-50 border border-zinc-100 py-3 px-4 text-sm focus:border-black outline-none transition-all" 
                       placeholder="e.g. 2 Year Global" 
                     />
                  </div>
               </div>

              <div className="mt-8 space-y-4 text-left">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Product Images (Max 5)</label>
                  <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-widest mb-4">Provide URLs or upload from your computer</p>
                  
                  <div className="grid grid-cols-1 gap-4">
                    {formData.imageUrls.map((url, index) => (
                      <div key={index} className="flex gap-2">
                        <div className="relative flex-1">
                          <input 
                              type="text" 
                              value={url}
                              onChange={(e) => {
                                const newUrls = [...formData.imageUrls];
                                newUrls[index] = e.target.value;
                                setFormData({...formData, imageUrls: newUrls});
                              }}
                              className="w-full bg-zinc-50 border border-zinc-100 py-3 px-4 text-sm focus:border-black outline-none transition-all pr-12" 
                              placeholder={`Image URL ${index + 1}`} 
                          />
                          {url && (
                            <div className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-sm bg-zinc-100 p-1">
                               <img src={url} className="w-full h-full object-cover" />
                            </div>
                          )}
                        </div>
                        <label className="bg-zinc-100 px-4 flex items-center justify-center cursor-pointer hover:bg-zinc-200 transition-colors rounded-sm text-[9px] font-black uppercase whitespace-nowrap">
                          Upload
                          <input 
                            type="file" 
                            className="hidden" 
                            accept="image/*"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  const newUrls = [...formData.imageUrls];
                                  newUrls[index] = reader.result as string;
                                  setFormData({...formData, imageUrls: newUrls});
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                          />
                        </label>
                      </div>
                    ))}
                  </div>
              </div>
              
              <div className="mt-8 space-y-1 text-left">
                 <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Description</label>
                 <textarea 
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full bg-zinc-50 border border-zinc-100 py-3 px-4 text-sm h-32 focus:border-black outline-none transition-all" 
                    placeholder="Describe the masterwork..."
                 ></textarea>
              </div>

              <button type="submit" className="w-full bg-black text-white py-4 text-xs font-black uppercase tracking-[0.2em] mt-8 hover:bg-zinc-800 transition-all shadow-xl">
                 {isEditMode ? 'Update Masterpiece' : 'Publish To Collection'}
              </button>
           </form>
        </div>
      )}

      {/* Quick View Modal */}
      {selectedProductForView && (
        <div className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
           <div className="bg-white w-full max-w-4xl rounded-sm shadow-2xl overflow-hidden flex flex-col md:flex-row relative">
              <button 
                onClick={() => setSelectedProductForView(null)}
                className="absolute top-6 right-6 z-10 p-2 bg-white/80 backdrop-blur rounded-full text-black hover:bg-black hover:text-white transition-all shadow-lg"
              >
                <Plus size={20} className="rotate-45" />
              </button>
              
              {/* Image Preview */}
              <div className="w-full md:w-1/2 bg-zinc-50 p-8 flex items-center justify-center">
                 <div className="relative aspect-square w-full">
                   {selectedProductForView.imageUrl ? (
                     <img 
                       src={selectedProductForView.imageUrl.split('|')[0]} 
                       alt={selectedProductForView.name}
                       className="w-full h-full object-contain mix-blend-multiply"
                     />
                   ) : (
                     <WatchIcon className="w-full h-full text-zinc-200" />
                   )}
                 </div>
              </div>

              {/* Details */}
              <div className="w-full md:w-1/2 p-8 md:p-12 space-y-8 overflow-y-auto max-h-[80vh] scrollbar-hide text-left">
                 <div>
                   <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 mb-2 block">
                      {selectedProductForView.categoryType || 'Luxury Edition'}
                   </span>
                   <h2 className="text-3xl font-black text-zinc-900 leading-tight">
                      {selectedProductForView.name}
                   </h2>
                   <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mt-1">
                      Ref: {selectedProductForView.brand || 'LuxuryBrand'}
                   </p>
                 </div>

                 <div className="text-2xl font-black text-black">
                    Rs. {selectedProductForView.price?.toLocaleString()}
                 </div>

                 <div className="space-y-4">
                   <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-900 border-b border-zinc-100 pb-2">Technical Specifications</h4>
                   <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                      {[
                        { label: 'Movement', value: selectedProductForView.movementType },
                        { label: 'Case', value: selectedProductForView.caseMaterial },
                        { label: 'Resistance', value: selectedProductForView.waterResistance },
                        { label: 'Warranty', value: selectedProductForView.warranty },
                        { label: 'Stock', value: `${selectedProductForView.stockQuantity} Units` }
                      ].map(spec => (
                        <div key={spec.label}>
                           <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">{spec.label}</p>
                           <p className="text-[11px] font-bold text-black uppercase">{spec.value || 'N/A'}</p>
                        </div>
                      ))}
                   </div>
                 </div>

                 <div className="space-y-4">
                   <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-900 border-b border-zinc-100 pb-2">The Narrative</h4>
                   <p className="text-sm text-zinc-500 leading-relaxed font-medium italic">
                      "{selectedProductForView.description || 'A timeless addition to your collection.'}"
                   </p>
                 </div>

                 <button 
                   onClick={() => {
                     handleEdit(selectedProductForView);
                     setSelectedProductForView(null);
                   }}
                   className="w-full bg-black text-white py-4 text-[10px] font-black uppercase tracking-[0.2em] shadow-xl hover:bg-zinc-800 transition-all flex items-center justify-center gap-3"
                 >
                   <Edit size={16} />
                   Modify Specification
                 </button>
              </div>
           </div>
        </div>
      )}

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
        title="Remove Product"
        message="Are you sure you want to remove this timepiece from your luxury collection? This action cannot be undone."
        confirmText="Remove Watch"
      />
    </div>
  );
};

export default AdminProducts;
