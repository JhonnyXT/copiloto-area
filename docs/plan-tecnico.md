# Copiloto de área · Plan técnico del piloto

Referencia: `CONTEXTO.md` (arquitectura y decisiones), `PRODUCT.md` (producto), `docs/DESIGN.md`
(diseño v2), `docs/plan-negocio.md` (lo comercial). Este documento ordena **cómo se construye**.

## Principio de secuencia

Dos pistas en paralelo:

- **A. No depende del cliente** — empieza ya: cimientos técnicos, datos ficticios, las pantallas ya
  diseñadas y aprobadas.
- **B. Depende de sus respuestas** — nombres reales de sus 5-6 indicadores, cómo arma hoy el
  informe, qué herramientas usa la empresa. Se ajusta cuando conteste; no bloquea la pista A porque
  los datos ficticios ya están modelados sobre su caso (minería, costo por onza, seguridad,
  mantenimiento) y la estructura del informe es genérica.

**⚠️ El piloto es 100 % Vercel, no el VPS.** El VPS de Contabo y la arquitectura Hono/Caddy/
Cloudflare (`CONTEXTO.md` §7-ter) son del **sistema propio**, solo si el cliente confirma y paga. El
piloto corre entero en Vercel: Next.js + Server Actions/Route Handlers (sin Hono separado),
Postgres+pgvector administrado (Neon, vía Marketplace de Vercel) y Vercel Blob para archivos. Nada
que instalar en un servidor, nada de Caddy ni Cloudflare proxy.

## Fase 0 · Cimientos (pista A, arranca ahora)

**Repositorio y contexto**
- [x] `git init`, primer commit, repositorio público en GitHub (portafolio de Joblan; sin
  `CONTEXTO.md`, `PRODUCT.md` ni `docs/plan-negocio.md` — esos quedan solo en esta máquina).
- [x] `CLAUDE.md` del proyecto.
- [ ] `.env.example` con las variables que va a necesitar el proyecto (sin valores reales).

**Infraestructura Vercel (reemplaza al VPS para el piloto)**
- [x] Proyecto Vercel enlazado (`copiloto-area-ferney`).
- [ ] **Neon Postgres + pgvector**, vía `vercel install neon` (Marketplace) — requiere que Jonathan
  confirme el aprovisionamiento (crea una cuenta/recurso externo real, no algo que se haga sin su
  visto bueno).
- [ ] **Vercel Blob**, vía `vercel storage create --type blob` — para Excel/CSV subidos y los PDFs
  de ejemplo.
- [ ] `vercel env pull` para traer las variables al proyecto local.
- [ ] Dominio: `copiloto.joblanstudio.com` apuntando al proyecto de Vercel (DNS en Cloudflare, pero
  solo el registro CNAME/A hacia Vercel — sin proxy naranja ni R2, eso es del sistema propio).

**Frontend (Next.js, en `app/`)**
- [ ] Traducir las 7 pantallas del lienzo aprobado a código real: layout (barra lateral, barra
  superior, franja de datos de ejemplo), tema claro/oscuro con `next-themes`, los componentes base
  (tarjeta, chip de estado, botón, gráfico de tendencia con tooltip, franja de indicadores).
- [ ] Capa de datos de ejemplo en código (`lib/demo-data.ts`), una sola fuente de verdad para que
  ninguna cifra se escriba dos veces distinto — ya tengo un primer borrador de la sesión anterior,
  se revisa contra el diseño v2.
- [ ] Pruebas con Playwright: carga de cada pantalla, el selector de tema persiste, la pestaña de
  indicador cambia el gráfico, los interruptores de sección del informe funcionan, una cita del
  buscador abre el documento en la página correcta.
- [ ] Desplegar a Vercel (preview) para que se pueda ver desde cualquier lado.

**Esquema de base de datos (bloquea el trabajo en paralelo de la Fase 1-3 — se define antes)**
- [ ] Tablas: `indicadores`, `mediciones` (valor + periodo + meta), `documentos`,
  `fragmentos_documento` (con su vector pgvector), `informes`, `auditoria`. `usuarios` con un solo
  registro (el cliente) por ahora.
