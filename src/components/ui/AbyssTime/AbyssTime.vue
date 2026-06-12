<template>
  <q-time
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    :mask="mask"
    :format24h="format24h"
    :now-btn="nowBtn"
    :dark="dark"
    :locale="resolvedLocale"
    :class="['abyss-time', $props.class]"
    :style="mergedStyle"
    v-bind="$attrs"
  >
    <slot />

    <div
      v-if="!$slots.default && showCloseButton"
      class="row items-center justify-end"
    >
      <AbyssButton :label="resolvedCloseLabel" @click="$emit('close')" />
    </div>
  </q-time>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import {
  DEFAULT_GRADIENT_COLORS,
  useGradient,
} from '@/composables/useGradient';
import AbyssButton from '@/components/ui/AbyssButton/AbyssButton.vue';

export interface AbyssTimeProps {
  modelValue?: string | null;
  mask?: string;
  format24h?: boolean;
  nowBtn?: boolean;
  dark?: boolean;
  showCloseButton?: boolean;
  closeLabel?: string;
  colors?: string[];
  locale?: {
    days: string[];
    daysShort: string[];
    months: string[];
    monthsShort: string[];
  };
  style?: string | Record<string, string>;
  class?:
    | string
    | Record<string, boolean>
    | Array<string | Record<string, boolean>>;
}

const props = withDefaults(defineProps<AbyssTimeProps>(), {
  modelValue: '',
  mask: 'HH:mm',
  format24h: true,
  nowBtn: true,
  dark: true,
  showCloseButton: true,
  closeLabel: '',
  colors: () => DEFAULT_GRADIENT_COLORS,
  style: '',
  class: '',
});

const i18n = useI18n();

const { gradientCss, setColors } = useGradient(props.colors);

watch(
  () => props.colors,
  (newColors) => setColors(newColors ?? DEFAULT_GRADIENT_COLORS),
);

const mergedStyle = computed(() => [
  props.style,
  { '--header-gradient': gradientCss.value },
]);

function toStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.map((item) => String(item));
}

const defaultLocale = computed(() => ({
  days: toStringArray(i18n.tm('ui.datePicker.days')),
  daysShort: toStringArray(i18n.tm('ui.datePicker.daysShort')),
  months: toStringArray(i18n.tm('ui.datePicker.months')),
  monthsShort: toStringArray(i18n.tm('ui.datePicker.monthsShort')),
}));

const resolvedLocale = computed(() => props.locale ?? defaultLocale.value);
const resolvedCloseLabel = computed(
  () => props.closeLabel || i18n.t('ui.datePicker.close'),
);

defineEmits<{
  'update:modelValue': [value: string | null];
  close: [];
}>();
</script>

<style scoped lang="scss">
.abyss-time {
  --border-radius: 16px;
  border-radius: var(--border-radius);
  overflow: hidden;
  box-shadow: $shadow-dialog, $shadow-frame-medium;
  background-color: transparent;
  -webkit-backdrop-filter: blur(20px);
  backdrop-filter: blur(20px);

  :deep() {
    .q-time__header {
      background: var(--header-gradient);
      position: relative;
      border-top-left-radius: var(--border-radius);
      border-top-right-radius: var(--border-radius);
      box-shadow: $shadow-frame-medium;

      &::before {
        content: '';
        position: absolute;
        inset: 0;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 0;
        border-top-left-radius: var(--border-radius);
        border-top-right-radius: var(--border-radius);
      }

      .q-time__header-label {
        position: inherit;
        z-index: 1;
      }
    }

    .q-time__main {
      background-color: rgba(black, 0.5);
      border-bottom-left-radius: var(--border-radius);
      border-bottom-right-radius: var(--border-radius);
    }

    .q-time__clock-pointer {
      --q-primary: white;
    }

    .q-time__clock-position--active {
      background-color: white;
      color: black;
      font-weight: 600;
    }

    .q-time__now-button {
      --q-primary: #{rgba(white, 0.05)};
      box-shadow: $shadow-base;
    }
  }
}
</style>

<style lang="scss">
.q-transition--abyss-dialog-jump-down-enter-active,
.q-transition--abyss-dialog-jump-down-leave-active,
.q-transition--abyss-dialog-jump-up-enter-active,
.q-transition--abyss-dialog-jump-up-leave-active {
  transition: transform var(--q-transition-duration, 0.3s)
    var(--q-transition-easing, cubic-bezier(0.215, 0.61, 0.355, 1));
}

.q-transition--abyss-dialog-jump-down-enter-active .abyss-time,
.q-transition--abyss-dialog-jump-down-leave-active .abyss-time,
.q-transition--abyss-dialog-jump-up-enter-active .abyss-time,
.q-transition--abyss-dialog-jump-up-leave-active .abyss-time {
  transition: opacity var(--q-transition-duration, 0.3s)
    var(--q-transition-easing, cubic-bezier(0.215, 0.61, 0.355, 1));
}

.q-transition--abyss-dialog-jump-down-enter-from,
.q-transition--abyss-dialog-jump-up-leave-to {
  transform: translate3d(0, -24px, 0) scale3d(0.97, 0.97, 1);
}

.q-transition--abyss-dialog-jump-down-enter-from .abyss-time,
.q-transition--abyss-dialog-jump-up-leave-to .abyss-time,
.q-transition--abyss-dialog-jump-down-leave-to .abyss-time,
.q-transition--abyss-dialog-jump-up-enter-from .abyss-time {
  opacity: 0;
}

.q-transition--abyss-dialog-jump-down-leave-to,
.q-transition--abyss-dialog-jump-up-enter-from {
  transform: translate3d(0, 16px, 0) scale3d(0.985, 0.985, 1);
}

.abyss-time-menu.q-menu {
  background: transparent;
  border-radius: 8px;
  box-shadow: none;
  overflow: visible;
}

@media (prefers-reduced-motion: reduce) {
  .q-transition--abyss-dialog-jump-down-enter-active,
  .q-transition--abyss-dialog-jump-down-leave-active,
  .q-transition--abyss-dialog-jump-up-enter-active,
  .q-transition--abyss-dialog-jump-up-leave-active,
  .q-transition--abyss-dialog-jump-down-enter-active .abyss-time,
  .q-transition--abyss-dialog-jump-down-leave-active .abyss-time,
  .q-transition--abyss-dialog-jump-up-enter-active .abyss-time,
  .q-transition--abyss-dialog-jump-up-leave-active .abyss-time {
    transition-duration: 0s;
  }
}
</style>
