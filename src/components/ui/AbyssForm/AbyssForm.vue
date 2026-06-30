<template>
  <q-form
    ref="formRef"
    class="abyss-form"
    :greedy="greedy"
    :autofocus="autofocus"
    :novalidate="novalidate"
    @submit="handleSubmit"
  >
    <slot />
  </q-form>
</template>

<script setup lang="ts">
import { onBeforeUnmount, ref, toRaw, watch } from 'vue';
import type { QForm } from 'quasar';
import { debounce } from '@/utils/debounce';

/** Snapshot stanu formularza przekazywany w zdarzeniach. */
export type AbyssFormModel = Record<string, unknown>;

export interface AbyssFormProps {
  /** Stan formularza — pola w slocie bindują się przez `v-model` do tego obiektu. */
  modelValue: AbyssFormModel;
  /**
   * Gdy `true`, każda zmiana `modelValue` emituje `@update-form` z debouncem.
   * Używaj dla ustawień synchronizowanych ze store.
   */
  sync?: boolean;
  /** Opóźnienie debounce dla `@update-form` (ms). */
  debounce?: number;
  greedy?: boolean;
  autofocus?: boolean;
  novalidate?: boolean;
  class?: string;
  style?: string | Record<string, string>;
}

const props = withDefaults(defineProps<AbyssFormProps>(), {
  sync: true,
  debounce: 300,
  greedy: false,
  autofocus: false,
  novalidate: false,
});

const emit = defineEmits<{
  updateForm: [value: AbyssFormModel];
  submitForm: [value: AbyssFormModel];
}>();

const formRef = ref<QForm | null>(null);

function cloneFormValues(values: AbyssFormModel): AbyssFormModel {
  return structuredClone(toRaw(values)) as AbyssFormModel;
}

const debouncedEmitUpdateForm = debounce((values: AbyssFormModel) => {
  emit('updateForm', cloneFormValues(values));
}, props.debounce);

watch(
  () => props.modelValue,
  (values) => {
    if (!props.sync) {
      return;
    }

    debouncedEmitUpdateForm(values);
  },
  { deep: true },
);

onBeforeUnmount(() => {
  debouncedEmitUpdateForm.cancel();
});

function handleSubmit(): void {
  emit('submitForm', cloneFormValues(props.modelValue));
}

defineExpose({
  validate: () => formRef.value?.validate(),
  resetValidation: () => formRef.value?.resetValidation(),
  submit: (event?: Event) => formRef.value?.submit(event),
  reset: () => formRef.value?.reset(),
  focus: () => formRef.value?.focus(),
  getValidationComponents: () => formRef.value?.getValidationComponents(),
});
</script>

<style scoped lang="scss">
.abyss-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
</style>
