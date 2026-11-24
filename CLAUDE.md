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
