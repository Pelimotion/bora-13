'use client';

import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import JSZip from 'jszip';
import {
  type PostPresetData,
  type PostFormat,
  type VisualTheme,
  type TonerStyle,
  type CopyPlatform,
  type SlideArchetype,
  type AgenticWorkingMemory,
  generateSmartCopy,
  createDefaultPostPreset,
  playProceduralHaptic,
} from '@/lib/agenticOrchestrator';
import { copyToClipboardClean } from '@/lib/shareUtils';

interface PostStudioSectionProps {
  initialPreset?: PostPresetData | null;
  memory?: AgenticWorkingMemory;
  onNavigateSection?: (section: any) => void;
}

// ─────────────────────────────────────────────────────────────
// RESOLUÇÃO DE CAMINHO DE ASSETS (DOMÍNIO PRÓPRIO PATRIAAMADA.LAT)
// ─────────────────────────────────────────────────────────────
export function resolveAssetPath(path: string): string {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) return path;
  if (path.startsWith('/bora/')) return path.replace('/bora/', '/');
  if (path.startsWith('/')) return path;
  return `/${path}`;
}

// ─────────────────────────────────────────────────────────────
// PAUTAS ESTRATÉGICAS PRIORITÁRIAS (NARRATIVA CLARA & VIRADA DE VOTO)
// Pensado elemento por elemento com foco na realidade popular
// ─────────────────────────────────────────────────────────────
const STRATEGIC_CATEGORIES = [
  {
    id: 'alimentacao',
    title: 'Cesta Básica & Preço da Feira',
    targetAudience: 'Para mães, famílias e donas de casa',
    strategicGoal: 'Desarmar a ideia de que "o mercado tá caro demais"',
    emoji: '🥩',
    badge: 'Alimentação & Salário',
    badgeColor: '#10B981',
    photoUrl: '/images/news-market.jpg',
    headline: 'O que a cesta básica revela sobre a inflação e o poder de compra no mercado',
    source: 'IBGE & DIEESE',
    newsSource: 'IBGE • AGÊNCIA DE NOTÍCIAS',
    newsHeadline: 'Deflação da cesta básica é registrada em 17 capitais e poder de compra sobe',
    proof: 'DIEESE e IBGE: Queda comprovada no valor da cesta básica em 17 capitais e aumento real de 3% no salário mínimo.',
    statNumber: '17 CAPITAIS',
    statLabel: 'Queda comprovada no valor da cesta básica (DIEESE)',
    objection: 'Dizem que o mercado tá cada dia mais caro e que nada mudou no dia a dia',
    rebuttal: 'A inflação oficial acumulada fechou dentro da meta e o poder de compra do salário mínimo teve aumento real de 3% acima da inflação.',
    act1Hook: 'Você já reparou no preço do óleo, leite e da carne este mês? Veja o que os dados do DIEESE provam.',
    act4Pocket: 'Mais comida no prato e poder de compra recuperado para quem vive de salário e sustenta a família.',
  },
  {
    id: 'trabalho',
    title: 'Fim da Escala 6x1 & Emprego',
    targetAudience: 'Para trabalhadores do comércio, jovem e logística',
    strategicGoal: 'Mostrar quem defende o trabalhador e o descanso digno',
    emoji: '⏰',
    badge: 'Trabalho & Descanso',
    badgeColor: '#3B82F6',
    photoUrl: '/images/news-workers.jpg',
    headline: 'Você trabalha 6 dias para descansar 1. Quem quer mudar isso?',
    source: 'CAGED • MINISTÉRIO DO TRABALHO',
    newsSource: 'CAGED • DADOS OFICIAIS',
    newsHeadline: 'Brasil bate recorde com mais de 3 milhões de postos de trabalho com carteira assinada',
    proof: 'Caged: Mais de 3 milhões de postos formais criados e apoio oficial à revisão da jornada 6x1 sem corte de salário.',
    statNumber: '+3 MILHÕES',
    statLabel: 'Carteiras assinadas geradas no Brasil (Caged)',
    objection: 'Dizem que acabar com a escala 6x1 vai quebrar os comerciantes e causar desemprego',
    rebuttal: 'Estudos do DIEESE e experiências internacionais provam aumento de produtividade, menor rotatividade e mais saúde mental.',
    act1Hook: 'Você aguenta continuar na escala 6x1 até se aposentar? Conheça os dados sobre o descanso digno.',
    act4Pocket: 'Mais tempo com seus filhos, mais descanso aos domingos e o mesmo salário garantido na conta todo mês.',
  },
  {
    id: 'educacao',
    title: 'Poupança Pé-de-Meia para o Jovem',
    targetAudience: 'Para pais e alunos de escola pública',
    strategicGoal: 'Mostrar benefício direto na mão do jovem que quer estudar',
    emoji: '🎓',
    badge: 'Futuro da Juventude',
    badgeColor: '#8B5CF6',
    photoUrl: '/images/news-education.jpg',
    headline: 'Até R$ 9.200 na poupança para seu filho não largar os estudos',
    source: 'MEC • CAIXA ECONÔMICA',
    newsSource: 'MINISTÉRIO DA EDUCAÇÃO',
    newsHeadline: 'Pé-de-Meia atinge 4 milhões de estudantes com depósitos mensais de R$ 200 na Caixa',
    proof: 'MEC: Quase 4 milhões de estudantes da rede pública recebem depósitos mensais de R$ 200 mais bônus de R$ 1.000 ao fim de cada ano.',
    statNumber: 'R$ 9.200',
    statLabel: 'Poupança total por aluno ao se formar no Ensino Médio',
    objection: 'Dizem que o governo não investe de verdade no futuro da juventude',
    rebuttal: 'O programa Pé-de-Meia é uma lei federal com fundo orçamentário próprio de mais de R$ 20 bilhões garantido na Caixa.',
    act1Hook: 'Você sabia que seu filho ou neto de escola pública tem direito a receber depósitos mensais da Caixa?',
    act4Pocket: 'Alívio financeiro imediato para a família e futuro garantido para a juventude que quer trabalhar e vencer.',
  },
  {
    id: 'menos_flavio',
    title: 'Comparar Gestões: O Risco com Flávio',
    targetAudience: 'Para aposentados e eleitores indecisos',
    strategicGoal: 'Alertar sobre corte de 59% na Farmácia Popular e arrocho',
    emoji: '📉',
    badge: 'Comparativo de Gestões',
    badgeColor: '#EF4444',
    photoUrl: '/images/territory-sp.jpg',
    headline: 'O remédio de pressão e diabetes da sua mãe corre risco?',
    source: 'ORÇAMENTO DA UNIÃO • MINISTÉRIO DA SAÚDE',
    newsSource: 'ORÇAMENTO FEDERAL • DADOS PÚBLICOS',
    newsHeadline: 'Registros do Congresso confirmam corte de 59% na verba da Farmácia Popular sob gestão anterior',
    proof: 'Registros do Congresso Nacional: corte de 59% na verba da Farmácia Popular e votos contrários a direitos do trabalhador.',
    statNumber: '-59%',
    statLabel: 'Corte na Farmácia Popular sob gestão anterior',
    objection: 'Dizem que nada muda na saúde e no posto se mudar o governo federal',
    rebuttal: 'Sem orçamento federal, farmácias credenciadas suspendem a entrega gratuita e a família tem que pagar do próprio bolso.',
    act1Hook: 'Você sabe quanto custa o remédio de pressão e diabetes todo mês? Veja o que o orçamento prova.',
    act4Pocket: 'Economia real de mais de R$ 180 por mês no bolso do idoso trabalhador com remédio 100% gratuito.',
  },
  {
    id: 'desarme',
    title: 'Desarmar Mentiras no WhatsApp',
    targetAudience: 'Para almoço de domingo e grupos de família',
    strategicGoal: 'Responder parentes e colegas sem briga, apenas com fatos',
    emoji: '🛡️',
    badge: 'Checagem de Fatos',
    badgeColor: '#F59E0B',
    photoUrl: '/images/hero-dialogue.jpg',
    headline: 'Disseram no grupo que tudo piorou? Veja o que os documentos provam',
    source: 'DIÁRIO OFICIAL & REGISTROS PÚBLICOS',
    newsSource: 'REGISTROS DO ESTADO BRASILEIRO',
    newsHeadline: 'Desemprego atinge menor patamar em 10 anos e reservas internacionais crescem',
    proof: 'Fontes primárias do Estado brasileiro: balanços da Fazenda, dados do Caged e levantamentos de preços do DIEESE.',
    statNumber: 'MENOR TAXA',
    statLabel: 'Menor taxa de desemprego em 10 anos no Brasil',
    objection: 'Dizem nas redes sociais que "o Brasil tá quebrando e vai piorar"',
    rebuttal: 'O desemprego caiu para o menor patamar em 10 anos, reservas internacionais cresceram e o risco-país recuou.',
    act1Hook: 'Antes de brigar no grupo de família, olhe esses números comprovados em registros públicos.',
    act4Pocket: 'A verdade não precisa de grito: números oficiais falam por si e protegem o diálogo.',
  },
  {
    id: 'territorio',
    title: 'Obras & Verbas na Minha Região',
    targetAudience: 'Para eleitores de SC, SP e cidades locais',
    strategicGoal: 'Mostrar investimentos federais concretos no seu estado',
    emoji: '📍',
    badge: 'Dossiê Regional',
    badgeColor: '#06B6D4',
    photoUrl: '/images/territory-sc.jpg',
    headline: 'Como os investimentos federais estão impactando as cidades do nosso estado',
    source: 'MINISTÉRIO DA FAZENDA • DADOS PÚBLICOS',
    newsSource: 'MINISTÉRIO DA FAZENDA • BALANÇO OFICIAL',
    newsHeadline: 'Repasses recordes para infraestrutura, saúde e escolas beneficiam municípios do estado',
    proof: 'Balanço Oficial: Recorde de repasses federais para infraestrutura, saúde pública e créditos facilitados para o comércio local.',
    statNumber: '100% AUDITADO',
    statLabel: 'Dados abertos e fiscalizados por órgãos de controle',
    objection: 'Dizem que o governo federal esqueceu o nosso estado e não investe aqui',
    rebuttal: 'Os relatórios de execução orçamentária comprovam retomada de obras paralisadas e repasses recordes para municípios.',
    act1Hook: 'O impacto real das medidas econômicas na infraestrutura e nos hospitais da nossa região.',
    act4Pocket: 'O comércio local ganha força quando os trabalhadores e aposentados têm renda circulando no bairro.',
  },
];

