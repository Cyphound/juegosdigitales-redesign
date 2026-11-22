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

## Stack

Next.js 15 (App Router), React 19, Tailwind CSS 4, Framer Motion e iconos Lucide.

## Publicar en Vercel

1. Sube la carpeta a un repositorio de GitHub.
2. Impórtalo en vercel.com (detecta Next.js solo).
3. En Settings → Deployment Protection, activa Vercel Authentication para dejarlo privado.
