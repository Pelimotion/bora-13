'use client';

import { useState, useEffect, useCallback } from 'react';

interface AudioPlayerButtonProps {
  text: string;
  label?: string;
  className?: string;
}

export default function AudioPlayerButton({ text, label = 'Ouvir', className = '' }: AudioPlayerButtonProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setIsSupported(true);
    }
  }, []);

  const handleToggle = useCallback(() => {
    if (!isSupported) return;

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    window.speechSynthesis.cancel(); // Stop any pending utterance

    const cleanText = text.replace(/[*_#~]/g, ''); // strip markdown
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'pt-BR';
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    // Pick a pt-BR voice if available
    const voices = window.speechSynthesis.getVoices();
    const ptVoice = voices.find(v => v.lang.startsWith('pt') || v.lang.includes('BR'));
    if (ptVoice) {
      utterance.voice = ptVoice;
    }

    utterance.onend = () => {
      setIsPlaying(false);
    };

    utterance.onerror = () => {
      setIsPlaying(false);
    };

    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
  }, [isSupported, isPlaying, text]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  if (!isSupported) return null;

  return (
    <button
      type="button"
      onClick={handleToggle}
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
        isPlaying
          ? 'bg-teal-500 text-slate-950 shadow-lg shadow-teal-500/30 animate-pulse'
          : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/60'
      } ${className}`}
      title={isPlaying ? 'Parar áudio' : 'Ouvir este argumento narrado em voz alta'}
    >
      <span>{isPlaying ? '⏹️' : '🔊'}</span>
      <span>{isPlaying ? 'Ouvindo...' : label}</span>
    </button>
  );
}
