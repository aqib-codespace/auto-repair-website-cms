/**
 * Renders the favicon and Apple touch icon from the same hex-nut geometry as
 * <BrandMark>, so the browser tab matches the header logo exactly.
 *
 * Run with: npm run icon
 * Re-run after changing the brand colour below (or replace src/app/icon.png
 * with the shop's own artwork — Next.js picks it up automatically).
 */
import { fileURLToPath } from "node:url";
import path from "node:path";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const BRAND = "#1a4fd1";
const ACCENT = "#f59e0b";

/** `padded` insets the mark for iOS, which crops to a rounded square. */
function markSvg({ size, padded = false }) {
  const inset = padded ? 6 : 0;
  const scale = (48 - inset * 2) / 48;

  return Buffer.from(`
    <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 48 48">
      <defs>
        <linearGradient id="sheen" x1="0.1" y1="0" x2="0.9" y2="1">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="0.34" />
          <stop offset="45%" stop-color="#ffffff" stop-opacity="0.06" />
          <stop offset="100%" stop-color="#000000" stop-opacity="0.34" />
        </linearGradient>
      </defs>
      ${padded ? `<rect width="48" height="48" rx="10" fill="#0b1220" />` : ""}
      <g transform="translate(${inset} ${inset}) scale(${scale.toFixed(4)})">
        <path d="M24 1.9 43.1 12.95v22.1L24 46.1 4.9 35.05v-22.1z" fill="${BRAND}" />
        <path d="M24 1.9 43.1 12.95v22.1L24 46.1 4.9 35.05v-22.1z" fill="url(#sheen)" />
        <path d="M24 7.4 38.3 15.7v16.6L24 40.6 9.7 32.3V15.7z" fill="none"
              stroke="#ffffff" stroke-opacity="0.16" stroke-width="1" />
        <path d="M14.6 28.2 24 17.6l9.4 10.6" fill="none" stroke="#ffffff"
              stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M16.4 34.4h15.2" fill="none" stroke="${ACCENT}"
              stroke-width="3.2" stroke-linecap="round" />
      </g>
    </svg>
  `);
}

await sharp(markSvg({ size: 512 }))
  .png()
  .toFile(path.join(root, "src", "app", "icon.png"));

await sharp(markSvg({ size: 512, padded: true }))
  .png()
  .toFile(path.join(root, "src", "app", "apple-icon.png"));

console.log("Wrote src/app/icon.png and src/app/apple-icon.png.");
