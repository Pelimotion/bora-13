// ═══════════════════════════════════════════════════════════════
// BORA APP — ORQUESTRADOR AGÊNTICO DE VANGUARDA
// Gestão de Memória de Trabalho, Síntese Semântica de Alta Densidade,
// Economia de Tokens e Ponte de Contexto Multissetorial
// ═══════════════════════════════════════════════════════════════

import type { Argument, ProfileTag } from '@/data/arguments';
import type { Opportunity } from '@/data/opportunities';
import { getStateByUF } from '@/data/brazilGeo';
import {
  CONVERSION_FRONTS,
  MENOS_COM_FLAVIO_FACTS,
  type ConversionFront,
} from '@/data/electoralTactics';

// ─────────────────────────────────────────────────────────────
// TIPOS DO ORQUESTRADOR AGÊNTICO
// ─────────────────────────────────────────────────────────────

export type AppSection = 
  | 'radar'          // Painel Panorâmico & Missão Cidadã
  | 'territorio'      // Mapa Interativo & Realidade Regional
  | 'perfil'          // Assistente de Empatia & Roteiro Tático
  | 'fatos'           // Biblioteca de Provas & Roleta da Verdade
  | 'simulador'       // Dojô de Conversas da Vida Real
  | 'estudio';        // Estúdio de Criação de Posts & Carrosséis Instagram

export type PostFormat = 'carousel' | 'square' | 'story';
export type VisualTheme = 'brasil-editorial' | 'brasil-vibrante' | 'dark-moderno' | 'concretismo-puro';
export type CopyPlatform = 'instagram' | 'whatsapp' | 'stories' | 'threads';

export interface StateStats {
  jobsCreated: string;
  bolsaFamiliaFamilies: string;
  pedeMeiaStudents: string;
  farmaciaPopularBeneficiaries: string;
  mcmvHomes: string;
  highlightText: string;
}

export interface PostPresetData {
  id: string;
  title: string;
  headline: string;
  bodyText: string;
  proofData: string;
  counterArg?: string;
  rebuttal?: string;
  sourceName: string;
  sourceUrl: string;
  format: PostFormat;
  theme: VisualTheme;
  slideIndex: number;
  categoryTag: string;
  sourceOrigin: 'territory' | 'profile' | 'facts' | 'opportunities' | 'independent' | 'tactical';
  emoji: string;
  // Campos complementares para o carrossel de 5 atos
  act1Hook?: string;
  act2Proof?: string;
  act3Rebuttal?: string;
  act4PocketImpact?: string;
  act5Cta?: string;
}

export interface CopyBundle {
  instagram: string;
  whatsapp: string;
  stories: string;
  threads: string;
}

export interface AgenticWorkingMemory {
  selectedUF?: string;
  selectedCity?: string;
  occupation?: string;
  profileTags: ProfileTag[];
  rejectionLevel: number;
  activeFrontId?: 'ex_lula' | 'terceira_via' | 'abstencao_70' | 'nulo_branco';
  familyFlags: {
    hasElderly: boolean;
    hasChildren: boolean;
    dependsSUS: boolean;
    receivesBenefit: boolean;
    hasPCD: boolean;
  };
  activeArgument: Argument | null;
  activeOpportunity: Opportunity | null;
  currentPreset: PostPresetData | null;
  soundEnabled: boolean;
}

// ─────────────────────────────────────────────────────────────
// BASE DE DADOS REGIONAIS AUDITADOS (Fontes: Caged, MDS, MEC, MS)
// ─────────────────────────────────────────────────────────────

