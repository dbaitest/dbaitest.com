// Every user-visible string of the db-test landing page. Claims are taken from the pinned
// release's README and CHANGELOG; the install block and the code sample are not here, they
// are extracted from the README at build time.
import type { Localized } from '../components/shared/site';

interface TitledText {
  title: string;
  body: string;
}

interface DbTestLandingStrings {
  title: string;
  description: string;
  ogAlt: string;
  navDocs: string;
  eyebrow: string;
  heading: string;
  lead: string;
  enginesLabel: string;
  engines: string[];
  cta: string;
  viewOnGitHub: string;
  requirements: string;
  installHeading: string;
  installIntro: string;
  installNote: string;
  installRegion: string;
  sampleHeading: string;
  sampleIntro: string;
  sampleRegion: string;
  /** Visible line above the once-per-project setup block. */
  runSetupCaption: string;
  runSetupRegion: string;
  featuresHeading: string;
  features: TitledText[];
  stepsHeading: string;
  steps: TitledText[];
  dacpacHeading: string;
  dacpacBody: string;
  dacpacLink: string;
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
    eyebrow: 'db-test',
    heading: 'Write the database test once. Run it on every engine.',
    lead: 'A .NET library for database integration testing that runs the same test body against SQL Server, PostgreSQL and MySQL. Every run gets a throwaway database container. Nothing touches a shared, staging or production database.',
    enginesLabel: 'Supported engines',
    engines: ['SQL Server', 'PostgreSQL', 'MySQL'],
    cta: 'Get started',
    viewOnGitHub: 'View on GitHub',
    requirements: 'Needs Docker running and .NET 8 or newer.',
    installHeading: 'Install',
    installIntro: 'The MSTest base class plus an engine package for each database you test against.',
    installNote: 'DbTest.Core alone gives the harness without any test framework.',
    installRegion: 'Install commands',
    sampleHeading: 'One test body, three engines',
    sampleIntro: 'The tests are written once, in an abstract class. One small class per engine says which engine to use and where its schema lives.',
    sampleRegion: 'C# example',
    runSetupCaption: 'Once per test project',
    runSetupRegion: 'C# example: once per test project',
    featuresHeading: 'What it takes care of',
    features: [
      {
        title: 'A throwaway container per engine',
        body: 'Started on first use and shared by the run. The containers are removed as soon as the run ends.',
      },
      {
        title: 'Schema from files on disk',
        body: "Applied in order, with each engine's own splitting rules. A schema that only partly applies fails loudly at setup.",
      },
      {
        title: 'A shape guard',
        body: 'Fails the test that dropped or re-typed a shared database object, naming the object and the change, instead of blaming the next test.',
      },
      {
        title: 'Cleanup between tests',
        body: 'CleanAsync() empties every table whatever the foreign keys, and resets identity counters.',
      },
      {
        title: 'Per-test timings',
        body: 'Set DBTEST_TIMING=1 to write per-test timings to a TSV file. Off by default.',
      },
      {
        title: 'One set of assertions',
        body: 'The engine sits behind one abstract class, so the same assertions are not written three times.',
      },
    ],
    stepsHeading: 'How it works',
    steps: [
      {
        title: 'Install',
        body: 'Add DbTest.MSTest and an engine package for each database. Docker must be running.',
      },
      {
        title: 'Point it at a schema',
        body: 'Keep your SQL files in a directory per engine and set SchemaRoot. Files are applied in the order of their paths.',
      },
      {
        title: 'Write the tests once',
        body: 'Derive from DbTestBase in an abstract class, then add one [TestClass] per engine.',
      },
      {
        title: 'Run dotnet test',
        body: 'Containers start on first use, the shape guard checks every test, and the containers are removed when the run ends.',
      },
    ],
    dacpacHeading: 'SQL Server database projects',
    dacpacBody:
      'A database project (SSDT or Microsoft.Build.Sql) has objects that depend on each other across folders, so no file order applies them. DbTest.MsSql.Dacpac deploys the built .dacpac with DacFx, in dependency order.',
    dacpacLink: 'See the sample project',
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
    eyebrow: 'db-test',
    heading: 'Viết test cơ sở dữ liệu một lần. Chạy trên mọi engine.',
    lead: 'Thư viện .NET cho kiểm thử tích hợp cơ sở dữ liệu, chạy cùng một thân test trên SQL Server, PostgreSQL và MySQL. Mỗi lần chạy có một container cơ sở dữ liệu dùng một lần. Không bao giờ đụng đến cơ sở dữ liệu dùng chung, staging hay production.',
    enginesLabel: 'Các engine được hỗ trợ',
    engines: ['SQL Server', 'PostgreSQL', 'MySQL'],
    cta: 'Bắt đầu',
    viewOnGitHub: 'Xem trên GitHub',
    requirements: 'Cần Docker đang chạy và .NET 8 trở lên.',
    installHeading: 'Cài đặt',
    installIntro: 'Lớp cơ sở (base class) cho MSTest, cùng một gói engine cho mỗi cơ sở dữ liệu bạn kiểm thử.',
    installNote: 'Chỉ cần DbTest.Core là có harness, không phụ thuộc framework kiểm thử nào.',
    installRegion: 'Lệnh cài đặt',
    sampleHeading: 'Một thân test, ba engine',
    sampleIntro: 'Test được viết một lần trong một abstract class. Mỗi engine có một lớp nhỏ cho biết dùng engine nào và schema nằm ở đâu.',
    sampleRegion: 'Ví dụ C#',
    runSetupCaption: 'Một lần cho mỗi test project',
    runSetupRegion: 'Ví dụ C#: một lần cho mỗi test project',
    featuresHeading: 'db-test lo giúp bạn những gì',
    features: [
      {
        title: 'Mỗi engine một container dùng một lần',
        body: 'Khởi động ở lần dùng đầu tiên và dùng chung suốt lần chạy. Container được xóa ngay khi lần chạy kết thúc.',
      },
      {
        title: 'Schema từ các tệp trên đĩa',
        body: 'Áp dụng theo thứ tự, với quy tắc tách câu lệnh riêng của từng engine. Schema chỉ áp dụng được một phần sẽ báo lỗi rõ ràng ngay lúc thiết lập.',
      },
      {
        title: 'Shape guard',
        body: 'Đánh thất bại đúng test đã xóa hoặc đổi kiểu một đối tượng cơ sở dữ liệu dùng chung, nêu rõ đối tượng và thay đổi, thay vì đổ lỗi cho test chạy sau.',
      },
      {
        title: 'Dọn dữ liệu giữa các test',
        body: 'CleanAsync() làm rỗng mọi bảng bất kể khóa ngoại, và đặt lại bộ đếm identity.',
      },
      {
        title: 'Thời gian chạy từng test',
        body: 'Đặt DBTEST_TIMING=1 để ghi thời gian từng test vào tệp TSV. Mặc định tắt.',
      },
      {
        title: 'Một bộ assertion',
        body: 'Engine nằm sau một abstract class, nên không phải viết cùng các assertion ba lần.',
      },
    ],
    stepsHeading: 'Cách hoạt động',
    steps: [
      {
        title: 'Cài đặt',
        body: 'Thêm DbTest.MSTest và một gói engine cho mỗi cơ sở dữ liệu. Docker phải đang chạy.',
      },
      {
        title: 'Trỏ đến schema',
        body: 'Để các tệp SQL trong một thư mục cho mỗi engine và đặt SchemaRoot. Các tệp được áp dụng theo thứ tự đường dẫn.',
      },
      {
        title: 'Viết test một lần',
        body: 'Kế thừa DbTestBase trong một abstract class, rồi thêm một [TestClass] cho mỗi engine.',
      },
      {
        title: 'Chạy dotnet test',
        body: 'Container khởi động ở lần dùng đầu tiên, shape guard kiểm tra mọi test, và container được xóa khi lần chạy kết thúc.',
      },
    ],
    dacpacHeading: 'Dự án cơ sở dữ liệu SQL Server',
    dacpacBody:
      'Một dự án cơ sở dữ liệu (SSDT hoặc Microsoft.Build.Sql) có các đối tượng phụ thuộc lẫn nhau giữa các thư mục, nên không có thứ tự tệp nào áp dụng đúng được. DbTest.MsSql.Dacpac triển khai tệp .dacpac đã build bằng DacFx, theo thứ tự phụ thuộc.',
    dacpacLink: 'Xem dự án mẫu',
    footerNuget: 'NuGet',
    footerChangelog: 'Nhật ký thay đổi',
    footerLicense: 'Giấy phép',
    footerDocs: 'Tài liệu',
  },
};
