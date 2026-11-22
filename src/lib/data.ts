export type PlatformId = "ps5" | "ps4" | "ps3" | "xbox" | "switch";
export type GenreId =
  | "accion"
  | "aventura"
  | "shooter"
  | "deportes"
  | "rpg"
  | "terror"
  | "pelea"
  | "carreras"
  | "familiar"
  | "mundo-abierto"
  | "cooperativo";

export type AccountType = "primaria" | "secundaria";

export interface Platform {
  id: PlatformId;
  name: string;
  short: string;
  color: string; // color principal de la plataforma
  soft: string; // versión translúcida
}

export const PLATFORMS: Record<PlatformId, Platform> = {
  ps5: { id: "ps5", name: "PlayStation 5", short: "PS5", color: "#3B82F6", soft: "rgba(59,130,246,0.16)" },
  ps4: { id: "ps4", name: "PlayStation 4", short: "PS4", color: "#22A9E8", soft: "rgba(34,169,232,0.16)" },
  ps3: { id: "ps3", name: "PlayStation 3", short: "PS3", color: "#8E8EA0", soft: "rgba(142,142,160,0.18)" },
  xbox: { id: "xbox", name: "Xbox Series", short: "XBOX", color: "#22C55E", soft: "rgba(34,197,94,0.16)" },
  switch: { id: "switch", name: "Nintendo Switch", short: "SWITCH", color: "#EF4444", soft: "rgba(239,68,68,0.16)" },
};

export type CollectionId = "marvel" | "playstation-studios" | "terror" | "rockstar" | "nintendo";

export const COLLECTIONS: Record<CollectionId, string> = {
  marvel: "Colección Marvel",
  "playstation-studios": "PlayStation Studios",
  terror: "Terror y supervivencia",
  rockstar: "Rockstar Games",
  nintendo: "Esenciales Nintendo",
};

export const GENRES: Record<GenreId, string> = {
  accion: "Acción",
  aventura: "Aventura",
  shooter: "Shooter",
  deportes: "Deportes",
  rpg: "RPG",
  terror: "Terror",
  pelea: "Pelea",
  carreras: "Carreras",
  familiar: "Familiar",
  "mundo-abierto": "Mundo abierto",
  cooperativo: "Cooperativo",
};

export type ProductKind = "juego" | "pack" | "membresia";

export interface Product {
  id: string;
  kind?: ProductKind; // por defecto "juego"
  collections?: CollectionId[];
  includes?: string[]; // para packs
  title: string;
  platform: PlatformId;
  genres: GenreId[];
  listPrice: number; // precio "antes"
  priceSecundaria: number;
  pricePrimaria: number;
  sizeGb: number;
  requiredGb: number;
  voices: string;
  texts: string;
  rating: number;
  reviews: number;
  soldWeek: number;
  stockPrimaria: number;
  stockSecundaria: number;
  release?: "preventa" | "estreno";
  art: [string, string, string]; // colores del arte generativo
  description: string;
}

const p = (x: Product) => x;