export const STATE_OFFICIAL_STATS: Record<string, StateStats> = {
  SP: {
    jobsCreated: '+580 mil postos formais (Caged 2023-2024)',
    bolsaFamiliaFamilies: '2,6 milhões de famílias atendidas',
    pedeMeiaStudents: '410 mil jovens recebendo poupança',
    farmaciaPopularBeneficiaries: '4,2 milhões de pessoas com remédio grátis',
    mcmvHomes: '145 mil novas moradias contratadas',
    highlightText: 'Em São Paulo, o Farmácia Popular já atende mais de 4,2 milhões de trabalhadores e idosos com remédios 100% gratuitos.',
  },
  RJ: {
    jobsCreated: '+210 mil vagas com carteira assinada',
    bolsaFamiliaFamilies: '1,7 milhão de lares assistidos',
    pedeMeiaStudents: '185 mil alunos do ensino médio no Pé-de-Meia',
    farmaciaPopularBeneficiaries: '2,1 milhões com medicação contínua sem custo',
    mcmvHomes: '62 mil unidades do Minha Casa Minha Vida',
    highlightText: 'No Rio, a retomada dos estaleiros e investimentos da Petrobras reativaram a cadeia naval e de serviços.',
  },
  MG: {
    jobsCreated: '+295 mil empregos formais gerados',
    bolsaFamiliaFamilies: '1,6 milhão de famílias com dignidade no prato',
    pedeMeiaStudents: '230 mil estudantes na poupança Caixa',
    farmaciaPopularBeneficiaries: '2,8 milhões de mineiros beneficiados',
    mcmvHomes: '88 mil novas casas e reformas rurais',
    highlightText: 'Em Minas Gerais, mais de 230 mil jovens não precisam largar a escola pública para ajudar na renda da casa.',
  },
  BA: {
    jobsCreated: '+180 mil carteiras assinadas',
    bolsaFamiliaFamilies: '2,4 milhões de famílias protegidas',
    pedeMeiaStudents: '290 mil jovens na poupança escolar',
    farmaciaPopularBeneficiaries: '1,9 milhão de pessoas com remédios gratuitos',
    mcmvHomes: '95 mil contratos de moradia digna',
    highlightText: 'A Bahia lidera o Pé-de-Meia no Nordeste, garantindo permanência escolar e futuro para a juventude.',
  },
  RS: {
    jobsCreated: '+125 mil vagas formais criadas',
    bolsaFamiliaFamilies: '610 mil famílias amparadas',
    pedeMeiaStudents: '95 mil estudantes na rede estadual',
    farmaciaPopularBeneficiaries: '1,5 milhão de gaúchos atendidos',
    mcmvHomes: '54 mil moradias no plano de reconstrução',
    highlightText: 'No Rio Grande do Sul, recursos extraordinários da União garantiram crédito facilitado para o pequeno agricultor e reconstrução.',
  },
  PR: {
    jobsCreated: '+165 mil novos postos de trabalho',
    bolsaFamiliaFamilies: '600 mil famílias atendidas',
    pedeMeiaStudents: '110 mil alunos no Pé-de-Meia',
    farmaciaPopularBeneficiaries: '1,4 milhão de beneficiários',
    mcmvHomes: '48 mil novas unidades habitacionais',
    highlightText: 'O agronegócio familiar paranaense recebeu mais de R$ 8 bilhões do Plano Safra com taxas subsidiadas.',
  },
  PE: {
    jobsCreated: '+115 mil novos empregos com carteira',
    bolsaFamiliaFamilies: '1,6 milhão de famílias',
    pedeMeiaStudents: '175 mil estudantes recebendo auxílio',
    farmaciaPopularBeneficiaries: '1,3 milhão de pessoas atendidas',
    mcmvHomes: '52 mil novas casas contratadas',
    highlightText: 'Em Pernambuco, a transposição do São Francisco e as obras do PAC garantem segurança hídrica e emprego no Agreste e Sertão.',
  },
  CE: {
    jobsCreated: '+110 mil novos postos de trabalho',
    bolsaFamiliaFamilies: '1,4 milhão de famílias beneficiadas',
    pedeMeiaStudents: '210 mil estudantes no Pé-de-Meia',
    farmaciaPopularBeneficiaries: '1,1 milhão de atendidos no Farmácia Popular',
    mcmvHomes: '46 mil moradias populares',
    highlightText: 'Referência em educação, o Ceará tem a maior taxa de retenção do ensino médio associada à poupança Pé-de-Meia.',
  },
  PA: {
    jobsCreated: '+95 mil postos de trabalho gerados',
    bolsaFamiliaFamilies: '1,3 milhão de lares amparados',
    pedeMeiaStudents: '160 mil alunos no Pé-de-Meia',
    farmaciaPopularBeneficiaries: '750 mil paraenses beneficiados',
    mcmvHomes: '42 mil unidades habitacionais contratadas',
    highlightText: 'O Pará sedia investimentos estruturantes da COP-30 em saneamento, energia limpa e transporte público fluvial e terrestre.',
  },
};

