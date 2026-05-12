import * as fs from "fs";
import * as path from "path";
import { mergeCardMeta, type AssetManifest, type FullCard } from "./mergeCards";
import type { Card } from "./parseCardData";
import type { MetaBuckets } from "./parseMetaMarkdown";

const repoRoot = path.join(__dirname, "..");

const paths = {
  cardDataJson: path.join(repoRoot, "Card", "Data", "CardData.json"),
  cardTypeJson: path.join(repoRoot, "Card", "Meta", "Type", "card_type.json"),
  cardRarityJson: path.join(repoRoot, "Card", "Meta", "Rarity", "card_rarity.json"),
  cardAssetsJson: path.join(repoRoot, "Card", "Meta", "Assets", "card_assets.json"),
};

function readUtf8(filePath: string): string {
  return fs.readFileSync(filePath, "utf-8");
}

function loadCardData(filePath: string): Card[] {
  return JSON.parse(readUtf8(filePath)) as Card[];
}

function loadJsonBuckets(filePath: string): MetaBuckets {
  return JSON.parse(readUtf8(filePath)) as MetaBuckets;
}

function loadAssetManifest(filePath: string): AssetManifest {
  if (!fs.existsSync(filePath)) {
    console.warn(
      `[WARN] Asset manifest not found at ${filePath}. ` +
        `Run \`npm run build:emblems\` to generate it.`,
    );
    return {};
  }
  return JSON.parse(readUtf8(filePath)) as AssetManifest;
}

/**
 * 1. Read CardData.json
 * 2. Load JSON meta (type / rarity / assets)
 * 3. Merge by card name
 */
export function loadAllCards(): FullCard[] {
  const cards = loadCardData(paths.cardDataJson);
  const typeBuckets = loadJsonBuckets(paths.cardTypeJson);
  const rarityBuckets = loadJsonBuckets(paths.cardRarityJson);
  const assets = loadAssetManifest(paths.cardAssetsJson);
  return mergeCardMeta(cards, typeBuckets, rarityBuckets, assets);
}

export type { FullCard };
