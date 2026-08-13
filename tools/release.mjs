import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { extractReleaseNotesFromChangelogFile } from './changelog.mjs';

const toolsDir = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(toolsDir, '..');
const shellEnvKeys = new Set(Object.keys(process.env));
const ENV_FILE_PRIORITY_KEYS = new Set(['GITHUB_TOKEN', 'GH_TOKEN']);
const tokenSourceByKey = new Map();
const packageJsonPath = resolve(rootDir, 'package.json');
const GITHUB_FETCH_RETRY_ATTEMPTS = 4;
const GITHUB_FETCH_RETRY_DELAY_MS = 1500;
const dryRun = process.argv.includes('--dry-run');
const allowDirty = process.argv.includes('--allow-dirty');
const checkGitHubAuthOnly = process.argv.includes('--check-github-auth');

function loadEnvFile(filePath) {
  if (!existsSync(filePath)) {
    return;
  }

  for (const line of readFileSync(filePath, 'utf8').split(/\r?\n/)) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith('#')) {
      continue;
    }

    const separatorIndex = trimmed.indexOf('=');

    if (separatorIndex <= 0) {
      continue;
    }

    const key = trimmed.slice(0, separatorIndex).trim();
    let value = trimmed.slice(separatorIndex + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (!ENV_FILE_PRIORITY_KEYS.has(key) && shellEnvKeys.has(key)) {
      continue;
    }

    if (ENV_FILE_PRIORITY_KEYS.has(key) && value) {
      tokenSourceByKey.set(key, filePath);
    }

    process.env[key] = value;
  }
}

for (const envFileName of ['.env', '.env.local']) {
  loadEnvFile(resolve(rootDir, envFileName));
}

function runOrThrow(command, args, cwd = rootDir, options = {}) {
  const shouldUseShell =
    process.platform === 'win32' && /(?:\.bat|\.cmd)$/i.test(command);
  const result = spawnSync(command, args, {
    cwd,
    env: process.env,
    encoding: 'utf8',
    stdio: options.captureOutput ? 'pipe' : 'inherit',
    shell: shouldUseShell,
  });

  if (result.status !== 0) {
    const output = [result.stdout, result.stderr].filter(Boolean).join('\n');

    throw new Error(
      `Command failed: ${[command, ...args].join(' ')}${output ? `\n${output.trim()}` : ''}`,
    );
  }

  return result;
}

function tryRun(command, args, cwd = rootDir) {
  const shouldUseShell =
    process.platform === 'win32' && /(?:\.bat|\.cmd)$/i.test(command);

  return spawnSync(command, args, {
    cwd,
    env: process.env,
    encoding: 'utf8',
    stdio: 'pipe',
    shell: shouldUseShell,
  });
}

function getPackageInfo() {
  return JSON.parse(readFileSync(packageJsonPath, 'utf8'));
}

function resolveVersion() {
  const rawVersion = String(getPackageInfo().version ?? '').trim();

  if (!rawVersion) {
    throw new Error('Missing version in package.json.');
  }

  return rawVersion;
}

function resolveTagName(version) {
  return version.startsWith('v') ? version : `v${version}`;
}

function ensureCleanWorkingTree() {
  const statusResult = runOrThrow('git', ['status', '--short'], rootDir, {
    captureOutput: true,
  });
  const statusOutput = statusResult.stdout.trim();

  if (statusOutput.length === 0) {
    return;
  }

  throw new Error(
    [
      'Git working tree is not clean. Commit or stash changes before running yarn release.',
      'Use node tools/release.mjs --allow-dirty only if you intentionally want to release from a dirty tree.',
      statusOutput,
    ].join('\n'),
  );
}

function getCurrentCommit() {
  return runOrThrow('git', ['rev-parse', 'HEAD'], rootDir, {
    captureOutput: true,
  }).stdout.trim();
}

function getLocalTagCommit(tagName) {
  const result = tryRun('git', ['rev-list', '-n', '1', tagName], rootDir);

  if (result.status !== 0) {
    return null;
  }

  const commit = result.stdout.trim();

  return commit.length > 0 ? commit : null;
}

