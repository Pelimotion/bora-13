'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { BRAZIL_STATES_GEO, getStateByUF, type StateGeo } from '@/data/brazilGeo';
import {
  CONVERSION_FRONTS,
  MENOS_COM_FLAVIO_FACTS,
  type ConversionFront,
  type ConversionFrontId,
} from '@/data/electoralTactics';
import {
  createCustomizedConversationPlan,
  playProceduralHaptic,
  type TailoredConversationPlan,
  type PostPresetData,
} from '@/lib/agenticOrchestrator';
import {
  IconStar,
  IconPrepare,
  IconDojo,
  IconExplore,
  IconStudio,
  IconShield,
  IconCheck,
  IconArrowRight,
  IconMapPin,
  IconUser,
  IconEducation,
  IconHealth,
  IconEconomy,
  IconCopy,
  IconShareWhatsApp,
} from '@/components/icons/CasaIcons';
import { copyToClipboardClean, openWhatsApp, cleanTextForSharing } from '@/lib/shareUtils';

interface TailoredMissionFunnelProps {
  initialUF?: string;
  initialCity?: string;
  initialFrontId?: ConversionFrontId;
  initialOccupation?: string;
  onSelectState?: (uf: string, city?: string) => void;
  onSelectCity?: (city: string) => void;
  onSelectFront?: (frontId: ConversionFrontId) => void;
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
  title = 'Guia do Diálogo • Seu Roteiro Sob Medida em 3 Passos',
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

