<template>
  <AbyssGrid row-gap="16px" data-testid="archive-search-pattern">
    <AbyssInput
      v-model="searchQuery"
      type="search"
      :placeholder="searchPlaceholder"
      :loading="isLoading"
      data-testid="archive-search-input"
      @keydown.capture="handleSearchKeydown"
    >
      <template #prepend>
        <AbyssButton
          flat
          size="medium"
          icon="sym_r_calendar_month"
          aria-label="Wybierz datę"
          title="Wybierz datę"
          data-testid="archive-search-date-trigger"
          @mousedown.prevent
        >
          <q-popup-proxy
            ref="datePopupRef"
            class="abyss-date-menu"
            :breakpoint="0"
            transition-show="abyss-dialog-jump-down"
            transition-hide="abyss-dialog-jump-up"
            @before-show="handleDatePickerBeforeShow"
          >
            <AbyssDate
              :model-value="datePickerValue"
              mask="YYYY-MM-DD"
              @update:model-value="handleDatePickerDraftUpdate"
              @confirm="handleDatePickerConfirm"
              @close="closeDatePopup"
            />
          </q-popup-proxy>
        </AbyssButton>

        <q-chip
          v-if="selectedDateToken"
          removable
          remove-icon="sym_r_close"
          dense
          data-testid="archive-search-date-chip"
          @remove="clearDateToken"
        >
          {{ `@${selectedDateToken}` }}
        </q-chip>
      </template>
    </AbyssInput>

    <AbyssGrid column-gap="8px" row-gap="8px">
      <AbyssButton
        flat
        size="small"
        :label="isLoading ? 'Zatrzymaj ładowanie' : 'Symuluj ładowanie'"
        @click="toggleLoading"
      />
      <AbyssButton
        flat
        size="small"
        label="Ustaw filtr daty"
        @click="applyDemoDateFilter"
      />
      <AbyssButton
        flat
        size="small"
        label="Wyczyść filtr daty"
        @click="clearDateToken"
      />
    </AbyssGrid>
  </AbyssGrid>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import AbyssButton from '@/components/ui/AbyssButton/AbyssButton.vue';
import AbyssDate, {
  type AbyssDateModelValue,
} from '@/components/ui/AbyssDate/AbyssDate.vue';
import AbyssGrid from '@/components/ui/AbyssGrid/AbyssGrid.vue';
import AbyssInput from '@/components/ui/AbyssInput/AbyssInput.vue';
import type { QPopupProxy } from 'quasar';

function formatDateInputValue(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

const searchQuery = ref('');
const selectedDateToken = ref<string | null>(null);
const datePickerValue = ref(formatDateInputValue(new Date()));
const isLoading = ref(false);
const datePopupRef = ref<QPopupProxy | null>(null);

const searchPlaceholder = computed(() =>
  selectedDateToken.value ? '' : 'Szukaj frazy we wpisach',
);

function handleDatePickerBeforeShow(): void {
  datePickerValue.value =
    selectedDateToken.value ?? formatDateInputValue(new Date());
}

function handleDatePickerDraftUpdate(dateValue: AbyssDateModelValue): void {
  if (!dateValue || typeof dateValue !== 'string') {
    return;
  }

  datePickerValue.value = dateValue;
}

function handleDatePickerConfirm(): void {
  handleDatePickerUpdate(datePickerValue.value);
}

function closeDatePopup(): void {
  datePopupRef.value?.hide();
}

function handleDatePickerUpdate(dateValue: string | null): void {
  if (!dateValue) {
    return;
  }

  datePickerValue.value = dateValue;
  datePopupRef.value?.hide();
  searchQuery.value = '';
  selectedDateToken.value = dateValue;
}

function clearDateToken(): void {
  selectedDateToken.value = null;
  datePickerValue.value = formatDateInputValue(new Date());
}

function handleSearchKeydown(event: KeyboardEvent): void {
  if (
    selectedDateToken.value &&
    searchQuery.value === '' &&
    (event.key === 'Backspace' || event.key === 'Delete')
  ) {
    clearDateToken();
    event.preventDefault();
  }
}

function applyDemoDateFilter(): void {
  handleDatePickerUpdate('2026-07-01');
}

function toggleLoading(): void {
  isLoading.value = !isLoading.value;
}
</script>
