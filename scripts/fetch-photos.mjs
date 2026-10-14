/**
 * Downloads the template's placeholder photography from Unsplash and Pexels,
 * crops each shot to the exact aspect ratio its slot expects, and writes it
 * into public/images.
 *
 * Both sources licence these photos for commercial use with no attribution
 * required; public/images/CREDITS.md is written anyway so whoever ships a
 * client site can see exactly what needs replacing and where it came from.
 *
 * Run with: npm run photos
 * If the network is unavailable, `npm run placeholders` regenerates abstract
 * brand-tinted plates at the same filenames instead.
 */
import { mkdir, writeFile, rm } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const imagesDir = path.join(root, "public", "images");

/** Ask each CDN for a generous source width; sharp does the final crop. */
const pexels = (id) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=2400`;
const unsplash = (id) => `https://images.unsplash.com/photo-${id}?fm=jpg&q=85&w=2400&fit=max`;

const PHOTOS = [
  {
    // Chosen for the dark, high-key lighting the hero scrim needs — a bright
    // or cluttered shot here is what makes a template look cheap.
    file: "hero-technicians.jpg",
    width: 2560,
    height: 1440,
    url: pexels(4756887),
    credit: "Pexels — modern repair shop interior with vehicles on lifts",
    position: "center",
  },
  {
    file: "hero-detail.jpg",
    width: 900,
    height: 1100,
    url: pexels(6870313),
    credit: "Pexels — technician running diagnostics with a tablet",
  },
  {
    file: "about-shop.jpg",
    width: 1400,
    height: 1050,
    url: pexels(33814734),
    credit: "Pexels — bright modern service bays",
  },
  {
    file: "financing.jpg",
    width: 1400,
    height: 1050,
    url: pexels(6870324),
    credit: "Pexels — service advisor reviewing paperwork in a garage",
  },
  {
    file: "gallery-exterior.jpg",
    width: 1000,
    height: 1250,
    url: pexels(9572045),
    credit: "Pexels — illuminated auto shop exterior at night",
  },
  {
    file: "gallery-waiting-room.jpg",
    width: 1200,
    height: 900,
    url: pexels(38554812),
    credit: "Pexels — bright modern lounge with natural light",
  },
  {
    file: "gallery-technicians.jpg",
    width: 1100,
    height: 1100,
    url: pexels(8986105),
    credit: "Pexels — technician inspecting a vehicle",
  },
  {
    file: "gallery-equipment.jpg",
    width: 960,
    height: 1280,
    url: unsplash("1530046614490-89e6f776b83b"),
    credit: "Unsplash — tool chest and shop equipment",
  },
  {
    file: "gallery-repair.jpg",
    width: 1200,
    height: 900,
    url: pexels(20042052),
    credit: "Pexels — final polish on a finished vehicle",
  },
  {
    file: "gallery-bay.jpg",
    width: 1200,
    height: 960,
    url: pexels(33814736),
    credit: "Pexels — vehicle on a hydraulic lift in a well-lit bay",
  },
  { file: "avatar-1.jpg", width: 400, height: 400, url: pexels(19838484), credit: "Pexels — portrait" },
  { file: "avatar-2.jpg", width: 400, height: 400, url: pexels(18015900), credit: "Pexels — portrait" },
  { file: "avatar-3.jpg", width: 400, height: 400, url: pexels(6205635), credit: "Pexels — portrait" },
  { file: "avatar-4.jpg", width: 400, height: 400, url: pexels(28589292), credit: "Pexels — portrait" },
  { file: "avatar-5.jpg", width: 400, height: 400, url: pexels(3030325), credit: "Pexels — portrait" },
];

await mkdir(imagesDir, { recursive: true });

const results = [];

for (const photo of PHOTOS) {
  try {
    const response = await fetch(photo.url, {
      headers: { "user-agent": "auto-repair-template/1.0" },
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const buffer = Buffer.from(await response.arrayBuffer());
    await sharp(buffer)
      .resize({
        width: photo.width,
        height: photo.height,
        fit: "cover",
        position: photo.position ?? "attention", // libvips picks the busiest region
      })
      .jpeg({ quality: 82, mozjpeg: true })
      .toFile(path.join(imagesDir, photo.file));

    results.push({ ...photo, ok: true });
    console.log(`✓ ${photo.file}`);
  } catch (error) {
    results.push({ ...photo, ok: false, error: error.message });
    console.warn(`✗ ${photo.file} — ${error.message}`);
  }
}

const credits = [
  "# Placeholder photography",
  "",
  "Every image below is a **placeholder** downloaded from a free-licence stock",
  "source by `npm run photos`. Replace them with the shop's own photography",
  "before launch — either drop new files in at the same filenames, or upload",
  "them in the admin panel (Media Library) and repoint each section's image.",
  "",
  "| File | Source |",
  "| --- | --- |",
  ...results.filter((r) => r.ok).map((r) => `| \`${r.file}\` | ${r.credit} |`),
  "",
  `_Generated ${results.filter((r) => r.ok).length}/${PHOTOS.length} files._`,
  "",
].join("\n");

await writeFile(path.join(imagesDir, "CREDITS.md"), credits, "utf8");

/**
 * Next.js caches optimised images by (url, width, quality). Because this script
 * replaces files at the SAME filenames, those cache entries stay valid by key
 * while pointing at the old picture — the site then serves the previous image
 * indefinitely even though the file on disk changed. Clearing the cache here is
 * what stops "I replaced the photo but the old one still shows".
 */
await rm(path.join(root, ".next", "cache", "images"), { recursive: true, force: true });

const failed = results.filter((r) => !r.ok);
console.log(
  `\n${results.length - failed.length}/${PHOTOS.length} photos written to public/images.`,
);
console.log("Cleared .next/cache/images so the new files are served immediately.");
if (failed.length) {
  console.log("Run `npm run placeholders` to fill any gaps with generated plates.");
}
