<template>
  <div
    class="abyss-select-container"
    :class="{ 'abyss-select-container--size-small': size === 'small' }"
  >
    <div class="abyss-select-wrapper">
      <div v-if="label" class="abyss-select-label">
        <div class="abyss-select-label-text">{{ label }}</div>
      </div>
      <q-select
        ref="selectRef"
        :model-value="modelValue"
        @update:model-value="$emit('update:modelValue', $event)"
        :options="options"
        :multiple="multiple"
        :display-value="displayValue"
        :display-value-html="displayValueHtml"
        :options-html="optionsHtml"
        :emit-value="emitValue"
        :map-options="mapOptions"
        :option-value="optionValue"
        :option-label="optionLabel"
        :option-disable="optionDisable"
        :options-cover="optionsCover"
        :options-dense="optionsDense"
        :options-selected-class="optionsSelectedClass"
        :use-input="useInput"
        :use-chips="useChips"
        :fill-input="fillInput"
        :hide-selected="hideSelected"
        :hide-dropdown-icon="hideDropdownIcon"
        :clearable="clearable"
        :max-values="maxValues"
        :new-value-mode="newValueMode"
        :loading="loading"
        :hint="hint"
        :error="error"
        :error-message="errorMessage"
        :rules="rules"
        :lazy-rules="lazyRules"
        :hide-bottom-space="hideBottomSpace"
        :counter="counter"
        :disable="disable"
        :readonly="readonly"
        :autofocus="autofocus"
        :dense="dense"
        :prefix="prefix"
        :suffix="suffix"
        :tabindex="tabindex"
        :for="forAttr"
        :name="name"
        :autocomplete="autocomplete"
        :behavior="behavior"
        transition-show="abyss-select-jump-down"
        transition-hide="abyss-select-jump-up"
        transition-duration="100"
        :popup-no-route-dismiss="popupNoRouteDismiss"
        :virtual-scroll-slice-size="virtualScrollSliceSize"
        :virtual-scroll-slice-ratio-before="virtualScrollSliceRatioBefore"
        :virtual-scroll-slice-ratio-after="virtualScrollSliceRatioAfter"
        :virtual-scroll-item-size="virtualScrollItemSize"
        :virtual-scroll-sticky-size-start="virtualScrollStickySizeStart"
        :virtual-scroll-sticky-size-end="virtualScrollStickySizeEnd"
        :virtual-scroll-horizontal="virtualScrollHorizontal"
        :disable-tab-selection="disableTabSelection"
        standout
        :popup-content-class="
          [
            'abyss-select-menu',
            isPopupOpen ? 'abyss-select-menu--open' : '',
            isPopupAbove ? 'abyss-select-menu--above' : '',
          ]
            .filter(Boolean)
            .join(' ')
        "
        :class="[
          'abyss-select',
          {
            'abyss-select--popup-open': isPopupOpen,
            'abyss-select--popup-open-above': isPopupAbove,
            'abyss-select--flat': flat,
          },
          $props.class,
        ]"
        :style="style"
        v-bind="$attrs"
        @popup-show="handlePopupShow"
        @popup-hide="handlePopupHide"
      >
        <template v-if="$slots.before" #before>
          <slot name="before" />
        </template>
        <template v-if="$slots.after" #after>
          <slot name="after" />
        </template>
        <template v-if="$slots.prepend" #prepend>
          <slot name="prepend" />
        </template>
        <template v-if="$slots.append" #append>
          <slot name="append" />
        </template>
        <template v-if="$slots.error" #error>
          <slot name="error" />
        </template>
        <template v-if="$slots.hint" #hint>
          <slot name="hint" />
        </template>
        <template v-if="$slots.selected" #selected>
          <slot name="selected" />
        </template>
        <template v-if="$slots['selected-item']" #selected-item="scope">
          <slot name="selected-item" v-bind="scope" />
        </template>
        <template v-if="$slots['no-option']" #no-option="scope">
          <slot name="no-option" v-bind="scope" />
        </template>
        <template v-if="$slots.option" #option="scope">
          <slot name="option" v-bind="scope" />
        </template>
        <template v-if="$slots.loading" #loading>
          <slot name="loading" />
        </template>
      </q-select>
    </div>
  </div>
