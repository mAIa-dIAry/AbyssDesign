import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Normalizes a version string or release tag to `vX.Y.Z`.
 * @param {string} versionOrTag
 * @returns {string}
 */
export function normalizeReleaseTag(versionOrTag) {
  const trimmed = String(versionOrTag ?? '').trim();

  if (!trimmed) {
    return '';
  }

  const withoutPrefix = trimmed.replace(/^v/i, '');

  return `v${withoutPrefix}`;
}

/**
 * @param {string} line
 * @returns {string | null}
 */
function parseVersionFromSectionHeader(line) {
  const trimmed = line.trim();
  const bracketMatch = trimmed.match(/^##\s+\[([^\]]+)\]/);

  if (bracketMatch) {
    const versionPart = bracketMatch[1].split(/\s+/)[0]?.trim() ?? '';

    return versionPart ? normalizeReleaseTag(versionPart) : null;
  }

  const versionTagMatch = trimmed.match(/^##\s+v?([^\s]+)/i);

  if (versionTagMatch) {
    const versionPart = versionTagMatch[1]?.trim() ?? '';

    return versionPart ? normalizeReleaseTag(versionPart) : null;
  }

  return null;
}

/**
 * @param {string} line
 * @returns {boolean}
 */
function isVersionSectionHeader(line) {
  return parseVersionFromSectionHeader(line) !== null;
}

/**
 * Extracts release notes for a tag from CHANGELOG markdown text.
 * @param {string} changelogText
 * @param {string} tagName
 * @returns {string}
 */
export function extractReleaseNotesFromChangelog(changelogText, tagName) {
  const normalizedTag = normalizeReleaseTag(tagName);

  if (!normalizedTag) {
    throw new Error('Missing release tag for changelog extraction.');
  }

  const lines = changelogText.split(/\r?\n/);
  let activeSectionTag = null;
  let sectionLines = [];
  let matchedSection = null;

  function flushSection() {
    if (activeSectionTag === normalizedTag && sectionLines.length > 0) {
      matchedSection = sectionLines.join('\n').trim();
    }

    activeSectionTag = null;
    sectionLines = [];
  }

  for (const line of lines) {
    if (isVersionSectionHeader(line)) {
      flushSection();
      activeSectionTag = parseVersionFromSectionHeader(line);

      continue;
    }

    if (activeSectionTag) {
      sectionLines.push(line);
    }
  }

  flushSection();

  if (!matchedSection) {
    throw new Error(
      `Missing changelog section for ${normalizedTag}. Add a ## [${normalizedTag.replace(/^v/i, '')}] section to CHANGELOG.md.`,
    );
  }

  return matchedSection;
}

/**
 * @param {string} changelogFilePath
 * @param {string} tagName
 * @returns {string}
 */
export function extractReleaseNotesFromChangelogFile(
  changelogFilePath,
  tagName,
) {
  const changelogText = readFileSync(changelogFilePath, 'utf8');

  return extractReleaseNotesFromChangelog(changelogText, tagName);
}

function resolveTagNameFromVersion(version) {
  return version.startsWith('v') ? version : `v${version}`;
}

function readPackageVersion(packageJsonPath) {
  const packageInfo = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
  const rawVersion = String(packageInfo.version ?? '').trim();

  if (!rawVersion) {
    throw new Error('Missing version in package.json.');
  }

  return rawVersion;
}

function runCli() {
  const args = process.argv.slice(2);
  const versionFromPackage = args.includes('--version-from-package');
  const rootDir = resolve(import.meta.dirname, '..');
  const changelogPath = resolve(rootDir, 'CHANGELOG.md');
  const packageJsonPath = resolve(rootDir, 'package.json');
  const tagArg = args.find((arg) => !arg.startsWith('--'));

  const version = versionFromPackage
    ? readPackageVersion(packageJsonPath)
    : tagArg;

  if (!version) {
    throw new Error(
      'Usage: node tools/changelog.mjs <tag-or-version> | node tools/changelog.mjs --version-from-package',
    );
  }

  const tagName = resolveTagNameFromVersion(version);
  const notes = extractReleaseNotesFromChangelogFile(changelogPath, tagName);

  process.stdout.write(`${notes}\n`);
}

const isCliEntry =
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isCliEntry) {
  runCli();
}