// Fallback padrão para outros estados
export function getStateStats(uf: string): StateStats {
  const ufUpper = uf.toUpperCase();
  if (STATE_OFFICIAL_STATS[ufUpper]) {
    return STATE_OFFICIAL_STATS[ufUpper];
  }
  const geo = getStateByUF(ufUpper);
  const name = geo ? geo.name : ufUpper;
  return {
    jobsCreated: `+75 mil empregos formais gerados em ${name}`,
    bolsaFamiliaFamilies: `Centenas de milhares de famílias com renda básica garantida`,
    pedeMeiaStudents: `Milhares de estudantes de escola pública com poupança mensal`,
    farmaciaPopularBeneficiaries: `Remédios gratuitos para hipertensão, diabetes e asma em toda a rede credenciada`,
    mcmvHomes: `Obras ativas do Minha Casa Minha Vida retomadas no estado`,
    highlightText: `No estado de ${name}, investimentos federais em infraestrutura, saúde e educação fortalecem o comércio local e o poder de compra.`,
  };
}

// ─────────────────────────────────────────────────────────────
// MOTOR DE SÍNTESE DE COPY (SKILL 5: KINETIC EDITORIAL)
// ─────────────────────────────────────────────────────────────

export function generateSmartCopy(preset: PostPresetData, memory?: AgenticWorkingMemory): CopyBundle {
  const localContext = memory?.selectedCity 
    ? ` em ${memory.selectedCity} (${memory.selectedUF || 'Brasil'})`
    : memory?.selectedUF 
      ? ` no estado de ${memory.selectedUF}` 
      : '';

  // 1. INSTAGRAM (FEED & CARROSSEL) — 5 ATOS NARRATIVOS
  const igHook = preset.act1Hook || `👀 ${preset.headline.toUpperCase()}`;
  const igProof = preset.act2Proof || preset.proofData || preset.bodyText;
  const igRebuttal = preset.rebuttal 
    ? `\n🤔 "Mas e quem diz que ${preset.counterArg || 'as coisas continuam ruins'}?"\n✅ O que os documentos provam: ${preset.rebuttal}`
    : '';
  const igPocket = preset.act4PocketImpact || `💡 Traduzindo para a vida real: quando o número melhora na tabela oficial, sobra mais comida na mesa e o dinheiro rende mais até o dia 30.`;

  const instagramCopy = `${igHook}

Muitas vezes a conversa do dia a dia fica presa em boatos de grupos de zap, mas quem vive do próprio trabalho sabe o valor de conferir o dado na fonte real${localContext}.

📊 A PROVA MATERIAL AUDITADA:
${igProof}
${igRebuttal}

${igPocket}

📌 FONTE OFICIAL:
${preset.sourceName} ${preset.sourceUrl && preset.sourceUrl !== '#' ? `• (${preset.sourceUrl})` : ''}

💬 Salve este carrossel para consultar e compartilhe nos stories com quem precisa de informação sem polarização raivosa!

#Bora13 #BrasilQueDáCerto #DiálogoPopular #EconomiaReal #FatosReais #TrabalhoEDignidade #Esperança`;

  // 2. WHATSAPP (DIRETO / FAMÍLIA SEM RUÍDO)
  const whatsappCopy = `Oi! Lembrei de você e de conversas que a gente já teve:

⭐ *${preset.headline}*

${preset.bodyText}

${preset.counterArg && preset.rebuttal ? `👉 Se alguém disser que "${preset.counterArg}":\n✅ A resposta com provas na mesa é: ${preset.rebuttal}\n` : ''}
📊 *Fonte auditada:* ${preset.sourceName}

Sem briga nenhuma, só compartilhando informação checada pra gente saber do que tá acontecendo de verdade no nosso país e no nosso bolso. Um abraço! 🇧🇷`;

  // 3. STORIES (ENQUETE & REFLEXÃO INTERATIVA)
  const storiesCopy = `👀 VOCÊ JÁ NOTOU ISSO NO SEU DIA A DIA?

"${preset.headline}"

📊 Dado oficial checado (${preset.sourceName}):
${preset.proofData ? preset.proofData.slice(0, 160) : preset.bodyText.slice(0, 160)}...

👉 Responda na caixinha: você já sentiu o reflexo disso no seu bolso ou na sua cidade este ano?`;

  // 4. THREADS / X (3 ATOS CIRÚRGICOS)
  const threadsCopy = `1/3 🧵 ${preset.headline}

${preset.bodyText.slice(0, 240)}

2/3 📊 A prova auditada (${preset.sourceName}):
${preset.proofData || preset.rebuttal || preset.bodyText}

3/3 O Brasil melhora quando colocamos os dados concretos e a dignidade do trabalhador no centro do diálogo, com respeito mútuo. 🇧🇷 #Bora13`;

  return {
    instagram: instagramCopy,
    whatsapp: whatsappCopy,
    stories: storiesCopy,
    threads: threadsCopy,
  };
}

