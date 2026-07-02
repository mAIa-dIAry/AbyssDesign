<template>
  <div
    class="abyss-input-container"
    :class="{
      'abyss-input-container--size-small': size === 'small',
      'abyss-input--collapsed': collapsed,
      'is-collapsed': isCollapsed,
    }"
  >
    <AbyssGrid
      class="abyss-input-wrapper"
      :class="{ 'abyss-input-wrapper--no-label': !hasLabel }"
      :column-size="hasLabel ? INPUT_COLUMN_SIZE : '100%'"
      :max-columns="hasLabel ? INPUT_GRID_MAX_COLUMNS : 0"
      :rowGap="ABYSS_INPUT_ROW_GAP"
      content-rows
    >
      <AbyssInputLabel
        v-if="label && !collapsed"
        :label="label"
        :size="size"
      />
      <q-input
        v-bind="$attrs"
        :model-value="modelValue"
        @update:model-value="$emit('update:modelValue', $event)"
        @click="handleInputClick"
        @blur="handleInputBlur"
        :placeholder="effectivePlaceholder"
        :type="computedType"
        :disable="disable"
        :readonly="computedReadonly"
        :inputmode="usesCustomPicker ? 'none' : undefined"
        :error="error"
        :error-message="hasBottomContent ? errorMessage : undefined"
        :hint="hasBottomContent ? hint : undefined"
        standout
        :class="[
          'abyss-input',
          {
            'abyss-input--no-bottom': !hasBottomContent,
            'abyss-input--custom-picker': usesCustomPicker,
            'abyss-input--flat': flat,
          },
          $props.class,
        ]"
        :style="style"
        :counter="hasBottomContent && counter"
        :maxlength="maxLength >= 0 ? maxLength : undefined"
        :autogrow="type === 'textarea'"
        :loading="loading"
        :mask="mask || undefined"
        :fill-mask="fillMask ? true : undefined"
      >
        <!-- Forward prepend slot -->
        <template v-slot:prepend>
          <slot name="prepend">
            <q-icon
              v-if="type === 'email'"
              name="sym_r_email"
              class="icon-prepend"
            />
            <q-icon
              v-if="type === 'tel'"
              name="sym_r_mobile"
              class="icon-prepend"
            />
            <q-icon
              v-if="type === 'url'"
              name="sym_r_link"
              class="icon-prepend"
            />
          </slot>
        </template>

        <template v-slot:append>
          <slot name="append">
            <q-icon
              v-if="type === 'number'"
              name="sym_r_unfold_more"
              class="number-icon-append"
            />
            <AbyssButton
              v-if="type === 'password'"
              flat
              :size="buttonSize"
              :icon="
                isPasswordVisible ? 'sym_r_visibility' : 'sym_r_visibility_off'
              "
              class="icon-button"
              @click="isPasswordVisible = !isPasswordVisible"
            />
            <AbyssButton
              v-if="type === 'search'"
              flat
              :size="buttonSize"
              icon="sym_r_search"
              class="icon-button"
              @click="handleSearchClick"
            />
            <AbyssButton
              v-if="type === 'date' || type === 'datetime-local'"
              flat
              :size="buttonSize"
              icon="sym_r_calendar_month"
              class="icon-button"
            >
              <q-popup-proxy
                class="abyss-date-menu"
                ref="datePopupRef"
                :breakpoint="0"
                cover
                transition-show="abyss-dialog-jump-down"
                transition-hide="abyss-dialog-jump-up"
                @before-show="initDatePickerDraft"
              >
                <AbyssDate
                  :model-value="datePickerDraft"
                  @update:model-value="handleDateDraftUpdate"
                  @confirm="handleDateConfirm"
                  mask="YYYY-MM-DD"
                  @close="datePopupRef?.hide()"
                />
              </q-popup-proxy>
            </AbyssButton>
            <AbyssButton
              v-if="type === 'time' || type === 'datetime-local'"
              flat
              :size="buttonSize"
              icon="sym_r_schedule"
              class="icon-button"
            >
              <q-popup-proxy
                class="abyss-time-menu"
                ref="timePopupRef"
                :breakpoint="0"
                cover
                transition-show="abyss-dialog-jump-down"
                transition-hide="abyss-dialog-jump-up"
              >
                <AbyssTime
                  :model-value="timeValue"
                  @update:model-value="handleTimeUpdate"
                  mask="HH:mm"
                  @close="timePopupRef?.hide()"
                />
              </q-popup-proxy>
            </AbyssButton>
            <!-- Fallback ikona dla trybu collapsed gdy brak slotu append -->
            <q-icon
              v-if="collapsed && !hasAppendContent"
              name="sym_r_more_horiz"
              class="collapsed-fallback-icon"
            />
          </slot>
        </template>

        <!-- Forward before slot -->
        <template v-if="$slots.before" v-slot:before>
          <slot name="before"></slot>
        </template>

        <!-- Forward after slot -->
        <template v-if="$slots.after" v-slot:after>
          <slot name="after"></slot>
        </template>
      </q-input>
    </AbyssGrid>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, useSlots, watch } from 'vue';
