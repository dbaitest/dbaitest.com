// The one place that reads text out of the pinned upstream releases (cloned into .upstream/ by
// scripts/fetch-upstream.mjs) and turns it into docs/landing snippets. Pages and components
// import named snippets from here, so the English and Vietnamese pages render identical code
// and a restructured upstream fails the build with a message naming the file and the pattern,
// never an empty block or a stale copy.
import projects from '../../projects.json';
import readmeRaw from '@upstream/db-test/README.md?raw';
import workflowRaw from '@upstream/db-test/.github/workflows/ci.yml?raw';
import shopTestsRaw from '@upstream/db-test/samples/MsSqlDacpac/Sample.Database.Tests/ShopTests.cs?raw';
import testsProjectRaw from '@upstream/db-test/samples/MsSqlDacpac/Sample.Database.Tests/Sample.Database.Tests.csproj?raw';
import databaseProjectRaw from '@upstream/db-test/samples/MsSqlDacpac/Sample.Database/Sample.Database.sqlproj?raw';
import postDeploymentRaw from '@upstream/db-test/samples/MsSqlDacpac/Sample.Database/Script.PostDeployment.sql?raw';
import globalJsonRaw from '@upstream/db-test/global.json?raw';

// ---------------------------------------------------------------------------------------
// Generic helpers
// ---------------------------------------------------------------------------------------

/** Upstream text with LF line endings, plus the label used in error messages. */
export interface UpstreamText {
  readonly file: string;
  readonly text: string;
}

export function upstreamText(file: string, raw: string): UpstreamText {
  return { file, text: raw.replace(/\r\n/g, '\n') };
}

function fail(source: UpstreamText, what: string): never {
  throw new Error(
    `upstream snippet: could not find ${what} in ${source.file}. The pinned ref in projects.json may have restructured it.`,
  );
}

interface Fence {
  lang: string | null;
  body: string[];
}

/** Every fenced code block, in document order. Indented fences (inside list items) are dedented. */
function fences(text: string): Fence[] {
  const found: Fence[] = [];
  let open: { indent: string; ticks: string; fence: Fence } | null = null;
  for (const line of text.split('\n')) {
    if (open === null) {
      const start = /^( *)(`{3,})([^`]*)$/.exec(line);
      if (start) {
        const lang = start[3].trim().split(/\s+/)[0] || null;
        open = { indent: start[1], ticks: start[2], fence: { lang, body: [] } };
      }
    } else if (/^ *`{3,}[ \t]*$/.test(line) && line.trim().length >= open.ticks.length) {
      found.push(open.fence);
      open = null;
    } else {
      open.fence.body.push(line.startsWith(open.indent) ? line.slice(open.indent.length) : line);
    }
  }
  return found;
}

/**
 * The text under a level-2 heading, up to the next level-2 heading. Headings inside fenced
 * blocks are ignored. `null` selects the preamble before the first level-2 heading.
 */
export function section(source: UpstreamText, heading: string | null): UpstreamText {
  const lines = source.text.split('\n');
  let inFence = false;
  let start = heading === null ? 0 : -1;
  let end = lines.length;
  for (let i = 0; i < lines.length; i++) {
    if (/^ *`{3,}/.test(lines[i])) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;
    if (start < 0) {
      if (lines[i].trimEnd() === `## ${heading}`) start = i + 1;
    } else if (/^## /.test(lines[i])) {
      end = i;
      break;
    }
  }
  if (start < 0) fail(source, `the "## ${heading}" section`);
  return { file: `${source.file} ("${heading === null ? 'preamble' : `## ${heading}`}")`, text: lines.slice(start, end).join('\n') };
}

export interface CodeBlockQuery {
  /** Fence language; `null` selects an untagged fence. */
  lang: string | null;
  /** Position among the fences of that language. Default 0. */
  index?: number;
  /** Guard: the block must contain this text, so an inserted block cannot shift the index silently. */
  contains?: string;
}