// ─────────────────────────────────────────────────────────────
// TEMPLATES VISUAIS PRÉ-PRONTOS (MINIATURAS VISUAIS DE ALTO NÍVEL)
// Miniaturas fieis que mostram a estética do post antes da escolha
// ─────────────────────────────────────────────────────────────
interface PresetVisualTemplate {
  id: string;
  title: string;
  desc: string;
  badge: string;
  bgUrl: string;
  toner: TonerStyle;
  intensity: number;
  newsCard: boolean;
  newsSource: string;
  newsImg: string;
  theme: VisualTheme;
  accentColor: string;
  miniBgClass: string;
  miniBadgeColor: string;
  miniSampleNumber?: string;
}

const PRESET_VISUAL_TEMPLATES: PresetVisualTemplate[] = [
  {
    id: 'tpl-noticiosa',
    title: 'Manchete Noticiosa',
    desc: 'Capa estilo G1/IBGE com recorte fotográfico de jornal e selo auditado',
    badge: 'Padrão Editorial',
    bgUrl: '/images/news-market.jpg',
    toner: 'toner-rubro',
    intensity: 0.82,
    newsCard: true,
    newsSource: 'IBGE • AGÊNCIA DE NOTÍCIAS',
    newsImg: '/images/news-market.jpg',
    theme: 'brasil-editorial',
    accentColor: '#C52229',
    miniBgClass: 'from-slate-950 via-red-950/70 to-slate-900',
    miniBadgeColor: 'bg-red-600 text-white',
  },
  {
    id: 'tpl-territorial',
    title: 'Dossiê Territorial',
    desc: 'Fotografia urbana da sua região com toner cinematográfico vermelho profundo',
    badge: 'Território & Cinema',
    bgUrl: '/images/territory-sc.jpg',
    toner: 'toner-rubro',
    intensity: 0.86,
    newsCard: true,
    newsSource: 'MINISTÉRIO DA FAZENDA • DADOS PÚBLICOS',
    newsImg: '/images/territory-sc.jpg',
    theme: 'brasil-editorial',
    accentColor: '#EF4444',
    miniBgClass: 'from-red-950 via-slate-950 to-black',
    miniBadgeColor: 'bg-red-500 text-white',
  },
  {
    id: 'tpl-bigstat',
    title: 'Big Stat Monumental',
    desc: 'Super número verde esmeralda com dados auditados em primeiro plano',
    badge: 'Super Número',
    bgUrl: '/images/news-workers.jpg',
    toner: 'toner-dark',
    intensity: 0.90,
    newsCard: false,
    newsSource: 'CAGED • MINISTÉRIO DO TRABALHO',
    newsImg: '/images/news-workers.jpg',
    theme: 'dark-moderno',
    accentColor: '#10B981',
    miniBgClass: 'from-slate-950 via-emerald-950/60 to-black',
    miniBadgeColor: 'bg-emerald-600 text-white',
    miniSampleNumber: '+3 MILHÕES',
  },
  {
    id: 'tpl-pb',
    title: 'P&B Investigativo',
    desc: 'Estilo jornalístico de alto contraste monocromático e denúncia contundente',
    badge: 'Investigativo',
    bgUrl: '/images/territory-sp.jpg',
    toner: 'toner-pb',
    intensity: 0.88,
    newsCard: true,
    newsSource: 'FOLHA DE S.PAULO • ECONOMIA',
    newsImg: '/images/territory-sp.jpg',
    theme: 'dark-moderno',
    accentColor: '#F87171',
    miniBgClass: 'from-neutral-900 via-neutral-950 to-black',
    miniBadgeColor: 'bg-neutral-800 text-red-400 border border-red-500/30',
  },
  {
    id: 'tpl-esperanca',
    title: 'Cívico Esperança',
    desc: 'Verde floresta e dourado para inspirar acolhimento, diálogo e união popular',
    badge: 'Diálogo & Futuro',
    bgUrl: '/images/campaign-workshop.jpg',
    toner: 'toner-brasil',
    intensity: 0.82,
    newsCard: false,
    newsSource: 'BORA 13 • INICIATIVA CIDADÃ',
    newsImg: '/images/campaign-workshop.jpg',
    theme: 'brasil-vibrante',
    accentColor: '#F59E0B',
    miniBgClass: 'from-emerald-950 via-slate-950 to-amber-950/40',
    miniBadgeColor: 'bg-amber-600 text-white',
    miniSampleNumber: '⭐ BORA 13',
  },
];