export const PRODUCTS: Product[] = [
  // ---------- PS5 ----------
  p({ id: "spider-man-2-ps5", collections: ["marvel", "playstation-studios"], title: "Marvel's Spider-Man 2", platform: "ps5", genres: ["accion", "aventura", "mundo-abierto"], listPrice: 11250, priceSecundaria: 4500, pricePrimaria: 7900, sizeGb: 110, requiredGb: 160, voices: "Español latino", texts: "Español latino", rating: 4.9, reviews: 312, soldWeek: 148, stockPrimaria: 4, stockSecundaria: 18, art: ["#E11D48", "#1E3A8A", "#0B0F1A"], description: "Peter Parker y Miles Morales se enfrentan a Venom en una Nueva York más grande que nunca. Cambia entre ambos Spider-Man en cualquier momento." }),
  p({ id: "ghost-of-yotei-ps5", collections: ["playstation-studios"], title: "Ghost of Yōtei", platform: "ps5", genres: ["accion", "aventura", "mundo-abierto"], listPrice: 43200, priceSecundaria: 21600, pricePrimaria: 32400, sizeGb: 80, requiredGb: 120, voices: "Español latino", texts: "Español latino", rating: 4.8, reviews: 201, soldWeek: 121, stockPrimaria: 3, stockSecundaria: 9, release: "estreno", art: ["#F97316", "#7C2D12", "#0F0A08"], description: "Atsu emprende un viaje de venganza por las tierras de Ezo a la sombra del monte Yōtei." }),
  p({ id: "wolverine-ps5", collections: ["marvel", "playstation-studios"], title: "Marvel's Wolverine", platform: "ps5", genres: ["accion", "aventura"], listPrice: 45000, priceSecundaria: 18000, pricePrimaria: 29900, sizeGb: 95, requiredGb: 140, voices: "Español latino", texts: "Español latino", rating: 0, reviews: 0, soldWeek: 96, stockPrimaria: 10, stockSecundaria: 25, release: "preventa", art: ["#FACC15", "#1D4ED8", "#0A0A12"], description: "Reserva ahora y recíbelo el día del lanzamiento. La nueva aventura de Logan, de los creadores de Spider-Man." }),
  p({ id: "re-requiem-ps5", collections: ["terror"], title: "Resident Evil Requiem", platform: "ps5", genres: ["terror", "accion"], listPrice: 49500, priceSecundaria: 19800, pricePrimaria: 33000, sizeGb: 70, requiredGb: 100, voices: "Español latino", texts: "Español latino", rating: 4.7, reviews: 158, soldWeek: 88, stockPrimaria: 2, stockSecundaria: 7, release: "estreno", art: ["#991B1B", "#18181B", "#050505"], description: "El regreso del survival horror en su forma más pura. Mantén la calma, administra tus recursos y sobrevive." }),
  p({ id: "crimson-desert-ps5", title: "Crimson Desert", platform: "ps5", genres: ["accion", "rpg", "mundo-abierto"], listPrice: 65250, priceSecundaria: 26100, pricePrimaria: 41900, sizeGb: 130, requiredGb: 180, voices: "Inglés", texts: "Español latino", rating: 4.5, reviews: 64, soldWeek: 51, stockPrimaria: 5, stockSecundaria: 11, release: "estreno", art: ["#DC2626", "#78350F", "#120806"], description: "Un mundo abierto de fantasía brutal en el continente de Pywel. Combate, exploración y mercenarios." }),
  p({ id: "fc27-ps5", title: "EA Sports FC 27", platform: "ps5", genres: ["deportes", "cooperativo"], listPrice: 25470, priceSecundaria: 15300, pricePrimaria: 21900, sizeGb: 50, requiredGb: 80, voices: "Español latino", texts: "Español latino", rating: 4.4, reviews: 421, soldWeek: 176, stockPrimaria: 8, stockSecundaria: 30, release: "estreno", art: ["#10B981", "#0E7490", "#041014"], description: "Ultimate Team, Modo Carrera y Clubes con las ligas y estadios oficiales. El fútbol de esta temporada." }),
  p({ id: "battlefield-6-ps5", title: "Battlefield 6", platform: "ps5", genres: ["shooter", "accion", "cooperativo"], listPrice: 11250, priceSecundaria: 4500, pricePrimaria: 8900, sizeGb: 90, requiredGb: 130, voices: "Español latino", texts: "Español latino", rating: 4.6, reviews: 275, soldWeek: 133, stockPrimaria: 6, stockSecundaria: 22, art: ["#F59E0B", "#334155", "#0A0D12"], description: "Guerra total con destrucción a gran escala, escuadrones de 4 y mapas enormes." }),
  p({ id: "expedition-33-ps5", title: "Clair Obscur: Expedition 33", platform: "ps5", genres: ["rpg", "aventura"], listPrice: 32000, priceSecundaria: 12800, pricePrimaria: 21900, sizeGb: 55, requiredGb: 80, voices: "Inglés", texts: "Español latino", rating: 4.9, reviews: 190, soldWeek: 74, stockPrimaria: 4, stockSecundaria: 12, art: ["#E5E7EB", "#9F1239", "#0C0A0F"], description: "Un RPG por turnos con combate reactivo, inspirado en la Belle Époque francesa." }),
  p({ id: "silent-hill-f-ps5", collections: ["terror"], title: "Silent Hill f", platform: "ps5", genres: ["terror", "aventura"], listPrice: 36000, priceSecundaria: 14400, pricePrimaria: 23900, sizeGb: 45, requiredGb: 70, voices: "Japonés", texts: "Español latino", rating: 4.5, reviews: 98, soldWeek: 42, stockPrimaria: 3, stockSecundaria: 8, art: ["#BE185D", "#F43F5E", "#0D0508"], description: "Japón, años 60. Un pueblo cubierto de niebla y una belleza aterradora." }),
  p({ id: "helldivers-2-ps5", collections: ["playstation-studios"], title: "Helldivers 2", platform: "ps5", genres: ["shooter", "cooperativo", "accion"], listPrice: 22500, priceSecundaria: 9000, pricePrimaria: 15900, sizeGb: 40, requiredGb: 70, voices: "Español latino", texts: "Español latino", rating: 4.7, reviews: 233, soldWeek: 102, stockPrimaria: 5, stockSecundaria: 19, art: ["#FDE047", "#1F2937", "#08090B"], description: "Shooter cooperativo para 4 jugadores. Difunde la democracia gestionada por la galaxia." }),
  p({ id: "ac-shadows-ps5", title: "Assassin's Creed Shadows", platform: "ps5", genres: ["aventura", "accion", "mundo-abierto"], listPrice: 39000, priceSecundaria: 15600, pricePrimaria: 25900, sizeGb: 100, requiredGb: 150, voices: "Español latino", texts: "Español latino", rating: 4.4, reviews: 140, soldWeek: 58, stockPrimaria: 4, stockSecundaria: 10, art: ["#B91C1C", "#F5F5F4", "#0B0B0C"], description: "Japón feudal con dos protagonistas: Naoe, la shinobi, y Yasuke, el samurái." }),
  p({ id: "mgs-delta-ps5", title: "Metal Gear Solid Delta", platform: "ps5", genres: ["accion", "aventura"], listPrice: 41000, priceSecundaria: 16400, pricePrimaria: 26900, sizeGb: 75, requiredGb: 110, voices: "Inglés", texts: "Español latino", rating: 4.6, reviews: 87, soldWeek: 39, stockPrimaria: 2, stockSecundaria: 6, art: ["#65A30D", "#365314", "#070A04"], description: "El clásico Snake Eater reconstruido desde cero con gráficos de nueva generación." }),
  p({ id: "mk1-ps5", title: "Mortal Kombat 1", platform: "ps5", genres: ["pelea", "accion"], listPrice: 9000, priceSecundaria: 900, pricePrimaria: 4900, sizeGb: 100, requiredGb: 140, voices: "Español latino", texts: "Español latino", rating: 4.5, reviews: 350, soldWeek: 160, stockPrimaria: 7, stockSecundaria: 40, art: ["#F59E0B", "#7F1D1D", "#0A0505"], description: "Un universo renacido. Combates brutales, Kameos y el modo historia más ambicioso de la saga." }),
  p({ id: "gt7-ps5", collections: ["playstation-studios"], title: "Gran Turismo 7", platform: "ps5", genres: ["carreras", "deportes"], listPrice: 27000, priceSecundaria: 10800, pricePrimaria: 18900, sizeGb: 110, requiredGb: 150, voices: "Español latino", texts: "Español latino", rating: 4.7, reviews: 176, soldWeek: 67, stockPrimaria: 3, stockSecundaria: 13, art: ["#38BDF8", "#0F172A", "#03060C"], description: "El simulador de conducción definitivo. Más de 400 autos y circuitos legendarios." }),
  p({ id: "gta-6-ps5", collections: ["rockstar"], title: "Grand Theft Auto VI", platform: "ps5", genres: ["accion", "mundo-abierto", "aventura"], listPrice: 79900, priceSecundaria: 34900, pricePrimaria: 54900, sizeGb: 150, requiredGb: 200, voices: "Inglés", texts: "Español latino", rating: 0, reviews: 0, soldWeek: 240, stockPrimaria: 20, stockSecundaria: 60, release: "preventa", art: ["#EC4899", "#F97316", "#1E1B4B"], description: "Bienvenidos a Leonida. Reserva la nueva entrega de Rockstar y juégala el día uno." }),
  p({ id: "arc-raiders-ps5", title: "Arc Raiders", platform: "ps5", genres: ["shooter", "cooperativo"], listPrice: 30000, priceSecundaria: 12000, pricePrimaria: 19900, sizeGb: 45, requiredGb: 70, voices: "Español latino", texts: "Español latino", rating: 4.5, reviews: 120, soldWeek: 81, stockPrimaria: 5, stockSecundaria: 15, art: ["#22D3EE", "#F43F5E", "#060B10"], description: "Extracción multijugador en una Tierra devastada por máquinas. Sube, saquea y escapa." }),

  // ---------- PS4 ----------
  p({ id: "god-of-war-ps4", collections: ["playstation-studios"], title: "God of War", platform: "ps4", genres: ["accion", "aventura"], listPrice: 15000, priceSecundaria: 3900, pricePrimaria: 7900, sizeGb: 45, requiredGb: 70, voices: "Español latino", texts: "Español latino", rating: 4.9, reviews: 512, soldWeek: 95, stockPrimaria: 6, stockSecundaria: 25, art: ["#B91C1C", "#94A3B8", "#0A0B0D"], description: "Kratos y su hijo Atreus emprenden un viaje por los reinos nórdicos." }),
  p({ id: "rdr2-ps4", collections: ["rockstar"], title: "Red Dead Redemption 2", platform: "ps4", genres: ["aventura", "mundo-abierto", "accion"], listPrice: 18000, priceSecundaria: 4900, pricePrimaria: 9900, sizeGb: 105, requiredGb: 150, voices: "Inglés", texts: "Español latino", rating: 4.9, reviews: 640, soldWeek: 110, stockPrimaria: 5, stockSecundaria: 30, art: ["#DC2626", "#78716C", "#0C0A09"], description: "La épica del salvaje oeste de Arthur Morgan y la banda de Van der Linde." }),
  p({ id: "crash-4-ps4", title: "Crash Bandicoot 4", platform: "ps4", genres: ["familiar", "aventura"], listPrice: 12000, priceSecundaria: 2900, pricePrimaria: 5900, sizeGb: 30, requiredGb: 50, voices: "Español latino", texts: "Español latino", rating: 4.6, reviews: 220, soldWeek: 64, stockPrimaria: 7, stockSecundaria: 20, art: ["#F97316", "#2563EB", "#080A14"], description: "Ya era hora. Crash y Coco vuelven a saltar entre dimensiones en un plataformas desafiante." }),
  p({ id: "it-takes-two-ps4", title: "It Takes Two", platform: "ps4", genres: ["familiar", "cooperativo", "aventura"], listPrice: 16000, priceSecundaria: 4500, pricePrimaria: 8900, sizeGb: 50, requiredGb: 75, voices: "Español latino", texts: "Español latino", rating: 4.9, reviews: 305, soldWeek: 58, stockPrimaria: 4, stockSecundaria: 14, art: ["#A855F7", "#22D3EE", "#0B0816"], description: "Una aventura cooperativa obligatoria para dos jugadores. Ideal para jugar en pareja." }),
  p({ id: "cod-cold-war-ps4", title: "Call of Duty: Black Ops Cold War", platform: "ps4", genres: ["shooter", "accion"], listPrice: 14000, priceSecundaria: 3500, pricePrimaria: 7500, sizeGb: 120, requiredGb: 170, voices: "Español latino", texts: "Español latino", rating: 4.3, reviews: 280, soldWeek: 70, stockPrimaria: 5, stockSecundaria: 22, art: ["#EF4444", "#1E293B", "#050608"], description: "Campaña de espionaje en plena Guerra Fría, multijugador y Zombies." }),
  p({ id: "tlou2-ps4", collections: ["playstation-studios", "terror"], title: "The Last of Us Part II", platform: "ps4", genres: ["accion", "aventura", "terror"], listPrice: 14000, priceSecundaria: 3900, pricePrimaria: 7900, sizeGb: 80, requiredGb: 110, voices: "Español latino", texts: "Español latino", rating: 4.8, reviews: 410, soldWeek: 61, stockPrimaria: 4, stockSecundaria: 16, art: ["#15803D", "#A3A3A3", "#060807"], description: "Cinco años después, Ellie emprende un viaje implacable en busca de justicia." }),

  // ---------- XBOX ----------
  p({ id: "forza-5-xbox", title: "Forza Horizon 5", platform: "xbox", genres: ["carreras", "mundo-abierto"], listPrice: 20000, priceSecundaria: 5900, pricePrimaria: 11900, sizeGb: 110, requiredGb: 140, voices: "Español latino", texts: "Español latino", rating: 4.8, reviews: 190, soldWeek: 55, stockPrimaria: 4, stockSecundaria: 15, art: ["#EC4899", "#F59E0B", "#0F0A12"], description: "Un festival de autos en un México vibrante y en constante cambio." }),
  p({ id: "halo-ce-xbox", title: "Halo: Campaign Evolved", platform: "xbox", genres: ["shooter", "accion", "cooperativo"], listPrice: 20970, priceSecundaria: 12600, pricePrimaria: 16900, sizeGb: 60, requiredGb: 90, voices: "Español latino", texts: "Español latino", rating: 4.6, reviews: 72, soldWeek: 48, stockPrimaria: 3, stockSecundaria: 9, release: "estreno", art: ["#22C55E", "#0EA5E9", "#04100A"], description: "La campaña original del Jefe Maestro, reconstruida para una nueva generación." }),
  p({ id: "fc27-xbox", title: "EA Sports FC 27", platform: "xbox", genres: ["deportes", "cooperativo"], listPrice: 25470, priceSecundaria: 15300, pricePrimaria: 21900, sizeGb: 50, requiredGb: 80, voices: "Español latino", texts: "Español latino", rating: 4.3, reviews: 140, soldWeek: 63, stockPrimaria: 5, stockSecundaria: 14, release: "estreno", art: ["#10B981", "#065F46", "#03100B"], description: "Ultimate Team, Modo Carrera y Clubes con las licencias oficiales." }),
  p({ id: "starfield-xbox", title: "Starfield", platform: "xbox", genres: ["rpg", "mundo-abierto", "aventura"], listPrice: 30000, priceSecundaria: 9900, pricePrimaria: 17900, sizeGb: 125, requiredGb: 160, voices: "Inglés", texts: "Español latino", rating: 4.2, reviews: 98, soldWeek: 27, stockPrimaria: 3, stockSecundaria: 8, art: ["#E2E8F0", "#3B82F6", "#060912"], description: "El primer universo nuevo de Bethesda en 25 años. Explora más de mil planetas." }),

  // ---------- SWITCH ----------
  p({ id: "zelda-totk-switch", collections: ["nintendo"], title: "Zelda: Tears of the Kingdom", platform: "switch", genres: ["aventura", "mundo-abierto", "rpg"], listPrice: 45000, priceSecundaria: 17900, pricePrimaria: 28900, sizeGb: 18, requiredGb: 20, voices: "Español latino", texts: "Español latino", rating: 4.9, reviews: 260, soldWeek: 69, stockPrimaria: 4, stockSecundaria: 12, art: ["#14B8A6", "#FDE68A", "#04100E"], description: "Link explora los cielos y las profundidades de Hyrule con nuevas habilidades." }),
  p({ id: "mario-kart-8-switch", collections: ["nintendo"], title: "Mario Kart 8 Deluxe", platform: "switch", genres: ["carreras", "familiar", "cooperativo"], listPrice: 42000, priceSecundaria: 15900, pricePrimaria: 25900, sizeGb: 7, requiredGb: 10, voices: "Español latino", texts: "Español latino", rating: 4.9, reviews: 380, soldWeek: 92, stockPrimaria: 5, stockSecundaria: 18, art: ["#EF4444", "#FACC15", "#120707"], description: "El juego de carreras más divertido para jugar en familia, ahora con todas las pistas." }),
  p({ id: "pokemon-za-switch", collections: ["nintendo"], title: "Leyendas Pokémon: Z-A", platform: "switch", genres: ["rpg", "familiar", "aventura"], listPrice: 48000, priceSecundaria: 19900, pricePrimaria: 31900, sizeGb: 12, requiredGb: 15, voices: "Español latino", texts: "Español latino", rating: 4.5, reviews: 150, soldWeek: 77, stockPrimaria: 3, stockSecundaria: 10, release: "estreno", art: ["#F472B6", "#22C55E", "#0B0A10"], description: "Ciudad Luminalia se renueva. Captura, combate y descubre la megaevolución." }),
  p({ id: "metroid-prime-4-switch", collections: ["nintendo"], title: "Metroid Prime 4: Beyond", platform: "switch", genres: ["accion", "aventura", "shooter"], listPrice: 46000, priceSecundaria: 18400, pricePrimaria: 29900, sizeGb: 14, requiredGb: 18, voices: "Español latino", texts: "Español latino", rating: 4.7, reviews: 66, soldWeek: 38, stockPrimaria: 2, stockSecundaria: 7, release: "estreno", art: ["#F97316", "#A855F7", "#0A0612"], description: "Samus Aran regresa con nuevos poderes psíquicos en un planeta desconocido." }),
  // ---------- PS3 ----------
  p({ id: "tlou-ps3", title: "The Last of Us", platform: "ps3", collections: ["playstation-studios", "terror"], genres: ["accion", "aventura", "terror"], listPrice: 9000, priceSecundaria: 2500, pricePrimaria: 4500, sizeGb: 27, requiredGb: 35, voices: "Español latino", texts: "Español latino", rating: 4.9, reviews: 188, soldWeek: 34, stockPrimaria: 6, stockSecundaria: 20, art: ["#65A30D", "#78716C", "#070806"], description: "Joel y Ellie cruzan unos Estados Unidos devastados. El clásico que definió una generación." }),
  p({ id: "uncharted-3-ps3", title: "Uncharted 3: La traición de Drake", platform: "ps3", collections: ["playstation-studios"], genres: ["aventura", "accion"], listPrice: 7000, priceSecundaria: 1900, pricePrimaria: 3500, sizeGb: 45, requiredGb: 50, voices: "Español latino", texts: "Español latino", rating: 4.8, reviews: 140, soldWeek: 22, stockPrimaria: 5, stockSecundaria: 18, art: ["#F59E0B", "#0EA5E9", "#0A0805"], description: "Nathan Drake busca la Atlántida de las arenas en el desierto de Rub al-Jali." }),
  p({ id: "gta5-ps3", title: "Grand Theft Auto V", platform: "ps3", collections: ["rockstar"], genres: ["accion", "mundo-abierto"], listPrice: 9900, priceSecundaria: 2900, pricePrimaria: 4900, sizeGb: 18, requiredGb: 25, voices: "Inglés", texts: "Español latino", rating: 4.8, reviews: 260, soldWeek: 41, stockPrimaria: 7, stockSecundaria: 24, art: ["#22C55E", "#F97316", "#060A06"], description: "Michael, Franklin y Trevor en Los Santos. Tres protagonistas, un golpe perfecto." }),
  p({ id: "pack-4en1-ps3", kind: "pack", title: "Pack 4 en 1 Clásicos PS3", platform: "ps3", includes: ["God of War III", "Uncharted 2", "inFAMOUS", "LittleBigPlanet 2"], genres: ["accion", "aventura", "familiar"], listPrice: 14000, priceSecundaria: 4900, pricePrimaria: 8900, sizeGb: 85, requiredGb: 95, voices: "Español latino", texts: "Español latino", rating: 4.7, reviews: 64, soldWeek: 18, stockPrimaria: 4, stockSecundaria: 12, art: ["#94A3B8", "#3B82F6", "#06070A"], description: "Cuatro clásicos de PlayStation 3 en una sola compra." }),

  // ---------- PACKS ----------
  p({ id: "pack-3en1-ps4", kind: "pack", title: "Pack 3 en 1: Aventuras PS4", platform: "ps4", collections: ["playstation-studios"], includes: ["God of War", "The Last of Us Part II", "Crash Bandicoot 4"], genres: ["accion", "aventura", "familiar"], listPrice: 34000, priceSecundaria: 9900, pricePrimaria: 17900, sizeGb: 155, requiredGb: 230, voices: "Español latino", texts: "Español latino", rating: 4.8, reviews: 97, soldWeek: 44, stockPrimaria: 4, stockSecundaria: 14, art: ["#B91C1C", "#22A9E8", "#07080C"], description: "Tres aventuras imprescindibles de PS4 al precio de una." }),
  p({ id: "pack-accion-ps5", kind: "pack", title: "Pack PS5: Spider-Man 2 + Ghost of Yōtei", platform: "ps5", collections: ["playstation-studios"], includes: ["Marvel's Spider-Man 2", "Ghost of Yōtei"], genres: ["accion", "aventura", "mundo-abierto"], listPrice: 54450, priceSecundaria: 23900, pricePrimaria: 36900, sizeGb: 190, requiredGb: 280, voices: "Español latino", texts: "Español latino", rating: 4.9, reviews: 58, soldWeek: 52, stockPrimaria: 3, stockSecundaria: 9, art: ["#E11D48", "#F97316", "#0B0708"], description: "Los dos mundos abiertos más grandes de PlayStation 5 en un solo pack." }),
  p({ id: "pack-velocidad-xbox", kind: "pack", title: "Pack Xbox: Forza Horizon 5 + FC 27", platform: "xbox", includes: ["Forza Horizon 5", "EA Sports FC 27"], genres: ["carreras", "deportes"], listPrice: 45470, priceSecundaria: 18900, pricePrimaria: 29900, sizeGb: 160, requiredGb: 220, voices: "Español latino", texts: "Español latino", rating: 4.6, reviews: 31, soldWeek: 21, stockPrimaria: 3, stockSecundaria: 8, art: ["#EC4899", "#10B981", "#0A0A0C"], description: "Autos y fútbol para jugar todo el año." }),

  // ---------- MEMBRESÍAS ----------
  p({ id: "ps-plus-12m", kind: "membresia", title: "PlayStation Plus Essential 12 meses", platform: "ps5", genres: [], listPrice: 45000, priceSecundaria: 32900, pricePrimaria: 32900, sizeGb: 0, requiredGb: 0, voices: "—", texts: "—", rating: 4.8, reviews: 210, soldWeek: 88, stockPrimaria: 30, stockSecundaria: 30, art: ["#3B82F6", "#FBBF24", "#05070D"], description: "Juego en línea, juegos mensuales y almacenamiento en la nube. Se activa en tu propia cuenta." }),
  p({ id: "game-pass-3m", kind: "membresia", title: "Xbox Game Pass Ultimate 3 meses", platform: "xbox", genres: [], listPrice: 39000, priceSecundaria: 27900, pricePrimaria: 27900, sizeGb: 0, requiredGb: 0, voices: "—", texts: "—", rating: 4.7, reviews: 120, soldWeek: 46, stockPrimaria: 30, stockSecundaria: 30, art: ["#22C55E", "#A3E635", "#040A05"], description: "Cientos de juegos de consola y PC, juego en línea y EA Play incluido." }),
  p({ id: "nso-12m", kind: "membresia", title: "Nintendo Switch Online 12 meses", platform: "switch", collections: ["nintendo"], genres: [], listPrice: 22000, priceSecundaria: 15900, pricePrimaria: 15900, sizeGb: 0, requiredGb: 0, voices: "—", texts: "—", rating: 4.6, reviews: 90, soldWeek: 33, stockPrimaria: 30, stockSecundaria: 30, art: ["#EF4444", "#F8FAFC", "#0C0505"], description: "Juego en línea, respaldo en la nube y clásicos de NES y Super NES." }),
];

