// ═══════════════════════════════════════════════════════════════
// DIRETRIZES TÁTICAS ELEITORAIS — 2º TURNO 2026
// Baseado no Método Normose, Análise Felipe Bone & Sabrina Fernandes
// Foco: Trocar a Pergunta, Mostrar o Menos, Os 4 Votos Decisivos
// ═══════════════════════════════════════════════════════════════

export interface ConversionFront {
  id: 'ex_lula' | 'terceira_via' | 'abstencao_70' | 'nulo_branco';
  number: number;
  title: string;
  subtitle: string;
  tag: string;
  badgeColor: string;
  icon: string;
  priority: 'Máxima' | 'Alta' | 'Estratégica';
  electoralWeight: string; // Ex: "O voto que mais vale — vale por 2"
  whoIsThis: string;
  rootCause: string;
  mindsetQuote: string;
  goldenRule: string;
  conversationSteps: {
    step: number;
    title: string;
    action: string;
    script: string;
  }[];
  whatToSay: string[];
  whatNeverToSay: string[];
  menorComFlavioPoints: string[];
  suggestedPostPresetId: string;
}

export interface RegionalTactic {
  uf: string;
  region: 'Nordeste' | 'Sudeste' | 'Sul' | 'Centro-Oeste' | 'Norte';
  profile: 'lula_forte' | 'lula_medio' | 'lula_desafiador';
  primaryMission: string;
  tacticalDirective: string;
  goldenAdvice: string;
  alert: string;
}

// ── PROVAS MATERIAIS: "MOSTRAR O MENOS COM FLÁVIO" ──
export const MENOS_COM_FLAVIO_FACTS = [
  {
    id: 'farmacia_popular',
    icon: '💊',
    title: 'Farmácia Popular Cortada em -59%',
    highlight: '-59% no orçamento',
    detail: 'No governo Bolsonaro o orçamento da Farmácia Popular foi cortado em 59%. O remédio de pressão e diabetes da sua mãe ou avô corre risco real de sumir do posto.',
    source: 'Orçamento Geral da União / Ministério da Saúde',
  },
  {
    id: 'minha_casa',
    icon: '🏠',
    title: 'Minha Casa Minha Vida Reduzido em -90%',
    highlight: '-90% de subsídio habitacional',
    detail: 'A faixa 1 de interesse social (para quem mais precisa) foi praticamente extinta. Sem subsídio federal, o sonho da casa própria vira aluguel eterno e especulação.',
    source: 'Ministério das Cidades / Caixa Econômica',
  },
  {
    id: 'mais_medicos',
    icon: '🩺',
    title: 'Mais Médicos Cortado pela Metade (-50%)',
    highlight: '-50% dos médicos em cidades pequenas',
    detail: 'Milhares de municípios do interior e periferias ficaram sem nenhum médico de família nos postos de saúde após o desmonte do programa.',
    source: 'Ministério da Saúde / Fiocruz',
  },
  {
    id: 'salario_minimo',
    icon: '💵',
    title: 'Salário Mínimo: 4 Anos Sem Aumento Real',
    highlight: 'Zero ganho real acima da inflação',
    detail: 'Foram 4 anos consecutivos em que o salário mínimo só repôs a inflação passada. Com Lula, a política de ganho real voltou (PIB + inflação), aumentando o poder de compra no supermercado.',
    source: 'DIEESE / MTE',
  },
  {
    id: 'escala_6x1',
    icon: '⏰',
    title: 'Flávio Contra o Fim da Escala 6x1',
    highlight: 'Voto declarado contra descanso do trabalhador',
    detail: 'Flávio Bolsonaro se declarou contra a PEC que acaba com a escala 6x1. Quer manter o trabalhador de comércio e serviços preso 6 dias por semana sem folga digna para a família.',
    source: 'Votações e Declarações no Senado Federal',
  },
  {
    id: 'pix_ameaca',
    icon: '📱',
    title: 'Ameaça ao Pix & Cobrança de Tarifas',
    highlight: 'Propostas de taxação e alinhamento com Trump',
    detail: 'O Pix hoje é 100% gratuito e bancado pelo Banco Central brasileiro. Flávio e aliados já defenderam rever subsídios e negociar exigências tarifárias externas com bancos privados.',
    source: 'Relatórios do Banco Central / Propostas no Congresso',
  },
  {
    id: 'reforma_argentina',
    icon: '🇦🇷',
    title: 'O Alerta da Argentina de Milei',
    highlight: 'Jornada de até 12h e demissão sem multa',
    detail: 'O modelo que Flávio apoia é o mesmo de Javier Milei: inflação disparada nos alimentos básicos, jornadas de até 12h diárias e corte brutal de indenizações trabalhistas.',
    source: 'Senado Argentino / Indec Argentina',
  },
  {
    id: 'concentracao_poder',
    icon: '⚖️',
    title: 'Poder Total: 4 Ministros do STF + Senado',
    highlight: 'Risco de controle absoluto das instituições',
    detail: 'Eles já têm maioria na Câmara e Senado. Com a presidência, indicarão mais 4 ministros do Supremo Tribunal Federal. Ninguém poderá fiscalizar ou frear decisões contra o povo.',
    source: 'Constituição Federal / Composição do Senado',
  },
];

