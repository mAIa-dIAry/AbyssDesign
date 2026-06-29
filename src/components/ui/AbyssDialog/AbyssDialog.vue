<template>
  <q-dialog
    :model-value="modelValue"
    transition-show="abyss-dialog-jump-down"
    transition-hide="abyss-dialog-jump-up"
    v-bind="$attrs"
    @update:model-value="emit('update:modelValue', $event)"
    @hide="emit('close')"
  >
    <div class="abyss-dialog" :class="$props.class" :style="style">
      <slot name="header">
        <div v-if="hasHeader" class="abyss-dialog__header">
          <div class="abyss-dialog__header-prepend">
            <slot name="header-prepend">
              <q-icon v-if="icon" :name="icon" />
            </slot>
          </div>
          <div class="abyss-dialog__title">
            <slot name="header">{{ title }}</slot>
          </div>
          <div class="abyss-dialog__header-append">
            <slot name="header-append">
              <AbyssButton
                v-if="closeButton"
                :icon="closeButtonIcon"
                :aria-label="closeButtonAriaLabel"
                flat
                size="medium"
                @click="emit('update:modelValue', false)"
              />
            </slot>
          </div>
        </div>
      </slot>

      <AbyssSeparator v-if="hasHeader && (hasBody || hasFooter)" />

      <div v-if="hasBody" class="abyss-dialog__body">
        <slot />
      </div>

      <AbyssSeparator v-if="hasBody && hasFooter" />

      <slot name="footer">
        <div v-if="hasFooter" class="abyss-dialog__footer">
          <div class="abyss-dialog__footer-prepend">
            <slot name="footer-prepend"></slot>
          </div>
          <div class="abyss-dialog__footer-spacer"></div>
          <div class="abyss-dialog__footer-append">
            <slot name="footer-append">
              <AbyssButtonGroup v-if="actions.length">
                <AbyssButton
                  v-for="action in actions"
                  :key="action.id"
                  v-bind="getActionButtonProps(action)"
                  @click="handleActionClick(action)"
                />
              </AbyssButtonGroup>
            </slot>
          </div>
        </div>
      </slot>
    </div>
  </q-dialog>
</template>

<script setup lang="ts">
import { computed, useSlots } from 'vue';
import AbyssButton from '@/components/ui/AbyssButton/AbyssButton.vue';
import AbyssButtonGroup from '@/components/ui/AbyssButtonGroup/AbyssButtonGroup.vue';
import AbyssSeparator from '@/components/ui/AbyssSeparator/AbyssSeparator.vue';
import type { GradientColorsInput } from '@/defines/semantic-gradients';

defineOptions({
  inheritAttrs: false,
});

type AbyssDialogClass =
  | string
  | Record<string, boolean>
  | Array<string | Record<string, boolean>>;

export interface AbyssDialogAction {
  id: string;
  label?: string;
  icon?: string;
  iconRight?: string;
  fullWidth?: boolean;
  style?: string | Record<string, string>;
  size?: 'small' | 'medium' | 'big';
  class?: AbyssDialogClass;
  disable?: boolean;
  loading?: boolean;
  percentage?: number;
  embedded?: boolean;
  flat?: boolean;
  toggled?: boolean;
  gradient?: boolean;
  gradientColors?: GradientColorsInput;
  closeOnClick?: boolean;
}

type AbyssDialogButtonBindings = Omit<AbyssDialogAction, 'id' | 'closeOnClick'>;

export interface AbyssDialogProps {
  modelValue?: boolean;
  title?: string;
  icon?: string;
  closeButton?: boolean;
  closeButtonIcon?: string;
  closeButtonAriaLabel?: string;
  actions?: AbyssDialogAction[];
  class?: AbyssDialogClass;
  style?: string | Record<string, string>;
}

const props = withDefaults(defineProps<AbyssDialogProps>(), {
  modelValue: false,
  title: '',
  icon: '',
  closeButton: false,
  closeButtonIcon: 'sym_r_close',
  closeButtonAriaLabel: 'Zamknij dialog',
  actions: () => [],
  class: '',
  style: '',
});

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  action: [action: AbyssDialogAction];
  close: [];
}>();

const slots = useSlots();

const hasHeader = computed(() => {
  return !!(
    props.title ||
    props.icon ||
    props.closeButton ||
    slots['header-prepend'] ||
    slots['header-append'] ||
    slots.header
  );
});

const hasBody = computed(() => !!slots.default);

const hasFooter = computed(() => {
  return !!(
    slots.footer ||
    slots['footer-prepend'] ||
    slots['footer-append'] ||
    props.actions.length
  );
});

function handleActionClick(action: AbyssDialogAction) {
  emit('action', action);

  if (action.closeOnClick !== false) {
    emit('update:modelValue', false);
  }
}

