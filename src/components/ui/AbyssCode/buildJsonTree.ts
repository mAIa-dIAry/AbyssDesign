export type JsonValueType = 'string' | 'number' | 'boolean' | 'null';
export type JsonKeyType = 'object-key' | 'array-index';

export interface JsonTreeNode {
  key: string | null;
  keyType: JsonKeyType | null;
  value: string | null;
  valueType: JsonValueType | null;
  children: JsonTreeNode[];
}

export function buildJsonTree(
  data: unknown,
  key: string | null,
  keyType: JsonKeyType | null,
): JsonTreeNode {
  if (Array.isArray(data)) {
    return {
      key,
      keyType,
      value: null,
      valueType: null,
      children: data.map((item, idx) =>
        buildJsonTree(item, String(idx), 'array-index'),
      ),
    };
  }

  if (data !== null && data !== undefined && typeof data === 'object') {
    return {
      key,
      keyType,
      value: null,
      valueType: null,
      children: Object.entries(data as Record<string, unknown>).map(([k, v]) =>
        buildJsonTree(v, k, 'object-key'),
      ),
    };
  }

  const primitive = data as string | number | boolean | null | undefined;
  let valueType: JsonValueType;
  let valueStr: string;

  if (primitive === null || primitive === undefined) {
    valueType = 'null';
    valueStr = String(primitive);
  } else if (typeof primitive === 'number') {
    valueType = 'number';
    valueStr = String(primitive);
  } else if (typeof primitive === 'boolean') {
    valueType = 'boolean';
    valueStr = String(primitive);
  } else {
    valueType = 'string';
    valueStr = `"${primitive}"`;
  }

  return { key, keyType, value: valueStr, valueType, children: [] };
}

export function buildJsonTreeRoots(data: unknown): JsonTreeNode[] {
  if (data === null || data === undefined) {
    return [];
  }

  if (Array.isArray(data)) {
    return data.map((item, idx) =>
      buildJsonTree(item, String(idx), 'array-index'),
    );
  }

  if (typeof data === 'object') {
    return Object.entries(data as Record<string, unknown>).map(([k, v]) =>
      buildJsonTree(v, k, 'object-key'),
    );
  }

  return [buildJsonTree(data, null, null)];
}

export function resolveJsonValue(value: unknown | string): unknown {
  if (typeof value !== 'string') {
    return value;
  }

  const trimmed = value.trim();

  if (!trimmed) {
    return value;
  }

  try {
    return JSON.parse(trimmed) as unknown;
  } catch {
    return value;
  }
}

export function formatJsonText(value: unknown | string): string {
  if (typeof value === 'string') {
    const trimmed = value.trim();

    if (!trimmed) {
      return '';
    }

    try {
      return JSON.stringify(JSON.parse(trimmed) as unknown, null, 2);
    } catch {
      return value;
    }
  }

  return JSON.stringify(value, null, 2);
}
