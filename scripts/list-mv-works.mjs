import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const dir = join(process.cwd(), "src/data");
const files = readdirSync(dir).filter((f) => f.endsWith("-mv-locations.ts"));

/** @type {{ group: string, workTitle: string }[]} */
const rows = [];

for (const file of files) {
  const text = readFileSync(join(dir, file), "utf8");
  const objectStarts = [...text.matchAll(/\{\s*\r?\n\s*group:\s*"/g)];
  for (const match of objectStarts) {
    const start = match.index ?? 0;
    const slice = text.slice(start, start + 800);
    const group = slice.match(/group:\s*"([^"]+)"/)?.[1];
    const workTitle = slice.match(/workTitle:\s*"([^"]+)"/)?.[1];
    if (group && workTitle) {
      rows.push({ group, workTitle });
    }
  }
}

// unique by group+workTitle, keep order
const seen = new Set();
const unique = [];
for (const row of rows) {
  const key = `${row.group}\t${row.workTitle}`;
  if (seen.has(key)) continue;
  seen.add(key);
  unique.push(row);
}

unique.sort((a, b) => {
  const g = a.group.localeCompare(b.group, "ja");
  if (g !== 0) return g;
  return a.workTitle.localeCompare(b.workTitle, "ja");
});

const tsv = ["グループ名\t作品名", ...unique.map((r) => `${r.group}\t${r.workTitle}`)].join(
  "\n",
);
const plain = unique.map((r) => `${r.group}\t${r.workTitle}`).join("\n");

writeFileSync(join(process.cwd(), "docs/mv-works-list.tsv"), tsv + "\n", "utf8");
console.log(plain);
console.error(`\n--- ${unique.length} 件（重複除く）---`);
