// Clones every project listed in projects.json into .upstream/<id>/ at its pinned ref,
// so the docs and landing pages describe the released package rather than `main`.
// A checkout already at the pinned commit is reused; anything else is replaced.
// Any failure (unknown ref, network) exits non-zero: a stale copy is never used silently.
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const projects = JSON.parse(readFileSync(join(root, 'projects.json'), 'utf8'));

// Values reach `git` as argv entries (no shell), but a leading dash would still be read
// as an option, so both fields are restricted to what a GitHub repo and tag can be.
const REPO = /^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/;
const REF = /^[A-Za-z0-9_][A-Za-z0-9_./-]*$/;

const git = (args, options = {}) =>
  execFileSync('git', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], ...options }).trim();

// The commit a remote ref points at (peeled for annotated tags), or null when it does not exist.
function remoteCommit(url, ref) {
  const lines = git(['ls-remote', url, `refs/tags/${ref}`, `refs/tags/${ref}^{}`, `refs/heads/${ref}`])
    .split('\n')
    .filter(Boolean)
    .map((line) => line.split('\t'));
  const peeled = lines.find(([, name]) => name.endsWith('^{}'));
  return (peeled ?? lines[0])?.[0] ?? null;
}

// Reuse a checkout only when it sits at the expected commit with no local edits; a corrupt
// clone or a hand-edited file means it no longer is the release, so it gets re-cloned.
function isPristineCheckout(target, expected) {
  if (!existsSync(join(target, '.git'))) return false;
  try {
    return git(['-C', target, 'rev-parse', 'HEAD']) === expected && git(['-C', target, 'status', '--porcelain']) === '';
  } catch {
    return false;
  }
}

let failed = false;
for (const [id, { repo, ref }] of Object.entries(projects)) {
  if (!/^[a-z0-9-]+$/.test(id) || !REPO.test(repo ?? '') || !REF.test(ref ?? '')) {
    console.error(`projects.json: invalid entry "${id}" (repo "${repo}", ref "${ref}")`);
    failed = true;
    continue;
  }
  const url = `https://github.com/${repo}.git`;
  const target = join(root, '.upstream', id);
  try {
    const expected = remoteCommit(url, ref);
    if (!expected) throw new Error(`ref "${ref}" does not exist in ${repo}`);
    if (isPristineCheckout(target, expected)) {
      console.log(`upstream ${id}: ${repo}@${ref} already present`);
      continue;
    }
    rmSync(target, { recursive: true, force: true });
    git(['-c', 'advice.detachedHead=false', 'clone', '--quiet', '--depth', '1', '--branch', ref, url, target]);
    console.log(`upstream ${id}: cloned ${repo}@${ref}`);
  } catch (error) {
    console.error(`upstream ${id}: ${error.stderr?.trim() || error.message}`);
    failed = true;
  }
}
if (failed) process.exit(1);
