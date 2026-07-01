<template>
  <component
    :is="type"
    class="abyss-title"
    :class="`abyss-title--${type}`"
  >
    <span class="abyss-title__content">
      <span class="abyss-title__row">
        <q-icon v-if="icon" :name="icon" class="abyss-title__icon" />
        <span class="abyss-title__text">
          <span class="abyss-title__text-label">
            <slot>{{ label }}</slot>
          </span>
        </span>
      </span>
    </span>
  </component>
</template>

<script setup lang="ts">
export type AbyssTitleType = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

export interface AbyssTitleProps {
  type?: AbyssTitleType;
  icon?: string;
  label?: string;
}

withDefaults(defineProps<AbyssTitleProps>(), {
  type: 'h2',
});
</script>

<style scoped lang="scss">
.abyss-title {
  --abyss-title-heading-step: 0.25rem;
  --abyss-title-h1-size: 24px;
  --abyss-title-h2-size: calc(
    var(--abyss-title-h1-size) - var(--abyss-title-heading-step)
  );
  --abyss-title-h3-size: calc(
    var(--abyss-title-h2-size) - var(--abyss-title-heading-step)
  );
  --abyss-title-h4-size: calc(
    var(--abyss-title-h3-size) - var(--abyss-title-heading-step)
  );
  --abyss-title-h1-underline-width: 98px;

  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0;
  width: 100%;
  line-height: 1.35;
  text-transform: none;
  letter-spacing: normal;

  &__content {
    min-width: 0;
    display: contents;
  }

  &__row {
    display: contents;
  }

  &__text {
    min-width: 0;
  }

  &__text-label {
    min-width: 0;
  }

  &__icon {
    flex-shrink: 0;
    font-size: var(--icon-size);
    position: static;
  }

  &--h1 {
    --font-size: var(--abyss-title-h1-size);
    --font-weight: 300;
    --icon-size: 32px;
    display: block;
    line-height: 32px;
    color: white;

    .abyss-title__content {
      display: inline-flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 8px;
      max-width: 100%;
    }

    .abyss-title__row {
      display: inline-flex;
      align-items: flex-start;
      gap: 8px;
    }

    .abyss-title__content::after {
      content: '';
      display: block;
      flex: none;
      width: var(--abyss-title-h1-underline-width);
      height: 1px;
      background-color: currentColor;
    }
  }

  &--h2 {
    --font-size: var(--abyss-title-h2-size);
    --font-weight: 400;
    --icon-size: 24px;
    line-height: 24px;
    color: white;
  }

  &--h3 {
    --font-size: 18px;
    --font-weight: 400;
    --icon-size: 22px;
    line-height: 22px;
    color: rgba(white, 0.8);

    .abyss-title__content {
      display: flex;
      align-items: center;
      gap: 8px;
      width: 100%;
      min-width: 0;
    }

    .abyss-title__row {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      flex: none;
    }

    .abyss-title__content::after {
      content: '';
      flex: 1;
      min-width: 0;
      height: 1px;
      align-self: center;
      background-color: rgba(white, 0.12);
    }
  }

  &--h4 {
    --font-size: 16px;
    --font-weight: 500;
    --icon-size: 20px;
    line-height: 20px;
    text-transform: uppercase;
    color: rgba(white, 0.6);

    .abyss-title__text-label {
      position: relative;
      top: 1px;
      font-weight: 600;
    }
  }

  &--h5 {
    --font-size: 14px;
    --font-weight: 500;
    --icon-size: 18px;
    width: auto;
    line-height: 18px;
    text-transform: none;
    color: black;

    .abyss-title__content {
      display: inline-flex;
      align-items: stretch;
      gap: 8px;
      min-width: 0;
    }

    .abyss-title__row {
      display: inline-flex;
      align-items: stretch;
      gap: 8px;
      min-width: 0;
    }

    .abyss-title__icon,
    .abyss-title__text {
      display: inline-flex;
      align-items: center;
      height: 20px;
      border-radius: 4px;
      background-color: white;
      color: black;
    }

    .abyss-title__text-label {
      &::selection {
        background-color: black;
        color: white;
      }
    }

    .abyss-title__icon {
      flex: none;
      justify-content: center;
      width: 20px;
      height: 20px;
      padding: 0;
    }

    .abyss-title__text {
      min-width: 0;
      padding: 0 6px;
    }
  }

  &--h6 {
    --font-size: 12px;
    --font-weight: 500;
    --icon-size: 18px;
    width: auto;
    line-height: 18px;
    text-transform: none;
    color: black;

    .abyss-title__content {
      display: inline-flex;
      align-items: stretch;
      gap: 5px;
      min-width: 0;
    }

    .abyss-title__row {
      display: inline-flex;
      align-items: stretch;
      gap: 5px;
      min-width: 0;
    }

    .abyss-title__icon,
    .abyss-title__text {
      display: inline-flex;
      align-items: center;
      height: 20px;
      border-radius: 5px;
      background-color: rgba(white, 0.8);
      color: black;
    }

    .abyss-title__text-label {
      position: relative;
      top: 1px;
      font-weight: 700;
      text-transform: uppercase;

      &::selection {
        background-color: black;
        color: white;
      }
    }

    .abyss-title__icon {
      flex: none;
      justify-content: center;
      width: 20px;
      height: 20px;
      padding: 0;
    }

    .abyss-title__text {
      min-width: 0;
      padding: 0 6px;
    }
  }

  font-size: var(--font-size);
  font-weight: var(--font-weight);
}
</style>
