'use client';

import React, { useState, useMemo } from 'react';
import { runEngine, type UserProfile } from '@/lib/engine';
import { searchOccupations, type Occupation } from '@/data/occupations';
import { type Argument } from '@/data/arguments';
import { getStateByUF } from '@/data/brazilGeo';
import type { Opportunity } from '@/data/opportunities';
import AudioPlayerButton from '@/components/AudioPlayerButton';
import { playProceduralHaptic } from '@/lib/agenticOrchestrator';
import {
  CONVERSION_FRONTS,
  MENOS_COM_FLAVIO_FACTS,
  type ConversionFront,
  type ConversionFrontId,
} from '@/data/electoralTactics';
import { copyToClipboardClean, openWhatsApp } from '@/lib/shareUtils';

interface ProfileSectionProps {
  profile: UserProfile;
  onUpdateProfile: (updated: UserProfile) => void;
  onGeneratePostFromArgument: (arg: Argument) => void;
  onGeneratePostFromOpportunity: (opp: Opportunity) => void;
  onGeneratePostFromConversionFront?: (front: ConversionFront) => void;
  onGeneratePostFromMenosFact?: (fact: (typeof MENOS_COM_FLAVIO_FACTS)[0]) => void;
  onNavigateToSimulator: () => void;
  activeFrontId?: ConversionFrontId;
  onSelectFront?: (frontId: ConversionFrontId) => void;
  selectedUF?: string;
  selectedCity?: string;
  onNavigateToTerritory?: () => void;
}

