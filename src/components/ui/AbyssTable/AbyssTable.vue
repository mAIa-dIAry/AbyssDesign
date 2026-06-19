<template>
  <q-table
    class="abyss-table"
    :class="[
      {
        'abyss-table--as-card': asCard,
        'abyss-table--fixed-height': hasFixedHeight,
      },
      props.class,
    ]"
    :style="tableContainerStyle"
    dark
    v-bind="tableProps"
    v-model:pagination="pagination"
    :filter="filter"
  >
    <template #top-left>
      <slot name="top-left">
        <AbyssTitle
          v-if="props.title"
          class="abyss-table__title"
          :label="String(props.title)"
          v-bind="props.titleIcon ? { icon: props.titleIcon } : {}"
        />
      </slot>
    </template>

    <template #top-right>
      <slot name="top-right">
        <div class="abyss-table__top-actions">
          <div class="abyss-table__search">
            <AbyssInput
              v-model="filter"
              type="text"
              size="small"
              flat
              debounce="300"
              :placeholder="t('ui.table.search')"
            >
              <template #append>
                <AbyssButton
                  flat
                  size="small"
                  icon="sym_r_search"
                  class="icon-button"
                />
              </template>
            </AbyssInput>
          </div>

          <div
            v-if="$slots['header-append']"
            class="abyss-table__header-append"
          >
            <slot name="header-append" />
          </div>
        </div>
      </slot>
    </template>

    <template #header="headerProps">
      <slot name="header" v-bind="headerProps">
        <q-tr :props="headerProps">
          <q-th auto-width />
          <q-th
            v-for="col in headerProps.cols"
            :key="col.name"
            :props="headerProps"
          >
            {{ col.label }}
          </q-th>
        </q-tr>
      </slot>
    </template>

    <template #body="bodyProps">
      <slot name="body" v-bind="bodyProps">
        <q-tr :props="bodyProps">
          <q-td auto-width>
            <AbyssButton
              flat
              size="small"
              :icon="bodyProps.expand ? 'sym_r_remove' : 'sym_r_add'"
              @click="bodyProps.expand = !bodyProps.expand"
            />
          </q-td>
          <template v-for="col in bodyProps.cols" :key="col.name">
            <slot
              :name="`body-cell-${col.name}`"
              v-bind="cellScope(bodyProps, col)"
            >
              <q-td :props="cellScope(bodyProps, col)">
                {{ col.value }}
              </q-td>
            </slot>
          </template>
        </q-tr>
        <q-tr v-show="bodyProps.expand" :props="bodyProps">
          <q-td colspan="100%">
            <slot name="row-expand" v-bind="bodyProps">
              <div class="text-left">
                This is expand slot for row above: {{ bodyProps.row.name }}.
              </div>
            </slot>
          </q-td>
        </q-tr>
      </slot>
    </template>

    <template #bottom="bottomProps">
      <slot name="bottom" v-bind="bottomProps">
        <div class="abyss-table__bottom row items-center justify-end">
          <div class="q-table__separator col" />

          <div
            v-if="showRowsPerPageSelect"
            class="abyss-table__rows-per-page"
          >
            <span class="abyss-table__rows-per-page-label">
              {{ t('ui.table.recordsPerPage') }}
            </span>
            <div class="abyss-table__rows-per-page-select">
              <AbyssSelect
                :model-value="pagination.rowsPerPage"
                :options="rowsPerPageSelectOptions"
                emit-value
                map-options
                size="small"
                flat
                hide-bottom-space
                @update:model-value="handleRowsPerPageChange"
              />
            </div>
          </div>

          <div class="abyss-table__pagination">
            <span
              v-if="pagination.rowsPerPage !== 0"
              class="abyss-table__pagination-label"
            >
              {{ getPaginationText(bottomProps) }}
            </span>

            <div
              v-if="pagination.rowsPerPage !== 0 && bottomProps.pagesNumber > 1"
              class="abyss-table__pagination-actions"
            >
              <AbyssButton
                v-if="bottomProps.pagesNumber > 2"
                flat
                size="small"
                icon="sym_r_first_page"
                :disable="bottomProps.isFirstPage"
                @click="bottomProps.firstPage"
              />
              <AbyssButton
                flat
                size="small"
                icon="sym_r_chevron_left"
                :disable="bottomProps.isFirstPage"
                @click="bottomProps.prevPage"
              />
              <AbyssButton
                flat
                size="small"
                icon="sym_r_chevron_right"
                :disable="bottomProps.isLastPage"
                @click="bottomProps.nextPage"
              />
              <AbyssButton
                v-if="bottomProps.pagesNumber > 2"
                flat
                size="small"
                icon="sym_r_last_page"
                :disable="bottomProps.isLastPage"
                @click="bottomProps.lastPage"
              />
            </div>
          </div>
        </div>
      </slot>
    </template>

    <template
      v-for="slotName in forwardedSlotNames"
      #[slotName]="slotProps"
      :key="slotName"
    >
      <slot :name="slotName" v-bind="slotProps ?? {}" />
    </template>
  </q-table>
