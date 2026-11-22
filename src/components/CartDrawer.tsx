"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ShieldCheck, ShoppingBag, Trash2, X, Zap } from "lucide-react";
import { useEffect } from "react";
import { useStore } from "@/lib/store";
import { clp, priceOf, productById } from "@/lib/data";
import { GameArt } from "./GameArt";
import { AnimatedNumber } from "./ui";
import { AccountToggle } from "./AccountToggle";

export function CartDrawer() {
  const { cartOpen, setCartOpen, cart, removeFromCart, setItemType, cartTotal } = useStore();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setCartOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setCartOpen]);

  return (
    <AnimatePresence>
      {cartOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCartOpen(false)}
          />
          <motion.aside
            initial={{ x: "110%", opacity: 0.6 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "110%", opacity: 0.6 }}
            transition={{ type: "spring", stiffness: 260, damping: 32 }}
            className="lg lg-strong fixed bottom-3 right-3 top-3 z-50 flex w-[calc(100%-1.5rem)] max-w-md flex-col rounded-[26px]"
          >
            <div className="relative z-[2] flex h-full flex-col">
              <div className="flex items-center justify-between px-6 pb-4 pt-6">
                <div>
                  <h2 className="text-xl font-semibold text-white">Tu carrito</h2>
                  <p className="text-xs text-white/45">{cart.length} {cart.length === 1 ? "juego" : "juegos"}</p>
                </div>
                <button
                  onClick={() => setCartOpen(false)}
                  aria-label="Cerrar carrito"
                  className="grid size-9 place-items-center rounded-full bg-white/8 text-white/70 transition hover:bg-white/15 hover:text-white"
                >
                  <X className="size-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-4">
                {cart.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex h-full flex-col items-center justify-center gap-3 pb-20 text-center"
                  >
                    <motion.div
                      animate={{ y: [0, -8, 0] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                      className="grid size-16 place-items-center rounded-2xl bg-white/6 text-white/40"
                    >
                      <ShoppingBag className="size-7" />
                    </motion.div>
                    <p className="font-medium text-white">Tu carrito está vacío</p>
                    <p className="max-w-60 text-sm text-white/45">Agrega un juego y recíbelo en tu correo en minutos.</p>
                  </motion.div>
                ) : (
                  <ul className="space-y-3 pb-4">
                    <AnimatePresence initial={false}>
                      {cart.map((it) => {
                        const pr = productById(it.id)!;
                        return (
                          <motion.li
                            key={it.id}
                            layout
                            initial={{ opacity: 0, x: 40 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 60, height: 0, marginTop: 0 }}
                            transition={{ duration: 0.35 }}
                            className="flex gap-3 rounded-2xl bg-white/[0.04] p-2.5 ring-1 ring-white/8"
                          >
                            <GameArt product={pr} showTitle={false} className="aspect-[3/4] w-[72px] shrink-0 rounded-xl" />
                            <div className="flex min-w-0 flex-1 flex-col">
                              <div className="flex items-start justify-between gap-2">
                                <p className="line-clamp-2 text-sm font-medium text-white">{pr.title}</p>
                                <button
                                  onClick={() => removeFromCart(it.id)}
                                  aria-label="Quitar del carrito"
                                  className="text-white/35 transition hover:text-red-500"
                                >
                                  <Trash2 className="size-4" />
                                </button>
                              </div>
                              <div className="mt-auto flex items-end justify-between gap-2 pt-2">
                                {pr.kind === "membresia" ? (
                                  <span className="rounded-full bg-white/6 px-2.5 py-1 text-[11px] text-white/60">Membresía</span>
                                ) : (
                                  <AccountToggle id={`cart-${it.id}`} value={it.type} onChange={(t) => setItemType(it.id, t)} small />
                                )}
                                <span className="text-sm font-semibold text-white">
                                  <AnimatedNumber value={priceOf(pr, it.type)} format={clp} />
                                </span>
                              </div>
                            </div>
                          </motion.li>
                        );
                      })}
                    </AnimatePresence>
                  </ul>
                )}
              </div>

              {cart.length > 0 && (
                <div className="border-t border-white/8 px-6 pb-6 pt-4">
                  <div className="mb-1 flex items-center justify-between text-sm text-white/55">
                    <span>Total</span>
                    <span className="text-2xl font-semibold tracking-tight text-white">
                      <AnimatedNumber value={cartTotal} format={clp} />
                    </span>
                  </div>
                  <p className="mb-4 flex items-center gap-1.5 text-xs text-white/45">
                    <Zap className="size-3.5 text-brand" /> Entrega automática a tu correo al confirmar el pago
                  </p>
                  <Link
                    href="/checkout"
                    onClick={() => setCartOpen(false)}
                    className="group flex h-12 items-center justify-center gap-2 rounded-2xl bg-brand font-semibold text-brand-ink transition hover:brightness-110"
                  >
                    Ir a pagar
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                  <p className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-white/40">
                    <ShieldCheck className="size-3.5" /> Pago protegido · Garantía de 6 meses
                  </p>
                </div>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
