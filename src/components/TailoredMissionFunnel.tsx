'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { BRAZIL_STATES_GEO, getStateByUF, type StateGeo } from '@/data/brazilGeo';
import {
  CONVERSION_FRONTS,
  MENOS_COM_FLAVIO_FACTS,
  getRegionalTacticForUF,
  type ConversionFront,
} from '@/data/electoralTactics';
import {
  createCustomizedConversationPlan,
  playProceduralHaptic,
  type TailoredConversationPlan,
  type PostPresetData,
} from '@/lib/agenticOrchestrator';

interface TailoredMissionFunnelProps {
  initialUF?: string;
  initialCity?: string;
  initialFrontId?: 'ex_lula' | 'terceira_via' | 'abstencao_70' | 'nulo_branco';
  initialOccupation?: string;
  onSelectState?: (uf: string, city?: string) => void;
  onSelectCity?: (city: string) => void;
  onSelectFront?: (frontId: 'ex_lula' | 'terceira_via' | 'abstencao_70' | 'nulo_branco') => void;
  onOpenStudio?: (preset: PostPresetData) => void;
  onOpenSimulator?: (frontId?: string, occupation?: string) => void;
  className?: string;
  title?: string;
  compact?: boolean;
}

const COMMON_OCCUPATIONS = [
  'Motorista de App',
  'Comerciante',
  'Professor(a)',
  'Pedreiro',
  'Enfermeiro(a)',
  'MEI / Autônomo',
  'CLT / Comércio',
  'Aposentado(a)',
];

