<template>
  <div class="debug-group">
    <template v-for="(node, i) in nodes" :key="i">
      <!-- Liść: klucz + wartość w kolumnach grida -->
      <template v-if="node.children.length === 0">
        <span
          v-if="node.key !== null"
          :class="['debug-key', `debug-key--${node.keyType}`]"
        >
          {{ node.key }}:
        </span>
        <span v-else />
        <span :class="['debug-value', `debug-value--${node.valueType}`]">
          {{ node.value }}
        </span>
      </template>
      <!-- Rodzic: klucz na pełną szerokość, dzieci w zagnieżdżonym gridzie -->
      <template v-else>
        <span
          v-if="node.key !== null"
          :class="[
            'debug-key',
            'debug-key--full',
            `debug-key--${node.keyType}`,
          ]"
        >
          {{ node.key }}:
        </span>
        <div class="debug-child-wrapper">
          <AbyssDebugNode :nodes="node.children" />
        </div>
      </template>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { DebugNode } from './AbyssDebug.vue';

interface Props {
  nodes: DebugNode[];
}

defineProps<Props>();
</script>

<style scoped lang="scss">
.debug-group {
  display: grid;
  grid-template-columns: max-content 1fr;
  column-gap: 6px;
  width: 100%;
}

.debug-child-wrapper {
  grid-column: 1 / -1;
  padding-left: 16px;
}

.debug-key {
  white-space: nowrap;
  align-self: start;

  &--full {
    grid-column: 1 / -1;
  }

  &--object-key {
    color: #ffffff;
  }

  &--array-index {
    color: #e5c07b;
  }
}

.debug-value {
  align-self: start;
  word-break: break-word;

  &--string {
    color: #98c379;
  }

  &--number {
    color: #61afef;
  }

  &--boolean {
    color: #c678dd;
  }

  &--null {
    color: #5c6370;
  }
}
</style>
