'use client';
import { useTheme } from './theme-provider';
import { FiSun, FiMoon } from 'react-icons/fi';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative w-14 h-8 rounded-full bg-background border border-card-border p-1 transition-colors duration-300 flex items-center justify-between cursor-pointer"
      aria-label="Alternar tema"
    >
      <FiSun className="w-4 h-4 text-amber-500 ml-1" />
      <FiMoon className="w-4 h-4 text-slate-400 mr-1" />
      <div
        className={`absolute w-6 h-6 rounded-full bg-primary shadow-md transition-transform duration-300 flex items-center justify-center ${
          theme === 'dark' ? 'translate-x-6' : 'translate-x-0'
                }`}
      >
        {theme === 'dark' ? (
          <FiMoon className="w-3.5 h-3.5 text-white" />
        ) : (
          <FiSun className="w-3.5 h-3.5 text-white" />
        )}
      </div>
    </button>
  );
}