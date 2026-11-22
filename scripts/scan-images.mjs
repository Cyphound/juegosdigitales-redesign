// Revisa public/covers y public/consoles y genera la lista de imágenes disponibles.
// Se ejecuta solo antes de `npm run dev` y `npm run build`.
import { readdirSync, writeFileSync, existsSync } from "node:fs";

const EXT = /\.(jpe?g|png|webp)$/i;
const list = (dir) => (existsSync(dir) ? readdirSync(dir).filter((f) => EXT.test(f)) : []);
const out = {};
for (const folder of ["covers", "consoles"]) {
  for (const file of list(`public/${folder}`)) {
    out[`/${folder}/${file.replace(EXT, "")}`] = `/${folder}/${file}`;
  }
}
writeFileSync("src/lib/images.json", JSON.stringify(out, null, 2) + "\n");
console.log(`Imágenes reales encontradas: ${Object.keys(out).length}`);
