/**
 * STEP 2: Scaffold per-card avatar SVGs + per-rarity back SVGs,
 *         and emit an asset manifest used by the renderer.
 *
 * Idempotent: only creates SVGs that don't already exist. Re-running after
 * adding new cards just fills in the gaps — never overwrites your art.
 *
 * Run: npx ts-node scripts/build-emblems.ts
 *      (or `npm run build:emblems`)
 */
import * as fs from "fs";
import * as path from "path";

type Card = { name: string };
type RarityBuckets = Record<string, string[]>;
type AssetEntry = { avatar: string; back: string };
type AssetManifest = Record<string, AssetEntry>;

const root = path.join(__dirname, "..");

const paths = {
  cardData: path.join(root, "Card", "Data", "CardData.json"),
  rarityJson: path.join(root, "Card", "Meta", "Rarity", "card_rarity.json"),
  avatarsDir: path.join(root, "Card", "Assets", "Avatars"),
  backsDir: path.join(root, "Card", "Assets", "Backs"),
  manifestJson: path.join(root, "Card", "Meta", "Assets", "card_assets.json"),
  manifestJs: path.join(root, "Card", "Meta", "Assets", "card_assets.js"),
};

/** Rarity → palette. Keep in sync with cardTest.html CSS variables. */
const RARITY_PALETTE: Record<string, { tint: string; soft: string; label: string }> = {
  Common: { tint: "#94a3b8", soft: "rgba(148,163,184,0.18)", label: "COMMON" },
  Rare: { tint: "#facc15", soft: "rgba(250,204,21,0.18)", label: "RARE" },
  Special: { tint: "#c084fc", soft: "rgba(192,132,252,0.18)", label: "SPECIAL" },
  Support: { tint: "#34d399", soft: "rgba(52,211,153,0.18)", label: "SUPPORT" },
  Unknown: { tint: "#5b8cff", soft: "rgba(91,140,255,0.18)", label: "UNKNOWN" },
};

function readUtf8(p: string): string {
  return fs.readFileSync(p, "utf-8");
}

function ensureDir(p: string): void {
  fs.mkdirSync(p, { recursive: true });
}

/** "Tiên tri hủy diệt" → "tien-tri-huy-diet" */
function slug(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** "Tiên tri hủy diệt" → "TD"   ("Cây cổ thụ" → "CT") */
function initials(name: string): string {
  const words = name.trim().split(/\s+/);
  if (words.length === 0) return "?";
  const stripDiacritic = (w: string): string =>
    w.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D");
  const first = stripDiacritic(words[0])[0] ?? "?";
  const last = words.length > 1 ? stripDiacritic(words[words.length - 1])[0] ?? "" : "";
  return (first + last).toUpperCase();
}

function paletteFor(rarity: string): { tint: string; soft: string; label: string } {
  return RARITY_PALETTE[rarity] ?? RARITY_PALETTE.Unknown;
}

function escapeXml(s: string): string {
  return s.replace(/[&<>"']/g, (ch) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&apos;",
  })[ch] as string);
}

