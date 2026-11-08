## What changed

<!-- One or two sentences. What does this PR do, and why? -->

## Why

<!-- The problem this solves. Link the issue if there is one: "Fixes #123" -->

## How it was verified

<!--
What did you run, and what did you see? Be specific: a command, a page, a before/after.
"It builds" is not evidence on its own; say what proves the change does what it claims.

    npm ci
    npm run verify        # astro check, EN/VI parity, build (links validator), built-site links

For a docs page: list the identifiers you checked against the project's source at the
pinned ref in projects.json (.upstream/<project>/src/).
-->

## Checklist

- [ ] `npm run verify` passes
- [ ] English and Vietnamese updated together (same relative path in `vi/`)
- [ ] Every API name, option and default in changed docs exists at the pinned `ref`
- [ ] No hand-copied code where an upstream source exists (README or `samples/**`)
- [ ] Lockfiles regenerated on Linux, if dependencies changed
