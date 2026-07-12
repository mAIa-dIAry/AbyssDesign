<script setup lang="ts">
import AbyssTemplateRoot from '@/components/templates/AbyssTemplateRoot/AbyssTemplateRoot.vue';

export type { AbyssTemplateRootProps as AbyssTemplateProps } from '@/components/templates/AbyssTemplateRoot/AbyssTemplateRoot.vue';

defineOptions({ inheritAttrs: false });
</script>

<template>
  <AbyssTemplateRoot v-bind="$attrs as any">
    <template v-for="(_, name) in $slots" #[name]="slotProps">
      <slot :name="name" v-bind="slotProps ?? {}" />
    </template>
  </AbyssTemplateRoot>
</template>