import AbyssButton from '@/components/ui/AbyssButton/AbyssButton.vue';
import AbyssDate from '@/components/ui/AbyssDate/AbyssDate.vue';
import AbyssGrid from '@/components/ui/AbyssGrid/AbyssGrid.vue';
import {
  ABYSS_INPUT_ROW_GAP,
  INPUT_COLUMN_SIZE,
  INPUT_GRID_MAX_COLUMNS,
} from '@/components/ui/AbyssGrid/AbyssGrid.constants';
import AbyssInputLabel from '@/components/ui/AbyssInputLabel/AbyssInputLabel.vue';
import AbyssTime from '@/components/ui/AbyssTime/AbyssTime.vue';
import type { QPopupProxy } from 'quasar';

export interface AbyssInputProps {
  modelValue?: string | number;
  label?: string;
  placeholder?: string;
  type?:
    | 'text'
    | 'password'
    | 'email'
    | 'number'
    | 'search'
    | 'tel'
    | 'url'
    | 'time'
    | 'date'
    | 'datetime-local'
    | 'textarea';
  disable?: boolean;
  readonly?: boolean;
  error?: boolean;
  errorMessage?: string;
  hint?: string;
  style?: string | Record<string, string>;
  class?:
    | string
    | Record<string, boolean>
    | Array<string | Record<string, boolean>>;
  counter?: boolean;
  maxLength?: number;
  loading?: boolean;
  mask?: string;
  fillMask?: boolean;
  collapsed?: boolean;
  /** Usuwa cień pola — wariant bez wypukłości, np. w nagłówku tabeli. */
  flat?: boolean;
  size?: 'normal' | 'small';
}

const props = withDefaults(defineProps<AbyssInputProps>(), {
  modelValue: '',
  label: '',
  placeholder: '',
  type: 'text',
  disable: false,
  readonly: false,
  error: false,
  errorMessage: '',
  hint: '',
  style: '',
  class: '',
  counter: false,
  maxLength: -1, // -1 indicates no max length, since 0 is a valid max length for some inputs like file inputs
  loading: false,
  mask: '',
  fillMask: false,
  collapsed: false,
  flat: false,
  size: 'normal',
});

if (props.maxLength < -1) {
  console.warn(
    `AbyssInput: maxLength cannot be less than -1. Received: ${props.maxLength}.`,
  );
}

const hasBottomContent = computed(() => {
  return !!(props.hint || props.errorMessage || props.counter);
});

const hasLabel = computed(() => Boolean(props.label));

const effectivePlaceholder = computed(() => {
  const value = props.modelValue;
  if (value !== null && value !== undefined && String(value).length > 0) {
    return '';
  }

  return props.placeholder;
});

const buttonSize = computed<'small' | 'medium'>(() =>
  props.size === 'small' ? 'small' : 'medium',
);

const slots = useSlots();

const hasAppendContent = computed(() => {
  // Jeśli rodzic przekazał slot append
  if (slots.append) return true;

  const typesWithAppend = [
    'password',
    'search',
    'date',
    'time',
    'datetime-local',
    'number',
  ];
  return typesWithAppend.includes(props.type);
});

const isPasswordVisible = ref(false);
const datePopupRef = ref<QPopupProxy>();
const timePopupRef = ref<QPopupProxy>();
const datePickerDraft = ref('');
const usesDatePopup = computed(
  () => props.type === 'date' || props.type === 'datetime-local',
);
const usesTimePopup = computed(
  () => props.type === 'time' || props.type === 'datetime-local',
);
const usesCustomPicker = computed(
  () => usesDatePopup.value || usesTimePopup.value,
);

const isCollapsed = ref(props.collapsed);

watch(
  () => props.collapsed,
  (newValue) => {
    isCollapsed.value = newValue;
  },
);

watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue && props.collapsed) {
      isCollapsed.value = false;
    }
  },
);

const computedType = computed(() => {
  if (props.type === 'password' && isPasswordVisible.value) {
    return 'text';
  }

  if (usesCustomPicker.value) {
    return 'text';
  }

  return props.type;
});

const computedReadonly = computed(
  () => props.readonly || usesCustomPicker.value,
);

