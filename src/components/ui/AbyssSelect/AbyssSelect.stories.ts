import type { Meta, StoryObj } from '@storybook/vue3';
import { ref } from 'vue';
import { expect, fn } from 'storybook/test';
import { QIcon, QItem, QItemSection, QItemLabel } from 'quasar';
import AbyssToggle from '@/components/ui/AbyssToggle/AbyssToggle.vue';
import AbyssSelect from '@/components/ui/AbyssSelect/AbyssSelect.vue';
import type { AbyssSelectProps } from '@/components/ui/AbyssSelect/AbyssSelect.props';
import { withAbyssBackground } from '@/stories/AbyssBackgroundDecorator';

type AbyssSelectStoryArgs = AbyssSelectProps & {
  'onUpdate:modelValue'?: (value: unknown) => void;
};

const meta = {
  title: 'UI/AbyssSelect',
  component: AbyssSelect,
  decorators: [withAbyssBackground],
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Lista rozwijana Abyss. Wybór jednej lub wielu wartości z listy opcji. Obsługuje filtrowanie, chipy, sloty szablonów opcji, walidację i tryb tworzenia nowych wartości.',
      },
    },
  },
  argTypes: {
    modelValue: {
      description: 'Bieżąca wartość (pojedyncza lub tablica przy `multiple`)',
    },
    'onUpdate:modelValue': { action: 'update:modelValue' },
    options: {
      control: 'object',
      description: 'Tablica opcji do wyboru (stringi lub obiekty)',
    },
    label: {
      control: 'text',
      description: 'Etykieta pola',
    },
    multiple: {
      control: 'boolean',
      description: 'Tryb wielokrotnego wyboru',
      table: { defaultValue: { summary: 'false' } },
    },
    clearable: {
      control: 'boolean',
      description: 'Ikona czyszczenia wartości',
      table: { defaultValue: { summary: 'false' } },
    },
    useInput: {
      control: 'boolean',
      description: 'Pole tekstowe do filtrowania opcji',
      table: { defaultValue: { summary: 'false' } },
    },
    useChips: {
      control: 'boolean',
      description: 'Wyświetlaj wybrane wartości jako chipy',
      table: { defaultValue: { summary: 'false' } },
    },
    hint: {
      control: 'text',
      description: 'Podpowiedź pod polem',
    },
    error: {
      control: 'boolean',
      description: 'Stan błędu',
      table: { defaultValue: { summary: 'false' } },
    },
    errorMessage: {
      control: 'text',
      description: 'Komunikat błędu',
    },
    disable: {
      control: 'boolean',
      description: 'Wyłącz pole – brak interakcji',
      table: { defaultValue: { summary: 'false' } },
    },
    readonly: {
      control: 'boolean',
      description: 'Tryb tylko do odczytu',
      table: { defaultValue: { summary: 'false' } },
    },
    loading: {
      control: 'boolean',
      description: 'Tryb ładowania',
      table: { defaultValue: { summary: 'false' } },
    },
    dense: {
      control: 'boolean',
      description: 'Zagęszczony wygląd',
      table: { defaultValue: { summary: 'false' } },
    },
    size: {
      control: { type: 'select' },
      options: ['normal', 'small'],
      description: 'Rozmiar pola — `small` zmniejsza padding, font i ikonę',
      table: { defaultValue: { summary: 'normal' } },
    },
    flat: {
      control: 'boolean',
      description:
        'Wariant bez cienia — np. w nagłówku tabeli lub zwartym toolbarze',
      table: { defaultValue: { summary: 'false' } },
    },
    emitValue: {
      control: 'boolean',
      description: 'Emituj tylko wartość opcji zamiast całego obiektu',
      table: { defaultValue: { summary: 'false' } },
    },
    mapOptions: {
      control: 'boolean',
      description: 'Mapuj model na opcję po wartości',
      table: { defaultValue: { summary: 'false' } },
    },
    optionsDense: {
      control: 'boolean',
      description: 'Zagęszczone opcje w menu',
      table: { defaultValue: { summary: 'false' } },
    },
    hideDropdownIcon: {
      control: 'boolean',
      description: 'Ukryj ikonę strzałki',
      table: { defaultValue: { summary: 'false' } },
    },
    behavior: {
      control: { type: 'select' },
      options: ['default', 'menu', 'dialog'],
      description:
        'Sposób wyświetlania listy opcji. Domyślnie używa menu także na mobile, żeby zachowanie było spójne z desktopem.',
      table: { defaultValue: { summary: 'menu' } },
    },
    style: {
      control: 'object',
      description:
        'Dodatkowe style CSS. Dozwolone w komponentach złożonych (np. edytor). Nie stosuj w standardowych formularzach i kartach.',
    },
    class: {
      control: 'text',
      description:
        'Dodatkowe klasy CSS. Dozwolone w komponentach złożonych (np. edytor). Nie stosuj w standardowych formularzach i kartach.',
    },
  },
} satisfies Meta<AbyssSelectStoryArgs>;

