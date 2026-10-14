'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ARGUMENTS_DATABASE, type Argument } from '@/data/arguments';
import AudioPlayerButton from '@/components/AudioPlayerButton';
import gsap from 'gsap';

interface QuickArgumentViewProps {
  onBack: () => void;
  onOpenCardGenerator: (arg: Argument) => void;
}

const CATEGORIES = [
  { id: 'todas', label: 'Todos os Temas', emoji: '🌟' },
  { id: 'combustivel', label: 'Combustível & Petrobras', emoji: '⛽' },
  { id: 'alimentacao', label: 'Comida & Alimentos', emoji: '🥩' },
  { id: 'salario', label: 'Salário & Renda', emoji: '💵' },
  { id: 'tributacao', label: 'Imposto Zero & IR', emoji: '🛒' },
  { id: 'previdencia', label: 'BPC & Aposentadoria', emoji: '🧓' },
  { id: 'educacao', label: 'Pé-de-Meia & Escolas', emoji: '🎒' },
  { id: 'saude', label: 'SUS & Farmácia Popular', emoji: '🏥' },
  { id: 'credito', label: 'Desenrola & Dívidas', emoji: '💳' },
  { id: 'agro', label: 'Agricultura Familiar & Safra', emoji: '🌾' },
  { id: 'seguranca', label: 'Segurança & Desarmamento de Facções', emoji: '🛡️' },
];

const DICE_FACES = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅', '🎲'];

interface BadgeLevel {
  level: number;
  title: string;
  emoji: string;
  required: number;
  description: string;
}

const BADGES: BadgeLevel[] = [
  { level: 1, title: 'Iniciante Consciente', emoji: '🌱', required: 1, description: 'Primeiro fato conferido na fonte' },
  { level: 2, title: 'Voz Ativa Popular', emoji: '📢', required: 3, description: 'Repertório com 3 fatos blindados' },
  { level: 3, title: 'Desarmador de Fake News', emoji: '🛡️', required: 6, description: '6 fatos na ponta da língua' },
  { level: 4, title: 'Mestre do Diálogo', emoji: '⭐', required: 10, description: '10 argumentos com provas oficiais' },
  { level: 5, title: 'Líder Popular Diamante', emoji: '💎', required: 15, description: 'Enciclopédia viva da esperança popular' },
];

// Efeitos sonoros procedurais nativos via Web Audio API (Ponytail: zero npm packages)
function playProceduralSound(type: 'dice' | 'ping' | 'levelUp') {
  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    if (type === 'dice') {
      // Barulho tátil de dados rolando (3 cliques rápidos)
      for (let i = 0; i < 4; i++) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const delay = i * 0.07;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(280 + Math.random() * 260, ctx.currentTime + delay);
        osc.frequency.exponentialRampToValueAtTime(70, ctx.currentTime + delay + 0.04);

        gain.gain.setValueAtTime(0.08, ctx.currentTime + delay);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + 0.04);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + delay);
        osc.stop(ctx.currentTime + delay + 0.05);
      }
    } else if (type === 'ping') {
      // Som de cópia/sucesso sutil
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.12); // A5
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } else if (type === 'levelUp') {
      // Fanfarra curta de conquista (tríade alegre)
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const start = ctx.currentTime + idx * 0.09;
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, start);
        gain.gain.setValueAtTime(0.1, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.22);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + 0.25);
      });
    }
  } catch {
    // Silencioso se navegador restringir áudio antes de interação
  }
}

