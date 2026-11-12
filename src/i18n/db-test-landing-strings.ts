// Every user-visible string of the db-test landing page. Claims are taken from the pinned
// release's README and CHANGELOG; the install block, the code samples and the shape guard
// message are not here, they are extracted from the README at build time.
import type { Localized } from '../components/shared/site';

interface TitledText {
  title: string;
  body: string;
}

interface Feature extends TitledText {
  /** The problem the feature answers, shown above its title. */
  problem: string;
}

interface DbTestLandingStrings {
  title: string;
  description: string;
  ogAlt: string;
  navDocs: string;
  navWhy: string;
  navExample: string;
  navHow: string;
  eyebrow: string;
  /** The h1 in parts, so one word can take the accent colour. */
  headingBefore: string;
  headingAccent: string;
  headingLine2: string;
  lead: string;
  engines: string[];
  cta: string;
  viewOnGitHub: string;
  /** Short facts under the hero buttons. */
  checks: string[];
  fanoutLabel: string;
  fanoutKind: string;
  fanoutNote: string;
  fanoutContainer: string;
  fanoutPassed: string;
  fanoutEnd: string;
  whyKicker: string;
  featuresHeading: string;
  features: Feature[];
  sampleKicker: string;
  sampleHeading: string;
  sampleIntro: string;
  sampleRegion: string;
  engineTabsLabel: string;
  engineCost: string;
  installKicker: string;
  installHeading: string;
  installNote: string;
  installRegion: string;
  /** Visible note next to the once-per-project setup block's file name. */
  runSetupCaption: string;
  runSetupRegion: string;
  stepsKicker: string;
  stepsHeading: string;
  steps: TitledText[];
  guardKicker: string;
  guardHeading: string;
  guardBody: string;
  guardLink: string;
  guardRegion: string;
  dacpacHeading: string;
  dacpacBody: string;
  dacpacLink: string;
  ctaHeading: string;
  ctaDocs: string;
  footerNuget: string;
  footerChangelog: string;
  footerLicense: string;
  footerDocs: string;
}

