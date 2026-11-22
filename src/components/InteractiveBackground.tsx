"use client";

import { useEffect, useRef } from "react";

/**
 * Fondo interactivo: una grilla de puntos que respira con una onda suave,
 * se ilumina y se aparta alrededor del cursor, y lanza una onda expansiva al hacer clic.
 * Los colores salen del tema activo (violeta → magenta sobre el color de texto).
 */
export function InteractiveBackground({ intensity = 1 }: { intensity?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const intensityRef = useRef(intensity);
  intensityRef.current = intensity;

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const GAP = 30;
    const RADIUS = 190;
    let w = 0;
    let h = 0;
    let dpr = 1;
    let raf = 0;
    let t = 0;

    const mouse = { x: -9999, y: -9999, tx: -9999, ty: -9999, active: false };
    const ripples: { x: number; y: number; start: number }[] = [];

    let fg = [236, 236, 243];
    let c1 = [132, 103, 255];
    let c2 = [224, 90, 209];
    let light = false;

    const hex = (v: string) => {
      const m = v.trim().replace("#", "");
      const n = parseInt(m.length === 3 ? m.split("").map((c) => c + c).join("") : m, 16);
      return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
    };
    const readTheme = () => {
      const cs = getComputedStyle(document.documentElement);
      try {
        fg = hex(cs.getPropertyValue("--fg") || "#ececf3");
        c1 = hex(cs.getPropertyValue("--color-brand") || "#8467ff");
        c2 = hex(cs.getPropertyValue("--color-brand-2") || "#e05ad1");
      } catch {}
      light = document.documentElement.dataset.theme === "light";
    };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = () => {
      const k = intensityRef.current;
      ctx.clearRect(0, 0, w, h);
      mouse.x += (mouse.tx - mouse.x) * 0.14;
      mouse.y += (mouse.ty - mouse.y) * 0.14;
      const base = light ? 0.13 : 0.1;
      const now = performance.now();
      for (let i = ripples.length - 1; i >= 0; i--) if (now - ripples[i].start > 1400) ripples.splice(i, 1);

      for (let x = GAP / 2; x < w; x += GAP) {
        for (let y = GAP / 2; y < h; y += GAP) {
          // onda ambiental
          const wave = (Math.sin(x * 0.012 + t * 0.9) + Math.cos(y * 0.015 - t * 0.7)) * 0.5;
          let a = base + wave * 0.05 * k;
          let r = 1;
          let px = x;
          let py = y;
          let glow = 0;

          // cursor
          if (mouse.active) {
            const dx = x - mouse.x;
            const dy = y - mouse.y;
            const d = Math.sqrt(dx * dx + dy * dy);
            if (d < RADIUS) {
              const f = 1 - d / RADIUS;
              const e = f * f * (3 - 2 * f); // suavizado
              glow = e * k;
              const push = e * 10 * k;
              px += (dx / (d || 1)) * push;
              py += (dy / (d || 1)) * push;
            }
          }
          // ondas de clic
          for (const rp of ripples) {
            const age = (now - rp.start) / 1400;
            const ring = age * 520;
            const d = Math.hypot(x - rp.x, y - rp.y);
            const band = 1 - Math.min(1, Math.abs(d - ring) / 40);
            if (band > 0) glow = Math.max(glow, band * (1 - age) * k);
          }

          a += glow * 0.85;
          r += glow * 1.7;
          let col = fg;
          if (glow > 0.02) {
            const mix = Math.min(1, glow * 1.3);
            const g = Math.min(1, (px / w) * 0.6 + glow * 0.4);
            const brand = [c1[0] + (c2[0] - c1[0]) * g, c1[1] + (c2[1] - c1[1]) * g, c1[2] + (c2[2] - c1[2]) * g];
            col = [fg[0] + (brand[0] - fg[0]) * mix, fg[1] + (brand[1] - fg[1]) * mix, fg[2] + (brand[2] - fg[2]) * mix];
          }
          ctx.fillStyle = `rgba(${col[0] | 0},${col[1] | 0},${col[2] | 0},${Math.max(0, Math.min(1, a))})`;
          ctx.beginPath();
          ctx.arc(px, py, r, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      t += 0.016;
      if (!reduce) raf = requestAnimationFrame(draw);
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      mouse.tx = e.clientX;
      mouse.ty = e.clientY;
      if (!mouse.active) {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
        mouse.active = true;
      }
    };
    const onLeave = () => {
      mouse.active = false;
    };
    const onDown = (e: PointerEvent) => {
      if (reduce) return;
      ripples.push({ x: e.clientX, y: e.clientY, start: performance.now() });
    };
    const onVis = () => {
      cancelAnimationFrame(raf);
      if (!document.hidden && !reduce) raf = requestAnimationFrame(draw);
    };

    readTheme();
    resize();
    draw();
    const obs = new MutationObserver(readTheme);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    document.addEventListener("visibilitychange", onVis);
    return () => {
      cancelAnimationFrame(raf);
      obs.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-[1]"
      style={{ maskImage: "linear-gradient(to bottom, #000 0%, #000 55%, rgba(0,0,0,0.35) 100%)" }}
    />
  );
}
