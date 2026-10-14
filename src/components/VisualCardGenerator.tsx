'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import type { Argument } from '@/data/arguments';

interface VisualCardGeneratorProps {
  argument: Argument;
  onClose: () => void;
}

type CardFormat = 'square' | 'story' | 'carousel';
type VisualTheme = 'brasil-editorial' | 'brasil-vibrante' | 'dark-moderno';
type CopyPlatform = 'instagram' | 'whatsapp' | 'stories' | 'threads';

export default function VisualCardGenerator({ argument, onClose }: VisualCardGeneratorProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [format, setFormat] = useState<CardFormat>('carousel');
  const [theme, setTheme] = useState<VisualTheme>('brasil-editorial');
  const [carouselSlide, setCarouselSlide] = useState<number>(0);
  const [copyPlatform, setCopyPlatform] = useState<CopyPlatform>('instagram');
  const [copiedCopy, setCopiedCopy] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [shareSupported, setShareSupported] = useState(false);

  useEffect(() => {
    if (typeof navigator !== 'undefined' && !!navigator.share && !!navigator.canShare) {
      setShareSupported(true);
    }
  }, []);

  // Total de slides no modo carrossel
  const TOTAL_SLIDES = 5;

  // Gerador de textos adaptados por plataforma (Copywriting refinado, não apenas cópia crua)
  const generateAdaptedCopy = useCallback(
    (platform: CopyPlatform): string => {
      switch (platform) {
        case 'instagram':
          return `🔥 ${argument.headline}

Muitas vezes a conversa do dia a dia fica presa em boatos de grupos, mas os números oficiais mostram uma realidade que afeta diretamente o bolso da nossa gente.

📌 O que os dados comprovam:
${argument.scriptText}

${
  argument.counterArgument && argument.rebuttal
    ? `🤔 "Mas e quem diz que ${argument.counterArgument}?"\n✅ A resposta com provas na mesa: ${argument.rebuttal}\n`
    : ''
}
📊 Fonte Oficial Auditada: ${argument.sourceName}
${argument.sourceUrl && argument.sourceUrl !== '#' ? `📎 Documento completo: ${argument.sourceUrl}\n` : ''}
💬 Conversar ouvindo o outro transforma mais do que brigar. Salve este carrossel para consultar e compartilhe nos stories!

#BrasilQueDáCerto #DiálogoPopular #Bora13 #FatosReais #EconomiaPopular #Esperança #Brasil`;

        case 'whatsapp':
          return `Oi! Lembrei de você e da nossa conversa esses dias:

⭐ *${argument.headline}*

${argument.scriptText}

${
  argument.counterArgument && argument.rebuttal
    ? `👉 Se comentarem que "${argument.counterArgument}":\n✅ O número oficial na prática é: ${argument.rebuttal}\n`
    : ''
}
📊 Fonte auditada pelo governo/institutos: *${argument.sourceName}*

Sem briga nenhuma, só compartilhando informação checada pra gente saber dos nossos direitos e do que tá acontecendo de verdade. Um abraço!`;

        case 'stories':
          return `👀 VOCÊ JÁ NOTOU ISSO?

"${argument.headline}"

📊 Dado oficial do ${argument.sourceName}:
${argument.scriptText.slice(0, 150)}...

👉 Responda aqui na caixinha: você sentiu essa melhora na sua vida ou na sua feira este ano?`;

        case 'threads':
          return `1/3 🧵 ${argument.headline}

${argument.scriptText}

2/3 📊 Órgão oficial auditado: ${argument.sourceName}.
${argument.counterArgument ? `O fato documentado: ${argument.rebuttal}` : ''}

3/3 O Brasil avança quando colocamos o trabalho e a comida no centro do debate. Bora dialogar com respeito. 🇧🇷`;
      }
    },
    [argument]
  );

  // Renderizar o card no Canvas 2D
  const drawCard = useCallback(
    (slideIndex: number = carouselSlide) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const width = 1080;
      const height = format === 'story' ? 1920 : 1080;

      canvas.width = width;
      canvas.height = height;

      // 1. Fundo do Tema
      if (theme === 'brasil-editorial') {
        // Fundo papel algodão off-white sutil
        ctx.fillStyle = '#FAF7F2';
        ctx.fillRect(0, 0, width, height);

        // Textura suave de papel e arcos modernistas
        ctx.save();
        ctx.strokeStyle = 'rgba(0, 107, 63, 0.08)'; // Verde Brasil
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(width - 60, 120, 260, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = 'rgba(229, 168, 0, 0.12)'; // Amarelo Ouro
        ctx.beginPath();
        ctx.arc(width - 40, 140, 320, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = 'rgba(197, 34, 41, 0.08)'; // Vermelho Lula
        ctx.beginPath();
        ctx.arc(80, height - 120, 280, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();

        // Borda editorial fina
        ctx.strokeStyle = 'rgba(15, 23, 42, 0.10)';
        ctx.lineWidth = 2;
        ctx.strokeRect(40, 40, width - 80, height - 80);
      } else if (theme === 'brasil-vibrante') {
        // Gradiente vibrante Brasil da Esperança
        const bgGrad = ctx.createLinearGradient(0, 0, width, height);
        bgGrad.addColorStop(0, '#0F2027');
        bgGrad.addColorStop(0.5, '#203A43');
        bgGrad.addColorStop(1, '#2C5364');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, width, height);

        // Glows
        const glow = ctx.createRadialGradient(240, 240, 20, 240, 240, 500);
        glow.addColorStop(0, 'rgba(0, 155, 58, 0.28)');
        glow.addColorStop(1, 'rgba(0, 155, 58, 0)');
        ctx.fillStyle = glow;
        ctx.fillRect(0, 0, width, height);

        ctx.strokeStyle = 'rgba(255, 204, 0, 0.25)';
        ctx.lineWidth = 2;
        ctx.strokeRect(40, 40, width - 80, height - 80);
      } else {
        // Dark Moderno
        ctx.fillStyle = '#0B0F19';
        ctx.fillRect(0, 0, width, height);

        const glow = ctx.createRadialGradient(width - 200, 200, 30, width - 200, 200, 450);
        glow.addColorStop(0, 'rgba(197, 34, 41, 0.22)');
        glow.addColorStop(1, 'rgba(197, 34, 41, 0)');
        ctx.fillStyle = glow;
        ctx.fillRect(0, 0, width, height);

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
        ctx.lineWidth = 2;
        ctx.strokeRect(40, 40, width - 80, height - 80);
      }

      // Paletas de texto baseadas no tema
      const isDark = theme !== 'brasil-editorial';
      const textPrimary = isDark ? '#FFFFFF' : '#0F172A';
      const textSecondary = isDark ? '#94A3B8' : '#475569';
      const textAccentRed = '#C52229';
      const textAccentGold = isDark ? '#FCD34D' : '#D97706';
      const textAccentGreen = isDark ? '#34D399' : '#007A3D';

      // ═══════════════════════════════════════════════════════════════
      // CABEÇALHO DO CARD (TOP RIBBON)
      // ═══════════════════════════════════════════════════════════════
      const headerY = format === 'story' ? 200 : 110;

      // Tag de Categoria / Selo Superior
      ctx.fillStyle = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(197, 34, 41, 0.08)';
      ctx.beginPath();
      ctx.roundRect(80, headerY - 35, 340, 50, [25]);
      ctx.fill();
      ctx.strokeStyle = isDark ? 'rgba(255, 204, 0, 0.4)' : 'rgba(197, 34, 41, 0.3)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.fillStyle = isDark ? '#FFCC00' : textAccentRed;
      ctx.font = 'bold 18px Inter, system-ui, sans-serif';
      ctx.fillText(
        format === 'carousel'
          ? `⭐ DOSSIÊ VISUAL • BORA 13`
          : `✅ FATO AUDITADO • CASA 13`,
        105,
        headerY - 3
      );

      // Marca no canto direito
      ctx.fillStyle = textSecondary;
      ctx.font = 'bold 20px Inter, system-ui, sans-serif';
      ctx.textAlign = 'right';
      if (format === 'carousel') {
        ctx.fillStyle = isDark ? '#FFCC00' : textAccentGreen;
        ctx.font = '900 20px Inter, system-ui, sans-serif';
        ctx.fillText(`SLIDE 0${slideIndex + 1} / 0${TOTAL_SLIDES}`, width - 80, headerY - 3);
      } else {
        ctx.fillText('BORA 13 🇧🇷', width - 80, headerY - 3);
      }
      ctx.textAlign = 'left';

      // ═══════════════════════════════════════════════════════════════
      // CONTEÚDO ESPECÍFICO POR MODO E SLIDE
      // ═══════════════════════════════════════════════════════════════
      const contentStartY = format === 'story' ? 420 : 250;
      const maxTextWidth = width - 160;

      // Helper para quebra de texto em linhas
      const wrapText = (
        text: string,
        startX: number,
        startY: number,
        lineHeight: number,
        maxLines: number = 8
      ) => {
        const words = text.split(' ');
        let curLine = '';
        let curY = startY;
        let count = 0;

        for (let i = 0; i < words.length; i++) {
          const test = curLine + words[i] + ' ';
          const metrics = ctx.measureText(test);
          if (metrics.width > maxTextWidth && i > 0) {
            ctx.fillText(curLine, startX, curY);
            curLine = words[i] + ' ';
            curY += lineHeight;
            count++;
            if (count >= maxLines) {
              curLine += '...';
              break;
            }
          } else {
            curLine = test;
          }
        }
        ctx.fillText(curLine, startX, curY);
        return curY + lineHeight;
      };

      if (format === 'carousel') {
        // ─── CARROSSEL SLIDE 0: CAPA / O GANCHO ───
        if (slideIndex === 0) {
          ctx.font = '72px Apple Color Emoji, Segoe UI Emoji, sans-serif';
          ctx.fillText(argument.emoji || '📌', 80, contentStartY);

          ctx.fillStyle = textAccentRed;
          ctx.font = '900 24px Inter, system-ui, sans-serif';
          ctx.fillText('VOCÊ SABIA DISSO?', 80, contentStartY + 65);

          ctx.fillStyle = textPrimary;
          ctx.font = '900 52px Inter, system-ui, sans-serif';
          wrapText(argument.headline, 80, contentStartY + 140, 64, 4);

          // Subtítulo da Capa
          ctx.fillStyle = textSecondary;
          ctx.font = '500 26px Inter, system-ui, sans-serif';
          ctx.fillText('Veja os números reais e o que muda na sua vida.', 80, height - 240);

          // CTA de Arraste no Rodapé
          ctx.fillStyle = isDark ? '#FFCC00' : textAccentRed;
          ctx.font = '900 24px Inter, system-ui, sans-serif';
          ctx.fillText('DESLIZE PARA O LADO ➡️', 80, height - 170);
        }

        // ─── CARROSSEL SLIDE 1: O FATO CONCRETO / PROVA MATERIAL ───
        else if (slideIndex === 1) {
          ctx.fillStyle = textAccentGreen;
          ctx.font = '900 22px Inter, system-ui, sans-serif';
          ctx.fillText('📊 O QUE OS DADOS OFICIAIS MOSTRAM', 80, contentStartY);

          ctx.fillStyle = textPrimary;
          ctx.font = '900 42px Inter, system-ui, sans-serif';
          const nextY = wrapText(argument.title, 80, contentStartY + 60, 52, 3);

          // Caixa de Destaque Factual
          ctx.fillStyle = isDark ? 'rgba(255, 255, 255, 0.05)' : '#FFFFFF';
          ctx.beginPath();
          ctx.roundRect(80, nextY + 20, width - 160, 300, [20]);
          ctx.fill();
          ctx.strokeStyle = isDark ? 'rgba(52, 211, 153, 0.3)' : 'rgba(0, 122, 61, 0.2)';
          ctx.lineWidth = 2;
          ctx.stroke();

          ctx.fillStyle = textPrimary;
          ctx.font = '400 28px Inter, system-ui, sans-serif';
          wrapText(`"${argument.scriptText}"`, 110, nextY + 80, 40, 5);

          // Órgão auditado
          ctx.fillStyle = textAccentGreen;
          ctx.font = 'bold 22px Inter, system-ui, sans-serif';
          ctx.fillText(`📎 Fonte Documentada: ${argument.sourceName}`, 110, nextY + 280);
        }

        // ─── CARROSSEL SLIDE 2: DESARME TÁTICO / SE RETRUCAREM ───
        else if (slideIndex === 2) {
          ctx.fillStyle = textAccentGold;
          ctx.font = '900 22px Inter, system-ui, sans-serif';
          ctx.fillText('🛡️ SE RETRUCAREM NA CONVERSA', 80, contentStartY);

          // Objeção
          ctx.fillStyle = isDark ? 'rgba(239, 68, 68, 0.12)' : '#FEF2F2';
          ctx.beginPath();
          ctx.roundRect(80, contentStartY + 35, width - 160, 150, [18]);
          ctx.fill();
          ctx.strokeStyle = 'rgba(239, 68, 68, 0.25)';
          ctx.lineWidth = 1.5;
          ctx.stroke();

          ctx.fillStyle = textAccentRed;
          ctx.font = '900 20px Inter, system-ui, sans-serif';
          ctx.fillText('🤔 O que costumam rebater por engano:', 105, contentStartY + 80);

          ctx.fillStyle = textPrimary;
          ctx.font = 'italic 500 24px Inter, system-ui, sans-serif';
          wrapText(`"${argument.counterArgument || 'Isso é boato de internet'}"`, 105, contentStartY + 125, 34, 2);

          // Resposta Factual
          const respBoxY = contentStartY + 215;
          ctx.fillStyle = isDark ? 'rgba(16, 185, 129, 0.12)' : '#F0FDF4';
          ctx.beginPath();
          ctx.roundRect(80, respBoxY, width - 160, 220, [18]);
          ctx.fill();
          ctx.strokeStyle = 'rgba(16, 185, 129, 0.3)';
          ctx.lineWidth = 1.5;
          ctx.stroke();

          ctx.fillStyle = textAccentGreen;
          ctx.font = '900 20px Inter, system-ui, sans-serif';
          ctx.fillText('✅ A resposta com números na mesa (sem briga):', 105, respBoxY + 50);

          ctx.fillStyle = textPrimary;
          ctx.font = '600 26px Inter, system-ui, sans-serif';
          wrapText(argument.rebuttal || argument.scriptText, 105, respBoxY + 100, 38, 3);
        }

        // ─── CARROSSEL SLIDE 3: O IMPACTO NO BOLSO & VIDA REAL ───
        else if (slideIndex === 3) {
          ctx.fillStyle = textAccentRed;
          ctx.font = '900 22px Inter, system-ui, sans-serif';
          ctx.fillText('💵 NA VIDA REAL E NO BOLSO', 80, contentStartY);

          ctx.fillStyle = textPrimary;
          ctx.font = '900 44px Inter, system-ui, sans-serif';
          const nextY = wrapText('Por que esse dado faz a diferença na sua casa?', 80, contentStartY + 60, 54, 2);

          // Três pontos de valor real
          const points = [
            '🛒 Comida e itens básicos com poder de compra preservado',
            '📈 Renda que rende mais no fim do mês sem arrocho',
            '🇧🇷 Economia girando perto do bairro e do comércio local',
          ];

          points.forEach((pt, idx) => {
            const pY = nextY + 40 + idx * 95;
            ctx.fillStyle = isDark ? 'rgba(255, 255, 255, 0.05)' : '#FFFFFF';
            ctx.beginPath();
            ctx.roundRect(80, pY, width - 160, 75, [14]);
            ctx.fill();
            ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)';
            ctx.lineWidth = 1;
            ctx.stroke();

            ctx.fillStyle = textPrimary;
            ctx.font = '600 24px Inter, system-ui, sans-serif';
            ctx.fillText(pt, 105, pY + 46);
          });
        }

        // ─── CARROSSEL SLIDE 4: CONCLUSÃO & UNIÃO ───
        else if (slideIndex === 4) {
          ctx.fillStyle = textAccentGreen;
          ctx.font = '900 22px Inter, system-ui, sans-serif';
          ctx.fillText('🤝 DIÁLOGO & ESPERANÇA', 80, contentStartY);

          ctx.fillStyle = textPrimary;
          ctx.font = '900 50px Inter, system-ui, sans-serif';
          wrapText('O Brasil avança com conversa e verdade.', 80, contentStartY + 70, 60, 2);

          ctx.fillStyle = textSecondary;
          ctx.font = '400 28px Inter, system-ui, sans-serif';
          wrapText(
            'Não precisamos convencer pelo confronto. Basta colocar a realidade na mesa e ouvir a dor de quem tá trabalhando duro.',
            80,
            contentStartY + 230,
            42,
            4
          );

          // Caixa de Ação
          ctx.fillStyle = isDark ? 'rgba(197, 34, 41, 0.25)' : '#FEF2F2';
          ctx.beginPath();
          ctx.roundRect(80, height - 320, width - 160, 160, [20]);
          ctx.fill();
          ctx.strokeStyle = textAccentRed;
          ctx.lineWidth = 2;
          ctx.stroke();

          ctx.fillStyle = textAccentRed;
          ctx.font = '900 24px Inter, system-ui, sans-serif';
          ctx.fillText('📌 Salve este carrossel e compartilhe com um amigo!', 110, height - 250);

          ctx.fillStyle = textSecondary;
          ctx.font = 'bold 20px Inter, system-ui, sans-serif';
          ctx.fillText('Bora 13 • Conversas que Importam • casa13.pt.org.br', 110, height - 200);
        }
      } else {
        // ─── MODO ÚNICO: FEED (1:1) OU STORY (9:16) ───
        ctx.font = '68px Apple Color Emoji, Segoe UI Emoji, sans-serif';
        ctx.fillText(argument.emoji || '📌', 80, contentStartY);

        ctx.fillStyle = textPrimary;
        ctx.font = '900 48px Inter, system-ui, sans-serif';
        let currentY = contentStartY + 75;
        currentY = wrapText(argument.headline, 80, currentY, 58, 3);

        // Linha divisória com degradê
        currentY += 25;
        const lineGrad = ctx.createLinearGradient(80, currentY, width - 80, currentY);
        lineGrad.addColorStop(0, textAccentRed);
        lineGrad.addColorStop(0.5, textAccentGold);
        lineGrad.addColorStop(1, textAccentGreen);
        ctx.strokeStyle = lineGrad;
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(80, currentY);
        ctx.lineTo(width - 80, currentY);
        ctx.stroke();

        // Corpo do texto (Script)
        currentY += 50;
        ctx.fillStyle = textPrimary;
        ctx.font = '400 30px Inter, system-ui, sans-serif';
        const maxLines = format === 'square' ? 7 : 14;
        currentY = wrapText(argument.scriptText, 80, currentY, 44, maxLines);

        // Bloco de Contra-Argumento se couber
        if (argument.counterArgument && argument.rebuttal && format === 'story') {
          currentY += 40;
          ctx.fillStyle = isDark ? 'rgba(255, 255, 255, 0.05)' : '#F8FAFC';
          ctx.beginPath();
          ctx.roundRect(80, currentY, width - 160, 240, [16]);
          ctx.fill();
          ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
          ctx.stroke();

          ctx.fillStyle = textAccentRed;
          ctx.font = 'bold 22px Inter, system-ui, sans-serif';
          ctx.fillText(`🤔 Se falarem: "${argument.counterArgument}"`, 110, currentY + 50);

          ctx.fillStyle = textAccentGreen;
          ctx.font = 'bold 22px Inter, system-ui, sans-serif';
          ctx.fillText('✅ Resposta na lata:', 110, currentY + 110);

          ctx.fillStyle = textPrimary;
          ctx.font = '500 24px Inter, system-ui, sans-serif';
          wrapText(argument.rebuttal, 110, currentY + 155, 34, 2);
        }
      }

      // ═══════════════════════════════════════════════════════════════
      // RODAPÉ AUDITADO OFICIAL
      // ═══════════════════════════════════════════════════════════════
      const footerY = height - (format === 'story' ? 140 : 85);

      ctx.fillStyle = isDark ? '#FFFFFF' : '#0F172A';
      ctx.font = 'bold 18px Inter, system-ui, sans-serif';
      ctx.fillText(`📎 Fonte Oficial: ${argument.sourceName}`, 80, footerY);

      ctx.fillStyle = textSecondary;
      ctx.font = '500 16px Inter, system-ui, sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText('Bora 13 • União e Reconstrução', width - 80, footerY);
      ctx.textAlign = 'left';
    },
    [argument, carouselSlide, format, theme]
  );

  useEffect(() => {
    drawCard(carouselSlide);
  }, [carouselSlide, drawCard]);

  // Baixar imagem única (PNG 1080px)
  const handleDownloadSingle = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setDownloading(true);

    try {
      const link = document.createElement('a');
      const filenameSuffix =
        format === 'carousel'
          ? `carrossel-slide-${carouselSlide + 1}`
          : format === 'story'
          ? 'story-9-16'
          : 'feed-1-1';
      link.download = `bora13-${argument.id}-${filenameSuffix}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } finally {
      setDownloading(false);
    }
  };

  // Baixar todos os 5 slides do carrossel sequencialmente
  const handleDownloadAllCarousel = async () => {
    setDownloading(true);
    try {
      for (let i = 0; i < TOTAL_SLIDES; i++) {
        drawCard(i);
        // Espera renderização
        await new Promise((resolve) => setTimeout(resolve, 150));
        const canvas = canvasRef.current;
        if (canvas) {
          const link = document.createElement('a');
          link.download = `bora13-${argument.id}-carrossel-slide-${i + 1}-de-5.png`;
          link.href = canvas.toDataURL('image/png');
          link.click();
        }
        await new Promise((resolve) => setTimeout(resolve, 250));
      }
      // Restaura slide ativo
      drawCard(carouselSlide);
    } finally {
      setDownloading(false);
    }
  };

  // Copiar Copywriter Adaptado
  const handleCopyText = async () => {
    const text = generateAdaptedCopy(copyPlatform);
    try {
      await navigator.clipboard.writeText(text);
      setCopiedCopy(true);
      setTimeout(() => setCopiedCopy(false), 2200);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopiedCopy(true);
      setTimeout(() => setCopiedCopy(false), 2200);
    }
  };

  // Compartilhar Nativo
  const handleShareNative = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        const file = new File([blob], `bora13-${argument.id}.png`, { type: 'image/png' });
        const text = generateAdaptedCopy(copyPlatform);

        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: `Bora 13: ${argument.headline}`,
            text,
            files: [file],
          });
        } else {
          await navigator.share({
            title: `Bora 13: ${argument.headline}`,
            text,
          });
        }
      }, 'image/png');
    } catch {
      // Ignora cancelamento do usuário
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-md animate-fade-in">
      <div className="bg-white dark:bg-[#0E1524] border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full max-h-[96vh] overflow-y-auto p-4 sm:p-6 shadow-2xl flex flex-col transition-colors">
        {/* Header do Estúdio Social */}
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#C52229] text-white flex items-center justify-center text-xl shadow-sm">
              🎨
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                Estúdio Social Bora 13
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold">
                  Design Casa 13
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Gere carrosséis e cards com design editorial minimalista e cores do Brasil
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center font-bold transition-colors"
          >
            ✕
          </button>
        </div>

        {/* 1. SELETOR DE FORMATO (CARROSSEL, FEED, STORY) */}
        <div className="flex flex-col gap-2 mb-4">
          <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-wider text-slate-500">
            <span>Formato de Mídia:</span>
            {format === 'carousel' && (
              <span className="text-[#C52229]">Formato Recomendado para Instagram</span>
            )}
          </div>
          <div className="grid grid-cols-3 gap-2 bg-slate-100 dark:bg-[#070D18] p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800">
            <button
              onClick={() => {
                setFormat('carousel');
                setCarouselSlide(0);
              }}
              className={`py-2 px-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                format === 'carousel'
                  ? 'bg-[#C52229] text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span>📚</span>
              <span>Carrossel (5 Slides)</span>
            </button>
            <button
              onClick={() => setFormat('square')}
              className={`py-2 px-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                format === 'square'
                  ? 'bg-[#C52229] text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span>⏹️</span>
              <span>Feed Único (1:1)</span>
            </button>
            <button
              onClick={() => setFormat('story')}
              className={`py-2 px-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                format === 'story'
                  ? 'bg-[#C52229] text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span>📱</span>
              <span>Story (9:16)</span>
            </button>
          </div>
        </div>

        {/* 2. SELETOR DE IDENTIDADE VISUAL */}
        <div className="flex flex-col gap-2 mb-4">
          <span className="text-[11px] font-black uppercase tracking-wider text-slate-500">
            Estilo Visual & Cores do Brasil:
          </span>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setTheme('brasil-editorial')}
              className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all text-center ${
                theme === 'brasil-editorial'
                  ? 'bg-amber-50 dark:bg-amber-950/40 text-[#C52229] border-[#C52229] shadow-sm'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800'
              }`}
            >
              🏛️ Editorial Algodão
            </button>
            <button
              onClick={() => setTheme('brasil-vibrante')}
              className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all text-center ${
                theme === 'brasil-vibrante'
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-500 shadow-sm'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800'
              }`}
            >
              🇧🇷 Brasil Vibrante
            </button>
            <button
              onClick={() => setTheme('dark-moderno')}
              className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all text-center ${
                theme === 'dark-moderno'
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white border-slate-400 shadow-sm'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800'
              }`}
            >
              🌑 Noturno Premium
            </button>
          </div>
        </div>

        {/* 3. VISUALIZADOR DO CANVAS + NAVEGAÇÃO DO CARROSSEL */}
        <div className="flex flex-col items-center bg-slate-50 dark:bg-[#070D18] rounded-2xl p-4 border border-slate-200 dark:border-slate-800/80 mb-4">
          <canvas
            ref={canvasRef}
            className={`w-full max-w-[340px] rounded-xl shadow-xl transition-all ${
              format === 'story' ? 'aspect-[9/16]' : 'aspect-square'
            }`}
          />

          {/* Controles de Navegação do Carrossel */}
          {format === 'carousel' && (
            <div className="flex items-center justify-between w-full max-w-[340px] mt-3 pt-3 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setCarouselSlide(Math.max(0, carouselSlide - 1))}
                disabled={carouselSlide === 0}
                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 disabled:opacity-40"
              >
                ← Anterior
              </button>

              <div className="flex items-center gap-1.5">
                {Array.from({ length: TOTAL_SLIDES }).map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCarouselSlide(idx)}
                    className={`w-2.5 h-2.5 rounded-full transition-all ${
                      carouselSlide === idx
                        ? 'w-6 bg-[#C52229]'
                        : 'bg-slate-300 dark:bg-slate-700 hover:bg-slate-400'
                    }`}
                    title={`Slide ${idx + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={() => setCarouselSlide(Math.min(TOTAL_SLIDES - 1, carouselSlide + 1))}
                disabled={carouselSlide === TOTAL_SLIDES - 1}
                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 disabled:opacity-40"
              >
                Próximo →
              </button>
            </div>
          )}
        </div>

        {/* 4. BOTÕES DE EXPORTAÇÃO GRÁFICA */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-5">
          {format === 'carousel' ? (
            <>
              <button
                onClick={handleDownloadSingle}
                disabled={downloading}
                className="py-2.5 px-3 rounded-xl font-bold text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 text-slate-800 dark:text-white flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all"
              >
                <span>⬇️</span> Baixar Slide Atual ({carouselSlide + 1}/5)
              </button>
              <button
                onClick={handleDownloadAllCarousel}
                disabled={downloading}
                className="btn-pt py-2.5 px-3 text-xs font-black shadow-md flex items-center justify-center gap-1.5 active:scale-95 transition-all"
              >
                <span>📦</span> Baixar Carrossel Completo (5 PNGs)
              </button>
            </>
          ) : (
            <button
              onClick={handleDownloadSingle}
              disabled={downloading}
              className="btn-pt w-full sm:col-span-2 text-xs md:text-sm font-bold shadow-md flex items-center justify-center gap-2"
            >
              <span>⬇️</span> Baixar Imagem em Alta Resolução (PNG)
            </button>
          )}

          {shareSupported && (
            <button
              onClick={handleShareNative}
              className="py-2.5 px-3 rounded-xl font-bold text-xs text-white bg-[#25D366] hover:bg-[#20bd5a] flex items-center justify-center gap-1.5 shadow-sm sm:col-span-2 active:scale-95 transition-all"
            >
              <span>📲</span> Compartilhar Direto no WhatsApp / Redes
            </button>
          )}
        </div>

        {/* 5. COPYWRITING ADAPTADO PARA POSTAGEM (NÃO APENAS CÓPIA CRUA) */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-black uppercase tracking-wider text-[#C52229] flex items-center gap-1.5">
              <span>✍️</span>
              <span>Texto & Legenda Adaptada por Rede</span>
            </span>

            <button
              onClick={handleCopyText}
              className="px-3 py-1 rounded-lg text-xs font-black bg-white dark:bg-slate-800 text-slate-800 dark:text-white border border-slate-300 dark:border-slate-600 shadow-sm hover:border-[#C52229] flex items-center gap-1 active:scale-95 transition-all"
            >
              <span>{copiedCopy ? '✅' : '📋'}</span>
              <span>{copiedCopy ? 'Copiado!' : 'Copiar Legenda'}</span>
            </button>
          </div>

          {/* Abas das Redes */}
          <div className="flex gap-1.5 mb-3 overflow-x-auto pb-1 scrollbar-none">
            {[
              { id: 'instagram' as const, label: '📸 Legenda Instagram', tag: 'Feed & Carrossel' },
              { id: 'whatsapp' as const, label: '💬 WhatsApp Família', tag: 'Conversa Direta' },
              { id: 'stories' as const, label: '⚡ Enquete Stories', tag: 'Caixa de Pergunta' },
              { id: 'threads' as const, label: '🧵 Fio Threads / X', tag: 'Em 3 Tweets' },
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => setCopyPlatform(p.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex flex-col text-left ${
                  copyPlatform === p.id
                    ? 'bg-[#C52229] text-white shadow-sm'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                }`}
              >
                <span>{p.label}</span>
                <span
                  className={`text-[9px] ${
                    copyPlatform === p.id ? 'text-red-100' : 'text-slate-400'
                  }`}
                >
                  {p.tag}
                </span>
              </button>
            ))}
          </div>

          {/* Prévia do Texto Formatado */}
          <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-mono whitespace-pre-wrap max-h-48 overflow-y-auto text-slate-800 dark:text-slate-200 leading-relaxed">
            {generateAdaptedCopy(copyPlatform)}
          </div>
        </div>

        {/* Rodapé Fechar */}
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button onClick={onClose} className="btn-ghost text-xs text-slate-500 hover:text-slate-700">
            Fechar Estúdio
          </button>
        </div>
      </div>
    </div>
  );
}
