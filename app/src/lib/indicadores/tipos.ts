export type Estado = "ok" | "warn" | "risk";

export interface PuntoSerie {
  semana: number;
  valor: number;
}

export interface PeriodoSemanal {
  inicio: string;
  fin: string;
}

export interface Kpi {
  slug: string;
  nombre: string;
  descripcion: string;
  unidad: string;
  decimales: number;
  meta: number;
  comparacion: "mayor-mejor" | "menor-mejor";
  estado: Estado;
  valorActual: number;
  caption: string;
  periodo: PeriodoSemanal;
  serie: PuntoSerie[];
  serie26?: PuntoSerie[];
  tendencia: {
    titulo: string;
    subtitulo: string;
    leyenda: string;
  };
  fuente: { archivo: string; hoja: string; cargado: string };
}
