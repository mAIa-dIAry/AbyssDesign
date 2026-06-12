<template>
  <div
    class="abyss-page"
    :class="[
      `device--${props.device}`,
      {
        'orientation--landscape':
          props.device === 'mobile' && props.orientation === 'landscape',
      },
      { 'no-navigation': !hasNavigation },
    ]"
    :style="props.screenRadius ? { '--screen-radius': props.screenRadius } : {}"
  >
    <div class="abyss-page__background">
      <slot name="background" />
    </div>
    <div
      class="abyss-page__background-overlay"
      :class="{ 'no-navigation': !hasNavigation }"
    ></div>
    <header v-if="props.device !== 'mobile'" class="abyss-page__app-bar">
      <div class="abyss-page__app-bar-start">
        <slot name="app-bar-start" />
      </div>
      <div class="abyss-page__app-bar-end">
        <slot name="app-bar-end" />
      </div>
    </header>
    <aside
      v-if="hasNavigation"
      class="abyss-page__navigation"
      :class="[`device--${props.device}`]"
    >
      <nav
        class="abyss-page__navigation-start"
        :class="[`device--${props.device}`]"
      >
        <slot name="navigation-start" />
      </nav>
      <div v-if="props.device !== 'mobile'" class="abyss-page__navigation-end">
        <slot name="navigation-end" />
      </div>
    </aside>
    <main class="abyss-page__content" :class="[`device--${props.device}`]">
      <div
        class="abyss-page__overflow-wrapper"
        :class="[
          `device--${props.device}`,
          { 'abyss-page__overflow-wrapper--locked': !props.contentScrollable },
        ]"
      >
        <slot name="content" />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, useSlots } from 'vue';
import { useKeyboardState } from '@/composables/useKeyboardState';

export interface AbyssPageProps {
  device: 'desktop' | 'mobile';
  orientation?: 'portrait' | 'landscape';
  screenRadius?: string;
  contentScrollable?: boolean;
}

const props = withDefaults(defineProps<AbyssPageProps>(), {
  orientation: 'portrait',
  screenRadius: '',
  contentScrollable: true,
});

const slots = useSlots();
const { isKeyboardVisible } = useKeyboardState();

const hasNavigationSlots = computed(
  () => !!slots['navigation-start'] || !!slots['navigation-end'],
);

const hasNavigation = computed(
  () =>
    hasNavigationSlots.value &&
    !(props.device === 'mobile' && isKeyboardVisible.value),
);
</script>

