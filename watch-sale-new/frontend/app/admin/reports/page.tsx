"use client";

import React from 'react';
import { BarChart3, TrendingUp, TrendingDown, DollarSign, ShoppingBag, Users, Calendar } from 'lucide-react';
import { API_BASE_URL } from '@/lib/api';

const AdminReports = () => {
  const [stats, setStats] = React.useState<any[]>([]);
  const [revenueData, setRevenueData] = React.useState<any>({});
  const [loading, setLoading] = React.useState(true);

  const [categoryData, setCategoryData] = React.useState<any[]>([]);

  const fetchStats = async () => {
    try {
      const [statsRes, usersRes] = await Promise.all([
        fetch(`${API_BASE_URL}/orders/stats`, {
           headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        }),
        fetch(`${API_BASE_URL}/users`, {
           headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        })
      ]);

      const statsData = await statsRes.json();
      const usersData = await usersRes.json();

      setStats([
        { label: 'Total Revenue', value: `Rs. ${statsData.totalRevenue?.toLocaleString()}`, change: '+0%', isUp: true, icon: DollarSign },
        { label: 'Total Orders', value: statsData.totalOrders?.toString(), change: '+0%', isUp: true, icon: ShoppingBag },
        { label: 'New Customers', value: usersData.length?.toString(), change: '+0%', isUp: true, icon: Users },
        { label: 'Avg. Order Value', value: `Rs. ${Math.round(statsData.avgOrderValue || 0).toLocaleString()}`, change: '+0%', isUp: true, icon: TrendingUp },
      ]);

      setRevenueData(statsData.revenueByMonth || {});
      
      // Process Category Data
      if (statsData.revenueByCategory) {
        const total = Object.values(statsData.revenueByCategory).reduce((a: any, b: any) => a + b, 0) as number;
        const formatted = Object.entries(statsData.revenueByCategory).map(([name, revenue]: [string, any]) => ({
          name,
          sales: total > 0 ? Math.round((revenue / total) * 100) : 0,
          color: 'bg-black' // Simplified for now
        })).sort((a, b) => b.sales - a.sales);
        setCategoryData(formatted);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching stats:', error);
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchStats();
  }, []);

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const maxRevenue = Math.max(...Object.values(revenueData) as number[], 1000);


  return (
    <div className="space-y-8 text-left">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-zinc-900">Analytics & Reports</h1>
          <p className="text-xs text-zinc-400 font-bold uppercase tracking-widest mt-1">Deep insights into your boutique's performance</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 border border-zinc-100 rounded-sm text-[10px] font-black uppercase tracking-widest hover:bg-zinc-50 transition-all">
          <Calendar size={14} />
          Last 30 Days
        </button>
      </div>

      {/* High-level Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-sm border border-zinc-100 shadow-sm space-y-4">
            <div className="flex justify-between items-start">
              <div className="p-3 bg-zinc-50 rounded-full text-zinc-900">
                <stat.icon size={20} />
              </div>
              <span className={`text-[10px] font-black flex items-center gap-1 ${stat.isUp ? 'text-green-600' : 'text-red-600'}`}>
                {stat.isUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                {stat.change}
              </span>
            </div>
            <div>
              <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">{stat.label}</p>
              <h3 className="text-2xl font-black text-zinc-900">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Visual Placeholders for Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-8 rounded-sm border border-zinc-100 shadow-sm min-h-[400px] flex flex-col">
          <h4 className="text-xs font-black uppercase tracking-[0.2em] mb-8">Revenue Growth</h4>
          <div className="flex-grow flex items-end gap-2 px-4">
            {months.map((m, i) => {
              const h = (revenueData[m] / maxRevenue) * 100 || 5;
              return (
                <div 
                  key={i} 
                  className="flex-grow bg-black/5 hover:bg-black transition-all rounded-t-sm relative group cursor-pointer"
                  style={{ height: `${h}%` }}
                >
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black text-white text-[9px] font-black px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    Rs.{(revenueData[m] || 0).toLocaleString()}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex justify-between mt-6 px-4">
            {months.map(m => (
              <span key={m} className="text-[9px] font-black text-zinc-300 uppercase">{m}</span>
            ))}
          </div>
        </div>

        <div className="bg-white p-8 rounded-sm border border-zinc-100 shadow-sm flex flex-col">
          <h4 className="text-xs font-black uppercase tracking-[0.2em] mb-8">Top Selling Series</h4>
          <div className="space-y-6">
            {categoryData.length > 0 ? categoryData.map(item => (
              <div key={item.name} className="space-y-2">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                  <span>{item.name}</span>
                  <span className="text-zinc-400">{item.sales}%</span>
                </div>
                <div className="w-full h-2 bg-zinc-50 rounded-full overflow-hidden">
                  <div className={`h-full ${item.color} transition-all duration-1000`} style={{ width: `${item.sales}%` }} />
                </div>
              </div>
            )) : (
              <div className="py-20 text-center text-[10px] font-black uppercase tracking-widest text-zinc-300 border border-dashed border-zinc-100">
                No Sales Data Yet
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminReports;
