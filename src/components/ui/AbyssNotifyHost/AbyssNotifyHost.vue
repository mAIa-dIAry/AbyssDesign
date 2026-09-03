<template>
  <div
    :class="[
      'abyss-notify-host',
      { 'abyss-notify-queue': standalone },
      $props.class,
    ]"
    :style="style"
    v-bind="$attrs"
  >
    <AbyssNotify
      v-for="item in items"
      :key="item.instanceId"
      :model-value="item.visible ?? true"
      :type="item.type ?? 'info'"
      :message="item.message"
      :description="item.description ?? ''"
      :count="item.count ?? 1"
      :auto-close="item.autoClose ?? 0"
      :close-label="closeLabel"
      @update:model-value="onVisible(item.instanceId, $event)"
      @after-leave="onAfterLeave(item.instanceId)"
    />
  </div>
</template>

<script setup lang="ts">
import AbyssNotify, {
  type AbyssNotifyType,
} from '@/components/ui/AbyssNotify/AbyssNotify.vue';

export interface AbyssNotifyHostItem {
  instanceId: number | string;
  message: string;
  type?: AbyssNotifyType;
  description?: string;
  count?: number;
  autoClose?: number;
  visible?: boolean;
}

export interface AbyssNotifyHostProps {
  items?: AbyssNotifyHostItem[];
  /** Nadpisuje domyślną nazwę dostępną toastów z `ui.notify.close`. */
  closeLabel?: string;
  /** Poza `AbyssTemplateRoot` — klasa `abyss-notify-queue` (padding, max-height, scrollbar). */
  standalone?: boolean;
  style?: string | Record<string, string>;
  class?:
    | string
    | Record<string, boolean>
    | Array<string | Record<string, boolean>>;
}

withDefaults(defineProps<AbyssNotifyHostProps>(), {
  items: () => [],
  closeLabel: '',
  standalone: false,
  style: '',
  class: '',
});

const emit = defineEmits<{
  'update:visible': [instanceId: number | string, visible: boolean];
  'after-leave': [instanceId: number | string];
}>();

function onVisible(instanceId: number | string, visible: boolean): void {
  emit('update:visible', instanceId, visible);
}

function onAfterLeave(instanceId: number | string): void {
  emit('after-leave', instanceId);
}
</script>

<style scoped lang="scss">
.abyss-notify-host:not(.abyss-notify-queue) {
  display: contents;
}
</style>
