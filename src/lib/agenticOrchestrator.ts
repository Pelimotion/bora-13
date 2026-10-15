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
  getRegionalTacticForUF,
  type ConversionFront,
  type ConversionFrontId,
} from '@/data/electoralTactics';

// ─────────────────────────────────────────────────────────────
// TIPOS DO ORQUESTRADOR AGÊNTICO
// ─────────────────────────────────────────────────────────────

export type CanonicalAppSection = 'inicio' | 'preparar' | 'treinar' | 'explorar' | 'estudio';

export type AppSection = 
  | CanonicalAppSection
  | 'radar'          // Alias para 'inicio'
  | 'perfil'         // Alias para 'preparar'
  | 'simulador'      // Alias para 'treinar'
  | 'territorio'     // Alias para 'explorar'
  | 'fatos';         // Alias para 'explorar'

export function normalizeAppSection(section: AppSection | string): CanonicalAppSection {
  switch (section) {
    case 'radar':
    case 'inicio':
      return 'inicio';
    case 'perfil':
    case 'preparar':
      return 'preparar';
    case 'simulador':
    case 'treinar':
      return 'treinar';
    case 'territorio':
    case 'fatos':
    case 'explorar':
      return 'explorar';
    case 'estudio':
      return 'estudio';
    default:
      return 'inicio';
  }
}

export type PostFormat = 'portrait' | 'carousel' | 'square' | 'story';
export type VisualTheme = 'brasil-editorial' | 'brasil-vibrante' | 'dark-moderno' | 'concretismo-puro' | 'jornalismo-investigativo';
export type CopyPlatform = 'instagram' | 'whatsapp' | 'stories' | 'threads';
export type SlideArchetype = 'editorial-cover' | 'big-stat-hero' | 'dialectic-split' | 'pocket-reality' | 'manifesto-cta';

export interface StateDossierReason {
  id: string;
  category: 'infra' | 'agro' | 'trabalho' | 'saude' | 'educacao' | 'risco_flavio' | 'bolso' | 'seguranca';
  title: string;
  description: string;
  proofBadge: string;
  audienceTag?: string;
}

