<template>
  <div class="abyss-code-node__group">
    <template v-for="(node, i) in nodes" :key="i">
      <div
        v-if="node.children.length === 0"
        class="abyss-code__line abyss-code-node__row"
      >
        <span
          v-if="node.key !== null"
          :class="['abyss-code-node__key', `abyss-code-node__key--${node.keyType}`]"
        >
          {{ node.key }}:
        </span>
        <span v-else />
        <span
          :class="['abyss-code-node__value', `abyss-code-node__value--${node.valueType}`]"
        >
          {{ node.value }}
        </span>
      </div>
      <template v-else>
        <div class="abyss-code__line abyss-code-node__row abyss-code-node__row--parent-key">
          <span
            v-if="node.key !== null"
            :class="[
              'abyss-code-node__key',
              'abyss-code-node__key--full',
              `abyss-code-node__key--${node.keyType}`,
            ]"
          >
            {{ node.key }}:
          </span>
        </div>
        <div
          class="abyss-code-node__child-wrapper"
          :class="{
            'abyss-code-node__child-wrapper--guided': node.children.length > 1,
          }"
        >
          <AbyssCodeNode :nodes="node.children" />
        </div>
      </template>
    </template>
  </div>
</template>

<script setup lang="ts">
import AbyssCodeNode from './AbyssCodeNode.vue';
import type { JsonTreeNode } from './buildJsonTree';

interface Props {
  nodes: JsonTreeNode[];
}

defineProps<Props>();
</script>

<style scoped lang="scss">
.abyss-code-node__group {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.abyss-code-node__row {
  display: grid;
  grid-template-columns: max-content 1fr;
  column-gap: 6px;
  width: 100%;

  &--parent-key {
    display: block;
  }
}

.abyss-code-node__child-wrapper {
  padding-left: var(--abyss-code-indent);
  position: relative;

  &--guided::before {
    content: '';
    position: absolute;
    left: 4px;
    top: 0;
    bottom: 0;
    width: 1px;
    background: color-mix(in srgb, var(--abyss-code-punctuation) 14%, transparent);
    pointer-events: none;
  }
}

.abyss-code-node__key {
  white-space: nowrap;
  align-self: start;

  &--object-key {
    color: var(--abyss-code-object-key);
  }

  &--array-index {
    color: var(--abyss-code-array-index);
  }
}

.abyss-code-node__value {
  align-self: start;
  word-break: break-word;

  &--string {
    color: var(--abyss-code-string);
  }

  &--number {
    color: var(--abyss-code-number);
  }

  &--boolean {
    color: var(--abyss-code-boolean);
  }

  &--null {
    color: var(--abyss-code-null);
  }
}
</style>