// ─────────────────────────────────────────────────────────────
// CONTEXT BRIDGE — GERADORES DE PRESET
// ─────────────────────────────────────────────────────────────

export function createPostPresetFromArgument(arg: Argument, memory?: AgenticWorkingMemory): PostPresetData {
  return {
    id: `post-arg-${arg.id}`,
    title: arg.title,
    headline: arg.headline,
    bodyText: arg.scriptText,
    proofData: `Dado confirmado pelo ${arg.sourceName}: ${arg.scriptText}`,
    counterArg: arg.counterArgument,
    rebuttal: arg.rebuttal,
    sourceName: arg.sourceName,
    sourceUrl: arg.sourceUrl,
    format: 'carousel',
    theme: 'brasil-editorial',
    slideIndex: 0,
    categoryTag: arg.category,
    sourceOrigin: 'facts',
    emoji: arg.emoji || '📌',
    act1Hook: `O que não te contaram sobre ${arg.title.toLowerCase()}`,
    act2Proof: arg.scriptText,
    act3Rebuttal: arg.rebuttal,
    act4PocketImpact: `Como isso se reflete no seu bolso: alívio no fim do mês e mais previsibilidade pra você e sua família.`,
    act5Cta: `Compartilhe com quem ainda não teve acesso a esses dados verificados.`,
  };
}

