'use client';

import React, { useState, useCallback, useEffect, useMemo } from 'react';
import type { UserProfile } from '@/lib/engine';
import { runEngine } from '@/lib/engine';
import { inferTagsFromCustomOccupation } from '@/data/occupations';
import { ARGUMENTS_DATABASE, type Argument } from '@/data/arguments';
import type { Opportunity } from '@/data/opportunities';
import ArtisticCanvas from '@/components/ArtisticCanvas';
import NavigationHeader from '@/components/NavigationHeader';
import MobileDock from '@/components/MobileDock';
import RadarSection from '@/components/RadarSection';
import TerritorySection from '@/components/TerritorySection';
import ProfileSection from '@/components/ProfileSection';
import QuickArgumentView from '@/components/QuickArgumentView';
import ConversationSimulator from '@/components/ConversationSimulator';
import PostStudioSection from '@/components/PostStudioSection';
import {
  type AppSection,
  type AgenticWorkingMemory,
  type PostPresetData,
  createPostPresetFromArgument,
  createPostPresetFromOpportunity,
  createPostPresetFromTerritory,
  createDefaultPostPreset,
  createPostPresetFromConversionFront,
  createPostPresetFromMenosFact,
  playProceduralHaptic,
} from '@/lib/agenticOrchestrator';
import {
  type ConversionFront,
  MENOS_COM_FLAVIO_FACTS,
} from '@/data/electoralTactics';

// ═══════════════════════════════════════════════════════════════
// BORA APP — O QG DO DIÁLOGO POPULAR & ESPERANÇA
// Identidade Oficial Casa 13 • Arquitetura Fluida & Concretismo
// ═══════════════════════════════════════════════════════════════

