'use client';

import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import {
  type PostPresetData,
  type PostFormat,
  type VisualTheme,
  type CopyPlatform,
  type AgenticWorkingMemory,
  generateSmartCopy,
  createPostPresetFromArgument,
  createPostPresetFromOpportunity,
  createPostPresetFromTerritory,
  createDefaultPostPreset,
  createPostPresetFromConversionFront,
  createPostPresetFromMenosFact,
  TACTICAL_PRESET_TEMPLATES,
  playProceduralHaptic,
} from '@/lib/agenticOrchestrator';
import { ARGUMENTS_DATABASE, type Argument } from '@/data/arguments';
import { OPPORTUNITIES_DATABASE, type Opportunity } from '@/data/opportunities';
import { BRAZIL_STATES_GEO } from '@/data/brazilGeo';
import { CONVERSION_FRONTS, MENOS_COM_FLAVIO_FACTS } from '@/data/electoralTactics';

interface PostStudioSectionProps {
  initialPreset?: PostPresetData | null;
  memory?: AgenticWorkingMemory;
  onNavigateSection?: (section: any) => void;
}

export default function PostStudioSection({
  initialPreset,
  memory,
  onNavigateSection,
}: PostStudioSectionProps) {
  // Estado do Post Preset Atual
  const [preset, setPreset] = useState<PostPresetData>(() => initialPreset || createDefaultPostPreset());
  const [format, setFormat] = useState<PostFormat>(preset.format || 'carousel');
  const [theme, setTheme] = useState<VisualTheme>(preset.theme || 'brasil-editorial');
  const [activeSlide, setActiveSlide] = useState<number>(0);
  const [copyTab, setCopyTab] = useState<CopyPlatform>('instagram');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [catalogFilter, setCatalogFilter] = useState<
    'todos' | 'tatico_4votos' | 'menos_com_flavio' | 'fatos' | 'oportunidades' | 'territorio' | 'custom'
  >('todos');

  // Atualiza preset se o initialPreset mudar via orquestrador
  useEffect(() => {
    if (initialPreset) {
      setPreset(initialPreset);
      if (initialPreset.format) setFormat(initialPreset.format);
      if (initialPreset.theme) setTheme(initialPreset.theme);
      setActiveSlide(0);
    }
  }, [initialPreset]);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const TOTAL_SLIDES = format === 'carousel' ? 5 : 1;

  // Gerador de Cópias Multiplataforma
  const copies = useMemo(() => {
    return generateSmartCopy(preset, memory);
  }, [preset, memory]);

  // Função auxiliar para quebrar texto no canvas 2D
  const wrapText = (
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    maxWidth: number,
    lineHeight: number
  ): number => {
    const words = text.split(' ');
    let line = '';
    let currentY = y;

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        ctx.fillText(line, x, currentY);
        line = words[n] + ' ';
        currentY += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, x, currentY);
    return currentY + lineHeight;
  };

  // ─────────────────────────────────────────────────────────────
  // RENDERIZADOR CANVAS 2D DE ALTA RESOLUÇÃO (1080x1080 / 1080x1920)
  // ─────────────────────────────────────────────────────────────
  const renderCanvas = useCallback(
    (slideIdx: number = activeSlide) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const width = 1080;
      const height = format === 'story' ? 1920 : 1080;
      canvas.width = width;
      canvas.height = height;

      // 1. TEMA DE FUNDO & ATMOSFERA
      if (theme === 'brasil-editorial') {
        // Fundo papel algodão off-white
        ctx.fillStyle = '#FAF7F2';
        ctx.fillRect(0, 0, width, height);

        // Arcos Concretistas Sutis
        ctx.save();
        ctx.strokeStyle = 'rgba(0, 107, 63, 0.08)'; // Verde Brasil sutil
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(width - 80, 80, 260, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = 'rgba(197, 34, 41, 0.06)'; // Vermelho Casa 13
        ctx.beginPath();
        ctx.arc(80, height - 120, 320, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      } else if (theme === 'brasil-vibrante') {
        // Gradiente Solar & Esperança
        const grad = ctx.createLinearGradient(0, 0, width, height);
        grad.addColorStop(0, '#FFFFFF');
        grad.addColorStop(0.5, '#FFFBEB');
        grad.addColorStop(1, '#FEF2F2');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);

        // Faixa geométrica no topo
        ctx.fillStyle = '#C52229';
        ctx.fillRect(0, 0, width, 14);
      } else if (theme === 'dark-moderno') {
        // Dark minimalista de alto contraste
        ctx.fillStyle = '#0B0F19';
        ctx.fillRect(0, 0, width, height);

        // Glow radial sutil
        const glow = ctx.createRadialGradient(width / 2, 200, 50, width / 2, 200, 600);
        glow.addColorStop(0, 'rgba(197, 34, 41, 0.22)');
        glow.addColorStop(1, 'rgba(11, 15, 25, 0)');
        ctx.fillStyle = glow;
        ctx.fillRect(0, 0, width, height);
      } else {
        // Concretismo Puro (Branco Suíço com Tipografia e Faixa Rubro-Ouro)
        ctx.fillStyle = '#F4F4F5';
        ctx.fillRect(0, 0, width, height);

        ctx.fillStyle = '#C52229';
        ctx.fillRect(80, 80, 18, 120);
        ctx.fillStyle = '#E5A800';
        ctx.fillRect(104, 80, 10, 120);
      }

      // Moldura interna elegante
      const margin = 80;
      const contentWidth = width - margin * 2;

      // 2. CABEÇALHO DO CARD (Marca & Selo de Auditoria)
      const isDark = theme === 'dark-moderno';
      const textPrimary = isDark ? '#FFFFFF' : '#0F172A';
      const textSecondary = isDark ? '#94A3B8' : '#475569';
      const accentRed = '#C52229';
      const accentGold = '#F59E0B';
      const accentGreen = '#10B981';

      // Badge de Topo
      ctx.fillStyle = isDark ? 'rgba(197, 34, 41, 0.25)' : '#FEE2E2';
      ctx.beginPath();
      ctx.roundRect(margin, 90, 320, 54, 27);
      ctx.fill();

      ctx.fillStyle = isDark ? '#FCA5A5' : accentRed;
      ctx.font = 'bold 22px system-ui, -apple-system, sans-serif';
      ctx.fillText('⭐ BORA 13 • DIÁLOGO REAL', margin + 24, 125);

      // Indicador de Slide no Carrossel
      if (format === 'carousel') {
        ctx.fillStyle = isDark ? '#64748B' : '#94A3B8';
        ctx.font = 'bold 24px system-ui, -apple-system, sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText(`ATO ${slideIdx + 1} DE ${TOTAL_SLIDES}`, width - margin, 125);
        ctx.textAlign = 'left';
      }

      // 3. CONTEÚDO DINÂMICO CONFORME O FORMATO E O ATO DO SLIDE
      let currentY = 210;

      if (format === 'carousel') {
        // ── ATO 1: A CAPA & O GANCHO ──
        if (slideIdx === 0) {
          ctx.fillStyle = accentRed;
          ctx.font = 'bold 28px system-ui, -apple-system, sans-serif';
          ctx.fillText(`DISCUSSÕES QUE IMPORTAM • ${preset.categoryTag.toUpperCase()}`, margin, currentY);
          currentY += 45;

          ctx.fillStyle = textPrimary;
          ctx.font = 'bold 64px system-ui, -apple-system, sans-serif';
          currentY = wrapText(ctx, preset.headline, margin, currentY, contentWidth, 76);
          currentY += 40;

          // Caixa de Destaque Editorial
          ctx.fillStyle = isDark ? 'rgba(255, 255, 255, 0.05)' : '#FFFFFF';
          ctx.beginPath();
          ctx.roundRect(margin, currentY, contentWidth, 220, 20);
          ctx.fill();
          ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.1)' : '#E2E8F0';
          ctx.lineWidth = 2;
          ctx.stroke();

          ctx.fillStyle = textSecondary;
          ctx.font = '500 32px system-ui, -apple-system, sans-serif';
          wrapText(
            ctx,
            preset.act1Hook || 'O que você precisa saber com dados oficiais antes da próxima conversa em família ou no trabalho.',
            margin + 36,
            currentY + 65,
            contentWidth - 72,
            46
          );

          // Indicador de Deslizar (Arrasta pro lado)
          const ctaY = height - 160;
          ctx.fillStyle = accentGold;
          ctx.font = 'bold 30px system-ui, -apple-system, sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('Deslize para ver as provas na mesa 👉', width / 2, ctaY);
          ctx.textAlign = 'left';
        }

        // ── ATO 2: A PROVA MATERIAL AUDITADA ──
        else if (slideIdx === 1) {
          ctx.fillStyle = accentGreen;
          ctx.font = 'bold 26px system-ui, -apple-system, sans-serif';
          ctx.fillText('📊 ATO 2: A PROVA MATERIAL DOCUMENTADA', margin, currentY);
          currentY += 45;

          ctx.fillStyle = textPrimary;
          ctx.font = 'bold 48px system-ui, -apple-system, sans-serif';
          currentY = wrapText(ctx, preset.title, margin, currentY, contentWidth, 60);
          currentY += 40;

          // Bloco de Prova
          ctx.fillStyle = isDark ? '#1E293B' : '#FFFFFF';
          ctx.beginPath();
          ctx.roundRect(margin, currentY, contentWidth, 340, 24);
          ctx.fill();
          ctx.strokeStyle = accentGreen;
          ctx.lineWidth = 3;
          ctx.stroke();

          ctx.fillStyle = textPrimary;
          ctx.font = '600 34px system-ui, -apple-system, sans-serif';
          wrapText(ctx, preset.proofData || preset.bodyText, margin + 40, currentY + 70, contentWidth - 80, 52);

          currentY += 390;
          // Selo da Fonte
          ctx.fillStyle = isDark ? '#94A3B8' : '#475569';
          ctx.font = 'bold 24px system-ui, -apple-system, sans-serif';
          ctx.fillText(`🏛️ FONTE OFICIAL: ${preset.sourceName}`, margin, currentY);
        }

        // ── ATO 3: O DESARME TÁTICO (O QUE DIZEM VS O FATO) ──
        else if (slideIdx === 2) {
          ctx.fillStyle = accentGold;
          ctx.font = 'bold 26px system-ui, -apple-system, sans-serif';
          ctx.fillText('🛡️ ATO 3: O DESARME SEM CONFRONTO', margin, currentY);
          currentY += 45;

          // "O que costumam dizer"
          ctx.fillStyle = isDark ? '#1E293B' : '#FEF2F2';
          ctx.beginPath();
          ctx.roundRect(margin, currentY, contentWidth, 180, 20);
          ctx.fill();
          ctx.strokeStyle = '#FCA5A5';
          ctx.lineWidth = 2;
          ctx.stroke();

          ctx.fillStyle = accentRed;
          ctx.font = 'bold 24px system-ui, -apple-system, sans-serif';
          ctx.fillText('🤔 O QUE COSTUMAM FALAR:', margin + 30, currentY + 45);

          ctx.fillStyle = textPrimary;
          ctx.font = '500 28px system-ui, -apple-system, sans-serif';
          wrapText(
            ctx,
            `"${preset.counterArg || 'Dizem que tudo continua igual e nada melhorou'}"`,
            margin + 30,
            currentY + 95,
            contentWidth - 60,
            40
          );

          currentY += 230;

          // "A resposta com provas"
          ctx.fillStyle = isDark ? '#1E293B' : '#F0FDF4';
          ctx.beginPath();
          ctx.roundRect(margin, currentY, contentWidth, 240, 20);
          ctx.fill();
          ctx.strokeStyle = accentGreen;
          ctx.lineWidth = 3;
          ctx.stroke();

          ctx.fillStyle = accentGreen;
          ctx.font = 'bold 24px system-ui, -apple-system, sans-serif';
          ctx.fillText('✅ O QUE OS DOCUMENTOS PROVAM:', margin + 30, currentY + 48);

          ctx.fillStyle = textPrimary;
          ctx.font = '600 30px system-ui, -apple-system, sans-serif';
          wrapText(
            ctx,
            preset.rebuttal || preset.bodyText,
            margin + 30,
            currentY + 100,
            contentWidth - 60,
            44
          );
        }

        // ── ATO 4: A VIDA REAL NO BOLSO ──
        else if (slideIdx === 3) {
          ctx.fillStyle = accentRed;
          ctx.font = 'bold 26px system-ui, -apple-system, sans-serif';
          ctx.fillText('💡 ATO 4: TRADUZINDO PARA A VIDA REAL', margin, currentY);
          currentY += 45;

          ctx.fillStyle = textPrimary;
          ctx.font = 'bold 50px system-ui, -apple-system, sans-serif';
          currentY = wrapText(ctx, 'Como esse dado muda o dia a dia do trabalhador?', margin, currentY, contentWidth, 64);
          currentY += 40;

          ctx.fillStyle = isDark ? '#1E293B' : '#FFFFFF';
          ctx.beginPath();
          ctx.roundRect(margin, currentY, contentWidth, 300, 24);
          ctx.fill();
          ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.1)' : '#E2E8F0';
          ctx.lineWidth = 2;
          ctx.stroke();

          ctx.fillStyle = textPrimary;
          ctx.font = '500 34px system-ui, -apple-system, sans-serif';
          wrapText(
            ctx,
            preset.act4PocketImpact || 'Economia não é número abstrato de jornal: é o preço do arroz, do gás e da carne sobrando no final do mês para cuidar da família com tranquilidade.',
            margin + 40,
            currentY + 75,
            contentWidth - 80,
            54
          );
        }

        // ── ATO 5: CONCLUSÃO & MOBILIZAÇÃO ──
        else if (slideIdx === 4) {
          ctx.fillStyle = accentGold;
          ctx.font = 'bold 28px system-ui, -apple-system, sans-serif';
          ctx.fillText('⭐ ATO 5: ESPERANÇA & UNIÃO', margin, currentY);
          currentY += 50;

          ctx.fillStyle = textPrimary;
          ctx.font = 'bold 58px system-ui, -apple-system, sans-serif';
          currentY = wrapText(ctx, 'O diálogo constrói pontes. Os fatos constroem o futuro.', margin, currentY, contentWidth, 70);
          currentY += 50;

          ctx.fillStyle = isDark ? '#1E293B' : '#FFFFFF';
          ctx.beginPath();
          ctx.roundRect(margin, currentY, contentWidth, 240, 24);
          ctx.fill();

          ctx.fillStyle = textSecondary;
          ctx.font = '500 32px system-ui, -apple-system, sans-serif';
          wrapText(
            ctx,
            preset.act5Cta || 'Salve este carrossel para consultar e compartilhe nos stories. Conversar com calma e respeito transforma mais do que brigar.',
            margin + 40,
            currentY + 70,
            contentWidth - 80,
            48
          );

          // Selo Final Casa 13
          const badgeY = height - 170;
          ctx.fillStyle = accentRed;
          ctx.font = 'bold 32px system-ui, -apple-system, sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('🇧🇷 BORA 13 • casa13.pt.org.br', width / 2, badgeY);
          ctx.textAlign = 'left';
        }
      }

      // ── MODO POST ÚNICO (SQUARE 1:1 OU STORY 9:16) ──
      else {
        ctx.fillStyle = accentRed;
        ctx.font = 'bold 28px system-ui, -apple-system, sans-serif';
        ctx.fillText(`FATO AUDITADO • ${preset.categoryTag.toUpperCase()}`, margin, currentY);
        currentY += 45;

        ctx.fillStyle = textPrimary;
        ctx.font = format === 'story' ? 'bold 64px system-ui, -apple-system, sans-serif' : 'bold 54px system-ui, -apple-system, sans-serif';
        currentY = wrapText(ctx, preset.headline, margin, currentY, contentWidth, format === 'story' ? 76 : 66);
        currentY += 35;

        // Bloco de Prova
        ctx.fillStyle = isDark ? '#1E293B' : '#FFFFFF';
        ctx.beginPath();
        const boxH = format === 'story' ? 520 : 360;
        ctx.roundRect(margin, currentY, contentWidth, boxH, 24);
        ctx.fill();
        ctx.strokeStyle = accentGreen;
        ctx.lineWidth = 3;
        ctx.stroke();

        ctx.fillStyle = textPrimary;
        ctx.font = '500 32px system-ui, -apple-system, sans-serif';
        wrapText(ctx, preset.proofData || preset.bodyText, margin + 40, currentY + 65, contentWidth - 80, 50);

        if (format === 'story') {
          currentY += boxH + 60;
          ctx.fillStyle = isDark ? '#1E293B' : '#FEF3C7';
          ctx.beginPath();
          ctx.roundRect(margin, currentY, contentWidth, 240, 24);
          ctx.fill();

          ctx.fillStyle = '#92400E';
          ctx.font = 'bold 30px system-ui, -apple-system, sans-serif';
          ctx.fillText('💬 ENQUETE:', margin + 35, currentY + 60);

          ctx.fillStyle = textPrimary;
          ctx.font = '500 28px system-ui, -apple-system, sans-serif';
          wrapText(
            ctx,
            'Você já sentiu essa melhora na sua vida ou na sua cidade? Responda abaixo!',
            margin + 35,
            currentY + 110,
            contentWidth - 70,
            42
          );
        }
      }

      // 4. RODAPÉ INSTITUCIONAL COM IDENTIDADE BRASIL
      const footerY = height - 60;
      ctx.fillStyle = isDark ? '#475569' : '#94A3B8';
      ctx.font = 'bold 20px system-ui, -apple-system, sans-serif';
      ctx.fillText(`Auditoria Oficial • ${preset.sourceName}`, margin, footerY);

      // Assinatura lateral
      ctx.textAlign = 'right';
      ctx.fillText('Bora 13 • Fatos Reais', width - margin, footerY);
      ctx.textAlign = 'left';
    },
    [activeSlide, format, theme, preset, TOTAL_SLIDES]
  );

  // Redesenhar quando mudar qualquer parâmetro
  useEffect(() => {
    renderCanvas(activeSlide);
  }, [renderCanvas, activeSlide]);

  // ─────────────────────────────────────────────────────────────
  // AÇÕES DE EXPORTAÇÃO E CÓPIA
  // ─────────────────────────────────────────────────────────────

  const handleCopyText = async (text: string, key: string) => {
    playProceduralHaptic('copy');
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2200);
    } catch {
      // fallback
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2200);
    }
  };

  const handleDownloadSlide = (slideIndex: number = activeSlide) => {
    playProceduralHaptic('generate');
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Se estiver em outro slide, renderiza temporariamente e exporta
    if (slideIndex !== activeSlide) {
      renderCanvas(slideIndex);
    }

    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `bora13-${preset.categoryTag}-slide-${slideIndex + 1}.png`;
    link.href = dataUrl;
    link.click();

    // Restaura o slide ativo
    if (slideIndex !== activeSlide) {
      renderCanvas(activeSlide);
    }
  };

  const handleDownloadAllSlides = async () => {
    setIsExporting(true);
    playProceduralHaptic('generate');
    try {
      for (let i = 0; i < TOTAL_SLIDES; i++) {
        handleDownloadSlide(i);
        await new Promise((r) => setTimeout(r, 350));
      }
    } finally {
      setIsExporting(false);
    }
  };

  const handleNativeShare = async () => {
    playProceduralHaptic('click');
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.toBlob(async (blob) => {
      if (!blob) return;
      const file = new File([blob], `bora13-${preset.categoryTag}.png`, { type: 'image/png' });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            title: preset.headline,
            text: copies.instagram,
            files: [file],
          });
        } catch {
          handleDownloadSlide();
        }
      } else {
        handleDownloadSlide();
      }
    });
  };

  return (
    <section className="w-full max-w-7xl mx-auto px-4 py-8 animate-fade-in">
      {/* ── TOPO DA SESSÃO EDITORIAL ── */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-red-100 dark:bg-red-950/40 text-[#C52229] dark:text-red-300 mb-2">
            <span>📲</span>
            <span>Passo 4: Mandar no Zap e Redes</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Imagens e Mensagens Prontas
          </h2>
          <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
            Escolha o tema que você quer mostrar. O Bora 13 prepara a imagem bonita e a mensagem certinha pra você mandar no WhatsApp da família, postar no Status ou no Instagram com dados oficiais verdadeiros.
          </p>
        </div>

        {/* Status de Contexto Herdado do Orquestrador */}
        {preset.sourceOrigin !== 'independent' && (
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40">
            <span className="text-2xl">{preset.emoji}</span>
            <div className="text-xs">
              <span className="font-bold text-amber-900 dark:text-amber-300 block">
                Contexto Ativo do Orquestrador
              </span>
              <span className="text-slate-600 dark:text-slate-400">
                Origem: {preset.sourceOrigin} • {preset.categoryTag}
              </span>
            </div>
            <button
              onClick={() => {
                playProceduralHaptic('click');
                setPreset(createDefaultPostPreset());
              }}
              className="text-[11px] font-bold text-amber-800 dark:text-amber-200 underline ml-2"
            >
              Resetar
            </button>
          </div>
        )}
      </div>

      {/* ── SELETOR DE TEMAS & CONTEÚDOS PRONTOS (CATÁLOGO RÁPIDO) ── */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            📚 Escolher Tema ou Pauta para Gerar:
          </span>
          <div className="flex gap-1 overflow-x-auto pb-1 no-scrollbar">
            {(
              [
                { id: 'todos', label: '🌟 Todos' },
                { id: 'tatico_4votos', label: '🎯 Tática dos 4 Votos' },
                { id: 'menos_com_flavio', label: '📉 O Menos com Flávio' },
                { id: 'fatos', label: '⚡ Fatos Auditados' },
                { id: 'oportunidades', label: '🎒 Direitos & Bolso' },
                { id: 'territorio', label: '📍 Por Estado (UF)' },
                { id: 'custom', label: '✍️ Post Livre' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  playProceduralHaptic('click');
                  setCatalogFilter(tab.id);
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all shrink-0 ${
                  catalogFilter === tab.id
                    ? 'bg-[#C52229] text-white shadow-sm'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Carrossel Horizontal de Pílulas de Conteúdo */}
        <div className="flex gap-2.5 overflow-x-auto pb-3 scrollbar-none">
          {/* Templates Táticos do 2º Turno (Normose / Felipe Bone) */}
          {(catalogFilter === 'todos' || catalogFilter === 'tatico_4votos') &&
            TACTICAL_PRESET_TEMPLATES.map((tpl) => (
              <button
                key={tpl.id}
                onClick={() => {
                  playProceduralHaptic('card');
                  setPreset(tpl);
                  setActiveSlide(0);
                }}
                className={`flex-shrink-0 p-3 rounded-2xl border text-left transition-all max-w-[260px] ${
                  preset.id === tpl.id
                    ? 'border-[#C52229] bg-red-50/80 dark:bg-red-950/30 shadow-md ring-2 ring-red-300/40'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">{tpl.emoji}</span>
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#C52229]">
                    ⚡ Tática 2º Turno
                  </span>
                </div>
                <p className="text-xs font-bold text-slate-900 dark:text-white line-clamp-2 leading-tight">
                  {tpl.title}
                </p>
                <span className="text-[10px] text-slate-500 line-clamp-1 mt-1 block">
                  {tpl.headline}
                </span>
              </button>
            ))}

          {/* As 4 Frentes de Conversão */}
          {(catalogFilter === 'todos' || catalogFilter === 'tatico_4votos') &&
            CONVERSION_FRONTS.map((front) => (
              <button
                key={front.id}
                onClick={() => {
                  playProceduralHaptic('card');
                  setPreset(createPostPresetFromConversionFront(front, memory));
                  setActiveSlide(0);
                }}
                className={`flex-shrink-0 p-3 rounded-2xl border text-left transition-all max-w-[250px] ${
                  preset.id === `post-front-${front.id}`
                    ? 'border-[#C52229] bg-red-50/80 dark:bg-red-950/30 shadow-md ring-2 ring-red-300/40'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">{front.icon}</span>
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-700 dark:text-amber-300">
                    Frente {front.number}: {front.tag}
                  </span>
                </div>
                <p className="text-xs font-bold text-slate-900 dark:text-white line-clamp-2 leading-tight">
                  {front.title}
                </p>
              </button>
            ))}

          {/* Fatos do "Menos com Flávio" */}
          {(catalogFilter === 'todos' || catalogFilter === 'menos_com_flavio') &&
            MENOS_COM_FLAVIO_FACTS.map((fact) => (
              <button
                key={fact.id}
                onClick={() => {
                  playProceduralHaptic('card');
                  setPreset(createPostPresetFromMenosFact(fact, memory));
                  setActiveSlide(0);
                }}
                className={`flex-shrink-0 p-3 rounded-2xl border text-left transition-all max-w-[250px] ${
                  preset.id === `post-menos-${fact.id}`
                    ? 'border-amber-500 bg-amber-50/80 dark:bg-amber-950/30 shadow-md ring-2 ring-amber-300/40'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">{fact.icon}</span>
                  <span className="text-[10px] font-black uppercase tracking-wider text-red-600">
                    {fact.highlight}
                  </span>
                </div>
                <p className="text-xs font-bold text-slate-900 dark:text-white line-clamp-2 leading-tight">
                  {fact.title}
                </p>
              </button>
            ))}
          {/* Fatos */}
          {(catalogFilter === 'todos' || catalogFilter === 'fatos') &&
            ARGUMENTS_DATABASE.slice(0, 8).map((arg) => (
              <button
                key={arg.id}
                onClick={() => {
                  playProceduralHaptic('card');
                  setPreset(createPostPresetFromArgument(arg, memory));
                  setActiveSlide(0);
                }}
                className={`flex-shrink-0 p-3 rounded-2xl border text-left transition-all max-w-[240px] ${
                  preset.id === `post-arg-${arg.id}`
                    ? 'border-[#C52229] bg-red-50/80 dark:bg-red-950/30 shadow-md ring-2 ring-red-300/40'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">{arg.emoji}</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#C52229]">
                    {arg.category}
                  </span>
                </div>
                <p className="text-xs font-bold text-slate-900 dark:text-white line-clamp-2 leading-tight">
                  {arg.headline}
                </p>
              </button>
            ))}

          {/* Oportunidades */}
          {(catalogFilter === 'todos' || catalogFilter === 'oportunidades') &&
            OPPORTUNITIES_DATABASE.map((opp) => (
              <button
                key={opp.id}
                onClick={() => {
                  playProceduralHaptic('card');
                  setPreset(createPostPresetFromOpportunity(opp, memory));
                  setActiveSlide(0);
                }}
                className={`flex-shrink-0 p-3 rounded-2xl border text-left transition-all max-w-[240px] ${
                  preset.id === `post-opp-${opp.id}`
                    ? 'border-emerald-500 bg-emerald-50/80 dark:bg-emerald-950/30 shadow-md ring-2 ring-emerald-300/40'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">{opp.icon}</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">
                    {opp.badge}
                  </span>
                </div>
                <p className="text-xs font-bold text-slate-900 dark:text-white line-clamp-2 leading-tight">
                  {opp.title}
                </p>
              </button>
            ))}

          {/* Territórios */}
          {(catalogFilter === 'todos' || catalogFilter === 'territorio') &&
            BRAZIL_STATES_GEO.slice(0, 8).map((st) => (
              <button
                key={st.uf}
                onClick={() => {
                  playProceduralHaptic('card');
                  setPreset(createPostPresetFromTerritory(st.uf, st.capital));
                  setActiveSlide(0);
                }}
                className={`flex-shrink-0 p-3 rounded-2xl border text-left transition-all max-w-[200px] ${
                  preset.id === `post-geo-${st.uf}`
                    ? 'border-amber-500 bg-amber-50/80 dark:bg-amber-950/30 shadow-md ring-2 ring-amber-300/40'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">📍</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700">
                    {st.uf} • {st.region}
                  </span>
                </div>
                <p className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1 leading-tight">
                  {st.name}
                </p>
              </button>
            ))}
        </div>
      </div>

      {/* ── GRID PRINCIPAL: CONTROLES À ESQUERDA & PREVIEW CANVAS À DIREITA ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* COLUNA ESQUERDA: CONTROLES DE DESIGN & EDIÇÃO (5 COLUNAS) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* Seletor de Formato & Tema Visual */}
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 block">
                📐 Tamanho e Formato
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'carousel', label: 'Sequência de 5 Fotos', icon: '🎠', desc: 'Feed e Grupos' },
                  { id: 'square', label: '1 Imagem Quadrada', icon: '🖼️', desc: 'Direto ao Ponto' },
                  { id: 'story', label: 'Status / Stories', icon: '📱', desc: 'Tela Cheia do Zap' },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => {
                      playProceduralHaptic('toggle');
                      setFormat(f.id as PostFormat);
                      setActiveSlide(0);
                    }}
                    className={`p-3 rounded-2xl border text-center transition-all ${
                      format === f.id
                        ? 'border-[#C52229] bg-red-50/70 dark:bg-red-950/30 text-[#C52229] font-bold shadow-sm ring-1 ring-[#C52229]'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <span className="text-xl block mb-1">{f.icon}</span>
                    <span className="text-xs block font-bold">{f.label}</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">{f.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Tema Estético */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 block">
                🎨 Estilo Visual da Imagem
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'brasil-editorial', name: 'Claro Oficial (Fundo Branco)', color: '#FAF7F2', border: '#C52229' },
                  { id: 'brasil-vibrante', name: 'Cores do Brasil (Solar)', color: '#FEF3C7', border: '#F59E0B' },
                  { id: 'dark-moderno', name: 'Modo Escuro (Elegante)', color: '#0B0F19', border: '#C52229' },
                  { id: 'concretismo-puro', name: 'Verde e Amarelo Destaque', color: '#F4F4F5', border: '#006B3F' },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      playProceduralHaptic('toggle');
                      setTheme(t.id as VisualTheme);
                    }}
                    className={`p-3 rounded-2xl border text-left flex items-center gap-2.5 transition-all ${
                      theme === t.id
                        ? 'border-[#C52229] shadow-sm ring-1 ring-[#C52229] bg-red-50/30 dark:bg-red-950/20'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                    }`}
                  >
                    <span
                      className="w-5 h-5 rounded-full border border-slate-300 dark:border-slate-700 shrink-0 shadow-inner"
                      style={{ background: t.color }}
                    />
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-tight">
                      {t.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Editor de Textos do Post Atual */}
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                ✍️ Ajustar Texto da Imagem
              </span>
              <span className="text-[11px] text-slate-400">Opcional: edite se quiser</span>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1 block">
                Título Principal da Imagem:
              </label>
              <input
                type="text"
                value={preset.headline}
                onChange={(e) => setPreset((p) => ({ ...p, headline: e.target.value }))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#C52229]"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1 block">
                Dado ou Conquista Oficial:
              </label>
              <textarea
                rows={3}
                value={preset.proofData}
                onChange={(e) => setPreset((p) => ({ ...p, proofData: e.target.value }))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#C52229]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1 block">
                  A Dúvida ou Boato:
                </label>
                <input
                  type="text"
                  value={preset.counterArg || ''}
                  onChange={(e) => setPreset((p) => ({ ...p, counterArg: e.target.value }))}
                  placeholder="Ex: Mas tudo está caro..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-[#C52229]"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1 block">
                  A Resposta com Fatos:
                </label>
                <input
                  type="text"
                  value={preset.rebuttal || ''}
                  onChange={(e) => setPreset((p) => ({ ...p, rebuttal: e.target.value }))}
                  placeholder="Ex: Inflação dos alimentos despencou..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-[#C52229]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1 block">
                  De onde é a informação (Fonte):
                </label>
                <input
                  type="text"
                  value={preset.sourceName}
                  onChange={(e) => setPreset((p) => ({ ...p, sourceName: e.target.value }))}
                  placeholder="Ex: IBGE, Banco Central"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-[#C52229]"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1 block">
                  Link Oficial de Consulta:
                </label>
                <input
                  type="text"
                  value={preset.sourceUrl}
                  onChange={(e) => setPreset((p) => ({ ...p, sourceUrl: e.target.value }))}
                  placeholder="https://..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-[#C52229]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* COLUNA DIREITA: PREVIEW DO CANVAS & MOTOR DE COPYWRITING (7 COLUNAS) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* Card do Preview do Canvas */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg flex flex-col items-center">
            {/* Navegador de Slides do Carrossel */}
            {format === 'carousel' && (
              <div className="flex items-center justify-between w-full mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
                  Slide Ativo: <strong className="text-[#C52229]">{activeSlide + 1} de {TOTAL_SLIDES}</strong>
                </span>

                <div className="flex items-center gap-1.5">
                  {[0, 1, 2, 3, 4].map((idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        playProceduralHaptic('slide');
                        setActiveSlide(idx);
                      }}
                      className={`w-8 h-8 rounded-full text-xs font-bold transition-all ${
                        activeSlide === idx
                          ? 'bg-[#C52229] text-white shadow-sm scale-110'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                      }`}
                    >
                      {idx + 1}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Container Responsivo do Canvas com Box Shadow Realista */}
            <div
              className={`w-full max-w-[480px] rounded-2xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 relative bg-slate-50 dark:bg-black transition-all ${
                format === 'story' ? 'aspect-[9/16]' : 'aspect-square'
              }`}
            >
              <canvas
                ref={canvasRef}
                className="w-full h-full object-contain block"
              />
            </div>

            {/* Barra de Ações do Canvas */}
            <div className="flex flex-wrap items-center justify-between gap-3 w-full mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDownloadSlide(activeSlide)}
                  className="px-4 py-2.5 rounded-xl bg-[#C52229] hover:bg-[#a51b21] text-white font-bold text-xs flex items-center gap-2 transition-all shadow-md active:scale-95"
                >
                  <span>📥</span>
                  <span>Salvar Imagem no Celular</span>
                </button>

                {format === 'carousel' && (
                  <button
                    onClick={handleDownloadAllSlides}
                    disabled={isExporting}
                    className="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 transition-all"
                  >
                    {isExporting ? '⏳ Salvando...' : '📦 Salvar Todas as 5 Imagens'}
                  </button>
                )}
              </div>

              <button
                onClick={handleNativeShare}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-md active:scale-95"
              >
                <span>📲</span>
                <span>Enviar Direto no Zap</span>
              </button>
            </div>
          </div>

          {/* ── SUÍTE DE MENSAGENS PRONTAS ── */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                  <span>📝</span>
                  <span>Mensagem Pronta pra Copiar e Colar</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Já deixamos o texto no ponto certo. É só clicar em copiar e colar no aplicativo!
                </p>
              </div>

              {/* Botão Copiar da Aba Atual */}
              <button
                onClick={() => handleCopyText(copies[copyTab], `copy-${copyTab}`)}
                className="px-3.5 py-1.5 rounded-xl bg-[#C52229] hover:bg-[#a51b21] text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1.5"
              >
                <span>{copiedKey === `copy-${copyTab}` ? '✅' : '📋'}</span>
                <span>{copiedKey === `copy-${copyTab}` ? 'Copiado!' : 'Copiar Mensagem'}</span>
              </button>
            </div>

            {/* Abas de Plataforma */}
            <div className="flex gap-2 border-b border-slate-200 dark:border-slate-800 pb-3 mb-4">
              {[
                { id: 'whatsapp', label: 'WhatsApp (Família e Grupos)', icon: '💬' },
                { id: 'instagram', label: 'Instagram (Legenda)', icon: '📸' },
                { id: 'stories', label: 'Status do Zap / Stories', icon: '📱' },
                { id: 'threads', label: 'Twitter / X / Threads', icon: '🧵' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    playProceduralHaptic('toggle');
                    setCopyTab(tab.id as CopyPlatform);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    copyTab === tab.id
                      ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Prévia do Texto com Formatação */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 max-h-60 overflow-y-auto">
              <p className="text-xs whitespace-pre-wrap font-sans leading-relaxed text-slate-800 dark:text-slate-200">
                {copies[copyTab]}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