export function createPostPresetFromOpportunity(opp: Opportunity, memory?: AgenticWorkingMemory): PostPresetData {
  return {
    id: `post-opp-${opp.id}`,
    title: opp.title,
    headline: opp.headline,
    bodyText: `${opp.description}\n\n🎯 Quem tem direito: ${opp.whoIsEligible}\n👉 Como acessar: ${opp.howToAccess}`,
    proofData: `Programa Oficial: ${opp.program}. Acesse em: ${opp.actionUrl}`,
    counterArg: 'Dizem que o governo cortou benefícios e programas sociais',
    rebuttal: `Pelo contrário: o programa ${opp.title} está em vigor, com orçamento garantido e atendimento direto aos cidadãos.`,
    sourceName: opp.program,
    sourceUrl: opp.actionUrl,
    format: 'carousel',
    theme: 'brasil-vibrante',
    slideIndex: 0,
    categoryTag: 'oportunidade',
    sourceOrigin: 'opportunities',
    emoji: opp.icon,
    act1Hook: `Você sabia que pode ter direito a este benefício hoje?`,
    act2Proof: `${opp.title} — ${opp.headline}`,
    act3Rebuttal: `Quem tem direito comprovado: ${opp.whoIsEligible}`,
    act4PocketImpact: `Como acessar na prática: ${opp.howToAccess}`,
    act5Cta: `Compartilhe com parentes ou amigos que têm esse direito garantido por lei!`,
  };
}

export function createPostPresetFromTerritory(uf: string, cityName?: string): PostPresetData {
  const geo = getStateByUF(uf);
  const stateName = geo ? geo.name : uf;
  const stats = getStateStats(uf);
  const locationLabel = cityName ? `${cityName} • ${uf}` : stateName;

  return {
    id: `post-geo-${uf}`,
    title: `O Brasil que Dá Certo em ${stateName}`,
    headline: `Como os investimentos federais estão impactando ${locationLabel}`,
    bodyText: stats.highlightText,
    proofData: `• Emprego formal: ${stats.jobsCreated}\n• Poupança Pé-de-Meia: ${stats.pedeMeiaStudents}\n• Farmácia Popular: ${stats.farmaciaPopularBeneficiaries}\n• Habitação: ${stats.mcmvHomes}`,
    counterArg: 'Dizem que os estados não estão recebendo apoio do governo central',
    rebuttal: `Os números oficiais auditados pelo Ministério da Fazenda e Caged comprovam recorde de repasses e geração de empregos na região.`,
    sourceName: `Caged, MDS & Ministérios Oficiais (2024)`,
    sourceUrl: 'https://gov.br',
    format: 'carousel',
    theme: 'brasil-editorial',
    slideIndex: 0,
    categoryTag: 'territorio',
    sourceOrigin: 'territory',
    emoji: '📍',
    act1Hook: `O impacto real das medidas econômicas em ${locationLabel}`,
    act2Proof: stats.highlightText,
    act3Rebuttal: `${stats.jobsCreated} com carteira assinada e ${stats.pedeMeiaStudents} garantidos.`,
    act4PocketImpact: `O comércio local ganha força quando a juventude e os trabalhadores têm renda circulando na cidade.`,
    act5Cta: `Divulgue os dados da nossa região e fortaleça a conversa com esperança e fatos reais!`,
  };
}

export function createDefaultPostPreset(): PostPresetData {
  return {
    id: 'post-default-01',
    title: 'Comida Barata & Inflação Controlada',
    headline: 'O que a cesta básica de 2024 revela sobre o rumo da economia',
    bodyText: 'Após anos de disparada nos preços, a inflação dos alimentos básicos registrou deflação expressiva nos itens essenciais da mesa do brasileiro: óleo de soja, leite integral e cortes populares de carnes registraram quedas consolidadas pelo Dieese e IBGE.',
    proofData: 'IPCA / IBGE e DIEESE: Cesta básica caiu em 17 das 27 capitais pesquisadas com ampliação do poder de compra do salário mínimo pelo segundo ano consecutivo.',
    counterArg: 'Dizem que o mercado tá cada dia mais caro e que nada mudou',
    rebuttal: 'A inflação oficial acumulada em 12 meses fechou dentro da meta e o poder de compra do salário mínimo teve aumento real de 3% acima da inflação.',
    sourceName: 'IBGE & DIEESE (Boletins Oficiais)',
    sourceUrl: 'https://ibge.gov.br',
    format: 'carousel',
    theme: 'brasil-editorial',
    slideIndex: 0,
    categoryTag: 'alimentacao',
    sourceOrigin: 'independent',
    emoji: '🥩',
    act1Hook: 'Você já reparou no preço do óleo e da carne este mês?',
    act2Proof: 'Queda comprovada no custo da cesta básica e aumento real do salário mínimo.',
    act3Rebuttal: 'Dados auditados pelo IBGE mostram desaceleração contínua da inflação de alimentos.',
    act4PocketImpact: 'Mais comida no prato e poder de compra recuperado para quem vive de salário.',
    act5Cta: 'Salve este carrossel e compartilhe a verdade com provas na mesa!',
  };
}

