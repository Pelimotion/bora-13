# Graph Report - bora-app  (2026-10-14)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 217 nodes · 415 edges · 13 communities (9 shown, 4 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- compilerOptions
- ProfileSection.tsx
- devDependencies
- page.tsx
- playProceduralHaptic
- dependencies
- QuickArgumentView.tsx
- manifest.json
- TerritorySection.tsx
- ConversationSimulator.tsx
- next.config.ts
- eslint.config.mjs
- sw.js

## God Nodes (most connected - your core abstractions)
1. `playProceduralHaptic()` - 17 edges
2. `compilerOptions` - 16 edges
3. `Argument` - 13 edges
4. `AgenticWorkingMemory` - 13 edges
5. `PostStudioSection()` - 12 edges
6. `AppSection` - 11 edges
7. `Opportunity` - 10 edges
8. `runEngine()` - 10 edges
9. `ProfileTag` - 9 edges
10. `BoraApp()` - 8 edges

## Surprising Connections (you probably didn't know these)
- `SmoothScroll()` --references--> `lenis`  [EXTRACTED]
  src/components/SmoothScroll.tsx → package.json
- `BoraApp()` --calls--> `inferTagsFromCustomOccupation()`  [EXTRACTED]
  src/app/page.tsx → src/data/occupations.ts
- `BoraApp()` --calls--> `playProceduralHaptic()`  [EXTRACTED]
  src/app/page.tsx → src/lib/agenticOrchestrator.ts
- `BrazilMap()` --references--> `BRAZIL_STATES_GEO`  [EXTRACTED]
  src/components/BrazilMap.tsx → src/data/brazilGeo.ts
- `MobileDockProps` --references--> `AppSection`  [EXTRACTED]
  src/components/MobileDock.tsx → src/lib/agenticOrchestrator.ts

## Import Cycles
- None detected.

## Communities (13 total, 4 thin omitted)

### Community 0 - "compilerOptions"
Cohesion: 0.07
Nodes (28): dom, dom.iterable, esnext, **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules (+20 more)

### Community 1 - "ProfileSection.tsx"
Cohesion: 0.16
Nodes (23): ProfileSection(), ProfileSectionProps, ACOLHIMENTO_SCRIPTS, PersuasionStage, ProfileTag, Route, ConversionFront, inferTagsFromCustomOccupation() (+15 more)

### Community 2 - "devDependencies"
Cohesion: 0.08
Nodes (25): eslint, eslint-config-next, devDependencies, eslint, eslint-config-next, tailwindcss, @tailwindcss/turbopack, @types/node (+17 more)

### Community 3 - "page.tsx"
Cohesion: 0.19
Nodes (22): BoraApp(), ArtisticCanvas(), ArtisticCanvasProps, PostStudioSection(), PostStudioSectionProps, ARGUMENTS_DATABASE, OPPORTUNITIES_DATABASE, CopyBundle (+14 more)

### Community 4 - "playProceduralHaptic"
Cohesion: 0.16
Nodes (20): DOCK_ITEMS, MobileDock(), MobileDockProps, NavigationHeader(), NavigationHeaderProps, SECTIONS, RadarSection(), RadarSectionProps (+12 more)

### Community 5 - "dependencies"
Cohesion: 0.10
Nodes (18): gsap, lenis, next, dependencies, gsap, lenis, next, react (+10 more)

### Community 6 - "QuickArgumentView.tsx"
Cohesion: 0.13
Nodes (15): AudioPlayerButton(), AudioPlayerButtonProps, BadgeLevel, BADGES, CATEGORIES, DICE_FACES, playProceduralSound(), QuickArgumentView() (+7 more)

### Community 7 - "manifest.json"
Cohesion: 0.11
Nodes (17): background_color, categories, description, dir, display, icons, id, lang (+9 more)

### Community 8 - "TerritorySection.tsx"
Cohesion: 0.33
Nodes (10): BrazilMap(), BrazilMapProps, TerritorySection(), TerritorySectionProps, BRAZIL_STATES_GEO, getStateByUF(), REGIONS, StateGeo (+2 more)

## Knowledge Gaps
- **88 isolated node(s):** `eslintConfig`, `securityHeaders`, `nextConfig`, `name`, `version` (+83 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `dependencies` connect `dependencies` to `devDependencies`?**
  _High betweenness centrality (0.029) - this node is a cross-community bridge._
- **Why does `Argument` connect `QuickArgumentView.tsx` to `ProfileSection.tsx`, `page.tsx`, `playProceduralHaptic`?**
  _High betweenness centrality (0.027) - this node is a cross-community bridge._
- **What connects `eslintConfig`, `securityHeaders`, `nextConfig` to the rest of the system?**
  _88 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.06896551724137931 - nodes in this community are weakly interconnected._
- **Should `devDependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.07692307692307693 - nodes in this community are weakly interconnected._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._
- **Should `QuickArgumentView.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.13450292397660818 - nodes in this community are weakly interconnected._