export default meta;
type Story = StoryObj<AbyssSelectStoryArgs>;

const stringOptions = ['Vue', 'React', 'Angular', 'Svelte', 'Solid'];

const objectOptions = [
  { label: 'Google', value: 'google', icon: 'sym_r_search' },
  { label: 'Facebook', value: 'facebook', icon: 'sym_r_thumb_up' },
  { label: 'Twitter', value: 'twitter', icon: 'sym_r_tag' },
  { label: 'Apple', value: 'apple', icon: 'sym_r_phone_iphone' },
  { label: 'Amazon', value: 'amazon', icon: 'sym_r_shopping_cart' },
];

// ─── Default ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  name: 'Domyślny',
  parameters: {
    docs: {
      description: {
        story: 'Podstawowy select z listą opcji tekstowych i etykietą.',
      },
    },
  },
  args: {
    label: 'Framework',
    options: stringOptions,
    clearable: false,
    disable: false,
    readonly: false,
    dense: false,
  },
  render: (args) => ({
    components: { AbyssSelect },
    setup() {
      const value = ref(null);
      return { args, value };
    },
    template: `
      <AbyssSelect v-bind="args" v-model="value" />
    `,
  }),
  play: async ({ canvas }) => {
    const combobox = canvas.getByRole('combobox');
    await expect(combobox.closest('.abyss-select-wrapper')).toBeVisible();
  },
};

// ─── Size & flat ──────────────────────────────────────────────────────────────

export const SmallSize: Story = {
  name: 'Mały rozmiar',
  parameters: {
    docs: {
      description: {
        story:
          'Select w rozmiarze `small` — mniejszy padding, font i ikona dropdownu.',
      },
    },
  },
  args: {
    label: 'Framework',
    options: stringOptions,
    size: 'small',
  },
  render: (args) => ({
    components: { AbyssSelect },
    setup() {
      const value = ref('Vue');
      return { args, value };
    },
    template: `<AbyssSelect v-bind="args" v-model="value" />`,
  }),
  play: async ({ canvasElement }) => {
    const container = canvasElement.querySelector('.abyss-select-container');
    await expect(container).toHaveClass('abyss-select-container--size-small');
  },
};

export const Flat: Story = {
  name: 'Płaski',
  parameters: {
    docs: {
      description: {
        story:
          'Select bez cienia (`flat`) — wariant do osadzenia w gęstych layoutach, np. stopce tabeli.',
      },
    },
  },
  args: {
    label: 'Framework',
    options: stringOptions,
    flat: true,
  },
  render: (args) => ({
    components: { AbyssSelect },
    setup() {
      const value = ref('Vue');
      return { args, value };
    },
    template: `<AbyssSelect v-bind="args" v-model="value" />`,
  }),
  play: async ({ canvasElement }) => {
    const select = canvasElement.querySelector('.abyss-select');
    await expect(select).toHaveClass('abyss-select--flat');
  },
};

export const SmallFlat: Story = {
  name: 'Mały i płaski',
  parameters: {
    docs: {
      description: {
        story:
          'Połączenie `size="small"` i `flat` — typowy wariant w kompaktowych panelach i tabelach.',
      },
      source: {
        language: 'html',
        code: `<AbyssSelect
  v-model="value"
  label="Wierszy na stronę"
  :options="options"
  size="small"
  flat
  emit-value
  map-options
/>`,
      },
    },
  },
  args: {
    label: 'Wierszy na stronę',
    options: [
      { label: '5', value: 5 },
      { label: '10', value: 10 },
      { label: '25', value: 25 },
    ],
    size: 'small',
    flat: true,
    emitValue: true,
    mapOptions: true,
    hideBottomSpace: true,
  },
  render: (args) => ({
    components: { AbyssSelect },
    setup() {
      const value = ref(5);
      return { args, value };
    },
    template: `<AbyssSelect v-bind="args" v-model="value" />`,
  }),
  play: async ({ canvasElement }) => {
    const container = canvasElement.querySelector('.abyss-select-container');
    const select = canvasElement.querySelector('.abyss-select');
    await expect(container).toHaveClass('abyss-select-container--size-small');
    await expect(select).toHaveClass('abyss-select--flat');
  },
};

// ─── Object options ───────────────────────────────────────────────────────────

