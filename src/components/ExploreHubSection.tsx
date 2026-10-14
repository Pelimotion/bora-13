'use client';

import React, { useState } from 'react';
import type { AppSection, AgenticWorkingMemory, PostPresetData } from '@/lib/agenticOrchestrator';
import { playProceduralHaptic, getStateStats } from '@/lib/agenticOrchestrator';
import BrazilMap from '@/components/BrazilMap';
import TerritorySection from '@/components/TerritorySection';
import QuickArgumentView from '@/components/QuickArgumentView';
import { getStateByUF, BRAZIL_STATES_GEO, type StateGeo } from '@/data/brazilGeo';
import type { Argument } from '@/data/arguments';
import {
  IconStar,
  IconExplore,
  IconPrepare,
  IconShield,
  IconCheck,
  IconMapPin,
  IconShareWhatsApp,
  IconArrowRight,
} from '@/components/icons/CasaIcons';

interface ExploreHubSectionProps {
  memory: AgenticWorkingMemory;
  onNavigate: (section: AppSection) => void;
  onSelectState: (uf: string, city?: string) => void;
  onGeneratePostFromTerritory?: (uf: string, city?: string) => void;
  onOpenStudioWithPreset?: (preset: PostPresetData) => void;
  onNavigateToSimulator?: (frontId?: string, occupation?: string) => void;
  onOpenCardGenerator?: (arg: Argument) => void;
  initialTab?: 'mapa' | 'territorio' | 'fatos';
}