export const isMembership = (p: Product) => p.kind === "membresia";

export const productById = (id: string) => PRODUCTS.find((x) => x.id === id);

// ---------------- Usuarios demo ----------------
export type Role = "admin" | "cliente";

export interface UserProfile {
  email: string;
  name: string;
  role: Role;
  platform: PlatformId | null;
  genres: GenreId[];
  purchases: string[]; // ids de productos ya comprados
  avatar: string; // color
}

export const DEMO_USERS: UserProfile[] = [
  { email: "administrador@correo.cl", name: "Administrador", role: "admin", platform: null, genres: [], purchases: [], avatar: "#8467FF" },
  { email: "matias@correo.cl", name: "Matías", role: "cliente", platform: "ps5", genres: ["shooter", "accion"], purchases: ["battlefield-6-ps5", "mk1-ps5"], avatar: "#3B82F6" },
  { email: "camila@correo.cl", name: "Camila", role: "cliente", platform: "ps4", genres: ["familiar", "aventura"], purchases: ["crash-4-ps4"], avatar: "#818CF8" },
  { email: "javiera@correo.cl", name: "Javiera", role: "cliente", platform: "xbox", genres: ["carreras", "deportes"], purchases: ["forza-5-xbox"], avatar: "#22C55E" },
  { email: "diego@correo.cl", name: "Diego", role: "cliente", platform: "switch", genres: ["rpg", "aventura"], purchases: ["zelda-totk-switch"], avatar: "#EF4444" },
];

