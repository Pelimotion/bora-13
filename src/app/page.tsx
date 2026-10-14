'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';
import { runEngine, runQuickMode, type UserProfile, type EngineResult } from '@/lib/engine';
import { searchOccupations, inferTagsFromCustomOccupation, type Occupation } from '@/data/occupations';
import { BRAZIL_STATES_GEO, getStateByUF, type StateGeo } from '@/data/brazilGeo';
import type { Argument, ProfileTag } from '@/data/arguments';
import type { Opportunity } from '@/data/opportunities';
import VisualCardGenerator from '@/components/VisualCardGenerator';
import ConversationSimulator from '@/components/ConversationSimulator';
import AudioPlayerButton from '@/components/AudioPlayerButton';
import BrazilMap from '@/components/BrazilMap';
import ThemeToggle from '@/components/ThemeToggle';
import ArtisticCanvas from '@/components/ArtisticCanvas';
import QuickArgumentView from '@/components/QuickArgumentView';

// ═══════════════════════════════════════════════════════════════
// BORA APP — O QG do Diálogo e da Esperança
// Identidade Oficial Casa 13 • Caminho Único & Narrativa Intuitiva
// ═══════════════════════════════════════════════════════════════

type AppStep = 'hero' | 'location' | 'profile' | 'results' | 'quick';