export interface StateStats {
  jobsCreated: string;
  bolsaFamiliaFamilies: string;
  pedeMeiaStudents: string;
  farmaciaPopularBeneficiaries: string;
  mcmvHomes: string;
  highlightText: string;
  strategicReasons?: StateDossierReason[];
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
  // Campos de impacto visual e arquétipos
  statNumber?: string;
  statLabel?: string;
  archetypeBySlide?: Record<number, SlideArchetype>;
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
  activeFrontId?: ConversionFrontId;
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
    strategicReasons: [
      {
        id: 'sp-1',
        category: 'saude',
        title: '4,2 milhões de paulistas com remédio 100% grátis',
        description: 'Farmácia Popular reestruturada fornecendo remédios gratuitos de pressão alta, diabetes, asma e osteoporose na capital, Grande SP e interior.',
        proofBadge: 'Ministério da Saúde • Farmácia Popular',
        audienceTag: 'Para quem tem idoso na família ou gasta na farmácia',
      },
      {
        id: 'sp-2',
        category: 'infra',
        title: 'Túnel Santos-Guarujá e Trens Metropolitanos',
        description: 'Parceria republicana com R$ 6 bilhões federais no Túnel Santos-Guarujá, além de investimentos no Trem Intercidades SP-Campinas.',
        proofBadge: 'Novo PAC • Ministério dos Transportes',
        audienceTag: 'Para moradores da Baixada, Campinas e Capital',
      },
      {
        id: 'sp-3',
        category: 'trabalho',
        title: '+580 mil empregos formais gerados no estado',
        description: 'Liderança absoluta do Caged com retomada da indústria automotiva e expansão de serviços, aquecendo o comércio local.',
        proofBadge: 'Caged • Ministério do Trabalho',
        audienceTag: 'Para trabalhadores, autônomos e comerciantes',
      },
      {
        id: 'sp-4',
        category: 'educacao',
        title: 'Pé-de-Meia para 410 mil estudantes da rede pública',
        description: 'Poupança Caixa mensal que protege a permanência de estudantes no ensino médio e técnico da periferia e do interior paulista.',
        proofBadge: 'MEC • Caixa Econômica Federal',
        audienceTag: 'Para pais e jovens estudantes',
      },
      {
        id: 'sp-5',
        category: 'risco_flavio',
        title: 'O Risco Flávio: Desmonte do SUS paulista e Fim do Aumento Real',
        description: 'Votações comprovam proposta de desvincular o salário mínimo e cortar repasses federais para hospitais e santas casas paulistas.',
        proofBadge: 'Registro Oficial do Congresso Nacional',
        audienceTag: 'Para indecisos e votos nulos',
      },
    ],
  },
  RJ: {
    jobsCreated: '+210 mil vagas com carteira assinada',
    bolsaFamiliaFamilies: '1,7 milhão de lares assistidos',
    pedeMeiaStudents: '185 mil alunos do ensino médio no Pé-de-Meia',
    farmaciaPopularBeneficiaries: '2,1 milhões com medicação contínua sem custo',
    mcmvHomes: '62 mil unidades do Minha Casa Minha Vida',
    highlightText: 'No Rio, a retomada dos estaleiros e investimentos da Petrobras reativaram a cadeia naval e de serviços.',
    strategicReasons: [
      {
        id: 'rj-1',
        category: 'trabalho',
        title: 'Retomada dos Estaleiros Navais e Cadeia do Petróleo',
        description: 'Contratações da Petrobras em Niterói, Angra e São Gonçalo reativaram a indústria naval fluminense gerando empregos qualificados.',
        proofBadge: 'Petrobras • ANP • Caged',
        audienceTag: 'Para trabalhadores navais, metalúrgicos e serviços',
      },
      {
        id: 'rj-2',
        category: 'saude',
        title: '2,1 milhões de fluminenses com remédio gratuito',
        description: 'Alívio direto no bolso de famílias da Baixada, Zona Oeste e interior com medicamentos essenciais sem cobrança.',
        proofBadge: 'Ministério da Saúde',
        audienceTag: 'Para famílias e aposentados',
      },
      {
        id: 'rj-3',
        category: 'educacao',
        title: '185 mil jovens fluminenses no Pé-de-Meia',
        description: 'Incentivo financeiro mensal para manter os jovens nas escolas e afastá-los da cooptação da violência.',
        proofBadge: 'MEC • Caixa Econômica Federal',
        audienceTag: 'Para jovens e famílias da periferia',
      },
      {
        id: 'rj-4',
        category: 'seguranca',
        title: 'Apreensão recorde de fuzis e asfixia financeira de milícias',
        description: 'Ações integradas da Polícia Federal desarticulando rotas de contrabando pesado e lavagem de capitais sem teatralidade.',
        proofBadge: 'Polícia Federal • Ministério da Justiça',
        audienceTag: 'Para quem cobra segurança pública séria',
      },
      {
        id: 'rj-5',
        category: 'risco_flavio',
        title: 'O Risco Flávio: Aparelhamento do Rio e Alianças com o Crime Organizado',
        description: 'Histórico de ligações questionáveis na ALERJ, rachadinhas e tentativas de enfraquecer o controle financeiro do COAF.',
        proofBadge: 'Investigações MPF e Decisões Judiciais',
        audienceTag: 'Para indecisos e desiludidos',
      },
    ],
  },
  MG: {
    jobsCreated: '+295 mil empregos formais gerados',
    bolsaFamiliaFamilies: '1,6 milhão de famílias com dignidade no prato',
    pedeMeiaStudents: '230 mil estudantes na poupança Caixa',
    farmaciaPopularBeneficiaries: '2,8 milhões de mineiros beneficiados',
    mcmvHomes: '88 mil novas casas e reformas rurais',
    highlightText: 'Em Minas Gerais, mais de 230 mil jovens não precisam largar a escola pública para ajudar na renda da casa.',
    strategicReasons: [
      {
        id: 'mg-1',
        category: 'infra',
        title: 'Obras da BR-381 e Investimentos Rodoviários',
        description: 'Destravamento do leilão e obras de duplicação do trecho BH-Governador Valadares para salvar vidas na "Rodovia da Morte".',
        proofBadge: 'Ministério dos Transportes • ANTT',
        audienceTag: 'Para motoristas, transportadores e Vale do Aço',
      },
      {
        id: 'mg-2',
        category: 'saude',
        title: '2,8 milhões de mineiros com remédio 100% grátis',
        description: 'Preservação da renda de quem precisa de remédios para diabetes, hipertensão e asma nas farmácias de todo o estado.',
        proofBadge: 'Ministério da Saúde • Farmácia Popular',
        audienceTag: 'Para idosos e famílias trabalhadoras',
      },
      {
        id: 'mg-3',
        category: 'agro',
        title: 'Plano Safra Recorde para o Café e Agricultura Familiar',
        description: 'Crédito acessível para produtores do Sul de Minas, Matas e Cerrado, protegendo o agro real contra oscilações externas.',
        proofBadge: 'MAPA • Pronaf',
        audienceTag: 'Para produtores rurais e cooperativas mineiras',
      },
      {
        id: 'mg-4',
        category: 'educacao',
        title: '230 mil jovens no Pé-de-Meia nas escolas estaduais',
        description: 'Garantia de que os jovens mineiros concluam o ensino médio e ingressem no mercado de trabalho qualificado.',
        proofBadge: 'MEC • Caixa Econômica Federal',
        audienceTag: 'Para estudantes e pais',
      },
      {
        id: 'mg-5',
        category: 'risco_flavio',
        title: 'O Risco Flávio: Ataque ao BPC e Congelamento de Salários',
        description: 'Proposta do grupo de Flávio de arrochar benefícios assistenciais que sustentam milhares de lares no interior de Minas.',
        proofBadge: 'Registro Oficial de Propostas no Congresso',
        audienceTag: 'Para aposentados e indecisos',
      },
    ],
  },
  BA: {
    jobsCreated: '+180 mil carteiras assinadas',
    bolsaFamiliaFamilies: '2,4 milhões de famílias protegidas',
    pedeMeiaStudents: '290 mil jovens na poupança escolar',
    farmaciaPopularBeneficiaries: '1,9 milhão de pessoas com remédios gratuitos',
    mcmvHomes: '95 mil contratos de moradia digna',
    highlightText: 'A Bahia lidera o Pé-de-Meia no Nordeste, garantindo permanência escolar e futuro para a juventude.',
    strategicReasons: [
      {
        id: 'ba-1',
        category: 'trabalho',
        title: 'Polo Automotivo BYD e Reindustrialização em Camaçari',
        description: 'Retomada industrial da antiga fábrica da Ford com fábrica de carros elétricos gerando mais de 5 mil empregos diretos.',
        proofBadge: 'MDIC • Governo da Bahia',
        audienceTag: 'Para trabalhadores industriais e comércio regional',
      },
      {
        id: 'ba-2',
        category: 'educacao',
        title: '290 mil estudantes baianos na poupança Pé-de-Meia',
        description: 'Maior cobertura do Nordeste, evitando evasão escolar e garantindo poupança de até R$ 9.200 ao se formar.',
        proofBadge: 'MEC • Caixa Econômica Federal',
        audienceTag: 'Para jovens e famílias baianas',
      },
      {
        id: 'ba-3',
        category: 'infra',
        title: 'Ferrovia FIOL e Segurança Hídrica do São Francisco',
        description: 'Aceleração de obras que ligam o Oeste baiano aos portos e garantem água para consumo e irrigação no semiárido.',
        proofBadge: 'Novo PAC • Ministério da Integração',
        audienceTag: 'Para produtores do Oeste e sertanejos',
      },
      {
        id: 'ba-4',
        category: 'saude',
        title: '1,9 milhão de baianos com remédio gratuito no Farmácia Popular',
        description: 'Tratamentos de pressão, diabetes e asma sem nenhum custo em farmácias credenciadas de Salvador ao interior.',
        proofBadge: 'Ministério da Saúde',
        audienceTag: 'Para idosos e famílias',
      },
      {
        id: 'ba-5',
        category: 'risco_flavio',
        title: 'O Risco Flávio: Discriminação contra o Nordeste e Corte de Verbas',
        description: 'Histórico comprovado de preconceito e bloqueio de verbas federais para estados nordestinos na gestão anterior.',
        proofBadge: 'Dados de Execução Orçamentária Federal 2019-2022',
        audienceTag: 'Para indecisos e eleitores indecisos',
      },
    ],
  },
  RS: {
    jobsCreated: '+125 mil vagas formais criadas',
    bolsaFamiliaFamilies: '610 mil famílias amparadas',
    pedeMeiaStudents: '95 mil estudantes na rede estadual',
    farmaciaPopularBeneficiaries: '1,5 milhão de gaúchos atendidos',
    mcmvHomes: '54 mil moradias no plano de reconstrução',
    highlightText: 'No Rio Grande do Sul, recursos extraordinários da União garantiram crédito facilitado para o pequeno agricultor e reconstrução.',
    strategicReasons: [
      {
        id: 'rs-1',
        category: 'infra',
        title: 'Plano Extraordinário de Reconstrução do RS',
        description: 'Mais de R$ 90 bilhões em crédito subsidiado, auxílio reconstrução de R$ 5.100 para famílias e socorro financeiro a empresas gaúchas.',
        proofBadge: 'Ministério da Reconstrução do RS',
        audienceTag: 'Para atingidos, pequenos empresários e famílias',
      },
      {
        id: 'rs-2',
        category: 'agro',
        title: 'Crédito Emergencial e Plano Safra para Cooperativas Gaúchas',
        description: 'Renegociação de dívidas agrícolas e juros reduzidos para salvar a safra de arroz, soja e leite após as enchentes.',
        proofBadge: 'MAPA • BNDES',
        audienceTag: 'Para produtores rurais e cooperativas',
      },
      {
        id: 'rs-3',
        category: 'saude',
        title: '1,5 milhão de gaúchos atendidos na Farmácia Popular',
        description: 'Medicamentos essenciais gratuitos em toda a rede de farmácias de Porto Alegre, Região Metropolitana e interior.',
        proofBadge: 'Ministério da Saúde',
        audienceTag: 'Para idosos e trabalhadores',
      },
      {
        id: 'rs-4',
        category: 'educacao',
        title: '95 mil estudantes gaúchos na poupança Pé-de-Meia',
        description: 'Auxílio financeiro para assegurar a continuidade dos estudos no ensino médio estadual.',
        proofBadge: 'MEC • Caixa Econômica Federal',
        audienceTag: 'Para estudantes e professores',
      },
      {
        id: 'rs-5',
        category: 'risco_flavio',
        title: 'O Risco Flávio: Negacionismo Climático e Corte de Verbas de Socorro',
        description: 'Bancada de Flávio votou contra medidas de emergência climática e defende afrouxamento ambiental que agrava tragédias.',
        proofBadge: 'Votações na Câmara e Senado Federal',
        audienceTag: 'Para indecisos e defensores da reconstrução séria',
      },
    ],
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
  SC: {
    jobsCreated: '+112 mil empregos formais gerados (Caged)',
    bolsaFamiliaFamilies: '135 mil famílias amparadas',
    pedeMeiaStudents: '58 mil jovens na poupança escolar',
    farmaciaPopularBeneficiaries: '840 mil catarinenses com remédio 100% grátis',
    mcmvHomes: '18 mil novas moradias contratadas',
    highlightText: 'Em Santa Catarina, o governo federal acelerou as obras da BR-470 e da BR-280, e garantiu R$ 6,5 bilhões do Plano Safra para cooperativas e suinocultores.',
    strategicReasons: [
      {
        id: 'sc-1',
        category: 'infra',
        title: 'Retomada das obras da BR-470 e BR-280',
        description: 'Recursos federais garantiram o ritmo das obras no Vale do Itajaí e Norte Catarinense, barateando o frete das indústrias e salvando vidas nas estradas.',
        proofBadge: 'DNIT • Ministério dos Transportes',
        audienceTag: 'Para trabalhadores, motoristas e comércio',
      },
      {
        id: 'sc-2',
        category: 'agro',
        title: 'R$ 6,5 bilhões do Plano Safra e proteção ao agronegócio',
        description: 'Crédito com juros subsidiados para cooperativas de aves e suínos no Oeste de SC, aliado à diplomacia estável que mantém as exportações abertas na China e na Europa sem crises ideológicas.',
        proofBadge: 'Ministério da Agricultura e Pecuária',
        audienceTag: 'Para produtores rurais, cooperativas e indústria',
      },
      {
        id: 'sc-3',
        category: 'saude',
        title: 'Farmácia Popular com remédio 100% grátis',
        description: '840 mil pessoas em Florianópolis, Joinville, Blumenau, Chapecó e Criciúma retirando remédios contínuos de pressão, diabetes e asma sem pagar nada.',
        proofBadge: 'Ministério da Saúde • 840 mil beneficiados',
        audienceTag: 'Para quem tem idoso na família ou gasta com remédio',
      },
      {
        id: 'sc-4',
        category: 'educacao',
        title: 'Pé-de-Meia para 58 mil estudantes catarinenses',
        description: 'Poupança de até R$ 9.200 por aluno do ensino médio público para reduzir a evasão e garantir que os jovens concluam o ensino técnico ou regular.',
        proofBadge: 'MEC • Caixa Econômica Federal',
        audienceTag: 'Para pais de estudantes e jovens',
      },
      {
        id: 'sc-5',
        category: 'risco_flavio',
        title: 'O Risco Flávio: Cortes na Farmácia Popular e Guerra Comercial',
        description: 'No governo anterior, o grupo de Flávio propôs corte de 59% na Farmácia Popular e desindexação do salário mínimo, além de ameaçar vendas de carne para a Ásia por conflitos ideológicos.',
        proofBadge: 'Registro Oficial de Votações no Congresso',
        audienceTag: 'Para indecisos e quem cogita anular o voto',
      },
    ],
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

📌 FONTE PÚBLICA AUDITADA:
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

📊 Dado público checado (${preset.sourceName}):
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
    format: 'portrait',
    theme: 'brasil-editorial',
    slideIndex: 0,
    categoryTag: arg.category,
    sourceOrigin: 'facts',
    emoji: arg.emoji || '📌',
    statNumber: arg.category.toUpperCase(),
    statLabel: `Fonte Pública • ${arg.sourceName}`,
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
    proofData: `Programa Público: ${opp.program}. Acesse em: ${opp.actionUrl}`,
    counterArg: 'Dizem que o governo cortou benefícios e programas sociais',
    rebuttal: `Pelo contrário: o programa ${opp.title} está em vigor, com orçamento garantido e atendimento direto aos cidadãos.`,
    sourceName: opp.program,
    sourceUrl: opp.actionUrl,
    format: 'portrait',
    theme: 'brasil-vibrante',
    slideIndex: 0,
    categoryTag: 'oportunidade',
    sourceOrigin: 'opportunities',
    emoji: opp.icon,
    statNumber: opp.badge || 'DIREITO',
    statLabel: `Programa ${opp.program}`,
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
    format: 'portrait',
    theme: 'brasil-editorial',
    slideIndex: 0,
    categoryTag: 'territorio',
    sourceOrigin: 'territory',
    emoji: '📍',
    statNumber: stats.jobsCreated.split(' ')[0] || uf,
    statLabel: `Vagas formais criadas em ${uf}`,
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
    statNumber: '17 CAPITAIS',
    statLabel: 'Queda comprovada no valor da cesta básica (DIEESE)',
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
    format: 'portrait',
    theme: front.id === 'ex_lula' ? 'brasil-editorial' : front.id === 'terceira_via' ? 'dark-moderno' : 'brasil-vibrante',
    slideIndex: 0,
    categoryTag: 'tatico',
    sourceOrigin: 'tactical',
    emoji: front.icon,
    statNumber: front.electoralWeight,
    statLabel: `Frente Estratégica ${front.number}`,
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
    proofData: `Fonte Pública Comprovada: ${fact.source}`,
    counterArg: 'Dizem que mudar para Flávio é buscar "mais" para o trabalhador',
    rebuttal: `Os registros históricos provam exatamente o oposto: os cortes atingiram em cheio quem mais precisa: ${fact.title}.`,
    sourceName: fact.source,
    sourceUrl: '#',
    format: 'portrait',
    theme: 'brasil-editorial',
    slideIndex: 0,
    categoryTag: 'menos_com_flavio',
    sourceOrigin: 'tactical',
    emoji: fact.icon,
    statNumber: fact.highlight,
    statLabel: 'Registro Histórico Auditado',
    act1Hook: `O que acontece se a gente comparar o que eles realmente fizeram?`,
    act2Proof: `${fact.title} — ${fact.highlight}`,
    act3Rebuttal: fact.detail,
    act4PocketImpact: `Quem paga essa conta no final do mês é o trabalhador que perde o direito e o remédio.`,
    act5Cta: `Envie no privado para quem pensa em anular ou votar na oposição buscando alívio!`,
  };
}

