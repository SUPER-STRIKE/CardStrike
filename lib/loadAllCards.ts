import * as fs from "fs";
import * as path from "path";
import { mergeCardMeta, type FullCard } from "./mergeCards";
import type { Card } from "./parseCardData";
import type { MetaBuckets } from "./parseMetaMarkdown";

const repoRoot = path.join(__dirname, "..");

const paths = {
  cardDataJson: path.join(repoRoot, "Card", "Data", "CardData.json"),
  cardTypeJson: path.join(repoRoot, "Card", "Meta", "card_type.json"),
  cardRarityJson: path.join(repoRoot, "Card", "Meta", "card_rarity.json"),
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

/**
 * 1. Read CardData.json
 * 2. Load JSON meta (type / rarity)
 * 3. Merge type / rarity by card name
 */
export function loadAllCards(): FullCard[] {
  const cards = loadCardData(paths.cardDataJson);
  const typeBuckets = loadJsonBuckets(paths.cardTypeJson);
  const rarityBuckets = loadJsonBuckets(paths.cardRarityJson);
  return mergeCardMeta(cards, typeBuckets, rarityBuckets);
}

export type { FullCard };
