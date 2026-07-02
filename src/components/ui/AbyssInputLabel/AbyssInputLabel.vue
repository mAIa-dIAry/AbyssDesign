<template>
  <div
    class="abyss-input-label"
    :class="{ 'abyss-input-label--size-small': size === 'small' }"
  >
    <div class="abyss-input-label-text">
      <slot>{{ label }}</slot>
    </div>
  </div>
</template>

<script setup lang="ts">
export interface AbyssInputLabelProps {
  label?: string;
  size?: 'normal' | 'small';
}

withDefaults(defineProps<AbyssInputLabelProps>(), {
  size: 'normal',
});
</script>

<style scoped lang="scss">
.abyss-input-label {
  --label-font-size: var(--font-size, 16px);
  --label-padding-y: var(--padding-y, 12px);
  --label-icon-size: var(--icon-size, 24px);

  color: white;
  font-size: var(--label-font-size);
  line-height: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: unset;
  min-width: 0;

  &--size-small {
    --label-font-size: 12px;
    --label-padding-y: 8px;
    --label-icon-size: 16px;
  }
}

@container (min-width: #{($form-field-stack-max-width + 1px)}) {
  .abyss-input-label {
    min-height: calc(var(--label-icon-size) + var(--label-padding-y) * 2);
    line-height: var(--label-icon-size);
  }
}
</style>
