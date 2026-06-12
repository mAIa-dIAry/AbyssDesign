<template>
  <!-- Header variant -->
  <div
    v-if="variant === 'header'"
    class="abyss-timeline-item abyss-timeline-item--header"
  >
    <div class="abyss-timeline-item__center">
      <q-icon
        :name="icon ?? 'sym_r_calendar_month'"
        class="abyss-timeline-item__icon"
      />
    </div>
    <div class="abyss-timeline-item__header-label">
      <slot>{{ label }}</slot>
    </div>
    <div class="abyss-timeline-item__line" />
  </div>

  <!-- Datetime variant -->
  <div
    v-else-if="variant === 'datetime'"
    class="abyss-timeline-item abyss-timeline-item--datetime"
    :class="rootClass"
  >
    <div class="abyss-timeline-item__left">
      <span class="abyss-timeline-item__date">{{ formattedDate }}</span>
      <span class="abyss-timeline-item__time">{{ formattedTime }}</span>
    </div>
    <div class="abyss-timeline-item__center">
      <div class="abyss-timeline-item__line abyss-timeline-item__line--top" />
      <q-icon
        :name="icon ?? 'sym_r_note_stack'"
        class="abyss-timeline-item__icon"
      />
      <div
        class="abyss-timeline-item__line abyss-timeline-item__line--bottom"
      />
    </div>
    <div class="abyss-timeline-item__content" :class="contentClass">
      <slot></slot>
      <AbyssSeparator
        v-if="stick === 'bottom' || stick === 'both'"
        class="abyss-timeline-item__separator"
      />
    </div>
  </div>

  <!-- Time variant -->
  <div
    v-else
    class="abyss-timeline-item abyss-timeline-item--time"
    :class="rootClass"
  >
    <div class="abyss-timeline-item__left">
      <span class="abyss-timeline-item__time">{{ formattedTime }}</span>
    </div>
    <div class="abyss-timeline-item__center">
      <div class="abyss-timeline-item__line abyss-timeline-item__line--top" />
      <div class="abyss-timeline-item__dot" />
      <div
        class="abyss-timeline-item__line abyss-timeline-item__line--bottom"
      />
    </div>
    <div class="abyss-timeline-item__content" :class="contentClass">
      <slot></slot>
      <AbyssSeparator
        v-if="stick === 'bottom' || stick === 'both'"
        class="abyss-timeline-item__separator"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import AbyssSeparator from '@/components/ui/AbyssSeparator/AbyssSeparator.vue';

export type AbyssTimelineItemVariant = 'datetime' | 'time' | 'header';

export type AbyssTimelineItemStick = 'top' | 'bottom' | 'both';

interface AbyssTimelineItemProps {
  variant?: AbyssTimelineItemVariant;
  datetime?: Date;
  label?: string;
  stick?: AbyssTimelineItemStick;
  icon?: string;
}

const props = withDefaults(defineProps<AbyssTimelineItemProps>(), {
  variant: 'time',
});

const formattedDate = computed(() => {
  if (!props.datetime) return '';
  return props.datetime.toLocaleDateString('pl-PL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
});

const formattedTime = computed(() => {
  if (!props.datetime) return '';
  return props.datetime.toLocaleTimeString('pl-PL', {
    hour: '2-digit',
    minute: '2-digit',
  });
});

const rootClass = computed(() => ({
  'abyss-timeline-item--stick-top': props.stick === 'top',
  'abyss-timeline-item--stick-bottom': props.stick === 'bottom',
  'abyss-timeline-item--stick-both': props.stick === 'both',
}));

const contentClass = computed(() => ({
  'abyss-timeline-item__content--stick-top':
    props.stick === 'top' || props.stick === 'both',
  'abyss-timeline-item__content--stick-bottom':
    props.stick === 'bottom' || props.stick === 'both',
  'abyss-timeline-item__content--stick-both': props.stick === 'both',
}));
</script>

<style scoped lang="scss">
.abyss-timeline-item {
  --padding-top: 12px;
  --padding-bottom: 12px;
  --inverted-padding-top: calc(var(--padding-top) * -1);
  --inverted-padding-bottom: calc(var(--padding-bottom) * -1);

  display: flex;
  align-items: stretch;
  width: 100%;
  padding: var(--padding-top) 0 var(--padding-bottom) 0;

  // ─── Left column ──────────────────────────────────────────────
  &__left {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: flex-start;
    padding-top: 12px;
    flex-basis: 90px;
    margin-bottom: -12px;
  }

  &__date {
    font-size: 16px;
    font-weight: 500;
    color: white;
    line-height: 18px;
  }

  &__time {
    font-size: 12px;
    font-weight: 400;
    color: rgba(white, 0.5);
    line-height: 16px;
    margin-top: 2px;
  }

  // ─── Center column ────────────────────────────────────────────
  &__center {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex-shrink: 0;
    width: 24px;
    margin: var(--inverted-padding-top) 12px var(--inverted-padding-bottom) 8px;
  }

  &__line {
    flex: 1;
    width: 1px;
    background-color: rgba(white, 0.12);
    min-height: 6px;
  }

  &--datetime .abyss-timeline-item__line--top {
    flex: 0 0 12px;
  }

  &--time .abyss-timeline-item__line--top {
    flex: 0 0 calc(15px + var(--padding-top));
  }

  &__icon {
    font-size: 24px;
    color: white;
    flex-shrink: 0;
    margin: 8px 0;
  }

  &__dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    border: 1px solid white;
    background-color: transparent;
    flex-shrink: 0;
    margin: 4px 0;
  }

  &__content {
    --shadow-join-offset: 8px;

    flex: 1;
    padding: 12px 16px;
    font-size: 14px;
    line-height: 20px;
    color: white;
    background-color: rgba(black, 0.2);
    border-radius: 8px;
    box-shadow: $shadow-strong, $shadow-frame-soft;
    min-width: 0;
    overflow-wrap: break-word;
    position: relative;

    &--stick-top {
      border-top-left-radius: 0;
      border-top-right-radius: 0;
      margin-top: calc(var(--shadow-join-offset) * -1);
      padding-top: calc(11px + var(--shadow-join-offset));
      clip-path: inset(var(--shadow-join-offset) -16px -16px -16px);
    }

    &--stick-bottom {
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
      clip-path: inset(-16px -16px 0 -16px);
      padding-bottom: 13px;
    }

    &--stick-both {
      border-radius: 0;
      margin-top: calc(var(--shadow-join-offset) * -1);
      padding-top: calc(11px + var(--shadow-join-offset));
      clip-path: inset(var(--shadow-join-offset) -16px 0 -16px);
      padding-bottom: 13px;
    }
  }

  &__separator {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
  }

  &--stick-top {
    --padding-top: 0px;
  }

  &--stick-bottom {
    --padding-bottom: 0px;
  }

  &--stick-both {
    --padding-top: 0px;
    --padding-bottom: 0px;
  }

  // ─── Header variant ─────────────────────────────────────────────
  &--header {
    align-items: center;
    padding: 12px 0 12px 90px;

    .abyss-timeline-item__line {
      flex: 1;
      height: 1px;
      width: auto;
      min-height: unset;
      min-width: 12px;
      background-color: rgba(white, 0.12);
    }

    .abyss-timeline-item__icon {
      margin: 0;
    }
  }

  &__header-label {
    font-size: 18px;
    line-height: 24px;
    font-weight: 500;
    color: white;
    padding-right: 12px;
    white-space: nowrap;
    transform: translateY(1px);
  }
}
</style>
