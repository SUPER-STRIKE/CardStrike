import { loadAllCards, type FullCard } from "../lib/loadAllCards";

function printCard(card: FullCard): void {
  console.log("[Card]");
  console.log(`Name: ${card.name}`);
  console.log(`Mana: ${card.mana}`);
  console.log(`HP cost: ${card.hpCost}`);
  console.log(`Rarity: ${card.rarity}`);
  console.log(`Type: ${card.type}`);
  console.log("Effects:");
  for (const e of card.effects) {
    console.log(`* ${e}`);
  }
  console.log("");
}

function groupBy<T>(items: T[], key: (item: T) => string): Record<string, T[]> {
  const out: Record<string, T[]> = {};
  for (const item of items) {
    const k = key(item);
    if (!out[k]) out[k] = [];
    out[k].push(item);
  }
  return out;
}

function printGrouped(title: string, groups: Record<string, FullCard[]>): void {
  console.log(title);
  for (const label of Object.keys(groups).sort()) {
    const names = groups[label].map((c) => c.name).join(", ");
    console.log(`  ${label}: ${names}`);
  }
  console.log("");
}

function main(): void {
  const cards = loadAllCards();

  for (const card of cards) {
    printCard(card);
  }

  console.log(`Total cards: ${cards.length}`);
  console.log("");

  printGrouped("By rarity:", groupBy(cards, (c) => c.rarity));
  printGrouped("By type:", groupBy(cards, (c) => c.type));
}

main();