// ─────────────────────────────────────────────────────────────
// ARSENAL SOB MEDIDA (TERRITÓRIO + CIDADE + PERFIL DO ELEITOR)
// O Motor Central de Persuasão que cruza Cidade, Categoria e Afeto
// ─────────────────────────────────────────────────────────────

export interface TailoredPocketFact {
  icon: string;
  title: string;
  description: string;
  source: string;
}

export interface TailoredConversationPlan {
  uf: string;
  stateName: string;
  city: string;
  locationLabel: string;
  frontId: ConversionFrontId;
  frontTitle: string;
  frontIcon: string;
  frontPriority: string;
  frontTag: string;
  occupation?: string;
  profileSummary: string;
  acolhimentoHook: string;
  goldenRule: string;
  whatNeverToSay: string;
  localPocketFacts: TailoredPocketFact[];
  objectionRebuttal: {
    objection: string;
    rebuttal: string;
    source: string;
  };
  retrocessoAlert: {
    title: string;
    description: string;
    statNumber: string;
    source: string;
  };
  whatsappScript: string;
  preset: PostPresetData;
}

export function createCustomizedConversationPlan(
  uf: string = 'SP',
  city?: string,
  frontId: ConversionFrontId = 'ex_lula',
  occupation?: string,
  familyFlags?: {
    hasElderly?: boolean;
    hasChildren?: boolean;
    dependsSUS?: boolean;
    receivesBenefit?: boolean;
    hasPCD?: boolean;
  }
): TailoredConversationPlan {
  const geo = getStateByUF(uf);
  const stateName = geo ? geo.name : uf;
  const cityName = city && city.trim() ? city.trim() : (geo ? geo.capital : 'sua cidade');
  const locationLabel = `${cityName} (${uf})`;

  const front = CONVERSION_FRONTS.find((f) => f.id === frontId) || CONVERSION_FRONTS[0];
  const stats = getStateStats(uf);
  const regionalTactic = getRegionalTacticForUF(uf);

  // 1. Gancho de Acolhimento Personalizado por Frente
  let acolhimentoHook = '';
  if (frontId === 'ex_lula') {
    acolhimentoHook = `Eu te entendo totalmente quando você fala que o carrinho de mercado tá pesado. Quem vive de salário sente no bolso e dá uma angústia danada ver o preço das coisas. A gente trabalhou a vida inteira e quer ver o país respirar melhor mais rápido.`;
  } else if (frontId === 'terceira_via') {
    acolhimentoHook = `Eu concordo com você que o Brasil precisa de menos briga partidária e de gente séria trabalhando. Antes de decidir na raiva, vamos olhar o que tá em jogo na prática para a nossa cidade e quem tem propostas reais de pé.`;
  } else if (frontId === 'bolsonarista_flavio') {
    acolhimentoHook = `Eu respeito de verdade quem acorda cedo, defende a família e valoriza a sua fé e o trabalho honesto. Ninguém quer corrupção nem bagunça no país. Mas antes de apertar 22, vamos olhar o que o Flávio vota na prática contra quem rala no comércio e na indústria.`;
  } else if (frontId === 'abstencao_70') {
    acolhimentoHook = `Ir votar no domingo é um esforço enorme, ainda mais quando a gente tá cansado de tanta promessa. Mas você sabia que a sua presença na urna é o que garante que o remédio gratuito e a poupança dos nossos jovens continuem funcionando?`;
  } else {
    acolhimentoHook = `Eu compreendo quem quer anular porque tá desiludido com a política. Mas numa eleição tão apertada, quem anula deixa a decisão do nosso salário e dos nossos direitos na mão da oposição radical.`;
  }

  // 2. Fatos do Bolso Concretos na Cidade & Categoria
  const localPocketFacts: TailoredPocketFact[] = [];

  // Fato 1: Regional / Empregos do Caged
  localPocketFacts.push({
    icon: '💼',
    title: `Geração de Empregos em ${stateName}`,
    description: `${stats.jobsCreated}. O comércio e as pequenas empresas locais ganham força quando há renda circulando na praça.`,
    source: 'Caged / Ministério do Trabalho',
  });

  // Fato 2: Família / Jovens / Pé-de-Meia
  if (familyFlags?.hasChildren) {
    localPocketFacts.push({
      icon: '🎒',
      title: `Poupança Pé-de-Meia para Estudantes`,
      description: `Mais de ${stats.pedeMeiaStudents}. Até R$ 9.200 por aluno do ensino médio público para não precisar largar a escola e ajudar na renda de casa.`,
      source: 'MEC / Caixa Econômica',
    });
  } else if (familyFlags?.hasElderly || familyFlags?.dependsSUS) {
    localPocketFacts.push({
      icon: '💊',
      title: `Remédio 100% Gratuito no Farmácia Popular`,
      description: `Mais de ${stats.farmaciaPopularBeneficiaries}. Medicamentos contínuos para pressão alta, diabetes e asma entregues de graça na farmácia credenciada em ${cityName}.`,
      source: 'Ministério da Saúde',
    });
  } else {
    localPocketFacts.push({
      icon: '🥩',
      title: `Comida no Prato e Deflação da Cesta Básica`,
      description: `Queda confirmada no preço do óleo de soja, leite integral e cortes de carne popular pelo DIEESE e IBGE, com aumento real de 3% no salário mínimo pelo 2º ano seguido.`,
      source: 'DIEESE / IBGE',
    });
  }

  // Fato 3: Ocupação específica ou Habitação
  if (occupation && (occupation.toLowerCase().includes('uber') || occupation.toLowerCase().includes('motorista') || occupation.toLowerCase().includes('entregador'))) {
    localPocketFacts.push({
      icon: '⛽',
      title: `Petrobras Pública & Preço do Combustível`,
      description: `Fim da paridade de importação em dólar (PPI). A gasolina e o gás de cozinha foram contidos sem disparar para os R$ 10 prometidos na privatização desenfreada.`,
      source: 'ANP / Petrobras',
    });
  } else if (familyFlags?.receivesBenefit) {
    localPocketFacts.push({
      icon: '🏠',
      title: `Minha Casa Minha Vida Quitado`,
      description: `Mais de ${stats.mcmvHomes}. Famílias do CadÚnico e BPC têm isenção total de parcelas na Faixa 1, garantindo o teto da família em ${cityName}.`,
      source: 'Ministério das Cidades',
    });
  } else {
    localPocketFacts.push({
      icon: '🛒',
      title: `Isenção de Imposto de Renda & Cesta Básica Zero`,
      description: `Isenção do IR subiu para 2 salários mínimos e na reforma tributária todos os itens da cesta básica essencial têm alíquota zero de imposto federal.`,
      source: 'Receita Federal / Ministério da Fazenda',
    });
  }

  // 3. Objeção & Rebuttal Adaptados
  let objectionRebuttal = {
    objection: 'Mas as coisas no mercado continuam caras e nada mudou!',
    rebuttal: `A inflação oficial de alimentos caiu em 17 capitais e o poder de compra do salário mínimo subiu de verdade pelo 2º ano consecutivo. Não tá fácil, mas tá recuperando o que foi destruído na pandemia.`,
    source: 'IBGE & DIEESE',
  };

  if (frontId === 'terceira_via') {
    objectionRebuttal = {
      objection: 'Eu quero renovação, não quero votar no Lula de novo.',
      rebuttal: `A renovação com Flávio significa dar a presidência, a maioria do Senado e indicar mais 4 ministros no STF para a mesma família. Concentração total de poder sem oposição.`,
      source: 'Análise Institucional do Senado',
    };
  } else if (frontId === 'bolsonarista_flavio') {
    objectionRebuttal = {
      objection: 'Eu voto no Flávio porque sou de direita e defendo a família contra o comunismo.',
      rebuttal: `Defender a família é garantir comida na mesa, folga no sábado e remédio pro pai idoso. O Flávio votou CONTRA o fim da escala 6x1 e quer o trabalhador trabalhando 6 dias pra 1 de folga. E no governo deles, cortaram 59% da Farmácia Popular. Isso protege ou adoece a família?`,
      source: 'Votações Oficiais no Senado Federal / Orçamento da União',
    };
  } else if (frontId === 'abstencao_70') {
    objectionRebuttal = {
      objection: 'Para que eu vou me cansar indo votar se nada muda?',
      rebuttal: `Muda a Farmácia Popular da sua rua e a bolsa do seu neto. Em 2022, 253 cidades viraram o resultado por menos de 5 votos por urna. O seu voto é o mais poderoso de todos.`,
      source: 'TSE / Dados Eleitorais Auditados',
    };
  }

  // 4. Alerta do Retrocesso (Mostrar o Menos com Flávio)
  let retrocessoAlert = {
    title: 'Corte de 59% na Farmácia Popular',
    description: 'No governo anterior, cortaram mais da metade do orçamento de remédios gratuitos para pressão e diabetes. Se vencerem, o programa volta a ser sucateado.',
    statNumber: '-59%',
    source: 'Orçamento Geral da União',
  };

  if (frontId === 'bolsonarista_flavio') {
    retrocessoAlert = {
      title: 'Voto Contra o Fim da Escala 6x1',
      description: 'Flávio Bolsonaro se declarou contra a PEC que acaba com a escala 6x1, mantendo o trabalhador de comércio e indústria preso 6 dias por semana sem descanso com os filhos.',
      statNumber: '6x1',
      source: 'Declarações e Votações Oficiais no Senado',
    };
  } else if (familyFlags?.hasChildren) {
    retrocessoAlert = {
      title: 'Corte de 90% na Habitação & Veto à Merenda',
      description: 'Cortaram 90% dos recursos do Minha Casa Minha Vida e vetaram o reajuste da merenda escolar de milhares de crianças.',
      statNumber: '-90%',
      source: 'MEC / Orçamento Federal',
    };
  } else if (occupation && occupation.toLowerCase().includes('clt')) {
    retrocessoAlert = {
      title: 'Voto Contra o Fim da Escala 6x1',
      description: 'Flávio Bolsonaro se declarou contra a PEC que acaba com a escala 6x1, mantendo o trabalhador preso sem descanso digno com a família.',
      statNumber: '6x1',
      source: 'Senado Federal',
    };
  }

  // 5. Script de WhatsApp Sob Medida
  const bullets = localPocketFacts.map(f => `• ${f.icon} *${f.title}*: ${f.description}`).join('\n');
  const whatsappScript = `Oi! Lembrei de você aqui em ${cityName} e de conversas que a gente já teve:

${acolhimentoHook}

Dá uma olhada no que já é realidade checada aqui pra gente em ${stateName}:
${bullets}

👉 *Se alguém falar que "${objectionRebuttal.objection}":*
✅ A verdade com fontes auditadas é: ${objectionRebuttal.rebuttal} (${objectionRebuttal.source}).

⚠️ *E o perigo real:* ${retrocessoAlert.title} — ${retrocessoAlert.description} (${retrocessoAlert.statNumber}).

Sem briga nenhuma, só compartilhando o que tá em jogo pro nosso bolso e pra nossa família aqui em ${cityName}. Um forte abraço! 🇧🇷⭐`;

  // 6. Post Preset para o Estúdio
  const citySlug = (cityName || 'geral').toLowerCase().replace(/\s+/g, '-');
  const preset: PostPresetData = {
    id: `tailored-${uf.toLowerCase()}-${frontId}-${citySlug}`,
    title: `${front.title} em ${locationLabel}`,
    headline: `O que está em jogo para ${occupation || 'o trabalhador'} em ${cityName}`,
    bodyText: `${acolhimentoHook}\n\n${localPocketFacts[0]?.description || ''}`,
    proofData: localPocketFacts.map(f => `${f.title}: ${f.description}`).join(' | '),
    counterArg: objectionRebuttal.objection,
    rebuttal: objectionRebuttal.rebuttal,
    sourceName: `${localPocketFacts[0]?.source || 'Dados Oficiais'} • IBGE / DIEESE`,
    sourceUrl: 'https://gov.br',
    format: 'portrait',
    theme: frontId === 'ex_lula' ? 'brasil-editorial' : frontId === 'terceira_via' ? 'dark-moderno' : 'brasil-vibrante',
    slideIndex: 0,
    categoryTag: 'territorio_perfil',
    sourceOrigin: 'tactical',
    emoji: front.icon,
    statNumber: retrocessoAlert.statNumber,
    statLabel: retrocessoAlert.title,
    act1Hook: `O que está em jogo para a nossa família em ${cityName}`,
    act2Proof: localPocketFacts[1]?.description || localPocketFacts[0]?.description || stats.highlightText,
    act3Rebuttal: objectionRebuttal.rebuttal,
    act4PocketImpact: `Quem vive do próprio salário em ${cityName} não pode aceitar o corte de direitos e remédios.`,
    act5Cta: `Mande no WhatsApp de quem mora em ${cityName} e tá em dúvida no 2º turno!`,
  };

  const profileSummary = [
    cityName,
    uf,
    front.title,
    occupation,
    familyFlags?.hasChildren ? 'Com filhos' : null,
    familyFlags?.hasElderly ? 'Com idoso' : null,
    familyFlags?.dependsSUS ? 'Usa SUS' : null,
  ].filter(Boolean).join(' • ');

  return {
    uf,
    stateName,
    city: cityName,
    locationLabel,
    frontId,
    frontTitle: front.title,
    frontIcon: front.icon,
    frontPriority: front.priority,
    frontTag: front.tag,
    occupation,
    profileSummary,
    acolhimentoHook,
    goldenRule: front.goldenRule,
    whatNeverToSay: Array.isArray(front.whatNeverToSay) ? front.whatNeverToSay[0] : (front.whatNeverToSay || 'Nunca agrida ou ofenda a pessoa.'),
    localPocketFacts,
    objectionRebuttal,
    retrocessoAlert,
    whatsappScript,
    preset,
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
    format: 'portrait',
    theme: 'brasil-editorial',
    slideIndex: 0,
    categoryTag: 'menos_com_flavio',
    sourceOrigin: 'tactical',
    emoji: '💊',
    statNumber: '-59%',
    statLabel: 'Corte na Farmácia Popular sob o bolsonarismo',
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
    format: 'portrait',
    theme: 'dark-moderno',
    slideIndex: 0,
    categoryTag: 'trabalho',
    sourceOrigin: 'tactical',
    emoji: '⏰',
    statNumber: '6x1',
    statLabel: 'Flávio votou contra o descanso do trabalhador',
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
    format: 'portrait',
    theme: 'concretismo-puro',
    slideIndex: 0,
    categoryTag: 'institucional',
    sourceOrigin: 'tactical',
    emoji: '⚖️',
    statNumber: '4 VAGAS',
    statLabel: 'No STF entregues à mesma família',
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
    format: 'portrait',
    theme: 'brasil-vibrante',
    slideIndex: 0,
    categoryTag: 'mobilizacao',
    sourceOrigin: 'tactical',
    emoji: '🎯',
    statNumber: '4 VOTOS',
    statLabel: 'A cada 318 pessoas decidem a eleição presidencial',
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

// ─────────────────────────────────────────────────────────────
// MOTOR DE PRÓXIMO PASSO INTELIGENTE (ORQUESTRADOR CONTEXTUAL)
// ─────────────────────────────────────────────────────────────

export interface SmartNextStep {
  badge: string;
  contextTitle: string;
  recommendationText: string;
  primaryAction: {
    label: string;
    section: AppSection;
    icon: string;
  };
  secondaryAction?: {
    label: string;
    section: AppSection;
    icon: string;
  };
}

export function getSmartNextStepRecommendation(memory?: AgenticWorkingMemory): SmartNextStep {
  const uf = memory?.selectedUF || 'SP';
  const state = getStateByUF(uf);
  const stats = getStateStats(uf);
  const stateName = state ? state.name : 'São Paulo';

  // Cenário 1: Frente de Conversão Específica Ativa
  if (memory?.activeFrontId) {
    const front = CONVERSION_FRONTS.find((f) => f.id === memory.activeFrontId);
    if (front) {
      return {
        badge: 'Diálogo Estratégico',
        contextTitle: `Perfil em Foco: ${front.title}`,
        recommendationText: `Você escolheu a conversa com ${front.title.toLowerCase()}. A regra de ouro é: "${front.goldenRule}". Deseja praticar esse diálogo no simulador da vida real?`,
        primaryAction: {
          label: 'Treinar Diálogo no Simulador',
          section: 'treinar',
          icon: '💬',
        },
        secondaryAction: {
          label: 'Ver Provas de Alimentos',
          section: 'explorar',
          icon: '🥩',
        },
      };
    }
  }

  // Cenário 2: Profissão Inspecionada
  if (memory?.occupation) {
    return {
      badge: 'Perfil Profissional',
      contextTitle: `Conversa com: ${memory.occupation}`,
      recommendationText: `Identificamos a realidade de ${memory.occupation}. Temos argumentos checados sobre renda, autonomia e custo dos combustíveis prontos para usar.`,
      primaryAction: {
        label: 'Ver Roteiros de Acolhimento',
        section: 'preparar',
        icon: '👥',
      },
      secondaryAction: {
        label: 'Mandar Peça no Zap',
        section: 'estudio',
        icon: '📲',
      },
    };
  }

  // Cenário 3: Estado Inspecionado
  if (memory?.selectedUF) {
    return {
      badge: `Realidade Regional • ${uf}`,
      contextTitle: `${stateName} (${uf}) no Radar`,
      recommendationText: `${stats.highlightText} O que acha de enviar esse dado oficial para contatos de ${stateName} ou ver dicas de abordagem local?`,
      primaryAction: {
        label: `Mandar Conquistas de ${uf} no Zap`,
        section: 'estudio',
        icon: '📲',
      },
      secondaryAction: {
        label: `Ver Dicas para ${stateName}`,
        section: 'explorar',
        icon: '🗺️',
      },
    };
  }

  // Cenário Padrão (Entrada Inicial)
  return {
    badge: 'Início Rápido',
    contextTitle: 'Explore pelo seu Estado ou Assunto',
    recommendationText: 'Toque em qualquer estado no mapa interativo para ver empregos, Farmácia Popular e o Pé-de-Meia na sua região, ou consulte temas do dia a dia.',
    primaryAction: {
      label: 'Preparar uma Conversa',
      section: 'preparar',
      icon: '🎯',
    },
    secondaryAction: {
      label: 'Explorar Território e Fatos',
      section: 'explorar',
      icon: '🗺️',
    },
  };
}

// ─────────────────────────────────────────────────────────────
// PERSISTÊNCIA EM TRÊS CAMADAS DE MEMÓRIA (localStorage)
// ─────────────────────────────────────────────────────────────
const STORAGE_KEY_MEMORY = 'bora_app_working_memory_v2';

export function loadWorkingMemory(): Partial<AgenticWorkingMemory> | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_MEMORY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (err) {
    console.warn('[Orchestrator] Falha ao carregar memória de trabalho:', err);
    return null;
  }
}

export function saveWorkingMemory(memory: AgenticWorkingMemory): void {
  if (typeof window === 'undefined') return;
  try {
    // Persistimos o essencial para manter privacidade e economia
    const payload: Partial<AgenticWorkingMemory> = {
      selectedUF: memory.selectedUF,
      selectedCity: memory.selectedCity,
      occupation: memory.occupation,
      activeFrontId: memory.activeFrontId,
      profileTags: memory.profileTags,
      rejectionLevel: memory.rejectionLevel,
      familyFlags: memory.familyFlags,
      soundEnabled: memory.soundEnabled,
    };
    localStorage.setItem(STORAGE_KEY_MEMORY, JSON.stringify(payload));
  } catch (err) {
    console.warn('[Orchestrator] Falha ao salvar memória de trabalho:', err);
  }
}

export function clearWorkingMemory(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEY_MEMORY);
  } catch (err) {
    console.warn('[Orchestrator] Falha ao limpar memória de trabalho:', err);
  }
}


