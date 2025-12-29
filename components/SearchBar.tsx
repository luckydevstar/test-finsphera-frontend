'use client';

import { Search } from 'lucide-react';
import { motion } from 'framer-motion';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchBar({ value, onChange, placeholder = 'Search...' }: SearchBarProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative"
    >
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 
                         text-black/50 dark:text-slate-400 w-5 h-5" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-2.5 
                   bg-white dark:bg-slate-700/50 
                   border-2 border-black/20 dark:border-slate-600/50 
                   rounded-lg 
                   text-black dark:text-slate-200 
                   placeholder-black/50 dark:placeholder-slate-400 
                   focus:outline-none focus:ring-2 
                   focus:ring-[#E6D5F7] dark:focus:ring-purple-500 
                   focus:border-[#E6D5F7] dark:focus:border-purple-500/50
                   transition-all shadow-sm dark:shadow-none
                   hover:border-black/30 dark:hover:border-slate-500/50"
      />
    </motion.div>
  );
}

