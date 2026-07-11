<template>
  <AbyssCard>
    <template #content>
      <AbyssCode :value="data" language="abyss-json" />
    </template>
  </AbyssCard>
</template>

<script setup lang="ts">
import AbyssCard from '@/components/ui/AbyssCard/AbyssCard.vue';
import AbyssCode from '@/components/ui/AbyssCode/AbyssCode.vue';

interface AbyssDebugProps {
  data: unknown;
}

defineProps<AbyssDebugProps>();
</script>
