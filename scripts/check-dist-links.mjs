// Every internal link in the built site resolves to a file. The Starlight links validator
// only sees docs pages; this also covers the custom hub and landing pages, the head
// (canonical, hreflang, icons) and asset references. Links into `/<project>/api/` are
// skipped: that reference is generated outside this build.
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = join(root, 'dist');
const SITE_ORIGIN = 'https://dbaitest.com';
const IGNORED = [/^\/[^/]+\/api(\/|$)/];

if (!existsSync(out)) {
  console.error('check:links: no build output; run `npm run build` first');
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

const ATTRIBUTE = /\s(?:href|src|srcset|content)\s*=\s*(?:"([^"]*)"|'([^']*)')/gi;
const decode = (s) => s.replace(/&amp;/g, '&').replace(/&#x2F;/gi, '/').replace(/&#47;/g, '/');

// The site path a link points at, or null when it is external, a fragment or a scheme link.
function internalPath(raw, pageUrl) {
  let value = decode(raw.trim());
  if (value === '' || value.startsWith('#')) return null;
  if (value.startsWith(SITE_ORIGIN)) value = value.slice(SITE_ORIGIN.length) || '/';
  else if (/^[a-z][a-z0-9+.-]*:/i.test(value) || value.startsWith('//')) return null;
  const url = new URL(value, `http://site${pageUrl}`);
  try {
    return decodeURIComponent(url.pathname);
  } catch {
    return url.pathname; // malformed %-escape: check the raw path, which then fails to resolve
  }
}

// Mirrors the hosting's html_handling: `/a/` -> a/index.html, `/a` -> a.html or a/index.html.
function resolves(path) {
  const file = join(out, ...path.split('/').filter(Boolean));
  if (path.endsWith('/')) return existsSync(join(file, 'index.html'));
  return (existsSync(file) && statSync(file).isFile()) || existsSync(`${file}.html`) || existsSync(join(file, 'index.html'));
}

const broken = [];
let checked = 0;
for (const file of htmlFiles) {
  const rel = relative(out, file).split(sep).join('/');
  const pageUrl = `/${rel.replace(/(^|\/)index\.html$/, '$1').replace(/\.html$/, '')}`;
  const html = readFileSync(file, 'utf8');
  for (const match of html.matchAll(ATTRIBUTE)) {
    const attribute = match[0].trim().split('=')[0].toLowerCase();
    const raw = match[1] ?? match[2];
    // `content` only matters for URL-valued meta tags (og:image, og:url).
    if (attribute === 'content' && !raw.startsWith(SITE_ORIGIN) && !raw.startsWith('/')) continue;
    const candidates = attribute === 'srcset' ? raw.split(',').map((part) => part.trim().split(/\s+/)[0]) : [raw];
    for (const candidate of candidates) {
      const path = internalPath(candidate, pageUrl);
      if (path === null || IGNORED.some((pattern) => pattern.test(path))) continue;
      // Starlight's 404 page names `/404/` (and its locale twin) as its canonical URL; the
      // host serves 404.html for any unknown path, so those self-references are not links.
      if (rel === '404.html' && /^\/([a-z]{2}\/)?404\/$/.test(path)) continue;
      checked++;
      if (!resolves(path)) broken.push(`${rel}: ${candidate}`);
    }
  }
}

if (broken.length > 0) {
  console.error([...new Set(broken)].map((b) => `  ✗ ${b}`).join('\n'));
  console.error(`check:links: ${broken.length} broken internal link(s) in ${htmlFiles.length} pages`);
  process.exit(1);
}
console.log(`check:links: ${checked} internal links in ${htmlFiles.length} pages resolve`);
