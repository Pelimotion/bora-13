'use client';

import React from 'react';
import type { AppSection, AgenticWorkingMemory } from '@/lib/agenticOrchestrator';
import { playProceduralHaptic } from '@/lib/agenticOrchestrator';
import VisualJourneyStepper from '@/components/VisualJourneyStepper';
import { CONVERSION_FRONTS, MENOS_COM_FLAVIO_FACTS } from '@/data/electoralTactics';

interface RadarSectionProps {
  onNavigate: (section: AppSection) => void;
  canInstall?: boolean;
  onInstall?: () => void;
  memory?: AgenticWorkingMemory;
  onSelectFront?: (frontId: 'ex_lula' | 'terceira_via' | 'abstencao_70' | 'nulo_branco') => void;
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
  onSelectFront,
}: RadarSectionProps) {
  const handleNav = (sec: AppSection) => {
    playProceduralHaptic('click');
    onNavigate(sec);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSelectFrontAndGo = (frontId: 'ex_lula' | 'terceira_via' | 'abstencao_70' | 'nulo_branco') => {
    playProceduralHaptic('card');
    if (onSelectFront) {
      onSelectFront(frontId);
    }
    handleNav('perfil');
  };

  return (
    <section className="w-full max-w-7xl mx-auto px-4 py-8 animate-fade-in space-y-10">
      {/* ── BANNER HERO EDITORIAL COM IDENTIDADE CASA 13 ── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-red-50 via-white to-amber-50 dark:from-[#131A29] dark:via-[#0E1524] dark:to-[#171A21] border border-red-200/90 dark:border-slate-800 p-6 md:p-12 shadow-sm">
        {/* Arcos Decorativos de Fundo */}
        <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full border border-red-300/30 dark:border-red-900/20 pointer-events-none" />
        <div className="absolute -right-10 -bottom-10 w-60 h-60 rounded-full border border-amber-300/30 dark:border-amber-800/20 pointer-events-none" />

        <div className="max-w-3xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full mb-4 bg-red-100 dark:bg-red-950/60 border border-red-200 dark:border-red-800/40 text-[#C52229] dark:text-red-300 text-xs font-black tracking-wider uppercase shadow-sm">
            <span>⭐</span>
            <span>Casa 13 • Guia Prático de Diálogo & Esperança</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.08] mb-4">
            Conversa boa vira voto. <br />
            <span className="text-[#C52229] dark:text-red-400">O 2º Turno se vence</span> de igual pra igual, sem briga.
          </h1>

          <p className="text-base md:text-lg text-slate-600 dark:text-slate-300 leading-relaxed mb-6 font-medium">
            Numa sala de 300 pessoas, virar apenas <strong>4 votos</strong> decide o futuro do Brasil. Em vez de discutir política abstrata ou culpar quem votou diferente, acolha o cansaço, fale do prato e do salário, e mostre o risco real dos cortes de direitos.
          </p>

          {/* Botões Principais de Navegação com Hierarquia Clara */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => handleNav('territorio')}
              className="px-6 py-3.5 rounded-2xl bg-[#C52229] hover:bg-[#a51b21] text-white font-black text-sm flex items-center gap-2.5 shadow-lg active:scale-95 transition-all"
            >
              <span>🗺️</span>
              <span>Passo 1: Ver Meu Estado</span>
              <span className="text-[10px] font-black bg-white/20 px-2 py-0.5 rounded-full">
                {memory.selectedUF || 'SP'}
              </span>
            </button>

            <button
              onClick={() => handleNav('perfil')}
              className="px-5 py-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:border-slate-400 text-slate-800 dark:text-white font-bold text-sm flex items-center gap-2 shadow-sm active:scale-95 transition-all"
            >
              <span>👥</span>
              <span>Com Quem Conversar</span>
            </button>

            <button
              onClick={() => handleNav('simulador')}
              className="px-5 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm flex items-center gap-2 shadow-sm active:scale-95 transition-all"
            >
              <span>💬</span>
              <span>Treinar Diálogo Sem Briga</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── NAVEGAÇÃO NARRATIVA CENTRAL: A TRILHA DA VIRADA EM 4 PASSOS ── */}
      <VisualJourneyStepper
        currentSection="radar"
        onSelectSection={onNavigate}
        memory={memory}
      />

      {/* ── A LISTA DOS 4 PERFIS DE CONVERSA ── */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-red-100 dark:bg-red-950/60 text-[#C52229] dark:text-red-300 mb-1">
              <span>👥</span>
              <span>Com Quem Você Vai Falar?</span>
            </div>
            <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Escolha a Pessoa para Ver o Que Responder
            </h2>
            <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400">
              Não tente convencer fanáticos. Foque em quem tá indeciso, chateado com o mercado ou quem faltou no 1º turno:
            </p>
          </div>

          <button
            onClick={() => handleNav('perfil')}
            className="text-xs font-bold text-[#C52229] hover:underline flex items-center gap-1 shrink-0"
          >
            <span>Ver todos os roteiros de conversa</span>
            <span>→</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {CONVERSION_FRONTS.map((front) => (
            <div
              key={front.id}
              onClick={() => handleSelectFrontAndGo(front.id)}
              className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-[#C52229] dark:hover:border-red-500 transition-all cursor-pointer shadow-sm flex flex-col justify-between group"
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
                <span>Ver como conversar sem briga</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── CARD: COMPARAÇÃO DO BOLSO ("MENOS COM FLÁVIO") ── */}
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
              onClick={() => handleNav('perfil')}
              className="px-5 py-3 rounded-2xl bg-[#C52229] hover:bg-[#a51b21] text-white text-xs font-black flex items-center gap-2 shadow-md active:scale-95 transition-all"
            >
              <span>⚡</span>
              <span>Ver os 8 Fatos de Cortes</span>
            </button>
            <button
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

      {/* ── PAINEL DE PULSO NACIONAL: FATOS AUDITADOS DO BOLSO ── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <span>📊</span>
              <span>Fatos Reais do Brasil: O Que os Números Mostram</span>
            </h2>
            <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400">
              Alimentos, emprego e salário comprovados com fontes oficiais para você tirar dúvidas na hora.
            </p>
          </div>
          <button
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
              className={`p-5 rounded-3xl border ${item.color} flex flex-col justify-between space-y-3 shadow-sm`}
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