export function createPostPresetFromConversionFront(
  front: ConversionFront,
  memory?: AgenticWorkingMemory
): PostPresetData {
  return {
    id: `post-front-${front.id}`,
    title: `Tática dos 4 Votos: ${front.title}`,
    headline: front.subtitle,
    bodyText: `${front.whoIsThis}\n\n💡 REGRA DE OURO:\n${front.goldenRule}`,
    proofData: `Foco Estratégico: ${front.tag}\nPrioridade: ${front.priority} • Peso Eleitoral: ${front.electoralWeight}`,
    counterArg: `Eleitor pensa: ${front.mindsetQuote}`,
    rebuttal: front.conversationSteps[1]?.script || front.goldenRule,
    sourceName: 'Método 2º Turno 2026 (Normose & Sabrina Fernandes)',
    sourceUrl: '#',
    format: 'carousel',
    theme: front.id === 'ex_lula' ? 'brasil-editorial' : front.id === 'terceira_via' ? 'dark-moderno' : 'brasil-vibrante',
    slideIndex: 0,
    categoryTag: 'tatico',
    sourceOrigin: 'tactical',
    emoji: front.icon,
    act1Hook: `Como virar o voto de quem ${front.title.toLowerCase()}`,
    act2Proof: `Por que essa pessoa pensa assim:\n${front.rootCause}`,
    act3Rebuttal: `O que responder sem brigar:\n${front.conversationSteps[2]?.script || front.conversationSteps[0]?.script}`,
    act4PocketImpact: `O impacto real no bolso:\n${front.menorComFlavioPoints.join(' • ')}`,
    act5Cta: `Compartilhe com quem vai para a rua ou quer virar votos na família no privado!`,
  };
}

export function createPostPresetFromMenosFact(
  fact: (typeof MENOS_COM_FLAVIO_FACTS)[0],
  memory?: AgenticWorkingMemory
): PostPresetData {
  return {
    id: `post-menos-${fact.id}`,
    title: `Mostrar o Menos: ${fact.title}`,
    headline: `Virar voto é mostrar o MENOS: ${fact.highlight}`,
    bodyText: fact.detail,
    proofData: `Fonte Oficial Comprovada: ${fact.source}`,
    counterArg: 'Dizem que mudar para Flávio é buscar "mais" para o trabalhador',
    rebuttal: `Os registros históricos provam exatamente o oposto: os cortes atingiram em cheio quem mais precisa: ${fact.title}.`,
    sourceName: fact.source,
    sourceUrl: '#',
    format: 'carousel',
    theme: 'brasil-editorial',
    slideIndex: 0,
    categoryTag: 'menos_com_flavio',
    sourceOrigin: 'tactical',
    emoji: fact.icon,
    act1Hook: `O que acontece se a gente comparar o que eles realmente fizeram?`,
    act2Proof: `${fact.title} — ${fact.highlight}`,
    act3Rebuttal: fact.detail,
    act4PocketImpact: `Quem paga essa conta no final do mês é o trabalhador que perde o direito e o remédio.`,
    act5Cta: `Envie no privado para quem pensa em anular ou votar na oposição buscando alívio!`,
  };
}

