# Security policy

## Reporting a vulnerability

Do not open a public issue. Report it privately through GitHub:
**Security → Report a vulnerability** on this repository
(<https://github.com/dbaitest/dbaitest.com/security/advisories/new>).

Include the affected URL or file, how to reproduce it, and what an attacker gains. You will
get an answer within seven days.

## Scope

This repository builds the static site at <https://dbaitest.com> and deploys it to
Cloudflare. In scope: anything in the site, its build or its deployment that lets an
attacker run script on the site, change what it serves, or reach the deployment credentials
— for example a gap in the Content Security Policy, a build step that executes untrusted
input, or a workflow that exposes a secret to pull-request code.

Vulnerabilities in a project the site documents (for example the `DbAiTest.*` packages) belong
to that project's repository: see its own `SECURITY.md`.

Dependencies are checked on every build: an npm package with a moderate or worse advisory,
or an invalid registry signature, fails CI, and Dependabot proposes the update.
