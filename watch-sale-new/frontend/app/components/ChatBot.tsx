"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, User, Bot, Sparkles } from 'lucide-react';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ role: 'user' | 'bot', content: string }[]>([
    { role: 'bot', content: "Welcome to Anix Boutique. I am your personal horological expert. How may I assist you in finding your next masterpiece today?" }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Smart Horological Response System (Local AI)
  const getSmartResponse = (query: string): string => {
    const text = query.toLowerCase();
    
    // Greetings
    if (text.match(/\b(hi|hello|hey|good morning|good evening)\b/)) {
      return "Greetings, sir/madam. It is a pleasure to welcome you to Anix Boutique. How may I assist you with our collection today?";
    }

    // Brands
    if (text.includes('casio')) {
      return "Casio is renowned for blending legendary durability with modern style. Our Casio-Oak and G-Shock series are particularly popular among those who value both form and function. Shall I show you our latest Casio arrivals?";
    }
    if (text.includes('rolex') || text.includes('luxury') || text.includes('expensive')) {
      return "At Anix Boutique, we curate only the finest timepieces. While certain brands represent the pinnacle of luxury, every watch in our collection is chosen for its exceptional craftsmanship and heritage.";
    }

    // Movements
    if (text.includes('automatic') || text.includes('mechanical')) {
      return "An automatic timepiece is a true masterpiece of engineering. It captures the energy of your movement to power itself, eliminating the need for a battery. It's the preferred choice for horological purists.";
    }
    if (text.includes('battery') || text.includes('quartz')) {
      return "Quartz movements offer unrivaled precision and reliability with minimal maintenance. Many of our premium pieces use high-end quartz resonators for absolute accuracy.";
    }

    // Materials
    if (text.includes('glass') || text.includes('scratch') || text.includes('sapphire')) {
      return "Most of our premium watches feature Sapphire Crystal, which is second only to diamond in hardness, ensuring your timepiece remains scratch-free and clear forever.";
    }

    // Prices / Shipping
    if (text.includes('sri lanka') || text.includes('popular') || text.includes('best brand')) {
      return "In Sri Lanka, Casio is exceptionally popular for its reliability. Brands like Seiko and Citizen also have a strong following. At Anix Boutique, we find our customers particularly love the 'Casio-Oak' models for their iconic style.";
    }

    if (text.includes('location') || text.includes('address') || text.includes('where') || text.includes('store') || text.includes('contact') || text.includes('phone')) {
      return "Anix Boutique is primarily an online destination for luxury timepieces with home delivery. You can reach our experts via WhatsApp at +94 76 238 8479 for personalized service.";
    }

    if (text.includes('price') || text.includes('cost') || text.includes('how much')) {
      return "Our collection ranges from accessible masterworks to exclusive high-end timepieces. You can view the specific price for each item on its detail page. We also offer insured island-wide delivery.";
    }

    // Warranty
    if (text.includes('warranty') || text.includes('guarantee')) {
      return "Every watch from Anix Boutique comes with an official international warranty, ranging from 12 to 24 months, ensuring your investment is perfectly protected.";
    }

    // Default expert response
    return "That is an excellent horological question. As a specialist at Anix Boutique, I recommend exploring our full collection online or visiting our boutique for a personalized consultation with our experts.";
  };

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const botResponse = getSmartResponse(userMessage);
      setMessages(prev => [...prev, { role: 'bot', content: botResponse }]);
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="fixed bottom-28 right-8 z-[100] flex flex-col items-end">
      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="mb-4 w-[350px] md:w-[400px] h-[500px] bg-white rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] border border-zinc-100 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-zinc-950 p-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                  <Sparkles size={16} className="text-zinc-400" />
                </div>
                <div>
                  <h3 className="text-[11px] font-black uppercase tracking-[0.2em] leading-tight text-white">Anix Boutique Expert</h3>
                  <p className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest mt-0.5">Always Online</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-white/10 rounded-full transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-zinc-50/50">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex gap-2 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center mt-1 ${msg.role === 'user' ? 'bg-zinc-200' : 'bg-black text-white'}`}>
                      {msg.role === 'user' ? <User size={12} /> : <Bot size={12} />}
                    </div>
                    <div className={`p-3 rounded-2xl text-[12px] leading-relaxed ${
                      msg.role === 'user' 
                        ? 'bg-black text-white rounded-tr-none' 
                        : 'bg-white border border-zinc-100 text-zinc-800 shadow-sm rounded-tl-none font-medium'
                    }`}>
                      {msg.content}
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex gap-2 items-center">
                    <div className="w-6 h-6 rounded-full bg-black flex items-center justify-center">
                      <Bot size={12} className="text-white" />
                    </div>
                    <div className="flex gap-1">
                      <span className="w-1.5 h-1.5 bg-zinc-300 rounded-full animate-bounce"></span>
                      <span className="w-1.5 h-1.5 bg-zinc-300 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                      <span className="w-1.5 h-1.5 bg-zinc-300 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-zinc-100 bg-white">
              <div className="relative">
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Ask about brands, movements, glass etc..."
                  className="w-full pl-4 pr-12 py-3 bg-zinc-100 rounded-full text-[12px] focus:outline-none focus:ring-1 focus:ring-zinc-300 transition-all font-medium"
                />
                <button 
                  onClick={handleSendMessage}
                  disabled={isLoading || !input.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-zinc-950 text-white flex items-center justify-center disabled:opacity-50 hover:bg-black transition-all"
                >
                  <Send size={14} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full shadow-2xl flex items-center justify-center text-white transition-all duration-300 ${isOpen ? 'bg-zinc-800' : 'bg-[#4F46E5]'}`}
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
        {!isOpen && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-zinc-400 border-2 border-white rounded-full animate-pulse"></span>
        )}
      </motion.button>
    </div>
  );
};

export default ChatBot;
