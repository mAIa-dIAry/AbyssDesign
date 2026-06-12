<template>
  <AbyssCard>
    <template #content>
      <div class="debug-content">
        <AbyssDebugNode :nodes="tree" />
      </div>
    </template>
  </AbyssCard>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import AbyssCard from '@/components/ui/AbyssCard/AbyssCard.vue';
import AbyssDebugNode from './AbyssDebugNode.vue';

interface AbyssDebugProps {
  data: unknown;
}

const props = defineProps<AbyssDebugProps>();

export type ValueType = 'string' | 'number' | 'boolean' | 'null';
export type KeyType = 'object-key' | 'array-index';

export interface DebugNode {
  key: string | null;
  keyType: KeyType | null;
  value: string | null;
  valueType: ValueType | null;
  children: DebugNode[];
}

function buildTree(
  data: unknown,
  key: string | null,
  keyType: KeyType | null,
): DebugNode {
  if (Array.isArray(data)) {
    return {
      key,
      keyType,
      value: null,
      valueType: null,
      children: data.map((item, idx) =>
        buildTree(item, String(idx), 'array-index'),
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
        buildTree(v, k, 'object-key'),
      ),
    };
  }

  const primitive = data as string | number | boolean | null | undefined;
  let valueType: ValueType;
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

const tree = computed<DebugNode[]>(() => {
  const d = props.data;
  if (d === null || d === undefined) return [];

  if (Array.isArray(d)) {
    return d.map((item, idx) => buildTree(item, String(idx), 'array-index'));
  }

  if (typeof d === 'object') {
    return Object.entries(d as Record<string, unknown>).map(([k, v]) =>
      buildTree(v, k, 'object-key'),
    );
  }

  return [buildTree(d, null, null)];
});
</script>

<style scoped lang="scss">
.debug-content {
  background: #222;
  border-radius: 6px;
  padding: 16px;
  font-family: var(--font-family-mono);
  font-size: 12px;
  line-height: 20px;
}
</style>
