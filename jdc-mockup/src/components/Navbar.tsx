"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { Gamepad2, LayoutDashboard, LogOut, Search, ShoppingBag, UserRound, Library } from "lucide-react";
import { useEffect, useState } from "react";
import { useStore } from "@/lib/store";
import { PLATFORMS } from "@/lib/data";

const LINKS = [
  { href: "/", label: "Inicio" },
  { href: "/catalogo", label: "Catálogo" },
  { href: "/catalogo?plataforma=ps5", label: "PS5" },
  { href: "/catalogo?plataforma=ps4", label: "PS4" },
  { href: "/catalogo?plataforma=xbox", label: "Xbox" },
  { href: "/catalogo?plataforma=switch", label: "Switch" },
];

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2.5">
      <motion.span
        whileHover={{ rotate: -12, scale: 1.08 }}
        className="grid size-9 place-items-center rounded-xl bg-brand text-brand-ink shadow-[0_0_24px_rgba(250,204,21,0.35)]"
      >
        <Gamepad2 className="size-5" strokeWidth={2.4} />
      </motion.span>
      {!compact && (
        <span className="leading-none">
          <span className="block text-[13px] font-bold tracking-tight text-white">Juegos Digitales</span>
          <span className="block text-[10px] font-semibold uppercase tracking-[0.3em] text-brand">Chile</span>
        </span>
      )}
    </Link>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, cart, setCartOpen, logout, ready } = useStore();
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);
  const [q, setQ] = useState("");
  const [loc, setLoc] = useState("");
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 24));
  useEffect(() => setLoc(window.location.pathname + window.location.search), [pathname]);
  useEffect(() => setMenu(false), [pathname]);

  if (pathname === "/login") return null;

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="sticky top-0 z-40 px-3 pt-3 md:px-6"
    >
      <motion.nav
        animate={{ maxWidth: scrolled ? 1120 : 1280 }}
        transition={{ type: "spring", stiffness: 180, damping: 26 }}
        className="lg mx-auto rounded-[22px]"
        onMouseMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
          e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
        }}
      >
        <div className="relative z-[2] flex h-16 items-center gap-4 px-3 md:px-4">
          <Logo />
          <ul className="ml-4 hidden items-center gap-0.5 lg:flex">
            {LINKS.map((l) => {
              const active = l.href === loc || (l.href === "/catalogo" && loc === "/catalogo");
              const plat = l.href.split("plataforma=")[1] as keyof typeof PLATFORMS | undefined;
              return (
                <li key={l.href} className="relative">
                  <Link
                    href={l.href}
                    className={`relative z-10 flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[13px] font-medium transition-colors ${
                      active ? "text-white" : "text-white/55 hover:text-white"
                    }`}
                  >
                    {plat && <span className="size-1.5 rounded-full" style={{ background: PLATFORMS[plat].color }} />}
                    {l.label}
                  </Link>
                  {active && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-full bg-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.25)]"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </li>
              );
            })}
          </ul>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              router.push(`/catalogo${q ? `?q=${encodeURIComponent(q)}` : ""}`);
            }}
            className="ml-auto hidden md:block"
          >
            <label className="group flex h-10 w-56 items-center gap-2 rounded-full bg-black/25 px-3.5 text-white/50 ring-1 ring-white/10 transition-all focus-within:w-72 focus-within:ring-brand/50 xl:w-64">
              <Search className="size-4 shrink-0" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Buscar juegos"
                className="w-full bg-transparent text-sm text-white placeholder:text-white/40 focus:outline-none"
              />
            </label>
          </form>

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setCartOpen(true)}
            aria-label="Abrir carrito"
            className="relative ml-auto grid size-10 place-items-center rounded-full bg-white/8 text-white ring-1 ring-white/10 transition hover:bg-white/15 md:ml-0"
          >
            <ShoppingBag className="size-[18px]" />
            <AnimatePresence>
              {ready && cart.length > 0 && (
                <motion.span
                  key={cart.length}
                  initial={{ scale: 0 }}
                  animate={{ scale: [1.5, 1] }}
                  exit={{ scale: 0 }}
                  className="absolute -right-1 -top-1 grid size-5 place-items-center rounded-full bg-brand text-[11px] font-bold text-brand-ink"
                >
                  {cart.length}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>

          {ready && user ? (
            <div className="relative">
              <button
                onClick={() => setMenu((m) => !m)}
                className="flex items-center gap-2 rounded-full bg-white/8 py-1 pl-1 pr-3 ring-1 ring-white/10 transition hover:bg-white/15"
              >
                <span
                  className="grid size-8 place-items-center rounded-full text-sm font-bold text-black"
                  style={{ background: user.avatar }}
                >
                  {user.name[0]}
                </span>
                <span className="hidden text-[13px] font-medium text-white sm:block">{user.name}</span>
              </button>
              <AnimatePresence>
                {menu && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.96, filter: "blur(6px)" }}
                    animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -8, scale: 0.96, filter: "blur(6px)" }}
                    transition={{ duration: 0.25 }}
                    className="lg lg-strong absolute right-0 top-12 w-60 origin-top-right rounded-2xl p-2"
                  >
                    <div className="relative z-[2]">
                      <p className="px-3 pb-2 pt-1 text-xs text-white/45">{user.email}</p>
                      {user.role === "admin" && (
                        <MenuItem href="/admin" icon={<LayoutDashboard className="size-4" />} label="Panel de administración" />
                      )}
                      <MenuItem href="/cuenta" icon={<Library className="size-4" />} label="Mi biblioteca y perfil" />
                      <button
                        onClick={() => {
                          logout();
                          router.push("/login");
                        }}
                        className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-white/75 transition hover:bg-white/8 hover:text-white"
                      >
                        <LogOut className="size-4" /> Cerrar sesión
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link
              href="/login"
              className="flex h-10 items-center gap-2 rounded-full bg-white px-4 text-[13px] font-semibold text-black transition hover:bg-white/85"
            >
              <UserRound className="size-4" /> Ingresar
            </Link>
          )}
        </div>
      </motion.nav>
    </motion.header>
  );
}

function MenuItem({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-white/75 transition hover:bg-white/8 hover:text-white"
    >
      {icon}
      {label}
    </Link>
  );
}