export const ObjectOptions: Story = {
  name: 'Opcje obiektowe',
  parameters: {
    docs: {
      description: {
        story:
          'Select z opcjami w formie obiektów `{ label, value }`. Używamy `emit-value` aby model zawierał tylko wartość, a `map-options` aby etykieta była poprawnie wyświetlana.',
      },
      source: {
        language: 'html',
        code: `
<script setup>
const value = ref('google');
const options = [
  { label: 'Google', value: 'google' },
  { label: 'Facebook', value: 'facebook' },
  { label: 'Twitter', value: 'twitter' },
];
</script>

<template>
  <AbyssSelect
    v-model="value"
    :options="options"
    label="Firma"
    emit-value
    map-options
  />
</template>
        `,
      },
    },
  },
  args: {
    label: 'Firma',
    options: objectOptions,
    emitValue: true,
    mapOptions: true,
    clearable: true,
    disable: false,
    readonly: false,
  },
  render: (args) => ({
    components: { AbyssSelect },
    setup() {
      const value = ref('google');
      return { args, value };
    },
    template: `
      <div style="width: 100%;">
        <AbyssSelect v-bind="args" v-model="value" />
        <div style="margin-top: 8px; font-size: 11px; opacity: 0.5;">Model: {{ JSON.stringify(value) }}</div>
      </div>
    `,
  }),
  play: async ({ canvas }) => {
    const combobox = canvas.getByRole('combobox');
    await expect(combobox.closest('.abyss-select-wrapper')).toBeVisible();
  },
};

// ─── Multiple selection ───────────────────────────────────────────────────────

export const MultipleSelection: Story = {
  name: 'Wielokrotny wybór',
  parameters: {
    docs: {
      description: {
        story:
          'Tryb wielokrotnego wyboru (`multiple: true`). Model musi być tablicą. Dodano wartościowy licznik wybranych elementów.',
      },
      source: {
        language: 'html',
        code: `
<script setup>
const value = ref([]);
const options = ['Vue', 'React', 'Angular', 'Svelte', 'Solid'];
</script>

<template>
  <AbyssSelect
    v-model="value"
    :options="options"
    label="Frameworki"
    multiple
    clearable
  />
</template>
        `,
      },
    },
  },
  args: {
    label: 'Frameworki',
    options: stringOptions,
    multiple: true,
    clearable: true,
    disable: false,
    readonly: false,
  },
  render: (args) => ({
    components: { AbyssSelect },
    setup() {
      const value = ref([]);
      return { args, value };
    },
    template: `
      <div style="width: 100%;">
        <AbyssSelect v-bind="args" v-model="value" />
        <div style="margin-top: 8px; font-size: 11px; opacity: 0.5;">Model: {{ JSON.stringify(value) }}</div>
      </div>
    `,
  }),
  play: async ({ canvas }) => {
    const combobox = canvas.getByRole('combobox');
    await expect(combobox.closest('.abyss-select-wrapper')).toBeVisible();
  },
};

// ─── Chips ────────────────────────────────────────────────────────────────────

export const WithChips: Story = {
  name: 'Z chipami',
  parameters: {
    docs: {
      description: {
        story:
          'Wybrane wartości wyświetlane jako chipy (`use-chips: true`). Każdy chip można usunąć klikając `×`.',
      },
      source: {
        language: 'html',
        code: `
<script setup>
const value = ref(['Vue', 'React']);
const options = ['Vue', 'React', 'Angular', 'Svelte', 'Solid'];
</script>

<template>
  <AbyssSelect
    v-model="value"
    :options="options"
    label="Frameworki"
    multiple
    use-chips
  />
</template>
        `,
      },
    },
  },
  args: {
    label: 'Frameworki',
    options: stringOptions,
    multiple: true,
    useChips: true,
    disable: false,
    readonly: false,
  },
  render: (args) => ({
    components: { AbyssSelect },
    setup() {
      const value = ref(['Vue', 'React']);
      return { args, value };
    },
    template: `
      <AbyssSelect v-bind="args" v-model="value" />
    `,
  }),
  play: async ({ canvas }) => {
    const combobox = canvas.getByRole('combobox');
    await expect(combobox.closest('.abyss-select-wrapper')).toBeVisible();
  },
};

// ─── Filtering ────────────────────────────────────────────────────────────────

export const Filtering: Story = {
  name: 'Filtrowanie opcji',
  parameters: {
    docs: {
      description: {
        story:
          'Select z polem wyszukiwania (`use-input: true`). Użytkownik może wpisać tekst aby zawęzić listę opcji.',
      },
      source: {
        language: 'html',
        code: `
<script setup>
import { ref } from 'vue';

const value = ref(null);
const allOptions = ['Vue', 'React', 'Angular', 'Svelte', 'Solid'];
const filteredOptions = ref(allOptions);

function filterFn(val, update) {
  update(() => {
    const needle = val.toLowerCase();
    filteredOptions.value = allOptions.filter(
      (v) => v.toLowerCase().includes(needle)
    );
  });
}
</script>

<template>
  <AbyssSelect
    v-model="value"
    :options="filteredOptions"
    label="Framework"
    use-input
    @filter="filterFn"
  />
</template>
        `,
      },
    },
  },
  args: {
    label: 'Framework',
    useInput: true,
    disable: false,
    readonly: false,
  },
  render: (args) => ({
    components: { AbyssSelect },
    setup() {
      const value = ref(null);
      const allOptions = ['Vue', 'React', 'Angular', 'Svelte', 'Solid'];
      const filteredOptions = ref([...allOptions]);
      function filterFn(val: string, update: (fn: () => void) => void) {
        update(() => {
          const needle = val.toLowerCase();
          filteredOptions.value = allOptions.filter((v) =>
            v.toLowerCase().includes(needle),
          );
        });
      }
      return { args, value, filteredOptions, filterFn };
    },
    template: `
      <AbyssSelect
        v-bind="args"
        v-model="value"
        :options="filteredOptions"
        @filter="filterFn"
      />
    `,
  }),
  play: async ({ canvas }) => {
    const combobox = canvas.getByRole('combobox');
    await expect(combobox.closest('.abyss-select-wrapper')).toBeVisible();
  },
};

