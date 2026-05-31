"use client";

import React, { useState, useEffect, useRef } from 'react';
import { ShoppingCart, User, Search, Menu, X, Heart, Phone, LogOut, Settings, ChevronRight, Package } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
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
  const [showUserDropdownMobile, setShowUserDropdownMobile] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { getCartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const menuCloseRef = useRef<HTMLButtonElement | null>(null);
  const menuPanelRef = useRef<HTMLDivElement | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement | null>(null);

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

  // Close overlays on Escape and manage focus when menu opens
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMenuOpen(false);
        setIsCartOpen(false);
        setShowUserDropdown(false);
        setShowUserDropdownMobile(false);
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      // move focus to close button for accessibility
      setTimeout(() => menuCloseRef.current?.focus(), 200);
      // prevent body scroll while menu open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [isMenuOpen]);

  useEffect(() => {
    if (isCartOpen) {
      document.body.classList.add('overlay-open');
      document.body.style.overflow = 'hidden';
    } else {
      document.body.classList.remove('overlay-open');
      if (!isMenuOpen && !isSearchOpen) document.body.style.overflow = '';
    }
  }, [isCartOpen, isMenuOpen, isSearchOpen]);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
      document.body.style.overflow = 'hidden';
    } else if (!isMenuOpen) {
      document.body.style.overflow = '';
    }
  }, [isSearchOpen, isMenuOpen]);

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery || searchQuery.trim() === '') return;
    setIsSearchOpen(false);
    router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    setSearchQuery('');
  };

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
    { name: "TRACK ORDER", href: "/track-order" },
    { name: "MEN'S WATCHES", href: "/category/men" },
    { name: "WOMEN'S WATCHES", href: "/category/women" },
    { name: "COUPLE WATCHES", href: "/category/couple" },
    { name: "WEDDING COLLECTION", href: "/category/couple" },
    { name: "AVURUDU SPECIAL", href: "/category/new-arrivals" },
    { name: "SMART WATCHES", href: "/category/smart" },
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
      <header className="bg-white/80 backdrop-blur-xl border-b border-zinc-100 py-3 sm:py-8 sticky top-0 transition-all">
        <div className="container mx-auto px-4 sm:px-6" style={{gridTemplateColumns: '1fr auto 1fr', display: 'grid', alignItems: 'center'}}>
          {/* Left: Search & Menu */}
          <div className="flex items-center gap-2 sm:gap-6 justify-center">
             <button
               className="p-2 w-10 h-10 flex items-center justify-center rounded-md text-black hover:bg-zinc-100 active:scale-95 transition-all lg:hidden"
               onClick={() => setIsMenuOpen(true)}
               aria-label="Open menu"
               aria-expanded={isMenuOpen}
               aria-controls="mobile-menu"
             >
               <Menu size={20} strokeWidth={1.5} />
             </button>

             {/* Mobile search button */}
             <button
               className="p-2 w-10 h-10 flex items-center justify-center rounded-md text-black hover:bg-zinc-100 active:scale-95 transition-all lg:hidden"
               onClick={() => setIsSearchOpen(true)}
               aria-label="Open search"
             >
               <Search size={18} strokeWidth={1.5} />
             </button>
             <div className="hidden lg:flex items-center group relative cursor-pointer">
               <button onClick={() => setIsSearchOpen(true)} aria-label="Open search" className="flex items-center">
                <Search size={20} strokeWidth={1.5} className="text-zinc-400 group-hover:text-black transition-colors" />
                <span className="ml-3 text-[10px] font-black uppercase tracking-widest text-zinc-400 group-hover:text-black transition-colors">Search Catalog</span>
               </button>
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
          <div className="flex justify-center flex-col items-center group cursor-pointer py-1 sm:py-2" onClick={() => router.push('/')}>
            <img src="/logo.png" alt="NEXORA HUB" className="w-28 sm:w-48 max-h-12 sm:max-h-24 object-contain" />
            <span className="sr-only">NEXORA HUB</span>
            <span className="hidden sm:block text-[9px] tracking-[0.6em] uppercase font-black text-black mt-1 ml-1 group-hover:text-black transition-colors">NEXORA HUB</span>
          </div>

          {/* Right: Personal & Cart */}
           <div className="flex items-center gap-2 md:gap-8 justify-center">
               
              {/* Wishlist (hidden on xs) */}
              <div 
                onClick={() => router.push('/profile/wishlist')}
                className="relative hidden sm:flex items-center justify-center p-2 w-10 h-10 rounded-md hover:bg-zinc-100 transition-all"
              >
                <Heart size={18} strokeWidth={1.2} className={wishlistCount > 0 ? "fill-black" : ""} />
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
                  <button onClick={() => router.push('/login')} className="p-2 w-10 h-10 flex items-center justify-center rounded-md hover:bg-zinc-100">
                   <User 
                    size={18} 
                    strokeWidth={1.2} 
                    className="text-zinc-800" 
                   />
                  </button>
                )}
              </div>

              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 w-10 h-10 flex items-center justify-center rounded-md hover:bg-zinc-100 transition-all"
              >
                <ShoppingCart size={18} strokeWidth={1.2} />
                {user && getCartCount() > 0 && (
                 <span className="absolute -top-1.5 -right-2 bg-black text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center font-black">{getCartCount()}</span>
                )}
              </button>
           </div>
        </div>
        </header>

        {/* Search Overlay */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[120] flex items-start justify-center pt-16 sm:pt-24 px-4 sm:px-6 bg-black/40 backdrop-blur-sm"
              onClick={() => setIsSearchOpen(false)}
              aria-hidden={!isSearchOpen}
            >
              <motion.form
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                onSubmit={handleSearchSubmit}
                className="w-full max-w-[calc(100vw-1.5rem)] sm:max-w-2xl bg-white rounded-xl p-4 sm:p-6 shadow-2xl"
              >
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
                  <input
                    ref={searchInputRef}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search watches, brands, collections..."
                    aria-label="Search catalogs"
                    className="w-full min-w-0 flex-1 border border-zinc-100 px-4 py-3 sm:py-3 rounded-md text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-indigo-300"
                  />
                    <button type="submit" className="w-full sm:w-auto bg-black text-white px-5 py-3 rounded-md font-black whitespace-nowrap">Search</button>
                    <button type="button" onClick={() => setIsSearchOpen(false)} aria-label="Close search" className="self-end sm:self-auto text-zinc-500 sm:ml-2">
                    <X size={20} />
                  </button>
                </div>
              </motion.form>
            </motion.div>
          )}
        </AnimatePresence>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* Style Finder Quiz */}
      <StyleQuiz isOpen={showQuiz} onClose={() => setShowQuiz(false)} />

      {/* 3. Navigation Bar */}
      <nav role="navigation" aria-label="Primary" className="bg-white border-b border-zinc-100 hidden lg:block">
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
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-[100] bg-white flex flex-col p-8"
            ref={menuPanelRef}
          >
            <div className="flex justify-between items-center mb-12">
               <div className="flex items-center gap-3">
                 <img src="/logo.png" alt="NEXORA HUB" className="w-36 max-h-16 object-contain" />
               </div>
              <button ref={menuCloseRef} onClick={() => setIsMenuOpen(false)} aria-label="Close menu"><X size={30} /></button>
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
              <Package size={20} className={pathname === '/' ? 'text-black' : 'text-zinc-400'} />
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