export default function ExploreHubSection({
  memory,
  onNavigate,
  onSelectState,
  onGeneratePostFromTerritory,
  onOpenStudioWithPreset,
  onNavigateToSimulator,
  onOpenCardGenerator,
  initialTab = 'mapa',
}: ExploreHubSectionProps) {
  const [activeTab, setActiveTab] = useState<'mapa' | 'territorio' | 'fatos'>(initialTab);
  const activeUF = memory.selectedUF || 'SP';
  const stateGeo = getStateByUF(activeUF) || BRAZIL_STATES_GEO[0];
  const stats = getStateStats(activeUF);

  const handleTabChange = (tab: 'mapa' | 'territorio' | 'fatos') => {
    playProceduralHaptic('click');
    setActiveTab(tab);
  };

  const handleStateClick = (geo: StateGeo) => {
    playProceduralHaptic('card');
    onSelectState(geo.uf, geo.capital);
  };

  const handleSendTerritoryZap = () => {
    playProceduralHaptic('generate');
    if (onGeneratePostFromTerritory) {
      onGeneratePostFromTerritory(activeUF, stateGeo.capital);
    } else {
      onNavigate('estudio');
    }
  };

  return (
    <section className="w-full max-w-7xl mx-auto px-4 py-8 md:py-10 animate-fade-in space-y-8">
      {/* ── CABEÇALHO DA CENTRAL DE INTELIGÊNCIA ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-100 dark:bg-amber-950/40 text-amber-900 dark:text-amber-300 mb-2">
            <IconStar className="w-3.5 h-3.5 text-amber-600" />
            <span>Central de Inteligência Territorial & Fatos Oficiais</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Explorar Dados e Evidências
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl font-normal leading-relaxed">
            Consulte a cartografia interativa do Brasil, a realidade regional de cada um dos 27 estados e o banco de provas do bolso auditadas por órgãos públicos.
          </p>
        </div>

        {/* ── SUB-ABAS DE NAVEGAÇÃO INTERNA ── */}
        <div className="flex items-center p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 shrink-0">
          <button
            type="button"
            onClick={() => handleTabChange('mapa')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'mapa'
                ? 'bg-white dark:bg-slate-900 text-[#C52229] dark:text-red-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <IconExplore className="w-3.5 h-3.5" />
            <span>Mapa do Brasil</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('territorio')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'territorio'
                ? 'bg-white dark:bg-slate-900 text-[#C52229] dark:text-red-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <IconShield className="w-3.5 h-3.5" />
            <span>Dossiê Estadual</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('fatos')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'fatos'
                ? 'bg-white dark:bg-slate-900 text-[#C52229] dark:text-red-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <IconCheck className="w-3.5 h-3.5" />
            <span>Fatos do Bolso</span>
          </button>
        </div>
      </div>

      {/* ── ABA 1: CARTOGRAFIA INTERATIVA + MINI-DOSSIÊ INTEGRADO ── */}
      {activeTab === 'mapa' && (
        <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* O MAPA SVG */}
            <div className="lg:col-span-7 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                    Navegação Cartográfica
                  </span>
                  <span className="text-base font-black text-slate-900 dark:text-white">
                    Toque em qualquer estado da federação
                  </span>
                </div>
                <span className="text-xs font-bold text-[#C52229] bg-red-50 dark:bg-red-950/60 px-3 py-1 rounded-full border border-red-200 dark:border-red-800">
                  Estado Ativo: {stateGeo.name} ({stateGeo.uf})
                </span>
              </div>

              <BrazilMap
                selectedState={activeUF}
                onSelectState={handleStateClick}
                className="w-full"
                showSelector={true}
                showRegions={true}
              />
            </div>

            {/* PAINEL DE INTELIGÊNCIA DO ESTADO SELECIONADO */}
            <div className="lg:col-span-5 space-y-4">
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                      Região {stateGeo.region} • Capital: {stateGeo.capital}
                    </span>
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white leading-tight">
                      {stateGeo.name} ({stateGeo.uf})
                    </h2>
                  </div>

                  <button
                    type="button"
                    onClick={handleSendTerritoryZap}
                    title="Mandar números oficiais no WhatsApp"
                    className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 shadow-2xs cursor-pointer"
                  >
                    <IconShareWhatsApp className="w-3.5 h-3.5 text-white" />
                    <span>Zap de {stateGeo.uf}</span>
                  </button>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                  {stats.highlightText}
                </p>

                {/* Grid de Métricas Oficiais */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700">
                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block">
                      Novos Empregos (Caged)
                    </span>
                    <span className="text-sm font-black text-slate-900 dark:text-white leading-tight block mt-0.5">
                      {stats.jobsCreated}
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700">
                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block">
                      Farmácia Popular
                    </span>
                    <span className="text-sm font-black text-slate-900 dark:text-white leading-tight block mt-0.5">
                      {stats.farmaciaPopularBeneficiaries}
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700">
                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block">
                      Pé-de-Meia (MEC)
                    </span>
                    <span className="text-sm font-black text-slate-900 dark:text-white leading-tight block mt-0.5">
                      {stats.pedeMeiaStudents}
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700">
                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block">
                      Bolsa Família
                    </span>
                    <span className="text-sm font-black text-slate-900 dark:text-white leading-tight block mt-0.5">
                      {stats.bolsaFamiliaFamilies}
                    </span>
                  </div>
                </div>

                {/* Cidades Polo */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                  <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block flex items-center gap-1.5">
                    <IconMapPin className="w-3.5 h-3.5 text-[#C52229]" />
                    <span>Cidades Polo em {stateGeo.name}:</span>
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {stateGeo.majorCities.slice(0, 6).map((city) => (
                      <button
                        key={city}
                        type="button"
                        onClick={() => {
                          playProceduralHaptic('click');
                          onSelectState(activeUF, city);
                        }}
                        className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-red-50 hover:text-[#C52229] dark:hover:bg-red-950/40 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700 transition-all cursor-pointer"
                      >
                        {city}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Ação Primária: Preparar conversa neste estado */}
                <button
                  type="button"
                  onClick={() => {
                    playProceduralHaptic('generate');
                    onNavigate('preparar');
                  }}
                  className="w-full py-3 rounded-xl bg-[#C52229] hover:bg-[#a51b21] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all active:scale-98 cursor-pointer"
                >
                  <IconPrepare className="w-4 h-4 text-white" />
                  <span>Preparar Roteiro da Virada para {stateGeo.name}</span>
                  <IconArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── ABA 2: DOSSIÊ REGIONAL COMPLETO DAS 27 UFS ── */}
      {activeTab === 'territorio' && (
        <div className="animate-fade-in">
          <TerritorySection
            selectedUF={activeUF}
            selectedCity={memory.selectedCity}
            onSelectState={onSelectState}
            onGeneratePostFromTerritory={onGeneratePostFromTerritory || handleSendTerritoryZap}
            onNavigateToProfile={() => onNavigate('preparar')}
            onOpenStudioWithPreset={onOpenStudioWithPreset}
            onNavigateToSimulator={onNavigateToSimulator}
          />
        </div>
      )}

      {/* ── ABA 3: PROVAS DO BOLSO & ROLETA DA VERDADE ── */}
      {activeTab === 'fatos' && (
        <div className="animate-fade-in">
          <QuickArgumentView
            onOpenCardGenerator={(arg) => {
              if (onOpenCardGenerator) {
                onOpenCardGenerator(arg);
              } else {
                onNavigate('estudio');
              }
            }}
            className="py-2"
          />
        </div>
      )}
    </section>
  );
}
