'use client';

import React from 'react';
import {
  type AppSection,
  type CanonicalAppSection,
  type AgenticWorkingMemory,
  normalizeAppSection,
  playProceduralHaptic,
} from '@/lib/agenticOrchestrator';
import ThemeToggle from '@/components/ThemeToggle';
import {
  IconStar,
  IconHome,
  IconPrepare,
  IconDojo,
  IconExplore,
  IconStudio,
  IconMapPin,
  IconUser,
  IconVolumeOn,
  IconVolumeOff,
  IconSmartphone,
} from '@/components/icons/CasaIcons';

interface NavigationHeaderProps {
  currentSection: AppSection;
  onSelectSection: (section: AppSection) => void;
  memory: AgenticWorkingMemory;
  soundEnabled: boolean;
  onToggleSound: () => void;
  canInstall?: boolean;
  onInstall?: () => void;
  onOpenShortcutGuide?: () => void;
  onResetContext?: () => void;
}

const SECTIONS: {
  id: CanonicalAppSection;
  label: string;
  icon: (active: boolean) => React.ReactNode;
  badge?: string;
}[] = [
  {
    id: 'inicio',
    label: 'Início',
    icon: (active) => <IconHome className={`w-4 h-4 ${active ? 'text-[#C52229]' : 'text-slate-500'}`} />,
  },
  {
    id: 'preparar',
    label: 'Preparar',
    icon: (active) => <IconPrepare className={`w-4 h-4 ${active ? 'text-[#C52229]' : 'text-slate-500'}`} />,
    badge: '3 Passos',
  },
  {
    id: 'treinar',
    label: 'Treinar',
    icon: (active) => <IconDojo className={`w-4 h-4 ${active ? 'text-[#C52229]' : 'text-slate-500'}`} />,
  },
  {
    id: 'explorar',
    label: 'Explorar',
    icon: (active) => <IconExplore className={`w-4 h-4 ${active ? 'text-[#C52229]' : 'text-slate-500'}`} />,
  },
  {
    id: 'estudio',
    label: 'Estúdio',
    icon: (active) => <IconStudio className={`w-4 h-4 ${active ? 'text-[#C52229]' : 'text-slate-500'}`} />,
    badge: '1080p',
  },
];

