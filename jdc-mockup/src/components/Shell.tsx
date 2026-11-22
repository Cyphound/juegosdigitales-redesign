"use client";

import { usePathname } from "next/navigation";
import { MotionConfig } from "framer-motion";
import { useEffect } from "react";
import { Headphones, ShieldCheck, Zap, BadgeCheck } from "lucide-react";
import { StoreProvider } from "@/lib/store";
import { Navbar, Logo } from "./Navbar";
import { CartDrawer } from "./CartDrawer";

/** Cambia el color ambiental del fondo (aurora) según plataforma */
export function useAmbient(color: string | undefined | null) {
  useEffect(() => {
    document.documentElement.style.setProperty("--plat", color || "#facc15");
  }, [color]);
}

export function Shell({ children }: { children: React.ReactNode }) {
  return (
    <StoreProvider>
      <MotionConfig reducedMotion="user">
        <div className="aurora" aria-hidden>
          <div className="blob b1" />
          <div className="blob b2" />
          <div className="blob b3" />
          <div className="grid" />
          <div className="grain" />
        </div>
        <Navbar />
        <main>{children}</main>
        <Footer />
        <CartDrawer />
      </MotionConfig>
    </StoreProvider>
  );
}

function Footer() {
  const pathname = usePathname();
  if (pathname === "/login") return null;
  const perks = [
    { icon: Zap, t: "Entrega automática", d: "Credenciales en tu correo en minutos" },
    { icon: ShieldCheck, t: "Pago seguro", d: "Webpay, Mercado Pago y MACH" },
    { icon: BadgeCheck, t: "Licencias originales", d: "Garantía total de 6 meses" },
    { icon: Headphones, t: "Soporte 7 días", d: "Asistente y videotutorial" },
  ];
  return (
    <footer className="mx-auto mt-24 max-w-7xl px-4 pb-10 md:px-6">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {perks.map(({ icon: Icon, t, d }) => (
          <div key={t} className="flex items-start gap-3 rounded-2xl bg-white/[0.03] p-4 ring-1 ring-white/6">
            <Icon className="mt-0.5 size-5 text-brand" />
            <div>
              <p className="text-sm font-medium text-white">{t}</p>
              <p className="text-xs text-white/45">{d}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-10 flex flex-col items-start justify-between gap-6 border-t border-white/6 pt-8 md:flex-row md:items-center">
        <Logo />
        <p className="max-w-md text-xs leading-relaxed text-white/35">
          Rediseño conceptual con fines académicos (Evaluación 3, E-commerce, INACAP). Datos, precios y pagos son
          simulados.
        </p>
      </div>
    </footer>
  );
}
