// Every inline <script> and <style> in the built site is allowed by its page's CSP <meta>.
// Astro hashes the scripts and styles it bundles, but not `is:inline` ones (Starlight's theme,
// search-shortcut, sidebar and tabs scripts, and the landing theme script). Those hashes are
// pinned in astro.config.mjs; when a dependency bump or an edit changes one, this check fails
// and prints the hash to add, instead of the browser silently blocking the script.
import { createHash } from 'node:crypto';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = join(root, 'dist');
if (!existsSync(out)) {
  console.error('check:csp: no build output; run `npm run build` first');
  process.exit(1);
}

const htmlFiles = [];
const walk = (dir) => {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) walk(path);
    else if (name.endsWith('.html')) htmlFiles.push(path);
  }
};
walk(out);

const DATA_TYPES = /\stype\s*=\s*["']?application\/(ld\+)?json/i; // data blocks never execute
const missing = new Map(); // hash -> { kind, pages, preview }
let checked = 0;
for (const file of htmlFiles) {
  const page = relative(out, file).split(sep).join('/');
  const html = readFileSync(file, 'utf8');
  const csp = html.match(/<meta http-equiv="content-security-policy" content="([^"]*)"/i)?.[1];
  if (!csp) {
    missing.set(`no CSP meta: ${page}`, { kind: 'page', pages: [page], preview: '' });
    continue;
  }
  for (const [, tag, attrs = '', body] of html.matchAll(/<(script|style)(\s[^>]*)?>([\s\S]*?)<\/\1>/gi)) {
    if (/\ssrc\s*=/i.test(attrs) || DATA_TYPES.test(attrs) || body.trim() === '') continue;
    checked++;
    const hash = `'sha256-${createHash('sha256').update(body).digest('base64')}'`;
    if (csp.includes(hash)) continue;
    const entry = missing.get(hash) ?? { kind: tag.toLowerCase(), pages: [], preview: body.trim().slice(0, 60).replace(/\s+/g, ' ') };
    entry.pages.push(page);
    missing.set(hash, entry);
  }
}

if (missing.size > 0) {
  for (const [hash, { kind, pages, preview }] of missing) {
    console.error(`  ✗ ${kind} ${hash} on ${pages.length} page(s), e.g. ${pages[0]}\n      ${preview}`);
  }
  console.error(`check:csp: ${missing.size} inline block(s) the CSP would block. Add each hash to security.csp.${'{'}script,style${'}'}Directive.hashes in astro.config.mjs.`);
  process.exit(1);
}
console.log(`check:csp: ${checked} inline blocks in ${htmlFiles.length} pages are allowed by their CSP`);
