<template>
  <header
    class="abyss-nav-header"
    :class="[
      $props.class,
      {
        'abyss-nav-header--sticky': sticky,
        'abyss-nav-header--backdrop': backdrop,
      },
    ]"
    :style="[headerStyle, style]"
    v-bind="$attrs"
  >
    <div class="abyss-nav-header__inner">
      <div class="abyss-nav-header__leading">
        <AbyssButton
          class="abyss-nav-header__back"
          :icon="backIcon"
          :aria-label="backLabel"
          size="medium"
          flat
          embedded
          :disable="isBackDisabled"
          @click="handleBackClick"
        />

        <span
          v-if="hasTitle"
          class="abyss-nav-header__divider"
          aria-hidden="true"
        />

        <h1 v-if="hasTitle" class="abyss-nav-header__title">
          <q-icon
            v-if="icon"
            :name="icon"
            class="abyss-nav-header__title-icon"
            aria-hidden="true"
          />
          <span class="abyss-nav-header__title-text">
            <slot>{{ title }}</slot>
          </span>
        </h1>
      </div>

      <div v-if="$slots.actions" class="abyss-nav-header__actions">
        <slot name="actions" />
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed, getCurrentInstance, useSlots } from 'vue';
import AbyssButton from '@/components/ui/AbyssButton/AbyssButton.vue';

export interface AbyssNavHeaderProps {
  title?: string;
  icon?: string;
  /** Wyłącza akcję wstecz — przycisk pozostaje widoczny, ale nieaktywny. */
  backDisabled?: boolean;
  backIcon?: string;
  backLabel?: string;
  /** Przykleja nagłówek do góry kontenera przewijania. */
  sticky?: boolean;
  /** Efekt rozmycia tła (backdrop-filter). Wyłącz w slocie `top-bar` `AbyssTemplateMain`. */
  backdrop?: boolean;
  /** Wartość CSS `top` dla trybu sticky. */
  stickyTop?: string;
  style?: string | Record<string, string>;
  class?:
    | string
    | Record<string, boolean>
    | Array<string | Record<string, boolean>>;
}

const props = withDefaults(defineProps<AbyssNavHeaderProps>(), {
  title: '',
  icon: '',
  backDisabled: false,
  backIcon: 'sym_r_arrow_back',
  backLabel: 'Wstecz',
  sticky: true,
  backdrop: true,
  stickyTop: 'var(--abyss-scroll-view-content-padding-top, 0)',
  style: '',
  class: '',
});

const emit = defineEmits<{
  back: [];
}>();

const slots = useSlots();
const instance = getCurrentInstance();

const hasTitle = computed(() => Boolean(props.title?.trim() || slots.default));

const isBackDisabled = computed(() => {
  if (props.backDisabled) {
    return true;
  }

  const vnodeProps = instance?.vnode.props;
  if (!vnodeProps) {
    return true;
  }

  return !('onBack' in vnodeProps);
});

const headerStyle = computed(() => ({
  '--abyss-nav-header-top': props.stickyTop,
}));

function handleBackClick(): void {
  if (isBackDisabled.value) {
    return;
  }

  emit('back');
}
</script>

<style scoped lang="scss">
.abyss-nav-header {
  --abyss-nav-header-top: 0;
  position: relative;
  z-index: 10;
  width: 100%;
  min-width: 0;
  border-radius: 12px;
  background-color: rgba(black, 0.2);
  box-shadow: $shadow-card, $shadow-frame-medium;
  border-bottom: 1px solid rgba(black, 0.2);

  &--backdrop {
    -webkit-backdrop-filter: blur(20px);
    backdrop-filter: blur(20px);
  }

  &--sticky {
    position: sticky;
    top: var(--abyss-nav-header-top);
  }

  &__inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    padding: 8px;
  }

  &__leading {
    display: flex;
    align-items: center;
    gap: 8px;
    min-width: 0;
    flex: 1;
  }

  &__back {
    flex: none;
  }

  &__divider {
    flex: none;
    width: 4px;
    height: 16px;
    border-radius: 2px;
    background: rgba(white, 0.12);
  }

  &__title {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    min-width: 0;
    margin: 0;
    font-weight: 400;
    line-height: 24px;
    color: white;
  }

  &__title-icon {
    flex: none;
    font-size: 24px;
  }

  &__title-text {
    min-width: 0;
    font-size: 18px;
    line-height: 18px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__actions {
    display: inline-flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: flex-end;
    gap: 8px;
    flex: none;

    :deep(.abyss-button),
    :deep(.abyss-button-group .abyss-button) {
      --font-size: 12px;
      --padding-x: 16px;
      --padding-y: 12px;
      --icon-size: 16px;
      --border-radius: 6px;
      min-height: 40px;
      height: 40px;

      &.icon-only {
        min-width: 40px;
        width: 40px;
      }
    }
  }
}
</style>
