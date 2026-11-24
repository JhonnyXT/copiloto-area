import { crearGeneradorDeterministico, elegirDe, numeroEntre } from "./rng";

export interface PaginaDocumento {
  pagina: number;
  contenido: string;
}

export interface DocumentoGenerado {
  titulo: string;
  codigo: string;
  totalPaginas: number;
  paginas: PaginaDocumento[];
}

export interface PreguntaEvaluacion {
  pregunta: string;
  documentoTitulo: string;
  pagina: number;
  respuestaEsperada: string;
}

const RELLENO_GENERICO = [
  "El cumplimiento de este procedimiento se verifica en las auditorías internas programadas por el área de seguridad.",
  "Cualquier excepción a lo aquí descrito requiere autorización escrita del supervisor de área y queda registrada en la bitácora correspondiente.",
  "El personal nuevo recibe inducción sobre este procedimiento antes de su primer turno en el área.",
];

function completarPaginasFijas(totalPaginas: number, paginaReal: PaginaDocumento): PaginaDocumento[] {
  const paginas: PaginaDocumento[] = [];
  for (let pagina = 1; pagina <= totalPaginas; pagina++) {
    paginas.push(
      pagina === paginaReal.pagina
        ? paginaReal
        : { pagina, contenido: RELLENO_GENERICO[(pagina + totalPaginas) % RELLENO_GENERICO.length] },
    );
  }
  return paginas;
}

const DOCUMENTOS_FIJOS: { documento: DocumentoGenerado; pregunta: PreguntaEvaluacion }[] = [
  {
    documento: {
      titulo: "Procedimiento de ventilación (ejemplo)",
      codigo: "PR-VEN-014",
      totalPaginas: 18,
      paginas: completarPaginasFijas(18, {
        pagina: 7,
        contenido:
          "6.3 Actuación ante concentraciones fuera de límite\n\n" +
          "Cuando el detector portátil o fijo indique una concentración superior al límite permisible, se suspenderá de inmediato la actividad en el frente y el personal se dirigirá a la estación de aire fresco más cercana, informando al supervisor de turno.\n\n" +
          "El supervisor verificará el funcionamiento del sistema de ventilación auxiliar y registrará las lecturas cada cinco minutos en la bitácora del frente.\n\n" +
          "La reanudación de labores requiere dos mediciones consecutivas, con un intervalo de quince minutos, por debajo del límite.",
      }),
    },
    pregunta: {
      pregunta: "¿Qué hay que hacer si el sensor de gases de un frente marca por encima del límite?",
      documentoTitulo: "Procedimiento de ventilación (ejemplo)",
      pagina: 7,
      respuestaEsperada: "Suspender la actividad, ir a la estación de aire fresco y avisar al supervisor; se reanuda con dos mediciones seguidas bajo el límite.",
    },
  },
  {
    documento: {
      titulo: "Instructivo de reporte de incidentes (ejemplo)",
      codigo: "IN-REP-003",
      totalPaginas: 9,
      paginas: completarPaginasFijas(9, {
        pagina: 3,
        contenido:
          "2. Plazos de reporte\n\n" +
          "Todo evento de ventilación o exposición se registra en el formato de reporte dentro de las 24 horas siguientes al evento, con la firma del supervisor de turno.\n\n" +
          "Los eventos con lesión se reportan además a Seguridad de inmediato, por radio o teléfono.",
      }),
    },
    pregunta: {
      pregunta: "¿Cuánto tiempo hay para reportar un evento de ventilación?",
      documentoTitulo: "Instructivo de reporte de incidentes (ejemplo)",
      pagina: 3,
      respuestaEsperada: "Dentro de las 24 horas siguientes al evento, con firma del supervisor de turno.",
    },
  },
  {
    documento: {
      titulo: "Plan de formación 2026 (ejemplo)",
      codigo: "PL-FOR-2026",
      totalPaginas: 12,
      paginas: completarPaginasFijas(12, {
        pagina: 2,
        contenido:
          "1. Alcance del plan\n\n" +
          "El plan cubre las capacitaciones obligatorias y de desarrollo del personal del área para el año 2026, organizadas por trimestre.\n\n" +
          "El presupuesto de cada año se aprueba por separado en el comité de gerencia.",
      }),
    },
    pregunta: {
      pregunta: "¿Qué cubre el plan de formación 2026?",
      documentoTitulo: "Plan de formación 2026 (ejemplo)",
      pagina: 2,
      respuestaEsperada: "Las capacitaciones obligatorias y de desarrollo del personal del área en 2026, por trimestre.",
    },
  },
];

