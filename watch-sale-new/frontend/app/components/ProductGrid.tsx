"use client";

import React, { useEffect, useState } from 'react';
import { fetchProducts } from '@/lib/api';
import { ShoppingCart, Heart, Eye } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { motion } from 'framer-motion';

interface Product {
  id: number;
  name: string;
  brand: string;
  price: number;
  categoryType: string;
  movementType?: string;
  imageUrl: string;
}

const ProductGrid = ({ categoryType }: { categoryType?: string }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    const getProducts = async () => {
      const data = await fetchProducts();
      let initialData = data;
      if (categoryType) {
        initialData = data.filter((p: Product) => 
          p.categoryType?.toLowerCase() === categoryType.toLowerCase() ||
          (categoryType.toLowerCase() === 'men' && p.categoryType?.toLowerCase() === "men's watches") ||
          (categoryType.toLowerCase() === 'women' && p.categoryType?.toLowerCase() === "women's watches")
        );
      }
      setProducts(data);
      setFilteredProducts(initialData);
      setLoading(false);
    };
    getProducts();
  }, [categoryType]);

  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="animate-pulse flex flex-col gap-8 bg-[#1A1A1A] p-4 border border-white/5">
            <div className="aspect-[3/4] bg-[#0A0A0A] rounded-sm"></div>
            <div className="h-4 bg-[#0A0A0A] w-2/3 mx-auto"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-24">
        {filteredProducts.map((product, idx) => (
          <motion.div 
              key={product.id} 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.8 }}
              className="group relative"
          >
            <div className="relative aspect-[3/4] w-full bg-[#1A1A1A] overflow-hidden mb-10 border border-white/5 transition-all duration-1000 group-hover:border-gold/20 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
              {/* Lighting effect */}
              <div className="absolute inset-0 bg-gradient-to-tr from-black via-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 z-10" />
              
              <motion.img 
                whileHover={{ scale: 1.12 }}
                src={(product.imageUrl?.split('|')[0]) || 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=1000&auto=format&fit=crop'} 
                alt={product.name} 
                className="w-full h-full object-cover opacity-40 group-hover:opacity-70 transition-all duration-1000 grayscale group-hover:grayscale-0"
              />

              <div className="absolute inset-0 flex flex-col justify-end p-8 z-20">
                 <div className="translate-y-8 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-700">
                    <button 
                      onClick={() => addToCart(product)}
                      className="luxury-button w-full mb-4 flex items-center justify-center gap-3"
                    >
                      <ShoppingCart size={14} /> Acquisition
                    </button>
                    <div className="flex justify-center gap-6">
                       <button onClick={(e) => { e.preventDefault(); isInWishlist(product.id) ? removeFromWishlist(product.id) : addToWishlist(product); }} className="text-[#8A8A8A] hover:text-gold transition-colors">
                          <Heart size={16} fill={isInWishlist(product.id) ? "currentColor" : "none"} />
                       </button>
                       <Link href={`/product/${product.id}`} className="text-[#8A8A8A] hover:text-gold transition-colors">
                          <Eye size={16} />
                       </Link>
                    </div>
                 </div>
              </div>
            </div>

            <div className="flex flex-col items-center text-center">
              <span className="text-[8px] font-black text-gold/60 uppercase tracking-[0.8em] mb-4">{product.brand}</span>
              <Link href={`/product/${product.id}`}>
                 <h3 className="text-2xl font-serif text-white mb-4 line-clamp-1 group-hover:text-gold transition-colors duration-500 italic">
                   {product.name}
                 </h3>
              </Link>
              <div className="h-px w-8 bg-gold/20 mb-4 group-hover:w-16 transition-all duration-700" />
              <span className="text-[#BFBFBF] font-sans tracking-[0.3em] text-[10px] font-bold uppercase">
                Rs. {product.price?.toLocaleString()}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ProductGrid;
