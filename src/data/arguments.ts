// ═══════════════════════════════════════════════════════════════
// BORA APP — Base de Argumentos Factuais
// Catálogo completo de argumentos verificados para persuasão
// baseada em dados reais e propostas políticas documentadas
// ═══════════════════════════════════════════════════════════════

export type PersuasionStage = 'acolhimento' | 'gatilho' | 'ponte';
export type Route = 'A' | 'B' | 'BOTH';
export type ProfileTag =
  | 'motorista'
  | 'entregador'
  | 'comerciante'
  | 'clt'
  | 'pj'
  | 'autonomo'
  | 'desempregado'
  | 'aposentado'
  | 'bpc'
  | 'sus'
  | 'mae'
  | 'pai'
  | 'idoso_familia'
  | 'pcd_familia'
  | 'evangelico'
  | 'catolico'
  | 'professor'
  | 'saude'
  | 'agronegocio'
  | 'servidor_publico'
  | 'jovem'
  | 'universitario'
  | 'rural'
  | 'periferia'
  | 'generico';

export interface Argument {
  id: string;
  category: string;
  targetProfiles: ProfileTag[];
  route: Route;
  stage: PersuasionStage;
  title: string;
  headline: string;
  scriptText: string;
  counterArgument?: string;
  rebuttal?: string;
  sourceName: string;
  sourceUrl: string;
  impactScore: number; // 1-10
  regions?: string[];
  emoji?: string;
}