function getRemoteTagCommit(tagName) {
  const result = tryRun(
    'git',
    [
      'ls-remote',
      '--tags',
      'origin',
      `refs/tags/${tagName}`,
      `refs/tags/${tagName}^{}`,
    ],
    rootDir,
  );

  if (result.status !== 0) {
    throw new Error(result.stderr.trim() || 'Unable to query remote tags.');
  }

  const lines = result.stdout
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length === 0) {
    return null;
  }

  const dereferencedLine = lines.find((line) =>
    line.endsWith(`refs/tags/${tagName}^{}`),
  );
  const selectedLine = dereferencedLine ?? lines[0];

  return selectedLine.split(/\s+/)[0] ?? null;
}

function ensureTag(tagName, currentCommit) {
  const localTagCommit = getLocalTagCommit(tagName);

  if (localTagCommit === currentCommit) {
    process.stdout.write(
      `Local tag ${tagName} already points to ${currentCommit}.\n`,
    );
  } else if (localTagCommit) {
    process.stdout.write(
      `Moving local tag ${tagName} from ${localTagCommit} to ${currentCommit}.\n`,
    );

    if (dryRun) {
      process.stdout.write(
        `Would move local git tag ${tagName} to ${currentCommit}\n`,
      );
    } else {
      runOrThrow('git', [
        'tag',
        '-f',
        '-a',
        tagName,
        '-m',
        tagName,
        currentCommit,
      ]);
    }
  } else if (dryRun) {
    process.stdout.write(
      `Would create local git tag ${tagName} on ${currentCommit}\n`,
    );
  } else {
    runOrThrow('git', ['tag', '-a', tagName, '-m', tagName, currentCommit]);
  }

  const remoteTagCommit = getRemoteTagCommit(tagName);

  if (remoteTagCommit === currentCommit) {
    process.stdout.write(
      `Remote tag ${tagName} already points to ${currentCommit}.\n`,
    );
    return;
  }

  if (remoteTagCommit) {
    process.stdout.write(
      `Moving remote tag ${tagName} from ${remoteTagCommit} to ${currentCommit}.\n`,
    );

    if (dryRun) {
      process.stdout.write(`Would force-push git tag ${tagName} to origin\n`);
    } else {
      runOrThrow('git', ['push', '--force', 'origin', tagName]);
    }

    return;
  }

  if (dryRun) {
    process.stdout.write(`Would push git tag ${tagName} to origin\n`);
  } else {
    runOrThrow('git', ['push', 'origin', tagName]);
  }
}

function resolveRepository() {
  const explicitRepository =
    process.env.RELEASE_REPOSITORY?.trim() ||
    process.env.GITHUB_REPOSITORY?.trim();

  if (explicitRepository) {
    return explicitRepository;
  }

  const remoteUrl = runOrThrow(
    'git',
    ['remote', 'get-url', 'origin'],
    rootDir,
    {
      captureOutput: true,
    },
  ).stdout.trim();
  const repositoryMatch = remoteUrl.match(
    /github\.com[:/]([^/]+\/[^/.]+)(?:\.git)?$/i,
  );

  if (!repositoryMatch?.[1]) {
    throw new Error(
      `Unable to resolve GitHub repository from origin remote: ${remoteUrl}`,
    );
  }

  return repositoryMatch[1];
}

function resolveTokenMetadata() {
  const githubToken = process.env.GITHUB_TOKEN?.trim() ?? '';
  const ghToken = process.env.GH_TOKEN?.trim() ?? '';

  if (githubToken) {
    return {
      sourceFile: tokenSourceByKey.get('GITHUB_TOKEN') ?? null,
      sourceKey: 'GITHUB_TOKEN',
      token: githubToken,
    };
  }

  if (ghToken) {
    return {
      sourceFile: tokenSourceByKey.get('GH_TOKEN') ?? null,
      sourceKey: 'GH_TOKEN',
      token: ghToken,
    };
  }

  return {
    sourceFile: null,
    sourceKey: null,
    token: '',
  };
}

