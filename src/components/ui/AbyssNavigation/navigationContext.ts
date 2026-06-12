import type { InjectionKey, Ref } from 'vue';

export const NAVIGATION_CURRENT_ROUTE_KEY: InjectionKey<Ref<string>> = Symbol(
  'navigationCurrentRoute',
);
