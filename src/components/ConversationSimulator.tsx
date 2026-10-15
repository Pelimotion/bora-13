'use client';

import { useState, useEffect } from 'react';

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
        feedback: '❌ Isso afasta a pessoa na hora! Se você chamar de "manipulado", a pessoa se ofende, fecha os ouvidos e não quer nem saber de dados. A conversa vira briga de família.',
        tacticalTip: 'Nunca comece chamando a pessoa de desinformada. Quando a gente ataca, a pessoa se fecha pra se defender.',
      },
      {
        id: 'opt-2',
        text: '“Tio, eu te entendo perfeitamente. O dinheiro no final do mês aperta mesmo e dá uma angústia danada ver o carrinho do mercado caro. Mas você reparou que o óleo, o leite e as carnes caíram mais de 15% esse ano? E o salário mínimo teve aumento real de 3% acima da inflação pelo segundo ano consecutivo. Não tá perfeito, mas tá respirando mais que em 2021.”',
        tone: 'acolhedor',
        score: 95,
        feedback: '🎯 Resposta Nota 10! Você concordou com a dor dele primeiro (tirando o clima de briga) e depois trouxe dados reais do dia a dia (óleo, carne, aumento real).',
        tacticalTip: 'Concordar com o aperto das contas é a chave que abre o ouvido da pessoa. Falar de comida e compras do mês desarma discussões vazias.',
      },
      {
        id: 'opt-3',
        text: '“É verdade, tá difícil mesmo... melhor a gente nem falar de política pra não estragar o domingo.”',
        tone: 'passivo',
        score: 40,
        feedback: '⚠️ Fuga compreensível, mas perde uma chance. Evita briga no almoço, mas deixa o boato vencer sozinho e não planta nenhuma dúvida saudável na cabeça dele.',
        tacticalTip: 'Se não der pra falar tudo, faça apenas uma pergunta calma com carinho em vez de fugir.',
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
        feedback: '❌ Tom de bronca que irrita o trabalhador. Quem rala 12h por dia na rua tem orgulho do seu trabalho. Dizer que ele "não tem nada" soa desrespeitoso com o suor dele.',
        tacticalTip: 'Respeite a vontade de autonomia do trabalhador. Quem trabalha por conta própria quer apoio, não sermão de ninguém.',
      },
      {
        id: 'opt-2',
        text: '“Total razão na sua preocupação, Marcos! Quem roda 12 horas por dia na rua não aguenta mais gente de terno querendo dar palpite no seu ganho. O que ninguém fala é que a proposta nunca foi CLT obrigatória, e sim garantir que o MEI tenha desconto no combustível e previdência barata caso bata o carro. E o combustível hoje, com a Petrobras parando de dolarizar, tá quase R$ 2 mais barato que na época da pandemia.”',
        tone: 'acolhedor',
        score: 98,
        feedback: '🎯 Conexão de Confiança! Você valorizou a independência dele, explicou que ninguém quer forçar CLT e lembrou do preço do combustível mais baixo no tanque.',
        tacticalTip: 'Mostre que proteger direitos não é burocracia, e sim garantir socorro se a ferramenta de trabalho quebrar.',
      },
      {
        id: 'opt-3',
        text: '“Pois é, esses políticos só querem roubar mesmo. Não confio em nenhum.”',
        tone: 'passivo',
        score: 45,
        feedback: '⚠️ Desânimo geral. Falar que "nada adianta" só favorece quem quer cortar direitos e privatizar tudo.',
        tacticalTip: 'Diferencie brigas partidárias de medidas práticas que colocam dinheiro no bolso do motorista.',
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
        feedback: '⚡ O fato é verdadeiro, mas falar que a filha mandou mentira assusta a senhora e gera aflição.',
        tacticalTip: 'Pessoas mais velhas sentem medo real de perder o remédio e a comida. Acalme o coração dela antes de qualquer debate.',
      },
      {
        id: 'opt-2',
        text: '“Dona Neide, respira funda! Eu imagino o aperto no coração que dá ouvir uma coisa dessas cuidando da sua mãe. Pode ficar em paz: o BPC é uma lei federal protegida pela Constituição de 1988 e nunca foi tão garantido. O salário que ela recebe acompanha o aumento do mínimo com ganho real. Quem falou em desvincular a aposentadoria do mínimo no passado foi o governo anterior. Aqui a senhora e sua mãe tão seguras.”',
        tone: 'acolhedor',
        score: 100,
        feedback: '🌟 Acolhimento e Paz! Você tirou o medo do peito dela com carinho, explicou que a lei protege o benefício e devolveu a tranquilidade.',
        tacticalTip: 'Acalmar o pânico antes de falar em voto é o gesto mais bonito e humano que existe.',
      },
      {
        id: 'opt-3',
        text: '“Ah, cada dia dizem uma coisa na internet, né? Nem sei mais em quem acreditar.”',
        tone: 'passivo',
        score: 35,
        feedback: '❌ A Dona Neide continuará com medo e pode votar assustada por uma mentira que ninguém desmentiu.',
        tacticalTip: 'Diante do medo de perder o sustento da família, a verdade dita com carinho traz alívio imediato.',
      },
    ],
  },
  {
    id: 'bolsonarista-colega',
    title: 'Pausa do Café no Trabalho',
    interlocutor: 'Eduardo',
    avatar: '👔',
    role: 'Comerciário / Vendedor, 42 anos, eleitor declarado de Flávio',
    situation: 'No intervalo do café, ele diz que vai votar em Flávio porque quer ordem e defende a família.',
    statement: '“Eu já decidi, vou de Flávio 22! O Brasil precisa de ordem, valores de família e cortar regalias. A esquerda só quer gastança e corrupção!”',
    options: [
      {
        id: 'opt-1',
        text: '“Você tá maluco de votar no Flávio? Você não vê o escândalo das rachadinhas, as mansões de luxo e que o grupo dele quase deu um golpe?”',
        tone: 'confrontador',
        score: 25,
        feedback: '❌ Confronto direto gera resistência imediata! Atacar agressivamente o candidato faz a pessoa se fechar por orgulho e encerrar o diálogo.',
        tacticalTip: 'Nunca ataque o interlocutor nem tente humilhar a escolha dele. Traga a conversa para o chão da fábrica e do comércio.',
      },
      {
        id: 'opt-2',
        text: '“Eduardo, eu respeito muito a sua fé e a sua preocupação com a família. Ninguém aqui quer baderna nem corrupção. Mas deixa eu te fazer uma pergunta sincera de colega que rala no comércio: você sabia que o Flávio votou CONTRA o fim da escala 6x1? Ele acha normal quem trabalha no comércio folgar só 1 dia por semana e não ter tempo pra família e pro culto. E na gestão passada, cortaram 59% da Farmácia Popular. Se o seu pai ou mãe precisar de remédio de pressão, quem vai pagar a conta? Político que mora em mansão de R$ 6 milhões não sente o que a gente passa na escala de sábado e domingo.”',
        tone: 'acolhedor',
        score: 98,
        feedback: '🎯 Resposta de Mestre! Você validou a fé e a família dele com respeito, separou o trabalhador do político milionário e tocou na ferida real: a folga da escala 6x1 e os remédios.',
        tacticalTip: 'A escala 6x1 e a Farmácia Popular são as duas maiores chaves de diálogo com eleitores de direita trabalhadores: tocam no cansaço da rotina e no bolso.',
      },
      {
        id: 'opt-3',
        text: '“É, cada um tem sua opinião, melhor a gente não misturar trabalho com política pra não dar confusão.”',
        tone: 'passivo',
        score: 40,
        feedback: '⚠️ Fuga compreensível, mas perde a oportunidade de mostrar que a escala de trabalho dele está em jogo na urna.',
        tacticalTip: 'Com calma e respeito, é possível falar de trabalho e folga sem transformar em briga partidária.',
      },
    ],
  },
];

