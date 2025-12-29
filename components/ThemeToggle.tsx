'use client';

import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/lib/contexts/ThemeContext';

export function ThemeToggle() {
  const { theme, toggleTheme, mounted } = useTheme();

  if (!mounted) {
    return (
      <div className="w-10 h-10 rounded-lg bg-slate-200 dark:bg-slate-700/50 animate-pulse" />
    );
  }

  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleTheme();
      }}
      className={`p-2.5 rounded-lg transition-all duration-200 cursor-pointer flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 ${
        theme === 'dark'
          ? 'bg-slate-700/50 hover:bg-slate-700/70 focus:ring-purple-500 focus:ring-offset-slate-800'
          : 'bg-white hover:bg-[#E6D5F7]/30 focus:ring-[#E6D5F7] focus:ring-offset-white border-2 border-black/20 hover:border-[#E6D5F7] shadow-sm'
      }`}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      {isDark ? (
        <Sun className="w-5 h-5 text-yellow-400" />
      ) : (
        <Moon className="w-5 h-5 text-black/70" />
      )}
    </button>
  );
}
