<template>
  <q-menu
    v-model="open"
    :class="menuContentClass"
    :style="menuContentStyle"
    :anchor="anchor"
    :self="self"
    transition-show="abyss-select-jump-down"
    transition-hide="abyss-select-jump-up"
    :transition-duration="100"
    v-bind="$attrs"
  >
    <div
      class="abyss-dropdown-menu__content"
      :class="{ 'abyss-dropdown-menu__content--dense': dense }"
    >
      <slot />
    </div>
  </q-menu>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { QMenuProps } from 'quasar';

export interface AbyssDropdownProps {
  modelValue?: boolean;
  anchor?: QMenuProps['anchor'];
  self?: QMenuProps['self'];
  /** Zagęszczona zawartość — mniejszy padding wokół listy. */
  dense?: boolean;
  /** Minimalna szerokość panelu (px). */
  minWidth?: number;
  class?:
    | string
    | Record<string, boolean>
    | Array<string | Record<string, boolean>>;
  style?: string | Record<string, string>;
}

const props = withDefaults(defineProps<AbyssDropdownProps>(), {
  anchor: 'bottom left',
  self: 'top left',
  dense: false,
  minWidth: 0,
  class: '',
  style: '',
});

const open = defineModel<boolean>({ default: false });

const menuContentClass = computed(() =>
  ['abyss-dropdown-menu', props.class].filter(Boolean).join(' '),
);

const menuContentStyle = computed(() => {
  if (props.minWidth <= 0) {
    return undefined;
  }

  return { minWidth: `${props.minWidth}px` };
});

defineOptions({
  inheritAttrs: false,
});
</script>

