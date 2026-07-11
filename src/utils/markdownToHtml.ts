import { marked } from 'marked';

import {
  sanitizeMarkdownByMode,
  type MarkdownSanitizeMode,
} from './sanitizeHtml';

marked.use({
  gfm: true,
  breaks: false,
});

/**
 * Converts Markdown to sanitized HTML for AbyssContent preview.
 */
export function markdownToContentHtml(
  markdown: string,
  mode: MarkdownSanitizeMode = 'html-note',
): string {
  const trimmed = markdown.trim();

  if (!trimmed) {
    return '';
  }

  const html = String(marked.parse(trimmed, { async: false }));

  if (typeof DOMParser === 'undefined') {
    return html;
  }

  return sanitizeMarkdownByMode(html, mode);
}
