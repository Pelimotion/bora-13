// ═══════════════════════════════════════════════════════════════
// BORA APP — Catálogo de Oportunidades, Benefícios & Direitos Reais
// O que o cidadão ou a família dele pode fazer e acessar hoje
// ═══════════════════════════════════════════════════════════════

import { ProfileTag } from './arguments';

export interface Opportunity {
  id: string;
  title: string;
  program: string;
  headline: string;
  description: string;
  whoIsEligible: string;
  howToAccess: string;
  actionUrl: string;
  actionLabel: string;
  badge: string;
  icon: string;
  targetTags: ProfileTag[];
}

export const OPPORTUNITIES_DATABASE: Opportunity[] = [
  {
    id: 'opp-pe-de-meia',
    title: 'Poupança Pé-de-Meia',
    program: 'Programa Pé-de-Meia (MEC / Caixa)',
    headline: 'Até R$ 9.200 para seu filho(a) concluir o Ensino Médio',
    description: 'Incentivo financeiro mensal para estudantes da rede pública não abandonarem os estudos para trabalhar. O dinheiro rende numa poupança Caixa em nome do aluno.',
    whoIsEligible: 'Estudantes de 14 a 24 anos matriculados no Ensino Médio público e inscritos no CadÚnico.',
    howToAccess: 'Consulte o app "Jornada do Estudante" ou procure a secretaria da escola estadual. A conta é aberta automaticamente na Caixa Tem.',
    actionUrl: 'https://www.gov.br/mec/pt-br/pe-de-meia',
    actionLabel: 'Verificar no MEC',
    badge: 'Educação & Renda',
    icon: '🎒',
    targetTags: ['mae', 'pai', 'jovem', 'universitario', 'periferia', 'generico'],
  },
  {
    id: 'opp-farmacia-popular',
    title: 'Remédios Gratuitos no Farmácia Popular',
    program: 'Programa Farmácia Popular do Brasil',
    headline: 'Mais de 40 medicamentos 100% gratuitos para pressão, diabetes e asma',
    description: 'Medicamentos essenciais de uso contínuo com gratuidade total. Mulheres também têm acesso a anticoncepcionais e dignidade menstrual sem custo.',
    whoIsEligible: 'Qualquer brasileiro com CPF, receita médica (SUS ou privada) e documento com foto.',
    howToAccess: 'Basta ir a qualquer farmácia com a faixa "Aqui Tem Farmácia Popular" com seu RG, CPF e a receita médica válida.',
    actionUrl: 'https://www.gov.br/saude/pt-br/composicao/sectics/daf/farmacia-popular',
    actionLabel: 'Consultar Lista de Remédios',
    badge: 'Saúde SUS',
    icon: '💊',
    targetTags: ['sus', 'idoso_familia', 'aposentado', 'mae', 'generico'],
  },
  {
    id: 'opp-desenrola',
    title: 'Desenrola Brasil: Limpeza de Nome',
    program: 'Programa Desenrola Brasil (Fazenda)',
    headline: 'Descontos de até 96% em dívidas bancárias, cartão e contas básicas',
    description: 'Possibilidade real de sair do SPC/Serasa com parcelas a partir de R$ 30 por mês e taxas de juros reduzidas garantidas pelo Tesouro.',
    whoIsEligible: 'Pessoas físicas com renda de até 2 salários mínimos ou inscritas no CadÚnico com dívidas negativadas.',
    howToAccess: 'Acesse desenrola.gov.br com seu login Gov.br prata/ouro ou compareça a qualquer agência dos Correios para atendimento presencial gratuito.',
    actionUrl: 'https://desenrola.gov.br',
    actionLabel: 'Negociar Dívidas',
    badge: 'Crédito & Dignidade',
    icon: '💳',
    targetTags: ['desempregado', 'autonomo', 'clt', 'comerciante', 'generico'],
  },
  {
    id: 'opp-mcmv-gratis',
    title: 'Minha Casa Minha Vida com Imóvel Quitado',
    program: 'Minha Casa Minha Vida — Faixa 1',
    headline: 'Moradia 100% gratuita para quem recebe BPC ou Bolsa Família',
    description: 'Quem é beneficiário do Bolsa Família ou tem familiar que recebe o BPC/LOAS está isento de pagar prestações de imóveis contratados na Faixa 1.',
    whoIsEligible: 'Famílias beneficiárias do Bolsa Família ou BPC inscritas no Cadastro Único.',
    howToAccess: 'Procure o setor de habitação da prefeitura da sua cidade ou o CRAS do seu bairro para atualizar seu cadastro.',
    actionUrl: 'https://www.gov.br/cidades/pt-br/assuntos/habitacao/minha-casa-minha-vida',
    actionLabel: 'Regras da Moradia',
    badge: 'Moradia Digna',
    icon: '🏠',
    targetTags: ['bpc', 'aposentado', 'pcd_familia', 'mae', 'periferia'],
  },
  {
    id: 'opp-acredita-mei',
    title: 'Programa Acredita: Crédito Pro MEI',
    program: 'Programa Acredita no Primeiro Passo',
    headline: 'Crédito com garantia do governo para fazer seu negócio crescer',
    description: 'Microcrédito orientado para empreendedores populares, MEIs e autônomos sem exigência de garantias abusivas ou juros predatórios de agiotas.',
    whoIsEligible: 'Microempreendedores Individuais (MEI) e trabalhadores autônomos informais.',
    howToAccess: 'Procure agências da Caixa, Banco do Brasil, Banco do Nordeste ou cooperativas de crédito credenciadas (Sicoob/Sicredi).',
    actionUrl: 'https://www.gov.br/fazenda/pt-br/assuntos/programa-acredita',
    actionLabel: 'Ver Linhas de Crédito',
    badge: 'Empreendedorismo',
    icon: '🚀',
    targetTags: ['comerciante', 'autonomo', 'pj', 'motorista', 'entregador'],
  },
  {
    id: 'opp-pronaf-agro',
    title: 'Pronaf — Crédito Rural Familiar',
    program: 'Plano Safra da Agricultura Familiar',
    headline: 'Juros de apenas 2% a 4% ao ano para compra de máquinas e sementes',
    description: 'Linha de crédito especial com bônus de adimplência para produção de alimentos sustentáveis e compra de implementos.',
    whoIsEligible: 'Agricultores familiares, assentados da reforma agrária, pescadores artesanais e comunidades tradicionais com DAP/CAF ativa.',
    howToAccess: 'Procure o sindicato dos trabalhadores rurais, a Emater/órgão de extensão rural do seu estado ou agências do BB/Caixa.',
    actionUrl: 'https://www.gov.br/mda/pt-br/pronaf',
    actionLabel: 'Consultar Pronaf',
    badge: 'Campo & Agro',
    icon: '🌾',
    targetTags: ['rural', 'agronegocio', 'autonomo'],
  },
  {
    id: 'opp-tarifa-social-luz',
    title: 'Tarifa Social de Energia Elétrica',
    program: 'Luz para Todos / Tarifa Social',
    headline: 'Desconto de até 65% na conta de luz todos os meses',
    description: 'Desconto automático na fatura de eletricidade para famílias que vivem com orçamento apertado.',
    whoIsEligible: 'Famílias no CadÚnico com renda per capita de até meio salário mínimo ou com pessoas que dependem de aparelhos elétricos de saúde.',
    howToAccess: 'O benefício é cruzado automaticamente pelo CPF na distribuidora de energia. Certifique-se de que o titular da conta seja a pessoa do CadÚnico.',
    actionUrl: 'https://www.gov.br/mme/pt-br/assuntos/secretarias/energia-eletrica/tarifa-social',
    actionLabel: 'Ver Descontos da Conta',
    badge: 'Economia Doméstica',
    icon: '⚡',
    targetTags: ['bpc', 'pcd_familia', 'desempregado', 'mae', 'generico'],
  },
];

/** Filtra oportunidades relevantes para o perfil do usuário */
export function getOpportunitiesForProfile(tags: ProfileTag[]): Opportunity[] {
  const tagSet = new Set(tags);
  tagSet.add('generico');

  const scored = OPPORTUNITIES_DATABASE.map(opp => {
    const matches = opp.targetTags.filter(t => tagSet.has(t));
    return {
      ...opp,
      matchCount: matches.length,
    };
  });

  // Ordena por relevância e retorna as 4 principais
  return scored
    .sort((a, b) => b.matchCount - a.matchCount)
    .slice(0, 4);
}
