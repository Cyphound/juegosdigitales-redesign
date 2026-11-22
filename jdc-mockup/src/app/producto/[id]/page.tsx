"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  BadgeCheck,
  Check,
  Download,
  Eye,
  HardDrive,
  Languages,
  MonitorPlay,
  ShoppingBag,
  Star,
  Users,
  Wifi,
  WifiOff,
  Zap,
  Sparkles,
  AlertTriangle,
  Clock,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { AccountType, GENRES, PLATFORMS, clp, discountPct, priceOf, productById } from "@/lib/data";
import { alsoBought, similarTo } from "@/lib/recommend";
import { useStore } from "@/lib/store";
import { GameArt } from "@/components/GameArt";
import { ProductCard } from "@/components/ProductCard";
import { AccountToggle } from "@/components/AccountToggle";
import { AnimatedNumber, Glass, PlatformBadge, Reveal, SectionTitle } from "@/components/ui";
import { useAmbient } from "@/components/Shell";

const BENEFITS: Record<AccountType, { icon: typeof Check; t: string }[]> = {
  secundaria: [
    { icon: Users, t: "Juegas desde el perfil que te entregamos" },
    { icon: Star, t: "Acumulas trofeos y guardas tu avance" },
    { icon: Wifi, t: "Necesitas conexión a internet para jugar" },
  ],
  primaria: [
    { icon: BadgeCheck, t: "Juegas desde tu cuenta personal de siempre" },
    { icon: Star, t: "Trofeos y partidas en tu propio perfil" },
    { icon: WifiOff, t: "Funciona sin conexión" },
  ],
};

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const pr = productById(id);
  const { addToCart, setCartOpen, user } = useStore();
  const [type, setType] = useState<AccountType>("secundaria");
  const [free, setFree] = useState(250);
  const [viewers, setViewers] = useState(14);
  const [added, setAdded] = useState(false);
  useAmbient(pr ? PLATFORMS[pr.platform].color : null);

  useEffect(() => {
    const t = setInterval(() => setViewers((v) => Math.max(6, v + Math.round(Math.random() * 4 - 2))), 3500);
    return () => clearInterval(t);
  }, []);

  const also = useMemo(() => (pr ? alsoBought(pr.id) : []), [pr]);
  const similar = useMemo(() => (pr ? similarTo(pr, 10).filter((s) => !also.some((a) => a.id === s.id)).slice(0, 4) : []), [pr, also]);

  if (!pr) {
    return (
      <div className="grid h-[60vh] place-items-center text-center text-white">
        <div>
          <p className="text-2xl font-semibold">No encontramos este juego</p>
          <Link href="/catalogo" className="mt-4 inline-block text-brand">
            Volver al catálogo
          </Link>
        </div>
      </div>
    );
  }

  const pl = PLATFORMS[pr.platform];
  const price = priceOf(pr, type);
  const enough = free >= pr.requiredGb;
  const owned = user?.purchases.includes(pr.id);

  return (
    <div className="mx-auto max-w-7xl px-4 pt-8 md:px-6">
      <button onClick={() => router.back()} className="mb-6 flex items-center gap-1.5 text-sm text-white/55 transition hover:text-white">
        <ArrowLeft className="size-4" /> Volver
      </button>

      <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:gap-12">
        {/* Arte */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <motion.div
            initial={{ opacity: 0, scale: 0.94, rotateX: 8 }}
            animate={{ opacity: 1, scale: 1, rotateX: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            style={{ perspective: 1000 }}
          >
            <Glass className="rounded-[34px] p-3">
              <GameArt product={pr} className="aspect-[4/5] rounded-[26px]" big />
            </Glass>
          </motion.div>
          <div className="mt-4 grid grid-cols-3 gap-2 text-center">
            {[
              { icon: Zap, t: "Entrega", d: "automática" },
              { icon: MonitorPlay, t: "Video", d: "tutorial" },
              { icon: BadgeCheck, t: "Garantía", d: "6 meses" },
            ].map(({ icon: I, t, d }, i) => (
              <motion.div
                key={t}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.08 }}
                className="rounded-2xl bg-white/[0.04] p-3 ring-1 ring-white/8"
              >
                <I className="mx-auto size-5" style={{ color: pl.color }} />
                <p className="mt-1.5 text-xs font-medium text-white">{t}</p>
                <p className="text-[11px] text-white/45">{d}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Info */}
        <div>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="flex flex-wrap items-center gap-2">
              <PlatformBadge id={pr.platform} size="md" />
              {pr.release && (
                <span className="flex items-center gap-1 rounded-full bg-white/8 px-3 py-1 text-xs text-white">
                  <Clock className="size-3.5" /> {pr.release === "preventa" ? "Preventa" : "Estreno"}
                </span>
              )}
              <span className="flex items-center gap-1.5 text-xs text-white/50">
                <Eye className="size-3.5" />
                <motion.span key={viewers} initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}>
                  {viewers}
                </motion.span>{" "}
                personas viendo ahora
              </span>
            </div>
            <h1 className="mt-4 text-balance text-4xl font-semibold leading-[1.05] tracking-tight text-white md:text-5xl">{pr.title}</h1>
            <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-white/55">
              {pr.reviews > 0 ? (
                <span className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`size-4 ${i < Math.round(pr.rating) ? "fill-brand text-brand" : "text-white/20"}`} />
                  ))}
                  <span className="ml-1 text-white">{pr.rating.toFixed(1)}</span>
                  <span>({pr.reviews} reseñas)</span>
                </span>
              ) : (
                <span>Sin reseñas aún</span>
              )}
              <span className="text-white/25">·</span>
              {pr.genres.map((g) => GENRES[g]).join(", ")}
            </div>
            <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-white/60">{pr.description}</p>
          </motion.div>

          {/* Compra */}
          <Glass
            className="mt-7 rounded-[28px] p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.6 }}
          >
            <div className="flex flex-wrap items-center justify-between gap-4">
              <p className="text-sm font-medium text-white/75">Tipo de cuenta</p>
              <AccountToggle id="pdp" value={type} onChange={setType} />
            </div>

            <AnimatePresence mode="wait">
              <motion.ul
                key={type}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="mt-5 space-y-2.5"
              >
                {BENEFITS[type].map(({ icon: I, t }) => (
                  <li key={t} className="flex items-center gap-3 text-sm text-white/70">
                    <span className="grid size-7 place-items-center rounded-lg" style={{ background: pl.soft }}>
                      <I className="size-3.5" style={{ color: pl.color }} />
                    </span>
                    {t}
                  </li>
                ))}
              </motion.ul>
            </AnimatePresence>

            <div className="mt-6 flex flex-wrap items-end justify-between gap-4 border-t border-white/8 pt-5">
              <div>
                <p className="flex items-center gap-2 text-sm text-white/40">
                  <span className="line-through">{clp(pr.listPrice)}</span>
                  <motion.span
                    key={type}
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="rounded-md bg-brand px-1.5 text-xs font-bold text-brand-ink"
                  >
                    -{discountPct(pr, type)}%
                  </motion.span>
                </p>
                <p className="text-4xl font-semibold tracking-tight text-white">
                  <AnimatedNumber value={price} format={clp} />
                </p>
                <p className="mt-1 text-xs text-emerald-400">Ahorras {clp(pr.listPrice - price)}</p>
              </div>
              <p className="flex items-center gap-1.5 text-xs text-orange-300/90">
                <AlertTriangle className="size-3.5" />
                Quedan {type === "primaria" ? pr.stockPrimaria : pr.stockSecundaria} cupos {type}
              </p>
            </div>

            {owned && (
              <p className="mt-4 flex items-center gap-2 rounded-xl bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300">
                <Check className="size-4" /> Ya tienes este juego en tu biblioteca
              </p>
            )}

            <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  addToCart(pr.id, type);
                  setAdded(true);
                  setTimeout(() => setAdded(false), 1600);
                }}
                className="flex h-12 items-center justify-center gap-2 rounded-2xl bg-white/8 font-semibold text-white ring-1 ring-white/15 transition hover:bg-white/14"
              >
                <AnimatePresence mode="wait" initial={false}>
                  {added ? (
                    <motion.span key="ok" initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -10, opacity: 0 }} className="flex items-center gap-2">
                      <Check className="size-4 text-emerald-400" /> Agregado
                    </motion.span>
                  ) : (
                    <motion.span key="add" initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -10, opacity: 0 }} className="flex items-center gap-2">
                      <ShoppingBag className="size-4" /> Agregar al carrito
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  addToCart(pr.id, type);
                  setCartOpen(false);
                  router.push("/checkout");
                }}
                className="flex h-12 items-center justify-center gap-2 rounded-2xl bg-brand font-semibold text-brand-ink shadow-[0_10px_40px_-10px_rgba(250,204,21,0.6)] transition hover:brightness-110"
              >
                <Zap className="size-4" /> Comprar ahora
              </motion.button>
            </div>
          </Glass>

          {/* Verificador de espacio */}
          <Glass className="mt-4 rounded-[28px] p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
            <div className="flex items-center justify-between">
              <p className="flex items-center gap-2 text-sm font-medium text-white">
                <HardDrive className="size-4" style={{ color: pl.color }} /> ¿Te cabe en la consola?
              </p>
              <span className="text-xs text-white/45">Necesita {pr.requiredGb} GB</span>
            </div>
            <label className="mt-4 block text-xs text-white/50">
              Espacio libre en tu {pl.short}: <span className="font-semibold text-white">{free} GB</span>
            </label>
            <input type="range" min={10} max={500} step={5} value={free} onChange={(e) => setFree(+e.target.value)} className="mt-2 w-full accent-[#facc15]" />
            <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-white/8">
              <motion.div
                className="h-full rounded-full"
                animate={{ width: `${Math.min(100, (pr.requiredGb / free) * 100)}%`, background: enough ? pl.color : "#ef4444" }}
                transition={{ type: "spring", stiffness: 120, damping: 20 }}
              />
            </div>
            <AnimatePresence mode="wait">
              <motion.p
                key={String(enough)}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`mt-3 text-sm ${enough ? "text-emerald-400" : "text-red-400"}`}
              >
                {enough
                  ? `Listo. Te quedarán ${free - pr.requiredGb} GB libres después de instalar.`
                  : `Te faltan ${pr.requiredGb - free} GB. Libera espacio antes de descargar.`}
              </motion.p>
            </AnimatePresence>
          </Glass>

          {/* Ficha técnica */}
          <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            {[
              { icon: Languages, l: "Voces", v: pr.voices },
              { icon: Languages, l: "Textos", v: pr.texts },
              { icon: Download, l: "Peso", v: `${pr.sizeGb} GB` },
              { icon: HardDrive, l: "Requerido", v: `${pr.requiredGb} GB` },
            ].map(({ icon: I, l, v }) => (
              <div key={l} className="rounded-2xl bg-white/[0.04] p-3.5 ring-1 ring-white/8">
                <I className="size-4 text-white/40" />
                <p className="mt-2 text-[11px] uppercase tracking-wider text-white/40">{l}</p>
                <p className="text-sm font-medium text-white">{v}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {also.length > 0 && (
        <section className="mt-24">
          <Reveal>
            <SectionTitle eyebrow="Filtrado colaborativo" icon={<Users className="size-3.5 text-brand" />} title="Quienes compraron este juego también compraron" />
          </Reveal>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
            {also.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} reason={`Comprado junto a ${pr.title}`} kind="colaborativo" />
            ))}
          </div>
        </section>
      )}

      {similar.length > 0 && (
        <section className="mt-16">
          <Reveal>
            <SectionTitle eyebrow="Basado en contenido" icon={<Sparkles className="size-3.5 text-brand" />} title={`Más juegos de ${pr.genres.map((g) => GENRES[g].toLowerCase()).slice(0, 2).join(" y ")}`} />
          </Reveal>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
            {similar.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