export const dbTestLandingStrings: Localized<DbTestLandingStrings> = {
  en: {
    title: 'db-test: database integration testing for .NET',
    description: 'A .NET library for database integration testing that runs the same test body against SQL Server, PostgreSQL and MySQL.',
    ogAlt: 'db-test: write the database test once, run it on SQL Server, PostgreSQL and MySQL',
    navDocs: 'Docs',
    navWhy: 'Why',
    navExample: 'Example',
    navHow: 'How it works',
    eyebrow: 'Database integration testing for .NET',
    headingBefore: 'Write the database test ',
    headingAccent: 'once.',
    headingLine2: 'Run it on every engine.',
    lead: 'A .NET library that runs the same test body against SQL Server, PostgreSQL and MySQL. Every run gets a throwaway database container. Nothing touches a shared, staging or production database.',
    engines: ['SQL Server', 'PostgreSQL', 'MySQL'],
    cta: 'Get started',
    viewOnGitHub: 'View on GitHub',
    checks: ['Docker running', '.NET 8 or newer', 'MIT licensed'],
    fanoutLabel: 'One CustomerTests class runs on SQL Server, PostgreSQL and MySQL, each in its own container, and the containers are removed when the run ends.',
    fanoutKind: 'abstract class',
    fanoutNote: 'written once, no engine name inside',
    fanoutContainer: 'container',
    fanoutPassed: 'passed',
    fanoutEnd: 'run ends → containers removed',
    whyKicker: 'why',
    featuresHeading: 'Every database test suite hits the same six problems. Most teams solve them by hand.',
    features: [
      {
        problem: 'Where does the test database come from?',
        title: 'A throwaway container per engine',
        body: 'Started on first use and shared by the run. The containers are removed as soon as the run ends.',
      },
      {
        problem: 'How does the schema get there?',
        title: 'Schema from files on disk',
        body: "Applied in order, with each engine's own splitting rules. A schema that only partly applies fails loudly at setup.",
      },
      {
        problem: 'A test dropped a column and the next test failed on it',
        title: 'A shape guard',
        body: 'Fails the test that dropped or re-typed a shared database object, naming the object and the change, instead of blaming the next test.',
      },
      {
        problem: "One test's rows leaked into the next",
        title: 'Cleanup between tests',
        body: 'CleanAsync() empties every table whatever the foreign keys, and resets identity counters.',
      },
      {
        problem: '"The suite is slow"',
        title: 'Per-test timings',
        body: 'Set DBAITEST_TIMING=1 to write per-test timings to a TSV file. Off by default.',
      },
      {
        problem: 'The same assertions written three times',
        title: 'One set of assertions',
        body: 'The engine sits behind one abstract class, so the same assertions are not written three times.',
      },
    ],
    sampleKicker: 'one test body, three engines',
    sampleHeading: 'Tests written once. One small class per engine.',
    sampleIntro: 'The tests are written once, in an abstract class. One small class per engine says which engine to use and where its schema lives.',
    sampleRegion: 'C# example',
    engineTabsLabel: 'Engine',
    engineCost: 'Two overrides: that is the whole cost of another engine.',
    installKicker: 'install',
    installHeading: 'The MSTest base class, plus an engine package for each database you test against.',
    installNote: 'DbAiTest.Core alone gives the harness without any test framework.',
    installRegion: 'Install commands',
    runSetupCaption: 'once per test project',
    runSetupRegion: 'C# example: once per test project',
    stepsKicker: 'how it works',
    stepsHeading: 'Four steps to a green run.',
    steps: [
      {
        title: 'Install',
        body: 'Add DbAiTest.MSTest and an engine package for each database. Docker must be running.',
      },
      {
        title: 'Point it at a schema',
        body: 'Keep your SQL files in a directory per engine and set SchemaRoot. Files are applied in the order of their paths.',
      },
      {
        title: 'Write the tests once',
        body: 'Derive from DbAiTestBase in an abstract class, then add one [TestClass] per engine.',
      },
      {
        title: 'Run dotnet test',
        body: 'Containers start on first use, the shape guard checks every test, and the containers are removed when the run ends.',
      },
    ],
    guardKicker: 'the shape guard',
    guardHeading: 'Blame the test that broke it. Not the one after.',
    guardBody: 'When a test drops or re-types a shared database object, the shape guard fails that test and names the object and the change. The tests after it are not blamed.',
    guardLink: 'How the shape guard works',
    guardRegion: 'Shape guard failure message',
    dacpacHeading: 'SQL Server database projects',
    dacpacBody:
      'A database project (SSDT or Microsoft.Build.Sql) has objects that depend on each other across folders, so no file order applies them. DbAiTest.MsSql.Dacpac deploys the built .dacpac with DacFx, in dependency order.',
    dacpacLink: 'See the sample project',
    ctaHeading: 'Stop mocking the database. Start testing it.',
    ctaDocs: 'Read the docs',
    footerNuget: 'NuGet',
    footerChangelog: 'Changelog',
    footerLicense: 'License',
    footerDocs: 'Docs',
  },
  vi: {
    title: 'db-test: kiểm thử tích hợp cơ sở dữ liệu cho .NET',
    description: 'Thư viện .NET cho kiểm thử tích hợp cơ sở dữ liệu, chạy cùng một thân test trên SQL Server, PostgreSQL và MySQL.',
    ogAlt: 'db-test: viết test cơ sở dữ liệu một lần, chạy trên SQL Server, PostgreSQL và MySQL',
    navDocs: 'Tài liệu',
    navWhy: 'Vì sao',
    navExample: 'Ví dụ',
    navHow: 'Cách hoạt động',
    eyebrow: 'Kiểm thử tích hợp cơ sở dữ liệu cho .NET',
    headingBefore: 'Viết test cơ sở dữ liệu ',
    headingAccent: 'một lần.',
    headingLine2: 'Chạy trên mọi engine.',
    lead: 'Thư viện .NET chạy cùng một thân test trên SQL Server, PostgreSQL và MySQL. Mỗi lần chạy có một container cơ sở dữ liệu dùng một lần. Không bao giờ đụng đến cơ sở dữ liệu dùng chung, staging hay production.',
    engines: ['SQL Server', 'PostgreSQL', 'MySQL'],
    cta: 'Bắt đầu',
    viewOnGitHub: 'Xem trên GitHub',
    checks: ['Docker đang chạy', '.NET 8 trở lên', 'Giấy phép MIT'],
    fanoutLabel: 'Một lớp CustomerTests chạy trên SQL Server, PostgreSQL và MySQL, mỗi engine trong container riêng, và các container được xóa khi lần chạy kết thúc.',
    fanoutKind: 'abstract class',
    fanoutNote: 'viết một lần, không có tên engine bên trong',
    fanoutContainer: 'container',
    fanoutPassed: 'đạt',
    fanoutEnd: 'chạy xong → container bị xóa',
    whyKicker: 'vì sao',
    featuresHeading: 'Bộ test cơ sở dữ liệu nào cũng gặp cùng sáu vấn đề. Phần lớn các nhóm tự giải quyết bằng tay.',
    features: [
      {
        problem: 'Cơ sở dữ liệu để test lấy từ đâu?',
        title: 'Mỗi engine một container dùng một lần',
        body: 'Khởi động ở lần dùng đầu tiên và dùng chung suốt lần chạy. Container được xóa ngay khi lần chạy kết thúc.',
      },
      {
        problem: 'Schema được đưa vào bằng cách nào?',
        title: 'Schema từ các tệp trên đĩa',
        body: 'Áp dụng theo thứ tự, với quy tắc tách câu lệnh riêng của từng engine. Schema chỉ áp dụng được một phần sẽ báo lỗi rõ ràng ngay lúc thiết lập.',
      },
      {
        problem: 'Một test xóa một cột và test sau thất bại vì nó',
        title: 'Shape guard',
        body: 'Đánh thất bại đúng test đã xóa hoặc đổi kiểu một đối tượng cơ sở dữ liệu dùng chung, nêu rõ đối tượng và thay đổi, thay vì đổ lỗi cho test chạy sau.',
      },
      {
        problem: 'Dữ liệu của test này rò sang test sau',
        title: 'Dọn dữ liệu giữa các test',
        body: 'CleanAsync() làm rỗng mọi bảng bất kể khóa ngoại, và đặt lại bộ đếm identity.',
      },
      {
        problem: '"Bộ test chạy chậm"',
        title: 'Thời gian chạy từng test',
        body: 'Đặt DBAITEST_TIMING=1 để ghi thời gian từng test vào tệp TSV. Mặc định tắt.',
      },
      {
        problem: 'Cùng các assertion phải viết ba lần',
        title: 'Một bộ assertion',
        body: 'Engine nằm sau một abstract class, nên không phải viết cùng các assertion ba lần.',
      },
    ],
    sampleKicker: 'một thân test, ba engine',
    sampleHeading: 'Viết test một lần. Mỗi engine một lớp nhỏ.',
    sampleIntro: 'Test được viết một lần trong một abstract class. Mỗi engine có một lớp nhỏ cho biết dùng engine nào và schema nằm ở đâu.',
    sampleRegion: 'Ví dụ C#',
    engineTabsLabel: 'Engine',
    engineCost: 'Hai override: đó là toàn bộ chi phí cho thêm một engine.',
    installKicker: 'cài đặt',
    installHeading: 'Lớp cơ sở (base class) cho MSTest, cùng một gói engine cho mỗi cơ sở dữ liệu bạn kiểm thử.',
    installNote: 'Chỉ cần DbAiTest.Core là có harness, không phụ thuộc framework kiểm thử nào.',
    installRegion: 'Lệnh cài đặt',
    runSetupCaption: 'một lần cho mỗi test project',
    runSetupRegion: 'Ví dụ C#: một lần cho mỗi test project',
    stepsKicker: 'cách hoạt động',
    stepsHeading: 'Bốn bước đến một lần chạy xanh.',
    steps: [
      {
        title: 'Cài đặt',
        body: 'Thêm DbAiTest.MSTest và một gói engine cho mỗi cơ sở dữ liệu. Docker phải đang chạy.',
      },
      {
        title: 'Trỏ đến schema',
        body: 'Để các tệp SQL trong một thư mục cho mỗi engine và đặt SchemaRoot. Các tệp được áp dụng theo thứ tự đường dẫn.',
      },
      {
        title: 'Viết test một lần',
        body: 'Kế thừa DbAiTestBase trong một abstract class, rồi thêm một [TestClass] cho mỗi engine.',
      },
      {
        title: 'Chạy dotnet test',
        body: 'Container khởi động ở lần dùng đầu tiên, shape guard kiểm tra mọi test, và container được xóa khi lần chạy kết thúc.',
      },
    ],
    guardKicker: 'shape guard',
    guardHeading: 'Chỉ ra test đã làm hỏng. Không đổ lỗi cho test sau.',
    guardBody: 'Khi một test xóa hoặc đổi kiểu một đối tượng cơ sở dữ liệu dùng chung, shape guard (bộ canh hình dạng schema) đánh thất bại đúng test đó, nêu rõ đối tượng và thay đổi. Các test chạy sau không bị đổ lỗi.',
    guardLink: 'Cách shape guard hoạt động',
    guardRegion: 'Thông báo lỗi của shape guard',
    dacpacHeading: 'Dự án cơ sở dữ liệu SQL Server',
    dacpacBody:
      'Một dự án cơ sở dữ liệu (SSDT hoặc Microsoft.Build.Sql) có các đối tượng phụ thuộc lẫn nhau giữa các thư mục, nên không có thứ tự tệp nào áp dụng đúng được. DbAiTest.MsSql.Dacpac triển khai tệp .dacpac đã build bằng DacFx, theo thứ tự phụ thuộc.',
    dacpacLink: 'Xem dự án mẫu',
    ctaHeading: 'Đừng mock cơ sở dữ liệu nữa. Hãy kiểm thử nó.',
    ctaDocs: 'Đọc tài liệu',
    footerNuget: 'NuGet',
    footerChangelog: 'Nhật ký thay đổi',
    footerLicense: 'Giấy phép',
    footerDocs: 'Tài liệu',
  },
};
