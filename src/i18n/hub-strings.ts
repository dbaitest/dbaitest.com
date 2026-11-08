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
    footerNote: 'dbaitest: công cụ .NET mã nguồn mở.',
    copyCode: 'Sao chép',
    copied: 'Đã sao chép',
    copyFailed: 'Không sao chép được',
  },
};

interface ProjectStrings {
  tagline: string;
  tags: string[];
  /** Up to three one-line selling points shown on the card. */
  highlights: string[];
}

interface TitledText {
  title: string;
  body: string;
}

interface HubStrings {
  title: string;
  description: string;
  ogAlt: string;
  eyebrow: string;
  /** The h1 in parts, so one word can take the accent colour. */
  headingBefore: string;
  headingAccent: string;
  headingAfter: string;
  headingLine2: string;
  intro: string;
  primaryCta: string;
  githubCta: string;
  runPanelLabel: string;
  runsAgainst: string;
  requirements: string;
  navProjects: string;
  projectsKicker: string;
  projectsHeading: string;
  overview: string;
  docs: string;
  source: string;
  release: string;
  previewRegion: string;
  contributeHeading: string;
  contributeBody: string;
  contributeCta: string;
  principlesKicker: string;
  principlesHeading: string;
  principles: TitledText[];
  /** Per-project card copy, keyed by the project id in projects.json. */
  projects: Record<string, ProjectStrings>;
}

export const hubStrings: Localized<HubStrings> = {
  en: {
    title: 'dbaitest: open-source .NET tooling for testing against real databases',
    description: 'Open-source .NET tooling for testing against real databases.',
    ogAlt: 'dbaitest: open-source .NET tooling for testing against real databases',
    eyebrow: 'Open source · .NET · MIT',
    headingBefore: 'Test against ',
    headingAccent: 'real',
    headingAfter: ' databases.',
    headingLine2: 'Throw the container away.',
    intro: 'dbaitest builds open-source .NET libraries for database integration testing. Real engines in Docker, nothing shared touched, docs in English and Vietnamese.',
    primaryCta: 'Browse the projects',
    githubCta: 'View on GitHub',
    runPanelLabel: 'Example dotnet test run: one test passes on PostgreSQL, SQL Server and MySQL, then the containers are removed.',
    runsAgainst: 'Runs against',
    requirements: 'Needs Docker and .NET 8 or newer',
    navProjects: 'Projects',
    projectsKicker: 'projects',
    projectsHeading: 'Libraries you can drop into a test project today.',
    overview: 'Overview',
    docs: 'Read the docs',
    source: 'Source',
    release: 'Release',
    previewRegion: 'Code preview',
    contributeHeading: 'Have a database testing pain we should solve next?',
    contributeBody: 'Ideas, issues and pull requests are welcome on GitHub.',
    contributeCta: 'Open an issue',
    principlesKicker: 'principles',
    principlesHeading: 'How every dbaitest project is built.',
    principles: [
      {
        title: 'Real engines, never fakes',
        body: 'Tests run against SQL Server, PostgreSQL and MySQL in Docker: the engines you ship on, with their real behaviour.',
      },
      {
        title: 'Nothing shared is touched',
        body: 'Every run gets throwaway containers, removed when the run ends. No shared, staging or production database is involved.',
      },
      {
        title: 'Docs in English and Vietnamese',
        body: 'Every project ships full docs in both languages, built from the pinned release so code samples never drift.',
      },
    ],
    projects: {
      'db-test': {
        tagline: 'Database integration tests that run the same test body against SQL Server, PostgreSQL and MySQL, each in a throwaway container.',
        tags: ['SQL Server', 'PostgreSQL', 'MySQL'],
        highlights: [
          'One abstract test class, one small class per engine',
          'The shape guard blames the test that reshaped the schema',
          'CleanAsync() empties every table, whatever the foreign keys',
        ],
      },
    },
  },
  vi: {
    title: 'dbaitest: công cụ .NET mã nguồn mở để kiểm thử với cơ sở dữ liệu thật',
    description: 'Công cụ .NET mã nguồn mở để kiểm thử với cơ sở dữ liệu thật.',
    ogAlt: 'dbaitest: công cụ .NET mã nguồn mở để kiểm thử với cơ sở dữ liệu thật',
    eyebrow: 'Mã nguồn mở · .NET · MIT',
    headingBefore: 'Kiểm thử với cơ sở dữ liệu ',
    headingAccent: 'thật',
    headingAfter: '.',
    headingLine2: 'Chạy xong, bỏ container đi.',
    intro: 'dbaitest phát triển các thư viện .NET mã nguồn mở cho kiểm thử tích hợp cơ sở dữ liệu. Engine thật trong Docker, không đụng đến cơ sở dữ liệu dùng chung, tài liệu bằng tiếng Anh và tiếng Việt.',
    primaryCta: 'Xem các dự án',
    githubCta: 'Xem trên GitHub',
    runPanelLabel: 'Ví dụ một lần chạy dotnet test: một test đạt trên PostgreSQL, SQL Server và MySQL, sau đó các container được xóa.',
    runsAgainst: 'Chạy trên',
    requirements: 'Cần Docker và .NET 8 trở lên',
    navProjects: 'Dự án',
    projectsKicker: 'dự án',
    projectsHeading: 'Thư viện bạn có thể thêm vào test project ngay hôm nay.',
    overview: 'Giới thiệu',
    docs: 'Đọc tài liệu',
    source: 'Mã nguồn',
    release: 'Bản phát hành',
    previewRegion: 'Xem trước mã',
    contributeHeading: 'Bạn gặp khó khăn nào khi kiểm thử cơ sở dữ liệu mà chúng tôi nên giải quyết tiếp?',
    contributeBody: 'Ý tưởng, issue và pull request đều được chào đón trên GitHub.',
    contributeCta: 'Mở một issue',
    principlesKicker: 'nguyên tắc',
    principlesHeading: 'Cách mọi dự án dbaitest được xây dựng.',
    principles: [
      {
        title: 'Engine thật, không giả lập',
        body: 'Test chạy trên SQL Server, PostgreSQL và MySQL trong Docker: đúng các engine bạn dùng thật, với hành vi thật của chúng.',
      },
      {
        title: 'Không đụng đến thứ dùng chung',
        body: 'Mỗi lần chạy có container dùng một lần, bị xóa khi lần chạy kết thúc. Không dùng đến cơ sở dữ liệu dùng chung, staging hay production.',
      },
      {
        title: 'Tài liệu tiếng Anh và tiếng Việt',
        body: 'Mỗi dự án có tài liệu đầy đủ bằng cả hai ngôn ngữ, build từ bản phát hành được ghim nên ví dụ mã không bao giờ lệch.',
      },
    ],
    projects: {
      'db-test': {
        tagline: 'Kiểm thử tích hợp cơ sở dữ liệu: một thân test chạy trên SQL Server, PostgreSQL và MySQL, mỗi engine trong một container dùng một lần.',
        tags: ['SQL Server', 'PostgreSQL', 'MySQL'],
        highlights: [
          'Một abstract class cho test, một lớp nhỏ cho mỗi engine',
          'Shape guard chỉ ra đúng test đã thay đổi hình dạng schema',
          'CleanAsync() làm rỗng mọi bảng, bất kể khóa ngoại',
        ],
      },
    },
  },
};
