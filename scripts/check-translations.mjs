// Strict EN <-> VI parity: every English page has a Vietnamese page at the same relative
// path and vice versa. Covers the Starlight docs (src/content/docs vs src/content/docs/vi)
// and the custom pages (src/pages vs src/pages/vi). Prints every mismatch, then exits 1.
import { readdirSync, statSync } from 'node:fs';
import { dirname, join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const LOCALE = 'vi';

// Relative page paths under `dir`, extension stripped, `/` separators, skipping `skipDir`.
function pages(dir, extensions, skipDir) {
  const found = new Set();
  const walk = (current) => {
    for (const name of readdirSync(current)) {
      const path = join(current, name);
      if (statSync(path).isDirectory()) {
        if (path !== skipDir) walk(path);
        continue;
      }
      const ext = extensions.find((e) => name.endsWith(e));
      if (ext) found.add(relative(dir, path).slice(0, -ext.length).split(sep).join('/'));
    }
  };
  walk(dir);
  return found;
}

const sets = [
  { label: 'docs', dir: join(root, 'src/content/docs'), extensions: ['.mdx', '.md'] },
  { label: 'pages', dir: join(root, 'src/pages'), extensions: ['.astro', '.mdx', '.md'] },
];

const problems = [];
for (const { label, dir, extensions } of sets) {
  const localeDir = join(dir, LOCALE);
  const english = pages(dir, extensions, localeDir);
  const vietnamese = pages(localeDir, extensions, null);
  for (const page of english) {
    if (!vietnamese.has(page)) problems.push(`${label}: "${page}" has no Vietnamese page (${LOCALE}/${page})`);
  }
  for (const page of vietnamese) {
    if (!english.has(page)) problems.push(`${label}: "${LOCALE}/${page}" has no English page (${page})`);
  }
  console.log(`check:i18n ${label}: ${english.size} English, ${vietnamese.size} Vietnamese`);
}

if (problems.length > 0) {
  console.error(problems.map((p) => `  ✗ ${p}`).join('\n'));
  console.error(`check:i18n: ${problems.length} page(s) out of parity. Add or remove the counterpart in the same change.`);
  process.exit(1);
}
console.log('check:i18n: English and Vietnamese pages are in parity');