function resolveToken() {
  const { token } = resolveTokenMetadata();

  if (!token) {
    throw new Error(
      [
        'Missing GITHUB_TOKEN or GH_TOKEN.',
        'Add the token to .env or .env.local in the project root (recommended).',
        'Fine-grained PAT: Contents Read and write on mAIa-dIAry/AbyssDesign.',
        'Classic PAT: repo scope for private repositories.',
      ].join('\n'),
    );
  }

  return token;
}

function formatTokenHint(token) {
  if (!token) {
    return '(missing)';
  }

  if (token.length < 8) {
    return `(invalid length: ${token.length})`;
  }

  return `${token.slice(0, 4)}...${token.slice(-4)}`;
}

function formatTokenSourceLine(metadata) {
  const sourcePath = metadata.sourceFile ?? 'process environment';
  const sourceKey = metadata.sourceKey ?? 'unknown';

  return `GitHub token: ${formatTokenHint(metadata.token)} from ${sourceKey} (${sourcePath})\n`;
}

function createGitHubReleaseAccessError(repository, responseText) {
  return [
    `GitHub token cannot manage releases in ${repository}.`,
    responseText.trim(),
    '',
    'Checklist:',
    '- Set GITHUB_TOKEN in .env.local (overrides shell variables).',
    '- Fine-grained PAT: grant repository access to mAIa-dIAry/AbyssDesign and Contents: Read and write.',
    '- Organization SSO: open token settings and Authorize for mAIa-dIAry.',
    '- Classic PAT: enable the repo scope for private repositories.',
    '',
    'Verify with: yarn release:check-github',
  ].join('\n');
}

function createGitHubAuthHeaders(token) {
  return {
    Accept: 'application/vnd.github+json',
    Authorization: `Bearer ${token}`,
    'X-GitHub-Api-Version': '2022-11-28',
  };
}

function isRetryableFetchError(error) {
  const causeCode = error?.cause?.code ?? error?.code;

  return (
    error instanceof TypeError ||
    causeCode === 'UND_ERR_SOCKET' ||
    causeCode === 'ECONNRESET' ||
    causeCode === 'ETIMEDOUT'
  );
}

async function sleep(ms) {
  await new Promise((resolveSleep) => {
    setTimeout(resolveSleep, ms);
  });
}

async function fetchWithRetry(url, options, label) {
  let lastError;

  for (let attempt = 1; attempt <= GITHUB_FETCH_RETRY_ATTEMPTS; attempt += 1) {
    try {
      return await fetch(url, options);
    } catch (error) {
      lastError = error;

      if (
        !isRetryableFetchError(error) ||
        attempt === GITHUB_FETCH_RETRY_ATTEMPTS
      ) {
        throw error;
      }

      process.stdout.write(
        `GitHub ${label} failed (${error instanceof Error ? error.message : String(error)}); retry ${attempt}/${GITHUB_FETCH_RETRY_ATTEMPTS}...\n`,
      );
      await sleep(GITHUB_FETCH_RETRY_DELAY_MS * attempt);
    }
  }

  throw lastError;
}

