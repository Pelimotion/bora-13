// ═══════════════════════════════════════════════════════════════
// BORA APP — Catálogo Amplo de Ocupações Brasileiras
// Tradução semântica de termos coloquiais e CBO para categorias
// estratégicas de impacto econômico e diálogo
// ═══════════════════════════════════════════════════════════════

import { ProfileTag } from './arguments';

export interface Occupation {
  /** Termos de busca e sinônimos populares */
  terms: string[];
  /** Nome formal/amigável exibido na UI */
  label: string;
  /** Tags estratégicas ativadas no Decision Engine */
  tags: ProfileTag[];
  /** Ícone temático */
  emoji: string;
  /** Categoria profissional */
  category: string;
}

export const OCCUPATIONS: Occupation[] = [
  // ── TRANSPORTE, LOGÍSTICA & GIG ECONOMY ──
  { terms: ['uber', '99', 'indrive', 'motorista app', 'motorista de aplicativo'], label: 'Motorista de Aplicativo (Uber/99)', tags: ['motorista', 'autonomo'], emoji: '🚗', category: 'Transporte' },
  { terms: ['motoboy', 'entregador', 'ifood', 'rappi', 'delivery', 'motofrete'], label: 'Entregador de App / Motoboy', tags: ['entregador', 'autonomo'], emoji: '🏍️', category: 'Transporte' },
  { terms: ['caminhoneiro', 'motorista carreta', 'freteiro', 'cegonheiro', 'estradeiro'], label: 'Caminhoneiro / Carreteiro', tags: ['motorista', 'autonomo'], emoji: '🚛', category: 'Transporte' },
  { terms: ['taxista', 'taxi', 'ponto de taxi'], label: 'Taxista', tags: ['motorista', 'autonomo'], emoji: '🚕', category: 'Transporte' },
  { terms: ['motorista onibus', 'cobrador', 'trocador', 'transporte publico'], label: 'Motorista de Ônibus / Cobrador', tags: ['clt', 'motorista'], emoji: '🚌', category: 'Transporte' },
  { terms: ['vanzeiro', 'transporte escolar', 'tio da van', 'perueiro'], label: 'Motorista de Van Escolar / Lotação', tags: ['motorista', 'autonomo'], emoji: '🚐', category: 'Transporte' },
  { terms: ['estoquista', 'conferente', 'empilhadeirista', 'ajudante de carga', 'logistica'], label: 'Estoquista / Operador de Logística', tags: ['clt'], emoji: '📦', category: 'Transporte' },

  // ── COMÉRCIO, VENDAS & ALIMENTAÇÃO ──
  { terms: ['comerciante', 'lojista', 'dono de loja', 'empreendedor', 'dono de comercio'], label: 'Comerciante / Dono de Loja', tags: ['comerciante', 'autonomo'], emoji: '🏪', category: 'Comércio' },
  { terms: ['vendedor', 'balconista', 'atendente', 'loja', 'vendedora'], label: 'Vendedor(a) / Balconista', tags: ['clt', 'comerciante'], emoji: '🛍️', category: 'Comércio' },
  { terms: ['caixa', 'operador de caixa', 'supermercado'], label: 'Operador(a) de Caixa', tags: ['clt'], emoji: '💳', category: 'Comércio' },
  { terms: ['garcom', 'garconete', 'atendente de bar', 'cumim'], label: 'Garçom / Garçonete', tags: ['clt', 'autonomo'], emoji: '🍽️', category: 'Alimentação' },
  { terms: ['cozinheira', 'cozinheiro', 'merendeira', 'chef', 'ajudante de cozinha'], label: 'Cozinheiro(a) / Merendeira', tags: ['clt', 'autonomo'], emoji: '🍳', category: 'Alimentação' },
  { terms: ['padeiro', 'confeiteiro', 'padaria', 'salgadeira', 'doceira'], label: 'Padeiro(a) / Confeiteiro(a)', tags: ['clt', 'autonomo', 'comerciante'], emoji: '🥖', category: 'Alimentação' },
  { terms: ['acougueiro', 'acougue', 'balconista de carne'], label: 'Açougueiro(a)', tags: ['clt'], emoji: '🥩', category: 'Comércio' },
  { terms: ['dono de bar', 'buteco', 'lanchonete', 'trailer', 'quiosque'], label: 'Dono(a) de Bar / Lanchonete', tags: ['comerciante', 'autonomo'], emoji: '🍺', category: 'Comércio' },
  { terms: ['feirante', 'barraca', 'feira livre', 'hortifruti'], label: 'Feirante / Quitandeiro', tags: ['comerciante', 'autonomo'], emoji: '🍎', category: 'Comércio' },
  { terms: ['ambulante', 'camelo', 'vendedor de rua', 'pipoqueiro', 'picolezeiro'], label: 'Vendedor(a) Ambulante / Camelô', tags: ['autonomo', 'periferia'], emoji: '🛒', category: 'Comércio' },

  // ── BELEZA, ESTÉTICA & CUIDADOS ──
  { terms: ['cabeleireira', 'cabeleireiro', 'salao de beleza'], label: 'Cabeleireiro(a)', tags: ['autonomo', 'comerciante'], emoji: '💇‍♀️', category: 'Beleza' },
  { terms: ['barbeiro', 'barbearia', 'corte masculino'], label: 'Barbeiro', tags: ['autonomo', 'comerciante'], emoji: '💈', category: 'Beleza' },
  { terms: ['manicure', 'pedicure', 'nail designer', 'unhas'], label: 'Manicure / Pedicure', tags: ['autonomo'], emoji: '💅', category: 'Beleza' },
  { terms: ['esteticista', 'designer de sobrancelhas', 'lash', 'maquiadora'], label: 'Esteticista / Maquiador(a)', tags: ['autonomo'], emoji: '✨', category: 'Beleza' },
  { terms: ['cuidador de idosos', 'cuidadora', 'acompanhante hospitalar'], label: 'Cuidador(a) de Idosos', tags: ['autonomo', 'clt', 'saude'], emoji: '🧓', category: 'Cuidados' },
  { terms: ['baba', 'cuidadora de criancas'], label: 'Babá', tags: ['autonomo', 'clt'], emoji: '👶', category: 'Cuidados' },

  // ── LIMPEZA, MANUTENÇÃO & SERVIÇOS GERAIS ──
  { terms: ['diarista', 'faxineira', 'empregada domestica', 'domestica'], label: 'Diarista / Trabalho Doméstico', tags: ['autonomo', 'clt', 'periferia'], emoji: '🧹', category: 'Serviços' },
  { terms: ['porteiro', 'vigilante', 'seguranca', 'controlador de acesso', 'guarita'], label: 'Porteiro(a) / Vigilante', tags: ['clt'], emoji: '🚪', category: 'Serviços' },
  { terms: ['zelador', 'faxineiro predio', 'servicos gerais'], label: 'Zelador(a) / Serviços Gerais', tags: ['clt'], emoji: '🏢', category: 'Serviços' },
  { terms: ['gari', 'coletor de lixo', 'varredor', 'limpeza urbana'], label: 'Gari / Coletor(a) de Limpeza Urbana', tags: ['clt', 'periferia'], emoji: '🚮', category: 'Serviços' },
  { terms: ['catador', 'reciclador', 'reciclagem', 'sucateiro'], label: 'Catador(a) de Materiais Recicláveis', tags: ['autonomo', 'periferia'], emoji: '♻️', category: 'Serviços' },
  { terms: ['lavador de carros', 'lava rapido', 'flanelinha'], label: 'Lavador(a) de Carros / Estética Automotiva', tags: ['autonomo'], emoji: '🚗', category: 'Serviços' },

  // ── CONSTRUÇÃO CIVIL, OFICINAS & REPAROS ──
  { terms: ['pedreiro', 'construcao civil', 'mestre de obras'], label: 'Pedreiro / Mestre de Obras', tags: ['autonomo', 'clt'], emoji: '🧱', category: 'Construção' },
  { terms: ['servente', 'ajudante de pedreiro', 'ajudante de obra'], label: 'Servente de Obras', tags: ['autonomo', 'clt', 'periferia'], emoji: '🦺', category: 'Construção' },
  { terms: ['eletricista', 'instalador eletrico', 'eletricista predial'], label: 'Eletricista', tags: ['autonomo', 'clt'], emoji: '⚡', category: 'Construção' },
  { terms: ['encanador', 'bombeiro hidraulico', 'instalador hidraulico'], label: 'Encanador / Bombeiro Hidráulico', tags: ['autonomo'], emoji: '🔧', category: 'Construção' },
  { terms: ['pintor', 'pintor de parede', 'texturizador'], label: 'Pintor(a) de Parede', tags: ['autonomo'], emoji: '🎨', category: 'Construção' },
  { terms: ['marceneiro', 'carpinteiro', 'marcenaria', 'moveis planejados'], label: 'Marceneiro(a) / Carpinteiro(a)', tags: ['autonomo', 'comerciante'], emoji: '🪚', category: 'Construção' },
  { terms: ['mecanico', 'mecanica', 'oficina mecanica', 'auto center'], label: 'Mecânico(a) Automotivo', tags: ['autonomo', 'comerciante'], emoji: '🔩', category: 'Reparos' },
  { terms: ['borracheiro', 'borracharia'], label: 'Borracheiro(a)', tags: ['autonomo'], emoji: '🛞', category: 'Reparos' },
  { terms: ['serralheiro', 'soldador', 'solda', 'metalurgico'], label: 'Serralheiro(a) / Soldador(a)', tags: ['autonomo', 'clt'], emoji: '⚙️', category: 'Indústria' },
  { terms: ['costureira', 'alfaiate', 'atelier', 'conserto de roupas'], label: 'Costureira / Alfaiate', tags: ['autonomo', 'comerciante'], emoji: '🧵', category: 'Moda' },

  // ── SAÚDE & CUIDADO HOSPITALAR ──
  { terms: ['enfermeira', 'enfermeiro', 'hospital', 'posto de saude'], label: 'Enfermeiro(a)', tags: ['saude', 'clt', 'sus'], emoji: '👩‍⚕️', category: 'Saúde' },
  { terms: ['tecnico de enfermagem', 'auxiliar de enfermagem', 'tecnica enfermagem'], label: 'Técnico(a) de Enfermagem', tags: ['saude', 'clt', 'sus'], emoji: '💉', category: 'Saúde' },
  { terms: ['agente comunitario de saude', 'acs', 'agente de endemias', 'ace'], label: 'Agente Comunitário de Saúde (ACS)', tags: ['saude', 'servidor_publico', 'sus'], emoji: '🏥', category: 'Saúde' },
  { terms: ['medico', 'medica', 'clinico geral', 'doutor'], label: 'Médico(a)', tags: ['saude', 'servidor_publico'], emoji: '🩺', category: 'Saúde' },
  { terms: ['dentista', 'odontologia', 'cirurgiao dentista'], label: 'Dentista / Odontologista', tags: ['saude', 'autonomo'], emoji: '🦷', category: 'Saúde' },
  { terms: ['farmaceutico', 'balconista de farmacia', 'atendente farmacia'], label: 'Farmacêutico(a) / Atendente de Farmácia', tags: ['saude', 'clt'], emoji: '💊', category: 'Saúde' },
  { terms: ['fisioterapeuta', 'psicologa', 'psicologo', 'nutricionista'], label: 'Profissional de Reabilitação / Terapia', tags: ['saude', 'autonomo'], emoji: '🧘', category: 'Saúde' },

  // ── EDUCAÇÃO, CIÊNCIA & SERVIÇO PÚBLICO ──
  { terms: ['professor', 'professora', 'prof', 'educadora', 'escola publica', 'rede municipal', 'rede estadual'], label: 'Professor(a) de Escola Básica', tags: ['professor', 'servidor_publico', 'clt'], emoji: '📚', category: 'Educação' },
  { terms: ['professor universitario', 'docente', 'pesquisador', 'academico'], label: 'Professor(a) Universitário / Pesquisador', tags: ['professor', 'servidor_publico'], emoji: '🎓', category: 'Educação' },
  { terms: ['pedagoga', 'diretora', 'coordenadora pedagogica', 'inspetor de alunos'], label: 'Gestor(a) Escolar / Inspetor(a)', tags: ['professor', 'servidor_publico'], emoji: '🏫', category: 'Educação' },
  { terms: ['servidor publico', 'funcionario publico', 'concursado', 'tecnico administrativo'], label: 'Servidor(a) Público Civil', tags: ['servidor_publico', 'clt'], emoji: '🏛️', category: 'Serviço Público' },
  { terms: ['policial militar', 'pm', 'policia civil', 'policial penal', 'agente de seguranca'], label: 'Policial / Forças de Segurança', tags: ['servidor_publico'], emoji: '👮', category: 'Segurança' },
  { terms: ['bombeiro', 'guarda municipal', 'agente de transito'], label: 'Bombeiro Militar / Guarda Municipal', tags: ['servidor_publico'], emoji: '🚒', category: 'Segurança' },
  { terms: ['carteiro', 'correios', 'atendente correios'], label: 'Carteiro(a) / Trabalhador dos Correios', tags: ['servidor_publico', 'clt'], emoji: '📮', category: 'Serviço Público' },

  // ── CAMPO, AGRO & PESCA ──
  { terms: ['agricultor familiar', 'pequeno produtor', 'lavrador', 'roceiro', 'campones'], label: 'Agricultor(a) Familiar / Produtor Rural', tags: ['rural', 'autonomo', 'agronegocio'], emoji: '🌾', category: 'Agro' },
  { terms: ['tratorista', 'operador de colheitadeira', 'trabalhador rural', 'boia-fria'], label: 'Trabalhador(a) Rural / Tratorista', tags: ['rural', 'clt'], emoji: '🚜', category: 'Agro' },
  { terms: ['pescador', 'marisqueira', 'ribeirinho', 'pesca artesanal'], label: 'Pescador(a) Artesanal / Marisqueira', tags: ['rural', 'autonomo'], emoji: '🐟', category: 'Agro' },
  { terms: ['veterinario', 'agronomo', 'zootecnista', 'tecnico agricola'], label: 'Agrônomo(a) / Técnico Agrícola', tags: ['rural', 'autonomo'], emoji: '🌱', category: 'Agro' },

  // ── TECNOLOGIA, DESIGN & CRIATIVOS ──
  { terms: ['programador', 'desenvolvedor', 'dev', 'software', 'ti', 'tecnologia'], label: 'Desenvolvedor(a) / Profissional de TI', tags: ['pj', 'clt'], emoji: '💻', category: 'Tecnologia' },
  { terms: ['designer', 'editor de video', 'social media', 'criador de conteudo', 'fotografo'], label: 'Designer / Criador de Conteúdo / Audiovisual', tags: ['autonomo', 'pj'], emoji: '📸', category: 'Criativo' },
  { terms: ['musico', 'cantor', 'artista', 'ator', 'produtor cultural'], label: 'Músico / Artista / Produtor Cultural', tags: ['autonomo'], emoji: '🎸', category: 'Cultura' },
  { terms: ['atendente telemarketing', 'call center', 'suporte'], label: 'Operador(a) de Telemarketing / SAC', tags: ['clt', 'jovem'], emoji: '🎧', category: 'Serviços' },

  // ── CONDIÇÕES SOCIAIS ESPECIAIS ──
  { terms: ['dona de casa', 'do lar', 'cuidadora familiar', 'maternidade'], label: 'Do Lar / Cuidadora da Família', tags: ['mae', 'autonomo'], emoji: '🏠', category: 'Família' },
  { terms: ['aposentado', 'aposentada', 'pensionista inss', 'bpc loas'], label: 'Aposentado(a) / Pensionista', tags: ['aposentado', 'bpc'], emoji: '🧓', category: 'Social' },
  { terms: ['estudante', 'universitario', 'colegial', 'jovem aprendiz'], label: 'Estudante / Jovem Aprendiz', tags: ['jovem', 'universitario'], emoji: '🎓', category: 'Estudante' },
  { terms: ['desempregado', 'procurando emprego', 'bico', 'sem carteira'], label: 'Desempregado(a) / Em Busca de Oportunidade', tags: ['desempregado', 'periferia'], emoji: '📋', category: 'Social' },
];

