/**
 * THEME CONTEXT - Zarządzanie motywem jasnym/ciemnym
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Theme } from '@/lib/theme';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Sprawdź localStorage lub ustaw domyślnie 'dark-blue'
  const [theme, setThemeState] = useState<Theme>(() => {
    const saved = localStorage.getItem('messu-theme') as Theme;
    return (saved === 'dark-purple' || saved === 'dark-cyan' || saved === 'dark-emerald' || saved === 'dark-blue' || saved === 'light') 
      ? saved 
      : 'dark-blue';
  });

  // Zapisz do localStorage i zastosuj do <html>
  useEffect(() => {
    localStorage.setItem('messu-theme', theme);
    
    // Dodaj klasę do <html> dla globalnych stylów
    const root = document.documentElement;
    root.classList.remove('light', 'dark', 'dark-purple', 'dark-cyan', 'dark-emerald', 'dark-blue');
    
    // Dodaj klasę bazową 'dark' dla wszystkich ciemnych motywów
    if (theme.startsWith('dark-')) {
      root.classList.add('dark');
    }
    root.classList.add(theme);
    
    // Ustaw data-theme attribute
    root.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    // Cykliczne przełączanie przez wszystkie motywy
    const themes: Theme[] = ['light', 'dark-purple', 'dark-cyan', 'dark-emerald', 'dark-blue'];
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setThemeState(themes[nextIndex]);
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