interface TemaDocumento {
  titulo: string;
  prefijoCodigo: string;
  encabezados: string[];
  hechosClave: { pregunta: string; respuesta: string; contenido: string }[];
  relleno: string[];
}

const TEMAS: TemaDocumento[] = [
  {
    titulo: "Procedimiento de trabajo en alturas",
    prefijoCodigo: "PR-ALT",
    encabezados: ["Alcance", "Equipos de protección contra caídas", "Puntos de anclaje", "Inspección previa al uso"],
    hechosClave: [
      {
        pregunta: "¿A partir de qué altura se exige arnés de cuerpo completo?",
        respuesta: "A partir de 1,5 metros sobre el nivel de referencia.",
        contenido: "El uso de arnés de cuerpo completo es obligatorio para toda labor realizada a 1,5 metros o más sobre el nivel de referencia, sin excepción.",
      },
    ],
    relleno: [
      "El personal debe verificar el estado del arnés y la línea de vida antes de cada turno, descartando cualquier equipo con cortes, quemaduras o costuras sueltas.",
      "Los puntos de anclaje certificados se identifican con una placa amarilla y soportan una carga mínima de 2.270 kg por persona.",
      "Ninguna persona puede trabajar en altura sin un segundo trabajador presente en el área, capacitado en rescate básico.",
    ],
  },
  {
    titulo: "Procedimiento de espacios confinados",
    prefijoCodigo: "PR-ESP",
    encabezados: ["Identificación de espacios confinados", "Permiso de entrada", "Monitoreo atmosférico", "Plan de rescate"],
    hechosClave: [
      {
        pregunta: "¿Cada cuánto se debe medir la atmósfera dentro de un espacio confinado?",
        respuesta: "Continuamente, con lectura registrada cada 15 minutos.",
        contenido: "La atmósfera interior se monitorea de forma continua con un equipo de cuatro gases, dejando registro de la lectura cada 15 minutos mientras haya personal adentro.",
      },
    ],
    relleno: [
      "Todo ingreso a un espacio confinado requiere un permiso firmado por el supervisor de área, vigente solo para ese turno.",
      "Se designa un vigía permanente en la boca del espacio confinado, que no puede abandonar su puesto mientras haya personal adentro.",
      "El plan de rescate específico del espacio se revisa antes de autorizar cualquier ingreso.",
    ],
  },
  {
    titulo: "Procedimiento de manejo de explosivos",
    prefijoCodigo: "PR-EXP",
    encabezados: ["Transporte de explosivos", "Almacenamiento en polvorín", "Voladura controlada", "Zona de exclusión"],
    hechosClave: [
      {
        pregunta: "¿Cuál es el radio mínimo de la zona de exclusión durante una voladura?",
        respuesta: "500 metros alrededor del punto de voladura.",
        contenido: "Antes de iniciar cualquier voladura se establece una zona de exclusión de 500 metros alrededor del punto de disparo, verificada por el encargado de explosivos.",
      },
    ],
    relleno: [
      "El transporte de explosivos entre el polvorín y el frente de trabajo se hace únicamente en vehículos autorizados y señalizados.",
      "El polvorín permanece bajo llave doble, con registro de entrada y salida de cada caja de explosivo.",
      "Ninguna persona ajena a la cuadrilla de voladura puede ingresar a la zona de exclusión sin autorización expresa.",
    ],
  },
  {
    titulo: "Procedimiento de elementos de protección personal",
    prefijoCodigo: "PR-EPP",
    encabezados: ["EPP básico de ingreso a mina", "Protección respiratoria", "Protección auditiva", "Reposición de equipos"],
    hechosClave: [
      {
        pregunta: "¿Cada cuánto se reponen los tapones auditivos desechables?",
        respuesta: "Cada vez que el trabajador los solicite, sin límite de cambios al mes.",
        contenido: "Los tapones auditivos desechables se reponen cada vez que el trabajador lo solicite en el punto de dotación, sin límite de cambios al mes.",
      },
    ],
    relleno: [
      "El EPP básico para ingresar a cualquier área de mina incluye casco, botas de seguridad, chaleco reflectivo y lámpara minera cargada.",
      "La protección respiratoria se selecciona según el riesgo del área, de acuerdo con la matriz de exposición vigente.",
      "Ningún trabajador puede ingresar a zona de polvorín o frente activo sin el EPP completo verificado por el supervisor.",
    ],
  },
  {
    titulo: "Plan de emergencia y evacuación",
    prefijoCodigo: "PL-EME",
    encabezados: ["Clasificación de emergencias", "Rutas de evacuación", "Punto de encuentro", "Simulacros"],
    hechosClave: [
      {
        pregunta: "¿Con qué frecuencia se hacen los simulacros de evacuación?",
        respuesta: "Un simulacro general cada seis meses, por área.",
        contenido: "Cada área realiza un simulacro general de evacuación cada seis meses, con informe de tiempos y hallazgos entregado a Seguridad.",
      },
    ],
    relleno: [
      "El punto de encuentro principal está señalizado en la entrada de cada bocamina y debe mantenerse siempre despejado.",
      "Las rutas de evacuación se revisan mensualmente para confirmar que no tengan obstrucciones ni señalización dañada.",
      "Toda emergencia clasificada como mayor activa de inmediato al comité de crisis de la compañía.",
    ],
  },
  {
    titulo: "Procedimiento de control de acceso a mina",
    prefijoCodigo: "PR-ACC",
    encabezados: ["Registro de ingreso", "Visitantes y contratistas", "Control de personal bajo tierra", "Cierre de turno"],
    hechosClave: [
      {
        pregunta: "¿Qué se exige a un visitante antes de ingresar a mina?",
        respuesta: "Inducción de seguridad y EPP completo, acompañado siempre por un guía autorizado.",
        contenido: "Ningún visitante ingresa a mina sin completar la inducción de seguridad vigente, portar el EPP completo y estar acompañado en todo momento por un guía autorizado.",
      },
    ],
    relleno: [
      "El sistema de control de acceso registra la hora de entrada y salida de cada persona que ingresa bajo tierra.",
      "Al cierre de cada turno, el supervisor verifica que todo el personal registrado haya salido antes de reportar el conteo final.",
      "Los contratistas deben presentar su carné vigente y la autorización de la gerencia de contratos antes de ingresar.",
    ],
  },
  {
    titulo: "Procedimiento de mantenimiento de equipos",
    prefijoCodigo: "PR-MNT",
    encabezados: ["Mantenimiento preventivo programado", "Bloqueo y etiquetado", "Reporte de fallas", "Repuestos críticos"],
    hechosClave: [
      {
        pregunta: "¿Qué se debe hacer antes de intervenir un equipo en mantenimiento?",
        respuesta: "Aplicar bloqueo y etiquetado (LOTO) y verificar energía cero antes de intervenir.",
        contenido: "Antes de cualquier intervención, el técnico aplica el procedimiento de bloqueo y etiquetado (LOTO) y verifica energía cero en el equipo antes de iniciar labores.",
      },
    ],
    relleno: [
      "El mantenimiento preventivo programado sigue el calendario definido por el área de confiabilidad, según las horas de uso de cada equipo.",
      "Toda falla detectada en operación se reporta el mismo turno mediante el formato de novedades de mantenimiento.",
      "Los repuestos críticos se mantienen en inventario mínimo garantizado, revisado mensualmente por el almacén técnico.",
    ],
  },
  {
    titulo: "Procedimiento de gestión ambiental",
    prefijoCodigo: "PR-AMB",
    encabezados: ["Manejo de residuos", "Control de vertimientos", "Monitoreo de calidad del agua", "Reporte a la autoridad ambiental"],
    hechosClave: [
      {
        pregunta: "¿Cómo se clasifican los residuos generados en el área?",
        respuesta: "En ordinarios, reciclables y peligrosos, cada uno con su punto ecológico identificado.",
        contenido: "Los residuos generados en el área se clasifican en ordinarios, reciclables y peligrosos, cada uno dispuesto en el punto ecológico identificado con su color correspondiente.",
      },
    ],
    relleno: [
      "El monitoreo de calidad del agua en los puntos de vertimiento se realiza con la frecuencia que exige la licencia ambiental vigente.",
      "Los residuos peligrosos se entregan únicamente a gestores autorizados, con su respectivo manifiesto de transporte.",
      "Cualquier derrame se reporta de inmediato al área ambiental, independientemente de su volumen.",
    ],
  },
  {
    titulo: "Procedimiento de izaje de cargas",
    prefijoCodigo: "PR-IZJ",
    encabezados: ["Planeación del izaje", "Inspección de aparejos", "Zona de maniobra", "Comunicación con el operador"],
    hechosClave: [
      {
        pregunta: "¿Quién puede dar señales al operador durante un izaje?",
        respuesta: "Solo el señalero certificado asignado a la maniobra.",
        contenido: "Durante cualquier maniobra de izaje, únicamente el señalero certificado asignado puede dar instrucciones al operador del equipo.",
      },
    ],
    relleno: [
      "Todo aparejo de izaje se inspecciona antes de cada uso, descartando los que presenten deformaciones o desgaste visible.",
      "La zona de maniobra se delimita y se restringe el paso de personal ajeno mientras dure el izaje.",
      "Los izajes críticos requieren un plan de izaje revisado y aprobado previamente por el área técnica.",
    ],
  },
  {
    titulo: "Procedimiento de auditorías internas de seguridad",
    prefijoCodigo: "PR-AUD",
    encabezados: ["Programación de auditorías", "Criterios de evaluación", "Hallazgos y planes de acción", "Seguimiento"],
    hechosClave: [
      {
        pregunta: "¿Cuánto tiempo tiene un área para cerrar un hallazgo crítico de auditoría?",
        respuesta: "Quince días calendario desde la notificación del hallazgo.",
        contenido: "Un hallazgo crítico de auditoría debe cerrarse en un plazo máximo de quince días calendario, contados desde la fecha de notificación al área responsable.",
      },
    ],
    relleno: [
      "Las auditorías internas de seguridad se programan trimestralmente para cada área operativa.",
      "Cada hallazgo se clasifica según su severidad y queda registrado en el sistema de gestión de seguridad.",
      "El cumplimiento de los planes de acción se revisa en el comité mensual de seguridad.",
    ],
  },
];

