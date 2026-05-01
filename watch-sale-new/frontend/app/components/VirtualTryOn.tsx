"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Camera, X, RotateCw, Maximize2, Minimize2, Move, Smartphone, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface VirtualTryOnProps {
  product: any;
  onClose: () => void;
}

const VirtualTryOn = ({ product, onClose }: VirtualTryOnProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState("");
  const [blendMode, setBlendMode] = useState(true);
  const [showInstructions, setShowInstructions] = useState(true);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setIsReady(true);
    } catch (err) {
      console.error("Camera access denied", err);
      setError("Please allow camera access to use the Virtual Try-On experience.");
    }
  };

  useEffect(() => {
    startCamera();
    return () => {
      stream?.getTracks().forEach(track => track.stop());
    };
  }, []);

  const handleDrag = (e: React.MouseEvent | React.TouchEvent) => {
    // Simple drag logic could go here, but using Framer Motion drag is easier
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 p-8 z-50 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent">
        <div className="flex items-center gap-4">
           <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
              <Smartphone className="text-white" size={20} />
           </div>
           <div>
              <h2 className="text-white text-lg font-black tracking-tighter uppercase italic">AR Boutique Experience</h2>
              <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">{blendMode ? "Studio Mode (Multiplying BG)" : "Natural Mode (Standard Display)"}</p>
           </div>
        </div>
        <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
          <X size={32} strokeWidth={1} />
        </button>
      </div>

      {/* Instructions Overlay */}
      <AnimatePresence>
        {showInstructions && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-6 text-center"
            onClick={() => setShowInstructions(false)}
          >
             <div className="max-w-xs space-y-8">
                <div className="w-16 h-16 border-2 border-white/20 rounded-full mx-auto flex items-center justify-center animate-bounce">
                   <Move className="text-white" />
                </div>
                <div>
                   <h3 className="text-white text-xl font-black uppercase tracking-tight mb-4 italic">How to Try-On</h3>
                   <ul className="text-white/70 text-[10px] font-bold uppercase tracking-widest space-y-4">
                      <li>1. Position your wrist in camera view</li>
                      <li>2. Drag the watch to place it on your wrist</li>
                      <li>3. Use scale buttons for perfect sizing</li>
                   </ul>
                </div>
                <button className="bg-white text-black px-8 py-3 text-[10px] font-black uppercase tracking-widest rounded-full shadow-2xl">
                   Begin Experience
                </button>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Camera Viewport */}
      <div className="relative w-full h-full bg-zinc-900 flex items-center justify-center">
        {error ? (
          <div className="p-8 text-center">
             <Camera size={48} className="mx-auto text-zinc-700 mb-6" />
             <p className="text-white text-xs font-black uppercase tracking-widest leading-loose">{error}</p>
          </div>
        ) : (
          <>
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              className="w-full h-full object-cover grayscale-[0.2] contrast-[1.1]"
            />
            
            {/* The Magic Watch Overlay */}
            <AnimatePresence>
              {isReady && (
                <motion.div
                  drag
                  dragMomentum={false}
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: scale, opacity: 1, rotate: rotation }}
                  className="absolute z-40 cursor-move"
                  style={{ touchAction: 'none' }}
                >
                  <div className="relative group">
                    <img 
                      src={product.imageUrl?.split('|')[0]} 
                      alt="AR Watch"
                      className={`w-64 h-64 object-contain shadow-2xl pointer-events-none transition-all duration-500 ${blendMode ? 'mix-blend-multiply' : ''}`}
                    />
                    <div className="absolute inset-0 border-2 border-white/10 group-active:border-white/20 rounded-full transition-all" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Scanning Effect */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
               <div className="w-full h-[2px] bg-white/10 absolute top-0 animate-scan" />
            </div>
          </>
        )}
      </div>

      {/* Controls Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-10 z-50 bg-gradient-to-t from-black/80 to-transparent flex flex-col items-center gap-8">
        <div className="flex items-center gap-6">
           <div className="flex items-center gap-6 bg-white/10 backdrop-blur-xl px-10 py-6 rounded-full border border-white/10 shadow-2xl">
              <button 
                onClick={() => setScale(s => Math.max(0.2, s - 0.1))}
                className="text-white/60 hover:text-white transition-colors"
              >
                 <Minimize2 size={24} />
              </button>
              <div className="w-px h-8 bg-white/10"></div>
              <button 
                onClick={() => setRotation(r => r + 15)}
                className="text-white/60 hover:text-white transition-colors"
              >
                 <RotateCw size={24} />
              </button>
              <div className="w-px h-8 bg-white/10"></div>
              <button 
                onClick={() => setScale(s => Math.min(3, s + 0.1))}
                className="text-white/60 hover:text-white transition-colors"
              >
                 <Maximize2 size={24} />
              </button>
           </div>

           <button 
              onClick={() => setBlendMode(!blendMode)}
              className={`p-6 rounded-full border transition-all ${blendMode ? 'bg-indigo-600 border-indigo-500 text-white shadow-[0_0_20px_rgba(79,70,229,0.5)]' : 'bg-white/10 border-white/10 text-white/40'}`}
              title="Toggle Studio Mode"
           >
              <Sparkles size={24} />
           </button>
        </div>
        
        <p className="text-[9px] text-white/30 font-black uppercase tracking-[0.4em] flex items-center gap-3">
           <Move size={12} /> Drag watch over your wrist to try-on
        </p>
      </div>

      <style jsx>{`
        @keyframes scan {
          0% { top: 0%; opacity: 0; }
          50% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        .animate-scan {
          animation: scan 4s linear infinite;
        }
      `}</style>
    </motion.div>
  );
};

export default VirtualTryOn;
