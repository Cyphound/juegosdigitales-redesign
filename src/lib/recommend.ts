import { GENRES, MOCK_BASKETS, PRODUCTS, Product, UserProfile } from "./data";

/**
 * Sistema de recomendación HÍBRIDO (simulado en el cliente):
 *  - Filtrado colaborativo ítem-ítem: similitud coseno sobre co-compras históricas.
 *  - Basado en contenido: similitud de Jaccard entre géneros del juego y gustos del perfil.
 *  - Popularidad: ventas de la semana (resuelve el "arranque en frío" de usuarios nuevos).
 * score = 0.45·colaborativo + 0.35·contenido + 0.20·popularidad
 */

const W_COLLAB = 0.45;
const W_CONTENT = 0.35;
const W_POP = 0.2;

// Matriz de co-ocurrencia
const counts = new Map<string, number>();
const pairs = new Map<string, number>();
for (const basket of MOCK_BASKETS) {
  for (const a of basket) {
    counts.set(a, (counts.get(a) ?? 0) + 1);
    for (const b of basket) if (a !== b) pairs.set(a + "|" + b, (pairs.get(a + "|" + b) ?? 0) + 1);
  }
}

export function itemSimilarity(a: string, b: string) {
  const co = pairs.get(a + "|" + b) ?? 0;
  if (!co) return 0;
  return co / Math.sqrt((counts.get(a) ?? 1) * (counts.get(b) ?? 1));
}

function jaccard(a: string[], b: string[]) {
  if (!a.length || !b.length) return 0;
  const A = new Set(a);
  const inter = b.filter((x) => A.has(x)).length;
  return inter / new Set([...a, ...b]).size;
}

const maxSold = Math.max(...PRODUCTS.map((x) => x.soldWeek));

export interface Recommendation {
  product: Product;
  score: number;
  reason: string;
  kind: "colaborativo" | "contenido" | "popularidad";
}

export function recommendFor(user: UserProfile | null, limit = 8): Recommendation[] {
  const owned = new Set(user?.purchases ?? []);
  const pool = PRODUCTS.filter((x) => !owned.has(x.id) && (!user?.platform || x.platform === user.platform));

  return pool
    .map((pr) => {
      let collab = 0;
      let collabFrom = "";
      for (const o of owned) {
        const s = itemSimilarity(o, pr.id);
        if (s > collab) {
          collab = s;
          collabFrom = o;
        }
      }
      const content = jaccard(user?.genres ?? [], pr.genres);
      const pop = pr.soldWeek / maxSold;
      const score = W_COLLAB * collab + W_CONTENT * content + W_POP * pop;

      const parts = [
        { kind: "colaborativo" as const, v: W_COLLAB * collab },
        { kind: "contenido" as const, v: W_CONTENT * content },
        { kind: "popularidad" as const, v: W_POP * pop },
      ].sort((a, b) => b.v - a.v);
      const kind = parts[0].kind;

      let reason = "Tendencia esta semana en la tienda";
      if (kind === "colaborativo" && collabFrom) {
        const from = PRODUCTS.find((x) => x.id === collabFrom);
        reason = `Quienes compraron ${from?.title} también lo compraron`;
      } else if (kind === "contenido") {
        const g = pr.genres.find((x) => user?.genres.includes(x));
        reason = g ? `Porque te gusta ${GENRES[g].toLowerCase()}` : "Coincide con tus gustos";
      }
      return { product: pr, score, reason, kind };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

/** "Clientes que compraron esto también compraron" (colaborativo puro) */
export function alsoBought(id: string, limit = 4): Product[] {
  return PRODUCTS.filter((x) => x.id !== id)
    .map((x) => ({ x, s: itemSimilarity(id, x.id) }))
    .filter((r) => r.s > 0)
    .sort((a, b) => b.s - a.s)
    .slice(0, limit)
    .map((r) => r.x);
}

/** Juegos similares por contenido (misma plataforma + géneros) */
export function similarTo(pr: Product, limit = 4): Product[] {
  return PRODUCTS.filter((x) => x.id !== pr.id && x.platform === pr.platform)
    .map((x) => ({ x, s: jaccard(pr.genres, x.genres) }))
    .sort((a, b) => b.s - a.s || b.x.soldWeek - a.x.soldWeek)
    .slice(0, limit)
    .map((r) => r.x);
}

export function trending(platform?: string | null, limit = 8) {
  return PRODUCTS.filter((x) => !platform || x.platform === platform)
    .sort((a, b) => b.soldWeek - a.soldWeek)
    .slice(0, limit);
}
