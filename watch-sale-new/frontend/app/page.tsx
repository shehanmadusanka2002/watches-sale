"use client";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import ProductGrid from "./components/ProductGrid";
import MarqueeBanner from "./components/MarqueeBanner";
import { Star, ChevronRight, Truck, ShieldCheck, RefreshCw, MapPin, Phone, Award, Layers } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0A0A0A] selection:bg-gold selection:text-black relative">
      <div className="grain-overlay" />
      <Navbar />
      <Hero />
      
      {/* 1. The Heritage Categories - Background #0A0A0A */}
      <section className="container mx-auto px-6 py-48 grid grid-cols-1 md:grid-cols-2 gap-20">
        {[
          { title: "Gentlemen", subtitle: "Heritage Collection", img: "/images/mens_banner.png", href: "/category/men" },
          { title: "Ladies", subtitle: "Elegant Selection", img: "/images/womens_banner.png", href: "/category/women" }
        ].map((cat, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: idx * 0.2 }}
          >
            <Link href={cat.href} className="relative group cursor-pointer block overflow-hidden aspect-[4/5] border border-white/5 bg-[#1A1A1A]">
              <img 
                src={cat.img} 
                className="absolute inset-0 w-full h-full object-cover grayscale opacity-20 group-hover:opacity-40 group-hover:scale-110 transition-all duration-1000" 
                alt={cat.title}
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center p-16 text-center z-10">
                 <span className="text-gold text-[10px] font-black uppercase tracking-[0.8em] mb-8 translate-y-8 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-700">{cat.subtitle}</span>
                 <h2 className="text-7xl font-serif text-white italic mb-12">{cat.title}</h2>
                 <div className="divider-line w-16 group-hover:w-40 transition-all duration-700" />
                 <div className="mt-16 opacity-0 group-hover:opacity-100 transition-all duration-700">
                   <button className="luxury-outline-button !border-gold/30 !text-gold hover:!bg-gold hover:!text-black">Enter Boutique</button>
                 </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </section>

      {/* 2. Craftsmanship - Background #111111 (Section Alt) */}
      <section className="py-48 bg-[#111111] relative overflow-hidden border-y border-white/5">
        <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            className="space-y-12"
          >
            <span className="text-gold text-[10px] font-black uppercase tracking-[1em] block">The Art of Precision</span>
            <h2 className="text-6xl md:text-8xl font-serif text-white leading-tight italic">
              Swiss <br /> Engineering. <br /> <span className="text-gold italic">Handcrafted.</span>
            </h2>
            <p className="text-xl text-[#BFBFBF] font-light leading-relaxed italic max-w-lg">
              Behind every tick is a century of mastery. Our timepieces are more than machines—they are hand-assembled artifacts of human excellence.
            </p>
            <div className="grid grid-cols-2 gap-12 pt-12">
               <div className="space-y-4">
                  <Award className="text-gold" size={24} strokeWidth={1} />
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-white">Certified Mastery</h4>
                  <p className="text-[9px] text-[#8A8A8A] uppercase tracking-widest font-bold">COSC Precision Guaranteed</p>
               </div>
               <div className="space-y-4">
                  <Layers className="text-gold" size={24} strokeWidth={1} />
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-white">Infinite Layers</h4>
                  <p className="text-[9px] text-[#8A8A8A] uppercase tracking-widest font-bold">300+ Individual Components</p>
               </div>
            </div>
          </motion.div>
          <motion.div 
             initial={{ opacity: 0, scale: 0.8 }}
             whileInView={{ opacity: 1, scale: 1 }}
             transition={{ duration: 1.5 }}
             className="relative aspect-square border border-white/5 p-8 bg-[#1A1A1A]"
          >
             <img 
               src="/images/craftsmanship.png" 
               className="w-full h-full object-cover grayscale opacity-30 group-hover:opacity-50 transition-all duration-1000" 
               alt="Craftsmanship"
             />
             <div className="absolute -bottom-10 -right-10 w-64 h-64 border border-gold/20 bg-[#1A1A1A] backdrop-blur-3xl p-8 flex flex-col justify-end shadow-2xl">
                <span className="text-[40px] font-serif text-gold italic leading-none mb-4">0.01s</span>
                <p className="text-[8px] text-[#8A8A8A] font-black uppercase tracking-[0.3em]">Tolerance in assembly</p>
             </div>
          </motion.div>
        </div>
      </section>

      <MarqueeBanner />

      {/* 3. The Private Vault - Background #0A0A0A */}
      <section className="py-48 bg-[#0A0A0A]">
        <div className="container mx-auto px-6 text-center mb-40">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <span className="text-gold text-[10px] font-black uppercase tracking-[0.8em] mb-8 block">Exclusive Selection</span>
            <h2 className="text-7xl md:text-9xl font-serif text-white italic mb-16">The Private Vault</h2>
            <div className="divider-line w-40 mx-auto" />
          </motion.div>
        </div>
        
        <div className="container mx-auto px-6">
          <ProductGrid />
        </div>
        
        <div className="mt-40 text-center">
           <button className="luxury-button !px-24">View Entire Archive</button>
        </div>
      </section>

      {/* 4. Luxury Trust Badges - Background #111111 */}
      <section className="py-32 bg-[#111111] border-y border-white/5">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16">
            {[
              { icon: Truck, title: "Elite Delivery", subtitle: "Complimentary Global Shipping" },
              { icon: ShieldCheck, title: "Authenticity", subtitle: "Official 24-Month Warranty" },
              { icon: RefreshCw, title: "Security", subtitle: "Encrypted Transactions" },
              { icon: Star, title: "Curated", subtitle: "Limited Heritage Pieces" }
            ].map((badge, idx) => (
              <div key={idx} className="flex flex-col items-center text-center group">
                <div className="w-16 h-16 rounded-full border border-white/5 flex items-center justify-center mb-8 group-hover:border-gold group-hover:bg-gold/5 transition-all duration-500">
                  <badge.icon size={24} className="text-gold" strokeWidth={1} />
                </div>
                <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-white mb-3">{badge.title}</h4>
                <p className="text-[9px] text-[#8A8A8A] font-bold uppercase tracking-widest italic">{badge.subtitle}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Luxury Footer - Background #0A0A0A */}
      <footer className="bg-[#0A0A0A] text-white pt-60 pb-20 border-t border-white/5 relative">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-40 mb-40">
            <div className="space-y-16">
               <div className="flex flex-col">
                  <span className="text-7xl font-serif italic">ANIX<span className="text-gold">.</span></span>
                  <span className="text-[10px] tracking-[1em] uppercase font-black text-[#8A8A8A] mt-6">Precision Horology Boutique</span>
               </div>
               <p className="text-xl text-[#BFBFBF] font-light leading-relaxed italic max-w-md">
                 Join our inner circle for private collection viewing and exclusive heritage updates.
               </p>
               <div className="flex gap-12 pt-12">
                  {['Instagram', 'Youtube', 'Concierge'].map((s) => (
                    <span key={s} className="text-[9px] font-black uppercase tracking-[0.5em] text-[#8A8A8A] hover:text-gold cursor-pointer transition-all">{s}</span>
                  ))}
               </div>
            </div>
            <div className="grid grid-cols-2 gap-20">
               <div className="space-y-12">
                  <h4 className="text-gold text-[10px] font-black uppercase tracking-[0.6em]">Navigation</h4>
                  <ul className="space-y-6">
                    {['Boutique', 'Heritage', 'Vault', 'Concierge'].map((item) => (
                      <li key={item} className="text-[10px] font-bold text-[#8A8A8A] hover:text-white transition-all uppercase tracking-widest cursor-pointer">{item}</li>
                    ))}
                  </ul>
               </div>
               <div className="space-y-12">
                  <h4 className="text-gold text-[10px] font-black uppercase tracking-[0.6em]">Contact</h4>
                  <div className="space-y-8">
                     <div className="flex flex-col gap-2">
                        <span className="text-[8px] text-[#8A8A8A] font-black uppercase">Private Office</span>
                        <span className="text-[10px] text-[#BFBFBF] font-bold uppercase tracking-widest italic">Elite Arcade, Colombo 07</span>
                     </div>
                     <div className="flex flex-col gap-2">
                        <span className="text-[8px] text-[#8A8A8A] font-black uppercase">Direct Line</span>
                        <span className="text-[10px] text-[#BFBFBF] font-bold uppercase tracking-widest italic">+94 77 123 4567</span>
                     </div>
                  </div>
               </div>
            </div>
          </div>
          <div className="pt-20 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-12">
            <span className="text-[8px] font-black text-[#8A8A8A] uppercase tracking-[0.6em]">© 2026 ANIX PRIVATE BOUTIQUE</span>
            <div className="flex gap-16 grayscale opacity-10">
               <span className="text-[8px] font-black tracking-widest">Swiss Federation of Horology Member</span>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
