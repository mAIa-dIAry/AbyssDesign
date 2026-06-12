import type { App, InjectionKey, Ref } from 'vue';
import { inject, ref } from 'vue';

export interface KeyboardState {
  isKeyboardVisible: Ref<boolean>;
  keyboardHeight: Ref<number>;
}

export const KEYBOARD_STATE_KEY: InjectionKey<KeyboardState> =
  Symbol('abyss-keyboard-state');

function createWebKeyboardState(): KeyboardState {
  return {
    isKeyboardVisible: ref(false),
    keyboardHeight: ref(0),
  };
}

/** Web stub — konsumenci mobilni mogą nadpisać przez `installKeyboardState`. */
export function useKeyboardState(): KeyboardState {
  return inject(KEYBOARD_STATE_KEY, createWebKeyboardState(), true);
}

/** Rejestruje implementację klawiatury (np. Capacitor) w boot aplikacji. */
export function installKeyboardState(app: App, state: KeyboardState): void {
  app.provide(KEYBOARD_STATE_KEY, state);
}
