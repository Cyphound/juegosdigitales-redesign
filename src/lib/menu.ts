import { PlatformId } from "./data";

/** Menú con la misma estructura que el sitio original */
export interface MenuLink {
  label: string;
  href: string;
  hint?: string;
}
export interface MenuItem {
  label: string;
  href: string;
  platform?: PlatformId;
  children?: MenuLink[];
}

const cat = (q: string) => `/catalogo?${q}`;

export const MENU: MenuItem[] = [
  { label: "Categorías", href: "/catalogo" }, // abre el megamenú
  {
    label: "PS5",
    href: cat("plataforma=ps5"),
    platform: "ps5",
    children: [
      { label: "Todos los juegos", href: cat("plataforma=ps5") },
      { label: "Estrenos PS5", href: cat("plataforma=ps5&categoria=estrenos") },
      { label: "Pack PS5", href: cat("plataforma=ps5&categoria=packs") },
      { label: "Preventa PS5", href: cat("plataforma=ps5&categoria=preventa") },
    ],
  },
  {
    label: "PS4",
    href: cat("plataforma=ps4"),
    platform: "ps4",
    children: [
      { label: "Todos los juegos", href: cat("plataforma=ps4") },
      { label: "Estrenos PS4", href: cat("plataforma=ps4&categoria=estrenos") },
      { label: "3 juegos en 1", href: cat("plataforma=ps4&categoria=packs") },
      { label: "Pack PS4", href: cat("plataforma=ps4&categoria=packs") },
    ],
  },
  {
    label: "PS3",
    href: cat("plataforma=ps3"),
    platform: "ps3",
    children: [
      { label: "Clásicos PS3", href: cat("plataforma=ps3") },
      { label: "4 juegos en 1", href: cat("plataforma=ps3&categoria=packs") },
      { label: "Pack PS3", href: cat("plataforma=ps3&categoria=packs") },
    ],
  },
  {
    label: "Xbox",
    href: cat("plataforma=xbox"),
    platform: "xbox",
    children: [
      { label: "Xbox Series", href: cat("plataforma=xbox") },
      { label: "Estrenos Xbox", href: cat("plataforma=xbox&categoria=estrenos") },
      { label: "Pack Xbox", href: cat("plataforma=xbox&categoria=packs") },
      { label: "Game Pass Ultimate", href: "/producto/game-pass-3m" },
    ],
  },
  {
    label: "Nintendo",
    href: cat("plataforma=switch"),
    platform: "switch",
    children: [
      { label: "Nintendo Switch", href: cat("plataforma=switch") },
      { label: "Estrenos Nintendo", href: cat("plataforma=switch&categoria=estrenos") },
      { label: "Esenciales Nintendo", href: cat("coleccion=nintendo") },
      { label: "Nintendo Switch Online", href: "/producto/nso-12m" },
    ],
  },
  {
    label: "Membresías",
    href: cat("categoria=membresias"),
    children: [
      { label: "PlayStation Plus", href: "/producto/ps-plus-12m", hint: "Juego en línea y juegos mensuales" },
      { label: "Xbox Game Pass Ultimate", href: "/producto/game-pass-3m", hint: "Cientos de juegos por suscripción" },
      { label: "Nintendo Switch Online", href: "/producto/nso-12m", hint: "Online y clásicos de NES" },
    ],
  },
  { label: "Packs", href: cat("categoria=packs") },
  { label: "Opiniones", href: "/#opiniones" },
  {
    label: "Colecciones",
    href: cat("coleccion=marvel"),
    children: [
      { label: "Colección Marvel", href: cat("coleccion=marvel") },
      { label: "PlayStation Studios", href: cat("coleccion=playstation-studios") },
      { label: "Terror y supervivencia", href: cat("coleccion=terror") },
      { label: "Rockstar Games", href: cat("coleccion=rockstar") },
      { label: "Esenciales Nintendo", href: cat("coleccion=nintendo") },
    ],
  },
];

/** Columnas del megamenú "Categorías" */
export const MEGA = {
  destacados: [
    { label: "Estrenos", href: cat("categoria=estrenos"), hint: "Lo último en salir" },
    { label: "Preventas", href: cat("categoria=preventa"), hint: "Resérvalo antes que nadie" },
    { label: "Más vendidos", href: cat("orden=vendidos"), hint: "Los favoritos de la semana" },
    { label: "Mayores descuentos", href: cat("orden=descuento"), hint: "Hasta 90% de descuento" },
  ],
  formatos: [
    { label: "Packs", href: cat("categoria=packs"), hint: "2, 3 y 4 juegos en 1" },
    { label: "Membresías", href: cat("categoria=membresias"), hint: "PS Plus, Game Pass y NSO" },
  ],
};
