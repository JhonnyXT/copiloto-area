# CLAUDE.md · Copiloto de área (piloto del cliente)

Contexto permanente de este proyecto. Lee también `CONTEXTO.md` (confidencial: no sale de este
repo), `PRODUCT.md`, `docs/DESIGN.md` y `docs/plan-tecnico.md` antes de trabajar aquí.

## Qué es esto
Piloto gratuito (portafolio de Joblan) para el cliente, líder de un área de minería. Tres módulos:
tablero de indicadores, informe semanal en un clic, buscador de documentos con citas. **Todo el
contenido es ficticio** — ningún dato real de la empresa entra nunca a este repo, a prompts, ni a código.

## Reglas no negociables
- **La IA nunca escribe cifras.** Las calcula el sistema; la IA solo redacta texto alrededor de
  marcadores que el código reemplaza.
- **Toda respuesta del buscador cita su fuente** (documento + página) o dice que no la encontró.
- **La franja "Datos de ejemplo" va siempre visible**, sin botón para cerrarla.
- **Nunca** datos reales de su empresa en código, commits, capturas o conversación con la IA.
- **`E2E_BYPASS_AUTH` nunca va en Vercel ni en ningún `.env` desplegado.** Es solo para que
  Playwright pruebe páginas protegidas sin poder hacer el login real con Google — ver
  `app/src/proxy.ts` y `app/playwright.config.ts`.

## Stack del PILOTO (lo que se construye ahora) — 100 % Vercel, sin VPS
- Frontend + backend: Next.js (App Router) + TypeScript + Tailwind + shadcn/ui, en `app/`, todo
  desplegado en Vercel. Backend como Route Handlers / Server Actions del mismo proyecto — **no hay
  servidor Hono aparte ni VPS para el piloto**. `next-themes` para claro/oscuro.
- Base de datos: Postgres + pgvector administrado por **Neon** (Marketplace de Vercel).
- Archivos: **Vercel Blob**.
- Auth: Better Auth dentro de Next.js, login con Google.
- Pruebas end-to-end: Playwright.

El VPS Contabo + Hono + Cloudflare (`CONTEXTO.md` §7-ter) es la arquitectura del **sistema propio**,
solo si el cliente confirma que lo quiere y lo paga. No se toca para el piloto.

## Calidad de código (no negociable)
- **Código limpio y legible por sí mismo.** Nombres (de variables, funciones, archivos) que dicen
  qué hacen; funciones cortas con una sola responsabilidad; sin anidamientos ni condicionales
  innecesarios.
- **Clean Architecture / separación de capas:** UI (componentes) no conoce la base de datos
  directamente; el esquema (`src/db/schema`) no conoce la UI; `lib/` son utilidades puras sin
  estado de React. Un módulo se reemplaza sin tocar los demás (ver `src/lib/demo-data.ts`, pensado
  para cambiarse entero por consultas reales sin tocar las pantallas).
- **Principios SOLID** al diseñar funciones y componentes: una razón para cambiar por pieza,
  extensión sin modificar lo existente, interfaces pequeñas y específicas.
- **Sin comentarios explicativos de "qué hace" el código** — si hace falta un comentario para
  explicar qué hace una línea, se reescribe esa línea (mejor nombre, función más chica) en vez de
  comentarla. **Única excepción:** una nota corta y puntual sobre algo que el código no puede decir
  por sí mismo — un comportamiento no obvio de una librería externa, un requisito de seguridad, o
  una decisión que alguien podría deshacer por error sin saber por qué existe. Esas excepciones
  deben ser pocas y cortas, nunca narrar el código línea por línea.
- Antes de agregar código nuevo, revisar que siga este mismo criterio que el resto del proyecto.

## Cómo trabajar aquí
- El diseño vive primero en el lienzo de Claude (Artifact) antes que en código; `docs/DESIGN.md` es
  la fuente escrita una vez que el diseño se aprueba ahí.
- Subagentes en paralelo solo después de cerrar el esquema de base de datos (ver
  `docs/plan-tecnico.md`), cada uno en su propio worktree.
- Revisión de seguridad (`/security-review`) antes de integrar cada módulo.
- Nada se entrega sin que Jonathan lo revise y pruebe.

## Estado
Ver "Próximos pasos" en `docs/plan-tecnico.md`. Esperando respuestas del cliente (indicadores reales,
formato de su informe) y la IP del VPS de Contabo; eso no bloquea construir el frontend con datos
de ejemplo.