// ─── Custom option slot ───────────────────────────────────────────────────────

export const CustomOptionSlot: Story = {
  name: 'Własny slot opcji',
  parameters: {
    docs: {
      description: {
        story:
          'Własny wygląd każdej opcji na liście przy użyciu slotu `#option`. Można wyświetlać ikony, opisy i inne elementy.',
      },
      source: {
        language: 'html',
        code: `
<script setup>
const value = ref(null);
const options = [
  { label: 'Google', value: 'google', icon: 'sym_r_search' },
  { label: 'Facebook', value: 'facebook', icon: 'sym_r_thumb_up' },
  { label: 'Twitter', value: 'twitter', icon: 'sym_r_tag' },
];
</script>

<template>
  <AbyssSelect
    v-model="value"
    :options="options"
    label="Firma"
    emit-value
    map-options
  >
    <template #option="scope">
      <q-item v-bind="scope.itemProps">
        <q-item-section avatar>
          <q-icon :name="scope.opt.icon" />
        </q-item-section>
        <q-item-section>
          <q-item-label>{{ scope.opt.label }}</q-item-label>
        </q-item-section>
      </q-item>
    </template>
  </AbyssSelect>
</template>
        `,
      },
    },
  },
  args: {
    label: 'Firma',
    options: objectOptions,
    emitValue: true,
    mapOptions: true,
    clearable: true,
    disable: false,
    readonly: false,
  },
  render: (args) => ({
    components: { AbyssSelect, QItem, QItemSection, QItemLabel, QIcon },
    setup() {
      const value = ref(null);
      return { args, value };
    },
    template: `
      <AbyssSelect v-bind="args" v-model="value">
        <template #option="scope">
          <QItem v-bind="scope.itemProps">
            <QItemSection avatar>
              <QIcon :name="scope.opt.icon" />
            </QItemSection>
            <QItemSection>
              <QItemLabel>{{ scope.opt.label }}</QItemLabel>
            </QItemSection>
          </QItem>
        </template>
      </AbyssSelect>
    `,
  }),
  play: async ({ canvas, canvasElement, userEvent }) => {
    const combobox = canvas.getByRole('combobox');
    await userEvent.click(combobox);
    await new Promise((r) => setTimeout(r, 100));
    const menu =
      canvasElement.ownerDocument.querySelector('.abyss-select-menu');
    if (!menu) throw new Error('Dropdown menu not found');
    const items = menu.querySelectorAll('.q-item');
    await expect(items.length).toBeGreaterThan(0);
  },
};

// ─── Selected item slot ───────────────────────────────────────────────────────

export const SelectedItemSlot: Story = {
  name: 'Slot wybranego elementu',
  parameters: {
    docs: {
      description: {
        story:
          'Slot `#selected-item` pozwala dostosować wygląd wybranych opcji. Przykład prezentuje ikonę obok nazwy w trybie wielokrotnego wyboru.',
      },
      source: {
        language: 'html',
        code: `
<script setup>
const value = ref(['google', 'twitter']);
const options = [
  { label: 'Google', value: 'google', icon: 'sym_r_search' },
  { label: 'Facebook', value: 'facebook', icon: 'sym_r_thumb_up' },
  { label: 'Twitter', value: 'twitter', icon: 'sym_r_tag' },
];
</script>

<template>
  <AbyssSelect
    v-model="value"
    :options="options"
    label="Firmy"
    multiple
    use-chips
    emit-value
    map-options
  >
    <template #selected-item="scope">
      <q-chip
        removable
        dense
        @remove="scope.removeAtIndex(scope.index)"
        :tabindex="scope.tabindex"
      >
        <q-icon :name="scope.opt?.icon" size="xs" class="q-mr-xs" />
        {{ scope.opt?.label }}
      </q-chip>
    </template>
  </AbyssSelect>
</template>
        `,
      },
    },
  },
  args: {
    label: 'Firmy',
    options: objectOptions,
    multiple: true,
    useChips: true,
    emitValue: true,
    mapOptions: true,
    disable: false,
    readonly: false,
  },
  render: (args) => ({
    components: { AbyssSelect, QIcon },
    setup() {
      const value = ref(['google', 'twitter']);
      return { args, value };
    },
    template: `
      <AbyssSelect v-bind="args" v-model="value">
        <template #selected-item="scope">
          <q-chip
            removable
            dense
            @remove="scope.removeAtIndex(scope.index)"
            :tabindex="scope.tabindex"
          >
            <QIcon :name="scope.opt?.icon" size="xs" class="q-mr-xs" />
            {{ scope.opt?.label }}
          </q-chip>
        </template>
      </AbyssSelect>
    `,
  }),
  play: async ({ canvas, canvasElement }) => {
    const combobox = canvas.getByRole('combobox');
    await expect(combobox.closest('.abyss-select-wrapper')).toBeVisible();
    const chips = canvasElement.querySelectorAll('.q-chip');
    await expect(chips.length).toBeGreaterThan(0);
  },
};