// ── AS 4 FRENTES DE CONVERSÃO (A LISTA DOS 4 PERFIS) ──
export const CONVERSION_FRONTS: ConversionFront[] = [
  {
    id: 'ex_lula',
    number: 1,
    title: 'Quem votou no Lula mas hoje tá apertado com as contas',
    subtitle: 'Votou em 2022, mas acha que o mercado tá caro e que a vida ainda tá difícil',
    tag: 'O Voto Mais Decisivo (Vale por 2)',
    badgeColor: 'bg-red-100 text-[#C52229] border-red-300 dark:bg-red-950/60 dark:text-red-300 dark:border-red-800',
    icon: '🔄',
    priority: 'Máxima',
    electoralWeight: 'Tira 1 voto do adversário e soma 1 para Lula (efeito dobrado)',
    whoIsThis: 'Trabalhador que votou no Lula em 2022 esperando alívio imediato no bolso. Hoje se vê apertado por boletos, juros e compras do mês, e às vezes pensa que qualquer mudança traria mais.',
    rootCause: 'O trabalhador quer MAIS, e isso é um direito justo de quem trabalha duro. O risco é cair na ilusão de que Flávio traria mais.',
    mindsetQuote: '"Votei nele esperando picanha e alívio, mas o mercado continua pesado e o dinheiro não sobra."',
    goldenRule: 'NUNCA defenda cegamente o governo nem diga que a vida tá uma maravilha. Primeiro concorde: "Você tem toda razão de querer mais. A vida tá puxada. Mas com Flávio não vai vir mais, vai vir MENOS."',
    conversationSteps: [
      {
        step: 1,
        title: '1. Acolher a dificuldade (Concordar primeiro)',
        action: 'Concorde imediatamente com o cansaço e a insatisfação da pessoa.',
        script: '"Cara, você tem toda razão de estar insatisfeito. A vida do trabalhador tá puxada demais, o mercado tá caro e a gente tem que lutar por cada centavo. Querer mais é um direito seu."',
      },
      {
        step: 2,
        title: '2. Trocar a pergunta (Será que o outro lado resolve?)',
        action: 'Mude o foco de defender o governo para examinar o que vem do outro lado.',
        script: '"A questão não é se o governo fez tudo perfeito — eu também acho que tinha que ter avançado muito mais rápido. A questão é: o que o Flávio vai fazer resolve o seu problema ou joga a gente num aperto ainda pior?"',
      },
      {
        step: 3,
        title: '3. Mostrar o corte no bolso (Lembrar o que fizeram)',
        action: 'Mostre os cortes reais do grupo dele no bolso da família trabalhadora.',
        script: '"Você lembra o que aconteceu na época deles? Cortaram 59% da Farmácia Popular da mãe da gente, paralisaram o Minha Casa Minha Vida pras famílias mais simples e deixaram o salário mínimo 4 anos sem 1 real de aumento acima da inflação. E o Flávio ainda votou contra o fim da escala 6x1. Você acha que com ele o custo de vida vai cair ou subir?"',
      },
      {
        step: 4,
        title: '4. Pedir o voto de proteção (Sem pressão ou fanatismo)',
        action: 'Peça apenas que repita o voto para proteger o básico conquistado.',
        script: '"Você não precisa virar fã de político nem passar pano pra ninguém. Só te peço pra não dar esse tiro no próprio pé. Repete o voto que você já deu, pra gente garantir o mínimo garantido e cobrar o resto com voz firme."',
      },
    ],
    whatToSay: [
      'Valide que querer melhoria e estar bravo com os preços é natural e legítimo.',
      'Destaque que a isenção de Imposto de Renda até R$ 5 mil e o salário mínimo acima da inflação já estão valendo.',
      'Lembre que Flávio é contra acabar com a escala 6x1 e quer manter a folga de apenas 1 dia por semana.',
      'Explique que o plano deles já foi aplicado na Argentina: jornada de 12 horas e corte de remédios.',
    ],
    whatNeverToSay: [
      'NUNCA diga que o eleitor é "burro" ou que "vota contra si mesmo". Isso só afasta.',
      'NUNCA tente maquiar os preços dizendo que "as coisas estão baratíssimas".',
      'NUNCA mande textão agressivo no grupo da família no WhatsApp (só gera bate-boca).',
    ],
    menorComFlavioPoints: [
      'Salário mínimo ficou 4 anos sem aumento real acima da inflação (2019-2022)',
      'Farmácia Popular sofreu corte de 59% no orçamento',
      'Flávio é contra o fim da escala exaustiva 6x1',
      'Risco de taxas e cobranças no Pix pelos bancos privados',
    ],
    suggestedPostPresetId: 'preset_o_menos_com_flavio',
  },

  {
    id: 'terceira_via',
    number: 2,
    title: 'Quem não gosta de nenhum lado ou votou em outros',
    subtitle: 'Votou em outros candidatos no 1º turno, está em dúvida ou cansado de política',
    tag: 'Conversa Calma sem Impor Partido',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800',
    icon: '⚖️',
    priority: 'Alta',
    electoralWeight: 'Decide estados equilibrados como Minas Gerais e cidades médias',
    whoIsThis: 'Pessoa de classe média, pequeno comerciante ou autônomo com receios sobre o PT, mas que também tem medo da instabilidade e das confusões da família Bolsonaro.',
    rootCause: 'Quer tranquilidade, segurança para trabalhar e regras claras sem bagunça política.',
    mindsetQuote: '"Eu tenho ressalvas com o PT, mas a família Bolsonaro me dá medo com tanta briga."',
    goldenRule: 'NUNCA force essa pessoa a virar fã de Lula. Faça APENAS perguntas calmas e reflexivas sobre o histórico e as atitudes de Flávio Bolsonaro.',
    conversationSteps: [
      {
        step: 1,
        title: '1. Respeitar a opinião dela',
        action: 'Desarme o clima avisando que você entende o ponto de vista dela.',
        script: '"Eu entendo perfeitamente suas ressalvas e críticas, e não tô aqui pra te convencer a amar o PT nem a virar cabo eleitoral de ninguém."',
      },
      {
        step: 2,
        title: '2. Perguntas sinceras sobre Flávio',
        action: 'Questione o histórico e o que Flávio entregou de fato no Senado.',
        script: '"Mas com toda a sinceridade: você lembra de algum projeto importante que o Flávio entregou pro povo nesses anos no Senado? Você confia nele cuidando da economia, com o histórico de rachadinhas e mansões milionárias?"',
      },
      {
        step: 3,
        title: '3. O risco de um poder sem limites',
        action: 'Alerte que dar tudo na mão de um só grupo tira os freios da lei.',
        script: '"Eles já têm maioria na Câmara e no Senado. Se levarem a Presidência, vão indicar 4 ministros do Supremo. Sem contrapeso, ninguém segura qualquer lei que prejudique a classe média ou o pequeno negócio."',
      },
      {
        step: 4,
        title: '4. Voto de equilíbrio e paz',
        action: 'Mostre que o voto é para manter estabilidade e poder cobrar.',
        script: '"Votar no Lula agora não é concordar com tudo. É garantir estabilidade econômica e regras do jogo funcionando com equilíbrio."',
      },
    ],
    whatToSay: [
      'Pergunte sobre fatos concretos: histórico no Senado, caso das mansões e falta de propostas.',
      'Fale sobre a segurança jurídica e estabilidade para pequenos comércios e empregos.',
      'Lembre da importância de manter um país respeitado lá fora para vender nossos produtos.',
    ],
    whatNeverToSay: [
      'NUNCA tente dizer que o outro lado inventou tudo ou que não há nada a melhorar.',
      'NUNCA use termos de militância agressiva ou palavras complicadas.',
      'NUNCA brigue em público em redes sociais.',
    ],
    menorComFlavioPoints: [
      'Controle absoluto: Presidência + Senado + indicação de 4 ministros do STF',
      'Risco de isolamento e brigas comerciais com outros países',
      'Falta de propostas para a saúde e a educação pública',
    ],
    suggestedPostPresetId: 'preset_perguntas_terceira_via',
  },

  {
    id: 'abstencao_70',
    number: 3,
    title: 'Quem faltou no 1º turno ou idosos (70+)',
    subtitle: '17 milhões de pessoas que não foram votar por cansaço, chuva ou condução',
    tag: 'Carona e Incentivo com Carinho',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800',
    icon: '🧓',
    priority: 'Alta',
    electoralWeight: 'O maior número de votos disponíveis sem precisar discutir política com ninguém',
    whoIsThis: 'Pessoas com mais de 70 anos cujo voto é facultativo, pessoas com dificuldade para andar, mães solo, jovens desanimados ou quem teve imprevistos no dia da eleição.',
    rootCause: 'Falta de condução, chuva, cansaço físico da semana de trabalho ou sensação de que seu voto não faria falta.',
    mindsetQuote: '"Eu não fui votar porque choveu forte, o ponto de ônibus tava longe e achei que tanto faz."',
    goldenRule: 'ESCUTE com carinho o motivo real da ausência antes de falar de política. Ofereça ajuda prática, carona ou companhia.',
    conversationSteps: [
      {
        step: 1,
        title: '1. Perguntar com carinho',
        action: 'Pergunte o que aconteceu sem julgar ou cobrar.',
        script: '"Dona Maria, senti sua falta no dia da votação! Me conta: o que aconteceu que a senhora não conseguiu ir? Foi cansaço, transporte, saúde?"',
      },
      {
        step: 2,
        title: '2. Valorizar a presença dela',
        action: 'Mostre o quanto a vida e a opinião dela são importantes.',
        script: '"A senhora construiu esse bairro com a gente e sabe como o remédio de graça no postinho e o aumento da aposentadoria fazem falta no final do mês."',
      },
      {
        step: 3,
        title: '3. Ajudar no transporte e na ida',
        action: 'Tire a dificuldade prática da frente.',
        script: '"No domingo de votação eu passo na sua porta, te levo na escola com calma e trago de volta pra gente tomar um café. Vamos juntos sem pressa!"',
      },
    ],
    whatToSay: [
      'Lembre dos remédios gratuitos da Farmácia Popular para hipertensão e diabetes.',
      'Destaque que o transporte coletivo é gratuito no dia da votação por lei.',
      'Organize caronas solidárias na vizinhança e entre amigos da igreja ou do bairro.',
    ],
    whatNeverToSay: [
      'NUNCA dê bronca ou fale em tom de cobrança moral.',
      'NUNCA deixe a pessoa ir sozinha se ela tiver dor nas pernas ou dificuldade de andar.',
    ],
    menorComFlavioPoints: [
      'Farmácia Popular teve corte de 59% sob comando do grupo adversário',
      'Risco de desvincular a aposentadoria do salário mínimo nacional',
    ],
    suggestedPostPresetId: 'preset_carona_solidaria_70',
  },

  {
    id: 'nulo_branco',
    number: 4,
    title: 'Quem votou nulo ou em branco',
    subtitle: 'Cansado de briga política e achando que "é tudo farinha do mesmo saco"',
    tag: 'Lembrar quem vai assinar as leis',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800',
    icon: '⚪',
    priority: 'Estratégica',
    electoralWeight: 'Milhões de pessoas trabalhadoras que anulam e deixam o extremismo decidir por elas',
    whoIsThis: 'Cidadão revoltado com escândalos e brigas vazias na TV e na internet, achando que anular é uma atitude justa de protesto.',
    rootCause: 'Cansaço da polarização e sensação de que nada muda na vida prática.',
    mindsetQuote: '"São todos iguais, nenhum deles põe comida no meu prato."',
    goldenRule: 'Coloque a pessoa no comando do dilema real: "Se amanhã votarem contra o seu 13º ou sua folga, quem você quer na presidência pra vetar?".',
    conversationSteps: [
      {
        step: 1,
        title: '1. Dar razão à revolta com as brigas',
        action: 'Concorde que a barulheira política irrita quem acorda cedo pra trabalhar.',
        script: '"Eu te entendo totalmente. Dá nojo mesmo de ligar a TV ou abrir o celular e só ver briga enquanto a gente rala de sol a sol pra pagar boleto."',
      },
      {
        step: 2,
        title: '2. O dilema prático das leis trabalhistas',
        action: 'Mostre que votar nulo não impede as decisões de atingirem o bolso dele.',
        script: '"Só que quando a gente anula, quem decide o nosso destino é a minoria mais barulhenta. Se o Congresso aprovar a escala 6x1 pra sempre ou cortar o 13º salário, você prefere o Lula sentado lá pra vetar ou o Flávio pra assinar em baixo?"',
      },
      {
        step: 3,
        title: '3. Voto de defesa do próprio bolso',
        action: 'Mostre o voto como um escudo de proteção para não piorar.',
        script: '"Votar no 2º turno não é arrumar um salvador da pátria. É escolher quem não vai tirar os seus direitos garantidos e quem a gente tem como cobrar."',
      },
    ],
    whatToSay: [
      'Foque em direitos da vida real: 13º salário, férias pagas, FGTS e descanso semanal.',
      'Explique com calma que o voto nulo não anula a eleição, apenas deixa os outros escolherem por você.',
    ],
    whatNeverToSay: [
      'NUNCA chame a pessoa de covarde ou omissa.',
      'NUNCA venha com discursos ideológicos complicados.',
    ],
    menorComFlavioPoints: [
      'Na Argentina de Milei aprovaram jornadas de 12 horas e corte de direitos',
      'Flávio já se posicionou contra acabar com a escala de 6 dias trabalhados pra 1 folga',
    ],
    suggestedPostPresetId: 'preset_dilema_do_trabalhador',
  },
];