export const ARGUMENTS_DATABASE: Argument[] = [
  // ═══════════════════════════════════════
  // COMBUSTÍVEL / PETROBRAS
  // ═══════════════════════════════════════
  {
    id: 'fuel-001',
    category: 'combustivel',
    targetProfiles: ['motorista', 'entregador', 'autonomo', 'comerciante', 'generico'],
    route: 'BOTH',
    stage: 'gatilho',
    title: 'Privatização da Petrobras e Preço do Combustível',
    headline: 'Gasolina pode passar de R$ 10 com privatização',
    scriptText: 'Você sabia que com a privatização da Petrobras, o preço da gasolina ficaria totalmente nas mãos do mercado internacional? Sem nenhum controle. Nos países que privatizaram suas estatais de petróleo, o combustível ficou em média 40% mais caro. Pro trabalhador que roda de carro ou moto, isso pode significar gasolina acima de R$ 10 o litro.',
    counterArgument: 'Mas a Petrobras é corrupta, tem que privatizar.',
    rebuttal: 'A corrupção se combate com transparência e punição dos corruptos, não vendendo a empresa mais lucrativa do Brasil. A Petrobras deu R$ 188 bilhões de lucro em 2022. Privatizar é entregar esse lucro pra acionista estrangeiro e ainda pagar mais caro na bomba.',
    sourceName: 'Relatório Anual Petrobras 2022',
    sourceUrl: 'https://www.petrobras.com.br/ri',
    impactScore: 9,
    emoji: '⛽',
  },
  {
    id: 'fuel-002',
    category: 'combustivel',
    targetProfiles: ['motorista', 'entregador', 'generico'],
    route: 'A',
    stage: 'ponte',
    title: 'Preço do Gás de Cozinha',
    headline: 'Gás de cozinha voltou a caber no bolso',
    scriptText: 'O botijão de gás que chegou a custar R$ 140 durante o governo anterior hoje está abaixo de R$ 100 em boa parte do país. O programa Gás para Todos já reduziu o preço para famílias de baixa renda. Privatizar a Petrobras significa acabar com qualquer possibilidade de controle de preço.',
    sourceName: 'ANP - Levantamento de Preços',
    sourceUrl: 'https://www.gov.br/anp/pt-br/assuntos/precos-e-defesa-da-concorrencia',
    impactScore: 8,
    emoji: '🔥',
  },

  // ═══════════════════════════════════════
  // SALÁRIO MÍNIMO / EMPREGO
  // ═══════════════════════════════════════
  {
    id: 'salary-001',
    category: 'salario',
    targetProfiles: ['clt', 'autonomo', 'comerciante', 'desempregado', 'generico'],
    route: 'BOTH',
    stage: 'gatilho',
    title: 'Desvinculação do Salário Mínimo',
    headline: 'Salário mínimo pode ficar congelado por anos',
    scriptText: 'A proposta de desvinculação do salário mínimo significa que ele deixaria de ser corrigido pela inflação e pelo crescimento do PIB. Na prática, seu salário ficaria parado enquanto tudo sobe de preço. É como receber um corte todo ano sem ninguém te avisar.',
    counterArgument: 'Mas o salário mínimo sobe todo ano de qualquer jeito.',
    rebuttal: 'Só sobe porque existe uma lei que obriga. A proposta é justamente acabar com essa obrigação. Sem a política de valorização, entre 2019 e 2022 o salário mínimo só teve reajuste pela inflação — o trabalhador não ganhou nada a mais. Com a nova política de valorização, o mínimo teve ganho real: mais poder de compra.',
    sourceName: 'DIEESE',
    sourceUrl: 'https://www.dieese.org.br/analisecestabasica/salarioMinimo.html',
    impactScore: 10,
    emoji: '💰',
  },
  {
    id: 'salary-002',
    category: 'salario',
    targetProfiles: ['comerciante', 'autonomo', 'generico'],
    route: 'A',
    stage: 'ponte',
    title: 'Impacto do Salário Mínimo no Comércio',
    headline: 'Quando o povo ganha mais, o comércio vende mais',
    scriptText: 'Cada R$ 1 de aumento no salário mínimo gera R$ 1,38 na economia local. Isso porque trabalhador com mais dinheiro gasta no bairro: padaria, mercado, farmácia. O congelamento do salário mínimo é ruim pra todo comerciante — menos dinheiro circulando é menos venda no seu caixa.',
    sourceName: 'IPEA - Multiplicador Fiscal',
    sourceUrl: 'https://www.ipea.gov.br',
    impactScore: 8,
    emoji: '🏪',
  },

  // ═══════════════════════════════════════
  // APOSENTADORIA / BPC / PREVIDÊNCIA
  // ═══════════════════════════════════════
  {
    id: 'bpc-001',
    category: 'previdencia',
    targetProfiles: ['aposentado', 'idoso_familia', 'pcd_familia', 'bpc', 'generico'],
    route: 'BOTH',
    stage: 'gatilho',
    title: 'Risco ao BPC e Aposentadorias',
    headline: 'BPC e aposentadorias em risco de corte',
    scriptText: 'O Benefício de Prestação Continuada (BPC) paga um salário mínimo para idosos e pessoas com deficiência que não conseguem se sustentar. A proposta de desvinculá-lo do salário mínimo significaria que esse benefício poderia ficar abaixo do mínimo — ou seja, a pessoa mais vulnerável recebendo menos do que o necessário para sobreviver.',
    counterArgument: 'Ninguém vai tirar aposentadoria de velho.',
    rebuttal: 'Não vão tirar de uma vez, vão desvalorizar aos poucos. É como a fervura do sapo: se você congela o valor enquanto tudo sobe, em poucos anos o benefício não paga nem o gás e o remédio. É exatamente isso que a desvinculação faz.',
    sourceName: 'Ministério da Previdência Social',
    sourceUrl: 'https://www.gov.br/previdencia',
    impactScore: 10,
    emoji: '👴',
  },
  {
    id: 'bpc-002',
    category: 'previdencia',
    targetProfiles: ['aposentado', 'idoso_familia', 'generico'],
    route: 'A',
    stage: 'ponte',
    title: 'Reajuste Real das Aposentadorias',
    headline: 'Aposentadorias com reajuste acima da inflação',
    scriptText: 'Com a política de valorização do salário mínimo, todas as aposentadorias e benefícios vinculados ao mínimo tiveram ganho real — ou seja, subiram mais que a inflação. Isso significa que o aposentado consegue comprar mais com o mesmo benefício. Sem essa política, o poder de compra vai caindo ano a ano.',
    sourceName: 'INSS / IBGE',
    sourceUrl: 'https://www.ibge.gov.br',
    impactScore: 9,
    emoji: '📈',
  },

  // ═══════════════════════════════════════
  // SAÚDE / SUS
  // ═══════════════════════════════════════
  {
    id: 'sus-001',
    category: 'saude',
    targetProfiles: ['sus', 'mae', 'pai', 'idoso_familia', 'pcd_familia', 'generico'],
    route: 'BOTH',
    stage: 'gatilho',
    title: 'Sucateamento do SUS',
    headline: 'SUS pode perder bilhões em investimento',
    scriptText: 'O SUS atende 190 milhões de brasileiros. A proposta de teto de gastos e desvinculação orçamentária pode tirar até R$ 30 bilhões por ano da saúde pública. Isso significa menos médicos, menos remédios gratuitos, filas maiores e menos cirurgias. Para quem depende do SUS, é a diferença entre tratar e esperar.',
    counterArgument: 'O SUS já é ruim mesmo, não vai fazer diferença.',
    rebuttal: 'O SUS é a maior rede de saúde pública do mundo. Faz 4 bilhões de procedimentos por ano. O problema não é o SUS em si, é quando cortam o investimento nele. Nos anos em que teve mais verba, a fila diminuiu. Nos anos de corte, aumentou. A solução é investir mais, não destruir.',
    sourceName: 'CNS - Conselho Nacional de Saúde',
    sourceUrl: 'https://conselho.saude.gov.br',
    impactScore: 9,
    emoji: '🏥',
  },
  {
    id: 'sus-002',
    category: 'saude',
    targetProfiles: ['sus', 'mae', 'generico'],
    route: 'A',
    stage: 'ponte',
    title: 'Farmácia Popular e Remédios Gratuitos',
    headline: 'Remédios gratuitos para milhões de brasileiros',
    scriptText: 'O programa Farmácia Popular já oferece mais de 40 medicamentos gratuitos para hipertensão, diabetes, asma e outras condições crônicas. Milhões de brasileiros dependem desse programa para não ter que escolher entre comprar remédio ou comida. Cortes no SUS ameaçam diretamente esses programas.',
    sourceName: 'Ministério da Saúde',
    sourceUrl: 'https://www.gov.br/saude/pt-br/composicao/sctie/daf/farmacia-popular',
    impactScore: 8,
    emoji: '💊',
  },

  // ═══════════════════════════════════════
  // EDUCAÇÃO / CRECHES
  // ═══════════════════════════════════════
  {
    id: 'edu-001',
    category: 'educacao',
    targetProfiles: ['mae', 'pai', 'jovem', 'universitario', 'professor', 'generico'],
    route: 'A',
    stage: 'gatilho',
    title: 'Investimento em Educação e Creches',
    headline: 'Sem creche, mãe não trabalha',
    scriptText: 'O Brasil tem um déficit de 2 milhões de vagas em creches públicas. Para cada mãe que consegue uma vaga, a chance de estar empregada sobe 20%. Creche não é só educação infantil — é a possibilidade de uma família inteira ter renda. Cortar investimento em educação é cortar o futuro econômico das famílias mais pobres.',
    sourceName: 'IBGE / PNAD Contínua',
    sourceUrl: 'https://www.ibge.gov.br/estatisticas/sociais/trabalho',
    impactScore: 8,
    emoji: '👶',
  },

  // ═══════════════════════════════════════
  // RELIGIÃO / ABORDAGEM RESPEITOSA
  // ═══════════════════════════════════════
  {
    id: 'faith-001',
    category: 'religiao',
    targetProfiles: ['evangelico', 'generico'],
    route: 'BOTH',
    stage: 'acolhimento',
    title: 'Abordagem com Eleitor Evangélico',
    headline: 'Fé e política: uma conversa com respeito',
    scriptText: 'Eu respeito profundamente a sua fé. E justamente por isso quero conversar sobre algo que afeta diretamente a comunidade cristã: o custo de vida. A Bíblia fala muito sobre cuidar dos mais pobres, dos órfãos e das viúvas. Quando a gente olha para as propostas econômicas, a pergunta é: qual projeto protege mais quem mais precisa?',
    counterArgument: 'A Bíblia é contra a esquerda.',
    rebuttal: 'A Bíblia não é de esquerda nem de direita — ela é sobre justiça. Jesus expulsou os vendilhões do templo e multiplicou pão para os famintos. A pergunta não é se o candidato é "de esquerda", mas se suas propostas realmente ajudam quem mais precisa de ajuda.',
    sourceName: 'Abordagem baseada em comunicação popular',
    sourceUrl: '#',
    impactScore: 7,
    emoji: '🙏',
  },

  // ═══════════════════════════════════════
  // CUSTO DE VIDA / CESTA BÁSICA
  // ═══════════════════════════════════════
  {
    id: 'cost-001',
    category: 'custo_vida',
    targetProfiles: ['clt', 'autonomo', 'comerciante', 'desempregado', 'generico'],
    route: 'BOTH',
    stage: 'acolhimento',
    title: 'Validação da Frustração com o Custo de Vida',
    headline: 'Tudo caro? Você tem razão',
    scriptText: 'Você tem toda razão de estar frustrado. As coisas estão caras, o salário não rende, fazer compra no mercado dá angústia. Essa raiva é legítima. Agora, a pergunta importante é: qual projeto político vai fazer sua vida ficar melhor ou pior? Porque um deles quer congelar seu salário enquanto mantém tudo subindo.',
    sourceName: 'DIEESE - Cesta Básica',
    sourceUrl: 'https://www.dieese.org.br/analisecestabasica/analiseCestaBasica.html',
    impactScore: 10,
    emoji: '🛒',
  },
  {
    id: 'cost-002',
    category: 'custo_vida',
    targetProfiles: ['generico'],
    route: 'BOTH',
    stage: 'acolhimento',
    title: 'Escuta Ativa — Sem Julgamento',
    headline: 'Não estou aqui pra te convencer, estou aqui pra conversar',
    scriptText: 'Olha, eu não tô aqui pra dizer que tudo está maravilhoso, porque não está. E eu não vou te tratar como burro por pensar diferente de mim. Eu só quero compartilhar uns dados que talvez você não tenha visto, porque a gente não vê tudo no algoritmo das redes. O que você faz com a informação é decisão sua.',
    sourceName: 'Metodologia de Escuta Ativa',
    sourceUrl: '#',
    impactScore: 10,
    emoji: '🤝',
  },

  // ═══════════════════════════════════════
  // CLT / DIREITOS TRABALHISTAS
  // ═══════════════════════════════════════
  {
    id: 'clt-001',
    category: 'trabalho',
    targetProfiles: ['clt', 'desempregado', 'generico'],
    route: 'BOTH',
    stage: 'gatilho',
    title: 'Flexibilização da CLT',
    headline: 'Seus direitos trabalhistas em jogo',
    scriptText: 'A proposta de "modernização" trabalhista quer flexibilizar a CLT. Na prática, isso significa que seu patrão pode te pagar por hora, sem férias proporcionais, sem FGTS e sem 13º garantido. "Flexibilizar" é o nome bonito pra tirar direito. A reforma trabalhista de 2017 já precarizou milhões — essa proposta vai além.',
    counterArgument: 'A CLT é atrasada, trava o emprego.',
    rebuttal: 'Nos EUA, que não tem CLT, um trabalhador pode ser demitido sem aviso e não tem férias obrigatórias. O Brasil com CLT tem taxa de desemprego mais baixa que vários países "flexíveis". O problema do emprego no Brasil não é a CLT — é falta de investimento e de poder de compra.',
    sourceName: 'TST / MPT',
    sourceUrl: 'https://www.tst.jus.br',
    impactScore: 9,
    emoji: '⚖️',
  },

  // ═══════════════════════════════════════
  // SEGURANÇA ALIMENTAR
  // ═══════════════════════════════════════
  {
    id: 'food-001',
    category: 'alimentacao',
    targetProfiles: ['mae', 'pai', 'desempregado', 'generico'],
    route: 'A',
    stage: 'ponte',
    title: 'Programas de Segurança Alimentar',
    headline: '33 milhões passavam fome — o número está caindo',
    scriptText: 'O Brasil saiu do Mapa da Fome da ONU em 2014 e voltou em 2022, com 33 milhões de pessoas sem ter o que comer. Os programas de segurança alimentar (Bolsa Família, restaurantes populares, cisternas) estão atacando esse problema. Desmontar esses programas é aceitar que milhões de brasileiros voltem a passar fome.',
    sourceName: 'FAO / ONU / IBGE',
    sourceUrl: 'https://www.fao.org/brasil',
    impactScore: 9,
    emoji: '🍚',
  },

  // ═══════════════════════════════════════
  // ROTA B — NEUTRALIZAÇÃO (NULO/BRANCO)
  // ═══════════════════════════════════════
  {
    id: 'routeB-001',
    category: 'neutralizacao',
    targetProfiles: ['generico'],
    route: 'B',
    stage: 'ponte',
    title: 'Permissão para Anular',
    headline: 'Anular não é covardia — é consciência',
    scriptText: 'Se você realmente não consegue votar no Lula, tudo bem. Mas pensa comigo: dar seu voto pro Flávio é dar um cheque em branco pra privatizar a Petrobras, congelar seu salário e cortar o BPC da sua avó. Anular é dizer "não concordo com nenhum dos dois, mas não vou dar meu aval pra destruição". É um ato de consciência.',
    sourceName: 'Argumentação tática',
    sourceUrl: '#',
    impactScore: 9,
    emoji: '🗳️',
  },
  {
    id: 'routeB-002',
    category: 'neutralizacao',
    targetProfiles: ['generico'],
    route: 'B',
    stage: 'gatilho',
    title: 'O Voto como Cheque em Branco',
    headline: 'Votar não é torcer — é assinar um contrato',
    scriptText: 'Votar não é como torcer pro time. Quando você vota, você está dizendo "pode fazer o que prometeu". E o que está sendo prometido é privatização da Petrobras, fim da valorização do salário mínimo e cortes em programas sociais. Você realmente assina embaixo de tudo isso? Porque o voto é o seu "sim" pra esse pacote inteiro.',
    sourceName: 'Argumentação tática',
    sourceUrl: '#',
    impactScore: 8,
    emoji: '✍️',
  },

  // ═══════════════════════════════════════
  // MULHERES / DIREITOS
  // ═══════════════════════════════════════
  {
    id: 'women-001',
    category: 'mulheres',
    targetProfiles: ['mae', 'generico'],
    route: 'A',
    stage: 'gatilho',
    title: 'Impacto na Vida das Mulheres',
    headline: 'Cortes que pesam mais no bolso da mulher',
    scriptText: 'As mulheres são as mais afetadas por cortes em creches, saúde e programas sociais. São elas que cuidam dos idosos, das crianças e dos doentes. Quando fecha a creche, é a mãe que para de trabalhar. Quando corta o SUS, é a mãe que faz a fila. Quando congela o BPC, é a avó que passa necessidade. Cada corte social tem nome de mulher.',
    sourceName: 'ONU Mulheres Brasil',
    sourceUrl: 'https://www.onumulheres.org.br',
    impactScore: 9,
    emoji: '👩',
  },

  // ═══════════════════════════════════════
  // JOVENS / PRIMEIRO EMPREGO
  // ═══════════════════════════════════════
  {
    id: 'youth-001',
    category: 'juventude',
    targetProfiles: ['jovem', 'universitario', 'generico'],
    route: 'A',
    stage: 'gatilho',
    title: 'Futuro do Jovem Trabalhador',
    headline: 'Seu primeiro emprego pode não ter carteira assinada',
    scriptText: 'A flexibilização trabalhista quer que empresas possam contratar sem carteira, sem FGTS e sem férias. Pro jovem entrando no mercado, isso significa começar a vida sem nenhuma rede de proteção. Sem FGTS, sem seguro desemprego, sem 13º. E quando chegar a hora de se aposentar, não vai ter contribuição nenhuma.',
    sourceName: 'IPEA / IBGE',
    sourceUrl: 'https://www.ipea.gov.br',
    impactScore: 8,
    emoji: '🎓',
  },
  // ═══════════════════════════════════════
  // REFORMA TRIBUTÁRIA E IMPOSTO DE RENDA
  // ═══════════════════════════════════════
  {
    id: 'tax-001',
    category: 'tributacao',
    targetProfiles: ['clt', 'comerciante', 'pj', 'autonomo', 'generico'],
    route: 'A',
    stage: 'gatilho',
    title: 'Cesta Básica com Imposto Zero e Cashback',
    headline: 'Comida sem imposto na cesta básica nacional',
    scriptText: 'A Reforma Tributária aprovada zera o imposto de todos os alimentos da cesta básica essencial: arroz, feijão, pão, leite, carnes e legumes. Além disso, cria o Cashback do Povo, devolvendo impostos de luz, gás e água direto na conta das famílias de menor renda. A oposição votou em peso contra essa isenção da comida do trabalhador.',
    counterArgument: 'Mas vão criar um imposto do pecado e aumentar tudo.',
    rebuttal: 'O imposto seletivo é apenas para cigarro e bebidas alcoólicas, como é no mundo inteiro para proteger a saúde. O que alimenta a família — arroz, feijão, frango, carne bovina, ovo — terá imposto ZERO. Quem é contra isso defende cobrar o mesmo imposto do prato do pedreiro e da lancha do bilionário.',
    sourceName: 'Ministério da Fazenda / Congresso Nacional (PEC 45)',
    sourceUrl: 'https://www.gov.br/fazenda/pt-br/assuntos/reforma-tributaria',
    impactScore: 10,
    emoji: '🛒',
  },
  {
    id: 'tax-002',
    category: 'tributacao',
    targetProfiles: ['clt', 'servidor_publico', 'professor', 'autonomo', 'generico'],
    route: 'A',
    stage: 'ponte',
    title: 'Isenção de Imposto de Renda até R$ 5.000',
    headline: 'Quem ganha até R$ 5.000 não vai pagar Imposto de Renda',
    scriptText: 'A tabela do Imposto de Renda ficou congelada de 2015 a 2022, fazendo quem ganhava um salário e meio pagar IR como se fosse rico. Já foi ampliada a faixa de isenção e o compromisso aprovado é isenção total para quem ganha até R$ 5 mil mensais, cobrando mais dos super-ricos e fundos exclusivos.',
    sourceName: 'Receita Federal do Brasil',
    sourceUrl: 'https://www.gov.br/receitafederal',
    impactScore: 9,
    emoji: '💵',
  },

  // ═══════════════════════════════════════
  // PÉ-DE-MEIA (POUPANÇA ENSINO MÉDIO)
  // ═══════════════════════════════════════
  {
    id: 'edu-002',
    category: 'educacao',
    targetProfiles: ['mae', 'pai', 'jovem', 'periferia', 'generico'],
    route: 'A',
    stage: 'ponte',
    title: 'Poupança Pé-de-Meia para Estudantes',
    headline: 'Até R$ 9.200 para o jovem concluir a escola',
    scriptText: 'Quase meio milhão de jovens abandonavam o ensino médio todo ano para trabalhar e ajudar em casa. O programa Pé-de-Meia paga R$ 200 por mês para o aluno da escola pública continuar estudando, mais R$ 1.000 ao fim de cada ano letivo aprovado, somando até R$ 9.200 na formatura. É dinheiro que fica na poupança da família e impede o jovem de cair na criminalidade.',
    counterArgument: 'Isso é assistencialismo que acostuma o jovem mal.',
    rebuttal: 'O jovem só recebe se tiver 80% de frequência escolar e passar de ano. Não é favor, é investimento comprovado: cada ano a mais de estudo aumenta o salário futuro do jovem em 15% e reduz drasticamente a violência juvenil nas periferias.',
    sourceName: 'MEC / Caixa Econômica Federal',
    sourceUrl: 'https://www.gov.br/mec/pt-br/pe-de-meia',
    impactScore: 10,
    emoji: '🎒',
  },

  // ═══════════════════════════════════════
  // DESENROLA BRASIL (LIMPEZA DE NOME)
  // ═══════════════════════════════════════
  {
    id: 'credit-001',
    category: 'credito',
    targetProfiles: ['desempregado', 'autonomo', 'clt', 'comerciante', 'generico'],
    route: 'A',
    stage: 'ponte',
    title: 'Desenrola Brasil e Limpeza de Nome',
    headline: '15 milhões de brasileiros com nome limpo e até 96% de desconto',
    scriptText: 'Milhões de brasileiros entraram na lista de inadimplentes com juros abusivos de cartão e cheque especial. O Desenrola Brasil renegociou mais de R$ 50 bilhões em dívidas com descontos médios de 85% e parcelas a partir de R$ 30. Quem tinha o nome sujo por conta de energia ou telefone pôde voltar a ter crédito no comércio do seu bairro.',
    sourceName: 'Ministério da Fazenda / Serasa Experian',
    sourceUrl: 'https://desenrola.gov.br',
    impactScore: 9,
    emoji: '💳',
  },

  // ═══════════════════════════════════════
  // AGRONEGÓCIO FAMILIAR E PLANO SAFRA
  // ═══════════════════════════════════════
  {
    id: 'agro-001',
    category: 'agro',
    targetProfiles: ['rural', 'agronegocio', 'comerciante', 'generico'],
    route: 'BOTH',
    stage: 'gatilho',
    title: 'Plano Safra Recorde de R$ 400 Bilhões',
    headline: 'Maior Plano Safra da história do Brasil',
    scriptText: 'Muitos dizem nas redes que a esquerda odeia o agro. Os dados oficiais mostram o oposto: o atual Plano Safra bateu recorde absoluto de mais de R$ 400 bilhões de crédito, com juros subsidiados para médios produtores e Pronaf histórico para a agricultura familiar — que é quem produz 70% da comida que chega na mesa do brasileiro.',
    counterArgument: 'Mas eles apoiam invasão de terra.',
    rebuttal: 'O crédito rural do Plano Safra exige regularidade fiscal e ambiental estrita. As exportações do agronegócio bateram recorde em 2023 e 2024 porque o Brasil recuperou a diplomacia com a China e a Europa, abrindo mais de 100 novos mercados agrícolas no exterior.',
    sourceName: 'Ministério da Agricultura e Pecuária (MAPA)',
    sourceUrl: 'https://www.gov.br/agricultura',
    impactScore: 8,
    emoji: '🌾',
  },

  // ═══════════════════════════════════════
  // SEGURANÇA PÚBLICA E CRIME ORGANIZADO
  // ═══════════════════════════════════════
  {
    id: 'safety-001',
    category: 'seguranca',
    targetProfiles: ['generico', 'periferia', 'evangelico', 'comerciante'],
    route: 'BOTH',
    stage: 'gatilho',
    title: 'Apreensão Recorde de Drogas e Armas Ilegais',
    headline: 'Polícia Federal quebra recorde de apreensões e asfixia financeira do crime',
    scriptText: 'Em vez de retórica violenta que só atinge quem mora na favela, o foco da segurança pública foi asfixiar as contas bancárias dos chefes do crime organizado. A Polícia Federal e a PRF bateram recordes históricos de apreensão de cocaína e fuzis, bloqueando mais de R$ 2 bilhões em bens de facções e milícias.',
    counterArgument: 'A segurança tá pior, a esquerda defende bandido.',
    rebuttal: 'Defender o trabalhador é justamente não deixar o crime organizado dominar os bairros. A taxa de homicídios no Brasil caiu para o menor patamar dos últimos 12 anos segundo o Fórum Brasileiro de Segurança Pública. A polícia hoje tem inteligência, tecnologia e concurso público aberto.',
    sourceName: 'Fórum Brasileiro de Segurança Pública / MJSP',
    sourceUrl: 'https://forumseguranca.org.br',
    impactScore: 9,
    emoji: '🛡️',
  },

  // ═══════════════════════════════════════
  // SEGURANÇA HÍDRICA E TRANSIÇÃO REGIONAL
  // ═══════════════════════════════════════
  {
    id: 'reg-ne-001',
    category: 'regional',
    targetProfiles: ['rural', 'generico'],
    route: 'A',
    stage: 'ponte',
    title: 'Transposição do Rio São Francisco e Água no Sertão',
    headline: 'Água garantida para 12 milhões de sertanejos',
    scriptText: 'As obras de transposição do São Francisco, que ficaram paradas com canais rachando no governo anterior, foram concluídas e religadas com a retomada do Ramal do Agreste e do Cinturão das Águas. Além disso, o programa de 1 milhão de cisternas foi reativado para garantir água de beber e de plantar no semiárido.',
    regions: ['BA', 'PE', 'CE', 'PB', 'RN', 'AL', 'SE', 'PI', 'MA'],
    sourceName: 'Ministério da Integração e do Desenvolvimento Regional',
    sourceUrl: 'https://www.gov.br/midr',
    impactScore: 10,
    emoji: '💧',
  },
  {
    id: 'reg-se-001',
    category: 'regional',
    targetProfiles: ['clt', 'pj', 'comerciante', 'generico'],
    route: 'A',
    stage: 'ponte',
    title: 'Nova Indústria Brasil e Polos Automotivos',
    headline: 'Montadoras e indústrias voltando a investir no Sudeste',
    scriptText: 'Montadoras multinacionais (BYD, Toyota, Stellantis, Volkswagen) anunciaram mais de R$ 130 bilhões em novos investimentos no Brasil até 2028, após anos de fuga de fábricas como a Ford. Isso gera empregos industriais qualificados com carteira assinada e movimenta toda a cadeia de peças e serviços em SP, RJ e MG.',
    regions: ['SP', 'RJ', 'MG', 'ES', 'PR'],
    sourceName: 'MDIC / ANFAVEA',
    sourceUrl: 'https://www.gov.br/mdic',
    impactScore: 9,
    emoji: '🏭',
  },
];