// ─── No option slot ───────────────────────────────────────────────────────────

export const NoOptionSlot: Story = {
  name: 'Slot braku opcji',
  parameters: {
    docs: {
      description: {
        story:
          'Własny komunikat wyświetlany gdy lista opcji jest pusta – slot `#no-option`. Przydatny przy filtrowaniu lub ładowaniu dynamicznych opcji.',
      },
      source: {
        language: 'html',
        code: `
<script setup>
const value = ref(null);
const options = ref([]);
</script>

<template>
  <AbyssSelect
    v-model="value"
    :options="options"
    label="Framework"
    use-input
  >
    <template #no-option>
      <q-item>
        <q-item-section class="text-grey">Brak wyników</q-item-section>
      </q-item>
    </template>
  </AbyssSelect>
</template>
        `,
      },
    },
  },
  args: {
    label: 'Framework',
    options: [],
    useInput: true,
    disable: false,
    readonly: false,
  },
  render: (args) => ({
    components: { AbyssSelect, QItem, QItemSection },
    setup() {
      const value = ref(null);
      return { args, value };
    },
    template: `
      <AbyssSelect v-bind="args" v-model="value">
        <template #no-option>
          <QItem>
            <QItemSection style="opacity: 0.5;">Brak wyników</QItemSection>
          </QItem>
        </template>
      </AbyssSelect>
    `,
  }),
  play: async ({ canvas, canvasElement, userEvent }) => {
    const combobox = canvas.getByRole('combobox');
    await userEvent.click(combobox);
    await new Promise((r) => setTimeout(r, 100));
    const menu =
      canvasElement.ownerDocument.querySelector('.abyss-select-menu');
    if (!menu) throw new Error('Dropdown menu not found');
    const item = menu.querySelector('.q-item');
    await expect(item).toBeTruthy();
  },
};

// ─── With toggle options ──────────────────────────────────────────────────────

export const WithToggleOptions: Story = {
  name: 'Opcje z przełącznikiem',
  parameters: {
    docs: {
      description: {
        story:
          'Każda opcja zawiera `QToggle`. Demonstracja dowolności konfiguracji slotu `#option`.',
      },
      source: {
        language: 'html',
        code: `
<script setup>
const value = ref([]);
const options = ['Vue', 'React', 'Angular', 'Svelte', 'Solid'];
</script>

<template>
  <AbyssSelect
    v-model="value"
    :options="options"
    label="Frameworki"
    multiple
    use-chips
  >
    <template #option="scope">
      <q-item v-bind="scope.itemProps">
        <q-item-section>
          <q-item-label>{{ scope.opt }}</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-toggle :model-value="scope.selected" @update:model-value="scope.toggleOption(scope.opt)" />
        </q-item-section>
      </q-item>
    </template>
  </AbyssSelect>
</template>
        `,
      },
    },
  },
  args: {
    label: 'Frameworki',
    options: stringOptions,
    multiple: true,
    useChips: true,
    disable: false,
    readonly: false,
  },
  render: (args) => ({
    components: { AbyssSelect, QItem, QItemSection, QItemLabel, AbyssToggle },
    setup() {
      const value = ref([]);
      return { args, value };
    },
    template: `
      <AbyssSelect v-bind="args" v-model="value">
        <template #option="scope">
          <QItem v-bind="scope.itemProps">
            <QItemSection>
              <QItemLabel>{{ scope.opt }}</QItemLabel>
            </QItemSection>
            <QItemSection side>
              <AbyssToggle
                :model-value="scope.selected"
                @update:model-value="scope.toggleOption(scope.opt)"
              />
            </QItemSection>
          </QItem>
        </template>
      </AbyssSelect>
    `,
  }),
  play: async ({ canvas, canvasElement, userEvent }) => {
    const combobox = canvas.getByRole('combobox');
    await userEvent.click(combobox);
    await new Promise((r) => setTimeout(r, 100));
    const menu =
      canvasElement.ownerDocument.querySelector('.abyss-select-menu');
    if (!menu) throw new Error('Dropdown menu not found');
    const items = menu.querySelectorAll('.q-item');
    await expect(items.length).toBeGreaterThan(0);
  },
};

// ─── Max values ───────────────────────────────────────────────────────────────