/** 400×400 square placeholder: big initials on dark + rarity tint vignette. */
function makeAvatarSvg(cardName: string, rarity: string): string {
  const p = paletteFor(rarity);
  const ini = escapeXml(initials(cardName));
  const name = escapeXml(cardName);

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400" role="img" aria-label="${name}">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#1b2547"/>
      <stop offset="100%" stop-color="#0b0f1a"/>
    </linearGradient>
    <radialGradient id="vig" cx="50%" cy="42%" r="62%">
      <stop offset="0%" stop-color="${p.tint}" stop-opacity="0.32"/>
      <stop offset="70%" stop-color="${p.tint}" stop-opacity="0"/>
    </radialGradient>
    <filter id="blur" x="-10%" y="-10%" width="120%" height="120%">
      <feGaussianBlur in="SourceGraphic" stdDeviation="2"/>
    </filter>
  </defs>

  <rect width="400" height="400" rx="14" fill="url(#bg)"/>
  <rect width="400" height="400" rx="14" fill="url(#vig)"/>
  <rect x="6" y="6" width="388" height="388" rx="10" fill="none" stroke="${p.tint}" stroke-opacity="0.35" stroke-width="1.5"/>

  <g transform="translate(200 215)">
    <text text-anchor="middle" font-family="system-ui, Segoe UI, sans-serif"
          font-size="180" font-weight="800" fill="${p.tint}" fill-opacity="0.22"
          letter-spacing="-6" filter="url(#blur)">${ini}</text>
    <text text-anchor="middle" font-family="system-ui, Segoe UI, sans-serif"
          font-size="180" font-weight="800" fill="#e7ecf7"
          letter-spacing="-6">${ini}</text>
  </g>

  <text x="200" y="358" text-anchor="middle" font-family="system-ui, Segoe UI, sans-serif"
        font-size="18" font-weight="600" fill="#8a96b4">${name}</text>
  <text x="200" y="380" text-anchor="middle" font-family="system-ui, Segoe UI, sans-serif"
        font-size="10" font-weight="700" fill="${p.tint}" letter-spacing="4">${p.label}</text>
</svg>
`;
}

/** 400×600 card back, tinted to the rarity color. */
function makeBackSvg(rarity: string): string {
  const p = paletteFor(rarity);
  const label = escapeXml(p.label);
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 600" width="400" height="600" role="img" aria-label="CardStrike ${label} back">
  <defs>
    <linearGradient id="edge" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#2a3656"/>
      <stop offset="50%" stop-color="#1d2742"/>
      <stop offset="100%" stop-color="#0b0f1a"/>
    </linearGradient>
    <linearGradient id="panel" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#1b2547"/>
      <stop offset="100%" stop-color="#0f1628"/>
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="42%" r="55%">
      <stop offset="0%" stop-color="${p.tint}" stop-opacity="0.28"/>
      <stop offset="70%" stop-color="${p.tint}" stop-opacity="0"/>
      <stop offset="100%" stop-color="#000" stop-opacity="0"/>
    </radialGradient>
    <pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse">
      <path d="M24 0H0V24" fill="none" stroke="${p.tint}" stroke-opacity="0.08" stroke-width="1"/>
    </pattern>
    <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur in="SourceGraphic" stdDeviation="1.2"/>
    </filter>
  </defs>

  <rect x="0" y="0" width="400" height="600" rx="18" fill="#0b0f1a"/>
  <rect x="6" y="6" width="388" height="588" rx="14" fill="url(#edge)"/>
  <rect x="14" y="14" width="372" height="572" rx="10" fill="url(#panel)" stroke="${p.tint}" stroke-opacity="0.45" stroke-width="1"/>

  <rect x="22" y="22" width="356" height="556" rx="8" fill="url(#grid)"/>
  <rect x="22" y="22" width="356" height="556" rx="8" fill="url(#glow)"/>

  <g fill="none" stroke="${p.tint}" stroke-width="2" stroke-opacity="0.55">
    <path d="M38 48h28v28M38 552h28v-28M362 48h-28v28M362 552h-28v-28"/>
  </g>

  <g transform="translate(200 300)">
    <circle r="118" fill="none" stroke="${p.tint}" stroke-opacity="0.35" stroke-width="1"/>
    <circle r="96" fill="none" stroke="${p.tint}" stroke-opacity="0.55" stroke-width="1"/>
    <path d="M0-72 L62 36 L-62 36 Z" fill="none" stroke="${p.tint}" stroke-opacity="0.55" stroke-width="1.5"/>
    <path d="M0 72 L-62-36 L62-36 Z" fill="none" stroke="${p.tint}" stroke-opacity="0.55" stroke-width="1.5"/>
    <text text-anchor="middle" font-family="system-ui, Segoe UI, sans-serif" font-size="52" font-weight="800" fill="#e7ecf7" letter-spacing="-2" filter="url(#soft)">CS</text>
    <text text-anchor="middle" font-family="system-ui, Segoe UI, sans-serif" font-size="52" font-weight="800" fill="${p.tint}" fill-opacity="0.45" letter-spacing="-2">CS</text>
    <text x="0" y="58" text-anchor="middle" font-family="system-ui, Segoe UI, sans-serif" font-size="11" font-weight="600" fill="#8a96b4" letter-spacing="6">CARDSTRIKE</text>
  </g>

  <rect x="100" y="520" width="200" height="36" rx="6" fill="#131a2b" stroke="${p.tint}" stroke-opacity="0.45" stroke-width="1"/>
  <text x="200" y="543" text-anchor="middle" font-family="system-ui, Segoe UI, sans-serif" font-size="11" fill="${p.tint}" letter-spacing="4" font-weight="700">${label}</text>
</svg>
`;
}

