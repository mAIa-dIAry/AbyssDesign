import type { Meta, StoryObj } from "@storybook/vue3";
import { expect, waitFor, within } from "storybook/test";
import { ref } from "vue";
import AbyssButton from "@/components/ui/AbyssButton/AbyssButton.vue";
import AbyssDialog from "@/components/ui/AbyssDialog/AbyssDialog.vue";
import AbyssDropdown from "@/components/ui/AbyssDropdown/AbyssDropdown.vue";
import AbyssTable from "@/components/ui/AbyssTable/AbyssTable.vue";
import { withAbyssBackground } from "@/stories/AbyssBackgroundDecorator";
import { withAbyssBackgroundDialogScope } from "@/stories/StoryDialogScopeDecorator";

const columns = [
  {
    name: "name",
    required: true,
    label: "Dessert (100g serving)",
    align: "left" as const,
    field: (row: { name: string }) => row.name,
    format: (val: string) => `${val}`,
    sortable: true,
  },
  {
    name: "calories",
    align: "center" as const,
    label: "Calories",
    field: "calories",
    sortable: true,
  },
  { name: "fat", label: "Fat (g)", field: "fat", sortable: true },
  { name: "carbs", label: "Carbs (g)", field: "carbs", sortable: true },
  { name: "protein", label: "Protein (g)", field: "protein", sortable: true },
  { name: "sodium", label: "Sodium (mg)", field: "sodium", sortable: true },
  {
    name: "calcium",
    label: "Calcium (%)",
    field: "calcium",
    sortable: true,
    sort: (a: string, b: string) =>
      Number.parseInt(a, 10) - Number.parseInt(b, 10),
  },
  {
    name: "iron",
    label: "Iron (%)",
    field: "iron",
    sortable: true,
    sort: (a: string, b: string) =>
      Number.parseInt(a, 10) - Number.parseInt(b, 10),
  },
];

const rows = [
  {
    name: "Frozen Yogurt",
    calories: 159,
    fat: 6,
    carbs: 24,
    protein: 4,
    sodium: 87,
    calcium: "14%",
    iron: "1%",
  },
  {
    name: "Ice cream sandwich",
    calories: 237,
    fat: 9,
    carbs: 37,
    protein: 4.3,
    sodium: 129,
    calcium: "8%",
    iron: "1%",
  },
  {
    name: "Eclair",
    calories: 262,
    fat: 16,
    carbs: 23,
    protein: 6,
    sodium: 337,
    calcium: "6%",
    iron: "7%",
  },
  {
    name: "Cupcake",
    calories: 305,
    fat: 3.7,
    carbs: 67,
    protein: 4.3,
    sodium: 413,
    calcium: "3%",
    iron: "8%",
  },
  {
    name: "Gingerbread",
    calories: 356,
    fat: 16,
    carbs: 49,
    protein: 3.9,
    sodium: 327,
    calcium: "7%",
    iron: "16%",
  },
  {
    name: "Jelly bean",
    calories: 375,
    fat: 0,
    carbs: 94,
    protein: 0,
    sodium: 50,
    calcium: "0%",
    iron: "0%",
  },
  {
    name: "Lollipop",
    calories: 392,
    fat: 0.2,
    carbs: 98,
    protein: 0,
    sodium: 38,
    calcium: "0%",
    iron: "2%",
  },
  {
    name: "Honeycomb",
    calories: 408,
    fat: 3.2,
    carbs: 87,
    protein: 6.5,
    sodium: 562,
    calcium: "0%",
    iron: "45%",
  },
  {
    name: "Donut",
    calories: 452,
    fat: 25,
    carbs: 51,
    protein: 4.9,
    sodium: 326,
    calcium: "2%",
    iron: "22%",
  },
  {
    name: "KitKat",
    calories: 518,
    fat: 26,
    carbs: 65,
    protein: 7,
    sodium: 54,
    calcium: "12%",
    iron: "6%",
  },
];

