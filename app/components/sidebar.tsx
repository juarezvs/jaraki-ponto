'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Users, GraduationCap, BookOpen, Calendar, 
  BarChart3, Settings, ChevronLeft, ChevronRight, Lock, Unlock, Clock,
  ClockIcon
} from 'lucide-react';

export function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState<boolean>(true);
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [isHoveringBtn, setIsHoveringBtn] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const savedSidebarState = localStorage.getItem('orbund-sidebar-collapsed');
    const savedSidebarLock = localStorage.getItem('orbund-sidebar-locked');
    if (savedSidebarState !== null) setIsCollapsed(savedSidebarState === 'true');
    if (savedSidebarLock !== null) setIsLocked(savedSidebarLock === 'true');
    setIsMounted(true);
  }, []);

  const handleToggleLockClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextLock = !isLocked;
    const nextCollapse = isLocked ? true : isCollapsed;

    setIsLocked(nextLock);
    setIsCollapsed(nextCollapse);
    localStorage.setItem('orbund-sidebar-collapsed', String(nextCollapse));
    localStorage.setItem('orbund-sidebar-locked', String(nextLock));
  };

  const handleSidebarMouseEnter = () => {
    if (!isLocked) setIsCollapsed(false);
  };

  const handleSidebarMouseLeave = () => {
    if (!isLocked) setIsCollapsed(true);
  };

  const renderButtonIcon = () => {
    if (isLocked) return <Lock className="h-4 w-4 text-primary" />;
    if (isHoveringBtn) return <Unlock className="h-4 w-4 text-amber-500" />;
    return isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />;
  };

  if (!isMounted) return <div className="w-20 bg-sidebar-bg h-screen hidden md:block border-r border-sidebar-border" />;

  const menuItems = [
    { name: 'Dashboard', href: '/', icon: <BarChart3 className="h-5 w-5 shrink-0" /> },
    { name: 'Espelho de Ponto', href: '/ponto', icon: <Clock className="h-5 w-5 shrink-0" /> },
    { name: 'Servidores', href: '/servidor', icon: <Users className="h-5 w-5 shrink-0" /> },
    { name: 'Solicitações', href: '/solicitacoes', icon: <BookOpen className="h-5 w-5 shrink-0" /> },
    { name: 'Banco de horas', href: '/banco-de-horas', icon: <BookOpen className="h-5 w-5 shrink-0" /> },
    { name: 'Lançamento Banco de horas', href: '/chefia/banco-de-horas', icon: <BookOpen className="h-5 w-5 shrink-0" /> },
  ];

  return (
    <div onMouseEnter={handleSidebarMouseEnter} onMouseLeave={handleSidebarMouseLeave} className="relative z-20 h-screen top-0 shrink-0">
      <aside className={`bg-sidebar-bg text-slate-200 h-full flex flex-col justify-between md:flex border-r border-sidebar-border transition-all duration-300 ease-in-out ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}>
        <div>
          <div className="p-5 flex items-center gap-3 border-b border-sidebar-border/40 h-16 min-h-16">
            <ClockIcon className="h-8 w-8 text-primary shrink-0" />
            {!isCollapsed && (
              <div className="whitespace-nowrap">
                <h1 className="text-base font-bold text-white">PONTO</h1>
                <p className="text-[10px] text-primary/80 uppercase font-bold tracking-wider">Servidor</p>
              </div>
            )}
          </div>

          <nav className="p-4 space-y-1 overflow-hidden">
            {menuItems.map((item, idx) => {
              const isActive = pathname === item.href;
              return (
                <Link 
                  key={idx} 
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                    isActive ? 'bg-primary text-white shadow-sm' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  {item.icon}
                  {!isCollapsed && <span className="whitespace-nowrap">{item.name}</span>}
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>

      <button
        onClick={handleToggleLockClick}
        onMouseEnter={(e) => { e.stopPropagation(); setIsHoveringBtn(true); }}
        onMouseLeave={(e) => { e.stopPropagation(); setIsHoveringBtn(false); }}
        className={`absolute -right-4 top-8 bg-card text-muted rounded-full h-8 w-8 flex items-center justify-center shadow-lg cursor-pointer transition-all duration-200 z-30 border ${
          isLocked ? 'border-primary ring-4 ring-primary/10 text-primary scale-105' : 'border-card-border hover:border-2 hover:border-primary hover:text-primary hover:scale-110'
        }`}
      >
        {renderButtonIcon()}
      </button>
    </div>
  );
}