"use client";

import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Eye, EyeOff, Loader2, Lock, Mail, ShieldCheck, Zap } from "lucide-react";
import { useState } from "react";
import { useStore } from "@/lib/store";
import { DEMO_USERS, PLATFORMS, PRODUCTS } from "@/lib/data";
import { GameArt } from "@/components/GameArt";
import { Glass } from "@/components/ui";
import { Logo } from "@/components/Navbar";
import { useAmbient } from "@/components/Shell";

const SHOWCASE = ["spider-man-2-ps5", "zelda-totk-switch", "gta-6-ps5", "forza-5-xbox", "god-of-war-ps4"].map(
  (id) => PRODUCTS.find((p) => p.id === id)!
);

export default function LoginPage() {
  useAmbient("#facc15");
  const router = useRouter();
  const { login } = useStore();
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) return setError("Ingresa un correo válido");
    if (!pass) return setError("Escribe cualquier contraseña (es una demo)");
    setError("");
    setLoading(true);
    setTimeout(() => {
      const u = login(email);
      router.push(u.role === "admin" ? "/admin" : "/");
    }, 900);
  };

  return (
    <div className="mx-auto grid min-h-dvh max-w-7xl items-center gap-10 px-5 py-10 lg:grid-cols-[1.1fr_1fr] lg:px-8">
      {/* Columna visual */}
      <div className="relative hidden h-[640px] lg:block">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <Logo />
          <h1 className="mt-10 max-w-lg text-6xl font-semibold leading-[1.02] tracking-tight text-white">
            Tu próximo juego, <span className="shine">en minutos.</span>
          </h1>
          <p className="mt-5 max-w-md text-lg text-white/55">
            Paga con tarjeta o billetera digital y recibe tu cuenta al instante. Sin vouchers ni esperas.
          </p>
        </motion.div>

        <div className="absolute bottom-0 left-0 right-0 h-[340px]" style={{ perspective: 1200 }}>
          {SHOWCASE.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 120, rotate: 0 }}
              animate={{
                opacity: 1,
                y: [0, -14, 0],
                rotate: (i - 2) * 7,
              }}
              transition={{
                opacity: { delay: 0.3 + i * 0.12, duration: 0.6 },
                rotate: { delay: 0.3 + i * 0.12, duration: 0.9, ease: [0.22, 1, 0.36, 1] },
                y: { delay: 1 + i * 0.25, duration: 4 + i * 0.4, repeat: Infinity, ease: "easeInOut" },
              }}
              whileHover={{ scale: 1.08, zIndex: 20, rotate: 0 }}
              className="absolute bottom-6 w-[170px] origin-bottom cursor-pointer"
              style={{ left: `${4 + i * 17}%`, zIndex: 10 - Math.abs(i - 2) }}
            >
              <div className="lg rounded-[20px] p-1.5">
                <GameArt product={p} className="relative z-[2] aspect-[3/4] rounded-[15px]" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Formulario */}
      <Glass
        strong
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto w-full max-w-md rounded-[30px] p-8"
      >
        <div className="lg:hidden">
          <Logo />
        </div>
        <h2 className="mt-6 text-3xl font-semibold tracking-tight text-white lg:mt-0">Inicia sesión</h2>
        <p className="mt-1.5 text-sm text-white/50">Tu tienda se adapta a tu consola y a tus gustos.</p>

        <form onSubmit={submit} className="mt-7 space-y-3.5">
          <Field icon={<Mail className="size-4" />}>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              placeholder="tucorreo@correo.cl"
              className="w-full bg-transparent text-[15px] text-white placeholder:text-white/35 focus:outline-none"
            />
          </Field>
          <Field icon={<Lock className="size-4" />}>
            <input
              type={show ? "text" : "password"}
              value={pass}
              onChange={(e) => {
                setPass(e.target.value);
                setError("");
              }}
              placeholder="Contraseña"
              className="w-full bg-transparent text-[15px] text-white placeholder:text-white/35 focus:outline-none"
            />
            <button type="button" onClick={() => setShow((s) => !s)} className="text-white/40 hover:text-white" aria-label="Mostrar contraseña">
              {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </Field>

          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="text-sm text-red-400"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          <motion.button
            whileTap={{ scale: 0.98 }}
            disabled={loading}
            className="group flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-brand font-semibold text-brand-ink transition hover:brightness-110 disabled:opacity-80"
          >
            {loading ? (
              <Loader2 className="size-5 animate-spin" />
            ) : (
              <>
                Entrar <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </>
            )}
          </motion.button>
        </form>

        <div className="mt-7">
          <p className="mb-2.5 text-xs font-medium uppercase tracking-[0.16em] text-white/40">Cuentas de demostración</p>
          <div className="space-y-1.5">
            {DEMO_USERS.map((u, i) => (
              <motion.button
                key={u.email}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.07 }}
                whileHover={{ x: 4 }}
                onClick={() => {
                  setEmail(u.email);
                  setPass("demo");
                  setError("");
                }}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition ${
                  email === u.email ? "bg-white/10 ring-1 ring-white/15" : "hover:bg-white/5"
                }`}
              >
                <span className="grid size-8 place-items-center rounded-full text-xs font-bold text-black" style={{ background: u.avatar }}>
                  {u.name[0]}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm text-white">{u.email}</span>
                  <span className="block text-[11px] text-white/40">
                    {u.role === "admin"
                      ? "Panel de ventas, demanda e inventario"
                      : `${PLATFORMS[u.platform!].name} · ${u.genres.join(", ")}`}
                  </span>
                </span>
              </motion.button>
            ))}
          </div>
          <p className="mt-3 text-xs text-white/35">Cualquier contraseña funciona. Un correo nuevo crea un perfil sin preferencias.</p>
        </div>

        <div className="mt-6 flex items-center justify-between border-t border-white/8 pt-5 text-xs text-white/45">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="size-3.5" /> Conexión cifrada
          </span>
          <button onClick={() => router.push("/")} className="flex items-center gap-1 text-white/70 hover:text-white">
            <Zap className="size-3.5" /> Entrar como invitado
          </button>
        </div>
      </Glass>
    </div>
  );
}

function Field({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <label className="flex h-12 items-center gap-3 rounded-2xl bg-black/30 px-4 text-white/45 ring-1 ring-white/10 transition focus-within:ring-2 focus-within:ring-brand/60">
      {icon}
      {children}
    </label>
  );
}