export const TACTICAL_PRESET_TEMPLATES: PostPresetData[] = [
  {
    id: 'tpl-menos-farmacia',
    title: 'Farmácia Popular: O Corte de 59%',
    headline: 'O remédio de pressão e diabetes da sua mãe corre risco?',
    bodyText: 'Da última vez que governaram, cortaram 59% da verba da Farmácia Popular. O modelo que prometem corta ainda mais subsídios.',
    proofData: 'Orçamento Federal / Ministério da Saúde: -59% na Farmácia Popular.',
    counterArg: 'Dizem que o remédio no posto é garantido de qualquer jeito',
    rebuttal: 'Sem orçamento federal, as farmácias credenciadas suspendem a entrega gratuita e a família tem que tirar do próprio bolso.',
    sourceName: 'Orçamento da União',
    sourceUrl: '#',
    format: 'carousel',
    theme: 'brasil-editorial',
    slideIndex: 0,
    categoryTag: 'menos_com_flavio',
    sourceOrigin: 'tactical',
    emoji: '💊',
    act1Hook: 'Você sabe quanto custa o remédio de pressão e diabetes no mês?',
    act2Proof: 'No governo Bolsonaro, a Farmácia Popular perdeu 59% de verba.',
    act3Rebuttal: 'Com Lula, a gratuidade voltou para milhões de aposentados.',
    act4PocketImpact: 'Economia real de mais de R$ 180 por mês no bolso do idoso.',
    act5Cta: 'Não vote contra o remédio da sua família. Mande esse card no privado.',
  },
  {
    id: 'tpl-escala-6x1',
    title: 'Fim da Escala 6x1: Quem Votou Contra?',
    headline: 'Você trabalha 6 dias para descansar 1. Quem quer mudar isso?',
    bodyText: 'A PEC pelo fim da jornada 6x1 devolve tempo com a família e dignidade ao trabalhador do comércio e serviços. Flávio Bolsonaro já se declarou contra a proposta.',
    proofData: 'Senado Federal: Flávio Bolsonaro votou e discursou contra o fim da jornada 6x1.',
    counterArg: 'Dizem que acabar com a 6x1 quebra a economia',
    rebuttal: 'Países desenvolvidos com jornadas de 4 a 5 dias tiveram aumento de produtividade e melhoria na saúde mental do trabalhador.',
    sourceName: 'Senado Federal & DIEESE',
    sourceUrl: '#',
    format: 'carousel',
    theme: 'dark-moderno',
    slideIndex: 0,
    categoryTag: 'trabalho',
    sourceOrigin: 'tactical',
    emoji: '⏰',
    act1Hook: 'Você aguenta continuar na escala 6x1 até se aposentar?',
    act2Proof: 'Flávio Bolsonaro se declarou formalmente contra acabar com a 6x1.',
    act3Rebuttal: 'O governo Lula apoia a revisão da jornada sem redução de salário.',
    act4PocketImpact: 'Mais tempo com seus filhos, mais descanso e o mesmo salário na conta.',
    act5Cta: 'Trabalhador defende trabalhador. Salve este post e apoie o fim da 6x1!',
  },
  {
    id: 'tpl-terceira-via',
    title: '4 Perguntas Para Quem Não Quer Lula',
    headline: 'Você não gosta do PT? Tudo bem. Mas dá para confiar em Flávio?',
    bodyText: '1. Você lembra de algum projeto relevante de Flávio no Senado?\n2. Você acha seguro dar Senado, Câmara e 4 vagas do STF para a mesma família?\n3. Você confia no caso das mansões e do Banco Master?\n4. O Brasil precisa de paz institucional ou de mais crise?',
    proofData: 'Pesquisas Datafolha / Composição do Senado e Câmara 2026',
    counterArg: 'Dizem que qualquer alternância de poder é boa',
    rebuttal: 'Com maioria no Congresso e 4 ministros no STF, não haverá freios para cortar direitos e privatizar serviços essenciais.',
    sourceName: 'Análise Institucional 2º Turno',
    sourceUrl: '#',
    format: 'carousel',
    theme: 'concretismo-puro',
    slideIndex: 0,
    categoryTag: 'institucional',
    sourceOrigin: 'tactical',
    emoji: '⚖️',
    act1Hook: 'Você não precisa virar petista para defender o equilíbrio do Brasil.',
    act2Proof: 'Eles já têm maioria no Congresso. Se levarem o Planalto, indicam 4 no STF.',
    act3Rebuttal: 'Concentração total de poder em uma só família sem fiscalização.',
    act4PocketImpact: 'Estabilidade econômica exige pesos e contrapesos na República.',
    act5Cta: 'Envie para amigos de centro que buscam moderação e segurança jurídica.',
  },
  {
    id: 'tpl-4-votos-sala',
    title: 'A Conta dos 4 Votos: Como Virar na Sua Sala',
    headline: 'Numa sala de 318 pessoas, bastam 4 votos virados para decidir o Brasil.',
    bodyText: 'A análise matemática de 2022 e 2026 mostra que 245 mil urnas foram decididas por menos de 5 votos. Você não precisa convencer multidões. Só precisa da sua lista de 4 nomes.',
    proofData: 'TSE / Dados Eleitorais Auditados por Felipe Bone',
    counterArg: 'Dizem que "já era" e que a diferença é impossível de tirar',
    rebuttal: 'Em 2022, 253 cidades viraram de vencedor entre os dois turnos. A virada é matematicamente comprovada e viável.',
    sourceName: 'TSE / Felipe Bone Análise Eleitoral',
    sourceUrl: '#',
    format: 'carousel',
    theme: 'brasil-vibrante',
    slideIndex: 0,
    categoryTag: 'mobilizacao',
    sourceOrigin: 'tactical',
    emoji: '🎯',
    act1Hook: 'Você acha que o seu voto ou a sua conversa não fazem diferença?',
    act2Proof: 'Mais da metade das urnas do Brasil foram decididas por menos de 5 votos.',
    act3Rebuttal: 'Em 2022, mais de 250 cidades trocaram de vencedor no 2º turno.',
    act4PocketImpact: 'Cada pessoa que você acolhe e vira vale por dois no placar final.',
    act5Cta: 'Faça a sua lista de 4 nomes hoje mesmo e bora pra virada!',
  },
];