</template>

<script setup lang="ts">
import { computed, ref, useSlots, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import type { QTableProps } from 'quasar';
import AbyssInput from '@/components/ui/AbyssInput/AbyssInput.vue';
import AbyssButton from '@/components/ui/AbyssButton/AbyssButton.vue';
import AbyssSelect from '@/components/ui/AbyssSelect/AbyssSelect.vue';
import AbyssTitle from '@/components/ui/AbyssTitle/AbyssTitle.vue';

const DEFAULT_ROWS_PER_PAGE_OPTIONS = [5, 7, 10, 15, 20, 25, 50, 0] as const;

const RESERVED_SLOTS = [
  'top-left',
  'top-right',
  'header-append',
  'header',
  'body',
  'row-expand',
  'bottom',
] as const;

type LockedQTableProps = 'dark' | 'flat' | 'bordered' | 'filter' | 'pagination';

type AbyssTableBottomScope = {
  pagination: {
    page: number;
    rowsPerPage: number;
  };
  pagesNumber: number;
  isFirstPage: boolean;
  isLastPage: boolean;
  firstPage: () => void;
  prevPage: () => void;
  nextPage: () => void;
  lastPage: () => void;
};

export interface AbyssTableProps
  extends Omit<QTableProps, LockedQTableProps> {
  class?:
    | string
    | Record<string, boolean>
    | Array<string | Record<string, boolean>>;
  pagination?: QTableProps['pagination'];
  /** Ikona obok tytułu w `#top-left` (przekazywana do `AbyssTitle`). */
  titleIcon?: string;
  /**
   * Wysokość kontenera tabeli. `0` (domyślnie) — auto, bez wewnętrznego scrolla.
   * Liczba traktowana jako px; string np. `"min(70vh, 640px)"`.
   */
  height?: number | string;
  /** Styl kontenera jak `AbyssCard` — tło, radius 16px i cień karty. */
  asCard?: boolean;
}

const props = withDefaults(defineProps<AbyssTableProps>(), {
  asCard: false,
  height: 0,
});

const { t } = useI18n();

const filter = ref('');

const pagination = ref({
  page: 1,
  rowsPerPage: 5,
  descending: false,
  sortBy: props.columns?.[0]?.name ?? null,
});

watch(
  () => props.pagination,
  (value) => {
    if (!value) return;
    pagination.value = { ...pagination.value, ...value };
  },
  { deep: true, immediate: true },
);

watch(
  () => props.columns?.[0]?.name,
  (sortBy) => {
    if (sortBy && pagination.value.sortBy == null) {
      pagination.value.sortBy = sortBy;
    }
  },
);

const slots = useSlots();

const forwardedSlotNames = computed(() =>
  Object.keys(slots).filter(
    (name) => !RESERVED_SLOTS.includes(name as (typeof RESERVED_SLOTS)[number]),
  ),
);

const rowsPerPageSelectOptions = computed(() => {
  const options = props.rowsPerPageOptions ?? [...DEFAULT_ROWS_PER_PAGE_OPTIONS];

  return options.map((value) => ({
    label: value === 0 ? t('ui.table.allRows') : String(value),
    value,
  }));
});

const showRowsPerPageSelect = computed(
  () => rowsPerPageSelectOptions.value.length > 1,
);

const filteredRowsCount = computed(() => {
  const needle = filter.value.trim().toLowerCase();
  const rows = props.rows ?? [];

  if (!needle) return rows.length;

  return rows.filter((row) =>
    Object.values(row).some((value) =>
      String(value ?? '')
        .toLowerCase()
        .includes(needle),
    ),
  ).length;
});

function getPaginationText(scope: AbyssTableBottomScope): string {
  const total = filteredRowsCount.value;
  const { page, rowsPerPage } = scope.pagination;

  if (rowsPerPage === 0) {
    return t('ui.table.pagination', { start: 1, end: total, total });
  }

  const start = total === 0 ? 0 : (page - 1) * rowsPerPage + 1;
  const end = Math.min(page * rowsPerPage, total);

  return t('ui.table.pagination', { start, end, total });
}

function handleRowsPerPageChange(value: unknown) {
  if (typeof value !== 'number') return;

  pagination.value = {
    ...pagination.value,
    page: 1,
    rowsPerPage: value,
  };
}

function cellScope(
  bodyProps: { row: unknown; [key: string]: unknown },
  col: { name: string; value: unknown },
) {
  return {
    ...bodyProps,
    key: col.name,
    col,
    value: col.value,
    row: bodyProps.row,
  };
}

const hasFixedHeight = computed(() => {
  const { height } = props;

  if (height == null || height === '') return false;
  if (height === 0 || height === '0') return false;

  return true;
});

const tableContainerStyle = computed(() => {
  if (!hasFixedHeight.value) return undefined;

  const { height } = props;

  return {
    height: typeof height === 'number' ? `${height}px` : height,
  };
});

const tableProps = computed((): Omit<QTableProps, LockedQTableProps> => {
  const {
    class: _class,
    pagination: _pagination,
    title: _title,
    titleIcon: _titleIcon,
    height: _height,
    asCard: _asCard,
    onVirtualScroll: _onVirtualScroll,
    ...rest
  } = props;
  return rest as Omit<QTableProps, LockedQTableProps>;
});

defineOptions({
  inheritAttrs: false,
});
</script>

<style scoped lang="scss">
.abyss-table__title {
  margin-left: 8px;
  width: auto;
}

.abyss-table__top-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  flex: 1 1 auto;
  width: 100%;
  min-width: 0;
}

