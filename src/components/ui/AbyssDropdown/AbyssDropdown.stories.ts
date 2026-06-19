import type { Meta, StoryObj } from '@storybook/vue3';
import { expect, userEvent, within } from 'storybook/test';
import AbyssButton from '@/components/ui/AbyssButton/AbyssButton.vue';
import AbyssDropdown from '@/components/ui/AbyssDropdown/AbyssDropdown.vue';
import type { AbyssDropdownProps } from '@/components/ui/AbyssDropdown/AbyssDropdown.vue';
import { withAbyssBackground } from '@/stories/AbyssBackgroundDecorator';

const meta = {
  title: 'UI/AbyssDropdown',
  component: AbyssDropdown,
  decorators: [withAbyssBackground],
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Stylizowany panel rozwijany oparty na `QMenu` — ten sam wygląd co lista opcji w `AbyssSelect`, z pełną obwódką (bez clip-path selecta). Pozycje menu to `AbyssButton` (`flat`, `full-width`). Umieszczany jako bezpośrednie dziecko elementu-aktywatora.',
      },
    },
  },
  argTypes: {
    anchor: {
      control: 'text',
      description: 'Punkt zakotwiczenia względem aktywatora (Quasar `anchor`)',
      table: { defaultValue: { summary: 'bottom left' } },
    },
    self: {
      control: 'text',
      description: 'Punkt wyrównania menu (Quasar `self`)',
      table: { defaultValue: { summary: 'top left' } },
    },
    dense: {
      control: 'boolean',
      description: 'Mniejszy padding wokół zawartości',
      table: { defaultValue: { summary: 'false' } },
    },
    minWidth: {
      control: 'number',
      description: 'Minimalna szerokość panelu w px',
      table: { defaultValue: { summary: '0' } },
    },
  },
} satisfies Meta<AbyssDropdownProps>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'Domyślny',
  parameters: {
    docs: {
      description: {
        story: 'Przycisk z menu akcji — typowy wzorzec dla panelu administracyjnego.',
      },
      source: {
        code: `<AbyssButton flat icon="sym_r_more_vert" label="Akcje">
  <AbyssDropdown anchor="bottom right" self="top right" :min-width="200">
    <AbyssButton
      v-close-popup
      flat
      full-width
      size="medium"
      label="Edytuj"
      icon="sym_r_edit"
    />
    <AbyssButton
      v-close-popup
      flat
      full-width
      size="medium"
      class="text-negative"
      label="Usuń"
      icon="sym_r_delete"
    />
  </AbyssDropdown>
</AbyssButton>`,
      },
    },
  },
  render: (args) => ({
    components: { AbyssButton, AbyssDropdown },
    setup: () => ({ args }),
    template: `
      <AbyssButton flat icon="sym_r_more_vert" label="Akcje">
        <AbyssDropdown v-bind="args">
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
            class="text-negative"
            label="Usuń"
          />
        </AbyssDropdown>
      </AbyssButton>
    `,
  }),
  args: {
    anchor: 'bottom right',
    self: 'top right',
    minWidth: 200,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: 'Akcje' });

    await userEvent.click(trigger);

    const body = within(document.body);
    await expect(body.getByRole('button', { name: 'Edytuj' })).toBeVisible();
    await expect(body.getByRole('button', { name: 'Usuń' })).toBeVisible();
  },
};
