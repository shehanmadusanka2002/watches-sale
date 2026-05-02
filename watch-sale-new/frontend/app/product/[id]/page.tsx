"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { fetchProductById, fetchReviews, postReview } from '@/lib/api';
import Navbar from '@/app/components/Navbar';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import VirtualTryOn from '@/app/components/VirtualTryOn';
import { ShoppingCart, Heart, ShieldCheck, Truck, RefreshCcw, ArrowLeft, Star, Clock, ChevronRight, Check, Lock, MessageSquare, Send, User, RotateCcw, Camera } from 'lucide-react';
import ThreeSixtyViewer from '@/app/components/ThreeSixtyViewer';

const ProductDetails = () => {
    const { id } = useParams();
    const router = useRouter();
    const { addToCart } = useCart();
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [imageUrls, setImageUrls] = useState<string[]>([]);
    const [activeImage, setActiveImage] = useState(0);
    const [isAdded, setIsAdded] = useState(false);
    const [showAuthToast, setShowAuthToast] = useState(false);
    const [show360, setShow360] = useState(false);
    const [showAR, setShowAR] = useState(false);
    
    // Review States
    const [reviews, setReviews] = useState<any[]>([]);
    const [newReview, setNewReview] = useState({ rating: 5, comment: '', imageUrl: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    const getProductAndReviews = async () => {
        if (id) {
            const [productData, reviewsData] = await Promise.all([
                fetchProductById(id as string),
                fetchReviews(id as string)
            ]);
            
            setProduct(productData);
            setReviews(reviewsData);
            
            if (productData?.imageUrl) {
                setImageUrls(productData.imageUrl.split('|').filter((url: string) => url.trim() !== ''));
            }
            setLoading(false);
        }
    };

    useEffect(() => {
        getProductAndReviews();
    }, [id]);

    const handleAddToCart = () => {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
            setShowAuthToast(true);
            setTimeout(() => {
                setShowAuthToast(false);
                router.push('/login');
            }, 3000);
            return;
        }

        if (product) {
            addToCart(product);
            setIsAdded(true);
            setTimeout(() => setIsAdded(false), 3000);
        }
    };

    const handlePostReview = async (e: React.FormEvent) => {
        e.preventDefault();
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
            setShowAuthToast(true);
            return;
        }

        const user = JSON.parse(storedUser);
        setIsSubmitting(true);

        try {
            await postReview(user.id, {
                productId: Number(id),
                rating: newReview.rating,
                comment: newReview.comment,
                imageUrl: newReview.imageUrl
            });
            setNewReview({ rating: 5, comment: '', imageUrl: '' });
            setPreviewImage(null);
            // Refresh reviews
            const freshReviews = await fetchReviews(id as string);
            setReviews(freshReviews);
        } catch (error) {
            console.error("Failed to post review", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-zinc-100 border-t-black rounded-full animate-spin"></div>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Inspecting Quality...</p>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
                <h1 className="text-2xl font-black mb-4">WATCH NOT FOUND</h1>
                <p className="text-zinc-500 mb-8 max-w-md uppercase text-[10px] tracking-widest leading-loose">The timepiece you are looking for might have been moved or is currently unavailable in our collection.</p>
                <button onClick={() => router.back()} className="bg-black text-white px-8 py-3 text-[10px] font-black uppercase tracking-widest">Return to Collection</button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white font-sans overflow-x-hidden">
            <Navbar />

            <main className="container mx-auto px-6 py-12 md:py-20 lg:py-24">
                {/* Breadcrumbs */}
                <div className="flex items-center gap-3 text-[9px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-8 overflow-x-auto whitespace-nowrap pb-2 scrollbar-hide">
                    <button onClick={() => router.push('/')} className="hover:text-black transition-colors">Boutique</button>
                    <ChevronRight size={10} />
                    <span className="text-zinc-300">{product.categoryType || 'Collection'}</span>
                    <ChevronRight size={10} />
                    <span className="text-black">{product.name}</span>
                </div>

                {/* Back Button */}
                <button 
                  onClick={() => router.back()}
                  className="flex items-center gap-2 text-zinc-400 hover:text-black transition-colors mb-12 group"
                >
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Return to Boutique</span>
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 xl:gap-24">
                    {/* Left: Product Imagery */}
                    <div className="flex flex-col gap-6">
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="relative aspect-[4/5] bg-zinc-50 overflow-hidden group rounded-sm shadow-sm"
                        >
                            <img 
                                src={imageUrls[activeImage] || 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=1000&auto=format&fit=crop'} 
                                alt={product.name}
                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                            />
                            <div className="absolute top-6 left-6">
                                <span className="bg-black text-white text-[9px] font-black px-4 py-1.5 uppercase tracking-[0.2em]">Authentic</span>
                            </div>
                        </motion.div>
                        
                        {/* Thumbnail Grid */}
                        {imageUrls.length > 1 && (
                            <div className="grid grid-cols-5 gap-4">
                                {imageUrls.map((url, idx) => (
                                    <div 
                                      key={idx}
                                      onClick={() => setActiveImage(idx)}
                                      className={`aspect-square bg-zinc-50 rounded-sm overflow-hidden cursor-pointer border-2 transition-all ${idx === activeImage ? 'border-black' : 'border-transparent opacity-60 hover:opacity-100'}`}
                                    >
                                        <img 
                                          src={url} 
                                          className="w-full h-full object-cover" 
                                          alt={`Thumbnail ${idx + 1}`}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Interactive Buttons */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            {imageUrls.length > 2 && (
                                <button 
                                    onClick={() => setShow360(true)}
                                    className="flex items-center justify-center gap-4 py-6 border border-zinc-100 bg-zinc-50 hover:bg-black hover:text-white transition-all group overflow-hidden relative"
                                >
                                    <div className="absolute inset-0 bg-zinc-900 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                                    <div className="relative z-10 flex items-center gap-4">
                                        <RotateCcw size={16} className="group-hover:animate-spin-slow" />
                                        <span className="text-[9px] font-black uppercase tracking-[0.4em]">360° Interactive</span>
                                    </div>
                                </button>
                            )}
                            
                            <button 
                                onClick={() => setShowAR(true)}
                                className="flex items-center justify-center gap-4 py-6 border border-indigo-100 bg-indigo-50/30 text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all group overflow-hidden relative"
                            >
                                <div className="absolute inset-0 bg-indigo-600 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                                <div className="relative z-10 flex items-center gap-4">
                                    <Camera size={16} className="group-hover:scale-110 transition-transform" />
                                    <span className="text-[9px] font-black uppercase tracking-[0.4em]">Virtual Try-On (AR)</span>
                                </div>
                            </button>
                        </div>
                    </div>

                    {/* Right: Product Content */}
                    <div className="flex flex-col">
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                        >
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-[11px] font-black text-zinc-400 uppercase tracking-[0.3em]">{product.brand || 'Luxury Collection'}</span>
                                <div className="flex items-center gap-1">
                                    <Star size={10} className="fill-black" />
                                    <span className="text-[10px] font-bold">
                                        {reviews.length > 0 
                                            ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) 
                                            : '5.0'} Signature
                                    </span>
                                </div>
                            </div>
                            
                            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-black tracking-tighter mb-6 leading-tight uppercase">
                                {product.name}
                            </h1>

                            <div className="flex items-center gap-6 mb-8">
                                <span className="text-3xl font-black text-black tracking-tight">Rs. {product.price?.toLocaleString()}</span>
                                <div className="h-8 w-px bg-zinc-100"></div>
                                <div className="flex flex-col">
                                    <span className="text-[9px] font-black text-green-600 uppercase tracking-widest">Available Now</span>
                                    <span className="text-[10px] text-zinc-400">Order by 4PM for next-day dispatch</span>
                                </div>
                            </div>

                            <p className="text-zinc-500 text-sm leading-relaxed mb-10 max-w-xl font-medium text-left">
                                {product.description || "A masterpiece of horological engineering. This timepiece represents the pinnacle of craftsmanship, combining timeless aesthetic appeal with modern precision engineering. Every detail has been meticulously refined to offer an unparalleled wearing experience for the discerning collector."}
                            </p>

                            <div className="grid grid-cols-2 gap-4 mb-10 text-left">
                                <div className="p-4 bg-zinc-50 border border-zinc-100 rounded-sm">
                                    <p className="text-[9px] text-zinc-400 font-black uppercase tracking-widest mb-1">Case Material</p>
                                    <p className="text-xs font-bold text-black uppercase tracking-widest">{product.caseMaterial || 'Premium Alloy'}</p>
                                </div>
                                <div className="p-4 bg-zinc-50 border border-zinc-100 rounded-sm">
                                    <p className="text-[9px] text-zinc-400 font-black uppercase tracking-widest mb-1">Water Resistance</p>
                                    <p className="text-xs font-bold text-black uppercase tracking-widest">{product.waterResistance || 'Daily Water Resist'}</p>
                                </div>
                                <div className="p-4 bg-zinc-50 border border-zinc-100 rounded-sm">
                                    <p className="text-[9px] text-zinc-400 font-black uppercase tracking-widest mb-1">Movement</p>
                                    <p className="text-xs font-bold text-black uppercase tracking-widest">{product.movementType || 'High Precision'}</p>
                                </div>
                                <div className="p-4 bg-zinc-50 border border-zinc-100 rounded-sm">
                                    <p className="text-[9px] text-zinc-400 font-black uppercase tracking-widest mb-1">Warranty</p>
                                    <p className="text-xs font-bold text-black uppercase tracking-widest">{product.warranty || '1 Year Boutique'}</p>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 mb-12">
                                <button 
                                  onClick={handleAddToCart}
                                  className={`flex-1 ${isAdded ? 'bg-green-600' : 'bg-black'} text-white px-10 py-5 text-[11px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-4 hover:bg-zinc-800 transition-all shadow-xl active:scale-95`}
                                >
                                    {isAdded ? (
                                        <>
                                            <Check size={16} />
                                            Added to Collection
                                        </>
                                    ) : (
                                        <>
                                            <ShoppingCart size={16} />
                                            Add to Collection
                                        </>
                                    )}
                                </button>
                                <button 
                                    onClick={() => isInWishlist(product.id) ? removeFromWishlist(product.id) : addToWishlist(product)}
                                    className={`p-5 border transition-all group active:scale-95 ${isInWishlist(product.id) ? 'bg-black border-black text-white' : 'border-zinc-200 hover:border-black'}`}
                                >
                                    <Heart size={18} fill={isInWishlist(product.id) ? "currentColor" : "none"} className="transition-all" />
                                </button>
                            </div>

                            <AnimatePresence>
                                {isAdded && (
                                    <motion.div 
                                      initial={{ opacity: 0, y: 50 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      exit={{ opacity: 0, y: 20 }}
                                      className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-black text-white px-8 py-4 rounded-sm flex items-center gap-4 shadow-2xl z-[100] border border-white/10"
                                    >
                                        <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                                            <Check size={14} className="text-white" />
                                        </div>
                                        <div className="flex flex-col text-left">
                                            <span className="text-[10px] font-black uppercase tracking-widest">Added Successfully</span>
                                            <span className="text-[9px] text-zinc-400 font-bold">Your masterpiece is now in the collection.</span>
                                        </div>
                                    </motion.div>
                                )}

                                {showAuthToast && (
                                    <motion.div 
                                      initial={{ opacity: 0, y: 50 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      exit={{ opacity: 0, y: 20 }}
                                      className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-zinc-900 text-white px-8 py-4 rounded-sm flex items-center gap-4 shadow-2xl z-[100] border border-red-500/20"
                                    >
                                        <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center">
                                            <Lock size={14} className="text-white" />
                                        </div>
                                        <div className="flex flex-col text-left">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-red-500">Authentication Required</span>
                                            <span className="text-[9px] text-zinc-400 font-bold">Please sign in to secure this timepiece.</span>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div className="grid grid-cols-3 gap-6 pt-10 border-t border-zinc-100">
                                <div className="flex flex-col items-center text-center gap-3 group">
                                    <ShieldCheck size={20} className="text-zinc-300 group-hover:text-black transition-colors" />
                                    <span className="text-[8px] font-black uppercase tracking-widest text-zinc-400 group-hover:text-black">Official Warranty</span>
                                </div>
                                <div className="flex flex-col items-center text-center gap-3 group">
                                    <Truck size={20} className="text-zinc-300 group-hover:text-black transition-colors" />
                                    <span className="text-[8px] font-black uppercase tracking-widest text-zinc-400 group-hover:text-black">Islandwide Delivery</span>
                                </div>
                                <div className="flex flex-col items-center text-center gap-3 group">
                                    <RefreshCcw size={20} className="text-zinc-300 group-hover:text-black transition-colors" />
                                    <span className="text-[8px] font-black uppercase tracking-widest text-zinc-400 group-hover:text-black">Authentic Return</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Reviews Section */}
                <div className="mt-24 pt-24 border-t border-zinc-100 text-left">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16">
                        <div>
                            <h2 className="text-4xl font-black text-black tracking-tighter mb-2 uppercase">Collector Reviews</h2>
                            <p className="text-[10px] text-zinc-400 font-black uppercase tracking-[0.2em]">Insights from our global connoisseurs</p>
                        </div>
                        <div className="flex items-center gap-6 bg-zinc-50 p-6 rounded-sm border border-zinc-100">
                            <div className="flex flex-col items-center">
                                <span className="text-4xl font-black text-black leading-none">
                                    {reviews.length > 0 
                                        ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) 
                                        : '5.0'}
                                </span>
                                <div className="flex gap-0.5 mt-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star key={star} size={12} className="fill-black" />
                                    ))}
                                </div>
                            </div>
                            <div className="h-12 w-px bg-zinc-200"></div>
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black uppercase tracking-widest text-black">{reviews.length} Verified Reviews</span>
                                <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-widest mt-1">100% Satisfaction Rate</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                        {/* Review Form */}
                        <div className="lg:col-span-5">
                            <div className="sticky top-24 bg-white border border-zinc-100 p-8 shadow-sm rounded-sm">
                                <h3 className="text-xs font-black uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
                                    <MessageSquare size={16} className="text-zinc-400" />
                                    Write a Review
                                </h3>
                                <form onSubmit={handlePostReview} className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400 ml-1">Rating</label>
                                        <div className="flex gap-3 bg-zinc-50 p-4 rounded-sm border border-zinc-100">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    key={star}
                                                    type="button"
                                                    onClick={() => setNewReview({ ...newReview, rating: star })}
                                                    className="transition-transform active:scale-90"
                                                >
                                                    <Star 
                                                        size={24} 
                                                        className={`${star <= newReview.rating ? 'fill-black text-black' : 'text-zinc-200'} transition-colors`} 
                                                    />
                                                </button>
                                            ))}
                                            <span className="ml-auto text-[10px] font-black uppercase self-center text-zinc-400">{newReview.rating} Stars</span>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400 ml-1">Your Insight</label>
                                        <textarea
                                            required
                                            value={newReview.comment}
                                            onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                                            placeholder="Describe your wearing experience..."
                                            className="w-full bg-zinc-50 border border-zinc-100 p-5 text-sm h-32 focus:border-black outline-none transition-all rounded-sm resize-none"
                                        />
                                    </div>

                                    {/* Image Upload */}
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400 ml-1">Photo Evidence (Optional)</label>
                                        <div className="flex gap-4">
                                            <label className="flex-1 flex flex-col items-center justify-center p-6 border-2 border-dashed border-zinc-100 rounded-sm hover:border-black cursor-pointer transition-colors bg-zinc-50 group">
                                                <input 
                                                    type="file" 
                                                    accept="image/*" 
                                                    className="hidden" 
                                                    onChange={(e) => {
                                                        const file = e.target.files?.[0];
                                                        if (file) {
                                                            const reader = new FileReader();
                                                            reader.onloadend = () => {
                                                                const base64 = reader.result as string;
                                                                setPreviewImage(base64);
                                                                setNewReview({ ...newReview, imageUrl: base64 });
                                                            };
                                                            reader.readAsDataURL(file);
                                                        }
                                                    }}
                                                />
                                                <Camera size={20} className="text-zinc-300 group-hover:text-black transition-colors mb-2" />
                                                <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400 group-hover:text-black">Upload Real Photo</span>
                                            </label>
                                            
                                            {previewImage && (
                                                <div className="w-24 h-24 relative rounded-sm overflow-hidden border border-zinc-100 shadow-sm">
                                                    <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                                                    <button 
                                                        type="button"
                                                        onClick={() => {
                                                            setPreviewImage(null);
                                                            setNewReview({ ...newReview, imageUrl: '' });
                                                        }}
                                                        className="absolute top-1 right-1 bg-black/50 text-white p-1 rounded-full hover:bg-black transition-colors"
                                                    >
                                                        <RotateCcw size={10} />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <button 
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full bg-black text-white py-5 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-zinc-800 transition-all shadow-xl flex items-center justify-center gap-3 disabled:opacity-50"
                                    >
                                        {isSubmitting ? 'Publishing...' : 'Publish Insight'}
                                        <Send size={14} />
                                    </button>
                                </form>
                            </div>
                        </div>

                        {/* Review List */}
                        <div className="lg:col-span-7 space-y-10">
                            {reviews.length === 0 ? (
                                <div className="py-20 text-center border-2 border-dashed border-zinc-100 rounded-sm">
                                    <MessageSquare size={32} className="mx-auto text-zinc-200 mb-4" />
                                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Be the first to share an insight</p>
                                </div>
                            ) : (
                                reviews.map((review, idx) => (
                                    <motion.div 
                                        key={review.id}
                                        initial={{ opacity: 0, x: 20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: idx * 0.1 }}
                                        className="group"
                                    >
                                        <div className="flex gap-6">
                                            <div className="flex-shrink-0">
                                                <div className="w-12 h-12 rounded-full bg-zinc-950 flex items-center justify-center text-white text-xs font-black border border-zinc-800 shadow-lg group-hover:scale-110 transition-transform">
                                                    {review.user?.username?.charAt(0) || 'U'}
                                                </div>
                                            </div>
                                            <div className="flex-1 space-y-3">
                                                <div className="flex justify-between items-center">
                                                    <div>
                                                        <h4 className="text-[11px] font-black text-black uppercase tracking-widest">{review.user?.username || 'Anonymous Collector'}</h4>
                                                        <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-widest">Verified Collector</span>
                                                    </div>
                                                    <div className="flex gap-0.5">
                                                        {[...Array(5)].map((_, i) => (
                                                            <Star 
                                                                key={i} 
                                                                size={10} 
                                                                className={`${i < review.rating ? 'fill-black' : 'text-zinc-100'} transition-colors`} 
                                                            />
                                                        ))}
                                                    </div>
                                                </div>
                                                <p className="text-[13px] text-zinc-600 leading-relaxed font-medium">
                                                    {review.comment}
                                                </p>
                                                {review.reviewImageUrl && (
                                                    <div className="mt-4 w-40 aspect-square rounded-sm overflow-hidden border border-zinc-50 shadow-sm hover:scale-105 transition-transform cursor-pointer">
                                                        <img src={review.reviewImageUrl} alt="Review evidence" className="w-full h-full object-cover" />
                                                    </div>
                                                )}
                                                <div className="flex items-center gap-4 pt-2">
                                                    <span className="text-[8px] font-black text-zinc-300 uppercase tracking-widest">
                                                        {new Date(review.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                                                    </span>
                                                    <div className="h-px flex-1 bg-zinc-50 group-hover:bg-zinc-100 transition-colors"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Additional Information Section (Footer Context) */}
                <div className="mt-24 pt-24 border-t border-zinc-100 grid grid-cols-1 md:grid-cols-3 gap-16">
                    <div>
                        <h4 className="flex items-center gap-3 text-xs font-black uppercase tracking-widest mb-6 text-black">
                            <Clock size={16} className="text-zinc-400" />
                            Boutique Heritage
                        </h4>
                        <p className="text-xs text-zinc-500 leading-relaxed uppercase tracking-widest font-bold">
                            Established in Colombo, Anix Boutique curated this timepiece personally, ensuring it meets the rigorous standards of our local horological heritage.
                        </p>
                    </div>
                    <div>
                        <h4 className="flex items-center gap-3 text-xs font-black uppercase tracking-widest mb-6 text-black">
                            <ShieldCheck size={16} className="text-zinc-400" />
                            Official Warranty
                        </h4>
                        <p className="text-xs text-zinc-500 leading-relaxed uppercase tracking-widest font-bold">
                            Every purchase comes with a 2-year international warranty, ensuring your timepiece remains in pristine condition for years to come.
                        </p>
                    </div>
                    <div>
                        <h4 className="flex items-center gap-3 text-xs font-black uppercase tracking-widest mb-6 text-black">
                            <Truck size={16} className="text-zinc-400" />
                            Bespoke Shipping
                        </h4>
                        <p className="text-xs text-zinc-500 leading-relaxed uppercase tracking-widest font-bold">
                            Complimentary shipping on all orders. Each watch is packed in our signature white-glove velvet box with secure temperature controls.
                        </p>
                    </div>
                </div>
            </main>

            <footer className="bg-white border-t border-zinc-100 py-12 mb-10 md:mb-0">
                <div className="container mx-auto px-6 text-center">
                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.5em]">ANIX OFFICIAL BOUTIQUE &copy; 2026</p>
                </div>
            </footer>

            <AnimatePresence>
                {show360 && (
                    <ThreeSixtyViewer 
                        images={imageUrls} 
                        onClose={() => setShow360(false)} 
                    />
                )}
                {showAR && (
                    <VirtualTryOn 
                        product={product} 
                        onClose={() => setShowAR(false)} 
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default ProductDetails;