export default function TailoredMissionFunnel({
  initialUF = 'SP',
  initialCity,
  initialFrontId = 'ex_lula',
  initialOccupation,
  onSelectState,
  onSelectCity,
  onSelectFront,
  onOpenStudio,
  onOpenSimulator,
  className = '',
  title = 'QG da Virada • Seu Roteiro Sob Medida em 3 Passos',
  compact = false,
}: TailoredMissionFunnelProps) {
  // ── ESTADO DO FUNIL ──
  const [activeUF, setActiveUF] = useState<string>(initialUF);
  const stateGeo = useMemo(() => getStateByUF(activeUF) || BRAZIL_STATES_GEO[0], [activeUF]);

  const [activeCity, setActiveCity] = useState<string>(
    initialCity || stateGeo.capital
  );
  const [cityInputCustom, setCityInputCustom] = useState<string>('');
  const [showCustomCityInput, setShowCustomCityInput] = useState<boolean>(false);

  const [activeFrontId, setActiveFrontId] = useState<'ex_lula' | 'terceira_via' | 'abstencao_70' | 'nulo_branco'>(
    initialFrontId
  );

  const [selectedOccupation, setSelectedOccupation] = useState<string | undefined>(
    initialOccupation
  );

  const [familyFlags, setFamilyFlags] = useState<{
    hasElderly: boolean;
    hasChildren: boolean;
    dependsSUS: boolean;
    receivesBenefit: boolean;
    hasPCD: boolean;
  }>({
    hasElderly: false,
    hasChildren: false,
    dependsSUS: false,
    receivesBenefit: false,
    hasPCD: false,
  });

  const [copiedZap, setCopiedZap] = useState<boolean>(false);
  const [copiedScript, setCopiedScript] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [activeTabSub, setActiveTabSub] = useState<'roteiro' | 'zap' | 'provas'>('roteiro');

  // Sincroniza se a UF externa mudar
  useEffect(() => {
    if (initialUF && initialUF !== activeUF) {
      setActiveUF(initialUF);
      const newGeo = getStateByUF(initialUF);
      if (newGeo) {
        const nextCity = initialCity || newGeo.capital;
        setActiveCity(nextCity);
      }
    }
  }, [initialUF, initialCity]);

  // Plano Sob Medida Gerado Dinamicamente
  const plan: TailoredConversationPlan = useMemo(() => {
    return createCustomizedConversationPlan(
      activeUF,
      activeCity,
      activeFrontId,
      selectedOccupation,
      familyFlags
    );
  }, [activeUF, activeCity, activeFrontId, selectedOccupation, familyFlags]);

  // Manipuladores de Estado e Cidade
  const handleCityPick = (cityName: string) => {
    playProceduralHaptic('click');
    setActiveCity(cityName);
    if (onSelectCity) onSelectCity(cityName);
    if (onSelectState) onSelectState(activeUF, cityName);
  };

  const handleApplyCustomCity = () => {
    if (!cityInputCustom.trim()) return;
    playProceduralHaptic('click');
    const trimmed = cityInputCustom.trim();
    setActiveCity(trimmed);
    setCityInputCustom('');
    setShowCustomCityInput(false);
    if (onSelectCity) onSelectCity(trimmed);
    if (onSelectState) onSelectState(activeUF, trimmed);
  };

  const handleFrontPick = (frontId: 'ex_lula' | 'terceira_via' | 'abstencao_70' | 'nulo_branco') => {
    playProceduralHaptic('toggle');
    setActiveFrontId(frontId);
    if (onSelectFront) onSelectFront(frontId);
  };

  const handleOccupationPick = (occ: string) => {
    playProceduralHaptic('click');
    setSelectedOccupation((prev) => (prev === occ ? undefined : occ));
  };

  const handleToggleFamily = (key: keyof typeof familyFlags) => {
    playProceduralHaptic('toggle');
    setFamilyFlags((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleCopyZap = async () => {
    playProceduralHaptic('copy');
    try {
      await navigator.clipboard.writeText(plan.whatsappScript);
      setCopiedZap(true);
      setTimeout(() => setCopiedZap(false), 2200);
    } catch {
      // Fallback
      const ta = document.createElement('textarea');
      ta.value = plan.whatsappScript;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopiedZap(true);
      setTimeout(() => setCopiedZap(false), 2200);
    }
  };

  const handleSendWhatsApp = () => {
    playProceduralHaptic('generate');
    const encoded = encodeURIComponent(plan.whatsappScript);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
  };

  const handleCopyScriptOnly = async () => {
    playProceduralHaptic('copy');
    const fullScript = `*⭐ ROTEIRO DE CONVERSA EM ${plan.locationLabel.toUpperCase()}*\n\n` +
      `💚 *COMO INICIAR (ACOLHIMENTO):*\n"${plan.acolhimentoHook}"\n\n` +
      `📊 *PROVAS DO BOLSO:*\n` +
      plan.localPocketFacts.map(f => `${f.icon} *${f.title}*: ${f.description}`).join('\n') +
      `\n\n🤔 *SE FALAR:* "${plan.objectionRebuttal.objection}"\n` +
      `✅ *O QUE RESPONDER:* ${plan.objectionRebuttal.rebuttal}\n\n` +
      `⚠️ *O MENOS COM FLÁVIO:* ${plan.retrocessoAlert.title} (${plan.retrocessoAlert.description})`;

    try {
      await navigator.clipboard.writeText(fullScript);
      setCopiedScript(true);
      setTimeout(() => setCopiedScript(false), 2200);
    } catch {
      // Fallback
    }
  };

  const handleCopyShareLink = async () => {
    playProceduralHaptic('copy');
    if (typeof window === 'undefined') return;
    const baseUrl = `${window.location.origin}${window.location.pathname}`;
    const params = new URLSearchParams();
    params.set('state', activeUF);
    if (activeCity) params.set('city', activeCity);
    if (activeFrontId) params.set('front', activeFrontId);
    if (selectedOccupation) params.set('occ', selectedOccupation);
    const shareUrl = `${baseUrl}?${params.toString()}`;

    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2200);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = shareUrl;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2200);
    }
  };

  return (
    <div
      className={`w-full bg-white dark:bg-[#0E1524] border border-red-200/90 dark:border-slate-800 rounded-3xl p-5 md:p-7 shadow-sm space-y-6 relative overflow-hidden transition-all ${className}`}
    >
      {/* Detalhes de Concretismo no Fundo */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-red-500/5 via-amber-500/5 to-transparent pointer-events-none rounded-full" />

      {/* ── CABEÇALHO DO FUNIL INTERATIVO ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800 relative z-10">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-red-100 dark:bg-red-950/60 text-[#C52229] dark:text-red-300 mb-1.5 shadow-2xs">
            <span>🎯</span>
            <span>Funil Guiado da Virada • Passo a Passo</span>
          </div>
          <h3 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {title}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Escolha o estado, a cidade e quem é a pessoa para gerar materiais e roteiros na medida certa.
          </p>
        </div>

        {/* Resumo Territorial Ativo */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="px-3.5 py-1.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/40 text-xs font-black text-[#C52229] dark:text-red-300 flex items-center gap-1.5 shadow-2xs">
            <span>📍</span>
            <span>{plan.locationLabel}</span>
          </div>
        </div>
      </div>

      {/* ── PASSO 1: ESCOLHA DA CIDADE NO ESTADO SELECIONADO ── */}
      <div className="space-y-2.5 relative z-10">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-full bg-[#C52229] text-white flex items-center justify-center text-[10px]">1</span>
            <span>Em qual cidade de {stateGeo.name} você vai conversar?</span>
          </span>
          <span className="text-[11px] font-bold text-slate-500">
            Capital: <strong>{stateGeo.capital}</strong>
          </span>
        </div>

        {/* Chips de Cidades Polo */}
        <div className="flex flex-wrap items-center gap-1.5">
          {stateGeo.majorCities.map((city) => {
            const isSelected = activeCity === city;
            return (
              <button
                key={city}
                type="button"
                onClick={() => handleCityPick(city)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                  isSelected
                    ? 'bg-[#C52229] text-white shadow-xs scale-102 ring-2 ring-[#C52229]/30'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700'
                }`}
              >
                <span>{city === stateGeo.capital ? '⭐' : '🏙️'}</span>
                <span>{city}</span>
              </button>
            );
          })}

          {/* Botão de Digitar Outra Cidade */}
          {!showCustomCityInput ? (
            <button
              type="button"
              onClick={() => setShowCustomCityInput(true)}
              className="px-3 py-1.5 rounded-xl text-xs font-bold border border-dashed border-slate-300 dark:border-slate-700 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:border-slate-400 transition-all flex items-center gap-1"
            >
              <span>➕</span>
              <span>Outro município...</span>
            </button>
          ) : (
            <div className="flex items-center gap-1.5 animate-fade-in">
              <input
                type="text"
                placeholder="Nome da cidade..."
                value={cityInputCustom}
                onChange={(e) => setCityInputCustom(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleApplyCustomCity()}
                className="px-3 py-1 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#C52229]"
                autoFocus
              />
              <button
                type="button"
                onClick={handleApplyCustomCity}
                className="px-2.5 py-1 bg-[#C52229] text-white text-xs font-bold rounded-lg shadow-2xs hover:bg-[#a51b21]"
              >
                Definir
              </button>
              <button
                type="button"
                onClick={() => setShowCustomCityInput(false)}
                className="text-xs text-slate-400 hover:text-slate-600 px-1"
              >
                ✕
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── PASSO 2: QUEM É ESSA PESSOA EM {activeCity}? (AS 4 FRENTES + FILTROS) ── */}
      <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800 relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <span className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-full bg-[#C52229] text-white flex items-center justify-center text-[10px]">2</span>
            <span>Quem é essa pessoa no 2º Turno? (A Lista dos 4 Votos)</span>
          </span>
          <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400">
            ⚡ Método 2º Turno Normose & Sabrina Fernandes
          </span>
        </div>

        {/* Grid das 4 Frentes de Conversão */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {CONVERSION_FRONTS.map((front) => {
            const isSelected = activeFrontId === front.id;
            return (
              <button
                key={front.id}
                type="button"
                onClick={() => handleFrontPick(front.id)}
                className={`p-3.5 rounded-2xl border text-left transition-all relative flex items-start gap-3 ${
                  isSelected
                    ? 'border-[#C52229] bg-gradient-to-r from-red-50/90 to-amber-50/40 dark:from-red-950/50 dark:to-slate-900 shadow-md ring-2 ring-[#C52229]/40'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-slate-300'
                }`}
              >
                <span className="text-2xl shrink-0 mt-0.5">{front.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <span className="text-xs font-black text-slate-900 dark:text-white truncate">
                      {front.number}. {front.title}
                    </span>
                    <span className={`text-[9px] font-black px-2 py-0.5 rounded-full border shrink-0 ${front.badgeColor}`}>
                      {front.priority}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug line-clamp-2">
                    {front.subtitle}
                  </p>
                  <span className="text-[10px] font-bold text-[#C52229] dark:text-red-400 mt-1 block">
                    ⚡ {front.electoralWeight}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Filtros Opcionais de Refinamento (Profissão & Família) */}
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <span>💼</span>
              <span>Ocupação da Pessoa (Opcional — Toca no Bolso):</span>
            </span>
            {selectedOccupation && (
              <button
                type="button"
                onClick={() => setSelectedOccupation(undefined)}
                className="text-[10px] text-red-600 font-bold hover:underline"
              >
                Limpar profissão
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-1.5">
            {COMMON_OCCUPATIONS.map((occ) => (
              <button
                key={occ}
                type="button"
                onClick={() => handleOccupationPick(occ)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                  selectedOccupation === occ
                    ? 'bg-red-600 text-white shadow-2xs'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-slate-300'
                }`}
              >
                {occ}
              </button>
            ))}
          </div>

          {/* Flags Familiares */}
          <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex flex-wrap gap-2">
            {[
              { key: 'hasChildren' as const, label: 'Tem filhos na escola (Pé-de-Meia)', icon: '🎒' },
              { key: 'hasElderly' as const, label: 'Idoso em casa', icon: '🧓' },
              { key: 'dependsSUS' as const, label: 'Usa remédios do SUS', icon: '💊' },
              { key: 'receivesBenefit' as const, label: 'Bolsa Família / BPC', icon: '💳' },
            ].map((f) => {
              const active = familyFlags[f.key];
              return (
                <button
                  key={f.key}
                  type="button"
                  onClick={() => handleToggleFamily(f.key)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1.5 ${
                    active
                      ? 'bg-emerald-600 text-white shadow-2xs'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <span>{f.icon}</span>
                  <span>{f.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── PASSO 3: O ARSENAL SOB MEDIDA GERADO (MUNIÇÃO EXATA PARA ESSE CASO) ── */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-4 relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">3</span>
              <span>Arsenal Sob Medida para Conversar em {plan.locationLabel}</span>
            </span>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Roteiro testado, provas no bolso e mensagem formatada para WhatsApp:
            </p>
          </div>

          {/* Abas Rápidas do Arsenal */}
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl gap-1 shrink-0">
            <button
              type="button"
              onClick={() => {
                playProceduralHaptic('click');
                setActiveTabSub('roteiro');
              }}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                activeTabSub === 'roteiro'
                  ? 'bg-white dark:bg-slate-900 text-[#C52229] shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              💬 Roteiro de Conversa
            </button>
            <button
              type="button"
              onClick={() => {
                playProceduralHaptic('click');
                setActiveTabSub('zap');
              }}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                activeTabSub === 'zap'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              📲 Mensagem Zap Pronta
            </button>
          </div>
        </div>

        {/* ── CONTEÚDO DA ABA SELECIONADA ── */}
        {activeTabSub === 'roteiro' && (
          <div className="space-y-3.5 animate-fade-in">
            {/* Bloco 1: Acolhimento & O Que Jamais Dizer */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-red-50/70 to-amber-50/50 dark:from-red-950/30 dark:to-slate-900 border border-red-200 dark:border-red-900/40 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black uppercase tracking-wider text-[#C52229] dark:text-red-300 flex items-center gap-1.5">
                  <span>💚</span>
                  <span>Como Iniciar a Conversa (Os Primeiros 30 Segundos):</span>
                </span>
                <span className="text-[10px] font-bold text-amber-800 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/60 px-2 py-0.5 rounded-full">
                  Sem Julgar
                </span>
              </div>

              <blockquote className="text-xs md:text-sm font-medium text-slate-800 dark:text-slate-200 italic leading-relaxed border-l-2 border-[#C52229] pl-3 py-1">
                &ldquo;{plan.acolhimentoHook}&rdquo;
              </blockquote>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-[11px]">
                <div className="p-2.5 rounded-xl bg-white/90 dark:bg-slate-900/90 border border-emerald-200 dark:border-emerald-800/40">
                  <strong className="text-emerald-700 dark:text-emerald-400 block mb-0.5">
                    💡 Regra de Ouro:
                  </strong>
                  <span className="text-slate-700 dark:text-slate-300">{plan.goldenRule}</span>
                </div>

                <div className="p-2.5 rounded-xl bg-white/90 dark:bg-slate-900/90 border border-red-200 dark:border-red-800/40">
                  <strong className="text-red-700 dark:text-red-400 block mb-0.5">
                    ⚠️ O Que NUNCA Dizer:
                  </strong>
                  <span className="text-slate-700 dark:text-slate-300">{plan.whatNeverToSay}</span>
                </div>
              </div>
            </div>

            {/* Bloco 2: As 3 Provas do Bolso em {activeCity} */}
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2.5">
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                <span>📊</span>
                <span>Provas Concretas para Quem Vive em {plan.locationLabel}:</span>
              </span>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                {plan.localPocketFacts.map((fact, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 flex flex-col justify-between space-y-1.5"
                  >
                    <div>
                      <div className="flex items-center gap-1.5 text-xs font-black text-slate-900 dark:text-white mb-1">
                        <span className="text-base">{fact.icon}</span>
                        <span>{fact.title}</span>
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-snug">
                        {fact.description}
                      </p>
                    </div>
                    <span className="text-[9px] font-bold text-slate-400 block pt-1 border-t border-slate-200/50 dark:border-slate-700/50">
                      Fonte: {fact.source}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bloco 3: Bate-Pronto da Objeção & O Risco do Retrocesso */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Objeção */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-700 dark:text-amber-400 flex items-center gap-1">
                  <span>🤔</span>
                  <span>Se a Pessoa Disser:</span>
                </span>
                <p className="text-xs font-bold text-slate-900 dark:text-white leading-snug">
                  &ldquo;{plan.objectionRebuttal.objection}&rdquo;
                </p>
                <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 text-[11px] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                  <strong className="text-emerald-600 dark:text-emerald-400 block mb-0.5">
                    ✅ O que responder com calma:
                  </strong>
                  <span>{plan.objectionRebuttal.rebuttal}</span>
                </div>
              </div>

              {/* Risco do Retrocesso */}
              <div className="p-4 rounded-2xl bg-red-50/60 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-wider text-red-700 dark:text-red-400 flex items-center gap-1">
                    <span>⚠️</span>
                    <span>O Que a Família Perde com a Oposição:</span>
                  </span>
                  <span className="text-xs font-black text-red-600 bg-red-100 dark:bg-red-900/60 px-2 py-0.5 rounded-full">
                    {plan.retrocessoAlert.statNumber}
                  </span>
                </div>
                <h4 className="text-xs font-black text-slate-900 dark:text-white">
                  {plan.retrocessoAlert.title}
                </h4>
                <p className="text-[11px] text-slate-700 dark:text-slate-300 leading-snug font-medium">
                  {plan.retrocessoAlert.description}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ── ABA DE MENSAGEM DO WHATSAPP PRONTA ── */}
        {activeTabSub === 'zap' && (
          <div className="space-y-3 animate-fade-in">
            <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl">📲</span>
                  <div>
                    <span className="text-xs font-black text-emerald-900 dark:text-emerald-300 block">
                      Mensagem Pronta para WhatsApp ({plan.locationLabel})
                    </span>
                    <span className="text-[10px] text-slate-500">
                      Formatação com negrito, fontes checadas e tom afetuoso sem confronto.
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopyZap}
                    className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 text-slate-700 dark:text-slate-200 text-xs font-bold border border-slate-200 dark:border-slate-700 shadow-2xs flex items-center gap-1"
                  >
                    <span>{copiedZap ? '✓' : '📋'}</span>
                    <span>{copiedZap ? 'Copiado!' : 'Copiar'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleSendWhatsApp}
                    className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-xs active:scale-95 transition-all flex items-center gap-1.5"
                  >
                    <span>🚀</span>
                    <span>Abrir no Zap</span>
                  </button>
                </div>
              </div>

              {/* Prévia da Mensagem Formatada */}
              <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-emerald-200/80 dark:border-emerald-800/40 text-xs text-slate-800 dark:text-slate-200 whitespace-pre-wrap font-sans leading-relaxed select-all">
                {plan.whatsappScript}
              </div>
            </div>
          </div>
        )}

        {/* ── BARRA DE AÇÕES INTEGRADAS DO FUNIL ── */}
        <div className="flex flex-col sm:flex-row items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          {/* Ação 1: Mandar no Zap Direto */}
          <button
            type="button"
            onClick={handleSendWhatsApp}
            className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm active:scale-95 transition-all"
          >
            <span>📲</span>
            <span>Mandar Mensagem de {plan.city} no WhatsApp</span>
          </button>

          {/* Ação 2: Gerar Post no Estúdio */}
          {onOpenStudio && (
            <button
              type="button"
              onClick={() => {
                playProceduralHaptic('generate');
                onOpenStudio(plan.preset);
              }}
              className="w-full sm:w-auto py-3 px-4 rounded-xl bg-[#C52229] hover:bg-[#a51b21] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm active:scale-95 transition-all shrink-0"
            >
              <span>🎨</span>
              <span>Criar Card & Carrossel deste Perfil</span>
            </button>
          )}

          {/* Ação 3: Treinar no Simulador */}
          {onOpenSimulator && (
            <button
              type="button"
              onClick={() => {
                playProceduralHaptic('click');
                onOpenSimulator(plan.frontId, plan.occupation);
              }}
              className="w-full sm:w-auto py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-sm active:scale-95 transition-all shrink-0"
            >
              <span>💬</span>
              <span>Treinar Conversa</span>
            </button>
          )}

          {/* Ação 4: Copiar Roteiro */}
          <button
            type="button"
            onClick={handleCopyScriptOnly}
            title="Copiar roteiro completo em texto"
            className="w-full sm:w-auto py-3 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-all shrink-0"
          >
            <span>{copiedScript ? '✓' : '📋'}</span>
            <span>{copiedScript ? 'Copiado!' : 'Copiar Dossiê'}</span>
          </button>

          {/* Ação 5: Compartilhar Link deste Perfil */}
          <button
            type="button"
            onClick={handleCopyShareLink}
            title="Copiar link direto para este perfil e cidade"
            className="w-full sm:w-auto py-3 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-all shrink-0"
          >
            <span>{copiedLink ? '✓' : '🔗'}</span>
            <span>{copiedLink ? 'Link Copiado!' : 'Compartilhar Link'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
