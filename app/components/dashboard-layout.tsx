'use client';

import React from 'react';
import { ThemeProvider } from './theme-provider';
import { Sidebar } from './sidebar';
import { Header } from './header';

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <div className="flex min-h-screen overflow-x-hidden bg-background text-foreground">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <Header />
          <main className="flex-1">
            {children}
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
}