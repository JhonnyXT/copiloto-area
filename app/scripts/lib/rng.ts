export function crearGeneradorDeterministico(semilla: number) {
  let estado = semilla >>> 0;
  return function siguiente(): number {
    estado = (estado + 0x6d2b79f5) >>> 0;
    let t = estado;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function elegirDe<T>(azar: () => number, lista: readonly T[]): T {
  return lista[Math.floor(azar() * lista.length)];
}

export function numeroEntre(azar: () => number, min: number, max: number): number {
  return min + azar() * (max - min);
}

export function redondear(valor: number, decimales: number): number {
  const factor = 10 ** decimales;
  return Math.round(valor * factor) / factor;
}
