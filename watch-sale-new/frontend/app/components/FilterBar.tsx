"use client";

import React, { useState } from 'react';
import { SlidersHorizontal, ChevronDown, X, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FilterBarProps {
  onFilterChange: (filters: any) => void;
  brands: string[];
  movements: string[];
}

const FilterBar = ({ onFilterChange, brands, movements }: FilterBarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    brand: '',
    movement: ''
  });

  const handleApply = () => {
    onFilterChange(filters);
    setIsOpen(false);
  };

  const handleReset = () => {
    const resetFilters = {
      minPrice: '',
      maxPrice: '',
      brand: '',
      movement: ''
    };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  return (
    <div className="relative z-40 mb-12">
      <div className="flex items-center justify-between border-b border-zinc-100 pb-6">
        <div className="flex items-center gap-6">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-3 bg-black text-white px-6 py-3 rounded-sm group hover:bg-zinc-800 transition-all"
            >
                <SlidersHorizontal size={14} />
                <span className="text-[10px] font-black uppercase tracking-widest">Filter & Sort</span>
            </button>
            <div className="hidden md:flex items-center gap-4">
                {filters.brand && (
                    <span className="bg-zinc-100 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-2">
                        {filters.brand} <X size={10} className="cursor-pointer" onClick={() => { setFilters({...filters, brand: ''}); onFilterChange({...filters, brand: ''}); }} />
                    </span>
                )}
                {filters.movement && (
                    <span className="bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-2">
                        {filters.movement} <X size={10} className="cursor-pointer" onClick={() => { setFilters({...filters, movement: ''}); onFilterChange({...filters, movement: ''}); }} />
                    </span>
                )}
            </div>
        </div>
        <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-zinc-400">
            Sort by: <span className="text-black cursor-pointer flex items-center gap-1">Featured <ChevronDown size={12} /></span>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            />
            <motion.div 
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              className="absolute top-20 left-0 w-full bg-white border border-zinc-100 p-8 shadow-2xl z-50 rounded-sm"
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                {/* Price Range */}
                <div className="space-y-6">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 border-b border-zinc-50 pb-2">Price Range (LKR)</h4>
                  <div className="flex items-center gap-4">
                    <input 
                      type="number"
                      placeholder="Min"
                      value={filters.minPrice}
                      onChange={(e) => setFilters({...filters, minPrice: e.target.value})}
                      className="w-full bg-zinc-50 border border-zinc-100 p-3 text-[10px] font-bold outline-none focus:border-black transition-all"
                    />
                    <span className="text-zinc-200">—</span>
                    <input 
                      type="number"
                      placeholder="Max"
                      value={filters.maxPrice}
                      onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
                      className="w-full bg-zinc-50 border border-zinc-100 p-3 text-[10px] font-bold outline-none focus:border-black transition-all"
                    />
                  </div>
                </div>

                {/* Brand Selection */}
                <div className="space-y-6">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 border-b border-zinc-50 pb-2">Luxury Brand</h4>
                  <select 
                    value={filters.brand}
                    onChange={(e) => setFilters({...filters, brand: e.target.value})}
                    className="w-full bg-zinc-50 border border-zinc-100 p-3 text-[10px] font-black uppercase tracking-widest outline-none focus:border-black appearance-none"
                  >
                    <option value="">All Brands</option>
                    {brands.map(brand => (
                      <option key={brand} value={brand}>{brand}</option>
                    ))}
                  </select>
                </div>

                {/* Movement Type */}
                <div className="space-y-6">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 border-b border-zinc-50 pb-2">Heart of Watch</h4>
                  <div className="flex flex-wrap gap-2">
                    {movements.map(m => (
                      <button
                        key={m}
                        onClick={() => setFilters({...filters, movement: filters.movement === m ? '' : m})}
                        className={`px-4 py-2 text-[9px] font-black uppercase tracking-widest border transition-all rounded-sm ${filters.movement === m ? 'bg-black text-white border-black' : 'bg-white text-zinc-400 border-zinc-100 hover:border-zinc-300'}`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col justify-end gap-3">
                  <button 
                    onClick={handleApply}
                    className="w-full bg-black text-white py-4 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-zinc-800 transition-all shadow-lg"
                  >
                    Apply Filters
                  </button>
                  <button 
                    onClick={handleReset}
                    className="w-full bg-white text-zinc-400 py-3 text-[10px] font-black uppercase tracking-[0.2em] hover:text-black flex items-center justify-center gap-2"
                  >
                    <RotateCcw size={12} />
                    Reset All
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FilterBar;
