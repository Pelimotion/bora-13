'use client';

import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import JSZip from 'jszip';
import {
  type PostPresetData,
  type PostFormat,
  type VisualTheme,
  type CopyPlatform,
  type SlideArchetype,
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

// ─────────────────────────────────────────────────────────────
// BIBLIOTECA DE SELOS INSTITUCIONAIS & ADESIVOS DE AUDITORIA
// ─────────────────────────────────────────────────────────────
const OFFICIAL_SEALS = [
  { id: 'selo-casa13', label: '⭐ Bora 13 Cidadão', text: '⭐ BORA 13 • INICIATIVA CIDADÃ' },
  { id: 'selo-ibge', label: '🏛️ Dados IBGE', text: '🏛️ FONTE PÚBLICA AUDITADA • IBGE' },
  { id: 'selo-dieese', label: '📊 Estudo DIEESE', text: '📊 DADOS AUDITADOS • DIEESE' },
  { id: 'selo-comprovado', label: '🛡️ Fato Comprovado', text: '🛡️ FATO COMPROVADO EM DIÁRIO PÚBLICO' },
  { id: 'selo-menos-flavio', label: '📉 O Menos com Flávio', text: '📉 O MENOS COM FLÁVIO • REGISTRO HISTÓRICO' },
  { id: 'selo-pe-de-meia', label: '🎒 Programa Pé-de-Meia', text: '🎒 POUPANÇA DO ENSINO MÉDIO • MEC / CAIXA' },
];

export default function PostStudioSection({
  initialPreset,
  memory,
  onNavigateSection,
}: PostStudioSectionProps) {
  // Estado do Post Preset Atual
  const [preset, setPreset] = useState<PostPresetData>(() => initialPreset || createDefaultPostPreset());
  const [format, setFormat] = useState<PostFormat>(preset.format || 'portrait');
  const [theme, setTheme] = useState<VisualTheme>(preset.theme || 'brasil-editorial');
  const [activeSlide, setActiveSlide] = useState<number>(0);
  const [copyTab, setCopyTab] = useState<CopyPlatform>('instagram');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportProgress, setExportProgress] = useState<string>('');

  // Modo de Operação: Leigo (1-Click Rápido) vs. Avançado (Precision Studio)
  const [studioMode, setStudioMode] = useState<'facil' | 'avancado'>('facil');

  // Controles Avançados de Design
  const [showSafeZone, setShowSafeZone] = useState<boolean>(false);
  const [enablePaperGrain, setEnablePaperGrain] = useState<boolean>(true);
  const [enableGridLines, setEnableGridLines] = useState<boolean>(true);
  const [fontScale, setFontScale] = useState<number>(1);
  const [headlineWeight, setHeadlineWeight] = useState<'bold' | 'black' | 'normal'>('black');
  const [isUppercase, setIsUppercase] = useState<boolean>(false);
  const [activeSeal, setActiveSeal] = useState<string>('⭐ BORA 13 • DIÁLOGO REAL');

  // Arquétipos visuais customizados por slide (para o modo carrossel)
  const [slideArchetypes, setSlideArchetypes] = useState<Record<number, SlideArchetype>>({
    0: 'editorial-cover',
    1: 'big-stat-hero',
    2: 'dialectic-split',
    3: 'pocket-reality',
    4: 'manifesto-cta',
  });

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
  const isCarousel = format === 'carousel' || format === 'portrait';
  const TOTAL_SLIDES = isCarousel ? 5 : 1;

  // Gerador de Cópias Multiplataforma
  const copies = useMemo(() => {
    return generateSmartCopy(preset, memory);
  }, [preset, memory]);

  // Função auxiliar para quebrar texto no canvas 2D com suporte a line-height
  const wrapText = (
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    maxWidth: number,
    lineHeight: number
  ): number => {
    if (!text) return y;
    const words = text.split(' ');
    let line = '';
    let currentY = y;

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        ctx.fillText(line.trim(), x, currentY);
        line = words[n] + ' ';
        currentY += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line.trim(), x, currentY);
    return currentY + lineHeight;
  };

  // Gerador Procedural de Textura Analógica (Papel Algodão / Grão Estocástico)
  const applyAnalogTexture = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    intensity: number = 0.035
  ) => {
    if (!enablePaperGrain) return;
    try {
      const w = Math.min(width, 1080);
      const h = Math.min(height, 1920);
      const imgData = ctx.getImageData(0, 0, w, h);
      const data = imgData.data;
      const len = data.length;
      for (let i = 0; i < len; i += 16) {
        const noise = (Math.random() - 0.5) * intensity * 255;
        data[i] = Math.min(255, Math.max(0, data[i] + noise));
        data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise));
        data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise));
      }
      ctx.putImageData(imgData, 0, 0);
    } catch {
      // Fallback gracioso caso cross-origin ou memória restrinja getImageData
    }
  };

  // ─────────────────────────────────────────────────────────────
  // RENDERIZADOR NATIVO CANVAS 2D DE ALTA FIDELIDADE
  // Dimensões Oficiais:
  // - Retrato 4:5 (Padrão de Ouro Feed Instagram): 1080 x 1350
  // - Quadrado 1:1: 1080 x 1080
  // - Story 9:16: 1080 x 1920
  // ─────────────────────────────────────────────────────────────
  const renderCanvas = useCallback(
    (slideIdx: number = activeSlide) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const width = 1080;
      let height = 1350; // Padrão Retrato 4:5
      if (format === 'square') height = 1080;
      else if (format === 'story') height = 1920;
      else if (format === 'portrait' || format === 'carousel') height = 1350;

      canvas.width = width;
      canvas.height = height;

      // 1. TEMA DE FUNDO & ATMOSFERA EDITORIAL
      const isDark = theme === 'dark-moderno';
      const isInvestigativo = theme === 'jornalismo-investigativo';
      const isVibrante = theme === 'brasil-vibrante';
      const isConcretista = theme === 'concretismo-puro';

      if (theme === 'brasil-editorial') {
        // Fundo papel algodão off-white autêntico
        ctx.fillStyle = '#FAF7F2';
        ctx.fillRect(0, 0, width, height);

        // Arcos Concretistas Geométricos
        ctx.save();
        ctx.strokeStyle = 'rgba(0, 107, 63, 0.08)'; // Verde Brasil sutil
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(width - 40, 120, 320, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = 'rgba(197, 34, 41, 0.06)'; // Vermelho Casa 13
        ctx.beginPath();
        ctx.arc(60, height - 160, 380, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      } else if (isVibrante) {
        // Gradiente Solar & Esperança
        const grad = ctx.createLinearGradient(0, 0, width, height);
        grad.addColorStop(0, '#FFFFFF');
        grad.addColorStop(0.4, '#FFFDF5');
        grad.addColorStop(1, '#FEF2F2');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);

        // Faixa geométrica no topo
        ctx.fillStyle = '#C52229';
        ctx.fillRect(0, 0, width, 18);
        ctx.fillStyle = '#F59E0B';
        ctx.fillRect(0, 18, width, 6);
      } else if (isInvestigativo) {
        // Fundo Dossier Editorial Técnico
        ctx.fillStyle = '#F8FAFC';
        ctx.fillRect(0, 0, width, height);

        // Marca de documento auditado no canto
        ctx.fillStyle = 'rgba(15, 23, 42, 0.03)';
        ctx.fillRect(60, 60, width - 120, height - 120);
        ctx.strokeStyle = 'rgba(15, 23, 42, 0.12)';
        ctx.lineWidth = 2;
        ctx.strokeRect(60, 60, width - 120, height - 120);
      } else if (isDark) {
        // Dark Obsidian VIP
        ctx.fillStyle = '#0B0F19';
        ctx.fillRect(0, 0, width, height);

        // Radial glow suave
        const glow = ctx.createRadialGradient(width / 2, 280, 40, width / 2, 280, 640);
        glow.addColorStop(0, 'rgba(197, 34, 41, 0.28)');
        glow.addColorStop(1, 'rgba(11, 15, 25, 0)');
        ctx.fillStyle = glow;
        ctx.fillRect(0, 0, width, height);
      } else {
        // Concretismo Puro (Cartaz de Arte Suíço-Brasileira)
        ctx.fillStyle = '#F4F4F5';
        ctx.fillRect(0, 0, width, height);

        // Faixas verticais de corte concreto
        ctx.fillStyle = '#C52229';
        ctx.fillRect(80, 90, 22, 140);
        ctx.fillStyle = '#E5A800';
        ctx.fillRect(108, 90, 12, 140);
        ctx.fillStyle = '#006B3F';
        ctx.fillRect(126, 90, 8, 140);
      }

      // Linhas de Grade Modernistas (1px com transparência calculada)
      if (enableGridLines) {
        ctx.save();
        ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(15,23,42,0.04)';
        ctx.lineWidth = 1;
        // Grade vertical de 12 colunas
        const colW = width / 12;
        for (let c = 1; c < 12; c++) {
          ctx.beginPath();
          ctx.moveTo(c * colW, 0);
          ctx.lineTo(c * colW, height);
          ctx.stroke();
        }
        ctx.restore();
      }

      // Margens e Dimensões do Conteúdo
      const margin = 84;
      const contentWidth = width - margin * 2;

      // Cores do Design System
      const textPrimary = isDark ? '#FFFFFF' : '#0F172A';
      const textSecondary = isDark ? '#94A3B8' : '#475569';
      const textMuted = isDark ? '#64748B' : '#94A3B8';
      const accentRed = '#C52229';
      const accentGold = '#F59E0B';
      const accentGreen = '#10B981';

      // 2. CABEÇALHO DO CARD (Selo & Paginação)
      const headerY = 100;

      // Selo de Destaque no Topo
      ctx.fillStyle = isDark ? 'rgba(197, 34, 41, 0.28)' : '#FEE2E2';
      ctx.beginPath();
      ctx.roundRect(margin, headerY, 340, 52, 26);
      ctx.fill();

      ctx.fillStyle = isDark ? '#FCA5A5' : accentRed;
      ctx.font = 'bold 20px Inter, -apple-system, sans-serif';
      ctx.fillText(activeSeal, margin + 22, headerY + 33);

      // Indicador de Slide no Carrossel (Ato X de 5)
      if (isCarousel) {
        ctx.fillStyle = textMuted;
        ctx.font = 'bold 22px Inter, -apple-system, sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText(`ATO ${slideIdx + 1} DE ${TOTAL_SLIDES}`, width - margin, headerY + 33);
        ctx.textAlign = 'left';
      }

      // 3. RENDERIZAÇÃO DO CONTEÚDO PELO ARQUÉTIPO VISUAL
      let currentY = 220;
      const archetype = slideArchetypes[slideIdx] || (slideIdx === 0 ? 'editorial-cover' : 'big-stat-hero');

      // ── ARQUÉTIPO 1: CAPA NOTICIOSA / EDITORIAL COVER ──
      if (archetype === 'editorial-cover' || (!isCarousel && slideIdx === 0 && format !== 'story')) {
        // Chapéu / Kicker
        ctx.fillStyle = accentRed;
        ctx.font = 'bold 24px Inter, -apple-system, sans-serif';
        ctx.fillText(`DIÁLOGOS DO BRASIL • ${preset.categoryTag.toUpperCase()}`, margin, currentY);
        currentY += 45;

        // Manchete Monumental Display
        const weightStr = headlineWeight === 'black' ? '900' : headlineWeight === 'bold' ? 'bold' : '600';
        const fontSize = Math.round(62 * fontScale);
        ctx.fillStyle = textPrimary;
        ctx.font = `${weightStr} ${fontSize}px Inter, -apple-system, sans-serif`;
        const headlineText = isUppercase ? preset.headline.toUpperCase() : preset.headline;
        currentY = wrapText(ctx, headlineText, margin, currentY, contentWidth, fontSize * 1.18);
        currentY += 36;

        // Caixa de Sub-Hook Editorial com Barra Lateral Rubra
        const boxHeight = 220;
        ctx.fillStyle = isDark ? 'rgba(255, 255, 255, 0.05)' : '#FFFFFF';
        ctx.beginPath();
        ctx.roundRect(margin, currentY, contentWidth, boxHeight, 20);
        ctx.fill();
        ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.1)' : '#E2E8F0';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Barra de Acento Lateral na Caixa
        ctx.fillStyle = accentRed;
        ctx.beginPath();
        ctx.roundRect(margin, currentY, 8, boxHeight, [20, 0, 0, 20]);
        ctx.fill();

        ctx.fillStyle = textSecondary;
        ctx.font = '500 30px Inter, -apple-system, sans-serif';
        wrapText(
          ctx,
          preset.act1Hook || 'O que você precisa saber com dados oficiais antes da próxima conversa em família ou no trabalho.',
          margin + 36,
          currentY + 68,
          contentWidth - 64,
          44
        );

        // Indicador Visual de Deslize (Arrasta pro lado)
        const ctaY = height - 160;
        ctx.fillStyle = accentGold;
        ctx.font = 'bold 28px Inter, -apple-system, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Deslize para ver as provas na mesa 👉', width / 2, ctaY);
        ctx.textAlign = 'left';
      }

      // ── ARQUÉTIPO 2: BIG STAT HERO / O DADO DE IMPACTO ──
      else if (archetype === 'big-stat-hero' || slideIdx === 1) {
        ctx.fillStyle = accentGreen;
        ctx.font = 'bold 24px Inter, -apple-system, sans-serif';
        ctx.fillText('📊 ATO 2 • A PROVA MATERIAL DOCUMENTADA', margin, currentY);
        currentY += 45;

        // Título do Fato
        ctx.fillStyle = textPrimary;
        ctx.font = 'bold 44px Inter, -apple-system, sans-serif';
        currentY = wrapText(ctx, preset.title, margin, currentY, contentWidth, 54);
        currentY += 30;

        // CARD DO BIG STAT (Número Gigante de Impacto)
        const statBoxHeight = 360;
        ctx.fillStyle = isDark ? '#131A29' : '#FFFFFF';
        ctx.beginPath();
        ctx.roundRect(margin, currentY, contentWidth, statBoxHeight, 28);
        ctx.fill();
        ctx.strokeStyle = isDark ? 'rgba(16, 185, 129, 0.4)' : '#A7F3D0';
        ctx.lineWidth = 2.5;
        ctx.stroke();

        // Número Gigante Tabular
        const statNum = preset.statNumber || '100% AUDITADO';
        ctx.fillStyle = accentGreen;
        ctx.font = '900 88px Inter, -apple-system, sans-serif';
        ctx.fillText(statNum, margin + 44, currentY + 110);

        // Rótulo do Número
        const statLabel = preset.statLabel || 'Dados consolidados por instituições de estado';
        ctx.fillStyle = accentGold;
        ctx.font = 'bold 24px Inter, -apple-system, sans-serif';
        ctx.fillText(statLabel.toUpperCase(), margin + 46, currentY + 160);

        // Texto do Fato / Prova
        ctx.fillStyle = textPrimary;
        ctx.font = '500 28px Inter, -apple-system, sans-serif';
        wrapText(ctx, preset.proofData || preset.bodyText, margin + 46, currentY + 225, contentWidth - 92, 42);

        currentY += statBoxHeight + 40;

        // Carimbo de Auditoria
        ctx.fillStyle = textSecondary;
        ctx.font = 'bold 22px Inter, -apple-system, sans-serif';
        ctx.fillText(`🏛️ FONTE INSTITUCIONAL: ${preset.sourceName}`, margin, currentY);
      }

      // ── ARQUÉTIPO 3: DIALECTIC SPLIT / O DESARME TÁTICO ──
      else if (archetype === 'dialectic-split' || slideIdx === 2) {
        ctx.fillStyle = accentGold;
        ctx.font = 'bold 24px Inter, -apple-system, sans-serif';
        ctx.fillText('🛡️ ATO 3 • O DESARME SEM CONFRONTO', margin, currentY);
        currentY += 45;

        // Bloco 1: "O que costumam dizer" (Dúvida / Rumor)
        const objectionHeight = 210;
        ctx.fillStyle = isDark ? '#1C1917' : '#FEF2F2';
        ctx.beginPath();
        ctx.roundRect(margin, currentY, contentWidth, objectionHeight, 24);
        ctx.fill();
        ctx.strokeStyle = isDark ? 'rgba(239, 68, 68, 0.4)' : '#FECACA';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = accentRed;
        ctx.font = 'bold 22px Inter, -apple-system, sans-serif';
        ctx.fillText('🤔 O QUE COSTUMAM FALAR:', margin + 36, currentY + 48);

        ctx.fillStyle = textPrimary;
        ctx.font = '500 28px Inter, -apple-system, sans-serif';
        wrapText(
          ctx,
          `"${preset.counterArg || 'Dizem que tudo continua igual e que nada melhorou no dia a dia.'}"`,
          margin + 36,
          currentY + 102,
          contentWidth - 72,
          40
        );

        currentY += objectionHeight + 35;

        // Bloco 2: "O que os documentos provam" (Resposta com Provas)
        const rebuttalHeight = 270;
        ctx.fillStyle = isDark ? '#064E3B' : '#F0FDF4';
        ctx.beginPath();
        ctx.roundRect(margin, currentY, contentWidth, rebuttalHeight, 24);
        ctx.fill();
        ctx.strokeStyle = accentGreen;
        ctx.lineWidth = 3;
        ctx.stroke();

        ctx.fillStyle = accentGreen;
        ctx.font = 'bold 22px Inter, -apple-system, sans-serif';
        ctx.fillText('✅ A PROVA REAL COM DOCUMENTOS:', margin + 36, currentY + 50);

        ctx.fillStyle = isDark ? '#ECFDF5' : '#0F172A';
        ctx.font = '600 30px Inter, -apple-system, sans-serif';
        wrapText(
          ctx,
          preset.rebuttal || preset.bodyText,
          margin + 36,
          currentY + 110,
          contentWidth - 72,
          44
        );
      }

      // ── ARQUÉTIPO 4: POCKET REALITY / A VIDA REAL NO BOLSO ──
      else if (archetype === 'pocket-reality' || slideIdx === 3) {
        ctx.fillStyle = accentRed;
        ctx.font = 'bold 24px Inter, -apple-system, sans-serif';
        ctx.fillText('💡 ATO 4 • TRADUZINDO PARA A VIDA REAL', margin, currentY);
        currentY += 45;

        ctx.fillStyle = textPrimary;
        ctx.font = 'bold 46px Inter, -apple-system, sans-serif';
        currentY = wrapText(ctx, 'Como esse número muda o dia a dia da sua família?', margin, currentY, contentWidth, 58);
        currentY += 35;

        // Bloco de Tradução Popular
        const pocketBoxH = 340;
        ctx.fillStyle = isDark ? '#1E293B' : '#FFFFFF';
        ctx.beginPath();
        ctx.roundRect(margin, currentY, contentWidth, pocketBoxH, 28);
        ctx.fill();
        ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.1)' : '#E2E8F0';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Barra Amarela de Destaque
        ctx.fillStyle = accentGold;
        ctx.beginPath();
        ctx.roundRect(margin, currentY, 10, pocketBoxH, [28, 0, 0, 28]);
        ctx.fill();

        ctx.fillStyle = textPrimary;
        ctx.font = '500 32px Inter, -apple-system, sans-serif';
        wrapText(
          ctx,
          preset.act4PocketImpact || 'Economia não é número abstrato de jornal: é o preço do arroz, do gás e da carne sobrando no final do mês para cuidar da família com tranquilidade.',
          margin + 46,
          currentY + 80,
          contentWidth - 84,
          50
        );
      }

      // ── ARQUÉTIPO 5: MANIFESTO CTA / ESPERANÇA & UNIÃO ──
      else {
        ctx.fillStyle = accentGold;
        ctx.font = 'bold 26px Inter, -apple-system, sans-serif';
        ctx.fillText('⭐ ATO 5 • ESPERANÇA & UNIÃO', margin, currentY);
        currentY += 50;

        ctx.fillStyle = textPrimary;
        ctx.font = 'bold 54px Inter, -apple-system, sans-serif';
        currentY = wrapText(ctx, 'O diálogo constrói pontes. Os fatos constroem o futuro.', margin, currentY, contentWidth, 66);
        currentY += 45;

        // Bloco de Chamada para Ação
        const ctaBoxH = 260;
        ctx.fillStyle = isDark ? '#1E293B' : '#FFFFFF';
        ctx.beginPath();
        ctx.roundRect(margin, currentY, contentWidth, ctaBoxH, 28);
        ctx.fill();
        ctx.strokeStyle = isDark ? 'rgba(245, 158, 11, 0.4)' : '#FDE68A';
        ctx.lineWidth = 2.5;
        ctx.stroke();

        ctx.fillStyle = textSecondary;
        ctx.font = '500 30px Inter, -apple-system, sans-serif';
        wrapText(
          ctx,
          preset.act5Cta || 'Salve este carrossel para consultar e compartilhe nos stories. Conversar com calma e respeito transforma mais do que brigar.',
          margin + 44,
          currentY + 76,
          contentWidth - 88,
          46
        );

        // Selo Final Bora 13 Cidadão
        const badgeY = height - 170;
        ctx.fillStyle = accentRed;
        ctx.font = 'bold 30px Inter, -apple-system, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('⭐ BORA 13 • INICIATIVA CIDADÃ', width / 2, badgeY);
        ctx.textAlign = 'left';
      }

      // 4. RODAPÉ INSTITUCIONAL COM IDENTIDADE BRASIL
      const footerY = height - 60;
      ctx.fillStyle = textMuted;
      ctx.font = 'bold 20px Inter, -apple-system, sans-serif';
      ctx.fillText(`Fonte Pública • ${preset.sourceName}`, margin, footerY);

      ctx.textAlign = 'right';
      ctx.fillText('Bora 13 • Feito pra Somar', width - margin, footerY);
      ctx.textAlign = 'left';

      // 5. OVERLAY VISUAL DE SAFE ZONE DO INSTAGRAM (Se ativo no Modo Avançado)
      if (showSafeZone) {
        ctx.save();
        // Áreas de risco do app do Instagram (Top 120px e Bottom 160px)
        ctx.fillStyle = 'rgba(239, 68, 68, 0.18)';
        ctx.fillRect(0, 0, width, 110); // Header do Instagram
        ctx.fillRect(0, height - 140, width, 140); // Barra de ações e dots

        ctx.fillStyle = '#EF4444';
        ctx.font = 'bold 18px Inter, -apple-system, sans-serif';
        ctx.fillText('⚠️ SAFE ZONE INSTAGRAM (Header / Perfil)', margin, 40);
        ctx.fillText('⚠️ SAFE ZONE INSTAGRAM (Dots / Botões de Ação)', margin, height - 40);

        ctx.strokeStyle = '#EF4444';
        ctx.lineWidth = 2;
        ctx.setLineDash([8, 8]);
        ctx.strokeRect(margin, 110, contentWidth, height - 250);
        ctx.restore();
      }

      // 6. APLICAÇÃO DE GRÃO ANALÓGICO ESTOCÁSTICO (Paper Grain)
      applyAnalogTexture(ctx, width, height, 0.03);
    },
    [
      activeSlide,
      format,
      theme,
      preset,
      TOTAL_SLIDES,
      slideArchetypes,
      showSafeZone,
      enablePaperGrain,
      enableGridLines,
      fontScale,
      headlineWeight,
      isUppercase,
      activeSeal,
      isCarousel,
    ]
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

  // Download de slide individual
  const handleDownloadSlide = (slideIndex: number = activeSlide) => {
    playProceduralHaptic('generate');
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (slideIndex !== activeSlide) {
      renderCanvas(slideIndex);
    }

    const dataUrl = canvas.toDataURL('image/png', 1.0);
    const link = document.createElement('a');
    link.download = `bora13-${preset.categoryTag}-slide-${slideIndex + 1}.png`;
    link.href = dataUrl;
    link.click();

    if (slideIndex !== activeSlide) {
      renderCanvas(activeSlide);
    }
  };

  // Exportação em Lote via JSZip (Baixar todos os 5 slides em um único .ZIP)
  const handleDownloadAllZip = async () => {
    setIsExporting(true);
    setExportProgress('Renderizando slides em alta resolução...');
    playProceduralHaptic('generate');

    try {
      const zip = new JSZip();
      const canvas = canvasRef.current;
      if (!canvas) return;

      const slideNames = [
        '01-capa-editorial.png',
        '02-prova-material.png',
        '03-desarme-tatico.png',
        '04-vida-real-bolso.png',
        '05-conclusao-cta.png',
      ];

      for (let i = 0; i < TOTAL_SLIDES; i++) {
        setExportProgress(`Processando slide ${i + 1} de ${TOTAL_SLIDES}...`);
        renderCanvas(i);
        // Aguarda ciclo de renderização
        await new Promise((r) => setTimeout(r, 80));

        const dataUrl = canvas.toDataURL('image/png', 1.0);
        const base64Data = dataUrl.replace(/^data:image\/png;base64,/, '');
        zip.file(slideNames[i] || `slide-${i + 1}.png`, base64Data, { base64: true });
      }

      setExportProgress('Empacotando arquivo ZIP...');
      const content = await zip.generateAsync({ type: 'blob' });
      const downloadUrl = URL.createObjectURL(content);

      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `bora13-carrossel-${preset.categoryTag}-${Date.now()}.zip`;
      link.click();
      URL.revokeObjectURL(downloadUrl);

      // Restaura o slide ativo
      renderCanvas(activeSlide);
      setExportProgress('✅ Carrossel baixado com sucesso!');
      setTimeout(() => setExportProgress(''), 3000);
    } catch (err) {
      console.error('Erro na exportação ZIP:', err);
      setExportProgress('Erro ao gerar ZIP. Baixando individualmente...');
      setTimeout(() => setExportProgress(''), 2500);
      handleDownloadSlide(activeSlide);
    } finally {
      setIsExporting(false);
    }
  };

  // Envio Nativo via Web Share API
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
      {/* ── CABEÇALHO DO ESTÚDIO ── */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-red-100 dark:bg-red-950/40 text-[#C52229] dark:text-red-300 mb-2">
            <span>✨</span>
            <span>Estúdio Editorial & Carrosséis de Alta Fidelidade</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Criador de Posts & Carrosséis Pro
          </h2>
          <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
            Projetado para eliminar a estética genérica de IA. Gere carrosséis no padrão das melhores agências em 4:5 Retrato ou use o modo estúdio para ajustar camadas, tipografia e selos auditados.
          </p>
        </div>

        {/* Alternador de Modo de Operação (Leigo 1-Click vs. Precision Studio) */}
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => {
              playProceduralHaptic('toggle');
              setStudioMode('facil');
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              studioMode === 'facil'
                ? 'bg-white dark:bg-slate-900 text-[#C52229] shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <span>🪄</span>
            <span>Diretor Rápido (1-Click)</span>
          </button>
          <button
            onClick={() => {
              playProceduralHaptic('toggle');
              setStudioMode('avancado');
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              studioMode === 'avancado'
                ? 'bg-[#C52229] text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <span>🛠️</span>
            <span>Modo Precision (Avançado)</span>
          </button>
        </div>
      </div>

      {/* ── CATÁLOGO E SELETOR DE PAUTAS ── */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            📚 Pauta ou Contexto Ativo:
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

        {/* Pílulas de Pautas Táticas */}
        <div className="flex gap-2.5 overflow-x-auto pb-3 scrollbar-none">
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
                  {tpl.statNumber ? `📊 ${tpl.statNumber}` : tpl.headline}
                </span>
              </button>
            ))}

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

          {(catalogFilter === 'todos' || catalogFilter === 'fatos') &&
            ARGUMENTS_DATABASE.slice(0, 6).map((arg) => (
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
        </div>
      </div>

      {/* ── GRID PRINCIPAL: CONTROLES À ESQUERDA & PREVIEW CANVAS À DIREITA ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* COLUNA ESQUERDA: CONTROLES DO ESTÚDIO (5 COLUNAS) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* Seletor de Formato de Tela (Com 4:5 Retrato Padrão) */}
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  📐 Formato & Proporção
                </label>
                <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
                  Recomendado: 4:5 Retrato
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'portrait', label: '4:5 Retrato Feed', icon: '📸', desc: '1080x1350 • Mais tela' },
                  { id: 'square', label: '1:1 Quadrado', icon: '🖼️', desc: '1080x1080 • Tradicional' },
                  { id: 'story', label: '9:16 Stories/Zap', icon: '📱', desc: '1080x1920 • Tela Cheia' },
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

            {/* Seletor de Tema & Atmosfera Editorial */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 block">
                🎨 Estilo & Atmosfera Editorial
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'brasil-editorial', name: 'Brasil Papel Algodão', color: '#FAF7F2', border: '#C52229' },
                  { id: 'dark-moderno', name: 'Dark Obsidian VIP', color: '#0B0F19', border: '#C52229' },
                  { id: 'jornalismo-investigativo', name: 'Dossiê Noticioso', color: '#F1F5F9', border: '#0F172A' },
                  { id: 'brasil-vibrante', name: 'Solar Esperança', color: '#FFFDF5', border: '#F59E0B' },
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

            {/* Seletor de Arquétipo do Slide Ativo (Fim da Monotonia de IA) */}
            {isCarousel && (
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 block">
                  🎭 Arquétipo do Slide {activeSlide + 1}:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'editorial-cover', label: '📰 Capa Noticiosa', desc: 'Manchete de impacto' },
                    { id: 'big-stat-hero', label: '📊 Big Stat (Número)', desc: 'Dado gigante na tela' },
                    { id: 'dialectic-split', label: '🛡️ Desarme Split', desc: 'O que dizem vs. O fato' },
                    { id: 'pocket-reality', label: '💡 Vida Real no Bolso', desc: 'Preço da feira e salário' },
                    { id: 'manifesto-cta', label: '⭐ Manifesto & Ação', desc: 'Conclusão e chamado' },
                  ].map((arq) => (
                    <button
                      key={arq.id}
                      onClick={() => {
                        playProceduralHaptic('toggle');
                        setSlideArchetypes((prev) => ({
                          ...prev,
                          [activeSlide]: arq.id as SlideArchetype,
                        }));
                      }}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        (slideArchetypes[activeSlide] || 'editorial-cover') === arq.id
                          ? 'border-[#C52229] bg-red-50/70 dark:bg-red-950/30 text-[#C52229] font-bold shadow-sm'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <span className="text-xs block font-bold">{arq.label}</span>
                      <span className="text-[10px] text-slate-400 block">{arq.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── PAINEL MODO AVANÇADO (PRECISION STUDIO) ── */}
          {studioMode === 'avancado' && (
            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 animate-fade-in">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-white flex items-center gap-1.5">
                  <span>🛠️</span>
                  <span>Ajustes Finos & Tipografia</span>
                </span>
                <span className="text-[11px] font-bold text-amber-600 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-full">
                  Precision Engine
                </span>
              </div>

              {/* Controles Tipográficos */}
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                    <span>Escala da Tipografia:</span>
                    <span>{Math.round(fontScale * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.8"
                    max="1.3"
                    step="0.05"
                    value={fontScale}
                    onChange={(e) => setFontScale(parseFloat(e.target.value))}
                    className="w-full accent-[#C52229]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      playProceduralHaptic('toggle');
                      setIsUppercase(!isUppercase);
                    }}
                    className={`p-2 rounded-xl border text-xs font-bold transition-all ${
                      isUppercase
                        ? 'border-[#C52229] bg-red-50 text-[#C52229]'
                        : 'border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {isUppercase ? '🔤 CAIXA ALTA (ON)' : '🔤 Caixa Padrão'}
                  </button>

                  <button
                    onClick={() => {
                      playProceduralHaptic('toggle');
                      setHeadlineWeight(headlineWeight === 'black' ? 'bold' : 'black');
                    }}
                    className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold"
                  >
                    Peso: {headlineWeight === 'black' ? '900 Black' : '700 Bold'}
                  </button>
                </div>
              </div>

              {/* Biblioteca de Selos Oficiais */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 block">
                  🛡️ Selo de Topo Ativo:
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {OFFICIAL_SEALS.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => {
                        playProceduralHaptic('click');
                        setActiveSeal(s.text);
                      }}
                      className={`p-2 rounded-xl border text-left text-xs font-bold transition-all ${
                        activeSeal === s.text
                          ? 'border-[#C52229] bg-red-50 text-[#C52229]'
                          : 'border-slate-200 dark:border-slate-800'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Toggles de Texturas Analógicas & Safe Zone */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700 dark:text-slate-300">
                    📐 Máscara Safe Zone (Instagram):
                  </span>
                  <input
                    type="checkbox"
                    checked={showSafeZone}
                    onChange={(e) => setShowSafeZone(e.target.checked)}
                    className="accent-[#C52229] w-4 h-4 cursor-pointer"
                  />
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700 dark:text-slate-300">
                    📜 Textura Papel Algodão / Grão:
                  </span>
                  <input
                    type="checkbox"
                    checked={enablePaperGrain}
                    onChange={(e) => setEnablePaperGrain(e.target.checked)}
                    className="accent-[#C52229] w-4 h-4 cursor-pointer"
                  />
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700 dark:text-slate-300">
                    📏 Guias de Grade Modernista:
                  </span>
                  <input
                    type="checkbox"
                    checked={enableGridLines}
                    onChange={(e) => setEnableGridLines(e.target.checked)}
                    className="accent-[#C52229] w-4 h-4 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Editor de Textos do Post Atual */}
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                ✍️ Ajustar Textos da Imagem
              </span>
              <span className="text-[11px] text-slate-400">Edição livre</span>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1 block">
                Manchete Principal:
              </label>
              <input
                type="text"
                value={preset.headline}
                onChange={(e) => setPreset((p) => ({ ...p, headline: e.target.value }))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#C52229]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1 block">
                  Número Gigante (Big Stat):
                </label>
                <input
                  type="text"
                  value={preset.statNumber || ''}
                  placeholder="Ex: -59%, 17 CAPITAIS"
                  onChange={(e) => setPreset((p) => ({ ...p, statNumber: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-emerald-600 focus:outline-none focus:ring-2 focus:ring-[#C52229]"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1 block">
                  Rótulo do Número:
                </label>
                <input
                  type="text"
                  value={preset.statLabel || ''}
                  placeholder="Ex: Queda no valor da cesta básica"
                  onChange={(e) => setPreset((p) => ({ ...p, statLabel: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-[#C52229]"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1 block">
                Dado ou Prova Pública Auditada:
              </label>
              <textarea
                rows={2}
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
                  placeholder="Ex: Inflação fechou na meta..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-[#C52229]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1 block">
                  Fonte Pública:
                </label>
                <input
                  type="text"
                  value={preset.sourceName}
                  onChange={(e) => setPreset((p) => ({ ...p, sourceName: e.target.value }))}
                  placeholder="Ex: IBGE, DIEESE"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-[#C52229]"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1 block">
                  Link de Consulta:
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
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col items-center">
            {/* Navegador de Slides do Carrossel */}
            {isCarousel && (
              <div className="flex items-center justify-between w-full mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
                  Slide Ativo: <strong className="text-[#C52229]">{activeSlide + 1} de {TOTAL_SLIDES}</strong>
                  <span className="ml-2 text-[11px] text-slate-400">
                    ({slideArchetypes[activeSlide] === 'editorial-cover' ? 'Capa Noticiosa' : slideArchetypes[activeSlide] === 'big-stat-hero' ? 'Dado Gigante' : slideArchetypes[activeSlide] === 'dialectic-split' ? 'Desarme Tático' : slideArchetypes[activeSlide] === 'pocket-reality' ? 'Vida Real' : 'Conclusão'})
                  </span>
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
                          ? 'bg-[#C52229] text-white shadow-md scale-110'
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
                format === 'story'
                  ? 'aspect-[9/16]'
                  : format === 'square'
                  ? 'aspect-square'
                  : 'aspect-[4/5]'
              }`}
            >
              <canvas
                ref={canvasRef}
                className="w-full h-full object-contain block"
              />
            </div>

            {/* Barra de Status da Exportação */}
            {exportProgress && (
              <div className="w-full mt-3 p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 text-xs font-bold text-center animate-pulse">
                {exportProgress}
              </div>
            )}

            {/* Barra de Ações do Canvas */}
            <div className="flex flex-wrap items-center justify-between gap-3 w-full mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDownloadSlide(activeSlide)}
                  className="px-4 py-2.5 rounded-xl bg-[#C52229] hover:bg-[#a51b21] text-white font-bold text-xs flex items-center gap-2 transition-all shadow-md active:scale-95"
                >
                  <span>📥</span>
                  <span>Salvar Imagem (Slide {activeSlide + 1})</span>
                </button>

                {isCarousel && (
                  <button
                    onClick={handleDownloadAllZip}
                    disabled={isExporting}
                    className="px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-black dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
                  >
                    <span>📦</span>
                    <span>{isExporting ? 'Empacotando...' : 'Baixar Carrossel (.ZIP)'}</span>
                  </button>
                )}
              </div>

              <button
                onClick={handleNativeShare}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-md active:scale-95"
              >
                <span>📲</span>
                <span>Enviar no Zap / Stories</span>
              </button>
            </div>
          </div>

          {/* ── SUÍTE DE MENSAGENS PRONTAS ── */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                  <span>📝</span>
                  <span>Legenda & Mensagem Dialética Adaptada</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Copywriting estratégico sem clichê de IA, calibrado para a sintaxe de cada rede.
                </p>
              </div>

              <button
                onClick={() => handleCopyText(copies[copyTab], `copy-${copyTab}`)}
                className="px-3.5 py-1.5 rounded-xl bg-[#C52229] hover:bg-[#a51b21] text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1.5"
              >
                <span>{copiedKey === `copy-${copyTab}` ? '✅' : '📋'}</span>
                <span>{copiedKey === `copy-${copyTab}` ? 'Copiado!' : 'Copiar Texto'}</span>
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