// ── DIRETRIZES REGIONAIS (ONDE VOCÊ VOTA DEFINE SUA MISSÃO) ──
export const REGIONAL_DIRECTIVES: Record<string, RegionalTactic> = {
  // Nordeste: Comparecimento em massa
  BA: {
    uf: 'BA',
    region: 'Nordeste',
    profile: 'lula_forte',
    primaryMission: 'COMPARECIMENTO TOTAL & CARONAS',
    tacticalDirective: 'Garantir que ninguém deixe de votar por falta de transporte ou lembrete. O Nordeste já decidiu a seu favor: o risco é o desânimo ou a logística de locomoção.',
    goldenAdvice: 'Organize grupos de carona para tias, avós e vizinhos. Lembrar o local de votação na véspera.',
    alert: 'Cuidado para não se acomodar achando que "já ganhou". Cada voto que não comparece faz falta na contagem nacional.',
  },
  PE: {
    uf: 'PE',
    region: 'Nordeste',
    profile: 'lula_forte',
    primaryMission: 'COMPARECIMENTO TOTAL & CARONAS',
    tacticalDirective: 'Mobilizar comunidades e famílias. O foco não é debater com bolsonarista, é colocar nossa gente na fila da urna cedo.',
    goldenAdvice: 'Cobre o transporte público gratuito das prefeituras e ajude quem tem mais de 70 anos a comparecer.',
    alert: 'Evite brigas em redes e foque 100% no trabalho comunitário presencial.',
  },
  CE: {
    uf: 'CE',
    region: 'Nordeste',
    profile: 'lula_forte',
    primaryMission: 'COMPARECIMENTO TOTAL & CARONAS',
    tacticalDirective: 'Manter a alta mobilização nas periferias e interior. Fortalecer os laços com quem depende da Farmácia Popular e dos programas de educação.',
    goldenAdvice: 'Lembrar que o Pé-de-Meia para estudantes do ensino médio depende da continuidade federal.',
    alert: 'Atenção aos boatos de falsas datas ou mudanças de seção eleitoral no WhatsApp.',
  },
  MA: {
    uf: 'MA',
    region: 'Nordeste',
    profile: 'lula_forte',
    primaryMission: 'COMPARECIMENTO TOTAL & CARONAS',
    tacticalDirective: 'Foco nos municípios do interior com dificuldade de locomoção. Garantir rotas solidárias para zonas rurais.',
    goldenAdvice: 'Apoio direto a idosos e famílias com benefícios sociais.',
    alert: 'Fiscalizar tentativas de coação ou falta de transporte em áreas isoladas.',
  },

  // Sudeste: O Coração da Batalha (Reconquista & Disputa Voto a Voto)
  SP: {
    uf: 'SP',
    region: 'Sudeste',
    profile: 'lula_medio',
    primaryMission: 'RECONQUISTA DO EX-LULA & TRABALHADORES 6x1',
    tacticalDirective: 'Na Grande São Paulo e cidades industriais, focar em quem votou em 2022 e se afastou. Mostrar o MENOS com Flávio e o ataque à escala 6x1 e aos direitos trabalhistas.',
    goldenAdvice: 'Fale no 1-a-1 com motoristas de app, entregadores, comerciários e metalúrgicos. Mostre que Flávio defende a jornada exaustiva e cortes sociais.',
    alert: 'NUNCA chame ninguém de fascista. Escute a dor do custo de vida antes de argumentar.',
  },
  MG: {
    uf: 'MG',
    region: 'Sudeste',
    profile: 'lula_medio',
    primaryMission: 'TRABALHO DE FORMIGA CIDADE POR CIDADE',
    tacticalDirective: 'A diferença em Minas foi de menos de 600 mil votos. Aqui o jogo se ganha no café da tarde, conversando com os parentes de terceira via e quem votou branco.',
    goldenAdvice: 'Faça perguntas desarmadoras sobre Flávio Bolsonaro: histórico no Senado, caso das mansões e falta de projetos.',
    alert: 'Minas define o Brasil desde 1989. Virar 4 votos na sua família em MG muda a eleição nacional.',
  },
  RJ: {
    uf: 'RJ',
    region: 'Sudeste',
    profile: 'lula_desafiador',
    primaryMission: 'RECONQUISTA NAS PERIFERIAS & SERVIÇOS',
    tacticalDirective: 'Baixada Fluminense e Zona Oeste: focar no trabalhador que pega 3 conduções por dia. A pauta da escala 6x1 e o remédio de graça no postinho são decisivos.',
    goldenAdvice: 'Converse no privado pelo WhatsApp. Lembre que Flávio foi senador pelo RJ e nunca resolveu o trem ou a segurança pública.',
    alert: 'Evite discussões acaloradas em público ou em grupos de condomínio.',
  },

  // Sul e Centro-Oeste: Conversa Silenciosa 1-a-1 (Lula < 35%)
  SC: {
    uf: 'SC',
    region: 'Sul',
    profile: 'lula_desafiador',
    primaryMission: 'GUERRILHA SILENCIOSA 1-A-1 (NADA DE MEGAFONE)',
    tacticalDirective: 'Onde Lula tem menos de 35%, convocar manifestação pública ou gritar em praça só mobiliza e enfurece o eleitor adversário. A tática é a conversa privada com amigos e familiares de confiança.',
    goldenAdvice: 'Foque nos indecisos e nos eleitores moderados. Faça perguntas sobre a instabilidade que a vitória de Flávio traria aos negócios locais e ao comércio exterior.',
    alert: 'PERIGO: Chamar todo mundo para votar publicamente em SC pode aumentar a votação de Flávio. Seja cirúrgico.',
  },
  PR: {
    uf: 'PR',
    region: 'Sul',
    profile: 'lula_desafiador',
    primaryMission: 'CONVERSA PRIVADA COM MODERADOS & EDUCAÇÃO',
    tacticalDirective: 'Foco em professores, profissionais de saúde e pequenos comerciantes descontentes com o extremismo.',
    goldenAdvice: 'Mostre os cortes do governo Bolsonaro na Farmácia Popular (-59%) e na vacinação infantil.',
    alert: 'Não entre em brigas de grupo de WhatsApp. Chame no privado com educação.',
  },
  RS: {
    uf: 'RS',
    region: 'Sul',
    profile: 'lula_medio',
    primaryMission: 'RECONSTRUÇÃO & SOLIDARIEDADE MATERIAL',
    tacticalDirective: 'Lembrar o socorro federal maciço após as enchentes históricas: perdão de dívidas, auxílios emergenciais e reconstrução de pontes e hospitais pelo governo federal.',
    goldenAdvice: 'Mostre a diferença entre um governo que socorreu o estado com dezenas de bilhões versus a negligência climática do grupo adversário.',
    alert: 'Foque na reconstrução econômica e no apoio a pequenos agricultores do Pronaf.',
  },
  GO: {
    uf: 'GO',
    region: 'Centro-Oeste',
    profile: 'lula_desafiador',
    primaryMission: 'CONVERSA SILENCIOSA & TRABALHADORES RURAIS/URBANOS',
    tacticalDirective: 'Conversas individuais e cirúrgicas. O agro empresarial apoia Flávio, mas o pequeno agricultor familiar e o trabalhador assalariado dependem de crédito do Pronaf e programas sociais.',
    goldenAdvice: 'Destaque que o Pronaf bateu recorde de R$ 76 bilhões de crédito agrícola com Lula.',
    alert: 'Não faça campanha agressiva de rua que possa gerar represálias.',
  },
};

