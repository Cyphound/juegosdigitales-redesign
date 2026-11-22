"use client";

import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Plus, Check, Sparkles, Users, TrendingUp, Clock } from "lucide-react";
import { useState } from "react";
import { GENRES, Product, clp, discountPct, PLATFORMS } from "@/lib/data";
import { useStore } from "@/lib/store";
import { GameArt } from "./GameArt";

export function ProductCard({
  product,
  reason,
  kind,
  index = 0,
}: {
  product: Product;
  reason?: string;
  kind?: "colaborativo" | "contenido" | "popularidad";
  index?: number;
}) {
  const { addToCart, cart, setCartOpen } = useStore();
  const inCart = cart.some((c) => c.id === product.id);
  const [pulse, setPulse] = useState(0);
  const pl = PLATFORMS[product.platform];

  // Inclinación 3D según la posición del cursor
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rx = useSpring(useTransform(my, [0, 1], [7, -7]), { stiffness: 200, damping: 18 });
  const ry = useSpring(useTransform(mx, [0, 1], [-9, 9]), { stiffness: 200, damping: 18 });

  const ReasonIcon = kind === "colaborativo" ? Users : kind === "contenido" ? Sparkles : TrendingUp;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.94 }}
      transition={{ duration: 0.55, delay: Math.min(index, 10) * 0.05, ease: [0.22, 1, 0.36, 1] }}
      style={{ perspective: 900 }}
      className="group"
    >
      <motion.div
        onMouseMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          mx.set((e.clientX - r.left) / r.width);
          my.set((e.clientY - r.top) / r.height);
          e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
          e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
        }}
        onMouseLeave={() => {
          mx.set(0.5);
          my.set(0.5);
        }}
        style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}
        whileHover={{ y: -6 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="lg rounded-[22px] p-2"
      >
        <div className="relative z-[2]">
          <Link href={`/producto/${product.id}`} className="block">
            <div className="relative overflow-hidden rounded-[16px]">
              <motion.div whileHover={{ scale: 1.06 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
                <GameArt product={product} className="aspect-[3/4]" />
              </motion.div>
              <div className="absolute right-2.5 top-[13%] flex flex-col items-end gap-1.5">
                {product.release === "preventa" ? (
                  <span className="lg rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white">
                    <span className="relative z-[2] flex items-center gap-1">
                      <Clock className="size-3" /> Preventa
                    </span>
                  </span>
                ) : (
                  <span className="rounded-full bg-brand px-2 py-0.5 text-[11px] font-bold text-brand-ink">
                    -{discountPct(product)}%
                  </span>
                )}
              </div>
            </div>
          </Link>

          <div className="px-1.5 pb-1.5 pt-3">
            {reason && (
              <p className="mb-2 flex items-center gap-1.5 text-[11px] font-medium text-white/60">
                <ReasonIcon className="size-3.5 shrink-0" style={{ color: pl.color }} />
                <span className="line-clamp-1">{reason}</span>
              </p>
            )}
            <Link href={`/producto/${product.id}`}>
              <h3 className="line-clamp-1 text-[15px] font-semibold text-white">{product.title}</h3>
            </Link>
            <p className="mt-0.5 line-clamp-1 text-xs text-white/45">
              {product.genres.slice(0, 2).map((g) => GENRES[g]).join(" · ")}
            </p>
            <div className="mt-3 flex items-end justify-between">
              <div>
                <p className="text-[11px] text-white/40 line-through">{clp(product.listPrice)}</p>
                <p className="text-lg font-semibold leading-tight tracking-tight text-white">
                  <span className="mr-1 text-[11px] font-normal text-white/45">desde</span>
                  {clp(product.priceSecundaria)}
                </p>
              </div>
              <motion.button
                key={pulse}
                aria-label={inCart ? "Ver carrito" : "Agregar al carrito"}
                onClick={() => {
                  if (inCart) return setCartOpen(true);
                  addToCart(product.id, "secundaria");
                  setPulse((p) => p + 1);
                }}
                whileTap={{ scale: 0.85 }}
                animate={pulse ? { scale: [1, 1.25, 1] } : {}}
                className={`grid size-10 place-items-center rounded-full transition-colors ${
                  inCart ? "bg-white/10 text-white" : "bg-brand text-brand-ink hover:brightness-110"
                }`}
              >
                {inCart ? <Check className="size-4.5" /> : <Plus className="size-5" />}
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
