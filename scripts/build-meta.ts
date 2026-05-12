/**
 * STEP 1: Convert Card/Type/CardType.md and Card/Rarity/CardRarity.md → Card/Meta/Type|Rarity/*.json
 * Run: npx ts-node scripts/build-meta.ts
 */
import * as fs from "fs";
import * as path from "path";
import { parseBucketMarkdown, writeMetaJson } from "../lib/parseMetaMarkdown";

const root = path.join(__dirname, "..");

const inputs = {
  typeMd: path.join(root, "Card", "Type", "CardType.md"),
  rarityMd: path.join(root, "Card", "Rarity", "CardRarity.md"),
};

const outputs = {
  cardTypeJson: path.join(root, "Card", "Meta", "Type", "card_type.json"),
  cardRarityJson: path.join(root, "Card", "Meta", "Rarity", "card_rarity.json"),
};

function main(): void {
  fs.mkdirSync(path.dirname(outputs.cardTypeJson), { recursive: true });
  fs.mkdirSync(path.dirname(outputs.cardRarityJson), { recursive: true });

  const typeBuckets = parseBucketMarkdown(fs.readFileSync(inputs.typeMd, "utf-8"));
  const rarityBuckets = parseBucketMarkdown(fs.readFileSync(inputs.rarityMd, "utf-8"));

  writeMetaJson(outputs.cardTypeJson, typeBuckets);
  writeMetaJson(outputs.cardRarityJson, rarityBuckets);

  console.log(`Wrote ${outputs.cardTypeJson}`);
  console.log(`Wrote ${outputs.cardRarityJson}`);
}

main();
