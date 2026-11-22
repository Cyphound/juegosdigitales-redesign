"use client";

import { useState } from "react";
import { PLATFORMS, Product } from "@/lib/data";
import { RealImage } from "./RealImage";

/**
 * Portada del juego.
 * 1) Si existe /public/covers/<id>.(jpg|webp|png) se muestra la carátula real.
 * 2) Si no, se usa una portada generativa con los colores del juego.
 */
export function GameArt({
  product,
  className = "",
  showTitle = true,
  big = false,
}: {
  product: Product;
  className?: string;
  showTitle?: boolean;
  big?: boolean;
}) {
  const [real, setReal] = useState(false);
  const [c1, c2, c3] = product.art;
  const pl = PLATFORMS[product.platform];
  const initials = product.title
    .replace(/[^A-Za-zÀ-ÿ0-9 ]/g, "")
    .split(" ")
    .filter((w) => w.length > 2 || /\d/.test(w))
    .slice(0, 2)
    .map((w) => w[0])
    .join("");

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{
        background: `radial-gradient(120% 80% at 15% 10%, ${c1}cc 0%, transparent 55%),
          radial-gradient(90% 90% at 90% 85%, ${c2}bb 0%, transparent 60%),
          linear-gradient(160deg, ${c3} 0%, #050507 100%)`,
      }}
    >
      {/* franja de plataforma, como las carátulas oficiales */}
      <div
        className="absolute inset-x-0 top-0 z-10 flex h-[9%] min-h-5 items-center px-3"
        style={{ background: `linear-gradient(90deg, ${pl.color}, ${pl.color}cc)` }}
      >
        <span className={`font-black italic tracking-tight text-[#fff] ${big ? "text-lg" : "text-[11px]"}`}>{pl.short}</span>
      </div>

      {/* destello diagonal */}
      <div
        className="absolute -inset-1/2 rotate-[24deg] opacity-30 mix-blend-overlay"
        style={{
          background: "repeating-linear-gradient(90deg, transparent 0 22px, rgba(255,255,255,0.22) 22px 24px, transparent 24px 60px)",
        }}
      />
      {/* monograma gigante */}
      <span
        className={`pointer-events-none absolute -right-[4%] bottom-[8%] select-none font-black leading-none tracking-tighter ${
          big ? "text-[12rem]" : "text-[7.5rem]"
        }`}
        style={{ WebkitTextStroke: "1.5px rgba(255,255,255,0.22)", color: "transparent" }}
      >
        {initials}
      </span>
      <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.85), rgba(0,0,0,0.1) 50%, transparent)" }} />

      {showTitle && (
        <div className="absolute inset-x-0 bottom-0 p-3.5">
          <p
            className={`font-extrabold uppercase leading-[0.95] tracking-tight text-[#fff] drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)] text-balance ${
              big ? "text-4xl md:text-5xl" : "text-[17px]"
            }`}
          >
            {product.title}
          </p>
        </div>
      )}
      <RealImage
        base={`/covers/${product.id}`}
        alt={product.title}
        onReady={() => setReal(true)}
        className="absolute inset-0 z-20 size-full object-cover"
      />
      {real && <div className="pointer-events-none absolute inset-0 z-20 ring-1 ring-inset ring-white/10" />}
    </div>
  );
}