- [ ] `org_id` en cada tabla desde el día 1 aunque el piloto tenga una sola organización — así el
  esquema se reutiliza si el sistema propio necesita multiusuario después.
- [ ] Drizzle ORM (`drizzle-orm/neon-http`) + migraciones versionadas.

**Auth**
- [ ] Better Auth **dentro de Next.js** (Route Handlers, sin servidor Hono aparte), login con
  Google, sesiones en la misma base de Neon.
- [ ] Lista cerrada de correos permitidos (solo el cliente y Jonathan al inicio).

**Generador de datos ficticios**
- [ ] Script que genera 12-18 meses de indicadores (producción, costo, seguridad, mantenimiento) de
  una empresa minera inventada, coherentes entre sí (el costo sube cuando sube la energía, etc.),
  más 15-20 documentos PDF de ejemplo con contenido real de procedimientos mineros genéricos.
- [ ] De aquí salen las ~15 preguntas con respuesta conocida para probar el buscador (sección 11 de
  `CONTEXTO.md`).

**Criterio de "fase 0 terminada":** el frontend con las 4 pantallas corre en Vercel con datos
ficticios, Neon tiene el esquema de base de datos creado y responde, y hay un generador de datos
ficticios completo listo para cargar.

## Fase 1 · Tablero de indicadores (pista A, con ajuste pendiente de pista B)
- Endpoint de carga de Excel/CSV (worker), validación con Zod, cálculo de tendencia y cumplimiento
  **en código, nunca en la IA**.
- Conectar el frontend ya construido a la API real (hoy consume datos de ejemplo locales).
- Pruebas unitarias de cada cálculo (cumplimiento, variación semana a semana, aporte al total).
- **Ajuste pendiente del cliente:** nombres y metas reales de sus indicadores (hoy: producción, costo
  por onza, seguridad, mantenimiento, como ejemplo representativo).

## Fase 2 · Informe semanal (pista A + B, depende de Fase 1)
- La IA redacta con marcadores (`{{costo_por_onza}}`); el código los reemplaza por la cifra real.
- Prueba automática: cada cifra del informe coincide con la base de datos.
- Exportación a PDF y Word.
- **Ajuste pendiente del cliente:** formato actual de su informe (secciones, a quién se lo envía).

## Fase 3 · Buscador de documentos (pista A)
- Ingesta de PDF → texto por página → fragmentos con embeddings (pgvector).
- Búsqueda híbrida (texto + significado), respuesta con cita (documento + página) o "no lo encontré".
- Evaluación con las ~15 preguntas de la Fase 0: no debe inventar, debe citar la página correcta.

## Fase 4 · Cierre para la demostración
- `/security-review` + lista OWASP de `CONTEXTO.md` sección 10.
- Monitoreo de caídas y errores, límite de gasto de IA.
- Guion de demostración + medición de "antes vs. después" (tiempo del informe, tiempo de búsqueda).

## Subagentes
Nada en paralelo hasta cerrar el esquema de base de datos (Fase 0). Después: Fase 1 (tablero) y
Fase 3 (buscador) en paralelo, cada uno en su worktree; Fase 2 (informe) depende de Fase 1 y va
después. Revisor de seguridad por módulo antes de integrar.

## Estado (2026-11-24)
- [x] Vercel Blob (privado, `copiloto-area-files`) aprovisionado y conectado al proyecto.
- [x] Repositorio público en GitHub (portafolio de Joblan), sin `CONTEXTO.md`/`PRODUCT.md`/
  `docs/plan-negocio.md` ni el nombre real del cliente en ningún archivo subido.
- [x] Neon Postgres provisionado y conectado (`copiloto-area-db`); extensión `pgvector` 0.8.7
  habilitada; variables traídas a `app/.env.local` (no se sube al repo).
- [ ] Siguiente: esquema de base de datos (Drizzle), traducir las 7 pantallas del diseño v2 a
  código real, generador de datos ficticios, Playwright.

## Qué necesito de Jonathan ahora
1. Reenviar las respuestas del cliente en cuanto lleguen (no bloquea lo de abajo).
2. El VPS de Contabo **ya no es parte del piloto** — queda para cuando el cliente confirme el
   sistema propio. Si ya lo compraste, puede quedar libre para otro proyecto pequeño mientras tanto.