export default function ConversationSimulator({
  onClose,
  isEmbedded = false,
  initialScenarioId,
}: {
  onClose?: () => void;
  isEmbedded?: boolean;
  initialScenarioId?: string;
}) {
  const initialIndex = initialScenarioId
    ? Math.max(0, SCENARIOS.findIndex((s) => s.id === initialScenarioId))
    : 0;
  const [selectedScenarioIndex, setSelectedScenarioIndex] = useState(initialIndex);
  const [chosenOptionId, setChosenOptionId] = useState<string | null>(null);

  // Sincronizar se o initialScenarioId mudar
  useEffect(() => {
    if (initialScenarioId) {
      const idx = SCENARIOS.findIndex((s) => s.id === initialScenarioId);
      if (idx !== -1) {
        setSelectedScenarioIndex(idx);
        setChosenOptionId(null);
      }
    }
  }, [initialScenarioId]);

  const scenario = SCENARIOS[selectedScenarioIndex];
  const chosenOption = scenario.options.find(o => o.id === chosenOptionId);

  const handleSelectOption = (optionId: string) => {
    setChosenOptionId(optionId);
  };

  const handleNextScenario = () => {
    setChosenOptionId(null);
    setSelectedScenarioIndex((prev) => (prev + 1) % SCENARIOS.length);
  };

  const innerContent = (
    <div className={`bg-white dark:bg-[#0F1729] border border-slate-200 dark:border-slate-800 rounded-3xl ${isEmbedded ? 'w-full shadow-lg p-6 md:p-8' : 'max-w-xl w-full max-h-[92vh] overflow-y-auto p-5 md:p-6 shadow-2xl'} flex flex-col transition-colors`}>
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🥋</span>
          <div>
            <h2 className="text-lg md:text-xl font-black text-slate-900 dark:text-slate-100">Dojô de Conversas da Vida Real</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Treine suas respostas com psicologia do diálogo e neurociência</p>
          </div>
        </div>
        {onClose && !isEmbedded && (
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center font-bold transition-colors"
          >
            ✕
          </button>
        )}
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
          {onClose && (
            <button
              onClick={onClose}
              className="btn-ghost px-4 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            >
              Concluir Treino
            </button>
          )}
        </div>
      </div>
  );

  if (isEmbedded) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 py-8 animate-fade-in">
        {innerContent}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/85 backdrop-blur-md animate-fade-in">
      {innerContent}
    </div>
  );
}
