import type { Meta, StoryObj } from '@storybook/vue3';
import { expect } from 'storybook/test';
import { ref } from 'vue';
import AbyssDate, {
  type AbyssDateRangeValue,
} from '@/components/ui/AbyssDate/AbyssDate.vue';
import { withAbyssBackground } from '@/stories/AbyssBackgroundDecorator';

const nativePickerWarning =
  '**Nigdy nie używaj systemowych selektorów daty** (`<input type="date">`, `<input type="datetime-local">` z natywnym UI przeglądarki/OS). ' +
  'W formularzu używaj wyłącznie `AbyssInput` z `type="date"` / `"datetime-local"` (osadza ten picker w popupie). ' +
  'Samodzielny `AbyssDate` tylko w popupie lub toolbarze (wzorzec archiwum) — nie jako pole formularza ustawień.';

const meta: Meta<typeof AbyssDate> = {
  title: 'UI/AbyssDate',
  component: AbyssDate,
  decorators: [withAbyssBackground],
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Picker daty w Abyss. W formularzu nie osadzaj go samodzielnie — użyj `AbyssInput` z `type="date"` / `"datetime-local"`. Samodzielnie tylko w popupie / toolbarze. Układ jak `AbyssDialog`: kalendarz w body, separator i stopka z Anuluj (`flat`) oraz Potwierdź (`flat` + `gradient` + `success`).\n\n' +
          'Obsługuje tryb przedziału dat Quasar `QDate` przez prop `range` (przekazywany do `q-date` przez `$attrs`). Model: obiekt `{ from, to }` w formacie `mask`.\n\n' +
          `${nativePickerWarning}\n\n` +
          'Przy osadzaniu w `q-popup-proxy` ustaw wymaganą klasę integracyjną `class="abyss-date-menu"` na elemencie popup oraz `:breakpoint="0"`, żeby Quasar nie przełączał pickera na modal `QDialog` na małych viewportach.\n\n' +
          '```html\n<q-popup-proxy class="abyss-date-menu" :breakpoint="0">\n  <AbyssDate v-model="date" @close="popup = false" />\n</q-popup-proxy>\n```',
      },
    },
  },
  argTypes: {
    modelValue: { control: 'text' },
    'onUpdate:modelValue': { action: 'update:modelValue' },
    onClose: { action: 'close' },
    onConfirm: { action: 'confirm' },
    mask: { control: 'text' },
    todayBtn: { control: 'boolean' },
    firstDayOfWeek: { control: 'number' },
    dark: { control: 'boolean' },
    cancelLabel: { control: 'text' },
    confirmLabel: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof AbyssDate>;

export const Default: Story = {
  name: 'Domyślny',
  args: {
    modelValue: '2026-02-13',
    firstDayOfWeek: 1,
  },
  render: (args) => ({
    components: { AbyssDate },
    setup() {
      return { args };
    },
    template: `<AbyssDate v-bind="args" v-model="args.modelValue" />`,
  }),
  play: async ({ canvas }) => {
    const yearElement = canvas.getByText(/2026/, {
      selector: '.q-date__header-subtitle',
    });
    await expect(yearElement).toBeVisible();
    await expect(canvas.getByRole('button', { name: /anuluj/i })).toBeVisible();
    const confirmButton = canvas.getByRole('button', { name: /potwierdź/i });
    await expect(confirmButton).toBeVisible();
    await expect(confirmButton).toHaveClass('flat');
    await expect(confirmButton).toHaveClass('gradient');
  },
};

export const RangeSelection: Story = {
  name: 'Przedział dat',
  parameters: {
    docs: {
      description: {
        story:
          'Tryb `range` z [dokumentacji Quasar QDate](https://quasar.dev/vue-components/date#range-selection): `v-model` to obiekt `{ from, to }` w formacie `mask`. ' +
          'Użytkownik wybiera datę początkową i końcową w kalendarzu; kliknięcie już zaznaczonego dnia odznacza go. ' +
          'Wartość jest zapisywana dopiero po **Potwierdź** (jak w pozostałych pickerach Abyss).',
      },
      source: {
        language: 'html',
        code: `<AbyssDate
  v-model="dateRange"
  range
  mask="YYYY-MM-DD"
  @update:model-value="handleRangeDraftUpdate"
  @confirm="handleRangeConfirm"
/>`,
      },
    },
  },
  render: () => ({
    components: { AbyssDate },
    setup() {
      const draftRange = ref<AbyssDateRangeValue>({
        from: '2026-02-10',
        to: '2026-02-20',
      });
      const confirmedRange = ref<AbyssDateRangeValue | null>(null);

      function handleRangeDraftUpdate(value: unknown): void {
        if (
          typeof value === 'object' &&
          value !== null &&
          'from' in value &&
          'to' in value &&
          typeof value.from === 'string' &&
          typeof value.to === 'string'
        ) {
          draftRange.value = { from: value.from, to: value.to };
        }
      }

      function handleRangeConfirm(): void {
        confirmedRange.value = { ...draftRange.value };
      }

      return {
        draftRange,
        confirmedRange,
        handleRangeDraftUpdate,
        handleRangeConfirm,
      };
    },
    template: `
      <div style="display: flex; flex-direction: column; align-items: flex-start; gap: 16px;">
        <AbyssDate
          :model-value="draftRange"
          range
          mask="YYYY-MM-DD"
          @update:model-value="handleRangeDraftUpdate"
          @confirm="handleRangeConfirm"
        />

        <p
          v-if="confirmedRange"
          style="color: white; margin: 0; font-size: 14px;"
        >
          Wybrany przedział: {{ confirmedRange.from }} — {{ confirmedRange.to }}
        </p>
      </div>
    `,
  }),
  play: async ({ canvas, userEvent }) => {
    await expect(canvas.getByRole('button', { name: /potwierdź/i })).toBeVisible();
    await expect(canvas.getByRole('button', { name: /anuluj/i })).toBeVisible();

    const confirmButton = canvas.getByRole('button', { name: /potwierdź/i });
    await userEvent.click(confirmButton);

    await expect(
      canvas.getByText('Wybrany przedział: 2026-02-10 — 2026-02-20'),
    ).toBeVisible();
  },
};
