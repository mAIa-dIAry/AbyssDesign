<template>
  <div class="abyss-code-json">
    <div
      v-for="(guide, index) in guides"
      :key="`guide-${index}`"
      class="abyss-code-json__guide"
      :style="guideStyle(guide)"
    />
    <div
      v-for="(line, lineIndex) in lines"
      :key="lineIndex"
      class="abyss-code__line abyss-code-json__line"
    >
      <code>
        <span
          v-for="(token, tokenIndex) in line.tokens"
          :key="tokenIndex"
          :class="`abyss-code-json__token--${token.type}`"
        >
          {{ token.text }}
        </span>
      </code>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import {
  buildJsonDisplayModel,
  type JsonDisplayGuide,
} from './buildJsonLines';
import { formatJsonText } from './buildJsonTree';

interface Props {
  value: unknown | string;
}

const props = defineProps<Props>();

const formattedJson = computed(() => formatJsonText(props.value));

const displayModel = computed(() => buildJsonDisplayModel(formattedJson.value));

const lines = computed(() => displayModel.value.lines);

const guides = computed(() => displayModel.value.guides);

function guideStyle(guide: JsonDisplayGuide): Record<string, string> {
  const lineHeight = 20;
  const lineCount = guide.endLineIndex - guide.startLineIndex + 1;

  return {
    left: `calc(var(--abyss-code-indent) * ${guide.indentLevel} + 4px)`,
    top: `${guide.startLineIndex * lineHeight}px`,
    height: `${lineCount * lineHeight}px`,
  };
}
</script>

<style scoped lang="scss">
.abyss-code-json {
  position: relative;
  margin: 0;

  &__guide {
    position: absolute;
    width: 1px;
    background: color-mix(in srgb, var(--abyss-code-punctuation) 14%, transparent);
    pointer-events: none;
  }

  &__line {
    code {
      font-family: inherit;
      font-size: inherit;
      line-height: inherit;
      white-space: pre-wrap;
      word-break: break-word;
    }
  }

  &__token {
    &--key {
      color: var(--abyss-code-object-key);
    }

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

    &--punctuation {
      color: var(--abyss-code-punctuation);
    }
  }
}
</style>
