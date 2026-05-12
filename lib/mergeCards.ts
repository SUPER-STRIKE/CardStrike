import type { Card } from "./parseCardData";
import type { MetaBuckets } from "./parseMetaMarkdown";

export type AssetEntry = { avatar: string; back: string };
export type AssetManifest = Record<string, AssetEntry>;

export type FullCard = {
  name: string;
  mana: number;
  hpCost: number;
  effects: string[];
  type: string;
  rarity: string;
  avatar: string;
  back: string;
};

function buildNameToLabel(buckets: MetaBuckets): Map<string, string> {
  const map = new Map<string, string>();
  for (const [label, names] of Object.entries(buckets)) {
    for (const n of names) {
      map.set(n, label);
    }
  }
  return map;
}

export function mergeCardMeta(
  cards: Card[],
  typeBuckets: MetaBuckets,
  rarityBuckets: MetaBuckets,
  assets: AssetManifest = {}
): FullCard[] {
  const nameToType = buildNameToLabel(typeBuckets);
  const nameToRarity = buildNameToLabel(rarityBuckets);

  return cards.map((c) => {
    let type = nameToType.get(c.name);
    if (!type) {
      console.warn(`[WARN] Missing type for: ${c.name}`);
      type = "Unknown";
    }

    let rarity = nameToRarity.get(c.name);
    if (!rarity) {
      console.warn(`[WARN] Missing rarity for: ${c.name}`);
      rarity = "Unknown";
    }

    const asset = assets[c.name];
    if (!asset) {
      console.warn(`[WARN] Missing asset entry for: ${c.name} (run \`npm run build:emblems\`)`);
    }

    return {
      name: c.name,
      mana: c.mana,
      hpCost: c.hpCost,
      effects: c.effects,
      type,
      rarity,
      avatar: asset?.avatar ?? "",
      back: asset?.back ?? "",
    };
  });
}
