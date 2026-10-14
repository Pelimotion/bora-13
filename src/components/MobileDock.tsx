'use client';

import React from 'react';
import type { AppSection } from '@/lib/agenticOrchestrator';
import { playProceduralHaptic } from '@/lib/agenticOrchestrator';

interface MobileDockProps {
  currentSection: AppSection;
  onSelectSection: (section: AppSection) => void;
}

const DOCK_ITEMS: { id: AppSection; label: string; icon: string; badge?: string }[] = [
  { id: 'radar', label: 'Início', icon: '🇧🇷' },
  { id: 'territorio', label: 'Estado', icon: '🗺️' },
  { id: 'perfil', label: 'Quem', icon: '👥' },
  { id: 'simulador', label: 'Diálogo', icon: '💬' },
  { id: 'fatos', label: 'Fatos', icon: '💡' },
  { id: 'estudio', label: 'Zap', icon: '📲', badge: 'Novo' },
];

export default function MobileDock({ currentSection, onSelectSection }: MobileDockProps) {
  const handleItemClick = (sectionId: AppSection) => {
    playProceduralHaptic('click');
    onSelectSection(sectionId);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <nav className="md:hidden fixed bottom-3 left-3 right-3 z-50 bg-white/95 dark:bg-[#0F1729]/95 backdrop-blur-lg border border-slate-200/90 dark:border-slate-800/90 rounded-2xl shadow-2xl p-1.5 flex items-center justify-around transition-all">
      {DOCK_ITEMS.map((item) => {
        const isActive = currentSection === item.id;
        return (
          <button
            key={item.id}
            onClick={() => handleItemClick(item.id)}
            className={`flex-1 py-1 px-1 rounded-xl flex flex-col items-center justify-center transition-all relative ${
              isActive
                ? 'bg-red-50 dark:bg-red-950/40 text-[#C52229] dark:text-red-300 font-bold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <span className="text-lg leading-none mb-0.5">{item.icon}</span>
            <span className="text-[10px] leading-none font-bold">{item.label}</span>
            {item.badge && (
              <span className="absolute -top-1 -right-0.5 w-2 h-2 rounded-full bg-red-500 animate-ping" />
            )}
            {isActive && (
              <span className="w-1 h-1 rounded-full bg-[#C52229] mt-0.5" />
            )}
          </button>
        );
      })}
    </nav>
  );
}