export default function BoraApp() {
  const [step, setStep] = useState<AppStep>('hero');
  const [isDark, setIsDark] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
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
  const [results, setResults] = useState<EngineResult | null>(null);

  // Observador de modo escuro/claro para sincronizar Three.js
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

  // Modais
  const [activeCardArg, setActiveCardArg] = useState<Argument | null>(null);
  const [showSimulator, setShowSimulator] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<any>(null);

  const goToStep = useCallback((nextStep: AppStep) => {
    setStep(nextStep);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleQuickMode = useCallback(() => {
    goToStep('quick');
  }, [goToStep]);

  const handleGenerateResults = useCallback(() => {
    const engineResults = runEngine(profile);
    setResults(engineResults);
    goToStep('results');
  }, [profile, goToStep]);

  // Leitura de parâmetros de URL e PWA
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const installHandler = (e: any) => {
      e.preventDefault();
      setInstallPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', installHandler);

    const params = new URLSearchParams(window.location.search);
    if (params.get('mode') === 'quick') {
      setStep('quick');
      return () => window.removeEventListener('beforeinstallprompt', installHandler);
    }

    const stateParam = params.get('state');
    const cityParam = params.get('city');
    const levelParam = params.get('level');
    const occParam = params.get('occ');

    if (stateParam || levelParam || occParam || cityParam) {
      const updatedProfile: UserProfile = {
        profileTags: [],
        rejectionLevel: levelParam ? Math.max(1, Math.min(4, parseInt(levelParam, 10))) : 2,
        state: stateParam ? stateParam.toUpperCase() : undefined,
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
      const res = runEngine(updatedProfile);
      setResults(res);
      setStep('results');
    }

    return () => window.removeEventListener('beforeinstallprompt', installHandler);
  }, []);

  const handleInstallApp = useCallback(async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === 'accepted') {
      setInstallPrompt(null);
    }
  }, [installPrompt]);

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-page)] text-[var(--text-primary)] transition-colors relative overflow-x-hidden">
      {/* Camada WebGL Artística & Espacial (Three.js + GLSL Shaders) */}
      <ArtisticCanvas currentStep={step} isDarkMode={isDark} />

      {/* Barra de Navegação Superior Fixa */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-[#0B0F19]/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
        <div className="max-w-xl mx-auto px-4 py-2.5 flex items-center justify-between">
          {/* Logo e Identidade */}
          <button
            onClick={() => {
              setStep('hero');
              setResults(null);
            }}
            className="flex items-center gap-2.5 text-left group"
          >
            <div className="w-9 h-9 rounded-xl bg-[#C52229] text-white flex items-center justify-center font-black text-sm shadow-sm group-hover:scale-105 transition-transform">
              ⭐ 13
            </div>
            <div>
              <span className="font-black text-sm tracking-tight text-slate-900 dark:text-white flex items-center gap-1">
                BORA <span className="text-[#C52229]">13</span>
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-medium">
                QG do Diálogo Popular
              </span>
            </div>
          </button>

          {/* Ações Rápidas & Alternador de Tema */}
          <div className="flex items-center gap-2">
            {step !== 'hero' && (
              <button
                onClick={() => {
                  setStep('hero');
                  setResults(null);
                }}
                className="text-xs font-semibold px-2.5 py-1 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Voltar ao início"
              >
                ← Início
              </button>
            )}

            <button
              onClick={() => setShowSimulator(true)}
              className="text-xs font-bold px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/40 hover:bg-amber-100 transition-colors flex items-center gap-1"
              title="Simulador de Conversa"
            >
              <span>🥋</span>
              <span className="hidden sm:inline">Treinar</span>
            </button>

            <ThemeToggle />
          </div>
        </div>

        {/* Linha de Progresso Visual da Narrativa */}
        {step !== 'hero' && step !== 'quick' && (
          <div className="max-w-xl mx-auto px-4 pb-2 pt-1">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">
              <span className={step === 'location' ? 'text-[#C52229]' : ''}>
                1. 📍 Território
              </span>
              <span className={step === 'profile' ? 'text-[#C52229]' : ''}>
                2. 👤 Perfil & Trabalho
              </span>
              <span className={step === 'results' ? 'text-[#C52229]' : ''}>
                3. 💬 Arsenal & Direitos
              </span>
            </div>
            <div className="progress-bar">
              <div className={`progress-segment ${step === 'location' || step === 'profile' || step === 'results' ? 'active' : ''} ${step === 'profile' || step === 'results' ? 'completed' : ''}`} />
              <div className={`progress-segment ${step === 'profile' || step === 'results' ? 'active' : ''} ${step === 'results' ? 'completed' : ''}`} />
              <div className={`progress-segment ${step === 'results' ? 'active' : ''}`} />
            </div>
          </div>
        )}

        {step === 'quick' && (
          <div className="max-w-xl mx-auto px-4 pb-2 pt-1">
            <div className="flex items-center justify-between text-[11px] font-bold text-amber-700 dark:text-amber-400 mb-1">
              <span>⚡ Modo Rápido: Fato na Mesa</span>
              <span>🎲 Girar Dados para Sortear</span>
            </div>
            <div className="h-1 rounded-full bg-gradient-to-r from-[#C52229] via-[#F59E0B] to-[#10B981]" />
          </div>
        )}
      </header>

      {/* Conteúdo Principal da Narrativa */}
      <main className="flex-1 w-full relative z-10">
        {step === 'hero' && (
          <HeroSection
            onStart={() => goToStep('location')}
            onQuickMode={handleQuickMode}
            onOpenSimulator={() => setShowSimulator(true)}
            canInstall={!!installPrompt}
            onInstall={handleInstallApp}
          />
        )}
        {step === 'quick' && (
          <QuickArgumentView
            onBack={() => goToStep('hero')}
            onOpenCardGenerator={(arg) => setActiveCardArg(arg)}
          />
        )}
        {step === 'location' && (
          <LocationStep
            profile={profile}
            onUpdate={setProfile}
            onNext={() => goToStep('profile')}
            onSkip={() => goToStep('profile')}
            onBack={() => goToStep('hero')}
          />
        )}
        {step === 'profile' && (
          <ProfileStep
            profile={profile}
            onUpdate={setProfile}
            onGenerate={handleGenerateResults}
            onBack={() => goToStep('location')}
          />
        )}
        {step === 'results' && results && (
          <ResultsPanel
            results={results}
            profile={profile}
            canInstall={!!installPrompt}
            onInstall={handleInstallApp}
            onOpenCardGenerator={(arg) => setActiveCardArg(arg)}
            onOpenSimulator={() => setShowSimulator(true)}
            onRestart={() => {
              setStep('hero');
              setResults(null);
              setProfile({
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
            }}
          />
        )}
      </main>

      {/* Modais */}
      {showSimulator && <ConversationSimulator onClose={() => setShowSimulator(false)} />}
      {activeCardArg && (
        <VisualCardGenerator argument={activeCardArg} onClose={() => setActiveCardArg(null)} />
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// HERO SECTION — IDENTIDADE EDITORIAL CASA 13
// ═══════════════════════════════════════════════════════════════

function HeroSection({
  onStart,
  onQuickMode,
  onOpenSimulator,
  canInstall,
  onInstall,
}: {
  onStart: () => void;
  onQuickMode: () => void;
  onOpenSimulator: () => void;
  canInstall?: boolean;
  onInstall?: () => void;
}) {
  return (
    <section className="min-h-[calc(100vh-60px)] flex flex-col items-center justify-center px-4 py-10 text-center animate-fade-in relative max-w-xl mx-auto w-full">
      {/* Badge Oficial Casa 13 */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full mb-6 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/40 text-[#C52229] dark:text-red-300 text-xs font-black tracking-wider uppercase shadow-sm">
        <span className="text-amber-500">⭐</span>
        <span>Casa 13 • QG da Esperança & Diálogo</span>
      </div>

      {/* Título Principal & Apresentação */}
      <div className="mb-6 animate-slide-up">
        <div
          className="inline-flex items-center justify-center w-20 h-20 rounded-3xl mb-4 shadow-md text-4xl select-none"
          style={{
            background: 'linear-gradient(135deg, #C52229 0%, #B91C1C 60%, #F59E0B 120%)',
          }}
        >
          🤝
        </div>
        <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2 text-slate-900 dark:text-white">
          Bora Conversar
        </h1>
        <p className="text-lg md:text-xl font-bold text-slate-700 dark:text-slate-200 max-w-md mx-auto leading-snug">
          O Brasil que dá certo com dados reais e acolhimento humano.
        </p>
      </div>

      {/* Proposta de Valor Humanizada */}
      <p className="text-sm md:text-base max-w-md mx-auto mb-8 leading-relaxed text-slate-600 dark:text-slate-400">
        Conecte fatos comprovados do IBGE, DIEESE e ministérios à realidade da profissão e da cidade de quem você quer conversar. Sem briga, com respeito e foco no bolso.
      </p>

      {/* Missão Cidadã Gamificada do Dia */}
      <div className="w-full max-w-sm mb-5 p-3.5 rounded-2xl bg-gradient-to-r from-red-50 to-amber-50 dark:from-red-950/30 dark:to-amber-950/30 border border-red-200/80 dark:border-red-800/40 text-left flex items-start gap-3 shadow-sm">
        <div className="w-9 h-9 rounded-xl bg-[#C52229] text-white flex items-center justify-center font-black text-lg shrink-0 shadow-sm">
          🎯
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-[#C52229]">
              Missão Cidadã do Dia
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-200">
              +50 XP
            </span>
          </div>
          <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-0.5 leading-snug">
            Gire os dados, domine 1 fato com fonte oficial e compartilhe sem briga.
          </p>
        </div>
      </div>

      {/* Botões de Ação da Jornada */}
      <div className="flex flex-col gap-3 w-full max-w-sm mb-8 animate-slide-up stagger-1">
        <button className="btn-pt text-base font-bold shadow-md" onClick={onStart}>
          <span className="flex items-center justify-center gap-2">
            🚀 Iniciar Diálogo Personalizado (Cidade & Profissão)
          </span>
        </button>

        <button className="btn-secondary text-sm font-bold flex items-center justify-center gap-2" onClick={onQuickMode}>
          <span className="text-lg">🎲</span>
          <span>Roleta de Fatos & Argumento Rápido</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-200">
            Novo
          </span>
        </button>

        <button
          className="py-3 px-4 rounded-xl text-xs font-bold border border-amber-300 dark:border-amber-800/50 bg-amber-50/60 dark:bg-amber-950/20 hover:bg-amber-100 text-amber-900 dark:text-amber-300 flex items-center justify-center gap-2 transition-all shadow-sm"
          onClick={onOpenSimulator}
        >
          <span>🥋</span>
          <span>Treinar no Simulador de Diálogo</span>
        </button>

        {canInstall && onInstall && (
          <button
            className="py-3 px-4 rounded-xl text-xs font-bold border border-red-300 dark:border-red-800/60 bg-red-50 dark:bg-red-950/20 text-[#C52229] dark:text-red-300 flex items-center justify-center gap-2 transition-all shadow-sm"
            onClick={onInstall}
          >
            <span>📲</span>
            <span>Instalar no Celular (Funciona 100% Offline)</span>
          </button>
        )}
      </div>

      {/* Selos de Confiança Institucional */}
      <div className="flex flex-wrap justify-center gap-2 animate-slide-up stagger-2">
        {[
          { icon: '🔒', text: '100% Anônimo & Sem Cadastro' },
          { icon: '📊', text: 'Fontes Oficiais Auditadas' },
          { icon: '🎨', text: 'Cards Oficiais Casa 13' },
          { icon: '🚀', text: 'Benefícios & Oportunidades Reais' },
        ].map((badge) => (
          <div
            key={badge.text}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-semibold shadow-sm"
          >
            <span>{badge.icon}</span>
            <span>{badge.text}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════
// ETAPA 1 — LOCALIZAÇÃO & CIDADE COM MAPA ANIMADO
// ═══════════════════════════════════════════════════════════════

function LocationStep({
  profile,
  onUpdate,
  onNext,
  onSkip,
  onBack,
}: {
  profile: UserProfile;
  onUpdate: (p: UserProfile) => void;
  onNext: () => void;
  onSkip: () => void;
  onBack: () => void;
}) {
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [citySearch, setCitySearch] = useState('');
  const [stateSearch, setStateSearch] = useState('');

  const currentState = profile.state ? getStateByUF(profile.state) : undefined;

  const handleSelectStateGeo = (st: StateGeo) => {
    onUpdate({
      ...profile,
      state: st.uf,
      city: st.capital,
    });
  };

  const filteredStates = useMemo(() => {
    if (!stateSearch) return BRAZIL_STATES_GEO;
    const q = stateSearch.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    return BRAZIL_STATES_GEO.filter(
      s => s.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes(q) ||
           s.uf.toLowerCase().includes(q) ||
           s.capital.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes(q)
    );
  }, [stateSearch]);

  return (
    <section className="min-h-[calc(100vh-80px)] flex flex-col px-4 py-6 max-w-xl mx-auto w-full animate-slide-up">
      {/* Cabeçalho da Etapa */}
      <div className="flex items-center justify-between mb-3">
        <button onClick={onBack} className="btn-ghost -ml-2 text-xs">
          ← Voltar
        </button>
        <span className="badge-casa13">Etapa 1 de 2 • Território</span>
      </div>

      <div className="mb-4">
        <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mb-1">
          De onde é a pessoa? 📍
        </h2>
        <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400">
          Selecione o Estado e a Cidade para ativarmos obras e investimentos regionais.
        </p>
      </div>

      {/* Alternador de Visualização: Mapa vs Lista */}
      <div className="flex gap-2 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-2xl border border-slate-200 dark:border-slate-700 mb-4">
        <button
          onClick={() => setViewMode('map')}
          className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            viewMode === 'map'
              ? 'bg-[#C52229] text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <span>🗺️</span>
          <span>Mapa Interativo</span>
        </button>
        <button
          onClick={() => setViewMode('list')}
          className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            viewMode === 'list'
              ? 'bg-[#C52229] text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <span>📋</span>
          <span>Lista de Estados</span>
        </button>
      </div>

      {/* Visualização de Mapa */}
      {viewMode === 'map' && (
        <div className="mb-4 animate-fade-in flex flex-col items-center">
          <BrazilMap
            selectedState={profile.state}
            onSelectState={handleSelectStateGeo}
          />
        </div>
      )}

      {/* Visualização de Lista */}
      {viewMode === 'list' && (
        <div className="mb-4 animate-fade-in">
          <input
            type="text"
            className="input-field text-xs mb-3"
            placeholder="Buscar estado por nome ou UF..."
            value={stateSearch}
            onChange={(e) => setStateSearch(e.target.value)}
          />
          <div className="grid grid-cols-2 gap-2 max-h-[38vh] overflow-y-auto pr-1">
            {filteredStates.map((st) => (
              <button
                key={st.uf}
                onClick={() => handleSelectStateGeo(st)}
                className={`chip justify-center text-center ${profile.state === st.uf ? 'active' : ''}`}
              >
                <span className="font-black text-sm">{st.uf}</span>
                <span className="text-xs truncate">{st.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Seletor de Município quando o Estado está escolhido */}
      {currentState && (
        <div className="card-clean mb-6 animate-slide-up">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-xl">📍</span>
              <div>
                <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider block">
                  Estado Selecionado
                </span>
                <p className="text-sm font-black text-slate-900 dark:text-white">
                  {currentState.name} ({currentState.uf})
                </p>
              </div>
            </div>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              {currentState.region}
            </span>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 mb-2.5">
            Selecione a cidade polo ou digite o município:
          </p>

          {/* Chips de Cidades Principais */}
          <div className="flex flex-wrap gap-1.5 mb-3 max-h-24 overflow-y-auto">
            {currentState.majorCities.map((city) => (
              <button
                key={city}
                onClick={() => onUpdate({ ...profile, city })}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                  profile.city === city
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {city === currentState.capital ? `⭐ ${city}` : city}
              </button>
            ))}
          </div>

          {/* Campo de Busca de Outra Cidade */}
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Ou digite outra cidade..."
              value={citySearch}
              onChange={(e) => setCitySearch(e.target.value)}
              className="input-field text-xs py-2 px-3 flex-1"
            />
            {citySearch && (
              <button
                onClick={() => {
                  onUpdate({ ...profile, city: citySearch });
                  setCitySearch('');
                }}
                className="px-3 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-sm"
              >
                Usar
              </button>
            )}
          </div>

          {profile.city && (
            <p className="text-xs text-emerald-700 dark:text-emerald-400 mt-2 font-semibold">
              ✓ Cidade definida: <strong>{profile.city}</strong>
            </p>
          )}

          {/* Botão de Avanço */}
          <button
            onClick={onNext}
            className="btn-pt w-full mt-4 text-xs md:text-sm font-bold shadow-md"
          >
            <span>Confirmar Localização & Avançar</span>
            <span>→</span>
          </button>
        </div>
      )}

      {/* Pular Localização */}
      <button className="btn-ghost mt-auto self-center text-xs text-slate-500" onClick={onSkip}>
        Pular localização e usar média nacional →
      </button>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════
// ETAPA 2 — PERFIL & REALIDADE (70+ PROFISSÕES + SUGESTÕES)
// ═══════════════════════════════════════════════════════════════

function ProfileStep({
  profile,
  onUpdate,
  onGenerate,
  onBack,
}: {
  profile: UserProfile;
  onUpdate: (p: UserProfile) => void;
  onGenerate: () => void;
  onBack: () => void;
}) {
  const [subStep, setSubStep] = useState(0);
  const [occQuery, setOccQuery] = useState('');

  const occupationResults = useMemo(() => searchOccupations(occQuery, 14), [occQuery]);

  const addTag = (tag: ProfileTag) => {
    if (!profile.profileTags.includes(tag)) {
      onUpdate({ ...profile, profileTags: [...profile.profileTags, tag] });
    }
  };

  const toggleFlag = (flag: keyof UserProfile['familyFlags']) => {
    onUpdate({
      ...profile,
      familyFlags: { ...profile.familyFlags, [flag]: !profile.familyFlags[flag] },
    });
  };

  const handleCustomOccupation = (text: string) => {
    if (!text.trim()) return;
    const inferred = inferTagsFromCustomOccupation(text);
    onUpdate({
      ...profile,
      occupation: text.trim(),
      profileTags: [...new Set([...profile.profileTags, ...inferred])],
    });
    setSubStep(1);
  };

  const rejectionLabels = [
    { level: 1, emoji: '💚', label: 'Frustrado(a), mas já votou no Lula', short: 'Aberto ao Diálogo' },
    { level: 2, emoji: '🤔', label: 'Indeciso(a) / Desiludido com política', short: 'Indeciso' },
    { level: 3, emoji: '😤', label: 'Vota na oposição por rejeição', short: 'Crítico / Rejeição' },
    { level: 4, emoji: '🔴', label: 'Oposição convicta / Radical', short: 'Convicto na Oposição' },
  ];

  const subSteps = [
    // 0: Ocupação
    () => (
      <div className="animate-slide-up" key="occupation">
        <div className="flex items-center justify-between mb-1">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#C52229]">ETAPA 2 DE 2 • PERFIL</p>
          <span className="text-xs text-slate-500 font-bold">1 de 5</span>
        </div>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-1">
          Qual a profissão da pessoa? 💼
        </h2>
        <p className="text-xs text-slate-600 dark:text-slate-400 mb-4">
          Com mais de 70 categorias mapeadas. Você pode buscar ou digitar qualquer ocupação.
        </p>

        {/* Input de Busca com Auto-sugestão */}
        <div className="relative mb-3">
          <input
            type="text"
            className="input-field text-sm pr-10"
            placeholder="Ex: Motorista de app, enfermeira, pedreiro, manicure, comerciante..."
            value={occQuery}
            onChange={(e) => setOccQuery(e.target.value)}
            autoComplete="off"
          />
          {occQuery && (
            <button
              onClick={() => setOccQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
            >
              ✕
            </button>
          )}
        </div>

        {/* Opção de Enviar Ocupação Customizada */}
        {occQuery.trim().length > 1 && (
          <button
            onClick={() => handleCustomOccupation(occQuery)}
            className="w-full mb-3 p-3 rounded-2xl border border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/20 text-left transition-all flex items-center justify-between shadow-sm group"
          >
            <div className="flex items-center gap-2.5">
              <span className="text-xl">➕</span>
              <div>
                <p className="text-xs font-bold text-amber-900 dark:text-amber-300">
                  Definir: &ldquo;{occQuery}&rdquo;
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Mapear automaticamente os dados econômicos desta ocupação
                </p>
              </div>
            </div>
            <span className="text-amber-700 dark:text-amber-400 font-bold group-hover:translate-x-1 transition-transform">→</span>
          </button>
        )}

        {/* Grid de Profissões Encontradas */}
        <div className="flex flex-wrap gap-1.5 mb-6 max-h-[38vh] overflow-y-auto pr-1">
          {occupationResults.map((occ) => (
            <button
              key={occ.label}
              className={`chip text-xs py-2 px-3 ${profile.occupation === occ.label ? 'active' : ''}`}
              onClick={() => {
                onUpdate({
                  ...profile,
                  occupation: occ.label,
                  profileTags: [...new Set([...profile.profileTags, ...occ.tags])],
                });
                setSubStep(1);
              }}
            >
              <span>{occ.emoji}</span>
              <span className="font-semibold">{occ.label}</span>
            </button>
          ))}
        </div>

        <button className="btn-ghost text-xs text-slate-500" onClick={() => setSubStep(1)}>
          Não sei a ocupação / Pular esta pergunta →
        </button>
      </div>
    ),

    // 1: Vínculo de Trabalho
    () => (
      <div className="animate-slide-up" key="vinculo">
        <div className="flex items-center justify-between mb-1">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#C52229]">VÍNCULO DE TRABALHO</p>
          <span className="text-xs text-slate-500 font-bold">2 de 5</span>
        </div>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-1">
          Como ela trabalha no dia a dia? 📋
        </h2>
        <p className="text-xs text-slate-600 dark:text-slate-400 mb-5">
          Ajuda a separar argumentos sobre CLT, MEI, impostos ou aposentadoria.
        </p>

        <div className="flex flex-col gap-2.5 mb-6">
          {([
            { tag: 'clt' as ProfileTag, label: 'CLT (Carteira assinada)', emoji: '📝', desc: 'Preocupado com 13º, férias, FGTS e segurança' },
            { tag: 'pj' as ProfileTag, label: 'PJ / MEI (Microempreendedor)', emoji: '🏢', desc: 'Quer crédito fácil, menos burocracia e juros baixos' },
            { tag: 'autonomo' as ProfileTag, label: 'Autônomo / Bico / Informal', emoji: '🔨', desc: 'Preocupado com custo diário, comida e ferramentas' },
            { tag: 'desempregado' as ProfileTag, label: 'Desempregado(a) / Buscando vaga', emoji: '📋', desc: 'Precisa de geração de emprego e rede de proteção' },
            { tag: 'aposentado' as ProfileTag, label: 'Aposentado(a) / Pensionista', emoji: '🧓', desc: 'Preocupado com BPC, remédios e fila do INSS' },
            { tag: 'servidor_publico' as ProfileTag, label: 'Servidor(a) Público(a)', emoji: '🏛️', desc: 'Defende concursos e estabilidade' },
          ]).map((item) => (
            <button
              key={item.tag}
              className={`p-3 rounded-2xl border text-left transition-all flex items-center justify-between shadow-sm ${
                profile.profileTags.includes(item.tag)
                  ? 'bg-red-50 dark:bg-red-950/40 border-[#C52229] text-slate-900 dark:text-white'
                  : 'bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
              }`}
              onClick={() => {
                addTag(item.tag);
                setSubStep(2);
              }}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{item.emoji}</span>
                <div>
                  <p className="text-xs md:text-sm font-bold text-slate-900 dark:text-white">{item.label}</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">{item.desc}</p>
                </div>
              </div>
              <span className="text-slate-400 font-bold">→</span>
            </button>
          ))}
        </div>

        <button className="btn-ghost text-xs text-slate-500" onClick={() => setSubStep(2)}>
          Pular esta etapa →
        </button>
      </div>
    ),

    // 2: Família & Benefícios
    () => (
      <div className="animate-slide-up" key="familia">
        <div className="flex items-center justify-between mb-1">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#C52229]">REALIDADE FAMILIAR</p>
          <span className="text-xs text-slate-500 font-bold">3 de 5</span>
        </div>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-1">
          Sobre a família e o dia a dia 👨‍👩‍👧‍👦
        </h2>
        <p className="text-xs text-slate-600 dark:text-slate-400 mb-5">
          Marque o que se aplica para conectarmos a oportunidades concretas.
        </p>

        <div className="flex flex-col gap-2.5 mb-6">
          {([
            { flag: 'hasElderly' as const, label: 'Tem idoso ou aposentado na casa', emoji: '👴' },
            { flag: 'hasChildren' as const, label: 'Tem filhos na escola ou creche (Pé-de-Meia)', emoji: '👶' },
            { flag: 'dependsSUS' as const, label: 'Depende do SUS ou Farmácia Popular', emoji: '🏥' },
            { flag: 'receivesBenefit' as const, label: 'Recebe benefício social (BPC, Bolsa Família)', emoji: '💳' },
            { flag: 'hasPCD' as const, label: 'Tem familiar com deficiência (PCD)', emoji: '♿' },
          ]).map((item) => (
            <button
              key={item.flag}
              className={`toggle-container ${profile.familyFlags[item.flag] ? 'active' : ''}`}
              onClick={() => toggleFlag(item.flag)}
            >
              <div className="toggle-track">
                <div className="toggle-thumb" />
              </div>
              <span className="text-lg">{item.emoji}</span>
              <span className="text-xs md:text-sm font-semibold text-slate-800 dark:text-slate-200">{item.label}</span>
            </button>
          ))}
        </div>

        <button className="btn-pt w-full text-xs md:text-sm font-bold shadow-md" onClick={() => setSubStep(3)}>
          Continuar →
        </button>
      </div>
    ),

    // 3: Religião e Valores
    () => (
      <div className="animate-slide-up" key="religiao">
        <div className="flex items-center justify-between mb-1">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#C52229]">VALORES E RESPEITO</p>
          <span className="text-xs text-slate-500 font-bold">4 de 5</span>
        </div>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-1">
          Religião ou valores de fé 🙏
        </h2>
        <p className="text-xs text-slate-600 dark:text-slate-400 mb-5">
          Ajuda a ajustar a abordagem com profundo respeito e sem choques desnecessários.
        </p>

        <div className="flex flex-wrap gap-2 mb-6">
          {([
            { value: 'evangelico' as const, label: 'Evangélico(a)', emoji: '✝️' },
            { value: 'catolico' as const, label: 'Católico(a)', emoji: '⛪' },
            { value: 'outro' as const, label: 'Outra religião / Tradição', emoji: '🕊️' },
            { value: 'nenhum' as const, label: 'Sem religião / Não sei', emoji: '🌍' },
          ]).map((item) => (
            <button
              key={item.value}
              className={`chip py-3 px-4 ${profile.religion === item.value ? 'active' : ''}`}
              onClick={() => {
                onUpdate({ ...profile, religion: item.value });
                setSubStep(4);
              }}
            >
              <span className="text-lg">{item.emoji}</span>
              <span className="font-semibold text-xs md:text-sm">{item.label}</span>
            </button>
          ))}
        </div>

        <button className="btn-ghost text-xs text-slate-500" onClick={() => setSubStep(4)}>
          Pular →
        </button>
      </div>
    ),

    // 4: Nível de Rejeição e Postura
    () => (
      <div className="animate-slide-up" key="rejeicao">
        <div className="flex items-center justify-between mb-1">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#C52229]">POSIÇÃO POLÍTICA</p>
          <span className="text-xs text-slate-500 font-bold">5 de 5</span>
        </div>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-1">
          Qual a postura política dela hoje? 🗳️
        </h2>
        <p className="text-xs text-slate-600 dark:text-slate-400 mb-5">
          Define a estratégia: Rota A (Conversão com dados materiais) ou Rota B (Neutralização pacífica).
        </p>

        <div className="flex flex-col gap-2.5 mb-7">
          {rejectionLabels.map((item) => (
            <button
              key={item.level}
              className={`toggle-container ${profile.rejectionLevel === item.level ? 'active' : ''}`}
              onClick={() => onUpdate({ ...profile, rejectionLevel: item.level })}
            >
              <span className="text-2xl">{item.emoji}</span>
              <div className="text-left">
                <span className="text-xs md:text-sm font-bold block text-slate-900 dark:text-white">{item.short}</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">{item.label}</span>
              </div>
            </button>
          ))}
        </div>

        <button className="btn-pt w-full text-sm font-bold shadow-lg" onClick={onGenerate}>
          <span className="flex items-center justify-center gap-2">
            🎯 Gerar Estratégia de Diálogo & Oportunidades
          </span>
        </button>
      </div>
    ),
  ];

  return (
    <section className="min-h-[calc(100vh-80px)] flex flex-col px-4 py-6 max-w-xl mx-auto w-full">
      <button onClick={subStep === 0 ? onBack : () => setSubStep(s => s - 1)} className="btn-ghost self-start mb-3 -ml-2 text-xs">
        ← Voltar
      </button>

      {/* Mini Progresso dos 5 passos do perfil */}
      <div className="flex gap-1.5 mb-6">
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-1.5 flex-1 rounded-full transition-all duration-300"
            style={{
              background: i <= subStep ? '#C52229' : 'var(--border)',
            }}
          />
        ))}
      </div>

      {subSteps[subStep]?.()}
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════
// ETAPA 3 — RESULTS PANEL (ARSENAL, OPORTUNIDADES & DIRETRIZES)
// ═══════════════════════════════════════════════════════════════

function ResultsPanel({
  results,
  profile,
  canInstall,
  onInstall,
  onOpenCardGenerator,
  onOpenSimulator,
  onRestart,
}: {
  results: EngineResult;
  profile: UserProfile;
  canInstall?: boolean;
  onInstall?: () => void;
  onOpenCardGenerator: (arg: Argument) => void;
  onOpenSimulator: () => void;
  onRestart: () => void;
}) {
  const [expandedArg, setExpandedArg] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'roteiro' | 'oportunidades' | 'fatos' | 'compartilhar'>('roteiro');
  const [categoryFilter, setCategoryFilter] = useState<string>('todos');
  const [searchFilter, setSearchFilter] = useState<string>('');

  const handleCopy = useCallback(async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  }, []);

  const handleCopyShareLink = useCallback(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams();
    if (profile.state) params.set('state', profile.state);
    if (profile.city) params.set('city', profile.city);
    if (profile.rejectionLevel) params.set('level', String(profile.rejectionLevel));
    if (profile.occupation) params.set('occ', profile.occupation);
    const query = params.toString();
    const shareUrl = `${window.location.origin}${window.location.pathname}${query ? `?${query}` : ''}`;
    handleCopy(shareUrl, 'share-link');
  }, [profile, handleCopy]);

  const handleShareWhatsApp = useCallback((text: string) => {
    const encoded = encodeURIComponent(text);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
  }, []);

  const handleNativeShare = useCallback(async (title: string, text: string) => {
    if (navigator.share) {
      try {
        await navigator.share({ title, text });
      } catch {
        // Ignorar cancelamento
      }
    }
  }, []);

  const buildFullScript = useCallback(() => {
    const lines: string[] = [];
    const topArgs = results.arguments.slice(0, 5);

    lines.push('*⭐ Bora 13 — O Brasil que Dá Certo com Dados Reais*\n');

    if (results.acolhimento[0]) {
      lines.push(`💚 *Acolhimento:*\n"${results.acolhimento[0].text}"\n`);
    }

    topArgs.forEach((arg, i) => {
      lines.push(`${arg.emoji || '📌'} *${arg.headline}*`);
      lines.push(arg.scriptText);
      if (arg.sourceUrl && arg.sourceUrl !== '#') {
        lines.push(`📎 Fonte: ${arg.sourceName}`);
      }
      if (i < topArgs.length - 1) lines.push('');
    });

    lines.push('\n_Via Bora 13 • Conversas que importam • casa13.pt.org.br_');
    return lines.join('\n');
  }, [results]);

  const categories = [
    { id: 'todos', label: 'Todos' },
    { id: 'combustivel', label: '⛽ Combustível' },
    { id: 'tributacao', label: '🛒 Imposto Zero & IR' },
    { id: 'salario', label: '💵 Salário Mínimo' },
    { id: 'previdencia', label: '🧓 BPC & Aposentadoria' },
    { id: 'educacao', label: '🎒 Pé-de-Meia' },
    { id: 'saude', label: '🏥 SUS & Remédios' },
    { id: 'credito', label: '💳 Desenrola' },
    { id: 'seguranca', label: '🛡️ Segurança' },
    { id: 'agro', label: '🌾 Plano Safra' },
    { id: 'alimentacao', label: '🥩 Alimentos' },
    { id: 'regional', label: '🗺️ Obras Locais' },
  ];

  const filteredArguments = useMemo(() => {
    return results.arguments.filter((arg) => {
      const matchesCategory =
        categoryFilter === 'todos' || arg.category === categoryFilter;
      const matchesSearch =
        !searchFilter ||
        arg.headline.toLowerCase().includes(searchFilter.toLowerCase()) ||
        arg.scriptText.toLowerCase().includes(searchFilter.toLowerCase()) ||
        arg.sourceName.toLowerCase().includes(searchFilter.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [results.arguments, categoryFilter, searchFilter]);

  const gatilhoArgs = filteredArguments.filter(a => a.stage === 'gatilho');
  const ponteArgs = filteredArguments.filter(a => a.stage === 'ponte');

  return (
    <section className="min-h-[calc(100vh-80px)] flex flex-col px-4 py-6 max-w-xl mx-auto w-full animate-fade-in">
      {/* Barra superior de ações */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={onRestart} className="btn-ghost -ml-2 text-xs">
          ← Novo diálogo
        </button>
        <span className={`badge ${results.primaryRoute === 'A' ? 'badge-route-a' : 'badge-route-b'}`}>
          {results.primaryRoute === 'A' ? '🎯 Rota A: Conversão com Fatos' : '🗳️ Rota B: Neutralização Pacífica'}
        </span>
      </div>

      {/* Cartão de Resumo do Perfil e Estratégia */}
      <div className="card-clean mb-4 shadow-sm border-l-4 border-l-[#C52229]">
        <div className="flex items-start gap-3">
          <span className="text-2xl">🎯</span>
          <div className="flex-1">
            <span className="text-[10px] font-bold text-[#C52229] uppercase tracking-wider block">
              Estratégia Recomendada
            </span>
            <p className="text-base font-black text-slate-900 dark:text-white">
              {profile.occupation || 'Trabalhador(a)'} {profile.city ? `• ${profile.city}` : ''} {profile.state ? `(${profile.state})` : ''}
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
              {results.profileLabel}
            </p>
          </div>
        </div>
      </div>

      {/* Banner de Treino no Simulador */}
      <button
        onClick={onOpenSimulator}
        className="mb-4 p-3.5 rounded-2xl border border-amber-300 dark:border-amber-700 bg-amber-50/80 dark:bg-amber-950/20 hover:bg-amber-100 dark:hover:bg-amber-950/40 text-left transition-all flex items-center justify-between shadow-sm group"
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">🥋</span>
          <div>
            <p className="text-xs font-bold text-amber-900 dark:text-amber-300">Quer treinar antes de falar?</p>
            <p className="text-[11px] text-slate-600 dark:text-slate-400">Pratique com respostas táticas e neurociência</p>
          </div>
        </div>
        <span className="text-amber-700 dark:text-amber-400 group-hover:translate-x-1 transition-transform font-bold text-xs">Treinar →</span>
      </button>

      {/* Abas de Navegação */}
      <div
        className="flex gap-1 p-1 rounded-2xl mb-4 bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-sm"
      >
        {([
          { key: 'roteiro' as const, label: '💬 Roteiro' },
          { key: 'oportunidades' as const, label: '🚀 Direitos' },
          { key: 'fatos' as const, label: '📊 Fatos' },
          { key: 'compartilhar' as const, label: '📤 Compartilhar' },
        ]).map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 py-2 px-1 rounded-xl text-xs font-bold transition-all duration-200 ${
              activeTab === tab.key
                ? 'bg-[#C52229] text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Filtros para Roteiro e Fatos */}
      {(activeTab === 'roteiro' || activeTab === 'fatos') && (
        <div className="mb-4 flex flex-col gap-2">
          <input
            type="text"
            placeholder="🔍 Filtrar por tema (gasolina, bpc, alimentos, obras...)"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="input-field text-xs py-2 px-3"
          />

          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategoryFilter(cat.id)}
                className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  categoryFilter === cat.id
                    ? 'bg-[#C52229] text-white shadow-sm'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-slate-300'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ABA 1: ROTEIRO TÁTICO */}
      {activeTab === 'roteiro' && (
        <div className="flex flex-col gap-5 animate-fade-in">
          {/* Etapa 1: Acolhimento */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider mb-2 flex items-center justify-between text-emerald-700 dark:text-emerald-400">
              <span>💚 Etapa 1 — Acolhimento Sem Julgamento</span>
              <span className="text-[10px] text-slate-500 font-normal">Valide a emoção primeiro</span>
            </h3>
            <div className="flex flex-col gap-2.5">
              {results.acolhimento.slice(0, 2).map((script) => (
                <div key={script.id} className="card-hope">
                  <p className="text-xs md:text-sm leading-relaxed mb-3 font-medium">
                    &ldquo;{script.text}&rdquo;
                  </p>
                  <div className="flex items-center justify-between pt-2 border-t border-emerald-200 dark:border-emerald-800/40">
                    <AudioPlayerButton text={script.text} />
                    <div className="flex gap-2">
                      <button
                        className="btn-ghost text-xs font-semibold"
                        onClick={() => handleCopy(script.text, script.id)}
                      >
                        {copiedId === script.id ? '✅ Copiado!' : '📋 Copiar'}
                      </button>
                      <button
                        className="btn-ghost text-xs font-semibold"
                        onClick={() => handleShareWhatsApp(script.text)}
                      >
                        📱 Zap
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Etapa 2: Gatilhos Materiais */}
          {gatilhoArgs.length > 0 && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider mb-2 flex items-center justify-between text-amber-800 dark:text-amber-400">
                <span>⚡ Etapa 2 — Gatilhos de Alerta e Dados Materiais</span>
                <span className="text-[10px] text-slate-500 font-normal">Foco no bolso e no prato</span>
              </h3>
              <div className="flex flex-col gap-3">
                {gatilhoArgs.map((arg) => (
                  <div key={arg.id} className="card-clean">
                    <div className="flex items-start gap-3 mb-2.5">
                      <span className="text-2xl">{arg.emoji}</span>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-slate-900 dark:text-white mb-0.5">
                          {arg.headline}
                        </p>
                        {arg.sourceUrl !== '#' && (
                          <span className="seal-verified">Fato Verificado Oficial</span>
                        )}
                      </div>
                    </div>

                    <div className="chat-bubble mb-3">
                      <p className="text-xs md:text-sm">{arg.scriptText.substring(0, 140)}...</p>
                    </div>

                    <div className="flex items-center justify-between mb-2">
                      <AudioPlayerButton text={arg.scriptText} />
                      <button
                        className="btn-ghost text-xs text-[#C52229] font-bold"
                        onClick={() => onOpenCardGenerator(arg)}
                      >
                        🎨 Gerar Card Visual
                      </button>
                    </div>

                    {/* Acordeão com contra-argumento */}
                    <button
                      className="accordion-trigger"
                      aria-expanded={expandedArg === arg.id}
                      onClick={() => setExpandedArg(expandedArg === arg.id ? null : arg.id)}
                    >
                      <span className="text-xs md:text-sm font-semibold">Ver resposta completa e como retrucar</span>
                      <span className="arrow font-bold">▼</span>
                    </button>
                    <div className={`accordion-content ${expandedArg === arg.id ? 'open' : ''}`}>
                      <div className="p-3.5 mt-2 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                        <p className="text-xs md:text-sm leading-relaxed mb-3 text-slate-800 dark:text-slate-200">
                          {arg.scriptText}
                        </p>

                        {arg.counterArgument && (
                          <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                            <p className="text-xs font-bold uppercase mb-1 text-rose-700 dark:text-rose-400">
                              🤔 Se ele(a) retrucar:
                            </p>
                            <p className="text-xs italic mb-2.5 text-slate-600 dark:text-slate-400">
                              &ldquo;{arg.counterArgument}&rdquo;
                            </p>
                            <p className="text-xs font-bold uppercase mb-1 text-emerald-700 dark:text-emerald-400">
                              ✅ Resposta tática sugerida:
                            </p>
                            <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed">
                              {arg.rebuttal}
                            </p>
                          </div>
                        )}

                        <div className="mt-3 pt-2.5 flex items-center justify-between border-t border-slate-200 dark:border-slate-700">
                          <span className="text-[11px] text-slate-500">
                            📎 {arg.sourceName}
                          </span>
                          <div className="flex gap-2">
                            <button
                              className="btn-ghost text-xs"
                              onClick={() => handleCopy(arg.scriptText, arg.id)}
                            >
                              {copiedId === arg.id ? '✅' : '📋'} Copiar
                            </button>
                            <button
                              className="btn-ghost text-xs"
                              onClick={() => handleShareWhatsApp(
                                `${arg.emoji} *${arg.headline}*\n\n${arg.scriptText}\n\n📎 Fonte: ${arg.sourceName}\n\n_Via Bora 13_`
                              )}
                            >
                              📱 Zap
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Etapa 3: Ponte de Decisão */}
          {ponteArgs.length > 0 && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider mb-2 flex items-center justify-between text-[#C52229]">
                <span>{results.primaryRoute === 'A' ? '🌉 Etapa 3 — Ponte de Decisão' : '🗳️ Etapa 3 — Neutralização do Voto'}</span>
                <span className="text-[10px] text-slate-500 font-normal">Conclusão pacífica</span>
              </h3>
              <div className="flex flex-col gap-2.5">
                {ponteArgs.map((arg) => (
                  <div key={arg.id} className="card-clean border-l-4 border-l-[#C52229]">
                    <div className="flex items-start gap-3 mb-2.5">
                      <span className="text-2xl">{arg.emoji}</span>
                      <div className="flex-1">
                        <p className="text-sm font-bold mb-1 text-slate-900 dark:text-white">
                          {arg.headline}
                        </p>
                        <p className="text-xs md:text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                          {arg.scriptText}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                      <AudioPlayerButton text={arg.scriptText} />
                      <div className="flex gap-2">
                        <button
                          className="btn-ghost text-xs text-[#C52229] font-bold"
                          onClick={() => onOpenCardGenerator(arg)}
                        >
                          🎨 Card
                        </button>
                        <button
                          className="btn-ghost text-xs"
                          onClick={() => handleCopy(arg.scriptText, arg.id)}
                        >
                          {copiedId === arg.id ? '✅' : '📋'} Copiar
                        </button>
                        <button
                          className="btn-ghost text-xs"
                          onClick={() => handleShareWhatsApp(
                            `${arg.emoji} *${arg.headline}*\n\n${arg.scriptText}\n\n_Via Bora 13_`
                          )}
                        >
                          📱 Zap
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ABA 2: OPORTUNIDADES & DIREITOS */}
      {activeTab === 'oportunidades' && (
        <div className="flex flex-col gap-4 animate-fade-in">
          <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 p-3.5 rounded-2xl">
            <p className="text-xs font-bold text-amber-900 dark:text-amber-300 mb-1">
              🚀 O que a pessoa ou a família dela pode acessar hoje:
            </p>
            <p className="text-[11px] text-slate-600 dark:text-slate-400">
              Direitos garantidos e programas em vigor para transformar a conversa em benefício real no bolso.
            </p>
          </div>

          {results.opportunities.map((opp) => (
            <div key={opp.id} className="card-opportunity">
              <div className="flex items-start gap-3 mb-2.5">
                <span className="text-3xl">{opp.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="badge-casa13">{opp.badge}</span>
                  </div>
                  <h4 className="text-sm md:text-base font-black text-slate-900 dark:text-white">
                    {opp.headline}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                    {opp.description}
                  </p>
                </div>
              </div>

              {/* Elegibilidade e Como Acessar */}
              <div className="bg-slate-50 dark:bg-slate-800/80 rounded-xl p-3 border border-slate-200 dark:border-slate-700 text-xs mb-3 space-y-2">
                <div>
                  <span className="font-bold text-amber-700 dark:text-amber-400">🎯 Quem tem direito: </span>
                  <span className="text-slate-700 dark:text-slate-300">{opp.whoIsEligible}</span>
                </div>
                <div>
                  <span className="font-bold text-emerald-700 dark:text-emerald-400">👉 O que fazer: </span>
                  <span className="text-slate-700 dark:text-slate-300">{opp.howToAccess}</span>
                </div>
              </div>

              {/* Ações */}
              <div className="flex items-center justify-between pt-1">
                <a
                  href={opp.actionUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-[#C52229] hover:underline"
                >
                  🔗 {opp.actionLabel}
                </a>

                <button
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm"
                  onClick={() => handleShareWhatsApp(
                    `*${opp.icon} ${opp.title}*\n\n${opp.headline}\n\n🎯 *Quem tem direito:* ${opp.whoIsEligible}\n\n👉 *Como acessar:* ${opp.howToAccess}\n\n🔗 ${opp.actionUrl}\n\n_Via Bora 13 • casa13.pt.org.br_`
                  )}
                >
                  <span>📲</span>
                  <span>Mandar no Zap</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ABA 3: BANCO DE FATOS AUDITADOS */}
      {activeTab === 'fatos' && (
        <div className="flex flex-col gap-3 animate-fade-in">
          <p className="text-xs mb-1 text-slate-500">
            Fatos auditados e verificados de institutos oficiais (IBGE, DIEESE, ANP, IPEA, BC).
          </p>

          {filteredArguments.map((arg) => (
            <div key={arg.id} className="card-clean">
              <div className="flex items-start gap-3">
                <span className="text-2xl">{arg.emoji}</span>
                <div className="flex-1">
                  <p className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                    {arg.headline}
                  </p>
                  <p className="text-xs md:text-sm mb-3 leading-relaxed text-slate-700 dark:text-slate-300">
                    {arg.scriptText}
                  </p>
                  <div className="flex items-center justify-between flex-wrap gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <span className="seal-verified">Fato Verificado</span>
                      <a
                        href={arg.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs underline text-[#C52229] font-semibold"
                      >
                        📎 {arg.sourceName}
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <AudioPlayerButton text={arg.scriptText} />
                      <button
                        className="btn-ghost text-xs text-[#C52229] font-bold"
                        onClick={() => onOpenCardGenerator(arg)}
                      >
                        🎨 Gerar Card
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ABA 4: COMPARTILHAR & MOBILIZAR */}
      {activeTab === 'compartilhar' && (
        <div className="flex flex-col gap-4 animate-fade-in">
          <p className="text-xs md:text-sm mb-1 text-slate-600 dark:text-slate-400">
            Compartilhe o roteiro completo ou crie cards visuais com a identidade oficial da Casa 13.
          </p>

          {/* Destaque do Gerador de Cards */}
          <button
            onClick={() => onOpenCardGenerator(results.arguments[0])}
            className="p-4 rounded-3xl border border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-950/20 hover:border-[#C52229] transition-all text-left flex items-center justify-between group shadow-sm"
          >
            <div className="flex items-center gap-3">
              <span className="text-3xl">🎨</span>
              <div>
                <p className="text-sm font-bold text-[#C52229] dark:text-red-300">Gerador de Card Visual Casa 13</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Exporte imagem em 1:1 (Feed/Zap) ou 9:16 (Stories)</p>
              </div>
            </div>
            <span className="text-[#C52229] dark:text-red-300 group-hover:translate-x-1 transition-transform font-bold">Abrir →</span>
          </button>

          {/* Prévia do Script de Texto */}
          <div className="card-clean max-h-56 overflow-auto">
            <p className="text-xs font-mono whitespace-pre-wrap leading-relaxed text-slate-700 dark:text-slate-300">
              {buildFullScript()}
            </p>
          </div>

          {/* Ações de Compartilhamento */}
          <button
            className="btn-pt w-full shadow-md"
            style={{ background: '#25D366' }}
            onClick={() => handleShareWhatsApp(buildFullScript())}
          >
            <span className="flex items-center justify-center gap-2 font-bold">
              📱 Enviar Roteiro Completo no WhatsApp
            </span>
          </button>

          <button
            className="btn-secondary w-full"
            onClick={() => handleCopy(buildFullScript(), 'full-script')}
          >
            <span className="flex items-center justify-center gap-2">
              {copiedId === 'full-script' ? '✅ Copiado com Sucesso!' : '📋 Copiar Texto Completo'}
            </span>
          </button>

          <button
            className="btn-secondary w-full"
            onClick={handleCopyShareLink}
          >
            <span className="flex items-center justify-center gap-2">
              {copiedId === 'share-link' ? '✅ Link Desta Estratégia Copiado!' : '🔗 Copiar Link Desta Estratégia'}
            </span>
          </button>

          {typeof navigator !== 'undefined' && 'share' in navigator && (
            <button
              className="btn-secondary w-full"
              onClick={() => handleNativeShare('Bora 13 — Conversas que Importam', buildFullScript())}
            >
              <span className="flex items-center justify-center gap-2">
                📤 Compartilhar (Menu Nativo do Celular)
              </span>
            </button>
          )}

          <button
            className="btn-secondary w-full"
            onClick={onOpenSimulator}
          >
            <span>🥋</span>
            <span>Treinar no Simulador de Diálogo</span>
          </button>

          {canInstall && onInstall && (
            <button
              className="py-3 px-4 rounded-xl text-xs font-bold border border-red-300 dark:border-red-800/60 bg-red-50 dark:bg-red-950/20 text-[#C52229] dark:text-red-300 flex items-center justify-center gap-2 transition-all shadow-sm"
              onClick={onInstall}
            >
              <span>📲</span>
              <span>Instalar App no Celular (Funciona Offline)</span>
            </button>
          )}
        </div>
      )}

      {/* Rodapé Editorial */}
      <footer className="mt-10 pt-6 text-center border-t border-slate-200 dark:border-slate-800">
        <p className="text-xs text-slate-500 font-medium">
          ⭐ Casa 13 • QG da Esperança • Zero rastreamento. 100% anônimo.
        </p>
        <p className="text-xs mt-1 text-slate-400">
          Bora 13 — Conversas que importam. Dados que transformam.
        </p>
      </footer>
    </section>
  );
}
