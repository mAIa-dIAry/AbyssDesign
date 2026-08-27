import type { Meta, StoryObj } from '@storybook/vue3';
import { expect } from 'storybook/test';
import AbyssTime from '@/components/ui/AbyssTime/AbyssTime.vue';
import { withAbyssBackground } from '@/stories/AbyssBackgroundDecorator';

const nativePickerWarning =
  '**Nigdy nie używaj systemowych selektorów czasu** (`<input type="time">`, `<input type="datetime-local">` z natywnym UI przeglądarki/OS). ' +
  'W formularzu używaj wyłącznie `AbyssInput` z `type="time"` / `"datetime-local"` (osadza ten picker w popupie). ' +
  'Samodzielny `AbyssTime` tylko w popupie lub toolbarze — nie jako pole formularza ustawień.';

const meta: Meta<typeof AbyssTime> = {
  title: 'UI/AbyssTime',
  component: AbyssTime,
  decorators: [withAbyssBackground],
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Picker czasu w Abyss. W formularzu nie osadzaj go samodzielnie — użyj `AbyssInput` z `type="time"` / `"datetime-local"`. Samodzielnie tylko w popupie / toolbarze. Układ jak `AbyssDialog`: zegar w body, separator i stopka z Anuluj (`flat`) oraz Potwierdź (`flat` + `gradient` + `success`).\n\n' +
          `${nativePickerWarning}\n\n` +
          'Przy osadzaniu w `q-popup-proxy` ustaw wymaganą klasę integracyjną `class="abyss-time-menu"` na elemencie popup oraz `:breakpoint="0"`, żeby Quasar nie przełączał pickera na modal `QDialog` na małych viewportach.\n\n' +
          '```html\n<q-popup-proxy class="abyss-time-menu" :breakpoint="0">\n  <AbyssTime v-model="time" @close="popup = false" />\n</q-popup-proxy>\n```',
      },
    },
  },
  argTypes: {
    modelValue: { control: 'text' },
    'onUpdate:modelValue': { action: 'update:modelValue' },
    onClose: { action: 'close' },
    onConfirm: { action: 'confirm' },
    mask: { control: 'text' },
    format24h: { control: 'boolean' },
    nowBtn: { control: 'boolean' },
    dark: { control: 'boolean' },
    cancelLabel: { control: 'text' },
    confirmLabel: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof AbyssTime>;

export const Default: Story = {
  name: 'Domyślny',
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
    await expect(canvas.getByRole('button', { name: /anuluj/i })).toBeVisible();
    const confirmButton = canvas.getByRole('button', { name: /potwierdź/i });
    await expect(confirmButton).toBeVisible();
    await expect(confirmButton).toHaveClass('flat');
    await expect(confirmButton).toHaveClass('gradient');
  },
};
