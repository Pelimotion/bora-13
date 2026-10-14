'use client';

import { useState } from 'react';

interface Scenario {
  id: string;
  title: string;
  interlocutor: string;
  avatar: string;
  role: string;
  situation: string;
  statement: string;
  options: {
    id: string;
    text: string;
    tone: 'acolhedor' | 'confrontador' | 'passivo';
    feedback: string;
    score: number; // 0 to 100
    tacticalTip: string;
  }[];
}

const SCENARIOS: Scenario[] = [
  {
    id: 'tio-almoco',
    title: 'Almoço de Domingo',
    interlocutor: 'Tio Roberto',
    avatar: '👴🏼',
    role: 'Aposentado, 64 anos, fã de grupos de WhatsApp',
    situation: 'Na mesa de sobremesa, ele puxa assunto reclamando das compras e da política.',
    statement: '“O Brasil tá virando uma Venezuela! Tudo subindo no mercado, gasolina cara, e esse governo só gasta e não faz nada pelo trabalhador!”',
    options: [
      {
        id: 'opt-1',
        text: '“Tio, você tá sendo manipulado pelas fake news do WhatsApp. A inflação baixou, o desemprego caiu e o Flávio que é o verdadeiro corrupto com as rachadinhas!”',
        tone: 'confrontador',
        score: 20,
        feedback: '❌ Efeito Tiro Pela Culatra (Backfire Effect)! Chamar de "manipulado" ativou o sistema de defesa dele. Ele vai gritar, cruzar os braços e se fechar totalmente para qualquer dado.',
        tacticalTip: 'Nunca comece invalidando a inteligência da pessoa. O cérebro responde ao ataque como uma ameaça física.',
      },
      {
        id: 'opt-2',
        text: '“Tio, eu te entendo perfeitamente. O dinheiro no final do mês aperta mesmo e dá uma angústia danada ver o carrinho do mercado caro. Mas você reparou que o óleo, o leite e as carnes caíram mais de 15% esse ano? E o salário mínimo teve aumento real de 3% acima da inflação pelo segundo ano consecutivo. Não tá perfeito, mas tá respirando mais que em 2021.”',
        tone: 'acolhedor',
        score: 95,
        feedback: '🎯 Resposta de Mestre! Você validou a dor genuína dele (reduzindo o cortisol e a defensiva) e depois ancorou em dados materiais do dia a dia (óleo, carne, aumento real).',
        tacticalTip: 'Acolher a frustração é a chave que abre a porta da razão. Falar do bolso desarma a ideologia abstrata.',
      },
      {
        id: 'opt-3',
        text: '“É verdade, tá difícil mesmo... melhor a gente nem falar de política pra não estragar o domingo.”',
        tone: 'passivo',
        score: 40,
        feedback: '⚠️ Evasão Pacífica. Evita briga no momento, mas confirma na cabeça dele que a narrativa dele está certa e perde uma oportunidade preciosa de plantar uma reflexão equilibrada.',
        tacticalTip: 'Se não puder debater tudo, lance apenas uma pergunta de reflexão com carinho em vez de fugir.',
      },
    ],
  },
  {
    id: 'amigo-uber',
    title: 'Corrida com Motorista de App',
    interlocutor: 'Marcos',
    avatar: '🚗',
    role: 'Motorista de Aplicativo / MEI, 38 anos',
    situation: 'Durante uma corrida de 20 minutos, ele reclama do custo do combustível e da manutenção.',
    statement: '“Cara, a esquerda odeia quem é autônomo. Eles querem botar CLT na gente à força pra cobrar imposto de sindicato! Eu quero é liberdade pra trabalhar e ganhar meu dinheiro!”',
    options: [
      {
        id: 'opt-1',
        text: '“Você tá completamente errado, Marcos. Sem CLT você não tem direito a nada, se quebrar a perna vai passar fome porque o app não paga nem o conserto da moto.”',
        tone: 'confrontador',
        score: 30,
        feedback: '❌ Confrontação com tom paternalista. Para ele, autonomia e liberdade são valores sagrados de identidade. Dizer que ele "não tem nada" soa ofensivo ao esforço diário dele.',
        tacticalTip: 'Respeite a identidade empreendedora do trabalhador autônomo. Ele não quer voltar ao modelo antigo com intermediários sindicais.',
      },
      {
        id: 'opt-2',
        text: '“Total razão na sua preocupação, Marcos! Quem roda 12 horas por dia na rua não aguenta mais gente de terno querendo dar palpite no seu ganho. O que ninguém fala é que a proposta nunca foi CLT obrigatória, e sim garantir que o MEI tenha desconto no combustível e previdência barata caso bata o carro. E o combustível hoje, com a Petrobras parando de dolarizar, tá quase R$ 2 mais barato que na época da pandemia.”',
        tone: 'acolhedor',
        score: 98,
        feedback: '🎯 Conexão Imediata! Você reafirmou o valor da liberdade dele, desmistificou o boato do confisco e trouxe a vitória concreta do preço do combustível na bomba.',
        tacticalTip: 'Mostre que defender direitos não é burocratizar, e sim proteger o patrimônio e a ferramenta de trabalho do profissional autônomo.',
      },
      {
        id: 'opt-3',
        text: '“Pois é, esses políticos só querem roubar mesmo. Não confio em nenhum.”',
        tone: 'passivo',
        score: 45,
        feedback: '⚠️ Niilismo Político. Fortalece a ideia de que "nada adianta", o que historicamente favorece candidatos populistas radicais.',
        tacticalTip: 'Diferencie política partidária de políticas públicas que mexem no tanque de combustível.',
      },
    ],
  },
  {
    id: 'vizinha-bpc',
    title: 'Conversa no Portão com a Vizinha',
    interlocutor: 'Dona Neide',
    avatar: '👵🏼',
    role: 'Cuida da mãe de 82 anos acamada, recebe BPC',
    situation: 'Ela comenta assustada com um vídeo que viu sobre corte de benefícios.',
    statement: '“Minha filha mandou um vídeo dizendo que se o PT continuar, vão tirar o BPC da minha mãe e proibir quem tem casa de receber ajuda do governo!”',
    options: [
      {
        id: 'opt-1',
        text: '“Dona Neide, isso é a maior mentira do mundo! Quem fez o BPC e o Bolsa Família foi o próprio Lula. Quem queria desvincular o benefício da inflação era o Paulo Guedes!”',
        tone: 'confrontador',
        score: 60,
        feedback: '⚡ Fato correto, mas choque emocional alto. Atacar a filha dela ("mandou mentira") causa dissonância cognitiva e ansiedade.',
        tacticalTip: 'Pessoas idosas são vulneráveis ao medo. Traga acolhimento e documentos ou regras claras em vez de embate sobre familiares.',
      },
      {
        id: 'opt-2',
        text: '“Dona Neide, respira funda! Eu imagino o aperto no coração que dá ouvir uma coisa dessas cuidando da sua mãe. Pode ficar em paz: o BPC é uma lei federal protegida pela Constituição de 1988 e nunca foi tão garantido. O salário que ela recebe acompanha o aumento do mínimo com ganho real. Quem falou em desvincular a aposentadoria do mínimo no passado foi o governo anterior. Aqui a senhora e sua mãe tão seguras.”',
        tone: 'acolhedor',
        score: 100,
        feedback: '🌟 Empatia Absoluta & Alívio Imediato! Você tirou o medo do peito dela, explicou a proteção constitucional sem juridiquês e garantiu a dignidade da mãe dela.',
        tacticalTip: 'Acalmar o medo antes de falar de votos é o ato humano mais poderoso do diálogo democrático.',
      },
      {
        id: 'opt-3',
        text: '“Ah, cada dia dizem uma coisa na internet, né? Nem sei mais em quem acreditar.”',
        tone: 'passivo',
        score: 35,
        feedback: '❌ A Dona Neide continuará com medo e ansiedade, podendo votar levada pelo pânico fabricado.',
        tacticalTip: 'Diante do medo de perder o sustento vital, a verdade empática é um dever moral.',
      },
    ],
  },
];

