# 📱 Bora 13 — Frontend Application (`bora-app`)

> **Aplicação Web Progressiva (PWA) de Alto Desempenho e Acessibilidade Popular**  
> Construída em Next.js 16 (Turbopack), Tailwind CSS v4, React 19 e TypeScript.  
> 🌐 **URL de Produção**: [https://www.gigantera.xyz/bora](https://www.gigantera.xyz/bora) (Micro-frontend via Vercel)

---

## 🏗️ Arquitetura de Diretórios (`src/`)

```
src/
├── app/
│   ├── favicon.ico             # Ícone do navegador
│   ├── globals.css             # Estilos globais e tokens Tailwind v4
│   ├── layout.tsx              # Shell HTML5, fontes, metadados PWA e tema
│   ├── manifest.json           # Manifesto PWA para instalação no celular
│   └── page.tsx                # Raiz do aplicativo e orquestração de seções
├── components/
│   ├── AudioPlayerButton.tsx   # Botão acessível de síntese de voz (Web Speech API)
│   ├── BrazilMap.tsx           # Mapa interativo em SVG dos 26 estados + DF
│   ├── ConversationSimulator.tsx # Treinador de conversas do cotidiano com sincronização de personas
│   ├── MobileDock.tsx          # Barra de navegação inferior estilo app nativo
│   ├── NavigationHeader.tsx    # Cabeçalho com logo, status e botão "Baixar App"
│   ├── PostStudioSection.tsx   # Gerador de imagens (Canvas 2D) e carrosséis para Instagram
│   ├── ProfileSection.tsx      # Roteiros para os 4 perfis de eleitores com âncora territorial
│   ├── QuickArgumentView.tsx   # Roleta de Fatos, gamificação e modo texto grande
│   ├── RadarSection.tsx        # Hero acolhedor, Funil da Virada e comparativos do bolso
│   ├── TailoredMissionFunnel.tsx # Funil em 3 passos: Estado → Cidade → Perfil → Arsenal sob medida
│   ├── TerritorySection.tsx    # Mapa estratégico com cidades e funil territorial integrado
│   └── VisualJourneyStepper.tsx # Régua numerada de navegação fluida
├── data/
│   ├── arguments.ts            # Banco de argumentos e dados oficiais auditados
│   ├── brazilGeo.ts            # Dados demográficos e conquistas dos 27 estados e capitais
│   ├── electoralTactics.ts     # As 4 frentes de conversa e fatos comparativos ("O Menos com Flávio")
│   ├── occupations.ts          # Normalização de profissões e categorias sociais
│   └── opportunities.ts        # Programas sociais (Farmácia Popular, Desenrola, Pé-de-Meia)
└── lib/
    ├── agenticOrchestrator.ts  # Orquestrador agêntico, planos personalizados e gerador de presets
    └── engine.ts               # Motor de recomendação contextual por UF/profissão
```

---

## ⚡ Tecnologias e Decisões de Engenharia

### 1. Zero Bloat de Dependências de Áudio e Imagem (Ponytail)
- **Web Audio API**: Feedback sonoro nativo via osciladores procedurais em `playProceduralHaptic()`. Não carrega pacotes de terceiros nem consome dados móveis do usuário para baixar arquivos de som.
- **HTML5 2D Canvas de Alta Resolução**: A renderização das imagens de posts (1080x1080) e stories (1080x1920) ocorre localmente no dispositivo do usuário com tipografia oficial, paletas de cores calibradas e quebra de linha inteligente.

### 2. Acessibilidade Total (WCAG 2.1 AA)
- Suporte a leitor de voz sintetizada nativo (`window.speechSynthesis`).
- Alternador de tamanho de fonte para idosos e pessoas com baixa visão (`largeMode`).
- Contraste reforçado no tema claro e escuro.

### 3. PWA e Modo Offline
- `public/sw.js`: Service worker configurado para cache de recursos estáticos e inicialização imediata.
- `public/manifest.json`: Ícones 192px e 512px com suporte a "Adicionar à Tela de Início".

### 4. Funil Narrativo Agêntico & Deep-linking
- **Funil em 3 Passos**: Seleção do Estado (UF) $\rightarrow$ Escolha da Cidade $\rightarrow$ Seleção da Frente de Conversão, Profissão e Realidade Familiar $\rightarrow$ Geração do Arsenal Sob Medida.
- **Deep-linking para Mobilização**: Parâmetros de URL (`?state=SP&city=Campinas&front=ex_lula&occ=Motorista`) permitem que links compartilhados em grupos recarreguem o caso exato em qualquer dispositivo.
- **Integração com Simulador e Estúdio**: 1 clique para treinar o diálogo com a persona correspondente ou para carregar o carrossel de 5 lâminas para Instagram no Estúdio de Criação.

---

## 🛠️ Comandos de Desenvolvimento

```bash
# Iniciar o servidor com Turbopack (porta padrão: 3000)
npm run dev

# Checagem de tipos TypeScript e build estático
npm run build

# Iniciar o servidor de produção local após o build
npm run start

# Executar linter ESLint
npm run lint
```

---

## 🔗 Referências

- [README Geral do Repositório](../README.md)
- [Guia de Vibe Coding & Boas Práticas](../VIBE_CODING.md)
- [Relatório do Knowledge Graph (Graphify)](../graphify-out/GRAPH_REPORT.md)
