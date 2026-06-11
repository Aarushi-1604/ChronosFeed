'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type ThemeName = 'newspaper' | 'newspaper-dark';

interface ThemeContextType {
  theme: ThemeName;
  setTheme: (theme: any) => void;
  setThemeByEra: (era: string, prompt: string) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeName>('newspaper');

  // Load theme from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('chronos-theme') as ThemeName;
      if (savedTheme === 'newspaper' || savedTheme === 'newspaper-dark') {
        setThemeState(savedTheme);
      }
    }
  }, []);

  const setTheme = (newTheme: any) => {
    // Force newspaper theme variations only
    const resolvedTheme = newTheme === 'newspaper-dark' ? 'newspaper-dark' : 'newspaper';
    
    // In case theme unmount resets to 'default', keep current preference
    let targetTheme: ThemeName = resolvedTheme;
    if (newTheme === 'default' || newTheme === 'steam' || newTheme === 'roman' || newTheme === 'mars') {
      // Keep whatever is currently set, or default to localStorage preference
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('chronos-theme') as ThemeName;
        targetTheme = saved === 'newspaper-dark' ? 'newspaper-dark' : 'newspaper';
      } else {
        targetTheme = theme;
      }
    }

    setThemeState(targetTheme);
    if (typeof window !== 'undefined') {
      const root = document.documentElement;
      root.classList.remove('theme-steam', 'theme-roman', 'theme-mars', 'theme-default', 'theme-newspaper', 'theme-newspaper-dark');
      root.classList.add(`theme-${targetTheme}`);
      localStorage.setItem('chronos-theme', targetTheme);
    }
  };

  const setThemeByEra = (era: string, prompt: string) => {
    // Keep current newspaper selection regardless of era
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('chronos-theme') as ThemeName;
      setTheme(saved === 'newspaper-dark' ? 'newspaper-dark' : 'newspaper');
    } else {
      setTheme(theme);
    }
  };

  const toggleTheme = () => {
    const nextTheme = theme === 'newspaper' ? 'newspaper-dark' : 'newspaper';
    setTheme(nextTheme);
  };

  // Sync initial theme class on theme state change
  useEffect(() => {
    setTheme(theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, setThemeByEra, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

