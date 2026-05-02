"use client";

import React, { useEffect, useState } from 'react';
import { fetchProducts } from '@/lib/api';
import { ShoppingCart, Heart, Eye } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import FilterBar from './FilterBar';
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

interface ProductGridProps {
  categoryType?: string;
  showFilters?: boolean;
}

const ProductGrid = ({ categoryType, showFilters = false }: ProductGridProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    const getProducts = async () => {
      const data = await fetchProducts();
      setProducts(data);
      
      // Initial filter by category
      let initialData = data;
      if (categoryType) {
        initialData = data.filter((p: Product) => 
          p.categoryType?.toLowerCase() === categoryType.toLowerCase() ||
          (categoryType.toLowerCase() === 'men' && p.categoryType?.toLowerCase() === "men's watches") ||
          (categoryType.toLowerCase() === 'women' && p.categoryType?.toLowerCase() === "women's watches")
        );
      }
      setFilteredProducts(initialData);
      setLoading(false);
    };
    getProducts();
  }, [categoryType]);

  const handleFilterChange = (filters: any) => {
    let result = products;
    
    // Always apply category filter if present
    if (categoryType) {
      result = result.filter(p => 
        p.categoryType?.toLowerCase() === categoryType.toLowerCase() ||
        (categoryType.toLowerCase() === 'men' && p.categoryType?.toLowerCase() === "men's watches") ||
        (categoryType.toLowerCase() === 'women' && p.categoryType?.toLowerCase() === "women's watches")
      );
    }

    if (filters.brand) {
      result = result.filter(p => p.brand === filters.brand);
    }

    if (filters.movement) {
      result = result.filter(p => p.movementType === filters.movement);
    }

    if (filters.minPrice) {
      result = result.filter(p => p.price >= parseFloat(filters.minPrice));
    }

    if (filters.maxPrice) {
      result = result.filter(p => p.price <= parseFloat(filters.maxPrice));
    }

    setFilteredProducts(result);
  };

  const uniqueBrands = Array.from(new Set(products.map(p => p.brand).filter(Boolean)));
  const uniqueMovements = Array.from(new Set(products.map(p => p.movementType).filter((m): m is string => Boolean(m))));

  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="animate-pulse flex flex-col gap-4">
            <div className="aspect-[3/4] bg-zinc-100 rounded-sm"></div>
            <div className="h-4 bg-zinc-100 w-2/3"></div>
            <div className="h-4 bg-zinc-100 w-1/3"></div>
          </div>
        ))}
      </div>
    );
  }

  const handleWishlistToggle = async (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    if (isInWishlist(product.id)) {
      await removeFromWishlist(product.id);
    } else {
      await addToWishlist(product);
    }
  };

  return (
    <div className="w-full">
      {showFilters && (
        <FilterBar 
          onFilterChange={handleFilterChange} 
          brands={uniqueBrands} 
          movements={uniqueMovements} 
        />
      )}

      {filteredProducts.length === 0 ? (
        <div className="py-20 text-center border-2 border-dashed border-zinc-100 rounded-sm">
           <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">No timepieces found matching your criteria</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16">
          {filteredProducts.map((product, idx) => (
            <motion.div 
                key={product.id} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className="group relative flex flex-col items-center"
            >
              <motion.div 
                whileHover={{ y: -10 }}
                className="relative aspect-[3/4] w-full bg-zinc-50 overflow-hidden mb-6 rounded-sm shadow-sm group-hover:shadow-2xl transition-all duration-700"
              >
                {/* Floating Actions */}
                <div className="absolute top-4 right-4 z-20 flex flex-col gap-3 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-500">
                  <button 
                    onClick={(e) => handleWishlistToggle(e, product)}
                    className={`p-3.5 rounded-full shadow-2xl backdrop-blur-xl transition-all transform hover:scale-110 active:scale-90 ${isInWishlist(product.id) ? 'bg-black text-white' : 'bg-white/90 text-black hover:bg-black hover:text-white'}`}
                  >
                    <Heart size={18} fill={isInWishlist(product.id) ? "currentColor" : "none"} />
                  </button>
                  <Link href={`/product/${product.id}`} className="bg-white/90 backdrop-blur-xl p-3.5 rounded-full shadow-2xl hover:bg-black hover:text-white transition-all transform hover:scale-110 active:scale-90">
                    <Eye size={18} />
                  </Link>
                </div>

                {/* Stock Status Indicator */}
                <div className="absolute top-4 left-4 z-20 flex items-center gap-2 opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-500">
                   <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                   <span className="text-[8px] font-black text-zinc-400 uppercase tracking-widest bg-white/80 backdrop-blur-md px-2 py-1 rounded-full">In Stock</span>
                </div>

                {/* Quick Add Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-5 z-20 translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-in-out">
                   <button 
                     onClick={(e) => {
                        e.stopPropagation();
                        addToCart(product);
                     }}
                     className="w-full bg-black text-white py-4 text-[10px] font-black uppercase tracking-[0.4em] flex items-center justify-center gap-3 hover:bg-zinc-800 transition-all shadow-2xl active:scale-95"
                   >
                     <ShoppingCart size={14} /> Add to Collection
                   </button>
                </div>

                {/* Image with Tilt effect on hover */}
                <motion.img 
                  whileHover={{ scale: 1.15 }}
                  src={(product.imageUrl?.split('|')[0]) || 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=1000&auto=format&fit=crop'} 
                  alt={product.name} 
                  className="w-full h-full object-cover transition-transform duration-1000 ease-out"
                />
                
                {/* Gradient Bottom Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              </motion.div>

              {/* Product Info */}
              <div className="flex flex-col gap-2 items-center w-full px-4 text-center">
                <span className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.5em] mb-1">{product.brand}</span>
                <Link href={`/product/${product.id}`} className="w-full group/title">
                   <h3 className="text-sm font-black text-black uppercase tracking-[0.15em] group-hover/title:text-indigo-600 transition-colors line-clamp-1 w-full text-center mb-1">
                     {product.name}
                   </h3>
                </Link>

                {/* Variant Swatches (Inspired by Francium) */}
                <div className="flex items-center gap-1.5 mb-2">
                   {['#000000', '#C0C0C0', '#FFD700'].map((color, i) => (
                     <div 
                       key={i} 
                       className="w-2.5 h-2.5 rounded-full border border-zinc-200 transition-transform hover:scale-125 cursor-pointer" 
                       style={{ backgroundColor: color }}
                     />
                   ))}
                </div>

                <div className="flex items-center gap-4 mt-1 bg-zinc-50/50 px-4 py-1.5 rounded-full border border-zinc-100/50">
                   <span className="text-[11px] font-black text-black tracking-tighter">
                     Rs. {product.price?.toLocaleString()}
                   </span>
                   <div className="w-1 h-1 bg-zinc-300 rounded-full"></div>
                   <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">
                     {product.movementType || 'QUARTZ'}
                   </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductGrid;
