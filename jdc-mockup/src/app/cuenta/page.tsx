"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Eye, EyeOff, KeyRound, Library, MonitorPlay, Receipt, SlidersHorizontal, UserRound } from "lucide-react";
import { useState } from "react";
import { useStore } from "@/lib/store";
import { GENRES, PLATFORMS, clp, productById } from "@/lib/data";
import { GameArt } from "@/components/GameArt";
import { Glass, PlatformBadge, SectionTitle } from "@/components/ui";
import { useAmbient } from "@/components/Shell";
import { PrefsModal } from "@/components/PrefsModal";

export default function CuentaPage() {
  const { user, orders, ready } = useStore();
  const [prefs, setPrefs] = useState(false);
  const [open, setOpen] = useState<string | null>(null);
  useAmbient(user?.platform ? PLATFORMS[user.platform].color : null);

  if (!ready) return <div className="h-[80vh]" />;
  if (!user)
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center gap-4 text-center">
        <UserRound className="size-10 text-white/30" />
        <p className="text-xl font-semibold text-white">Inicia sesión para ver tu biblioteca</p>
        <Link href="/login" className="rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-brand-ink">
          Iniciar sesión
        </Link>
      </div>
    );

  return (
    <div className="mx-auto max-w-6xl px-4 pt-10 md:px-6">
      <Glass className="rounded-[30px] p-6 md:p-8" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex flex-wrap items-center gap-5">
          <motion.span
            initial={{ scale: 0.6, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 14 }}
            className="grid size-20 place-items-center rounded-3xl text-3xl font-bold text-black"
            style={{ background: user.avatar }}
          >
            {user.name[0]}
          </motion.span>
          <div className="flex-1">
            <h1 className="text-3xl font-semibold tracking-tight text-white">{user.name}</h1>
            <p className="text-sm text-white/50">{user.email}</p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {user.platform && <PlatformBadge id={user.platform} size="md" />}
              {user.genres.map((g) => (
                <span key={g} className="rounded-full bg-white/8 px-3 py-1 text-xs text-white/75">
                  {GENRES[g]}
                </span>
              ))}
            </div>
          </div>
          {user.role === "cliente" && (
            <button
              onClick={() => setPrefs(true)}
              className="flex items-center gap-2 rounded-2xl bg-white/8 px-4 py-2.5 text-sm text-white ring-1 ring-white/12 transition hover:bg-white/14"
            >
              <SlidersHorizontal className="size-4" /> Editar gustos
            </button>
          )}
        </div>
      </Glass>

      <section className="mt-12">
        <SectionTitle eyebrow="Biblioteca" icon={<Library className="size-3.5 text-brand" />} title="Tus juegos" />
        {user.purchases.length === 0 ? (
          <p className="text-white/50">Aún no tienes juegos. Tus compras aparecerán aquí con sus credenciales.</p>
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {user.purchases.map((id, i) => {
              const p = productById(id);
              if (!p) return null;
              const shown = open === id;
              return (
                <motion.div key={id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                  <Glass className="rounded-[24px] p-3">
                    <div className="flex gap-4">
                      <GameArt product={p} showTitle={false} className="aspect-[3/4] w-20 shrink-0 rounded-2xl" />
                      <div className="min-w-0 flex-1 py-1">
                        <PlatformBadge id={p.platform} />
                        <p className="mt-1.5 truncate font-medium text-white">{p.title}</p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          <button
                            onClick={() => setOpen(shown ? null : id)}
                            className="flex items-center gap-1.5 rounded-xl bg-white/8 px-3 py-1.5 text-xs text-white transition hover:bg-white/14"
                          >
                            {shown ? <EyeOff className="size-3.5" /> : <KeyRound className="size-3.5" />} {shown ? "Ocultar" : "Ver credenciales"}
                          </button>
                          <button className="flex items-center gap-1.5 rounded-xl bg-white/8 px-3 py-1.5 text-xs text-white transition hover:bg-white/14">
                            <MonitorPlay className="size-3.5" /> Videotutorial
                          </button>
                        </div>
                      </div>
                    </div>
                    <AnimatePresence>
                      {shown && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="mt-3 rounded-xl bg-black/30 p-3 font-mono text-xs text-white/80">
                            <p className="flex items-center gap-2">
                              <Eye className="size-3.5 text-white/40" /> jdc.{p.platform}.04@cuentas.cl · Jdc#2026-demo
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Glass>
                </motion.div>
              );
            })}
          </div>
        )}
      </section>

      {orders.length > 0 && (
        <section className="mt-12">
          <SectionTitle eyebrow="Historial" icon={<Receipt className="size-3.5 text-brand" />} title="Tus órdenes" />
          <div className="solid overflow-hidden rounded-[22px]">
            {orders.map((o) => (
              <div key={o.code} className="flex flex-wrap items-center justify-between gap-3 border-b border-white/6 px-5 py-4 last:border-0">
                <div>
                  <p className="font-mono text-sm text-white">{o.code}</p>
                  <p className="text-xs text-white/45">
                    {new Date(o.date).toLocaleString("es-CL")} · {o.method}
                  </p>
                </div>
                <span className="rounded-full bg-emerald-500/12 px-3 py-1 text-xs text-emerald-300">Entregado automáticamente</span>
                <p className="font-semibold text-white">{clp(o.total)}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <PrefsModal open={prefs} onClose={() => setPrefs(false)} />
    </div>
  );
}
