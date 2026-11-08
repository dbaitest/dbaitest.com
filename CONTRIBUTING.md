# Contributing

Every change to this repository goes through a pull request. Direct pushes to `main` are
rejected by GitHub. A merge to `main` deploys the site.

## The workflow

```bash
git switch -c docs/short-description
# ...make your change...
npm run verify
git add -A
git commit -m "docs(db-test): what you changed"
git push -u origin docs/short-description
gh pr create --base main --fill
```

## Local development

Node 22.23.4 or newer (`.node-version`; `.npmrc` sets `engine-strict`, so an older Node
refuses to install instead of building nothing).

```bash
npm ci
npm run dev       # http://localhost:4321 (search is empty in dev: Pagefind indexes the build)
npm run verify    # the same checks CI runs, see below
npm run preview   # serve the build, search included
```

Each project's README and samples are cloned at the release pinned in `projects.json` into
`.upstream/<project>/` before `dev`, `check` and `build`. Pages import them from there
(`@upstream/...?raw`), so the docs always describe the released package. A clone with local
edits is replaced on the next run.

### What `npm run verify` checks

| Step | Fails when |
|---|---|
| `check` | `astro check` finds a type or template error |
| `check:i18n` | an English page has no Vietnamese page at the same path, or the reverse |
| `build` | a docs link or anchor is broken (links validator), a docs page is in no sidebar topic, or an upstream snippet a page extracts no longer exists |
| `check:links` | any internal link in the built site (hub and landing pages included) does not resolve |
| `check:csp` | an inline script or style would be blocked by the page's Content Security Policy |

`check:csp` prints the hash to add to `security.csp` in `astro.config.mjs`. Starlight renders
a few scripts inline; a Starlight upgrade that changes one fails here, not in the browser.

### Dependencies and lockfiles

Generate lockfiles on Linux (WSL is fine), in a directory with no `node_modules`:
`npm install --package-lock-only` reads an existing Windows `node_modules` and drops the
Linux native packages CI needs. `deploy/` holds only wrangler and has its own lockfile.
Dependabot proposes updates weekly, a release only once it is seven days old.

## Vietnamese

The site is fully mirrored: a new or changed English page ships with its Vietnamese page in
the same pull request (`src/content/docs/vi/...`, same relative path). Code, identifiers, CLI
flags, environment variables and package names stay in English and identical in both.

| English | Tiếng Việt |
|---|---|
| integration test | kiểm thử tích hợp |
| container / schema / engine | giữ nguyên |
| shape guard | shape guard (lần đầu giải thích "bộ canh hình dạng schema") |
| cleanup | dọn dữ liệu |
| database project | database project (dự án cơ sở dữ liệu) |

Landing-page strings live in `src/i18n/*.ts`; sidebar labels in `astro.config.mjs`
(`translations.vi`). Vietnamese headings produce Vietnamese anchors: renaming a heading means
updating the links to it (the build fails on the stale ones).

## Projects

### Bumping a project to a new release

After a project publishes a release, open a PR here that changes its `ref` in
`projects.json` to the new tag. The PR's build re-imports the README and samples at that
tag and fails if a section or sample a page uses has moved. Update the docs for what the
release changed (both languages) in the same PR. A scheduled weekly build fails while any
pinned `ref` is behind its project's latest release.

### Adding a project

1. `projects.json`: `{ "<id>": { "repo": "dbaitest/<repo>", "ref": "<tag>", "nuget": "<package>" } }`
2. `src/i18n/hub-strings.ts`: the card strings under `projects["<id>"]` (EN + VI). The hub
   renders the card from these; the build fails without them.
3. Docs under `src/content/docs/<id>/docs/` and `src/content/docs/vi/<id>/docs/`, plus a
   sidebar topic for `<id>` in `astro.config.mjs`.
4. A landing page at `src/pages/<id>/index.astro` and `src/pages/vi/<id>/index.astro`.

## CI and deployment

| Check | Runs on | Does | Required |
|---|---|---|---|
| `site-build` | every PR, push to `main`, weekly | `npm ci`, audit + registry signatures (root and `deploy/`), `npm run verify`, uploads the built site; weekly: flags pinned refs behind the latest release | yes |
| `PR title and description` | every PR | Conventional Commits title, filled-in description | yes |
| `site-deploy` | push to `main`, after `site-build` | deploys that build with wrangler (environment `production`) | — |
| `site-rollback` | manual | rolls production back | — |

No secrets reach pull requests: forks and Dependabot run `site-build` like anyone else. The
deploy and rollback jobs install only wrangler from `deploy/`, with install scripts off.

### Rolling back

1. Wait for any running `site-deploy` to finish (a rollback runs in its own queue).
2. Actions → **Site** → **Run workflow** on `main`. Leave *version id* empty to go back one
   version, or paste the version id shown in the summary of the deploy run you want back.
   Give a reason (100 characters at most).
3. The next merge to `main` deploys forward again; fix the cause in that PR.

If a deploy breaks the site badly before a rollback is possible, detach the custom domain in
the Cloudflare dashboard (Workers → `dbaitest-site` → Domains).

## Writing the pull request

The title follows Conventional Commits (`type(scope): summary`, with
`feat` `fix` `docs` `style` `refactor` `perf` `test` `build` `ci` `chore` `revert`). The
description follows the template: what changed, why, and how it was verified.

## Merge policy

Squash merge only. The commit message comes from the pull request title.
