'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import type { Argument } from '@/data/arguments';

interface VisualCardGeneratorProps {
  argument: Argument;
  onClose: () => void;
}

export default function VisualCardGenerator({ argument, onClose }: VisualCardGeneratorProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [format, setFormat] = useState<'square' | 'story'>('square'); // 1:1 or 9:16
  const [theme, setTheme] = useState<'casa13' | 'modern'>('casa13');
  const [downloading, setDownloading] = useState(false);
  const [shareSupported, setShareSupported] = useState(false);

  useEffect(() => {
    if (typeof navigator !== 'undefined' && !!navigator.share && !!navigator.canShare) {
      setShareSupported(true);
    }
  }, []);

  // Draw the card on the canvas
  const drawCard = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = 1080;
    const height = format === 'square' ? 1080 : 1920;

    canvas.width = width;
    canvas.height = height;

    const isCasa13 = theme === 'casa13';

    // 1. Background gradient
    const bgGrad = ctx.createLinearGradient(0, 0, width, height);
    if (isCasa13) {
      bgGrad.addColorStop(0, '#100B11');
      bgGrad.addColorStop(0.4, '#1C0E14');
      bgGrad.addColorStop(1, '#0C080E');
    } else {
      bgGrad.addColorStop(0, '#080F1A');
      bgGrad.addColorStop(0.5, '#0F1729');
      bgGrad.addColorStop(1, '#070D18');
    }
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // 2. Glowing accents / Mesh orbs in canvas
    if (isCasa13) {
      // Casa 13 Vermelho Glow
      const glow1 = ctx.createRadialGradient(240, 200, 20, 240, 200, 520);
      glow1.addColorStop(0, 'rgba(197, 34, 41, 0.40)');
      glow1.addColorStop(1, 'rgba(197, 34, 41, 0)');
      ctx.fillStyle = glow1;
      ctx.fillRect(0, 0, width, height);

      // Gold Glow
      const glow2 = ctx.createRadialGradient(width - 220, height - 320, 30, width - 220, height - 320, 480);
      glow2.addColorStop(0, 'rgba(255, 204, 0, 0.25)');
      glow2.addColorStop(1, 'rgba(255, 204, 0, 0)');
      ctx.fillStyle = glow2;
      ctx.fillRect(0, 0, width, height);
    } else {
      const glow1 = ctx.createRadialGradient(200, 200, 20, 200, 200, 450);
      glow1.addColorStop(0, 'rgba(20, 184, 166, 0.25)');
      glow1.addColorStop(1, 'rgba(20, 184, 166, 0)');
      ctx.fillStyle = glow1;
      ctx.fillRect(0, 0, width, height);

      const glow2 = ctx.createRadialGradient(width - 200, height - 300, 20, width - 200, height - 300, 400);
      glow2.addColorStop(0, 'rgba(245, 158, 11, 0.18)');
      glow2.addColorStop(1, 'rgba(245, 158, 11, 0)');
      ctx.fillStyle = glow2;
      ctx.fillRect(0, 0, width, height);
    }

    // 3. Outer border with gradient
    ctx.strokeStyle = isCasa13 ? 'rgba(255, 204, 0, 0.35)' : 'rgba(20, 184, 166, 0.3)';
    ctx.lineWidth = 4;
    ctx.strokeRect(36, 36, width - 72, height - 72);

    // 4. Header badge
    const headerY = format === 'square' ? 115 : 230;

    // Badge pill
    ctx.fillStyle = isCasa13 ? 'rgba(197, 34, 41, 0.35)' : 'rgba(20, 184, 166, 0.15)';
    ctx.beginPath();
    ctx.roundRect(80, headerY - 35, 360, 52, [26]);
    ctx.fill();
    ctx.strokeStyle = isCasa13 ? '#FFCC00' : 'rgba(45, 212, 191, 0.4)';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = isCasa13 ? '#FFCC00' : '#2DD4BF';
    ctx.font = 'bold 20px Inter, system-ui, sans-serif';
    ctx.fillText(isCasa13 ? '⭐ BRASIL DA ESPERANÇA' : '✅ FATO VERIFICADO', 105, headerY);

    // Brand on right
    ctx.fillStyle = isCasa13 ? '#FFFFFF' : '#94A3B8';
    ctx.font = '900 24px Inter, system-ui, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(isCasa13 ? 'BORA 13 🤝' : 'BORA APP 🤝', width - 80, headerY);
    ctx.textAlign = 'left';

    // 5. Emoji icon
    const contentStartY = format === 'square' ? 245 : 445;
    ctx.font = '68px Apple Color Emoji, Segoe UI Emoji, sans-serif';
    ctx.fillText(argument.emoji || '📌', 80, contentStartY);

    // 6. Headline
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '900 48px Inter, system-ui, sans-serif';

    const maxTextWidth = width - 160;
    const words = argument.headline.split(' ');
    let line = '';
    let currentY = contentStartY + 72;
    const lineHeight = 58;

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxTextWidth && n > 0) {
        ctx.fillText(line, 80, currentY);
        line = words[n] + ' ';
        currentY += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, 80, currentY);

    // 7. Decorative line
    currentY += 38;
    const lineGrad = ctx.createLinearGradient(80, currentY, width - 80, currentY);
    if (isCasa13) {
      lineGrad.addColorStop(0, '#C52229');
      lineGrad.addColorStop(0.5, '#FFCC00');
      lineGrad.addColorStop(1, '#009B3A');
    } else {
      lineGrad.addColorStop(0, '#14B8A6');
      lineGrad.addColorStop(0.5, '#F59E0B');
      lineGrad.addColorStop(1, 'transparent');
    }
    ctx.strokeStyle = lineGrad;
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(80, currentY);
    ctx.lineTo(width - 80, currentY);
    ctx.stroke();

    // 8. Body Script Text
    currentY += 50;
    ctx.fillStyle = '#F1F5F9';
    ctx.font = '400 32px Inter, system-ui, sans-serif';
    const bodyLineHeight = 46;

    const scriptWords = argument.scriptText.split(' ');
    line = '';
    const maxLines = format === 'square' ? 8 : 16;
    let linesCount = 0;

    for (let i = 0; i < scriptWords.length; i++) {
      const testLine = line + scriptWords[i] + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxTextWidth && i > 0) {
        ctx.fillText(line, 80, currentY);
        line = scriptWords[i] + ' ';
        currentY += bodyLineHeight;
        linesCount++;
        if (linesCount >= maxLines) {
          line += '...';
          break;
        }
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, 80, currentY);

    // 9. Footer Source Box
    const footerY = height - (format === 'square' ? 120 : 180);

    ctx.fillStyle = isCasa13 ? 'rgba(30, 15, 20, 0.92)' : 'rgba(15, 23, 42, 0.85)';
    ctx.beginPath();
    ctx.roundRect(80, footerY - 50, width - 160, 80, [16]);
    ctx.fill();
    ctx.strokeStyle = isCasa13 ? 'rgba(255, 204, 0, 0.3)' : 'rgba(148, 163, 184, 0.2)';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = isCasa13 ? '#FFCC00' : '#14B8A6';
    ctx.font = 'bold 22px Inter, system-ui, sans-serif';
    ctx.fillText('📎 Fonte Oficial:', 110, footerY);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = '500 22px Inter, system-ui, sans-serif';
    ctx.fillText(argument.sourceName, 290, footerY);

    // 10. Watermark
    ctx.fillStyle = '#94A3B8';
    ctx.font = '500 18px Inter, system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(
      isCasa13
        ? 'Bora 13 • Conversas que importam • União e Reconstrução'
        : 'Gerado via Bora App • Conversas que importam • Sem fake news',
      width / 2,
      height - (format === 'square' ? 30 : 50)
    );
    ctx.textAlign = 'left';

  }, [argument, format, theme]);

  useEffect(() => {
    drawCard();
  }, [drawCard]);

  // Export as Image Blob / DataURL
  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setDownloading(true);

    try {
      const link = document.createElement('a');
      link.download = `bora-${argument.id}-${theme}-${format}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } finally {
      setDownloading(false);
    }
  };

  // Share via Web Share API
  const handleShare = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        const file = new File([blob], `bora-${argument.id}.png`, { type: 'image/png' });

        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: `Bora: ${argument.headline}`,
            text: `${argument.headline} — Fonte: ${argument.sourceName}`,
            files: [file],
          });
        } else {
          // Fallback to text share
          await navigator.share({
            title: `Bora: ${argument.headline}`,
            text: `${argument.emoji} *${argument.headline}*\n\n${argument.scriptText}\n\n📎 Fonte: ${argument.sourceName}\n\n_Via Bora App_`,
          });
        }
      }, 'image/png');
    } catch {
      // User cancelled
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="bg-white dark:bg-[#0F1729] border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full max-h-[95vh] overflow-y-auto p-5 shadow-2xl flex flex-col transition-colors">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-lg font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <span>🎨</span> Gerador de Card Visual
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Gere imagens oficiais prontas para stories e grupos</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center font-bold transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Theme & Format Selectors */}
        <div className="flex flex-col gap-2 mb-4">
          {/* Theme Selector */}
          <div className="flex gap-2 bg-slate-100 dark:bg-[#080F1A] p-1 rounded-2xl border border-slate-200 dark:border-slate-800">
            <button
              onClick={() => setTheme('casa13')}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                theme === 'casa13'
                  ? 'bg-[#C52229] text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <span>⭐</span>
              <span>Casa 13 (Oficial)</span>
            </button>
            <button
              onClick={() => setTheme('modern')}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                theme === 'modern'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <span>🌐</span>
              <span>Neutro / Institucional</span>
            </button>
          </div>

          {/* Format Selector */}
          <div className="flex gap-2 bg-slate-100 dark:bg-[#080F1A] p-1 rounded-2xl border border-slate-200 dark:border-slate-800">
            <button
              onClick={() => setFormat('square')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition-all ${
                format === 'square'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              ⏹️ Feed / Zap (1:1)
            </button>
            <button
              onClick={() => setFormat('story')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition-all ${
                format === 'story'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              📱 Stories / Status (9:16)
            </button>
          </div>
        </div>

        {/* Canvas Preview Container */}
        <div className="flex justify-center items-center bg-slate-100 dark:bg-[#080F1A] rounded-2xl p-3 border border-slate-200 dark:border-slate-800/80 mb-4 overflow-hidden">
          <canvas
            ref={canvasRef}
            className={`w-full max-w-[320px] rounded-xl shadow-xl ${
              format === 'story' ? 'aspect-[9/16]' : 'aspect-square'
            }`}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2">
          {shareSupported && (
            <button
              onClick={handleShare}
              className="w-full py-3 px-4 rounded-xl font-bold text-white flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] transition-all shadow-md active:scale-95"
            >
              <span>📲</span> Compartilhar no WhatsApp
            </button>
          )}

          <button
            onClick={handleDownload}
            disabled={downloading}
            className="btn-pt w-full text-xs md:text-sm font-bold shadow-md"
          >
            <span>⬇️</span> Baixar Imagem em Alta Resolução (PNG)
          </button>

          <button
            onClick={onClose}
            className="btn-ghost w-full text-xs text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