export default function QuickArgumentView({
  onBack,
  onOpenCardGenerator,
}: QuickArgumentViewProps) {
  // Pool de argumentos substantivos e auditados
  const poolOfArguments = useRef<Argument[]>(
    ARGUMENTS_DATABASE.filter((a) => a.stage === 'gatilho' || a.stage === 'ponte')
  );

  const [selectedCategory, setSelectedCategory] = useState<string>('todas');
  const [currentArg, setCurrentArg] = useState<Argument>(poolOfArguments.current[0]);
  const [isRolling, setIsRolling] = useState(false);
  const [copied, setCopied] = useState(false);
  const [unlockedCount, setUnlockedCount] = useState<number>(1);
  const [seenIds, setSeenIds] = useState<Set<string>>(new Set([poolOfArguments.current[0].id]));
  const [usedToday, setUsedToday] = useState<boolean>(false);
  const [largeMode, setLargeMode] = useState<boolean>(false);
  const [diceDisplay, setDiceDisplay] = useState<string>('🎲');
  const [levelUpToast, setLevelUpToast] = useState<string | null>(null);

  const cardRef = useRef<HTMLDivElement | null>(null);
  const diceRef = useRef<HTMLSpanElement | null>(null);
  const rollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Carregar progresso do localStorage
  useEffect(() => {
    try {
      const savedSeen = localStorage.getItem('bora_quick_seen');
      if (savedSeen) {
        const parsed = JSON.parse(savedSeen) as string[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          const newSet = new Set(parsed);
          newSet.add(poolOfArguments.current[0].id);
          setSeenIds(newSet);
          setUnlockedCount(newSet.size);
        }
      }
    } catch {
      // Ignora erro de storage
    }
  }, []);

  // Lista filtrada por categoria ativa
  const filteredPool = poolOfArguments.current.filter((arg) => {
    if (selectedCategory === 'todas') return true;
    return arg.category === selectedCategory;
  });

  // Cálculo de Gamificação / Medalha Atual
  const currentBadge =
    BADGES.slice().reverse().find((b) => unlockedCount >= b.required) || BADGES[0];
  const nextBadge = BADGES.find((b) => unlockedCount < b.required);
  const progressPercent = nextBadge
    ? Math.min(100, Math.round((unlockedCount / nextBadge.required) * 100))
    : 100;

  // Função para rolar o dado e sortear outro argumento
  const handleRollDice = useCallback(() => {
    if (isRolling) return;
    setIsRolling(true);
    setUsedToday(false);

    // Feedback sonoro e tátil nativo
    playProceduralSound('dice');
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate?.([20, 30, 25]);
    }

    // Animação de rotação rápida do dado com ciclo de faces
    let faceStep = 0;
    rollIntervalRef.current = setInterval(() => {
      setDiceDisplay(DICE_FACES[faceStep % DICE_FACES.length]);
      faceStep++;
    }, 60);

    if (diceRef.current) {
      gsap.fromTo(
        diceRef.current,
        { rotate: 0, scale: 0.8 },
        {
          rotate: 360 * 2,
          scale: 1.3,
          duration: 0.55,
          ease: 'power2.out',
          onComplete: () => {
            gsap.to(diceRef.current, { scale: 1, duration: 0.2 });
          },
        }
      );
    }

    if (cardRef.current) {
      gsap.to(cardRef.current, {
        opacity: 0.25,
        y: 14,
        scale: 0.97,
        duration: 0.22,
        ease: 'power2.in',
        onComplete: () => {
          // Sortear próximo argumento diferente do atual
          const available =
            filteredPool.length > 1
              ? filteredPool.filter((a) => a.id !== currentArg.id)
              : poolOfArguments.current.filter((a) => a.id !== currentArg.id);

          const randomIdx = Math.floor(Math.random() * available.length);
          const nextArg = available[randomIdx] || poolOfArguments.current[0];

          setCurrentArg(nextArg);

          // Limpar ciclo de faces
          if (rollIntervalRef.current) {
            clearInterval(rollIntervalRef.current);
            rollIntervalRef.current = null;
          }
          setDiceDisplay('🎲');

          // Atualizar contagem e verificar level up
          setSeenIds((prev) => {
            const nextSet = new Set(prev);
            const prevSize = nextSet.size;
            nextSet.add(nextArg.id);
            const newSize = nextSet.size;

            try {
              localStorage.setItem('bora_quick_seen', JSON.stringify(Array.from(nextSet)));
            } catch {
              // Ignore
            }

            setUnlockedCount(newSize);

            // Verificar se bateu um novo marco de insígnia
            if (newSize > prevSize) {
              const justEarned = BADGES.find((b) => b.required === newSize);
              if (justEarned) {
                playProceduralSound('levelUp');
                setLevelUpToast(`🎉 Conquista Desbloqueada: ${justEarned.emoji} ${justEarned.title}!`);
                setTimeout(() => setLevelUpToast(null), 3500);
              }
            }

            return nextSet;
          });

          // Animação de entrada fluida do novo card
          gsap.fromTo(
            cardRef.current,
            { opacity: 0.25, y: -14, scale: 0.97 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.38,
              ease: 'power3.out',
              onComplete: () => setIsRolling(false),
            }
          );
        },
      });
    } else {
      if (rollIntervalRef.current) clearInterval(rollIntervalRef.current);
      setDiceDisplay('🎲');
      setIsRolling(false);
    }
  }, [currentArg.id, filteredPool, isRolling]);

  // Mudar categoria
  const handleSelectCategory = (catId: string) => {
    setSelectedCategory(catId);
    const catPool = poolOfArguments.current.filter(
      (a) => catId === 'todas' || a.category === catId
    );
    if (catPool.length > 0) {
      const nextArg = catPool[0];
      setCurrentArg(nextArg);
      setSeenIds((prev) => {
        const nextSet = new Set(prev).add(nextArg.id);
        try {
          localStorage.setItem('bora_quick_seen', JSON.stringify(Array.from(nextSet)));
        } catch {
          // Ignore
        }
        setUnlockedCount(nextSet.size);
        return nextSet;
      });
    }
  };

  // Montar texto completo formatado para WhatsApp com subtópicos
  const buildWhatsAppText = useCallback(() => {
    const lines: string[] = [];
    lines.push(`⭐ *FATO NA MESA — ${currentArg.headline.toUpperCase()}*`);
    lines.push('');
    lines.push(`🎯 *O Ponto Central:*`);
    lines.push(currentArg.title);
    lines.push('');
    lines.push(`🗣️ *O Que Falar na Conversa:*`);
    lines.push(`"${currentArg.scriptText}"`);
    lines.push('');

    if (currentArg.counterArgument && currentArg.rebuttal) {
      lines.push(`🛡️ *Se falarem:* "${currentArg.counterArgument}"`);
      lines.push(`✅ *Resposta na lata:* ${currentArg.rebuttal}`);
      lines.push('');
    }

    lines.push(`📊 *Fonte Oficial Auditada:* ${currentArg.sourceName}`);
    if (currentArg.sourceUrl && currentArg.sourceUrl !== '#') {
      lines.push(`📎 ${currentArg.sourceUrl}`);
    }
    lines.push('');
    lines.push(`_Via Bora 13 • Argumentos Reais • casa13.pt.org.br_`);

    return lines.join('\n');
  }, [currentArg]);

  const handleCopyText = async () => {
    playProceduralSound('ping');
    try {
      await navigator.clipboard.writeText(buildWhatsAppText());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = buildWhatsAppText();
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShareWhatsApp = () => {
    playProceduralSound('ping');
    const encoded = encodeURIComponent(buildWhatsAppText());
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
  };

  // Contagem por categoria para as pílulas
  const getCategoryCount = (catId: string) => {
    if (catId === 'todas') return poolOfArguments.current.length;
    return poolOfArguments.current.filter((a) => a.category === catId).length;
  };

  return (
    <section className="min-h-[calc(100vh-80px)] flex flex-col px-4 py-6 max-w-xl mx-auto w-full animate-fade-in relative z-10">
      {/* Notificação Flutuante de Level Up / Gamificação */}
      {levelUpToast && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-[#C52229] text-white px-5 py-2.5 rounded-full shadow-2xl font-black text-xs md:text-sm flex items-center gap-2 border-2 border-amber-300 animate-bounce">
          <span>{levelUpToast}</span>
        </div>
      )}

      {/* Top Header & Navegação */}
      <div className="flex items-center justify-between mb-3">
        <button onClick={onBack} className="btn-ghost -ml-2 text-xs">
          ← Voltar ao Início
        </button>
        <span className="badge-casa13">
          ⚡ Fato na Mesa • Modo Rápido
        </span>
      </div>

      {/* Gamification Header: Roleta de Fatos + Nível / Conquistas */}
      <div className="card-clean mb-4 p-4 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col gap-3.5 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3 text-left">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/40 flex items-center justify-center text-3xl shadow-sm select-none">
              <span ref={diceRef} className="inline-block transition-transform">
                {diceDisplay}
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-[#C52229]">
                  Roleta de Fatos Reais
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
                  {unlockedCount} / {poolOfArguments.current.length} explorados
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                Gire o dado para sortear outro fato com dados auditados.
              </p>
            </div>
          </div>

          {/* Botão de Dados Principal */}
          <button
            onClick={handleRollDice}
            disabled={isRolling}
            className="btn-pt w-full sm:w-auto py-2.5 px-5 text-xs md:text-sm font-black shadow-md flex items-center justify-center gap-2 active:scale-95 transition-all select-none"
            title="Sortear outro argumento aleatório"
          >
            <span className="text-base">🎲</span>
            <span>Sortear Outro Fato</span>
          </button>
        </div>

        {/* Barra de Progresso Gamificada & Medalha Atual */}
        <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-[11px] font-bold">
            <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-200">
              <span className="text-sm">{currentBadge.emoji}</span>
              <span className="font-black text-[#C52229]">{currentBadge.title}</span>
              <span className="text-[10px] text-slate-500 font-normal">({currentBadge.description})</span>
            </div>
            {nextBadge && (
              <span className="text-slate-500 font-medium text-[10px]">
                Próximo: {nextBadge.emoji} ({nextBadge.required - unlockedCount} fatos restantes)
              </span>
            )}
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-[#C52229] via-[#F59E0B] to-[#10B981] h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Controles de Experiência: Filtro por Categoria & Alternador de Leitura Grande */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="text-[11px] font-black uppercase tracking-wider text-slate-500">
          Temas Disponíveis:
        </span>
        <button
          onClick={() => setLargeMode(!largeMode)}
          className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border transition-colors flex items-center gap-1 ${
            largeMode
              ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 border-amber-300 dark:border-amber-700'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
          }`}
          title="Aumentar fontes para mostrar a tela em conversas"
        >
          <span>🔍</span>
          <span>{largeMode ? 'Fonte Normal' : 'Modo Telão (Letra Grande)'}</span>
        </button>
      </div>

      {/* Pílulas de Categorias com Quantidade Real */}
      <div className="flex gap-1.5 overflow-x-auto pb-2 mb-4 scrollbar-none">
        {CATEGORIES.map((cat) => {
          const count = getCategoryCount(cat.id);
          return (
            <button
              key={cat.id}
              onClick={() => handleSelectCategory(cat.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                selectedCategory === cat.id
                  ? 'bg-[#C52229] text-white shadow-sm'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-slate-300'
              }`}
            >
              <span>{cat.emoji}</span>
              <span>{cat.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                  selectedCategory === cat.id
                    ? 'bg-white/20 text-white'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* CARTÃO PRINCIPAL DO ARGUMENTO COM SUBTÓPICOS COMPLETOS */}
      <div
        ref={cardRef}
        className={`card-clean border-2 border-slate-200 dark:border-slate-800 shadow-md mb-5 bg-white dark:bg-slate-900 transition-all ${
          largeMode ? 'p-6 md:p-8' : 'p-5 md:p-6'
        }`}
      >
        {/* Cabeçalho do Cartão: Categoria & Força Factual */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span className={largeMode ? 'text-3xl' : 'text-2xl'}>{currentArg.emoji || '📌'}</span>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-[#C52229] block">
                {currentArg.category.toUpperCase()}
              </span>
              <span className="seal-verified">Fato Verificado Oficial</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/40 text-amber-800 dark:text-amber-300 text-xs font-bold">
            <span>⭐</span>
            <span>Impacto: {currentArg.impactScore}/10</span>
          </div>
        </div>

        {/* Título e Manchete */}
        <div className="mb-5">
          <h2
            className={`font-black text-slate-900 dark:text-white leading-tight mb-2 ${
              largeMode ? 'text-2xl md:text-3xl' : 'text-xl md:text-2xl'
            }`}
          >
            {currentArg.headline}
          </h2>
          <p
            className={`font-semibold text-slate-600 dark:text-slate-400 ${
              largeMode ? 'text-sm md:text-base' : 'text-xs md:text-sm'
            }`}
          >
            {currentArg.title}
          </p>
        </div>

        {/* SUBTÓPICO 1: O QUE FALAR NA RODA (SCRIPT DIRETO) */}
        <div className="mb-5 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 shadow-inner">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-black uppercase tracking-wider text-[#C52229] flex items-center gap-1.5">
              <span>🗣️</span>
              <span>1. Como Falar na Conversa (Script Pronto)</span>
            </span>
            <AudioPlayerButton text={currentArg.scriptText} />
          </div>

          <p
            className={`leading-relaxed text-slate-900 dark:text-slate-100 font-medium ${
              largeMode ? 'text-base md:text-lg' : 'text-sm md:text-base'
            }`}
          >
            &ldquo;{currentArg.scriptText}&rdquo;
          </p>
        </div>

        {/* SUBTÓPICO 2: DADOS & FONTE OFICIAL AUDITADA */}
        <div className="mb-5 p-3.5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40">
          <span className="text-xs font-black uppercase tracking-wider text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5 mb-1.5">
            <span>📊</span>
            <span>2. Prova Material & Fonte Auditada</span>
          </span>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <p
              className={`font-bold text-slate-800 dark:text-slate-200 ${
                largeMode ? 'text-sm md:text-base' : 'text-xs md:text-sm'
              }`}
            >
              Órgão / Documento:{' '}
              <span className="text-emerald-700 dark:text-emerald-400 font-black">
                {currentArg.sourceName}
              </span>
            </p>

            {currentArg.sourceUrl && currentArg.sourceUrl !== '#' && (
              <a
                href={currentArg.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold text-[#C52229] hover:underline flex items-center gap-1"
              >
                <span>🔗 Checar Fonte Oficial</span>
              </a>
            )}
          </div>
        </div>

        {/* SUBTÓPICO 3: SE RETRUCAREM COM FAKE NEWS (DESARME TÁTICO) */}
        {currentArg.counterArgument && currentArg.rebuttal && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40">
            <span className="text-xs font-black uppercase tracking-wider text-amber-900 dark:text-amber-300 flex items-center gap-1.5 mb-2.5">
              <span>🛡️</span>
              <span>3. Se Retrucarem (Como Desarmar na Hora)</span>
            </span>

            <div className="space-y-2.5">
              <div className="p-3 rounded-xl bg-white/85 dark:bg-slate-800/85 border border-slate-200 dark:border-slate-700 text-xs">
                <span className="font-bold text-rose-700 dark:text-rose-400 block mb-0.5">
                  🤔 O que costumam rebater:
                </span>
                <p
                  className={`italic text-slate-700 dark:text-slate-300 font-medium ${
                    largeMode ? 'text-sm' : 'text-xs'
                  }`}
                >
                  &ldquo;{currentArg.counterArgument}&rdquo;
                </p>
              </div>

              <div className="p-3 rounded-xl bg-white/85 dark:bg-slate-800/85 border border-slate-200 dark:border-slate-700 text-xs">
                <span className="font-bold text-emerald-700 dark:text-emerald-400 block mb-0.5">
                  ✅ Sua resposta na lata (sem briga):
                </span>
                <p
                  className={`text-slate-800 dark:text-slate-200 font-semibold leading-relaxed ${
                    largeMode ? 'text-sm md:text-base' : 'text-xs md:text-sm'
                  }`}
                >
                  {currentArg.rebuttal}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* SUBTÓPICO 4: AÇÕES IMEDIATAS & COMPARTILHAMENTO */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              🚀 Como Usar Este Argumento Agora:
            </span>

            {/* Checkbox de Gamificação: Marcar como Usado */}
            <button
              onClick={() => {
                setUsedToday(!usedToday);
                if (!usedToday) {
                  playProceduralSound('ping');
                }
              }}
              className={`text-[11px] font-bold px-2 py-0.5 rounded-md transition-all flex items-center gap-1 ${
                usedToday
                  ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-black'
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              <span>{usedToday ? '✅ Usado no diálogo hoje!' : '⭕ Marcar como usado'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {/* Zap */}
            <button
              onClick={handleShareWhatsApp}
              className="py-2.5 px-3 rounded-xl font-bold text-xs text-white bg-[#25D366] hover:bg-[#20bd5a] flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all"
            >
              <span>📲</span>
              <span>Mandar no Zap</span>
            </button>

            {/* Copiar */}
            <button
              onClick={handleCopyText}
              className="btn-secondary py-2.5 px-3 text-xs font-bold flex items-center justify-center gap-1.5 active:scale-95"
            >
              <span>{copied ? '✅' : '📋'}</span>
              <span>{copied ? 'Copiado!' : 'Copiar Texto'}</span>
            </button>

            {/* Gerar Card */}
            <button
              onClick={() => onOpenCardGenerator(currentArg)}
              className="py-2.5 px-3 rounded-xl font-bold text-xs text-white bg-[#C52229] hover:bg-[#991B1E] flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all"
            >
              <span>🎨</span>
              <span>Gerar Card</span>
            </button>
          </div>
        </div>
      </div>

      {/* DICA TÁTICA DE CAMPO (Narrativa & Postura de Diálogo) */}
      <div className="mb-5 p-3.5 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-800/30 flex items-center gap-3 text-xs text-amber-900 dark:text-amber-200">
        <span className="text-xl shrink-0">💡</span>
        <p className="leading-snug">
          <strong className="font-bold">Regra de Ouro do Diálogo:</strong> Nunca comece dizendo &ldquo;você está errado&rdquo;. Diga: &ldquo;Pois é, eu também achava isso... até conferir os números oficiais da Petrobras/IBGE. Olha isso aqui.&rdquo;
        </p>
      </div>

      {/* Botão de Sortear Novamente no Pé da Página */}
      <div className="flex flex-col gap-2.5 items-center pb-8">
        <button
          onClick={handleRollDice}
          disabled={isRolling}
          className="btn-pt w-full text-sm font-black shadow-lg flex items-center justify-center gap-2 select-none active:scale-98 transition-all"
        >
          <span>🎲</span>
          <span>Girar Dados para Outro Argumento</span>
        </button>

        <button
          onClick={onBack}
          className="btn-ghost text-xs text-slate-500 hover:text-slate-700"
        >
          Prefere personalizar por Estado e Profissão? Começar diálogo guiado →
        </button>
      </div>
    </section>
  );
}
