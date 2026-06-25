<template>
  <nav
    class="abyss-navigation"
    :class="`abyss-navigation--${device}`"
    :style="screenRadius ? { '--screen-radius': screenRadius } : undefined"
  >
    <slot />
  </nav>
</template>

<script setup lang="ts">
import { computed, provide } from 'vue';
import { NAVIGATION_CURRENT_ROUTE_KEY } from './navigationContext';

export interface AbyssNavigationProps {
  device?: 'desktop' | 'mobile';
  currentRoute?: string;
  screenRadius?: string;
}

const props = withDefaults(defineProps<AbyssNavigationProps>(), {
  device: 'desktop',
  currentRoute: '',
  screenRadius: '',
});

provide(
  NAVIGATION_CURRENT_ROUTE_KEY,
  computed(() => props.currentRoute),
);
</script>

<style scoped lang="scss">
.abyss-navigation {
  --screen-radius: 12px;
  --outer-padding-offset: 0px;
  display: flex;
  gap: 4px;

  :deep(.abyss-button.size-big) {
    --font-size: 10px;
    --icon-size: 36px;
    --padding-y: 7px;
    --padding-x: 8px;
    --nav-button-content-gap: 2px;
    --nav-button-label-line-height: 1.2;
    --nav-button-min-height: calc(
      var(--padding-y) * 2 + var(--icon-size) + var(--nav-button-content-gap) +
        var(--font-size) * var(--nav-button-label-line-height)
    );
    min-width: 0;
    min-height: var(--nav-button-min-height);
    height: auto;
    line-height: var(--nav-button-label-line-height);

    .q-btn__content {
      flex-direction: column;
      gap: var(--nav-button-content-gap);
      align-items: center;
    }

    &[role='progressbar'] {
      min-height: var(--nav-button-min-height);

      .q-btn__content {
        inset: 0;
        justify-content: center;
      }
    }

    .q-icon {
      &.on-left {
        margin-right: 0;
      }

      &.on-right {
        margin-left: 0;
      }
    }
  }

  &--desktop {
    flex-direction: column;

    :deep(.abyss-button.size-big) {
      width: 100%;
    }
  }

  &--mobile {
    flex-direction: row;
    gap: 0px;

    :deep(.abyss-button.size-big) {
      flex: 1;
      --icon-size: 28px;

      &:first-child {
        --border-bottom-left-radius: var(--screen-radius, var(--border-radius));
      }

      &:last-child {
        --border-bottom-right-radius: var(
          --screen-radius,
          var(--border-radius)
        );
      }
    }
  }
}
</style>
