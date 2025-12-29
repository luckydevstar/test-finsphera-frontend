'use client';

import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { useTheme } from '@/lib/contexts/ThemeContext';

export function LoadingState() {
  const { theme } = useTheme();
  
  return (
    <div className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${
      theme === 'dark' 
        ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900' 
        : 'bg-white'
    }`}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="inline-block mb-4"
        >
          <Loader2 className={`w-12 h-12 ${
            theme === 'dark' ? 'text-purple-400' : 'text-[#E6D5F7]'
          }`} />
        </motion.div>
        <h2 className={`text-xl font-semibold mb-2 ${
          theme === 'dark' ? 'text-slate-200' : 'text-black'
        }`}>
          Loading Market Data
        </h2>
        <p className={theme === 'dark' ? 'text-slate-400' : 'text-black/60'}>
          Fetching cryptocurrency prices...
        </p>
      </motion.div>
    </div>
  );
}