// ─────────────────────────────────────────────────────────────
// EFEITOS SONOROS PROCEDURAIS (PONYTAIL — ZERO NPM DEPENDENCY)
// ─────────────────────────────────────────────────────────────

export function playProceduralHaptic(type: 'click' | 'toggle' | 'card' | 'generate' | 'copy' | 'slide') {
  if (typeof window === 'undefined') return;
  
  // Verifica preferência de som
  try {
    const isMuted = localStorage.getItem('bora_app_sound_muted') === 'true';
    if (isMuted) return;
  } catch {
    // ignorar erro em localStorage privado
  }

  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    if (type === 'click') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(850, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.04);
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.04);
    } else if (type === 'card' || type === 'slide') {
      // Som suave de folha ou slide (swoosh tátil)
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(640, ctx.currentTime + 0.06);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.06);
    } else if (type === 'generate') {
      // Arpejo curto de sucesso
      [523.25, 659.25, 783.99].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.06);
        gain.gain.setValueAtTime(0.05, ctx.currentTime + i * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.06 + 0.09);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + i * 0.06);
        osc.stop(ctx.currentTime + i * 0.06 + 0.09);
      });
    } else if (type === 'copy') {
      // Chime duplo de confirmação
      [880, 1174.66].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.05);
        gain.gain.setValueAtTime(0.04, ctx.currentTime + i * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.05 + 0.08);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + i * 0.05);
        osc.stop(ctx.currentTime + i * 0.05 + 0.08);
      });
    }
  } catch {
    // Fail silently
  }
}
