"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  Brain,
  CircleDollarSign,
  Clock,
  Lock,
  MousePointerClick,
  Package,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useStore } from "@/lib/store";
import { PLATFORMS, PRODUCTS, clp } from "@/lib/data";
import { FUTURE_LABELS, WEEK_LABELS, demandTable } from "@/lib/forecast";
import { AnimatedNumber, Glass, PlatformBadge, Reveal } from "@/components/ui";
import { useAmbient } from "@/components/Shell";

export default function AdminPage() {
  const { user, ready } = useStore();
  useAmbient("#facc15");
  const table = useMemo(() => demandTable(), []);
  const top = useMemo(() => [...table].sort((a, b) => b.next2 - a.next2).slice(0, 5), [table]);
  const [sel, setSel] = useState(0);

  if (!ready) return <div className="h-[80vh]" />;
  if (user?.role !== "admin")
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center gap-4 text-center">
        <Lock className="size-10 text-white/30" />
        <p className="text-xl font-semibold text-white">Esta sección es solo para administradores</p>
        <p className="text-sm text-white/50">Ingresa con administrador@correo.cl y cualquier contraseña.</p>
        <Link href="/login" className="rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-brand-ink">
          Iniciar sesión
        </Link>
      </div>
    );

  const kpis = [
    { icon: CircleDollarSign, l: "Ventas de hoy", v: 1284300, f: clp, d: "+18% vs. domingo pasado" },
    { icon: ShoppingCart, l: "Órdenes de hoy", v: 186, f: (n: number) => Math.round(n).toString(), d: "41 fuera de horario de oficina" },
    { icon: Clock, l: "Entrega promedio", v: 1.8, f: (n: number) => n.toFixed(1).replace(".", ",") + " min", d: "Antes: 2 horas (manual)" },
    { icon: TrendingUp, l: "Conversión", v: 3.9, f: (n: number) => n.toFixed(1).replace(".", ",") + "%", d: "+1,2 pts con pago en línea" },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 pt-10 md:px-6">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-white/45">Panel de administración</p>
          <h1 className="mt-1.5 text-4xl font-semibold tracking-tight text-white">Buenas tardes, equipo</h1>
        </div>
        <span className="flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1.5 text-xs text-emerald-300 ring-1 ring-emerald-500/20">
          <motion.span className="size-2 rounded-full bg-emerald-400" animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.6, repeat: Infinity }} />
          Validación de pagos automática · 0 vouchers pendientes
        </span>
      </motion.div>

      {/* KPIs */}
      <div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {kpis.map((k, i) => (
          <Glass key={k.l} className="rounded-[24px] p-5" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <k.icon className="size-5 text-brand" />
            <p className="mt-4 text-xs text-white/50">{k.l}</p>
            <p className="mt-1 text-2xl font-semibold tracking-tight text-white md:text-3xl">
              <CountUp to={k.v} format={k.f} />
            </p>
            <p className="mt-1 text-[11px] text-white/40">{k.d}</p>
          </Glass>
        ))}
      </div>

      {/* Predicción */}
      <div className="mt-4 grid gap-4 lg:grid-cols-[1.6fr_1fr]">
        <Reveal>
          <Glass className="h-full rounded-[28px] p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-[0.16em] text-brand">
                  <Brain className="size-3.5" /> Machine learning
                </p>
                <h2 className="mt-1 text-xl font-semibold text-white">Predicción de demanda semanal</h2>
                <p className="text-xs text-white/45">Suavizamiento de Holt + factor de eventos (Black Friday, Navidad)</p>
              </div>
            </div>
            <div className="no-scrollbar mt-4 flex gap-1.5 overflow-x-auto">
              {top.map((t, i) => (
                <button
                  key={t.pr.id}
                  onClick={() => setSel(i)}
                  className={`relative shrink-0 rounded-full px-3 py-1.5 text-xs transition-colors ${sel === i ? "text-black" : "text-white/60 hover:text-white"}`}
                >
                  {sel === i && <motion.span layoutId="fc-pill" className="absolute inset-0 rounded-full bg-white" />}
                  <span className="relative">{t.pr.title}</span>
                </button>
              ))}
            </div>
            <ForecastChart key={top[sel].pr.id} item={top[sel]} />
          </Glass>
        </Reveal>

        <Reveal delay={0.1}>
          <Glass className="h-full rounded-[28px] p-6">
            <p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-[0.16em] text-white/45">
              <Users className="size-3.5" /> Clientes por plataforma
            </p>
            <Donut />
            <p className="mt-7 text-xs font-medium uppercase tracking-[0.16em] text-white/45">Géneros más vendidos</p>
            <div className="mt-3 space-y-2.5">
              {[
                ["Acción", 34],
                ["Shooter", 21],
                ["Deportes", 15],
                ["Aventura", 14],
                ["RPG", 9],
              ].map(([g, v], i) => (
                <div key={g as string} className="flex items-center gap-3 text-sm">
                  <span className="w-20 text-white/70">{g}</span>
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/8">
                    <motion.div
                      className="h-full rounded-full bg-white/70"
                      initial={{ width: 0 }}
                      whileInView={{ width: `${((v as number) / 34) * 100}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: i * 0.08 }}
                    />
                  </div>
                  <span className="w-9 text-right tabular-nums text-white">{v}%</span>
                </div>
              ))}
            </div>
          </Glass>
        </Reveal>
      </div>

      {/* Inventario */}
      <Reveal>
        <Glass className="mt-4 rounded-[28px] p-6">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-[0.16em] text-brand">
                <Package className="size-3.5" /> Análisis de inventario
              </p>
              <h2 className="mt-1 text-xl font-semibold text-white">Cuentas que conviene preparar</h2>
              <p className="text-xs text-white/45">Demanda estimada de las próximas 2 semanas vs. cupos disponibles (1 cuenta = 1 primaria + 2 secundarias)</p>
            </div>
          </div>
          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="text-xs text-white/40">
                <tr>
                  <th className="pb-3 font-medium">Juego</th>
                  <th className="pb-3 font-medium">Cupos listos</th>
                  <th className="pb-3 font-medium">Demanda 2 sem.</th>
                  <th className="pb-3 font-medium">Cobertura</th>
                  <th className="pb-3 text-right font-medium">Sugerencia</th>
                </tr>
              </thead>
              <tbody>
                {table.slice(0, 8).map((r, i) => {
                  const cov = Math.min(1, r.stock / Math.max(1, r.next2));
                  const status = cov < 0.4 ? "crit" : cov < 0.75 ? "warn" : "ok";
                  const color = status === "crit" ? "#ef4444" : status === "warn" ? "#f59e0b" : "#22c55e";
                  return (
                    <motion.tr
                      key={r.pr.id}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.05 }}
                      className="border-t border-white/6"
                    >
                      <td className="py-3">
                        <div className="flex items-center gap-2.5">
                          <PlatformBadge id={r.pr.platform} />
                          <span className="text-white">{r.pr.title}</span>
                        </div>
                      </td>
                      <td className="py-3 tabular-nums text-white/70">{r.stock}</td>
                      <td className="py-3 tabular-nums text-white/70">
                        {r.next2}{" "}
                        <span className={r.trendPct >= 0 ? "text-emerald-400" : "text-red-400"}>
                          ({r.trendPct >= 0 ? "+" : ""}
                          {r.trendPct}%)
                        </span>
                      </td>
                      <td className="py-3">
                        <div className="h-1.5 w-32 overflow-hidden rounded-full bg-white/8">
                          <motion.div
                            className="h-full rounded-full"
                            style={{ background: color }}
                            initial={{ width: 0 }}
                            whileInView={{ width: `${cov * 100}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.9, delay: 0.2 + i * 0.05 }}
                          />
                        </div>
                      </td>
                      <td className="py-3 text-right">
                        {r.accountsNeeded > 0 ? (
                          <span className="rounded-full px-2.5 py-1 text-xs font-medium" style={{ background: color + "22", color }}>
                            Preparar {r.accountsNeeded} cuentas
                          </span>
                        ) : (
                          <span className="text-xs text-white/40">Stock suficiente</span>
                        )}
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Glass>
      </Reveal>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Reveal>
          <Glass className="h-full rounded-[28px] p-6">
            <p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-[0.16em] text-brand">
              <Sparkles className="size-3.5" /> Sistema de recomendación
            </p>
            <h2 className="mt-1 text-xl font-semibold text-white">Rendimiento por modelo</h2>
            <p className="text-xs text-white/45">27% de las ventas de la semana vinieron de una recomendación</p>
            <div className="mt-6 space-y-5">
              {[
                { l: "Colaborativo (ítem-ítem)", ctr: 8.4, conv: 31 },
                { l: "Basado en contenido", ctr: 6.1, conv: 22 },
                { l: "Popularidad (arranque en frío)", ctr: 3.2, conv: 11 },
              ].map((m, i) => (
                <div key={m.l}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/80">{m.l}</span>
                    <span className="flex items-center gap-1 tabular-nums text-white">
                      <MousePointerClick className="size-3.5 text-white/40" /> CTR {m.ctr.toString().replace(".", ",")}%
                    </span>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/8">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-brand to-amber-300"
                      initial={{ width: 0 }}
                      whileInView={{ width: `${(m.ctr / 10) * 100}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-7 grid grid-cols-3 gap-2.5">
              {[
                ["27%", "ventas desde recomendaciones"],
                ["+18%", "ticket promedio"],
                ["1,9", "juegos por orden"],
              ].map(([v, l]) => (
                <div key={l} className="rounded-2xl bg-white/[0.04] p-3.5 ring-1 ring-white/6">
                  <p className="text-xl font-semibold tracking-tight text-white">{v}</p>
                  <p className="mt-0.5 text-[11px] leading-snug text-white/45">{l}</p>
                </div>
              ))}
            </div>
          </Glass>
        </Reveal>
        <Reveal delay={0.1}>
          <LiveOrders />
        </Reveal>
      </div>
    </div>
  );
}

function CountUp({ to, format }: { to: number; format: (n: number) => string }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setV(to), 150);
    return () => clearTimeout(t);
  }, [to]);
  return <AnimatedNumber value={v} format={format} />;
}

/* ---------------- Gráfico de predicción ---------------- */
function ForecastChart({ item }: { item: ReturnType<typeof demandTable>[number] }) {
  const W = 640;
  const H = 240;
  const P = { l: 34, r: 12, t: 16, b: 28 };
  const hist = item.history;
  const fc = item.forecast;
  const n = hist.length + fc.length;
  const max = Math.max(...hist, ...fc.map((f) => f.high)) * 1.1;
  const x = (i: number) => P.l + (i / (n - 1)) * (W - P.l - P.r);
  const y = (v: number) => H - P.b - (v / max) * (H - P.t - P.b);
  const [hover, setHover] = useState<number | null>(null);
  const color = PLATFORMS[item.pr.platform].color;

  const histPath = hist.map((v, i) => `${i ? "L" : "M"}${x(i)},${y(v)}`).join(" ");
  const fcPts = [{ value: hist[hist.length - 1], low: hist[hist.length - 1], high: hist[hist.length - 1] }, ...fc];
  const off = hist.length - 1;
  const fcPath = fcPts.map((f, i) => `${i ? "L" : "M"}${x(off + i)},${y(f.value)}`).join(" ");
  const band =
    fcPts.map((f, i) => `${i ? "L" : "M"}${x(off + i)},${y(f.high)}`).join(" ") +
    " " +
    [...fcPts].reverse().map((f, i) => `L${x(off + fcPts.length - 1 - i)},${y(f.low)}`).join(" ") +
    " Z";
  const area = `${histPath} L${x(hist.length - 1)},${H - P.b} L${x(0)},${H - P.b} Z`;
  const labels = [...WEEK_LABELS, ...FUTURE_LABELS];
  const all = [...hist, ...fc.map((f) => f.value)];

  return (
    <div className="relative mt-4">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" onMouseLeave={() => setHover(null)}>
        <defs>
          <linearGradient id="hist-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.35" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0.25, 0.5, 0.75, 1].map((g) => (
          <g key={g}>
            <line x1={P.l} x2={W - P.r} y1={y(max * g)} y2={y(max * g)} stroke="rgba(255,255,255,0.06)" />
            <text x={P.l - 8} y={y(max * g) + 4} textAnchor="end" fontSize="10" fill="rgba(255,255,255,0.35)">
              {Math.round(max * g)}
            </text>
          </g>
        ))}
        <line x1={x(off)} x2={x(off)} y1={P.t} y2={H - P.b} stroke="rgba(255,255,255,0.25)" strokeDasharray="3 4" />
        <text x={x(off) + 6} y={P.t + 10} fontSize="10" fill="rgba(255,255,255,0.55)">
          hoy
        </text>

        <motion.path d={area} fill="url(#hist-fill)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }} />
        <motion.path d={band} fill="#facc15" fillOpacity={0.12} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1, duration: 0.6 }} />
        <motion.path
          d={histPath}
          fill="none"
          stroke={color}
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.1, ease: "easeInOut" }}
        />
        <motion.path
          d={fcPath}
          fill="none"
          stroke="#facc15"
          strokeWidth={2.5}
          strokeDasharray="6 6"
          strokeLinecap="round"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
        />
        {all.map((v, i) => (
          <g key={i} onMouseEnter={() => setHover(i)}>
            <rect x={x(i) - 12} y={P.t} width={24} height={H - P.t - P.b} fill="transparent" />
            {(i % 3 === 0 || i >= hist.length) && (
              <text x={x(i)} y={H - 8} textAnchor="middle" fontSize="9.5" fill={i >= hist.length ? "rgba(250,204,21,0.8)" : "rgba(255,255,255,0.35)"}>
                {labels[i].split(" ")[0]}
              </text>
            )}
            {hover === i && <circle cx={x(i)} cy={y(v)} r={5} fill={i >= hist.length ? "#facc15" : color} stroke="#000" strokeWidth={2} />}
          </g>
        ))}
      </svg>
      <AnimatePresence>
        {hover !== null && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="lg lg-strong pointer-events-none absolute top-0 rounded-xl px-3 py-2 text-xs"
            style={{ left: `${(x(hover) / W) * 100}%`, transform: "translateX(-50%)" }}
          >
            <span className="relative z-[2] block text-white/50">{labels[hover]}</span>
            <span className="relative z-[2] block font-semibold text-white">
              {all[hover]} ventas {hover >= hist.length ? "(predicción)" : ""}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="mt-2 flex flex-wrap gap-4 text-xs text-white/50">
        <span className="flex items-center gap-1.5">
          <span className="h-0.5 w-4 rounded" style={{ background: color }} /> Ventas reales
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-0.5 w-4 rounded bg-brand" /> Predicción
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-3 rounded bg-brand/20" /> Intervalo de confianza
        </span>
        <span className="ml-auto text-white/70">
          Próximas 2 semanas: <b className="text-white">{item.next2} ventas</b>
        </span>
      </div>
    </div>
  );
}

/* ---------------- Dona por plataforma ---------------- */
function Donut() {
  const data = [
    { id: "ps5" as const, v: 48 },
    { id: "ps4" as const, v: 22 },
    { id: "switch" as const, v: 17 },
    { id: "xbox" as const, v: 13 },
  ];
  const R = 70;
  const C = 2 * Math.PI * R;
  let acc = 0;
  return (
    <div className="mt-4 flex flex-col items-center gap-6 sm:flex-row lg:flex-col xl:flex-row">
      <svg viewBox="0 0 200 200" className="size-44 -rotate-90">
        <circle cx="100" cy="100" r={R} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="22" />
        {data.map((d, i) => {
          const len = (d.v / 100) * C;
          const el = (
            <motion.circle
              key={d.id}
              cx="100"
              cy="100"
              r={R}
              fill="none"
              stroke={PLATFORMS[d.id].color}
              strokeWidth="22"
              strokeDasharray={`${len - 3} ${C}`}
              strokeDashoffset={-acc}
              initial={{ strokeDasharray: `0 ${C}` }}
              whileInView={{ strokeDasharray: `${len - 3} ${C}` }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
            />
          );
          acc += len;
          return el;
        })}
      </svg>
      <ul className="w-full space-y-2.5">
        {data.map((d) => (
          <li key={d.id} className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-white/75">
              <span className="size-2.5 rounded-full" style={{ background: PLATFORMS[d.id].color }} />
              {PLATFORMS[d.id].name}
            </span>
            <span className="tabular-nums text-white">{d.v}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------------- Órdenes en vivo ---------------- */
const NAMES = ["Sofía R.", "Benjamín M.", "Martina C.", "Vicente P.", "Isidora L.", "Tomás A.", "Florencia G.", "Agustín V."];
const METHODS = ["Webpay", "Mercado Pago", "MACH", "Transferencia"];

function LiveOrders() {
  const [orders, setOrders] = useState(() =>
    Array.from({ length: 5 }).map((_, i) => makeOrder(i))
  );
  useEffect(() => {
    let k = 5;
    const t = setInterval(() => {
      setOrders((o) => [makeOrder(k++), ...o].slice(0, 5));
    }, 3200);
    return () => clearInterval(t);
  }, []);
  return (
    <Glass className="h-full rounded-[28px] p-6">
      <p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-[0.16em] text-white/45">
        <Activity className="size-3.5" /> En vivo
      </p>
      <h2 className="mt-1 text-xl font-semibold text-white">Órdenes recientes</h2>
      <ul className="mt-4 space-y-2">
        <AnimatePresence initial={false}>
          {orders.map((o) => (
            <motion.li
              key={o.key}
              layout
              initial={{ opacity: 0, y: -20, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
              className="flex items-center gap-3 rounded-2xl bg-white/[0.04] p-3 ring-1 ring-white/6"
            >
              <span className="grid size-9 place-items-center rounded-xl" style={{ background: PLATFORMS[o.p.platform].soft }}>
                <Zap className="size-4" style={{ color: PLATFORMS[o.p.platform].color }} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm text-white">
                  {o.name} · <span className="text-white/60">{o.p.title}</span>
                </p>
                <p className="text-[11px] text-white/40">
                  {o.method} · entregado en {o.secs}s
                </p>
              </div>
              <span className="flex items-center gap-1 text-xs text-emerald-400">
                <ShieldCheck className="size-3.5" /> {clp(o.p.priceSecundaria)}
              </span>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </Glass>
  );
}

function makeOrder(i: number) {
  const p = PRODUCTS[(i * 7 + 3) % PRODUCTS.length];
  return { key: i, p, name: NAMES[i % NAMES.length], method: METHODS[i % METHODS.length], secs: 40 + ((i * 37) % 120) };
}
