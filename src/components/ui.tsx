"use client";

import { animate, motion, useInView, useMotionValue, useTransform, HTMLMotionProps } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { PLATFORMS, PlatformId } from "@/lib/data";

/* Contenedor liquid glass con luz que sigue al cursor */
export function Glass({
  className = "",
  children,
  strong,
  ...rest
}: HTMLMotionProps<"div"> & { strong?: boolean }) {
  return (
    <motion.div
      {...rest}
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
        e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
        rest.onMouseMove?.(e);
      }}
      className={`lg ${strong ? "lg-strong" : ""} ${className}`}
    >
      <div className="relative z-[2] h-full">{children as React.ReactNode}</div>
    </motion.div>
  );
}

export function PlatformBadge({ id, size = "sm" }: { id: PlatformId; size?: "sm" | "md" }) {
  const pl = PLATFORMS[id];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold tracking-wide ${
        size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-3 py-1 text-xs"
      }`}
      style={{ background: pl.soft, color: pl.color, boxShadow: `inset 0 0 0 1px ${pl.color}40` }}
    >
      <span className="size-1.5 rounded-full" style={{ background: pl.color }} />
      {pl.short}
    </span>
  );
}

/* Aparece al entrar en pantalla */
export function Reveal({
  children,
  delay = 0,
  y = 24,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y, filter: "blur(8px)" }}
      animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

/* Número que se anima al cambiar */
export function AnimatedNumber({ value, format }: { value: number; format: (n: number) => string }) {
  const mv = useMotionValue(value);
  const text = useTransform(mv, (v) => format(v));
  const [display, setDisplay] = useState(format(value));
  useEffect(() => {
    const c = animate(mv, value, { duration: 0.6, ease: [0.22, 1, 0.36, 1] });
    return () => c.stop();
  }, [value, mv]);
  useEffect(() => text.on("change", setDisplay), [text]);
  return <span className="tabular-nums">{display}</span>;
}

/* Cuenta regresiva para ofertas flash */
export function Countdown({ hours = 7 }: { hours?: number }) {
  const [end] = useState(() => Date.now() + hours * 3600_000 + 23 * 60_000);
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  const left = Math.max(0, end - (now ?? end - hours * 3600_000));
  const h = Math.floor(left / 3600_000);
  const m = Math.floor((left % 3600_000) / 60_000);
  const s = Math.floor((left % 60_000) / 1000);
  const cells = [
    [h, "h"],
    [m, "m"],
    [s, "s"],
  ] as const;
  return (
    <div className="flex items-center gap-1.5 font-mono">
      {cells.map(([v, l]) => (
        <span key={l} className="lg flex min-w-11 items-baseline justify-center rounded-lg px-2 py-1 text-sm">
          <span className="relative z-[2] tabular-nums text-white">{String(v).padStart(2, "0")}</span>
          <span className="relative z-[2] ml-0.5 text-[10px] text-white/50">{l}</span>
        </span>
      ))}
    </div>
  );
}

/* Encabezado de sección */
export function SectionTitle({
  eyebrow,
  title,
  icon,
  right,
}: {
  eyebrow?: string;
  title: string;
  icon?: React.ReactNode;
  right?: React.ReactNode;
}) {
  return (
    <div className="mb-5 flex items-end justify-between gap-4">
      <div>
        {eyebrow && (
          <p className="mb-1.5 flex items-center gap-1.5 text-xs font-medium uppercase tracking-[0.18em] text-white/45">
            {icon}
            {eyebrow}
          </p>
        )}
        <h2 className="text-2xl font-semibold tracking-tight text-white md:text-[28px]">{title}</h2>
      </div>
      {right}
    </div>
  );
}

export const ease = [0.22, 1, 0.36, 1] as const;