export default function BoraApp() {
  const [section, setSection] = useState<AppSection>('radar');
  const [isDark, setIsDark] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [installPrompt, setInstallPrompt] = useState<any>(null);

  // Memória de Trabalho Agêntica
  const [memory, setMemory] = useState<AgenticWorkingMemory>({
    selectedUF: 'SP',
    selectedCity: 'São Paulo',
    occupation: undefined,
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
  });

  // Perfil para o Decision Engine
  const [profile, setProfile] = useState<UserProfile>({
    state: 'SP',
    city: 'São Paulo',
    profileTags: [],
    rejectionLevel: 2,
    familyFlags: {
      hasElderly: false,
      hasChildren: false,
      dependsSUS: false,
      receivesBenefit: false,
      hasPCD: false,
    },
  });

  // Preset ativo no Estúdio de Posts
  const [activePostPreset, setActivePostPreset] = useState<PostPresetData | null>(null);

  // 1. Observador de Modo Escuro / Claro (para sincronizar WebGL Shaders e Tema)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const checkDark = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };
    checkDark();

    const observer = new MutationObserver(checkDark);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  // 2. Carregar preferência de som
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const isMuted = localStorage.getItem('bora_app_sound_muted') === 'true';
      setSoundEnabled(!isMuted);
    } catch {
      // ignore
    }
  }, []);

  const handleToggleSound = useCallback(() => {
    setSoundEnabled((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('bora_app_sound_muted', (!next).toString());
      } catch {
        // ignore
      }
      if (next) {
        playProceduralHaptic('toggle');
      }
      return next;
    });
  }, []);

  // 3. Leitura de parâmetros de URL e PWA
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const installHandler = (e: any) => {
      e.preventDefault();
      setInstallPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', installHandler);

    const params = new URLSearchParams(window.location.search);
    const modeParam = params.get('mode');

    if (modeParam === 'quick' || modeParam === 'fatos') {
      setSection('fatos');
    } else if (modeParam === 'studio' || modeParam === 'estudio' || modeParam === 'post') {
      setSection('estudio');
    } else if (modeParam === 'territorio' || modeParam === 'mapa') {
      setSection('territorio');
    } else if (modeParam === 'simulador' || modeParam === 'dojo') {
      setSection('simulador');
    }

    const stateParam = params.get('state');
    const cityParam = params.get('city');
    const levelParam = params.get('level');
    const occParam = params.get('occ');

    if (stateParam || levelParam || occParam || cityParam) {
      const updatedProfile: UserProfile = {
        profileTags: [],
        rejectionLevel: levelParam ? Math.max(1, Math.min(4, parseInt(levelParam, 10))) : 2,
        state: stateParam ? stateParam.toUpperCase() : 'SP',
        city: cityParam || undefined,
        occupation: occParam || undefined,
        familyFlags: {
          hasElderly: false,
          hasChildren: false,
          dependsSUS: false,
          receivesBenefit: false,
          hasPCD: false,
        },
      };

      if (occParam) {
        const inferred = inferTagsFromCustomOccupation(occParam);
        updatedProfile.profileTags = inferred;
      }

      setProfile(updatedProfile);
      setMemory((prev) => ({
        ...prev,
        selectedUF: updatedProfile.state,
        selectedCity: updatedProfile.city,
        occupation: updatedProfile.occupation,
        profileTags: updatedProfile.profileTags,
        rejectionLevel: updatedProfile.rejectionLevel,
      }));

      if (!modeParam) {
        setSection('perfil');
      }
    }

    return () => window.removeEventListener('beforeinstallprompt', installHandler);
  }, []);

  // PWA Install Handler
  const handleInstallApp = useCallback(async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === 'accepted') {
      setInstallPrompt(null);
    }
  }, [installPrompt]);

  // ─────────────────────────────────────────────────────────────
  // PONTES AGÊNTICAS DE CONTEXTO (SESSÕES → ESTÚDIO DE POSTS)
  // ─────────────────────────────────────────────────────────────

  // Ponte do Território
  const handleSelectTerritory = useCallback((uf: string, city?: string) => {
    setMemory((prev) => ({
      ...prev,
      selectedUF: uf,
      selectedCity: city,
    }));
    setProfile((prev) => ({
      ...prev,
      state: uf,
      city: city,
    }));
  }, []);

  const handleGeneratePostFromTerritory = useCallback((uf: string, city?: string) => {
    playProceduralHaptic('generate');
    const preset = createPostPresetFromTerritory(uf, city);
    setActivePostPreset(preset);
    setSection('estudio');
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  // Ponte do Perfil & Argumentos
  const handleUpdateProfile = useCallback((updated: UserProfile) => {
    setProfile(updated);
    setMemory((prev) => ({
      ...prev,
      selectedUF: updated.state,
      selectedCity: updated.city,
      occupation: updated.occupation,
      profileTags: updated.profileTags,
      rejectionLevel: updated.rejectionLevel,
      familyFlags: updated.familyFlags,
    }));
  }, []);

  const handleGeneratePostFromArgument = useCallback(
    (arg: Argument) => {
      playProceduralHaptic('generate');
      const preset = createPostPresetFromArgument(arg, memory);
      setActivePostPreset(preset);
      setSection('estudio');
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },
    [memory]
  );

  const handleGeneratePostFromOpportunity = useCallback(
    (opp: Opportunity) => {
      playProceduralHaptic('generate');
      const preset = createPostPresetFromOpportunity(opp, memory);
      setActivePostPreset(preset);
      setSection('estudio');
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },
    [memory]
  );

  // Seleção de Frente de Conversão dos 4 Votos
  const handleSelectFront = useCallback(
    (frontId: 'ex_lula' | 'terceira_via' | 'abstencao_70' | 'nulo_branco') => {
      setMemory((prev) => ({ ...prev, activeFrontId: frontId }));
    },
    []
  );

  // Geração de Post a partir de Frente de Conversão
  const handleGeneratePostFromConversionFront = useCallback(
    (front: ConversionFront) => {
      playProceduralHaptic('generate');
      const preset = createPostPresetFromConversionFront(front, memory);
      setActivePostPreset(preset);
      setSection('estudio');
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },
    [memory]
  );

  // Geração de Post a partir de Fato do Menos com Flávio
  const handleGeneratePostFromMenosFact = useCallback(
    (fact: (typeof MENOS_COM_FLAVIO_FACTS)[0]) => {
      playProceduralHaptic('generate');
      const preset = createPostPresetFromMenosFact(fact, memory);
      setActivePostPreset(preset);
      setSection('estudio');
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },
    [memory]
  );

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-page)] text-[var(--text-primary)] transition-colors relative overflow-x-clip selection:bg-red-500 selection:text-white pb-20 md:pb-8">
      {/* ── CAMADA WEBGL ARTÍSTICA & FITA CINÉTICA (THREE.JS + SHADERS GLSL) ── */}
      <ArtisticCanvas currentStep={section} isDarkMode={isDark} />

      {/* ── BARRA DE NAVEGAÇÃO SUPERIOR FIXA (DYNAMIC ISLAND FLUTUANTE) ── */}
      <NavigationHeader
        currentSection={section}
        onSelectSection={setSection}
        memory={memory}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        canInstall={!!installPrompt}
        onInstall={handleInstallApp}
      />

      {/* ── CONTEÚDO PRINCIPAL DIVIDIDO EM SESSÕES ELEGANTES ── */}
      <main className="flex-1 w-full relative z-10">
        {section === 'radar' && (
          <RadarSection
            onNavigate={setSection}
            canInstall={!!installPrompt}
            onInstall={handleInstallApp}
            memory={memory}
            onSelectFront={handleSelectFront}
          />
        )}

        {section === 'territorio' && (
          <TerritorySection
            selectedUF={memory.selectedUF}
            selectedCity={memory.selectedCity}
            onSelectState={handleSelectTerritory}
            onGeneratePostFromTerritory={handleGeneratePostFromTerritory}
            onNavigateToProfile={() => setSection('perfil')}
          />
        )}

        {section === 'perfil' && (
          <ProfileSection
            profile={profile}
            onUpdateProfile={handleUpdateProfile}
            onGeneratePostFromArgument={handleGeneratePostFromArgument}
            onGeneratePostFromOpportunity={handleGeneratePostFromOpportunity}
            onGeneratePostFromConversionFront={handleGeneratePostFromConversionFront}
            onGeneratePostFromMenosFact={handleGeneratePostFromMenosFact}
            onNavigateToSimulator={() => setSection('simulador')}
            activeFrontId={memory.activeFrontId}
            onSelectFront={handleSelectFront}
          />
        )}

        {section === 'fatos' && (
          <QuickArgumentView
            onOpenCardGenerator={handleGeneratePostFromArgument}
            className="py-8"
          />
        )}

        {section === 'simulador' && (
          <div className="py-6">
            <ConversationSimulator isEmbedded={true} />
          </div>
        )}

        {section === 'estudio' && (
          <PostStudioSection
            initialPreset={activePostPreset}
            memory={memory}
            onNavigateSection={setSection}
          />
        )}
      </main>

      {/* ── NAVEGAÇÃO DE POLEGAR INFERIOR NO MOBILE (DOCK TÁTIL) ── */}
      <MobileDock currentSection={section} onSelectSection={setSection} />

      {/* ── RODAPÉ EDITORIAL CONCRETISTA ── */}
      <footer className="w-full mt-16 pt-8 pb-12 border-t border-slate-200/80 dark:border-slate-800 text-center relative z-10 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-bold text-slate-700 dark:text-slate-300">
              Bora 13 • QG do Diálogo e da Esperança
            </span>
          </div>

          <p className="text-slate-500 font-medium">
            ⭐ Identidade Oficial Casa 13 • Zero rastreamento. 100% anônimo.
          </p>

          <div className="flex items-center gap-3 text-[11px] font-semibold text-slate-400">
            <span>Fontes: IBGE • DIEESE • Caged • BC</span>
            <span>•</span>
            <a
              href="https://casa13.pt.org.br"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#C52229] hover:underline"
            >
              casa13.pt.org.br
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
