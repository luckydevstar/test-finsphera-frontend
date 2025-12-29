'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  mounted: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const applyTheme = (newTheme: Theme) => {
  if (typeof document === 'undefined') return;
  
  const root = document.documentElement;
  root.classList.remove('dark', 'light');
  root.classList.add(newTheme);
  root.style.colorScheme = newTheme;
};

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    setMounted(true);
    const hasDark = document.documentElement.classList.contains('dark');
    const hasLight = document.documentElement.classList.contains('light');
    
    let initialTheme: Theme;
    if (hasDark) {
      initialTheme = 'dark';
    } else if (hasLight) {
      initialTheme = 'light';
    } else {
      const savedTheme = localStorage.getItem('theme') as Theme | null;
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
      applyTheme(initialTheme);
    }
    
    setTheme(initialTheme);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prevTheme) => {
      const newTheme: Theme = prevTheme === 'dark' ? 'light' : 'dark';
      if (typeof window !== 'undefined') {
        localStorage.setItem('theme', newTheme);
      }
      applyTheme(newTheme);
      return newTheme;
    });
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, mounted }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

