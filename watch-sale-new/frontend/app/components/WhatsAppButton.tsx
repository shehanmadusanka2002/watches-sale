'use client';

import React from 'react';
import { MessageCircle } from 'lucide-react';

const WhatsAppButton = () => {
  const phoneNumber = '+94762388479';
  const message = 'Hello NEXORA HUB! I would like to know more about your products.';
  
  const handleClick = () => {
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100] group">
      {/* Tooltip */}
      <div className="absolute bottom-full right-0 mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div className="bg-black text-white text-[10px] uppercase tracking-[2px] font-black py-2 px-4 whitespace-nowrap shadow-2xl border border-white/10">
          Chat with us
        </div>
      </div>

      {/* Button */}
      <button
        onClick={handleClick}
        className="bg-[#25D366] hover:bg-[#128C7E] text-white p-4 rounded-full shadow-[0_10px_30px_rgba(37,211,102,0.4)] transition-all duration-300 hover:scale-110 active:scale-95 flex items-center justify-center relative overflow-hidden"
      >
        <MessageCircle size={28} fill="currentColor" />
        
        {/* Ripple effect animation */}
        <span className="absolute inset-0 rounded-full border-4 border-white/20 animate-ping opacity-75"></span>
      </button>
    </div>
  );
};

export default WhatsAppButton;