</template>

<script setup lang="ts">
import { nextTick, ref } from 'vue';
import type { AbyssSelectProps } from './AbyssSelect.props';

type SelectRootRef = {
  $el?: Element | null;
};

const isPopupOpen = ref(false);
const isPopupAbove = ref(false);
const selectRef = ref<SelectRootRef | null>(null);
const POPUP_SCROLL_SYNC_KEY = '__abyssSelectScrollSyncAttached';

withDefaults(defineProps<AbyssSelectProps>(), {
  multiple: false,
  displayValueHtml: false,
  optionsHtml: false,
  emitValue: false,
  mapOptions: false,
  optionsCover: false,
  optionsDense: false,
  useInput: false,
  useChips: false,
  fillInput: false,
  hideSelected: false,
  hideDropdownIcon: false,
  clearable: false,
  loading: false,
  error: false,
  hideBottomSpace: false,
  counter: false,
  disable: false,
  readonly: false,
  autofocus: false,
  dense: false,
  size: 'normal',
  flat: false,
  behavior: 'menu',
  popupNoRouteDismiss: false,
  disableTabSelection: false,
  virtualScrollHorizontal: false,
  style: '',
  class: '',
});

defineEmits<{
  'update:modelValue': [value: unknown];
}>();

function handlePopupShow(): void {
  isPopupOpen.value = true;

  void nextTick(() => {
    ensurePopupContentWrapper();
    syncPopupPlacement();

    window.setTimeout(() => {
      syncPopupPlacement();
    }, 0);
  });
}

function handlePopupHide(): void {
  isPopupOpen.value = false;
  isPopupAbove.value = false;
}

function ensurePopupContentWrapper(): void {
  if (typeof document === 'undefined') {
    return;
  }

  const menu = resolvePopupMenuElement();

  if (menu === null) {
    return;
  }

  const firstElement = menu.firstElementChild;

  if (firstElement?.classList.contains('abyss-select-menu__content')) {
    return;
  }

  const wrapper = document.createElement('div');
  wrapper.className = 'abyss-select-menu__content';

  while (menu.firstChild !== null) {
    wrapper.append(menu.firstChild);
  }

  menu.append(wrapper);
  attachPopupScrollSync(menu, wrapper);
  wrapper.scrollTop = menu.scrollTop;
}

function attachPopupScrollSync(
  menu: HTMLElement,
  wrapper: HTMLDivElement,
): void {
  const syncState = menu as HTMLElement & {
    [POPUP_SCROLL_SYNC_KEY]?: boolean;
    __abyssSelectSyncingScroll?: boolean;
  };

  if (syncState[POPUP_SCROLL_SYNC_KEY] === true) {
    return;
  }

  const syncFromWrapper = (): void => {
    if (syncState.__abyssSelectSyncingScroll === true) {
      return;
    }

    syncState.__abyssSelectSyncingScroll = true;
    menu.scrollTop = wrapper.scrollTop;
    menu.dispatchEvent(new Event('scroll'));
    syncState.__abyssSelectSyncingScroll = false;
  };

  const syncFromMenu = (): void => {
    if (syncState.__abyssSelectSyncingScroll === true) {
      return;
    }

    syncState.__abyssSelectSyncingScroll = true;
    wrapper.scrollTop = menu.scrollTop;
    syncState.__abyssSelectSyncingScroll = false;
  };

  wrapper.addEventListener('scroll', syncFromWrapper, { passive: true });
  menu.addEventListener('scroll', syncFromMenu, { passive: true });
  syncState[POPUP_SCROLL_SYNC_KEY] = true;
}

function resolvePopupMenuElement(): HTMLElement | null {
  const rootElement = selectRef.value?.$el;

  if (!(rootElement instanceof Element)) {
    return null;
  }

  const focusTarget = rootElement.querySelector('.q-select__focus-target');
  const menuId = focusTarget?.getAttribute('aria-controls');

  return typeof menuId === 'string' ? document.getElementById(menuId) : null;
}