const meta: Meta<typeof AbyssTable> = {
  title: "UI/AbyssTable",
  component: AbyssTable,
  tags: ["autodocs"],
  decorators: [
    (story, context) =>
      context.parameters.abyssDialogScope
        ? withAbyssBackgroundDialogScope(story, context)
        : withAbyssBackground(story, context),
  ],
  argTypes: {
    asCard: {
      control: "boolean",
      description:
        "Styl kontenera jak AbyssCard — tło, border-radius 16px i cień karty",
      table: { defaultValue: { summary: "false" } },
    },
    expandable: {
      control: "boolean",
      description:
        "Włącza kolumnę rozwijania wierszy i slot row-expand. Domyślnie wyłączone.",
      table: { defaultValue: { summary: "false" } },
    },
    height: {
      control: "number",
      description:
        "Wysokość kontenera w px. 0 — auto, bez wewnętrznego scrolla i sticky header.",
      table: { defaultValue: { summary: "0" } },
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          "Opiniowany wrapper na `QTable`: ciemny motyw, wyszukiwarka, sortowanie, opcjonalne rozwijane wiersze i paginacja są wbudowane. " +
          "Domyślnie (`height=0`) tabela rośnie z treścią. Ustaw `height`, aby włączyć scroll wewnętrzny i sticky header. " +
          "Tryb bez `as-card` (domyślny) służy osadzonym tabelom parametrów — bez zaokrągleń i tła kontenera; tło ma wyłącznie pierwsza kolumna. " +
          "Rozwijanie wierszy wymaga `expandable` lub slotu `row-expand`.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof AbyssTable>;

export const BasePreset: Story = {
  name: "Preset bazowy",
  parameters: {
    docs: {
      description: {
        story:
          "Minimalne użycie komponentu — bez rozwijania wierszy, bez stylu karty.",
      },
      source: {
        code: `<AbyssTable
  title="Treats"
  :rows="rows"
  :columns="columns"
  row-key="name"
/>`,
      },
    },
  },
  render: () => ({
    components: { AbyssTable },
    setup() {
      return { columns, rows };
    },
    template: `
      <AbyssTable
        title="Treats"
        :rows="rows"
        :columns="columns"
        row-key="name"
      />
    `,
  }),
  play: async ({ canvasElement }) => {
    const table = canvasElement.querySelector(".abyss-table");
    await expect(table).not.toBeNull();
    await expect(table).not.toHaveClass("abyss-table--fixed-height");

    const title = canvasElement.querySelector(".abyss-table__title");
    await expect(title).not.toBeNull();
    await expect(title).toHaveTextContent("Treats");

    const expandButtons = canvasElement.querySelectorAll(
      ".abyss-table__expand-row, .abyss-table--expandable",
    );
    await expect(expandButtons.length).toBe(0);

    const searchInput = canvasElement.querySelector("input");
    await expect(searchInput).not.toBeNull();

    const pagination = canvasElement.querySelector(".q-table__bottom");
    await expect(pagination).not.toBeNull();
  },
};

const parameterColumns = [
  {
    name: "param",
    label: "Parametr",
    field: "param",
    align: "left" as const,
    style: "width: 35%",
  },
  {
    name: "value",
    label: "Wartość",
    field: "value",
    align: "left" as const,
  },
];

const parameterRows = [
  { id: "version", param: "Wersja", value: "1.0" },
  { id: "day", param: "Dzień", value: "2026-06-21" },
  {
    id: "summary",
    param: "Podsumowanie",
    value: "Druga notatka z dnia synchronizacji offline.",
  },
  {
    id: "state",
    param: "Aktualizacja stanu",
    value: "Synchronizacja offline zakończona.",
  },
  { id: "silence", param: "Ocena ciszy", value: "—" },
];

export const ParameterTable: Story = {
  name: "Tabela parametrów",
  parameters: {
    docs: {
      description: {
        story:
          "Tryb osadzony (bez `as-card`) — tabela klucz–wartość w dialogu lub panelu. " +
          "Brak zaokrągleń i tła kontenera; tło ma wyłącznie kolumna parametrów. " +
          "Rozwijanie wierszy domyślnie wyłączone.",
      },
      source: {
        code: `<AbyssTable
  :rows="rows"
  :columns="columns"
  row-key="id"
  hide-search
  :rows-per-page-options="[0]"
/>`,
      },
    },
  },
  render: () => ({
    components: { AbyssTable },
    setup() {
      return { columns: parameterColumns, rows: parameterRows };
    },
    template: `
      <AbyssTable
        :rows="rows"
        :columns="columns"
        row-key="id"
        hide-search
        :rows-per-page-options="[0]"
      />
    `,
  }),
  play: async ({ canvasElement }) => {
    const table = canvasElement.querySelector(".abyss-table");
    await expect(table).not.toBeNull();
    await expect(table).not.toHaveClass("abyss-table--as-card");
    await expect(table).not.toHaveClass("abyss-table--expandable");

    const paramCells = canvasElement.querySelectorAll(
      ".abyss-table__param-cell",
    );
    await expect(paramCells.length).toBeGreaterThan(0);
  },
};

export const ExpandableRows: Story = {
  name: "Rozwijane wiersze",
  parameters: {
    docs: {
      description: {
        story:
          "Prop `expandable` włącza kolumnę +/- i slot `row-expand`. " +
          "Bez tego propu wiersze nie rozwijają się.",
      },
      source: {
        code: `<AbyssTable
  expandable
  as-card
  title="Treats"
  :rows="rows"
  :columns="columns"
  row-key="name"
>
  <template #row-expand="bodyProps">
    Szczegóły: {{ bodyProps.row.name }}
  </template>
</AbyssTable>`,
      },
    },
  },
  render: () => ({
    components: { AbyssTable },
    setup() {
      return { columns, rows };
    },
    template: `
      <AbyssTable
        expandable
        as-card
        title="Treats"
        :rows="rows"
        :columns="columns"
        row-key="name"
      >
        <template #row-expand="bodyProps">
          <div class="text-left">
            Szczegóły: {{ bodyProps.row.name }}
          </div>
        </template>
      </AbyssTable>
    `,
  }),
  play: async ({ canvasElement }) => {
    const table = canvasElement.querySelector(".abyss-table");
    await expect(table).toHaveClass("abyss-table--expandable");
  },
};

export const AsCard: Story = {
  name: "Jako karta",
  parameters: {
    docs: {
      description: {
        story:
          "Wariant `as-card` — tło, zaokrąglenie i cień jak w `AbyssCard`.",
      },
      source: {
        code: `<AbyssTable
  as-card
  title="Treats"
  :rows="rows"
  :columns="columns"
  row-key="name"
/>`,
      },
    },
  },
  render: () => ({
    components: { AbyssTable },
    setup() {
      return { columns, rows };
    },
    template: `
      <AbyssTable
        as-card
        title="Treats"
        :rows="rows"
        :columns="columns"
        row-key="name"
      />
    `,
  }),
  play: async ({ canvasElement }) => {
    const table = canvasElement.querySelector(".abyss-table");
    await expect(table).toHaveClass("abyss-table--as-card");
  },
};

const recordColumns = [
  {
    name: "title",
    label: "Plan",
    field: "title",
    align: "left" as const,
    sortable: true,
  },
  {
    name: "owner",
    label: "Właściciel",
    field: "owner",
    align: "left" as const,
  },
  {
    name: "actions",
    label: "Akcje",
    field: "id",
    align: "right" as const,
  },
];

const recordRows = [
  { id: "onboarding", title: "Onboarding zespołu", owner: "Marta" },
  { id: "migration", title: "Migracja bazy", owner: "Tomasz" },
  { id: "audit", title: "Audyt bezpieczeństwa", owner: "Iga" },
];

export const CellActions: Story = {
  name: "Akcje w komórkach",
  parameters: {
    abyssDialogScope: true,
    docs: {
      description: {
        story:
          "Akcja osadzona w komórce `AbyssTable` używa `AbyssButton` z `flat` i `size=\"small\"` — bez `flat` wiersz dostałby wizualną powierzchnię przycisku konkurującą z tabelą. " +
          "Kolumna akcji rekordu ma ikonowy trigger `more_vert` (`flat`, `aria-label`) z `AbyssDropdown`; pełne etykiety akcji zostają w menu. " +
          "Kliknięcie rekordu otwiera szczegóły w `AbyssDialog` albo na osobnej trasie — nigdy jako blok dopięty pod tabelą.",
      },
      source: {
        code: `<q-td :props="cellProps">
  <AbyssButton
    :label="cellProps.row.title"
    flat
    size="small"
    @click="openDetails(cellProps.row)"
  />
</q-td>

<q-td :props="cellProps">
  <AbyssButton
    flat
    size="small"
    icon="sym_r_more_vert"
    aria-label="Akcje rekordu"
  >
    <AbyssDropdown anchor="bottom right" self="top right" :min-width="200">
      <AbyssButton v-close-popup flat full-width size="medium" icon="sym_r_edit" label="Edytuj" />
      <AbyssButton v-close-popup flat full-width size="medium" icon="sym_r_delete" label="Usuń" />
    </AbyssDropdown>
  </AbyssButton>
</q-td>`,
      },
    },
  },
  render: () => ({
    components: { AbyssButton, AbyssDialog, AbyssDropdown, AbyssTable },
    setup() {
      const selected = ref<{ title: string; owner: string } | null>(null);
      const isDetailsOpen = ref(false);

      function openDetails(row: { title: string; owner: string }): void {
        selected.value = row;
        isDetailsOpen.value = true;
      }

      return {
        recordColumns,
        recordRows,
        selected,
        isDetailsOpen,
        openDetails,
      };
    },
    template: `
      <AbyssTable
        as-card
        title="Plany"
        hide-search
        :rows="recordRows"
        :columns="recordColumns"
        row-key="id"
      >
        <template #body="bodyProps">
          <q-tr :props="bodyProps">
            <q-td key="title" :props="bodyProps">
              <AbyssButton
                flat
                size="small"
                :label="bodyProps.row.title"
                @click="openDetails(bodyProps.row)"
              />
            </q-td>
            <q-td key="owner" :props="bodyProps">
              {{ bodyProps.row.owner }}
            </q-td>
            <q-td key="actions" :props="bodyProps">
              <AbyssButton
                flat
                size="small"
                icon="sym_r_more_vert"
                aria-label="Akcje rekordu"
              >
                <AbyssDropdown anchor="bottom right" self="top right" :min-width="200">
                  <AbyssButton
                    v-close-popup
                    flat
                    full-width
                    size="medium"
                    icon="sym_r_edit"
                    label="Edytuj"
                  />
                  <AbyssButton
                    v-close-popup
                    flat
                    full-width
                    size="medium"
                    icon="sym_r_delete"
                    label="Usuń"
                  />
                </AbyssDropdown>
              </AbyssButton>
            </q-td>
          </q-tr>
        </template>
      </AbyssTable>

      <AbyssDialog
        v-model="isDetailsOpen"
        close-button
        icon="sym_r_assignment"
        :title="selected?.title ?? ''"
      >
        Właściciel: {{ selected?.owner }}
      </AbyssDialog>
    `,
  }),
  play: async ({ canvas, canvasElement, userEvent }) => {
    const recordAction = canvas.getByRole("button", {
      name: "Onboarding zespołu",
    });
    await expect(recordAction).toBeVisible();
    await userEvent.click(recordAction);

    // Quasar teleportuje dialog do body; dekorator przenosi portal z opóźnieniem.
    const page = within(canvasElement.ownerDocument.body);
    await waitFor(() => {
      const dialog = page.getByRole("dialog", { name: "Onboarding zespołu" });
      expect(dialog).toBeInTheDocument();
      expect(within(dialog).getByText(/Właściciel:\s*Marta/)).toBeInTheDocument();
    });
  },
};

export const FixedHeight: Story = {
  name: "Stała wysokość",
  parameters: {
    docs: {
      description: {
        story:
          "Prop `height` włącza scroll wewnętrzny, sticky header i backdrop-filter na nagłówku kolumn.",
      },
      source: {
        code: `<AbyssTable
  :height="400"
  title="Treats"
  :rows="rows"
  :columns="columns"
  row-key="name"
/>`,
      },
    },
  },
  render: () => ({
    components: { AbyssTable },
    setup() {
      return { columns, rows };
    },
    template: `
      <AbyssTable
        :height="400"
        title="Treats"
        :rows="rows"
        :columns="columns"
        row-key="name"
      />
    `,
  }),
  play: async ({ canvasElement }) => {
    const table = canvasElement.querySelector(".abyss-table");
    await expect(table).toHaveClass("abyss-table--fixed-height");
  },
};
