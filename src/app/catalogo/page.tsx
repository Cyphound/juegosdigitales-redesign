"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { ArrowUpDown, Search, SearchX, Sparkles, X } from "lucide-react";
import { Suspense, useEffect, useMemo, useState } from "react";
import { COLLECTIONS, CollectionId, GENRES, GenreId, PLATFORMS, PlatformId, PRODUCTS, discountPct } from "@/lib/data";
import { recommendFor } from "@/lib/recommend";
import { useStore } from "@/lib/store";
import { ProductCard } from "@/components/ProductCard";
import { Glass } from "@/components/ui";
import { useAmbient } from "@/components/Shell";

type Cat = "" | "estrenos" | "preventa" | "packs" | "membresias";
const CATS: { v: Cat; label: string }[] = [
  { v: "", label: "Todo" },
  { v: "estrenos", label: "Estrenos" },
  { v: "preventa", label: "Preventas" },
  { v: "packs", label: "Packs" },
  { v: "membresias", label: "Membresías" },
];
const CAT_TITLE: Record<Exclude<Cat, "">, string> = {
  estrenos: "Estrenos",
  preventa: "Preventas",
  packs: "Packs",
  membresias: "Membresías",
};

type Sort = "parati" | "vendidos" | "precio-asc" | "precio-desc" | "descuento";
const SORTS: { v: Sort; label: string }[] = [
  { v: "parati", label: "Para ti" },
  { v: "vendidos", label: "Más vendidos" },
  { v: "descuento", label: "Mayor descuento" },
  { v: "precio-asc", label: "Menor precio" },
  { v: "precio-desc", label: "Mayor precio" },
];

export default function CatalogoPage() {
  return (
    <Suspense fallback={<div className="h-[80vh]" />}>
      <Catalogo />
    </Suspense>
  );
}

