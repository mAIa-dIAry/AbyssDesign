import type { Meta, StoryObj } from '@storybook/vue3';
import { expect, userEvent } from 'storybook/test';

import AbyssMarkdown from '@/components/ui/AbyssMarkdown/AbyssMarkdown.vue';
import { withAbyssBackground } from '@/stories/AbyssBackgroundDecorator';

const sampleMarkdown = [
  '## Nowości',
  '',
  '- **Synchronizacja LAN:** naprawiony seed notatek',
  '- **Electron:** utrwalony port serwera renderera',
  '',
  '### Poprawki',
  '',
  '- Stabilniejsze OTA na Androidzie',
  '- Wersja `1.4.0` jest dostępna.',
].join('\n');

const meta: Meta<typeof AbyssMarkdown> = {
  title: 'UI/AbyssMarkdown',
  component: AbyssMarkdown,
  tags: ['autodocs'],
  decorators: [withAbyssBackground],
  parameters: {
    docs: {
      description: {
        component:
          'Panel Markdown z przełącznikiem podglądu i kodu źródłowego. ' +
          'Tryb preview renderuje sanityzowany HTML przez AbyssContent; tryb code pokazuje surowy Markdown.',
      },
    },
  },
  argTypes: {
    source: {
      control: 'text',
      description: 'Treść Markdown',
    },
    modelValue: {
      control: 'radio',
      options: ['preview', 'code'],
      description: 'Aktywny widok (v-model)',
      table: { defaultValue: { summary: 'preview' } },
    },
    title: {
      control: 'text',
      description: 'Opcjonalny tytuł panelu',
    },
    contentMode: {
      control: 'radio',
      options: ['html-note', 'html-changelog'],
      description: 'Preset stylów HTML w podglądzie',
      table: { defaultValue: { summary: 'html-note' } },
    },
    size: {
      control: 'radio',
      options: ['md', 'sm'],
      table: { defaultValue: { summary: 'md' } },
    },
    tone: {
      control: 'radio',
      options: ['default', 'muted'],
      table: { defaultValue: { summary: 'default' } },
    },
  },
  args: {
    source: sampleMarkdown,
    modelValue: 'preview',
    contentMode: 'html-changelog',
  },
};

export default meta;
type Story = StoryObj<typeof AbyssMarkdown>;

export const Preview: Story = {
  name: 'Podgląd',
  parameters: {
    docs: {
      description: {
        story: 'Domyślny widok preview z presetem html-changelog.',
      },
      source: {
        code: `<AbyssMarkdown :source="markdown" content-mode="html-changelog" />`,
      },
    },
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/Synchronizacja LAN/)).toBeVisible();
  },
};

export const CodeView: Story = {
  name: 'Kod źródłowy',
  args: {
    modelValue: 'code',
  },
  parameters: {
    docs: {
      description: {
        story: 'Widok surowego Markdown w bloku monospace.',
      },
      source: {
        code: `<AbyssMarkdown :source="markdown" v-model="view" />`,
      },
    },
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/Synchronizacja LAN/)).toBeVisible();
  },
};

export const WithTitle: Story = {
  name: 'Z tytułem',
  args: {
    title: 'Opis wydania',
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Opis wydania')).toBeVisible();
  },
};

export const ToggleView: Story = {
  name: 'Przełączanie widoków',
  render: () => ({
    components: { AbyssMarkdown },
    setup() {
      return { source: sampleMarkdown };
    },
    template: `
      <div style="width: min(100%, 720px);">
        <AbyssMarkdown :source="source" content-mode="html-changelog" />
      </div>
    `,
  }),
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/Synchronizacja LAN/)).toBeVisible();

    const codeButton = canvas.getByRole('radio', { name: /Kod źródłowy/i });
    await userEvent.click(codeButton);

    await expect(canvas.getByText('## Nowości')).toBeVisible();
  },
};

export const Empty: Story = {
  name: 'Pusty',
  args: {
    source: '',
  },
};
