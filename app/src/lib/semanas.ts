const MILISEGUNDOS_POR_DIA = 86_400_000;
const ZONA_HORARIA_DEL_AREA = "America/Bogota";

function fechaUtc(iso: string): Date {
  return new Date(`${iso}T00:00:00Z`);
}

export function fechaDeHoy(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: ZONA_HORARIA_DEL_AREA }).format(new Date());
}

export function numeroSemanaIso(fechaIso: string): number {
  const jueves = fechaUtc(fechaIso);
  const diaIso = jueves.getUTCDay() || 7;
  jueves.setUTCDate(jueves.getUTCDate() + 4 - diaIso);
  const inicioDeAnio = Date.UTC(jueves.getUTCFullYear(), 0, 1);
  return Math.ceil(((jueves.getTime() - inicioDeAnio) / MILISEGUNDOS_POR_DIA + 1) / 7);
}

export function formatearPeriodo(inicio: string, fin: string): string {
  const desde = fechaUtc(inicio);
  const hasta = fechaUtc(fin);
  const mes = (fecha: Date) => new Intl.DateTimeFormat("es-CO", { month: "long", timeZone: "UTC" }).format(fecha);
  const mesDeInicio = desde.getUTCMonth() === hasta.getUTCMonth() ? "" : ` de ${mes(desde)}`;
  return `${desde.getUTCDate()}${mesDeInicio} al ${hasta.getUTCDate()} de ${mes(hasta)} de ${hasta.getUTCFullYear()}`;
}
