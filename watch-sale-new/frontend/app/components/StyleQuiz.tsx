"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, ChevronRight, LayoutGrid, Sparkles, BrainCircuit } from 'lucide-react';
import { fetchProducts } from '@/lib/api';
import Link from 'next/link';

const StyleQuiz = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState({
    occasion: '',
    style: '',
    budget: ''
  });
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const steps = [
    {
      id: 1,
      title: "The Occasion",
      subtitle: "Where will you wear this timepiece?",
      options: [
        { label: "Everyday Casual", value: "casual", desc: "Reliable & versatile for daily life" },
        { label: "Executive / Business", value: "business", desc: "Command respect in meetings" },
        { label: "Gala / Formal Events", value: "formal", desc: "Timeless elegance for celebrations" },
        { label: "Active / Outdoors", value: "sport", desc: "Durable & tech-infused performance" }
      ]
    },
    {
      id: 2,
      title: "The Aesthetic",
      subtitle: "Which style defines you best?",
      options: [
        { label: "Quiet Luxury / Minimal", value: "Minimalist", desc: "Sophistication in simplicity" },
        { label: "Bold & Statement", value: "Bold", desc: "Let your wrist start the conversation" },
        { label: "Heritage / Vintage", value: "Vintage", desc: "Classic designs with a story" },
        { label: "Futuristic / Smart", value: "Smart", desc: "The cutting edge of horology" }
      ]
    },
    {
      id: 3,
      title: "The Investment",
      subtitle: "Set your preferred price range",
      options: [
        { label: "LKR 0 - 50,000", value: "low", desc: "Accessible excellence" },
        { label: "LKR 50,000 - 150,000", value: "mid", desc: "Mid-tier craftsmanship" },
        { label: "LKR 150,000+", value: "high", desc: "Premium masterworks" }
      ]
    }
  ];

  const handleRecommend = async () => {
    setIsAnalyzing(true);
    const allProducts = await fetchProducts();
    
    // Scoring logic
    const matches = allProducts.map((p: any) => {
      let score = 0;
      
      // Budget matching
      if (answers.budget === "low" && p.price <= 50000) score += 50;
      else if (answers.budget === "mid" && p.price > 50000 && p.price <= 150000) score += 50;
      else if (answers.budget === "high" && p.price > 150000) score += 50;

      // Style matching (Movement/Description based)
      if (p.movementType?.toLowerCase().includes(answers.style.toLowerCase())) score += 30;
      if (p.description?.toLowerCase().includes(answers.style.toLowerCase())) score += 30;
      if (p.name?.toLowerCase().includes(answers.style.toLowerCase())) score += 20;

      // Occasion matching
      if (p.categoryType?.toLowerCase().includes(answers.occasion.toLowerCase())) score += 20;

      return { ...p, matchScore: score };
    }).sort((a: any, b: any) => b.matchScore - a.matchScore).slice(0, 3);

    setTimeout(() => {
      setRecommendations(matches);
      setIsAnalyzing(false);
      setStep(4);
    }, 2000);
  };

  const currentStepData = steps.find(s => s.id === step);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
          />
          
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-4xl bg-white overflow-hidden flex flex-col md:flex-row h-[90vh] md:h-[600px] shadow-2xl rounded-sm"
          >
            {/* Left Sidebar Info */}
            <div className="w-full md:w-72 bg-zinc-950 p-8 text-white flex flex-col">
              <Sparkles className="text-zinc-500 mb-6" />
              <h2 className="text-2xl font-black tracking-tighter uppercase mb-4 italic leading-tight">Watch Haven Personality Quiz</h2>
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest leading-relaxed">Let our AI curator guide you to your perfect timepiece based on your lifestyle.</p>
              
              <div className="mt-auto space-y-4">
                 {[1, 2, 3].map(s => (
                   <div key={s} className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black border transition-all ${step === s ? 'bg-white text-black border-white' : step > s ? 'bg-zinc-800 text-zinc-500 border-zinc-800' : 'border-zinc-800 text-zinc-800'}`}>
                         {step > s ? <Check size={10} /> : s}
                      </div>
                      <span className={`text-[10px] font-black uppercase tracking-widest ${step === s ? 'text-white' : 'text-zinc-700'}`}>
                         {s === 1 ? 'Occasion' : s === 2 ? 'Style' : 'Budget'}
                      </span>
                   </div>
                 ))}
              </div>
            </div>

            {/* Right Main Content */}
            <div className="flex-1 p-10 flex flex-col overflow-y-auto bg-zinc-50">
              <button 
                onClick={onClose}
                className="absolute top-6 right-6 text-zinc-300 hover:text-black transition-colors"
              >
                <X size={24} />
              </button>

              {step <= 3 && currentStepData && (
                <motion.div 
                  key={step}
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  className="flex flex-col h-full"
                >
                  <div className="mb-8">
                     <h3 className="text-xs font-black uppercase tracking-[0.4em] text-zinc-400 mb-2">Step {step} of 3</h3>
                     <h2 className="text-4xl font-black tracking-tighter uppercase italic">{currentStepData.title}</h2>
                     <p className="text-zinc-400 text-sm font-medium mt-1">{currentStepData.subtitle}</p>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    {currentStepData.options.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => {
                          const key = step === 1 ? 'occasion' : step === 2 ? 'style' : 'budget';
                          setAnswers({...answers, [key]: opt.value});
                          if (step < 3) setStep(step + 1);
                          else handleRecommend();
                        }}
                        className="group flex items-center justify-between p-6 bg-white border border-zinc-100 hover:border-black transition-all text-left shadow-sm hover:shadow-lg"
                      >
                         <div className="flex flex-col">
                            <span className="text-xs font-black uppercase tracking-widest mb-1 group-hover:text-black">{opt.label}</span>
                            <span className="text-[10px] text-zinc-400 font-bold italic">{opt.desc}</span>
                         </div>
                         <ChevronRight size={16} className="text-zinc-200 group-hover:text-black group-hover:translate-x-1 transition-all" />
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {isAnalyzing && (
                <div className="flex-1 flex flex-col items-center justify-center text-center">
                   <div className="relative w-20 h-20 mb-8">
                      <BrainCircuit size={80} className="text-zinc-200 animate-pulse" />
                      <div className="absolute inset-0 flex items-center justify-center">
                         <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      </div>
                   </div>
                   <h2 className="text-2xl font-black tracking-tighter uppercase italic mb-2">Analyzing Masterpieces...</h2>
                   <p className="text-[10px] text-zinc-400 font-black uppercase tracking-widest">Scanning technical specs and aesthetic profiles</p>
                </div>
              )}

              {step === 4 && !isAnalyzing && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col h-full"
                >
                  <div className="mb-10 text-center">
                     <Sparkles className="mx-auto text-indigo-500 mb-4" />
                     <h2 className="text-4xl font-black tracking-tighter uppercase italic">Curated Matches</h2>
                     <p className="text-[10px] text-zinc-400 font-black uppercase tracking-widest mt-2 underline decoration-indigo-500 underline-offset-4">Hand-selected for your lifestyle</p>
                  </div>

                  <div className="grid grid-cols-1 gap-6">
                    {recommendations.map((p, idx) => (
                      <Link 
                        key={p.id} 
                        href={`/product/${p.id}`}
                        onClick={onClose}
                        className="flex items-center gap-6 p-4 bg-white border border-zinc-100 rounded-sm hover:shadow-xl transition-all group"
                      >
                         <div className="w-24 h-24 bg-zinc-50 overflow-hidden flex-shrink-0">
                            <img src={p.imageUrl?.split('|')[0]} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                         </div>
                         <div className="flex-1 flex flex-col text-left">
                            <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">{p.brand}</span>
                            <h4 className="text-xs font-black uppercase tracking-widest mb-1">{p.name}</h4>
                            <span className="text-[11px] font-black">Rs. {p.price?.toLocaleString()}</span>
                         </div>
                         <div className="bg-indigo-600 text-white px-3 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest">
                            {idx === 0 ? 'Best Match' : 'Recommended'}
                         </div>
                      </Link>
                    ))}
                  </div>

                  <button 
                    onClick={() => { setStep(1); setRecommendations([]); }}
                    className="mt-8 text-[10px] font-black text-zinc-400 uppercase tracking-widest hover:text-black transition-colors"
                  >
                    Retake Quiz
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default StyleQuiz;