function syncPopupPlacement(): void {
  const menu = resolvePopupMenuElement();
  const control = resolveControlElement();

  if (menu === null || control === null) {
    isPopupAbove.value = false;
    return;
  }

  const menuRect = menu.getBoundingClientRect();
  const controlRect = control.getBoundingClientRect();

  isPopupAbove.value = menuRect.bottom <= controlRect.top + 1;
}

function resolveControlElement(): HTMLElement | null {
  const rootElement = selectRef.value?.$el;

  if (!(rootElement instanceof Element)) {
    return null;
  }

  const control = rootElement.querySelector('.q-field__control');

  return control instanceof HTMLElement ? control : null;
}
</script>

<style scoped lang="scss">
.abyss-select-container {
  --font-size: 16px;
  --padding-x: var(--font-size);
  --padding-y: 12px;
  --icon-size: 24px;
  --border-radius: 8px;
  --gap: calc(var(--font-size) / 2);
  --border-color: #{rgba(white, 0.075)};

  container-type: inline-size;
  width: 100%;

  &--size-small {
    --font-size: 12px;
    --padding-y: 12px;
    --icon-size: 16px;
    --border-radius: 6px;

    .abyss-select-wrapper :deep(.abyss-select) {
      .q-field__append {
        margin-right: calc(-1 * (var(--padding-x) - var(--padding-y)));
      }

      .q-select__dropdown-icon {
        font-size: var(--icon-size);
      }
    }
  }

  .abyss-select-wrapper {
    display: flex;
    flex-direction: row;
    align-items: start;
    gap: var(--gap);
    width: 100%;

    .abyss-select-label {
      flex: 1;
      color: white;
      font-size: var(--font-size);
      line-height: var(--icon-size);
      display: flex;
      flex-direction: column;
      justify-content: center;
      min-height: calc(var(--icon-size) + var(--padding-y) * 2);
    }

    :deep(.abyss-select) {
      --control-radius-top: var(--border-radius);
      --control-radius-bottom: var(--border-radius);
      --control-border-top-color: var(--border-color);
      --control-border-bottom-color: var(--border-color);

      padding-bottom: 0;
      flex: 1;

      .q-icon {
        transition: $transition-fast;
      }

      .q-ripple {
        opacity: 0.2;
      }

      .q-field__control {
        border: 0;
        border-radius: var(--control-radius-top) var(--control-radius-top)
          var(--control-radius-bottom) var(--control-radius-bottom);
        color: white;
        background-color: rgba(white, 0.02);
        box-shadow: $shadow-base;
        padding: var(--padding-y) var(--padding-x);
        min-height: calc(var(--icon-size) + var(--padding-y) * 2);
        height: auto;
        outline: 0px solid rgba(white, 0.05);
        outline-offset: 2px;
        transition: $transition-fast;
        width: 100%;

        // Usuń standout pseudo-element Quasara
        &::before {
          display: none;
        }

        &::after {
          content: '';
          position: absolute;
          inset: 0;
          pointer-events: none;
          border: 1px solid var(--border-color);
          border-top-color: var(--control-border-top-color);
          border-bottom-color: var(--control-border-bottom-color);
          border-radius: inherit;
          transition: $transition-fast;
        }

        .q-field__native,
        .q-field__input,
        .q-field__suffix,
        .q-field__prefix {
          color: white;
          font-size: var(--font-size);
          min-height: var(--icon-size);
          padding: 0;
        }

        // Label jest zewnętrzny – ukryj wbudowany
        .q-field__label {
          display: none;
        }

        .q-field__control-container {
          padding-top: 0;
        }

        .q-field__marginal {
          height: unset;
          color: rgba(white, 0.5);
        }

        .q-field__prepend {
          padding-right: var(--gap);

          &:not(:empty) {
            box-sizing: content-box;
            padding: calc(var(--padding-y) - 1px);
            margin: calc(-1 * (var(--padding-y) - 1px)) var(--gap)
              calc(-1 * (var(--padding-y) - 1px))
              calc(-1 * (var(--padding-x) - 1px));
            background-color: rgba(white, 0.02);
            border-right: 1px solid var(--border-color);
            border-top-left-radius: var(--border-radius);
            border-bottom-left-radius: var(--border-radius);
            transition: $transition-fast;
          }
        }

        .q-field__append {
          padding-left: var(--gap);
        }

        .q-select__dropdown-icon {
          color: rgba(white, 0.4);
          transition: $transition-fast;
        }

        // Chipy wybranych wartości
        .q-chip {
          background: rgba(white, 0.1);
          color: white;
          border: 1px solid rgba(white, 0.12);
          border-radius: 6px;
          box-shadow: $shadow-small;

          .q-chip__icon--remove {
            color: rgba(white, 0.5);
            opacity: 1;

            &:hover {
              color: white;
            }
          }
        }
      }

      .q-field__bottom {
        padding: var(--gap) 0 0;
        font-size: 12px;

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
      }

      &.q-field:not(.q-field--disabled, .q-field--focused, .q-field--readonly) {
        .q-field__control:hover {
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

        .q-select__dropdown-icon {
          color: rgba(white, 0.7);
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

      &.q-field--error {
        .q-field__bottom .q-field__messages {
          color: $negative;
        }
      }

      &.q-select--with-chips {
        .q-field__control {
          padding: calc(var(--padding-y) - 4px) calc(var(--padding-x) - 4px);
        }
      }

      &.abyss-select--popup-open {
        --control-radius-bottom: 0px;
        --control-border-bottom-color: transparent;

        &.abyss-select--popup-open-above {
          --control-radius-top: 0px;
          --control-radius-bottom: var(--border-radius);
          --control-border-top-color: transparent;
          --control-border-bottom-color: var(--border-color);
        }
      }

      &.abyss-select--flat {
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
      }
    }
  }

  @include responsive('xs', true) {
    .abyss-select-wrapper {
      flex-direction: column;
      align-items: stretch;

      .abyss-select-label {
        min-height: unset;
        line-height: 20px;
      }
    }
  }
}
</style>

<style lang="scss">
.abyss-select-menu {
  --menu-radius-top: 8px;
  --menu-radius-bottom: 8px;
  --menu-border-clip-top: 11px;
  --menu-border-clip-bottom: -8px;
  --menu-offset-y: -1px;
  --menu-shadow-clip: none;

  display: flex;
  flex-direction: column;
  position: relative;
  isolation: isolate;
  background: rgba(0, 0, 0, 0.5);
  border-radius: var(--menu-radius-top) var(--menu-radius-top)
    var(--menu-radius-bottom) var(--menu-radius-bottom);
  box-shadow: $shadow-base;
  backdrop-filter: blur(20px);
  background-color: rgba(black, 0.125);
  border: 1px solid rgba(white, 0.15);
  clip-path: var(--menu-shadow-clip);
  overflow: visible;
  transition: $transition-fast;

  &::before {
    content: '';
    display: block;
    position: absolute;
    inset: -6px;
    z-index: 2;
    pointer-events: none;
    border-radius: calc(var(--menu-radius-top) + 6px)
      calc(var(--menu-radius-top) + 6px) calc(var(--menu-radius-bottom) + 6px)
      calc(var(--menu-radius-bottom) + 6px);
    border: 4px solid rgba(white, 0.05);
    clip-path: inset(
      var(--menu-border-clip-top) -8px var(--menu-border-clip-bottom) -8px round
        var(--menu-radius-top) var(--menu-radius-top) var(--menu-radius-bottom)
        var(--menu-radius-bottom)
    );
  }

  &.abyss-select-menu--open {
    --menu-radius-top: 0px;
    margin-top: var(--menu-offset-y);
  }

  &.abyss-select-menu--above {
    --menu-radius-top: 8px;
    --menu-radius-bottom: 0px;
    --menu-border-clip-top: -8px;
    --menu-border-clip-bottom: 11px;
    --menu-offset-y: 0px;
    --menu-shadow-clip: inset(-16px -16px 0 -16px);
  }

  > .abyss-select-menu__content {
    flex: 1 1 auto;
    min-height: 0;
    position: relative;
    z-index: 0;
    overflow: auto;
    max-height: 100%;
    padding: 8px 0;

    @media (hover: hover) and (pointer: fine) {
      @include scrollbar;
    }
  }

  .q-item {
    transition: $transition-medium;

    & > .q-focus-helper {
      inset: 2px 4px 2px 4px;
      height: unset;
      width: unset;
      border-radius: 6px;
      border: 1px solid transparent;
      box-shadow: $shadow-zero;
      display: block;
      transition: $transition-medium;
      background-color: rgba(white, 0);
      opacity: 1;
      z-index: -1;

      &::after,
      &::before {
        display: none;
      }
    }

    &.q-item--clickable.q-manual-focusable {
      &:hover:not(.q-item--active),
      &.q-manual-focusable--focused:not(.q-item--active) {
        & > .q-focus-helper {
          border-color: rgba(white, 0.08);
          background-color: rgba(white, 0.04);
          opacity: 1;
        }
      }

      &:active:not(.q-item--active),
      &.q-manual-focusable--focused:not(.q-item--active):active {
        & > .q-focus-helper {
          border-color: rgba(white, 0.22);
          background-color: rgba(white, 0.03);
        }
      }
    }

    &--active {
      color: white;
      & > .q-focus-helper {
        background-color: rgba(black, 0.25);
        border-color: rgba(white, 0.08);
      }

      &:hover,
      &.q-manual-focusable--focused {
        & > .q-focus-helper {
          background-color: rgba(black, 0.125);
          border-color: rgba(white, 0.08);
          opacity: 1;
        }

        &:active {
          & > .q-focus-helper {
            background-color: rgba(black, 0.2);
            border-color: rgba(white, 0.22);
          }
        }
      }
    }
  }
}

.q-transition--abyss-select-jump-down-enter-active,
.q-transition--abyss-select-jump-down-leave-active,
.q-transition--abyss-select-jump-up-enter-active,
.q-transition--abyss-select-jump-up-leave-active {
  transition: transform var(--q-transition-duration, 0.1s)
    var(--q-transition-easing, cubic-bezier(0.215, 0.61, 0.355, 1));
}

.q-transition--abyss-select-jump-down-enter-active.abyss-select-menu,
.q-transition--abyss-select-jump-down-leave-active.abyss-select-menu,
.q-transition--abyss-select-jump-up-enter-active.abyss-select-menu,
.q-transition--abyss-select-jump-up-leave-active.abyss-select-menu {
  transition:
    transform var(--q-transition-duration, 0.1s)
      var(--q-transition-easing, cubic-bezier(0.215, 0.61, 0.355, 1)),
    opacity var(--q-transition-duration, 0.1s)
      var(--q-transition-easing, cubic-bezier(0.215, 0.61, 0.355, 1)),
    border-radius 0.15s ease,
    margin-top 0.15s ease,
    border-color 0.15s ease,
    background-color 0.15s ease;
}

.q-transition--abyss-select-jump-down-enter-from,
.q-transition--abyss-select-jump-up-leave-to {
  transform: translate3d(0, -12px, 0) scale3d(0.985, 0.985, 1);
}

.q-transition--abyss-select-jump-down-enter-from.abyss-select-menu,
.q-transition--abyss-select-jump-up-leave-to.abyss-select-menu,
.q-transition--abyss-select-jump-down-leave-to.abyss-select-menu,
.q-transition--abyss-select-jump-up-enter-from.abyss-select-menu {
  opacity: 0;
}

.q-transition--abyss-select-jump-down-leave-to,
.q-transition--abyss-select-jump-up-enter-from {
  transform: translate3d(0, 8px, 0) scale3d(0.992, 0.992, 1);
}

@media (prefers-reduced-motion: reduce) {
  .q-transition--abyss-select-jump-down-enter-active,
  .q-transition--abyss-select-jump-down-leave-active,
  .q-transition--abyss-select-jump-up-enter-active,
  .q-transition--abyss-select-jump-up-leave-active,
  .q-transition--abyss-select-jump-down-enter-active.abyss-select-menu,
  .q-transition--abyss-select-jump-down-leave-active.abyss-select-menu,
  .q-transition--abyss-select-jump-up-enter-active.abyss-select-menu,
  .q-transition--abyss-select-jump-up-leave-active.abyss-select-menu {
    transition-duration: 0s;
  }
}
</style>