  const [activeFrontId, setActiveFrontId] = useState<ConversionFrontId>(
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
  const [activeTabSub, setActiveTabSub] = useState<'roteiro' | 'zap'>('roteiro');

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

  const handleFrontPick = (frontId: ConversionFrontId) => {
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
    const ok = await copyToClipboardClean(plan.whatsappScript);
    if (ok) {
      setCopiedZap(true);
      setTimeout(() => setCopiedZap(false), 2200);
    }
  };

  const handleSendWhatsApp = () => {
    playProceduralHaptic('generate');
    openWhatsApp(plan.whatsappScript);
  };

  const handleCopyScriptOnly = async () => {
    playProceduralHaptic('copy');
    const fullScript = `*⭐ ROTEIRO CIDADAO DE DIALOGO EM ${plan.locationLabel.toUpperCase()} (INICIATIVA INDEPENDENTE)*\n\n` +
      `*1. COMO INICIAR (ACOLHIMENTO):*\n"${plan.acolhimentoHook}"\n\n` +
      `*2. PROVAS DO BOLSO:*\n` +
      plan.localPocketFacts.map(f => `* ${f.title}: ${f.description}`).join('\n') +
      `\n\n*3. SE A PESSOA FALAR:* "${plan.objectionRebuttal.objection}"\n` +
      `*O QUE RESPONDER:* ${plan.objectionRebuttal.rebuttal}\n\n` +
      `*4. O RISCO DO RETROCESSO:* ${plan.retrocessoAlert.title} (${plan.retrocessoAlert.description})\n\n` +
      `Iniciativa popular independente e voluntaria - Feita para somar na causa - Dados publicos auditados`;

    const ok = await copyToClipboardClean(fullScript);
    if (ok) {
      setCopiedScript(true);
      setTimeout(() => setCopiedScript(false), 2200);
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

    const ok = await copyToClipboardClean(shareUrl);
    if (ok) {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2200);
    }
  };

  return (
    <div
      className={`w-full bg-white dark:bg-[#0E1524] border border-red-200/90 dark:border-slate-800 rounded-3xl p-5 md:p-8 shadow-sm space-y-7 relative overflow-hidden transition-all ${className}`}
    >
      {/* ── CABEÇALHO DO FUNIL INTERATIVO ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800 relative z-10">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-red-100 dark:bg-red-950/60 text-[#C52229] dark:text-red-300 mb-1.5 shadow-2xs">
            <IconStar className="w-3.5 h-3.5 text-[#C52229]" />
            <span>Guia Cidadão • Passo a Passo da Conversa</span>
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
            <IconMapPin className="w-3.5 h-3.5 text-[#C52229]" />
            <span>{plan.locationLabel}</span>
          </div>
        </div>
      </div>

      {/* ── PASSO 1: ESCOLHA DA CIDADE NO ESTADO SELECIONADO ── */}
      <div className="space-y-3 relative z-10">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-[#C52229] text-white flex items-center justify-center text-xs font-black">1</span>
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
            const isCapital = city === stateGeo.capital;
            return (
              <button
                key={city}
                type="button"
                onClick={() => handleCityPick(city)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? 'bg-[#C52229] text-white shadow-xs scale-102 ring-2 ring-[#C52229]/30'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700'
                }`}
              >
                {isCapital ? (
                  <IconStar className={`w-3 h-3 ${isSelected ? 'text-[#FFE234]' : 'text-amber-500'}`} />
                ) : (
                  <IconMapPin className={`w-3 h-3 ${isSelected ? 'text-white' : 'text-slate-400'}`} />
                )}
                <span>{city}</span>
              </button>
            );
          })}

          {/* Botão de Digitar Outra Cidade */}
          {!showCustomCityInput ? (
            <button
              type="button"
              onClick={() => setShowCustomCityInput(true)}
              className="px-3 py-1.5 rounded-xl text-xs font-bold border border-dashed border-slate-300 dark:border-slate-700 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:border-slate-400 transition-all flex items-center gap-1 cursor-pointer"
            >
              <span>+ Outro município</span>
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
                className="px-2.5 py-1 bg-[#C52229] text-white text-xs font-bold rounded-lg shadow-2xs hover:bg-[#a51b21] cursor-pointer"
              >
                Definir
              </button>
              <button
                type="button"
                onClick={() => setShowCustomCityInput(false)}
                className="text-xs text-slate-400 hover:text-slate-600 px-1 cursor-pointer"
              >
                ✕
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── PASSO 2: QUEM É ESSA PESSOA EM {activeCity}? (AS 4 FRENTES + FILTROS) ── */}
      <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800 relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <span className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-[#C52229] text-white flex items-center justify-center text-xs font-black">2</span>
            <span>Quem é essa pessoa? (Perfil de Diálogo)</span>
          </span>
          <span className="text-[11px] font-bold text-slate-500">
            Frentes Prioritárias
          </span>
        </div>

        {/* Grid dos 5 Perfis Estratégicos de Diálogo */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {CONVERSION_FRONTS.map((front) => {
            const isSelected = activeFrontId === front.id;
            return (
              <button
                key={front.id}
                type="button"
                onClick={() => handleFrontPick(front.id)}
                className={`p-4 rounded-2xl border text-left transition-all relative flex flex-col justify-between gap-2.5 cursor-pointer ${
                  isSelected
                    ? 'border-[#C52229] bg-red-50/80 dark:bg-red-950/40 shadow-md ring-2 ring-[#C52229]/40 scale-[1.01]'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-slate-300 hover:shadow-xs'
                }`}
              >
                <div className="flex items-start justify-between gap-2 w-full">
                  <div className="flex items-center gap-2">
                    <span className="text-xl shrink-0">{front.icon}</span>
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center font-black text-[10px] shrink-0 ${
                      isSelected ? 'bg-[#C52229] text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}>
                      {front.number}
                    </span>
                    <span className="text-xs font-black text-slate-900 dark:text-white line-clamp-1">
                      {front.title}
                    </span>
                  </div>

                  <span className={`text-[9px] font-black px-2 py-0.5 rounded-full border shrink-0 ${front.badgeColor}`}>
                    {front.priority}
                  </span>
                </div>

                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug line-clamp-2">
                  {front.subtitle}
                </p>

                {/* Palavras-chave Visuais Intuitivas */}
                {front.keywords && front.keywords.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {front.keywords.slice(0, 3).map((kw, i) => (
                      <span
                        key={i}
                        className={`text-[9px] font-bold px-2 py-0.5 rounded-md border ${
                          isSelected
                            ? 'bg-red-100/80 dark:bg-red-900/40 text-[#C52229] dark:text-red-300 border-red-200/60 dark:border-red-800/50'
                            : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 border-slate-200/60 dark:border-slate-700/60'
                        }`}
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800/60 w-full">
                  <span className="text-[10px] font-bold text-[#C52229] dark:text-red-400 truncate">
                    {front.tag}
                  </span>
                  {isSelected && (
                    <span className="text-[10px] font-black px-1.5 py-0.2 rounded bg-[#C52229] text-white shrink-0">
                      Selecionado ✓
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Filtros Opcionais de Refinamento (Profissão & Família) */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
              <IconUser className="w-3.5 h-3.5 text-slate-500" />
              <span>Ocupação da Pessoa (Toca no Bolso):</span>
            </span>
            {selectedOccupation && (
              <button
                type="button"
                onClick={() => setSelectedOccupation(undefined)}
                className="text-[10px] text-[#C52229] font-bold hover:underline cursor-pointer"
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
                className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                  selectedOccupation === occ
                    ? 'bg-[#C52229] text-white shadow-2xs'
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
              { key: 'hasChildren' as const, label: 'Filhos na escola (Pé-de-Meia)', icon: <IconEducation className="w-3.5 h-3.5" /> },
              { key: 'hasElderly' as const, label: 'Idoso em casa', icon: <IconUser className="w-3.5 h-3.5" /> },
              { key: 'dependsSUS' as const, label: 'Usa remédios do SUS', icon: <IconHealth className="w-3.5 h-3.5" /> },
              { key: 'receivesBenefit' as const, label: 'Bolsa Família / BPC', icon: <IconEconomy className="w-3.5 h-3.5" /> },
            ].map((f) => {
              const active = familyFlags[f.key];
              return (
                <button
                  key={f.key}
                  type="button"
                  onClick={() => handleToggleFamily(f.key)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    active
                      ? 'bg-emerald-600 text-white shadow-2xs'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {f.icon}
                  <span>{f.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── PASSO 3: O ROTEIRO SOB MEDIDA GERADO ── */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-4 relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-black">3</span>
              <span>Roteiro de Conversa em {plan.locationLabel}</span>
            </span>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Argumentos do dia a dia, provas do bolso e mensagem pronta para o WhatsApp:
            </p>
          </div>

          {/* Abas Rápidas do Roteiro */}
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl gap-1 shrink-0">
            <button
              type="button"
              onClick={() => {
                playProceduralHaptic('click');
                setActiveTabSub('roteiro');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTabSub === 'roteiro'
                  ? 'bg-white dark:bg-slate-900 text-[#C52229] shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              <IconDojo className="w-3.5 h-3.5" />
              <span>Roteiro de Conversa</span>
            </button>
            <button
              type="button"
              onClick={() => {
                playProceduralHaptic('click');
                setActiveTabSub('zap');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTabSub === 'zap'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              <IconShareWhatsApp className="w-3.5 h-3.5 text-white" />
              <span>Mensagem pro Zap</span>
            </button>
          </div>
        </div>

        {/* ── CONTEÚDO DA ABA SELECIONADA ── */}
        {activeTabSub === 'roteiro' && (
          <div className="space-y-4 animate-fade-in">
            {/* Bloco 1: Acolhimento & O Que Jamais Dizer */}
            <div className="p-5 rounded-2xl bg-red-50/60 dark:bg-red-950/30 border border-red-200 dark:border-red-900/40 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black uppercase tracking-wider text-[#C52229] dark:text-red-300 flex items-center gap-1.5">
                  <IconCheck className="w-4 h-4 text-emerald-600" />
                  <span>Como Iniciar a Conversa (Acolhimento):</span>
                </span>
                <span className="text-[10px] font-bold text-amber-800 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/60 px-2 py-0.5 rounded-full">
                  Sem Julgar
                </span>
              </div>

              <blockquote className="text-xs md:text-sm font-medium text-slate-800 dark:text-slate-200 italic leading-relaxed border-l-2 border-[#C52229] pl-3 py-1">
                &ldquo;{plan.acolhimentoHook}&rdquo;
              </blockquote>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 text-[11px]">
                <div className="p-3 rounded-xl bg-white/90 dark:bg-slate-900/90 border border-emerald-200 dark:border-emerald-800/40">
                  <strong className="text-emerald-700 dark:text-emerald-400 block mb-0.5 flex items-center gap-1">
                    <IconStar className="w-3 h-3 text-emerald-600" />
                    <span>Regra de Ouro:</span>
                  </strong>
                  <span className="text-slate-700 dark:text-slate-300">{plan.goldenRule}</span>
                </div>

                <div className="p-3 rounded-xl bg-white/90 dark:bg-slate-900/90 border border-red-200 dark:border-red-800/40">
                  <strong className="text-red-700 dark:text-red-400 block mb-0.5 flex items-center gap-1">
                    <IconShield className="w-3 h-3 text-red-600" />
                    <span>O Que NUNCA Dizer:</span>
                  </strong>
                  <span className="text-slate-700 dark:text-slate-300">{plan.whatNeverToSay}</span>
                </div>
              </div>
            </div>

            {/* Bloco 2: As 3 Provas do Bolso em {activeCity} */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                <IconShield className="w-4 h-4 text-slate-600" />
                <span>Provas Concretas em {plan.locationLabel}:</span>
              </span>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {plan.localPocketFacts.map((fact, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 flex flex-col justify-between space-y-2"
                  >
                    <div>
                      <div className="text-xs font-black text-slate-900 dark:text-white mb-1">
                        {fact.title}
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
                  <IconDojo className="w-3.5 h-3.5 text-amber-600" />
                  <span>Se a Pessoa Disser:</span>
                </span>
                <p className="text-xs font-bold text-slate-900 dark:text-white leading-snug">
                  &ldquo;{plan.objectionRebuttal.objection}&rdquo;
                </p>
                <div className="p-3 rounded-xl bg-white dark:bg-slate-800 text-[11px] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                  <strong className="text-emerald-600 dark:text-emerald-400 block mb-0.5 flex items-center gap-1">
                    <IconCheck className="w-3 h-3 text-emerald-600" />
                    <span>O que responder com calma:</span>
                  </strong>
                  <span>{plan.objectionRebuttal.rebuttal}</span>
                </div>
              </div>

              {/* Risco do Retrocesso */}
              <div className="p-4 rounded-2xl bg-red-50/60 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-wider text-red-700 dark:text-red-400 flex items-center gap-1">
                    <IconShield className="w-3.5 h-3.5 text-red-600" />
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
            <div className="p-5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <IconShareWhatsApp className="w-5 h-5 text-emerald-600" />
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
                    className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 text-slate-700 dark:text-slate-200 text-xs font-bold border border-slate-200 dark:border-slate-700 shadow-2xs flex items-center gap-1.5 cursor-pointer"
                  >
                    {copiedZap ? <IconCheck className="w-3.5 h-3.5 text-emerald-600" /> : <IconCopy className="w-3.5 h-3.5" />}
                    <span>{copiedZap ? 'Copiado!' : 'Copiar'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleSendWhatsApp}
                    className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-xs active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <IconShareWhatsApp className="w-3.5 h-3.5 text-white" />
                    <span>Abrir no Zap</span>
                  </button>
                </div>
              </div>

              {/* Prévia da Mensagem Formatada */}
              <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-emerald-200/80 dark:border-emerald-800/40 text-xs text-slate-800 dark:text-slate-200 whitespace-pre-wrap font-sans leading-relaxed select-all">
                {plan.whatsappScript}
              </div>
            </div>
          </div>
        )}

        {/* ── BARRA DE AÇÕES INTEGRADAS DO FUNIL ── */}
        <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
          {/* Ação 1: Mandar no Zap Direto */}
          <button
            type="button"
            onClick={handleSendWhatsApp}
            className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm active:scale-95 transition-all cursor-pointer"
          >
            <IconShareWhatsApp className="w-4 h-4 text-white" />
            <span>Enviar Mensagem de {plan.city} no WhatsApp</span>
          </button>

          {/* Ação 2: Gerar Post no Estúdio */}
          {onOpenStudio && (
            <button
              type="button"
              onClick={() => {
                playProceduralHaptic('generate');
                onOpenStudio(plan.preset);
              }}
              className="w-full sm:w-auto py-3 px-4 rounded-xl bg-[#C52229] hover:bg-[#a51b21] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm active:scale-95 transition-all shrink-0 cursor-pointer"
            >
              <IconStudio className="w-4 h-4 text-white" />
              <span>Criar Card 1080p deste Perfil</span>
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
              className="w-full sm:w-auto py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-bold text-xs flex items-center justify-center gap-2 shadow-sm active:scale-95 transition-all shrink-0 cursor-pointer"
            >
              <IconDojo className="w-4 h-4" />
              <span>Treinar Conversa</span>
            </button>
          )}

          {/* Ação 4: Copiar Roteiro */}
          <button
            type="button"
            onClick={handleCopyScriptOnly}
            title="Copiar roteiro completo em texto"
            className="w-full sm:w-auto py-3 px-3.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-all shrink-0 cursor-pointer"
          >
            {copiedScript ? <IconCheck className="w-3.5 h-3.5 text-emerald-600" /> : <IconCopy className="w-3.5 h-3.5" />}
            <span>{copiedScript ? 'Copiado!' : 'Copiar Dossiê'}</span>
          </button>

          {/* Ação 5: Compartilhar Link deste Perfil */}
          <button
            type="button"
            onClick={handleCopyShareLink}
            title="Copiar link direto para este perfil e cidade"
            className="w-full sm:w-auto py-3 px-3.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-all shrink-0 cursor-pointer"
          >
            {copiedLink ? <IconCheck className="w-3.5 h-3.5 text-emerald-600" /> : <IconCopy className="w-3.5 h-3.5" />}
            <span>{copiedLink ? 'Link Copiado!' : 'Compartilhar Link'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
