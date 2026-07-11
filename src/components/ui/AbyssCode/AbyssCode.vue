<template>
  <div
    class="abyss-code"
    :class="[
      `abyss-code--${props.colorTheme}`,
      { 'abyss-code--no-scroll': !props.scrollable },
    ]"
    :style="themeStyle"
  >
    <AbyssCodeJson v-if="props.language === 'json'" :value="props.value" />
    <AbyssCodeAbyssJson v-else :value="props.value" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import AbyssCodeAbyssJson from './AbyssCodeAbyssJson.vue';
import AbyssCodeJson from './AbyssCodeJson.vue';
import {
  DEFAULT_ABYSS_CODE_COLOR_THEME,
  abyssCodeThemeStyle,
  type AbyssCodeColorTheme,
} from './code-themes';

export type AbyssCodeLanguage = 'json' | 'abyss-json';

export interface AbyssCodeProps {
  value: unknown | string;
  language?: AbyssCodeLanguage;
  colorTheme?: AbyssCodeColorTheme;
  /** Włącza wewnętrzny scroll bloku kodu. W `AbyssDialog` ustaw `false`. */
  scrollable?: boolean;
}

const props = withDefaults(defineProps<AbyssCodeProps>(), {
  language: 'json',
  colorTheme: DEFAULT_ABYSS_CODE_COLOR_THEME,
  scrollable: true,
});

const themeStyle = computed(() => abyssCodeThemeStyle(props.colorTheme));
</script>

<style scoped lang="scss">
.abyss-code {
  --abyss-code-indent: 16px;
  --abyss-code-line-hover: color-mix(
    in srgb,
    var(--abyss-code-punctuation) 7%,
    transparent
  );
  background: var(--abyss-code-bg);
  border-radius: 6px;
  padding: 16px;
  font-family: var(--font-family-mono);
  font-size: 12px;
  line-height: 20px;
  min-width: 0;
  overflow: auto;

  &--no-scroll {
    overflow: visible;
  }

  :deep(.abyss-code__line) {
    border-radius: 2px;
    margin-inline: -4px;
    padding-inline: 4px;

    &:hover {
      background: var(--abyss-code-line-hover);
    }
  }
}
</style>
