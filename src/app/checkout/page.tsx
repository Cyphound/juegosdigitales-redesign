"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CreditCard,
  Eye,
  EyeOff,
  Landmark,
  Loader2,
  Lock,
  Mail,
  ShieldCheck,
  ShoppingBag,
  Smartphone,
  Tag,
  Wallet,
  XCircle,
  Zap,
  KeyRound,
  MonitorPlay,
  UserCheck,
  AlertTriangle,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useStore, Order } from "@/lib/store";
import { PLATFORMS, PlatformId, clp, priceOf, productById } from "@/lib/data";
import { GameArt } from "@/components/GameArt";
import { AnimatedNumber } from "@/components/ui";
import { useAmbient } from "@/components/Shell";

const METHODS = [
  { id: "webpay", name: "Webpay", d: "Débito, crédito y prepago", icon: CreditCard },
  { id: "mercadopago", name: "Mercado Pago", d: "Saldo o tarjetas guardadas", icon: Wallet },
  { id: "mach", name: "MACH", d: "Paga desde la app", icon: Smartphone },
  { id: "transferencia", name: "Transferencia instantánea", d: "Validación automática, sin voucher", icon: Landmark },
];

type Step = 0 | 1 | 2 | 3;

export default function CheckoutPage() {
  const { user, cart, cartTotal, placeOrder, ready } = useStore();
  useAmbient(user?.platform ? PLATFORMS[user.platform].color : "#8467ff");
  const [step, setStep] = useState<Step>(0);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [terms, setTerms] = useState(false);
  const [method, setMethod] = useState("webpay");
  const [coupon, setCoupon] = useState("");
  const [couponOk, setCouponOk] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (user) {
      setEmail(user.role === "cliente" ? user.email : "");
      setName(user.role === "cliente" ? user.name : "");
    }
  }, [user]);

  // La consola se deduce de los juegos del carrito (no se puede elegir otra)
  const cartPlatforms = [...new Set(cart.map((c) => productById(c.id)?.platform).filter(Boolean))] as PlatformId[];
  const mismatched = user?.platform
    ? cart.map((c) => productById(c.id)!).filter((p) => p && p.platform !== user.platform && !(user.platform === "ps5" && p.platform === "ps4"))
    : [];
  const discount = couponOk ? Math.round(cartTotal * 0.1) : 0;
  const total = cartTotal - discount;

  if (!ready) return <div className="h-[80vh]" />;

  if (!cart.length && !order) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center gap-4 px-4 text-center">
        <ShoppingBag className="size-10 text-white/30" />
        <p className="text-xl font-semibold text-white">No tienes juegos en el carrito</p>
        <Link href="/catalogo" className="rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-brand-ink">
          Ir al catálogo
        </Link>
      </div>
    );
  }

  const validateData = () => {
    const e: Record<string, string> = {};
    if (!/^\S+@\S+\.\S+$/.test(email)) e.email = "Ingresa un correo válido. Ahí te llegará el juego.";
    if (name.trim().length < 2) e.name = "Ingresa tu nombre";
    if (!terms) e.terms = "Acepta los términos para continuar";
    setErrors(e);
    return !Object.keys(e).length;
  };

  return (
    <div className="mx-auto max-w-6xl px-4 pt-10 md:px-6">
      {step < 3 && (
        <>
          <Link href="/catalogo" className="mb-6 inline-flex items-center gap-1.5 text-sm text-white/55 hover:text-white">
            <ArrowLeft className="size-4" /> Seguir comprando
          </Link>
          <h1 className="text-4xl font-semibold tracking-tight text-white">Pago</h1>
          <Stepper step={step} />
        </>
      )}

      <AnimatePresence mode="wait">
        {step === 3 && order ? (
          <Success key="ok" order={order} email={email} />
        ) : (
          <motion.div key="flow" exit={{ opacity: 0, y: -20 }} className="mt-8 grid gap-6 lg:grid-cols-[1fr_380px]">
            <div className="solid overflow-hidden rounded-[26px]">
              <AnimatePresence mode="wait" initial={false}>
                {step === 0 && (
                  <StepPanel key="s0">
                    <h2 className="text-xl font-semibold text-white">Tus datos</h2>
                    <p className="mt-1 text-sm text-white/50">Enviaremos las credenciales y el videotutorial a este correo.</p>
                    <div className="mt-6 space-y-4">
                      <Input label="Correo electrónico" icon={<Mail className="size-4" />} value={email} onChange={setEmail} placeholder="tucorreo@correo.cl" error={errors.email} />
                      <Input label="Nombre" value={name} onChange={setName} placeholder="Tu nombre" error={errors.name} />
                      <Compatibility platforms={cartPlatforms} userPlatform={user?.platform ?? null} mismatched={mismatched} />
                      <label className="flex cursor-pointer items-start gap-3 text-sm text-white/65">
                        <button
                          onClick={() => {
                            setTerms((t) => !t);
                            setErrors((e) => ({ ...e, terms: "" }));
                          }}
                          className={`mt-0.5 grid size-5 shrink-0 place-items-center rounded-md ring-1 transition ${terms ? "bg-brand ring-brand" : "ring-white/25"}`}
                          aria-pressed={terms}
                        >
                          {terms && <Check className="size-3.5 text-brand-ink" strokeWidth={3} />}
                        </button>
                        Acepto los términos y condiciones, y entiendo cómo funcionan las cuentas primarias y secundarias.
                      </label>
                      {errors.terms && <p className="-mt-2 text-sm text-red-500">{errors.terms}</p>}
                    </div>
                    <PrimaryButton onClick={() => validateData() && setStep(1)}>
                      Continuar al pago <ArrowRight className="size-4" />
                    </PrimaryButton>
                  </StepPanel>
                )}

                {step === 1 && (
                  <StepPanel key="s1">
                    <h2 className="text-xl font-semibold text-white">Método de pago</h2>
                    <p className="mt-1 text-sm text-white/50">Todos los pagos se confirman al instante. Ya no necesitas enviar comprobantes.</p>
                    <div className="mt-6 grid gap-2.5 sm:grid-cols-2">
                      {METHODS.map((m) => {
                        const on = method === m.id;
                        return (
                          <motion.button
                            key={m.id}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setMethod(m.id)}
                            className={`relative flex items-center gap-3 rounded-2xl p-4 text-left transition ${on ? "bg-white/[0.06]" : "bg-white/[0.02] hover:bg-white/[0.04]"}`}
                          >
                            {on && (
                              <motion.span
                                layoutId="method-ring"
                                className="absolute inset-0 rounded-2xl ring-2 ring-brand"
                                transition={{ type: "spring", stiffness: 400, damping: 32 }}
                              />
                            )}
                            {!on && <span className="absolute inset-0 rounded-2xl ring-1 ring-white/8" />}
                            <span className={`grid size-11 shrink-0 place-items-center rounded-xl ${on ? "bg-brand text-brand-ink" : "bg-white/8 text-white/70"}`}>
                              <m.icon className="size-5" />
                            </span>
                            <span>
                              <span className="block font-medium text-white">{m.name}</span>
                              <span className="block text-xs text-white/45">{m.d}</span>
                            </span>
                          </motion.button>
                        );
                      })}
                    </div>
                    <div className="mt-6 flex items-center gap-3 rounded-2xl bg-emerald-500/8 p-4 text-sm text-emerald-500 ring-1 ring-emerald-500/20">
                      <Zap className="size-5 shrink-0" />
                      Al confirmarse el pago, el sistema asigna tu cuenta y la envía a {email || "tu correo"} automáticamente, incluso de noche y los domingos.
                    </div>
                    <div className="mt-6 flex gap-2.5">
                      <button onClick={() => setStep(0)} className="h-12 rounded-2xl px-5 text-sm text-white/60 ring-1 ring-white/12 hover:text-white">
                        Atrás
                      </button>
                      <PrimaryButton onClick={() => setStep(2)} className="mt-0 flex-1">
                        <Lock className="size-4" /> Pagar {clp(total)}
                      </PrimaryButton>
                    </div>
                  </StepPanel>
                )}

                {step === 2 && (
                  <Gateway
                    key="s2"
                    method={METHODS.find((m) => m.id === method)!}
                    total={total}
                    onBack={() => setStep(1)}
                    onApprove={() => {
                      const o = placeOrder(METHODS.find((m) => m.id === method)!.name);
                      setOrder({ ...o, total });
                      setStep(3);
                    }}
                  />
                )}
              </AnimatePresence>
            </div>

            {/* Resumen */}
            <aside className="solid h-fit rounded-[26px] p-6 lg:sticky lg:top-28">
              <h3 className="font-semibold text-white">Resumen</h3>
              <ul className="mt-4 space-y-3">
                {cart.map((it) => {
                  const p = productById(it.id)!;
                  return (
                    <li key={it.id} className="flex items-center gap-3">
                      <GameArt product={p} showTitle={false} className="aspect-[3/4] w-12 shrink-0 rounded-lg" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm text-white">{p.title}</p>
                        <p className="text-xs capitalize text-white/45">
                          {PLATFORMS[p.platform].short} · {p.kind === "membresia" ? "membresía" : it.type}
                        </p>
                      </div>
                      <p className="text-sm font-medium text-white">{clp(priceOf(p, it.type))}</p>
                    </li>
                  );
                })}
              </ul>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const ok = ["BLACK10", "JDC10"].includes(coupon.trim().toUpperCase());
                  setCouponOk(ok);
                  setErrors((er) => ({ ...er, coupon: ok ? "" : "Cupón no válido. Prueba con BLACK10" }));
                }}
                className="mt-5 flex gap-2"
              >
                <label className="flex h-10 flex-1 items-center gap-2 rounded-xl bg-white/[0.04] px-3 text-white/40 ring-1 ring-white/8 focus-within:ring-brand/50">
                  <Tag className="size-4" />
                  <input
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                    placeholder="Cupón de redes"
                    className="w-full bg-transparent text-sm uppercase text-white placeholder:normal-case placeholder:text-white/35 focus:outline-none"
                  />
                </label>
                <button className="rounded-xl px-3 text-sm text-white ring-1 ring-white/12 hover:bg-white/5">Aplicar</button>
              </form>
              {errors.coupon && <p className="mt-2 text-xs text-red-500">{errors.coupon}</p>}

              <div className="mt-5 space-y-2 border-t border-white/8 pt-4 text-sm">
                <Row l="Subtotal" v={clp(cartTotal)} />
                <AnimatePresence>
                  {couponOk && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
                      <Row l="Cupón BLACK10 (-10%)" v={"-" + clp(discount)} green />
                    </motion.div>
                  )}
                </AnimatePresence>
                <Row l="Entrega digital" v="Gratis" green />
                <div className="flex items-center justify-between pt-2">
                  <span className="text-white">Total</span>
                  <span className="text-2xl font-semibold tracking-tight text-white">
                    <AnimatedNumber value={total} format={clp} />
                  </span>
                </div>
              </div>
              <div className="mt-5 flex items-center gap-2 text-xs text-white/40">
                <ShieldCheck className="size-4" /> Pago cifrado · Garantía de 6 meses
              </div>
            </aside>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ---------------- Pasarela simulada ---------------- */
