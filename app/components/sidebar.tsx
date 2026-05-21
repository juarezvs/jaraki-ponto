'use client';
import { useState, useEffect } from 'react';
import { FiLock, FiUnlock, FiChevronRight, FiFolder, FiUsers, FiLayers } from 'react-icons/fi';
import Link from 'next/link';

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isLocked, setIsLocked] = useState(false);
  const [isHoveringButton, setIsHoveringButton] = useState(false);

  useEffect(() => {
    const savedCollapsed = localStorage.getItem('orbund-sidebar-collapsed');
    const savedLocked = localStorage.getItem('orbund-sidebar-locked');
    if (savedCollapsed) setIsCollapsed(savedCollapsed === 'true');
    if (savedLocked) setIsLocked(savedLocked === 'true');
  }, []);

  const updateStates = (collapsed: boolean, locked: boolean) => {
    setIsCollapsed(collapsed);
    setIsLocked(locked);
    localStorage.setItem('orbund-sidebar-collapsed', String(collapsed));
    localStorage.setItem('orbund-sidebar-locked', String(locked));
  };

  const handleSidebarMouseEnter = () => {
    if (!isLocked) setIsCollapsed(false);
  };

  const handleSidebarMouseLeave = () => {
    if (!isLocked) setIsCollapsed(true);
  };

  const handleButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isCollapsed) {
      updateStates(false, true);
    } else {
      if (isLocked) {
        updateStates(true, false);
      } else {
        updateStates(false, true);
      }
    }
  };

  return (
    <div 
      onMouseEnter={handleSidebarMouseEnter}
      onMouseLeave={handleSidebarMouseLeave}
      className={`relative h-screen bg-card border-r border-card-border transition-all duration-300 flex flex-col z-20 ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* AREA DE LOGO */}
      <div className="p-4 border-b border-card-border flex items-center gap-3 overflow-hidden h-16 shrink-0">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
          <span className="text-white font-bold text-sm">JP</span>
        </div>
        {!isCollapsed && (
          <span className="font-bold text-lg text-foreground tracking-tight whitespace-nowrap">
            JARAKI-PONTO
          </span>
        )}
      </div>

      {/* LINKS DE NAVEGAÇÃO CORPORATIVA */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        <div className="text-[10px] font-bold uppercase tracking-wider text-muted px-3 py-2 h-8">
          {!isCollapsed ? 'Fase 1: Fundação' : '•'}
        </div>
        <Link href="/" className="flex items-center gap-3 p-3 rounded-lg text-foreground hover:bg-background/80 transition-colors">
          <FiLayers className="w-5 h-5 text-primary shrink-0" />
          {!isCollapsed && <span className="text-sm font-medium whitespace-nowrap">Visão Geral</span>}
        </Link>
        <Link href="#" className="flex items-center gap-3 p-3 rounded-lg text-foreground hover:bg-background/80 transition-colors">
          <FiFolder className="w-5 h-5 text-primary shrink-0" />
          {!isCollapsed && <span className="text-sm font-medium whitespace-nowrap">Lotações (Varas/Núcleos)</span>}
        </Link>
        <Link href="#" className="flex items-center gap-3 p-3 rounded-lg text-foreground hover:bg-background/80 transition-colors">
          <FiUsers className="w-5 h-5 text-primary shrink-0" />
          {!isCollapsed && <span className="text-sm font-medium whitespace-nowrap">Servidores Ativos</span>}
        </Link>
      </nav>

      {/* BOTÃO DA DIVISÓRIA ISOLADO */}
      <button
        onClick={handleButtonClick}
        onMouseEnter={(e) => { e.stopPropagation(); setIsHoveringButton(true); }}
        onMouseLeave={() => setIsHoveringButton(false)}
        className={`absolute right-[-14px] top-20 w-7 h-7 rounded-full bg-card border border-card-border flex items-center justify-center shadow-sm pointer-events-auto transition-all duration-200 cursor-pointer hover:scale-105 hover:border-2 hover:border-primary ${
          isLocked && !isCollapsed ? 'ring-2 ring-primary/40' : ''
        }`}
      >
        {isCollapsed ? (
          isHoveringButton ? <FiUnlock className="w-4 h-4 text-primary" /> : <FiChevronRight className="w-4 h-4 text-muted" />
        ) : (
          isLocked ? <FiLock className="w-4 h-4 text-primary" /> : <FiUnlock className="w-4 h-4 text-muted" />
        )}
      </button>
    </div>
  );
}