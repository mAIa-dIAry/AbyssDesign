import type { Meta, StoryObj } from '@storybook/vue3';
import { expect } from 'storybook/test';
import { ref } from 'vue';
import AbyssDate from '@/components/ui/AbyssDate/AbyssDate.vue';
import AbyssButton from '@/components/ui/AbyssButton/AbyssButton.vue';
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
          'Komponent daty. Przy osadzaniu w `q-popup-proxy` użyj `class="abyss-date-menu"` bezpośrednio na elemencie popup i ustaw `:breakpoint="0"`, żeby Quasar nie przełączał pickera na modal `QDialog` na małych viewportach. **Nie** używaj `content-class`, bo nie działa z tym komponentem.\n\n```html\n<q-popup-proxy class="abyss-date-menu" :breakpoint="0">\n  <AbyssDate v-model="date" @close="popup = false" />\n</q-popup-proxy>\n```',
      },
    },
  },
  argTypes: {
    modelValue: { control: 'text' },
    'onUpdate:modelValue': { action: 'update:modelValue' },
    onClose: { action: 'close' },
    mask: { control: 'text' },
    todayBtn: { control: 'boolean' },
    firstDayOfWeek: { control: 'number' },
    dark: { control: 'boolean' },
    showCloseButton: { control: 'boolean' },
    closeLabel: { control: 'text' },
    colors: {
      control: 'object',
      description:
        'Kolory gradientu nagłówka kalendarza jako tablica. Obsługiwane formaty: HSL, HSLA, HEX, RGB, RGBA.',
      table: {
        type: { summary: 'string[]' },
        defaultValue: {
          summary: "['hsl(345, 100%, 72%)', 'hsl(188, 98%, 30%)']",
        },
      },
    },
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
    const closeButton = canvas.getByRole('button', { name: /zamknij/i });
    await expect(closeButton).toBeVisible();
  },
};

export const WithoutCloseButton: Story = {
  args: {
    modelValue: '2026-02-13',
    showCloseButton: false,
  },
  render: (args) => ({
    components: { AbyssDate },
    setup() {
      return { args };
    },
    template: `<AbyssDate v-bind="args" v-model="args.modelValue" />`,
  }),
  play: async ({ canvas }) => {
    const closeButton = canvas.queryByRole('button', { name: /zamknij/i });
    await expect(closeButton).not.toBeInTheDocument();
  },
};

export const ColorsWatch: Story = {
  name: 'Reaktywna zmiana kolorów (setColors)',
  parameters: {
    docs: {
      description: {
        story:
          'Weryfikacja reaktywności – zmiana prop `colors` aktualizuje gradient nagłówka przez `setColors` w watchu.',
      },
    },
  },
  render: () => ({
    components: { AbyssDate, AbyssButton },
    setup() {
      const colors = ref(['hsl(345, 100%, 72%)', 'hsl(188, 98%, 30%)']);
      function changeColors() {
        colors.value = ['hsl(200, 100%, 50%)', 'hsl(260, 80%, 60%)'];
      }
      return { colors, changeColors };
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 8px; align-items: flex-start;">
        <AbyssButton label="Zmień kolory" size="small" @click="changeColors" />
        <AbyssDate model-value="2026-02-13" :colors="colors" />
      </div>
    `,
  }),
  play: async ({ canvas, canvasElement, userEvent }) => {
    const el = canvasElement.querySelector('.abyss-date') as HTMLElement;
    const styleBefore = el.getAttribute('style');
    await userEvent.click(canvas.getByRole('button', { name: /zmień kolory/i }));
    await new Promise((r) => setTimeout(r, 50));
    const styleAfter = el.getAttribute('style');
    await expect(styleAfter).not.toBe(styleBefore);
  },
};

export const CustomLocaleAndCloseLabel: Story = {
  name: 'Własna lokalizacja i etykieta zamknięcia',
  parameters: {
    docs: {
      description: {
        story:
          'Przekazanie własnego prop `locale` aktywuje gałąź `props.locale ?? defaultLocale` oraz niespuste `closeLabel` aktywuje gałąź `props.closeLabel || i18n.t(...)`.',
      },
    },
  },
  args: {
    modelValue: '2026-03-06',
    closeLabel: 'Gotowe',
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
    const btn = canvas.getByRole('button', { name: /Gotowe/i });
    await expect(btn).toBeVisible();
  },
};