async function assertGitHubReleaseAccess(repository) {
  const token = resolveToken();
  const repositoryUrl = `https://api.github.com/repos/${repository}`;
  const repositoryResponse = await fetch(repositoryUrl, {
    headers: createGitHubAuthHeaders(token),
  });
  const repositoryResponseText = await repositoryResponse.text();

  if (repositoryResponse.status === 404) {
    throw new Error(
      [
        `Repository ${repository} was not found for the configured token.`,
        repositoryResponseText.trim(),
        'Ensure the token can access the repository.',
      ].join('\n'),
    );
  }

  if (!repositoryResponse.ok) {
    throw new Error(
      createGitHubReleaseAccessError(repository, repositoryResponseText),
    );
  }

  const repositoryPayload = repositoryResponseText
    ? JSON.parse(repositoryResponseText)
    : null;
  const permissions = repositoryPayload?.permissions;

  if (
    permissions &&
    permissions.push !== true &&
    permissions.admin !== true
  ) {
    throw new Error(
      [
        `GitHub token can reach ${repository}, but lacks push/admin permission required to publish releases.`,
        'Grant Contents: Read and write (fine-grained) or repo scope (classic).',
      ].join('\n'),
    );
  }

  const releasesProbeUrl = `https://api.github.com/repos/${repository}/releases?per_page=1`;
  const releasesResponse = await fetch(releasesProbeUrl, {
    headers: createGitHubAuthHeaders(token),
  });

  if (releasesResponse.status === 403) {
    const releasesResponseText = await releasesResponse.text();

    throw new Error(
      createGitHubReleaseAccessError(repository, releasesResponseText),
    );
  }

  if (!releasesResponse.ok) {
    const releasesResponseText = await releasesResponse.text();

    throw new Error(
      [
        `Unable to query releases in ${repository} (${releasesResponse.status}).`,
        releasesResponseText.trim(),
      ].join('\n'),
    );
  }

  const createProbeResponse = await fetch(
    `https://api.github.com/repos/${repository}/releases`,
    {
      body: JSON.stringify({
        draft: true,
        generate_release_notes: false,
        tag_name: '__maia_release_auth_probe__',
      }),
      headers: {
        ...createGitHubAuthHeaders(token),
        'Content-Type': 'application/json',
      },
      method: 'POST',
    },
  );
  const createProbeResponseText = await createProbeResponse.text();

  if (createProbeResponse.status === 403) {
    throw new Error(
      createGitHubReleaseAccessError(repository, createProbeResponseText),
    );
  }

  if (
    createProbeResponse.status !== 422 &&
    createProbeResponse.status !== 201
  ) {
    throw new Error(
      [
        `Unexpected GitHub release create probe status ${createProbeResponse.status} for ${repository}.`,
        createProbeResponseText.trim(),
      ].join('\n'),
    );
  }

  if (createProbeResponse.status === 201 && createProbeResponseText) {
    const probeRelease = JSON.parse(createProbeResponseText);

    if (probeRelease?.id) {
      await fetch(
        `https://api.github.com/repos/${repository}/releases/${probeRelease.id}`,
        {
          headers: createGitHubAuthHeaders(token),
          method: 'DELETE',
        },
      );
    }
  }

  process.stdout.write(
    `GitHub token can access ${repository} and create releases.\n`,
  );
}

function resolveReleaseNotes(tagName) {
  const releaseNotesFile = process.env.RELEASE_NOTES_FILE?.trim();

  if (releaseNotesFile) {
    return readFileSync(resolve(rootDir, releaseNotesFile), 'utf8').trim();
  }

  const releaseNotes = process.env.RELEASE_NOTES?.trim();

  if (releaseNotes) {
    return releaseNotes;
  }

  const changelogPath = resolve(rootDir, 'CHANGELOG.md');

  if (!existsSync(changelogPath)) {
    throw new Error(
      `Missing ${changelogPath}. Add CHANGELOG.md with a section for ${tagName} before running yarn release.`,
    );
  }

  return extractReleaseNotesFromChangelogFile(changelogPath, tagName);
}

