import * as fs from "fs";

/** Buckets: category label → list of card names (Vietnamese preserved). */
export type MetaBuckets = Record<string, string[]>;

/**
 * Parse CardType.md / CardRarity.md style blocks:
 *
 * CategoryName
 * {
 * Name one,
 * Name two
 * }
 */
export function parseBucketMarkdown(content: string): MetaBuckets {
  const lines = content.split(/\r?\n/).map((l) => l.trim());
  const result: MetaBuckets = {};
  let i = 0;

  const skipBlanks = (): void => {
    while (i < lines.length && lines[i] === "") i++;
  };

  while (i < lines.length) {
    skipBlanks();
    if (i >= lines.length) break;

    const category = lines[i];
    i++;

    skipBlanks();
    if (i >= lines.length || lines[i] !== "{") {
      continue;
    }
    i++;

    const names: string[] = [];
    while (i < lines.length && lines[i] !== "}") {
      let line = lines[i];
      if (line.endsWith(",")) {
        line = line.slice(0, -1).trim();
      }
      if (line !== "") {
        names.push(line);
      }
      i++;
    }

    if (i < lines.length && lines[i] === "}") {
      i++;
    }

    result[category] = names;
  }

  return result;
}

export function writeMetaJson(filePath: string, buckets: MetaBuckets): void {
  fs.writeFileSync(filePath, JSON.stringify(buckets, null, 2) + "\n", "utf-8");
}
