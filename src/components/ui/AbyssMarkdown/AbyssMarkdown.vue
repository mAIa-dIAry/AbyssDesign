<template>
  <AbyssPanel
    v-if="!props.embedded"
    class="abyss-markdown"
    v-bind="panelBindings"
  >
    <template v-if="showHeaderControls && props.showViewSwitcher" #title>
      <div class="abyss-markdown__header">
        <span v-if="props.title" class="abyss-markdown__title-text">{{
          props.title
        }}</span>
        <AbyssSwitcher
          :model-value="activeView"
          :options="viewOptions"
          class="abyss-markdown__switcher"
          @update:model-value="onViewChange"
        />
      </div>
    </template>

    <AbyssSwitcher
      v-if="!props.title && showHeaderControls && props.showViewSwitcher"
      :model-value="activeView"
      :options="viewOptions"
      class="abyss-markdown__switcher abyss-markdown__switcher--standalone"
      @update:model-value="onViewChange"
    />

    <AbyssContent
      v-if="activeView === 'preview'"
      :html="previewHtml"
      :mode="props.contentMode"
      :size="props.size"
      :tone="props.tone"
    />

    <pre v-else class="abyss-markdown__source">{{ props.source }}</pre>
  </AbyssPanel>

  <div v-else class="abyss-markdown abyss-markdown--embedded">
    <AbyssSwitcher
      v-if="showHeaderControls && props.showViewSwitcher"
      :model-value="activeView"
      :options="viewOptions"
      class="abyss-markdown__switcher abyss-markdown__switcher--standalone"
      @update:model-value="onViewChange"
    />

    <AbyssContent
      v-if="activeView === 'preview'"
      :html="previewHtml"
      :mode="props.contentMode"
      :size="props.size"
      :tone="props.tone"
    />

    <pre v-else class="abyss-markdown__source">{{ props.source }}</pre>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import AbyssContent, {
  type AbyssContentMode,
  type AbyssContentSize,
  type AbyssContentTone,
} from '@/components/ui/AbyssContent/AbyssContent.vue';
import AbyssPanel from '@/components/ui/AbyssPanel/AbyssPanel.vue';
import AbyssSwitcher, {
  type AbyssSwitcherOption,
} from '@/components/ui/AbyssSwitcher/AbyssSwitcher.vue';
import { markdownToContentHtml } from '../../../utils/markdownToHtml';

export type AbyssMarkdownView = 'preview' | 'code';

export interface AbyssMarkdownProps {
  source: string;
  modelValue?: AbyssMarkdownView;
  title?: string;
  ariaLabel?: string;
  flush?: boolean;
  /** Render bez AbyssPanel — do osadzenia w złożonych komponentach (np. ChangeLog). */
  embedded?: boolean;
  /** Ukrywa przełącznik preview/code — zostaje widok z `modelValue`. */
  showViewSwitcher?: boolean;
  contentMode?: AbyssContentMode;
  size?: AbyssContentSize;
  tone?: AbyssContentTone;
}

const props = withDefaults(defineProps<AbyssMarkdownProps>(), {
  modelValue: 'preview',
  flush: false,
  embedded: false,
  showViewSwitcher: true,
  contentMode: 'html-note',
  size: 'md',
  tone: 'default',
});

const emit = defineEmits<{
  'update:modelValue': [value: AbyssMarkdownView];
}>();

const { t } = useI18n();

const activeView = computed({
  get: () => props.modelValue,
  set: (value: AbyssMarkdownView) => {
    emit('update:modelValue', value);
  },
});

const showHeaderControls = computed(() => Boolean(props.source.trim()));

const panelBindings = computed(() => {
  const bindings: {
    title?: string;
    ariaLabel?: string;
    flush: boolean;
  } = {
    flush: props.flush,
  };

  if (props.title) {
    bindings.title = props.title;
  }

  if (props.ariaLabel) {
    bindings.ariaLabel = props.ariaLabel;
  }

  return bindings;
});

const viewOptions = computed<AbyssSwitcherOption[]>(() => [
  {
    name: 'preview',
    label: t('ui.markdown.preview'),
    icon: 'sym_r_visibility',
  },
  {
    name: 'code',
    label: t('ui.markdown.code'),
    icon: 'sym_r_code',
  },
]);

const previewHtml = computed(() =>
  markdownToContentHtml(props.source, props.contentMode),
);

function onViewChange(value: string): void {
  if (value === 'preview' || value === 'code') {
    activeView.value = value;
  }
}
</script>

<style scoped lang="scss">
.abyss-markdown {
  &__header {
    display: flex;
    flex-direction: column;
    gap: 12px;
    width: 100%;
    min-width: 0;
  }

  &__title-text {
    color: rgba(white, 0.72);
    font-family: inherit;
    font-size: 0.92rem;
    font-weight: 600;
    line-height: 1.25;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }

  &__switcher {
    align-self: flex-start;
    width: min(100%, 320px);

    &--standalone {
      margin-bottom: 4px;
    }
  }

  &--embedded {
    display: flex;
    flex-direction: column;
    gap: 12px;
    min-width: 0;
  }

  &__source {
    margin: 0;
    padding: 16px;
    overflow: auto;
    border-radius: 6px;
    background: rgba(110, 118, 129, 0.2);
    font-family: var(--font-family-mono);
    font-size: 85%;
    line-height: 1.45;
    white-space: pre-wrap;
    word-break: break-word;
    color: rgba(white, 0.88);
  }

  &--embedded &__source {
    padding: 0;
    background: transparent;
    border-radius: 0;
  }
}
</style>
