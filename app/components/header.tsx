'use client';
import ThemeToggle from './theme-toggle';
import { FiSearch, FiBell } from 'react-icons/fi';

export default function Header() {
  return (
    <header className="h-16 border-b border-card-border bg-card px-6 flex items-center justify-between transition-colors duration-300 shrink-0">
      <div className="relative w-full max-w-md hidden sm:block">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted w-4 h-4" />
        <input
          type="text"
          placeholder="Buscar lotação ou servidor JFAM..."
          className="w-full pl-10 pr-4 py-2 bg-background border border-card-border rounded-lg text-sm text-foreground placeholder-muted focus:outline-none focus:border-primary transition-colors"
        />
      </div>

      <div className="flex items-center gap-4 ml-auto">
        <ThemeToggle />
        
        <button className="p-2 text-muted hover:text-foreground rounded-lg transition-colors relative">
          <FiBell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-primary" />
        </button>

        <div className="h-8 w-px bg-card-border" />
        
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
            <span className="text-xs font-bold text-primary">AM</span>
          </div>
          <div className="hidden md:block text-left">
            <p className="text-xs font-bold text-foreground leading-none">Seção Judiciária</p>
            <p className="text-[10px] text-muted leading-none mt-0.5">Amazonas (JFAM)</p>
          </div>
        </div>
      </div>
    </header>
  );
}