export const MaxValues: Story = {
  name: 'Ograniczenie liczby wyborów',
  parameters: {
    docs: {
      description: {
        story:
          'Wielokrotny wybór z ograniczeniem do maksymalnie 2 elementów (`max-values: 2`). Po osiągnięciu limitu pozostałe opcje stają się nieaktywne.',
      },
    },
  },
  args: {
    label: 'Wybierz max. 2',
    options: stringOptions,
    multiple: true,
    useChips: true,
    maxValues: 2,
    hint: 'Można wybrać maksymalnie 2 opcje',
    disable: false,
    readonly: false,
  },
  render: (args) => ({
    components: { AbyssSelect },
    setup() {
      const value = ref([]);
      return { args, value };
    },
    template: `
      <div style="width: 100%;">
        <AbyssSelect v-bind="args" v-model="value" />
        <div style="margin-top: 4px; font-size: 11px; opacity: 0.5;">Wybrano: {{ value.length }} / 2</div>
      </div>
    `,
  }),
  play: async ({ canvas }) => {
    const combobox = canvas.getByRole('combobox');
    await expect(combobox.closest('.abyss-select-wrapper')).toBeVisible();
  },
};

// ─── Hint & counter ───────────────────────────────────────────────────────────

export const WithHintAndCounter: Story = {
  name: 'Z podpowiedzią i licznikiem',
  parameters: {
    docs: {
      description: {
        story:
          'Pole z `hint` oraz `counter` prezentującym aktualną liczbę wyborów.',
      },
    },
  },
  args: {
    label: 'Frameworki',
    options: stringOptions,
    multiple: true,
    useChips: true,
    maxValues: 3,
    counter: true,
    hint: 'Wybierz ulubione frameworki',
    disable: false,
    readonly: false,
  },
  render: (args) => ({
    components: { AbyssSelect },
    setup() {
      const value = ref(['Vue']);
      return { args, value };
    },
    template: `
      <AbyssSelect v-bind="args" v-model="value" />
    `,
  }),
  play: async ({ canvas }) => {
    const combobox = canvas.getByRole('combobox');
    await expect(combobox.closest('.abyss-select-wrapper')).toBeVisible();
  },
};

// ─── Validation ───────────────────────────────────────────────────────────────

export const WithValidation: Story = {
  name: 'Z walidacją',
  parameters: {
    docs: {
      description: {
        story:
          'Przykład walidacji – pole jest wymagane. Błąd pokazuje się gdy pole jest puste. Kliknij poza polem aby wywołać walidację (`lazy-rules`).',
      },
    },
  },
  args: {
    label: 'Framework (wymagane)',
    options: stringOptions,
    rules: [(val: unknown) => !!val || 'To pole jest wymagane'],
    lazyRules: true,
    disable: false,
    readonly: false,
  },
  render: (args) => ({
    components: { AbyssSelect },
    setup() {
      const value = ref(null);
      return { args, value };
    },
    template: `
      <AbyssSelect v-bind="args" v-model="value" />
    `,
  }),
  play: async ({ canvas }) => {
    const combobox = canvas.getByRole('combobox');
    await expect(combobox.closest('.abyss-select-wrapper')).toBeVisible();
  },
};

// ─── Error state ──────────────────────────────────────────────────────────────

export const ErrorState: Story = {
  name: 'Stan błędu',
  parameters: {
    docs: {
      description: {
        story:
          'Select w stanie błędu z komunikatem (`error` + `error-message`).',
      },
    },
  },
  args: {
    label: 'Framework',
    options: stringOptions,
    error: true,
    errorMessage: 'Wybierz co najmniej jeden framework',
    disable: false,
    readonly: false,
  },
  render: (args) => ({
    components: { AbyssSelect },
    setup() {
      const value = ref(null);
      return { args, value };
    },
    template: `
      <AbyssSelect v-bind="args" v-model="value" />
    `,
  }),
  play: async ({ canvas }) => {
    const combobox = canvas.getByRole('combobox');
    await expect(combobox.closest('.abyss-select-wrapper')).toBeVisible();
  },
};

// ─── State variants ───────────────────────────────────────────────────────────

