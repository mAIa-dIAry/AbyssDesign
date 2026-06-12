<template>
  <div class="abyss-button-group" :class="$props.class">
    <slot />
  </div>
</template>

<script setup lang="ts">
export interface AbyssButtonGroupProps {
  class?:
    | string
    | Record<string, boolean>
    | Array<string | Record<string, boolean>>;
}

withDefaults(defineProps<AbyssButtonGroupProps>(), {
  class: '',
});
</script>

<style scoped lang="scss">
.abyss-button-group {
  --gap: 2px;
  display: flex;
  gap: var(--gap);

  :deep(.abyss-button) {
    --inner-border-radius: calc(var(--border-radius) / 2);
    &.gradient .q-focus-helper {
      border-radius: inherit;
      clip-path: none;
    }

    &:not(:first-child):not(:last-child) {
      --border-top-left-radius: var(--inner-border-radius);
      --border-top-right-radius: var(--inner-border-radius);
      --border-bottom-right-radius: var(--inner-border-radius);
      --border-bottom-left-radius: var(--inner-border-radius);
      clip-path: inset(
        -16px calc(var(--gap) * -0.5) -16px calc(var(--gap) * -0.5)
      );
    }

    &:first-child {
      --border-top-right-radius: var(--inner-border-radius);
      --border-bottom-right-radius: var(--inner-border-radius);
      clip-path: inset(-16px calc(var(--gap) * -0.5) -16px -16px);
    }

    &:last-child {
      --border-top-left-radius: var(--inner-border-radius);
      --border-bottom-left-radius: var(--inner-border-radius);
      clip-path: inset(-16px -16px -16px calc(var(--gap) * -0.5));
    }

    &:only-child {
      --border-top-left-radius: var(--border-radius);
      --border-top-right-radius: var(--border-radius);
      --border-bottom-right-radius: var(--border-radius);
      --border-bottom-left-radius: var(--border-radius);
      clip-path: none;
    }
  }
}
</style>
