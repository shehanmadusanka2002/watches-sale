"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchWishlist, addToWishlistApi, removeFromWishlistApi } from '@/lib/api';

interface WishlistContextType {
  wishlist: any[];
  addToWishlist: (product: any) => Promise<void>;
  removeFromWishlist: (productId: number) => Promise<void>;
  isInWishlist: (productId: number) => boolean;
  wishlistCount: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider = ({ children }: { children: React.ReactNode }) => {
  const [wishlist, setWishlist] = useState<any[]>([]);

  const loadWishlist = async () => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      const data = await fetchWishlist(user.id);
      setWishlist(data.map((item: any) => item.product));
    }
  };

  useEffect(() => {
    loadWishlist();
  }, []);

  const addToWishlist = async (product: any) => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) return;
    const user = JSON.parse(storedUser);

    try {
      await addToWishlistApi(user.id, product.id);
      setWishlist([...wishlist, product]);
    } catch (error) {
      console.error("Failed to add to wishlist", error);
    }
  };

  const removeFromWishlist = async (productId: number) => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) return;
    const user = JSON.parse(storedUser);

    try {
      await removeFromWishlistApi(user.id, productId);
      setWishlist(wishlist.filter(p => p.id !== productId));
    } catch (error) {
      console.error("Failed to remove from wishlist", error);
    }
  };

  const isInWishlist = (productId: number) => {
    return wishlist.some(p => p.id === productId);
  };

  return (
    <WishlistContext.Provider value={{ 
      wishlist, 
      addToWishlist, 
      removeFromWishlist, 
      isInWishlist,
      wishlistCount: wishlist.length 
    }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
