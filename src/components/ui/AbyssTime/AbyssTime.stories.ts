import type { Meta, StoryObj } from '@storybook/vue3';
import { expect } from 'storybook/test';
import { ref } from 'vue';
import AbyssTime from '@/components/ui/AbyssTime/AbyssTime.vue';
import { withAbyssBackground } from '@/stories/AbyssBackgroundDecorator';

const meta: Meta<typeof AbyssTime> = {
  title: 'UI/AbyssTime',
  component: AbyssTime,
  decorators: [withAbyssBackground],
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Komponent czasu. Przy osadzaniu w `q-popup-proxy` użyj `class="abyss-time-menu"` bezpośrednio na elemencie popup i ustaw `:breakpoint="0"`, żeby Quasar nie przełączał pickera na modal `QDialog` na małych viewportach. **Nie** używaj `content-class`, bo nie działa z tym komponentem.\n\n```html\n<q-popup-proxy class="abyss-time-menu" :breakpoint="0">\n  <AbyssTime v-model="time" @close="popup = false" />\n</q-popup-proxy>\n```',
      },
    },
  },
  argTypes: {
    modelValue: { control: 'text' },
    'onUpdate:modelValue': { action: 'update:modelValue' },
    onClose: { action: 'close' },
    mask: { control: 'text' },
    format24h: { control: 'boolean' },
    nowBtn: { control: 'boolean' },
    dark: { control: 'boolean' },
    showCloseButton: { control: 'boolean' },
    closeLabel: { control: 'text' },
    colors: {
      control: 'object',
      description:
        'Kolory gradientu nagłówka zegara jako tablica. Obsługiwane formaty: HSL, HSLA, HEX, RGB, RGBA.',
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
type Story = StoryObj<typeof AbyssTime>;

export const Default: Story = {
  args: {
    modelValue: '14:30',
  },
  render: (args) => ({
    components: { AbyssTime },
    setup() {
      return { args };
    },
    template: `<AbyssTime v-bind="args" v-model="args.modelValue" />`,
  }),
  play: async ({ canvas }) => {
    const hours = canvas.getByText('14', { selector: '.q-time__link' });
    await expect(hours).toBeVisible();
    const minutes = canvas.getByText('30', { selector: '.q-time__link' });
    await expect(minutes).toBeVisible();
    const closeButton = canvas.getByRole('button', { name: /zamknij/i });
    await expect(closeButton).toBeVisible();
  },
};

export const WithoutCloseButton: Story = {
  args: {
    modelValue: '14:30',
    showCloseButton: false,
  },
  render: (args) => ({
    components: { AbyssTime },
    setup() {
      return { args };
    },
    template: `<AbyssTime v-bind="args" v-model="args.modelValue" />`,
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
    components: { AbyssTime },
    setup() {
      const colors = ref(['hsl(345, 100%, 72%)', 'hsl(188, 98%, 30%)']);
      function changeColors() {
        colors.value = ['hsl(200, 100%, 50%)', 'hsl(260, 80%, 60%)'];
      }
      return { colors, changeColors };
    },
    template: `
      <div>
        <button data-testid="change-colors" @click="changeColors" style="margin-bottom:8px;">Zmień kolory</button>
        <AbyssTime model-value="14:30" :colors="colors" />
      </div>
    `,
  }),
  play: async ({ canvasElement, userEvent }) => {
    const el = canvasElement.querySelector('.q-time') as HTMLElement;
    const styleBefore = el.getAttribute('style');
    const btn = canvasElement.querySelector(
      '[data-testid="change-colors"]',
    ) as HTMLElement;
    await userEvent.click(btn);
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
    modelValue: '14:30',
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
    components: { AbyssTime },
    setup() {
      return { args };
    },
    template: `<AbyssTime v-bind="args" v-model="args.modelValue" />`,
  }),
  play: async ({ canvas }) => {
    const btn = canvas.getByRole('button', { name: /Gotowe/i });
    await expect(btn).toBeVisible();
  },
};