export const StateVariants: Story = {
  name: 'Warianty stanów',
  parameters: {
    docs: {
      description: {
        story:
          'Porównanie czterech stanów: domyślny, wyłączony, tylko do odczytu i ładowanie.',
      },
    },
  },
  args: {},
  render: () => ({
    components: { AbyssSelect },
    setup() {
      const options = stringOptions;
      return { options };
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px; width: 100%;">
        <div>
          <div style="font-size: 11px; opacity: 0.5; margin-bottom: 8px;">Domyślny</div>
          <AbyssSelect :options="options" label="Framework" :model-value="'Vue'" />
        </div>
        <div>
          <div style="font-size: 11px; opacity: 0.5; margin-bottom: 8px;">Wyłączony (disable)</div>
          <AbyssSelect :options="options" label="Framework" :model-value="'Vue'" disable />
        </div>
        <div>
          <div style="font-size: 11px; opacity: 0.5; margin-bottom: 8px;">Tylko do odczytu (readonly)</div>
          <AbyssSelect :options="options" label="Framework" :model-value="'Vue'" readonly />
        </div>
        <div>
          <div style="font-size: 11px; opacity: 0.5; margin-bottom: 8px;">Ładowanie (loading)</div>
          <AbyssSelect :options="options" label="Framework" loading />
        </div>
      </div>
    `,
  }),
  play: async ({ canvasElement }) => {
    const wrappers = canvasElement.querySelectorAll('.abyss-select-wrapper');
    await expect(wrappers).toHaveLength(4);
    for (const w of wrappers) {
      await expect(w).toBeVisible();
    }
  },
};

// ─── Prepend / Append slots ───────────────────────────────────────────────────

export const PrependAppendSlots: Story = {
  name: 'Sloty prepend i append',
  parameters: {
    docs: {
      description: {
        story:
          'Ikony wewnątrz pola przed (`#prepend`) i po (`#append`) wartości. Pozwala na dodanie kontekstu wizualnego.',
      },
      source: {
        language: 'html',
        code: `
<template>
  <AbyssSelect v-model="value" :options="options" label="Język">
    <template #prepend>
      <q-icon name="sym_r_language" />
    </template>
    <template #append>
      <q-icon name="sym_r_info" />
    </template>
  </AbyssSelect>
</template>
        `,
      },
    },
  },
  args: {
    label: 'Język',
    options: ['Polski', 'English', 'Deutsch', 'Français'],
    clearable: true,
    disable: false,
    readonly: false,
  },
  render: (args) => ({
    components: { AbyssSelect, QIcon },
    setup() {
      const value = ref(null);
      return { args, value };
    },
    template: `
      <AbyssSelect v-bind="args" v-model="value">
        <template #prepend>
          <QIcon name="sym_r_language" />
        </template>
        <template #append>
          <QIcon name="sym_r_info" style="opacity: 0.5;" />
        </template>
      </AbyssSelect>
    `,
  }),
  play: async ({ canvas, canvasElement }) => {
    const combobox = canvas.getByRole('combobox');
    await expect(combobox.closest('.abyss-select-wrapper')).toBeVisible();
    const prepend = canvasElement.querySelector('.q-field__prepend');
    await expect(prepend).toBeTruthy();
    const append = canvasElement.querySelector('.q-field__append');
    await expect(append).toBeTruthy();
  },
};

// ─── Duża lista ───────────────────────────────────────────────────────────────

export const Test: Story = {
  name: 'Duża lista',
  args: {
    label: 'Gwiazda',
    options: [
      'Słońce',
      'Syriusz',
      'Kanopus',
      'Rigil Kentaurus',
      'Toliman',
      'Arktur',
      'Wega',
      'Kapella',
      'Rigel',
      'Procjon',
      'Achernar',
      'Betelgeza',
      'Hadar',
      'Acrux',
      'Altair',
      'Aldebaran',
      'Antares',
      'Spika',
      'Pollux',
      'Fomalhaut',
      'Deneb',
      'Mimosa',
      'Regulus',
      'Adhara',
      'Castor',
      'Gacrux',
      'Shaula',
      'Bellatrix',
      'Elnath',
      'Miaplacidus',
      'Alnilam',
      'Regor',
      'Alnair',
      'Alioth',
      'Alnitak',
      'Dubhe',
      'Mirfak',
      'Wezen',
      'Sargas',
      'Kaus Australis',
      'Avior',
      'Alkaid',
      'Menkalinan',
      'Atria',
      'Alhena',
      'Peacock',
      'Theta Scorpii',
      'Alsephina',
      'Mirzam',
      'Alphard',
      'Hamal',
      'Diphda',
      'Nunki',
      'Menkent',
      'Saiph',
      'Alpheratz',
      'Mirach',
      'Almach',
      'Tiaki',
      'Schedar',
      'Caph',
      'Polaris',
      'Denebola',
      'Algieba',
      'Naos',
      'Mintaka',
      'Alderamin',
      'Enif',
      'Gienah',
      'Markab',
      'Menkar',
      'Zosma',
      'Porrima',
      'Zubenelgenubi',
      'Zubeneschamali',
      'Izar',
      'Alphecca',
      'Rasalhague',
      'Etamin',
      'Kochab',
      'Pherkad',
      'Thuban',
      'Alruba',
      'Alula Borealis',
      'Alula Australis',
    ],
  },
  render: (args) => ({
    components: { AbyssSelect },
    setup() {
      const value = ref(null);
      return { args, value };
    },
    template: `
      <AbyssSelect v-bind="args" v-model="value" />
    `,
  }),
};

// ─── Emit behavior ────────────────────────────────────────────────────────────

