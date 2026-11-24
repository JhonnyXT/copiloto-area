import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(value: number, decimals = 0) {
  return new Intl.NumberFormat("es-CO", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

export function formatDate(iso: string) {
  return new Intl.DateTimeFormat("es-CO", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(iso));
}

export function formatDateTime(iso: string) {
  return new Intl.DateTimeFormat("es-CO", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(iso));
}

export function formatSigned(value: number, decimals = 0, suffix = "") {
  const signo = value > 0 ? "+" : value < 0 ? "−" : "";
  return `${signo}${formatNumber(Math.abs(value), decimals)}${suffix}`;
}
