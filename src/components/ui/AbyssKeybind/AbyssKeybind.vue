<template>
  <div class="abyss-keybind-container">
    <div class="abyss-keybind-wrapper" @keydown.capture="handleKeydown">
      <div v-if="label" class="abyss-keybind-label">
        <div class="abyss-keybind-label-text">{{ label }}</div>
      </div>

      <q-select
        ref="selectRef"
        :model-value="localModelParts"
        :options="EMPTY_OPTIONS"
        behavior="menu"
        multiple
        use-input
        use-chips
        hide-dropdown-icon
        new-value-mode="add-unique"
        :placeholder="resolvedPlaceholder"
        :disable="disable"
        :readonly="readonly"
        :error="error"
        :error-message="hasBottomContent ? errorMessage : undefined"
        :hint="hasBottomContent ? resolvedHint : undefined"
        :loading="loading"
        input-debounce="0"
        standout
        :class="[
          'abyss-keybind',
          {
            'abyss-keybind--no-bottom': !hasBottomContent,
          },
          $props.class,
        ]"
        :style="style"
        v-bind="$attrs"
        @update:model-value="handleModelValueUpdate"
        @new-value="handleNewValue"
        @popup-show="handlePopupShow"
        @focus="handleFocus"
        @blur="handleBlur"
      >
        <template #selected-item="scope">
          <q-chip
            dense
            class="abyss-keybind__chip"
            :class="{
              'abyss-keybind__chip--last':
                scope.index === localModelParts.length - 1,
            }"
            :tabindex="scope.tabindex"
            :aria-label="resolveKeybindPartLabel(scope.opt)"
            :title="resolveKeybindPartLabel(scope.opt)"
          >
            <q-icon
              v-if="scope.opt === 'Super'"
              name="sym_r_window"
              size="16px"
              class="abyss-keybind__chip-icon"
            />
            <template v-else>{{ resolveKeybindPartLabel(scope.opt) }}</template>
          </q-chip>
        </template>
      </q-select>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { resolveDesktopShortcutFromKeyboardInput } from '../../../utils/desktopShortcut';

const EMPTY_OPTIONS: string[] = [];

export interface AbyssKeybindProps {
  modelValue?: string;
  label?: string;
  placeholder?: string;
  hint?: string;
  capturingHint?: string;
  disable?: boolean;
  readonly?: boolean;
  error?: boolean;
  errorMessage?: string;
  loading?: boolean;
  style?: string | Record<string, string>;
  class?:
    | string
    | Record<string, boolean>
    | Array<string | Record<string, boolean>>;
}

const props = withDefaults(defineProps<AbyssKeybindProps>(), {
  modelValue: '',
  label: '',
  placeholder: 'Naciśnij kombinację klawiszy',
  hint: '',
  capturingHint: '',
  disable: false,
  readonly: false,
  error: false,
  errorMessage: '',
  loading: false,
  style: '',
  class: '',
});

const emit = defineEmits<{
  'update:modelValue': [value: string];
  focus: [event: Event];
  blur: [event: Event];
  capture: [value: string];
}>();

const isCapturing = ref(false);
const selectRef = ref<{ hidePopup: () => void } | null>(null);
const localModelParts = ref(resolveKeybindParts(props.modelValue));

watch(
  () => props.modelValue,
  (value) => {
    localModelParts.value = resolveKeybindParts(value);
  },
);

const hasBottomContent = computed(() => {
  return Boolean(props.hint || props.capturingHint || props.errorMessage);
});

const resolvedPlaceholder = computed(() => {
  return localModelParts.value.length === 0 ? props.placeholder : '';
});

const resolvedHint = computed(() => {
  if (isCapturing.value && props.capturingHint) {
    return props.capturingHint;
  }

  return props.hint;
});

function emitParts(parts: string[]): void {
  const normalizedParts = resolveKeybindParts(parts.join('+'));
  const value = normalizedParts.join('+');

  localModelParts.value = normalizedParts;
  emit('update:modelValue', value);

  if (value) {
    emit('capture', value);
  }
}

function resolveKeybindParts(value: string): string[] {
  return value
    .split('+')
    .map((token) => token.trim())
    .filter(Boolean);
}

function resolveKeybindPartLabel(value: string): string {
  if (value === 'Super') {
    return 'Windows';
  }

  return value;
}

function handleModelValueUpdate(value: unknown): void {
  if (!Array.isArray(value)) {
    localModelParts.value = [];
    emit('update:modelValue', '');
    return;
  }

  const parts = value.filter(
    (token): token is string => typeof token === 'string' && token.length > 0,
  );

  emitParts(parts);
}

function handleNewValue(
  inputValue: string,
  done: (item?: string, mode?: 'add' | 'add-unique' | 'toggle') => void,
): void {
  const parts = resolveKeybindParts(inputValue);

  if (parts.length === 0) {
    done();
    return;
  }

  emitParts(parts);
  done();
}

function handleFocus(event: Event): void {
  isCapturing.value = true;
  selectRef.value?.hidePopup();
  emit('focus', event);
}

function handleBlur(event: Event): void {
  isCapturing.value = false;
  emit('blur', event);
}

function handlePopupShow(): void {
  selectRef.value?.hidePopup();
}

