# Graph Report - ferney-app  (2026-11-24)

## Corpus Check
- 72 files · ~24,720 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 9 file(s) not represented in the graph (top: .woff2 4, (none) 2, .example 1)

## Summary
- 361 nodes · 741 edges · 20 communities (16 shown, 4 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 4 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `ff5d3113`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- relaciones.ts
- demo-data.ts
- lucide-react
- next
- generar-documentos.ts
- devDependencies
- dependencies
- compilerOptions
- package.json
- editor-informe.tsx
- Copiloto de área · Plan técnico del piloto
- @playwright/test
- CLAUDE.md · Copiloto de área (piloto del cliente)
- DESIGN.md · Copiloto de área (nombre del producto por definir)
- eslint.config.mjs
- scripts
- README.md
- AGENTS.md
- class-variance-authority@^0.7.1
- preguntas-buscador-evaluacion.md

## God Nodes (most connected - your core abstractions)
1. `cn()` - 27 edges
2. `compilerOptions` - 16 edges
3. `lucide-react` - 14 edges
4. `next` - 14 edges
5. `AppShell()` - 13 edges
6. `drizzle-orm` - 12 edges
7. `react` - 12 edges
8. `StatusChip()` - 12 edges
9. `formatNumber()` - 11 edges
10. `IndicadorPage()` - 10 edges

## Surprising Connections (you probably didn't know these)
- `sembrarDocumentos()` --calls--> `generarDocumentosFicticios()`  [EXTRACTED]
  app/scripts/sembrar-datos-ficticios.ts → app/scripts/lib/generar-documentos.ts
- `sembrarIndicadores()` --calls--> `generarCalendarioSemanal()`  [EXTRACTED]
  app/scripts/sembrar-datos-ficticios.ts → app/scripts/lib/generar-indicadores.ts
- `sembrarIndicadores()` --calls--> `generarMediciones()`  [EXTRACTED]
  app/scripts/sembrar-datos-ficticios.ts → app/scripts/lib/generar-indicadores.ts
- `DocumentosPage()` --calls--> `BuscadorDemo()`  [EXTRACTED]
  app/src/app/documentos/page.tsx → app/src/components/documentos/buscador-demo.tsx
- `IndicadorPage()` --calls--> `AppShell()`  [EXTRACTED]
  app/src/app/indicadores/[slug]/page.tsx → app/src/components/layout/app-shell.tsx

## Import Cycles
- None detected.

## Communities (20 total, 4 thin omitted)

### Community 0 - "relaciones.ts"
Cohesion: 0.06
Nodes (56): escribirPreguntasEvaluacion(), main(), sembrarDocumentos(), sembrarIndicadores(), GET, POST, crearDb(), getDb() (+48 more)

### Community 1 - "demo-data.ts"
Cohesion: 0.09
Nodes (46): IndicadorPage(), instant, colorFeed, etiquetaResumenEstado, iconoFeed, instant, ResumenPage(), BuscadorDemo() (+38 more)

### Community 2 - "lucide-react"
Cohesion: 0.10
Nodes (26): DocumentosPage(), EncabezadoDocumentos(), AppShell(), CommandPalette(), manejarCambioAbierto(), onKey(), construirItems(), Item (+18 more)

### Community 3 - "next"
Cohesion: 0.12
Nodes (15): nextConfig, next@16.4.6, react@19.3.0, BotonEntrarConGoogle(), EntrarPage(), metadata, RootLayout(), ThemeProvider() (+7 more)

### Community 4 - "generar-documentos.ts"
Cohesion: 0.14
Nodes (21): DocumentoGenerado, DOCUMENTOS_FIJOS, generarDocumentosFicticios(), generarPaginasTema(), PaginaDocumento, PreguntaEvaluacion, RELLENO_GENERICO, TemaDocumento (+13 more)

### Community 5 - "devDependencies"
Cohesion: 0.10
Nodes (19): devDependencies, dotenv-cli@^11.1.0, drizzle-kit@^0.31.11, tailwindcss@4.3.3, @tailwindcss/turbopack@4.3.3, tsx@^4.23.15, @types/pg@^8.23.1, @types/react@^19 (+11 more)

### Community 6 - "dependencies"
Cohesion: 0.10
Nodes (20): dependencies, better-auth@^1.7.27, clsx@^2.1.1, drizzle-orm@^0.45.4, lucide-react@^1.78.0, next-themes@^0.4.6, @radix-ui/react-checkbox@^1.4.1, @radix-ui/react-dialog@^1.3.1 (+12 more)

### Community 7 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 8 - "package.json"
Cohesion: 0.14
Nodes (13): @neondatabase/serverless@^1.2.1, pg@^8.23.1, react-dom@19.3.0, tailwind-merge@^3.7.1, @types/node@^20, name, private, version (+5 more)

### Community 9 - "editor-informe.tsx"
Cohesion: 0.35
Nodes (8): InformesPage(), BotonesInforme(), EditorInforme(), Interruptor(), PasoRevision(), ToolButton(), informeSemanal, formatDateTime()

### Community 10 - "Copiloto de área · Plan técnico del piloto"
Cohesion: 0.18
Nodes (10): Copiloto de área · Plan técnico del piloto, Estado (2026-11-24), Fase 0 · Cimientos (pista A, arranca ahora), Fase 1 · Tablero de indicadores (pista A, con ajuste pendiente de pista B), Fase 2 · Informe semanal (pista A + B, depende de Fase 1), Fase 3 · Buscador de documentos (pista A), Fase 4 · Cierre para la demostración, Principio de secuencia (+2 more)

### Community 12 - "CLAUDE.md · Copiloto de área (piloto del cliente)"
Cohesion: 0.25
Nodes (7): Calidad de código (no negociable), CLAUDE.md · Copiloto de área (piloto del cliente), Cómo trabajar aquí, Estado, Qué es esto, Reglas no negociables, Stack del PILOTO (lo que se construye ahora) — 100 % Vercel, sin VPS

### Community 13 - "DESIGN.md · Copiloto de área (nombre del producto por definir)"
Cohesion: 0.25
Nodes (7): 1. Tema y atmósfera, 2. Paleta (contraste verificado con WCAG 2.1), 3. Tipografía, 4. Componentes, 5. Distribución, 6. Se hace / no se hace, DESIGN.md · Copiloto de área (nombre del producto por definir)

### Community 14 - "eslint.config.mjs"
Cohesion: 0.33
Nodes (5): eslintConfig, eslint@^9, eslint-config-next@16.4.6, eslint, eslint-config-next

### Community 15 - "scripts"
Cohesion: 0.33
Nodes (6): scripts, build, dev, lint, seed, start

### Community 16 - "README.md"
Cohesion: 0.50
Nodes (3): Deploy on Vercel, Getting Started, Learn More

## Knowledge Gaps
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `drizzle-orm` connect `relaciones.ts` to `package.json`, `demo-data.ts`, `dependencies`?**
  _High betweenness centrality (0.176) - this node is a cross-community bridge._
- **Should `relaciones.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.05714285714285714 - nodes in this community are weakly interconnected._
- **Why does `next` connect `next` to `package.json`, `demo-data.ts`, `lucide-react`?**
  _High betweenness centrality (0.085) - this node is a cross-community bridge._
- **Should `demo-data.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.0929281122150789 - nodes in this community are weakly interconnected._
- **Why does `react` connect `next` to `package.json`, `demo-data.ts`, `lucide-react`, `editor-informe.tsx`?**
  _High betweenness centrality (0.061) - this node is a cross-community bridge._
- **Should `lucide-react` be split into smaller, more focused modules?**
  _Cohesion score 0.09986504723346828 - nodes in this community are weakly interconnected._
- **Should `next` be split into smaller, more focused modules?**
  _Cohesion score 0.11666666666666667 - nodes in this community are weakly interconnected._