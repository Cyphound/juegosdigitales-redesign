"use client";

import Link from "next/link";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import {
  ArrowRight,
  Brain,
  Check,
  Flame,
  Info,
  SlidersHorizontal,
  Sparkles,
  TrendingUp,
  Trophy,
  Star,
  UserRound,
  Users,
  Zap,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useStore } from "@/lib/store";
import { GENRES, PLATFORMS, PRODUCTS, clp, discountPct } from "@/lib/data";
import { recommendFor, trending } from "@/lib/recommend";
import { demandTable } from "@/lib/forecast";
import { GameArt } from "@/components/GameArt";
import { ProductCard } from "@/components/ProductCard";
import { Countdown, Glass, PlatformBadge, Reveal, SectionTitle } from "@/components/ui";
import { useAmbient } from "@/components/Shell";
import { PrefsModal } from "@/components/PrefsModal";
import { RealImage, hasImage } from "@/components/RealImage";

const hasConsoleImg = (id: string) => hasImage(`/consoles/${id}`);

export default function Home() {
  const { user, ready, addToCart, setCartOpen } = useStore();
  const [prefsOpen, setPrefsOpen] = useState(false);
  const platform = user?.platform ?? null;
  useAmbient(platform ? PLATFORMS[platform].color : "#8467ff");

  useEffect(() => {
    if (ready && user && user.role === "cliente" && !user.platform) {
      const t = setTimeout(() => setPrefsOpen(true), 700);
      return () => clearTimeout(t);
    }
  }, [ready, user]);

  const recs = useMemo(() => recommendFor(user, 8), [user]);
  const hero = user?.platform ? recs[0]?.product : PRODUCTS.find((p) => p.id === "gta-6-ps5")!;
  const flash = useMemo(
    () =>
      PRODUCTS.filter((p) => !p.release && p.kind !== "membresia" && (!platform || p.platform === platform))
        .sort((a, b) => discountPct(b) - discountPct(a))
        .slice(0, 4),
    [platform]
  );
  const rising = useMemo(
    () => demandTable().filter((d) => !platform || d.pr.platform === platform).sort((a, b) => b.trendPct - a.trendPct).slice(0, 3),
    [platform]
  );

  if (!ready) return <div className="h-[80vh]" />;

  return (
    <div className="mx-auto max-w-7xl px-4 md:px-6">
      {/* ---------------- HERO personalizado ---------------- */}
      <section className="grid items-center gap-8 pb-16 pt-12 lg:grid-cols-[1.05fr_1fr] lg:pt-16">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/6 py-1 pl-1 pr-3 text-xs text-white/70 ring-1 ring-white/10"
          >
            <span className="whitespace-nowrap rounded-full bg-brand px-2 py-0.5 font-semibold text-brand-ink">Black Friday</span>
            Hasta 90% de descuento en cuentas digitales
          </motion.div>

          <AnimatePresence mode="wait">
            <motion.h1
              key={user?.email ?? "guest"}
              initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="text-balance text-5xl font-semibold leading-[1.02] tracking-tight text-white md:text-6xl lg:text-7xl"
            >
              {user ? (
                <>
                  Hola, {user.name}.
                  <br />
                  <span className="text-white/45">
                    {platform ? (
                      <>
                        Tu tienda{" "}
                        <span style={{ color: PLATFORMS[platform].color }}>{PLATFORMS[platform].short}</span> está lista.
                      </>
                    ) : (
                      "Armemos tu tienda."
                    )}
                  </span>
                </>
              ) : (
                <>
                  Juegos digitales
                  <br />
                  <span className="shine">al instante.</span>
                </>
              )}
            </motion.h1>
          </AnimatePresence>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
            className="mt-5 max-w-lg text-lg text-white/55"
          >
            {user?.platform
              ? `Elegimos estos juegos según lo que juegas: ${user.genres.map((g) => GENRES[g].toLowerCase()).join(", ") || "tu historial"}.`
              : "Cuentas primarias y secundarias para PS5, PS4, Xbox y Switch. Paga con tarjeta y recibe tu juego en minutos."}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <Link
              href={hero ? `/producto/${hero.id}` : "/catalogo"}
              className="group flex h-12 items-center gap-2 rounded-2xl bg-brand px-6 font-semibold text-brand-ink transition hover:brightness-110"
            >
              {hero ? "Ver recomendado" : "Explorar catálogo"}
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
            {user?.role === "cliente" ? (
              <button
                onClick={() => setPrefsOpen(true)}
                className="flex h-12 items-center gap-2 rounded-2xl bg-white/6 px-5 text-sm font-medium text-white ring-1 ring-white/12 transition hover:bg-white/12"
              >
                <SlidersHorizontal className="size-4" /> Editar mis gustos
              </button>
            ) : !user ? (
              <Link
                href="/login"
                className="flex h-12 items-center gap-2 rounded-2xl bg-white/6 px-5 text-sm font-medium text-white ring-1 ring-white/12 transition hover:bg-white/12"
              >
                <UserRound className="size-4" /> Personalizar con mi cuenta
              </Link>
            ) : null}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-10 flex gap-8 text-white"
          >
            {[
              ["19", "años vendiendo"],
              ["+500K", "seguidores"],
              ["2 min", "entrega promedio"],
            ].map(([n, l]) => (
              <div key={l}>
                <p className="text-2xl font-semibold tracking-tight">{n}</p>
                <p className="text-xs text-white/45">{l}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Juego destacado */}
        <AnimatePresence mode="wait">
          {hero && (
            <motion.div
              key={hero.id}
              initial={{ opacity: 0, scale: 0.92, rotateY: -12 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              style={{ perspective: 1200 }}
              className="relative"
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              >
                <Glass className="rounded-[32px] p-2.5">
                  <Link href={`/producto/${hero.id}`} className="block overflow-hidden rounded-[24px]">
                    <GameArt product={hero} className="aspect-[16/11]" big />
                  </Link>
                  <div className="flex flex-wrap items-center justify-between gap-3 px-3 pb-2 pt-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <PlatformBadge id={hero.platform} />
                        {recs[0] && user?.platform && (
                          <span className="flex items-center gap-1 text-xs text-white/55">
                            <Sparkles className="size-3.5 text-brand" /> {recs[0].reason}
                          </span>
                        )}
                        {hero.release === "preventa" && <span className="text-xs text-white/55">Preventa</span>}
                      </div>
                      <p className="mt-1.5 text-lg font-semibold text-white">{hero.title}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-xs text-white/40 line-through">{clp(hero.listPrice)}</p>
                        <p className="text-xl font-semibold text-white">{clp(hero.priceSecundaria)}</p>
                      </div>
                      <motion.button
                        whileTap={{ scale: 0.92 }}
                        onClick={() => {
                          addToCart(hero.id, "secundaria");
                          setCartOpen(true);
                        }}
                        className="h-11 rounded-xl bg-white px-4 text-sm font-semibold text-black transition hover:bg-white/85"
                      >
                        Comprar
                      </motion.button>
                    </div>
                  </div>
                </Glass>
              </motion.div>
              {/* chip flotante de prueba social */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1 }}
                className="absolute -left-8 top-[42%] hidden md:block"
              >
                <Glass className="rounded-2xl px-4 py-3">
                  <p className="flex items-center gap-2 text-xs text-white/60">
                    <Flame className="size-4 text-orange-400" />
                    <span>
                      <b className="text-white">{hero.soldWeek}</b> vendidos esta semana
                    </span>
                  </p>
                </Glass>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* ---------------- Plataformas ---------------- */}
      <Reveal>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
          {Object.values(PLATFORMS).map((pl, i) => {
            const count = PRODUCTS.filter((p) => p.platform === pl.id).length;
            const mine = platform === pl.id;
            return (
              <motion.div key={pl.id} whileHover={{ y: -4 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
                <Link
                  href={`/catalogo?plataforma=${pl.id}`}
                  className={`group relative flex h-full flex-col overflow-hidden rounded-3xl ring-1 ring-white/8 transition ${hasConsoleImg(pl.id) ? "p-4" : "p-5"}`}
                  style={{ background: `linear-gradient(150deg, ${pl.soft}, color-mix(in srgb, var(--color-white) 2%, transparent))` }}
                >
                  <motion.span
                    className="absolute -right-8 -top-8 size-32 rounded-full blur-2xl"
                    style={{ background: pl.color }}
                    animate={{ opacity: [0.25, 0.45, 0.25] }}
                    transition={{ duration: 4, repeat: Infinity, delay: i * 0.5 }}
                  />
                  {mine && (
                    <span className="absolute right-3 top-3 z-10 flex items-center gap-1 rounded-full bg-black/40 px-2 py-0.5 text-[10px] text-white ring-1 ring-white/10 backdrop-blur">
                      <Check className="size-3" /> Tu consola
                    </span>
                  )}

                  {hasConsoleImg(pl.id) ? (
                    <>
                      {/* escenario: la consola queda en su propio espacio y no tapa el texto */}
                      <div className="relative flex h-28 items-end justify-center md:h-32">
                        <span
                          className="absolute bottom-0 left-1/2 h-4 w-3/4 -translate-x-1/2 rounded-[50%] blur-md transition-all duration-500 group-hover:w-2/3 group-hover:opacity-60"
                          style={{ background: `radial-gradient(closest-side, ${pl.color}99, transparent)` }}
                        />
                        <RealImage
                          base={`/consoles/${pl.id}`}
                          alt={pl.name}
                          className="relative max-h-full w-auto max-w-[85%] object-contain drop-shadow-[0_10px_18px_rgba(0,0,0,0.35)] transition-transform duration-500 ease-out group-hover:-translate-y-2 group-hover:scale-[1.06]"
                        />
                      </div>
                      <div className="relative mt-3 flex items-end justify-between gap-2">
                        <span className="text-2xl font-black italic leading-none tracking-tight text-white">{pl.short}</span>
                        <span className="flex items-center gap-1 text-xs text-white/55">
                          {count} juegos
                          <ArrowRight className="size-3.5 transition group-hover:translate-x-0.5" style={{ color: pl.color }} />
                        </span>
                      </div>
                    </>
                  ) : (
                    <>
                      <span className="relative text-3xl font-black italic tracking-tight text-white">{pl.short}</span>
                      <p className="relative mt-6 flex items-center justify-between text-sm text-white/55">
                        {count} juegos
                        <ArrowRight className="size-4 -translate-x-2 opacity-0 transition group-hover:translate-x-0 group-hover:opacity-100" style={{ color: pl.color }} />
                      </p>
                    </>
                  )}
                </Link>
              </motion.div>
            );
          })}
        </div>
      </Reveal>

      {/* ---------------- Recomendados ---------------- */}
      <section className="mt-20">
        <Reveal>
          <SectionTitle
            eyebrow={user?.platform ? "Recomendado para ti" : "Lo más vendido"}
            icon={user?.platform ? <Sparkles className="size-3.5 text-brand" /> : <Trophy className="size-3.5 text-brand" />}
            title={user?.platform ? `Elegidos para ${user.name}` : "Los favoritos de la comunidad"}
            right={<RecInfo />}
          />
        </Reveal>
        <LayoutGroup>
          <motion.div layout className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
            <AnimatePresence mode="popLayout">
              {(user?.platform ? recs : trending(null, 8).map((p) => ({ product: p, reason: "Tendencia esta semana", kind: "popularidad" as const }))).map(
                (r, i) => (
                  <ProductCard key={r.product.id} product={r.product} reason={r.reason} kind={r.kind} index={i} />
                )
              )}
            </AnimatePresence>
          </motion.div>
        </LayoutGroup>
      </section>

      {/* ---------------- Oferta flash ---------------- */}
      <section className="mt-20">
        <Reveal>
          <Glass className="overflow-hidden rounded-[32px] p-6 md:p-8">
            <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-[0.18em] text-brand">
                  <Zap className="size-3.5" /> Oferta flash
                </p>
                <h2 className="mt-1.5 text-2xl font-semibold tracking-tight text-white md:text-3xl">Termina hoy</h2>
              </div>
              <Countdown hours={7} />
            </div>
            <div className="no-scrollbar -mx-2 flex gap-3 overflow-x-auto px-2 pb-1">
              {flash.map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, x: 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.5 }}
                  className="min-w-[260px] flex-1"
                >
                  <Link
                    href={`/producto/${p.id}`}
                    className="group flex items-center gap-4 rounded-2xl bg-black/25 p-3 ring-1 ring-white/8 transition hover:bg-black/40"
                  >
                    <GameArt product={p} showTitle={false} className="aspect-[3/4] w-20 shrink-0 rounded-xl transition-transform duration-500 group-hover:scale-105" />
                    <div className="min-w-0">
                      <p className="line-clamp-1 font-medium text-white">{p.title}</p>
                      <PlatformBadge id={p.platform} />
                      <p className="mt-2 flex items-baseline gap-2">
                        <span className="text-lg font-semibold text-white">{clp(p.priceSecundaria)}</span>
                        <span className="rounded-md bg-brand px-1.5 text-xs font-bold text-brand-ink">-{discountPct(p)}%</span>
                      </p>
                      <p className="mt-1 text-[11px] text-orange-500">Quedan {p.stockPrimaria} cupos primaria</p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </Glass>
        </Reveal>
      </section>

      {/* ---------------- Primaria vs Secundaria ---------------- */}
      <section className="mt-20">
        <Reveal>
          <SectionTitle eyebrow="Antes de comprar" title="¿Primaria o secundaria?" />
        </Reveal>
        <div className="grid gap-4 md:grid-cols-2">
          {[
            {
              t: "Cuenta secundaria",
              tag: "Precio más bajo",
              items: ["Juegas desde el perfil que te entregamos", "Trofeos y partidas guardadas", "Requiere conexión a internet", "Ideal para ahorrar al máximo"],
              hl: true,
            },
            {
              t: "Cuenta primaria",
              tag: "Tu perfil de siempre",
              items: ["Juegas desde tu cuenta personal", "Tus propios trofeos y logros", "Funciona sin conexión", "Ideal si compartes la consola"],
              hl: false,
            },
          ].map((c, i) => (
            <Reveal key={c.t} delay={i * 0.1}>
              <Glass className="h-full rounded-[28px] p-7">
                <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${c.hl ? "bg-brand text-brand-ink" : "bg-white/10 text-white"}`}>
                  {c.tag}
                </span>
                <h3 className="mt-4 text-2xl font-semibold tracking-tight text-white">{c.t}</h3>
                <ul className="mt-5 space-y-3">
                  {c.items.map((it, k) => (
                    <motion.li
                      key={it}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 + k * 0.07 }}
                      className="flex items-center gap-3 text-[15px] text-white/70"
                    >
                      <span className="grid size-5 place-items-center rounded-full bg-white/10">
                        <Check className="size-3 text-white" strokeWidth={3} />
                      </span>
                      {it}
                    </motion.li>
                  ))}
                </ul>
              </Glass>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------------- Tendencias predichas ---------------- */}
      <section className="mt-20">
        <Reveal>
          <SectionTitle
            eyebrow="Predicción de demanda"
            icon={<Brain className="size-3.5 text-brand" />}
            title="Van a estar en todas partes"
          />
        </Reveal>
        <div className="grid gap-4 md:grid-cols-3">
          {rising.map((d, i) => (
            <Reveal key={d.pr.id} delay={i * 0.1}>
              <Link href={`/producto/${d.pr.id}`}>
                <Glass className="group rounded-[26px] p-2.5" whileHover={{ y: -5 }}>
                  <div className="overflow-hidden rounded-[19px]">
                    <GameArt product={d.pr} className="aspect-[16/9] transition-transform duration-700 group-hover:scale-105" />
                  </div>
                  <div className="flex items-center justify-between px-2.5 pb-1.5 pt-3.5">
                    <PlatformBadge id={d.pr.platform} />
                    <span className="flex items-center gap-1 text-sm font-semibold text-emerald-500">
                      <TrendingUp className="size-4" /> +{d.trendPct}% demanda
                    </span>
                  </div>
                </Glass>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------------- Opiniones ---------------- */}
      <section id="opiniones" className="mt-20 scroll-mt-32">
        <Reveal>
          <SectionTitle eyebrow="Opiniones" icon={<Star className="size-3.5 text-brand" />} title="Lo que dicen los gamers" />
        </Reveal>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          {[
            { n: "Samuel V.", t: "hace 5 días", q: "Fue mi primera compra aquí. Me enviaron el juego y me ayudaron a instalarlo." },
            { n: "Clara A.", t: "hace 1 semana", q: "Siempre tienen los mejores juegos. Muy buena página." },
            { n: "Raúl D.", t: "hace 3 semanas", q: "Me llegó el juego que pedí sin problemas. Ya voy por el siguiente." },
            { n: "Diego C.", t: "hace 1 mes", q: "Me lo mandaron el mismo día. La próxima pruebo el envío prioritario." },
          ].map((r, i) => (
            <Reveal key={r.n} delay={i * 0.08}>
              <Glass className="h-full rounded-[24px] p-5" whileHover={{ y: -4 }}>
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, k) => (
                    <Star key={k} className="size-3.5 fill-brand text-brand" />
                  ))}
                </div>
                <p className="mt-3 text-[15px] leading-relaxed text-white/80">{r.q}</p>
                <div className="mt-5 flex items-center gap-2.5">
                  <span className="bg-brand-gradient grid size-8 place-items-center rounded-full text-xs font-bold text-[#fff]">{r.n[0]}</span>
                  <div>
                    <p className="text-sm font-medium text-white">{r.n}</p>
                    <p className="text-[11px] text-white/40">{r.t} · compra verificada</p>
                  </div>
                </div>
              </Glass>
            </Reveal>
          ))}
        </div>
        <p className="mt-3 text-xs text-white/35">Reseñas tomadas del sitio actual de la tienda.</p>
      </section>

      <PrefsModal open={prefsOpen} onClose={() => setPrefsOpen(false)} />
    </div>
  );
}

function RecInfo() {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 rounded-full bg-white/6 px-3 py-1.5 text-xs text-white/60 ring-1 ring-white/10 transition hover:text-white"
      >
        <Info className="size-3.5" /> ¿Cómo recomendamos?
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            className="lg lg-strong absolute right-0 top-10 z-30 w-80 rounded-2xl p-4"
          >
            <div className="relative z-[2]">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-white">Motor híbrido</p>
                <button onClick={() => setOpen(false)} aria-label="Cerrar" className="text-white/50 hover:text-white">
                  <X className="size-4" />
                </button>
              </div>
              {[
                { icon: Users, t: "Colaborativo · 45%", d: "Juegos que compraron clientes con un historial parecido al tuyo." },
                { icon: Sparkles, t: "Contenido · 35%", d: "Coincidencia entre los géneros del juego y tus gustos." },
                { icon: TrendingUp, t: "Popularidad · 20%", d: "Ventas de la semana, para perfiles nuevos." },
              ].map(({ icon: I, t, d }) => (
                <div key={t} className="mt-3 flex gap-3">
                  <I className="mt-0.5 size-4 shrink-0 text-brand" />
                  <div>
                    <p className="text-[13px] font-medium text-white">{t}</p>
                    <p className="text-xs text-white/50">{d}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
