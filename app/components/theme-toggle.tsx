'use client';

import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from './theme-provider';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDarkMode = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      className="relative h-8 w-14 bg-muted-light dark:bg-slate-800 rounded-full p-1 transition-colors duration-300 focus:outline-none shadow-inner border border-card-border cursor-pointer"
      aria-label="Alternar tema de cores"
    >
      <div className={`absolute top-0.5 bottom-0.5 h-6 w-6 rounded-full bg-card shadow-sm flex items-center justify-center border border-card-border/50 transform transition-transform duration-300 ease-out ${
        isDarkMode ? 'translate-x-6' : 'translate-x-0'
      }`}>
        {isDarkMode ? (
          <Moon className="h-3.5 w-3.5 text-indigo-400 fill-indigo-400/10" />
        ) : (
          <Sun className="h-3.5 w-3.5 text-amber-500 fill-amber-500/10" />
        )}
      </div>
    </button>
  );
}