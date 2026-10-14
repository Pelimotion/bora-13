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

// ═══════════════════════════════════════════════════════════════
// BORA APP — O QG do Diálogo e da Esperança
// Inspirado nas diretrizes oficiais da Casa 13 e comunicação popular
// ═══════════════════════════════════════════════════════════════

type AppStep = 'hero' | 'location' | 'profile' | 'results';

export default function BoraApp() {
  const [step, setStep] = useState<AppStep>('hero');
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

  // Modals state
  const [activeCardArg, setActiveCardArg] = useState<Argument | null>(null);
  const [showSimulator, setShowSimulator] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<any>(null);

  const goToStep = useCallback((nextStep: AppStep) => {
    setStep(nextStep);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleQuickMode = useCallback(() => {
    const quickResults = runQuickMode();
    setResults(quickResults);
    goToStep('results');
  }, [goToStep]);

  const handleGenerateResults = useCallback(() => {
    const engineResults = runEngine(profile);
    setResults(engineResults);
    goToStep('results');
  }, [profile, goToStep]);

  // Read URL query params on mount & listen for PWA install prompt
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // PWA install listener
    const installHandler = (e: any) => {
      e.preventDefault();
      setInstallPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', installHandler);

    // URL parameters for deep-linking
    const params = new URLSearchParams(window.location.search);
    if (params.get('mode') === 'quick') {
      const quickRes = runQuickMode();
      setResults(quickRes);
      setStep('results');
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
    <div className="min-h-screen flex flex-col">
      {/* Progress bar — visible on steps after hero */}
      {step !== 'hero' && step !== 'results' && (
        <div
          className="progress-bar fixed top-0 left-0 right-0 z-40 py-3 px-4"
          style={{ background: 'rgba(8, 12, 22, 0.94)', backdropFilter: 'blur(12px)' }}
        >
          <div className={`progress-segment ${step === 'location' || step === 'profile' ? 'active' : ''} ${step === 'profile' ? 'completed' : ''}`} />
          <div className={`progress-segment ${step === 'profile' ? 'active' : ''}`} />
          <div className="progress-segment" />
        </div>
      )}

      {/* Step Content */}
      {step === 'hero' && (
        <HeroSection
          onStart={() => goToStep('location')}
          onQuickMode={handleQuickMode}
          onOpenSimulator={() => setShowSimulator(true)}
          canInstall={!!installPrompt}
          onInstall={handleInstallApp}
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

      {/* Modals */}
      {showSimulator && <ConversationSimulator onClose={() => setShowSimulator(false)} />}
      {activeCardArg && (
        <VisualCardGenerator argument={activeCardArg} onClose={() => setActiveCardArg(null)} />
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// HERO SECTION — IDENTIDADE CASA 13 & UNIÃO
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
    <section className="min-h-screen flex flex-col items-center justify-center px-5 py-12 text-center animate-fade-in relative">
      {/* Casa 13 Header Pill */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 bg-red-950/40 border border-red-500/40 text-red-200 text-xs font-black tracking-wider uppercase animate-slide-up shadow-lg shadow-red-950/30">
        <span className="text-yellow-400">⭐</span>
        <span>Casa 13 • QG da Esperança & Diálogo</span>
      </div>

      {/* Brand Icon & Heading */}
      <div className="mb-7 animate-slide-up">
        <div
          className="inline-flex items-center justify-center w-24 h-24 rounded-3xl mb-5 shadow-2xl relative group"
          style={{
            background: 'linear-gradient(135deg, #C52229 0%, #991B1E 60%, #FFCC00 120%)',
            boxShadow: '0 0 50px rgba(197, 34, 41, 0.45)',
          }}
        >
          <span className="text-5xl select-none">🤝</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-3 text-slate-100">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-yellow-400 to-emerald-400">
            Bora Conversar
          </span>
        </h1>
        <p className="text-xl md:text-2xl font-bold max-w-lg mx-auto text-slate-200">
          O Brasil que dá certo com dados reais.<br />
          <span className="text-slate-400 font-medium text-lg">Argumentos, fatos e oportunidades que mudam vidas.</span>
        </p>
      </div>

      {/* Value proposition */}
      <p
        className="text-sm md:text-base max-w-md mx-auto mb-8 leading-relaxed animate-slide-up stagger-1 text-slate-300"
      >
        Conecte dados oficiais do IBGE, DIEESE e ministérios à realidade da sua cidade e da profissão de quem você quer conversar. Sem briga, com acolhimento e fatos inquestionáveis.
      </p>

      {/* CTAs */}
      <div className="flex flex-col gap-3 w-full max-w-sm animate-slide-up stagger-2">
        <button className="btn-pt text-base md:text-lg" onClick={onStart}>
          <span className="flex items-center justify-center gap-2">
            🚀 Começar Diálogo Personalizado
          </span>
        </button>

        <button className="btn-secondary" onClick={onQuickMode}>
          <span className="flex items-center justify-center gap-2">
            ⚡ Argumento Rápido — Qualquer Perfil
          </span>
        </button>

        <button
          className="py-3 px-4 rounded-xl text-sm font-semibold transition-all border border-slate-700/80 bg-slate-800/40 hover:bg-slate-800 hover:border-yellow-500/50 text-slate-200 flex items-center justify-center gap-2"
          onClick={onOpenSimulator}
        >
          <span>🥋</span>
          <span>Treinar Diálogo (Simulador Interativo)</span>
        </button>

        {canInstall && onInstall && (
          <button
            className="py-3 px-4 rounded-xl text-sm font-bold transition-all border border-red-500/50 bg-red-950/20 hover:bg-red-950/40 text-red-300 flex items-center justify-center gap-2 animate-pulse"
            onClick={onInstall}
          >
            <span>📲</span>
            <span>Instalar App no Celular (Funciona 100% Offline)</span>
          </button>
        )}
      </div>

      {/* Trust badges */}
      <div className="flex flex-wrap justify-center gap-2.5 mt-9 animate-slide-up stagger-3">
        {[
          { icon: '🔒', text: 'Sem cadastro / Anônimo' },
          { icon: '📊', text: 'Fontes Oficiais Verificadas' },
          { icon: '🎨', text: 'Cards Oficiais Casa 13' },
          { icon: '🚀', text: 'Benefícios & Oportunidades' },
        ].map((badge) => (
          <div
            key={badge.text}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 text-slate-400 text-xs font-medium"
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
// LOCATION STEP — ESTADO & CIDADE COM MAPA ANIMADO
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
      city: st.capital, // default city is the capital
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
    <section className="min-h-screen flex flex-col px-4 py-16 max-w-lg mx-auto w-full animate-slide-up">
      {/* Top Navigation */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={onBack} className="btn-ghost -ml-3">
          ← Voltar
        </button>
        <span className="badge-casa13">Etapa 1 de 2 • Localização</span>
      </div>

      <div className="mb-4">
        <h2 className="text-2xl md:text-3xl font-black text-slate-100 mb-1">
          De onde é a pessoa? 📍
        </h2>
        <p className="text-xs md:text-sm text-slate-400">
          Selecione o Estado e a Cidade para ativarmos investimentos e dados locais da região.
        </p>
      </div>

      {/* View Switcher: Mapa vs Lista */}
      <div className="flex gap-2 bg-[#0E1626] p-1 rounded-xl border border-slate-800 mb-4">
        <button
          onClick={() => setViewMode('map')}
          className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            viewMode === 'map'
              ? 'bg-[#C52229] text-white shadow-md shadow-red-950/60'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <span>🗺️</span>
          <span>Mapa Interativo</span>
        </button>
        <button
          onClick={() => setViewMode('list')}
          className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            viewMode === 'list'
              ? 'bg-[#C52229] text-white shadow-md shadow-red-950/60'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <span>📋</span>
          <span>Lista de Estados</span>
        </button>
      </div>

      {/* Map View */}
      {viewMode === 'map' && (
        <div className="mb-4 animate-fade-in flex flex-col items-center">
          <BrazilMap
            selectedState={profile.state}
            onSelectState={handleSelectStateGeo}
          />
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div className="mb-4 animate-fade-in">
          <input
            type="text"
            className="input-field text-xs mb-3"
            placeholder="Buscar estado por nome ou UF..."
            value={stateSearch}
            onChange={(e) => setStateSearch(e.target.value)}
          />
          <div className="grid grid-cols-2 gap-2 max-h-[36vh] overflow-y-auto pr-1">
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

      {/* City Selector Accordion/Box (appears when state is chosen) */}
      {currentState && (
        <div className="p-4 rounded-2xl bg-[#0E1626] border border-yellow-500/30 mb-6 animate-slide-up shadow-xl">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-xl">📍</span>
              <div>
                <span className="text-xs font-bold text-yellow-400 uppercase tracking-wider">
                  Estado Selecionado
                </span>
                <p className="text-sm font-black text-slate-100">
                  {currentState.name} ({currentState.uf})
                </p>
              </div>
            </div>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
              {currentState.region}
            </span>
          </div>

          <p className="text-xs text-slate-400 mb-3">
            Selecione a cidade principal ou digite o nome do município:
          </p>

          {/* Quick Major Cities Chips */}
          <div className="flex flex-wrap gap-1.5 mb-3 max-h-24 overflow-y-auto">
            {currentState.majorCities.map((city) => (
              <button
                key={city}
                onClick={() => onUpdate({ ...profile, city })}
                className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${
                  profile.city === city
                    ? 'bg-yellow-500 text-slate-950 font-bold shadow-md shadow-yellow-500/20'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {city === currentState.capital ? `⭐ ${city}` : city}
              </button>
            ))}
          </div>

          {/* City write-in */}
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
                className="px-3 py-2 bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-bold text-xs rounded-xl"
              >
                Usar
              </button>
            )}
          </div>

          {profile.city && (
            <p className="text-xs text-emerald-400 mt-2 font-medium">
              ✓ Cidade definida: <strong>{profile.city}</strong>
            </p>
          )}

          {/* Advance button */}
          <button
            onClick={onNext}
            className="btn-pt w-full mt-4 text-sm font-bold shadow-lg"
          >
            <span>Confirmar Localização & Avançar</span>
            <span>→</span>
          </button>
        </div>
      )}

      {/* Skip */}
      <button className="btn-ghost mt-auto self-center text-xs" onClick={onSkip}>
        Pular localização e usar média nacional →
      </button>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════
// PROFILE STEP — PROFISSÕES AMPLAS + SUGESTÃO + CONDICIONANTES
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
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');

  const occupationResults = useMemo(() => searchOccupations(occQuery, 12), [occQuery]);

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
    { level: 1, emoji: '💚', label: 'Frustrado(a), mas já votou no Lula', short: 'Aberto' },
    { level: 2, emoji: '🤔', label: 'Indeciso(a) / Desiludido com política', short: 'Indeciso' },
    { level: 3, emoji: '😤', label: 'Vota na oposição por rejeição', short: 'Rejeição' },
    { level: 4, emoji: '🔴', label: 'Oposição convicta / Radical', short: 'Convicto' },
  ];

  const subSteps = [
    // Sub-step 0: Ocupação (Ampla + Sugestão Inteligente)
    () => (
      <div className="animate-slide-up" key="occupation">
        <div className="flex items-center justify-between mb-1">
          <p className="text-xs font-bold uppercase tracking-wider text-yellow-400">ETAPA 2 DE 2 • PERFIL</p>
          <span className="text-xs text-slate-400">1 de 5</span>
        </div>
        <h2 className="text-2xl font-black text-slate-100 mb-1">
          Qual a profissão da pessoa? 💼
        </h2>
        <p className="text-xs text-slate-400 mb-4">
          Com mais de 70 categorias mapeadas. Você pode buscar ou digitar qualquer ocupação.
        </p>

        {/* Search input with live suggestion */}
        <div className="relative mb-3">
          <input
            type="text"
            className="input-field text-sm pr-10"
            placeholder="Ex: Uber, enfermeira, pedreiro, manicure, comerciante..."
            value={occQuery}
            onChange={(e) => setOccQuery(e.target.value)}
            autoComplete="off"
          />
          {occQuery && (
            <button
              onClick={() => setOccQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 text-xs font-bold"
            >
              ✕
            </button>
          )}
        </div>

        {/* Option to submit Custom Job if typed */}
        {occQuery.trim().length > 1 && (
          <button
            onClick={() => handleCustomOccupation(occQuery)}
            className="w-full mb-3 p-3 rounded-xl border border-yellow-500/40 bg-yellow-950/20 hover:bg-yellow-950/40 text-left transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-2.5">
              <span className="text-xl">➕</span>
              <div>
                <p className="text-xs font-bold text-yellow-300">
                  Definir: &ldquo;{occQuery}&rdquo;
                </p>
                <p className="text-[11px] text-slate-400">
                  Mapear automaticamente os dados econômicos desta ocupação
                </p>
              </div>
            </div>
            <span className="text-yellow-400 group-hover:translate-x-1 transition-transform">→</span>
          </button>
        )}

        {/* Grid of matched/suggested professions */}
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

        <button className="btn-ghost text-xs" onClick={() => setSubStep(1)}>
          Não sei a ocupação / Pular esta pergunta →
        </button>
      </div>
    ),

    // Sub-step 1: Vínculo
    () => (
      <div className="animate-slide-up" key="vinculo">
        <div className="flex items-center justify-between mb-1">
          <p className="text-xs font-bold uppercase tracking-wider text-yellow-400">VÍNCULO DE TRABALHO</p>
          <span className="text-xs text-slate-400">2 de 5</span>
        </div>
        <h2 className="text-2xl font-black text-slate-100 mb-1">
          Como ela trabalha no dia a dia? 📋
        </h2>
        <p className="text-xs text-slate-400 mb-6">
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
              className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                profile.profileTags.includes(item.tag)
                  ? 'bg-red-950/30 border-red-500/60 text-white'
                  : 'bg-slate-800/50 border-slate-800 text-slate-300 hover:bg-slate-800'
              }`}
              onClick={() => {
                addTag(item.tag);
                setSubStep(2);
              }}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{item.emoji}</span>
                <div>
                  <p className="text-xs md:text-sm font-bold text-slate-100">{item.label}</p>
                  <p className="text-[11px] text-slate-400">{item.desc}</p>
                </div>
              </div>
              <span className="text-slate-500">→</span>
            </button>
          ))}
        </div>

        <button className="btn-ghost text-xs" onClick={() => setSubStep(2)}>
          Pular →
        </button>
      </div>
    ),

    // Sub-step 2: Família & Benefícios
    () => (
      <div className="animate-slide-up" key="familia">
        <div className="flex items-center justify-between mb-1">
          <p className="text-xs font-bold uppercase tracking-wider text-yellow-400">REALIDADE FAMILIAR</p>
          <span className="text-xs text-slate-400">3 de 5</span>
        </div>
        <h2 className="text-2xl font-black text-slate-100 mb-1">
          Sobre a família e o dia a dia 👨‍👩‍👧‍👦
        </h2>
        <p className="text-xs text-slate-400 mb-6">
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
              <span className="text-xs md:text-sm font-medium text-slate-100">{item.label}</span>
            </button>
          ))}
        </div>

        <button className="btn-pt w-full text-xs md:text-sm font-bold" onClick={() => setSubStep(3)}>
          Continuar →
        </button>
      </div>
    ),

    // Sub-step 3: Religião
    () => (
      <div className="animate-slide-up" key="religiao">
        <div className="flex items-center justify-between mb-1">
          <p className="text-xs font-bold uppercase tracking-wider text-yellow-400">VALORES E RESPEITO</p>
          <span className="text-xs text-slate-400">4 de 5</span>
        </div>
        <h2 className="text-2xl font-black text-slate-100 mb-1">
          Religião ou valores de fé 🙏
        </h2>
        <p className="text-xs text-slate-400 mb-6">
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

        <button className="btn-ghost text-xs" onClick={() => setSubStep(4)}>
          Pular →
        </button>
      </div>
    ),

    // Sub-step 4: Nível de Rejeição
    () => (
      <div className="animate-slide-up" key="rejeicao">
        <div className="flex items-center justify-between mb-1">
          <p className="text-xs font-bold uppercase tracking-wider text-yellow-400">POSIÇÃO POLÍTICA</p>
          <span className="text-xs text-slate-400">5 de 5</span>
        </div>
        <h2 className="text-2xl font-black text-slate-100 mb-1">
          Qual a postura política dela hoje? 🗳️
        </h2>
        <p className="text-xs text-slate-400 mb-6">
          Define a estratégia: Rota A (Conversão com dados materiais) ou Rota B (Neutralização pacífica).
        </p>

        <div className="flex flex-col gap-2.5 mb-8">
          {rejectionLabels.map((item) => (
            <button
              key={item.level}
              className={`toggle-container ${profile.rejectionLevel === item.level ? 'active' : ''}`}
              onClick={() => onUpdate({ ...profile, rejectionLevel: item.level })}
              style={profile.rejectionLevel === item.level ? {
                borderColor: item.level <= 2 ? '#C52229' : item.level === 3 ? '#F59E0B' : '#EF4444',
                background: item.level <= 2 ? 'rgba(197, 34, 41, 0.22)' : item.level === 3 ? 'rgba(245, 158, 11, 0.18)' : 'rgba(239, 68, 68, 0.18)',
              } : {}}
            >
              <span className="text-2xl">{item.emoji}</span>
              <div className="text-left">
                <span className="text-xs md:text-sm font-bold block text-slate-100">{item.short}</span>
                <span className="text-[11px] text-slate-400">{item.label}</span>
              </div>
            </button>
          ))}
        </div>

        <button className="btn-pt w-full text-base font-bold shadow-xl" onClick={onGenerate}>
          <span className="flex items-center justify-center gap-2">
            🎯 Gerar Estratégia & Oportunidades
          </span>
        </button>
      </div>
    ),
  ];

  return (
    <section className="min-h-screen flex flex-col px-5 py-16 max-w-lg mx-auto w-full">
      <button onClick={subStep === 0 ? onBack : () => setSubStep(s => s - 1)} className="btn-ghost self-start mb-4 -ml-3 text-xs">
        ← Voltar
      </button>

      {/* Mini Progress */}
      <div className="flex gap-1.5 mb-6">
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-1.5 flex-1 rounded-full transition-all duration-300"
            style={{
              background: i <= subStep ? '#C52229' : 'rgba(148, 163, 184, 0.15)',
              boxShadow: i === subStep ? '0 0 10px rgba(197, 34, 41, 0.5)' : 'none',
            }}
          />
        ))}
      </div>

      {subSteps[subStep]?.()}
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════
// RESULTS PANEL — O ARSENAL, OPORTUNIDADES & DIRETRIZES CASA 13
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
      // Fallback
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
        // User cancelled
      }
    }
  }, []);

  // Build the full script text for copy/share
  const buildFullScript = useCallback(() => {
    const lines: string[] = [];
    const topArgs = results.arguments.slice(0, 5);

    lines.push('*⭐ Bora 13 — O Brasil que Dá Certo com Dados Reais*\n');

    // Acolhimento
    if (results.acolhimento[0]) {
      lines.push(`💚 *Acolhimento:*\n"${results.acolhimento[0].text}"\n`);
    }

    // Top arguments
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

  // Categories list for pills
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

  // Filtered arguments
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
    <section className="min-h-screen flex flex-col px-4 py-8 max-w-lg mx-auto w-full animate-fade-in">
      {/* Header bar */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={onRestart} className="btn-ghost -ml-3 text-xs">
          ← Novo diálogo
        </button>
        <span className={`badge ${results.primaryRoute === 'A' ? 'badge-route-a' : 'badge-route-b'}`}>
          {results.primaryRoute === 'A' ? '🎯 Rota A: Conversão com Fatos' : '🗳️ Rota B: Neutralização Pacífica'}
        </span>
      </div>

      {/* Profile & Context summary */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-red-950/40 via-slate-900 to-slate-900 border border-red-500/30 mb-4 animate-slide-up shadow-lg">
        <div className="flex items-start gap-3">
          <span className="text-2xl">🎯</span>
          <div className="flex-1">
            <p className="text-xs font-bold text-yellow-400 uppercase tracking-wider mb-0.5">
              Estratégia Personalizada
            </p>
            <p className="text-sm font-black text-slate-100">
              {profile.occupation || 'Trabalhador(a)'} {profile.city ? `• ${profile.city}` : ''} {profile.state ? `(${profile.state})` : ''}
            </p>
            <p className="text-xs text-slate-400 mt-0.5">
              {results.profileLabel}
            </p>
          </div>
        </div>
      </div>

      {/* Simulator Quick Action Banner */}
      <button
        onClick={onOpenSimulator}
        className="mb-4 p-3.5 rounded-2xl border border-yellow-500/40 bg-gradient-to-r from-yellow-950/30 via-slate-900 to-slate-900 hover:border-yellow-400 text-left transition-all flex items-center justify-between group shadow-md"
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">🥋</span>
          <div>
            <p className="text-xs font-bold text-yellow-300">Treinar Diálogo no Simulador?</p>
            <p className="text-[11px] text-slate-400">Pratique com respostas táticas e neurociência</p>
          </div>
        </div>
        <span className="text-yellow-400 group-hover:translate-x-1 transition-transform font-bold">Treinar →</span>
      </button>

      {/* Tabs */}
      <div
        className="flex gap-1 p-1 rounded-xl mb-4"
        style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}
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
            className="flex-1 py-2.5 px-1.5 rounded-lg text-xs font-bold transition-all duration-200"
            style={{
              background: activeTab === tab.key ? '#C52229' : 'transparent',
              color: activeTab === tab.key ? '#FFFFFF' : 'var(--text-tertiary)',
              boxShadow: activeTab === tab.key ? '0 4px 15px rgba(197, 34, 41, 0.4)' : 'none',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Filters (Roteiro and Fatos) */}
      {(activeTab === 'roteiro' || activeTab === 'fatos') && (
        <div className="mb-4 flex flex-col gap-2">
          {/* Quick Search */}
          <input
            type="text"
            placeholder="🔍 Filtrar fatos (gasolina, bpc, alimentos, obras...)"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="input-field text-xs py-2 px-3 mb-1"
          />

          {/* Category Chips */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategoryFilter(cat.id)}
                className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                  categoryFilter === cat.id
                    ? 'bg-[#C52229] text-white shadow-sm'
                    : 'bg-slate-800/60 text-slate-400 border border-transparent hover:text-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* TAB 1: ROTEIRO TÁTICO */}
      {activeTab === 'roteiro' && (
        <div className="flex flex-col gap-5 animate-fade-in">
          {/* Acolhimento */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider mb-2.5 flex items-center justify-between text-emerald-400">
              <span>💚 Etapa 1 — Acolhimento Sem Julgamento</span>
              <span className="text-[10px] text-slate-400 font-normal">Valide a emoção primeiro</span>
            </h3>
            <div className="flex flex-col gap-2.5">
              {results.acolhimento.slice(0, 2).map((script) => (
                <div key={script.id} className="card-hope">
                  <p className="text-xs md:text-sm leading-relaxed mb-3 text-slate-100 font-medium">
                    &ldquo;{script.text}&rdquo;
                  </p>
                  <div className="flex items-center justify-between pt-2 border-t border-emerald-500/20">
                    <AudioPlayerButton text={script.text} />
                    <div className="flex gap-2">
                      <button
                        className="btn-ghost text-xs"
                        onClick={() => handleCopy(script.text, script.id)}
                      >
                        {copiedId === script.id ? '✅ Copiado!' : '📋 Copiar'}
                      </button>
                      <button
                        className="btn-ghost text-xs"
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

          {/* Gatilho */}
          {gatilhoArgs.length > 0 && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider mb-2.5 flex items-center justify-between text-amber-400">
                <span>⚡ Etapa 2 — Gatilhos de Alerta e Dados Materiais</span>
                <span className="text-[10px] text-slate-400 font-normal">Foco no bolso e no prato</span>
              </h3>
              <div className="flex flex-col gap-3">
                {gatilhoArgs.map((arg) => (
                  <div key={arg.id} className="card">
                    <div className="flex items-start gap-3 mb-2.5">
                      <span className="text-2xl">{arg.emoji}</span>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-slate-100 mb-0.5">
                          {arg.headline}
                        </p>
                        {arg.sourceUrl !== '#' && (
                          <span className="seal-verified">Fato Verificado Oficial</span>
                        )}
                      </div>
                    </div>

                    {/* Chat bubble simulation */}
                    <div className="chat-bubble user mb-3">
                      <p className="text-xs md:text-sm">{arg.scriptText.substring(0, 140)}...</p>
                    </div>

                    {/* Action row */}
                    <div className="flex items-center justify-between mb-2">
                      <AudioPlayerButton text={arg.scriptText} />
                      <button
                        className="btn-ghost text-xs text-yellow-400 hover:text-yellow-300 font-bold"
                        onClick={() => onOpenCardGenerator(arg)}
                      >
                        🎨 Gerar Card Visual
                      </button>
                    </div>

                    {/* Expandable Accordion */}
                    <button
                      className="accordion-trigger"
                      aria-expanded={expandedArg === arg.id}
                      onClick={() => setExpandedArg(expandedArg === arg.id ? null : arg.id)}
                    >
                      <span className="text-xs md:text-sm">Ver resposta e contra-argumentos</span>
                      <span className="arrow">▼</span>
                    </button>
                    <div className={`accordion-content ${expandedArg === arg.id ? 'open' : ''}`}>
                      <div className="p-3.5 mt-2 rounded-xl bg-slate-900 border border-slate-800">
                        <p className="text-xs md:text-sm leading-relaxed mb-3 text-slate-200">
                          {arg.scriptText}
                        </p>

                        {arg.counterArgument && (
                          <div className="mt-3 pt-3 border-t border-slate-800">
                            <p className="text-xs font-bold uppercase mb-1 text-rose-400">
                              🤔 Se ele(a) retrucar:
                            </p>
                            <p className="text-xs italic mb-2.5 text-slate-400">
                              &ldquo;{arg.counterArgument}&rdquo;
                            </p>
                            <p className="text-xs font-bold uppercase mb-1 text-emerald-400">
                              ✅ Resposta tática sugerida:
                            </p>
                            <p className="text-xs text-slate-300 leading-relaxed">
                              {arg.rebuttal}
                            </p>
                          </div>
                        )}

                        <div className="mt-3 pt-2.5 flex items-center justify-between border-t border-slate-800">
                          <span className="text-[11px] text-slate-400">
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

          {/* Ponte */}
          {ponteArgs.length > 0 && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider mb-2.5 flex items-center justify-between text-yellow-400">
                <span>{results.primaryRoute === 'A' ? '🌉 Etapa 3 — Ponte de Decisão' : '🗳️ Etapa 3 — Neutralização do Voto'}</span>
                <span className="text-[10px] text-slate-400 font-normal">Conclusão pacífica</span>
              </h3>
              <div className="flex flex-col gap-2.5">
                {ponteArgs.map((arg) => (
                  <div key={arg.id} className="card-accent">
                    <div className="flex items-start gap-3 mb-2.5">
                      <span className="text-2xl">{arg.emoji}</span>
                      <div className="flex-1">
                        <p className="text-sm font-bold mb-1 text-slate-100">
                          {arg.headline}
                        </p>
                        <p className="text-xs md:text-sm leading-relaxed text-slate-300">
                          {arg.scriptText}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-slate-700/40">
                      <AudioPlayerButton text={arg.scriptText} />
                      <div className="flex gap-2">
                        <button
                          className="btn-ghost text-xs text-yellow-400 font-semibold"
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

      {/* TAB 2: OPORTUNIDADES & DIREITOS REAIS */}
      {activeTab === 'oportunidades' && (
        <div className="flex flex-col gap-4 animate-fade-in">
          <div className="bg-yellow-950/20 border border-yellow-500/30 p-3.5 rounded-2xl">
            <p className="text-xs font-bold text-yellow-300 mb-1">
              🚀 O que a pessoa ou a família dela pode acessar hoje:
            </p>
            <p className="text-[11px] text-slate-400">
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
                  <h4 className="text-sm md:text-base font-black text-slate-100">
                    {opp.headline}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    {opp.description}
                  </p>
                </div>
              </div>

              {/* Who is eligible & How to access */}
              <div className="bg-slate-900/90 rounded-xl p-3 border border-slate-800 text-xs mb-3 space-y-2">
                <div>
                  <span className="font-bold text-yellow-400">🎯 Quem tem direito: </span>
                  <span className="text-slate-300">{opp.whoIsEligible}</span>
                </div>
                <div>
                  <span className="font-bold text-emerald-400">👉 O que fazer: </span>
                  <span className="text-slate-300">{opp.howToAccess}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-1">
                <a
                  href={opp.actionUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-yellow-400 hover:text-yellow-300 underline"
                >
                  🔗 {opp.actionLabel}
                </a>

                <button
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md"
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

      {/* TAB 3: FATOS & DADOS */}
      {activeTab === 'fatos' && (
        <div className="flex flex-col gap-3 animate-fade-in">
          <p className="text-xs mb-2 text-slate-400">
            Fatos auditados e verificados de institutos oficiais (IBGE, DIEESE, ANP, IPEA, BC).
          </p>

          {filteredArguments.map((arg) => (
            <div key={arg.id} className="card">
              <div className="flex items-start gap-3">
                <span className="text-2xl">{arg.emoji}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-bold text-slate-100">
                      {arg.headline}
                    </p>
                  </div>
                  <p className="text-xs md:text-sm mb-3 leading-relaxed text-slate-300">
                    {arg.scriptText}
                  </p>
                  <div className="flex items-center justify-between flex-wrap gap-2 pt-2 border-t border-slate-800">
                    <div className="flex items-center gap-2">
                      <span className="seal-verified">Fato Verificado</span>
                      <a
                        href={arg.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs underline text-yellow-400 hover:text-yellow-300"
                      >
                        📎 {arg.sourceName}
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <AudioPlayerButton text={arg.scriptText} />
                      <button
                        className="btn-ghost text-xs text-yellow-400 hover:text-yellow-300 font-bold"
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

      {/* TAB 4: COMPARTILHAR */}
      {activeTab === 'compartilhar' && (
        <div className="flex flex-col gap-4 animate-fade-in">
          <p className="text-xs md:text-sm mb-1 text-slate-300">
            Compartilhe o roteiro completo ou crie cards visuais com a identidade oficial da Casa 13.
          </p>

          {/* Card Generator Highlight CTA */}
          <button
            onClick={() => onOpenCardGenerator(results.arguments[0])}
            className="p-4 rounded-2xl border border-red-500/40 bg-gradient-to-r from-red-950/40 to-slate-900 hover:border-red-400 transition-all text-left flex items-center justify-between group shadow-xl"
          >
            <div className="flex items-center gap-3">
              <span className="text-3xl">🎨</span>
              <div>
                <p className="text-sm font-bold text-red-300">Gerador de Card Visual Casa 13</p>
                <p className="text-xs text-slate-400">Exporte imagem em 1:1 (Feed/Zap) ou 9:16 (Stories)</p>
              </div>
            </div>
            <span className="text-red-300 group-hover:translate-x-1 transition-transform font-bold">Abrir →</span>
          </button>

          {/* Script Preview */}
          <div className="card" style={{ maxHeight: '250px', overflow: 'auto' }}>
            <p className="text-xs font-mono whitespace-pre-wrap leading-relaxed text-slate-300">
              {buildFullScript()}
            </p>
          </div>

          {/* Action buttons */}
          <button
            className="btn-pt w-full shadow-lg"
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
            className="py-3 px-4 rounded-xl text-sm font-semibold transition-all border border-slate-700 bg-slate-800/40 hover:bg-slate-800 text-slate-300 flex items-center justify-center gap-2"
            onClick={onOpenSimulator}
          >
            <span>🥋</span>
            <span>Treinar no Simulador de Conversa</span>
          </button>

          {canInstall && onInstall && (
            <button
              className="py-3 px-4 rounded-xl text-sm font-bold transition-all border border-red-500/50 bg-red-950/20 hover:bg-red-950/40 text-red-300 flex items-center justify-center gap-2 animate-pulse"
              onClick={onInstall}
            >
              <span>📲</span>
              <span>Instalar App no Celular (Funciona Offline)</span>
            </button>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="mt-10 pt-6 text-center border-t border-slate-800">
        <p className="text-xs text-slate-400">
          ⭐ Casa 13 • QG da Esperança • Zero rastreamento. Sem cookies. 100% anônimo.
        </p>
        <p className="text-xs mt-1 text-slate-500">
          Bora 13 — Conversas que importam. Dados que transformam.
        </p>
      </div>
    </section>
  );
}