function generarPaginasTema(tema: TemaDocumento, totalPaginas: number, azar: () => number): PaginaDocumento[] {
  const paginas: PaginaDocumento[] = [];
  const paginaHecho = Math.max(2, Math.floor(totalPaginas * numeroEntre(azar, 0.3, 0.6)));

  for (let pagina = 1; pagina <= totalPaginas; pagina++) {
    if (pagina === paginaHecho) {
      const hecho = tema.hechosClave[0];
      paginas.push({
        pagina,
        contenido: `${elegirDe(azar, tema.encabezados)}\n\n${hecho.contenido}\n\n${elegirDe(azar, tema.relleno)}`,
      });
      continue;
    }
    paginas.push({
      pagina,
      contenido: `${elegirDe(azar, tema.encabezados)}\n\n${elegirDe(azar, tema.relleno)}\n\n${elegirDe(azar, tema.relleno)}`,
    });
  }
  return paginas;
}

export function generarDocumentosFicticios(semilla: number): {
  documentos: DocumentoGenerado[];
  preguntasEvaluacion: PreguntaEvaluacion[];
} {
  const azar = crearGeneradorDeterministico(semilla);
  const documentos: DocumentoGenerado[] = [];
  const preguntasEvaluacion: PreguntaEvaluacion[] = [];

  for (const fijo of DOCUMENTOS_FIJOS) {
    documentos.push(fijo.documento);
    preguntasEvaluacion.push(fijo.pregunta);
  }

  TEMAS.forEach((tema, i) => {
    const totalPaginas = Math.round(numeroEntre(azar, 6, 22));
    const paginas = generarPaginasTema(tema, totalPaginas, azar);
    const codigo = `${tema.prefijoCodigo}-${String(i + 1).padStart(3, "0")}`;

    documentos.push({
      titulo: `${tema.titulo} (ejemplo)`,
      codigo,
      totalPaginas,
      paginas,
    });

    const paginaDelHecho = paginas.find((p) => p.contenido.includes(tema.hechosClave[0].contenido))!.pagina;
    preguntasEvaluacion.push({
      pregunta: tema.hechosClave[0].pregunta,
      documentoTitulo: `${tema.titulo} (ejemplo)`,
      pagina: paginaDelHecho,
      respuestaEsperada: tema.hechosClave[0].respuesta,
    });
  });

  return { documentos, preguntasEvaluacion };
}
