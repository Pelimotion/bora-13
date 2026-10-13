// ═══════════════════════════════════════════════════════════════
// BORA APP — Motor de Decisão (Decision Engine)
// Pipeline de 3 camadas: Filtragem → Ranking → Orquestração
// ═══════════════════════════════════════════════════════════════

import { ARGUMENTS_DATABASE, ACOLHIMENTO_SCRIPTS, type Argument, type ProfileTag, type Route } from '@/data/arguments';

// ═══════════════════════════════════════
// TIPOS DO ENGINE
// ═══════════════════════════════════════

export interface UserProfile {
  /** Estado selecionado (UF) */
  state?: string;
  /** Cidade selecionada */
  city?: string;
  /** Tags de perfil coletadas do formulário */
  profileTags: ProfileTag[];
  /** Nível de rejeição: 1-4 (1=frustrado votou Lula, 4=bolsonarista forte) */
  rejectionLevel: number;
  /** Ocupação selecionada (label) */
  occupation?: string;
  /** Flags familiares */
  familyFlags: {
    hasElderly: boolean;
    hasChildren: boolean;
    dependsSUS: boolean;
    receivesBenefit: boolean;
    hasPCD: boolean;
  };
  /** Religião */
  religion?: 'evangelico' | 'catolico' | 'outro' | 'nenhum';
}

export interface EngineResult {
  /** Rota principal recomendada */
  primaryRoute: 'A' | 'B';
  /** Scripts de acolhimento selecionados */
  acolhimento: typeof ACOLHIMENTO_SCRIPTS;
  /** Argumentos rankeados do mais ao menos impactante */
  arguments: ScoredArgument[];
  /** Instruções contextuais */
  instructions: string[];
  /** Rótulo do perfil detectado */
  profileLabel: string;
}

export interface ScoredArgument extends Argument {
  /** Score calculado pelo ranking engine */
  score: number;
  /** Explicação do score para debug */
  scoreExplanation?: string;
}

// ═══════════════════════════════════════
// CAMADA 1: FILTRAGEM DETERMINÍSTICA
// ═══════════════════════════════════════

function filterByEligibility(args: Argument[], profile: UserProfile): Argument[] {
  const tags = new Set(profile.profileTags);

  // Adiciona tags implícitas baseadas nas flags familiares
  if (profile.familyFlags.hasElderly) tags.add('idoso_familia');
  if (profile.familyFlags.hasPCD) tags.add('pcd_familia');
  if (profile.familyFlags.dependsSUS) tags.add('sus');
  if (profile.familyFlags.receivesBenefit) tags.add('bpc');
  if (profile.familyFlags.hasChildren) {
    tags.add('mae');
    tags.add('pai');
  }
  if (profile.religion === 'evangelico') tags.add('evangelico');
  if (profile.religion === 'catolico') tags.add('catolico');

  // Sempre incluir argumentos genéricos
  tags.add('generico');

  // Determinar rota principal
  const primaryRoute: Route = profile.rejectionLevel >= 4 ? 'B' : 'A';

  return args.filter(arg => {
    // Argumento deve ter pelo menos uma tag em comum com o perfil
    const hasMatchingTag = arg.targetProfiles.some(t => tags.has(t));
    if (!hasMatchingTag) return false;

    // Argumento deve ser da rota correta ou ser BOTH
    if (arg.route !== 'BOTH' && arg.route !== primaryRoute) return false;

    return true;
  });
}

// ═══════════════════════════════════════
// CAMADA 2: RANKING CONTEXTUAL S(u, x, c)
// ═══════════════════════════════════════

// Pesos do ranking
const WEIGHTS = {
  relevance: 3.0,      // wR — relevância para o perfil
  geographic: 1.5,     // wG — pertinência geográfica
  politization: 2.0,   // wP — adequação ao nível de politização
  quality: 1.0,        // wQ — força factual
  toxicity: -2.0,      // wH — penalização por risco
};

function scoreArgument(arg: Argument, profile: UserProfile): ScoredArgument {
  const tags = new Set(profile.profileTags);

  // R: Relevância para o perfil (quantas tags batem)
  const matchingTags = arg.targetProfiles.filter(t => tags.has(t) || t === 'generico');
  const specificTags = matchingTags.filter(t => t !== 'generico');
  const R = specificTags.length > 0 ? (specificTags.length / arg.targetProfiles.length) : 0.3;

  // G: Pertinência geográfica
  let G = 0.5; // base
  if (arg.regions && profile.state) {
    G = arg.regions.includes(profile.state) ? 1.0 : 0.3;
  }

  // P: Adequação ao nível de politização
  let P = 0.5;
  if (arg.stage === 'acolhimento') {
    // Acolhimento é sempre muito relevante para níveis altos de rejeição
    P = profile.rejectionLevel >= 3 ? 1.0 : 0.7;
  } else if (arg.stage === 'gatilho') {
    // Gatilhos são mais eficazes com nível intermediário
    P = profile.rejectionLevel === 2 || profile.rejectionLevel === 3 ? 0.9 : 0.6;
  } else if (arg.stage === 'ponte') {
    // Pontes são mais eficazes com nível baixo de rejeição
    P = profile.rejectionLevel <= 2 ? 0.9 : 0.5;
  }

  // Q: Força factual (baseado no impactScore)
  const Q = arg.impactScore / 10;

  // H: Risco de toxicidade (argumentos ad hominem ou muito agressivos)
  const H = arg.sourceUrl === '#' ? 0.1 : 0; // penaliza argumentos sem fonte sólida

  // Score final
  const score =
    WEIGHTS.relevance * R +
    WEIGHTS.geographic * G +
    WEIGHTS.politization * P +
    WEIGHTS.quality * Q +
    WEIGHTS.toxicity * H;

  return {
    ...arg,
    score: Math.round(score * 100) / 100,
  };
}

