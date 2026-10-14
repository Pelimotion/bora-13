'use client';

import React from 'react';
import type { AppSection, AgenticWorkingMemory, PostPresetData } from '@/lib/agenticOrchestrator';
import { playProceduralHaptic } from '@/lib/agenticOrchestrator';
import TailoredMissionFunnel from '@/components/TailoredMissionFunnel';
import { getStateByUF, BRAZIL_STATES_GEO } from '@/data/brazilGeo';
import {
  IconStar,
  IconPrepare,
  IconDojo,
  IconExplore,
  IconStudio,
  IconMapPin,
  IconUser,
} from '@/components/icons/CasaIcons';

interface PrepareWorkspaceSectionProps {
  memory: AgenticWorkingMemory;
  onNavigate: (section: AppSection) => void;
  onSelectState: (uf: string, city?: string) => void;
  onSelectFront: (frontId: 'ex_lula' | 'terceira_via' | 'abstencao_70' | 'nulo_branco') => void;
  onOpenStudioWithPreset?: (preset: PostPresetData) => void;
  onNavigateToSimulator?: (frontId?: string, occupation?: string) => void;
}

export default function PrepareWorkspaceSection({
  memory,
  onNavigate,
  onSelectState,
  onSelectFront,
  onOpenStudioWithPreset,
  onNavigateToSimulator,
}: PrepareWorkspaceSectionProps) {
  const activeUF = memory.selectedUF || 'SP';
  const stateGeo = getStateByUF(activeUF) || BRAZIL_STATES_GEO[0];
  const activeCity = memory.selectedCity || stateGeo.capital;

  const handleNav = (sec: AppSection) => {
    playProceduralHaptic('click');
    onNavigate(sec);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <section className="w-full max-w-5xl mx-auto px-4 py-8 md:py-10 animate-fade-in space-y-8">
      {/* ── CABEÇALHO DO ESPAÇO DE TRABALHO EDITORIAL ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-red-100 dark:bg-red-950/60 text-[#C52229] dark:text-red-300 mb-2">
            <IconStar className="w-3.5 h-3.5 text-[#C52229]" />
            <span>Guia em 3 Passos • Roteiro Sob Medida</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Preparar uma Conversa
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl font-normal leading-relaxed">
            Selecione o local e o perfil da pessoa para gerar um roteiro de acolhimento, 3 fatos do bolso no município e o que responder a objeções comuns.
          </p>
        </div>

        {/* Status de Contexto Rápido */}
        <div className="flex items-center gap-2 p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shrink-0 text-xs shadow-xs">
          <IconMapPin className="w-4 h-4 text-[#C52229]" />
          <span className="font-bold text-slate-800 dark:text-slate-200">
            {activeCity} ({activeUF})
          </span>
          {memory.occupation && (
            <span className="text-slate-500 font-medium hidden sm:inline flex items-center gap-1">
              • <IconUser className="w-3.5 h-3.5 inline text-slate-400" /> {memory.occupation}
            </span>
          )}
        </div>
      </div>

      {/* ── O FUNIL DA VIRADA (VERTICAL SLICE DEDICADO) ── */}
      <div className="w-full">
        <TailoredMissionFunnel
          initialUF={activeUF}
          initialCity={activeCity}
          initialFrontId={memory.activeFrontId || 'ex_lula'}
          initialOccupation={memory.occupation}
          onSelectState={onSelectState}
          onSelectCity={(city) => onSelectState(activeUF, city)}
          onSelectFront={onSelectFront}
          onOpenStudio={onOpenStudioWithPreset}
          onOpenSimulator={(frontId, occupation) => {
            if (onNavigateToSimulator) {
              onNavigateToSimulator(frontId, occupation);
            } else {
              handleNav('treinar');
            }
          }}
          compact={false}
        />
      </div>

      {/* ── ATALHOS CRUZADOS CONTEXTUAIS (PRÓXIMAS AÇÕES) ── */}
      <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/90 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center md:text-left">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Quer aprofundar ou criar materiais visuais com esses dados?
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            O contexto de {activeCity} ({activeUF}) já está conectado ao restante do aplicativo.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => handleNav('treinar')}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <IconDojo className="w-3.5 h-3.5 text-[#C52229]" />
            <span>Praticar no Dojô</span>
          </button>
          <button
            type="button"
            onClick={() => handleNav('explorar')}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <IconExplore className="w-3.5 h-3.5 text-amber-600" />
            <span>Ver Mapa & Fatos</span>
          </button>
          <button
            type="button"
            onClick={() => handleNav('estudio')}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-[#C52229] hover:bg-[#a51b21] text-white transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <IconStudio className="w-3.5 h-3.5 text-white" />
            <span>Gerar Card 1080p</span>
          </button>
        </div>
      </div>
    </section>
  );
}
