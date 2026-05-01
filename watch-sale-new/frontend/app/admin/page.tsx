"use client";

import React, { useEffect, useState } from 'react';
import { ShoppingBag, TrendingUp, Users, DollarSign, ArrowUpRight, ArrowDownRight, Loader2 } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState<any>(null);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const headers = {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        };

        const [statsRes, ordersRes] = await Promise.all([
          fetch('http://localhost:8080/api/orders/admin-stats', { headers }),
          fetch('http://localhost:8080/api/orders', { headers })
        ]);

        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStats(statsData);
        }

        if (ordersRes.ok) {
          const ordersData = await ordersRes.json();
          // Filter or slice to get most recent
          setRecentOrders(ordersData.slice(0, 5));
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const statCards = [
    { label: 'Total Revenue', value: stats ? `Rs. ${stats.totalRevenue.toLocaleString()}` : '...', change: '+12.5%', isUp: true, icon: DollarSign },
    { label: 'Total Orders', value: stats ? stats.totalOrders : '...', change: '+5.2%', isUp: true, icon: ShoppingBag },
    { label: 'New Customers', value: stats ? stats.totalCustomers : '...', change: '-2.1%', isUp: false, icon: Users },
    { label: 'Total Products', value: stats ? stats.totalProducts : '...', change: '+0.8%', isUp: true, icon: TrendingUp },
  ];

  return (
    <div className="space-y-10">
      {/* Welcome & Quick Actions */}
      <div className="flex justify-between items-center text-left">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-zinc-900">Store Overview</h1>
          <p className="text-xs text-zinc-400 font-bold uppercase tracking-widest mt-1">Real-time performance metrics</p>
        </div>
        <div className="flex gap-4">
           <button className="px-6 py-3 border border-zinc-100 bg-white text-xs font-black uppercase tracking-widest hover:bg-zinc-50 transition-colors">Export Report</button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
        {statCards.map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-sm border border-zinc-100 shadow-sm relative overflow-hidden group">
             <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-zinc-50 rounded-sm text-zinc-400 group-hover:text-black transition-colors">
                   <stat.icon size={20} />
                </div>
                <div className={`flex items-center gap-1 text-[10px] font-black uppercase ${stat.isUp ? 'text-green-500' : 'text-red-500'}`}>
                   {stat.change}
                   {stat.isUp ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                </div>
             </div>
             <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">{stat.label}</span>
                <span className="text-2xl font-black text-zinc-900">{stat.value}</span>
             </div>
          </div>
        ))}
      </div>

      {/* Chart Placeholders & Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2 bg-white border border-zinc-100 rounded-sm p-8 shadow-sm text-left">
            <h3 className="text-xs font-black uppercase tracking-widest text-zinc-900 mb-8">Sales Performance</h3>
            <div className="h-64 flex items-end gap-2 px-2">
               {[40, 70, 45, 90, 65, 80, 55, 30, 85, 60, 95, 75].map((h, i) => (
                 <div key={i} className="flex-grow bg-zinc-50 hover:bg-black transition-colors rounded-t-sm relative group" style={{ height: `${h}%` }}>
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] py-1 px-2 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity">Rs.{h}k</div>
                 </div>
               ))}
            </div>
            <div className="flex justify-between mt-6 px-2 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
               <span>Jan</span><span>Mar</span><span>Jun</span><span>Sep</span><span>Dec</span>
            </div>
         </div>

         <div className="bg-white border border-zinc-100 rounded-sm p-8 shadow-sm text-left">
            <h3 className="text-xs font-black uppercase tracking-widest text-zinc-900 mb-8">Recent Orders</h3>
            <div className="space-y-6">
               {recentOrders.length === 0 ? (
                 <div className="py-10 text-center text-zinc-400 text-xs font-bold uppercase tracking-widest bg-zinc-50 rounded-sm border border-dashed border-zinc-200">
                    No recent orders
                 </div>
               ) : recentOrders.map((order) => (
                 <div key={order.id} className="flex items-center justify-between border-b border-zinc-50 pb-4 last:border-0 last:pb-0">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 bg-zinc-50 rounded-sm flex items-center justify-center text-zinc-300 font-black text-xs">#{order.id}</div>
                       <div className="flex flex-col text-left">
                          <span className="text-xs font-black">Order from {order.user?.username || 'Customer'}</span>
                          <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">
                             {order.orderDate ? new Date(order.orderDate).toLocaleDateString() : 'N/A'} • LKR {order.payment?.amount?.toLocaleString() || '0'}
                          </span>
                       </div>
                    </div>
                    <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-full ${
                      order.status === 'PAID' || order.status === 'COMPLETED' ? 'text-green-500 bg-green-50' : 'text-zinc-400 bg-zinc-50'
                    }`}>
                      {order.status || 'Pending'}
                    </span>
                 </div>
               ))}
            </div>
            <button 
              onClick={() => window.location.href = '/admin/orders'}
              className="w-full mt-8 py-3 text-[10px] font-black uppercase tracking-widest text-zinc-400 border border-zinc-100 hover:text-black hover:bg-zinc-50 transition-all"
            >
              View All Orders
            </button>
         </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
