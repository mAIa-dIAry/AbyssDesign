<script setup lang="ts">
import AbyssTemplateSidebar from '@/components/templates/AbyssTemplateSidebar/AbyssTemplateSidebar.vue';

export type {
  AbyssTemplateSidebarTab as AbyssSidebarNavTab,
  AbyssTemplateSidebarProps as AbyssSidebarNavProps,
  AbyssTemplateSidebarTab as AbyssSettingsTab,
  AbyssTemplateSidebarProps as AbyssSettingsProps,
} from '@/components/templates/AbyssTemplateSidebar/AbyssTemplateSidebar.vue';

defineOptions({ inheritAttrs: false });
</script>

<template>
  <AbyssTemplateSidebar v-bind="$attrs as any">
    <template v-for="(_, name) in $slots" #[name]="slotProps">
      <slot :name="name" v-bind="slotProps ?? {}" />
    </template>
  </AbyssTemplateSidebar>
</template>
