import type { Meta, StoryObj } from '@storybook/vue3';
import { expect } from 'storybook/test';
import AbyssDate from '@/components/ui/AbyssDate/AbyssDate.vue';
import { withAbyssBackground } from '@/stories/AbyssBackgroundDecorator';

const meta: Meta<typeof AbyssDate> = {
  title: 'UI/AbyssDate',
  component: AbyssDate,
  decorators: [withAbyssBackground],
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Komponent daty w układzie jak AbyssDialog: kalendarz w body, separator i stopka z przyciskami Anuluj (`flat`) oraz Potwierdź (`flat` + `gradient` + `success`). ' +
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

export const CustomLocaleAndLabels: Story = {
  name: 'Własna lokalizacja i etykiety akcji',
  parameters: {
    docs: {
      description: {
        story:
          'Przekazanie własnego prop `locale` aktywuje gałąź `props.locale ?? defaultLocale` oraz niespuste `cancelLabel` / `confirmLabel` aktywują własne etykiety stopki.',
      },
    },
  },
  args: {
    modelValue: '2026-03-06',
    cancelLabel: 'Cancel',
    confirmLabel: 'Apply',
    locale: {
      days: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      daysShort: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
      months: [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ],
      monthsShort: [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ],
    },
  },
  render: (args) => ({
    components: { AbyssDate },
    setup() {
      return { args };
    },
    template: `<AbyssDate v-bind="args" v-model="args.modelValue" />`,
  }),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button', { name: /Cancel/i })).toBeVisible();
    await expect(canvas.getByRole('button', { name: /Apply/i })).toBeVisible();
  },
};
