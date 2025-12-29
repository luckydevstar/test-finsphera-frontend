'use client';

import { motion } from 'framer-motion';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { useTheme } from '@/lib/contexts/ThemeContext';

interface ErrorStateProps {
  error: string;
  onRetry: () => void;
}

export function ErrorState({ error, onRetry }: ErrorStateProps) {
  const { theme } = useTheme();
  
  return (
    <div className={`min-h-screen flex items-center justify-center p-8 transition-colors duration-300 ${
      theme === 'dark' 
        ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900' 
        : 'bg-white'
    }`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`max-w-md w-full backdrop-blur-sm rounded-lg p-8 border text-center ${
          theme === 'dark' 
            ? 'bg-slate-800/50 border-red-500/50' 
            : 'bg-white border-black/20'
        }`}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
          className="inline-block mb-4"
        >
          <AlertCircle className={`w-16 h-16 ${
            theme === 'dark' ? 'text-red-400' : 'text-black'
          }`} />
        </motion.div>
        <h2 className={`text-2xl font-semibold mb-2 ${
          theme === 'dark' ? 'text-slate-200' : 'text-black'
        }`}>
          Something went wrong
        </h2>
        <p className={`mb-6 ${
          theme === 'dark' ? 'text-slate-400' : 'text-black/60'
        }`}>
          {error}
        </p>
        <button
          onClick={onRetry}
          className={`inline-flex items-center gap-2 px-6 py-3 font-semibold rounded-lg transition-colors ${
            theme === 'dark'
              ? 'bg-purple-600 hover:bg-purple-700 text-white'
              : 'bg-[#E6D5F7] hover:bg-[#E6D5F7]/80 text-black border border-black/10'
          }`}
        >
          <RefreshCw className="w-5 h-5" />
          Try Again
        </button>
      </motion.div>
    </div>
  );
}