<style lang="scss" scoped>
.abyss-page {
  --mobile-padding: 4px;
  --safe-area-top-offset: env(safe-area-inset-top, 0px);
  --dispatch-screen-radius-start: max(
    12px,
    calc(
      var(--screen-radius, 12px) - max(
          0px,
          max(
              env(safe-area-inset-bottom, 0px),
              env(safe-area-inset-left, 0px)
            ) -
            8px
        )
    )
  );
  --dispatch-screen-radius-end: max(
    12px,
    calc(
      var(--screen-radius, 12px) - max(
          0px,
          max(
              env(safe-area-inset-bottom, 0px),
              env(safe-area-inset-right, 0px)
            ) -
            8px
        )
    )
  );
  --offset-bottom: max(8px, env(safe-area-inset-bottom, 0px));
  position: absolute;
  inset: 0;
  background: transparent;
  width: 100%;
  overflow: hidden;
  display: grid;

  &.device--desktop {
    --nav-size: 92px;
    grid-template-areas: 'app-bar app-bar' 'navigation content';
    grid-template-columns: var(--nav-size) 1fr;
    grid-template-rows: 30px 1fr;
  }

  &.device--mobile {
    --nav-size: 72px;
    grid-template-areas: 'content' 'navigation';
    grid-template-columns: 1fr;
    grid-template-rows: 1fr calc(var(--nav-size) + var(--offset-bottom));
  }

  &__background {
    position: absolute;
    inset: 0;
    z-index: 0;
  }

  &__background-overlay {
    position: absolute;
    inset: 0;
    background: rgba(black, 0.5);
    z-index: 1;
  }

  &__app-bar {
    position: relative;
    z-index: 2;
    display: flex;
    justify-content: space-between;
    align-items: stretch;
    grid-area: app-bar;
    padding-right: var(--title-bar-overlay-width, 138px);
    -webkit-app-region: drag;

    :deep(*) {
      -webkit-app-region: no-drag;
    }
  }

  &__navigation {
    position: relative;
    z-index: 2;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    grid-area: navigation;

    &.device--desktop {
      padding: 0px 8px 8px;
    }

    &.device--mobile {
      padding: 8px;
    }
  }

  &__content {
    position: relative;
    z-index: 2;
    grid-area: content;
    overflow: hidden;
    background-color: rgba(black, 0.5);

    &.device--desktop {
      width: calc(100% + 8px);
      height: calc(100% + 8px);
      padding-bottom: 8px;
      padding-right: 8px;
      border-top-left-radius: 16px;
      box-shadow: inset 0 0 8px 0 rgba(black, 0.5);
    }

    &.device--mobile {
      height: calc(100% + 20px);
      position: relative;
      mask-image:
        linear-gradient(black, black), linear-gradient(black, black),
        linear-gradient(black, black),
        radial-gradient(circle at 100% 100%, transparent 12px, black 12.5px),
        radial-gradient(circle at 0% 100%, transparent 12px, black 12.5px);
      mask-size:
        100% calc(100% - 12px),
        8px 12px,
        8px 12px,
        12px 12px,
        12px 12px;
      mask-position:
        0 0,
        0 100%,
        100% 100%,
        8px calc(100%),
        calc(100% - 8px) calc(100%);
      mask-repeat: no-repeat;
      padding-left: env(safe-area-inset-left, 0px);
      padding-right: env(safe-area-inset-right, 0px);
    }
  }

  &__navigation-start {
    height: 64px;

    &.device--mobile {
      box-shadow: 0 0px 8px 0px rgba(black, 0.5);
      padding: var(--mobile-padding);
      border-radius: calc(8px + var(--mobile-padding));
      border-bottom-left-radius: var(--dispatch-screen-radius-start);
      border-bottom-right-radius: var(--dispatch-screen-radius-end);

      &::before {
        content: '';
        position: absolute;
        inset: 8px 8px var(--offset-bottom) 8px;
        box-shadow: 0 0px 0px 9999px rgba(black, 0.5);
        border-radius: calc(8px + var(--mobile-padding));
        border-bottom-left-radius: var(--dispatch-screen-radius-start);
        border-bottom-right-radius: var(--dispatch-screen-radius-end);
        pointer-events: none;
        clip-path: inset(12px -8px calc(-8px - var(--offset-bottom)) -8px);
      }

      :deep(.abyss-navigation--mobile .abyss-button:first-child) {
        border-bottom-left-radius: calc(
          var(--dispatch-screen-radius-start) - var(--mobile-padding, 4px)
        );
      }

      :deep(.abyss-navigation--mobile .abyss-button:last-child) {
        border-bottom-right-radius: calc(
          var(--dispatch-screen-radius-end) - var(--mobile-padding, 4px)
        );
      }
    }
  }

  &__overflow-wrapper {
    width: 100%;
    height: 100%;
    overflow: auto;
    position: relative;

    &--locked {
      overflow: hidden;
    }

    &.device--desktop {
      padding: 24px;
      @include scrollbar;
    }

    &.device--mobile {
      padding: calc(var(--safe-area-top-offset) + 12px) 8px 24px;
      mask-image: linear-gradient(
        to bottom,
        transparent 0,
        rgba(0, 0, 0, 0.3) calc(var(--safe-area-top-offset) * 0.5),
        black calc(var(--safe-area-top-offset) + 12px),
        black 100%
      );
      mask-repeat: no-repeat;
      mask-size: 100% 100%;
    }
  }

  // Mobile landscape overrides — navigation moves to the right side
  &.device--mobile.orientation--landscape {
    --nav-size: 80px;
    --offset-right: max(8px, env(safe-area-inset-right, 0px));
    --offset-top: max(8px, env(safe-area-inset-top, 0px));
    --dispatch-screen-radius-start: max(
      12px,
      calc(
        var(--screen-radius, 12px) - max(
            0px,
            max(
                env(safe-area-inset-bottom, 0px),
                env(safe-area-inset-right, 0px)
              ) -
              8px
          )
      )
    );
    --dispatch-screen-radius-end: max(
      12px,
      calc(
        var(--screen-radius, 12px) - max(
            0px,
            max(
                env(safe-area-inset-top, 0px),
                env(safe-area-inset-right, 0px)
              ) -
              8px
          )
      )
    );
    grid-template-areas: 'content navigation';
    grid-template-columns: 1fr calc(var(--nav-size) + var(--offset-right));
    grid-template-rows: 1fr;

    // FIX #1: Swapped radial-gradient centers so concave curves face inward
    .abyss-page__content {
      height: 100%;
      width: calc(100% + 20px);
      mask-image:
        linear-gradient(black, black), linear-gradient(black, black),
        linear-gradient(black, black),
        radial-gradient(circle at 100% 100%, transparent 12px, black 12.5px),
        radial-gradient(circle at 100% 0%, transparent 12px, black 12.5px);
      mask-size:
        calc(100% - 12px) 100%,
        12px var(--offset-top),
        12px var(--offset-bottom),
        12px 12px,
        12px 12px;
      mask-position:
        0 0,
        100% 0,
        100% 100%,
        100% var(--offset-top),
        100% calc(100% - var(--offset-bottom));
      mask-repeat: no-repeat;
      padding-left: env(safe-area-inset-left, 0px);
      padding-right: 0;
    }

    // FIX #4: Safe area top & bottom on navigation
    .abyss-page__navigation {
      padding: var(--offset-top) 8px var(--offset-bottom) 8px;
    }

    .abyss-page__navigation-start {
      height: 100%;
      width: calc(var(--nav-size) - 8px);
      border-bottom-left-radius: calc(8px + var(--mobile-padding));
      border-bottom-right-radius: var(--dispatch-screen-radius-start);
      border-top-right-radius: var(--dispatch-screen-radius-end);

      &::before {
        inset: var(--offset-top) var(--offset-right) var(--offset-bottom) 8px;
        border-radius: calc(8px + var(--mobile-padding));
        border-top-right-radius: var(--dispatch-screen-radius-end);
        border-bottom-right-radius: var(--dispatch-screen-radius-start);
        clip-path: inset(
          calc(-1 * var(--offset-top)) calc(-1 * var(--offset-right))
            calc(-1 * var(--offset-bottom)) 12px
        );
      }

      :deep(.abyss-navigation--mobile) {
        flex-direction: column;
        height: 100%;
      }

      :deep(.abyss-navigation--mobile .abyss-button) {
        flex: 1;
      }

      :deep(.abyss-navigation--mobile .abyss-button:first-child) {
        border-bottom-left-radius: var(--border-radius);
        border-top-right-radius: calc(
          var(--dispatch-screen-radius-end) - var(--mobile-padding, 4px)
        );
      }

      :deep(.abyss-navigation--mobile .abyss-button:last-child) {
        border-bottom-right-radius: calc(
          var(--dispatch-screen-radius-start) - var(--mobile-padding, 4px)
        );
      }
    }

    .abyss-page__overflow-wrapper {
      padding: var(--offset-top) 20px
        max(
          8px,
          calc(var(--screen-radius, 12px) - env(safe-area-inset-left, 0px))
        )
        8px;
    }
  }

  // No navigation overrides
  &.no-navigation {
    &.device--desktop {
      grid-template-areas: 'app-bar' 'content';
      grid-template-columns: 1fr;
    }

    &.device--mobile {
      grid-template-areas: 'content';
      grid-template-rows: 1fr;
    }

    .abyss-page__content.device--desktop {
      border-top-left-radius: 0;
      margin-left: -8px;
      width: calc(100% + 16px);
      padding-left: 8px;
    }

    .abyss-page__content.device--mobile {
      height: 100%;
      mask-image: none;
    }

    .abyss-page__overflow-wrapper.device--mobile {
      padding-bottom: 12px;
    }

    &.device--mobile.orientation--landscape {
      grid-template-areas: 'content';
      grid-template-columns: 1fr;

      .abyss-page__content {
        width: 100%;
        mask-image: none;
      }

      .abyss-page__overflow-wrapper {
        padding-right: var(--offset-right);
        padding-bottom: max(12px, env(safe-area-inset-bottom, 0px));
      }
    }
  }
}
</style>
