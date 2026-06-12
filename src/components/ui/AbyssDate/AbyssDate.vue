<template>
  <q-date
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    :mask="mask"
    :today-btn="todayBtn"
    :first-day-of-week="firstDayOfWeek"
    :dark="dark"
    :locale="resolvedLocale"
    :class="['abyss-date', $props.class]"
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
  </q-date>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import {
  DEFAULT_GRADIENT_COLORS,
  useGradient,
} from '@/composables/useGradient';
import AbyssButton from '@/components/ui/AbyssButton/AbyssButton.vue';

export interface AbyssDateProps {
  modelValue?: string | null;
  mask?: string;
  todayBtn?: boolean;
  firstDayOfWeek?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
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

const props = withDefaults(defineProps<AbyssDateProps>(), {
  modelValue: '',
  mask: 'YYYY-MM-DD',
  todayBtn: true,
  firstDayOfWeek: 1,
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
.abyss-date {
  --border-radius: 16px;
  border-radius: var(--border-radius);
  overflow: hidden;
  box-shadow: $shadow-dialog, $shadow-frame-medium;
  background-color: transparent;
  -webkit-backdrop-filter: blur(20px);
  backdrop-filter: blur(20px);

  :deep() {
    .q-date__header {
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
    }

    .q-date__main {
      background-color: rgba(black, 0.5);
      border-bottom-left-radius: var(--border-radius);
      border-bottom-right-radius: var(--border-radius);
    }

    .bg-primary {
      --q-primary: white;
      color: black !important;
      font-weight: 600;

      span {
        position: relative;
        z-index: 1;
      }
    }

    .q-btn--rectangle:not(.abyss-button) {
      border-radius: calc(var(--border-radius) / 2);
    }

    .q-date__today {
      box-shadow: none;
      outline: 1px solid rgba(white, 0.5) !important;

      &.bg-primary {
        outline: 1px solid white !important;
        border: 2px solid black !important;
      }
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

.q-transition--abyss-dialog-jump-down-enter-active .abyss-date,
.q-transition--abyss-dialog-jump-down-leave-active .abyss-date,
.q-transition--abyss-dialog-jump-up-enter-active .abyss-date,
.q-transition--abyss-dialog-jump-up-leave-active .abyss-date {
  transition: opacity var(--q-transition-duration, 0.3s)
    var(--q-transition-easing, cubic-bezier(0.215, 0.61, 0.355, 1));
}

.q-transition--abyss-dialog-jump-down-enter-from,
.q-transition--abyss-dialog-jump-up-leave-to {
  transform: translate3d(0, -24px, 0) scale3d(0.97, 0.97, 1);
}

.q-transition--abyss-dialog-jump-down-enter-from .abyss-date,
.q-transition--abyss-dialog-jump-up-leave-to .abyss-date,
.q-transition--abyss-dialog-jump-down-leave-to .abyss-date,
.q-transition--abyss-dialog-jump-up-enter-from .abyss-date {
  opacity: 0;
}

.q-transition--abyss-dialog-jump-down-leave-to,
.q-transition--abyss-dialog-jump-up-enter-from {
  transform: translate3d(0, 16px, 0) scale3d(0.985, 0.985, 1);
}

.abyss-date-menu.q-menu {
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
  .q-transition--abyss-dialog-jump-down-enter-active .abyss-date,
  .q-transition--abyss-dialog-jump-down-leave-active .abyss-date,
  .q-transition--abyss-dialog-jump-up-enter-active .abyss-date,
  .q-transition--abyss-dialog-jump-up-leave-active .abyss-date {
    transition-duration: 0s;
  }
}
</style>
