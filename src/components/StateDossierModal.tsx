'use client';

import React, { useState, useMemo } from 'react';
import { getStateByUF, BRAZIL_STATES_GEO, type StateGeo } from '@/data/brazilGeo';
import { getStateStats, playProceduralHaptic, type StateDossierReason } from '@/lib/agenticOrchestrator';
import {
  cleanTextForSharing,
  openWhatsApp,
  copyToClipboardClean,
  shareLinkOrText,
} from '@/lib/shareUtils';
import {
  IconStar,
  IconCheck,
  IconShield,
  IconShareWhatsApp,
  IconArrowRight,
  IconMapPin,
  IconUser,
} from '@/components/icons/CasaIcons';

interface StateDossierModalProps {
  uf: string;
  isOpen: boolean;
  onClose: () => void;
  onStartPreparation?: (uf: string) => void;
}

type InterlocutorType = 'familia' | 'comerciante' | 'idoso' | 'jovem' | 'nulo';
type FocusTopic = 'comida_salario' | 'obras_emprego' | 'farmacia_popular' | 'risco_flavio';

export default function StateDossierModal({
  uf,
  isOpen,
  onClose,
  onStartPreparation,
}: StateDossierModalProps) {
  const stateGeo = useMemo(() => getStateByUF(uf) || BRAZIL_STATES_GEO[0], [uf]);
  const stats = useMemo(() => getStateStats(stateGeo.uf), [stateGeo.uf]);

  // Estados do Gerador Estratégico de Conversa
  const [interlocutor, setInterlocutor] = useState<InterlocutorType>('familia');
  const [topic, setTopic] = useState<FocusTopic>('obras_emprego');
  const [copied, setCopied] = useState(false);

  // Geração de mensagem altamente persuasiva para virar voto no 1-a-1
  const generatedMessage = useMemo(() => {
    const siteUrl = `https://www.gigantera.xyz/bora?state=${stateGeo.uf}&dossier=1`;
    const stateName = stateGeo.name;

    let greeting = 'Oi!';
    let connection = 'lembrei da nossa conversa esses dias';

    if (interlocutor === 'familia') {
      greeting = 'Oi, tudo bem?';
      connection = 'lembrei de você e de conversas que a gente já teve em família';
    } else if (interlocutor === 'comerciante') {
      greeting = 'Olá, tudo certo?';
      connection = 'lembrei do seu trabalho e de como as coisas andam no comércio aqui da região';
    } else if (interlocutor === 'idoso') {
      greeting = 'Oi, benção! Tudo bem por aí?';
      connection = 'lembrei de você e tava pensando na nossa saúde e no custo das coisas';
    } else if (interlocutor === 'jovem') {
      greeting = 'E aí, beleza?';
      connection = 'vi isso aqui e lembrei das nossas conversas sobre estudo e futuro';
    } else if (interlocutor === 'nulo') {
      greeting = 'Oi, tudo bem?';
      connection = 'lembrei de quando você comentou que tava desanimado da política';
    }

    let coreReason = '';
    if (topic === 'obras_emprego') {
      coreReason = `Aqui em ${stateName}, o dado real é que foram gerados ${stats.jobsCreated}. Além disso, as obras federais foram retomadas pra destravar o transporte e o emprego local.`;
    } else if (topic === 'comida_salario') {
      coreReason = `Eu sei que a feira ainda pesa, mas o salário mínimo voltou a ter aumento acima da inflação pelo 2º ano consecutivo e a comida básica caiu em relação ao que tava na pandemia.`;
    } else if (topic === 'farmacia_popular') {
      coreReason = `Aqui em ${stateName}, o Farmácia Popular tá atendendo ${stats.farmaciaPopularBeneficiaries}. É remédio de graça de pressão, diabetes e asma sem gastar um centavo do bolso.`;
    } else if (topic === 'risco_flavio') {
      coreReason = `Eu sei que ninguém é perfeito, mas o risco de votar em Flávio é trazer de volta corte de verba de remédio e congelamento do salário mínimo. Não dá pra arriscar o pouco que a gente reconquistou.`;
    }

    let closing = '';
    if (interlocutor === 'familia') {
      closing = 'Sem briga nenhuma, longe de mim querer discutir. É só que eu me preocupo com a nossa família e achei legal te mandar pra gente pensar juntos com calma. Um abraço!';
    } else if (interlocutor === 'comerciante') {
      closing = 'Quando o trabalhador ganha aumento real e tem emprego, sobra mais dinheiro pra gastar no comércio local da nossa cidade. Dá uma olhada depois com calma!';
    } else if (interlocutor === 'idoso') {
      closing = 'Se puder, dá uma olhada com carinho. A gente que vive do próprio esforço precisa valorizar o que protege os remédios e a aposentadoria. Fica com Deus!';
    } else if (interlocutor === 'jovem') {
      closing = `Dá uma olhada nessa página com os dados reais de ${stateName} pra gente não cair em corte de zap sem checar a fonte. Tamo junto!`;
    } else {
      closing = 'Não votar ou votar nulo acaba ajudando quem quer cortar direitos da gente. Dá uma lida sem compromisso nos dados do nosso estado:';
    }

    const fullText = `${greeting} ${connection}.\n\n${coreReason}\n\nEncontrei essa página que reúne os dados auditados e os motivos reais de ${stateName}:\n${siteUrl}\n\n${closing}`;

    return cleanTextForSharing(fullText);
  }, [interlocutor, topic, stateGeo.name, stateGeo.uf, stats]);

  if (!isOpen) return null;

  const handleCopy = async () => {
    playProceduralHaptic('click');
    const success = await copyToClipboardClean(generatedMessage);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleSendZap = () => {
    playProceduralHaptic('generate');
    openWhatsApp(generatedMessage);
  };

  const handleShareLink = async () => {
    playProceduralHaptic('click');
    await shareLinkOrText({
      title: `5 Motivos para ${stateGeo.name} Seguir em Frente`,
      text: `Dê uma olhada nos dados confirmados e nos motivos reais para ${stateGeo.name}:`,
      url: `https://www.gigantera.xyz/bora?state=${stateGeo.uf}&dossier=1`,
    });
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="dossier-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/70 backdrop-blur-md overflow-y-auto animate-fade-in"
    >
      <div className="relative w-full max-w-3xl bg-white dark:bg-[#0E1626] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Ribbon Oficial no Topo do Modal */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#C52229] via-[#F59E0B] via-[#10B981] to-[#1D4ED8]" />

        {/* ── CABEÇALHO DO DOSSIÊ ── */}
        <div className="p-5 sm:p-7 border-b border-slate-100 dark:border-slate-800/80 flex items-start justify-between gap-4 shrink-0 bg-slate-50/70 dark:bg-slate-900/60">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#C52229] text-white">
                Dossiê Territorial • {stateGeo.uf}
              </span>
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                Região {stateGeo.region} • Capital: {stateGeo.capital}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                Dados Públicos Oficiais
              </span>
            </div>

            <h2 id="dossier-modal-title" className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Por que {stateGeo.name} ganha com Lula: <span className="text-[#C52229]">5 Motivos Reais</span>
            </h2>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-normal leading-relaxed">
              Argumentos concretos, obras auditadas e números de bolso para conversar no privado com amigos e familiares de {stateGeo.name} no 2º turno.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar modal"
            className="w-9 h-9 rounded-full bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700 flex items-center justify-center text-sm font-black transition-all shrink-0 cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* ── CORPO ROLÁVEL ── */}
        <div className="p-5 sm:p-7 space-y-6 overflow-y-auto">
          {/* 3 NÚMEROS DE IMPACTO DO ESTADO */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block uppercase tracking-wider">
                Empregos Formais
              </span>
              <span className="text-sm font-black text-slate-900 dark:text-white block mt-0.5">
                {stats.jobsCreated}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block uppercase tracking-wider">
                Farmácia Popular
              </span>
              <span className="text-sm font-black text-slate-900 dark:text-white block mt-0.5">
                {stats.farmaciaPopularBeneficiaries}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block uppercase tracking-wider">
                Pé-de-Meia (MEC)
              </span>
              <span className="text-sm font-black text-slate-900 dark:text-white block mt-0.5">
                {stats.pedeMeiaStudents}
              </span>
            </div>
          </div>

          {/* LISTA DOS 5 MOTIVOS ESTRATÉGICOS DESTE ESTADO */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <IconStar className="w-4 h-4 text-[#C52229]" />
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white">
                Os 5 Motivos Concretos para {stateGeo.name}
              </h3>
            </div>

            <div className="space-y-2.5">
              {((stats.strategicReasons && stats.strategicReasons.length > 0)
                ? stats.strategicReasons
                : ([
                    {
                      id: 'def-1',
                      category: 'trabalho',
                      title: `Emprego formal e carteira assinada em ${stateGeo.name}`,
                      description: `Com ${stats.jobsCreated}, a renda das famílias sobe e o comércio de ${stateGeo.capital} e do interior ganha fôlego.`,
                      proofBadge: 'Ministério do Trabalho • Caged',
                      audienceTag: 'Para trabalhadores e autônomos',
                    },
                    {
                      id: 'def-2',
                      category: 'saude',
                      title: 'Remédios contínuos 100% gratuitos na Farmácia Popular',
                      description: `${stats.farmaciaPopularBeneficiaries} com acesso gratuito a medicamentos essenciais de pressão, diabetes e asma.`,
                      proofBadge: 'Ministério da Saúde',
                      audienceTag: 'Para idosos e famílias',
                    },
                    {
                      id: 'def-3',
                      category: 'educacao',
                      title: 'Poupança Pé-de-Meia para estudantes do ensino médio',
                      description: `${stats.pedeMeiaStudents} recebendo incentivo financeiro mensal para não largar os estudos.`,
                      proofBadge: 'MEC • Caixa Econômica Federal',
                      audienceTag: 'Para jovens e pais',
                    },
                    {
                      id: 'def-4',
                      category: 'infra',
                      title: 'Obras de infraestrutura e saneamento do Novo PAC',
                      description: `${stats.highlightText}`,
                      proofBadge: 'Governo Federal • Casa Civil',
                      audienceTag: 'Para comércio e indústria',
                    },
                    {
                      id: 'def-5',
                      category: 'risco_flavio',
                      title: 'O Risco Flávio: Cortes na Saúde e Fim do Aumento Real do Salário',
                      description: 'Propostas documentadas do grupo de Flávio incluem desvincular o salário mínimo da inflação e cortes severos no orçamento da Farmácia Popular.',
                      proofBadge: 'Registro Oficial de Votações no Congresso',
                      audienceTag: 'Para indecisos e descontentes',
                    },
                  ] as StateDossierReason[])
              ).map((reason: StateDossierReason, idx: number) => (
                <div
                  key={reason.id || idx}
                  className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs hover:border-slate-300 transition-all space-y-1.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-red-100 dark:bg-red-950/60 text-[#C52229] dark:text-red-300 text-xs font-black flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <h4 className="text-sm font-black text-slate-900 dark:text-white">
                        {reason.title}
                      </h4>
                    </div>
                    {reason.audienceTag && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 shrink-0 hidden sm:inline">
                        {reason.audienceTag}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal pl-7">
                    {reason.description}
                  </p>
                  <div className="pl-7 pt-1 flex items-center gap-2 text-[10px] font-bold text-emerald-700 dark:text-emerald-400">
                    <IconCheck className="w-3 h-3 text-emerald-600" />
                    <span>Fonte: {reason.proofBadge}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── GERADOR ESTRATÉGICO DE CONVERSA PARA WHATSAPP ── */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border-2 border-red-100 dark:border-red-950/60 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-[#C52229] block">
                  Tática de Virada de Voto (1-a-1 no Privado)
                </span>
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  Gerar Mensagem Acolhedora para WhatsApp
                </h3>
              </div>
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                Sem brigas • Com respeito
              </span>
            </div>

            {/* Passo 1: Com quem você vai conversar? */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-black uppercase tracking-wider text-slate-600 dark:text-slate-400 block">
                1. Com quem você vai conversar?
              </label>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { id: 'familia', label: '👨‍👩‍👧 Parente / Família' },
                  { id: 'comerciante', label: '🏪 Comerciante / Autônomo' },
                  { id: 'idoso', label: '👵 Aposentado / Idoso' },
                  { id: 'jovem', label: '🎓 Jovem / Estudante' },
                  { id: 'nulo', label: '⚪ Voto Nulo / Desiludido' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      playProceduralHaptic('click');
                      setInterlocutor(item.id as InterlocutorType);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      interlocutor === item.id
                        ? 'bg-[#C52229] text-white shadow-xs'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-slate-400'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Passo 2: Qual o foco da conversa? */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-black uppercase tracking-wider text-slate-600 dark:text-slate-400 block">
                2. Qual o assunto mais importante para essa pessoa?
              </label>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { id: 'obras_emprego', label: `🛣️ Obras e Empregos em ${stateGeo.uf}` },
                  { id: 'comida_salario', label: '🥩 Preço da Feira & Salário Mínimo' },
                  { id: 'farmacia_popular', label: '💊 Remédios Grátis (Farmácia Popular)' },
                  { id: 'risco_flavio', label: '⚠️ O Risco Flávio Bolsonaro' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      playProceduralHaptic('click');
                      setTopic(item.id as FocusTopic);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      topic === item.id
                        ? 'bg-[#C52229] text-white shadow-xs'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-slate-400'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Caixa de Texto Gerada */}
            <div className="relative">
              <label className="text-[11px] font-black uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1 block">
                Texto Pronto para Copiar ou Enviar:
              </label>
              <div className="p-3.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 whitespace-pre-line leading-relaxed font-mono shadow-inner select-all">
                {generatedMessage}
              </div>
            </div>

            {/* Botões de Ação Imediata */}
            <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-1">
              <button
                type="button"
                onClick={handleSendZap}
                className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-98 cursor-pointer"
              >
                <IconShareWhatsApp className="w-4 h-4 text-white" />
                <span>Enviar no WhatsApp</span>
              </button>

              <button
                type="button"
                onClick={handleCopy}
                className="w-full sm:w-auto py-3 px-4 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-98 cursor-pointer"
              >
                <IconCheck className="w-3.5 h-3.5" />
                <span>{copied ? 'Copiado sem erros! ✅' : 'Copiar Texto Limpo'}</span>
              </button>

              <button
                type="button"
                onClick={handleShareLink}
                title="Compartilhar link desta página"
                className="w-full sm:w-auto py-3 px-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900 font-bold text-xs flex items-center justify-center gap-1 transition-all cursor-pointer"
              >
                <span>🔗 Compartilhar Link</span>
              </button>
            </div>
          </div>
        </div>

        {/* ── RODAPÉ DO MODAL ── */}
        <div className="p-4 sm:p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
            <IconShield className="w-3.5 h-3.5 text-emerald-600" />
            <span>Fontes: IBGE, Caged, MEC, MS e DNIT • Iniciativa Cidadã Independente</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {onStartPreparation && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onStartPreparation(stateGeo.uf);
                }}
                style={{ backgroundColor: '#C52229' }}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-white font-black text-xs flex items-center justify-center gap-1.5 hover:opacity-95 transition-all shadow-xs cursor-pointer"
              >
                <span>Montar Roteiro de {stateGeo.name}</span>
                <IconArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
