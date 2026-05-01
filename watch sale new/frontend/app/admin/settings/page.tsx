"use client";

import React, { useEffect, useMemo, useState } from 'react';
import { Settings, Globe, Bell, Lock, Database, Save, Palette, RefreshCw } from 'lucide-react';
import { Toast } from '@/app/components/Toast';
import { defaultAdminBranding, getAdminBranding, normalizeBranding, saveAdminBranding } from '@/lib/adminBranding';

const SettingsPage = () => {
  const [storeName, setStoreName] = useState(defaultAdminBranding.storeName);
  const [storeTagline, setStoreTagline] = useState(defaultAdminBranding.storeTagline);
  const [primaryColor, setPrimaryColor] = useState(defaultAdminBranding.primaryColor);
  const [toast, setToast] = useState({ isVisible: false, message: '', type: 'success' as 'success' | 'error' });

  useEffect(() => {
    const branding = getAdminBranding();
    setStoreName(branding.storeName);
    setStoreTagline(branding.storeTagline);
    setPrimaryColor(branding.primaryColor);
  }, []);

  const normalizedColor = useMemo(() => {
    const value = primaryColor.trim();
    return /^#([0-9a-fA-F]{6})$/.test(value) ? value : defaultAdminBranding.primaryColor;
  }, [primaryColor]);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ isVisible: true, message, type });
  };

  const handleSave = () => {
    const normalized = normalizeBranding({ storeName, storeTagline, primaryColor });
    saveAdminBranding(normalized);
    setStoreName(normalized.storeName);
    setStoreTagline(normalized.storeTagline);
    setPrimaryColor(normalized.primaryColor);
    showToast('Settings saved and dashboard updated', 'success');
  };

  const handleReset = () => {
    setStoreName(defaultAdminBranding.storeName);
    setStoreTagline(defaultAdminBranding.storeTagline);
    setPrimaryColor(defaultAdminBranding.primaryColor);
    saveAdminBranding(defaultAdminBranding);
    showToast('Settings reset to defaults', 'success');
  };

  return (
    <div className="space-y-8 text-left max-w-4xl">
      <div>
        <h1 className="text-4xl font-black tracking-tighter uppercase">System Settings</h1>
        <p className="text-xs text-zinc-400 font-bold uppercase tracking-widest mt-1">Configure your master watch emporium</p>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* Branding Section */}
        <section className="bg-white border border-zinc-100 rounded-sm shadow-sm overflow-hidden p-8">
            <div className="flex items-center gap-4 mb-8">
               <div className="p-3 rounded-sm text-white transition-colors" style={{ backgroundColor: normalizedColor }}><Palette size={20} /></div>
               <div>
                  <h2 className="text-lg font-black uppercase tracking-tight">Identity & Aesthetics</h2>
                  <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">Brand name, logo and visual theme</p>
               </div>
            </div>

           <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                 <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Store Name</label>
                    <input
                      type="text"
                      value={storeName}
                      onChange={(e) => setStoreName(e.target.value)}
                      className="w-full bg-zinc-50 border border-zinc-100 py-3 px-4 text-sm font-bold focus:border-black outline-none transition-all"
                    />
                 </div>
                 <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Store Tagline</label>
                    <input
                      type="text"
                      value={storeTagline}
                      onChange={(e) => setStoreTagline(e.target.value)}
                      className="w-full bg-zinc-50 border border-zinc-100 py-3 px-4 text-sm font-bold focus:border-black outline-none transition-all"
                    />
                 </div>
              </div>

              <div className="space-y-1">
                 <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Primary Brand Color</label>
                 <div className="flex gap-4">
                    <label 
                      className="w-12 h-12 rounded-sm border border-zinc-200 cursor-pointer hover:scale-105 transition-transform shadow-sm flex-shrink-0" 
                      style={{ backgroundColor: normalizedColor }}
                      title="Click to select color"
                    >
                      <input 
                        type="color" 
                        className="sr-only" 
                        value={normalizedColor}
                        onChange={(e) => setPrimaryColor(e.target.value)}
                      />
                    </label>
                    <div className="relative flex-1">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 font-mono text-sm">#</span>
                      <input
                        type="text"
                        value={primaryColor.replace('#', '')}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val.length <= 6) {
                            setPrimaryColor('#' + val);
                          }
                        }}
                        placeholder="000000"
                        className="w-full bg-zinc-50 border border-zinc-100 py-3 pl-8 pr-4 text-sm font-mono font-bold focus:border-black outline-none transition-all uppercase"
                      />
                    </div>
                 </div>
              </div>
           </div>
        </section>

        {/* System & API Section */}
        <section className="bg-white border border-zinc-100 rounded-sm shadow-sm overflow-hidden p-8">
           <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-zinc-100 rounded-sm text-black"><Database size={20} /></div>
              <div>
                 <h2 className="text-lg font-black uppercase tracking-tight">Infrastructure</h2>
                 <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">Database connection and API endpoints</p>
              </div>
           </div>

           <div className="space-y-6">
              <div className="p-4 bg-zinc-50 border border-zinc-100 rounded-sm">
                 <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                       <RefreshCw size={16} className="text-emerald-500 animate-spin-slow" />
                       <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Backend Connection</span>
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full">Active</span>
                 </div>
                 <p className="text-xs font-mono text-zinc-400 mt-2">http://localhost:8080/api/v1</p>
              </div>

              <div className="flex gap-4">
                 <button
                   onClick={handleSave}
                   className="flex-1 bg-black text-white py-4 text-xs font-black uppercase tracking-[0.2em] hover:bg-zinc-800 transition-all shadow-xl flex items-center justify-center gap-2"
                    style={{ backgroundColor: normalizedColor }}
                 >
                    <Save size={16} /> Save Changes
                 </button>
                 <button
                   onClick={handleReset}
                   className="px-6 border border-zinc-100 text-zinc-400 hover:text-black hover:border-black transition-all"
                 >
                    Reset
                 </button>
              </div>
           </div>
        </section>
      </div>
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={() => setToast((prev) => ({ ...prev, isVisible: false }))}
      />
    </div>
  );
};

export default SettingsPage;
