// Datos de ejemplo de los módulos que todavía no leen de la base de datos.
export const area = {
  nombre: "Operaciones",
  usuario: "Carlos",
  rol: "Líder de área",
};

export const accesosIndicadores = [
  { slug: "produccion", nombre: "Producción de oro" },
  { slug: "costo-onza", nombre: "Costo por onza" },
  { slug: "seguridad", nombre: "Accidentes incapacitantes" },
  { slug: "mantenimiento", nombre: "Mantenimiento preventivo" },
];

export const costoDesglose = {
  explicacion: [
    { nombre: "Energía", puntos: 26 },
    { nombre: "Mantenimiento", puntos: 10 },
    { nombre: "Personal", puntos: 5 },
    { nombre: "Otros", puntos: 5 },
    { nombre: "Insumos y explosivos", puntos: -4 },
  ],
  energiaExplicaPct: 62,
  partes: [
    { nombre: "Energía", valor: 312 },
    { nombre: "Personal", valor: 298 },
    { nombre: "Mantenimiento", valor: 236 },
    { nombre: "Insumos y explosivos", valor: 184 },
    { nombre: "Otros", valor: 112 },
  ],
  relacionados: [
    { nombre: "Tarifa de energía", area: "Servicios", valor: "+6,0 %", bueno: false, nota: "Explica la mayor parte del aumento." },
    { nombre: "Disponibilidad de equipos", area: "Mantenimiento", valor: "91 %", bueno: false, nota: "Más correctivos, menos preventivo." },
    { nombre: "Producción de oro", area: "Tu área", valor: "1.284 oz", bueno: true, nota: "Más onzas reparten mejor el costo fijo." },
  ],
};

export const indicadoresOtrasAreas = [
  { nombre: "Producción total", area: "Compañía", valor: "3.130 oz", delta: "1,4 %", arriba: true, bueno: true, recibido: "22 nov" },
  { nombre: "Tarifa de energía", area: "Servicios", valor: "0,142 USD/kWh", delta: "6,0 %", arriba: true, bueno: false, recibido: "21 nov" },
  { nombre: "Frecuencia de accidentes", area: "Seguridad", valor: "1,8", delta: "0,2", arriba: false, bueno: true, recibido: "22 nov" },
  { nombre: "Disponibilidad de equipos", area: "Mantenimiento", valor: "91 %", delta: "2 pts", arriba: false, bueno: false, recibido: "20 nov" },
];

export const informeSemanal = {
  semana: 47,
  generadoEn: "2026-11-23T07:12:00-05:00",
  editadoHace: "hace 3 minutos",
  cifrasTotal: 13,
  secciones: [
    {
      id: "resumen",
      titulo: "Resumen de la semana",
      activaPorDefecto: true,
      cifras: 3,
      parrafos: [
        [
          { texto: "La producción del área cerró en " },
          { cifra: "1.284 oz", origen: "Dato del sistema · indicadores_s47_ejemplo.xlsx" },
          { texto: ", " },
          { cifra: "2,7 %", origen: "Calculado: (1.284 − 1.250) ÷ 1.250" },
          { texto: " por encima de la meta, y suma tres semanas seguidas sobre la meta. El área aportó el " },
          { cifra: "41 %", origen: "Calculado: 1.284 ÷ 3.130" },
          { texto: " de la producción de la compañía." },
        ],
      ],
    },
    {
      id: "costos",
      titulo: "Costos",
      activaPorDefecto: true,
      cifras: 4,
      parrafos: [
        [
          { texto: "El costo por onza fue de " },
          { cifra: "1.142 USD/oz", origen: "Dato del sistema · hoja Costos" },
          { texto: ", " },
          { cifra: "3,8 %", origen: "Calculado: (1.142 − 1.100) ÷ 1.100" },
          { texto: " por encima de la meta de " },
          { cifra: "1.100 USD/oz", origen: "Meta configurada" },
          { texto: ". La mayor variación está en energía, que subió " },
          { cifra: "9,1 %", origen: "Calculado: (312 − 286) ÷ 286" },
          { texto: " frente a la semana anterior, en línea con el aumento de tarifa que reportó Servicios." },
        ],
      ],
    },
    {
      id: "seguridad",
      titulo: "Seguridad",
      activaPorDefecto: true,
      cifras: 3,
      parrafos: [
        [
          { texto: "No hubo accidentes incapacitantes; el área completa " },
          { cifra: "142 días", origen: "Dato del sistema · seguridad_s47_ejemplo.xlsx" },
          { texto: " sin ellos. El índice de frecuencia del área es " },
          { cifra: "0,9", origen: "Dato del sistema" },
          { texto: ", frente a " },
          { cifra: "1,8", origen: "Reporte de Seguridad del 22 nov" },
          { texto: " de la compañía." },
        ],
      ],
    },
    {
      id: "mantenimiento",
      titulo: "Mantenimiento",
      activaPorDefecto: true,
      cifras: 3,
      parrafos: [
        [
          { texto: "El cumplimiento del mantenimiento preventivo fue de " },
          { cifra: "88 %", origen: "Dato del sistema · mantenimiento_s47_ejemplo.xlsx" },
          { texto: ", frente a una meta de " },
          { cifra: "95 %", origen: "Meta configurada" },
          { texto: ". Se reprogramaron " },
          { cifra: "6 órdenes", origen: "Dato del sistema" },
          { texto: " por baja disponibilidad de equipos." },
        ],
      ],
    },
    {
      id: "otras-areas",
      titulo: "Indicadores de otras áreas",
      activaPorDefecto: false,
      cifras: 2,
      parrafos: [
        [
          { texto: "Servicios reportó un aumento de " },
          { cifra: "6,0 %", origen: "Reporte de Servicios del 21 nov" },
          { texto: " en la tarifa de energía, que hoy pesa el " },
          { cifra: "27 %", origen: "Calculado: 312 ÷ 1.142" },
          { texto: " del costo por onza del área." },
        ],
      ],
    },
  ],
  proximosPasos: [
    "Revisar con Servicios el consumo de energía por turno.",
    "Reprogramar las órdenes de mantenimiento pendientes antes del cierre de mes.",
  ],
};

