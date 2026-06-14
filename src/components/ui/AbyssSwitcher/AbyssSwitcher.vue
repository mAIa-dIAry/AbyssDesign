<template>
  <div
    class="abyss-switcher"
    :class="[
      {
        disabled: disable,
      },
      $props.class,
    ]"
    :style="style"
    role="radiogroup"
    v-bind="$attrs"
  >
    <div
      class="abyss-switcher__track"
      :style="{
        '--option-count': options.length,
        '--selected-index': selectedIndex,
      }"
    >
      <div
        v-if="selectedIndex >= 0"
        class="abyss-switcher__indicator"
        aria-hidden="true"
      />

      <AbyssButton
        v-for="(option, index) in options"
        :key="option.name"
        flat
        size="small"
        full-width
        :label="option.label"
        :icon="option.icon || ''"
        :disable="disable"
        :class="[
          'abyss-switcher__option',
          {
            'abyss-switcher__option--selected': option.name === modelValue,
          },
        ]"
        :style="getOptionStyle(option.name)"
        role="radio"
        :aria-checked="option.name === modelValue"
        :aria-label="option.label"
        :tabindex="getOptionTabIndex(option.name, index)"
        @click="selectOption(option.name)"
        @keydown="onOptionKeydown($event, index)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import AbyssButton from '@/components/ui/AbyssButton/AbyssButton.vue';

export interface AbyssSwitcherOption {
  name: string;
  label: string;
  icon?: string;
}

export interface AbyssSwitcherProps {
  modelValue?: string;
  options: AbyssSwitcherOption[];
  disable?: boolean;
  style?: string | Record<string, string>;
  class?:
    | string
    | Record<string, boolean>
    | Array<string | Record<string, boolean>>;
}

const props = withDefaults(defineProps<AbyssSwitcherProps>(), {
  modelValue: '',
  disable: false,
  style: '',
  class: '',
});

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();

const selectedIndex = computed(() =>
  props.options.findIndex((option) => option.name === props.modelValue),
);

function selectOption(name: string) {
  if (props.disable || name === props.modelValue) {
    return;
  }

  emit('update:modelValue', name);
}

function getOptionTabIndex(name: string, index: number) {
  if (props.disable) {
    return -1;
  }

  if (selectedIndex.value >= 0) {
    return name === props.modelValue ? 0 : -1;
  }

  return index === 0 ? 0 : -1;
}

function getOptionStyle(name: string) {
  const color = name === props.modelValue ? 'black' : 'white';

  return {
    '--switcher-option-color': color,
    color,
  };
}

function onOptionKeydown(event: KeyboardEvent, index: number) {
  if (props.disable || props.options.length === 0) {
    return;
  }

  const { key } = event;
  if (
    key !== 'ArrowLeft' &&
    key !== 'ArrowRight' &&
    key !== 'Home' &&
    key !== 'End'
  ) {
    return;
  }

  event.preventDefault();

  let nextIndex = index;

  if (key === 'ArrowLeft') {
    nextIndex = index <= 0 ? props.options.length - 1 : index - 1;
  } else if (key === 'ArrowRight') {
    nextIndex = index >= props.options.length - 1 ? 0 : index + 1;
  } else if (key === 'Home') {
    nextIndex = 0;
  } else {
    nextIndex = props.options.length - 1;
  }

  const nextOption = props.options[nextIndex];
  if (!nextOption) {
    return;
  }

  selectOption(nextOption.name);

  const track = (event.currentTarget as HTMLElement).closest(
    '.abyss-switcher__track',
  );
  track
    ?.querySelectorAll<HTMLElement>('.abyss-switcher__option')
    [nextIndex]?.focus();
}
</script>

<style scoped lang="scss">
.abyss-switcher {
  display: inline-flex;
  width: 100%;

  &__track {
    position: relative;
    display: grid;
    grid-template-columns: repeat(var(--option-count), minmax(0, 1fr));
    align-items: center;
    width: 100%;
    min-height: 36px;
    padding: 3px;
    border-radius: 18px;
    border: 1px solid rgba(white, 0.15);
    background-color: rgba(white, 0.02);
    box-shadow: $shadow-base;
  }

  &__indicator {
    position: absolute;
    top: 3px;
    bottom: 3px;
    left: 3px;
    width: calc((100% - 6px) / var(--option-count));
    border-radius: 15px;
    background-color: rgba(white, 0.8);
    transition: transform $transition-medium-duration ease;
    transform: translateX(calc(var(--selected-index) * 100%));
    pointer-events: none;
    z-index: 0;
  }

  :deep(.abyss-button.abyss-switcher__option) {
    --padding-y: 6px;
    --padding-x: 12px;
    --font-size: 14px;
    --icon-size: 21px;
    --border-radius: 15px;
    position: relative;
    z-index: 1;
    min-height: 30px;
    height: 30px;
    transition: all $transition-medium-duration ease;

    .q-btn__content,
    .q-btn__content .block {
      color: inherit;
    }

    .q-icon {
      color: currentColor;
      transition: all $transition-medium-duration ease;
    }
  }

  &.disabled {
    .abyss-switcher__track {
      box-shadow: $shadow-disabled;
      border-color: transparent;
      opacity: 0.5;
    }
  }
}
</style>