// ═══════════════════════════════════════
// CAMADA 3: ORQUESTRAÇÃO DE SAÍDA
// ═══════════════════════════════════════

function generateInstructions(profile: UserProfile): string[] {
  const instructions: string[] = [];

  // Instrução base
  instructions.push(
    '🎯 Lembre-se: NÃO ataque, NÃO julgue, NÃO seja arrogante. Escute primeiro, valide a frustração, depois apresente os dados.'
  );

  // Instruções contextuais
  if (profile.rejectionLevel >= 4) {
    instructions.push(
      '⚠️ Interlocutor com rejeição alta ao Lula. Foque em DESCONSTRUIR o voto no Flávio, não em CONVERTER para o Lula. O objetivo é nulo/branco.'
    );
    instructions.push(
      '🗳️ Use a metáfora do "cheque em branco": votar no Flávio é assinar embaixo de TODAS as propostas dele, inclusive as que prejudicam o próprio eleitor.'
    );
  } else if (profile.rejectionLevel === 3) {
    instructions.push(
      '🔄 Interlocutor vota no Flávio por rejeição ao Lula. Tente primeiro a Rota A (dados materiais), se houver bloqueio, mude para Rota B (anulação).'
    );
  } else if (profile.rejectionLevel === 2) {
    instructions.push(
      '💡 Interlocutor indeciso/desiludido. Boa abertura para diálogo material. Foque em dados concretos sobre o impacto no bolso.'
    );
  } else {
    instructions.push(
      '✅ Interlocutor frustrado mas já votou em Lula antes. Foque em reforçar com dados e responder dúvidas específicas.'
    );
  }

  // Instruções de religião
  if (profile.religion === 'evangelico') {
    instructions.push(
      '🙏 Respeite profundamente a fé. Nunca questione a religião. Conecte os valores cristãos (cuidar dos mais pobres) com as políticas públicas.'
    );
  }

  return instructions;
}

function detectProfileLabel(profile: UserProfile): string {
  const labels: string[] = [];

  if (profile.occupation) labels.push(profile.occupation);
  if (profile.state) labels.push(profile.state);
  if (profile.familyFlags.hasElderly) labels.push('com idoso na família');
  if (profile.familyFlags.hasChildren) labels.push('com filhos');
  if (profile.familyFlags.dependsSUS) labels.push('depende do SUS');
  if (profile.familyFlags.receivesBenefit) labels.push('recebe benefício');

  return labels.length > 0 ? labels.join(' · ') : 'Perfil geral';
}

// ═══════════════════════════════════════
// FUNÇÃO PRINCIPAL DO ENGINE
// ═══════════════════════════════════════

export function runEngine(profile: UserProfile): EngineResult {
  // 1. Filtragem determinística
  const eligible = filterByEligibility(ARGUMENTS_DATABASE, profile);

  // 2. Ranking contextual
  const scored = eligible
    .map(arg => scoreArgument(arg, profile))
    .sort((a, b) => b.score - a.score);

  // 3. Orquestração
  const primaryRoute: 'A' | 'B' = profile.rejectionLevel >= 4 ? 'B' : 'A';
  const instructions = generateInstructions(profile);
  const profileLabel = detectProfileLabel(profile);

  // Selecionar os melhores scripts de acolhimento baseado no contexto
  const acolhimento = profile.rejectionLevel >= 3
    ? ACOLHIMENTO_SCRIPTS.filter(s =>
        s.context.includes('defensivo') || s.context.includes('qualquer')
      )
    : ACOLHIMENTO_SCRIPTS;

  return {
    primaryRoute,
    acolhimento: acolhimento.length > 0 ? acolhimento : ACOLHIMENTO_SCRIPTS,
    arguments: scored,
    instructions,
    profileLabel,
  };
}

/**
 * Gera um resultado rápido para o modo "Qualquer Perfil"
 * Usa os argumentos mais universais e impactantes
 */
export function runQuickMode(): EngineResult {
  return runEngine({
    profileTags: ['generico'],
    rejectionLevel: 2,
    familyFlags: {
      hasElderly: false,
      hasChildren: false,
      dependsSUS: false,
      receivesBenefit: false,
      hasPCD: false,
    },
  });
}
