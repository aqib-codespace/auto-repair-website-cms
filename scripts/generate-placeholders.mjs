/**
 * Generates the template's placeholder photography.
 *
 * A master template can't ship stock photos it doesn't have a licence for, so
 * every image slot is filled with a generated, brand-tinted abstract plate at
 * the correct aspect ratio. That keeps `npm run dev` looking finished on a
 * fresh clone, and every plate is a drop-in replacement target: swap the file
 * in public/images (or upload a real photo from the admin Media Library) and
 * nothing else changes.
 *
 * Run with: npm run placeholders
 */
import { mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const imagesDir = path.join(root, "public", "images");

const INK = "#0b1220";
const INK_MID = "#16233b";
const BRAND = "#1a4fd1";
const ACCENT = "#f59e0b";

/** Deterministic pseudo-random so re-running produces identical files. */
function rng(seed) {
  let value = seed * 9301 + 49297;
  return () => {
    value = (value * 9301 + 49297) % 233280;
    return value / 233280;
  };
}

/**
 * An abstract "service bay" plate: dark gradient ground, brand light spill,
 * concentric wheel arcs, and diagonal light rays.
 */
function scenePlate({ width, height, seed, accentHint = 0.5 }) {
  const random = rng(seed);
  const cx = width * (0.55 + random() * 0.3);
  const cy = height * (0.45 + random() * 0.25);
  const r = Math.min(width, height) * (0.28 + random() * 0.16);
  const tilt = -18 + random() * 36;

  const arcs = Array.from({ length: 4 }, (_, index) => {
    const radius = r * (1 - index * 0.19);
    const opacity = (0.16 - index * 0.03).toFixed(3);
    return `<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${radius.toFixed(1)}"
      fill="none" stroke="#ffffff" stroke-opacity="${opacity}" stroke-width="${(r * 0.045).toFixed(1)}" />`;
  }).join("");

  const rays = Array.from({ length: 7 }, (_, index) => {
    const x = -height + index * (width / 4.2);
    return `<rect x="${x.toFixed(1)}" y="${-height}" width="${(width * 0.035).toFixed(1)}"
      height="${height * 3}" fill="#ffffff" fill-opacity="${(0.02 + random() * 0.025).toFixed(3)}" />`;
  }).join("");

  return Buffer.from(`
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      <defs>
        <linearGradient id="ground" x1="0" y1="0" x2="0.6" y2="1">
          <stop offset="0%" stop-color="${INK_MID}" />
          <stop offset="100%" stop-color="${INK}" />
        </linearGradient>
        <radialGradient id="spill" cx="${(cx / width).toFixed(3)}" cy="${(cy / height).toFixed(3)}" r="0.75">
          <stop offset="0%" stop-color="${BRAND}" stop-opacity="0.55" />
          <stop offset="55%" stop-color="${BRAND}" stop-opacity="0.14" />
          <stop offset="100%" stop-color="${BRAND}" stop-opacity="0" />
        </radialGradient>
        <radialGradient id="warm" cx="0.08" cy="0.92" r="0.6">
          <stop offset="0%" stop-color="${ACCENT}" stop-opacity="${(0.28 * accentHint).toFixed(3)}" />
          <stop offset="100%" stop-color="${ACCENT}" stop-opacity="0" />
        </radialGradient>
        <linearGradient id="vignette" x1="0" y1="0" x2="1" y2="0.35">
          <stop offset="0%" stop-color="${INK}" stop-opacity="0.72" />
          <stop offset="65%" stop-color="${INK}" stop-opacity="0.12" />
          <stop offset="100%" stop-color="${INK}" stop-opacity="0.45" />
        </linearGradient>
      </defs>

      <rect width="${width}" height="${height}" fill="url(#ground)" />
      <g transform="rotate(${tilt.toFixed(2)} ${(width / 2).toFixed(1)} ${(height / 2).toFixed(1)})">${rays}</g>
      <rect width="${width}" height="${height}" fill="url(#spill)" />
      <rect width="${width}" height="${height}" fill="url(#warm)" />
      ${arcs}
      <circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${(r * 0.1).toFixed(1)}" fill="#ffffff" fill-opacity="0.1" />
      <rect width="${width}" height="${height}" fill="url(#vignette)" />
    </svg>
  `);
}

/** Neutral avatar plate: soft brand-tinted ground with a silhouette. */
function avatarPlate({ size, seed }) {
  const random = rng(seed);
  const hue = 200 + Math.round(random() * 90);

  return Buffer.from(`
    <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 100 100">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="hsl(${hue} 42% 88%)" />
          <stop offset="100%" stop-color="hsl(${hue} 38% 72%)" />
        </linearGradient>
      </defs>
      <rect width="100" height="100" fill="url(#bg)" />
      <circle cx="50" cy="40" r="16" fill="#ffffff" fill-opacity="0.82" />
      <path d="M18 100c0-19 14.3-31 32-31s32 12 32 31Z" fill="#ffffff" fill-opacity="0.82" />
    </svg>
  `);
}

const SCENES = [
  { file: "hero-technicians.jpg", width: 2000, height: 1125, accentHint: 0.9 },
  { file: "about-shop.jpg", width: 1400, height: 1050 },
  { file: "financing.jpg", width: 1400, height: 1050, accentHint: 1 },
  { file: "gallery-exterior.jpg", width: 1000, height: 1250 },
  { file: "gallery-waiting-room.jpg", width: 1200, height: 900, accentHint: 0.8 },
  { file: "gallery-technicians.jpg", width: 1100, height: 1100 },
  { file: "gallery-equipment.jpg", width: 960, height: 1280 },
  { file: "gallery-repair.jpg", width: 1200, height: 900 },
  { file: "gallery-bay.jpg", width: 1200, height: 960 },
];

await mkdir(imagesDir, { recursive: true });

/**
 * Never overwrite an existing file: `npm run photos` writes real photography
 * to these same filenames, and this script must be safe to re-run afterwards
 * to fill only the gaps.
 */
async function writeIfMissing(file, buffer, options) {
  const target = path.join(imagesDir, file);
  if (existsSync(target)) {
    console.log(`- ${file} (exists, skipped)`);
    return false;
  }
  await sharp(buffer).jpeg(options).toFile(target);
  console.log(`+ ${file}`);
  return true;
}

let written = 0;

for (const [index, scene] of SCENES.entries()) {
  const created = await writeIfMissing(
    scene.file,
    scenePlate({ ...scene, seed: index + 3 }),
    { quality: 82, mozjpeg: true },
  );
  if (created) written += 1;
}

for (let index = 1; index <= 5; index += 1) {
  const created = await writeIfMissing(
    `avatar-${index}.jpg`,
    avatarPlate({ size: 400, seed: index * 17 }),
    { quality: 86 },
  );
  if (created) written += 1;
}

console.log(`
Generated ${written} placeholder plate(s) in public/images.`);