function Catalogo() {
  const params = useSearchParams();
  const router = useRouter();
  const { user } = useStore();
  const [q, setQ] = useState(params.get("q") ?? "");
  const [plat, setPlat] = useState<PlatformId | null>((params.get("plataforma") as PlatformId) ?? user?.platform ?? null);
  const [genres, setGenres] = useState<GenreId[]>([]);
  const [maxPrice, setMaxPrice] = useState(60000);
  const [sort, setSort] = useState<Sort>((params.get("orden") as Sort) ?? "parati");
  const [cat, setCat] = useState<Cat>((params.get("categoria") as Cat) ?? "");
  const [coleccion, setColeccion] = useState<CollectionId | null>((params.get("coleccion") as CollectionId) ?? null);

  useEffect(() => {
    setQ(params.get("q") ?? "");
    const p = params.get("plataforma") as PlatformId | null;
    const c = params.get("coleccion") as CollectionId | null;
    setPlat(p ?? (c || params.get("categoria") || params.get("orden") || params.get("q") ? null : user?.platform ?? null));
    setCat((params.get("categoria") as Cat) ?? "");
    setColeccion(c);
    setSort((params.get("orden") as Sort) ?? "parati");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  useAmbient(plat ? PLATFORMS[plat].color : "#8467ff");

  const recScore = useMemo(() => {
    const m = new Map<string, { s: number; r: string; k: "colaborativo" | "contenido" | "popularidad" }>();
    recommendFor(user ? { ...user, platform: null } : null, 100).forEach((r) => m.set(r.product.id, { s: r.score, r: r.reason, k: r.kind }));
    return m;
  }, [user]);

  const list = useMemo(() => {
    const norm = (s: string) => s.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
    let l = PRODUCTS.filter(
      (p) =>
        (!plat || p.platform === plat) &&
        (!genres.length || genres.some((g) => p.genres.includes(g))) &&
        p.priceSecundaria <= maxPrice &&
        (!coleccion || !!p.collections?.includes(coleccion)) &&
        (cat === ""
          ? true
          : cat === "packs"
            ? p.kind === "pack"
            : cat === "membresias"
              ? p.kind === "membresia"
              : p.release === (cat === "estrenos" ? "estreno" : "preventa")) &&
        (!q || norm(p.title).includes(norm(q)))
    );
    l = [...l].sort((a, b) => {
      switch (sort) {
        case "vendidos":
          return b.soldWeek - a.soldWeek;
        case "precio-asc":
          return a.priceSecundaria - b.priceSecundaria;
        case "precio-desc":
          return b.priceSecundaria - a.priceSecundaria;
        case "descuento":
          return discountPct(b) - discountPct(a);
        default:
          return (recScore.get(b.id)?.s ?? 0) - (recScore.get(a.id)?.s ?? 0);
      }
    });
    return l;
  }, [plat, genres, maxPrice, sort, cat, coleccion, q, recScore]);

  const reset = () => {
    setPlat(null);
    setGenres([]);
    setMaxPrice(60000);
    setCat("");
    setColeccion(null);
    setQ("");
    router.replace("/catalogo");
  };

  return (
    <div className="mx-auto max-w-7xl px-4 pt-10 md:px-6">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-white/45">Catálogo</p>
        <h1 className="mt-1.5 text-4xl font-semibold tracking-tight text-white md:text-5xl">
          {coleccion ? COLLECTIONS[coleccion] : cat ? CAT_TITLE[cat] : "Juegos"}
          {plat && (
            <>
              {" "}
              <span style={{ color: PLATFORMS[plat].color }}>{PLATFORMS[plat].short}</span>
            </>
          )}
          {!plat && !cat && !coleccion && " para todas las consolas"}
        </h1>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-[270px_1fr]">
        {/* ---------- Filtros ---------- */}
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <Glass className="rounded-[26px] p-5">
            <label className="flex h-11 items-center gap-2 rounded-xl bg-black/30 px-3 text-white/45 ring-1 ring-white/10 focus-within:ring-brand/50">
              <Search className="size-4" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Buscar por nombre"
                className="w-full bg-transparent text-sm text-white placeholder:text-white/35 focus:outline-none"
              />
              {q && (
                <button onClick={() => setQ("")} aria-label="Limpiar búsqueda">
                  <X className="size-4 hover:text-white" />
                </button>
              )}
            </label>

            <FilterTitle>Categoría</FilterTitle>
            <div className="flex flex-wrap gap-1.5">
              {CATS.map((c) => (
                <motion.button
                  key={c.v || "todo"}
                  whileTap={{ scale: 0.92 }}
                  onClick={() => setCat(c.v)}
                  className={`relative rounded-full px-3 py-1.5 text-xs transition-colors ${
                    cat === c.v ? "text-brand-ink" : "bg-white/5 text-white/60 ring-1 ring-white/8 hover:text-white"
                  }`}
                >
                  {cat === c.v && <motion.span layoutId="cat-pill" className="absolute inset-0 rounded-full bg-brand" transition={{ type: "spring", stiffness: 420, damping: 32 }} />}
                  <span className="relative">{c.label}</span>
                </motion.button>
              ))}
            </div>

            {coleccion && (
              <div className="mt-4 flex items-center justify-between rounded-xl bg-brand/12 px-3 py-2 text-xs text-brand ring-1 ring-brand/25">
                {COLLECTIONS[coleccion]}
                <button onClick={() => setColeccion(null)} aria-label="Quitar colección">
                  <X className="size-3.5" />
                </button>
              </div>
            )}

            <FilterTitle>Plataforma</FilterTitle>
            <div className="grid grid-cols-2 gap-1.5">
              {Object.values(PLATFORMS).map((pl) => {
                const on = plat === pl.id;
                return (
                  <motion.button
                    key={pl.id}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setPlat(on ? null : pl.id)}
                    className="relative flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition"
                    style={{
                      background: on ? pl.soft : "color-mix(in srgb, var(--color-white) 4%, transparent)",
                      color: on ? pl.color : "color-mix(in srgb, var(--color-white) 70%, transparent)",
                      boxShadow: on ? `inset 0 0 0 1px ${pl.color}80` : "inset 0 0 0 1px color-mix(in srgb, var(--color-white) 8%, transparent)",
                    }}
                  >
                    <span className="size-2 rounded-full" style={{ background: pl.color }} />
                    {pl.short}
                  </motion.button>
                );
              })}
            </div>

            <FilterTitle>Género</FilterTitle>
            <div className="flex flex-wrap gap-1.5">
              {(Object.keys(GENRES) as GenreId[]).map((g) => {
                const on = genres.includes(g);
                return (
                  <motion.button
                    key={g}
                    whileTap={{ scale: 0.92 }}
                    onClick={() => setGenres((gs) => (on ? gs.filter((x) => x !== g) : [...gs, g]))}
                    className={`rounded-full px-3 py-1.5 text-xs transition ${
                      on ? "bg-white font-medium text-black" : "bg-white/5 text-white/60 ring-1 ring-white/8 hover:text-white"
                    }`}
                  >
                    {GENRES[g]}
                  </motion.button>
                );
              })}
            </div>

            <FilterTitle>
              Precio máximo <span className="font-normal text-white">${maxPrice.toLocaleString("es-CL")}</span>
            </FilterTitle>
            <input
              type="range"
              min={2000}
              max={60000}
              step={1000}
              value={maxPrice}
              onChange={(e) => setMaxPrice(+e.target.value)}
              className="w-full accent-brand"
            />

            <button onClick={reset} className="mt-6 w-full rounded-xl py-2.5 text-sm text-white/55 ring-1 ring-white/10 transition hover:bg-white/5 hover:text-white">
              Limpiar filtros
            </button>
          </Glass>
        </aside>

        {/* ---------- Resultados ---------- */}
        <div>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-white/50">
              <motion.span key={list.length} initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} className="inline-block font-semibold text-white">
                {list.length}
              </motion.span>{" "}
              resultados
              {sort === "parati" && user && (
                <span className="ml-2 inline-flex items-center gap-1 text-xs text-brand">
                  <Sparkles className="size-3.5" /> ordenados según tu perfil
                </span>
              )}
            </p>
            <div className="no-scrollbar flex items-center gap-1 overflow-x-auto rounded-full bg-black/30 p-1 ring-1 ring-white/10">
              <ArrowUpDown className="ml-2 mr-1 size-3.5 shrink-0 text-white/40" />
              {SORTS.map((s) => (
                <button
                  key={s.v}
                  onClick={() => setSort(s.v)}
                  className={`relative shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                    sort === s.v ? "text-black" : "text-white/55 hover:text-white"
                  }`}
                >
                  {sort === s.v && (
                    <motion.span layoutId="sort-pill" className="absolute inset-0 -z-0 rounded-full bg-white" transition={{ type: "spring", stiffness: 420, damping: 32 }} />
                  )}
                  <span className="relative">{s.label}</span>
                </button>
              ))}
            </div>
          </div>

          <LayoutGroup>
            <motion.div layout className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
              <AnimatePresence mode="popLayout">
                {list.map((p, i) => {
                  const r = recScore.get(p.id);
                  return (
                    <ProductCard
                      key={p.id}
                      product={p}
                      index={i}
                      reason={user && sort === "parati" && i < 3 && r ? r.r : undefined}
                      kind={r?.k}
                    />
                  );
                })}
              </AnimatePresence>
            </motion.div>
          </LayoutGroup>

          <AnimatePresence>
            {list.length === 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center gap-3 py-24 text-center"
              >
                <SearchX className="size-10 text-white/30" />
                <p className="text-lg font-medium text-white">No encontramos juegos con esos filtros</p>
                <button onClick={reset} className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-black">
                  Limpiar filtros
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function FilterTitle({ children }: { children: React.ReactNode }) {
  return <p className="mb-2.5 mt-6 flex items-center justify-between text-xs font-medium uppercase tracking-[0.14em] text-white/45">{children}</p>;
}