// Date picker support
const dateValue = computed(() => {
  const value = String(props.modelValue || '');
  if (props.type === 'datetime-local') {
    return value.split('T')[0] || '';
  }
  return value;
});

const timeValue = computed(() => {
  const value = String(props.modelValue || '');
  if (props.type === 'datetime-local') {
    return value.split('T')[1] || '';
  }
  return value;
});

const emit = defineEmits<{
  'update:modelValue': [value: string | number | null];
  search: [value: string | number | null];
}>();

function initDatePickerDraft(): void {
  datePickerDraft.value =
    dateValue.value || new Date().toISOString().split('T')[0] || '';
}

function handleDateDraftUpdate(newDate: string | null): void {
  if (!newDate) {
    return;
  }

  datePickerDraft.value = newDate;
}

function handleDateConfirm(): void {
  if (!datePickerDraft.value) {
    return;
  }

  if (props.type === 'datetime-local') {
    const time = timeValue.value || '00:00';
    emit('update:modelValue', `${datePickerDraft.value}T${time}`);
    return;
  }

  emit('update:modelValue', datePickerDraft.value);
}

function handleTimeUpdate(newTime: string | null) {
  if (!newTime) return;
  if (props.type === 'datetime-local') {
    const date = dateValue.value || new Date().toISOString().split('T')[0];
    emit('update:modelValue', `${date}T${newTime}`);
  } else {
    emit('update:modelValue', newTime);
  }
}

function handleSearchClick() {
  emit('search', props.modelValue);
}

function openCustomPicker(): void {
  if (usesDatePopup.value) {
    datePopupRef.value?.show();
    return;
  }

  if (usesTimePopup.value) {
    timePopupRef.value?.show();
  }
}

function handleInputClick(event?: MouseEvent) {
  if (isCollapsed.value && props.collapsed) {
    isCollapsed.value = false;
    return;
  }

  if (!usesCustomPicker.value) {
    return;
  }

  const target = event?.target;

  if (
    target instanceof Element &&
    target.closest('.q-field__append, .q-field__prepend')
  ) {
    return;
  }

  openCustomPicker();
}

function handleInputBlur() {
  if (props.collapsed && !props.modelValue) {
    isCollapsed.value = true;
  }
}
</script>

