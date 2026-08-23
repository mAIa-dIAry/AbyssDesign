<template>
  <div
    :class="['abyss-template-login', `device--${device}`, $props.class]"
    :style="[rootStyle, style]"
  >
    <div class="abyss-template-login__viewport">
      <div class="abyss-template-login__sizer">
        <div class="abyss-template-login__container">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { ABYSS_TEMPLATE_LOGIN_MAX_WIDTH } from './AbyssTemplateLogin.constants';

export interface AbyssTemplateLoginProps {
  /** Urządzenie — determinuje preset paddingów viewportu (SCSS). */
  device: 'mobile' | 'desktop' | 'web';
  class?:
    | string
    | Record<string, boolean>
    | Array<string | Record<string, boolean>>;
  style?: string | Record<string, string>;
}

withDefaults(defineProps<AbyssTemplateLoginProps>(), {
  class: '',
  style: '',
});

const rootStyle = computed(() => ({
  '--abyss-template-login-max-width': ABYSS_TEMPLATE_LOGIN_MAX_WIDTH,
}));
</script>

<style scoped lang="scss">
.abyss-template-login {
  --abyss-template-login-padding-block: 24px;
  --abyss-template-login-padding-inline: 24px;

  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  min-height: 0;

  &.device--desktop,
  &.device--web {
    --abyss-template-login-padding-block: 24px;
    --abyss-template-login-padding-inline: 24px;
  }

  &.device--mobile {
    --abyss-template-login-padding-block: 8px;
    --abyss-template-login-padding-inline: 8px;
  }

  &__viewport {
    box-sizing: border-box;
    flex: 1 1 auto;
    width: 100%;
    height: 100%;
    min-height: 0;
    overflow: auto;
    padding-top: max(
      var(--abyss-template-login-padding-block),
      env(safe-area-inset-top, 0px)
    );
    padding-bottom: max(
      var(--abyss-template-login-padding-block),
      env(safe-area-inset-bottom, 0px)
    );
    padding-left: max(
      var(--abyss-template-login-padding-inline),
      env(safe-area-inset-left, 0px)
    );
    padding-right: max(
      var(--abyss-template-login-padding-inline),
      env(safe-area-inset-right, 0px)
    );

    @include scrollbar;
  }

  &__sizer {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 100%;
  }

  &__container {
    box-sizing: border-box;
    flex-shrink: 0;
    width: 100%;
    max-width: var(--abyss-template-login-max-width, 360px);
    margin-block: auto;
  }
}
</style>
