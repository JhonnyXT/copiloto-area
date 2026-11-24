# DESIGN.md · Copiloto de área (nombre del producto por definir)

Guía visual del producto, **versión 2** (23 nov 2026). La leen Jonathan y los subagentes antes de
construir cualquier pantalla. Componentes base: **shadcn/ui + Tailwind**. Los tokens de abajo se
vuelven variables CSS del tema. Referencia viva: el lienzo de maquetas en Claude
(https://claude.ai/artifact/UL81vfeUS7SbS29t4CZtLY), donde cada pantalla funciona en Play.

## 1. Tema y atmósfera
- Debe transmitir **confianza y control**: una herramienta de trabajo para un líder de área de una
  empresa minera, que también se le muestra a un gerente general (a veces proyectada en una sala).
- **Sobrio y preciso**, en la línea de las herramientas de trabajo serias (Linear, Vercel, Stripe):
  mucho aire, superficies planas, líneas finas, color solo donde comunica algo.
- **Claro por defecto**, con modo oscuro real elegible por el usuario (control "Apariencia" en la
  barra lateral; en celular, botón de sol/luna). Ambos temas usan los mismos roles de color.
- El producto es **de Joblan**. No imitar la marca, el logo ni los colores de ninguna empresa real.

## 2. Paleta (contraste verificado con WCAG 2.1)

| Rol | Token | Claro | Oscuro | Contraste (claro / oscuro) |
|---|---|---|---|---|
| Fondo de la app | `--bg` | `#F7F8FA` | `#0D1117` | — |
| Superficie | `--surface` | `#FFFFFF` | `#151B23` | — |
| Superficie 2 (encabezados de tabla, hover, barras de herramientas) | `--surface-2` | `#F9FAFB` | `#1A212B` | — |
| Borde | `--border` | `#E5E7EB` | `#262E38` | — |
| Borde fuerte (botones secundarios, separadores) | `--border-strong` | `#D1D5DB` | `#333D49` | — |
| Texto principal | `--fg` | `#111827` | `#E6EAF0` | 17,7 / 14,3 |
| Texto secundario | `--fg-2` | `#4B5563` | `#A8B3C1` | 7,1 / 8,2 |
| Texto terciario (fechas, ejes, ayudas) | `--fg-3` | `#6B7280` | `#8B96A5` | 4,6 / 5,4 (peor caso) |
| Principal | `--primary` | `#1D4E89` | `#7AA7E0` | 8,4 / 7,0 |
| Texto sobre principal | `--on-primary` | `#FFFFFF` | `#0D1117` | 8,4 / 7,6 |
| Principal suave (chips, citas, avatar) | `--primary-soft` / `-fg` | `#EBF1F8` / `#1D4E89` | `#18273A` / `#A9C7EE` | 7,4 / 8,7 |
| Selección (pestaña de KPI, fuente activa) | `--sel` | `#F3F7FC` | `#172231` | — |
| En meta | `--ok-soft` / `--ok-fg` / `--ok` (barras) | `#ECFDF3` / `#067647` / `#12B76A` | `#0F2A1B` / `#4ADE80` / `#4ADE80` | 5,4 / 8,8 |
| Atención | `--warn-soft` / `--warn-fg` / `--warn` | `#FFFAEB` / `#B54708` / `#F79009` | `#2B2112` / `#F5B94A` / `#F5B94A` | 5,2 / 9,0 |
| En riesgo | `--risk-soft` / `--risk-fg` / `--risk` | `#FEF3F2` / `#B42318` / `#F04438` | `#2D1614` / `#F97066` / `#F97066` | 6,1 / 6,1 |
| Franja "Datos de ejemplo" | `--banner-bg` / `--banner-fg` | `#FEF3C7` / `#92400E` | `#2B2112` / `#F5B94A` | 6,4 / 9,0 |
| Línea de meta en gráficos | `--target` | `#7D8798` | `#717C8A` | 3,6 / 4,1 (≥ 3:1 para gráficos) |
| Cuadrícula y pista de barras | `--grid` / `--track` | `#EEF0F3` | `#212934` | — |

Regla: **un solo color de acción (azul)**. Verde, ámbar y rojo solo significan estado
(en meta / atención / en riesgo), siempre con icono y texto. El ámbar de marca solo aparece en la
franja de datos de ejemplo.

## 3. Tipografía
- **Inter** para todo (decisión registrada: herramienta de trabajo, legibilidad > personalidad).
  Números siempre con `font-variant-numeric: tabular-nums`. Sin fuentes monoespaciadas.
- Escala (px / peso / interlineado):
  - Título de página: 24 / 600 / 1,25, `letter-spacing: -0.015em`.
  - Título de sección o tarjeta: 15 / 600.
  - Cifra de KPI: 28 / 600 / 1,1, `letter-spacing: -0.02em`; unidad al lado en 13 / 400, `--fg-3`.
  - Cuerpo: 14 / 400 / 1,5. Texto secundario: 13. Etiquetas y ejes: 12 / 500. Ejes de gráfico: 11.
  - Encabezados de tabla: 12 / 500 en **minúscula normal** (sin mayúsculas ni tracking).
  - Documento del informe: 15 / 1,7, ancho máximo 720 px; títulos de sección 17 / 600.
- Todo título va en minúscula normal ("Requiere tu atención", no "REQUIERE TU ATENCIÓN"). Sin
  etiquetas pequeñas encima de los títulos.

## 4. Componentes
**Regla de contención:** superficies **planas + línea fina** (`1px solid --border`, radio 12 px)
sin sombra en reposo. La sombra en capas suaves (`--shadow-pop`) es solo para lo que flota:
tooltips, menús, popovers, modales. Radios: 8 px controles · 12 px superficies · píldora para chips.
Espaciado en múltiplos de 4 px.

- **Barra lateral (232 px):** marca (cuadro de 28 px + "Copiloto"), selector de área ("Área de
  Operaciones · Piloto"), grupos "General" (Resumen, Indicadores, Informes, Documentos) y "Datos"
  (Cargas de datos), y abajo "Apariencia" (control segmentado Claro | Oscuro) y la fila del usuario.
  Ítem activo: superficie blanca con anillo de borde e icono en `--primary`.
- **Barra superior (56 px):** ruta (Operaciones › Resumen), botón de búsqueda "Buscar o preguntar a
  tus documentos" con `Ctrl K`, y a la derecha la frescura de los datos ("Datos al 22 nov, 6:40 p. m.").
- **Franja de datos de ejemplo (32 px):** fija arriba, no se puede cerrar.
- **Botones (36 px):** principal (fondo `--primary`), secundario (superficie + `--border-strong`),
  fantasma (sin fondo). **Un solo botón principal por pantalla.** Deshabilitado: 45 % de opacidad.
- **Chip de estado:** 22 px, fondo suave + texto del mismo rol + icono SVG (check · círculo con
  exclamación · flecha arriba). Textos: "En meta", "Atención", "En riesgo".
- **Franja de indicadores (patrón principal de Resumen):** una sola superficie dividida en 4 celdas
  con líneas de 1 px. Cada celda: nombre + chip de estado, cifra + unidad, **barra de avance contra
  la meta** (relleno del color del estado + marca vertical en la meta) y una línea de contexto. Las
  celdas son **pestañas**: la seleccionada (fondo `--sel`, nombre en azul) decide qué muestra el
  gráfico de abajo.
- **Gráfico de tendencia:** línea de 2 px + área con degradado (14 % → 0 %), cuadrícula de 4 líneas,
  meta punteada `--target`, punto en el último valor, eje Y con 4 marcas. Al pasar el cursor: línea
  guía, punto y tooltip con semana, valor y diferencia con la meta (verde o roja según convenga).
- **Lista "Requiere tu atención":** icono de estado en cuadro de 28 px, título en negrita con la
  cifra, una línea de explicación y un enlace de acción con flecha ("Ver análisis →").
- **Tablas:** encabezado en `--surface-2`, celdas de 12 × 16 px, cifras a la derecha, cambio con
  flecha SVG + texto coloreado según si es bueno o malo para el área (no según si sube o baja).
- **Informe:** barra de herramientas tipo documento con "Insertar cifra" (las cifras solo entran
  desde los datos); cifras resaltadas con fondo azul suave y subrayado punteado, con tooltip de
  origen; panel lateral con pasos de revisión (Redactado → Revisado por ti → Exportado), contador
  de cifras verificadas e interruptores para incluir u ocultar secciones.
- **Buscador:** pregunta del usuario en burbuja neutra (superficie + borde, no azul); respuesta con
  citas numeradas en línea; lista de fuentes clicables; visor del documento a la derecha con la
  página y los pasajes resaltados. Caso "No encontré esto en tus documentos" con la fuente más
  cercana marcada como "relacionado, no responde la pregunta".

## 5. Distribución
- **Escritorio (≥ 1024 px):** barra lateral 232 px; contenido con ancho máximo de 1200 px
  (1280 en Documentos), márgenes de 28 px y separación de 24 px entre bloques.
- **Resumen:** título + semana (con flechas anterior/siguiente; siguiente deshabilitada en la
  semana actual) y "Generar informe semanal" → una frase de estado con chips (2 en meta · 1
  atención · 1 en riesgo) → franja de indicadores → gráfico (2/3) + "Requiere tu atención" (1/3) →
  tabla de indicadores de otras áreas.
- **Detalle de indicador:** título + chip + definición → franja de cifras clave (semana, meta,
  semana anterior, promedio) → tendencia con 12/26 semanas → "Qué explica el cambio" (aporte de
  cada componente) + "Composición" → "Indicadores relacionados" + "De dónde sale esta cifra".
- **Celular (< 768 px):** pestañas inferiores (Resumen, Indicadores, Informes, Documentos);
  indicadores como lista de filas con barra de avance; botón principal fijo sobre las pestañas;
  objetivos táctiles ≥ 44 px; campos de texto de 16 px para que iOS no haga zoom.

## 6. Se hace / no se hace
- ✅ Toda cifra muestra **unidad, periodo y meta**, y se puede ver **de dónde sale**.
- ✅ Toda respuesta del buscador trae **cita** (documento y página) o dice que no lo encontró.
- ✅ El texto redactado por IA se marca como borrador hasta que el usuario lo revisa.
- ✅ Español claro en segunda persona; fechas `22 nov 2026`; miles con punto y decimales con coma.
- ✅ Estados vacíos útiles, foco visible (2 px `--ring`), teclado completo, `prefers-reduced-motion`.
- ❌ La IA nunca escribe cifras.
- ❌ Sin emojis ni caracteres de texto como iconos (✓ ▲ !): solo iconos SVG de trazo 1,75.
- ❌ Sin robots, chispas, neón, degradados decorativos, vidrio ni sombras duras.
- ❌ Sin tarjetas iguales de "icono + título + texto" como estructura, sin barras de color a un
  lado de una tarjeta, sin etiquetas encima de los títulos.
- ❌ Ningún estado se comunica solo con el color.
- ❌ Ningún dato real de clientes en maquetas, capturas ni demos.
