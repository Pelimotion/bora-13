'use client';

import React, { useState } from 'react';
import BrazilMap from '@/components/BrazilMap';
import TailoredMissionFunnel from '@/components/TailoredMissionFunnel';
import { BRAZIL_STATES_GEO, getStateByUF, type StateGeo } from '@/data/brazilGeo';
import { getStateStats, playProceduralHaptic, type PostPresetData } from '@/lib/agenticOrchestrator';
import { getRegionalTacticForUF } from '@/data/electoralTactics';

interface TerritorySectionProps {
  selectedUF?: string;
  selectedCity?: string;
  onSelectState: (uf: string, city?: string) => void;
  onGeneratePostFromTerritory: (uf: string, city?: string) => void;
  onNavigateToProfile: () => void;
  onOpenStudioWithPreset?: (preset: PostPresetData) => void;
  onNavigateToSimulator?: (frontId?: string, occupation?: string) => void;
}

export default function TerritorySection({
  selectedUF = 'SP',
  selectedCity,
  onSelectState,
  onGeneratePostFromTerritory,
  onNavigateToProfile,
  onOpenStudioWithPreset,
  onNavigateToSimulator,
}: TerritorySectionProps) {
  const [activeUF, setActiveUF] = useState<string>(selectedUF);
  const [cityInput, setCityInput] = useState<string>(selectedCity || '');

  const stateGeo = getStateByUF(activeUF) || BRAZIL_STATES_GEO[0];
  const stats = getStateStats(activeUF);
  const regionalTactic = getRegionalTacticForUF(activeUF);

  const handleStateClick = (geo: StateGeo) => {
    playProceduralHaptic('card');
    setActiveUF(geo.uf);
    setCityInput(geo.capital);
    onSelectState(geo.uf, geo.capital);
  };

  const handleCitySelect = (cityName: string) => {
    playProceduralHaptic('click');
    setCityInput(cityName);
    onSelectState(activeUF, cityName);
  };

  return (
    <section className="w-full max-w-7xl mx-auto px-4 py-8 animate-fade-in space-y-8">
      {/* ── CABEÇALHO DA SESSÃO ── */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 mb-2">
            <span>🗺️</span>
            <span>Realidade Regional • Fatos e Conquistas no Seu Estado</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Conquistas e Dados Auditados no Seu Estado
          </h2>
          <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 mt-1 max-w-2xl font-medium">
            Cada região tem uma realidade concreta. Consulte os dados oficiais de {stateGeo.name}, descubra as prioridades locais e veja como conversar de forma respeitosa:
          </p>
        </div>

        {/* Botão de Exportação Direta de Post Territorial */}
        <button
          onClick={() => {
            playProceduralHaptic('generate');
            onGeneratePostFromTerritory(activeUF, cityInput);
          }}
          className="px-5 py-3 rounded-2xl bg-[#C52229] hover:bg-[#a51b21] text-white font-bold text-xs md:text-sm flex items-center gap-2 shadow-lg active:scale-95 transition-all"
        >
          <span>📲</span>
          <span>Mandar Dados de {stateGeo.name} no Zap</span>
        </button>
      </div>

      {/* ── GRID: MAPA INTERATIVO À ESQUERDA & PAINEL DE DADOS À DIREITA ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* MAPA INTERATIVO (7 COLUNAS) */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center">
          <div className="flex items-center justify-between w-full mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Clique em um Estado para Inspecionar:
            </span>
            <span className="text-xs font-bold text-[#C52229]">
              {stateGeo.name} ({stateGeo.uf}) Selecionado
            </span>
          </div>

          <div className="w-full max-w-lg aspect-square flex items-center justify-center">
            <BrazilMap
              selectedState={activeUF}
              onSelectState={handleStateClick}
              className="w-full h-full"
            />
          </div>

          <p className="text-xs text-slate-400 mt-2 text-center">
            Toque nos estados para atualizar os indicadores e as cidades de referência.
          </p>
        </div>

        {/* PAINEL DE DADOS AUDITADOS DO ESTADO (5 COLUNAS) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* Card de Diretriz Estratégica Regional do 2º Turno */}
          <div className="p-5 rounded-3xl bg-gradient-to-br from-amber-500/10 via-red-500/10 to-transparent border-2 border-amber-300 dark:border-amber-800/60 shadow-md space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black uppercase tracking-wider text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                <span>🎯</span>
                <span>Dica Principal para {stateGeo.name} ({stateGeo.uf}):</span>
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200">
                Região {regionalTactic.region}
              </span>
            </div>

            <h4 className="text-sm font-black text-slate-900 dark:text-white leading-tight">
              {regionalTactic.primaryMission}
            </h4>

            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
              {regionalTactic.tacticalDirective}
            </p>

            <div className="p-3 rounded-xl bg-white/90 dark:bg-slate-900/90 border border-amber-200 dark:border-amber-800/40 text-[11px] space-y-1">
              <span className="font-bold text-emerald-700 dark:text-emerald-400 block">
                💡 O que fazer aqui:
              </span>
              <p className="text-slate-700 dark:text-slate-300 font-medium leading-snug">
                {regionalTactic.goldenAdvice}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-red-50/90 dark:bg-red-950/40 border border-red-200 dark:border-red-900/40 text-[11px] space-y-1">
              <span className="font-bold text-red-700 dark:text-red-400 block">
                ⚠️ Cuidado com isso:
              </span>
              <p className="text-red-950 dark:text-red-200 font-medium leading-snug">
                {regionalTactic.alert}
              </p>
            </div>
          </div>

          {/* Card Principal do Estado */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Conquistas Reais Comprovadas
                </span>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                  {stateGeo.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Capital: <strong>{stateGeo.capital}</strong>
                </p>
              </div>
              <span className="text-3xl p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                📍
              </span>
            </div>

            {/* Destaque Regional */}
            <div className="p-3.5 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/40 text-xs leading-relaxed text-slate-800 dark:text-slate-200 font-medium">
              {stats.highlightText}
            </div>

            {/* Indicadores Oficiais Auditados */}
            <div className="space-y-2.5 pt-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                📊 O Que o Governo Federal Já Fez em {stateGeo.name}:
              </span>

              <div className="p-3 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
                <span className="text-slate-600 dark:text-slate-400 font-medium">💼 Empregos com Carteira:</span>
                <strong className="text-blue-600 dark:text-blue-400 font-bold">{stats.jobsCreated}</strong>
              </div>

              <div className="p-3 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
                <span className="text-slate-600 dark:text-slate-400 font-medium">🎒 Poupança Pé-de-Meia:</span>
                <strong className="text-amber-600 dark:text-amber-400 font-bold">{stats.pedeMeiaStudents}</strong>
              </div>

              <div className="p-3 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
                <span className="text-slate-600 dark:text-slate-400 font-medium">💊 Farmácia Popular:</span>
                <strong className="text-emerald-600 dark:text-emerald-400 font-bold">{stats.farmaciaPopularBeneficiaries}</strong>
              </div>

              <div className="p-3 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
                <span className="text-slate-600 dark:text-slate-400 font-medium">🏠 Minha Casa Minha Vida:</span>
                <strong className="text-[#C52229] dark:text-red-400 font-bold">{stats.mcmvHomes}</strong>
              </div>
            </div>

            {/* Seletor de Cidades Polo */}
            <div className="pt-3 border-t border-slate-200 dark:border-slate-800">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2 block">
                🏙️ Principais Cidades em {stateGeo.name}:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {stateGeo.majorCities.map((city) => (
                  <button
                    key={city}
                    onClick={() => handleCitySelect(city)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                      cityInput === city
                        ? 'bg-[#C52229] text-white shadow-sm'
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-slate-300'
                    }`}
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>

            {/* Ações Rápidas */}
            <div className="flex flex-col gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  playProceduralHaptic('generate');
                  const el = document.getElementById('funil-territorio');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#C52229] to-[#991B1E] hover:from-[#a51b21] hover:to-[#7f1618] text-white font-black text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <span>🎯</span>
                <span>Configurar Roteiro da Virada em {cityInput || stateGeo.capital} ↓</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  playProceduralHaptic('generate');
                  onGeneratePostFromTerritory(activeUF, cityInput);
                }}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all"
              >
                <span>📲</span>
                <span>Mandar Dados no WhatsApp</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  playProceduralHaptic('click');
                  onNavigateToProfile();
                }}
                className="w-full py-2.5 rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50/50 dark:bg-red-950/20 text-[#C52229] dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-950/40 text-xs font-black flex items-center justify-center gap-2 transition-all shadow-2xs"
              >
                <span>👥</span>
                <span>Explorar Todos os Perfis de Eleitores →</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── FUNIL COMPLETO DA VIRADA REGIONAL (ESTADO → CIDADE → PERFIL → ARSENAL) ── */}
      <div id="funil-territorio" className="pt-4 scroll-mt-20">
        <TailoredMissionFunnel
          initialUF={activeUF}
          initialCity={cityInput}
          onSelectState={onSelectState}
          onSelectCity={handleCitySelect}
          onOpenStudio={onOpenStudioWithPreset}
          onOpenSimulator={onNavigateToSimulator}
          title={`QG Regional • Roteiro Sob Medida em ${cityInput || stateGeo.capital} (${activeUF})`}
        />
      </div>
    </section>
  );
}
