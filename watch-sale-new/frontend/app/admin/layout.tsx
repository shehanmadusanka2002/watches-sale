"use client";

import React from 'react';
import Link from 'next/link';
import { LayoutDashboard, Watch, Users, ShoppingBag, Settings, LogOut, ChevronRight, Bell, Tag, BarChart3, MessageSquare, AlertTriangle, Package } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { ConfirmModal } from '../components/ConfirmModal';
import { useState, useRef } from 'react';
import { AdminBranding, defaultAdminBranding, getAdminBranding } from '@/lib/adminBranding';
import { API_BASE_URL } from '@/lib/api';

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const router = useRouter();
  
  const [user, setUser] = useState<any>(null);
  const [branding, setBranding] = useState<AdminBranding>(defaultAdminBranding);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  
  // Notification States
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const lastOrderIdRef = useRef<number>(0);

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

  const fetchNotificationsData = async () => {
    try {
      const headers = { 'Authorization': `Bearer ${localStorage.getItem('token')}` };
      
      // Fetch Orders for new order detection
      const ordersRes = await fetch(`${API_BASE_URL}/orders`, { headers });
      const productsRes = await fetch(`${API_BASE_URL}/products`, { headers });

      let newNotifications: any[] = [];

      if (ordersRes.ok) {
        const orders = await ordersRes.json();
        if (Array.isArray(orders)) {
          const latestOrder = orders.reduce((max, o) => o.id > max ? o.id : max, 0);
          
          if (lastOrderIdRef.current !== 0 && latestOrder > lastOrderIdRef.current) {
            const freshOrders = orders.filter(o => o.id > lastOrderIdRef.current);
            freshOrders.forEach(o => {
              newNotifications.push({
                id: `order-${o.id}`,
                type: 'ORDER',
                title: 'New Order Received',
                message: `Order #WH-${o.id.toString().padStart(6, '0')} by ${o.user?.username || 'Customer'}`,
                time: new Date(),
                icon: ShoppingBag
              });
            });
          }
          lastOrderIdRef.current = latestOrder;
        }
      }

      if (productsRes.ok) {
        const products = await productsRes.json();
        if (Array.isArray(products)) {
          const lowStock = products.filter(p => p.stockQuantity > 0 && p.stockQuantity < 5);
          lowStock.forEach(p => {
            newNotifications.push({
              id: `stock-${p.id}`,
              type: 'STOCK',
              title: 'Low Stock Alert',
              message: `${p.name} is running low (${p.stockQuantity} left)`,
              time: new Date(),
              icon: AlertTriangle
            });
          });
        }
      }

      setNotifications(prev => {
        // Keep unique notifications (by id)
        const combined = [...newNotifications, ...prev];
        const unique = combined.filter((v, i, a) => a.findIndex(t => t.id === v.id) === i);
        return unique.slice(0, 20); // Keep last 20
      });

    } catch (error) {
      console.error('Failed to poll notifications:', error);
    }
  };

  React.useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      if (parsedUser.role !== 'ADMIN') {
        router.push('/');
      }
    } else {
      router.push('/login');
    }

    const applyBranding = () => setBranding(getAdminBranding());
    applyBranding();
    
    // Initial fetch
    fetchNotificationsData();
    
    // Polling every 30 seconds
    const interval = setInterval(fetchNotificationsData, 30000);

    window.addEventListener('admin-branding-updated', applyBranding);
    window.addEventListener('storage', applyBranding);

    return () => {
      clearInterval(interval);
      window.removeEventListener('admin-branding-updated', applyBranding);
      window.removeEventListener('storage', applyBranding);
    };
  }, []);

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
                <h2 className="text-xs font-black uppercase tracking-widest text-zinc-900 text-left">
                  Welcome back, {user?.username || 'Administrator'}
                </h2>
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mt-1 text-left">
                  {branding.storeTagline}
                </p>
             </div>
             <div className="flex items-center gap-6">
                <div className="relative">
                   <button 
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="relative text-zinc-400 hover:text-black transition-colors p-2"
                   >
                      <Bell size={20} />
                      {notifications.length > 0 && (
                        <span className="absolute top-1 right-1 w-4 h-4 bg-red-600 text-white text-[8px] font-black rounded-full flex items-center justify-center border-2 border-white">
                          {notifications.length}
                        </span>
                      )}
                   </button>
                   
                   {/* Notifications Dropdown */}
                   {showNotifications && (
                     <div className="absolute right-0 mt-4 w-80 bg-white border border-zinc-100 shadow-2xl rounded-sm overflow-hidden z-[60]">
                        <div className="p-4 bg-zinc-50 border-b border-zinc-100 flex justify-between items-center">
                           <span className="text-[10px] font-black uppercase tracking-widest text-zinc-900">Notifications</span>
                           <button onClick={() => setNotifications([])} className="text-[8px] font-bold uppercase text-zinc-400 hover:text-black">Clear All</button>
                        </div>
                        <div className="max-h-[400px] overflow-y-auto">
                           {notifications.length === 0 ? (
                             <div className="p-10 text-center text-[10px] font-bold uppercase text-zinc-300">No new alerts</div>
                           ) : notifications.map((n) => (
                             <div key={n.id} className="p-4 border-b border-zinc-50 hover:bg-zinc-50/50 transition-colors flex gap-4 text-left">
                                <div className={`w-8 h-8 rounded-sm flex items-center justify-center shrink-0 ${n.type === 'STOCK' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
                                   <n.icon size={16} />
                                </div>
                                <div className="space-y-1">
                                   <p className="text-[10px] font-black uppercase tracking-tight text-zinc-900">{n.title}</p>
                                   <p className="text-[10px] font-medium text-zinc-500 leading-tight">{n.message}</p>
                                   <p className="text-[8px] font-bold text-zinc-300 uppercase">{new Date(n.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                </div>
                             </div>
                           ))}
                        </div>
                     </div>
                   )}
                </div>

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
