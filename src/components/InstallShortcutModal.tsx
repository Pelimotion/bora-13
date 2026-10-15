'use client';

import React, { useState, useEffect } from 'react';
import { IconSmartphone, IconStar, IconCheck } from '@/components/icons/CasaIcons';
import { playProceduralHaptic } from '@/lib/agenticOrchestrator';

interface InstallShortcutModalProps {
  isOpen: boolean;
  onClose: () => void;
  canInstallNative?: boolean;
  onInstallNative?: () => void;
}

export default function InstallShortcutModal({
  isOpen,
  onClose,
  canInstallNative,
  onInstallNative,
}: InstallShortcutModalProps) {
  const [platform, setPlatform] = useState<'android' | 'ios'>('android');

  // Detecta se o usuário está navegando em iOS / iPhone
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const ua = window.navigator.userAgent.toLowerCase();
      if (/iphone|ipad|ipod/.test(ua)) {
        setPlatform('ios');
      } else {
        setPlatform('android');
      }
    }
  }, []);

  if (!isOpen) return null;

  const handleTabChange = (target: 'android' | 'ios') => {
    playProceduralHaptic('click');
    setPlatform(target);
  };

  const handleNativeClick = () => {
    playProceduralHaptic('generate');
    if (onInstallNative) {
      onInstallNative();
      onClose();
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="shortcut-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-md animate-fade-in overflow-y-auto"
    >
      <div className="relative w-full max-w-lg bg-white dark:bg-[#0E1626] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-auto flex flex-col">
        {/* Top Ribbon Vermelha */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#C52229] via-[#E11D48] to-[#991B1E]" />

        {/* Cabeçalho */}
        <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between gap-3 bg-slate-50/70 dark:bg-slate-900/60">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-100 dark:bg-red-950/60 text-[#C52229] dark:text-red-300 text-[11px] font-black uppercase tracking-wider">
              <IconSmartphone className="w-3.5 h-3.5" />
              <span>Acesso Rápido Sem Baixar Nada</span>
            </div>
            <h2 id="shortcut-modal-title" className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Coloque o Bora 13 na tela do seu celular
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-normal leading-relaxed">
              Não precisa de loja de aplicativos nem ocupa a memória do seu telefone. É um atalho direto na sua tela inicial para você abrir com um toque sempre que for conversar.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="w-8 h-8 rounded-full bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700 flex items-center justify-center text-xs font-black transition-all shrink-0 cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Corpo */}
        <div className="p-5 sm:p-6 space-y-5">
          {/* Seletor de Plataforma */}
          <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={() => handleTabChange('android')}
              className={`py-2 px-3 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-all cursor-pointer ${
                platform === 'android'
                  ? 'bg-white dark:bg-slate-900 text-[#C52229] dark:text-red-300 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span>🤖 Android (Chrome)</span>
            </button>

            <button
              type="button"
              onClick={() => handleTabChange('ios')}
              className={`py-2 px-3 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-all cursor-pointer ${
                platform === 'ios'
                  ? 'bg-white dark:bg-slate-900 text-[#C52229] dark:text-red-300 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span>🍏 iPhone (Safari)</span>
            </button>
          </div>

          {/* Guia Android */}
          {platform === 'android' && (
            <div className="space-y-4 animate-fade-in">
              {canInstallNative && onInstallNative && (
                <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-center space-y-2">
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Seu navegador suporta adicionar o atalho com um toque:
                  </p>
                  <button
                    type="button"
                    onClick={handleNativeClick}
                    style={{ backgroundColor: '#C52229' }}
                    className="w-full py-3 px-4 rounded-xl text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md hover:opacity-95 active:scale-98 transition-all cursor-pointer"
                  >
                    <IconStar className="w-4 h-4 text-white" />
                    <span>Adicionar Atalho à Tela Inicial Agora</span>
                  </button>
                </div>
              )}

              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800">
                  <div className="w-7 h-7 rounded-lg bg-[#C52229] text-white flex items-center justify-center font-black text-xs shrink-0 mt-0.5">
                    1
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-900 dark:text-white">
                      Toque nos 3 pontinhos (⋮)
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                      No canto superior direito do Google Chrome no celular.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800">
                  <div className="w-7 h-7 rounded-lg bg-[#C52229] text-white flex items-center justify-center font-black text-xs shrink-0 mt-0.5">
                    2
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-900 dark:text-white">
                      Escolha &ldquo;Adicionar à tela inicial&rdquo;
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                      (Em alguns aparelhos pode aparecer como &ldquo;Instalar atalho&rdquo;).
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800">
                  <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-black text-xs shrink-0 mt-0.5">
                    <IconCheck className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-900 dark:text-white">
                      Pronto! O ícone da Estrela Bora 13 vai aparecer na sua tela
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                      Você pode abrir direto com um toque sempre que for conversar no trabalho ou com a família.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Guia iPhone / iOS */}
          {platform === 'ios' && (
            <div className="space-y-3 animate-fade-in">
              <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800">
                <div className="w-7 h-7 rounded-lg bg-[#C52229] text-white flex items-center justify-center font-black text-xs shrink-0 mt-0.5">
                  1
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-900 dark:text-white">
                    Toque no botão Compartilhar (⎋)
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                    É o ícone de um quadradinho com uma seta apontando para cima, na barra inferior do Safari.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800">
                <div className="w-7 h-7 rounded-lg bg-[#C52229] text-white flex items-center justify-center font-black text-xs shrink-0 mt-0.5">
                  2
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-900 dark:text-white">
                    Role para baixo e toque em &ldquo;Adicionar à Tela de Início&rdquo; (+)
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                    Fica junto das opções de favoritos e leitura.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800">
                <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-black text-xs shrink-0 mt-0.5">
                  <IconCheck className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-900 dark:text-white">
                    Toque em &ldquo;Adicionar&rdquo; no canto superior direito
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                    O Bora 13 ficará salvo na sua tela principal como um atalho rápido, leve e sem ocupar memória.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Dica de Utilidade */}
          <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-[11px] text-amber-900 dark:text-amber-200 leading-snug">
            💡 <strong>Dica prática:</strong> Com o atalho na tela inicial, você não precisa ficar procurando o link no WhatsApp nem lembrando de cabeça os números de empregos e remédios do seu estado na hora da conversa.
          </div>
        </div>

        {/* Rodapé */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex justify-end bg-slate-50/50 dark:bg-slate-900/40">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-black text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Entendi, fechar
          </button>
        </div>
      </div>
    </div>
  );
}
