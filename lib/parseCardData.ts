export type Card = {
  name: string;
  mana: number;
  hpCost: number;
  effects: string[];
};

/**
 * Parse CardData.md:
 *
 * ## Card Name
 *
 * * Mana: number
 * * Effects:
 *
 *   * effect line
 */
export function parseCardData(md: string): Card[] {
  const chunks = md.split(/^## /m).map((c) => c.trim()).filter(Boolean);
  const cards: Card[] = [];

  for (const chunk of chunks) {
    const lines = chunk.split(/\r?\n/);
    const name = lines[0]?.trim() ?? "";
    if (!name) continue;

    let mana = 0;
    const effects: string[] = [];
    let i = 1;

    while (i < lines.length) {
      const line = lines[i];
      const trimmed = line.trim();

      const manaMatch = trimmed.match(/^\* Mana:\s*(\d+)\s*$/);
      if (manaMatch) {
        mana = Number(manaMatch[1]);
        i++;
        continue;
      }

      if (/^\* Effects:\s*$/.test(trimmed)) {
        i++;
        while (i < lines.length) {
          const effLine = lines[i];
          const sub = effLine.match(/^\s+\*\s+(.+)$/);
          if (sub) {
            effects.push(sub[1].trim());
            i++;
            continue;
          }
          if (effLine.trim() === "") {
            i++;
            continue;
          }
          if (/^\* /.test(effLine.trim())) break;
          i++;
        }
        continue;
      }

      i++;
    }

    cards.push({ name, mana, hpCost: 0, effects });
  }

  return cards;
}
