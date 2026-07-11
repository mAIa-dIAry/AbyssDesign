import { tokenizeJsonText, type JsonTextToken } from './tokenizeJson';

export interface JsonDisplayLine {
  tokens: JsonTextToken[];
}

export interface JsonDisplayGuide {
  indentLevel: number;
  startLineIndex: number;
  endLineIndex: number;
}

interface ParsedLine {
  indent: number;
  trimmed: string;
}

function parseRawLines(json: string): ParsedLine[] {
  return json.split('\n').map((raw) => {
    const leadingSpaces = raw.match(/^\s*/)?.[0]?.length ?? 0;

    return {
      indent: leadingSpaces / 2,
      trimmed: raw.trim(),
    };
  });
}

function opensBlock(trimmed: string): boolean {
  if (trimmed === '{' || trimmed === '[') {
    return true;
  }

  return /[{[]\s*$/.test(trimmed);
}

function isClosingLine(trimmed: string): boolean {
  return /^[}\]],?,?$/.test(trimmed);
}

function lineBlockDelta(trimmed: string): number {
  let delta = 0;

  for (const char of trimmed) {
    if (char === '{' || char === '[') {
      delta += 1;
    }

    if (char === '}' || char === ']') {
      delta -= 1;
    }
  }

  return delta;
}

function skipNestedBlock(lines: ParsedLine[], startIdx: number): number {
  let depth = lineBlockDelta(lines[startIdx].trimmed);
  let index = startIdx + 1;

  while (index < lines.length && depth > 0) {
    depth += lineBlockDelta(lines[index].trimmed);
    index += 1;
  }

  return index - 1;
}

function collectDirectChildIndices(
  lines: ParsedLine[],
  blockLineIndex: number,
): number[] {
  const parentIndent = lines[blockLineIndex].indent;
  const childIndent = parentIndent + 1;
  const children: number[] = [];
  let index = blockLineIndex + 1;

  while (index < lines.length) {
    const line = lines[index];

    if (line.indent <= parentIndent) {
      break;
    }

    if (line.indent === childIndent && !isClosingLine(line.trimmed)) {
      children.push(index);

      if (opensBlock(line.trimmed)) {
        index = skipNestedBlock(lines, index) + 1;
        continue;
      }
    }

    index += 1;
  }

  return children;
}

export function buildJsonDisplayGuides(json: string): JsonDisplayGuide[] {
  const lines = parseRawLines(json);
  const guides: JsonDisplayGuide[] = [];

  for (let index = 0; index < lines.length; index += 1) {
    if (!opensBlock(lines[index].trimmed)) {
      continue;
    }

    const children = collectDirectChildIndices(lines, index);

    if (children.length <= 1) {
      continue;
    }

    guides.push({
      indentLevel: lines[index].indent + 1,
      startLineIndex: children[0],
      endLineIndex: children[children.length - 1],
    });
  }

  return guides;
}

export function buildJsonDisplayLines(json: string): JsonDisplayLine[] {
  if (!json) {
    return [];
  }

  return json.split('\n').map((line) => ({
    tokens: tokenizeJsonText(line),
  }));
}

export function buildJsonDisplayModel(json: string): {
  lines: JsonDisplayLine[];
  guides: JsonDisplayGuide[];
} {
  return {
    lines: buildJsonDisplayLines(json),
    guides: buildJsonDisplayGuides(json),
  };
}