export default function ProfileSection({
  profile,
  onUpdateProfile,
  onGeneratePostFromArgument,
  onGeneratePostFromOpportunity,
  onGeneratePostFromConversionFront,
  onGeneratePostFromMenosFact,
  onNavigateToSimulator,
  activeFrontId = 'ex_lula',
  onSelectFront,
  selectedUF,
  selectedCity,
  onNavigateToTerritory,
}: ProfileSectionProps) {
  const currentUF = selectedUF || profile.state || 'SP';
  const currentCity = selectedCity || profile.city || 'São Paulo';
  const stateGeo = useMemo(() => getStateByUF(currentUF) || { name: 'São Paulo', uf: 'SP', capital: 'São Paulo' }, [currentUF]);

  const [occQuery, setOccQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedArg, setExpandedArg] = useState<string | null>(null);
  const [expandedMenosId, setExpandedMenosId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'tatico_4votos' | 'menos_com_flavio' | 'roteiro' | 'oportunidades'>('tatico_4votos');

  // Frente de conversão ativa (Padrão: Ex-Lula, o voto mais precioso do 2º turno)
  const currentFrontId = activeFrontId || 'ex_lula';
  const activeFront = useMemo(() => {
    return CONVERSION_FRONTS.find((f) => f.id === currentFrontId) || CONVERSION_FRONTS[0];
  }, [currentFrontId]);

  // Resultados calculados em tempo real pelo Decision Engine
  const engineResult = useMemo(() => {
    return runEngine(profile);
  }, [profile]);

  // Busca de ocupações
  const occupationSuggestions = useMemo(() => {
    if (!occQuery.trim()) return [];
    return searchOccupations(occQuery).slice(0, 6);
  }, [occQuery]);

  const handleSelectOccupation = (occ: Occupation) => {
    playProceduralHaptic('click');
    onUpdateProfile({
      ...profile,
      occupation: occ.label,
      profileTags: occ.tags,
    });
    setOccQuery('');
  };

  const handleFrontSelect = (frontId: ConversionFrontId) => {
    playProceduralHaptic('toggle');
    if (onSelectFront) {
      onSelectFront(frontId);
    }
  };

  const handleFamilyToggle = (flag: keyof UserProfile['familyFlags']) => {
    playProceduralHaptic('toggle');
    onUpdateProfile({
      ...profile,
      familyFlags: {
        ...profile.familyFlags,
        [flag]: !profile.familyFlags[flag],
      },
    });
  };

  const handleCopy = async (text: string, id: string) => {
    playProceduralHaptic('copy');
    const ok = await copyToClipboardClean(text);
    if (ok) {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const handleShareWhatsApp = (text: string) => {
    playProceduralHaptic('click');
    openWhatsApp(text);
  };

  return (
    <section className="w-full max-w-7xl mx-auto px-4 py-8 animate-fade-in space-y-8">
      {/* ── CABEÇALHO DA SESSÃO COM NARRATIVA DO 2º TURNO ── */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-red-100 dark:bg-red-950/60 text-[#C52229] dark:text-red-300 border border-red-200 dark:border-red-800/40 mb-2">
            <span>👥</span>
            <span>Passo 2 • Escolha com Quem Você Vai Conversar</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Como Falar com Cada Pessoa Sem Estresse
          </h2>
          <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 mt-1 max-w-3xl font-medium">
            Em vez de discutir ou tentar forçar a barra, entenda o cansaço da pessoa. Escolha o perfil dela abaixo para ver como responder com calma, o que jamais dizer e dados na ponta da língua.
          </p>
        </div>

        {/* Botão de Treino no Simulador */}
        <button
          onClick={() => {
            playProceduralHaptic('click');
            onNavigateToSimulator();
          }}
          className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs md:text-sm flex items-center gap-2 shadow-lg active:scale-95 transition-all shrink-0"
        >
          <span>💬</span>
          <span>Treinar Conversa Sem Brigar</span>
        </button>
      </div>

      {/* ── BARRA DE CONTEXTO TERRITORIAL ATIVO ── */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-red-50/80 via-white to-amber-50/50 dark:from-red-950/30 dark:via-slate-900 dark:to-amber-950/20 border border-red-200 dark:border-red-900/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 border border-red-200 dark:border-red-800 flex items-center justify-center text-xl shadow-2xs shrink-0">
            📍
          </div>
          <div>
            <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-[#C52229] dark:text-red-300">
              <span>Localização Ativa da Conversa:</span>
              <span className="px-1.5 py-0.2 rounded bg-red-100 dark:bg-red-900/60 text-[9px] font-black">{currentUF}</span>
            </div>
            <h3 className="text-base font-black text-slate-900 dark:text-white">
              {currentCity}, {stateGeo.name} ({currentUF})
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              O motor de decisão personaliza os dados de emprego, Pé-de-Meia e remédios para esta cidade.
            </p>
          </div>
        </div>

        {onNavigateToTerritory && (
          <button
            type="button"
            onClick={onNavigateToTerritory}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 transition-all shadow-2xs shrink-0"
          >
            <span>🗺️</span>
            <span>Mudar Estado / Cidade no Mapa</span>
          </button>
        )}
      </div>

      {/* ── GRID PRINCIPAL: 5 COLUNAS CONFIGURAÇÃO & 7 COLUNAS ARSENAL ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* COLUNA ESQUERDA: PERFIL DO INTERLOCUTOR & FRENTE DOS 4 NOMES (5 COLUNAS) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* Card 1: OS 5 PERFIS DE CONVERSÃO DO 2º TURNO */}
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border-2 border-red-200/90 dark:border-slate-800 shadow-sm space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-[#C52229] flex items-center gap-1.5">
                <span>⭐</span>
                <span>1. Quem é essa pessoa no 2º Turno? (Os 5 Perfis Decisivos)</span>
              </span>
            </div>

            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
              Cada grupo exige um afeto e um gatilho diferente. Escolha para destravar a abordagem:
            </p>

            <div className="space-y-2.5 pt-1">
              {CONVERSION_FRONTS.map((front) => {
                const isSelected = front.id === currentFrontId;
                return (
                  <button
                    key={front.id}
                    onClick={() => handleFrontSelect(front.id)}
                    className={`w-full p-3.5 rounded-2xl border text-left transition-all flex items-start gap-3 relative cursor-pointer ${
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
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border shrink-0 ${front.badgeColor}`}>
                          {front.priority}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug line-clamp-2">
                        {front.subtitle}
                      </p>

                      {/* Palavras-chave Visuais */}
                      {front.keywords && front.keywords.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {front.keywords.map((kw, i) => (
                            <span
                              key={i}
                              className={`text-[9px] font-bold px-2 py-0.5 rounded-md border ${
                                isSelected
                                  ? 'bg-red-100 dark:bg-red-900/40 text-[#C52229] dark:text-red-300 border-red-200 dark:border-red-800'
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                              }`}
                            >
                              {kw}
                            </span>
                          ))}
                        </div>
                      )}

                      <span className="text-[10px] font-bold text-[#C52229] dark:text-red-400 mt-1.5 block">
                        ⚡ {front.electoralWeight}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Card 2: Profissão do Interlocutor (Contexto Material) */}
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
              2. Profissão ou Ocupação (Onde a vida aperta)
            </span>

            {profile.occupation ? (
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/40">
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">💼</span>
                  <div>
                    <span className="text-xs font-black text-slate-900 dark:text-white block">
                      {profile.occupation}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      Foco de pauta: {profile.profileTags.join(', ')}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => onUpdateProfile({ ...profile, occupation: undefined, profileTags: [] })}
                  className="text-xs text-[#C52229] font-bold underline"
                >
                  Alterar
                </button>
              </div>
            ) : (
              <div>
                <input
                  type="text"
                  placeholder="Ex: Motorista de app, comerciante, professor, pedreiro..."
                  value={occQuery}
                  onChange={(e) => setOccQuery(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#C52229]"
                />

                {/* Sugestões Rápidas */}
                <div className="flex flex-wrap gap-1.5 mt-2.5">
                  {['Motorista de App', 'Professor(a)', 'Comerciante', 'Aposentado(a)', 'Entregador', 'Enfermeiro(a)'].map((p) => (
                    <button
                      key={p}
                      onClick={() => {
                        const match = searchOccupations(p)[0];
                        if (match) handleSelectOccupation(match);
                      }}
                      className="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-red-50 hover:text-[#C52229] transition-all"
                    >
                      {p}
                    </button>
                  ))}
                </div>

                {occupationSuggestions.length > 0 && (
                  <div className="mt-2 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm">
                    {occupationSuggestions.map((sug) => (
                      <button
                        key={sug.label}
                        onClick={() => handleSelectOccupation(sug)}
                        className="w-full text-left px-3.5 py-2 text-xs font-bold hover:bg-red-50 dark:hover:bg-red-950/30 text-slate-800 dark:text-slate-200 border-b last:border-b-0 border-slate-100 dark:border-slate-800 flex items-center justify-between"
                      >
                        <span>{sug.emoji} {sug.label}</span>
                        <span className="text-[10px] text-slate-400">{sug.category}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Card 3: Realidade da Família (Direitos em Risco) */}
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
              3. Direitos Familiares em Jogo
            </span>

            <div className="grid grid-cols-2 gap-2">
              {[
                { key: 'hasElderly', label: 'Idoso na família', icon: '🧓' },
                { key: 'dependsSUS', label: 'Usa remédios do SUS', icon: '💊' },
                { key: 'hasChildren', label: 'Filhos na escola pública', icon: '🎒' },
                { key: 'receivesBenefit', label: 'Bolsa Família / BPC', icon: '💳' },
                { key: 'hasPCD', label: 'Pessoa com deficiência', icon: '♿' },
              ].map((f) => {
                const isActive = profile.familyFlags[f.key as keyof UserProfile['familyFlags']];
                return (
                  <button
                    key={f.key}
                    onClick={() => handleFamilyToggle(f.key as keyof UserProfile['familyFlags'])}
                    className={`p-2.5 rounded-xl border text-left text-xs font-bold transition-all flex items-center gap-2 ${
                      isActive
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                    }`}
                  >
                    <span>{f.icon}</span>
                    <span className="text-[11px] leading-tight">{f.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* COLUNA DIREITA: ARSENAL DE CONVERSÃO & PROVAS REAIS (7 COLUNAS) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* Seletor de Abas Táticas */}
          <div className="flex gap-2 border-b border-slate-200 dark:border-slate-800 pb-3 overflow-x-auto no-scrollbar">
            {[
              { id: 'tatico_4votos', label: `🎯 Como Falar com Essa Pessoa`, icon: activeFront.icon },
              { id: 'menos_com_flavio', label: '📉 O Que Eles Cortam (8 Fatos)', icon: '⚡' },
              { id: 'roteiro', label: `💬 Guia da Profissão ${profile.occupation ? `(${profile.occupation})` : ''}`, icon: '👤' },
              { id: 'oportunidades', label: '🎒 Direitos & Conquistas', icon: '💡' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  playProceduralHaptic('toggle');
                  setActiveTab(tab.id as any);
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                  activeTab === tab.id
                    ? 'bg-[#C52229] text-white shadow-sm'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* ── ABA 1: ROTEIRO DOS 4 NOMES (NORMOSE & SABRINA FERNANDES) ── */}
          {activeTab === 'tatico_4votos' && (
            <div className="space-y-6">
              {/* Box de Diagnóstico & Regra de Ouro */}
              <div className="p-5 rounded-3xl bg-gradient-to-br from-red-50 via-white to-amber-50 dark:from-red-950/30 dark:via-slate-900 dark:to-slate-900 border border-red-200 dark:border-red-900/40 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black uppercase tracking-wider text-[#C52229] flex items-center gap-1.5">
                    <span>💡</span>
                    <span>Como Essa Pessoa Pensa: {activeFront.tag}</span>
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-900/60 text-[#C52229] dark:text-red-300">
                    Prioridade {activeFront.priority}
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-white/90 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700">
                  <span className="text-[11px] font-bold text-slate-500 block mb-0.5">
                    O que passa na cabeça dessa pessoa hoje:
                  </span>
                  <p className="text-xs md:text-sm font-semibold text-slate-800 dark:text-slate-200 italic">
                    {activeFront.mindsetQuote}
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-800 text-xs space-y-1">
                  <span className="font-black text-amber-900 dark:text-amber-200 uppercase tracking-wider text-[10px] block">
                    ⚡ Dica de Ouro que Não Falha:
                  </span>
                  <p className="font-semibold text-amber-950 dark:text-amber-100 leading-snug">
                    {activeFront.goldenRule}
                  </p>
                </div>

                {/* Botão de Geração de Post Direto da Frente */}
                <div className="flex justify-end pt-1">
                  <button
                    onClick={() => {
                      playProceduralHaptic('generate');
                      if (onGeneratePostFromConversionFront) {
                        onGeneratePostFromConversionFront(activeFront);
                      }
                    }}
                    className="px-4 py-2 rounded-xl bg-[#C52229] hover:bg-[#a51b21] text-white text-xs font-black flex items-center gap-2 shadow-sm transition-all"
                  >
                    <span>📲</span>
                    <span>Mandar Imagem com Essa Dica no Zap</span>
                  </button>
                </div>
              </div>

              {/* Roteiro Passo a Passo da Conversa */}
              <div className="space-y-4">
                <span className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 block">
                  Conversa Passo a Passo (O Que Falar):
                </span>

                {activeFront.conversationSteps.map((step) => (
                  <div
                    key={step.step}
                    className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-[#C52229] text-white text-xs font-black flex items-center justify-center">
                          {step.step}
                        </span>
                        <h4 className="text-sm font-black text-slate-900 dark:text-white">
                          {step.title}
                        </h4>
                      </div>
                      <span className="text-[10px] font-semibold text-slate-400">
                        {step.action}
                      </span>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/90 text-xs md:text-sm leading-relaxed text-slate-800 dark:text-slate-200 font-medium border border-slate-100 dark:border-slate-700">
                      {step.script}
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                      <AudioPlayerButton text={step.script} />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleCopy(step.script, `step-${step.step}`)}
                          className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 transition-all flex items-center gap-1"
                        >
                          {copiedId === `step-${step.step}` ? '✅ Copiado!' : '📋 Copiar Texto'}
                        </button>
                        <button
                          onClick={() => handleShareWhatsApp(step.script)}
                          className="px-3 py-1.5 rounded-lg bg-[#25D366] text-white text-xs font-bold flex items-center gap-1 shadow-sm active:scale-95"
                        >
                          <span>📲</span>
                          <span>Mandar no Zap</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* O que Falar vs O que Jamais Falar */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 space-y-2">
                  <span className="text-xs font-black text-emerald-800 dark:text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
                    <span>✅</span>
                    <span>O que Falar (Dá Muito Certo):</span>
                  </span>
                  <ul className="text-xs text-emerald-950 dark:text-emerald-100 space-y-1.5 list-disc pl-4 font-medium">
                    {activeFront.whatToSay.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-red-50/70 dark:bg-red-950/20 border border-red-200 dark:border-red-800/40 space-y-2">
                  <span className="text-xs font-black text-red-800 dark:text-red-300 uppercase tracking-wider flex items-center gap-1.5">
                    <span>🚫</span>
                    <span>O que Jamais Falar (Só Gera Briga):</span>
                  </span>
                  <ul className="text-xs text-red-950 dark:text-red-100 space-y-1.5 list-disc pl-4 font-medium">
                    {activeFront.whatNeverToSay.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* ── ABA 2: ARSENAL DO "MENOS COM FLÁVIO" (8 PROVAS DOCUMENTADAS) ── */}
          {activeTab === 'menos_com_flavio' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50">
                <span className="text-xs font-black text-amber-900 dark:text-amber-200 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                  <span>📉</span>
                  <span>A Tese Central do 2º Turno: Virar Voto é Mostrar o MENOS</span>
                </span>
                <p className="text-xs text-amber-900/90 dark:text-amber-100 leading-relaxed font-medium">
                  Quem pensa em votar na oposição quer <strong>MAIS</strong> (mais comida, mais folga). Não tente dourar a pílula. Mostre concretamente que com Flávio não vem mais: vem <strong>MENOS</strong> (cortes nos remédios, 4 anos sem ganho real, e contra o fim da 6x1).
                </p>
              </div>

              <div className="space-y-3">
                {MENOS_COM_FLAVIO_FACTS.map((fact) => (
                  <div
                    key={fact.id}
                    className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <span className="text-3xl">{fact.icon}</span>
                        <div>
                          <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-950 text-[#C52229] border border-red-200 dark:border-red-800">
                            {fact.highlight}
                          </span>
                          <h4 className="text-sm md:text-base font-black text-slate-900 dark:text-white mt-1">
                            {fact.title}
                          </h4>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          playProceduralHaptic('generate');
                          if (onGeneratePostFromMenosFact) {
                            onGeneratePostFromMenosFact(fact);
                          }
                        }}
                        className="px-3 py-1.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-[#C52229] dark:text-red-300 text-xs font-bold hover:bg-[#C52229] hover:text-white transition-all shrink-0 flex items-center gap-1.5"
                      >
                        <span>🎨</span>
                        <span>Postar</span>
                      </button>
                    </div>

                    <p className="text-xs md:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                      {fact.detail}
                    </p>

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                      <span className="text-[11px] text-slate-400 font-semibold">
                        Fonte: {fact.source}
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleCopy(`*${fact.title}*\n\n${fact.detail}\n\n📊 Fonte: ${fact.source}`, fact.id)}
                          className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs"
                        >
                          {copiedId === fact.id ? '✅ Copiado' : '📋 Copiar'}
                        </button>
                        <button
                          onClick={() => handleShareWhatsApp(`*${fact.title}*\n\n${fact.detail}\n\n📊 Fonte: ${fact.source}`)}
                          className="px-3 py-1 rounded-lg bg-[#25D366] text-white font-bold text-xs flex items-center gap-1"
                        >
                          <span>📲</span>
                          <span>Zap</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── ABA 3: ROTEIRO POR PROFISSÃO (LEGADO DO DECISION ENGINE) ── */}
          {activeTab === 'roteiro' && (
            <div className="space-y-6">
              {/* ETAPA 1: ACOLHIMENTO */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                    <span>💚</span>
                    <span>Etapa 1: Acolhimento Sem Julgamento</span>
                  </span>
                </div>

                <div className="space-y-3">
                  {engineResult.acolhimento.slice(0, 2).map((script) => (
                    <div
                      key={script.id}
                      className="p-5 rounded-3xl bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 shadow-sm"
                    >
                      <p className="text-xs md:text-sm leading-relaxed mb-4 text-emerald-950 dark:text-emerald-100 font-medium">
                        &ldquo;{script.text}&rdquo;
                      </p>

                      <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-emerald-200 dark:border-emerald-800/40">
                        <AudioPlayerButton text={script.text} />
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleCopy(script.text, script.id)}
                            className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-emerald-200 dark:border-emerald-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-emerald-100 transition-all"
                          >
                            {copiedId === script.id ? '✅ Copiado!' : '📋 Copiar'}
                          </button>
                          <button
                            onClick={() => handleShareWhatsApp(script.text)}
                            className="px-3 py-1.5 rounded-lg bg-[#25D366] text-white text-xs font-bold flex items-center gap-1 shadow-sm active:scale-95"
                          >
                            <span>📲</span>
                            <span>Zap</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ETAPA 2: PROVAS MATERIAIS */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#C52229] flex items-center gap-1.5">
                    <span>⚡</span>
                    <span>Etapa 2: A Prova Documentada</span>
                  </span>
                </div>

                <div className="space-y-4">
                  {engineResult.arguments.slice(0, 3).map((arg) => (
                    <div
                      key={arg.id}
                      className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <span className="text-3xl">{arg.emoji}</span>
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#C52229]">
                              {arg.category}
                            </span>
                            <h4 className="text-sm md:text-base font-black text-slate-900 dark:text-white leading-snug">
                              {arg.headline}
                            </h4>
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            playProceduralHaptic('generate');
                            onGeneratePostFromArgument(arg);
                          }}
                          className="px-3.5 py-1.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-[#C52229] dark:text-red-300 text-xs font-bold hover:bg-[#C52229] hover:text-white transition-all shrink-0 flex items-center gap-1.5 shadow-sm"
                        >
                          <span>🎨</span>
                          <span>Gerar Post</span>
                        </button>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 text-xs leading-relaxed text-slate-800 dark:text-slate-200 font-medium border border-slate-100 dark:border-slate-700">
                        {arg.scriptText}
                      </div>

                      {arg.counterArgument && (
                        <div className="pt-1">
                          <button
                            onClick={() => setExpandedArg(expandedArg === arg.id ? null : arg.id)}
                            className="text-xs font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1.5 hover:underline"
                          >
                            <span>{expandedArg === arg.id ? '▲ Fechar objeção' : '▼ O que retrucar se contestarem'}</span>
                          </button>

                          {expandedArg === arg.id && (
                            <div className="mt-2.5 p-3.5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 space-y-2 text-xs">
                              <div>
                                <span className="font-bold text-amber-800 dark:text-amber-300">🤔 O que costumam dizer: </span>
                                <span className="text-slate-700 dark:text-slate-300">&ldquo;{arg.counterArgument}&rdquo;</span>
                              </div>
                              <div>
                                <span className="font-bold text-emerald-700 dark:text-emerald-400">✅ A resposta documentada: </span>
                                <span className="text-slate-800 dark:text-slate-200 font-medium">{arg.rebuttal}</span>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
                        <span className="text-[11px] text-slate-500 font-semibold">{arg.sourceName}</span>
                        <div className="flex items-center gap-2">
                          <AudioPlayerButton text={arg.scriptText} />
                          <button
                            onClick={() => handleShareWhatsApp(`*${arg.headline}*\n\n${arg.scriptText}\n\n📊 Fonte: ${arg.sourceName}`)}
                            className="px-3 py-1 rounded-lg bg-[#25D366] text-white font-bold text-xs flex items-center gap-1"
                          >
                            <span>📲</span>
                            <span>Zap</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── ABA 4: DIREITOS & OPORTUNIDADES NO BOLSO ── */}
          {activeTab === 'oportunidades' && (
            <div className="space-y-4">
              {engineResult.opportunities.map((opp) => (
                <div
                  key={opp.id}
                  className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <span className="text-3xl">{opp.icon}</span>
                      <div>
                        <span className="badge-casa13">{opp.badge}</span>
                        <h4 className="text-sm md:text-base font-black text-slate-900 dark:text-white mt-1">
                          {opp.headline}
                        </h4>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        playProceduralHaptic('generate');
                        onGeneratePostFromOpportunity(opp);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-300 text-xs font-bold hover:bg-emerald-600 hover:text-white transition-all shrink-0 flex items-center gap-1.5"
                    >
                      <span>🎨</span>
                      <span>Gerar Post</span>
                    </button>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                    {opp.description}
                  </p>

                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs space-y-1.5">
                    <div>
                      <strong className="text-amber-700 dark:text-amber-400">🎯 Quem tem direito: </strong>
                      <span className="text-slate-700 dark:text-slate-300">{opp.whoIsEligible}</span>
                    </div>
                    <div>
                      <strong className="text-emerald-700 dark:text-emerald-400">👉 Como acessar: </strong>
                      <span className="text-slate-700 dark:text-slate-300">{opp.howToAccess}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <a
                      href={opp.actionUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-[#C52229] hover:underline"
                    >
                      🔗 {opp.actionLabel}
                    </a>
                    <button
                      onClick={() => handleShareWhatsApp(`*${opp.title}*\n\n${opp.headline}\n\n🎯 Quem tem direito: ${opp.whoIsEligible}\n👉 Como acessar: ${opp.howToAccess}\n\n🔗 ${opp.actionUrl}`)}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1"
                    >
                      <span>📲 Mandar no Zap</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
