import type { Meta, StoryObj } from '@storybook/vue3';
import { computed, reactive, ref } from 'vue';
import { expect, fn, within } from 'storybook/test';
import AbyssButton from '@/components/ui/AbyssButton/AbyssButton.vue';
import AbyssCard from '@/components/ui/AbyssCard/AbyssCard.vue';
import AbyssDialog, {
  type AbyssDialogAction,
} from '@/components/ui/AbyssDialog/AbyssDialog.vue';
import AbyssGrid from '@/components/ui/AbyssGrid/AbyssGrid.vue';
import {
  ABYSS_INPUT_ROW_GAP,
  INPUT_COLUMN_SIZE,
  INPUT_GRID_MAX_COLUMNS,
} from '@/components/ui/AbyssGrid/AbyssGrid.constants';
import AbyssInput from '@/components/ui/AbyssInput/AbyssInput.vue';
import ArchiveSearchPatternDemo from '@/components/ui/AbyssInput/ArchiveSearchPatternDemo.vue';
import AbyssInputLabel from '@/components/ui/AbyssInputLabel/AbyssInputLabel.vue';
import { withAbyssBackground } from '@/stories/AbyssBackgroundDecorator';
import { withAbyssBackgroundDialogScope } from '@/stories/StoryDialogScopeDecorator';

