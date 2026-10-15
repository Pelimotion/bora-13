'use client';

import React, { useState } from 'react';
import type { AppSection, AgenticWorkingMemory, PostPresetData } from '@/lib/agenticOrchestrator';
import {
  playProceduralHaptic,
  getStateStats,
  getSmartNextStepRecommendation,
} from '@/lib/agenticOrchestrator';
import BrazilMap from '@/components/BrazilMap';
import TailoredMissionFunnel from '@/components/TailoredMissionFunnel';
import { BRAZIL_STATES_GEO, getStateByUF, type StateGeo } from '@/data/brazilGeo';
import {
  CONVERSION_FRONTS,
  MENOS_COM_FLAVIO_FACTS,
  getRegionalTacticForUF,
} from '@/data/electoralTactics';

import type { ConversionFrontId } from '@/data/electoralTactics';

interface RadarSectionProps {
  onNavigate: (section: AppSection) => void;
  canInstall?: boolean;
  onInstall?: () => void;
  memory?: AgenticWorkingMemory;
  onSelectState?: (uf: string, city?: string) => void;
  onGeneratePostFromTerritory?: (uf: string, city?: string) => void;
  onSelectFront?: (frontId: ConversionFrontId) => void;
  onOpenStudioWithPreset?: (preset: PostPresetData) => void;
  onNavigateToSimulator?: (frontId?: string, occupation?: string) => void;
}

