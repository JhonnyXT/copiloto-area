# Graph Report - copiloto-area  (2026-11-24)

## Corpus Check
- 82 files · ~24,506 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 9 file(s) not represented in the graph (top: .woff2 4, (none) 2, .example 1)

## Summary
- 400 nodes · 838 edges · 21 communities (17 shown, 4 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 4 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `790450ce`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- relaciones.ts
- cn
- sidebar.tsx
- pg@^8.23.1
- generar-documentos.ts
- devDependencies
- dependencies
- compilerOptions
- package.json
- Copiloto de área · Plan técnico del piloto
- @playwright/test
- CLAUDE.md · Copiloto de área (piloto del cliente)
- DESIGN.md · Copiloto de área (nombre del producto por definir)
- eslint.config.mjs
- scripts
- README.md
- AGENTS.md
- cn
- preguntas-buscador-evaluacion.md
- layout.tsx
- .claude/CLAUDE.md

## God Nodes (most connected - your core abstractions)
1. `cn()` - 34 edges
2. `formatNumber()` - 16 edges
3. `compilerOptions` - 16 edges
4. `next` - 15 edges
5. `lucide-react` - 15 edges
6. `AppShell()` - 14 edges
7. `obtenerKpisDeOrganizacion()` - 12 edges
8. `drizzle-orm` - 12 edges
9. `react` - 12 edges
10. `IndicadorPage()` - 11 edges

## Surprising Connections (you probably didn't know these)
- `IndicadorPage()` --calls--> `StatusChip()`  [EXTRACTED]
  app/src/app/indicadores/[slug]/page.tsx → app/src/components/ui/status-chip.tsx
- `IndicadorPage()` --calls--> `cn()`  [EXTRACTED]
  app/src/app/indicadores/[slug]/page.tsx → app/src/lib/utils.ts
- `BuscadorDemo()` --calls--> `formatDate()`  [EXTRACTED]
  app/src/components/documentos/buscador-demo.tsx → app/src/lib/utils.ts
- `InformesPage()` --calls--> `AppShell()`  [EXTRACTED]
  app/src/app/informes/page.tsx → app/src/components/layout/app-shell.tsx
- `IndicadorTendenciaPeriodo()` --calls--> `cn()`  [EXTRACTED]
  app/src/components/indicador/tendencia-periodo.tsx → app/src/lib/utils.ts

## Import Cycles
- None detected.

## Communities (21 total, 4 thin omitted)

### Community 0 - "relaciones.ts"
Cohesion: 0.06
Nodes (46): drizzle-orm@^0.45.4, AccionAuditoria, auditoria, DetalleAuditoria, NuevoRegistroAuditoria, RegistroAuditoria, Documento, documentos (+38 more)

### Community 1 - "cn"
Cohesion: 0.08
Nodes (50): IndicadorPage(), instant, instant, ResumenPage(), ResumenSinDatos(), IndicadorTendenciaPeriodo(), AppShell(), CeldaIndicador() (+42 more)

### Community 2 - "sidebar.tsx"
Cohesion: 0.11
Nodes (25): nextConfig, next@16.4.6, AccionCuentaProps, BotonAccion(), BotonCerrarSesion(), BotonTema(), CommandPalette(), manejarCambioAbierto() (+17 more)

### Community 4 - "generar-documentos.ts"
Cohesion: 0.06
Nodes (43): better-auth@^1.7.27, DocumentoGenerado, DOCUMENTOS_FIJOS, generarDocumentosFicticios(), generarPaginasTema(), PaginaDocumento, PreguntaEvaluacion, RELLENO_GENERICO (+35 more)

### Community 5 - "devDependencies"
Cohesion: 0.11
Nodes (17): devDependencies, dotenv-cli@^11.1.0, drizzle-kit@^0.31.11, tailwindcss@4.3.3, @tailwindcss/turbopack@4.3.3, @types/node@^20, @types/pg@^8.23.1, @types/react-dom@^19 (+9 more)

### Community 6 - "dependencies"
Cohesion: 0.10
Nodes (21): dependencies, clsx@^2.1.1, lucide-react@^1.78.0, @neondatabase/serverless@^1.2.1, @radix-ui/react-dialog@^1.3.1, @radix-ui/react-slot@^1.5.0, @radix-ui/react-tabs@^1.2.1, @radix-ui/react-tooltip@^1.4.1 (+13 more)

### Community 7 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 8 - "package.json"
Cohesion: 0.17
Nodes (11): class-variance-authority@^0.7.1, @radix-ui/react-checkbox@^1.4.1, tsx@^4.23.15, @types/react@^19, name, private, version, class-variance-authority (+3 more)

### Community 10 - "Copiloto de área · Plan técnico del piloto"
Cohesion: 0.18
Nodes (10): Copiloto de área · Plan técnico del piloto, Estado (2026-11-24), Fase 0 · Cimientos (pista A, arranca ahora), Fase 1 · Tablero de indicadores (pista A, con ajuste pendiente de pista B), Fase 2 · Informe semanal (pista A + B, depende de Fase 1), Fase 3 · Buscador de documentos (pista A), Fase 4 · Cierre para la demostración, Principio de secuencia (+2 more)

### Community 11 - "@playwright/test"
Cohesion: 0.20
Nodes (3): @playwright/test@^1.65.1, CIFRAS_COMPARTIDAS, @playwright/test

### Community 12 - "CLAUDE.md · Copiloto de área (piloto del cliente)"
Cohesion: 0.22
Nodes (8): Calidad de código (no negociable), CLAUDE.md · Copiloto de área (piloto del cliente), Cómo trabajar aquí, Estado, graphify, Qué es esto, Reglas no negociables, Stack del PILOTO (lo que se construye ahora) — 100 % Vercel, sin VPS

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

### Community 18 - "cn"
Cohesion: 0.13
Nodes (27): DocumentosPage(), InformesPage(), AccionesDocumentos(), BuscadorDemo(), CitaBoton(), FuenteBoton(), BotonesInforme(), EditorInforme() (+19 more)

### Community 20 - "layout.tsx"
Cohesion: 0.20
Nodes (8): next-themes@^0.4.6, BotonEntrarConGoogle(), EntrarPage(), metadata, RootLayout(), ThemeProvider(), next-themes, react

## Knowledge Gaps
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `drizzle-orm` connect `relaciones.ts` to `package.json`, `cn`, `generar-documentos.ts`?**
  _High betweenness centrality (0.171) - this node is a cross-community bridge._
- **Should `relaciones.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.062409288824383166 - nodes in this community are weakly interconnected._
- **Why does `next` connect `sidebar.tsx` to `cn`, `generar-documentos.ts`, `package.json`, `cn`, `layout.tsx`?**
  _High betweenness centrality (0.085) - this node is a cross-community bridge._
- **Should `cn` be split into smaller, more focused modules?**
  _Cohesion score 0.08251748251748252 - nodes in this community are weakly interconnected._
- **Why does `react` connect `layout.tsx` to `cn`, `sidebar.tsx`, `dependencies`, `package.json`, `cn`?**
  _High betweenness centrality (0.066) - this node is a cross-community bridge._
- **Should `sidebar.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.11411411411411411 - nodes in this community are weakly interconnected._
- **Should `generar-documentos.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06240084611316764 - nodes in this community are weakly interconnected._