<template>
  <span
    class="abyss-gradient-badge"
    :class="`variant-${variant}`"
    :style="gradientStyle"
  >
    <slot>{{ label }}</slot>
  </span>
</template>

<script setup lang="ts">
import { watch } from 'vue';
import { useGradient } from '@/composables/useGradient';

export interface AbyssGradientBadgeProps {
  label?: string;
  variant: 'gold' | 'sakura' | 'garden';
}

const props = defineProps<AbyssGradientBadgeProps>();

const VARIANT_COLORS: Record<
  AbyssGradientBadgeProps['variant'],
  [string, string]
> = {
  gold: ['hsl(48, 100%, 77%)', 'hsl(18, 100%, 69%)'],
  sakura: ['hsl(291, 86%, 85%)', 'hsl(235, 100%, 72%)'],
  garden: ['hsl(85, 100%, 69%)', 'hsl(133, 100%, 39%)'],
};

const { gradientStyle, setColors } = useGradient(
  VARIANT_COLORS[props.variant],
  '135deg',
);

watch(
  () => props.variant,
  (variant) => setColors(VARIANT_COLORS[variant]),
);
</script>

<style scoped lang="scss">
.abyss-gradient-badge {
  display: inline-block;
  font-size: 14px;
  font-weight: 700;
  padding: 7px 16px;
  border-radius: 8px;
  box-shadow: $shadow-base;
  white-space: nowrap;
  line-height: 18px;

  &.variant-gold {
    color: $font-cold-color;
  }

  &.variant-sakura {
    color: $font-sakura-color;
  }

  &.variant-garden {
    color: $font-garden-color;
  }
}
</style>
