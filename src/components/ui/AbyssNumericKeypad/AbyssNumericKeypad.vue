<template>
  <div
    class="abyss-numeric-keypad"
    :class="$props.class"
    :style="style"
    role="group"
    :aria-label="keypadLabel"
  >
    <template v-for="key in layoutKeys" :key="key.id">
      <AbyssButton
        v-if="key.type === 'digit'"
        class="abyss-numeric-keypad__key"
        :label="key.value"
        embedded
        full-width
        :disable="disable"
        @click="emit('digit', key.value)"
      />
      <AbyssButton
        v-else-if="key.type === 'backspace'"
        class="abyss-numeric-keypad__key"
        icon="sym_r_backspace"
        embedded
        full-width
        :disable="disable || !canBackspace"
        :aria-label="backspaceLabel"
        @click="emit('backspace')"
      />
      <AbyssButton
        v-else-if="key.type === 'shuffle'"
        class="abyss-numeric-keypad__key abyss-numeric-keypad__key--shuffle"
        icon="sym_r_shuffle"
        embedded
        full-width
        :disable="disable"
        :aria-label="shuffleLabel"
        @click="handleShuffle"
      />
      <span
        v-else
        class="abyss-numeric-keypad__key abyss-numeric-keypad__key--spacer"
        aria-hidden="true"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import AbyssButton from '@/components/ui/AbyssButton/AbyssButton.vue';

type KeypadKey =
  | { id: string; type: 'digit'; value: string }
  | { id: 'backspace'; type: 'backspace' }
  | { id: 'shuffle'; type: 'shuffle' }
  | { id: 'spacer'; type: 'spacer' };

const DIGIT_VALUES = [
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '0',
] as const;

const FIXED_LAYOUT: KeypadKey[] = [
  ...DIGIT_VALUES.slice(0, 9).map((value) => ({
    id: value,
    type: 'digit' as const,
    value,
  })),
  { id: 'backspace', type: 'backspace' },
  { id: '0', type: 'digit', value: '0' },
  { id: 'spacer', type: 'spacer' },
];

export interface AbyssNumericKeypadProps {
  disable?: boolean;
  canBackspace?: boolean;
  chaos?: boolean;
  backspaceLabel?: string;
  shuffleLabel?: string;
  keypadLabel?: string;
  style?: string | Record<string, string>;
  class?:
    | string
    | Record<string, boolean>
    | Array<string | Record<string, boolean>>;
}

const props = withDefaults(defineProps<AbyssNumericKeypadProps>(), {
  disable: false,
  canBackspace: true,
  chaos: false,
  backspaceLabel: 'Usuń ostatnią cyfrę',
  shuffleLabel: 'Losuj układ klawiatury',
  keypadLabel: 'Klawiatura numeryczna',
  style: '',
  class: '',
});

const emit = defineEmits<{
  digit: [digit: string];
  backspace: [];
  shuffle: [];
}>();

const layoutKeys = ref<KeypadKey[]>(buildLayout(props.chaos));

watch(
  () => props.chaos,
  (chaos) => {
    layoutKeys.value = buildLayout(chaos);
  },
);

function buildLayout(chaos: boolean): KeypadKey[] {
  return chaos ? shuffleLayout() : [...FIXED_LAYOUT];
}

function shuffleLayout(): KeypadKey[] {
  const keys: KeypadKey[] = [
    ...DIGIT_VALUES.map((value) => ({
      id: value,
      type: 'digit' as const,
      value,
    })),
    { id: 'backspace', type: 'backspace' },
    { id: 'shuffle', type: 'shuffle' },
  ];

  for (let index = keys.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    const currentKey = keys[index];
    const swapKey = keys[swapIndex];

    if (!currentKey || !swapKey) {
      continue;
    }

    keys[index] = swapKey;
    keys[swapIndex] = currentKey;
  }

  return keys;
}

function handleShuffle(): void {
  layoutKeys.value = shuffleLayout();
  emit('shuffle');
}
</script>

<style scoped lang="scss">
.abyss-numeric-keypad {
  --key-size: 52px;

  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  grid-auto-rows: var(--key-size);
  gap: 10px;
  width: 100%;
  align-items: stretch;

  :deep(.abyss-numeric-keypad__key.abyss-button) {
    &[disabled] {
      transform: none;
    }
  }

  &__key {
    &--spacer {
      display: block;
      min-height: var(--key-size);
      visibility: hidden;
      pointer-events: none;
    }

    &--shuffle {
      :deep(.q-btn) {
        border: 1px dashed rgb(255 255 255 / 18%);
        background: rgb(255 255 255 / 4%);
      }
    }
  }
}
</style>
