import type { Meta, StoryObj } from '@storybook/vue3';
import { expect } from 'storybook/test';
import AbyssDate from '@/components/ui/AbyssDate/AbyssDate.vue';
import { withAbyssBackground } from '@/stories/AbyssBackgroundDecorator';

const nativePickerWarning =
  '**Nigdy nie używaj systemowych selektorów daty** (`<input type="date">`, `<input type="datetime-local">` z natywnym UI przeglądarki/OS). ' +
  'Zawsze uruchamiaj dokładnie `AbyssDate` — bezpośrednio lub przez `AbyssInput` z `type="date"` / `type="datetime-local"`, który osadza ten komponent w popupie.';

const meta: Meta<typeof AbyssDate> = {
  title: 'UI/AbyssDate',
  component: AbyssDate,
  decorators: [withAbyssBackground],
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Jedyny dopuszczalny picker daty w Abyss. Układ jak `AbyssDialog`: kalendarz w body, separator i stopka z Anuluj (`flat`) oraz Potwierdź (`flat` + `gradient` + `success`).\n\n' +
          `${nativePickerWarning}\n\n` +
          'Przy osadzaniu w `q-popup-proxy` użyj `class="abyss-date-menu"` bezpośrednio na elemencie popup i ustaw `:breakpoint="0"`, żeby Quasar nie przełączał pickera na modal `QDialog` na małych viewportach. **Nie** używaj `content-class`, bo nie działa z tym komponentem.\n\n' +
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
