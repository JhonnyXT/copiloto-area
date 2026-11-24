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

export function useHaMontado() {
  return useSyncExternalStore(suscribir, instantaneaCliente, instantaneaServidor);
}
