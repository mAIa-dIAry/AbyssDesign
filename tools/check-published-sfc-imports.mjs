import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
const publishedPrefixes = (pkg.files ?? []).map((entry) =>
  String(entry).replace(/\\/g, '/').replace(/\/$/, ''),
);

/**
 * @param {string} dir
 * @param {string[]} acc
 * @returns {string[]}
 */
function walkVueFiles(dir, acc = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);

    if (entry.isDirectory()) {
      walkVueFiles(path, acc);
    } else if (entry.name.endsWith('.vue')) {
      acc.push(path);
    }
  }

  return acc;
}

/**
 * @param {string} specifier
 * @param {string} fromFile
 * @returns {string | null}
 */
function resolveRelativeImport(specifier, fromFile) {
  const withoutQuery = specifier.split('?')[0] ?? specifier;
  const base = resolve(dirname(fromFile), withoutQuery);
  const candidates = [
    base,
    `${base}.ts`,
    `${base}.js`,
    `${base}.vue`,
    join(base, 'index.ts'),
    join(base, 'index.js'),
  ];

  return candidates.find((candidate) => existsSync(candidate)) ?? null;
}

/**
 * @param {string} absPath
 */
function toPosixFromRoot(absPath) {
  return relative(root, absPath).replace(/\\/g, '/');
}

/**
 * @param {string} relPath
 */
function isCoveredByFilesField(relPath) {
  return publishedPrefixes.some(
    (prefix) => relPath === prefix || relPath.startsWith(`${prefix}/`),
  );
}

const relativeImportPattern = /from\s+['"](\.\.?\/[^'"]+)['"]/g;
const vueFiles = walkVueFiles(join(root, 'src/components'));
const errors = [];

for (const vueFile of vueFiles) {
  const source = readFileSync(vueFile, 'utf8');
  const vueRel = toPosixFromRoot(vueFile);

  for (const match of source.matchAll(relativeImportPattern)) {
    const specifier = match[1];
    const resolved = resolveRelativeImport(specifier, vueFile);

    if (!resolved) {
      errors.push(`${vueRel} imports missing file "${specifier}"`);
      continue;
    }

    const resolvedRel = toPosixFromRoot(resolved);

    if (!isCoveredByFilesField(resolvedRel)) {
      errors.push(
        `${vueRel} imports "${specifier}" → ${resolvedRel}, which is not in package.json "files"`,
      );
    }
  }
}

const debounceDist = join(root, 'dist/utils/debounce.js');

if (!existsSync(debounceDist)) {
  errors.push(
    'dist/utils/debounce.js is missing — export debounce from src/index.ts so the lib build emits JS, not only .d.ts',
  );
}

if (errors.length > 0) {
  console.error('Published SFC import check failed:\n');
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log(
  `Published SFC import check passed (${vueFiles.length} Vue files).`,
);
