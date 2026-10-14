'use client';

import React from 'react';
import {
  type AppSection,
  type CanonicalAppSection,
  normalizeAppSection,
  playProceduralHaptic,
} from '@/lib/agenticOrchestrator';
import {
  IconHome,
  IconPrepare,
  IconDojo,
  IconExplore,
  IconStudio,
} from '@/components/icons/CasaIcons';

interface MobileDockProps {
  currentSection: AppSection;
  onSelectSection: (section: AppSection) => void;
}

const DOCK_ITEMS: {
  id: CanonicalAppSection;
  label: string;
  icon: (active: boolean) => React.ReactNode;
  badge?: boolean;
}[] = [
  {
    id: 'inicio',
    label: 'Início',
    icon: (active) => <IconHome className={`w-5 h-5 ${active ? 'text-[#C52229]' : 'text-slate-500'}`} />,
  },
  {
    id: 'preparar',
    label: 'Preparar',
    icon: (active) => <IconPrepare className={`w-5 h-5 ${active ? 'text-[#C52229]' : 'text-slate-500'}`} />,
    badge: true,
  },
  {
    id: 'treinar',
    label: 'Treinar',
    icon: (active) => <IconDojo className={`w-5 h-5 ${active ? 'text-[#C52229]' : 'text-slate-500'}`} />,
  },
  {
    id: 'explorar',
    label: 'Explorar',
    icon: (active) => <IconExplore className={`w-5 h-5 ${active ? 'text-[#C52229]' : 'text-slate-500'}`} />,
  },
  {
    id: 'estudio',
    label: 'Estúdio',
    icon: (active) => <IconStudio className={`w-5 h-5 ${active ? 'text-[#C52229]' : 'text-slate-500'}`} />,
  },
];

export default function MobileDock({ currentSection, onSelectSection }: MobileDockProps) {
  const activeCanonical = normalizeAppSection(currentSection);

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
        const isActive = activeCanonical === item.id;
        return (
          <button
            key={item.id}
            onClick={() => handleItemClick(item.id)}
            className={`flex-1 py-1.5 px-1 rounded-xl flex flex-col items-center justify-center transition-all relative ${
              isActive
                ? 'bg-red-50 dark:bg-red-950/40 text-[#C52229] dark:text-red-300 font-bold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <div className="mb-0.5">{item.icon(isActive)}</div>
            <span className="text-[10px] leading-none font-bold">{item.label}</span>
            {item.badge && !isActive && (
              <span className="absolute top-1 right-3 w-1.5 h-1.5 rounded-full bg-[#C52229]" />
            )}
            {isActive && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#C52229] mt-1" />
            )}
          </button>
        );
      })}
    </nav>
  );
}
