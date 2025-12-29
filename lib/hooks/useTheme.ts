'use client';

import { useState, useEffect, useCallback } from 'react';

type Theme = 'light' | 'dark';

const applyTheme = (newTheme: Theme) => {
  if (typeof document === 'undefined') return;
  
  const root = document.documentElement;
  // Remove both classes first
  root.classList.remove('dark', 'light');
  // Add the new theme class
  root.classList.add(newTheme);
  
  // Force a reflow to ensure the change is applied
  root.style.colorScheme = newTheme;
};

export function useTheme() {
  const [theme, setTheme] = useState<Theme>('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    setMounted(true);
    // Check if theme class is already on document (from script)
    const hasDark = document.documentElement.classList.contains('dark');
    const hasLight = document.documentElement.classList.contains('light');
    
    let initialTheme: Theme;
    if (hasDark) {
      initialTheme = 'dark';
    } else if (hasLight) {
      initialTheme = 'light';
    } else {
      // Fallback to localStorage or system preference
      const savedTheme = localStorage.getItem('theme') as Theme | null;
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
      applyTheme(initialTheme);
    }
    
    setTheme(initialTheme);
  }, []);

  const toggleTheme = useCallback(() => {
    const newTheme: Theme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', newTheme);
    }
    applyTheme(newTheme);
  }, [theme]);

  return { theme, toggleTheme, mounted };
}

