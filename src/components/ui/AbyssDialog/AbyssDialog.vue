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
      <div v-if="hasHeader" class="abyss-dialog__header">
        <AbyssTitle
          v-if="hasTitle"
          class="abyss-dialog__title"
          :icon="icon"
          :label="title"
        />
        <div v-else class="abyss-dialog__title-spacer" />

        <AbyssButton
          v-if="closeButton"
          class="abyss-dialog__close"
          :icon="closeButtonIcon"
          :aria-label="closeButtonAriaLabel"
          flat
          @click="emit('update:modelValue', false)"
        />
      </div>

      <AbyssSeparator v-if="hasHeader && (hasBody || hasFooter)" />

      <div v-if="hasBody" class="abyss-dialog__body">
        <slot />
      </div>

      <AbyssSeparator v-if="hasBody && hasFooter" />

      <div v-if="hasFooter" class="abyss-dialog__footer">
        <AbyssButtonGroup>
          <AbyssButton
            v-for="action in actions"
            :key="action.id"
            v-bind="getActionButtonProps(action)"
            @click="handleActionClick(action)"
          />
        </AbyssButtonGroup>
      </div>
    </div>
  </q-dialog>
</template>

<script setup lang="ts">
import { computed, useSlots } from 'vue';
import AbyssButton from '@/components/ui/AbyssButton/AbyssButton.vue';
import AbyssButtonGroup from '@/components/ui/AbyssButtonGroup/AbyssButtonGroup.vue';
import AbyssSeparator from '@/components/ui/AbyssSeparator/AbyssSeparator.vue';
import AbyssTitle from '@/components/ui/AbyssTitle/AbyssTitle.vue';

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
  size?: 'normal' | 'small';
  class?: AbyssDialogClass;
  disable?: boolean;
  loading?: boolean;
  percentage?: number;
  embedded?: boolean;
  toggled?: boolean;
  gradient?: boolean;
  gradientColors?: string[];
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

const hasTitle = computed(() => !!props.title);
const hasHeader = computed(() => hasTitle.value || props.closeButton);
const hasBody = computed(() => !!slots.default);
const hasFooter = computed(() => props.actions.length > 0);

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
      toggled: action.toggled,
      gradient: action.gradient,
      gradientColors: action.gradientColors,
    }).filter(([, value]) => value !== undefined),
  );
}
</script>

<style scoped lang="scss">
.abyss-dialog {
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
    gap: 12px;
    padding: 8px 16px;
  }

  &__header {
    padding-right: 8px;
  }

  &__title,
  &__title-spacer {
    flex: 1;
    min-width: 0;
  }

  &__close {
    // flex-shrink: 0;
  }

  &__body {
    min-height: 0;
    overflow: auto;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    @include scrollbar;

    :deep(p) {
      margin-bottom: 8px;

      &:last-child {
        margin-bottom: 0;
      }
    }
  }

  &__footer {
    justify-content: flex-end;
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