export default function NavigationHeader({
  currentSection,
  onSelectSection,
  memory,
  soundEnabled,
  onToggleSound,
  canInstall,
  onInstall,
  onOpenShortcutGuide,
  onResetContext,
}: NavigationHeaderProps) {
  const activeCanonical = normalizeAppSection(currentSection);

  const handleTabClick = (sectionId: AppSection) => {
    playProceduralHaptic('click');
    onSelectSection(sectionId);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const currentUF = memory.selectedUF || 'SP';
  const currentCity = memory.selectedCity || 'São Paulo';
  const hasContext = Boolean(memory.selectedUF || memory.selectedCity || memory.occupation);

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#0B0F19]/95 backdrop-blur-md border-b border-slate-200/90 dark:border-slate-800/90 transition-colors shadow-xs">
      {/* Top Ribbon Bora 13 */}
      <div className="h-1 w-full bg-gradient-to-r from-[#C52229] via-[#C52229] to-[#991B1E]" />

      <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between gap-3">
        {/* LADO ESQUERDO: LOGO & IDENTIDADE BORA 13 */}
        <div className="flex items-center gap-3.5">
          <button
            onClick={() => handleTabClick('inicio')}
            className="flex items-center gap-2.5 text-left group shrink-0"
            title="Ir para a página inicial"
          >
            {/* Emblema Estrela Bora 13 */}
            <div className="w-10 h-10 rounded-xl bg-[#C52229] group-hover:bg-[#a51b21] text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-all shrink-0">
              <IconStar className="w-5 h-5 text-white" />
            </div>

            <div className="hidden sm:block">
              <div className="flex items-center gap-1.5">
                <span className="text-base font-black tracking-tight text-slate-900 dark:text-white leading-none">
                  Bora 13
                </span>
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-950/60 text-[#C52229] dark:text-red-300 border border-red-200/50">
                  Iniciativa Cidadã
                </span>
              </div>
              <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 leading-tight mt-0.5">
                Guia Cidadão • Feito pra Somar na Causa
              </p>
            </div>
          </button>

          {/* BADGE DE TERRITÓRIO ATIVO (DESKTOP - DIAGRAMAÇÃO ARQUITETURAL DE ALTA REGUA) */}
          {hasContext && (
            <button
              onClick={() => handleTabClick('preparar')}
              title={`Território ativo gravado: ${currentCity} (${currentUF}). Toque para alterar.`}
              className="hidden lg:flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-850 hover:bg-red-50 dark:hover:bg-red-950/50 border border-slate-200 dark:border-slate-700 hover:border-red-300 dark:hover:border-red-800 transition-all cursor-pointer shadow-2xs group"
            >
              {/* Tag da UF */}
              <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-[#C52229] text-white text-[10px] font-black uppercase tracking-wider shadow-2xs shrink-0">
                <IconMapPin className="w-2.5 h-2.5 text-white" />
                <span>{currentUF}</span>
              </div>

              {/* Cidade & Subtítulo */}
              <div className="flex flex-col text-left leading-none">
                <span className="text-xs font-black text-slate-900 dark:text-white group-hover:text-[#C52229] transition-colors truncate max-w-[130px]">
                  {currentCity}
                </span>
                <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 mt-0.5">
                  Território Gravado
                </span>
              </div>

              {/* Ocupação se definida */}
              {memory.occupation && (
                <div className="hidden xl:flex items-center gap-1 pl-2 border-l border-slate-200 dark:border-slate-700 text-[10px] font-bold text-slate-600 dark:text-slate-300">
                  <IconUser className="w-3 h-3 text-[#C52229]" />
                  <span className="truncate max-w-[85px]">{memory.occupation}</span>
                </div>
              )}

              <span className="text-[10px] font-black text-slate-400 group-hover:text-[#C52229] transition-colors ml-0.5">
                ▾
              </span>
            </button>
          )}
        </div>

        {/* BADGE DE TERRITÓRIO COMPACTO (MOBILE - VISÍVEL E ACESSÍVEL) */}
        {hasContext && (
          <button
            onClick={() => handleTabClick('preparar')}
            title={`Território gravado: ${currentCity} (${currentUF})`}
            className="flex md:hidden items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-red-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-black text-slate-800 dark:text-slate-200 shadow-2xs shrink min-w-0"
          >
            <span className="px-1.5 py-0.5 rounded-md bg-[#C52229] text-white text-[9px] font-black">
              {currentUF}
            </span>
            <span className="truncate max-w-[110px] font-bold text-[11px]">
              {currentCity}
            </span>
            <span className="text-[9px] text-slate-400">▾</span>
          </button>
        )}

        {/* CENTRO: NAVEGAÇÃO EM TABS DE ALTO NÍVEL (DESKTOP) */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-100/90 dark:bg-slate-800/70 p-1.5 rounded-2xl border border-slate-200/70 dark:border-slate-700/70 shadow-inner">
          {SECTIONS.map((sec) => {
            const isActive = activeCanonical === sec.id;
            return (
              <button
                key={sec.id}
                onClick={() => handleTabClick(sec.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all relative flex items-center gap-2 ${
                  isActive
                    ? 'bg-white dark:bg-slate-900 text-[#C52229] dark:text-red-300 shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-800/60'
                }`}
              >
                {sec.icon(isActive)}
                <span>{sec.label}</span>
                {sec.badge && (
                  <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded-full ${
                    isActive 
                      ? 'bg-red-100 dark:bg-red-950/60 text-[#C52229] dark:text-red-300' 
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                  }`}>
                    {sec.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* LADO DIREITO: UTILITÁRIOS (SOM, TEMA & ATALHO NO CELULAR) */}
        <div className="flex items-center gap-2">
          {/* Som Tátil Procedural Toggle */}
          <button
            onClick={onToggleSound}
            title={soundEnabled ? 'Desativar sons' : 'Ativar sons'}
            className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center hover:scale-105 active:scale-95 transition-all text-slate-700 dark:text-slate-300 shadow-sm"
          >
            {soundEnabled ? (
              <IconVolumeOn className="w-4 h-4 text-[#C52229]" />
            ) : (
              <IconVolumeOff className="w-4 h-4 text-slate-400" />
            )}
          </button>

          {/* Theme Toggle (Light / Dark) */}
          <ThemeToggle />

          {/* Atalho no Celular (Adicionar à Tela Inicial sem Baixar Nada) */}
          <button
            onClick={() => {
              playProceduralHaptic('click');
              if (onOpenShortcutGuide) onOpenShortcutGuide();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-[#C52229] hover:bg-[#a51b21] text-white transition-all shadow-2xs active:scale-95 cursor-pointer"
            title="Salvar atalho direto na tela inicial do celular"
          >
            <IconSmartphone className="w-3.5 h-3.5 text-white" />
            <span className="hidden sm:inline">Atalho no Celular</span>
            <span className="sm:hidden">Atalho</span>
          </button>
        </div>
      </div>
    </header>
  );
}