function Gateway({
  method,
  total,
  onApprove,
  onBack,
}: {
  method: (typeof METHODS)[number];
  total: number;
  onApprove: () => void;
  onBack: () => void;
}) {
  const [phase, setPhase] = useState<"connecting" | "ready" | "processing" | "rejected">("connecting");
  useEffect(() => {
    const t = setTimeout(() => setPhase("ready"), 1300);
    return () => clearTimeout(t);
  }, []);

  return (
    <StepPanel>
      <div className="mx-auto max-w-sm py-4 text-center">
        <motion.div
          className="mx-auto grid size-16 place-items-center rounded-2xl bg-brand text-brand-ink"
          animate={phase === "connecting" || phase === "processing" ? { rotate: [0, 8, -8, 0] } : { rotate: 0 }}
          transition={{ duration: 1.2, repeat: phase === "connecting" || phase === "processing" ? Infinity : 0 }}
        >
          <method.icon className="size-7" />
        </motion.div>
        <p className="mt-5 text-xs uppercase tracking-[0.18em] text-white/40">Pasarela de pago · demostración</p>
        <p className="mt-1 text-lg font-semibold text-white">{method.name}</p>
        <p className="mt-4 text-4xl font-semibold tracking-tight text-white">{clp(total)}</p>
        <p className="text-xs text-white/40">Comercio: Juegos Digitales Chile</p>

        <AnimatePresence mode="wait">
          {phase === "connecting" && (
            <motion.p key="c" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-8 flex items-center justify-center gap-2 text-sm text-white/60">
              <Loader2 className="size-4 animate-spin" /> Conectando de forma segura con {method.name}
            </motion.p>
          )}
          {phase === "processing" && (
            <motion.p key="p" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-8 flex items-center justify-center gap-2 text-sm text-white/60">
              <Loader2 className="size-4 animate-spin" /> Confirmando pago y asignando tu cuenta
            </motion.p>
          )}
          {phase === "ready" && (
            <motion.div key="r" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-8 space-y-2.5">
              <button
                onClick={() => {
                  setPhase("processing");
                  setTimeout(onApprove, 1600);
                }}
                className="h-12 w-full rounded-2xl bg-emerald-500 font-semibold text-[#fff] transition hover:bg-emerald-400"
              >
                Aprobar pago
              </button>
              <button onClick={() => setPhase("rejected")} className="h-11 w-full rounded-2xl text-sm text-white/55 ring-1 ring-white/12 hover:text-white">
                Simular pago rechazado
              </button>
            </motion.div>
          )}
          {phase === "rejected" && (
            <motion.div key="x" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mt-8">
              <motion.div animate={{ x: [0, -10, 10, -6, 6, 0] }} transition={{ duration: 0.5 }} className="flex items-center justify-center gap-2 text-red-500">
                <XCircle className="size-5" /> El pago fue rechazado
              </motion.div>
              <p className="mt-2 text-sm text-white/50">No se hizo ningún cargo. Prueba con otro método.</p>
              <button onClick={onBack} className="mt-5 h-11 w-full rounded-2xl bg-white font-semibold text-black">
                Elegir otro método
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </StepPanel>
  );
}

/* ---------------- Éxito ---------------- */
function Success({ order, email }: { order: Order; email: string }) {
  const [done, setDone] = useState(0);
  const [reveal, setReveal] = useState(false);
  const steps = [
    { icon: Check, t: "Pago confirmado", d: `${order.method} · ${clp(order.total)}` },
    { icon: UserCheck, t: "Cuenta asignada automáticamente", d: "Sin revisión manual" },
    { icon: Mail, t: "Credenciales enviadas", d: email },
    { icon: MonitorPlay, t: "Videotutorial disponible", d: "Instala en 3 pasos" },
  ];
  useEffect(() => {
    const ts = steps.map((_, i) => setTimeout(() => setDone(i + 1), 700 + i * 750));
    return () => ts.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const particles = useMemo(
    () =>
      Array.from({ length: 22 }).map((_, i) => ({
        a: (i / 22) * Math.PI * 2,
        d: 80 + Math.random() * 70,
        c: ["#8467ff", "#e05ad1", "#3b82f6", "#22c55e", "#4f7dff"][i % 5],
      })),
    []
  );
  const first = productById(order.items[0]?.id ?? "");
  const acct = useMemo(() => `jdc.${first?.platform ?? "ps5"}.0${Math.floor(Math.random() * 9) + 1}@cuentas.cl`, [first]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mx-auto max-w-2xl pt-6 text-center">
      <div className="relative mx-auto size-24">
        {particles.map((p, i) => (
          <motion.span
            key={i}
            className="absolute left-1/2 top-1/2 size-2 rounded-full"
            style={{ background: p.c }}
            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
            animate={{ x: Math.cos(p.a) * p.d, y: Math.sin(p.a) * p.d, opacity: 0, scale: 0.4 }}
            transition={{ duration: 1.1, delay: 0.35, ease: "easeOut" }}
          />
        ))}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 16 }}
          className="grid size-24 place-items-center rounded-full bg-emerald-500 shadow-[0_0_60px_rgba(34,197,94,0.5)]"
        >
          <svg viewBox="0 0 24 24" className="size-12" fill="none" stroke="white" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
            <motion.path d="M5 12.5l4.5 4.5L19 7.5" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.3, duration: 0.5 }} />
          </svg>
        </motion.div>
      </div>

      <motion.h1 initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mt-7 text-4xl font-semibold tracking-tight text-white">
        ¡Listo! Tu juego va en camino
      </motion.h1>
      <p className="mt-2 text-white/50">
        Orden <span className="font-mono text-white">{order.code}</span>
      </p>

      <div className="solid mx-auto mt-8 rounded-[26px] p-6 text-left">
        <ol className="space-y-1">
          {steps.map((s, i) => {
            const ok = done > i;
            return (
              <li key={s.t} className="flex items-center gap-4 rounded-xl p-2">
                <motion.span
                  animate={{ scale: ok ? [1.2, 1] : 1 }}
                  className={`grid size-9 shrink-0 place-items-center rounded-full transition-colors duration-300 ${ok ? "bg-emerald-500" : "bg-white/6"}`}
                >
                  {ok ? <s.icon className="size-4 text-[#fff]" /> : <Loader2 className="size-4 animate-spin text-white/40" />}
                </motion.span>
                <div className={ok ? "" : "opacity-45"}>
                  <p className="text-sm font-medium text-white">{s.t}</p>
                  <p className="text-xs text-white/45">{s.d}</p>
                </div>
              </li>
            );
          })}
        </ol>

        <AnimatePresence>
          {done >= steps.length && first && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: "auto", marginTop: 20 }}
              className="overflow-hidden"
            >
              <div className="flex items-center gap-4 rounded-2xl bg-white/[0.04] p-4 ring-1 ring-white/8">
                <GameArt product={first} showTitle={false} className="aspect-[3/4] w-14 shrink-0 rounded-lg" />
                <div className="min-w-0 flex-1 font-mono text-sm">
                  <p className="flex items-center gap-2 text-white/50">
                    <Mail className="size-3.5" /> {acct}
                  </p>
                  <p className="mt-1 flex items-center gap-2 text-white">
                    <KeyRound className="size-3.5 text-white/50" />
                    {reveal ? "Jdc#2026-demo" : "••••••••••••"}
                    <button onClick={() => setReveal((r) => !r)} className="text-white/45 hover:text-white" aria-label="Mostrar contraseña">
                      {reveal ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                    </button>
                  </p>
                </div>
              </div>
              <p className="mt-3 text-xs text-white/40">Datos de ejemplo. También quedan guardados en tu biblioteca.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link href="/cuenta" className="h-12 rounded-2xl bg-brand px-6 font-semibold leading-[48px] text-brand-ink transition hover:brightness-110">
          Ver mi biblioteca
        </Link>
        <Link href="/" className="h-12 rounded-2xl px-6 leading-[48px] text-white ring-1 ring-white/15 transition hover:bg-white/5">
          Seguir comprando
        </Link>
      </div>
    </motion.div>
  );
}

