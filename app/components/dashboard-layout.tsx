'use client';
import { ThemeProvider } from './theme-provider';
import Header from './header';
import Sidebar from './sidebar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <div className="flex h-screen w-screen overflow-hidden bg-background text-foreground transition-colors duration-300">
        <Sidebar />
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto p-6 bg-background transition-colors duration-300">
            {children}
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
}