async function githubRequest(url, options) {
  const token = resolveToken();
  const response = await fetchWithRetry(
    url,
    {
      method: options.method,
      headers: {
        ...createGitHubAuthHeaders(token),
        ...options.headers,
      },
      body: options.body,
    },
    `${options.method ?? 'GET'} ${url}`,
  );
  const responseText = await response.text();

  if (!options.expectedStatuses.includes(response.status)) {
    const repositoryMatch = url.match(/repos\/([^/]+\/[^/]+)\//);
    const repository = repositoryMatch?.[1] ?? resolveRepository();

    if (response.status === 403 && url.includes('/releases')) {
      throw new Error(createGitHubReleaseAccessError(repository, responseText));
    }

    throw new Error(
      [
        `${options.method} ${url} failed with status ${response.status}.`,
        responseText.trim(),
      ]
        .filter(Boolean)
        .join('\n'),
    );
  }

  if (responseText.length === 0) {
    return null;
  }

  const contentType = response.headers.get('content-type') ?? '';

  if (contentType.includes('application/json')) {
    return JSON.parse(responseText);
  }

  return responseText;
}

async function findReleaseByTag(repository, tagName) {
  const apiUrl = `https://api.github.com/repos/${repository}/releases/tags/${encodeURIComponent(tagName)}`;
  const token = resolveToken();
  const response = await fetchWithRetry(
    apiUrl,
    {
      headers: createGitHubAuthHeaders(token),
    },
    `get release ${tagName}`,
  );

  if (response.status === 404) {
    return null;
  }

  const responseText = await response.text();

  if (!response.ok) {
    throw new Error(
      [
        `Unable to fetch release ${tagName} from ${repository} (${response.status}).`,
        responseText.trim(),
      ]
        .join('\n'),
    );
  }

  return responseText ? JSON.parse(responseText) : null;
}

async function createOrUpdateRelease({
  repository,
  tagName,
  targetCommit,
  releaseNotes,
}) {
  const existingRelease = await findReleaseByTag(repository, tagName);
  const remoteTagCommit = getRemoteTagCommit(tagName);

  if (!existingRelease) {
    const createReleaseBody = {
      body: releaseNotes,
      draft: true,
      generate_release_notes: false,
      name: tagName,
      prerelease: false,
      tag_name: tagName,
    };

    if (!remoteTagCommit) {
      createReleaseBody.target_commitish = targetCommit;
    }

    return githubRequest(
      `https://api.github.com/repos/${repository}/releases`,
      {
        body: JSON.stringify(createReleaseBody),
        expectedStatuses: [201],
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      },
    );
  }

  return githubRequest(
    `https://api.github.com/repos/${repository}/releases/${existingRelease.id}`,
    {
      body: JSON.stringify({
        body: releaseNotes,
        draft: Boolean(existingRelease.draft),
        name: tagName,
        prerelease: false,
      }),
      expectedStatuses: [200],
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'PATCH',
    },
  );
}

async function publishDraftRelease(repository, releaseId) {
  return githubRequest(
    `https://api.github.com/repos/${repository}/releases/${releaseId}`,
    {
      body: JSON.stringify({
        draft: false,
      }),
      expectedStatuses: [200],
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'PATCH',
    },
  );
}

async function publishReleaseIfDraft(repository, tagName, release) {
  if (!release?.draft) {
    process.stdout.write(`Release ${tagName} is already published.\n`);
    return release;
  }

  process.stdout.write(`Publishing release ${tagName}\n`);

  return publishDraftRelease(repository, release.id);
}

async function publishRelease() {
  const version = resolveVersion();
  const tagName = resolveTagName(version);
  const repository = resolveRepository();
  const currentCommit = getCurrentCommit();

  if (!allowDirty) {
    ensureCleanWorkingTree();
  }

  const tokenMetadata = resolveTokenMetadata();

  if (!dryRun) {
    resolveToken();
    process.stdout.write(formatTokenSourceLine(tokenMetadata));
    await assertGitHubReleaseAccess(repository);

    if (checkGitHubAuthOnly) {
      process.stdout.write('GitHub release permissions look OK.\n');
      return;
    }
  }

  process.stdout.write(
    [`Repository: ${repository}`, `Tag: ${tagName}`, `Commit: ${currentCommit}`].join(
      '\n',
    ) + '\n',
  );

  if (dryRun) {
    ensureTag(tagName, currentCommit);
    const releaseNotes = resolveReleaseNotes(tagName);
    process.stdout.write('Release notes preview:\n');
    process.stdout.write(`${releaseNotes}\n`);
    process.stdout.write(
      'Dry run enabled. Skipping GitHub release API calls.\n',
    );
    return;
  }

  ensureTag(tagName, currentCommit);

  const releaseNotes = resolveReleaseNotes(tagName);
  const release = await createOrUpdateRelease({
    releaseNotes,
    repository,
    tagName,
    targetCommit: currentCommit,
  });

  await publishReleaseIfDraft(repository, tagName, release);

  process.stdout.write(
    `Published GitHub release ${tagName} to https://github.com/${repository}/releases/tag/${tagName}\n`,
  );
  process.stdout.write(
    'GitHub Actions will publish @maiadiary/abyss-design to npm.\n',
  );
}

await publishRelease();