export default function ConversationSimulator({ onClose }: { onClose: () => void }) {
  const [selectedScenarioIndex, setSelectedScenarioIndex] = useState(0);
  const [chosenOptionId, setChosenOptionId] = useState<string | null>(null);

  const scenario = SCENARIOS[selectedScenarioIndex];
  const chosenOption = scenario.options.find(o => o.id === chosenOptionId);

  const handleSelectOption = (optionId: string) => {
    setChosenOptionId(optionId);
  };

  const handleNextScenario = () => {
    setChosenOptionId(null);
    setSelectedScenarioIndex((prev) => (prev + 1) % SCENARIOS.length);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="bg-white dark:bg-[#0F1729] border border-slate-200 dark:border-slate-800 rounded-3xl max-w-xl w-full max-h-[92vh] overflow-y-auto p-5 md:p-6 shadow-2xl flex flex-col transition-colors">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🥋</span>
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-slate-100">Simulador de Conversa</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Treine suas respostas com psicologia do diálogo</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center font-bold transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Scenario Selector Pills */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-none">
          {SCENARIOS.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => {
                setSelectedScenarioIndex(idx);
                setChosenOptionId(null);
              }}
              className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                selectedScenarioIndex === idx
                  ? 'bg-[#C52229] text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-transparent hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <span>{s.avatar}</span>
              <span>{s.title}</span>
            </button>
          ))}
        </div>

        {/* Interlocutor Card */}
        <div className="bg-slate-50 dark:bg-[#080F1A] border border-slate-200 dark:border-slate-800/80 rounded-2xl p-4 mb-4">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">{scenario.avatar}</span>
            <div>
              <h3 className="text-sm font-black text-slate-900 dark:text-slate-100">{scenario.interlocutor}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">{scenario.role}</p>
            </div>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 italic mb-3">📍 Contexto: {scenario.situation}</p>

          {/* Dialogue Bubble (Interlocutor) */}
          <div className="bg-amber-50 dark:bg-slate-800/80 border-l-4 border-amber-500 p-3.5 rounded-r-xl rounded-bl-xl text-slate-900 dark:text-slate-200 text-xs md:text-sm leading-relaxed font-medium shadow-sm">
            {scenario.statement}
          </div>
        </div>

        {/* User Question */}
        <p className="text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-400 mb-3">
          👉 Como você responderia?
        </p>

        {/* Options */}
        <div className="flex flex-col gap-2.5 mb-5">
          {scenario.options.map((opt) => (
            <button
              key={opt.id}
              onClick={() => handleSelectOption(opt.id)}
              className={`text-left p-3.5 rounded-2xl border transition-all text-xs md:text-sm leading-relaxed ${
                chosenOptionId === opt.id
                  ? opt.score >= 80
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-950 dark:text-emerald-100 shadow-md'
                    : opt.score >= 50
                    ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-500 text-amber-950 dark:text-amber-100 shadow-md'
                    : 'bg-rose-50 dark:bg-rose-950/40 border-rose-500 text-rose-950 dark:text-rose-100 shadow-md'
                  : 'bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-sm'
              }`}
            >
              <div className="flex items-start gap-2">
                <span className="font-bold text-slate-400 dark:text-slate-500">
                  {chosenOptionId === opt.id ? '✓' : '○'}
                </span>
                <span>{opt.text}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Instant Tactical Feedback */}
        {chosenOption && (
          <div
            className={`p-4 rounded-2xl border mb-5 animate-slide-up ${
              chosenOption.score >= 80
                ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-500/40'
                : chosenOption.score >= 50
                ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-300 dark:border-amber-500/40'
                : 'bg-rose-50 dark:bg-rose-950/30 border-rose-300 dark:border-rose-500/40'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                Análise Tática do Diálogo
              </span>
              <span
                className={`text-xs font-black px-2.5 py-0.5 rounded-full ${
                  chosenOption.score >= 80
                    ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300'
                    : chosenOption.score >= 50
                    ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300'
                    : 'bg-rose-100 dark:bg-rose-500/20 text-rose-800 dark:text-rose-300'
                }`}
              >
                Eficácia: {chosenOption.score}%
              </span>
            </div>

            <p className="text-xs md:text-sm leading-relaxed text-slate-800 dark:text-slate-200 mb-3 font-medium">
              {chosenOption.feedback}
            </p>

            <div className="bg-white/80 dark:bg-black/30 p-2.5 rounded-xl border border-slate-200 dark:border-white/5">
              <p className="text-xs text-slate-700 dark:text-slate-300">
                <strong className="text-red-600 dark:text-red-400">💡 Dica de Neurociência & Comunicação:</strong>{' '}
                {chosenOption.tacticalTip}
              </p>
            </div>
          </div>
        )}

        {/* Bottom Actions */}
        <div className="flex gap-2 mt-auto">
          <button
            onClick={handleNextScenario}
            className="btn-pt flex-1 text-xs md:text-sm font-bold flex items-center justify-center gap-1.5"
          >
            <span>Próximo Cenário</span>
            <span>→</span>
          </button>
          <button
            onClick={onClose}
            className="btn-ghost px-4 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
          >
            Concluir Treino
          </button>
        </div>
      </div>
    </div>
  );
}
