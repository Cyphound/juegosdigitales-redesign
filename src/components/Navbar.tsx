"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { createPortal } from "react-dom";
import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "framer-motion";
import {
  ChevronDown,
  LayoutDashboard,
  Library,
  LogOut,
  Menu as MenuIcon,
  Search,
  ShoppingBag,
  UserRound,
  X,
  ArrowRight,
} from "lucide-react";
import { Suspense, useEffect, useRef, useState } from "react";
import { useStore } from "@/lib/store";
import { COLLECTIONS, CollectionId, PLATFORMS, PRODUCTS } from "@/lib/data";
import { MEGA, MENU, MenuItem } from "@/lib/menu";
import { ThemeToggle } from "./ThemeToggle";

export function Logo() {
  return (
    <Link href="/" className="group shrink-0 leading-none" aria-label="Juegos Digitales Chile, inicio">
      <span className="block text-[17px] font-extrabold tracking-[-0.03em] text-white transition-colors group-hover:text-brand">
        Juegos Digitales
      </span>
      <span className="mt-1 block text-[10px] font-semibold uppercase tracking-[0.42em] text-brand">Chile</span>
    </Link>
  );
}

/** Lee los parámetros de la URL (necesita Suspense en Next.js) */
function SearchWatcher({ onChange }: { onChange: (s: string) => void }) {
  const sp = useSearchParams();
  useEffect(() => onChange(sp.toString()), [sp, onChange]);
  return null;
}

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, cart, setCartOpen, logout, ready } = useStore();
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState<string | null>(null);
  const [hover, setHover] = useState<string | null>(null);
  const [userMenu, setUserMenu] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [q, setQ] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const userRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Desenfoque y fondo que aumentan con el scroll
  const { scrollY } = useScroll();
  const blur = useTransform(scrollY, [0, 160], [0, 18]);
  const alpha = useTransform(scrollY, [0, 160], [0, 0.74]);
  const line = useTransform(scrollY, [0, 160], [0, 1]);
  const rowH = useTransform(scrollY, [0, 160], [72, 60]);
  const backdrop = useMotionTemplate`blur(${blur}px) saturate(160%)`;
  const bg = useMotionTemplate`rgba(var(--nav-bg), ${alpha})`;
  const [scrolled, setScrolled] = useState(false);
  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 8));

  useEffect(() => {
    setOpen(null);
    setUserMenu(false);
    setMobile(false);
  }, [pathname, search]);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (userRef.current && !userRef.current.contains(e.target as Node)) setUserMenu(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "/" && document.activeElement?.tagName !== "INPUT") {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === "Escape") setOpen(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (pathname === "/login") return null;

  const current = pathname + (search ? `?${search}` : "");
  const isActive = (it: MenuItem) => {
    if (it.label === "Categorías") return false;
    if (it.platform) return current.includes(`plataforma=${it.platform}`);
    if (it.label === "Packs") return current.includes("categoria=packs") && !current.includes("plataforma=");
    if (it.label === "Membresías") return current.includes("categoria=membresias");
    if (it.label === "Colecciones") return current.includes("coleccion=");
    return false;
  };

  const enter = (label: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(label);
    setHover(label);
  };
  const leave = () => {
    closeTimer.current = setTimeout(() => {
      setOpen(null);
      setHover(null);
    }, 140);
  };

  return (
    <header className="sticky top-0 z-40">
      <Suspense fallback={null}>
        <SearchWatcher onChange={setSearch} />
      </Suspense>

      {/* capa de fondo dinámica */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{ backdropFilter: backdrop, WebkitBackdropFilter: backdrop, backgroundColor: bg }}
      />
      <motion.div aria-hidden className="absolute inset-x-0 bottom-0 h-px bg-white/8" style={{ opacity: line }} />

      {/* Fila 1 */}
      <motion.div style={{ height: rowH }} className="mx-auto flex max-w-7xl items-center gap-3 px-4 md:gap-6 md:px-6">
        <button
          onClick={() => setMobile(true)}
          aria-label="Abrir menú"
          className="grid size-10 place-items-center rounded-full text-white/70 hover:bg-white/8 hover:text-white lg:hidden"
        >
          <MenuIcon className="size-5" />
        </button>
        <Logo />

        <form
          onSubmit={(e) => {
            e.preventDefault();
            router.push(`/catalogo${q ? `?q=${encodeURIComponent(q)}` : ""}`);
          }}
          className="mx-auto hidden w-full max-w-xl md:block"
        >
          <label className="group flex h-11 items-center gap-2.5 rounded-full bg-white/[0.05] px-4 text-white/45 ring-1 ring-white/8 transition focus-within:bg-white/[0.07] focus-within:ring-2 focus-within:ring-brand/50">
            <Search className="size-4 shrink-0" />
            <input
              ref={inputRef}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar juegos, membresías y más"
              className="w-full bg-transparent text-sm text-white placeholder:text-white/40 focus:outline-none"
            />
            <kbd className="hidden rounded-md px-1.5 py-0.5 font-mono text-[10px] text-white/40 ring-1 ring-white/12 group-focus-within:hidden lg:block">/</kbd>
          </label>
        </form>

        <div className="ml-auto flex items-center gap-1 md:ml-0">
          <ThemeToggle />
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setCartOpen(true)}
            aria-label="Abrir carrito"
            className="relative grid size-10 place-items-center rounded-full text-white/75 transition hover:bg-white/8 hover:text-white"
          >
            <ShoppingBag className="size-[18px]" />
            <AnimatePresence>
              {ready && cart.length > 0 && (
                <motion.span
                  key={cart.length}
                  initial={{ scale: 0 }}
                  animate={{ scale: [1.5, 1] }}
                  exit={{ scale: 0 }}
                  className="absolute right-0.5 top-0.5 grid size-[18px] place-items-center rounded-full bg-brand text-[10px] font-bold text-brand-ink"
                >
                  {cart.length}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>

          {ready && user ? (
            <div ref={userRef} className="relative z-[60] ml-1">
              <button
                onClick={() => setUserMenu((m) => !m)}
                className="flex items-center gap-2 rounded-full py-1 pl-1 pr-2.5 transition hover:bg-white/8"
              >
                <span className="grid size-8 place-items-center rounded-full text-sm font-bold text-[#fff]" style={{ background: user.avatar }}>
                  {user.name[0]}
                </span>
                <span className="hidden text-[13px] font-medium text-white sm:block">{user.name}</span>
                <ChevronDown className={`hidden size-3.5 text-white/50 transition-transform sm:block ${userMenu ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence>
                {userMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -6, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.97 }}
                    transition={{ duration: 0.2 }}
                    className="solid absolute right-0 top-12 z-[60] w-60 origin-top-right rounded-2xl p-1.5 shadow-2xl"
                  >
                    <p className="px-3 pb-2 pt-2 text-xs text-white/45">{user.email}</p>
                    {user.role === "admin" && <DropLink href="/admin" icon={<LayoutDashboard className="size-4" />} label="Panel de administración" />}
                    <DropLink href="/cuenta" icon={<Library className="size-4" />} label="Mi biblioteca y perfil" />
                    <button
                      onClick={() => {
                        logout();
                        router.push("/login");
                      }}
                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-white/75 transition hover:bg-white/6 hover:text-white"
                    >
                      <LogOut className="size-4" /> Cerrar sesión
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link
              href="/login"
              className="ml-1 flex h-10 items-center gap-2 rounded-full bg-white px-4 text-[13px] font-semibold text-black transition hover:opacity-85"
            >
              <UserRound className="size-4" /> <span className="hidden sm:inline">Ingresar</span>
            </Link>
          )}
        </div>
      </motion.div>

      {/* Fila 2: menú del sitio original */}
      <nav className="relative hidden lg:block" onMouseLeave={leave}>
        <motion.div
          className="absolute inset-x-0 top-0 h-px bg-white/6"
          animate={{ opacity: scrolled ? 0 : 1 }}
        />
        <ul className="mx-auto flex h-11 max-w-7xl items-center gap-0.5 px-4 md:px-6">
          {MENU.map((it) => {
            const active = isActive(it);
            const hasPanel = it.label === "Categorías" || !!it.children;
            return (
              <li key={it.label} className="relative h-full" onMouseEnter={() => enter(it.label)}>
                <Link
                  href={it.href}
                  onClick={(e) => {
                    if (it.label === "Categorías") {
                      e.preventDefault();
                      setOpen((o) => (o === it.label ? null : it.label));
                    }
                  }}
                  className={`flex h-full items-center gap-1.5 px-3 text-[12px] font-medium uppercase tracking-[0.08em] transition-colors ${
                    active || open === it.label ? "text-white" : "text-white/55 hover:text-white"
                  }`}
                >
                  {it.label === "Categorías" && <MenuIcon className="size-3.5" />}
                  {it.platform && <span className="size-1.5 rounded-full" style={{ background: PLATFORMS[it.platform].color }} />}
                  {it.label}
                  {hasPanel && it.label !== "Categorías" && (
                    <ChevronDown className={`size-3 opacity-60 transition-transform duration-300 ${open === it.label ? "rotate-180" : ""}`} />
                  )}
                </Link>
                {(hover === it.label || (!hover && active)) && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute inset-x-3 bottom-0 h-[2px] rounded-full"
                    style={{ background: it.platform ? PLATFORMS[it.platform].color : "var(--color-brand)" }}
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                  />
                )}

                {/* desplegable simple */}
                <AnimatePresence>
                  {open === it.label && it.children && (
                    <motion.div
                      initial={{ opacity: 0, y: -6, filter: "blur(6px)" }}
                      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      exit={{ opacity: 0, y: -6, filter: "blur(6px)" }}
                      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                      className="solid absolute left-0 top-full z-50 mt-1 min-w-60 rounded-2xl p-1.5 shadow-2xl"
                    >
                      {it.children.map((c, i) => (
                        <motion.div key={c.label} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}>
                          <Link
                            href={c.href}
                            className="group flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-sm text-white/75 transition hover:bg-white/6 hover:text-white"
                          >
                            <span>
                              <span className="block">{c.label}</span>
                              {c.hint && <span className="block text-xs text-white/40">{c.hint}</span>}
                            </span>
                            <ArrowRight className="size-3.5 -translate-x-1 opacity-0 transition group-hover:translate-x-0 group-hover:opacity-60" />
                          </Link>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>

        {/* Megamenú de categorías */}
        <AnimatePresence>{open === "Categorías" && <MegaMenu />}</AnimatePresence>
      </nav>

      <MobileMenu open={mobile} onClose={() => setMobile(false)} />
    </header>
  );
}

function MegaMenu() {
  const count = (fn: (p: (typeof PRODUCTS)[number]) => boolean) => PRODUCTS.filter(fn).length;
  return (
    <motion.div
      initial={{ opacity: 0, y: -8, filter: "blur(8px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      exit={{ opacity: 0, y: -8, filter: "blur(8px)" }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      className="absolute inset-x-0 top-full z-50 px-4 pt-1 md:px-6"
    >
      <div className="solid mx-auto grid max-w-7xl grid-cols-4 gap-6 rounded-3xl p-6 shadow-2xl">
        <MegaCol title="Destacados" items={MEGA.destacados} />
        <div>
          <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.16em] text-white/40">Por plataforma</p>
          <div className="space-y-0.5">
            {Object.values(PLATFORMS).map((pl) => (
              <Link
                key={pl.id}
                href={`/catalogo?plataforma=${pl.id}`}
                className="group flex items-center justify-between rounded-xl px-3 py-2 text-sm text-white/75 transition hover:bg-white/6 hover:text-white"
              >
                <span className="flex items-center gap-2.5">
                  <span className="size-2 rounded-full" style={{ background: pl.color }} />
                  {pl.name}
                </span>
                <span className="text-xs text-white/35">{count((p) => p.platform === pl.id)}</span>
              </Link>
            ))}
          </div>
        </div>
        <MegaCol title="Formatos" items={MEGA.formatos} />
        <div>
          <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.16em] text-white/40">Colecciones</p>
          <div className="space-y-0.5">
            {(Object.keys(COLLECTIONS) as CollectionId[]).map((c) => (
              <Link
                key={c}
                href={`/catalogo?coleccion=${c}`}
                className="flex items-center justify-between rounded-xl px-3 py-2 text-sm text-white/75 transition hover:bg-white/6 hover:text-white"
              >
                {COLLECTIONS[c]}
                <span className="text-xs text-white/35">{count((p) => !!p.collections?.includes(c))}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function MegaCol({ title, items }: { title: string; items: { label: string; href: string; hint?: string }[] }) {
  return (
    <div>
      <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.16em] text-white/40">{title}</p>
      <div className="space-y-0.5">
        {items.map((it) => (
          <Link key={it.label} href={it.href} className="block rounded-xl px-3 py-2 transition hover:bg-white/6">
            <span className="block text-sm text-white">{it.label}</span>
            {it.hint && <span className="block text-xs text-white/40">{it.hint}</span>}
          </Link>
        ))}
      </div>
    </div>
  );
}

function DropLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link href={href} className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-white/75 transition hover:bg-white/6 hover:text-white">
      {icon}
      {label}
    </Link>
  );
}

function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [mounted, setMounted] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          <motion.div className="fixed inset-0 z-50 bg-black/50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 280, damping: 32 }}
            className="solid fixed inset-y-0 left-0 z-50 flex w-[86%] max-w-sm flex-col"
          >
            <div className="flex items-center justify-between px-5 py-4">
              <Logo />
              <button onClick={onClose} aria-label="Cerrar menú" className="grid size-9 place-items-center rounded-full text-white/60 hover:bg-white/8">
                <X className="size-5" />
              </button>
            </div>
            <ul className="flex-1 overflow-y-auto px-3 pb-6">
              {MENU.filter((m) => m.label !== "Categorías").map((it, i) => (
                <motion.li key={it.label} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 + i * 0.03 }}>
                  <div className="flex items-center">
                    <Link href={it.href} onClick={onClose} className="flex flex-1 items-center gap-2.5 rounded-xl px-3 py-3 text-[15px] font-medium text-white">
                      {it.platform && <span className="size-2 rounded-full" style={{ background: PLATFORMS[it.platform].color }} />}
                      {it.label}
                    </Link>
                    {it.children && (
                      <button
                        onClick={() => setExpanded((e) => (e === it.label ? null : it.label))}
                        aria-label={`Ver ${it.label}`}
                        className="grid size-10 place-items-center text-white/50"
                      >
                        <ChevronDown className={`size-4 transition-transform ${expanded === it.label ? "rotate-180" : ""}`} />
                      </button>
                    )}
                  </div>
                  <AnimatePresence initial={false}>
                    {expanded === it.label && it.children && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                        {it.children.map((c) => (
                          <Link key={c.label} href={c.href} onClick={onClose} className="block rounded-xl py-2.5 pl-8 pr-3 text-sm text-white/60 hover:text-white">
                            {c.label}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.li>
              ))}
            </ul>
          </motion.aside>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}
