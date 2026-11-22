"use client";

import { useState } from "react";
import images from "@/lib/images.json";

const AVAILABLE = images as Record<string, string>;

export const hasImage = (base: string) => !!AVAILABLE[base];

/**
 * Muestra una imagen real de /public si existe (ej. /covers/spider-man-2-ps5.jpg).
 * La lista se genera sola con `scripts/scan-images.mjs` antes de dev/build.
 * Si no existe, no muestra nada y queda visible el diseño de respaldo.
 */
export function RealImage({
  base,
  alt,
  className = "",
  onReady,
}: {
  base: string; // ruta sin extensión, ej. "/covers/spider-man-2-ps5"
  alt: string;
  className?: string;
  onReady?: () => void;
}) {
  const [loaded, setLoaded] = useState(false);
  const src = AVAILABLE[base];
  if (!src) return null;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onLoad={() => {
        setLoaded(true);
        onReady?.();
      }}
      className={`${className} transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"}`}
    />
  );
}