// ═══════════════════════════════════════
// SCRIPTS DE ACOLHIMENTO UNIVERSAIS
// ═══════════════════════════════════════
export const ACOLHIMENTO_SCRIPTS = [
  {
    id: 'acolhe-001',
    text: 'Eu entendo totalmente a sua frustração. As coisas estão caras, o salário não rende, e parece que ninguém resolve nada. Sua raiva é legítima.',
    context: 'Para iniciar qualquer conversa',
  },
  {
    id: 'acolhe-002',
    text: 'Olha, eu não vou te tratar como burro nem como fascista. Você tem suas razões e eu respeito. Só quero compartilhar uns dados que talvez mudem a perspectiva.',
    context: 'Para interlocutor defensivo',
  },
  {
    id: 'acolhe-003',
    text: 'A gente tá no mesmo barco. Eu também tô cansado de política, de promessa, de tudo isso. Mas tem umas coisas que afetam direto o nosso bolso e vale a pena olhar com calma.',
    context: 'Para interlocutor desiludido',
  },
  {
    id: 'acolhe-004',
    text: 'Ninguém aqui é dono da verdade. O que eu sei é que a vida tá dura pra todo mundo, e a pergunta que importa é: qual caminho vai fazer a vida ficar melhor ou pior pra gente que trabalha?',
    context: 'Para interlocutor neutro',
  },
];
