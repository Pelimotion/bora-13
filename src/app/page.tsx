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
import HomeEditorialSection from '@/components/HomeEditorialSection';
import PrepareWorkspaceSection from '@/components/PrepareWorkspaceSection';
import ExploreHubSection from '@/components/ExploreHubSection';
import ConversationSimulator from '@/components/ConversationSimulator';
import PostStudioSection from '@/components/PostStudioSection';
import {
  type AppSection,
  type CanonicalAppSection,
  type AgenticWorkingMemory,
  type PostPresetData,
  normalizeAppSection,
  loadWorkingMemory,
  saveWorkingMemory,
  clearWorkingMemory,
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
  type ConversionFrontId,
  MENOS_COM_FLAVIO_FACTS,
} from '@/data/electoralTactics';

// ═══════════════════════════════════════════════════════════════
// BORA APP — O QG DO DIÁLOGO POPULAR & ESPERANÇA
// Identidade Cidadã Bora 13 • Arquitetura Fluida & Concretismo
// ═══════════════════════════════════════════════════════════════

export default function BoraApp() {
  const [section, setSection] = useState<AppSection>('inicio');
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

  // Cenário ativo no Simulador de Conversa
  const [simulatorScenarioId, setSimulatorScenarioId] = useState<string>('tio-almoco');

  // Abertura automática do dossiê estadual vindo de link compartilhado
  const [openDossierOnLoad, setOpenDossierOnLoad] = useState<boolean>(false);

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

  // 2.1 Hidratação da Memória de Trabalho Agêntica Persistida
  useEffect(() => {
    const saved = loadWorkingMemory();
    if (saved) {
      setMemory((prev) => ({
        ...prev,
        ...saved,
      }));
      setProfile((prev) => ({
        ...prev,
        state: saved.selectedUF || prev.state,
        city: saved.selectedCity || prev.city,
        occupation: saved.occupation || prev.occupation,
        profileTags: saved.profileTags || prev.profileTags,
        rejectionLevel: saved.rejectionLevel ?? prev.rejectionLevel,
        familyFlags: saved.familyFlags || prev.familyFlags,
      }));
    }
  }, []);

  // 2.2 Auto-salvamento da Memória de Trabalho Agêntica
  useEffect(() => {
    saveWorkingMemory(memory);
  }, [memory]);

  const handleResetContext = useCallback(() => {
    clearWorkingMemory();
    const defaultMemory: AgenticWorkingMemory = {
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
    };
    setMemory(defaultMemory);
    setProfile({
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
    playProceduralHaptic('toggle');
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
    const tabParam = params.get('tab') || params.get('section');
    const modeParam = params.get('mode');

    if (tabParam) {
      setSection(normalizeAppSection(tabParam));
    } else if (modeParam === 'quick' || modeParam === 'fatos') {
      setSection('fatos');
    } else if (modeParam === 'studio' || modeParam === 'estudio' || modeParam === 'post') {
      setSection('estudio');
    } else if (modeParam === 'territorio' || modeParam === 'mapa') {
      setSection('territorio');
    } else if (modeParam === 'simulador' || modeParam === 'dojo') {
      setSection('treinar');
    } else if (modeParam === 'preparar' || modeParam === 'perfil') {
      setSection('preparar');
    } else if (modeParam === 'inicio' || modeParam === 'radar') {
      setSection('inicio');
    }

    const stateParam = params.get('state') || params.get('uf');
    const dossierParam = params.get('dossier');
    const cityParam = params.get('city');
    const levelParam = params.get('level');
    const occParam = params.get('occ');
    const frontParam = params.get('front');

    if (dossierParam === '1' || dossierParam === 'true') {
      setOpenDossierOnLoad(true);
    }

    if (stateParam || levelParam || occParam || cityParam || frontParam) {
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

      const validFronts: ConversionFrontId[] = ['ex_lula', 'terceira_via', 'bolsonarista_flavio', 'abstencao_70', 'nulo_branco'];
      const parsedFront = (frontParam && validFronts.includes(frontParam as any)) ? (frontParam as ConversionFrontId) : undefined;

      setProfile(updatedProfile);
      setMemory((prev) => ({
        ...prev,
        selectedUF: updatedProfile.state,
        selectedCity: updatedProfile.city,
        occupation: updatedProfile.occupation,
        profileTags: updatedProfile.profileTags,
        rejectionLevel: updatedProfile.rejectionLevel,
        ...(parsedFront ? { activeFrontId: parsedFront } : {}),
      }));

      if (!modeParam && !tabParam) {
        if (dossierParam === '1' || dossierParam === 'true') {
          setSection('inicio');
        } else if (occParam || frontParam || levelParam) {
          setSection('preparar');
        } else {
          setSection('inicio');
        }
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

  // Seleção de Frente de Conversão dos 5 Perfis
  const handleSelectFront = useCallback(
    (frontId: ConversionFrontId) => {
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

  // Abertura Direta do Estúdio a partir do Funil da Virada
  const handleOpenStudioWithPreset = useCallback((preset: PostPresetData) => {
    playProceduralHaptic('generate');
    setActivePostPreset(preset);
    setSection('estudio');
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  // Transição Contextualizada para o Simulador de Conversa
  const handleOpenSimulator = useCallback((frontId?: string, occupation?: string) => {
    playProceduralHaptic('click');
    let targetScenario = 'tio-almoco';
    const occ = (occupation || '').toLowerCase();
    if (occ.includes('motorista') || occ.includes('uber') || occ.includes('app') || occ.includes('entregador')) {
      targetScenario = 'amigo-uber';
    } else if (frontId === 'abstencao_70' || frontId === 'frente-3-abstencao' || occ.includes('cuidador') || occ.includes('bpc') || occ.includes('aposentad')) {
      targetScenario = 'vizinha-bpc';
    } else {
      targetScenario = 'tio-almoco';
    }
    setSimulatorScenarioId(targetScenario);
    setSection('simulador');
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  const activeCanonical = normalizeAppSection(section);

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
        onResetContext={handleResetContext}
      />

      {/* ── CONTEÚDO PRINCIPAL DIVIDIDO EM 5 DESTINOS FOCADOS ── */}
      <main className="flex-1 w-full relative z-10">
        {activeCanonical === 'inicio' && (
          <HomeEditorialSection
            onNavigate={setSection}
            memory={memory}
            onResetContext={handleResetContext}
            canInstall={!!installPrompt}
            onInstall={handleInstallApp}
            onSelectFront={handleSelectFront}
            onOpenStudioWithPreset={handleOpenStudioWithPreset}
            onSelectState={handleSelectTerritory}
            initialOpenDossier={openDossierOnLoad}
          />
        )}

        {activeCanonical === 'preparar' && (
          <PrepareWorkspaceSection
            memory={memory}
            onNavigate={setSection}
            onSelectState={handleSelectTerritory}
            onSelectFront={handleSelectFront}
            onOpenStudioWithPreset={handleOpenStudioWithPreset}
            onNavigateToSimulator={handleOpenSimulator}
          />
        )}

        {activeCanonical === 'treinar' && (
          <div className="py-6 max-w-5xl mx-auto px-4">
            <ConversationSimulator isEmbedded={true} initialScenarioId={simulatorScenarioId} />
          </div>
        )}

        {activeCanonical === 'explorar' && (
          <ExploreHubSection
            memory={memory}
            onNavigate={setSection}
            onSelectState={handleSelectTerritory}
            onGeneratePostFromTerritory={handleGeneratePostFromTerritory}
            onOpenStudioWithPreset={handleOpenStudioWithPreset}
            onNavigateToSimulator={handleOpenSimulator}
            onOpenCardGenerator={handleGeneratePostFromArgument}
            initialTab={section === 'territorio' ? 'territorio' : section === 'fatos' ? 'fatos' : 'mapa'}
          />
        )}

        {activeCanonical === 'estudio' && (
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
              Bora 13 • Guia Cidadão de Diálogo
            </span>
          </div>

          <p className="text-slate-500 font-medium">
            ⭐ Iniciativa Popular Independente • Feita para Somar na Causa • Sem Vínculo Oficial Partidário • 100% Anônimo
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 text-[11px] font-semibold text-slate-400">
            <span>Fontes Públicas Oficiais: IBGE • DIEESE • Caged • Banco Central</span>
            <span>•</span>
            <span className="text-slate-500 font-bold">100% Voluntário & Sem Vínculo Partidário</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
