"use client";

import React, { useState, useEffect } from 'react';
import { ShoppingCart, User, Search, Menu, X, Heart, Phone, LogOut, Package, ChevronRight, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import CartDrawer from './CartDrawer';
import StyleQuiz from './StyleQuiz';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { getCartCount } = useCart();
  const { wishlistCount } = useWishlist();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try { setUser(JSON.parse(storedUser)); } catch (e) { console.error(e); }
    }
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token'); localStorage.removeItem('user');
    setUser(null); setShowUserDropdown(false); router.push('/'); window.location.reload();
  };

  const categories = [
    { name: "Home", href: "/" },
    { name: "Men's", href: "/category/men" },
    { name: "Women's", href: "/category/women" },
    { name: "Couple", href: "/category/couple" },
    { name: "Smart", href: "/category/smart" },
    { name: "Collection", href: "/category/new-arrivals" }
  ];

  return (
    <>
      <div className="w-full flex flex-col z-[100] fixed top-0 transition-all duration-500">
        {/* 1. Elite Announcement Bar */}
        {!scrolled && (
          <div className="bg-matte-black text-white/40 py-2.5 px-6 border-b border-white/5">
            <div className="container mx-auto flex justify-between items-center text-[9px] tracking-[0.4em] font-black uppercase">
              <div className="flex items-center gap-8">
                <span className="flex items-center gap-2 hover:text-gold transition-colors cursor-pointer italic">
                  <Phone size={10} className="text-gold" /> Boutique Concierge: +94 76 238 8479
                </span>
                <span className="hidden md:inline border-l border-white/10 pl-8">Complimentary Global Delivery</span>
              </div>
              <div className="hidden md:block">Sri Lanka's Premier Watch Collective</div>
            </div>
          </div>
        )}

        {/* 2. Main Luxury Header */}
        <header className={`transition-all duration-700 ${scrolled ? 'bg-black/80 backdrop-blur-2xl py-4 shadow-2xl border-b border-gold/10' : 'bg-transparent py-8'}`}>
          <div className="container mx-auto px-6 grid grid-cols-3 items-center">
            {/* Left: Search & Quiz */}
            <div className="flex items-center gap-8">
               <button className="lg:hidden text-white" onClick={() => setIsMenuOpen(true)}>
                  <Menu size={24} strokeWidth={1.5} />
               </button>
               <div className="hidden lg:flex items-center group relative cursor-pointer">
                  <Search size={18} strokeWidth={1.5} className="text-zinc-500 group-hover:text-gold transition-colors" />
                  <span className="ml-3 text-[9px] font-black uppercase tracking-[0.3em] text-zinc-500 group-hover:text-gold transition-colors">Catalog</span>
               </div>
               <button 
                  onClick={() => setShowQuiz(true)}
                  className="hidden xl:flex items-center gap-3 text-gold hover:text-gold-light transition-all group"
               >
                  <Sparkles size={14} className="group-hover:rotate-12 transition-transform" />
                  <span className="text-[9px] font-black uppercase tracking-[0.3em]">Style Finder</span>
               </button>
            </div>

            {/* Center: Brand Identity */}
            <div className="flex justify-center flex-col items-center group cursor-pointer" onClick={() => router.push('/')}>
              <span className="text-4xl md:text-5xl font-serif tracking-tighter text-white leading-none italic">
                ANIX<span className="text-gold group-hover:text-gold-light transition-colors duration-500">.</span>
              </span>
              <span className="text-[7px] tracking-[0.8em] uppercase font-black text-zinc-500 mt-2 group-hover:text-gold transition-colors">Official Boutique</span>
            </div>

            {/* Right: Personal & Cart */}
            <div className="flex justify-end items-center gap-8">
                 <div onClick={() => router.push('/profile/wishlist')} className="relative cursor-pointer hover:scale-110 transition-transform hidden sm:block">
                   <Heart size={20} strokeWidth={1.5} className={wishlistCount > 0 ? "fill-gold text-gold" : "text-white hover:text-gold"} />
                 </div>

                 <div className="relative">
                    {user ? (
                      <button onClick={() => setShowUserDropdown(!showUserDropdown)} className="flex items-center gap-3 transition-all group">
                         <div className="w-10 h-10 rounded-full bg-zinc-900 border border-gold/20 flex items-center justify-center text-gold group-hover:border-gold transition-all">
                            <span className="text-xs font-black uppercase">{user.name?.charAt(0)}</span>
                         </div>
                      </button>
                    ) : (
                      <User size={20} strokeWidth={1.5} className="text-white cursor-pointer hover:text-gold transition-colors" onClick={() => router.push('/login')} />
                    )}
                    <AnimatePresence>
                      {showUserDropdown && (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="absolute right-0 top-16 w-64 bg-matte-black border border-gold/20 shadow-2xl p-2 z-[200]">
                           <div className="p-4 bg-zinc-900 mb-2">
                              <p className="text-[10px] font-black text-gold uppercase tracking-widest">{user.name}</p>
                              <p className="text-[9px] text-zinc-500 truncate mt-1">{user.email}</p>
                           </div>
                           <button onClick={() => router.push('/profile/orders')} className="w-full flex items-center gap-3 p-3 hover:bg-zinc-900 text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-white transition-all">
                              <Package size={14} /> My Collection
                           </button>
                           <button onClick={handleLogout} className="w-full flex items-center gap-3 p-3 hover:bg-red-950/20 text-[10px] font-bold uppercase tracking-widest text-red-500 border-t border-white/5 mt-2">
                              <LogOut size={14} /> Sign Out
                           </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                 </div>

                 <div onClick={() => setIsCartOpen(true)} className="relative cursor-pointer hover:scale-110 transition-transform">
                   <ShoppingCart size={20} strokeWidth={1.5} className="text-white hover:text-gold" />
                   {getCartCount() > 0 && (
                     <span className="absolute -top-2 -right-2 bg-gold text-black text-[8px] w-4 h-4 rounded-full flex items-center justify-center font-black">{getCartCount()}</span>
                   )}
                 </div>
            </div>
          </div>
        </header>

        {/* 3. Luxury Navigation Bar */}
        {!scrolled && (
          <nav className="bg-black/50 backdrop-blur-md border-b border-white/5 hidden lg:block">
            <div className="container mx-auto px-6 flex justify-center items-center gap-16 py-5">
              {categories.map((cat) => (
                <Link key={cat.name} href={cat.href} className="text-[9px] font-black text-zinc-500 hover:text-white transition-all tracking-[0.4em] uppercase relative group">
                  {cat.name}
                  <span className="absolute -bottom-2 left-0 w-full h-[1px] bg-gold scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                </Link>
              ))}
            </div>
          </nav>
        )}
      </div>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <StyleQuiz isOpen={showQuiz} onClose={() => setShowQuiz(false)} />
      
      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} className="fixed inset-0 z-[150] bg-matte-black p-8 flex flex-col">
            <div className="flex justify-between items-center mb-16">
               <span className="text-3xl font-serif text-white italic">ANIX<span className="text-gold">.</span></span>
               <button onClick={() => setIsMenuOpen(false)} className="text-white"><X size={32} /></button>
            </div>
            <div className="flex flex-col gap-8">
              {categories.map((cat) => (
                <Link key={cat.name} href={cat.href} className="text-2xl font-serif text-zinc-400 hover:text-gold transition-colors italic" onClick={() => setIsMenuOpen(false)}>
                  {cat.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