/** Normaliza texto removendo acentos e pontuações para busca insensível */
function normalizeText(text: string): string {
  return text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
}

/** Busca ocupações com fuzzy search e retorno inteligente de sugestões */
export function searchOccupations(query: string, maxResults: number = 8): Occupation[] {
  if (!query || query.trim().length === 0) {
    // Retorna as mais populares de entrada
    return OCCUPATIONS.slice(0, maxResults);
  }

  const cleanQuery = normalizeText(query);
  const termsList = cleanQuery.split(/\s+/);

  const matched = OCCUPATIONS.filter((occ) => {
    const cleanLabel = normalizeText(occ.label);
    const cleanCategory = normalizeText(occ.category);
    const terms = occ.terms.map(normalizeText);

    // Bate com a label diretamente
    if (cleanLabel.includes(cleanQuery)) return true;
    if (cleanCategory.includes(cleanQuery)) return true;

    // Bate com algum dos termos
    return terms.some(t => t.includes(cleanQuery) || termsList.every(term => t.includes(term)));
  });

  return matched.slice(0, maxResults);
}

/** Inferência de tags para ocupações personalizadas digitadas pelo usuário ("Outros") */
export function inferTagsFromCustomOccupation(customTitle: string): ProfileTag[] {
  const norm = normalizeText(customTitle);
  const tags = new Set<ProfileTag>();

  // Regras de inferência semântica baseadas em radicais brasileiros
  if (/moto|uber|99|transp|caminh|frete|entreg|motor/i.test(norm)) {
    tags.add('motorista');
    tags.add('autonomo');
  }
  if (/pedreir|obra|eletric|encanad|pintor|mecanic|soldad|marcen/i.test(norm)) {
    tags.add('autonomo');
  }
  if (/venda|comerc|loja|balcao|atend|caixa/i.test(norm)) {
    tags.add('comerciante');
    tags.add('clt');
  }
  if (/enferm|medic|saude|dentist|posto|hospital|farmac/i.test(norm)) {
    tags.add('saude');
    tags.add('sus');
  }
  if (/prof|educ|escola|aula|pedagog|faculd/i.test(norm)) {
    tags.add('professor');
    tags.add('servidor_publico');
  }
  if (/estud|univers|faculd|coleg|aprend/i.test(norm)) {
    tags.add('jovem');
    tags.add('universitario');
  }
  if (/aposent|pens|idos/i.test(norm)) {
    tags.add('aposentado');
    tags.add('bpc');
  }
  if (/roca|agro|rural|campo|sitio|fazend|pesca/i.test(norm)) {
    tags.add('rural');
    tags.add('agronegocio');
  }
  if (/lar|dona de casa|mae|matern|cuidad/i.test(norm)) {
    tags.add('mae');
  }
  if (/servidor|concurs|polic|bombeir|guarda|militar/i.test(norm)) {
    tags.add('servidor_publico');
  }

  // Se nenhuma regra bater, atribui tags generalistas seguras
  if (tags.size === 0) {
    tags.add('autonomo');
    tags.add('generico');
  }

  return Array.from(tags);
}
