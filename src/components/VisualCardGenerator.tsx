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

    const width = format === 'square' ? 1080 : 1080;
    const height = format === 'square' ? 1080 : 1920;

    canvas.width = width;
    canvas.height = height;

    // Background gradient
    const bgGrad = ctx.createLinearGradient(0, 0, width, height);
    bgGrad.addColorStop(0, '#080F1A');
    bgGrad.addColorStop(0.5, '#0F1729');
    bgGrad.addColorStop(1, '#070D18');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // Glowing accents / Ambient orbs in canvas
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

    // Outer subtle border
    ctx.strokeStyle = 'rgba(20, 184, 166, 0.3)';
    ctx.lineWidth = 4;
    ctx.strokeRect(32, 32, width - 64, height - 64);

    // Header badge
    const headerY = format === 'square' ? 110 : 220;
    
    // Badge pill
    ctx.fillStyle = 'rgba(20, 184, 166, 0.15)';
    ctx.beginPath();
    ctx.roundRect(80, headerY - 35, 340, 50, [25]);
    ctx.fill();
    ctx.strokeStyle = 'rgba(45, 212, 191, 0.4)';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#2DD4BF';
    ctx.font = 'bold 20px Inter, system-ui, sans-serif';
    ctx.fillText('✅ FATO VERIFICADO', 110, headerY);

    // Brand on right
    ctx.fillStyle = '#94A3B8';
    ctx.font = '600 24px Inter, system-ui, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText('BORA APP 🤝', width - 80, headerY);
    ctx.textAlign = 'left';

    // Emoji icon
    const contentStartY = format === 'square' ? 240 : 440;
    ctx.font = '68px Apple Color Emoji, Segoe UI Emoji, sans-serif';
    ctx.fillText(argument.emoji || '📌', 80, contentStartY);

    // Headline
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '900 48px Inter, system-ui, sans-serif';
    
    // Wrap headline text
    const maxTextWidth = width - 160;
    const words = argument.headline.split(' ');
    let line = '';
    let currentY = contentStartY + 70;
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

    // Decorative divider
    currentY += 40;
    const lineGrad = ctx.createLinearGradient(80, currentY, width - 80, currentY);
    lineGrad.addColorStop(0, '#14B8A6');
    lineGrad.addColorStop(0.5, '#F59E0B');
    lineGrad.addColorStop(1, 'transparent');
    ctx.strokeStyle = lineGrad;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(80, currentY);
    ctx.lineTo(width - 80, currentY);
    ctx.stroke();

    // Body Script / Argument Text
    currentY += 50;
    ctx.fillStyle = '#E2E8F0';
    ctx.font = '400 32px Inter, system-ui, sans-serif';
    const bodyLineHeight = 46;
    
    // Truncate or fit script
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

    // Footer Source Card
    const footerY = height - (format === 'square' ? 120 : 180);
    
    // Background pill for source
    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.beginPath();
    ctx.roundRect(80, footerY - 50, width - 160, 80, [16]);
    ctx.fill();
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.2)';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#14B8A6';
    ctx.font = 'bold 22px Inter, system-ui, sans-serif';
    ctx.fillText('📎 Fonte Oficial:', 110, footerY);

    ctx.fillStyle = '#CBD5E1';
    ctx.font = '500 22px Inter, system-ui, sans-serif';
    ctx.fillText(argument.sourceName, 290, footerY);

    // App watermark on very bottom
    ctx.fillStyle = '#64748B';
    ctx.font = '500 18px Inter, system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Gerado via Bora App • Conversas que importam • Sem fake news', width / 2, height - (format === 'square' ? 30 : 50));
    ctx.textAlign = 'left';

  }, [argument, format]);

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
      link.download = `bora-${argument.id}-${format}.png`;
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
      // User cancelled share
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-[#0F1729] border border-slate-800 rounded-2xl max-w-lg w-full max-h-[95vh] overflow-y-auto p-5 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <span>🎨</span> Card para Compartilhar
            </h3>
            <p className="text-xs text-slate-400">Gere uma imagem com o fato verificado</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 text-slate-300 hover:bg-slate-700 flex items-center justify-center font-bold"
          >
            ✕
          </button>
        </div>

        {/* Format Selector */}
        <div className="flex gap-2 mb-4 bg-[#080F1A] p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setFormat('square')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              format === 'square'
                ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            ⏹️ Feed / Zap (1:1)
          </button>
          <button
            onClick={() => setFormat('story')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              format === 'story'
                ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            📱 Stories / Status (9:16)
          </button>
        </div>

        {/* Canvas Preview Container */}
        <div className="flex justify-center items-center bg-[#080F1A] rounded-xl p-3 border border-slate-800/80 mb-5 overflow-hidden">
          <canvas
            ref={canvasRef}
            className={`w-full max-w-[340px] rounded-lg shadow-lg ${
              format === 'story' ? 'aspect-[9/16]' : 'aspect-square'
            }`}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2">
          {shareSupported && (
            <button
              onClick={handleShare}
              className="w-full py-3 px-4 rounded-xl font-bold text-white flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] transition-all shadow-lg active:scale-95"
            >
              <span>📲</span> Compartilhar Imagem Direto
            </button>
          )}

          <button
            onClick={handleDownload}
            disabled={downloading}
            className="btn-primary w-full text-sm font-semibold flex items-center justify-center gap-2"
          >
            <span>⬇️</span> Baixar Imagem (PNG)
          </button>

          <button
            onClick={onClose}
            className="btn-ghost w-full text-xs text-slate-400 hover:text-slate-200"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
