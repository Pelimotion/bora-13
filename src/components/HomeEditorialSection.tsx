'use client';

import React from 'react';
import type { AppSection, AgenticWorkingMemory, PostPresetData } from '@/lib/agenticOrchestrator';
import {
  playProceduralHaptic,
  getStateStats,
} from '@/lib/agenticOrchestrator';
import { getStateByUF, BRAZIL_STATES_GEO } from '@/data/brazilGeo';
import { CONVERSION_FRONTS, type ConversionFrontId } from '@/data/electoralTactics';
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
  IconShareWhatsApp,
  IconSmartphone,
} from '@/components/icons/CasaIcons';
import TerritoryMapHud from '@/components/TerritoryMapHud';

interface HomeEditorialSectionProps {
  onNavigate: (section: AppSection) => void;
  memory: AgenticWorkingMemory;
  onResetContext?: () => void;
  canInstall?: boolean;
  onInstall?: () => void;
  onOpenShortcutGuide?: () => void;
  onSelectFront?: (frontId: ConversionFrontId) => void;
  onOpenStudioWithPreset?: (preset: PostPresetData) => void;
  onSelectState?: (uf: string, city?: string) => void;
  initialOpenDossier?: boolean;
}

export default function HomeEditorialSection({
  onNavigate,
  memory,
  onResetContext,
  canInstall,
  onInstall,
  onOpenShortcutGuide,
  onSelectFront,
  onOpenStudioWithPreset,
  onSelectState,
  initialOpenDossier = false,
}: HomeEditorialSectionProps) {
  const activeUF = memory.selectedUF || 'SP';
  const stateGeo = getStateByUF(activeUF) || BRAZIL_STATES_GEO[0];
  const activeCity = memory.selectedCity || stateGeo.capital;
  const stats = getStateStats(activeUF);

  const hasSavedContext = Boolean(
    memory.selectedUF || memory.occupation || memory.activeFrontId
  );

  const activeFront = CONVERSION_FRONTS.find((f) => f.id === memory.activeFrontId);

  const handleNav = (sec: AppSection) => {
    playProceduralHaptic('click');
    onNavigate(sec);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <section className="w-full max-w-6xl mx-auto px-4 py-6 md:py-10 animate-fade-in space-y-12">
      {/* ═══════════════════════════════════════════════════════════════
          1. HERO EDITORIAL BORA 13: INICIATIVA CIDADÃ & AUTENTICIDADE
          Vermelho vibrante (#B32428 / #C52229), fotografia documental real
          ═══════════════════════════════════════════════════════════════ */}
      <div
        style={{
          background: 'linear-gradient(135deg, #A81B20 0%, #C52229 50%, #8E1418 100%)',
        }}
        className="relative overflow-hidden rounded-3xl text-white shadow-xl"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-6 sm:p-10 lg:p-12 relative z-10">
          {/* LADO ESQUERDO: MENSAGEM POLÍTICA & AÇÃO */}
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-white text-xs font-black tracking-wider uppercase">
              <IconStar className="w-3.5 h-3.5 text-[#FFE234]" />
              <span>Bora 13 • Iniciativa Cidadã • Feita pra Somar</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-black tracking-tight leading-[1.1] text-white">
              Bora 13. O guia de conversa <br />
              <span className="text-[#FFE234]">para virar voto no dia a dia.</span>
            </h1>

            <p className="text-base sm:text-lg text-red-50 font-normal leading-relaxed max-w-xl">
              Feito pra quem acorda cedo e rala todo dia. Encontre argumentos reais sobre comida no prato, aumento real do salário, remédios de graça e fim da escala 6x1 — pra conversar com calma, sem briga, com a família, no trabalho ou no zap.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => handleNav('preparar')}
                className="px-6 py-3.5 rounded-2xl bg-white hover:bg-red-50 text-[#C52229] font-black text-sm shadow-lg hover:shadow-xl transition-all active:scale-95 flex items-center gap-2.5 cursor-pointer"
              >
                <IconPrepare className="w-4 h-4 text-[#C52229]" />
                <span>Montar Meu Roteiro (3 Passos)</span>
                <IconArrowRight className="w-4 h-4 text-[#C52229]" />
              </button>

              <button
                type="button"
                onClick={() => handleNav('treinar')}
                className="px-5 py-3.5 rounded-2xl bg-white/15 hover:bg-white/25 text-white font-bold text-sm border border-white/30 backdrop-blur-sm transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
              >
                <IconDojo className="w-4 h-4 text-white" />
                <span>Treinar Conversa</span>
              </button>
            </div>
          </div>

          {/* LADO DIREITO: FOTOGRAFIA DOCUMENTAL BRASILEIRA REAL */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border-2 border-white/25 shadow-2xl group">
              <img
                src="/bora/images/hero-dialogue.jpg"
                alt="Brasileiros em conversa comunitária acolhedora"
                className="w-full h-72 sm:h-80 object-cover object-center group-hover:scale-102 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

              <div className="absolute bottom-3 left-3 right-3 p-3 rounded-xl bg-black/50 backdrop-blur-md border border-white/20 text-white">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[11px] font-black uppercase tracking-wider text-emerald-300">
                    Acolhimento & Fatos Reais
                  </span>
                </div>
                <p className="text-xs text-white/95 mt-0.5 font-medium leading-snug">
                  Conversar olho no olho sobre comida na mesa, farmácia popular e salário digno.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          AVISO DE POSICIONAMENTO: INICIATIVA INDEPENDENTE / NÃO OFICIAL
          ═══════════════════════════════════════════════════════════════ */}
      <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 flex items-start gap-3.5 shadow-xs">
        <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300 flex items-center justify-center shrink-0 mt-0.5">
          <IconShield className="w-4 h-4" />
        </div>
        <div className="space-y-1 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-black uppercase tracking-wider text-amber-950 dark:text-amber-200 text-[11px]">
              Aviso de Transparência Cidadã
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-200/80 dark:bg-amber-900/80 text-amber-900 dark:text-amber-200 font-black uppercase">
              Iniciativa Não Oficial • Feita pra Somar
            </span>
          </div>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
            Esta ferramenta <strong>não é oficial</strong>, não pertence ao Partido dos Trabalhadores (PT) e nem à Casa 13. Trata-se de uma <strong>iniciativa independente, popular e voluntária</strong>, feita para somar na causa e municiar apoiadores e eleitores com roteiros de diálogo acolhedores e fatos econômicos auditados de fontes públicas oficiais (IBGE, DIEESE, Caged, Banco Central, MEC e MS).
          </p>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          2. BLOCO DE RETOMADA: "CONTINUAR DE ONDE PAREI"
          Preserva o contexto do usuário em 3 camadas de memória
          ═══════════════════════════════════════════════════════════════ */}
      {hasSavedContext && (
        <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border-2 border-red-100 dark:border-red-900/40 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#C52229] animate-pulse" />
              <span className="text-[11px] font-black uppercase tracking-wider text-[#C52229] dark:text-red-300">
                Sua Preparação Salva
              </span>
            </div>
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              Território ativo:
              <span className="font-black text-[#C52229] ml-1.5 inline-flex items-center gap-1">
                <IconMapPin className="w-3.5 h-3.5 inline" />
                {activeCity} ({activeUF})
              </span>
              {memory.occupation && (
                <span className="text-slate-600 dark:text-slate-400 font-medium inline-flex items-center gap-1 ml-2">
                  • <IconUser className="w-3.5 h-3.5 inline" /> {memory.occupation}
                </span>
              )}
              {activeFront && (
                <span className="text-slate-600 dark:text-slate-400 font-medium ml-2">
                  • Frente: {activeFront.title}
                </span>
              )}
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => handleNav('preparar')}
              style={{ backgroundColor: '#C52229' }}
              className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl text-white text-xs font-black shadow-xs hover:opacity-95 transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Retomar Roteiro</span>
              <IconArrowRight className="w-3.5 h-3.5" />
            </button>
            {onResetContext && (
              <button
                type="button"
                onClick={onResetContext}
                title="Limpar memória e começar novo território"
                className="px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Limpar
              </button>
            )}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          3. RADAR TERRITORIAL CIDADÃO: MAPA INTERATIVO & HUD EM TEMPO REAL
          Passo 1 do Guia: fácil de clicar em mobile e desktop, poucos itens
          ═══════════════════════════════════════════════════════════════ */}
      <TerritoryMapHud
        activeUF={activeUF}
        activeCity={activeCity}
        onSelectState={(uf, city) => onSelectState?.(uf, city)}
        onNavigate={handleNav}
        initialOpenDossier={initialOpenDossier}
      />

      {/* ═══════════════════════════════════════════════════════════════
          4. TRILHAS PRÁTICAS DO MOVIMENTO: 3 PILARES SEM SOBRECARGA
          Roteiro Sob Medida • Dojô de Diálogo • Estúdio Criativo
          ═══════════════════════════════════════════════════════════════ */}
      <div className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-black uppercase tracking-wider">
            <IconStar className="w-3.5 h-3.5 text-[#C52229]" />
            <span>Ferramentas de Apoio</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Tudo o que você precisa, <span className="text-[#C52229]">em um só lugar.</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 font-normal">
            Escolha como prefere atuar hoje: preparando seu roteiro, treinando respostas ou criando peças visuais para as redes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* CARD 1: PREPARAÇÃO DE DIÁLOGO (CARD VERMELHO RUBRO) */}
          <div
            style={{
              background: 'linear-gradient(135deg, #B32428 0%, #C52229 100%)',
            }}
            className="rounded-3xl text-white p-7 flex flex-col justify-between shadow-lg relative overflow-hidden group"
          >
            <div className="space-y-4 relative z-10">
              <span className="inline-block bg-white text-[#C52229] text-xs font-black uppercase tracking-wider px-3.5 py-1 rounded-full shadow-xs">
                Guia em 3 Passos
              </span>

              <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Preparar Roteiro Sob Medida
              </h3>

              <p className="text-xs sm:text-sm text-red-50 leading-relaxed font-normal">
                Selecione o perfil do seu interlocutor (motorista, comerciante, idoso, jovem) e receba roteiros acolhedores, dados do bolso e respostas para objeções.
              </p>

              <div className="space-y-1.5 pt-1 text-xs font-bold text-white/95">
                <div className="flex items-center gap-2">
                  <IconCheck className="w-3.5 h-3.5 text-[#FFE234]" />
                  <span>Acolhimento sem discussão</span>
                </div>
                <div className="flex items-center gap-2">
                  <IconCheck className="w-3.5 h-3.5 text-[#FFE234]" />
                  <span>Texto para Zap em 1 clique</span>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-white/20 relative z-10">
              <button
                type="button"
                onClick={() => handleNav('preparar')}
                className="w-full px-5 py-3 rounded-xl bg-white hover:bg-red-50 text-[#C52229] font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all active:scale-95 shadow-md cursor-pointer"
              >
                <span>Montar Roteiro</span>
                <IconArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* CARD 2: COMO RESPONDER NO DIA A DIA (CARD CLARO / CONVERSA SEM BRIGA) */}
          <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-7 flex flex-col justify-between shadow-xs group hover:border-slate-300 transition-all">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-red-50 dark:bg-red-950/40 text-[#C52229] dark:text-red-400 flex items-center justify-center shadow-inner">
                <IconDojo className="w-6 h-6" />
              </div>

              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-[#C52229] block mb-1">
                  Treino de Conversa
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  Como Responder no Dia a Dia
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                  Treine o que falar nas conversas mais comuns (almoço de família, pausa do trabalho, com o motorista ou no zap) e descubra como desarmar boatos com respeito e argumentos certeiros pro bolso.
                </p>
              </div>

              <div className="space-y-1.5 pt-1 text-xs text-slate-600 dark:text-slate-300 font-bold">
                <div className="flex items-center gap-2">
                  <IconCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Sem briga nem sermão</span>
                </div>
                <div className="flex items-center gap-2">
                  <IconCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Dicas diretas pro bolso</span>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => handleNav('treinar')}
                className="w-full py-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all active:scale-98 cursor-pointer"
              >
                <span>Treinar Respostas</span>
                <IconArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* CARD 3: ESTÚDIO CRIATIVO VISUAL (CARD ESCURO EDITORIAL) */}
          <div className="rounded-3xl bg-[#0F1626] border border-slate-800 text-white p-7 flex flex-col justify-between shadow-lg relative overflow-hidden group">
            <div className="space-y-4">
              <span className="inline-block bg-white/20 text-white text-xs font-black uppercase tracking-wider px-3.5 py-1 rounded-full border border-white/20">
                Estúdio 1080p
              </span>

              <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Criador de Peças Visuais
              </h3>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                Crie carrosséis de 5 atos para o Instagram e posts de alta resolução direto no navegador via Canvas 2D, sem depender de programas pesados.
              </p>

              <div className="space-y-1.5 pt-1 text-xs text-slate-300 font-bold">
                <div className="flex items-center gap-2">
                  <IconStar className="w-3.5 h-3.5 text-[#FFE234]" />
                  <span>Formatos Feed (1:1) e Stories (9:16)</span>
                </div>
                <div className="flex items-center gap-2">
                  <IconStar className="w-3.5 h-3.5 text-[#FFE234]" />
                  <span>Exportação PNG rápida e ZIP</span>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-slate-800">
              <button
                type="button"
                onClick={() => handleNav('estudio')}
                style={{ backgroundColor: '#C52229' }}
                className="w-full py-3 rounded-xl text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all active:scale-95 shadow-md hover:opacity-95 cursor-pointer"
              >
                <IconStudio className="w-4 h-4 text-white" />
                <span>Abrir Estúdio Criativo</span>
                <IconArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          4. FEATURE SHOWCASE COM FOTO SMARTPHONE: "PREPARE-SE PARA A CONVERSA"
          Espelha a seção "Prepare-se para o dia da votação" da Casa 13
          ═══════════════════════════════════════════════════════════════ */}
      <div className="rounded-3xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-8 sm:p-12">
          {/* LADO ESQUERDO: TEXTO EDITORIAL */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 dark:bg-red-950/60 text-[#C52229] dark:text-red-300 text-xs font-black uppercase tracking-wider">
              <IconStar className="w-3 h-3 text-[#C52229]" />
              <span>Direto no Celular</span>
            </div>

            <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
              Tenha em mãos os dados certos para o <span className="text-[#C52229]">momento do diálogo.</span>
            </h3>

            <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
              Chega de discussões acaloradas que não levam a nada. O Bora 13 organiza a colinha da esperança com dados concretos de cada estado: empregos gerados, famílias no Bolsa Família, estudantes no Pé-de-Meia e remédios gratuitos.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-red-100 dark:bg-red-950/60 text-[#C52229] flex items-center justify-center shrink-0 mt-0.5 font-black text-xs">
                  1
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">Escolha o Território</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Dados específicos da sua cidade e estado para dar credibilidade imediata.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-red-100 dark:bg-red-950/60 text-[#C52229] flex items-center justify-center shrink-0 mt-0.5 font-black text-xs">
                  2
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">Selecione o Perfil do Ouvinte</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Adequação de linguagem: com trabalhador autônomo, fala-se de renda; com pais, fala-se de educação.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-red-100 dark:bg-red-950/60 text-[#C52229] flex items-center justify-center shrink-0 mt-0.5 font-black text-xs">
                  3
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">Compartilhe no WhatsApp</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Mensagens pré-formatadas prontas para envio individual ou em grupos.</p>
                </div>
              </div>
            </div>

            <div className="pt-4 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => {
                  if (onOpenShortcutGuide) onOpenShortcutGuide();
                  else handleNav('preparar');
                }}
                style={{ backgroundColor: '#C52229' }}
                className="px-6 py-3 rounded-xl text-white font-black text-sm flex items-center gap-2 shadow-sm hover:opacity-95 transition-all active:scale-95 cursor-pointer"
              >
                <IconSmartphone className="w-4 h-4 text-white" />
                <span>Salvar Atalho na Tela do Celular</span>
                <IconArrowRight className="w-4 h-4 text-white" />
              </button>

              <button
                type="button"
                onClick={() => handleNav('preparar')}
                className="px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-sm transition-all active:scale-95 cursor-pointer"
              >
                <span>Ver Roteiros de Conversa</span>
              </button>
            </div>
          </div>

          {/* LADO DIREITO: FOTO REALISTA DO SMARTPHONE EM MÃOS */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative rounded-2xl overflow-hidden border-2 border-slate-200 dark:border-slate-700 shadow-xl max-w-sm">
              <img
                src="/bora/images/phone-showcase.jpg"
                alt="Bora 13 aberto em smartphone no café comunitário"
                className="w-full h-auto object-cover"
              />
              <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-wider border border-white/20">
                100% Mobile Ready
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          5. BANNER DE OFICINA CIDADÃ & MOBILIZAÇÃO
          Com foto autêntica de ativistas em mesa de trabalho coletivo
          ═══════════════════════════════════════════════════════════════ */}
      <div className="relative rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-md">
        <img
          src="/bora/images/campaign-workshop.jpg"
          alt="Jovens brasileiros organizando materiais da campanha"
          className="w-full h-72 sm:h-96 object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/30 flex items-center p-8 sm:p-14">
          <div className="max-w-xl space-y-4 text-white">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600 text-white text-xs font-black uppercase tracking-wider shadow-sm">
              <IconStar className="w-3.5 h-3.5 text-white" />
              <span>Mobilização Coletiva</span>
            </div>

            <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight leading-tight">
              Os argumentos certos para cada momento da campanha.
            </h3>

            <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-normal">
              Diálogo se constrói com empatia, escuta e segurança. Compartilhe roteiros e crie materiais visuais com os fatos auditados que comprovam a reconstrução do país.
            </p>

            <div className="pt-2 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => handleNav('estudio')}
                className="px-5 py-3 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-black text-xs shadow-md transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
              >
                <IconStudio className="w-4 h-4 text-[#C52229]" />
                <span>Criar Peça para Redes</span>
              </button>

              <button
                type="button"
                onClick={() => handleNav('explorar')}
                className="px-5 py-3 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs border border-white/30 backdrop-blur-sm transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
              >
                <IconExplore className="w-4 h-4 text-white" />
                <span>Consultar Fatos do Estado</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          6. RIGOR & TRANSPARÊNCIA INSTITUCIONAL
          ═══════════════════════════════════════════════════════════════ */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200/90 dark:border-slate-800 text-center space-y-2 shadow-xs">
        <div className="flex items-center justify-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
          <IconShield className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span className="uppercase tracking-wider">Fontes Públicas Oficiais Auditadas</span>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Esta plataforma é uma <strong>iniciativa popular e independente</strong>, sem vínculo oficial com o PT ou com a Casa 13. Todos os indicadores econômicos e sociais apresentados são extraídos de registros públicos: IBGE, DIEESE, Banco Central do Brasil, Ministério do Trabalho (Caged), Ministério da Educação e Ministério da Saúde. Distribuição 100% gratuita e livre.
        </p>
      </div>
    </section>
  );
}