/** The body of a fenced code block. */
export function codeBlock(source: UpstreamText, { lang, index = 0, contains }: CodeBlockQuery): string {
  const label = `${lang ?? 'untagged'} fence #${index}`;
  const block = fences(source.text).filter((fence) => fence.lang === lang)[index];
  if (!block) fail(source, `the ${label}`);
  const code = block.body.join('\n').trimEnd();
  if (contains !== undefined && !code.includes(contains)) fail(source, `the ${label} containing "${contains}"`);
  return code;
}

export type Marker = string | RegExp;

function find(text: string, marker: Marker, from: number): { index: number; end: number } | null {
  if (typeof marker === 'string') {
    const index = text.indexOf(marker, from);
    return index < 0 ? null : { index, end: index + marker.length };
  }
  const pattern = new RegExp(marker.source, marker.flags.includes('g') ? marker.flags : `${marker.flags}g`);
  pattern.lastIndex = from;
  const match = pattern.exec(text);
  return match ? { index: match.index, end: match.index + match[0].length } : null;
}

/** The text from the first `start` match to the next `end` match (excluded unless `inclusive`). */
export function regionBetween(source: UpstreamText, start: Marker, end: Marker, inclusive = false): string {
  const from = find(source.text, start, 0);
  if (!from) fail(source, `the region start ${String(start)}`);
  const to = find(source.text, end, from.end);
  if (!to) fail(source, `the region end ${String(end)} after ${String(start)}`);
  return source.text.slice(from.index, inclusive ? to.end : to.index).trimEnd();
}

/** The column-0 brace block whose first line starts with `header`, with the attribute lines above it. */
export function topLevelBlock(source: UpstreamText, header: string): string {
  const lines = source.text.split('\n');
  const at = lines.findIndex((line) => line.startsWith(header));
  if (at < 0) fail(source, `a declaration starting "${header}"`);
  const close = lines.findIndex((line, i) => i > at && line === '}');
  if (close < 0) fail(source, `the closing brace of "${header}"`);
  let first = at;
  while (first > 0 && lines[first - 1].startsWith('[')) first--;
  return lines.slice(first, close + 1).join('\n');
}

/** Removes the leading whitespace shared by every non-blank line. */
export function dedent(text: string): string {
  const indents = text
    .split('\n')
    .filter((line) => line.trim() !== '')
    .map((line) => /^ */.exec(line)![0].length);
  const common = Math.min(...indents);
  return text
    .split('\n')
    .map((line) => line.slice(common))
    .join('\n');
}

/** `{ [key]: value }` of a JSON file, pretty-printed. */
export function jsonProperty(source: UpstreamText, key: string): string {
  const parsed: Record<string, unknown> = JSON.parse(source.text);
  if (!(key in parsed)) fail(source, `the "${key}" property`);
  return JSON.stringify({ [key]: parsed[key] }, null, 2);
}

// ---------------------------------------------------------------------------------------
// db-test snippets
// ---------------------------------------------------------------------------------------

const { repo, ref } = projects['db-test'];

const readme = upstreamText('db-test README.md', readmeRaw);
const readmeSection = (heading: string | null) => section(readme, heading);

/** The README's `bash` blocks under "## Install": the packages, then the CLI tool. */
export const installCommands = codeBlock(readmeSection('Install'), { lang: 'bash', index: 0, contains: 'dotnet add package' });
export const cliInstallCommand = codeBlock(readmeSection('Install'), { lang: 'bash', index: 1, contains: 'dotnet tool install' });

/** The README's two opening C# blocks: the three-engine sample, then the once-per-project setup. */
export const engineSample = codeBlock(readmeSection(null), { lang: 'csharp', index: 0, contains: 'abstract class CustomerTests' });
export const runSetupSample = codeBlock(readmeSection(null), { lang: 'csharp', index: 1, contains: 'DbTestRun.DisposeAllAsync' });