export default function PostStudioSection({
  initialPreset,
  memory,
  onNavigateSection,
}: PostStudioSectionProps) {
  // Estado do Post Preset Atual
  const [preset, setPreset] = useState<PostPresetData>(() => initialPreset || createDefaultPostPreset());
  const [format, setFormat] = useState<PostFormat>(preset.format || 'portrait');
  const [theme, setTheme] = useState<VisualTheme>(preset.theme || 'brasil-editorial');
  const [activeSlide, setActiveSlide] = useState<number>(0);
  const [copyTab, setCopyTab] = useState<CopyPlatform>('instagram');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportProgress, setExportProgress] = useState<string>('');

  // Passo Ativo do Stepper Progressivo (1 = Pauta, 2 = Estilo Visual, 3 = Post Pronto)
  const [activeStep, setActiveStep] = useState<1 | 2 | 3>(3);

  // Categoria estratégica ativa
  const [activeCategory, setActiveCategory] = useState<string>('alimentacao');

  // Template visual ativo
  const [activeTemplateId, setActiveTemplateId] = useState<string>('tpl-noticiosa');

  // Configurações de Fundo Fotográfico & Toner
  const [showBgPhoto, setShowBgPhoto] = useState<boolean>(true);
  const [bgImageUrl, setBgImageUrl] = useState<string>(
    memory?.selectedUF === 'SP' ? '/images/territory-sp.jpg' : '/images/territory-sc.jpg'
  );
  const [tonerStyle, setTonerStyle] = useState<TonerStyle>('toner-rubro');
  const [tonerIntensity, setTonerIntensity] = useState<number>(0.84);

  // Configurações de Notícia / Manchete
  const [showNewsCard, setShowNewsCard] = useState<boolean>(true);
  const [newsSource, setNewsSource] = useState<string>('IBGE • AGÊNCIA DE NOTÍCIAS');
  const [newsDate, setNewsDate] = useState<string>('OUTUBRO 2024 • REGISTRO PÚBLICO OFICIAL');
  const [newsHeadline, setNewsHeadline] = useState<string>(
    'Deflação da cesta básica é registrada em 17 capitais e poder de compra sobe'
  );
  const [newsImageUrl, setNewsImageUrl] = useState<string>('/images/news-market.jpg');

  // Configuração discreta de localização (HUD)
  const [territoryTag, setTerritoryTag] = useState<string>(() => {
    if (memory?.selectedCity && memory?.selectedUF) return `${memory.selectedCity} • ${memory.selectedUF}`;
    if (memory?.selectedUF) return `${memory.selectedUF} • Brasil`;
    return 'Santa Catarina • Florianópolis';
  });

  // Gaveta opcional minimalista de personalização
  const [showQuickSettings, setShowQuickSettings] = useState<boolean>(false);

  // Arquétipos visuais por slide
  const [slideArchetypes] = useState<Record<number, SlideArchetype>>({
    0: 'editorial-cover',
    1: 'big-stat-hero',
    2: 'dialectic-split',
    3: 'pocket-reality',
    4: 'manifesto-cta',
  });

  // Cache de imagens pré-carregadas para o canvas
  const imageCache = useRef<Map<string, HTMLImageElement>>(new Map());
  const [imagesReadyVersion, setImagesReadyVersion] = useState<number>(0);

  // Pré-carregamento imediato de todas as fotos fotográficas via basePath correto
  useEffect(() => {
    let isMounted = true;
    const preloadList = [
      '/images/territory-sc.jpg',
      '/images/territory-sp.jpg',
      '/images/news-workers.jpg',
      '/images/news-market.jpg',
      '/images/news-education.jpg',
      '/images/campaign-workshop.jpg',
      '/images/hero-dialogue.jpg',
    ];

    preloadList.forEach((rawPath) => {
      const resolved = resolveAssetPath(rawPath);
      if (imageCache.current.has(resolved)) return;

      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        if (!isMounted) return;
        imageCache.current.set(resolved, img);
        setImagesReadyVersion((v) => v + 1);
      };
      img.onerror = () => {
        // Fallback sem basePath caso ocorra erro
        if (resolved !== rawPath && !imageCache.current.has(rawPath)) {
          const fallbackImg = new Image();
          fallbackImg.crossOrigin = 'anonymous';
          fallbackImg.onload = () => {
            if (!isMounted) return;
            imageCache.current.set(rawPath, fallbackImg);
            setImagesReadyVersion((v) => v + 1);
          };
          fallbackImg.src = rawPath;
        }
      };
      img.src = resolved;
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const ensureImage = useCallback((rawPath: string): HTMLImageElement | null => {
    if (!rawPath) return null;
    const resolved = resolveAssetPath(rawPath);
    if (imageCache.current.has(resolved)) return imageCache.current.get(resolved)!;
    if (imageCache.current.has(rawPath)) return imageCache.current.get(rawPath)!;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      imageCache.current.set(resolved, img);
      setImagesReadyVersion((v) => v + 1);
    };
    img.src = resolved;
    return null;
  }, []);

  const TOTAL_SLIDES = 5;
  const isCarousel = format === 'carousel' || format === 'portrait';
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Geração de Legendas Inteligentes
  const copies = useMemo(
    () => generateSmartCopy(preset, memory),
    [preset, memory]
  );

  // Seleção de Categoria Estratégica (Passo 1)
  const handleSelectCategory = (catId: string) => {
    playProceduralHaptic('card');
    setActiveCategory(catId);
    const cat = STRATEGIC_CATEGORIES.find((c) => c.id === catId);
    if (!cat) return;

    setPreset((prev) => ({
      ...prev,
      title: cat.title,
      headline: cat.headline,
      categoryTag: cat.id,
      proofData: cat.proof,
      statNumber: cat.statNumber,
      statLabel: cat.statLabel,
      counterArg: cat.objection,
      rebuttal: cat.rebuttal,
      act1Hook: cat.act1Hook,
      act4PocketImpact: cat.act4Pocket,
      sourceName: cat.source,
    }));

    setNewsHeadline(cat.newsHeadline || cat.headline);
    setNewsSource(cat.newsSource || cat.source);
    setNewsImageUrl(cat.photoUrl);
    setBgImageUrl(cat.photoUrl);
    setActiveSlide(0);
    // Avança para visualização ou para o passo 2
    setActiveStep(3);
  };

  // Seleção de Template Visual Pré-Pronto (Passo 2)
  const handleSelectTemplate = (tplId: string) => {
    playProceduralHaptic('toggle');
    setActiveTemplateId(tplId);
    const tpl = PRESET_VISUAL_TEMPLATES.find((t) => t.id === tplId);
    if (!tpl) return;

    setShowBgPhoto(true);
    setBgImageUrl(tpl.bgUrl);
    setTonerStyle(tpl.toner);
    setTonerIntensity(tpl.intensity);
    setShowNewsCard(tpl.newsCard);
    setNewsSource(tpl.newsSource);
    setNewsImageUrl(tpl.newsImg);
    setTheme(tpl.theme);
    setActiveStep(3);
  };

  // Função para quebrar texto no canvas 2D
  const wrapText = (
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    maxWidth: number,
    lineHeight: number
  ): number => {
    if (!text) return y;
    const words = text.split(' ');
    let line = '';
    let currentY = y;

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        ctx.fillText(line.trim(), x, currentY);
        line = words[n] + ' ';
        currentY += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line.trim(), x, currentY);
    return currentY + lineHeight;
  };

  // Grão estocástico para acabamento de revista impressa
  const applyAnalogTexture = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    intensity: number = 0.022
  ) => {
    try {
      const w = Math.min(width, 1080);
      const h = Math.min(height, 1920);
      const imgData = ctx.getImageData(0, 0, w, h);
      const data = imgData.data;
      const len = data.length;
      for (let i = 0; i < len; i += 16) {
        const noise = (Math.random() - 0.5) * intensity * 255;
        data[i] = Math.min(255, Math.max(0, data[i] + noise));
        data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise));
        data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise));
      }
      ctx.putImageData(imgData, 0, 0);
    } catch {
      // Ignora erro caso cross-origin restrinja
    }
  };

  // ─────────────────────────────────────────────────────────────
  // RENDERIZADOR CANVAS 2D DE ALTO IMPACTO (USO TOTAL DO ESPAÇO)
  // Diagramação milimétrica para 1080x1350 sem vazios desconexos
  // ─────────────────────────────────────────────────────────────
  const renderCanvas = useCallback(
    (slideIdx: number = activeSlide) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const width = 1080;
      let height = 1350; // Padrão Retrato 4:5 Feed Instagram
      if (format === 'square') height = 1080;
      else if (format === 'story') height = 1920;
      else if (format === 'portrait' || format === 'carousel') height = 1350;

      canvas.width = width;
      canvas.height = height;

      // Fator de escala vertical para 1:1, 4:5 e 9:16
      const vScale = height / 1350;

      // ── 1. FUNDO TERRITORIAL COM TONER CINEMATOGRÁFICO ──
      const bgImg = showBgPhoto ? ensureImage(bgImageUrl) : null;

      if (showBgPhoto && bgImg) {
        const imgAspect = bgImg.width / bgImg.height;
        const canvasAspect = width / height;
        let dw = width;
        let dh = height;
        let dx = 0;
        let dy = 0;

        if (imgAspect > canvasAspect) {
          dw = height * imgAspect;
          dx = (width - dw) / 2;
        } else {
          dh = width / imgAspect;
          dy = (height - dh) / 2;
        }

        ctx.drawImage(bgImg, dx, dy, dw, dh);

        // Aplicação de Toner Editorial
        if (tonerStyle === 'toner-rubro') {
          // Rubro Povo / Vermelho Cidadão
          ctx.fillStyle = `rgba(165, 20, 25, ${0.78 * tonerIntensity})`;
          ctx.fillRect(0, 0, width, height);

          const redGlow = ctx.createRadialGradient(width - 150, 180, 50, width - 150, 180, 800);
          redGlow.addColorStop(0, `rgba(197, 34, 41, ${0.55 * tonerIntensity})`);
          redGlow.addColorStop(1, 'rgba(11, 15, 25, 0)');
          ctx.fillStyle = redGlow;
          ctx.fillRect(0, 0, width, height);

          const bottomGrad = ctx.createLinearGradient(0, height * 0.30, 0, height);
          bottomGrad.addColorStop(0, 'rgba(11, 15, 25, 0.25)');
          bottomGrad.addColorStop(1, `rgba(11, 15, 25, ${0.97 * tonerIntensity})`);
          ctx.fillStyle = bottomGrad;
          ctx.fillRect(0, 0, width, height);
        } else if (tonerStyle === 'toner-pb') {
          // P&B Investigativo de alto contraste
          ctx.fillStyle = `rgba(15, 23, 42, ${0.86 * tonerIntensity})`;
          ctx.fillRect(0, 0, width, height);

          const darkWash = ctx.createLinearGradient(0, 0, 0, height);
          darkWash.addColorStop(0, 'rgba(15, 23, 42, 0.45)');
          darkWash.addColorStop(1, `rgba(3, 7, 18, ${0.96 * tonerIntensity})`);
          ctx.fillStyle = darkWash;
          ctx.fillRect(0, 0, width, height);
        } else if (tonerStyle === 'toner-brasil') {
          // Verde Floresta & Ouro Cívico
          ctx.fillStyle = `rgba(0, 55, 30, ${0.82 * tonerIntensity})`;
          ctx.fillRect(0, 0, width, height);

          const amberGlow = ctx.createRadialGradient(width / 2, 220, 40, width / 2, 220, 700);
          amberGlow.addColorStop(0, `rgba(245, 158, 11, ${0.32 * tonerIntensity})`);
          amberGlow.addColorStop(1, 'rgba(0, 55, 30, 0)');
          ctx.fillStyle = amberGlow;
          ctx.fillRect(0, 0, width, height);

          const deepGreen = ctx.createLinearGradient(0, height * 0.35, 0, height);
          deepGreen.addColorStop(0, 'rgba(0, 30, 15, 0)');
          deepGreen.addColorStop(1, `rgba(0, 20, 10, ${0.95 * tonerIntensity})`);
          ctx.fillStyle = deepGreen;
          ctx.fillRect(0, 0, width, height);
        } else if (tonerStyle === 'toner-dark') {
          // Obsidian Night Film
          const noirGrad = ctx.createLinearGradient(0, 0, 0, height);
          noirGrad.addColorStop(0, `rgba(11, 15, 25, ${0.84 * tonerIntensity})`);
          noirGrad.addColorStop(0.5, `rgba(11, 15, 25, ${0.92 * tonerIntensity})`);
          noirGrad.addColorStop(1, `rgba(3, 5, 10, ${0.98 * tonerIntensity})`);
          ctx.fillStyle = noirGrad;
          ctx.fillRect(0, 0, width, height);
        } else {
          // Papel Editorial
          ctx.fillStyle = `rgba(248, 246, 240, ${0.90 * tonerIntensity})`;
          ctx.fillRect(0, 0, width, height);
        }
      } else {
        // Fallback Vetorial Escuro
        ctx.fillStyle = '#0B0F19';
        ctx.fillRect(0, 0, width, height);
        const redGlow = ctx.createRadialGradient(width - 100, 200, 40, width - 100, 200, 720);
        redGlow.addColorStop(0, 'rgba(197, 34, 41, 0.45)');
        redGlow.addColorStop(1, 'rgba(11, 15, 25, 0)');
        ctx.fillStyle = redGlow;
        ctx.fillRect(0, 0, width, height);
      }

      // Dimensões e Margens
      const margin = 72;
      const contentWidth = width - margin * 2;

      // Paleta Tipográfica
      const textPrimary = '#FFFFFF';
      const textSecondary = '#CBD5E1';
      const textMuted = '#94A3B8';
      const accentRed = '#C52229';
      const accentGold = '#F59E0B';
      const accentGreen = '#10B981';

      // ── 2. HUD DE CARROSSEL INSTAGRAM (TOPO DO POST) ──
      // Barras Segmentadas (01 a 05)
      if (isCarousel) {
        const totalBars = TOTAL_SLIDES;
        const barGap = 8;
        const barWidth = (contentWidth - (totalBars - 1) * barGap) / totalBars;
        const barY = 46 * (vScale < 1 ? 0.9 : 1);

        for (let b = 0; b < totalBars; b++) {
          const bx = margin + b * (barWidth + barGap);
          const isCurrent = b === slideIdx;
          const isFilled = b <= slideIdx;

          ctx.fillStyle = isCurrent
            ? accentRed
            : isFilled
            ? 'rgba(255, 255, 255, 0.85)'
            : 'rgba(255, 255, 255, 0.22)';

          ctx.beginPath();
          ctx.roundRect(bx, barY, barWidth, 6, 3);
          ctx.fill();
        }
      }

      // Pílulas de Geolocalização e Contador
      const hudY = 76 * (vScale < 1 ? 0.9 : 1);

      // Pílula de Localização (Esquerda)
      ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.beginPath();
      ctx.roundRect(margin, hudY, 340, 44, 22);
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.22)';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      ctx.fillStyle = '#FCA5A5';
      ctx.font = 'bold 18px Inter, -apple-system, sans-serif';
      ctx.fillText(`📍 ${territoryTag}`, margin + 18, hudY + 28);

      // Selo do Slide Ativo (Direita)
      ctx.fillStyle = 'rgba(197, 34, 41, 0.35)';
      ctx.beginPath();
      ctx.roundRect(width - margin - 170, hudY, 170, 44, 22);
      ctx.fill();
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.5)';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      ctx.fillStyle = '#F87171';
      ctx.font = '900 18px Inter, -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`SLIDE 0${slideIdx + 1} / 0${TOTAL_SLIDES}`, width - margin - 85, hudY + 28);
      ctx.textAlign = 'left';

      // ── 3. RENDERIZAÇÃO DO CONTEÚDO (APROVEITAMENTO MÁXIMO DO ESPAÇO) ──
      let currentY = 154 * (vScale < 1 ? 0.95 : 1);
      const archetype = slideArchetypes[slideIdx] || (slideIdx === 0 ? 'editorial-cover' : 'big-stat-hero');

      // ── ARQUÉTIPO 1: CAPA COM MANCHETE NOTICIOSA AUDITADA ──
      if (archetype === 'editorial-cover' || (!isCarousel && slideIdx === 0 && format !== 'story')) {
        // Chapéu / Kicker
        ctx.fillStyle = accentRed;
        ctx.font = '900 22px Inter, -apple-system, sans-serif';
        ctx.fillText(`[ 📰 DOSSIÊ DE DIÁLOGO • ${preset.categoryTag.toUpperCase()} ]`, margin, currentY);
        currentY += 40;

        // Manchete Monumental
        const rawHeadline = preset.headline;
        let fontSize = 62;
        if (rawHeadline.length > 70) fontSize = 50;
        else if (rawHeadline.length > 48) fontSize = 56;
        if (format === 'square') fontSize = Math.round(fontSize * 0.82);

        ctx.fillStyle = textPrimary;
        ctx.font = `900 ${fontSize}px Inter, -apple-system, sans-serif`;
        currentY = wrapText(ctx, rawHeadline, margin, currentY, contentWidth, fontSize * 1.15);
        currentY += 26 * vScale;

        // Card da Manchete Noticiosa Expandido (Foto em Alta Destaque)
        if (showNewsCard) {
          const cardH = Math.round(445 * vScale);
          const cardY = currentY;

          // Sombra cinematográfica
          ctx.save();
          ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
          ctx.shadowBlur = 36;
          ctx.shadowOffsetY = 18;

          ctx.fillStyle = 'rgba(15, 23, 42, 0.94)';
          ctx.beginPath();
          ctx.roundRect(margin, cardY, contentWidth, cardH, 24);
          ctx.fill();
          ctx.restore();

          ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
          ctx.lineWidth = 1.8;
          ctx.stroke();

          // Barra Superior do Card (Veículo + Data + Verificação)
          ctx.fillStyle = accentRed;
          ctx.beginPath();
          ctx.roundRect(margin + 24, cardY + 22, 240, 38, 19);
          ctx.fill();

          ctx.fillStyle = '#FFFFFF';
          ctx.font = '900 15px Inter, -apple-system, sans-serif';
          ctx.fillText(newsSource, margin + 40, cardY + 46);

          // Data do Registro
          ctx.fillStyle = textMuted;
          ctx.font = 'bold 15px Inter, -apple-system, sans-serif';
          ctx.fillText(newsDate, margin + 280, cardY + 46);

          // Selo Fato Auditado
          ctx.fillStyle = accentGreen;
          ctx.font = '900 15px Inter, -apple-system, sans-serif';
          ctx.textAlign = 'right';
          ctx.fillText('✓ FATO AUDITADO', margin + contentWidth - 24, cardY + 46);
          ctx.textAlign = 'left';

          // Divisão do Card: Foto Noticiosa Ampla + Manchete
          const newsImg = ensureImage(newsImageUrl);
          const thumbW = Math.round(350 * (format === 'square' ? 0.8 : 1));
          const thumbH = Math.round(270 * vScale);
          const thumbX = margin + 24;
          const thumbY = cardY + 76;

          if (newsImg) {
            ctx.save();
            ctx.beginPath();
            ctx.roundRect(thumbX, thumbY, thumbW, thumbH, 18);
            ctx.clip();
            ctx.drawImage(newsImg, thumbX, thumbY, thumbW, thumbH);
            ctx.restore();

            ctx.strokeStyle = 'rgba(255, 255, 255, 0.28)';
            ctx.lineWidth = 1.6;
            ctx.beginPath();
            ctx.roundRect(thumbX, thumbY, thumbW, thumbH, 18);
            ctx.stroke();
          }

          // Texto da Notícia à Direita da Foto
          const textX = thumbX + thumbW + 30;
          const textMaxW = contentWidth - thumbW - 80;
          ctx.fillStyle = textPrimary;
          ctx.font = '700 30px Inter, -apple-system, sans-serif';
          if (format === 'square') ctx.font = '700 22px Inter, -apple-system, sans-serif';
          wrapText(ctx, `"${newsHeadline}"`, textX, thumbY + 44, textMaxW, format === 'square' ? 32 : 42);

          // Rodapé do Card Noticioso
          const footerCardY = cardY + cardH - 24;
          ctx.fillStyle = textMuted;
          ctx.font = 'bold 15px Inter, -apple-system, sans-serif';
          ctx.fillText(`🏛️ Registro verificado em diários oficiais e pesquisas públicas`, textX, footerCardY);

          currentY += cardH + 26 * vScale;
        }

        // Sub-Hook Box (Caixa de Acolhimento e Diálogo)
        const hookBoxH = Math.round(260 * vScale);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
        ctx.beginPath();
        ctx.roundRect(margin, currentY, contentWidth, hookBoxH, 22);
        ctx.fill();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.16)';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Barra Rubra Lateral
        ctx.fillStyle = accentRed;
        ctx.beginPath();
        ctx.roundRect(margin, currentY, 12, hookBoxH, [22, 0, 0, 22]);
        ctx.fill();

        // Kicker interno
        ctx.fillStyle = accentGold;
        ctx.font = '900 19px Inter, -apple-system, sans-serif';
        ctx.fillText('💡 POR QUE ISSO IMPORTA NA SUA VIDA?', margin + 36, currentY + 46);

        // Texto do Acolhimento
        ctx.fillStyle = textSecondary;
        ctx.font = '500 28px Inter, -apple-system, sans-serif';
        if (format === 'square') ctx.font = '500 20px Inter, -apple-system, sans-serif';
        wrapText(
          ctx,
          preset.act1Hook ||
            'O que você precisa saber com dados oficiais antes da próxima conversa em família ou no trabalho.',
          margin + 36,
          currentY + 92,
          contentWidth - 64,
          format === 'square' ? 30 : 42
        );

        // Micro-tag inferior do Acolhimento
        ctx.fillStyle = '#CBD5E1';
        ctx.font = 'bold 15px Inter, -apple-system, sans-serif';
        ctx.fillText('📌 Salve este carrossel para consultar e mostrar fontes com tranquilidade.', margin + 36, currentY + hookBoxH - 24);

        currentY += hookBoxH + 24 * vScale;

        // Barra de Garantia de Auditoria Pública (Preenche harmoniosamente a tela)
        const auditBarH = Math.round(62 * vScale);
        ctx.fillStyle = 'rgba(16, 185, 129, 0.14)';
        ctx.beginPath();
        ctx.roundRect(margin, currentY, contentWidth, auditBarH, 16);
        ctx.fill();
        ctx.strokeStyle = 'rgba(16, 185, 129, 0.35)';
        ctx.lineWidth = 1.4;
        ctx.stroke();

        ctx.fillStyle = accentGreen;
        ctx.font = 'bold 17px Inter, -apple-system, sans-serif';
        ctx.fillText('✓ FONTE AUDITADA: Órgãos oficiais do Estado, IBGE, DIEESE e Caged', margin + 24, currentY + 38);

        // Indicador de Deslize Inferior
        if (isCarousel) {
          const swipeY = height - 116;
          ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
          ctx.beginPath();
          ctx.roundRect(width - margin - 460, swipeY, 460, 52, 26);
          ctx.fill();
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.22)';
          ctx.lineWidth = 1.5;
          ctx.stroke();

          ctx.fillStyle = accentGold;
          ctx.font = 'bold 21px Inter, -apple-system, sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('Deslize para ver as provas na mesa 👉', width - margin - 230, swipeY + 33);
          ctx.textAlign = 'left';
        }
      }

      // ── ARQUÉTIPO 2: BIG STAT HERO / PROVA MATERIAL AUDITADA ──
      else if (archetype === 'big-stat-hero' || slideIdx === 1) {
        ctx.fillStyle = accentGreen;
        ctx.font = '900 22px Inter, -apple-system, sans-serif';
        ctx.fillText('📊 ATO 2 • A PROVA MATERIAL AUDITADA', margin, currentY);
        currentY += 40;

        ctx.fillStyle = textPrimary;
        ctx.font = '900 46px Inter, -apple-system, sans-serif';
        currentY = wrapText(ctx, 'Os números oficiais que desmontam qualquer boato', margin, currentY, contentWidth, 54);
        currentY += 28 * vScale;

        // Card 1: Monumental Big Stat (Expandido para 500px)
        const statBoxHeight = Math.round(500 * vScale);
        ctx.fillStyle = 'rgba(15, 23, 42, 0.94)';
        ctx.beginPath();
        ctx.roundRect(margin, currentY, contentWidth, statBoxHeight, 28);
        ctx.fill();
        ctx.strokeStyle = accentGreen;
        ctx.lineWidth = 2.8;
        ctx.stroke();

        // Número Gigante
        const statNum = preset.statNumber || '100% AUDITADO';
        ctx.fillStyle = accentGreen;
        ctx.font = '900 120px Inter, -apple-system, sans-serif';
        if (format === 'square') ctx.font = '900 84px Inter, -apple-system, sans-serif';
        ctx.fillText(statNum, margin + 46, currentY + 128 * vScale);

        // Rótulo em Ouro
        const statLabel = preset.statLabel || 'Dados consolidados por instituições de estado';
        ctx.fillStyle = accentGold;
        ctx.font = 'bold 25px Inter, -apple-system, sans-serif';
        ctx.fillText(statLabel.toUpperCase(), margin + 48, currentY + 188 * vScale);

        // Linha divisória
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.16)';
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(margin + 48, currentY + 220 * vScale);
        ctx.lineTo(margin + contentWidth - 48, currentY + 220 * vScale);
        ctx.stroke();

        // Texto da Prova Material
        ctx.fillStyle = textPrimary;
        ctx.font = '500 31px Inter, -apple-system, sans-serif';
        if (format === 'square') ctx.font = '500 22px Inter, -apple-system, sans-serif';
        wrapText(
          ctx,
          preset.proofData || preset.bodyText,
          margin + 48,
          currentY + 280 * vScale,
          contentWidth - 96,
          46 * vScale
        );

        // Carimbo de Registro
        ctx.fillStyle = textMuted;
        ctx.font = 'bold 18px Inter, -apple-system, sans-serif';
        ctx.fillText(`🏛️ FONTE OFICIAL: ${preset.sourceName} • REGISTRO ABERTO`, margin + 48, currentY + statBoxHeight - 28);

        currentY += statBoxHeight + 28 * vScale;

        // Card 2: Impacto no Dia a Dia (Expandido para 390px)
        const dailyImpactH = Math.round(390 * vScale);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
        ctx.beginPath();
        ctx.roundRect(margin, currentY, contentWidth, dailyImpactH, 24);
        ctx.fill();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.fillStyle = accentGreen;
        ctx.beginPath();
        ctx.roundRect(margin, currentY, 12, dailyImpactH, [24, 0, 0, 24]);
        ctx.fill();

        ctx.fillStyle = accentGold;
        ctx.font = '900 22px Inter, -apple-system, sans-serif';
        ctx.fillText('🔍 POR QUE ESSE NÚMERO FAZ DIFERENÇA NO DIA A DIA?', margin + 36, currentY + 48);

        const bullets = [
          '✓ Impacto direto nas famílias trabalhadoras e no comércio do seu bairro',
          '✓ Sem truque contábil: dados auditados pelo Tribunal de Contas da União',
          '✓ Poder de compra protegido para quem ganha até 2 salários mínimos',
        ];

        let bulletY = currentY + 112;
        bullets.forEach((bText) => {
          ctx.fillStyle = textPrimary;
          ctx.font = '500 26px Inter, -apple-system, sans-serif';
          if (format === 'square') ctx.font = '500 18px Inter, -apple-system, sans-serif';
          ctx.fillText(bText, margin + 36, bulletY);
          bulletY += 64 * vScale;
        });

        // Tag de transparência
        ctx.fillStyle = textSecondary;
        ctx.font = 'bold 16px Inter, -apple-system, sans-serif';
        ctx.fillText('🛡️ Transparência pública: dados de acesso livre à população brasileira', margin + 36, currentY + dailyImpactH - 24);

        // Pílula de deslize
        if (isCarousel) {
          const swipeY = height - 116;
          ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
          ctx.beginPath();
          ctx.roundRect(width - margin - 440, swipeY, 440, 52, 26);
          ctx.fill();
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.22)';
          ctx.lineWidth = 1.5;
          ctx.stroke();

          ctx.fillStyle = accentGold;
          ctx.font = 'bold 21px Inter, -apple-system, sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('Deslize para ver o outro lado 👉', width - margin - 220, swipeY + 33);
          ctx.textAlign = 'left';
        }
      }

      // ── ARQUÉTIPO 3: DIALECTIC SPLIT / O DESARME SEM CONFRONTO ──
      else if (archetype === 'dialectic-split' || slideIdx === 2) {
        ctx.fillStyle = accentGold;
        ctx.font = '900 22px Inter, -apple-system, sans-serif';
        ctx.fillText('🛡️ ATO 3 • O DESARME SEM CONFRONTO', margin, currentY);
        currentY += 40;

        ctx.fillStyle = textPrimary;
        ctx.font = '900 46px Inter, -apple-system, sans-serif';
        currentY = wrapText(ctx, 'Como responder quem tem dúvida sem criar briga', margin, currentY, contentWidth, 54);
        currentY += 28 * vScale;

        // Bloco 1: O que dizem no Zap (Dúvida / Rumor)
        const objectionHeight = Math.round(330 * vScale);
        ctx.fillStyle = 'rgba(239, 68, 68, 0.14)';
        ctx.beginPath();
        ctx.roundRect(margin, currentY, contentWidth, objectionHeight, 24);
        ctx.fill();
        ctx.strokeStyle = 'rgba(239, 68, 68, 0.45)';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = accentRed;
        ctx.font = '900 22px Inter, -apple-system, sans-serif';
        ctx.fillText('🤔 O QUE COSTUMAM FALAR NAS REDES E NO ZAP:', margin + 36, currentY + 48);

        ctx.fillStyle = textPrimary;
        ctx.font = '500 28px Inter, -apple-system, sans-serif';
        if (format === 'square') ctx.font = '500 20px Inter, -apple-system, sans-serif';
        wrapText(
          ctx,
          `"${preset.counterArg || 'Dizem que tudo continua igual e que nada melhorou no dia a dia.'}"`,
          margin + 36,
          currentY + 104,
          contentWidth - 72,
          42 * vScale
        );

        ctx.fillStyle = '#FCA5A5';
        ctx.font = 'bold 16px Inter, -apple-system, sans-serif';
        ctx.fillText('⚠️ Boato recorrente que não se sustenta nos documentos públicos', margin + 36, currentY + objectionHeight - 24);

        currentY += objectionHeight + 30 * vScale;

        // Bloco 2: A Prova Oficial Comprovada
        const rebuttalHeight = Math.round(410 * vScale);
        ctx.fillStyle = 'rgba(16, 185, 129, 0.14)';
        ctx.beginPath();
        ctx.roundRect(margin, currentY, contentWidth, rebuttalHeight, 24);
        ctx.fill();
        ctx.strokeStyle = accentGreen;
        ctx.lineWidth = 3;
        ctx.stroke();

        ctx.fillStyle = accentGreen;
        ctx.font = '900 22px Inter, -apple-system, sans-serif';
        ctx.fillText('✅ O QUE OS DOCUMENTOS OFICIAIS PROVAM:', margin + 36, currentY + 50);

        ctx.fillStyle = textPrimary;
        ctx.font = '600 30px Inter, -apple-system, sans-serif';
        if (format === 'square') ctx.font = '600 22px Inter, -apple-system, sans-serif';
        wrapText(
          ctx,
          preset.rebuttal || preset.bodyText,
          margin + 36,
          currentY + 112,
          contentWidth - 72,
          46 * vScale
        );

        ctx.fillStyle = textSecondary;
        ctx.font = 'bold 18px Inter, -apple-system, sans-serif';
        ctx.fillText(`🏛️ FONTE: ${preset.sourceName} • REGISTRO ABERTO`, margin + 36, currentY + rebuttalHeight - 26);

        // Bloco 3: Dica de ouro de diálogo
        const tipY = height - 120;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
        ctx.beginPath();
        ctx.roundRect(margin, tipY, contentWidth, 54, 27);
        ctx.fill();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.22)';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.fillStyle = accentGold;
        ctx.font = 'bold 21px Inter, -apple-system, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('💬 Quem tem prova não precisa gritar. Mostre a fonte e converse com carinho.', width / 2, tipY + 34);
        ctx.textAlign = 'left';
      }

      // ── ARQUÉTIPO 4: POCKET REALITY / A VIDA REAL NO BOLSO ──
      else if (archetype === 'pocket-reality' || slideIdx === 3) {
        ctx.fillStyle = accentRed;
        ctx.font = '900 22px Inter, -apple-system, sans-serif';
        ctx.fillText('💡 ATO 4 • A CONTA DO MÊS NO SEU BOLSO', margin, currentY);
        currentY += 40;

        ctx.fillStyle = textPrimary;
        ctx.font = '900 46px Inter, -apple-system, sans-serif';
        currentY = wrapText(ctx, 'Economia é comida no prato e dinheiro sobrando', margin, currentY, contentWidth, 54);
        currentY += 28 * vScale;

        // Card 1: Bloco de Tradução Popular
        const pocketBoxH = Math.round(410 * vScale);
        ctx.fillStyle = 'rgba(15, 23, 42, 0.94)';
        ctx.beginPath();
        ctx.roundRect(margin, currentY, contentWidth, pocketBoxH, 28);
        ctx.fill();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.16)';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = accentGold;
        ctx.beginPath();
        ctx.roundRect(margin, currentY, 14, pocketBoxH, [28, 0, 0, 28]);
        ctx.fill();

        ctx.fillStyle = accentGold;
        ctx.font = '900 22px Inter, -apple-system, sans-serif';
        ctx.fillText('🛒 O QUE MUDA NA ROTINA DA SUA FAMÍLIA:', margin + 44, currentY + 50);

        ctx.fillStyle = textPrimary;
        ctx.font = '500 31px Inter, -apple-system, sans-serif';
        if (format === 'square') ctx.font = '500 22px Inter, -apple-system, sans-serif';
        wrapText(
          ctx,
          preset.act4PocketImpact ||
            'Economia não é número abstrato de jornal: é o preço do arroz, do gás e da carne sobrando no final do mês para cuidar da família com tranquilidade.',
          margin + 44,
          currentY + 110,
          contentWidth - 88,
          50 * vScale
        );

        ctx.fillStyle = textSecondary;
        ctx.font = 'bold 18px Inter, -apple-system, sans-serif';
        ctx.fillText('📈 ANTES: Arrocho e incerteza  ➔  HOJE: Reajuste real e inflação controlada', margin + 44, currentY + pocketBoxH - 28);

        currentY += pocketBoxH + 30 * vScale;

        // Card 2: 3 Impactos Materiais Concretos
        const gridH = Math.round(390 * vScale);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.07)';
        ctx.beginPath();
        ctx.roundRect(margin, currentY, contentWidth, gridH, 24);
        ctx.fill();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.16)';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.fillStyle = accentGreen;
        ctx.font = '900 22px Inter, -apple-system, sans-serif';
        ctx.fillText('📋 3 IMPACTOS DIRETOS NO SEU DIA A DIA:', margin + 36, currentY + 48);

        const realPoints = [
          '🥩 1. NO MERCADO: Cesta básica com deflação comprovada em 17 capitais.',
          '💊 2. NA SAÚDE: Remédios de pressão e diabetes 100% gratuitos na Farmácia Popular.',
          '💼 3. NO EMPREGO: Salário mínimo valorizado com ganho real acima da inflação.',
        ];

        let realY = currentY + 110;
        realPoints.forEach((rText) => {
          ctx.fillStyle = textPrimary;
          ctx.font = '600 24px Inter, -apple-system, sans-serif';
          if (format === 'square') ctx.font = '600 18px Inter, -apple-system, sans-serif';
          ctx.fillText(rText, margin + 36, realY);
          realY += 66 * vScale;
        });

        if (isCarousel) {
          const swipeY = height - 120;
          ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
          ctx.beginPath();
          ctx.roundRect(width - margin - 400, swipeY, 400, 52, 26);
          ctx.fill();
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.22)';
          ctx.lineWidth = 1.5;
          ctx.stroke();

          ctx.fillStyle = accentGold;
          ctx.font = 'bold 21px Inter, -apple-system, sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('Deslize para ver como agir 👉', width - margin - 200, swipeY + 33);
          ctx.textAlign = 'left';
        }
      }

      // ── ARQUÉTIPO 5: MANIFESTO CTA / CONCLUSÃO & UNIÃO ──
      else {
        ctx.fillStyle = accentGold;
        ctx.font = '900 24px Inter, -apple-system, sans-serif';
        ctx.fillText('⭐ ATO 5 • A NOSSA VOZ FAZ A DIFERENÇA', margin, currentY);
        currentY += 44;

        ctx.fillStyle = textPrimary;
        ctx.font = '900 48px Inter, -apple-system, sans-serif';
        currentY = wrapText(ctx, 'O diálogo constrói pontes. Os fatos constroem o futuro.', margin, currentY, contentWidth, 58);
        currentY += 28 * vScale;

        // Card 1: Bloco de Manifesto Central
        const ctaBoxH = Math.round(390 * vScale);
        ctx.fillStyle = 'rgba(15, 23, 42, 0.94)';
        ctx.beginPath();
        ctx.roundRect(margin, currentY, contentWidth, ctaBoxH, 28);
        ctx.fill();
        ctx.strokeStyle = accentGold;
        ctx.lineWidth = 2.8;
        ctx.stroke();

        ctx.fillStyle = accentGold;
        ctx.font = '900 22px Inter, -apple-system, sans-serif';
        ctx.fillText('✨ A ELEIÇÃO SE DECIDE NA CONVERSA COM QUEM A GENTE AMA:', margin + 44, currentY + 50);

        ctx.fillStyle = textSecondary;
        ctx.font = '500 29px Inter, -apple-system, sans-serif';
        if (format === 'square') ctx.font = '500 20px Inter, -apple-system, sans-serif';
        wrapText(
          ctx,
          preset.act5Cta ||
            'Salve este carrossel para consultar e compartilhe nos stories. Conversar com calma e respeito transforma mais do que brigar na internet.',
          margin + 44,
          currentY + 110,
          contentWidth - 88,
          48 * vScale
        );

        ctx.fillStyle = accentGold;
        ctx.font = 'bold 20px Inter, -apple-system, sans-serif';
        ctx.fillText('Não deixe mentiras decidirem o seu futuro: leve dados oficiais com acolhimento.', margin + 44, currentY + ctaBoxH - 30);

        currentY += ctaBoxH + 30 * vScale;

        // Card 2: 3 Passos para Ação Prática
        const actionBoxH = Math.round(340 * vScale);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.07)';
        ctx.beginPath();
        ctx.roundRect(margin, currentY, contentWidth, actionBoxH, 24);
        ctx.fill();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.16)';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.fillStyle = textPrimary;
        ctx.font = '900 22px Inter, -apple-system, sans-serif';
        ctx.fillText('COMO VOCÊ PODE SOMAR HOJE:', margin + 36, currentY + 48);

        const actions = [
          '💾 1. Salve este carrossel no seu celular para consultar na próxima conversa.',
          '📲 2. Compartilhe nos seus stories e mostre os dados para quem está em dúvida.',
          '💬 3. Envie no grupo da família com respeito e abertura para ouvir.',
        ];

        let actionY = currentY + 104;
        actions.forEach((aText) => {
          ctx.fillStyle = textPrimary;
          ctx.font = '600 23px Inter, -apple-system, sans-serif';
          if (format === 'square') ctx.font = '600 17px Inter, -apple-system, sans-serif';
          ctx.fillText(aText, margin + 36, actionY);
          actionY += 56 * vScale;
        });

        // Selo Final Bora 13 Cidadão
        const badgeY = height - 120;
        ctx.fillStyle = accentRed;
        ctx.font = '900 28px Inter, -apple-system, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('⭐ BORA 13 • INICIATIVA CIDADÃ E POPULAR', width / 2, badgeY);
        ctx.textAlign = 'left';
      }

      // ── 4. RODAPÉ INSTITUCIONAL ──
      const footerY = height - 48;
      ctx.fillStyle = textMuted;
      ctx.font = 'bold 17px Inter, -apple-system, sans-serif';
      ctx.fillText(`Fonte Pública Oficial • ${preset.sourceName}`, margin, footerY);

      ctx.textAlign = 'right';
      ctx.fillText('Bora 13 • Feito pra Somar', width - margin, footerY);
      ctx.textAlign = 'left';

      // ── 5. GRÃO ANALÓGICO ESTOCÁSTICO DE REVISTA ──
      applyAnalogTexture(ctx, width, height, 0.022);
    },
    [
      activeSlide,
      format,
      theme,
      preset,
      TOTAL_SLIDES,
      slideArchetypes,
      showBgPhoto,
      bgImageUrl,
      tonerStyle,
      tonerIntensity,
      showNewsCard,
      newsSource,
      newsDate,
      newsHeadline,
      newsImageUrl,
      territoryTag,
      imagesReadyVersion,
      ensureImage,
      isCarousel,
    ]
  );

  // Redesenhar sempre que qualquer parâmetro mudar
  useEffect(() => {
    renderCanvas(activeSlide);
  }, [renderCanvas, activeSlide, imagesReadyVersion]);

  // Ações de Cópia e Exportação
  const handleCopyText = async (text: string, key: string) => {
    playProceduralHaptic('copy');
    const ok = await copyToClipboardClean(text);
    if (ok) {
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2200);
    }
  };

  const handleDownloadSlide = (slideIndex: number = activeSlide) => {
    playProceduralHaptic('generate');
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (slideIndex !== activeSlide) {
      renderCanvas(slideIndex);
    }

    const dataUrl = canvas.toDataURL('image/png', 1.0);
    const link = document.createElement('a');
    link.download = `bora13-${preset.categoryTag}-slide-${slideIndex + 1}.png`;
    link.href = dataUrl;
    link.click();

    if (slideIndex !== activeSlide) {
      renderCanvas(activeSlide);
    }
  };

  const handleDownloadAllZip = async () => {
    setIsExporting(true);
    setExportProgress('Renderizando os 5 slides em alta definição 1080x1350...');
    playProceduralHaptic('generate');

    try {
      const zip = new JSZip();
      const canvas = canvasRef.current;
      if (!canvas) return;

      const slideNames = [
        '01-capa-editorial.png',
        '02-prova-material.png',
        '03-desarme-tatico.png',
        '04-vida-real-bolso.png',
        '05-conclusao-dialogo.png',
      ];

      for (let i = 0; i < TOTAL_SLIDES; i++) {
        setExportProgress(`Processando slide ${i + 1} de ${TOTAL_SLIDES}...`);
        renderCanvas(i);
        await new Promise((r) => setTimeout(r, 90));

        const dataUrl = canvas.toDataURL('image/png', 1.0);
        const base64Data = dataUrl.replace(/^data:image\/png;base64,/, '');
        zip.file(slideNames[i] || `slide-${i + 1}.png`, base64Data, { base64: true });
      }

      setExportProgress('Empacotando arquivo ZIP...');
      const content = await zip.generateAsync({ type: 'blob' });
      const downloadUrl = URL.createObjectURL(content);

      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `bora13-carrossel-${preset.categoryTag}-${Date.now()}.zip`;
      link.click();
      URL.revokeObjectURL(downloadUrl);

      renderCanvas(activeSlide);
      setExportProgress('✅ Carrossel completo baixado!');
      setTimeout(() => setExportProgress(''), 3000);
    } catch (err) {
      console.error('Erro na exportação ZIP:', err);
      setExportProgress('Erro ao gerar ZIP. Baixando slide individual...');
      setTimeout(() => setExportProgress(''), 2500);
      handleDownloadSlide(activeSlide);
    } finally {
      setIsExporting(false);
    }
  };

  const handleNativeShare = async () => {
    playProceduralHaptic('click');
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.toBlob(async (blob) => {
      if (!blob) return;
      const file = new File([blob], `bora13-${preset.categoryTag}.png`, { type: 'image/png' });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            title: preset.headline,
            text: copies.instagram,
            files: [file],
          });
        } catch {
          handleDownloadSlide();
        }
      } else {
        handleDownloadSlide();
      }
    });
  };

  return (
    <section className="w-full max-w-7xl mx-auto px-4 py-8 animate-fade-in">
      {/* ── CABEÇALHO DO ESTÚDIO COM NAVEGAÇÃO PROGRESSIVA ── */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-red-100 dark:bg-red-950/40 text-[#C52229] dark:text-red-300 mb-2">
            <span>✨</span>
            <span>Estúdio Editorial • Carrosséis Prontos em 1 Clique</span>
          </div>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Criador de Posts & Carrosséis Pro
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
            Narrativa de revista projetada para virar voto, desarmar mentiras no almoço de domingo e acolher quem tem dúvida.
          </p>
        </div>

        {/* Seletor de Formato de Tela */}
        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700">
          {[
            { id: 'portrait', label: '4:5 Feed', icon: '📸' },
            { id: 'square', label: '1:1 Feed', icon: '🖼️' },
            { id: 'story', label: '9:16 Story/Zap', icon: '📱' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => {
                playProceduralHaptic('toggle');
                setFormat(f.id as PostFormat);
                setActiveSlide(0);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                format === f.id
                  ? 'bg-white dark:bg-slate-900 text-[#C52229] shadow-sm ring-1 ring-slate-200 dark:ring-slate-700'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <span>{f.icon}</span>
              <span>{f.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── STEPPER PROGRESSIVO / FLUXO INTUITIVO EM 3 PASSOS ── */}
      <div className="flex items-center justify-between gap-2 p-2 rounded-2xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 mb-6 max-w-2xl">
        <button
          onClick={() => setActiveStep(1)}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeStep === 1
              ? 'bg-white dark:bg-slate-900 text-[#C52229] shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <span>1️⃣</span>
          <span>Pauta Estratégica</span>
        </button>
        <span className="text-slate-300 dark:text-slate-600">➔</span>
        <button
          onClick={() => setActiveStep(2)}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeStep === 2
              ? 'bg-white dark:bg-slate-900 text-[#C52229] shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <span>2️⃣</span>
          <span>Estilo Visual</span>
        </button>
        <span className="text-slate-300 dark:text-slate-600">➔</span>
        <button
          onClick={() => setActiveStep(3)}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeStep === 3
              ? 'bg-white dark:bg-slate-900 text-[#C52229] shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <span>3️⃣</span>
          <span>Post Pronto</span>
        </button>
      </div>

      {/* ── PASSO 1: ESCOLHA DA PAUTA ESTRATÉGICA (NARRATIVA CLARA & VIRADA DE VOTO) ── */}
      {activeStep === 1 && (
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <span>🎯</span>
                <span>Qual a conversa que você quer destravar hoje?</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Escolha a pauta pelo público que você quer convencer ou pela mentira que precisa desarmar.
              </p>
            </div>
            <button
              onClick={() => setActiveStep(2)}
              className="text-xs font-bold text-[#C52229] hover:underline flex items-center gap-1"
            >
              <span>Ver estilos visuais</span>
              <span>👉</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {STRATEGIC_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleSelectCategory(cat.id)}
                className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden flex flex-col justify-between group ${
                  activeCategory === cat.id
                    ? 'border-[#C52229] bg-red-50/70 dark:bg-red-950/30 shadow-md ring-2 ring-red-300/40'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full text-white"
                      style={{ backgroundColor: cat.badgeColor }}
                    >
                      {cat.badge}
                    </span>
                    <span className="text-2xl">{cat.emoji}</span>
                  </div>

                  <h4 className="font-black text-sm text-slate-900 dark:text-white group-hover:text-[#C52229] transition-colors">
                    {cat.title}
                  </h4>

                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                    {cat.strategicGoal}
                  </p>

                  <div className="mt-3 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700/60">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block">
                      👥 Público-alvo ideal:
                    </span>
                    <span className="text-xs font-medium text-slate-700 dark:text-slate-200">
                      {cat.targetAudience}
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-[#C52229]">
                  <span>{activeCategory === cat.id ? '✓ Pauta Selecionada' : 'Selecionar Pauta'}</span>
                  <span>👉</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── PASSO 2: ESCOLHA DO ESTILO VISUAL (MINIATURAS VISUAIS RICAS) ── */}
      {activeStep === 2 && (
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <span>🎨</span>
                <span>Escolha o Estilo Visual do seu Post</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Templates com fotos, diagramação e estética de revista pré-prontos. Escolha pela miniatura visual.
              </p>
            </div>
            <button
              onClick={() => setActiveStep(3)}
              className="text-xs font-bold text-[#C52229] hover:underline flex items-center gap-1"
            >
              <span>Ver post pronto</span>
              <span>👉</span>
            </button>
          </div>

          {/* Grid de Miniaturas Gráficas dos Templates */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
            {PRESET_VISUAL_TEMPLATES.map((tpl) => (
              <button
                key={tpl.id}
                onClick={() => handleSelectTemplate(tpl.id)}
                className={`p-3 rounded-2xl border text-left transition-all relative flex flex-col justify-between group ${
                  activeTemplateId === tpl.id
                    ? 'border-[#C52229] bg-slate-900 text-white shadow-xl ring-2 ring-red-400/50 scale-[1.02]'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 hover:border-slate-300'
                }`}
              >
                {/* Miniatura Gráfica do Post (Mockup 4:5 Real) */}
                <div
                  className={`w-full aspect-[4/5] rounded-xl overflow-hidden p-2.5 relative flex flex-col justify-between bg-gradient-to-br ${tpl.miniBgClass} border border-white/10 shadow-inner mb-3`}
                >
                  {/* Topo da Miniatura */}
                  <div>
                    <div className="flex items-center justify-between gap-1 mb-1.5">
                      <div className="flex gap-0.5 w-full">
                        <span className="h-0.5 w-1/5 bg-red-500 rounded-full" />
                        <span className="h-0.5 w-1/5 bg-white/40 rounded-full" />
                        <span className="h-0.5 w-1/5 bg-white/20 rounded-full" />
                        <span className="h-0.5 w-1/5 bg-white/20 rounded-full" />
                        <span className="h-0.5 w-1/5 bg-white/20 rounded-full" />
                      </div>
                    </div>
                    <span
                      className={`text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-full inline-block ${tpl.miniBadgeColor}`}
                    >
                      {tpl.badge}
                    </span>
                  </div>

                  {/* Miolo da Miniatura */}
                  <div className="my-auto py-1">
                    {tpl.miniSampleNumber ? (
                      <div className="text-center font-black text-sm text-emerald-400 tracking-tighter">
                        {tpl.miniSampleNumber}
                      </div>
                    ) : (
                      <div className="p-1 rounded bg-black/40 border border-white/10 flex items-center gap-1">
                        <div className="w-5 h-5 rounded bg-slate-700 shrink-0" />
                        <div className="space-y-0.5 flex-1">
                          <div className="h-1 bg-white/80 rounded w-full" />
                          <div className="h-1 bg-white/50 rounded w-3/4" />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Rodapé da Miniatura */}
                  <div className="flex items-center justify-between text-[7px] text-white/60 pt-1 border-t border-white/10">
                    <span>Bora 13</span>
                    <span>👉 Deslize</span>
                  </div>
                </div>

                {/* Textos Informativos do Template */}
                <div>
                  <h4 className="font-bold text-xs line-clamp-1">{tpl.title}</h4>
                  <p
                    className={`text-[10px] mt-1 line-clamp-2 leading-tight ${
                      activeTemplateId === tpl.id ? 'text-slate-300' : 'text-slate-500'
                    }`}
                  >
                    {tpl.desc}
                  </p>
                </div>

                <div className="mt-2.5 pt-2 border-t border-slate-200/40 dark:border-slate-700/40 flex items-center justify-between text-[10px] font-bold">
                  <span>{activeTemplateId === tpl.id ? '✓ Estilo Ativo' : 'Usar este estilo'}</span>
                  <span>👉</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── PASSO 3: POST PRONTO (CANVAS DOMINANTE & AÇÕES EM 1 CLIQUE) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* COLUNA ESQUERDA: CANVAS DOMINANTE DO POST (7 COLUNAS) */}
        <div className="lg:col-span-7 flex flex-col items-center">
          <div className="w-full p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col items-center">
            {/* Navegador das 5 Lâminas do Carrossel */}
            {isCarousel && (
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 w-full mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Slide Ativo:{' '}
                  <strong className="text-[#C52229]">
                    0{activeSlide + 1} de 0{TOTAL_SLIDES}
                  </strong>
                  <span className="ml-2 text-[11px] text-slate-400 font-normal">
                    {activeSlide === 0 && '(Capa Noticiosa Auditada)'}
                    {activeSlide === 1 && '(A Prova Material dos Fatos)'}
                    {activeSlide === 2 && '(Desarme sem Brigas de Família)'}
                    {activeSlide === 3 && '(A Vida Real no Bolso)'}
                    {activeSlide === 4 && '(Manifesto de União & Compartilhar)'}
                  </span>
                </span>

                <div className="flex items-center gap-1.5 self-center">
                  {[0, 1, 2, 3, 4].map((idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        playProceduralHaptic('slide');
                        setActiveSlide(idx);
                      }}
                      className={`w-8 h-8 rounded-full text-xs font-bold transition-all ${
                        activeSlide === idx
                          ? 'bg-[#C52229] text-white shadow-md scale-110 ring-2 ring-red-300/40'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                      }`}
                    >
                      {idx + 1}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Container Responsivo do Canvas 1080x1350 */}
            <div
              className={`w-full max-w-[480px] rounded-2xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 relative bg-slate-950 transition-all ${
                format === 'story'
                  ? 'aspect-[9/16]'
                  : format === 'square'
                  ? 'aspect-square'
                  : 'aspect-[4/5]'
              }`}
            >
              <canvas
                ref={canvasRef}
                className="w-full h-full object-contain block"
              />
            </div>

            {/* Barra de Progresso da Exportação ZIP */}
            {exportProgress && (
              <div className="w-full mt-3 p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 text-xs font-bold text-center animate-pulse">
                {exportProgress}
              </div>
            )}

            {/* Botões de Ação Direta em 1 Clique */}
            <div className="flex flex-wrap items-center justify-between gap-3 w-full mt-5 pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDownloadSlide(activeSlide)}
                  className="px-4 py-2.5 rounded-xl bg-[#C52229] hover:bg-[#a51b21] text-white font-bold text-xs flex items-center gap-2 transition-all shadow-md active:scale-95"
                >
                  <span>📥</span>
                  <span>Baixar Slide {activeSlide + 1} (PNG HD)</span>
                </button>

                {isCarousel && (
                  <button
                    onClick={handleDownloadAllZip}
                    disabled={isExporting}
                    className="px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-black dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
                  >
                    <span>📦</span>
                    <span>{isExporting ? 'Processando...' : 'Baixar Carrossel Completo (.ZIP)'}</span>
                  </button>
                )}
              </div>

              <button
                onClick={handleNativeShare}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-md active:scale-95"
              >
                <span>📲</span>
                <span>Enviar no Zap / Stories</span>
              </button>
            </div>
          </div>
        </div>

        {/* COLUNA DIREITA: LEGENDA PRONTA & CONTROLES DISCRETOS (5 COLUNAS) */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          {/* Caixa de Legenda Calibrada */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                  <span>📝</span>
                  <span>Texto Pronto para o Post</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Copy dialogada com dados oficiais, acolhedora e pronta para viralizar.
                </p>
              </div>

              <button
                onClick={() => handleCopyText(copies[copyTab], `copy-${copyTab}`)}
                className="px-3.5 py-1.5 rounded-xl bg-[#C52229] hover:bg-[#a51b21] text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1.5"
              >
                <span>{copiedKey === `copy-${copyTab}` ? '✅' : '📋'}</span>
                <span>{copiedKey === `copy-${copyTab}` ? 'Copiado!' : 'Copiar'}</span>
              </button>
            </div>

            {/* Abas de Plataforma */}
            <div className="flex gap-1.5 border-b border-slate-200 dark:border-slate-800 pb-3 mb-3.5">
              {[
                { id: 'instagram', label: 'Instagram', icon: '📸' },
                { id: 'whatsapp', label: 'WhatsApp', icon: '💬' },
                { id: 'stories', label: 'Stories', icon: '📱' },
                { id: 'threads', label: 'Threads/X', icon: '🧵' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    playProceduralHaptic('toggle');
                    setCopyTab(tab.id as CopyPlatform);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    copyTab === tab.id
                      ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Prévia do Texto */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 max-h-60 overflow-y-auto">
              <p className="text-xs whitespace-pre-wrap font-sans leading-relaxed text-slate-800 dark:text-slate-200">
                {copies[copyTab]}
              </p>
            </div>
          </div>

          {/* Troca Rápida de Pauta & Estilo Sem Rolar a Página */}
          <div className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex flex-col gap-3">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              ⚡ Atalhos Rápidos:
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveStep(1)}
                className="flex-1 py-2 px-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 hover:border-[#C52229] transition-colors flex items-center justify-center gap-1.5"
              >
                <span>🎯</span>
                <span>Mudar Pauta ({preset.categoryTag})</span>
              </button>
              <button
                onClick={() => setActiveStep(2)}
                className="flex-1 py-2 px-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 hover:border-[#C52229] transition-colors flex items-center justify-center gap-1.5"
              >
                <span>🎨</span>
                <span>Mudar Estilo Visual</span>
              </button>
            </div>
          </div>

          {/* Ajuste Discreto de Localização & Manchete (Opcional) */}
          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
            <button
              onClick={() => {
                playProceduralHaptic('toggle');
                setShowQuickSettings(!showQuickSettings);
              }}
              className="w-full p-4 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <div className="flex items-center gap-2">
                <span>📍</span>
                <span>Ajustar Cidade / Estado no Post (Opcional)</span>
              </div>
              <span>{showQuickSettings ? '▲ Fechar' : '▼ Editar'}</span>
            </button>

            {showQuickSettings && (
              <div className="p-5 border-t border-slate-100 dark:border-slate-800 space-y-3.5 animate-fade-in">
                <div>
                  <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1 block">
                    Nome da Cidade ou Estado que aparece no topo:
                  </label>
                  <input
                    type="text"
                    value={territoryTag}
                    onChange={(e) => setTerritoryTag(e.target.value)}
                    placeholder="Ex: Florianópolis • SC"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1 block">
                    Manchete Principal Personalizada:
                  </label>
                  <input
                    type="text"
                    value={preset.headline}
                    onChange={(e) => {
                      const val = e.target.value;
                      setPreset((p) => ({ ...p, headline: val }));
                      setNewsHeadline(val);
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
