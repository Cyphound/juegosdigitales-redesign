# Juegos Digitales Chile · Rediseño (mockup interactivo)

Mockup funcional del rediseño de juegosdigitaleschile.com para la Evaluación 3 de E-commerce (INACAP).
Todo es simulado: catálogo, precios, recomendaciones, predicción de demanda y pagos.

## Cómo correrlo

```bash
npm install
npm run dev
# abre http://localhost:3000/login
```

## Usuarios de demostración (cualquier contraseña funciona)

| Correo | Qué muestra |
| --- | --- |
| administrador@correo.cl | Panel con KPIs, predicción de demanda (ML), inventario y métricas del recomendador |
| matias@correo.cl | Inicio personalizado para PS5 · shooter y acción |
| camila@correo.cl | Inicio personalizado para PS4 · familiar y aventura |
| javiera@correo.cl | Inicio personalizado para Xbox · carreras y deportes |
| diego@correo.cl | Inicio personalizado para Switch · RPG y aventura |
| cualquier otro correo | Perfil nuevo: se abre el onboarding para elegir consola y géneros |

Cupón de prueba en el checkout: `BLACK10` (10% de descuento).

## Qué hay en cada pantalla

- **/login**: inicio de sesión con cuentas demo.
- **/**: inicio personalizado (saludo, juego destacado, recomendaciones híbridas con su motivo, oferta flash con cuenta regresiva, explicación de primaria/secundaria y tendencias predichas).
- **/catalogo**: filtros por plataforma, género, precio y preventas, y orden "Para ti".
- **/producto/[id]**: selector de primaria/secundaria, verificador de espacio en la consola y bloques de "quienes compraron esto también compraron" y "similares".
- **/checkout**: datos, método de pago (Webpay, Mercado Pago, MACH o transferencia con validación automática), pasarela simulada (aprobar o rechazar) y confirmación con entrega automática.
- **/cuenta**: biblioteca con credenciales y videotutorial, e historial de órdenes.
- **/admin**: predicción de demanda (Holt + eventos), sugerencias de inventario, rendimiento del recomendador y órdenes en vivo.

## Dónde está la lógica

- `src/lib/recommend.ts`: recomendador híbrido (colaborativo 45%, contenido 35%, popularidad 20%).
- `src/lib/forecast.ts`: predicción de demanda con suavizamiento de Holt y factores de eventos.
- `src/lib/data.ts`: catálogo, plataformas, usuarios demo y canastas históricas.

## Diseño

- **Paleta análoga** azul → violeta → magenta. El violeta (`--color-brand`) se usa en las acciones principales y el magenta (`--color-brand-2`) solo en degradados y acentos.
- **Colores por plataforma** como código semántico: PS5 azul, PS4 celeste, PS3 grafito, Xbox verde y Nintendo rojo.
- **Tema claro y oscuro** con el botón sol/luna. La preferencia se guarda y, la primera vez, sigue la configuración del sistema. Los tokens están en `src/app/globals.css`.
- **Navbar minimalista** a todo el ancho. El fondo y el desenfoque aumentan a medida que bajas. Tiene el mismo menú del sitio original (Categorías, PS5, PS4, PS3, Xbox, Nintendo, Membresías, Packs, Opiniones y Colecciones), con desplegables y un megamenú.
- **Liquid glass** solo en tarjetas y paneles flotantes. El checkout y los menús usan superficies sólidas para transmitir claridad y confianza.

## Imágenes reales (opcional)

- **Carátulas:** guárdalas en `public/covers/` con el nombre del producto, por ejemplo `spider-man-2-ps5.jpg`. La lista completa de nombres está en `public/covers/LEEME.txt`.
- **Consolas:** guárdalas en `public/consoles/` como `ps5.png`, `ps4.png`, `ps3.png`, `xbox.png` y `switch.png`, ojalá con fondo transparente.
- Se aceptan .jpg, .webp, .png y .jpeg. Después de agregar imágenes, reinicia `npm run dev` (o corre `npm run images`) para que las detecte. Si falta alguna, se usa automáticamente la portada generativa.

## Stack

Next.js 15 (App Router), React 19, Tailwind CSS 4, Framer Motion e iconos Lucide.

## Publicar en Vercel

1. Sube la carpeta a un repositorio de GitHub.
2. Impórtalo en vercel.com (detecta Next.js solo).
3. En Settings → Deployment Protection, activa Vercel Authentication para dejarlo privado.
