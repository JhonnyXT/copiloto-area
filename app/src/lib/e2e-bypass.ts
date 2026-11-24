export const VALOR_BYPASS_SOLO_PRUEBAS = "solo-para-playwright-nunca-en-produccion";

export function esBypassDePruebasActivo(): boolean {
  return process.env.E2E_BYPASS_AUTH === VALOR_BYPASS_SOLO_PRUEBAS;
}
