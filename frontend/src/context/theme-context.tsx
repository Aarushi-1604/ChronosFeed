'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type ThemeName = 'default' | 'steam' | 'roman' | 'mars' | 'newspaper' | 'newspaper-dark';

interface ThemeContextType {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
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
      if (savedTheme) {
        setThemeState(savedTheme);
      }
    }
  }, []);

  const setTheme = (newTheme: ThemeName) => {
    setThemeState(newTheme);
    if (typeof window !== 'undefined') {
      const root = document.documentElement;
      root.classList.remove('theme-steam', 'theme-roman', 'theme-mars', 'theme-newspaper', 'theme-newspaper-dark');
      if (newTheme !== 'default') {
        root.classList.add(`theme-${newTheme}`);
      }
      localStorage.setItem('chronos-theme', newTheme);
    }
  };

  const setThemeByEra = (era: string, prompt: string) => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('chronos-theme') as ThemeName;
      setTheme(saved || theme);
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

