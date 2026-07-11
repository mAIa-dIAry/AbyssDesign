<template>
  <div
    class="abyss-button-group"
    :class="[{ 'abyss-button-group--vertical': vertical }, $props.class]"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
export interface AbyssButtonGroupProps {
  vertical?: boolean;
  class?:
    | string
    | Record<string, boolean>
    | Array<string | Record<string, boolean>>;
}

withDefaults(defineProps<AbyssButtonGroupProps>(), {
  vertical: false,
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

  &--vertical {
    flex-direction: column;
    width: 100%;

    :deep(.abyss-button) {
      width: 100%;
      height: auto;
      line-height: normal;

      &.size-small,
      &.size-medium,
      &.size-big {
        height: auto;
      }

      .q-btn__content {
        white-space: normal;
      }

      &:not(:first-child):not(:last-child) {
        --border-top-left-radius: var(--inner-border-radius);
        --border-top-right-radius: var(--inner-border-radius);
        --border-bottom-right-radius: var(--inner-border-radius);
        --border-bottom-left-radius: var(--inner-border-radius);
        clip-path: inset(
          calc(var(--gap) * -0.5) -16px calc(var(--gap) * -0.5) -16px
        );
      }

      &:first-child {
        --border-top-right-radius: var(--border-radius);
        --border-bottom-right-radius: var(--inner-border-radius);
        --border-bottom-left-radius: var(--inner-border-radius);
        clip-path: inset(-16px -16px calc(var(--gap) * -0.5) -16px);
      }

      &:last-child {
        --border-top-left-radius: var(--inner-border-radius);
        --border-top-right-radius: var(--inner-border-radius);
        --border-bottom-left-radius: var(--border-radius);
        --border-bottom-right-radius: var(--border-radius);
        clip-path: inset(calc(var(--gap) * -0.5) -16px -16px -16px);
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
}
</style>
