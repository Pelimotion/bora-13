'use client';

import { useState, useCallback, useMemo } from 'react';
import { runEngine, runQuickMode, type UserProfile, type EngineResult } from '@/lib/engine';
import { searchOccupations, BRAZILIAN_STATES, type Occupation } from '@/data/occupations';
import type { Argument, ProfileTag } from '@/data/arguments';
import VisualCardGenerator from '@/components/VisualCardGenerator';
import ConversationSimulator from '@/components/ConversationSimulator';
import AudioPlayerButton from '@/components/AudioPlayerButton';

// ═══════════════════════════════════════════════════════════════
// BORA APP — Main Application Component
// Single-page wizard: Hero → Location → Profile → Results
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

  return (
    <div className="min-h-screen flex flex-col">
      {/* Progress bar — visible on steps after hero */}
      {step !== 'hero' && step !== 'results' && (
        <div
          className="progress-bar fixed top-0 left-0 right-0 z-40 py-3 px-4"
          style={{ background: 'rgba(8, 15, 26, 0.92)', backdropFilter: 'blur(10px)' }}
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
// HERO SECTION
// ═══════════════════════════════════════════════════════════════

function HeroSection({
  onStart,
  onQuickMode,
  onOpenSimulator,
}: {
  onStart: () => void;
  onQuickMode: () => void;
  onOpenSimulator: () => void;
}) {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-5 py-12 text-center animate-fade-in relative">
      {/* Brand Icon & Heading */}
      <div className="mb-8 animate-slide-up">
        <div
          className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-6 shadow-2xl relative group"
          style={{
            background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-dark) 100%)',
            boxShadow: '0 0 45px rgba(20, 184, 166, 0.35)',
          }}
        >
          <span className="text-4xl select-none">🤝</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-4" style={{ color: 'var(--text-primary)' }}>
          <span style={{ color: 'var(--accent-light)' }}>Bora</span>
        </h1>
        <p className="text-xl md:text-2xl font-medium max-w-lg mx-auto" style={{ color: 'var(--text-secondary)' }}>
          Conversas que importam.<br />
          <span style={{ color: 'var(--text-tertiary)' }}>Argumentos que funcionam.</span>
        </p>
      </div>

      {/* Value proposition */}
      <p
        className="text-base md:text-lg max-w-md mx-auto mb-9 leading-relaxed animate-slide-up stagger-1"
        style={{ color: 'var(--text-tertiary)' }}
      >
        Encontre argumentos baseados em dados oficiais para dialogar com qualquer pessoa sobre o futuro do Brasil, sem brigas e com respeito.
      </p>

      {/* CTAs */}
      <div className="flex flex-col gap-3.5 w-full max-w-sm animate-slide-up stagger-2">
        <button className="btn-primary text-lg glow-accent" onClick={onStart}>
          <span className="flex items-center justify-center gap-2">
            🚀 Bora Conversar
          </span>
        </button>

        <button className="btn-secondary" onClick={onQuickMode}>
          <span className="flex items-center justify-center gap-2">
            ⚡ Argumento Rápido — Qualquer Perfil
          </span>
        </button>

        <button
          className="py-3 px-4 rounded-xl text-sm font-semibold transition-all border border-slate-700/80 bg-slate-800/40 hover:bg-slate-800 hover:border-teal-500/50 text-slate-200 flex items-center justify-center gap-2"
          onClick={onOpenSimulator}
        >
          <span>🥋</span>
          <span>Treinar Diálogo (Simulador de Conversa)</span>
        </button>
      </div>

      {/* Trust badges */}
      <div className="flex flex-wrap justify-center gap-3 mt-10 animate-slide-up stagger-3">
        {[
          { icon: '🔒', text: 'Sem cadastro' },
          { icon: '✅', text: '100% dados oficiais' },
          { icon: '📱', text: 'Funciona offline' },
          { icon: '🎨', text: 'Cards para WhatsApp' },
        ].map((badge) => (
          <div
            key={badge.text}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full"
            style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}
          >
            <span className="text-sm">{badge.icon}</span>
            <span className="text-xs font-medium" style={{ color: 'var(--text-tertiary)' }}>{badge.text}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════
// LOCATION STEP
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
  const [searchQuery, setSearchQuery] = useState('');

  const filteredStates = useMemo(() => {
    if (!searchQuery) return BRAZILIAN_STATES;
    const q = searchQuery.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    return BRAZILIAN_STATES.filter(
      s => s.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes(q) ||
           s.uf.toLowerCase().includes(q) ||
           s.capital.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes(q)
    );
  }, [searchQuery]);

  return (
    <section className="min-h-screen flex flex-col px-5 py-20 max-w-lg mx-auto w-full animate-slide-up">
      <button onClick={onBack} className="btn-ghost self-start mb-6 -ml-3">
        ← Voltar
      </button>

      <div className="mb-6">
        <p className="text-sm font-semibold mb-2" style={{ color: 'var(--accent)' }}>ETAPA 1 DE 2</p>
        <h2 className="text-3xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
          De onde você é? 📍
        </h2>
        <p style={{ color: 'var(--text-secondary)' }}>
          Isso nos ajuda a trazer dados econômicos e notícias da sua região.
        </p>
      </div>

      {/* Search */}
      <input
        type="text"
        className="input-field mb-4"
        placeholder="Buscar estado..."
        value={searchQuery}
        onChange={e => setSearchQuery(e.target.value)}
        autoComplete="off"
      />

      {/* State grid */}
      <div className="grid grid-cols-2 gap-2 mb-6 max-h-[50vh] overflow-y-auto pr-1">
        {filteredStates.map((state) => (
          <button
            key={state.uf}
            className={`chip justify-center text-center ${profile.state === state.uf ? 'active' : ''}`}
            onClick={() => {
              onUpdate({ ...profile, state: state.uf, city: state.capital });
              onNext();
            }}
          >
            <span className="font-bold">{state.uf}</span>
            <span className="text-xs" style={{ color: profile.state === state.uf ? 'var(--accent-light)' : 'var(--text-tertiary)' }}>
              {state.name}
            </span>
          </button>
        ))}
      </div>

      {/* Skip */}
      <button className="btn-ghost mt-auto self-center" onClick={onSkip}>
        Pular esta etapa →
      </button>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════
// PROFILE STEP — Questionário progressivo
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

  const occupationResults = useMemo(() => searchOccupations(occQuery), [occQuery]);

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

  const rejectionLabels = [
    { level: 1, emoji: '💚', label: 'Frustrado, mas já votou em Lula', short: 'Aberto' },
    { level: 2, emoji: '🤔', label: 'Indeciso / Desiludido com todos', short: 'Indeciso' },
    { level: 3, emoji: '😤', label: 'Vota na oposição por rejeição', short: 'Rejeição' },
    { level: 4, emoji: '🔴', label: 'Oposição convicta / Radical', short: 'Convicto' },
  ];

  const subSteps = [
    // Sub-step 0: Ocupação
    () => (
      <div className="animate-slide-up" key="occupation">
        <p className="text-sm font-semibold mb-2" style={{ color: 'var(--accent)' }}>ETAPA 2 DE 2 — PERFIL</p>
        <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
          Qual a ocupação da pessoa? 💼
        </h2>
        <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
          A pessoa com quem você quer dialogar. Se não souber, pode pular.
        </p>

        <input
          type="text"
          className="input-field mb-4"
          placeholder="Ex: Uber, enfermeira, pedreiro, dona de casa..."
          value={occQuery}
          onChange={e => setOccQuery(e.target.value)}
          autoComplete="off"
        />

        <div className="flex flex-wrap gap-2 mb-6">
          {occupationResults.map((occ) => (
            <button
              key={occ.label}
              className={`chip ${profile.occupation === occ.label ? 'active' : ''}`}
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
              <span>{occ.label}</span>
            </button>
          ))}
        </div>

        <button className="btn-ghost" onClick={() => setSubStep(1)}>
          Não sei / Pular →
        </button>
      </div>
    ),

    // Sub-step 1: Vínculo
    () => (
      <div className="animate-slide-up" key="vinculo">
        <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
          Tipo de vínculo 📋
        </h2>
        <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
          Como essa pessoa trabalha? Selecione o que souber.
        </p>

        <div className="flex flex-wrap gap-2 mb-6">
          {([
            { tag: 'clt' as ProfileTag, label: 'CLT (Carteira assinada)', emoji: '📝' },
            { tag: 'pj' as ProfileTag, label: 'PJ / MEI', emoji: '🏢' },
            { tag: 'autonomo' as ProfileTag, label: 'Autônomo', emoji: '🔨' },
            { tag: 'desempregado' as ProfileTag, label: 'Desempregado(a)', emoji: '📋' },
            { tag: 'aposentado' as ProfileTag, label: 'Aposentado(a)', emoji: '🧓' },
            { tag: 'servidor_publico' as ProfileTag, label: 'Servidor(a) Público(a)', emoji: '🏛️' },
          ]).map((item) => (
            <button
              key={item.tag}
              className={`chip ${profile.profileTags.includes(item.tag) ? 'active' : ''}`}
              onClick={() => {
                addTag(item.tag);
                setSubStep(2);
              }}
            >
              <span>{item.emoji}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        <button className="btn-ghost" onClick={() => setSubStep(2)}>
          Não sei / Pular →
        </button>
      </div>
    ),

    // Sub-step 2: Família
    () => (
      <div className="animate-slide-up" key="familia">
        <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
          Sobre a família 👨‍👩‍👧‍👦
        </h2>
        <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
          Marque o que se aplica. Isso personaliza os argumentos materiais.
        </p>

        <div className="flex flex-col gap-3 mb-6">
          {([
            { flag: 'hasElderly' as const, label: 'Tem idoso ou aposentado na família', emoji: '👴' },
            { flag: 'hasChildren' as const, label: 'Tem filhos na escola ou creche', emoji: '👶' },
            { flag: 'dependsSUS' as const, label: 'Depende do SUS', emoji: '🏥' },
            { flag: 'receivesBenefit' as const, label: 'Recebe benefício (BPC, Bolsa Família)', emoji: '💳' },
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
              <span className="text-sm">{item.emoji}</span>
              <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{item.label}</span>
            </button>
          ))}
        </div>

        <button className="btn-ghost" onClick={() => setSubStep(3)}>
          Continuar →
        </button>
      </div>
    ),

    // Sub-step 3: Religião
    () => (
      <div className="animate-slide-up" key="religiao">
        <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
          Religião 🙏
        </h2>
        <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
          Ajuda a ajustar a abordagem com empatia e respeito aos valores.
        </p>

        <div className="flex flex-wrap gap-2 mb-6">
          {([
            { value: 'evangelico' as const, label: 'Evangélico(a)', emoji: '✝️' },
            { value: 'catolico' as const, label: 'Católico(a)', emoji: '⛪' },
            { value: 'outro' as const, label: 'Outra religião', emoji: '🕊️' },
            { value: 'nenhum' as const, label: 'Sem religião / Não sei', emoji: '🌍' },
          ]).map((item) => (
            <button
              key={item.value}
              className={`chip ${profile.religion === item.value ? 'active' : ''}`}
              onClick={() => {
                onUpdate({ ...profile, religion: item.value });
                setSubStep(4);
              }}
            >
              <span>{item.emoji}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        <button className="btn-ghost" onClick={() => setSubStep(4)}>
          Pular →
        </button>
      </div>
    ),

    // Sub-step 4: Nível de rejeição
    () => (
      <div className="animate-slide-up" key="rejeicao">
        <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
          Como essa pessoa se posiciona? 🗳️
        </h2>
        <p className="text-sm mb-8" style={{ color: 'var(--text-secondary)' }}>
          Isso define a estratégia tática: Conversão direta ou Neutralização inteligente.
        </p>

        <div className="flex flex-col gap-3 mb-8">
          {rejectionLabels.map((item) => (
            <button
              key={item.level}
              className={`toggle-container ${profile.rejectionLevel === item.level ? 'active' : ''}`}
              onClick={() => onUpdate({ ...profile, rejectionLevel: item.level })}
              style={profile.rejectionLevel === item.level ? {
                borderColor: item.level <= 2 ? 'var(--accent)' : item.level === 3 ? 'var(--accent-warm)' : 'var(--danger)',
                background: item.level <= 2 ? 'var(--accent-glow)' : item.level === 3 ? 'var(--accent-warm-glow)' : 'var(--danger-glow)',
              } : {}}
            >
              <span className="text-2xl">{item.emoji}</span>
              <div className="text-left">
                <span className="text-sm font-semibold block" style={{ color: 'var(--text-primary)' }}>{item.short}</span>
                <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{item.label}</span>
              </div>
            </button>
          ))}
        </div>

        <button className="btn-primary w-full glow-accent text-lg" onClick={onGenerate}>
          <span className="flex items-center justify-center gap-2">
            🎯 Gerar Arsenal Personalizado
          </span>
        </button>
      </div>
    ),
  ];

  return (
    <section className="min-h-screen flex flex-col px-5 py-20 max-w-lg mx-auto w-full">
      <button onClick={subStep === 0 ? onBack : () => setSubStep(s => s - 1)} className="btn-ghost self-start mb-6 -ml-3">
        ← Voltar
      </button>

      {/* Mini progress for sub-steps */}
      <div className="flex gap-1 mb-8">
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-1 flex-1 rounded-full transition-all duration-300"
            style={{
              background: i <= subStep ? 'var(--accent)' : 'var(--border)',
              boxShadow: i === subStep ? '0 0 8px var(--accent-glow)' : 'none',
            }}
          />
        ))}
      </div>

      {subSteps[subStep]?.()}
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════
// RESULTS PANEL — O Arsenal
// ═══════════════════════════════════════════════════════════════

function ResultsPanel({
  results,
  profile,
  onOpenCardGenerator,
  onOpenSimulator,
  onRestart,
}: {
  results: EngineResult;
  profile: UserProfile;
  onOpenCardGenerator: (arg: Argument) => void;
  onOpenSimulator: () => void;
  onRestart: () => void;
}) {
  const [expandedArg, setExpandedArg] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'roteiro' | 'fatos' | 'compartilhar'>('roteiro');
  const [categoryFilter, setCategoryFilter] = useState<string>('todos');
  const [searchFilter, setSearchFilter] = useState<string>('');

  const handleCopy = useCallback(async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // Fallback for mobile
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

    lines.push('*🤝 Bora Conversar — Argumentos Baseados em Dados Oficiais*\n');

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

    lines.push('\n_Via Bora App — Conversas que importam_');
    return lines.join('\n');
  }, [results]);

  // Categories list for pills
  const categories = [
    { id: 'todos', label: 'Todos' },
    { id: 'combustivel', label: '⛽ Combustível' },
    { id: 'salario_minimo', label: '💵 Salário' },
    { id: 'alimentacao', label: '🥩 Alimentos' },
    { id: 'saude', label: '🏥 SUS & Remédios' },
    { id: 'previdencia', label: '🧓 Aposentadoria & BPC' },
    { id: 'emprego', label: '💼 Emprego & MEI' },
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

  // Group filtered arguments by stage
  const gatilhoArgs = filteredArguments.filter(a => a.stage === 'gatilho');
  const ponteArgs = filteredArguments.filter(a => a.stage === 'ponte');

  return (
    <section className="min-h-screen flex flex-col px-5 py-8 max-w-lg mx-auto w-full animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <button onClick={onRestart} className="btn-ghost -ml-3">
          ← Novo diálogo
        </button>
        <span className={`badge ${results.primaryRoute === 'A' ? 'badge-route-a' : 'badge-route-b'}`}>
          {results.primaryRoute === 'A' ? '🎯 Rota A: Conversão' : '🗳️ Rota B: Neutralização'}
        </span>
      </div>

      {/* Profile summary */}
      <div className="card-accent mb-4 animate-slide-up">
        <div className="flex items-start gap-3">
          <span className="text-2xl">🎯</span>
          <div>
            <p className="text-sm font-semibold mb-1" style={{ color: 'var(--accent-light)' }}>
              Estratégia personalizada para:
            </p>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              {results.profileLabel}
            </p>
          </div>
        </div>
      </div>

      {/* Simulator Quick Action Banner */}
      <button
        onClick={onOpenSimulator}
        className="mb-5 p-3.5 rounded-xl border border-teal-500/30 bg-teal-950/20 hover:bg-teal-950/40 text-left transition-all flex items-center justify-between group"
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">🥋</span>
          <div>
            <p className="text-xs font-bold text-teal-300">Treinar Antes de Falar?</p>
            <p className="text-xs text-slate-400">Pratique no Simulador de Conversa Interativo</p>
          </div>
        </div>
        <span className="text-teal-400 group-hover:translate-x-1 transition-transform">→</span>
      </button>

      {/* Tabs */}
      <div
        className="flex gap-1 p-1 rounded-xl mb-5"
        style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}
      >
        {([
          { key: 'roteiro' as const, label: '💬 Roteiro' },
          { key: 'fatos' as const, label: '📊 Fatos' },
          { key: 'compartilhar' as const, label: '📤 Compartilhar' },
        ]).map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className="flex-1 py-3 px-2 rounded-lg text-sm font-semibold transition-all duration-200"
            style={{
              background: activeTab === tab.key ? 'var(--accent-glow)' : 'transparent',
              color: activeTab === tab.key ? 'var(--accent-light)' : 'var(--text-tertiary)',
              border: activeTab === tab.key ? '1px solid var(--border-accent)' : '1px solid transparent',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Filters (Roteiro and Fatos) */}
      {(activeTab === 'roteiro' || activeTab === 'fatos') && (
        <div className="mb-5 flex flex-col gap-2">
          {/* Quick Search */}
          <input
            type="text"
            placeholder="🔍 Filtrar fatos (gasolina, bpc, alimentos...)"
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
                    ? 'bg-teal-500/20 text-teal-300 border border-teal-500/50'
                    : 'bg-slate-800/60 text-slate-400 border border-transparent hover:text-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Tab content: Roteiro */}
      {activeTab === 'roteiro' && (
        <div className="flex flex-col gap-6 animate-fade-in">
          {/* Acolhimento */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider mb-3 flex items-center justify-between" style={{ color: 'var(--accent-hope)' }}>
              <span>💚 Etapa 1 — Acolhimento Sem Julgamento</span>
              <span className="text-[10px] text-slate-400 font-normal">Valide a emoção primeiro</span>
            </h3>
            <div className="flex flex-col gap-3">
              {results.acolhimento.slice(0, 2).map((script) => (
                <div key={script.id} className="card-hope">
                  <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-primary)' }}>
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
              <h3 className="text-xs font-bold uppercase tracking-wider mb-3 flex items-center justify-between" style={{ color: 'var(--accent-warm)' }}>
                <span>⚡ Etapa 2 — Gatilhos de Alerta e Dados Materiais</span>
                <span className="text-[10px] text-slate-400 font-normal">Foco no bolso e no prato</span>
              </h3>
              <div className="flex flex-col gap-3">
                {gatilhoArgs.map((arg) => (
                  <div key={arg.id} className="card">
                    <div className="flex items-start gap-3 mb-3">
                      <span className="text-2xl">{arg.emoji}</span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                            {arg.headline}
                          </p>
                        </div>
                        {arg.sourceUrl !== '#' && (
                          <span className="seal-verified">Fato Verificado Oficial</span>
                        )}
                      </div>
                    </div>

                    {/* Chat bubble simulation */}
                    <div className="flex flex-col gap-2 mb-3">
                      <div className="chat-bubble user">
                        <p className="text-sm">{arg.scriptText.substring(0, 130)}...</p>
                      </div>
                    </div>

                    {/* Action row */}
                    <div className="flex items-center justify-between mb-2">
                      <AudioPlayerButton text={arg.scriptText} />
                      <button
                        className="btn-ghost text-xs text-teal-400 hover:text-teal-300"
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
                      <span className="text-sm">Ver resposta e contra-argumentos</span>
                      <span className="arrow">▼</span>
                    </button>
                    <div className={`accordion-content ${expandedArg === arg.id ? 'open' : ''}`}>
                      <div className="p-4 mt-2 rounded-lg" style={{ background: 'var(--bg-elevated)' }}>
                        <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-primary)' }}>
                          {arg.scriptText}
                        </p>

                        {arg.counterArgument && (
                          <div className="mt-4 pt-3 border-t border-slate-700/60">
                            <p className="text-xs font-bold uppercase mb-1.5" style={{ color: 'var(--danger)' }}>
                              🤔 Se ele(a) retrucar:
                            </p>
                            <p className="text-sm italic mb-3 text-slate-400">
                              &ldquo;{arg.counterArgument}&rdquo;
                            </p>
                            <p className="text-xs font-bold uppercase mb-1.5" style={{ color: 'var(--accent-hope)' }}>
                              ✅ Resposta tática sugerida:
                            </p>
                            <p className="text-sm text-slate-300 leading-relaxed">
                              {arg.rebuttal}
                            </p>
                          </div>
                        )}

                        <div
                          className="mt-4 pt-3 flex items-center justify-between"
                          style={{ borderTop: '1px solid var(--border)' }}
                        >
                          <span className="text-xs text-slate-400">
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
                                `${arg.emoji} *${arg.headline}*\n\n${arg.scriptText}\n\n📎 Fonte: ${arg.sourceName}\n\n_Via Bora App_`
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
              <h3
                className="text-xs font-bold uppercase tracking-wider mb-3 flex items-center justify-between"
                style={{ color: results.primaryRoute === 'A' ? 'var(--accent)' : 'var(--accent-warm)' }}
              >
                <span>{results.primaryRoute === 'A' ? '🌉 Etapa 3 — Ponte de Decisão' : '🗳️ Etapa 3 — Neutralização do Voto'}</span>
                <span className="text-[10px] text-slate-400 font-normal">Conclusão pacífica</span>
              </h3>
              <div className="flex flex-col gap-3">
                {ponteArgs.map((arg) => (
                  <div
                    key={arg.id}
                    className={results.primaryRoute === 'A' ? 'card-accent' : 'card-warm'}
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <span className="text-2xl">{arg.emoji}</span>
                      <div className="flex-1">
                        <p className="text-sm font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                          {arg.headline}
                        </p>
                        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                          {arg.scriptText}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-slate-700/30">
                      <AudioPlayerButton text={arg.scriptText} />
                      <div className="flex gap-2">
                        <button
                          className="btn-ghost text-xs"
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
                            `${arg.emoji} *${arg.headline}*\n\n${arg.scriptText}\n\n_Via Bora App_`
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

      {/* Tab content: Fatos */}
      {activeTab === 'fatos' && (
        <div className="flex flex-col gap-3 animate-fade-in">
          <p className="text-xs mb-3 text-slate-400">
            Fatos auditados e verificados de institutos oficiais (IBGE, DIEESE, ANP, IPEA, BC).
          </p>

          {filteredArguments.map((arg) => (
            <div key={arg.id} className="card">
              <div className="flex items-start gap-3">
                <span className="text-2xl">{arg.emoji}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1.5">
                    <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                      {arg.headline}
                    </p>
                  </div>
                  <p className="text-sm mb-3 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    {arg.scriptText}
                  </p>
                  <div className="flex items-center justify-between flex-wrap gap-2 pt-2 border-t border-slate-800">
                    <div className="flex items-center gap-2">
                      <span className="seal-verified">Fato Verificado</span>
                      <a
                        href={arg.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs underline text-teal-400 hover:text-teal-300"
                      >
                        📎 {arg.sourceName}
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <AudioPlayerButton text={arg.scriptText} />
                      <button
                        className="btn-ghost text-xs text-teal-400 hover:text-teal-300"
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

      {/* Tab content: Compartilhar */}
      {activeTab === 'compartilhar' && (
        <div className="flex flex-col gap-4 animate-fade-in">
          <p className="text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>
            Compartilhe o roteiro completo ou crie cards visuais para WhatsApp e Instagram Stories.
          </p>

          {/* Card Generator Highlight CTA */}
          <button
            onClick={() => onOpenCardGenerator(results.arguments[0])}
            className="p-4 rounded-xl border border-teal-500/40 bg-teal-950/30 hover:bg-teal-950/50 transition-all text-left flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <span className="text-3xl">🎨</span>
              <div>
                <p className="text-sm font-bold text-teal-300">Gerador de Card Visual</p>
                <p className="text-xs text-slate-400">Exporte imagem em 1:1 (Feed/Zap) ou 9:16 (Stories)</p>
              </div>
            </div>
            <span className="text-teal-300 group-hover:translate-x-1 transition-transform font-bold">Abrir →</span>
          </button>

          {/* Script Preview */}
          <div className="card" style={{ maxHeight: '260px', overflow: 'auto' }}>
            <p className="text-xs font-mono whitespace-pre-wrap leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              {buildFullScript()}
            </p>
          </div>

          {/* Action buttons */}
          <button
            className="btn-primary w-full shadow-lg"
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

          {typeof navigator !== 'undefined' && 'share' in navigator && (
            <button
              className="btn-secondary w-full"
              onClick={() => handleNativeShare('Bora — Conversas que Importam', buildFullScript())}
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
        </div>
      )}

      {/* Footer */}
      <div className="mt-10 pt-6 text-center" style={{ borderTop: '1px solid var(--border)' }}>
        <p className="text-xs text-slate-500">
          🔒 Zero rastreamento. Sem cookies. 100% anônimo e offline.
        </p>
        <p className="text-xs mt-1 text-slate-600">
          Bora — Conversas que importam. Dados que transformam.
        </p>
      </div>
    </section>
  );
}
