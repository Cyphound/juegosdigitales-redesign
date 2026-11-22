import { PRODUCTS, Product } from "./data";

/**
 * Predicción de demanda (simulada) para el panel de administración.
 * Modelo: suavizamiento exponencial doble de Holt (nivel + tendencia)
 * multiplicado por un factor de eventos (Cyber, Black Friday, Navidad, lanzamientos).
 * En producción se entrenaría con el historial real de órdenes (p. ej. Prophet / XGBoost en SageMaker).
 */

function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function hash(str: string) {
  let h = 0;
  for (const c of str) h = (h * 31 + c.charCodeAt(0)) | 0;
  return Math.abs(h);
}

export const WEEK_LABELS = [
  "S27", "S28", "S29", "S30", "S31", "S32", "S33", "S34", "S35", "S36",
  "S37", "S38", "S39", "S40", "S41", "S42", "S43", "S44", "S45", "S46",
];
export const FUTURE_LABELS = ["S47", "S48 Black", "S49", "S50", "S51 Navidad", "S52"];
const EVENT_FACTOR = [1.05, 1.55, 1.1, 1.2, 1.6, 1.15];

export function history(pr: Product): number[] {
  const rnd = seeded(hash(pr.id));
  const base = pr.soldWeek * 0.55;
  const growth = pr.release ? 0.045 : 0.012;
  return WEEK_LABELS.map((_, i) => {
    const cyber = i === 12 ? 1.35 : 1; // Cyber de octubre
    const noise = 0.82 + rnd() * 0.36;
    return Math.round(base * (1 + growth * i) * cyber * noise);
  });
}

export function holtForecast(series: number[], horizon = 6, alpha = 0.5, beta = 0.3) {
  let level = series[0];
  let trend = series[1] - series[0];
  for (let i = 1; i < series.length; i++) {
    const prev = level;
    level = alpha * series[i] + (1 - alpha) * (level + trend);
    trend = beta * (level - prev) + (1 - beta) * trend;
  }
  const out: { value: number; low: number; high: number }[] = [];
  for (let h = 1; h <= horizon; h++) {
    const v = Math.max(0, (level + h * trend) * EVENT_FACTOR[h - 1]);
    const spread = v * (0.08 + h * 0.035);
    out.push({ value: Math.round(v), low: Math.round(v - spread), high: Math.round(v + spread) });
  }
  return out;
}

export function demandTable() {
  return PRODUCTS.map((pr) => {
    const h = history(pr);
    const f = holtForecast(h);
    const next2 = f[0].value + f[1].value;
    // cupos internos listos para entregar (el número visible en la tienda es solo una parte)
    const stock = (pr.stockPrimaria + pr.stockSecundaria) * 8;
    // cada cuenta de juego entrega 1 primaria + 2 secundarias
    const accountsNeeded = Math.max(0, Math.ceil((next2 - stock) / 3));
    const last = h[h.length - 1];
    const trendPct = Math.round(((f[1].value - last) / Math.max(1, last)) * 100);
    return { pr, history: h, forecast: f, next2, stock, accountsNeeded, trendPct };
  }).sort((a, b) => b.accountsNeeded - a.accountsNeeded || b.next2 - a.next2);
}
