"use client";

import React, { useState, useRef, useEffect } from 'react';
import { RotateCcw, MoveHorizontal, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ThreeSixtyViewerProps {
  images: string[];
  onClose: () => void;
}

const ThreeSixtyViewer = ({ images, onClose }: ThreeSixtyViewerProps) => {
  const [index, setIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Filter out empty images
  const validImages = images.filter(img => img.trim() !== '');

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.pageX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || validImages.length < 2) return;
    
    const deltaX = e.pageX - startX;
    const sensitivity = 15; // Pixels to move to next image
    
    if (Math.abs(deltaX) > sensitivity) {
      if (deltaX > 0) {
        setIndex((prev) => (prev + 1) % validImages.length);
      } else {
        setIndex((prev) => (prev - 1 + validImages.length) % validImages.length);
      }
      setStartX(e.pageX);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch support
  const handleTouchMove = (e: React.TouchEvent) => {
    if (validImages.length < 2) return;
    const touch = e.touches[0];
    const deltaX = touch.pageX - startX;
    const sensitivity = 10;
    
    if (Math.abs(deltaX) > sensitivity) {
      if (deltaX > 0) {
        setIndex((prev) => (prev + 1) % validImages.length);
      } else {
        setIndex((prev) => (prev - 1 + validImages.length) % validImages.length);
      }
      setStartX(touch.pageX);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-2xl flex flex-col items-center justify-center p-6"
    >
      <button 
        onClick={onClose}
        className="absolute top-8 right-8 text-white/40 hover:text-white transition-colors"
      >
        <X size={32} strokeWidth={1} />
      </button>

      <div className="text-center mb-12">
        <h2 className="text-white text-2xl font-black tracking-tighter uppercase italic mb-2">360° Interactive View</h2>
        <div className="flex items-center justify-center gap-4 text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500">
          <MoveHorizontal size={14} />
          Drag to Rotate Timepiece
          <span className="text-zinc-800">|</span>
          {validImages.length} Dynamic Angles
        </div>
      </div>

      <div 
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={(e) => setStartX(e.touches[0].pageX)}
        onTouchMove={handleTouchMove}
        className="relative w-full max-w-2xl aspect-square cursor-grab active:cursor-grabbing group"
      >
        <AnimatePresence mode="wait">
          <motion.img 
            key={index}
            initial={{ opacity: 0.8 }}
            animate={{ opacity: 1 }}
            src={validImages[index]} 
            alt="360 View"
            className="w-full h-full object-contain pointer-events-none select-none"
          />
        </AnimatePresence>
        
        {/* Progress Indicator */}
        <div className="absolute bottom-[-40px] left-1/2 -translate-x-1/2 flex gap-1.5">
           {validImages.map((_, i) => (
             <div 
               key={i} 
               className={`h-1 transition-all duration-500 ${i === index ? 'w-8 bg-white' : 'w-2 bg-white/10'}`} 
             />
           ))}
        </div>
      </div>

      <div className="mt-24 text-white/20">
         <RotateCcw size={40} className="animate-spin-slow" />
      </div>
    </motion.div>
  );
};

export default ThreeSixtyViewer;
