import { useSyncExternalStore } from "react";

function suscribir() {
  return () => {};
}
function instantaneaCliente() {
  return true;
}
function instantaneaServidor() {
  return false;
}

/**
 * true solo después de la hidratación en el cliente. Sirve para evitar un
 * desajuste de hidratación (p. ej. el tema claro/oscuro, que depende de
 * localStorage) sin el patrón "setState dentro de un efecto" que React
 * desaconseja — ver react-hooks/set-state-in-effect.
 */
export function useHaMontado() {
  return useSyncExternalStore(suscribir, instantaneaCliente, instantaneaServidor);
}
