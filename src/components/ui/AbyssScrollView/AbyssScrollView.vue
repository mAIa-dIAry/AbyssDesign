<script setup lang="ts">
import AbyssTemplateMain from '@/components/templates/AbyssTemplateMain/AbyssTemplateMain.vue';

export type { AbyssTemplateMainProps as AbyssScrollViewProps } from '@/components/templates/AbyssTemplateMain/AbyssTemplateMain.vue';

defineOptions({ inheritAttrs: false });
</script>

<template>
  <AbyssTemplateMain v-bind="$attrs as any">
    <template v-if="$slots['top-bar']" #top-bar>
      <slot name="top-bar" />
    </template>
    <slot />
  </AbyssTemplateMain>
</template>