// Fallback regional para qualquer UF
export function getRegionalTacticForUF(uf: string): RegionalTactic {
  if (REGIONAL_DIRECTIVES[uf]) {
    return REGIONAL_DIRECTIVES[uf];
  }

  // Fallbacks por macrorregião
  const nordesteUFs = ['AL', 'AP', 'CE', 'MA', 'PB', 'PE', 'PI', 'RN', 'SE'];
  const sulUFs = ['PR', 'RS', 'SC'];
  const centroOesteUFs = ['DF', 'GO', 'MS', 'MT'];
  const norteUFs = ['AC', 'AM', 'PA', 'RO', 'RR', 'TO'];

  if (nordesteUFs.includes(uf)) {
    return {
      uf,
      region: 'Nordeste',
      profile: 'lula_forte',
      primaryMission: 'COMPARECIMENTO TOTAL & CARONAS SOLIDÁRIAS',
      tacticalDirective: 'Levar cada vizinho, idoso e trabalhador à urna. O comparecimento alto no seu estado é a chave para compensar regiões mais difíceis.',
      goldenAdvice: 'Organize caronas e garanta que ninguém deixe de votar por falta de transporte.',
      alert: 'Não deixe para a última hora. Ajude quem tem mais de 70 anos a ir de manhã.',
    };
  }

  if (sulUFs.includes(uf) || centroOesteUFs.includes(uf)) {
    return {
      uf,
      region: sulUFs.includes(uf) ? 'Sul' : 'Centro-Oeste',
      profile: 'lula_desafiador',
      primaryMission: 'CONVERSA PRIVADA 1-A-1 (SEM MEGAFONE)',
      tacticalDirective: 'Trabalho de guerrilha silenciosa. Em regiões com ampla maioria adversária, gritar em público mobiliza a oposição. O trabalho é direto, no privado, com pessoas que você conhece bem.',
      goldenAdvice: 'Foque nos 4 Votos da sua lista pessoal de conhecidos. Use perguntas desarmadoras.',
      alert: 'Não convoque atos abertos que possam servir de palanque para o adversário mobilizar.',
    };
  }

  if (norteUFs.includes(uf)) {
    return {
      uf,
      region: 'Norte',
      profile: 'lula_medio',
      primaryMission: 'DEFESA DA FLORESTA & BENEFÍCIOS MATERIAIS',
      tacticalDirective: 'Focar nos programas sociais, Farmácia Popular, Minha Casa Minha Vida e defesa dos rios e comunidades tradicionais.',
      goldenAdvice: 'Mostre que o desmonte do Mais Médicos e da saúde indígena deixou o interior abandonado na gestão passada.',
      alert: 'Garantir transporte hidroviário e terrestre para comunidades mais distantes.',
    };
  }

  // Padrão Sudeste
  return {
    uf,
    region: 'Sudeste',
    profile: 'lula_medio',
    primaryMission: 'RECONQUISTA DO EX-LULA & TRABALHO DE FORMIGA',
    tacticalDirective: 'Focar em quem votou em 2022 e se afastou. Mostrar o MENOS com Flávio (6x1, Farmácia Popular, salário mínimo).',
    goldenAdvice: 'Ouça antes de falar. Mostre empatia com o custo de vida e apresente os números concretos de cortes.',
    alert: 'Evite discussões em grupos de WhatsApp da família. Vá no privado.',
  };
}