<style scoped lang="scss">
.abyss-input-container {
  --font-size: 16px;
  --padding-x: var(--font-size);
  --padding-y: 12px;
  --icon-size: 24px;
  --border-radius: 8px;
  --gap: calc(var(--font-size) / 2);
  --marginal-input-gap: 4px;
  --border-color: #{rgba(white, 0.075)};

  width: 100%;
  transition: $transition-medium;
  min-width: calc(var(--icon-size) + var(--padding-y) * 2);

  &--size-small {
    --font-size: 12px;
    --padding-y: 8px;
    --icon-size: 16px;
    --border-radius: 6px;
  }

  .abyss-input-wrapper {
    width: 100%;

    &--no-label {
      grid-template-columns: 1fr;
    }

    .icon-prepend {
      display: block;
      box-sizing: content-box;
      padding: 11px;
      margin: -11px 0 -11px -15px;
      background-color: rgba(white, 0.02);
      border-right: 1px solid var(--border-color);
      border-top-left-radius: var(--border-radius);
      border-bottom-left-radius: var(--border-radius);
      transition: $transition-fast;
    }

    :deep(.abyss-input) {
      padding-bottom: 0;
      min-width: 0;

      .q-field__control {
        border-radius: var(--border-radius);
        color: white;
        background-color: rgba(white, 0.02);
        border: 1px solid var(--border-color);
        box-shadow: $shadow-base;
        padding: calc(var(--padding-y) - 1px) calc(var(--padding-x) - 1px);
        min-height: calc(var(--icon-size) + var(--padding-y) * 2);
        height: auto;
        align-items: center;
        gap: var(--marginal-input-gap);
        outline: 0px solid rgba(white, 0.05);
        outline-offset: 2px;
        transition: $transition-fast;
        width: 100%;

        &::before,
        &::after {
          display: none;
        }
      }
      .q-field__native {
        color: white;
        font-size: var(--font-size);
        line-height: var(--icon-size);
        padding: 0;
        min-height: var(--icon-size);
        height: var(--icon-size);
        transition: $transition-fast;

        &::-webkit-calendar-picker-indicator {
          display: none;
        }

        &::-webkit-inner-spin-button,
        &::-webkit-outer-spin-button {
          display: none;
        }
      }

      .q-field__label {
        display: none;
      }

      .q-field__control-container {
        padding-top: 0;
        width: 100%;
        align-items: center;
        transition: $transition-medium;
      }

      .q-field__append {
        padding-left: 0;

        .icon-button:not(.size-small) {
          margin: -8px -12px -8px 0;

          &:not(:first-child) {
            margin-left: 12px;
          }
        }

        .icon-button.size-small {
          margin: calc(-1 * var(--padding-y))
            calc(-1 * (var(--padding-x) - 1px)) calc(-1 * var(--padding-y)) 0;

          &:not(:first-child) {
            margin-left: 12px;
          }
        }

        .number-icon-append {
          margin-right: -8px;
        }
      }

      .q-field__prepend {
        padding-right: 0;

        .icon-button:not(.size-small) {
          margin: -8px 0 -8px -12px;

          &:not(:last-child) {
            margin-right: 12px;
          }
        }

        .icon-button.size-small {
          margin: calc(-1 * var(--padding-y)) 0 calc(-1 * var(--padding-y))
            calc(-1 * var(--padding-x));

          &:not(:last-child) {
            margin-right: 12px;
          }
        }

        &:empty {
          display: none;
        }
      }

      .q-field__marginal {
        height: unset;
        align-self: center;
      }

      .q-icon,
      .q-spinner {
        font-size: var(--icon-size);
        color: white;
        display: block;
      }

      .q-field__bottom {
        position: relative;
        padding: var(--gap) 0 0 0;
        font-size: 12px;
        transform: translateY(0px);
      }

      .q-field__messages {
        color: rgba(white, 0.5);

        [role='alert'] {
          color: $negative;
          font-weight: 500;
        }
      }

      .q-field__counter {
        color: rgba(white, 0.5);
      }

      .q-placeholder::placeholder {
        color: rgba(white, 0.5);
        opacity: 1;
        user-select: none;
      }

      &.q-field:not(
          .q-field--disabled,
          .q-field--focused,
          .q-field--readonly
        ):hover
        .q-field__control {
        --border-color: #{rgba(white, 0.125)};
        background-color: rgba(white, 0.04);
      }

      &.q-field--focused .q-field__control {
        --border-color: #{rgba(white, 0.15)};
        background-color: rgba(black, 0.125);
        outline-width: 4px;
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

          .icon-prepend {
            border-color: rgba(black, 0.15);
          }
        }
      }

      &.q-field--readonly.abyss-input--custom-picker {
        .q-field__control {
          --border-color: #{rgba(white, 0.075)};
          box-shadow: $shadow-base;
          transform: none;
          cursor: pointer;

          .icon-prepend {
            border-color: var(--border-color);
          }
        }

        .q-field__native {
          cursor: pointer;
          caret-color: transparent;
          user-select: none;
        }
      }

      &.q-field.abyss-input--custom-picker:not(
          .q-field--disabled,
          .q-field--focused
        ):hover
        .q-field__control {
        --border-color: #{rgba(white, 0.125)};
        background-color: rgba(white, 0.04);
      }

      &.abyss-input--no-bottom {
        .q-field__bottom {
          display: none;
        }
      }

      &.abyss-input--flat {
        .q-field__control {
          box-shadow: none;
        }

        &.q-field--disabled .q-field__control {
          box-shadow: none;
          transform: none;
        }

        &.q-field--readonly .q-field__control {
          box-shadow: none;
          transform: none;
        }

        &.q-field--readonly.abyss-input--custom-picker .q-field__control {
          box-shadow: none;
        }
      }
    }
  }

  &.abyss-input-container--size-small {
    .icon-prepend {
      padding: calc(var(--padding-y) - 1px);
      margin: calc(-1 * (var(--padding-y) - 1px)) 0
        calc(-1 * (var(--padding-y) - 1px)) calc(-1 * (var(--padding-x) - 1px));
    }

    .abyss-input-wrapper {
      :deep(.abyss-input) {
        .q-field__control {
          padding: calc(var(--padding-y) - 1px) calc(var(--padding-x) - 1px);
          min-height: calc(var(--icon-size) + var(--padding-y) * 2 - 2px);
        }

        .q-field__native {
          font-size: var(--font-size);
          line-height: var(--icon-size);
          min-height: var(--icon-size);
          height: auto;
        }
      }
    }
  }

  &.abyss-input--collapsed {
    :deep() {
      .q-field__control-container {
        flex-grow: 0;
        flex-basis: auto;
      }
    }
    &.is-collapsed {
      :deep() {
        width: 0%;
        min-width: calc(var(--icon-size) + var(--padding-y) * 2);

        .q-field__control {
          padding: calc(var(--padding-y) - 1px);
          cursor: pointer;
        }

        .q-field__control-container {
          flex-basis: 0;
        }

        .q-field__native {
          width: 0%;
        }

        .q-field__append {
          pointer-events: none;
          padding-left: 0;
        }
      }
    }
  }
}
</style>
