"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { AccountType, DEMO_USERS, GenreId, PlatformId, UserProfile, priceOf, productById } from "./data";

export interface CartItem {
  id: string;
  type: AccountType;
}

export interface Order {
  code: string;
  items: CartItem[];
  total: number;
  method: string;
  date: string;
}

interface StoreState {
  ready: boolean;
  user: UserProfile | null;
  cart: CartItem[];
  orders: Order[];
  cartOpen: boolean;
  setCartOpen: (v: boolean) => void;
  login: (email: string) => UserProfile;
  logout: () => void;
  updatePrefs: (platform: PlatformId, genres: GenreId[]) => void;
  addToCart: (id: string, type: AccountType) => void;
  removeFromCart: (id: string) => void;
  setItemType: (id: string, type: AccountType) => void;
  clearCart: () => void;
  placeOrder: (method: string) => Order;
  cartTotal: number;
}

const Ctx = createContext<StoreState | null>(null);
const KEY = "jdc-mockup-v1";

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const s = JSON.parse(raw);
        setUser(s.user ?? null);
        setCart(s.cart ?? []);
        setOrders(s.orders ?? []);
      }
    } catch {}
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(KEY, JSON.stringify({ user, cart, orders }));
    } catch {}
  }, [ready, user, cart, orders]);

  const login = useCallback((email: string) => {
    const clean = email.trim().toLowerCase();
    const demo = DEMO_USERS.find((u) => u.email === clean);
    const raw = clean.split("@")[0] || "Gamer";
    const u: UserProfile = demo
      ? { ...demo }
      : {
          email: clean,
          name: raw.charAt(0).toUpperCase() + raw.slice(1),
          role: "cliente",
          platform: null,
          genres: [],
          purchases: [],
          avatar: "#8467FF",
        };
    setUser(u);
    setCart([]);
    setOrders([]);
    return u;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setCart([]);
    setOrders([]);
  }, []);

  const updatePrefs = useCallback((platform: PlatformId, genres: GenreId[]) => {
    setUser((u) => (u ? { ...u, platform, genres } : u));
  }, []);

  const addToCart = useCallback((id: string, type: AccountType) => {
    setCart((c) => (c.some((x) => x.id === id) ? c.map((x) => (x.id === id ? { ...x, type } : x)) : [...c, { id, type }]));
  }, []);

  const removeFromCart = useCallback((id: string) => setCart((c) => c.filter((x) => x.id !== id)), []);
  const setItemType = useCallback(
    (id: string, type: AccountType) => setCart((c) => c.map((x) => (x.id === id ? { ...x, type } : x))),
    []
  );
  const clearCart = useCallback(() => setCart([]), []);

  const cartTotal = useMemo(
    () => cart.reduce((sum, it) => sum + (productById(it.id) ? priceOf(productById(it.id)!, it.type) : 0), 0),
    [cart]
  );

  const placeOrder = useCallback(
    (method: string) => {
      const order: Order = {
        code: "JDC-" + Math.floor(100000 + Math.random() * 899999),
        items: cart,
        total: cartTotal,
        method,
        date: new Date().toISOString(),
      };
      setOrders((o) => [order, ...o]);
      setUser((u) => (u ? { ...u, purchases: [...new Set([...u.purchases, ...cart.map((c) => c.id)])] } : u));
      setCart([]);
      return order;
    },
    [cart, cartTotal]
  );

  const value: StoreState = {
    ready,
    user,
    cart,
    orders,
    cartOpen,
    setCartOpen,
    login,
    logout,
    updatePrefs,
    addToCart,
    removeFromCart,
    setItemType,
    clearCart,
    placeOrder,
    cartTotal,
  };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useStore fuera de StoreProvider");
  return v;
}
