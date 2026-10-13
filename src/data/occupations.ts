// ═══════════════════════════════════════════════════════════════
// BORA APP — Catálogo de Ocupações
// Autocomplete inteligente que traduz termos coloquiais para
// categorias estratégicas de impacto econômico
// ═══════════════════════════════════════════════════════════════

import { ProfileTag } from './arguments';

export interface Occupation {
  /** O que o usuário pode digitar */
  terms: string[];
  /** Nome bonito que aparece na UI */
  label: string;
  /** Tags de perfil que essa ocupação ativa no engine */
  tags: ProfileTag[];
  /** Ícone emoji */
  emoji: string;
}

export const OCCUPATIONS: Occupation[] = [
  // Transporte / Entregas
  { terms: ['uber', 'motorista de aplicativo', '99', 'indrive', 'motorista app'], label: 'Motorista de Aplicativo', tags: ['motorista', 'autonomo'], emoji: '🚗' },
  { terms: ['motoboy', 'entregador', 'ifood', 'rappi', 'entrega', 'delivery'], label: 'Entregador / Motoboy', tags: ['entregador', 'autonomo'], emoji: '🏍️' },
  { terms: ['caminhoneiro', 'motorista caminhao', 'transportador', 'freteiro'], label: 'Caminhoneiro', tags: ['motorista', 'autonomo'], emoji: '🚛' },
  { terms: ['taxista', 'taxi', 'taxi driver'], label: 'Taxista', tags: ['motorista', 'autonomo'], emoji: '🚕' },

  // Comércio / Serviços
  { terms: ['vendedor', 'lojista', 'balconista', 'atendente loja', 'vendas'], label: 'Vendedor(a) / Lojista', tags: ['clt', 'comerciante'], emoji: '🏬' },
  { terms: ['dono de bar', 'bar', 'boteco', 'restaurante', 'lanchonete', 'hamburgueria'], label: 'Dono(a) de Bar / Restaurante', tags: ['comerciante', 'autonomo'], emoji: '🍺' },
  { terms: ['comerciante', 'dono de loja', 'empreendedor', 'microempreendedor', 'mei'], label: 'Comerciante / MEI', tags: ['comerciante', 'autonomo'], emoji: '🏪' },
  { terms: ['cabeleireiro', 'cabeleireira', 'barbeiro', 'salao', 'manicure', 'esteticista'], label: 'Cabeleireiro(a) / Barbeiro(a)', tags: ['autonomo', 'comerciante'], emoji: '💇' },
  { terms: ['faxineira', 'diarista', 'empregada domestica', 'domestica', 'limpeza'], label: 'Diarista / Trabalho Doméstico', tags: ['autonomo', 'clt'], emoji: '🧹' },

  // Construção / Manual
  { terms: ['pedreiro', 'construcao', 'obra', 'servente', 'mestre de obras'], label: 'Pedreiro / Construção Civil', tags: ['autonomo', 'clt'], emoji: '🧱' },
  { terms: ['eletricista', 'eletrica', 'instalador'], label: 'Eletricista', tags: ['autonomo', 'clt'], emoji: '⚡' },
  { terms: ['encanador', 'bombeiro hidraulico', 'hidraulica'], label: 'Encanador', tags: ['autonomo'], emoji: '🔧' },
  { terms: ['mecanico', 'mecanica', 'oficina', 'funileiro'], label: 'Mecânico(a)', tags: ['autonomo', 'comerciante'], emoji: '🔩' },
  { terms: ['pintor', 'pintura', 'pintor de parede'], label: 'Pintor(a)', tags: ['autonomo'], emoji: '🎨' },

  // Agricultura / Rural
  { terms: ['agricultor', 'lavrador', 'sitiante', 'fazendeiro', 'rural', 'agro'], label: 'Agricultor(a)', tags: ['rural', 'autonomo'], emoji: '🌾' },
  { terms: ['pecuarista', 'gado', 'criador'], label: 'Pecuarista / Criador', tags: ['rural', 'autonomo', 'agronegocio'], emoji: '🐄' },

  // Saúde
  { terms: ['enfermeiro', 'enfermeira', 'tecnico enfermagem', 'auxiliar enfermagem'], label: 'Enfermeiro(a)', tags: ['saude', 'clt'], emoji: '👩‍⚕️' },
  { terms: ['agente de saude', 'acs', 'agente comunitario'], label: 'Agente Comunitário de Saúde', tags: ['saude', 'clt'], emoji: '🏥' },

  // Educação
  { terms: ['professor', 'professora', 'educador', 'docente', 'magistério'], label: 'Professor(a)', tags: ['professor', 'clt', 'servidor_publico'], emoji: '📚' },

  // Serviço Público
  { terms: ['servidor', 'servidor publico', 'funcionario publico', 'concursado'], label: 'Servidor(a) Público(a)', tags: ['servidor_publico', 'clt'], emoji: '🏛️' },

  // Outros
  { terms: ['dona de casa', 'do lar', 'cuidadora', 'cuidados'], label: 'Do Lar / Cuidadora', tags: ['mae', 'autonomo'], emoji: '🏠' },
  { terms: ['estudante', 'universitario', 'faculdade', 'estagiario'], label: 'Estudante / Universitário(a)', tags: ['jovem', 'universitario'], emoji: '🎓' },
  { terms: ['aposentado', 'aposentada', 'pensionista'], label: 'Aposentado(a) / Pensionista', tags: ['aposentado'], emoji: '👴' },
  { terms: ['desempregado', 'desempregada', 'sem emprego', 'procurando emprego'], label: 'Desempregado(a)', tags: ['desempregado'], emoji: '📋' },
  { terms: ['autonomo', 'freelancer', 'autonoma', 'por conta propria'], label: 'Autônomo(a) / Freelancer', tags: ['autonomo', 'pj'], emoji: '💼' },
  { terms: ['programador', 'desenvolvedor', 'ti', 'tecnologia', 'dev'], label: 'Tecnologia / TI', tags: ['pj', 'clt'], emoji: '💻' },
  { terms: ['seguranca', 'vigilante', 'porteiro', 'zelador'], label: 'Segurança / Porteiro', tags: ['clt'], emoji: '🔒' },
  { terms: ['garcom', 'garcone', 'garconete', 'atendente'], label: 'Garçom / Atendente', tags: ['clt', 'autonomo'], emoji: '🍽️' },
  { terms: ['costureira', 'costureiro', 'confeccao', 'textil'], label: 'Costureira(o) / Confecção', tags: ['autonomo', 'clt'], emoji: '🧵' },
  { terms: ['artesao', 'artesanato', 'artista', 'musico'], label: 'Artesão / Artista', tags: ['autonomo'], emoji: '🎭' },
];