export const EmitBehavior: Story = {
  name: 'Zachowanie emitów',
  parameters: {
    docs: {
      description: {
        story:
          'Weryfikacja emitu `update:modelValue` po wybraniu opcji z listy.',
      },
    },
  },
  args: {
    label: 'Framework',
    options: stringOptions,
  },
  render: (args) => ({
    components: { AbyssSelect },
    setup() {
      const value = ref(null);
      const onUpdateModelValue = fn();
      (args as Record<string, unknown>)['onUpdate:modelValue'] =
        onUpdateModelValue;
      return { args, value, onUpdateModelValue };
    },
    template: `
      <AbyssSelect v-bind="args" v-model="value" @update:modelValue="onUpdateModelValue" />
    `,
  }),
  play: async ({ args, canvas, canvasElement, userEvent }) => {
    const combobox = canvas.getByRole('combobox');
    await userEvent.click(combobox);
    await new Promise((r) => setTimeout(r, 100));
    const menu =
      canvasElement.ownerDocument.querySelector('.abyss-select-menu');
    if (!menu) throw new Error('Dropdown menu .abyss-select-menu not found');
    const items = Array.from(menu.querySelectorAll<HTMLElement>('.q-item'));
    const vueItem = items.find((el) => el.textContent?.trim() === 'Vue');
    if (!vueItem) throw new Error('Option "Vue" not found in dropdown');
    await userEvent.click(vueItem);
    await expect(args['onUpdate:modelValue']).toHaveBeenCalledWith('Vue');
  },
};

// ─── Before / After slots ─────────────────────────────────────────────────────

export const BeforeAfterSlots: Story = {
  name: 'Sloty before i after',
  parameters: {
    docs: {
      description: {
        story:
          'Sloty `#before` i `#after` renderowane na zewnątrz pola – przed i po całej kontrolce.',
      },
    },
  },
  args: {
    label: 'Język',
    options: stringOptions,
  },
  render: (args) => ({
    components: { AbyssSelect, QIcon },
    setup() {
      const value = ref(null);
      return { args, value };
    },
    template: `
      <AbyssSelect v-bind="args" v-model="value">
        <template #before>
          <QIcon name="sym_r_chevron_right" />
        </template>
        <template #after>
          <QIcon name="sym_r_chevron_left" />
        </template>
      </AbyssSelect>
    `,
  }),
  play: async ({ canvas, canvasElement }) => {
    const combobox = canvas.getByRole('combobox');
    await expect(combobox.closest('.abyss-select-wrapper')).toBeVisible();
    const before = canvasElement.querySelector('.q-field__before');
    await expect(before).toBeTruthy();
    const after = canvasElement.querySelector('.q-field__after');
    await expect(after).toBeTruthy();
  },
};

// ─── Hint / Error / Selected / Loading slots ──────────────────────────────────

export const HintErrorSelectedLoadingSlots: Story = {
  name: 'Własne sloty hint, error, selected i loading',
  parameters: {
    docs: {
      description: {
        story:
          'Demonstracja slotów `#hint`, `#error`, `#selected` i `#loading` z własną zawartością.',
      },
    },
  },
  args: {
    label: 'Framework',
    options: stringOptions,
  },
  render: (args) => ({
    components: { AbyssSelect },
    setup() {
      const value = ref('Vue');
      return { args, value };
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px; width: 100%;">
        <AbyssSelect v-bind="args" v-model="value" :error="true" :loading="true">
          <template #error>
            <span class="custom-error">Pole jest wymagane</span>
          </template>
          <template #selected>
            <span class="custom-selected">★ {{ value }}</span>
          </template>
          <template #loading>
            <span class="custom-loading">Ładowanie...</span>
          </template>
        </AbyssSelect>
        <AbyssSelect v-bind="args" v-model="value" :error="false" :loading="false">
          <template #hint>
            <span class="custom-hint">Wybierz opcję z listy</span>
          </template>
        </AbyssSelect>
      </div>
    `,
  }),
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelector('.custom-error')).toBeTruthy();
    await expect(canvasElement.querySelector('.custom-selected')).toBeTruthy();
    await expect(canvasElement.querySelector('.custom-loading')).toBeTruthy();
    await expect(canvasElement.querySelector('.custom-hint')).toBeTruthy();
  },
};

// ─── No label ─────────────────────────────────────────────────────────────────

export const NoLabel: Story = {
  name: 'Bez etykiety',
  parameters: {
    docs: {
      description: {
        story:
          'Select bez zewnętrznej etykiety – pole bez nagłówka z lewej strony.',
      },
    },
  },
  args: {
    options: stringOptions,
  },
  render: (args) => ({
    components: { AbyssSelect },
    setup() {
      const value = ref(null);
      return { args, value };
    },
    template: `
      <AbyssSelect v-bind="args" v-model="value" />
    `,
  }),
  play: async ({ canvas, canvasElement }) => {
    const combobox = canvas.getByRole('combobox');
    await expect(combobox.closest('.abyss-select-wrapper')).toBeVisible();
    const label = canvasElement.querySelector('.abyss-input-label');
    await expect(label).toBeNull();
  },
};
