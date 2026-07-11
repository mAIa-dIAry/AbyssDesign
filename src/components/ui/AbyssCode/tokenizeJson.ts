export type JsonTextTokenType =
  | 'key'
  | 'string'
  | 'number'
  | 'boolean'
  | 'null'
  | 'punctuation';

export interface JsonTextToken {
  type: JsonTextTokenType;
  text: string;
}

const JSON_TOKEN_PATTERN =
  /("(?:\\.|[^"\\])*"(?=\s*:)?)|("(?:\\.|[^"\\])*")|(-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)|(\btrue\b|\bfalse\b)|(\bnull\b)|([{}\[\],:])|(\s+)/g;

export function tokenizeJsonText(json: string): JsonTextToken[] {
  const tokens: JsonTextToken[] = [];

  for (const match of json.matchAll(JSON_TOKEN_PATTERN)) {
    const [
      ,
      keyString,
      valueString,
      numberLiteral,
      booleanLiteral,
      nullLiteral,
      punctuation,
      whitespace,
    ] = match;

    if (keyString) {
      tokens.push({ type: 'key', text: keyString });
      continue;
    }

    if (valueString) {
      tokens.push({ type: 'string', text: valueString });
      continue;
    }

    if (numberLiteral) {
      tokens.push({ type: 'number', text: numberLiteral });
      continue;
    }

    if (booleanLiteral) {
      tokens.push({ type: 'boolean', text: booleanLiteral });
      continue;
    }

    if (nullLiteral) {
      tokens.push({ type: 'null', text: nullLiteral });
      continue;
    }

    if (punctuation) {
      tokens.push({ type: 'punctuation', text: punctuation });
      continue;
    }

    if (whitespace) {
      tokens.push({ type: 'punctuation', text: whitespace });
    }
  }

  return tokens;
}