function handleKeydown(event: KeyboardEvent): void {
  if (props.disable || props.readonly) {
    return;
  }

  if (event.key === 'Tab') {
    return;
  }

  event.stopPropagation();
  event.preventDefault();

  if (
    event.key === 'Escape' &&
    !event.altKey &&
    !event.ctrlKey &&
    !event.metaKey &&
    !event.shiftKey
  ) {
    isCapturing.value = false;

    if (event.target instanceof HTMLElement) {
      event.target.blur();
    }

    return;
  }

  if (
    (event.key === 'Backspace' || event.key === 'Delete') &&
    !event.altKey &&
    !event.ctrlKey &&
    !event.metaKey &&
    !event.shiftKey
  ) {
    localModelParts.value = [];
    emit('update:modelValue', '');
    return;
  }

  const nextShortcut = resolveDesktopShortcutFromKeyboardInput({
    altGraphKey: event.getModifierState('AltGraph'),
    altKey: event.altKey,
    code: event.code,
    ctrlKey: event.ctrlKey,
    key: event.key,
    metaKey: event.metaKey,
    shiftKey: event.shiftKey,
  });

  if (!nextShortcut) {
    return;
  }

  emitParts(resolveKeybindParts(nextShortcut));
}
</script>

<style scoped lang="scss">
.abyss-keybind-container {
  --font-size: 16px;
  --padding-x: var(--font-size);
  --padding-y: 12px;
  --icon-size: 24px;
  --border-radius: 8px;
  --gap: var(--font-size);
  --gap-half: calc(var(--gap) / 2);
  --border-color: #{rgba(white, 0.075)};

  container-type: inline-size;
  width: 100%;

  .abyss-keybind-wrapper {
    display: flex;
    flex-direction: row;
    align-items: start;
    gap: 16px;
    width: 100%;

    .abyss-keybind-label {
      flex: 1;
      color: white;
      font-size: var(--font-size);
      line-height: var(--icon-size);
      display: flex;
      flex-direction: column;
      justify-content: center;
      min-height: calc(var(--icon-size) + var(--padding-y) * 2);
    }

    :deep(.abyss-keybind) {
      padding-bottom: 0;
      flex: 1;

      .q-field__control {
        border-radius: var(--border-radius);
        color: white;
        background-color: rgba(white, 0.02);
        border: 1px solid var(--border-color);
        box-shadow: $shadow-base;
        padding: calc(var(--padding-y) - 4px) calc(var(--padding-x) - 4px);
        min-height: calc(var(--icon-size) + var(--padding-y) * 2);
        height: auto;
        outline: 0 solid rgba(white, 0.05);
        outline-offset: 2px;
        transition: $transition-fast;
        width: 100%;

        &::before,
        &::after {
          display: none;
        }

        .q-field__label {
          display: none;
        }

        .q-field__control-container {
          padding-top: 0;
        }

        .q-field__native,
        .q-field__input {
          color: white;
          font-size: var(--font-size);
          min-height: var(--icon-size);
          padding: 0;
        }

        .q-field__native::placeholder,
        .q-field__input::placeholder {
          color: rgba(white, 0.5);
          opacity: 1;
        }

        .q-field__marginal {
          height: unset;
          color: rgba(white, 0.5);
        }

        .q-field__append,
        .q-field__prepend {
          display: none;
        }
      }

      .q-field__bottom {
        position: relative;
        padding: var(--gap-half) 0 0;
        font-size: 12px;
        transform: translateY(0px);

        .q-field__messages {
          color: rgba(white, 0.5);

          [role='alert'] {
            color: $negative;
            font-weight: 500;
          }
        }
      }

      .q-chip.abyss-keybind__chip {
        position: relative;
        margin: 2px 18px 2px 0;
        background: rgba(white, 0.1);
        color: white;
        border: 1px solid rgba(white, 0.12);
        border-radius: 6px;
        box-shadow: $shadow-small;
        pointer-events: none;

        .abyss-keybind__chip-icon {
          color: inherit;
        }

        &::after {
          content: '+';
          position: absolute;
          top: 50%;
          right: -14px;
          transform: translateY(-50%);
          color: rgba(white, 0.55);
          font-weight: 700;
        }

        &.abyss-keybind__chip--last {
          margin-right: 4px;

          &::after {
            display: none;
          }
        }
      }

      &.q-field:not(
          .q-field--disabled,
          .q-field--focused,
          .q-field--readonly
        ):hover {
        .q-field__control {
          --border-color: #{rgba(white, 0.125)};
          background-color: rgba(white, 0.04);
        }
      }

      &.q-field--focused {
        .q-field__control {
          --border-color: #{rgba(white, 0.15)};
          background-color: rgba(black, 0.125);
          outline-width: 4px;
        }
      }

      &.q-field--disabled {
        .q-field__control {
          box-shadow: $shadow-disabled;
          transform: translateY(1px);
          opacity: 0.5;

          .q-field__control-container {
            opacity: 1 !important;
          }
        }
      }

      &.q-field--readonly {
        .q-field__control {
          --border-color: transparent;
          box-shadow: $shadow-disabled;
          transform: translateY(1px);
        }
      }

      &.abyss-keybind--no-bottom {
        .q-field__bottom {
          display: none;
        }
      }
    }
  }

  @include responsive('xs', true) {
    .abyss-keybind-wrapper {
      flex-direction: column;
      align-items: stretch;
      gap: 4px;

      .abyss-keybind-label {
        min-height: unset;
        line-height: 20px;
      }
    }
  }
}
</style>
