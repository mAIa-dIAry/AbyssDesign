<template>
  <div class="abyss-date" :class="$props.class" :style="style">
    <div class="abyss-date__body">
      <q-date
        :model-value="modelValue"
        :mask="mask"
        :today-btn="todayBtn"
        :first-day-of-week="firstDayOfWeek"
        :dark="dark"
        :locale="resolvedLocale"
        v-bind="$attrs"
        @update:model-value="$emit('update:modelValue', $event)"
      >
        <slot />
      </q-date>
    </div>

    <template v-if="!$slots.default">
      <AbyssSeparator />

      <div class="abyss-date__footer">
        <div class="abyss-date__footer-spacer"></div>
        <div class="abyss-date__footer-append">
          <slot name="footer-append">
            <AbyssButtonGroup>
              <AbyssButton
                :label="resolvedCancelLabel"
                flat
                size="medium"
                @click="handleCancel"
              />
              <AbyssButton
                :label="resolvedConfirmLabel"
                flat
                gradient
                gradient-colors="success"
                size="medium"
                @click="handleConfirm"
              />
            </AbyssButtonGroup>
          </slot>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import AbyssButton from '@/components/ui/AbyssButton/AbyssButton.vue';
import AbyssButtonGroup from '@/components/ui/AbyssButtonGroup/AbyssButtonGroup.vue';
import AbyssSeparator from '@/components/ui/AbyssSeparator/AbyssSeparator.vue';

defineOptions({
  inheritAttrs: false,
});

export interface AbyssDateProps {
  modelValue?: string | null;
  mask?: string;
  todayBtn?: boolean;
  firstDayOfWeek?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  dark?: boolean;
  cancelLabel?: string;
  confirmLabel?: string;
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
  cancelLabel: '',
  confirmLabel: '',
  style: '',
  class: '',
});

const emit = defineEmits<{
  'update:modelValue': [value: string | null];
  close: [];
  confirm: [];
}>();

const i18n = useI18n();

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
const resolvedCancelLabel = computed(
  () => props.cancelLabel || i18n.t('ui.datePicker.cancel'),
);
const resolvedConfirmLabel = computed(
  () => props.confirmLabel || i18n.t('ui.datePicker.confirm'),
);

function handleCancel() {
  emit('close');
}

function handleConfirm() {
  emit('confirm');
  emit('close');
}
</script>

<style scoped lang="scss">
@mixin abyss-date-flat-q-btn {
  box-shadow: $shadow-zero;
  background-color: transparent;
  border: 1px solid transparent;
  border-radius: var(--date-btn-radius);
  min-height: var(--date-btn-size);
  padding: calc(var(--date-btn-padding-y) - 1px)
    calc(var(--date-btn-padding-x) - 1px);
  font-size: var(--date-btn-font-size);
  line-height: var(--date-btn-line-height);
  transition: all 0.3s ease-out;

  &::before,
  &::after {
    display: none;
  }

  .q-focus-helper {
    display: none;
  }

  .q-ripple {
    opacity: 0.2;
  }

  &.q-btn--round,
  &.q-date__calendar-item {
    width: var(--date-btn-size);
    min-width: var(--date-btn-size);
    max-width: var(--date-btn-size);
    height: var(--date-btn-size);
    padding: 0;
  }

  .q-btn__content {
    line-height: var(--date-btn-line-height);
  }

  &:not(.disabled, .q-btn--disabled, .bg-primary) {
    @media (hover: hover) and (pointer: fine) {
      &:hover {
        background-color: rgba(white, 0.04);
        border-color: rgba(white, 0.08);
        box-shadow: none;
      }
    }

    &:focus-visible {
      background-color: rgba(white, 0.04);
      border-color: rgba(white, 0.08);
      box-shadow: none;
    }

    &:active {
      background-color: rgba(white, 0.03);
      border-color: rgba(white, 0.22);
      box-shadow: none;
    }
  }
}

.abyss-date {
  --date-padding: 16px;
  --border-radius: 16px;
  --date-btn-radius: 8px;
  --date-btn-padding-x: 12px;
  --date-btn-padding-y: 8px;
  --date-btn-size: 32px;
  --date-btn-font-size: 12px;
  --date-btn-line-height: 16px;

  display: inline-flex;
  flex-direction: column;
  width: fit-content;
  max-width: 100%;
  overflow: hidden;
  border-radius: var(--border-radius);
  box-shadow: $shadow-dialog, $shadow-frame-medium;
  border-bottom: 1px solid rgba(black, 0.2);
  background-color: rgba(black, 0.25);
  -webkit-backdrop-filter: blur(20px);
  backdrop-filter: blur(20px);

  &__footer {
    display: flex;
    align-items: center;
    width: 100%;
    box-sizing: border-box;
    padding: 12px var(--date-padding);
    gap: 8px;
    font-size: 18px;
    min-height: 48px;
  }

  &__footer-spacer {
    flex: 1;
    min-width: 0;
    min-height: 24px;
  }

  &__footer-append {
    display: flex;
    align-items: center;

    &:empty {
      display: none;
    }

    :deep(.abyss-button) {
      --border-radius: var(--date-btn-radius);
    }

    :deep(.abyss-button-group) {
      margin-top: -8px;
      margin-bottom: -8px;
      margin-right: -12px;
    }

    :deep(> .abyss-button) {
      margin-top: -8px;
      margin-bottom: -8px;
      margin-right: -12px;
    }
  }

  &__body {
    min-height: 0;
    width: fit-content;
    max-width: 100%;

    :deep(.q-date) {
      box-shadow: none;
      background: transparent;
      border-radius: 0;
    }

    :deep(.q-date__header) {
      background: transparent;
      border-top-left-radius: var(--border-radius);
      border-top-right-radius: var(--border-radius);
      border-bottom: 1px solid rgba(black, 0.3);
      box-shadow: 0 1px 0 rgba(white, 0.04);
    }

    :deep(.q-date__main) {
      background-color: transparent;
    }

    :deep(.bg-primary) {
      --q-primary: white;
      color: black !important;
      font-weight: 600;
      border-radius: var(--date-btn-radius);

      span {
        position: relative;
        z-index: 1;
      }
    }

    :deep(.q-date__header .q-btn:not(.abyss-button)),
    :deep(.q-date__main .q-btn:not(.abyss-button)) {
      @include abyss-date-flat-q-btn;
    }

    :deep(.q-date__main .q-btn.bg-primary.q-date__calendar-item) {
      width: var(--date-btn-size);
      min-width: var(--date-btn-size);
      max-width: var(--date-btn-size);
      height: var(--date-btn-size);
      padding: 0;
    }

    :deep(.q-date__today) {
      box-shadow: none;
      outline: 1px solid rgba(white, 0.5) !important;
      border: 2px solid transparent !important;

      &.bg-primary {
        outline: 1px solid white !important;
        border-color: black !important;
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
