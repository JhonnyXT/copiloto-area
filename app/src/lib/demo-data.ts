/**
 * Datos de ejemplo del piloto. TODO lo que se muestra en la interfaz sale de
 * aquí — ninguna cifra se escribe dos veces por separado, para que el
 * principio de "la IA nunca escribe cifras" sea cierto también en el código
 * de la maqueta. Empresa, documentos y cifras: 100% ficticios. Ver PRODUCT.md.
 */

export const area = {
  nombre: "Operaciones",
  usuario: "Carlos",
  rol: "Líder de área",
  semana: 47,
  periodo: "17–23 nov 2026",
  ultimaCarga: "2026-11-22T18:40:00-05:00",
};

export type Estado = "cumple" | "atencion" | "riesgo";

export interface Kpi {
  slug: string;
  nombre: string;
  valor: number;
  unidad: string;
  meta: number;
  comparacion: "mayor-mejor" | "menor-mejor";
  estado: Estado;
  variacion: number; // puntos porcentuales vs. semana anterior
  serie: number[]; // últimas 12 semanas
  fuente: { archivo: string; hoja: string; cargado: string };
}

export const kpis: Kpi[] = [
  {
    slug: "produccion",
    nombre: "Producción de oro",
    valor: 1284,
    unidad: "oz",
    meta: 1250,
    comparacion: "mayor-mejor",
    estado: "cumple",
    variacion: 2.7,
    serie: [1180, 1215, 1190, 1240, 1260, 1225, 1275, 1300, 1255, 1290, 1310, 1284],
    fuente: { archivo: "indicadores_s47_ejemplo.xlsx", hoja: "Producción", cargado: "2026-11-22T18:40:00-05:00" },
  },
  {
    slug: "costo-onza",
    nombre: "Costo por onza",
    valor: 1142,
    unidad: "USD/oz",
    meta: 1100,
    comparacion: "menor-mejor",
    estado: "riesgo",
    variacion: 3.8,
    serie: [1068, 1075, 1060, 1082, 1090, 1071, 1085, 1098, 1104, 1092, 1088, 1142],
    fuente: { archivo: "indicadores_s47_ejemplo.xlsx", hoja: "Costos", cargado: "2026-11-22T18:40:00-05:00" },
  },
  {
    slug: "seguridad",
    nombre: "Accidentes incapacitantes",
    valor: 0,
    unidad: "eventos",
    meta: 0,
    comparacion: "menor-mejor",
    estado: "cumple",
    variacion: 0,
    serie: [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    fuente: { archivo: "seguridad_s47_ejemplo.xlsx", hoja: "Eventos", cargado: "2026-11-22T18:40:00-05:00" },
  },
  {
    slug: "mantenimiento",
    nombre: "Mantenimiento preventivo",
    valor: 88,
    unidad: "%",
    meta: 95,
    comparacion: "mayor-mejor",
    estado: "atencion",
    variacion: -7,
    serie: [96, 94, 93, 95, 97, 94, 92, 95, 93, 90, 91, 88],
    fuente: { archivo: "mantenimiento_s47_ejemplo.xlsx", hoja: "Órdenes", cargado: "2026-11-21T09:10:00-05:00" },
  },
];

export const costoDesglose = [
  { nombre: "Energía", valor: 312, variacion: 9.1, tendencia: "sube" as const },
  { nombre: "Personal", valor: 298, variacion: 1.7, tendencia: "sube" as const },
  { nombre: "Mantenimiento", valor: 236, variacion: 4.4, tendencia: "sube" as const },
  { nombre: "Insumos y explosivos", valor: 184, variacion: -2.1, tendencia: "baja" as const },
  { nombre: "Otros", valor: 112, variacion: 4.7, tendencia: "sube" as const },
];

export const indicadoresOtrasAreas = [
  {
    nombre: "Producción total",
    area: "Compañía",
    valor: "3.130 oz",
    variacion: 1.4,
    relacion: "Tu área aporta el 41 %",
  },
  {
    nombre: "Tarifa de energía",
    area: "Servicios",
    valor: "0,142 USD/kWh",
    variacion: 6.0,
    relacion: "Pesa el 27 % de tu costo por onza",
  },
  {
    nombre: "Índice de frecuencia de accidentes",
    area: "Seguridad (compañía)",
    valor: "1,8",
    variacion: -0.2,
    relacion: "Tu área está en 0,9",
  },
  {
    nombre: "Disponibilidad de equipos",
    area: "Mantenimiento",
    valor: "91 %",
    variacion: -2,
    relacion: "Explica 6 órdenes reprogramadas",
  },
];

export const loQueCambio = [
  {
    tipo: "riesgo" as const,
    texto: "El costo por onza quedó 3,8 % sobre la meta, sobre todo por energía (+9,1 % frente a la semana anterior).",
    link: "/indicadores/costo-onza",
  },
  {
    tipo: "atencion" as const,
    texto: "El mantenimiento preventivo quedó en 88 %: se reprogramaron 6 órdenes.",
    link: "/indicadores/mantenimiento",
  },
  {
    tipo: "cumple" as const,
    texto: "La producción superó la meta por tercera semana seguida.",
    link: "/indicadores/produccion",
  },
  {
    tipo: "info" as const,
    texto: "Llegó el reporte de seguridad de la compañía: índice de frecuencia 1,8 (tu área, 0,9).",
    link: null,
  },
];

export const informeSemanal = {
  semana: 47,
  generado: "2026-11-23T07:12:00-05:00",
  editado: "hace 3 minutos",
  secciones: [
    {
      id: "resumen",
      titulo: "Resumen de la semana",
      activo: true,
      html: `La producción del área cerró en <mark data-cifra>1.284 oz</mark>, <mark data-cifra>2,7 %</mark> por encima de la meta, y es la tercera semana seguida sobre la meta. El área aportó el <mark data-cifra>41 %</mark> de la producción de la compañía.`,
    },
    {
      id: "costos",
      titulo: "Costos",
      activo: true,
      html: `El costo por onza fue de <mark data-cifra>1.142 USD/oz</mark>, <mark data-cifra>3,8 %</mark> por encima de la meta de <mark data-cifra>1.100 USD/oz</mark>. La mayor variación está en energía, que subió <mark data-cifra>9,1 %</mark> frente a la semana anterior, en línea con el aumento de tarifa que reportó Servicios.`,
    },
    {
      id: "seguridad",
      titulo: "Seguridad",
      activo: true,
      html: `No hubo accidentes incapacitantes; el área completa <mark data-cifra>142 días</mark> sin ellos. El índice de frecuencia del área es <mark data-cifra>0,9</mark>, frente a <mark data-cifra>1,8</mark> de la compañía.`,
    },
    {
      id: "mantenimiento",
      titulo: "Mantenimiento",
      activo: true,
      html: `El cumplimiento del mantenimiento preventivo fue de <mark data-cifra>88 %</mark>, frente a una meta de <mark data-cifra>95 %</mark>. Se reprogramaron <mark data-cifra>6 órdenes</mark> por baja disponibilidad de equipos.`,
    },
    {
      id: "otras-areas",
      titulo: "Indicadores de otras áreas",
      activo: false,
      html: `La tarifa de energía de Servicios subió <mark data-cifra>6,0 %</mark> y explica buena parte del aumento en costo por onza.`,
    },
  ],
  cifrasVerificadas: 13,
  cifrasTotal: 13,
};

export interface DocCita {
  id: string;
  documento: string;
  codigo: string;
  pagina: number;
  totalPaginas: number;
  cargado: string;
  extracto: { antes?: string; resaltado: string; despues?: string }[];
}

export interface PreguntaDemo {
  id: string;
  pregunta: string;
  respuesta: { texto: string; citas: string[] }[] | null; // null => no encontrada
  sugerenciaNoEncontrada?: { documento: string; pagina: number };
  citas: DocCita[];
}

export const preguntasDemo: PreguntaDemo[] = [
  {
    id: "ventilacion",
    pregunta: "¿Qué hay que hacer si el sensor de gases de un frente marca por encima del límite?",
    respuesta: [
      {
        texto: "Según el procedimiento de ventilación, hay que suspender la actividad en el frente, llevar al personal a la estación de aire fresco más cercana y avisar al supervisor de turno.",
        citas: ["pr-ven-014"],
      },
      {
        texto: "La actividad solo se reanuda cuando dos mediciones seguidas, con 15 minutos de diferencia, estén por debajo del límite. El evento se registra en el formato de reporte de incidentes dentro de las 24 horas siguientes.",
        citas: ["pr-ven-014", "in-rep-003"],
      },
    ],
    citas: [
      {
        id: "pr-ven-014",
        documento: "Procedimiento de ventilación (ejemplo)",
        codigo: "PR-VEN-014",
        pagina: 7,
        totalPaginas: 18,
        cargado: "2026-11-14T00:00:00-05:00",
        extracto: [
          {
            resaltado: "se suspenderá de inmediato la actividad en el frente y el personal se dirigirá a la estación de aire fresco más cercana",
            despues: ", informando al supervisor de turno.",
          },
          {
            resaltado: "La reanudación de labores requiere dos mediciones consecutivas, con un intervalo de quince minutos, por debajo del límite.",
          },
        ],
      },
      {
        id: "in-rep-003",
        documento: "Instructivo de reporte de incidentes (ejemplo)",
        codigo: "IN-REP-003",
        pagina: 3,
        totalPaginas: 9,
        cargado: "2026-11-10T00:00:00-05:00",
        extracto: [
          {
            resaltado: "Todo evento de ventilación o exposición se registra en el formato de reporte dentro de las 24 horas siguientes al evento.",
          },
        ],
      },
    ],
  },
  {
    id: "capacitacion",
    pregunta: "¿Cuánto se aprobó para capacitación en 2027?",
    respuesta: null,
    sugerenciaNoEncontrada: { documento: "Plan de formación 2026 (ejemplo)", pagina: 2 },
    citas: [],
  },
];
