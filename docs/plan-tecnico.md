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
- [x] **Neon Postgres + pgvector** provisionado y conectado (extensión 0.8.7 habilitada).
- [x] **Vercel Blob** privado provisionado y conectado (`copiloto-area-files`).
- [x] `vercel env pull` hecho (`app/.env.local`, no se sube al repo).
- [ ] Dominio: `copiloto.joblanstudio.com` apuntando al proyecto de Vercel (DNS en Cloudflare, pero
  solo el registro CNAME/A hacia Vercel — sin proxy naranja ni R2, eso es del sistema propio).

**Frontend (Next.js, en `app/`)**
- [x] Traducido el diseño v2 del lienzo a código real: layout (barra lateral, barra superior con
  buscador y selector de tema compacto en celular, franja de datos de ejemplo), tema claro/oscuro
  con `next-themes` (persiste y funciona en escritorio y celular), componentes base (chip de
  estado, botón, gráfico de tendencia con tooltip interactivo, franja de indicadores con pestañas,
  barra de avance contra la meta).
- [x] Las 4 pantallas: Resumen, Detalle de indicador (con desglose de costo y selector 12/26
  semanas), Informe (secciones que se activan/desactivan de verdad, cifras resaltadas con su
  origen), Documentos (citas que abren el documento en la página exacta, caso "no encontré esto").
- [x] `lib/demo-data.ts` es la única fuente de las cifras de ejemplo.
- [x] Pruebas con Playwright (`npx playwright test`, 25 pasan, 1 se salta a propósito en celular):
  carga de cada pantalla, navegación, tema persiste tras recargar, pestaña de indicador cambia el
  gráfico, interruptores del informe recalculan las cifras verificadas, cita del buscador abre el
  documento en la página correcta, caso sin respuesta.
- [ ] Desplegar a Vercel (preview).

**Esquema de base de datos** — hecho, ver `app/src/db/schema/` y el commit "Esquema de base de
datos (Drizzle), en español, aplicado a Neon". 10 tablas, migración aplicada, índice HNSW creado.

**Auth** — hecho y probado con un login real con Google (local, puerto 3141).
- [x] Better Auth **dentro de Next.js** (Route Handlers en `/api/auth/[...all]`, sin servidor Hono
  aparte), con la tabla `usuarios`/`sesiones`/`cuentas_oauth`/`verificaciones` ya en español
  (`src/lib/auth.ts` mapea cada campo).
- [x] Lista cerrada de correos permitidos vía `CORREOS_PERMITIDOS` (variable de entorno) — el que no
  esté ahí, el login se rechaza aunque tenga una cuenta de Google válida.
- [x] `src/proxy.ts` protege todas las páginas salvo `/entrar`; página de login en `/entrar`.
- [x] Credenciales de OAuth de Google creadas (proyecto `copiloto-area` en Google Cloud Console,
  cuenta `joblanstudio@gmail.com`) y verificadas con un login real.
- [ ] **Pendiente antes de desplegar a Vercel:** agregar el URI de redirección de producción en
  Google Cloud Console (`https://<dominio-del-proyecto>/api/auth/callback/google`) y poner
  `GOOGLE_CLIENT_ID`/`GOOGLE_CLIENT_SECRET`/`BETTER_AUTH_SECRET`/`CORREOS_PERMITIDOS` en las
  variables de entorno de Vercel. Mientras la pantalla de consentimiento de Google siga en modo
  "Pruebas", solo entran los correos que estén agregados ahí como "usuarios de prueba".

**Generador de datos ficticios**
- [x] `app/scripts/sembrar-datos-ficticios.ts` (`npm run seed` en `app/`) carga en Neon 60 semanas
  (~14 meses) de los 4 indicadores (producción, costo, seguridad, mantenimiento), generadas de forma
  determinística y coherentes entre sí (el costo por onza sube cuando sube una tarifa de energía
  simulada), más 13 documentos de ejemplo (152 páginas) con contenido de procedimientos mineros
  genéricos. El script es idempotente: se puede volver a correr sin duplicar datos.
- [x] De ahí salen 13 preguntas con respuesta conocida para evaluar el buscador, en
  `docs/preguntas-buscador-evaluacion.md` (sección 11 de `CONTEXTO.md` pedía ~15; quedan pendientes
  2-3 más si se amplía el banco de temas).
- [ ] **Pendiente para Fase 3:** el `embedding` de cada fragmento quedó en `null` — generarlo requiere
  `GEMINI_API_KEY`, que todavía no está configurada. El buscador real no puede activarse sin ese paso.

**Criterio de "fase 0 terminada":** el frontend con las 4 pantallas corre en Vercel con datos
ficticios, Neon tiene el esquema de base de datos creado y responde, y el generador de datos
ficticios ya cargó indicadores/mediciones/documentos reales en Neon (el frontend sigue leyendo
`lib/demo-data.ts` hasta la Fase 1, que lo conecta a estas tablas).

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
