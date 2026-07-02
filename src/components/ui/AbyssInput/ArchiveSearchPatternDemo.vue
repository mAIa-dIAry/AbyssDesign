<template>
  <div class="archive-search-pattern">
    <div class="archive-search-pattern__toolbar">
      <AbyssInput
        v-model="searchQuery"
        type="search"
        :placeholder="searchPlaceholder"
        :loading="isLoading"
        class="archive-search-pattern__input"
        @keydown.capture="handleSearchKeydown"
      >
        <template #prepend>
          <div class="archive-search-pattern__search-prepend">
            <AbyssButton
              flat
              size="medium"
              icon="sym_r_calendar_month"
              class="icon-button"
              aria-label="Wybierz datę"
              title="Wybierz datę"
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
              class="archive-search-pattern__date-chip"
              @remove="clearDateToken"
            >
              {{ `@${selectedDateToken}` }}
            </q-chip>
          </div>
        </template>
      </AbyssInput>
    </div>

    <div class="archive-search-pattern__controls">
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
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import AbyssButton from '@/components/ui/AbyssButton/AbyssButton.vue';
import AbyssDate from '@/components/ui/AbyssDate/AbyssDate.vue';
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

function handleDatePickerDraftUpdate(dateValue: string | null): void {
  if (!dateValue) {
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

<style scoped lang="scss">
.archive-search-pattern {
  width: 100%;
  max-width: 720px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.archive-search-pattern__toolbar {
  display: flex;
  width: 100%;
}

.archive-search-pattern__input {
  flex: 1 1 auto;
  width: 100%;
  min-width: 0;
}

.archive-search-pattern__search-prepend {
  display: flex;
  align-items: center;
  gap: 4px;
  min-width: 0;
}

.archive-search-pattern__date-chip.q-chip {
  background: rgba(white, 0.1);
  color: white;
  border: 1px solid rgba(white, 0.12);
  border-radius: 6px;
  box-shadow: $shadow-small;
  display: flex;
  height: 28px;
  margin: -14px 0 -14px -12px;
  padding: 8px;

  :deep(.q-chip__content) {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  :deep(.q-chip__icon--remove) {
    color: rgba(white, 0.65);
  }
}

.archive-search-pattern__controls {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
</style>
