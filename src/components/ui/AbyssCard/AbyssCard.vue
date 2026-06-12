<template>
  <div class="abyss-card">
    <slot name="header">
      <div class="abyss-card-header" v-if="hasHeader">
        <div class="abyss-card-prepend">
          <slot name="header-prepend"></slot>
        </div>
        <div class="abyss-card-title">
          <slot name="header">{{ title }}</slot>
        </div>
        <div class="abyss-card-append">
          <slot name="header-append"></slot>
        </div>
      </div>
    </slot>
    <AbyssSeparator v-if="hasHeader && (hasContent || hasFooter)" />
    <div v-if="hasContent" class="abyss-card-content">
      <slot name="content"></slot>
      <slot></slot>
    </div>
    <AbyssSeparator v-if="hasContent && hasFooter" />
    <div v-if="hasFooter" class="abyss-card-footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, useSlots } from 'vue';
import AbyssSeparator from '@/components/ui/AbyssSeparator/AbyssSeparator.vue';
interface AbyssCardProps {
  title?: string;
}

const props = defineProps<AbyssCardProps>();
const slots = useSlots();

const hasHeader = computed(() => {
  return !!(
    props.title ||
    slots['header-prepend'] ||
    slots['header-append'] ||
    slots['header']
  );
});

const hasContent = computed(() => {
  return !!(slots.content || slots.default);
});

const hasFooter = computed(() => {
  return !!slots.footer;
});
</script>

<style scoped lang="scss">
.abyss-card {
  --card-padding: 16px;

  display: flex;
  flex-direction: column;
  background-color: rgba(black, 0.2);
  border-radius: 16px;
  box-shadow: $shadow-card, $shadow-frame-medium;
  width: 100%;
  border-bottom: 1px solid rgba(black, 0.2);

  .abyss-card-header {
    display: flex;
    align-items: center;
    padding: 0 var(--card-padding);
    gap: 8px;
    font-size: 18px;
    min-height: 46px;
  }

  .abyss-card-prepend,
  .abyss-card-append {
    display: flex;
    align-items: center;

    &:empty {
      display: none;
    }
  }

  .abyss-card-title {
    flex: 1;
    font-weight: 500;
    padding: 12px 0px;
    line-height: 22px;
  }

  .abyss-card-content,
  .abyss-card-footer {
    padding: var(--card-padding);
    display: flex;
    flex-direction: column;
    font-size: 14px;
    line-height: 20px;

    :deep(.abyss-separator) {
      margin-left: calc(var(--card-padding) * -1);
      margin-right: calc(var(--card-padding) * -1);
      width: calc(100% + 32px);
    }
  }

  .abyss-card-content {
    min-height: 0;
  }
}
</style>
