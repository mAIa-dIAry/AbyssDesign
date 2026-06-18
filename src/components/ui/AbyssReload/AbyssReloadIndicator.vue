<template>
  <div
    class="abyss-reload-indicator"
    :class="{ 'abyss-reload-indicator--large': size === 'large' }"
  >
    <q-icon
      name="sym_r_refresh"
      class="abyss-reload-indicator__icon"
      :class="{ 'abyss-reload-indicator__icon--hidden': loading }"
    />
    <q-spinner
      class="abyss-reload-indicator__spinner"
      :class="{ 'abyss-reload-indicator__spinner--visible': loading }"
      :size="spinnerSize"
      color="white"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

export interface AbyssReloadIndicatorProps {
  loading?: boolean;
  size?: "default" | "large";
}

const props = withDefaults(defineProps<AbyssReloadIndicatorProps>(), {
  loading: false,
  size: "default",
});

const spinnerSize = computed(() => (props.size === "large" ? "24px" : "20px"));
</script>

<style scoped lang="scss">
.abyss-reload-indicator {
  position: relative;
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(black, 0.42);
  border: 1px solid rgba(white, 0.14);
  box-shadow: $shadow-small;

  &--large {
    width: 48px;
    height: 48px;
  }

  &__icon,
  &__spinner {
    position: absolute;
    transition: opacity 0.22s ease;
  }

  &__icon {
    font-size: 20px;
    color: white;
    opacity: 1;

    &--hidden {
      opacity: 0;
    }

    .abyss-reload-indicator--large & {
      font-size: 24px;
    }
  }

  &__spinner {
    opacity: 0;

    &--visible {
      opacity: 1;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    &__icon,
    &__spinner {
      transition-duration: 0.01ms;
    }
  }
}
</style>
