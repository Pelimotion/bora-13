// ═══════════════════════════════════════════════════════════════
// BORA APP — Dados Geográficos do Brasil (UFs + Principais Cidades)
// ═══════════════════════════════════════════════════════════════

export interface StateGeo {
  uf: string;
  name: string;
  capital: string;
  region: 'Norte' | 'Nordeste' | 'Centro-Oeste' | 'Sudeste' | 'Sul';
  svgPath: string; // SVG path data for interactive map
  labelPos: { x: number; y: number };
  majorCities: string[];
}

// Cidades representativas por estado (Capitais + Maiores polos regionais)
export const BRAZIL_STATES_GEO: StateGeo[] = [
  // ── NORTE ──
  {
    uf: 'AC',
    name: 'Acre',
    capital: 'Rio Branco',
    region: 'Norte',
    svgPath: 'M 45 285 L 75 270 L 95 295 L 90 325 L 50 320 Z',
    labelPos: { x: 65, y: 300 },
    majorCities: ['Rio Branco', 'Cruzeiro do Sul', 'Sena Madureira', 'Tarauacá', 'Feijó'],
  },
  {
    uf: 'AM',
    name: 'Amazonas',
    capital: 'Manaus',
    region: 'Norte',
    svgPath: 'M 75 160 L 175 140 L 220 185 L 195 260 L 105 275 L 75 240 Z',
    labelPos: { x: 145, y: 205 },
    majorCities: ['Manaus', 'Parintins', 'Itacoatiara', 'Manacapuru', 'Coari', 'Tefé'],
  },
  {
    uf: 'RR',
    name: 'Roraima',
    capital: 'Boa Vista',
    region: 'Norte',
    svgPath: 'M 175 80 L 215 95 L 205 165 L 165 145 Z',
    labelPos: { x: 190, y: 125 },
    majorCities: ['Boa Vista', 'Rorainópolis', 'Caracaraí', 'Pacaraima'],
  },
  {
    uf: 'PA',
    name: 'Pará',
    capital: 'Belém',
    region: 'Norte',
    svgPath: 'M 220 135 L 325 155 L 320 255 L 245 275 L 215 185 Z',
    labelPos: { x: 270, y: 200 },
    majorCities: ['Belém', 'Ananindeua', 'Santarém', 'Marabá', 'Parauapebas', 'Castanhal', 'Altamira'],
  },
  {
    uf: 'AP',
    name: 'Amapá',
    capital: 'Macapá',
    region: 'Norte',
    svgPath: 'M 285 90 L 325 105 L 305 155 L 275 140 Z',
    labelPos: { x: 295, y: 125 },
    majorCities: ['Macapá', 'Santana', 'Laranjal do Jari', 'Oiapoque'],
  },
  {
    uf: 'TO',
    name: 'Tocantins',
    capital: 'Palmas',
    region: 'Norte',
    svgPath: 'M 315 245 L 350 255 L 340 350 L 305 330 Z',
    labelPos: { x: 325, y: 295 },
    majorCities: ['Palmas', 'Araguaína', 'Gurupi', 'Porto Nacional', 'Paraíso do Tocantins'],
  },
  {
    uf: 'RO',
    name: 'Rondônia',
    capital: 'Porto Velho',
    region: 'Norte',
    svgPath: 'M 105 275 L 165 265 L 180 330 L 125 340 Z',
    labelPos: { x: 140, y: 305 },
    majorCities: ['Porto Velho', 'Ji-Paraná', 'Ariquemes', 'Vilhena', 'Cacoal'],
  },

  // ── NORDESTE ──
  {
    uf: 'MA',
    name: 'Maranhão',
    capital: 'São Luís',
    region: 'Nordeste',
    svgPath: 'M 325 155 L 385 170 L 380 255 L 335 245 Z',
    labelPos: { x: 355, y: 205 },
    majorCities: ['São Luís', 'Imperatriz', 'São José de Ribamar', 'Timon', 'Caxias', 'Codó'],
  },
  {
    uf: 'PI',
    name: 'Piauí',
    capital: 'Teresina',
    region: 'Nordeste',
    svgPath: 'M 385 175 L 420 195 L 395 285 L 365 265 Z',
    labelPos: { x: 390, y: 235 },
    majorCities: ['Teresina', 'Parnaíba', 'Picos', 'Piripiri', 'Floriano'],
  },
  {
    uf: 'CE',
    name: 'Ceará',
    capital: 'Fortaleza',
    region: 'Nordeste',
    svgPath: 'M 420 185 L 465 190 L 450 240 L 415 220 Z',
    labelPos: { x: 440, y: 210 },
    majorCities: ['Fortaleza', 'Caucaia', 'Juazeiro do Norte', 'Maracanaú', 'Sobral', 'Crato'],
  },
  {
    uf: 'RN',
    name: 'Rio Grande do Norte',
    capital: 'Natal',
    region: 'Nordeste',
    svgPath: 'M 465 195 L 495 200 L 485 225 L 455 220 Z',
    labelPos: { x: 475, y: 210 },
    majorCities: ['Natal', 'Mossoró', 'Parnamirim', 'São Gonçalo do Amarante', 'Ceará-Mirim'],
  },
  {
    uf: 'PB',
    name: 'Paraíba',
    capital: 'João Pessoa',
    region: 'Nordeste',
    svgPath: 'M 455 220 L 495 225 L 490 245 L 450 240 Z',
    labelPos: { x: 470, y: 232 },
    majorCities: ['João Pessoa', 'Campina Grande', 'Santa Rita', 'Patos', 'Bayeux', 'Sousa'],
  },
  {
    uf: 'PE',
    name: 'Pernambuco',
    capital: 'Recife',
    region: 'Nordeste',
    svgPath: 'M 410 240 L 490 245 L 485 265 L 415 255 Z',
    labelPos: { x: 450, y: 252 },
    majorCities: ['Recife', 'Jaboatão dos Guararapes', 'Olinda', 'Caruaru', 'Petrolina', 'Paulista'],
  },
  {
    uf: 'AL',
    name: 'Alagoas',
    capital: 'Maceió',
    region: 'Nordeste',
    svgPath: 'M 460 265 L 485 265 L 475 285 L 455 280 Z',
    labelPos: { x: 470, y: 275 },
    majorCities: ['Maceió', 'Arapiraca', 'Rio Largo', 'Palmeira dos Índios', 'Penedo'],
  },
  {
    uf: 'SE',
    name: 'Sergipe',
    capital: 'Aracaju',
    region: 'Nordeste',
    svgPath: 'M 450 285 L 470 288 L 460 305 L 442 298 Z',
    labelPos: { x: 455, y: 295 },
    majorCities: ['Aracaju', 'Nossa Senhora do Socorro', 'Lagarto', 'Itabaiana', 'Estância'],
  },
  {
    uf: 'BA',
    name: 'Bahia',
    capital: 'Salvador',
    region: 'Nordeste',
    svgPath: 'M 365 265 L 450 270 L 460 345 L 410 380 L 360 345 Z',
    labelPos: { x: 410, y: 315 },
    majorCities: ['Salvador', 'Feira de Santana', 'Vitória da Conquista', 'Camaçari', 'Juazeiro', 'Itabuna', 'Ilhéus', 'Porto Seguro'],
  },

  // ── CENTRO-OESTE ──
  {
    uf: 'MT',
    name: 'Mato Grosso',
    capital: 'Cuiabá',
    region: 'Centro-Oeste',
    svgPath: 'M 180 255 L 295 245 L 290 370 L 205 380 L 175 325 Z',
    labelPos: { x: 235, y: 310 },
    majorCities: ['Cuiabá', 'Várzea Grande', 'Rondonópolis', 'Sinop', 'Tangará da Serra', 'Sorriso'],
  },
  {
    uf: 'GO',
    name: 'Goiás',
    capital: 'Goiânia',
    region: 'Centro-Oeste',
    svgPath: 'M 295 330 L 355 335 L 345 410 L 285 395 Z',
    labelPos: { x: 318, y: 368 },
    majorCities: ['Goiânia', 'Aparecida de Goiânia', 'Anápolis', 'Rio Verde', 'Luziânia', 'Águas Lindas'],
  },
  {
    uf: 'DF',
    name: 'Distrito Federal',
    capital: 'Brasília',
    region: 'Centro-Oeste',
    svgPath: 'M 335 348 L 348 348 L 348 358 L 335 358 Z',
    labelPos: { x: 341, y: 353 },
    majorCities: ['Brasília', 'Ceilândia', 'Taguatinga', 'Samambaia', 'Plano Piloto'],
  },
  {
    uf: 'MS',
    name: 'Mato Grosso do Sul',
    capital: 'Campo Grande',
    region: 'Centro-Oeste',
    svgPath: 'M 215 385 L 285 390 L 270 470 L 210 445 Z',
    labelPos: { x: 245, y: 425 },
    majorCities: ['Campo Grande', 'Dourados', 'Três Lagoas', 'Corumbá', 'Ponta Porã'],
  },

  // ── SUDESTE ──
  {
    uf: 'MG',
    name: 'Minas Gerais',
    capital: 'Belo Horizonte',
    region: 'Sudeste',
    svgPath: 'M 335 365 L 415 355 L 435 425 L 365 460 L 315 420 Z',
    labelPos: { x: 375, y: 410 },
    majorCities: ['Belo Horizonte', 'Uberlândia', 'Contagem', 'Juiz de Fora', 'Betim', 'Montes Claros', 'Ribeirão das Neves', 'Uberaba', 'Governador Valadares'],
  },
  {
    uf: 'ES',
    name: 'Espírito Santo',
    capital: 'Vitória',
    region: 'Sudeste',
    svgPath: 'M 425 405 L 450 410 L 440 445 L 420 435 Z',
    labelPos: { x: 432, y: 425 },
    majorCities: ['Vitória', 'Vila Velha', 'Serra', 'Cariacica', 'Cachoeiro de Itapemirim', 'Linhares'],
  },
  {
    uf: 'RJ',
    name: 'Rio de Janeiro',
    capital: 'Rio de Janeiro',
    region: 'Sudeste',
    svgPath: 'M 395 445 L 440 440 L 425 465 L 385 465 Z',
    labelPos: { x: 410, y: 455 },
    majorCities: ['Rio de Janeiro', 'São Gonçalo', 'Duque de Caxias', 'Nova Iguaçu', 'Niterói', 'Belford Roxo', 'Campos dos Goytacazes', 'São João de Meriti', 'Petrópolis', 'Volta Redonda'],
  },
  {
    uf: 'SP',
    name: 'São Paulo',
    capital: 'São Paulo',
    region: 'Sudeste',
    svgPath: 'M 275 425 L 365 425 L 375 470 L 310 490 L 265 460 Z',
    labelPos: { x: 315, y: 455 },
    majorCities: ['São Paulo', 'Guarulhos', 'Campinas', 'São Bernardo do Campo', 'Santo André', 'São José dos Campos', 'Ribeirão Preto', 'Osasco', 'Sorocaba', 'Santos', 'Mauá', 'São José do Rio Preto', 'Mogi das Cruzes', 'Jundiaí', 'Piracicaba', 'Bauru'],
  },

  // ── SUL ──
  {
    uf: 'PR',
    name: 'Paraná',
    capital: 'Curitiba',
    region: 'Sul',
    svgPath: 'M 260 465 L 325 470 L 315 515 L 245 505 Z',
    labelPos: { x: 285, y: 490 },
    majorCities: ['Curitiba', 'Londrina', 'Maringá', 'Ponta Grossa', 'Cascavel', 'São José dos Pinhais', 'Foz do Iguaçu'],
  },
  {
    uf: 'SC',
    name: 'Santa Catarina',
    capital: 'Florianópolis',
    region: 'Sul',
    svgPath: 'M 265 510 L 320 515 L 310 545 L 255 535 Z',
    labelPos: { x: 285, y: 528 },
    majorCities: ['Florianópolis', 'Joinville', 'Blumenau', 'São José', 'Chapecó', 'Itajaí', 'Criciúma'],
  },
  {
    uf: 'RS',
    name: 'Rio Grande do Sul',
    capital: 'Porto Alegre',
    region: 'Sul',
    svgPath: 'M 245 535 L 305 545 L 290 610 L 225 595 L 225 550 Z',
    labelPos: { x: 265, y: 575 },
    majorCities: ['Porto Alegre', 'Caxias do Sul', 'Canoas', 'Pelotas', 'Santa Maria', 'Gravataí', 'Viamão', 'Novo Hamburgo', 'São Leopoldo', 'Rio Grande', 'Passo Fundo'],
  },
];

export const REGIONS = ['Todas', 'Norte', 'Nordeste', 'Centro-Oeste', 'Sudeste', 'Sul'] as const;

export function getStateByUF(uf: string): StateGeo | undefined {
  return BRAZIL_STATES_GEO.find(s => s.uf.toUpperCase() === uf.toUpperCase());
}
