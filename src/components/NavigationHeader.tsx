'use client';

import React from 'react';
import type { AppSection, AgenticWorkingMemory } from '@/lib/agenticOrchestrator';
import { playProceduralHaptic } from '@/lib/agenticOrchestrator';
import ThemeToggle from '@/components/ThemeToggle';

interface NavigationHeaderProps {
  currentSection: AppSection;
  onSelectSection: (section: AppSection) => void;
  memory: AgenticWorkingMemory;
  soundEnabled: boolean;
  onToggleSound: () => void;
  canInstall?: boolean;
  onInstall?: () => void;
}

const SECTIONS: { id: AppSection; label: string; icon: string; badge?: string }[] = [
  { id: 'radar', label: 'Início & Mapa', icon: '🇧🇷' },
  { id: 'territorio', label: 'Meu Estado', icon: '🗺️' },
  { id: 'perfil', label: 'Quem Abordar', icon: '👥' },
  { id: 'simulador', label: 'Treinar Diálogo', icon: '💬' },
  { id: 'fatos', label: 'Fatos do Bolso', icon: '💡' },
  { id: 'estudio', label: 'Mandar no Zap', icon: '📲', badge: 'Pronto' },
];

export default function NavigationHeader({
  currentSection,
  onSelectSection,
  memory,
  soundEnabled,
  onToggleSound,
  canInstall,
  onInstall,
}: NavigationHeaderProps) {
  const handleTabClick = (sectionId: AppSection) => {
    playProceduralHaptic('click');
    onSelectSection(sectionId);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const hasContext = memory.selectedUF || memory.occupation;

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#0B0F19]/95 backdrop-blur-md border-b border-slate-200/90 dark:border-slate-800/90 transition-colors shadow-xs">
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between gap-3">
        {/* LADO ESQUERDO: LOGO & IDENTIDADE CASA 13 */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleTabClick('radar')}
            className="flex items-center gap-2.5 text-left group shrink-0"
            title="Ir para a página inicial"
          >
            <div className="w-10 h-10 rounded-xl overflow-hidden border border-red-200 dark:border-red-800/50 shadow-sm group-hover:scale-105 transition-transform bg-white shrink-0 p-0.5">
              <img
                src="/bora/brand/logo-emblem.jpg"
                alt="Bora 13 • Identidade Oficial"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            <div className="hidden sm:block">
              <div className="flex items-center gap-1.5">
                <span className="text-base font-black tracking-tight text-slate-900 dark:text-white leading-none">
                  Bora 13
                </span>
                <span className="text-[10px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-red-100 dark:bg-red-950/60 text-[#C52229] dark:text-red-300">
                  Guia do Diálogo
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 leading-tight">
                Conversas que Viram Voto
              </p>
            </div>
          </button>

          {/* Quick Context Pill (se houver estado ou profissão ativos) */}
          {hasContext && (
            <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-[11px] font-bold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              {memory.selectedUF && <span>📍 {memory.selectedUF}</span>}
              {memory.selectedCity && <span className="text-slate-400">• {memory.selectedCity}</span>}
              {memory.occupation && (
                <>
                  <span className="text-slate-400">•</span>
                  <span>👤 {memory.occupation}</span>
                </>
              )}
            </div>
          )}
        </div>

        {/* CENTRO: NAVEGAÇÃO EM TABS DE ALTO NÍVEL (DESKTOP) */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-100/90 dark:bg-slate-800/70 p-1.5 rounded-2xl border border-slate-200/70 dark:border-slate-700/70 shadow-inner">
          {SECTIONS.map((sec) => {
            const isActive = currentSection === sec.id;
            return (
              <button
                key={sec.id}
                onClick={() => handleTabClick(sec.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all relative flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-white dark:bg-slate-900 text-[#C52229] dark:text-red-300 shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-800/60'
                }`}
              >
                <span>{sec.icon}</span>
                <span>{sec.label}</span>
                {sec.badge && (
                  <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded-full bg-emerald-600 text-white">
                    {sec.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* LADO DIREITO: UTILITÁRIOS (SOM, TEMA & INSTALAR APP) */}
        <div className="flex items-center gap-2">
          {/* Som Tátil Procedural Toggle */}
          <button
            onClick={onToggleSound}
            title={soundEnabled ? 'Desativar sons do aplicativo' : 'Ativar sons do aplicativo'}
            className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-xs font-bold hover:scale-105 active:scale-95 transition-all text-slate-700 dark:text-slate-300 shadow-sm"
          >
            {soundEnabled ? '🔊' : '🔇'}
          </button>

          {/* Theme Toggle (Light / Dark) */}
          <ThemeToggle />

          {/* PWA Install Button */}
          {canInstall && onInstall && (
            <button
              onClick={onInstall}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-[#C52229] hover:bg-[#a51b21] text-white transition-all shadow-sm active:scale-95"
            >
              <span>📲</span>
              <span>Baixar App</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
