"use client";

import React, { useState, useEffect } from 'react';
import { ShoppingCart, User, Search, Menu, X, Heart, Phone, LogOut, Settings, ChevronRight, Package } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import CartDrawer from './CartDrawer';
import StyleQuiz from './StyleQuiz';
import { Sparkles } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const router = useRouter();
  const { getCartCount } = useCart();
  const { wishlistCount } = useWishlist();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Error parsing user data", e);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setShowUserDropdown(false);
    router.push('/');
    window.location.reload(); // Force refresh to update all components
  };

  const categories = [
    { name: "HOME", href: "/" },
    { name: "MEN'S WATCHES", href: "/category/men" },
    { name: "WOMEN'S WATCHES", href: "/category/women" },
    { name: "COUPLE WATCHES", href: "/category/couple" },
    { name: "SMART WATCHES", href: "/category/smart" },
    { name: "CHILDREN WATCHES", href: "/category/children" },
    { name: "NEW ARRIVALS", href: "/category/new-arrivals" }
  ];

  return (
    <div className="w-full flex flex-col z-50 relative font-sans">
      {/* 1. Announcement Bar */}
      <div className="bg-[#0a0a0a] text-white/50 py-2.5 px-6 border-b border-white/5">
        <div className="container mx-auto flex justify-between items-center text-[9px] md:text-xs tracking-[0.2em] font-black uppercase">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2 hover:text-white transition-colors cursor-pointer"><Phone size={12} className="text-white/20" /> +94 76 238 8479</span>
            <span className="hidden md:inline border-l border-white/10 pl-6">Complimentary Islandwide Shipping</span>
          </div>
          {/* Removed Concierge and Admin Panel links */}
        </div>
      </div>

      {/* 2. Main Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-zinc-100 py-6 sticky top-0 transition-all">
        <div className="container mx-auto px-6 grid grid-cols-3 items-center">
          {/* Left: Search & Menu */}
          <div className="flex items-center gap-6">
             <button className="lg:hidden text-black hover:scale-110 transition-transform" onClick={() => setIsMenuOpen(true)}>
                <Menu size={24} strokeWidth={1.5} />
             </button>
             <div className="hidden lg:flex items-center group relative cursor-pointer">
                <Search size={20} strokeWidth={1.5} className="text-zinc-400 group-hover:text-black transition-colors" />
                <span className="ml-3 text-[10px] font-black uppercase tracking-widest text-zinc-400 group-hover:text-black transition-colors">Search Catalog</span>
             </div>
             
             {/* Quiz Button */}
             <button 
                onClick={() => setShowQuiz(true)}
                className="hidden xl:flex items-center gap-2 bg-indigo-50 text-indigo-600 px-4 py-2 rounded-full hover:bg-indigo-600 hover:text-white transition-all shadow-sm group ml-4"
             >
                <Sparkles size={14} className="group-hover:animate-pulse" />
                <span className="text-[9px] font-black uppercase tracking-widest">Find My Style</span>
             </button>
          </div>

          {/* Center: Logo */}
          <div className="flex justify-center flex-col items-center group cursor-pointer" onClick={() => router.push('/')}>
            <span className="text-4xl md:text-5xl font-black tracking-tighter text-black leading-none italic">
              ANIX<span className="text-zinc-200 group-hover:text-black transition-colors duration-500">.</span>
            </span>
            <span className="text-[7px] tracking-[0.6em] uppercase font-black text-zinc-400 mt-1 ml-1 group-hover:text-black transition-colors">Official Boutique</span>
          </div>

          {/* Right: Personal & Cart */}
          <div className="flex justify-end items-center gap-6 md:gap-8">
               
               {/* Wishlist */}
               <div 
                 onClick={() => router.push('/profile/wishlist')}
                 className="relative cursor-pointer hover:scale-110 transition-transform hidden sm:block"
               >
                 <Heart size={21} strokeWidth={1.2} className={wishlistCount > 0 ? "fill-black" : ""} />
                 {user && wishlistCount > 0 && (
                   <span className="absolute -top-1.5 -right-2 bg-indigo-600 text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center font-black">{wishlistCount}</span>
                 )}
               </div>

               {/* User Profile / Login */}
               <div className="relative">
                  {user ? (
                    <div className="flex items-center">
                       <button 
                         onClick={() => setShowUserDropdown(!showUserDropdown)}
                         className="flex items-center gap-3 pl-4 border-l border-zinc-100 group transition-all"
                       >
                          <div className="w-9 h-9 rounded-full bg-zinc-950 flex items-center justify-center border border-zinc-800 text-white group-hover:bg-zinc-800 transition-all shadow-lg">
                             <span className="text-xs font-black uppercase">{user.name?.charAt(0) || 'U'}</span>
                          </div>
                          <div className="hidden sm:flex flex-col items-start leading-[1.1] text-left">
                             <span className="text-[8px] text-zinc-400 font-black uppercase tracking-[0.2em]">Boutique Member</span>
                             <span className="text-[11px] font-black text-black group-hover:text-zinc-600 transition-colors truncate max-w-[100px]">{user.name}</span>
                          </div>
                       </button>

                       {/* User Dropdown */}
                       <AnimatePresence>
                         {showUserDropdown && (
                           <>
                             <div className="fixed inset-0 z-40" onClick={() => setShowUserDropdown(false)} />
                             <motion.div 
                               initial={{ opacity: 0, y: 15, scale: 0.95 }}
                               animate={{ opacity: 1, y: 0, scale: 1 }}
                               exit={{ opacity: 0, y: 15, scale: 0.95 }}
                               className="absolute right-0 top-[calc(100%+1.5rem)] w-64 bg-white border border-zinc-200 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)] z-50 p-2 rounded-xl"
                             >
                                <div className="p-3 bg-zinc-950 rounded-lg mb-3 text-white shadow-lg">
                                   <div className="flex items-center gap-3">
                                      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-black text-xs font-black ring-2 ring-white/10">
                                         {user.name?.charAt(0)}
                                      </div>
                                      <div className="flex flex-col overflow-hidden">
                                         <p className="text-[11px] font-black text-white leading-tight truncate">{user.name}</p>
                                         <p className="text-[9px] font-bold text-zinc-400 truncate uppercase mt-0.5 tracking-wider">{user.email}</p>
                                      </div>
                                   </div>
                                </div>
                                
                                <div className="space-y-0.5">
                                   <button 
                                      onClick={() => {
                                        setShowUserDropdown(false);
                                        router.push('/profile/orders');
                                      }}
                                      className="w-full flex items-center justify-between p-2.5 rounded-lg hover:bg-zinc-50 transition-all group"
                                    >
                                       <div className="flex items-center gap-3">
                                          <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-500 group-hover:bg-black group-hover:text-white transition-all">
                                             <Package size={14} strokeWidth={2} />
                                          </div>
                                          <span className="text-[9px] font-black uppercase tracking-[0.15em] text-zinc-600 group-hover:text-black transition-colors">My Portfolio</span>
                                       </div>
                                       <ChevronRight size={12} className="text-zinc-300 group-hover:text-black transition-colors" />
                                    </button>
                                    

                                   
                                   <button 
                                      onClick={() => {
                                        setShowUserDropdown(false);
                                        router.push('/profile/wishlist');
                                      }}
                                      className="w-full flex items-center justify-between p-2.5 rounded-lg hover:bg-zinc-50 transition-all group"
                                    >
                                       <div className="flex items-center gap-3">
                                          <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-500 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                             <Heart size={14} strokeWidth={2} />
                                          </div>
                                          <span className="text-[9px] font-black uppercase tracking-[0.15em] text-zinc-600 group-hover:text-black transition-colors">Wishlist</span>
                                       </div>
                                       <ChevronRight size={12} className="text-zinc-300 group-hover:text-black transition-colors" />
                                    </button>
                                   
                                   <button 
                                     onClick={handleLogout}
                                     className="w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-red-50 transition-all group border-t border-zinc-50 mt-1.5"
                                   >
                                      <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-500 group-hover:bg-red-600 group-hover:text-white transition-all">
                                         <LogOut size={14} strokeWidth={2} />
                                      </div>
                                      <span className="text-[9px] font-black uppercase tracking-[0.15em] text-red-600 group-hover:text-red-700 transition-colors">Secure Sign Out</span>
                                   </button>
                                </div>
                             </motion.div>
                           </>
                         )}
                       </AnimatePresence>
                    </div>
                  ) : (
                    <User 
                      size={22} 
                      strokeWidth={1.2} 
                      className="cursor-pointer hover:scale-110 transition-transform" 
                      onClick={() => router.push('/login')}
                    />
                  )}
               </div>

               <div 
                 onClick={() => setIsCartOpen(true)}
                 className="relative cursor-pointer hover:scale-110 transition-transform"
               >
                 <ShoppingCart size={22} strokeWidth={1.2} />
                 {user && getCartCount() > 0 && (
                   <span className="absolute -top-1.5 -right-2 bg-black text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center font-black">{getCartCount()}</span>
                 )}
               </div>
          </div>
        </div>
      </header>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* Style Finder Quiz */}
      <StyleQuiz isOpen={showQuiz} onClose={() => setShowQuiz(false)} />

      {/* 3. Navigation Bar */}
      <nav className="bg-white border-b border-zinc-100 hidden lg:block">
        <div className="container mx-auto px-6 flex justify-center items-center gap-14 py-4">
          {categories.map((cat) => (
            <Link 
              key={cat.name} 
              href={cat.href}
              className="text-[10px] font-black text-zinc-500 hover:text-black transition-all tracking-[0.25em] relative group py-1"
            >
              {cat.name}
              <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-black scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
            </Link>
          ))}
        </div>
      </nav>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            className="fixed inset-0 z-[100] bg-white flex flex-col p-8"
          >
            <div className="flex justify-between items-center mb-12">
               <span className="text-2xl font-black">ANIX.</span>
               <button onClick={() => setIsMenuOpen(false)}><X size={30} /></button>
            </div>
            <div className="flex flex-col gap-6">
              {categories.map((cat) => (
                <Link 
                  key={cat.name} 
                  href={cat.href} 
                  className="text-xl font-bold border-b border-zinc-100 pb-4"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {cat.name}
                </Link>
              ))}
              {user && (
                <button 
                  onClick={handleLogout}
                  className="text-xl font-bold text-red-600 border-b border-zinc-100 pb-4 text-left"
                >
                  Logout
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* 4. Mobile Bottom Navigation (Sticky) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-zinc-100 px-6 py-3 z-[100] shadow-[0_-10px_30px_-15px_rgba(0,0,0,0.1)]">
        <div className="flex justify-between items-center max-w-md mx-auto">
          <Link href="/" className="flex flex-col items-center gap-1 group">
            <div className="p-2 rounded-xl group-active:bg-zinc-100 transition-colors">
              <Package size={20} className={router.pathname === '/' ? 'text-black' : 'text-zinc-400'} />
            </div>
            <span className="text-[8px] font-black uppercase tracking-widest text-zinc-400">Shop</span>
          </Link>
          
          <button onClick={() => setShowQuiz(true)} className="flex flex-col items-center gap-1 group">
            <div className="p-2 rounded-xl group-active:bg-zinc-100 transition-colors">
              <Sparkles size={20} className="text-zinc-400" />
            </div>
            <span className="text-[8px] font-black uppercase tracking-widest text-zinc-400">Match</span>
          </button>

          <div className="relative -mt-8">
            <button 
              onClick={() => setIsCartOpen(true)}
              className="w-14 h-14 bg-black rounded-full flex items-center justify-center text-white shadow-2xl shadow-black/20 active:scale-90 transition-transform"
            >
              <ShoppingCart size={22} />
              {getCartCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-[10px] w-6 h-6 rounded-full flex items-center justify-center font-black border-2 border-white">
                  {getCartCount()}
                </span>
              )}
            </button>
          </div>

          <Link href="/profile/wishlist" className="flex flex-col items-center gap-1 group">
            <div className="p-2 rounded-xl group-active:bg-zinc-100 transition-colors text-zinc-400">
              <Heart size={20} className={wishlistCount > 0 ? "fill-black text-black" : ""} />
            </div>
            <span className="text-[8px] font-black uppercase tracking-widest text-zinc-400">Saved</span>
          </Link>

          <Link href={user ? "/profile/orders" : "/login"} className="flex flex-col items-center gap-1 group">
            <div className="p-2 rounded-xl group-active:bg-zinc-100 transition-colors">
              <User size={20} className="text-zinc-400" />
            </div>
            <span className="text-[8px] font-black uppercase tracking-widest text-zinc-400">{user ? 'Me' : 'Login'}</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
