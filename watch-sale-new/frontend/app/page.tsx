"use client";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import ProductGrid from "./components/ProductGrid";
import WhatsAppButton from "./components/WhatsAppButton";
import { Star, ChevronRight, Truck, ShieldCheck, RefreshCw, Phone, MapPin, Camera, Share2, X } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

import MarqueeBanner from "./components/MarqueeBanner";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <WhatsAppButton />
      
      {/* Category Banners - Men's & Women's */}
      <section className="container mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/category/men" className="relative group cursor-pointer overflow-hidden rounded-sm bg-zinc-900 h-[250px] shadow-lg">
           <img 
             src="/images/mens_banner.png" 
             className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:scale-110 transition-transform duration-700" 
             alt="Men's Collection"
           />
           <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-white text-3xl font-black italic tracking-wider border-2 border-white px-8 py-2 relative z-10">MEN'S</span>
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-500" />
           </div>
        </Link>
        <Link href="/category/women" className="relative group cursor-pointer overflow-hidden rounded-sm bg-zinc-900 h-[250px] shadow-lg">
           <img 
             src="/images/womens_banner.png" 
             className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:scale-110 transition-transform duration-700" 
             alt="Women's Collection"
           />
           <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-white text-3xl font-black italic tracking-wider border-2 border-white px-8 py-2 relative z-10">WOMEN'S</span>
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-500" />
           </div>
        </Link>
      </section>

      {/* Trust Badges - Redesigned for Premium Look */}
      <section className="py-16 bg-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-zinc-100 to-transparent" />
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
            {[
              { icon: Truck, title: "Fast Delivery", subtitle: "Islandwide covered with care", color: "text-zinc-900" },
              { icon: ShieldCheck, title: "Official Warranty", subtitle: "12-24 Months authentic guarantee", color: "text-zinc-900" },
              { icon: RefreshCw, title: "Secure Payment", subtitle: "100% Encrypted & Safe gateway", color: "text-zinc-900" },
              { icon: Star, title: "EXCELLENT", subtitle: "500+ Google Reviews from collectors", color: "text-red-600", isRating: true }
            ].map((badge, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="group flex items-center gap-6 p-6 rounded-2xl hover:bg-zinc-50 transition-all duration-500 cursor-default"
              >
                <div className={`w-14 h-14 rounded-2xl bg-zinc-50 flex items-center justify-center group-hover:scale-110 group-hover:bg-black group-hover:text-white transition-all duration-500 shadow-sm ${badge.color}`}>
                  <badge.icon size={26} fill={badge.isRating ? "currentColor" : "none"} />
                </div>
                <div className="flex flex-col gap-1">
                  <span className={`text-xs font-black uppercase tracking-widest ${badge.isRating ? 'text-red-600' : 'text-black'}`}>
                    {badge.title}
                  </span>
                  <span className="text-[10px] text-zinc-400 font-bold italic uppercase tracking-tighter">
                    {badge.subtitle}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-zinc-100 to-transparent" />
      </section>

      {/* Advanced Filtering Section */}
      <section id="collection" className="py-24 border-b border-zinc-50">
        <div className="container mx-auto px-6">
          <div className="mb-16">
            <h2 className="text-5xl font-black tracking-tighter mb-4 uppercase">Explore Collection</h2>
            <p className="text-[10px] text-zinc-400 font-black uppercase tracking-[0.4em]">Curated timepieces for refined tastes</p>
          </div>
          <ProductGrid showFilters={true} />
        </div>
      </section>

      {/* Men's Watches Section */}
      <section id="men" className="py-20">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="container mx-auto px-6"
        >
          <div className="flex items-center gap-4 mb-12">
            <h2 className="text-3xl font-black tracking-tighter flex items-center gap-3">
              MEN'S <span className="text-zinc-200">|</span> <span className="text-xs font-bold text-zinc-400 italic">PRECISION, QUALITY, INNOVATION</span>
            </h2>
            <div className="h-[2px] flex-grow bg-zinc-50" />
            <ChevronRight size={24} className="text-zinc-200 bg-zinc-50 rounded-full cursor-pointer hover:bg-zinc-100 transition-colors" />
          </div>
          
          <ProductGrid categoryType="MEN'S WATCHES" />
          
          <div className="mt-12 flex justify-center">
            <button className="bg-black text-white px-12 py-4 text-[10px] font-black uppercase tracking-[0.25em] hover:bg-zinc-800 transition-all">
              Men's Collection •
            </button>
          </div>
        </motion.div>
      </section>

      {/* Women's Watches Section */}
      <section id="women" className="py-20 bg-zinc-50/50">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="container mx-auto px-6"
        >
          <div className="flex items-center gap-4 mb-12">
            <h2 className="text-3xl font-black tracking-tighter flex items-center gap-3">
              WOMEN'S <span className="text-zinc-200">|</span> <span className="text-xs font-bold text-zinc-400 italic">STYLE, STATEMENT</span>
            </h2>
            <div className="h-[2px] flex-grow bg-zinc-50" />
            <ChevronRight size={24} className="text-zinc-200 bg-zinc-50 rounded-full cursor-pointer hover:bg-zinc-100 transition-colors" />
          </div>
          
          <ProductGrid categoryType="WOMEN'S WATCHES" />
          
          <div className="mt-12 flex justify-center">
            <button className="bg-black text-white px-12 py-4 text-[10px] font-black uppercase tracking-[0.25em] hover:bg-zinc-800 transition-all">
              Women's Collection •
            </button>
          </div>
        </motion.div>
      </section>

      {/* Couple Watches Section */}
      <section id="couple" className="py-20">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="container mx-auto px-6"
        >
          <div className="flex items-center gap-4 mb-12">
            <h2 className="text-3xl font-black tracking-tighter flex items-center gap-3">
              COUPLE <span className="text-zinc-200">|</span> <span className="text-xs font-bold text-zinc-400 italic">TIMELESS BONDS</span>
            </h2>
            <div className="h-[2px] flex-grow bg-zinc-50" />
            <ChevronRight size={24} className="text-zinc-200 bg-zinc-50 rounded-full cursor-pointer hover:bg-zinc-100 transition-colors" />
          </div>
          <ProductGrid categoryType="COUPLE WATCHES" />
        </motion.div>
      </section>

      {/* New Arrivals Section */}
      <section id="new-arrivals" className="py-20 bg-zinc-50/50">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="container mx-auto px-6"
        >
          <div className="flex items-center gap-4 mb-12">
            <h2 className="text-3xl font-black tracking-tighter flex items-center gap-3">
              NEW ARRIVALS <span className="text-zinc-200">|</span> <span className="text-xs font-bold text-zinc-400 italic">LATEST RELEASES</span>
            </h2>
            <div className="h-[2px] flex-grow bg-zinc-50" />
            <ChevronRight size={24} className="text-zinc-200 bg-zinc-50 rounded-full cursor-pointer hover:bg-zinc-100 transition-colors" />
          </div>
          <ProductGrid categoryType="NEW ARRIVALS" />
        </motion.div>
      </section>

      {/* Smart Watches Section */}
      <section id="smart" className="py-20">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="container mx-auto px-6 text-left"
        >
          <div className="flex items-center gap-4 mb-12">
            <h2 className="text-3xl font-black tracking-tighter flex items-center gap-3">
              SMART <span className="text-zinc-200">|</span> <span className="text-xs font-bold text-zinc-400 italic">TECH-INFUSED</span>
            </h2>
            <div className="h-[2px] flex-grow bg-zinc-50" />
            <ChevronRight size={24} className="text-zinc-200 bg-zinc-50 rounded-full cursor-pointer hover:bg-zinc-100 transition-colors" />
          </div>
          <ProductGrid categoryType="SMART WATCHES" />
        </motion.div>
      </section>

      {/* Moving Watches Marquee Section (Replacing Vintage) */}
      <MarqueeBanner />

      {/* Children Section */}
      <section id="children" className="py-20">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="container mx-auto px-6"
        >
          <div className="flex items-center gap-4 mb-12">
            <h2 className="text-3xl font-black tracking-tighter flex items-center gap-3 text-zinc-900">
              CHILDREN <span className="text-zinc-200">|</span> <span className="text-xs font-bold text-zinc-400 italic">VIBRANT & DURABLE</span>
            </h2>
            <div className="h-[2px] flex-grow bg-zinc-50" />
            <ChevronRight size={24} className="text-zinc-200 bg-zinc-50 rounded-full cursor-pointer hover:bg-zinc-100 transition-colors" />
          </div>
          <ProductGrid categoryType="CHILDREN WATCHES" />
        </motion.div>
      </section>

      {/* Footer - Redesigned for Premium Luxury Look */}
      <footer className="bg-zinc-950 text-white pt-24 pb-12 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />
        
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
            {/* Brand Column */}
            <div className="space-y-8">
              <div className="flex flex-col">
                <span className="text-4xl font-black tracking-tighter italic">ANIX<span className="text-zinc-700">.</span></span>
                <span className="text-[7px] tracking-[0.6em] uppercase font-black text-zinc-500 mt-1">Official Boutique</span>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-zinc-400">
                  <MapPin size={14} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">No 515, Galle Road, Colombo 04</span>
                </div>
                <div className="flex items-center gap-3 text-zinc-400">
                  <Phone size={14} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">+94 77 123 4567</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                 {[
                   { icon: Camera, link: "#" },
                   { icon: Share2, link: "#" },
                   { icon: X, link: "#" }
                 ].map((social, i) => (
                   <a key={i} href={social.link} className="w-10 h-10 rounded-full border border-zinc-800 flex items-center justify-center hover:bg-white hover:text-black transition-all cursor-pointer group">
                      <social.icon size={16} />
                   </a>
                 ))}
              </div>
            </div>
            
            {/* Quick Links */}
            <div>
              <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-white mb-10">Concierge</h4>
              <ul className="space-y-4">
                {['Tracking Number', 'Warranty Claims', 'Order Status', 'Boutique Finder'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-[10px] font-bold text-zinc-500 hover:text-white transition-all uppercase tracking-widest flex items-center gap-2 group">
                      <span className="w-0 group-hover:w-4 h-px bg-white transition-all duration-300" />
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-white mb-10">Boutique Policy</h4>
              <ul className="space-y-4">
                {['Privacy Policy', 'Terms of Service', 'Return Policy', 'Authenticity'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-[10px] font-bold text-zinc-500 hover:text-white transition-all uppercase tracking-widest flex items-center gap-2 group">
                      <span className="w-0 group-hover:w-4 h-px bg-white transition-all duration-300" />
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter */}
            <div className="space-y-8">
              <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-white mb-10">Boutique News</h4>
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest leading-loose italic">
                Be the first to receive exclusive updates and collection launches.
              </p>
              <div className="relative group">
                <input 
                  type="email" 
                  placeholder="Email Address" 
                  className="w-full bg-transparent border-b border-zinc-800 py-4 text-[10px] font-bold uppercase tracking-widest outline-none focus:border-white transition-all"
                />
                <button className="absolute right-0 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-all">
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-12 border-t border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-8">
            <p className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.3em]">
              © 2026 ANIX WATCHES SRI LANKA. ALL RIGHTS RESERVED.
            </p>
            
            <div className="flex items-center gap-8 grayscale opacity-30 hover:grayscale-0 hover:opacity-100 transition-all duration-700">
               {['VISA', 'MASTERCARD', 'AMEX', 'MINT PAY', 'KOKO'].map((pay) => (
                 <span key={pay} className="text-[8px] font-black tracking-[0.2em]">{pay}</span>
               ))}
            </div>

            <div className="flex items-center gap-4 text-[9px] font-black text-zinc-600 uppercase tracking-widest">
               <span>Sri Lanka</span>
               <div className="w-1 h-1 bg-zinc-800 rounded-full" />
               <span className="text-zinc-400">English</span>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
