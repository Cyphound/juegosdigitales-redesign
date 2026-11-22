"use client";

import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Sparkles, X } from "lucide-react";
import { useEffect, useState } from "react";
import { GENRES, GenreId, PLATFORMS, PlatformId } from "@/lib/data";
import { useStore } from "@/lib/store";

export function PrefsModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { user, updatePrefs } = useStore();
  const [platform, setPlatform] = useState<PlatformId | null>(user?.platform ?? null);
  const [genres, setGenres] = useState<GenreId[]>(user?.genres ?? []);
  const [mounted, setMounted] = useState(false);
  const [err, setErr] = useState("");
  useEffect(() => setMounted(true), []);
  useEffect(() => {
    if (open) {
      setPlatform(user?.platform ?? null);
      setGenres(user?.genres ?? []);
      setErr("");
    }
  }, [open, user]);

  if (!mounted) return null;
  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[60] grid place-items-center bg-black/60 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, y: 40, scale: 0.95, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: 30, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 220, damping: 26 }}
            className="lg lg-strong w-full max-w-xl rounded-[28px] p-7"
          >
            <div className="relative z-[2]">
              <div className="flex items-start justify-between">
                <div>
                  <p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-[0.16em] text-brand">
                    <Sparkles className="size-3.5" /> Personaliza tu tienda
                  </p>
                  <h3 className="mt-2 text-2xl font-semibold tracking-tight text-white">¿Con qué juegas?</h3>
                  <p className="mt-1 text-sm text-white/50">Usamos esto para tu inicio y tus recomendaciones.</p>
                </div>
                <button onClick={onClose} aria-label="Cerrar" className="grid size-9 place-items-center rounded-full bg-white/8 text-white/60 hover:text-white">
                  <X className="size-4" />
                </button>
              </div>

              <p className="mb-2.5 mt-6 text-sm font-medium text-white/75">Tu consola</p>
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
                {Object.values(PLATFORMS).map((pl) => {
                  const on = platform === pl.id;
                  return (
                    <motion.button
                      key={pl.id}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setPlatform(pl.id);
                        setErr("");
                      }}
                      className="relative rounded-2xl p-3.5 text-left ring-1 transition"
                      style={{
                        background: on ? pl.soft : "color-mix(in srgb, var(--color-white) 4%, transparent)",
                        boxShadow: on ? `inset 0 0 0 1.5px ${pl.color}` : undefined,
                        borderColor: "transparent",
                      }}
                    >
                      <span className="block size-2.5 rounded-full" style={{ background: pl.color }} />
                      <span className="mt-3 block text-sm font-semibold text-white">{pl.short}</span>
                      <span className="block text-[11px] text-white/45">{pl.name}</span>
                      {on && (
                        <motion.span layoutId="plat-check" className="absolute right-2.5 top-2.5 grid size-5 place-items-center rounded-full" style={{ background: pl.color }}>
                          <Check className="size-3 text-white" strokeWidth={3} />
                        </motion.span>
                      )}
                    </motion.button>
                  );
                })}
              </div>

              <p className="mb-2.5 mt-6 text-sm font-medium text-white/75">Géneros favoritos</p>
              <div className="flex flex-wrap gap-2">
                {(Object.keys(GENRES) as GenreId[]).map((g) => {
                  const on = genres.includes(g);
                  return (
                    <motion.button
                      key={g}
                      layout
                      whileTap={{ scale: 0.92 }}
                      onClick={() => setGenres((gs) => (on ? gs.filter((x) => x !== g) : [...gs, g]))}
                      className={`flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm transition ${
                        on ? "bg-white text-black" : "bg-white/6 text-white/70 ring-1 ring-white/10 hover:bg-white/10"
                      }`}
                    >
                      {on && <Check className="size-3.5" strokeWidth={3} />}
                      {GENRES[g]}
                    </motion.button>
                  );
                })}
              </div>

              {err && <p className="mt-4 text-sm text-red-500">{err}</p>}

              <button
                onClick={() => {
                  if (!platform) return setErr("Elige tu consola para continuar");
                  updatePrefs(platform, genres);
                  onClose();
                }}
                className="mt-7 h-12 w-full rounded-2xl bg-brand font-semibold text-brand-ink transition hover:brightness-110"
              >
                Guardar y ver mi tienda
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