/**
 * Busca ocupações que correspondem ao termo digitado pelo usuário.
 * Retorna as 5 melhores correspondências.
 */
export function searchOccupations(query: string): Occupation[] {
  if (!query || query.length < 2) return OCCUPATIONS.slice(0, 8);

  const normalized = query.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  return OCCUPATIONS
    .filter(occ =>
      occ.terms.some(term => {
        const normalizedTerm = term.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        return normalizedTerm.includes(normalized) || normalized.includes(normalizedTerm);
      }) ||
      occ.label.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes(normalized)
    )
    .slice(0, 5);
}

// ═══════════════════════════════════════
// ESTADOS E CIDADES
// ═══════════════════════════════════════

export interface BrazilianState {
  uf: string;
  name: string;
  capital: string;
}

export const BRAZILIAN_STATES: BrazilianState[] = [
  { uf: 'AC', name: 'Acre', capital: 'Rio Branco' },
  { uf: 'AL', name: 'Alagoas', capital: 'Maceió' },
  { uf: 'AP', name: 'Amapá', capital: 'Macapá' },
  { uf: 'AM', name: 'Amazonas', capital: 'Manaus' },
  { uf: 'BA', name: 'Bahia', capital: 'Salvador' },
  { uf: 'CE', name: 'Ceará', capital: 'Fortaleza' },
  { uf: 'DF', name: 'Distrito Federal', capital: 'Brasília' },
  { uf: 'ES', name: 'Espírito Santo', capital: 'Vitória' },
  { uf: 'GO', name: 'Goiás', capital: 'Goiânia' },
  { uf: 'MA', name: 'Maranhão', capital: 'São Luís' },
  { uf: 'MT', name: 'Mato Grosso', capital: 'Cuiabá' },
  { uf: 'MS', name: 'Mato Grosso do Sul', capital: 'Campo Grande' },
  { uf: 'MG', name: 'Minas Gerais', capital: 'Belo Horizonte' },
  { uf: 'PA', name: 'Pará', capital: 'Belém' },
  { uf: 'PB', name: 'Paraíba', capital: 'João Pessoa' },
  { uf: 'PR', name: 'Paraná', capital: 'Curitiba' },
  { uf: 'PE', name: 'Pernambuco', capital: 'Recife' },
  { uf: 'PI', name: 'Piauí', capital: 'Teresina' },
  { uf: 'RJ', name: 'Rio de Janeiro', capital: 'Rio de Janeiro' },
  { uf: 'RN', name: 'Rio Grande do Norte', capital: 'Natal' },
  { uf: 'RS', name: 'Rio Grande do Sul', capital: 'Porto Alegre' },
  { uf: 'RO', name: 'Rondônia', capital: 'Porto Velho' },
  { uf: 'RR', name: 'Roraima', capital: 'Boa Vista' },
  { uf: 'SC', name: 'Santa Catarina', capital: 'Florianópolis' },
  { uf: 'SP', name: 'São Paulo', capital: 'São Paulo' },
  { uf: 'SE', name: 'Sergipe', capital: 'Aracaju' },
  { uf: 'TO', name: 'Tocantins', capital: 'Palmas' },
];
