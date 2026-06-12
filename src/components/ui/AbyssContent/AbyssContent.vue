<template>
  <div
    v-if="html"
    class="abyss-content"
    :class="rootClass"
    :style="style"
    v-bind="attrs"
    v-html="html"
  />
  <div
    v-else
    class="abyss-content"
    :class="rootClass"
    :style="style"
    v-bind="attrs"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed, useAttrs } from 'vue';

export type AbyssContentSize = 'md' | 'sm';
export type AbyssContentTone = 'default' | 'muted';
export type AbyssContentMode = 'html-note' | 'html-changelog';

export interface AbyssContentProps {
  html?: string;
  mode?: AbyssContentMode;
  size?: AbyssContentSize;
  tone?: AbyssContentTone;
  style?: string | Record<string, string>;
  class?:
    | string
    | Record<string, boolean>
    | Array<string | Record<string, boolean>>;
}

defineOptions({
  inheritAttrs: false,
});

const props = withDefaults(defineProps<AbyssContentProps>(), {
  mode: 'html-note',
  size: 'md',
  tone: 'default',
  style: '',
  class: '',
});

const attrs = useAttrs();

const rootClass = computed(() => [
  `abyss-content--${props.size}`,
  props.tone !== 'default' && `abyss-content--${props.tone}`,
  props.class,
]);
</script>

<style scoped lang="scss">
.abyss-content {
  --abyss-content-block-gap: 12px;
  --abyss-content-heading-h1-size: 24px;
  --abyss-content-heading-step: 0.25rem;
  --abyss-content-heading-h2-size: calc(
    var(--abyss-content-heading-h1-size) - var(--abyss-content-heading-step)
  );
  --abyss-content-heading-h3-size: calc(
    var(--abyss-content-heading-h2-size) - var(--abyss-content-heading-step)
  );
  --abyss-content-heading-h1-underline-width: 64px;

  @include abyss-content-container;

  &--sm {
    --abyss-content-font-size: 14px;
    --abyss-content-line-height: 20px;
  }

  &--muted {
    --abyss-content-color: rgba(white, 0.82);
  }

  :deep(p),
  :deep(ul),
  :deep(ol),
  :deep(h1),
  :deep(h2),
  :deep(h3) {
    @include abyss-content-block-spacing;
  }

  :deep(h1),
  :deep(h2),
  :deep(h3) {
    font-weight: 600;
    line-height: 1.35;
  }

  :deep(h2),
  :deep(h3) {
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }

  :deep(h1) {
    font-size: var(--abyss-content-heading-h1-size);
    color: white;
    text-transform: none;

    &::after {
      content: '';
      display: block;
      width: var(--abyss-content-heading-h1-underline-width);
      height: 1px;
      margin-top: 8px;
      background-color: currentColor;
    }
  }

  :deep(h2) {
    font-size: var(--abyss-content-heading-h2-size);
    color: rgba(white, 0.8);
  }

  :deep(ul),
  :deep(ol) {
    padding-left: var(--abyss-content-list-indent, 24px);
  }

  :deep(h3) {
    font-size: var(--abyss-content-heading-h3-size);
    font-weight: 700;
    color: rgba(white, 0.6);
  }

  :deep(code) {
    padding: 0.2em 0.4em;
    margin: 0;
    font-size: 85%;
    font-family: var(--font-family-mono);
    font-weight: 400;
    letter-spacing: normal;
    text-transform: none;
    white-space: break-spaces;
    background-color: rgba(110, 118, 129, 0.4);
    border-radius: 6px;
    box-shadow: inset 0 0 0 1px rgba(white, 0.1);
    color: inherit;
  }

  :deep(pre) {
    @include abyss-content-block-spacing;

    padding: 16px;
    overflow: auto;
    font-size: 85%;
    line-height: 1.45;
    background-color: rgba(110, 118, 129, 0.2);
    border-radius: 6px;
    white-space: pre-wrap;
    word-break: break-word;
  }

  :deep(pre code) {
    padding: 0;
    font-size: inherit;
    background-color: transparent;
    border-radius: 0;
    box-shadow: none;
  }

  :deep(strong),
  :deep(b) {
    font-weight: 600;
  }

  :deep(strong code),
  :deep(b code) {
    font-weight: 600;
  }

  :deep(em),
  :deep(i) {
    font-style: italic;
  }

  :deep(u) {
    text-decoration: underline;
  }

  :deep(s),
  :deep(strike) {
    text-decoration: line-through;
  }
}
</style>
