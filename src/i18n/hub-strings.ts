// Every user-visible string of the hub and of the chrome shared by all landing pages.
// Adding a project to projects.json means adding one entry to `hubStrings.projects`.
import type { Localized } from '../components/shared/site';

interface SiteStrings {
  skipToContent: string;
  navLabel: string;
  footerLabel: string;
  languageLabel: string;
  /** The language's own name, shown on the link that switches to it. */
  languageName: string;
  github: string;
  sponsor: string;
  footerNote: string;
  copyCode: string;
  copied: string;
  copyFailed: string;
}

export const siteStrings: Localized<SiteStrings> = {
  en: {
    skipToContent: 'Skip to content',
    navLabel: 'Main',
    footerLabel: 'Footer',
    languageLabel: 'Language',
    languageName: 'English',
    github: 'GitHub',
    sponsor: 'Sponsor',
    footerNote: 'dbaitest: open-source .NET tooling.',
    copyCode: 'Copy',
    copied: 'Copied',
    copyFailed: 'Copy failed',
  },
  vi: {
    skipToContent: 'Chuyển đến nội dung',
    navLabel: 'Điều hướng chính',
    footerLabel: 'Chân trang',
    languageLabel: 'Ngôn ngữ',
    languageName: 'Tiếng Việt',
    github: 'GitHub',
    sponsor: 'Tài trợ',
    footerNote: 'dbaitest: công cụ .NET mã nguồn mở.',
    copyCode: 'Sao chép',
    copied: 'Đã sao chép',
    copyFailed: 'Không sao chép được',
  },
};

interface ProjectStrings {
  tagline: string;
  tags: string[];
}

interface HubStrings {
  title: string;
  description: string;
  ogAlt: string;
  eyebrow: string;
  heading: string;
  intro: string;
  projectsHeading: string;
  overview: string;
  docs: string;
  release: string;
  /** Per-project card copy, keyed by the project id in projects.json. */
  projects: Record<string, ProjectStrings>;
}

export const hubStrings: Localized<HubStrings> = {
  en: {
    title: 'dbaitest: open-source .NET tooling for testing against real databases',
    description: 'Open-source .NET tooling for testing against real databases.',
    ogAlt: 'dbaitest: open-source .NET tooling for testing against real databases',
    eyebrow: 'Open source · .NET',
    heading: 'Open-source .NET tooling for testing against real databases.',
    intro: 'dbaitest builds open-source libraries for database integration testing. Every project has its own docs, in English and Vietnamese.',
    projectsHeading: 'Projects',
    overview: 'Overview',
    docs: 'Docs',
    release: 'Release',
    projects: {
      'db-test': {
        tagline: 'Database integration tests that run the same test body against SQL Server, PostgreSQL and MySQL, each in a throwaway container.',
        tags: ['SQL Server', 'PostgreSQL', 'MySQL'],
      },
    },
  },
  vi: {
    title: 'dbaitest: công cụ .NET mã nguồn mở để kiểm thử với cơ sở dữ liệu thật',
    description: 'Công cụ .NET mã nguồn mở để kiểm thử với cơ sở dữ liệu thật.',
    ogAlt: 'dbaitest: công cụ .NET mã nguồn mở để kiểm thử với cơ sở dữ liệu thật',
    eyebrow: 'Mã nguồn mở · .NET',
    heading: 'Công cụ .NET mã nguồn mở để kiểm thử với cơ sở dữ liệu thật.',
    intro: 'dbaitest phát triển các thư viện mã nguồn mở cho kiểm thử tích hợp cơ sở dữ liệu. Mỗi dự án có tài liệu riêng, bằng tiếng Anh và tiếng Việt.',
    projectsHeading: 'Dự án',
    overview: 'Giới thiệu',
    docs: 'Tài liệu',
    release: 'Bản phát hành',
    projects: {
      'db-test': {
        tagline: 'Kiểm thử tích hợp cơ sở dữ liệu: một thân test chạy trên SQL Server, PostgreSQL và MySQL, mỗi engine trong một container dùng một lần.',
        tags: ['SQL Server', 'PostgreSQL', 'MySQL'],
      },
    },
  },
};
