"use client";

import React from 'react';
import Link from 'next/link';
import { LayoutDashboard, Watch, Users, ShoppingBag, Settings, LogOut, ChevronRight, Bell, Tag, BarChart3, MessageSquare } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { ConfirmModal } from '../components/ConfirmModal';
import { useState } from 'react';
import { AdminBranding, defaultAdminBranding, getAdminBranding } from '@/lib/adminBranding';

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  const menuItems = [
    { name: 'Overview', icon: LayoutDashboard, href: '/admin' },
    { name: 'Products', icon: Watch, href: '/admin/products' },
    { name: 'Categories', icon: Tag, href: '/admin/categories' },
    { name: 'Orders', icon: ShoppingBag, href: '/admin/orders' },
    { name: 'Customers', icon: Users, href: '/admin/customers' },
    { name: 'Reviews', icon: MessageSquare, href: '/admin/reviews' },
    { name: 'Reports', icon: BarChart3, href: '/admin/reports' },
    { name: 'Settings', icon: Settings, href: '/admin/settings' },
  ];
  
  const router = useRouter();
  const [user, setUser] = React.useState<any>(null);
  const [branding, setBranding] = React.useState<AdminBranding>(defaultAdminBranding);

  React.useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    const applyBranding = () => setBranding(getAdminBranding());
    applyBranding();
    window.addEventListener('admin-branding-updated', applyBranding);
    window.addEventListener('storage', applyBranding);

    return () => {
      window.removeEventListener('admin-branding-updated', applyBranding);
      window.removeEventListener('storage', applyBranding);
    };
  }, []);

  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  return (
    <>
      <div className="min-h-screen bg-[#FDFDFD] flex">
        {/* Sidebar */}
        <aside className="w-72 bg-white border-r border-zinc-100 flex flex-col fixed inset-y-0 z-50">
          <div className="p-8 border-b border-zinc-50">
            <Link href="/" className="text-2xl font-black tracking-tighter block text-center">
              {branding.storeName}
              <span className="text-zinc-300">.</span>
            </Link>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 block text-center mt-1">Admin Panel</span>
          </div>

          <nav className="flex-grow p-6 space-y-2">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link 
                  key={item.name} 
                  href={item.href}
                  className={`flex items-center gap-4 px-4 py-3 rounded-sm transition-all group ${
                    isActive ? 'text-white shadow-lg' : 'text-zinc-400 hover:bg-zinc-50'
                  }`}
                  style={isActive ? { backgroundColor: branding.primaryColor, transition: 'background-color 0.3s ease' } : undefined}
                >
                  <item.icon size={20} className={isActive ? 'text-white' : 'text-zinc-300 group-hover:text-black'} />
                  <span className="text-xs font-black uppercase tracking-widest">{item.name}</span>
                  {isActive && <ChevronRight size={14} className="ml-auto" />}
                </Link>
              );
            })}
          </nav>

          <div className="p-6 border-t border-zinc-50">
             <button 
              onClick={() => setIsLogoutModalOpen(true)}
              className="flex items-center gap-4 px-4 py-3 w-full text-zinc-400 hover:text-red-500 transition-colors"
             >
                <LogOut size={20} />
                <span className="text-xs font-black uppercase tracking-widest">Sign Out</span>
             </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-grow ml-72">
          {/* Top Header */}
          <header className="h-20 bg-white border-b border-zinc-50 flex items-center justify-between px-10 sticky top-0 z-40">
             <div className="flex flex-col">
                <h2 className="text-xs font-black uppercase tracking-widest text-zinc-900">
                  Welcome back, {user?.username || 'Administrator'}
                </h2>
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mt-1">
                  {branding.storeTagline}
                </p>
             </div>
             <div className="flex items-center gap-6">
                <button className="relative text-zinc-400 hover:text-black transition-colors">
                   <Bell size={20} />
                   <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
                </button>
                <div className="flex items-center gap-3">
                   <div className="text-right hidden sm:block">
                      <p className="text-[10px] font-black uppercase tracking-widest text-zinc-900">{user?.username || 'User'}</p>
                      <p className="text-[8px] font-bold uppercase tracking-widest text-zinc-400">{user?.role || 'Admin'}</p>
                   </div>
                   <div
                     className="w-10 h-10 rounded-full border border-zinc-800 flex items-center justify-center text-white text-xs font-black"
                     style={{ backgroundColor: branding.primaryColor, transition: 'background-color 0.3s ease' }}
                   >
                      {user?.username?.charAt(0).toUpperCase() || 'A'}
                   </div>
                </div>
             </div>
          </header>

          <div className="p-10">
            {children}
          </div>
        </main>
      </div>
      <ConfirmModal 
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogout}
        title="Sign Out"
        message="Are you sure you want to log out of the admin panel? You will need to sign in again to manage your collection."
        confirmText="Sign Out"
        type="danger"
      />
    </>
  );
};

export default AdminLayout;
