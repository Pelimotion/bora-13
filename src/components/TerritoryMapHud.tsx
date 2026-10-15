'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { BRAZIL_STATES_GEO, REGIONS, getStateByUF, type StateGeo } from '@/data/brazilGeo';
import { getStateStats, playProceduralHaptic, type AppSection } from '@/lib/agenticOrchestrator';
import {
  IconStar,
  IconMapPin,
  IconArrowRight,
  IconCheck,
  IconShareWhatsApp,
  IconShield,
  IconExplore,
} from '@/components/icons/CasaIcons';
import BrazilMap from '@/components/BrazilMap';
import StateDossierModal from '@/components/StateDossierModal';
import { openWhatsApp, cleanTextForSharing } from '@/lib/shareUtils';

interface TerritoryMapHudProps {
  activeUF: string;
  onSelectState: (uf: string, city?: string) => void;
  onNavigate: (section: AppSection) => void;
  initialOpenDossier?: boolean;
  className?: string;
}

export default function TerritoryMapHud({
  activeUF,
  onSelectState,
  onNavigate,
  initialOpenDossier = false,
  className = '',
}: TerritoryMapHudProps) {
  const [activeRegion, setActiveRegion] = useState<string>('Todas');
  const [isDossierOpen, setIsDossierOpen] = useState(initialOpenDossier);

  useEffect(() => {
    if (initialOpenDossier) {
      setIsDossierOpen(true);
    }
  }, [initialOpenDossier]);

  const selectedStateGeo = useMemo(
    () => getStateByUF(activeUF) || BRAZIL_STATES_GEO[0],
    [activeUF]
  );

  const stats = useMemo(() => getStateStats(selectedStateGeo.uf), [selectedStateGeo.uf]);

  // Estados filtrados pela região ativa para o painel de toque rápido (mobile & desktop)
  const regionStates = useMemo(() => {
    if (activeRegion === 'Todas') return BRAZIL_STATES_GEO;
    return BRAZIL_STATES_GEO.filter((s) => s.region === activeRegion);
  }, [activeRegion]);

  const handleStateClick = (state: StateGeo) => {
    playProceduralHaptic('card');
    onSelectState(state.uf, state.capital);
  };

  const handleRegionClick = (reg: string) => {
    playProceduralHaptic('click');
    setActiveRegion(reg);
  };

  const handleStartPreparation = () => {
    playProceduralHaptic('generate');
    onSelectState(selectedStateGeo.uf, selectedStateGeo.capital);
    onNavigate('preparar');
  };

  const handleExploreState = () => {
    playProceduralHaptic('click');
    onSelectState(selectedStateGeo.uf, selectedStateGeo.capital);
    onNavigate('explorar');
  };

  const handleOpenDossier = () => {
    playProceduralHaptic('click');
    setIsDossierOpen(true);
  };

  return (
    <section
      className={`w-full bg-white dark:bg-slate-900/90 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 sm:p-7 md:p-8 shadow-sm transition-colors ${className}`}
      aria-label="Radar Territorial Cidadão"
    >
      {/* ── 1. CABEÇALHO NARRATIVO DO GUIA (POUCOS ITENS, FOCO CLARO) ── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 pb-6 border-b border-slate-100 dark:border-slate-800">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800/60 text-[#C52229] dark:text-red-300 text-xs font-black uppercase tracking-wider">
            <IconMapPin className="w-3.5 h-3.5" />
            <span>Passo 1 do Guia • Escolha seu Território</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Onde você vai conversar hoje?
          </h2>

          <p className="text-sm text-slate-600 dark:text-slate-400 font-normal leading-relaxed">
            O diálogo ganha força quando cita a realidade concreta da sua terra. Selecione seu estado no mapa ou nos botões rápidos abaixo para ver os fatos auditados e gerar seu roteiro de conversa.
          </p>
        </div>

        {/* Seletor rápido acessível por Dropdown (Ideal para teclado e leitores de tela) */}
        <div className="shrink-0 flex items-center gap-2">
          <label htmlFor="territory-quick-select" className="sr-only">
            Escolher Estado
          </label>
          <div className="relative">
            <select
              id="territory-quick-select"
              value={selectedStateGeo.uf}
              onChange={(e) => {
                const found = BRAZIL_STATES_GEO.find((s) => s.uf === e.target.value);
                if (found) handleStateClick(found);
              }}
              className="appearance-none text-xs font-black px-4 py-2.5 pr-8 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 shadow-2xs focus:outline-hidden focus:border-[#C52229] cursor-pointer"
            >
              {BRAZIL_STATES_GEO.map((st) => (
                <option key={st.uf} value={st.uf}>
                  {st.uf} — {st.name} ({st.region})
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">
              ▼
            </span>
          </div>
        </div>
      </div>

      {/* ── 2. HUD DE TOQUE RÁPIDO (ERgonômico PARA CELULAR E DESKTOP) ── */}
      <div className="space-y-3 mb-6">
        {/* Filtro de Regiões em Pílulas */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 mr-1 shrink-0">
            Regiões:
          </span>
          {REGIONS.map((reg) => {
            const isActive = activeRegion === reg;
            return (
              <button
                key={reg}
                type="button"
                onClick={() => handleRegionClick(reg)}
                className={`px-3 py-1.5 rounded-full text-xs font-black whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#C52229] text-white shadow-xs scale-102'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {reg}
              </button>
            );
          })}
        </div>

        {/* Barra de Pílulas de UFs da Região (Touch-friendly: alvos de toque confortáveis no celular) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 mr-1 shrink-0">
            Estados:
          </span>
          {regionStates.map((st) => {
            const isSelected = selectedStateGeo.uf === st.uf;
            return (
              <button
                key={st.uf}
                type="button"
                onClick={() => handleStateClick(st)}
                title={`${st.name} (${st.capital})`}
                className={`px-3 py-2 rounded-xl text-xs font-black shrink-0 transition-all cursor-pointer flex items-center gap-1.5 active:scale-95 ${
                  isSelected
                    ? 'bg-[#C52229] text-white ring-2 ring-[#C52229]/30 shadow-xs'
                    : 'bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-slate-400'
                }`}
              >
                {isSelected && <IconStar className="w-3 h-3 text-white fill-white" />}
                <span>{st.uf}</span>
                <span className="text-[10px] font-normal opacity-80 hidden sm:inline">
                  {st.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── 3. CORPO DO HUD: MAPA INTERATIVO (ESQ) + PAINEL DE INTELIGÊNCIA LOCAL (DIR) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* COLUNA ESQUERDA: MAPA DO BRASIL INTERATIVO */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center p-2 sm:p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800/60">
          <BrazilMap
            selectedState={selectedStateGeo.uf}
            onSelectState={handleStateClick}
            activeRegion={activeRegion}
            onSelectRegion={setActiveRegion}
            showSelector={false}
            showRegions={false}
            className="w-full max-w-[440px]"
          />
        </div>

        {/* COLUNA DIREITA: PAINEL HUD DO ESTADO SELECIONADO (POUCOS ITENS, SEM SOBRECARGA) */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-4 p-5 sm:p-6 rounded-2xl bg-slate-50/70 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 shadow-2xs">
          {/* Identidade do Estado Ativo */}
          <div className="space-y-1">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Região {selectedStateGeo.region} • Capital: {selectedStateGeo.capital}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                Dados Auditados
              </span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <span>{selectedStateGeo.name}</span>
              <span className="text-sm font-black px-2 py-0.5 rounded-lg bg-[#C52229] text-white">
                {selectedStateGeo.uf}
              </span>
            </h3>
          </div>

          {/* 2 Provas Concretas do Bolso (Conciso, sem poluição) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {/* Métrica 1: Emprego Caged */}
            <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block">
                Carteira Assinada (Caged)
              </span>
              <span className="text-xs sm:text-sm font-black text-slate-900 dark:text-white block mt-0.5 leading-snug">
                {stats.jobsCreated}
              </span>
            </div>

            {/* Métrica 2: Pé-de-Meia / Farmácia Popular */}
            <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block">
                Pé-de-Meia ou Remédio
              </span>
              <span className="text-xs sm:text-sm font-black text-slate-900 dark:text-white block mt-0.5 leading-snug">
                {stats.pedeMeiaStudents || stats.farmaciaPopularBeneficiaries}
              </span>
            </div>
          </div>

          {/* Citação-Guia do Estado */}
          <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border-l-4 border-[#C52229] border border-slate-200 dark:border-slate-800">
            <p className="text-xs text-slate-700 dark:text-slate-300 font-medium leading-relaxed italic">
              &ldquo;{stats.highlightText}&rdquo;
            </p>
          </div>

          {/* Hub de Ações Estratégicas (1 Ação Principal + 2 Secundárias) */}
          <div className="space-y-2 pt-2">
            {/* CTA Primário: Conecta diretamente ao Orquestrador Agêntico */}
            <button
              type="button"
              onClick={handleStartPreparation}
              style={{ backgroundColor: '#C52229' }}
              className="w-full py-3 px-4 rounded-xl text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm hover:opacity-95 active:scale-98 transition-all cursor-pointer"
            >
              <span>Montar Roteiro para {selectedStateGeo.name}</span>
              <IconArrowRight className="w-4 h-4" />
            </button>

            {/* Ações Secundárias em Linha */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleOpenDossier}
                className="py-2.5 px-3 rounded-xl bg-red-50 dark:bg-red-950/60 hover:bg-red-100 dark:hover:bg-red-900/60 border border-red-200 dark:border-red-800 text-[#C52229] dark:text-red-300 font-black text-xs flex items-center justify-center gap-1.5 transition-all active:scale-98 cursor-pointer shadow-2xs"
              >
                <IconStar className="w-3.5 h-3.5 text-[#C52229]" />
                <span>5 Motivos de {selectedStateGeo.uf} 🎯</span>
              </button>

              <button
                type="button"
                onClick={handleExploreState}
                className="py-2.5 px-3 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <IconExplore className="w-3.5 h-3.5 text-[#C52229]" />
                <span>Ver Todos os Fatos</span>
              </button>
            </div>
          </div>

          {/* Rodapé de Auditoria e Transparência */}
          <div className="pt-2 border-t border-slate-200 dark:border-slate-700/80 flex items-center justify-between text-[10px] font-semibold text-slate-400">
            <span className="flex items-center gap-1">
              <IconShield className="w-3 h-3 text-emerald-600" />
              Fontes: Caged • MEC • MS • IBGE
            </span>
            <span>100% Cidadão & Voluntário</span>
          </div>
        </div>
      </div>

      {/* Modal do Dossiê Territorial com Gerador Estratégico de Conversa */}
      <StateDossierModal
        uf={selectedStateGeo.uf}
        isOpen={isDossierOpen}
        onClose={() => setIsDossierOpen(false)}
        onStartPreparation={() => {
          setIsDossierOpen(false);
          handleStartPreparation();
        }}
      />
    </section>
  );
}
