// @ts-check
import { fileURLToPath } from 'node:url';
import starlight from '@astrojs/starlight';
import { defineConfig } from 'astro/config';
import starlightLinksValidator from 'starlight-links-validator';
import starlightSidebarTopics from 'starlight-sidebar-topics';

// One Starlight site for every dbaitest project. Each project owns a URL prefix
// (`/<project>/` landing, `/<project>/docs/` guide) and one sidebar topic, so a
// reader inside one project's docs only sees that project's navigation.
export default defineConfig({
  site: 'https://dbaitest.com',
  trailingSlash: 'always',
  // Enforced CSP as a per-page <meta>: Astro hashes the scripts and styles it bundles. Scripts
  // rendered `is:inline` are not hashed automatically, so theirs are pinned below and
  // `npm run check:csp` fails (printing the new hash) when an upgrade or edit changes one.
  // Pagefind needs WebAssembly ('wasm-unsafe-eval'). Expressive Code colours tokens with
  // style="" attributes, which a hash cannot cover, so only attribute styles allow inline;
  // <style> elements stay hashed. frame-ancestors cannot be set from a <meta>, so framing is
  // denied in public/_headers.
  security: {
    csp: {
      directives: ["default-src 'self'", "img-src 'self' data:", "object-src 'none'", "base-uri 'self'", "form-action 'self'"],
      scriptDirective: {
        resources: ["'self'", "'wasm-unsafe-eval'"],
        hashes: [
          // @astrojs/starlight 0.42.10 inline scripts
          'sha256-VWo5Wp4aqSj6nSgMpeAp9cKieaoIfwFUAunAVugI5gA=', // StarlightThemeProvider (head)
          'sha256-GkZBRnvSuhtx/cvzvukVkX2JJZW+DdPlVr7BX8Tefqo=', // StarlightThemeProvider.updatePickers()
          'sha256-f/zAUE74ucc3JYp4r4QQvkJofoQdkOIhHYK+jeZ6eko=', // search: Ctrl+K / "/" shortcut
          'sha256-wX2yOADeV+NMngflD5uYi3vl50SHC4sfM1EmylVjlX4=', // sidebar: mobile menu state
          'sha256-7eCV4jtsr4t4knb3c4FCRPeu7GGZeOUGE3XvWix0XOQ=', // sidebar: scroll restore
          'sha256-j066YyZLmxi7hThtvu2oKJArg82wWVur6pfnklFFLH0=', // <Tabs>: restore synced tab
          // src/layouts/LandingLayout.astro: theme before first paint (no flash)
          'sha256-G7tgZlG5YOpGugwZY8zvR5Nc9MBMUdE1zPeddSH9NS4=',
        ],
      },
      styleDirective: {
        resources: [
          { resource: "'self'", kind: 'element' },
          { resource: "'unsafe-inline'", kind: 'attribute' },
        ],
      },
    },
  },
  vite: {
    // Project sources cloned at their pinned release by scripts/fetch-upstream.mjs.
    resolve: { alias: { '@upstream': fileURLToPath(new URL('./.upstream', import.meta.url)) } },
  },
  integrations: [
    starlight({
      title: 'dbaitest',
      description: 'Open-source .NET tooling for testing against real databases.',
      favicon: '/favicon.svg',
      customCss: ['./src/styles/brand.css'],
      defaultLocale: 'root',
      locales: {
        root: { label: 'English', lang: 'en' },
        vi: { label: 'Tiếng Việt', lang: 'vi' },
      },
      social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/dbaitest' }],
      editLink: { baseUrl: 'https://github.com/dbaitest/dbaitest.com/edit/main/' },
      lastUpdated: false,
      plugins: [
        starlightSidebarTopics([
          {
            id: 'db-test',
            label: 'db-test',
            link: '/db-test/docs/',
            icon: 'open-book',
            items: [
              {
                label: 'Start here',
                translations: { vi: 'Bắt đầu' },
                items: [{ slug: 'db-test/docs', label: 'Introduction', translations: { vi: 'Giới thiệu' } }, 'db-test/docs/getting-started'],
              },
              {
                label: 'Guides',
                translations: { vi: 'Hướng dẫn' },
                items: [
                  'db-test/docs/engines',
                  'db-test/docs/schema',
                  'db-test/docs/sql-server-database-projects',
                  'db-test/docs/shape-guard',
                  'db-test/docs/cleanup',
                  'db-test/docs/queries',
                  'db-test/docs/diagnostics',
                  'db-test/docs/ci',
                ],
              },
              {
                label: 'Reference',
                translations: { vi: 'Tham khảo' },
                items: ['db-test/docs/cli'],
              },
              {
                label: 'Extending',
                translations: { vi: 'Mở rộng' },
                items: ['db-test/docs/extending/engine', 'db-test/docs/extending/schema-source'],
              },
              {
                label: 'Help',
                translations: { vi: 'Trợ giúp' },
                items: [
                  'db-test/docs/troubleshooting',
                  {
                    label: 'Changelog',
                    translations: { vi: 'Nhật ký thay đổi' },
                    link: 'https://github.com/dbaitest/db-test/blob/main/CHANGELOG.md',
                  },
                ],
              },
            ],
          },
        ]),
        // `/<project>/api/` is reserved for a generated API reference that is not part
        // of this build, so links into it cannot be validated here.
        starlightLinksValidator({ exclude: ['/*/api', '/*/api/**'] }),
      ],
    }),
  ],
});
