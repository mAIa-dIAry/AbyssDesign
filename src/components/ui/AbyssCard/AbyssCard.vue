<template>
  <div class="abyss-card">
    <slot name="header">
      <div class="abyss-card-header" v-if="hasHeader">
        <div class="abyss-card-prepend">
          <slot name="header-prepend"></slot>
        </div>
        <div v-if="title" class="abyss-card-title">
          <AbyssTitle type="h2">{{ title }}</AbyssTitle>
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
    <slot name="footer">
      <div class="abyss-card-footer" v-if="hasFooter">
        <div class="abyss-card-footer-prepend">
          <slot name="footer-prepend"></slot>
        </div>
        <div class="abyss-card-footer-spacer"></div>
        <div class="abyss-card-footer-append">
          <slot name="footer-append"></slot>
        </div>
      </div>
    </slot>
  </div>
</template>

<script setup lang="ts">
import { computed, useSlots } from 'vue';
import AbyssSeparator from '@/components/ui/AbyssSeparator/AbyssSeparator.vue';
import AbyssTitle from '@/components/ui/AbyssTitle/AbyssTitle.vue';
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
  return !!(
    slots.footer ||
    slots['footer-prepend'] ||
    slots['footer-append']
  );
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

  .abyss-card-header,
  .abyss-card-footer {
    display: flex;
    align-items: center;
    padding: 12px var(--card-padding);
    gap: 8px;
    font-size: 18px;
    min-height: 48px;
  }

  .abyss-card-prepend,
  .abyss-card-append,
  .abyss-card-footer-prepend,
  .abyss-card-footer-append {
    display: flex;
    align-items: center;

    &:empty {
      display: none;
    }

    :deep(.abyss-button) {
      --border-radius: 12px;
    }
  }

  .abyss-card-prepend {
    :deep(.q-icon) {
      font-size: 24px;
      width: 24px;
      height: 24px;
    }
  }

  .abyss-card-append,
  .abyss-card-footer-append {
    :deep(.abyss-button-group) {
      margin-top: -8px;
      margin-bottom: -8px;
      margin-right: -12px;
    }
  }

  .abyss-card-footer-prepend {
    font-size: 14px;
    line-height: 20px;
    font-weight: 400;
    opacity: 0.6;

    :deep(.abyss-button-group),
    :deep(> .abyss-button) {
      margin-top: -8px;
      margin-bottom: -8px;
      margin-left: -12px;
      opacity: 1;
    }
  }

  .abyss-card-title,
  .abyss-card-footer-spacer {
    flex: 1;
    min-width: 0;
    min-height: 24px;
  }

  .abyss-card-content {
    padding: var(--card-padding);
    display: flex;
    flex-direction: column;
    gap: 12px;
    font-size: 14px;
    line-height: 20px;
    min-height: 0;

    > :slotted(*) {
      margin: 0;
    }

    :deep(.abyss-separator) {
      margin-left: calc(var(--card-padding) * -1);
      margin-right: calc(var(--card-padding) * -1);
      width: calc(100% + 32px);
    }
  }
}
</style>
