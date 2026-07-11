const NOTE_ALLOWED_TAGS = new Set([
  'B',
  'BR',
  'EM',
  'I',
  'LI',
  'OL',
  'P',
  'S',
  'STRIKE',
  'STRONG',
  'U',
  'UL',
]);

const MARKDOWN_ALLOWED_TAGS = new Set([
  ...NOTE_ALLOWED_TAGS,
  'CODE',
  'H1',
  'H2',
  'H3',
  'PRE',
]);

const CHANGELOG_ALLOWED_TAGS = new Set(
  [...MARKDOWN_ALLOWED_TAGS].filter((tag) => tag !== 'BR'),
);

const BLOCKED_TAGS = new Set(['SCRIPT', 'STYLE', 'IFRAME', 'OBJECT', 'EMBED']);

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function unwrapElement(element: Element): void {
  const parent = element.parentNode;
  if (!parent) {
    return;
  }

  while (element.firstChild) {
    parent.insertBefore(element.firstChild, element);
  }

  parent.removeChild(element);
}

function removeEmptyParagraphs(root: HTMLElement): void {
  for (const paragraph of Array.from(root.querySelectorAll('p'))) {
    const text = paragraph.textContent?.replace(/\u00a0/g, '').trim() ?? '';

    if (!text) {
      paragraph.remove();
    }
  }
}

function sanitizeRoot(root: HTMLElement, allowedTags: Set<string>): void {
  for (const element of Array.from(root.querySelectorAll('*')).reverse()) {
    if (BLOCKED_TAGS.has(element.tagName)) {
      element.remove();
      continue;
    }

    for (const attribute of Array.from(element.attributes)) {
      element.removeAttribute(attribute.name);
    }

    if (!allowedTags.has(element.tagName)) {
      unwrapElement(element);
    }
  }
}

function sanitizeHtml(value: string, allowedTags: Set<string>): string {
  const trimmed = value.trim();

  if (!trimmed) {
    return '';
  }

  if (typeof DOMParser === 'undefined') {
    return plainTextToNoteHtml(trimmed);
  }

  const doc = new DOMParser().parseFromString(
    `<div>${trimmed}</div>`,
    'text/html',
  );
  const root = doc.body.firstElementChild;

  if (!(root instanceof HTMLElement)) {
    return '';
  }

  sanitizeRoot(root, allowedTags);

  return root.innerHTML.trim();
}

export function plainTextToNoteHtml(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) {
    return '';
  }

  return trimmed
    .split(/\n{2,}/)
    .map(
      (paragraph) => `<p>${escapeHtml(paragraph).replaceAll('\n', '<br>')}</p>`,
    )
    .join('');
}

export function sanitizeNoteHtml(value: string): string {
  return sanitizeHtml(value, NOTE_ALLOWED_TAGS);
}

export function sanitizeMarkdownHtml(value: string): string {
  return sanitizeHtml(value, MARKDOWN_ALLOWED_TAGS);
}

export function sanitizeChangelogHtml(value: string): string {
  const trimmed = value.trim();

  if (!trimmed) {
    return '';
  }

  if (typeof DOMParser === 'undefined') {
    return trimmed.replaceAll(/<br\s*\/?>/gi, '');
  }

  const doc = new DOMParser().parseFromString(
    `<div>${trimmed}</div>`,
    'text/html',
  );
  const root = doc.body.firstElementChild;

  if (!(root instanceof HTMLElement)) {
    return '';
  }

  sanitizeRoot(root, CHANGELOG_ALLOWED_TAGS);
  removeEmptyParagraphs(root);

  return root.innerHTML.trim();
}

export type MarkdownSanitizeMode = 'html-note' | 'html-changelog';

export function sanitizeMarkdownByMode(
  html: string,
  mode: MarkdownSanitizeMode,
): string {
  if (mode === 'html-changelog') {
    return sanitizeChangelogHtml(html);
  }

  return sanitizeMarkdownHtml(html);
}