function getActionButtonProps(
  action: AbyssDialogAction,
): Partial<AbyssDialogButtonBindings> {
  return Object.fromEntries(
    Object.entries({
      label: action.label,
      icon: action.icon,
      iconRight: action.iconRight,
      fullWidth: action.fullWidth,
      style: action.style,
      size: action.size,
      class: action.class,
      disable: action.disable,
      loading: action.loading,
      percentage: action.percentage,
      embedded: action.embedded,
      flat: action.flat,
      toggled: action.toggled,
      gradient: action.gradient,
      gradientColors: action.gradientColors,
    }).filter(([, value]) => value !== undefined),
  );
}
</script>

<style scoped lang="scss">
.abyss-dialog {
  --dialog-padding: 16px;

  width: min(640px, calc(100vw - 32px));
  max-width: calc(100vw - 32px);
  max-height: calc(100vh - 32px);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-radius: 16px;
  box-shadow: $shadow-dialog, $shadow-frame-medium;
  border-bottom: 1px solid rgba(black, 0.2);
  background-color: rgba(black, 0.25);
  -webkit-backdrop-filter: blur(20px);
  backdrop-filter: blur(20px);

  &__header,
  &__footer {
    display: flex;
    align-items: center;
    padding: 12px var(--dialog-padding);
    gap: 8px;
    font-size: 18px;
    min-height: 48px;
  }

  &__header-prepend,
  &__header-append,
  &__footer-prepend,
  &__footer-append {
    display: flex;
    align-items: center;

    &:empty {
      display: none;
    }

    :deep(.abyss-button) {
      --border-radius: 12px;
    }
  }

  &__header-prepend {
    :deep(.q-icon) {
      font-size: 24px;
      width: 24px;
      height: 24px;
    }
  }

  &__header-append,
  &__footer-append {
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

  &__footer-prepend {
    font-size: 14px;
    line-height: 20px;
    font-weight: 400;
    opacity: 0.6;

    :deep(.abyss-button-group),
    :deep(> .abyss-button) {
      margin-top: -8px;
      margin-bottom: -8px;
      margin-left: -12px;
      opacity: 1;
    }
  }

  &__title,
  &__footer-spacer {
    flex: 1;
    min-width: 0;
    min-height: 24px;
  }

  &__title {
    font-weight: 500;
    line-height: 24px;
  }

  &__body {
    min-height: 0;
    overflow: auto;
    padding: var(--dialog-padding);
    display: flex;
    flex-direction: column;
    gap: 12px;
    font-size: 14px;
    line-height: 20px;
    @include scrollbar;

    :slotted(form) {
      display: flex;
      flex-direction: column;
      gap: 12px;
      width: 100%;
      min-width: 0;
    }

    :deep(p) {
      margin-bottom: 8px;

      &:last-child {
        margin-bottom: 0;
      }
    }
  }

  &--compact {
    width: min(312px, calc(100vw - 32px));

    .abyss-dialog__body {
      align-items: center;
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

.q-transition--abyss-dialog-jump-down-enter-active .abyss-dialog,
.q-transition--abyss-dialog-jump-down-leave-active .abyss-dialog,
.q-transition--abyss-dialog-jump-up-enter-active .abyss-dialog,
.q-transition--abyss-dialog-jump-up-leave-active .abyss-dialog {
  transition: opacity var(--q-transition-duration, 0.3s)
    var(--q-transition-easing, cubic-bezier(0.215, 0.61, 0.355, 1));
}

.q-transition--abyss-dialog-jump-down-enter-from,
.q-transition--abyss-dialog-jump-up-leave-to {
  transform: translate3d(0, -24px, 0) scale3d(0.97, 0.97, 1);
}

.q-transition--abyss-dialog-jump-down-enter-from .abyss-dialog,
.q-transition--abyss-dialog-jump-up-leave-to .abyss-dialog,
.q-transition--abyss-dialog-jump-down-leave-to .abyss-dialog,
.q-transition--abyss-dialog-jump-up-enter-from .abyss-dialog {
  opacity: 0;
}

.q-transition--abyss-dialog-jump-down-leave-to,
.q-transition--abyss-dialog-jump-up-enter-from {
  transform: translate3d(0, 16px, 0) scale3d(0.985, 0.985, 1);
}

@media (prefers-reduced-motion: reduce) {
  .q-transition--abyss-dialog-jump-down-enter-active,
  .q-transition--abyss-dialog-jump-down-leave-active,
  .q-transition--abyss-dialog-jump-up-enter-active,
  .q-transition--abyss-dialog-jump-up-leave-active {
    transition-duration: 0s;
  }

  .q-transition--abyss-dialog-jump-down-enter-active .abyss-dialog,
  .q-transition--abyss-dialog-jump-down-leave-active .abyss-dialog,
  .q-transition--abyss-dialog-jump-up-enter-active .abyss-dialog,
  .q-transition--abyss-dialog-jump-up-leave-active .abyss-dialog {
    transition-duration: 0s;
  }
}
</style>
