'use client';

import React from 'react';
import type { AppSection, AgenticWorkingMemory } from '@/lib/agenticOrchestrator';
import { playProceduralHaptic } from '@/lib/agenticOrchestrator';
import { CONVERSION_FRONTS } from '@/data/electoralTactics';

interface VisualJourneyStepperProps {
  currentSection: AppSection;
  onSelectSection: (section: AppSection) => void;
  memory: AgenticWorkingMemory;
  compact?: boolean;
}

interface StepDef {
  id: AppSection;
  stepNumber: string;
  shortTitle: string;
  headline: string;
  detail: string;
  icon: string;
  tacticalBadge: string;
}

const STEPS: StepDef[] = [
  {
    id: 'territorio',
    stepNumber: '01',
    shortTitle: 'Meu Estado',
    headline: 'Onde Você Mora?',
    detail: 'Veja o que o governo já fez na sua região e como ajudar a levar mais gente para votar.',
    icon: '🗺️',
    tacticalBadge: 'Dica do Seu Estado',
  },
  {
    id: 'perfil',
    stepNumber: '02',
    shortTitle: 'Com Quem Falar',
    headline: 'Quem Você Vai Convencer?',
    detail: 'Escolha quem tá em dúvida: o parente desiludido com os preços, o idoso ou quem anulou.',
    icon: '👥',
    tacticalBadge: '4 Perfis Comuns',
  },
  {
    id: 'simulador',
    stepNumber: '03',
    shortTitle: 'Como Conversar',
    headline: 'O Que Falar Sem Brigar?',
    detail: 'Aprenda a concordar primeiro, ouvir com calma e mostrar a verdade sem estresse na família.',
    icon: '💬',
    tacticalBadge: 'Treino Prático',
  },
  {
    id: 'estudio',
    stepNumber: '04',
    shortTitle: 'Mandar no Zap',
    headline: 'O Que Enviar no Zap?',
    detail: 'Imagens com números do prato e do salário e mensagens prontas para copiar e mandar no privado.',
    icon: '📲',
    tacticalBadge: 'Mensagens Prontas',
  },
];