const meta: Meta<typeof AbyssInput> = {
  title: 'UI/AbyssInput',
  component: AbyssInput,
  decorators: [
    (story, context) =>
      context.parameters.abyssDialogScope
        ? withAbyssBackgroundDialogScope(story, context)
        : withAbyssBackground(story, context),
  ],
  tags: ['autodocs'],
  argTypes: {
    modelValue: { control: 'text' },
    'onUpdate:modelValue': { action: 'update:modelValue' },
    onSearch: { action: 'search' },
    label: { control: 'text' },
    placeholder: { control: 'text' },
    type: {
      control: 'select',
      options: [
        'text',
        'password',
        'email',
        'number',
        'search',
        'tel',
        'file',
        'url',
        'time',
        'date',
        'datetime-local',
        'textarea',
      ],
    },
    disable: { control: 'boolean' },
    readonly: { control: 'boolean' },
    error: { control: 'boolean' },
    errorMessage: { control: 'text' },
    hint: { control: 'text' },
    counter: { control: 'boolean' },
    maxLength: { control: 'number' },
    loading: { control: 'boolean' },
    mask: {
      control: 'text',
      description: 'Maska wprowadzania (np. "(##) ####-####")',
    },
    fillMask: {
      control: 'boolean',
      description: 'Automatyczne wypełnianie maski',
    },
    collapsed: {
      control: 'boolean',
      description:
        'Zwija input do wielkości kwadratu, pokazując tylko sekcję append',
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
    style: { control: 'object' },
    class: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof AbyssInput>;

export const Default: Story = {
  args: {
    modelValue: '',
    label: 'Nazwa użytkownika',
    placeholder: 'Wprowadź nazwę użytkownika...',
    type: 'text',
    hint: 'To pole jest wymagane',
  },
  render: (args) => ({
    components: { AbyssInput },
    setup() {
      return { args };
    },
    template: `<AbyssInput v-bind="args" v-model="args.modelValue" />`,
  }),
  play: async ({ canvas, userEvent }) => {
    const input = canvas.getByRole('textbox');
    await expect(input).toBeVisible();
    const label = canvas.getByText('Nazwa użytkownika');
    await expect(label).toBeVisible();
    await userEvent.clear(input);
    await userEvent.type(input, 'Jan Kowalski');
    await expect(input).toHaveValue('Jan Kowalski');
  },
};

export const Password: Story = {
  args: {
    modelValue: '',
    label: 'Hasło',
    placeholder: 'Wprowadź hasło...',
    type: 'password',
    hint: 'Kliknij ikonę oka aby pokazać/ukryć hasło',
  },
  render: (args) => ({
    components: { AbyssInput },
    setup() {
      return { args };
    },
    template: `<AbyssInput v-bind="args" v-model="args.modelValue" />`,
  }),
  play: async ({ canvas, userEvent }) => {
    const input = canvas.getByPlaceholderText('Wprowadź hasło...');
    await expect(input).toHaveAttribute('type', 'password');
    const toggleButton = canvas.getByRole('button');
    await expect(toggleButton).toHaveClass('flat');
    await userEvent.click(toggleButton);
    await expect(input).toHaveAttribute('type', 'text');
    await userEvent.click(toggleButton);
    await expect(input).toHaveAttribute('type', 'password');
  },
};

export const Email: Story = {
  args: {
    modelValue: '',
    label: 'Email',
    placeholder: 'uzytkownik@example.com',
    type: 'email',
    hint: 'Wprowadź poprawny adres email',
  },
  render: (args) => ({
    components: { AbyssInput },
    setup() {
      return { args };
    },
    template: `<AbyssInput v-bind="args" v-model="args.modelValue" />`,
  }),
};

export const Search: Story = {
  args: {
    modelValue: '',
    label: 'Wyszukiwanie',
    placeholder: 'Szukaj...',
    type: 'search',
    hint: 'Kliknij ikonę lupy aby rozpocząć wyszukiwanie',
    onSearch: fn(),
  },
  render: (args) => ({
    components: { AbyssInput },
    setup() {
      return { args };
    },
    template: `<AbyssInput v-bind="args" v-model="args.modelValue" />`,
  }),
  play: async ({ args, canvas, userEvent }) => {
    const searchButton = canvas.getByRole('button');
    await expect(searchButton).toBeVisible();
    await expect(searchButton).toHaveClass('flat');
    await userEvent.click(searchButton);
    await expect(args.onSearch).toHaveBeenCalledOnce();
  },
};

export const Telephone: Story = {
  args: {
    modelValue: '',
    label: 'Numer telefonu',
    placeholder: '+48 123 456 789',
    type: 'tel',
    hint: 'Wprowadź numer telefonu z kierunkowym',
  },
  render: (args) => ({
    components: { AbyssInput },
    setup() {
      return { args };
    },
    template: `<AbyssInput v-bind="args" v-model="args.modelValue" />`,
  }),
};

export const URL: Story = {
  args: {
    modelValue: '',
    label: 'Strona internetowa',
    placeholder: 'https://example.com',
    type: 'url',
    hint: 'Wprowadź pełny adres URL ze schematem',
  },
  render: (args) => ({
    components: { AbyssInput },
    setup() {
      return { args };
    },
    template: `<AbyssInput v-bind="args" v-model="args.modelValue" />`,
  }),
};

export const Textarea: Story = {
  args: {
    modelValue: '',
    label: 'Opis',
    placeholder: 'Wprowadź szczegółowy opis...',
    type: 'textarea',
    hint: 'To pole rozszerza się automatycznie',
    counter: true,
    maxLength: 500,
  },
  render: (args) => ({
    components: { AbyssInput },
    setup() {
      return { args };
    },
    template: `<AbyssInput v-bind="args" v-model="args.modelValue" />`,
  }),
};

export const WithError: Story = {
  args: {
    modelValue: 'niepoprawna@wartość',
    label: 'Email',
    placeholder: 'uzytkownik@example.com',
    type: 'email',
    error: true,
    errorMessage: 'Wprowadzony adres email jest niepoprawny',
  },
  render: (args) => ({
    components: { AbyssInput },
    setup() {
      return { args };
    },
    template: `<AbyssInput v-bind="args" v-model="args.modelValue" />`,
  }),
  play: async ({ canvas }) => {
    const errorMessage = canvas.getByText(
      'Wprowadzony adres email jest niepoprawny',
    );
    await expect(errorMessage).toBeVisible();
  },
};

export const WithCounter: Story = {
  args: {
    modelValue: 'Przykładowy tekst',
    label: 'Tytuł',
    placeholder: 'Wprowadź tytuł...',
    type: 'text',
    counter: true,
    maxLength: 64,
    hint: 'Maksymalnie 64 znaki',
  },
  render: (args) => ({
    components: { AbyssInput },
    setup() {
      return { args };
    },
    template: `<AbyssInput v-bind="args" v-model="args.modelValue" />`,
  }),
  play: async ({ canvas }) => {
    const counter = canvas.getByText(/\d+\s*\/\s*64/);
    await expect(counter).toBeVisible();
  },
};

export const Disabled: Story = {
  args: {
    modelValue: 'Nieaktywne pole',
    label: 'Wyłączone pole',
    placeholder: 'Nie można edytować',
    type: 'text',
    disable: true,
    hint: 'To pole jest wyłączone',
  },
  render: (args) => ({
    components: { AbyssInput },
    setup() {
      return { args };
    },
    template: `<AbyssInput v-bind="args" v-model="args.modelValue" />`,
  }),
  play: async ({ canvas, userEvent }) => {
    const input = canvas.getByRole('textbox');
    await expect(input).toBeDisabled();
    await userEvent.type(input, 'nowy tekst');
    await expect(input).toHaveValue('Nieaktywne pole');
  },
};

export const Readonly: Story = {
  args: {
    modelValue: 'Wartość tylko do odczytu',
    label: 'Pole tylko do odczytu',
    placeholder: '',
    type: 'text',
    readonly: true,
    hint: 'To pole można tylko odczytać',
  },
  render: (args) => ({
    components: { AbyssInput },
    setup() {
      return { args };
    },
    template: `<AbyssInput v-bind="args" v-model="args.modelValue" />`,
  }),
  play: async ({ canvas, userEvent }) => {
    const input = canvas.getByRole('textbox');
    await expect(input).toHaveAttribute('readonly');
    await userEvent.type(input, 'nowy tekst');
    await expect(input).toHaveValue('Wartość tylko do odczytu');
  },
};

export const Loading: Story = {
  args: {
    modelValue: '',
    label: 'Wyszukiwanie',
    placeholder: 'Szukaj...',
    type: 'text',
    loading: true,
    hint: 'Trwa ładowanie...',
  },
  render: (args) => ({
    components: { AbyssInput },
    setup() {
      return { args };
    },
    template: `<AbyssInput v-bind="args" v-model="args.modelValue" />`,
  }),
};

export const Number: Story = {
  args: {
    modelValue: 42,
    label: 'Wiek',
    placeholder: 'Wprowadź liczbę...',
    type: 'number',
    hint: 'Wprowadź wartość liczbową',
  },
  render: (args) => ({
    components: { AbyssInput },
    setup() {
      return { args };
    },
    template: `<AbyssInput v-bind="args" v-model="args.modelValue" />`,
  }),
};

export const Date: Story = {
  args: {
    modelValue: '2026-02-08',
    'onUpdate:modelValue': fn(),
    label: 'Data urodzenia',
    type: 'date',
    hint: 'Wybierz datę z kalendarza',
  },
  render: (args) => ({
    components: { AbyssInput },
    setup() {
      return { args };
    },
    template: `<AbyssInput v-bind="args" v-model="args.modelValue" />`,
  }),
  play: async ({ args, canvas, userEvent }) => {
    const calendarButton = canvas.getByRole('button');
    await expect(calendarButton).toBeVisible();
    await expect(calendarButton).toHaveClass('flat');
    await userEvent.click(calendarButton);

    // Popup jest teleportowany do body — szukamy pierwszego dnia w kalendarzu
    const dayButton = document.querySelector<HTMLElement>(
      '.q-date__calendar-item--in button',
    );
    await expect(dayButton).toBeTruthy();
    await userEvent.click(dayButton!);

    // Kliknij "Zamknij" → @close="datePopupRef?.hide()" w AbyssInput
    await new Promise((r) => setTimeout(r, 50));
    const dateCloseBtn = document.querySelector<HTMLElement>(
      '.abyss-date-menu .abyss-button',
    );
    if (dateCloseBtn) await userEvent.click(dateCloseBtn);

    // handleDateUpdate został wywołany — emit update:modelValue z nową datą
    await expect(args['onUpdate:modelValue']).toHaveBeenCalled();
  },
};

export const Time: Story = {
  args: {
    modelValue: '14:30',
    'onUpdate:modelValue': fn(),
    label: 'Godzina spotkania',
    type: 'time',
    hint: 'Wybierz godzinę',
  },
  render: (args) => ({
    components: { AbyssInput },
    setup() {
      return { args };
    },
    template: `<AbyssInput v-bind="args" v-model="args.modelValue" />`,
  }),
  play: async ({ args, canvas, userEvent }) => {
    const clockButton = canvas.getByRole('button');
    await expect(clockButton).toBeVisible();
    await expect(clockButton).toHaveClass('flat');
    await userEvent.click(clockButton);

    // Popup jest teleportowany do body — klikamy pierwszą pozycję na tarczy zegara
    const clockPosition = document.querySelector<HTMLElement>(
      '.q-time__clock-position',
    );
    await expect(clockPosition).toBeTruthy();
    await userEvent.click(clockPosition!);

    // Kliknij "Zamknij" → @close="timePopupRef?.hide()" w AbyssInput
    await new Promise((r) => setTimeout(r, 50));
    const timeCloseBtn = document.querySelector<HTMLElement>(
      '.abyss-time-menu .abyss-button',
    );
    if (timeCloseBtn) await userEvent.click(timeCloseBtn);

    // handleTimeUpdate został wywołany — emit update:modelValue z nową godziną
    await expect(args['onUpdate:modelValue']).toHaveBeenCalled();
  },
};

export const DateTime: Story = {
  args: {
    modelValue: '2026-02-08T14:30',
    'onUpdate:modelValue': fn(),
    label: 'Data i godzina wydarzenia',
    type: 'datetime-local',
    hint: 'Wybierz datę i godzinę',
  },
  render: (args) => ({
    components: { AbyssInput },
    setup() {
      return { args };
    },
    template: `<AbyssInput v-bind="args" v-model="args.modelValue" />`,
  }),
  play: async ({ args, canvas, userEvent }) => {
    const buttons = canvas.getAllByRole('button');
    // datetime-local ma dwa przyciski: kalendarz i zegar
    await expect(buttons).toHaveLength(2);
    for (const button of buttons) {
      await expect(button).toHaveClass('flat');
    }
    const [calendarButton, clockButton] = buttons as [HTMLElement, HTMLElement];

    // Otwórz picker daty i kliknij dzień (handleDateUpdate — datetime-local branch)
    await userEvent.click(calendarButton);
    const dayButton = document.querySelector<HTMLElement>(
      '.q-date__calendar-item--in button',
    );
    await expect(dayButton).toBeTruthy();
    await userEvent.click(dayButton!);
    await expect(args['onUpdate:modelValue']).toHaveBeenCalled();

    // Otwórz picker czasu i kliknij pozycję (handleTimeUpdate — datetime-local branch)
    await userEvent.click(clockButton);
    const clockPosition = document.querySelector<HTMLElement>(
      '.q-time__clock-position',
    );
    await expect(clockPosition).toBeTruthy();
    await userEvent.click(clockPosition!);
    await expect(args['onUpdate:modelValue']).toHaveBeenCalledTimes(2);
  },
};

export const WithMask: Story = {
  args: {
    modelValue: '',
    label: 'Numer telefonu',
    placeholder: '(12) 3456-7890',
    type: 'text',
    mask: '(##) ####-####',
    fillMask: true,
    hint: 'Maska automatycznie formatuje wprowadzany numer',
  },
  render: (args) => ({
    components: { AbyssInput },
    setup() {
      return { args };
    },
    template: `<AbyssInput v-bind="args" v-model="args.modelValue" />`,
  }),
  play: async ({ canvas, userEvent }) => {
    const input = canvas.getByRole('textbox');
    await userEvent.click(input);
    await userEvent.type(input, '1234567890');
    await expect(input).toHaveValue('(12) 3456-7890');
  },
};

export const PostalCode: Story = {
  args: {
    modelValue: '',
    label: 'Kod pocztowy',
    placeholder: '00-000',
    type: 'text',
    mask: '##-###',
    fillMask: false,
    hint: 'Format: XX-XXX',
  },
  render: (args) => ({
    components: { AbyssInput },
    setup() {
      return { args };
    },
    template: `<AbyssInput v-bind="args" v-model="args.modelValue" />`,
  }),
};

export const WithCustomAppendSlot: Story = {
  args: {
    modelValue: '',
    label: 'Pole z własnym slotem append',
    placeholder: 'Tekst...',
    type: 'text',
  },
  render: (args) => ({
    components: { AbyssInput },
    setup() {
      return { args };
    },
    template: `
      <AbyssInput v-bind="args" v-model="args.modelValue">
        <template #append>
          <q-icon name="sym_r_star" />
        </template>
      </AbyssInput>
    `,
  }),
  play: async ({ canvas }) => {
    // Weryfikujemy, że własny slot append jest wyrenderowany (hasAppendContent — slots.append branch)
    const input = canvas.getByRole('textbox');
    await expect(input).toBeVisible();
  },
};

export const CollapsedWithChangingValue: Story = {
  args: {
    modelValue: '',
    label: 'Zwijane z wartością',
    placeholder: 'Szukaj...',
    type: 'text',
    collapsed: true,
  },
  render: (args) => ({
    components: { AbyssInput },
    setup() {
      return { args };
    },
    template: `<AbyssInput v-bind="args" v-model="args.modelValue" />`,
  }),
  play: async ({ canvas, userEvent }) => {
    // Pole startuje jako zwinięte
    const input = canvas.getByRole('textbox');

    // Kliknięcie rozwija pole (handleInputClick — true branch: isCollapsed && collapsed)
    await userEvent.click(input);
    await userEvent.type(input, 'test');
    await expect(input).toHaveValue('test');

    // Watcher props.modelValue: nowa wartość + collapsed => isCollapsed = false
    // (wartość jest już wpisana, pole pozostaje rozwinięte)
    await expect(input).toBeVisible();

    // handleInputBlur — false branch: collapsed=true ALE modelValue niepusty → warunek fałszywy
    await userEvent.tab();
    await expect(input).toBeVisible();
  },
};

export const CollapsedWatcherPropsChange: Story = {
  args: {
    modelValue: '',
    label: '',
    placeholder: 'Tekst...',
    type: 'text',
    collapsed: false,
  },
  render: (args) => ({
    components: { AbyssInput, AbyssButton },
    setup() {
      return { args };
    },
    template: `
      <div style="width: 100%; display: flex; flex-direction: column; gap: 16px; align-items: flex-start;">
        <AbyssButton @click="args.collapsed = !args.collapsed">Toggle</AbyssButton>
        <AbyssInput v-bind="args" v-model="args.modelValue" />
      </div>
    `,
  }),
  play: async ({ canvas, userEvent }) => {
    const input = canvas.getByRole('textbox');
    await expect(input).toBeVisible();

    // Kliknięcie przycisku toggle zmienia props.collapsed (watcher props.collapsed)
    const toggleBtn = canvas.getByRole('button', { name: 'Toggle' });
    await userEvent.click(toggleBtn);

    // Po zmianie collapsed na true, pole powinno być zwinięte
    const label = canvas.queryByText('Watcher collapsed prop');
    await expect(label).not.toBeInTheDocument();
  },
};

export const CollapsedWithSearchButton: Story = {
  args: {
    modelValue: '',
    label: 'Wyszukiwanie',
    placeholder: 'Szukaj...',
    type: 'search',
    collapsed: true,
  },
  render: (args) => ({
    components: { AbyssInput },
    setup() {
      return { args };
    },
    template: `<AbyssInput v-bind="args" v-model="args.modelValue" />`,
  }),
  play: async ({ canvas }) => {
    const label = canvas.queryByText('Wyszukiwanie');
    await expect(label).not.toBeInTheDocument();
    const searchButton = canvas.getByRole('button');
    await expect(searchButton).toBeVisible();
  },
};

export const BeforeAfterSlots: Story = {
  name: 'Sloty before i after',
  args: {
    modelValue: '',
    label: 'Z zewnętrznymi slotami',
    placeholder: 'Tekst...',
    type: 'text',
  },
  render: (args) => ({
    components: { AbyssInput },
    setup() {
      return { args };
    },
    template: `
      <AbyssInput v-bind="args" v-model="args.modelValue">
        <template #before>
          <span class="slot-before">PRE</span>
        </template>
        <template #after>
          <span class="slot-after">POST</span>
        </template>
      </AbyssInput>
    `,
  }),
  play: async ({ canvasElement }) => {
    const before = canvasElement.querySelector('.slot-before');
    await expect(before).toBeTruthy();
    const after = canvasElement.querySelector('.slot-after');
    await expect(after).toBeTruthy();
  },
};

export const InvalidMaxLength: Story = {
  name: 'Nieprawidłowe maxLength (< -1)',
  args: {
    modelValue: '',
    label: 'Pole z błędnym maxLength',
    placeholder: 'Tekst...',
    type: 'text',
    maxLength: -2,
  },
  render: (args) => ({
    components: { AbyssInput },
    setup() {
      return { args };
    },
    template: `<AbyssInput v-bind="args" v-model="args.modelValue" />`,
  }),
  play: async ({ canvas }) => {
    // Komponent renderuje się mimo błędnego maxLength (console.warn jest wywołany)
    const input = canvas.getByRole('textbox');
    await expect(input).toBeVisible();
  },
};

export const CollapsedWithFallbackIcon: Story = {
  args: {
    modelValue: '',
    label: '',
    placeholder: 'Wprowadź tekst...',
    type: 'text',
    collapsed: true,
  },
  render: (args) => ({
    components: { AbyssInput },
    setup() {
      return { args };
    },
    template: `<AbyssInput v-bind="args" v-model="args.modelValue" />`,
  }),
  play: async ({ canvas, userEvent }) => {
    // Kliknięcie w input powinno rozwinąć pole (handleInputClick — true branch)
    const input = canvas.getByRole('textbox');
    await userEvent.click(input);

    // Po rozwinięciu input przyjmuje fokus
    await expect(input).toBeVisible();

    // Wyczyszczenie wartości i utrata fokusu powinny zwinąć pole z powrotem
    // (handleInputBlur — true branch: collapsed && !modelValue)
    await userEvent.tab();
  },
};

export const CollapsedWithCustomAppend: Story = {
  name: 'Zwinięte z własnym slotem append',
  args: {
    modelValue: '',
    label: '',
    placeholder: 'Tekst...',
    type: 'text',
    collapsed: true,
  },
  render: (args) => ({
    components: { AbyssInput },
    setup() {
      return { args };
    },
    template: `
      <AbyssInput v-bind="args" v-model="args.modelValue">
        <template #append>
          <q-icon name="sym_r_star" class="custom-append-icon" />
        </template>
      </AbyssInput>
    `,
  }),
  play: async ({ canvasElement }) => {
    // collapsed=true → v-if="collapsed && !hasAppendContent" ewaluuje hasAppendContent
    // slots.append jest truthy → if (slots.append) return true — pokrywa tę gałąź
    // !hasAppendContent = false → ikona fallback NIE jest renderowana
    const fallback = canvasElement.querySelector('.collapsed-fallback-icon');
    await expect(fallback).toBeNull();
  },
};

export const SmallSize: Story = {
  name: 'Mały rozmiar',
  parameters: {
    docs: {
      description: {
        story:
          'Input w rozmiarze `small` — mniejszy padding, font i ikony w slocie append.',
      },
    },
  },
  args: {
    modelValue: '',
    label: 'Szukaj',
    placeholder: 'Szukaj...',
    type: 'search',
    size: 'small',
  },
  render: (args) => ({
    components: { AbyssInput },
    setup() {
      return { args };
    },
    template: `<AbyssInput v-bind="args" v-model="args.modelValue" />`,
  }),
  play: async ({ canvasElement }) => {
    const container = canvasElement.querySelector('.abyss-input-container');
    await expect(container).toHaveClass('abyss-input-container--size-small');
  },
};

export const Flat: Story = {
  name: 'Płaski',
  parameters: {
    docs: {
      description: {
        story:
          'Input bez cienia (`flat`) — wariant do osadzenia w gęstych layoutach, np. nagłówku tabeli.',
      },
    },
  },
  args: {
    modelValue: '',
    label: 'Szukaj',
    placeholder: 'Szukaj...',
    type: 'text',
    flat: true,
  },
  render: (args) => ({
    components: { AbyssInput },
    setup() {
      return { args };
    },
    template: `<AbyssInput v-bind="args" v-model="args.modelValue" />`,
  }),
  play: async ({ canvasElement }) => {
    const input = canvasElement.querySelector('.abyss-input');
    await expect(input).toHaveClass('abyss-input--flat');
  },
};

export const SmallFlat: Story = {
  name: 'Mały i płaski',
  parameters: {
    docs: {
      description: {
        story:
          'Połączenie `size="small"` i `flat` z własnym przyciskiem w slocie append — typowy wariant w `AbyssTable`.',
      },
      source: {
        language: 'html',
        code: `<AbyssInput
  v-model="filter"
  type="text"
  size="small"
  flat
  placeholder="Szukaj"
>
  <template #append>
    <AbyssButton flat size="small" icon="sym_r_search" class="icon-button" />
  </template>
</AbyssInput>`,
      },
    },
  },
  args: {
    modelValue: '',
    placeholder: 'Szukaj...',
    type: 'text',
    size: 'small',
    flat: true,
  },
  render: (args) => ({
    components: { AbyssInput, AbyssButton },
    setup() {
      return { args };
    },
    template: `
      <AbyssInput v-bind="args" v-model="args.modelValue">
        <template #append>
          <AbyssButton flat size="small" icon="sym_r_search" class="icon-button" />
        </template>
      </AbyssInput>
    `,
  }),
  play: async ({ canvasElement }) => {
    const container = canvasElement.querySelector('.abyss-input-container');
    const input = canvasElement.querySelector('.abyss-input');
    const button = canvasElement.querySelector('.icon-button');

    await expect(container).toHaveClass('abyss-input-container--size-small');
    await expect(input).toHaveClass('abyss-input--flat');
    await expect(button).toHaveClass('size-small');
    await expect(button).toHaveClass('flat');
  },
};

const PASSWORD_MIN_LENGTH = 8;

export const ChangePasswordPattern: Story = {
  name: 'Wzorzec: zmiana hasła',
  parameters: {
    abyssDialogScope: true,
    docs: {
      description: {
        story:
          'Referencyjny wzorzec akcji „Zmień hasło” w formularzu konta.\n\n' +
          '**Układ w karcie:** wiersz `AbyssGrid` z parametrami pól (`INPUT_COLUMN_SIZE`, `INPUT_GRID_MAX_COLUMNS`, `ABYSS_INPUT_ROW_GAP`, `content-rows`) — pierwsza komórka to `AbyssInputLabel`, druga to przycisk akcji (bez `align="right"`; ten atrybut odwraca kolejność kolumn przy dwóch elementach). Osobny `AbyssGrid align="right"` zostaw wyłącznie dla samych przycisków (np. Zapisz / Wyloguj).\n\n' +
          '**Hasła poza kartą:** pola hasła wyłącznie w `AbyssDialog` (obecne, nowe, powtórzenie) z wbudowanym propem `label` w `AbyssInput`. Nie owijaj pól w dodatkowy `AbyssGrid` i nie duplikuj etykiety poza dialogiem.\n\n' +
          '**Stałe:** `import { INPUT_COLUMN_SIZE, INPUT_GRID_MAX_COLUMNS, ABYSS_INPUT_ROW_GAP } from \'@/components/ui/AbyssGrid/AbyssGrid.constants\'`.',
      },
      source: {
        language: 'html',
        code: `<AbyssCard title="Konto">
  <template #content>
    <!-- …pozostałe pola z propem label… -->
    <AbyssGrid
      :column-size="INPUT_COLUMN_SIZE"
      :max-columns="INPUT_GRID_MAX_COLUMNS"
      :rowGap="ABYSS_INPUT_ROW_GAP"
      content-rows
    >
      <AbyssInputLabel label="Hasło" />
      <AbyssButton
        icon="sym_r_password"
        label="Zmień hasło"
        @click="openChangePasswordDialog"
      />
    </AbyssGrid>
  </template>
</AbyssCard>

<AbyssDialog
  v-model="showChangePasswordDialog"
  title="Zmiana hasła"
  icon="sym_r_password"
  close-button
  persistent
  :actions="changePasswordDialogActions"
  @action="handleChangePasswordDialogAction"
>
  <AbyssInput
    v-model="passwordForm.currentPassword"
    type="password"
    label="Obecne hasło"
    autocomplete="current-password"
  />
  <AbyssInput
    v-model="passwordForm.newPassword"
    type="password"
    label="Nowe hasło"
    autocomplete="new-password"
  />
  <AbyssInput
    v-model="passwordForm.confirmNewPassword"
    type="password"
    label="Powtórz nowe hasło"
    autocomplete="new-password"
  />
</AbyssDialog>`,
      },
    },
  },
  render: () => ({
    components: {
      AbyssCard,
      AbyssGrid,
      AbyssInputLabel,
      AbyssButton,
      AbyssDialog,
      AbyssInput,
    },
    setup() {
      const showChangePasswordDialog = ref(false);
      const validationAttempted = ref(false);
      const passwordForm = reactive({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
      });

      const passwordFieldErrors = computed(() => ({
        currentPassword:
          validationAttempted.value && !passwordForm.currentPassword.trim()
            ? 'Podaj obecne hasło'
            : '',
        newPassword:
          validationAttempted.value &&
          passwordForm.newPassword.length < PASSWORD_MIN_LENGTH
            ? `Hasło musi mieć co najmniej ${PASSWORD_MIN_LENGTH} znaków`
            : '',
        confirmNewPassword:
          validationAttempted.value && !passwordForm.confirmNewPassword.trim()
            ? 'Powtórz nowe hasło'
            : validationAttempted.value &&
                passwordForm.newPassword !== passwordForm.confirmNewPassword
              ? 'Hasła nie są identyczne'
              : '',
      }));

      const canSubmitChangePassword = computed(
        () =>
          passwordForm.currentPassword.trim().length > 0 &&
          passwordForm.newPassword.length >= PASSWORD_MIN_LENGTH &&
          passwordForm.confirmNewPassword.trim().length > 0 &&
          passwordForm.newPassword === passwordForm.confirmNewPassword,
      );

      const changePasswordDialogActions = computed<AbyssDialogAction[]>(() => [
        {
          id: 'cancel',
          label: 'Anuluj',
          flat: true,
        },
        {
          id: 'submit',
          label: 'Zmień hasło',
          gradient: true,
          gradientColors: 'success',
          disable: !canSubmitChangePassword.value,
        },
      ]);

      function resetPasswordForm(): void {
        passwordForm.currentPassword = '';
        passwordForm.newPassword = '';
        passwordForm.confirmNewPassword = '';
        validationAttempted.value = false;
      }

      function openChangePasswordDialog(): void {
        resetPasswordForm();
        showChangePasswordDialog.value = true;
      }

      function closeChangePasswordDialog(): void {
        showChangePasswordDialog.value = false;
        resetPasswordForm();
      }

      function handleChangePasswordDialogAction(actionId: string): void {
        if (actionId === 'cancel') {
          closeChangePasswordDialog();
          return;
        }

        validationAttempted.value = true;
        if (!canSubmitChangePassword.value) {
          return;
        }

        closeChangePasswordDialog();
      }

      return {
        INPUT_COLUMN_SIZE,
        INPUT_GRID_MAX_COLUMNS,
        ABYSS_INPUT_ROW_GAP,
        email: 'jan@example.com',
        showChangePasswordDialog,
        passwordForm,
        passwordFieldErrors,
        changePasswordDialogActions,
        openChangePasswordDialog,
        closeChangePasswordDialog,
        handleChangePasswordDialogAction,
      };
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px; width: 100%;">
        <AbyssCard title="Konto">
          <template #header-prepend>
            <q-icon name="sym_r_person" />
          </template>
          <template #content>
            <AbyssInput v-model="email" type="email" label="E-mail" />
            <AbyssGrid
              :column-size="INPUT_COLUMN_SIZE"
              :max-columns="INPUT_GRID_MAX_COLUMNS"
              :rowGap="ABYSS_INPUT_ROW_GAP"
              content-rows
            >
              <AbyssInputLabel label="Hasło" />
              <AbyssButton
                icon="sym_r_password"
                label="Zmień hasło"
                @click="openChangePasswordDialog"
              />
            </AbyssGrid>
          </template>
        </AbyssCard>

        <AbyssDialog
          v-model="showChangePasswordDialog"
          title="Zmiana hasła"
          icon="sym_r_password"
          close-button
          persistent
          :actions="changePasswordDialogActions"
          @action="handleChangePasswordDialogAction"
          @close="closeChangePasswordDialog"
        >
          <AbyssInput
            v-model="passwordForm.currentPassword"
            type="password"
            label="Obecne hasło"
            autocomplete="current-password"
            :error="!!passwordFieldErrors.currentPassword"
            :error-message="passwordFieldErrors.currentPassword"
          />
          <AbyssInput
            v-model="passwordForm.newPassword"
            type="password"
            label="Nowe hasło"
            autocomplete="new-password"
            :error="!!passwordFieldErrors.newPassword"
            :error-message="passwordFieldErrors.newPassword"
          />
          <AbyssInput
            v-model="passwordForm.confirmNewPassword"
            type="password"
            label="Powtórz nowe hasło"
            autocomplete="new-password"
            :error="!!passwordFieldErrors.confirmNewPassword"
            :error-message="passwordFieldErrors.confirmNewPassword"
          />
        </AbyssDialog>
      </div>
    `,
  }),
  play: async ({ canvas, userEvent }) => {
    const changePasswordButton = canvas.getByRole('button', {
      name: 'Zmień hasło',
    });
    await expect(changePasswordButton).toBeVisible();

    await userEvent.click(changePasswordButton);

    const dialog = canvas.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await expect(within(dialog).getAllByRole('textbox')).toHaveLength(3);
  },
};

export const ArchiveSearchPattern: Story = {
  name: 'Wzorzec: wyszukiwarka archiwum',
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Referencyjny układ paska wyszukiwania z `ArchivePage`: `AbyssInput` typu `search` **bez etykiety** (100% szerokości), własny slot `#prepend` z przyciskiem daty i opcjonalnym `q-chip`, wbudowany przycisk lupy w `#append`.\n\n' +
          '**Placeholder:** pusty, gdy aktywny filtr daty (`@YYYY-MM-DD`); w przeciwnym razie „Szukaj frazy we wpisach”.',
      },
      source: {
        language: 'html',
        code: `<div class="page-archive__toolbar">
  <AbyssInput
    v-model="searchQuery"
    type="search"
    :placeholder="searchPlaceholder"
    :loading="isSearchingHistory || isJumpingToDate"
    class="page-archive__toolbar-input page-archive__toolbar-input--search"
  >
    <template #prepend>
      <div class="page-archive__search-prepend">
        <AbyssButton
          flat
          size="medium"
          icon="sym_r_calendar_month"
          class="icon-button page-archive__date-trigger"
          aria-label="Wybierz datę"
        >
          <q-popup-proxy class="abyss-date-menu" :breakpoint="0">
            <AbyssDate
              :model-value="datePickerValue"
              mask="YYYY-MM-DD"
              @update:model-value="handleDatePickerUpdate"
              @close="datePopupRef?.hide()"
            />
          </q-popup-proxy>
        </AbyssButton>

        <q-chip
          v-if="selectedDateToken"
          removable
          remove-icon="sym_r_close"
          dense
          class="page-archive__date-chip"
          @remove="clearDateToken"
        >
          {{ \`@\${selectedDateToken}\` }}
        </q-chip>
      </div>
    </template>
  </AbyssInput>
</div>`,
      },
    },
  },
  render: () => ({
    components: { ArchiveSearchPatternDemo },
    template: '<ArchiveSearchPatternDemo />',
  }),
  play: async ({ canvas, canvasElement, userEvent }) => {
    const clearDateFilterButton = canvas.getByRole('button', {
      name: 'Wyczyść filtr daty',
    });
    await userEvent.click(clearDateFilterButton);

    const searchInput = canvas.getByRole('searchbox');
    await expect(searchInput).toBeVisible();
    await expect(searchInput).toHaveAttribute(
      'placeholder',
      'Szukaj frazy we wpisach',
    );

    await userEvent.type(searchInput, 'asdad');
    await expect(searchInput).toHaveValue('asdad');

    const buttons = canvas.getAllByRole('button');
    const calendarButton = buttons.find(
      (button) => button.getAttribute('aria-label') === 'Wybierz datę',
    );
    await expect(calendarButton).toBeVisible();

    const searchButton = canvasElement.querySelector(
      '.archive-search-pattern__input .q-field__append .icon-button',
    );
    await expect(searchButton).toBeVisible();

    const setDateFilterButton = canvas.getByRole('button', {
      name: 'Ustaw filtr daty',
    });
    await userEvent.click(setDateFilterButton);

    await expect(searchInput).toHaveValue('');
    await expect(searchInput).toHaveAttribute('placeholder', '');
    await expect(canvas.getByText('@2026-07-01')).toBeVisible();

    const inputControl = canvasElement.querySelector(
      '.archive-search-pattern__input .q-field__control',
    );
    const appendButton = canvasElement.querySelector(
      '.archive-search-pattern__input .q-field__append .icon-button',
    ) as HTMLElement | null;
    const nativeInput = canvasElement.querySelector(
      '.archive-search-pattern__input .q-field__native',
    ) as HTMLElement | null;
    const prependButton = canvasElement.querySelector(
      '.archive-search-pattern__input .q-field__prepend .icon-button',
    ) as HTMLElement | null;

    const dateChip = canvasElement.querySelector(
      '.archive-search-pattern__date-chip',
    ) as HTMLElement | null;

    if (
      inputControl &&
      appendButton &&
      nativeInput &&
      prependButton &&
      dateChip
    ) {
      const controlRect = inputControl.getBoundingClientRect();
      const appendRect = appendButton.getBoundingClientRect();
      const nativeRect = nativeInput.getBoundingClientRect();
      const prependRect = prependButton.getBoundingClientRect();
      const dateChipRect = dateChip.getBoundingClientRect();
      const appendGap = appendRect.left - nativeRect.right;
      const prependGap = nativeRect.left - dateChipRect.right;
      const dateButtonGap = dateChipRect.left - prependRect.right;

      await expect(appendGap).toBeGreaterThanOrEqual(3);
      await expect(appendGap).toBeLessThanOrEqual(5);
      await expect(prependGap).toBeGreaterThanOrEqual(3);
      await expect(prependGap).toBeLessThanOrEqual(5);
      await expect(dateButtonGap).toBeGreaterThanOrEqual(3);
      await expect(dateButtonGap).toBeLessThanOrEqual(5);
      await expect(controlRect.width).toBeGreaterThan(400);
    }

    await userEvent.click(clearDateFilterButton);
    await expect(searchInput).toHaveAttribute(
      'placeholder',
      'Szukaj frazy we wpisach',
    );
  },
};
