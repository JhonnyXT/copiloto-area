export interface EscalaGrafico {
  min: number;
  max: number;
  marcas: number[];
}

const MULTIPLOS_LEGIBLES = [1, 2, 2.5, 5, 10];

function pasoLegible(pasoCrudo: number, pasoMinimo: number): number {
  const magnitud = 10 ** Math.floor(Math.log10(pasoCrudo));
  const multiplo = MULTIPLOS_LEGIBLES.find((candidato) => candidato * magnitud >= pasoCrudo) ?? 10;
  return Math.max(multiplo * magnitud, pasoMinimo);
}

export function calcularEscala(valores: number[], decimales: number, intervalos = 4): EscalaGrafico {
  const menor = Math.min(...valores);
  const mayor = Math.max(...valores);
  const pasoMinimo = 10 ** -decimales;
  const paso = pasoLegible((mayor - menor || pasoMinimo) / intervalos, pasoMinimo);

  const min = Math.floor(menor / paso) * paso;
  const max = Math.max(Math.ceil(mayor / paso) * paso, min + paso);
  const cantidad = Math.round((max - min) / paso);
  const marcas = Array.from({ length: cantidad + 1 }, (_, i) => min + i * paso);
  return { min, max, marcas };
}