export default function VisualJourneyStepper({
  currentSection,
  onSelectSection,
  memory,
  compact = false,
}: VisualJourneyStepperProps) {
  // Encontra o passo correspondente ou padrão
  const currentStepIndex = STEPS.findIndex((s) => s.id === currentSection);
  const activeIndex = currentStepIndex !== -1 ? currentStepIndex : 0;
  const nextStep = activeIndex < STEPS.length - 1 ? STEPS[activeIndex + 1] : null;

  const activeFront = CONVERSION_FRONTS.find((f) => f.id === memory.activeFrontId);

  const handleStepClick = (stepId: AppSection) => {
    playProceduralHaptic('click');
    onSelectSection(stepId);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (compact) {
    return (
      <div className="w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-2xl p-2.5 shadow-sm">
        <div className="flex items-center justify-between gap-1 overflow-x-auto no-scrollbar">
          {STEPS.map((step, idx) => {
            const isCurrent = step.id === currentSection;
            const isCompleted = idx < activeIndex;

            return (
              <button
                key={step.id}
                onClick={() => handleStepClick(step.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  isCurrent
                    ? 'bg-[#C52229] text-white shadow-sm'
                    : isCompleted
                    ? 'bg-red-50 dark:bg-red-950/40 text-[#C52229] dark:text-red-300 hover:bg-red-100'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <span className="text-[10px] font-black opacity-80">{step.stepNumber}</span>
                <span>{step.icon}</span>
                <span>{step.shortTitle}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white dark:bg-[#0E1524] border border-red-200/90 dark:border-slate-800 rounded-3xl p-5 md:p-8 shadow-sm relative overflow-hidden">
      {/* Detalhes Concretistas de Fundo */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-bl from-red-500/5 via-amber-500/5 to-transparent pointer-events-none rounded-full" />
      <div className="absolute -left-12 -bottom-12 w-48 h-48 bg-emerald-500/5 pointer-events-none rounded-full" />

      {/* ── CABEÇALHO DO GUIA NARRATIVO ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 relative z-10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-red-100 dark:bg-red-950/60 text-[#C52229] dark:text-red-300 border border-red-200 dark:border-red-800/40 mb-2">
            <span>🗺️</span>
            <span>Roteiro Fácil • 4 Passos Práticos para Virar Voto</span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Como Virar Voto em 4 Passos Sem Brigar
          </h2>
          <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl font-medium">
            Siga este caminho simples: veja as dicas do seu estado, escolha com quem você vai falar, aprenda a responder com calma e mande mensagens e imagens direto no WhatsApp.
          </p>
        </div>

        {/* Resumo do Contexto Ativo do Usuário */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <div className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <span>📍</span>
            <span>{memory.selectedUF || 'SP'}</span>
            {memory.selectedCity && <span className="text-slate-400">• {memory.selectedCity}</span>}
          </div>

          {activeFront && (
            <div className="px-3 py-1.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-xs font-bold text-[#C52229] dark:text-red-300 flex items-center gap-1.5">
              <span>{activeFront.icon}</span>
              <span>{activeFront.title}</span>
            </div>
          )}

          {nextStep && (
            <button
              onClick={() => handleStepClick(nextStep.id)}
              className="px-4 py-2 rounded-xl bg-[#C52229] hover:bg-[#a81c22] text-white text-xs font-black flex items-center gap-2 shadow-md active:scale-95 transition-all"
            >
              <span>Avançar para Passo {nextStep.stepNumber}</span>
              <span>→</span>
            </button>
          )}
        </div>
      </div>

      {/* ── OS 4 PASSOS EM CARDS CONCRETISTAS COM CONEXÃO VISUAL ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 relative z-10">
        {STEPS.map((step, idx) => {
          const isCurrent = step.id === currentSection;
          const isCompleted = idx < activeIndex;

          return (
            <button
              key={step.id}
              onClick={() => handleStepClick(step.id)}
              className={`p-4 rounded-2xl border text-left transition-all relative flex flex-col justify-between group ${
                isCurrent
                  ? 'bg-gradient-to-b from-red-50/90 to-white dark:from-red-950/40 dark:to-slate-900 border-[#C52229] shadow-md ring-2 ring-[#C52229]/30 translate-y-[-2px]'
                  : isCompleted
                  ? 'bg-slate-50/70 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-red-300 dark:hover:border-slate-700'
                  : 'bg-white dark:bg-slate-900/40 border-slate-200/80 dark:border-slate-800 hover:border-slate-300 opacity-90'
              }`}
            >
              <div>
                {/* Topo do Card com Número e Badge */}
                <div className="flex items-center justify-between mb-2.5">
                  <span
                    className={`text-xs font-black px-2 py-0.5 rounded-md ${
                      isCurrent
                        ? 'bg-[#C52229] text-white'
                        : isCompleted
                        ? 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                    }`}
                  >
                    Passo {step.stepNumber}
                  </span>

                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300">
                    {step.tacticalBadge}
                  </span>
                </div>

                {/* Título & Ícone */}
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-xl">{step.icon}</span>
                  <h3
                    className={`text-sm font-black leading-snug ${
                      isCurrent
                        ? 'text-[#C52229] dark:text-red-400'
                        : 'text-slate-900 dark:text-white'
                    }`}
                  >
                    {step.headline}
                  </h3>
                </div>

                {/* Descrição Tática Curta */}
                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                  {step.detail}
                </p>
              </div>

              {/* Rodapé com Status do Passo */}
              <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[10px] font-bold">
                <span
                  className={
                    isCurrent
                      ? 'text-[#C52229] dark:text-red-400 flex items-center gap-1'
                      : isCompleted
                      ? 'text-emerald-600 dark:text-emerald-400 flex items-center gap-1'
                      : 'text-slate-400'
                  }
                >
                  {isCurrent && <span className="w-1.5 h-1.5 rounded-full bg-[#C52229] animate-ping" />}
                  {isCurrent ? 'Etapa Atual' : isCompleted ? '✓ Concluído' : 'Clique para ir'}
                </span>
                <span className="text-slate-400 group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
