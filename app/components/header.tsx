'use client';

import React from 'react';
import { Search, Bell } from 'lucide-react';
import { ThemeToggle } from './theme-toggle';

export function Header() {
  return (
    <header className="h-16 bg-card border-b border-card-border px-6 flex items-center justify-between gap-4 sticky top-0 z-10 shadow-sm transition-colors duration-300">
      <div className="relative max-w-md w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
        <input 
          type="text" 
          placeholder="Buscar no sistema..." 
          className="w-full pl-10 pr-4 py-2 bg-background border border-card-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
        />
      </div>

      <div className="flex items-center gap-4">
        <ThemeToggle />
        <div className="h-8 w-px bg-card-border"></div>
        <button className="relative p-2 text-muted hover:bg-muted-light rounded-full transition-all cursor-pointer">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 bg-rose-500 rounded-full ring-2 ring-card"></span>
        </button>
        <div className="h-8 w-px bg-card-border hidden sm:block"></div>
        <div className="text-right hidden sm:block">
          <p className="text-[10px] font-bold text-muted uppercase tracking-wider">Mês Referência</p>
          <p className="text-sm font-bold text-primary">2026/5 — Maio</p>
        </div>
      </div>
    </header>
  );
}