function writeIfMissing(filePath: string, body: string): "created" | "kept" {
  if (fs.existsSync(filePath)) return "kept";
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, body, "utf-8");
  return "created";
}

function toForwardSlash(p: string): string {
  return p.replace(/\\/g, "/");
}

function buildRarityIndex(buckets: RarityBuckets): Map<string, string> {
  const out = new Map<string, string>();
  for (const [rarity, names] of Object.entries(buckets)) {
    for (const n of names) out.set(n, rarity);
  }
  return out;
}

function main(): void {
  const cards = JSON.parse(readUtf8(paths.cardData)) as Card[];
  const rarityBuckets = JSON.parse(readUtf8(paths.rarityJson)) as RarityBuckets;
  const nameToRarity = buildRarityIndex(rarityBuckets);

  ensureDir(paths.avatarsDir);
  ensureDir(paths.backsDir);
  ensureDir(path.dirname(paths.manifestJson));

  const manifest: AssetManifest = {};
  const stats = { avatarsCreated: 0, avatarsKept: 0, backsCreated: 0, backsKept: 0 };

  // One back per rarity present in the rarity meta.
  for (const rarity of Object.keys(rarityBuckets)) {
    const backRel = path.join("Card", "Assets", "Backs", `${slug(rarity)}.svg`);
    const backAbs = path.join(root, backRel);
    const result = writeIfMissing(backAbs, makeBackSvg(rarity));
    if (result === "created") stats.backsCreated++;
    else stats.backsKept++;
    console.log(`  ${result === "created" ? "+" : "·"} ${toForwardSlash(backRel)}`);
  }

  // One avatar per card + manifest entry.
  for (const card of cards) {
    const rarity = nameToRarity.get(card.name);
    if (!rarity) {
      console.warn(`[WARN] No rarity for "${card.name}" — using Unknown.`);
    }
    const effectiveRarity = rarity ?? "Unknown";

    const avatarRel = path.join("Card", "Assets", "Avatars", `${slug(card.name)}.svg`);
    const avatarAbs = path.join(root, avatarRel);
    const result = writeIfMissing(avatarAbs, makeAvatarSvg(card.name, effectiveRarity));
    if (result === "created") stats.avatarsCreated++;
    else stats.avatarsKept++;
    console.log(`  ${result === "created" ? "+" : "·"} ${toForwardSlash(avatarRel)}`);

    const backRel = path.join("Card", "Assets", "Backs", `${slug(effectiveRarity)}.svg`);
    manifest[card.name] = {
      avatar: toForwardSlash(avatarRel),
      back: toForwardSlash(backRel),
    };
  }

  fs.writeFileSync(paths.manifestJson, JSON.stringify(manifest, null, 2) + "\n", "utf-8");
  fs.writeFileSync(
    paths.manifestJs,
    `/* AUTO-GENERATED by scripts/build-emblems.ts — do not edit. */\n` +
      `window.CARD_ASSETS = ${JSON.stringify(manifest, null, 2)};\n`,
    "utf-8",
  );

  console.log("");
  console.log(`Manifest → ${toForwardSlash(path.relative(root, paths.manifestJson))}`);
  console.log(`Manifest → ${toForwardSlash(path.relative(root, paths.manifestJs))}`);
  console.log(
    `Done. Avatars: ${stats.avatarsCreated} created, ${stats.avatarsKept} kept. ` +
      `Backs: ${stats.backsCreated} created, ${stats.backsKept} kept.`,
  );
}

main();