const sample = upstreamText('db-test README.md (three-engine sample)', engineSample);
export const customerTestsClass = topLevelBlock(sample, 'public abstract class CustomerTests');
export const engineTestClasses = {
  mssql: topLevelBlock(sample, 'public sealed class MsSqlCustomerTests'),
  postgres: topLevelBlock(sample, 'public sealed class PostgresCustomerTests'),
  mysql: topLevelBlock(sample, 'public sealed class MySqlCustomerTests'),
};

const schema = readmeSection('The schema');
export const schemaStartAsync = codeBlock(schema, { lang: 'csharp', index: 0, contains: 'DbTestHarness.StartAsync' });
export const schemaCopyToOutput = codeBlock(schema, { lang: 'xml', contains: 'CopyToOutputDirectory' });
export const schemaLoaderSample = codeBlock(schema, { lang: 'csharp', index: 1, contains: 'SchemaLoader.Load' });

const shapeGuard = readmeSection('The shape guard');
export const shapeGuardMessage = codeBlock(shapeGuard, { lang: null, contains: '[ShapeGuard]' });
export const shapeGuardCheck = codeBlock(shapeGuard, { lang: 'csharp', contains: 'CheckShapeAsync' });

export const cleanAsyncCall = codeBlock(readmeSection('Cleanup'), { lang: 'csharp', contains: 'CleanAsync' });

const queries = readmeSection('Queries');
export const scalarQueries = codeBlock(queries, { lang: 'csharp', index: 0, contains: 'QueryScalarAsync' });
export const openConnectionCall = codeBlock(queries, { lang: 'csharp', index: 1, contains: 'OpenConnectionAsync' });

export const timingCommand = codeBlock(readmeSection('Diagnostics'), { lang: 'bash', contains: 'DBTEST_TIMING=1' });
export const cliCommands = codeBlock(readmeSection('The CLI'), { lang: 'bash', contains: 'dbtest engines' });

/** The README's `DacpacSchemaSource.CreateDefaultOptions` block, indented inside a list item upstream. */
export const dacpacDefaultOptions = codeBlock(readmeSection('SQL Server database projects'), {
  lang: 'csharp',
  index: 1,
  contains: 'CreateDefaultOptions',
});

/** The `integration` job of db-test's own CI workflow. */
export const integrationJob = regionBetween(
  upstreamText('db-test .github/workflows/ci.yml', workflowRaw),
  /^ {2}integration:\n/m,
  /\n\n {2}# The SQL Server database project sample/,
);

const shopTests = upstreamText('db-test samples/MsSqlDacpac ShopTests.cs', shopTestsRaw);
/** ShopTests.cs up to the schema source, with the test bodies elided (the elision line is not upstream). */
export const dacpacTestClass = `${regionBetween(shopTests, /^/, /new DacpacSchemaSource\([^;]*;/, true)}\n\n    // ... the tests ...\n}`;
export const dacpacResetMethod = dedent(
  regionBetween(shopTests, /^ {4}\/\/\/ <summary>\n {4}\/\/\/ Starts every test from the deployed state/m, /\n {4}}\n/, true),
);
export const dacpacWiring = dedent(
  regionBetween(
    upstreamText('db-test samples/MsSqlDacpac Sample.Database.Tests.csproj', testsProjectRaw),
    /^ {2}<!--\n {4}The database project\./m,
    '</Target>',
    true,
  ),
);
export const dacpacSdkPin = jsonProperty(upstreamText('db-test global.json', globalJsonRaw), 'msbuild-sdks');
export const dacpacDatabaseProject = upstreamText('db-test Sample.Database.sqlproj', databaseProjectRaw).text.trimEnd();
export const dacpacPostDeployment = upstreamText('db-test Script.PostDeployment.sql', postDeploymentRaw).text.trimEnd();
export const dacpacSampleUrl = `https://github.com/${repo}/tree/${ref}/samples/MsSqlDacpac`;
