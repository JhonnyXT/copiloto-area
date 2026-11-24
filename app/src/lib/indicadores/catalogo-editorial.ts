export interface EditorialIndicador {
  descripcion: string;
  decimales: number;
  esLimite: boolean;
  tendenciaTitulo: string;
  tendenciaLeyenda: string;
}

export const CATALOGO_EDITORIAL: Record<string, EditorialIndicador> = {
  produccion: {
    descripcion: "Onzas producidas por el área en la semana.",
    decimales: 0,
    esLimite: false,
    tendenciaTitulo: "Producción semanal de tu área",
    tendenciaLeyenda: "Tu área",
  },
  "costo-onza": {
    descripcion: "Costo total del área dividido entre las onzas producidas. Menos es mejor.",
    decimales: 0,
    esLimite: false,
    tendenciaTitulo: "Costo por onza",
    tendenciaLeyenda: "Costo por onza",
  },
  seguridad: {
    descripcion: "Accidentes incapacitantes del área registrados en la semana.",
    decimales: 0,
    esLimite: false,
    tendenciaTitulo: "Accidentes incapacitantes del área",
    tendenciaLeyenda: "Eventos del área",
  },
  mantenimiento: {
    descripcion: "Porcentaje de órdenes de mantenimiento preventivo cumplidas a tiempo.",
    decimales: 0,
    esLimite: false,
    tendenciaTitulo: "Cumplimiento del mantenimiento preventivo",
    tendenciaLeyenda: "Cumplimiento",
  },
};

export function obtenerEditorial(slug: string): EditorialIndicador {
  return (
    CATALOGO_EDITORIAL[slug] ?? {
      descripcion: "",
      decimales: 0,
      esLimite: false,
      tendenciaTitulo: slug,
      tendenciaLeyenda: slug,
    }
  );
}