// Canastas históricas (simuladas) usadas por el filtrado colaborativo
export const MOCK_BASKETS: string[][] = [
  ["battlefield-6-ps5", "helldivers-2-ps5", "arc-raiders-ps5"],
  ["battlefield-6-ps5", "arc-raiders-ps5"],
  ["battlefield-6-ps5", "mk1-ps5", "helldivers-2-ps5"],
  ["mk1-ps5", "re-requiem-ps5"],
  ["spider-man-2-ps5", "wolverine-ps5", "ghost-of-yotei-ps5"],
  ["spider-man-2-ps5", "wolverine-ps5"],
  ["spider-man-2-ps5", "ac-shadows-ps5", "ghost-of-yotei-ps5"],
  ["ghost-of-yotei-ps5", "ac-shadows-ps5", "mgs-delta-ps5"],
  ["re-requiem-ps5", "silent-hill-f-ps5"],
  ["re-requiem-ps5", "silent-hill-f-ps5", "mgs-delta-ps5"],
  ["expedition-33-ps5", "crimson-desert-ps5"],
  ["expedition-33-ps5", "crimson-desert-ps5", "ghost-of-yotei-ps5"],
  ["fc27-ps5", "gt7-ps5"],
  ["fc27-ps5", "mk1-ps5", "battlefield-6-ps5"],
  ["gta-6-ps5", "spider-man-2-ps5", "wolverine-ps5"],
  ["gta-6-ps5", "battlefield-6-ps5"],
  ["helldivers-2-ps5", "arc-raiders-ps5", "mk1-ps5"],
  ["crash-4-ps4", "it-takes-two-ps4"],
  ["crash-4-ps4", "it-takes-two-ps4", "god-of-war-ps4"],
  ["god-of-war-ps4", "tlou2-ps4", "rdr2-ps4"],
  ["god-of-war-ps4", "tlou2-ps4"],
  ["rdr2-ps4", "cod-cold-war-ps4"],
  ["it-takes-two-ps4", "rdr2-ps4"],
  ["forza-5-xbox", "fc27-xbox"],
  ["forza-5-xbox", "halo-ce-xbox", "fc27-xbox"],
  ["halo-ce-xbox", "starfield-xbox"],
  ["zelda-totk-switch", "pokemon-za-switch", "metroid-prime-4-switch"],
  ["zelda-totk-switch", "metroid-prime-4-switch"],
  ["mario-kart-8-switch", "pokemon-za-switch"],
  ["mario-kart-8-switch", "zelda-totk-switch"],
];

export const clp = (n: number) =>
  "$" + Math.round(n).toLocaleString("es-CL");

export const discountPct = (pr: Product, type: AccountType = "secundaria") =>
  Math.round((1 - (type === "secundaria" ? pr.priceSecundaria : pr.pricePrimaria) / pr.listPrice) * 100);

export const priceOf = (pr: Product, type: AccountType) =>
  type === "secundaria" ? pr.priceSecundaria : pr.pricePrimaria;