export interface DocCita {
  id: string;
  documento: string;
  codigo: string;
  pagina: number;
  totalPaginas: number;
  cargado: string;
  parrafos: { titulo?: string; resaltado?: string; antes?: string; despues?: string }[];
}

export interface PreguntaDemo {
  id: string;
  pregunta: string;
  respuesta: { texto: string; citas: string[] }[] | null;
  sugerenciaNoEncontrada?: { documento: string; pagina: number };
  citas: DocCita[];
}

export const documentos = {
  total: 24,
  totalPaginas: 612,
  ultimaCarga: "2026-11-14T00:00:00-05:00",
};

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
        parrafos: [
          {
            titulo: "6.3 Actuación ante concentraciones fuera de límite",
            antes: "Cuando el detector portátil o fijo indique una concentración superior al límite permisible, ",
            resaltado: "se suspenderá de inmediato la actividad en el frente y el personal se dirigirá a la estación de aire fresco más cercana",
            despues: ", informando al supervisor de turno.",
          },
          {
            antes: "El supervisor verificará el funcionamiento del sistema de ventilación auxiliar y registrará las lecturas cada cinco minutos en la bitácora del frente.",
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
        parrafos: [
          { titulo: "2. Plazos de reporte", resaltado: "Todo evento de ventilación o exposición se registra en el formato de reporte dentro de las 24 horas siguientes al evento", despues: ", con la firma del supervisor de turno." },
          { antes: "Los eventos con lesión se reportan además a Seguridad de inmediato, por radio o teléfono." },
        ],
      },
    ],
  },
  {
    id: "capacitacion",
    pregunta: "¿Cuánto se aprobó para capacitación en 2027?",
    respuesta: null,
    sugerenciaNoEncontrada: { documento: "Plan de formación 2026 (ejemplo)", pagina: 2 },
    citas: [
      {
        id: "pl-for-2026",
        documento: "Plan de formación 2026 (ejemplo)",
        codigo: "PL-FOR-2026",
        pagina: 2,
        totalPaginas: 12,
        cargado: "2026-11-03T00:00:00-05:00",
        parrafos: [
          { titulo: "1. Alcance del plan", antes: "El plan cubre las capacitaciones obligatorias y de desarrollo del personal del área para el año 2026, organizadas por trimestre." },
          { antes: "El presupuesto de cada año se aprueba por separado en el comité de gerencia. (Este documento no incluye el de 2027.)" },
        ],
      },
    ],
  },
];

export const preguntasSugeridas = [
  "Límite de exposición a ruido",
  "Permiso de trabajo en altura",
  "Resume el plan de formación 2026",
];