export default function RadarSection({
  onNavigate,
  canInstall,
  onInstall,
  memory = {
    selectedUF: 'SP',
    profileTags: [],
    rejectionLevel: 2,
    familyFlags: {
      hasElderly: false,
      hasChildren: false,
      dependsSUS: false,
      receivesBenefit: false,
      hasPCD: false,
    },
    activeArgument: null,
    activeOpportunity: null,
    currentPreset: null,
    soundEnabled: true,
  },
  onSelectState,
  onGeneratePostFromTerritory,
  onSelectFront,
  onOpenStudioWithPreset,
  onNavigateToSimulator,
}: RadarSectionProps) {
  const [activeUF, setActiveUF] = useState<string>(memory.selectedUF || 'SP');

  const stateGeo = getStateByUF(activeUF) || BRAZIL_STATES_GEO[0];
  const stats = getStateStats(activeUF);
  const regionalTactic = getRegionalTacticForUF(activeUF);
  const nextStep = getSmartNextStepRecommendation(memory);

  const handleNav = (sec: AppSection) => {
    playProceduralHaptic('click');
    onNavigate(sec);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleStateClick = (geo: StateGeo) => {
    playProceduralHaptic('card');
    setActiveUF(geo.uf);
    if (onSelectState) {
      onSelectState(geo.uf, geo.capital);
    }
  };

  const handleSelectFrontAndGo = (frontId: ConversionFrontId) => {
    playProceduralHaptic('card');
    if (onSelectFront) {
      onSelectFront(frontId);
    }
    handleNav('perfil');
  };

  const handleSendTerritoryZap = () => {
    playProceduralHaptic('generate');
    if (onGeneratePostFromTerritory) {
      onGeneratePostFromTerritory(activeUF, stateGeo.capital);
    } else {
      handleNav('estudio');
    }
  };

  return (
    <section className="w-full max-w-7xl mx-auto px-4 py-6 md:py-8 animate-fade-in space-y-10">
      {/* ═══════════════════════════════════════════════════════════════
          HERO DE VANGUARDA EDITORIAL: O MAPA DO BRASIL NO CENTRO DE COMANDO
          Duas colunas equilibradas: Portais de Ação & Cartografia Interativa
          ═══════════════════════════════════════════════════════════════ */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-red-50/70 via-white to-amber-50/60 dark:from-[#131A29] dark:via-[#0E1524] dark:to-[#171A21] border border-slate-200/90 dark:border-slate-800 p-6 md:p-10 shadow-sm">
        {/* Arcos Geométricos Sutis de Concretismo */}
        <div className="absolute -right-24 -bottom-24 w-96 h-96 rounded-full border border-red-300/20 dark:border-red-900/10 pointer-events-none" />
        <div className="absolute -right-12 -bottom-12 w-64 h-64 rounded-full border border-amber-300/20 dark:border-amber-800/10 pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10">
          {/* ── COLUNA ESQUERDA: NARRATIVA & PORTAIS DE AÇÃO (6 COLUNAS) ── */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full mb-3 bg-red-100 dark:bg-red-950/60 border border-red-200 dark:border-red-800/40 text-[#C52229] dark:text-red-300 text-xs font-black tracking-wider uppercase shadow-2xs">
                <span>⭐</span>
                <span>Bora 13 • Guia Interativo do Diálogo Cidadão</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.12] mb-3">
                Vamos começar pelo&nbsp;que <br className="hidden sm:inline" />
                <span className="text-[#C52229] dark:text-red-400">importa para você</span>.
              </h1>

              <p className="text-sm md:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                Toque no seu estado no mapa ou escolha um caminho abaixo. Fatos auditados da vida real, preços de supermercado e roteiros com acolhimento para conversar sem briga:
              </p>
            </div>

            {/* ── 4 PORTAIS DE AÇÃO IMEDIATA (INTENÇÕES CLARAS) ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {/* Portal 1: Meu Estado */}
              <button
                type="button"
                onClick={() => handleNav('territorio')}
                className="p-4 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 hover:border-[#C52229] dark:hover:border-red-500 text-left transition-all shadow-2xs group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-2xl p-1.5 rounded-xl bg-red-50 dark:bg-red-950/40">🗺️</span>
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#C52229] bg-red-50 dark:bg-red-950/60 px-2 py-0.5 rounded-full">
                      {stateGeo.uf}
                    </span>
                  </div>
                  <h2 className="text-sm font-black text-slate-900 dark:text-white group-hover:text-[#C52229] transition-colors">
                    Explorar Meu Estado
                  </h2>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 font-medium">
                    Empregos do Caged, Farmácia Popular e o Pé-de-Meia em {stateGeo.name}.
                  </p>
                </div>
                <div className="mt-3 text-xs font-bold text-[#C52229] flex items-center gap-1">
                  <span>Ver {stateGeo.name}</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </button>

              {/* Portal 2: Fatos do Bolso */}
              <button
                type="button"
                onClick={() => handleNav('fatos')}
                className="p-4 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 text-left transition-all shadow-2xs group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-2xl p-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40">🥩</span>
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
                      Dados IBGE
                    </span>
                  </div>
                  <h2 className="text-sm font-black text-slate-900 dark:text-white group-hover:text-emerald-600 transition-colors">
                    Fatos do Seu Bolso
                  </h2>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 font-medium">
                    Preço da comida, botijão de gás e ganho real do salário mínimo (IBGE).
                  </p>
                </div>
                <div className="mt-3 text-xs font-bold text-emerald-600 flex items-center gap-1">
                  <span>Consultar Provas</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </button>

              {/* Portal 3: Como Dialogar */}
              <button
                type="button"
                onClick={() => handleNav('simulador')}
                className="p-4 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 hover:border-amber-500 text-left transition-all shadow-2xs group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-2xl p-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40">💬</span>
                    <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-full">
                      Sem Briga
                    </span>
                  </div>
                  <h2 className="text-sm font-black text-slate-900 dark:text-white group-hover:text-amber-600 transition-colors">
                    Como Dialogar
                  </h2>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 font-medium">
                    Treine como responder com calma a parentes, vizinhos e motoristas.
                  </p>
                </div>
                <div className="mt-3 text-xs font-bold text-amber-600 flex items-center gap-1">
                  <span>Treinar Diálogo</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </button>

              {/* Portal 4: Mandar no Zap */}
              <button
                type="button"
                onClick={() => handleNav('estudio')}
                className="p-4 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 hover:border-blue-500 text-left transition-all shadow-2xs group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-2xl p-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/40">📲</span>
                    <span className="text-[10px] font-black uppercase tracking-wider text-blue-700 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-full">
                      1 Toque
                    </span>
                  </div>
                  <h2 className="text-sm font-black text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                    Mandar no WhatsApp
                  </h2>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 font-medium">
                    Imagens 1080x1080 e mensagens prontas para enviar nos grupos.
                  </p>
                </div>
                <div className="mt-3 text-xs font-bold text-blue-600 flex items-center gap-1">
                  <span>Abrir Estúdio</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </button>
            </div>

            {/* ── BANNER DE CONTINUIDADE AGÊNTICA (PRÓXIMO PASSO INTELIGENTE) ── */}
            <div className="p-4 rounded-2xl bg-white/95 dark:bg-slate-900/95 border border-red-200/90 dark:border-red-900/40 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#C52229] animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#C52229] dark:text-red-300">
                    {nextStep.badge}
                  </span>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 font-medium leading-snug">
                  {nextStep.recommendationText}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => handleNav(nextStep.primaryAction.section)}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold bg-[#C52229] hover:bg-[#a51b21] text-white transition-all shadow-xs active:scale-95 flex items-center gap-1.5"
                >
                  <span>{nextStep.primaryAction.icon}</span>
                  <span>{nextStep.primaryAction.label}</span>
                </button>
              </div>
            </div>
          </div>

          {/* ── COLUNA DIREITA: MAPA DO BRASIL INTERATIVO + DOSSIÊ REGIONAL (6 COLUNAS) ── */}
          <div className="lg:col-span-6 flex flex-col items-center">
            {/* Header da Cartografia */}
            <div className="w-full flex items-center justify-between mb-2 px-1">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                  Cartografia Interativa
                </span>
                <span className="text-sm font-black text-slate-900 dark:text-white">
                  Selecione sua Região no Brasil
                </span>
              </div>
              <span className="text-xs font-bold text-[#C52229] bg-red-50 dark:bg-red-950/60 px-2.5 py-0.5 rounded-full border border-red-200 dark:border-red-800">
                {stateGeo.name} ({stateGeo.uf})
              </span>
            </div>

            {/* O MAPA SVG COM SELETOR EMBUTIDO */}
            <div className="w-full flex justify-center">
              <BrazilMap
                selectedState={activeUF}
                onSelectState={handleStateClick}
                className="w-full"
                showSelector={true}
                showRegions={true}
              />
            </div>

            {/* ── DOSSIÊ REGIONAL INSTANTÂNEO (CARD INTELIGENTE DO ESTADO SELECIONADO) ── */}
            <div className="w-full mt-4 p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3.5 transition-all">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    <span>Região {stateGeo.region}</span>
                    <span>•</span>
                    <span>Capital: {stateGeo.capital}</span>
                  </div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white leading-tight">
                    {stateGeo.name} ({stateGeo.uf})
                  </h3>
                </div>

                <div className="flex gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={handleSendTerritoryZap}
                    title={`Mandar dados de ${stateGeo.name} no WhatsApp`}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 shadow-2xs"
                  >
                    <span>📲</span>
                    <span className="hidden sm:inline">Mandar no Zap</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleNav('territorio')}
                    title="Ver detalhes completos do estado"
                    className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center gap-1 transition-all"
                  >
                    <span>🔍</span>
                    <span className="hidden sm:inline">Dossiê</span>
                  </button>
                </div>
              </div>

              {/* 3 Badges de Conquistas Reais Auditadas */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700">
                  <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block">
                    Empregos (Caged)
                  </span>
                  <span className="text-xs font-black text-slate-900 dark:text-white leading-tight block mt-0.5">
                    {stats.jobsCreated}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700">
                  <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block">
                    Farmácia Popular
                  </span>
                  <span className="text-xs font-black text-slate-900 dark:text-white leading-tight block mt-0.5">
                    {stats.farmaciaPopularBeneficiaries}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700">
                  <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block">
                    Pé-de-Meia (MEC)
                  </span>
                  <span className="text-xs font-black text-slate-900 dark:text-white leading-tight block mt-0.5">
                    {stats.pedeMeiaStudents}
                  </span>
                </div>
              </div>

              {/* Seletor Rápido de Cidades Polo no Estado */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                    🏙️ Cidades Polo em {stateGeo.name}:
                  </span>
                  <span className="text-[10px] font-bold text-[#C52229]">
                    Toque para personalizar
                  </span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {stateGeo.majorCities.slice(0, 5).map((city) => (
                    <button
                      key={city}
                      type="button"
                      onClick={() => {
                        playProceduralHaptic('click');
                        if (onSelectState) onSelectState(activeUF, city);
                        const el = document.getElementById('funil-virada');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="px-2 py-0.5 rounded-lg text-[11px] font-bold bg-slate-100 dark:bg-slate-800 hover:bg-red-50 hover:text-[#C52229] dark:hover:bg-red-950/40 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700 transition-all"
                    >
                      {city}
                    </button>
                  ))}
                </div>
              </div>

              {/* Botão de Ação Direta para o Funil Guiado */}
              <button
                type="button"
                onClick={() => {
                  playProceduralHaptic('generate');
                  const el = document.getElementById('funil-virada');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#C52229] to-[#991B1E] hover:from-[#a51b21] hover:to-[#7f1618] text-white font-black text-xs flex items-center justify-center gap-2 shadow-xs active:scale-98 transition-all"
              >
                <span>🎯</span>
                <span>Configurar Roteiro da Virada para {stateGeo.name} ↓</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          SEÇÃO 1.5: O FUNIL AGÊNTICO GUIADO (ESTADO → CIDADE → PERFIL → ARSENAL)
          O coração narrativo e operacional para criar o diálogo perfeito
          ═══════════════════════════════════════════════════════════════ */}
      <div id="funil-virada" className="scroll-mt-20">
        <TailoredMissionFunnel
          initialUF={activeUF}
          initialCity={memory?.selectedCity || stateGeo.capital}
          initialFrontId={memory?.activeFrontId || 'ex_lula'}
          initialOccupation={memory?.occupation}
          onSelectState={onSelectState}
          onSelectCity={(city) => {
            if (onSelectState) onSelectState(activeUF, city);
          }}
          onSelectFront={onSelectFront}
          onOpenStudio={onOpenStudioWithPreset}
          onOpenSimulator={(frontId, occupation) => {
            if (frontId && onSelectFront) onSelectFront(frontId as any);
            if (onNavigateToSimulator) {
              onNavigateToSimulator(frontId, occupation);
            } else {
              handleNav('simulador');
            }
          }}
        />
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          SEÇÃO 2: COM QUEM VOCÊ VAI CONVERSAR? (OS 4 PERFIS DE VOTO)
          Roteiros acolhedores sem briga nem ofensas
          ═══════════════════════════════════════════════════════════════ */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-red-100 dark:bg-red-950/60 text-[#C52229] dark:text-red-300 mb-1">
              <span>👥</span>
              <span>Com Quem Você Vai Falar?</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Escolha o Perfil e Veja Como Desarmar a Briga
            </h2>
            <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 font-medium">
              Não tente convencer fanáticos. Foque em quem tá indeciso, chateado com o mercado ou quem faltou no 1º turno:
            </p>
          </div>

          <button
            type="button"
            onClick={() => handleNav('perfil')}
            className="text-xs font-bold text-[#C52229] hover:underline flex items-center gap-1 shrink-0"
          >
            <span>Ver todos os roteiros</span>
            <span>→</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {CONVERSION_FRONTS.map((front) => (
            <div
              key={front.id}
              onClick={() => handleSelectFrontAndGo(front.id)}
              className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-[#C52229] dark:hover:border-red-500 transition-all cursor-pointer shadow-2xs flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-3xl p-2 rounded-2xl bg-red-50 dark:bg-red-950/40">
                    {front.icon}
                  </span>
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${front.badgeColor}`}>
                    {front.priority}
                  </span>
                </div>

                <div className="text-[10px] font-black text-[#C52229] dark:text-red-400 uppercase tracking-wider mb-0.5">
                  Perfil 0{front.number}
                </div>
                <h3 className="text-base font-black text-slate-900 dark:text-white group-hover:text-[#C52229] transition-colors leading-snug mb-1.5">
                  {front.title}
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed mb-3">
                  {front.subtitle}
                </p>

                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700 text-[11px] text-slate-700 dark:text-slate-300 font-medium">
                  <strong>💡 Dica de Ouro: </strong>
                  <span className="line-clamp-2">{front.goldenRule}</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-[#C52229]">
                <span>Ver o que falar sem briga</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          SEÇÃO 3: COMPARAÇÃO DO BOLSO ("O QUE ELES CORTAM")
          Contrastes factuais da vida real
          ═══════════════════════════════════════════════════════════════ */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-br from-amber-500/10 via-red-500/10 to-transparent border-2 border-amber-300 dark:border-amber-800/60 shadow-md">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-800">
              <span>📉</span>
              <span>Comparação do Bolso: O Que Eles Cortam</span>
            </div>
            <h3 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              A pessoa quer &ldquo;mais&rdquo;. Mostre que com Flávio ela vai ter &ldquo;MENOS&rdquo;.
            </h3>
            <p className="text-xs md:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
              Quem vive de salário e parcelou as compras quer saber do remédio da mãe, do salário mínimo e da folga na semana. Mostre o que o grupo de Flávio já cortou quando governou:
            </p>
          </div>

          <div className="flex flex-wrap gap-2 shrink-0">
            <button
              type="button"
              onClick={() => handleNav('perfil')}
              className="px-5 py-3 rounded-2xl bg-[#C52229] hover:bg-[#a51b21] text-white text-xs font-black flex items-center gap-2 shadow-md active:scale-95 transition-all"
            >
              <span>⚡</span>
              <span>Ver os 8 Fatos de Cortes</span>
            </button>
            <button
              type="button"
              onClick={() => handleNav('estudio')}
              className="px-4 py-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-white text-xs font-bold hover:bg-slate-100 transition-all flex items-center gap-1.5"
            >
              <span>📲</span>
              <span>Mandar no WhatsApp</span>
            </button>
          </div>
        </div>

        {/* 4 Pílulas Rápidas de Cortes com Flávio */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-6">
          {MENOS_COM_FLAVIO_FACTS.slice(0, 4).map((f) => (
            <div
              key={f.id}
              className="p-3.5 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-amber-200 dark:border-amber-800/40 text-xs space-y-1"
            >
              <div className="flex items-center gap-2">
                <span className="text-xl">{f.icon}</span>
                <span className="font-black text-[#C52229] dark:text-red-400 text-[11px]">
                  {f.highlight}
                </span>
              </div>
              <h4 className="font-bold text-slate-900 dark:text-white leading-snug">
                {f.title}
              </h4>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-2">
                {f.detail}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          SEÇÃO 4: FATOS REAIS DO BRASIL (PROVAS AUDITADAS DO BOLSO)
          Alimentos, emprego, salário e educação comprovados
          ═══════════════════════════════════════════════════════════════ */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <span>📊</span>
              <span>Fatos Reais do Brasil: O Que os Números Mostram</span>
            </h2>
            <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 font-medium">
              Alimentos, emprego e salário comprovados com fontes oficiais para você tirar dúvidas na hora.
            </p>
          </div>
          <button
            type="button"
            onClick={() => handleNav('fatos')}
            className="text-xs font-bold text-[#C52229] hover:underline flex items-center gap-1"
          >
            <span>Ver todas as provas</span>
            <span>→</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              icon: '🥩',
              tag: 'Comida & Alimentos',
              headline: 'Alimentos Essenciais em Queda',
              stat: 'Queda em 17 capitais',
              detail: 'Carnes de corte popular, óleo de soja e leite com preços estabilizados e caindo.',
              source: 'DIEESE & IBGE',
              color: 'border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/50 dark:bg-emerald-950/20',
              textColor: 'text-emerald-700 dark:text-emerald-300',
            },
            {
              icon: '💼',
              tag: 'Trabalho & Renda',
              headline: 'Mais Carteiras Assinadas',
              stat: '+2,5 Milhões de Vagas',
              detail: 'Menor taxa de desemprego em 10 anos, gerando vagas na indústria e nos serviços.',
              source: 'Caged / MTE',
              color: 'border-blue-200 dark:border-blue-900/50 bg-blue-50/50 dark:bg-blue-950/20',
              textColor: 'text-blue-700 dark:text-blue-300',
            },
            {
              icon: '💵',
              tag: 'Poder de Compra',
              headline: 'Salário Mínimo Acima da Inflação',
              stat: 'Aumento Real Garantido',
              detail: 'Fórmula de correção pelo PIB + inflação de volta, aumentando o poder de compra no mercado.',
              source: 'DIEESE',
              color: 'border-amber-200 dark:border-amber-900/50 bg-amber-50/50 dark:bg-amber-950/20',
              textColor: 'text-amber-700 dark:text-amber-300',
            },
            {
              icon: '🎓',
              tag: 'Educação dos Filhos',
              headline: 'Poupança Pé-de-Meia nas Escolas',
              stat: '4 Milhões de Jovens',
              detail: 'R$ 200 por mês mais bônus de R$ 1.000 por ano pro jovem terminar o ensino médio.',
              source: 'MEC & Caixa',
              color: 'border-purple-200 dark:border-purple-900/50 bg-purple-50/50 dark:bg-purple-950/20',
              textColor: 'text-purple-700 dark:text-purple-300',
            },
          ].map((item, i) => (
            <div
              key={i}
              className={`p-5 rounded-3xl border ${item.color} flex flex-col justify-between space-y-3 shadow-2xs`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">{item.icon}</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    {item.tag}
                  </span>
                </div>
                <div className={`text-base font-black ${item.textColor} mb-1`}>
                  {item.stat}
                </div>
                <h3 className="text-xs md:text-sm font-bold text-slate-900 dark:text-white leading-snug mb-1">
                  {item.headline}
                </h3>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                  {item.detail}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between text-[11px]">
                <span className="text-slate-500 dark:text-slate-400 font-semibold">{item.source}</span>
                <button
                  type="button"
                  onClick={() => handleNav('estudio')}
                  className="font-bold text-[#C52229] dark:text-red-300 hover:underline flex items-center gap-1"
                >
                  <span>Mandar no Zap</span>
                  <span>→</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