/* ---------------- Piezas ---------------- */
function Compatibility({
  platforms,
  userPlatform,
  mismatched,
}: {
  platforms: PlatformId[];
  userPlatform: PlatformId | null;
  mismatched: ReturnType<typeof productById>[];
}) {
  return (
    <div>
      <p className="mb-2 text-sm text-white/70">Consola de instalación</p>
      <div className="flex flex-wrap gap-2">
        {platforms.map((id) => {
          const pl = PLATFORMS[id];
          return (
            <span
              key={id}
              className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium"
              style={{ background: pl.soft, color: pl.color, boxShadow: `inset 0 0 0 1px ${pl.color}66` }}
            >
              <span className="size-2 rounded-full" style={{ background: pl.color }} />
              {pl.name}
            </span>
          );
        })}
      </div>
      <p className="mt-2 text-xs text-white/45">
        Cada juego se entrega para la consola de su ficha. {platforms.length > 1 && "Tu carrito tiene juegos para más de una consola."}
      </p>
      <AnimatePresence>
        {mismatched.length > 0 && userPlatform && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-3 flex gap-3 rounded-xl bg-orange-500/10 p-3 text-sm text-orange-500 ring-1 ring-orange-500/25">
              <AlertTriangle className="mt-0.5 size-4 shrink-0" />
              <p>
                {mismatched.map((p) => p!.title).join(", ")} {mismatched.length === 1 ? "es" : "son"} para{" "}
                {[...new Set(mismatched.map((p) => PLATFORMS[p!.platform].short))].join(" y ")}, pero tu perfil dice{" "}
                {PLATFORMS[userPlatform].short}. Revisa que tengas esa consola antes de pagar.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Stepper({ step }: { step: number }) {
  const labels = ["Datos", "Pago", "Confirmación"];
  return (
    <div className="mt-6 flex items-center gap-3">
      {labels.map((l, i) => (
        <div key={l} className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <motion.span
              animate={{ scale: step === i ? [1, 1.15, 1] : 1 }}
              className={`grid size-7 place-items-center rounded-full text-xs font-bold transition-colors duration-500 ${
                step >= i ? "bg-brand text-brand-ink" : "bg-white/8 text-white/50"
              }`}
            >
              {step > i ? <Check className="size-3.5" strokeWidth={3} /> : i + 1}
            </motion.span>
            <span className={`text-sm ${step >= i ? "text-white" : "text-white/40"}`}>{l}</span>
          </div>
          {i < labels.length - 1 && (
            <div className="h-px w-10 overflow-hidden bg-white/10 sm:w-20">
              <motion.div className="h-full bg-brand" animate={{ width: step > i ? "100%" : "0%" }} transition={{ duration: 0.5 }} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function StepPanel({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="p-6 md:p-8"
    >
      {children}
    </motion.div>
  );
}

function Input({
  label,
  value,
  onChange,
  placeholder,
  icon,
  error,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  icon?: React.ReactNode;
  error?: string;
}) {
  return (
    <div>
      <p className="mb-2 text-sm text-white/70">{label}</p>
      <label
        className={`flex h-12 items-center gap-3 rounded-xl bg-white/[0.03] px-4 text-white/40 ring-1 transition focus-within:ring-2 ${
          error ? "ring-red-500/60" : "ring-white/10 focus-within:ring-brand/60"
        }`}
      >
        {icon}
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-transparent text-[15px] text-white placeholder:text-white/30 focus:outline-none"
        />
      </label>
      <AnimatePresence>
        {error && (
          <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-1.5 text-sm text-red-500">
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

function PrimaryButton({ children, onClick, className = "mt-8" }: { children: React.ReactNode; onClick: () => void; className?: string }) {
  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-brand font-semibold text-brand-ink transition hover:brightness-110 ${className}`}
    >
      {children}
    </motion.button>
  );
}

function Row({ l, v, green }: { l: string; v: string; green?: boolean }) {
  return (
    <div className="flex items-center justify-between text-white/55">
      <span>{l}</span>
      <span className={green ? "text-emerald-500" : "text-white"}>{v}</span>
    </div>
  );
}
