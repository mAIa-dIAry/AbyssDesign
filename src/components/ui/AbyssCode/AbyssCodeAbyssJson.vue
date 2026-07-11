<template>
  <AbyssCodeNode :nodes="tree" />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import AbyssCodeNode from './AbyssCodeNode.vue';
import { buildJsonTreeRoots, resolveJsonValue } from './buildJsonTree';

interface Props {
  value: unknown | string;
}

const props = defineProps<Props>();

const tree = computed(() => buildJsonTreeRoots(resolveJsonValue(props.value)));
</script>
