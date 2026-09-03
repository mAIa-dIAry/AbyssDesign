<template>
  <div class="abyss-app-lock" :class="$props.class" :style="style">
    <p v-if="message" class="abyss-app-lock__message">{{ message }}</p>

    <AbyssPinInput
      :model-value="enteredPin"
      :pin-length="pinLength"
      :error-message="errorMessage"
      :aria-label="dotsAriaLabel"
    />

    <AbyssNumericKeypad
      class="abyss-app-lock__keypad"
      :disable="disable"
      :can-backspace="enteredLength > 0"
      :chaos="chaos"
      :backspace-label="backspaceLabel"
      :keypad-label="keypadLabel"
      @digit="handleDigitPress"
      @backspace="handleBackspace"
    />

    <AbyssButton
      v-if="showBiometricUnlock"
      class="abyss-app-lock__biometric"
      icon="sym_r_fingerprint"
      :label="resolvedBiometricUnlockLabel"
      :loading="isUnlocking"
      :disable="disable"
      full-width
      @click="emit('unlock-biometric')"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import AbyssButton from '@/components/ui/AbyssButton/AbyssButton.vue';
import AbyssNumericKeypad from '@/components/ui/AbyssNumericKeypad/AbyssNumericKeypad.vue';
import AbyssPinInput from '@/components/ui/AbyssPinInput/AbyssPinInput.vue';
import { PIN_LENGTH } from '../../../utils/pinCode';

export interface AbyssAppLockProps {
  message?: string;
  errorMessage?: string;
  disable?: boolean;
  showBiometricUnlock?: boolean;
  isUnlocking?: boolean;
  /** Nadpisuje domyślną etykietę z `ui.appLock.biometricUnlock`. */
  biometricUnlockLabel?: string;
  /** Nadpisuje domyślną nazwę dostępną z `ui.keypad.backspace`. */
  backspaceLabel?: string;
  /** Nadpisuje domyślną nazwę dostępną z `ui.pinInput.ariaLabel`. */
  dotsAriaLabel?: string;
  /** Nadpisuje domyślną nazwę dostępną z `ui.keypad.label`. */
  keypadLabel?: string;
  pinLength?: number;
  chaos?: boolean;
  resetToken?: number;
  style?: string | Record<string, string>;
  class?:
    | string
    | Record<string, boolean>
    | Array<string | Record<string, boolean>>;
}

const props = withDefaults(defineProps<AbyssAppLockProps>(), {
  message: '',
  errorMessage: '',
  disable: false,
  showBiometricUnlock: false,
  isUnlocking: false,
  biometricUnlockLabel: '',
  backspaceLabel: '',
  dotsAriaLabel: '',
  keypadLabel: '',
  pinLength: PIN_LENGTH,
  chaos: false,
  resetToken: 0,
  style: '',
  class: '',
});

const emit = defineEmits<{
  complete: [pin: string];
  'unlock-biometric': [];
}>();

const { t } = useI18n();

const resolvedBiometricUnlockLabel = computed(
  () => props.biometricUnlockLabel || t('ui.appLock.biometricUnlock'),
);

const enteredPin = ref('');
const enteredLength = computed(() => enteredPin.value.length);

watch(
  () => props.resetToken,
  () => {
    enteredPin.value = '';
  },
);

watch(
  () => props.errorMessage,
  (errorMessage) => {
    if (errorMessage) {
      enteredPin.value = '';
    }
  },
);

function handleDigitPress(digit: string): void {
  if (props.disable || enteredPin.value.length >= props.pinLength) {
    return;
  }

  enteredPin.value = `${enteredPin.value}${digit}`;

  if (enteredPin.value.length === props.pinLength) {
    emit('complete', enteredPin.value);
  }
}

function handleBackspace(): void {
  if (props.disable || enteredPin.value.length === 0) {
    return;
  }

  enteredPin.value = enteredPin.value.slice(0, -1);
}
</script>

<style scoped lang="scss">
.abyss-app-lock {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 16px;
  width: 100%;

  &__message {
    margin: 0;
    width: 100%;
    text-align: center;
    opacity: 0.8;
  }

  &__keypad {
    width: 100%;
  }

  &__biometric {
    width: 100%;
  }
}
</style>