.abyss-table__header-append {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.abyss-table__search {
  display: flex;
  flex: 0 1 300px;
  width: 100%;
  max-width: 300px;
  min-width: 0;

  :deep(.abyss-input-container),
  :deep(.abyss-input-wrapper),
  :deep(.abyss-input),
  :deep(.q-field) {
    flex: 1 1 auto;
    width: 100%;
    min-width: 0;
  }

  :deep(.abyss-input-container) {
    --font-size: 14px;
    --padding-y: 12px;
    --icon-size: 16px;
    --border-radius: 6px;
  }

  :deep(.q-field__control-container) {
    flex: 1 1 auto;
    min-width: 0;
  }
}

.abyss-table__bottom {
  flex: 1 1 auto;
  width: 100%;
  min-width: 0;
  gap: 16px;
  background: transparent;
  box-shadow: none;
}

.abyss-table__rows-per-page {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
  min-width: max-content;
}

.abyss-table__rows-per-page-label {
  flex-shrink: 0;
  white-space: nowrap;
}

.abyss-table__rows-per-page-select {
  flex: 0 0 104px;
  width: 104px;
  min-width: 104px;

  :deep(.abyss-select-container) {
    width: 100%;
  }

  :deep(.abyss-select-wrapper),
  :deep(.abyss-select),
  :deep(.q-field) {
    width: 100%;
  }
}

.abyss-table__pagination {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  min-width: max-content;

  &:empty {
    display: none;
  }
}

.abyss-table__pagination-actions {
  display: flex;
  align-items: center;
  gap: 4px;
}

.abyss-table__pagination-label {
  flex-shrink: 0;
  white-space: nowrap;
  margin-right: 8px;
}

.abyss-table {
  --panel-radius: 12px;
  --panel-background: #{rgba(white, 0.01)};
  --table-header-background: #{rgba(white, 0.08)};
  --table-separator-color: #{rgba(white, 0.28)};

  box-sizing: border-box;
  width: 100%;
  min-width: 0;
  container-type: inline-size;
  border-radius: var(--panel-radius);
  background: var(--panel-background);
  box-shadow: $shadow-small, $shadow-frame-soft;
  overflow: hidden;
  height: auto;

  :deep(.q-table__top),
  :deep(.q-table__bottom),
  :deep(.q-table__middle) {
    background-color: var(--panel-background);
  }

  :deep(.q-table__top),
  :deep(.q-table__bottom) {
    padding: 8px;

    .q-table__separator {
      display: none;
    }
  }

  :deep(.q-table__top) {
    gap: 16px;
  }

  :deep(.q-table__top > .q-table__control:has(.abyss-table__top-actions)) {
    flex: 1 1 auto;
    width: 0;
    min-width: 200px;
    max-width: none;
    margin-left: auto;
  }

  :deep(.q-table__top),
  :deep(.q-table__bottom),
  :deep(thead tr th),
  :deep(tbody td) {
    border-color: var(--table-separator-color);
  }

  :deep(.q-table__bottom) {
    width: 100%;
  }

  :deep(thead) {
    position: relative;
    z-index: 1;

    &::before {
      content: '';
      position: absolute;
      inset: 0;
      background-color: var(--table-header-background);
      pointer-events: none;
    }
  }

  :deep(thead tr th) {
    position: relative;
    z-index: 1;
    background-color: transparent;
    border-top: 1px solid var(--table-separator-color);
    border-bottom: 1px solid var(--table-separator-color);
  }

  :deep(tbody tr:not(:last-child) > td) {
    border-color: var(--table-separator-color);
  }

  :deep(.q-table__middle.scroll) {
    @include scrollbar;
  }

  &:not(.abyss-table--fixed-height) {
    :deep(.q-table__middle.scroll) {
      overflow-x: auto;
      overflow-y: hidden;
    }
  }

  &--fixed-height {
    :deep(.q-table__middle) {
      flex: 1 1 auto;
      min-height: 0;
    }

    :deep(thead) {
      position: sticky;
      top: 0;
      z-index: 2;

      &::before {
        -webkit-backdrop-filter: blur(20px);
        backdrop-filter: blur(20px);
      }
    }

    :deep(tbody) {
      scroll-margin-top: 48px;
    }
  }

  &--as-card {
    --panel-radius: 16px;
    --panel-background: transparent;
    --table-header-background: #{rgba(white, 0.04)};
    --table-separator-color: #{rgba(white, 0.14)};

    background: rgba(black, 0.2);
    border-radius: 16px;
    box-shadow: $shadow-card, $shadow-frame-medium;
    border-bottom: 1px solid rgba(black, 0.2);

    :deep(.q-table__top),
    :deep(.q-table__bottom),
    :deep(.q-table__middle) {
      background-color: transparent;
    }

    :deep(.q-table__top),
    :deep(.q-table__bottom) {
      padding: 12px;
    }

    .abyss-table__title {
      margin-left: 4px;
    }

    :deep(tbody td::before) {
      background: rgba(white, 0.035);
    }
  }
}
</style>
