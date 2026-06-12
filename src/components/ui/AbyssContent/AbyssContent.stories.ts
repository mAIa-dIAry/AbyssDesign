import type { Meta, StoryObj } from '@storybook/vue3';
import { expect } from 'storybook/test';
import AbyssContent from './AbyssContent.vue';
import { withAbyssBackground } from '@/stories/AbyssBackgroundDecorator';

const sampleHtml = [
  '<p>To jest <strong>pogrubiony</strong> akapit z <em>kursywą</em>, ',
  '<u>podkreśleniem</u> i <s>przekreśleniem</s>.</p>',
  '<ul><li>Pierwszy punkt listy</li><li>Drugi punkt listy</li></ul>',
  '<ol><li>Krok jeden</li><li>Krok dwa</li></ol>',
  '<p>Ostatni akapit notatki.</p>',
].join('');

const paragraphsHtml = [
  '<p>Pierwszy akapit z treścią notatki lub changelogu.</p>',
  '<p>Drugi akapit oddzielony odstępem 12 px od poprzedniego bloku.</p>',
  '<p>Ostatni akapit bez dolnego marginesu.</p>',
].join('');

const unorderedListHtml = [
  '<ul>',
  '<li>Pierwszy punkt listy nienumerowanej</li>',
  '<li>Drugi punkt z <strong>pogrubieniem</strong></li>',
  '<li>Trzeci punkt na końcu listy</li>',
  '</ul>',
].join('');

const orderedListHtml = [
  '<ol>',
  '<li>Otwórz ustawienia aplikacji</li>',
  '<li>Przejdź do zakładki aktualizacji</li>',
  '<li>Sprawdź dostępność nowej wersji</li>',
  '</ol>',
].join('');

const headingsHtml = [
  '<h1>Nagłówek pierwszego poziomu</h1>',
  '<p>Akapit wprowadzający pod nagłówkiem H1.</p>',
  '<h2>Nagłówek drugiego poziomu</h2>',
  '<p>Treść sekcji pod H2 z dodatkowym kontekstem.</p>',
  '<h3>Nagłówek trzeciego poziomu</h3>',
  '<ul><li>Pierwszy punkt listy pod H3</li><li>Drugi punkt listy pod H3</li></ul>',
].join('');

const changelogHtml = [
  '<p>Krótki lead changelogu bez nagłówka.</p>',
  '<ul>',
  '<li><strong>Synchronizacja LAN:</strong> naprawiony seed notatek</li>',
  '<li><strong>Electron:</strong> utrwalony port serwera renderera</li>',
  '</ul>',
].join('');

const meta: Meta<typeof AbyssContent> = {
  title: 'UI/AbyssContent',
  component: AbyssContent,
  tags: ['autodocs'],
  decorators: [withAbyssBackground],
  parameters: {
    docs: {
      description: {
        component:
          'Kontener treści HTML z presetami `html-note` (notatki) ' +
          'i `html-changelog` (release notes z nagłówkami i code). ' +
          'Sanityzacja odbywa się przy zapisie notatki lub wczytaniu changelogu — ' +
          'render używa gotowego HTML bez ponownego parsowania. ' +
          'Bloki treści (`p`, `ul`, `ol`, `h1`–`h3`) mają `margin-bottom: 12px`, ' +
          'ostatni blok w kontenerze — `margin-bottom: 0`.',
      },
    },
  },
  argTypes: {
    html: {
      control: 'text',
      description: 'Źródło treści w HTML',
      table: { defaultValue: { summary: 'undefined' } },
    },
    mode: {
      control: 'radio',
      options: ['html-note', 'html-changelog'],
      description: 'Preset stylów HTML (notatka vs changelog)',
      table: { defaultValue: { summary: 'html-note' } },
    },
    size: {
      control: 'radio',
      options: ['md', 'sm'],
      description: 'Rozmiar typografii: md (edytor), sm (timeline, changelog)',
      table: { defaultValue: { summary: 'md' } },
    },
    tone: {
      control: 'radio',
      options: ['default', 'muted'],
      description:
        'Kolor tekstu — muted dla changelogu i komunikatów pomocniczych',
      table: { defaultValue: { summary: 'default' } },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'Domyślny',
  parameters: {
    docs: {
      description: {
        story: 'Mieszane bloki HTML — akapity, listy i formatowanie inline.',
      },
      source: {
        code: `<AbyssContent :html="noteHtml" />`,
      },
    },
  },
  args: {
    html: sampleHtml,
    mode: 'html-note',
  },
  play: async ({ canvas }) => {
    const paragraph = canvas.getByText(/pogrubiony/);
    await expect(paragraph).toBeVisible();
    await expect(paragraph.closest('strong')).toBeTruthy();
  },
};

export const Paragraphs: Story = {
  name: 'Akapity',
  parameters: {
    docs: {
      description: {
        story:
          'Kolejne akapity z odstępem 12 px między blokami; ostatni bez dolnego marginesu.',
      },
      source: {
        code: `<AbyssContent :html="paragraphsHtml" />`,
      },
    },
  },
  args: {
    html: paragraphsHtml,
    mode: 'html-note',
  },
  play: async ({ canvas }) => {
    const paragraphs = canvas.getAllByText(/akapit/i);
    await expect(paragraphs).toHaveLength(3);
  },
};

export const UnorderedList: Story = {
  name: 'Lista nienumerowana',
  parameters: {
    docs: {
      description: {
        story: 'Lista punktowana (`ul`) z wcięciem i odstępem blokowym.',
      },
      source: {
        code: `<AbyssContent :html="unorderedListHtml" />`,
      },
    },
  },
  args: {
    html: unorderedListHtml,
    mode: 'html-note',
  },
  play: async ({ canvas }) => {
    const list = canvas.getByRole('list');
    await expect(list).toBeVisible();
    await expect(canvas.getAllByRole('listitem')).toHaveLength(3);
  },
};

export const OrderedList: Story = {
  name: 'Lista numerowana',
  parameters: {
    docs: {
      description: {
        story: 'Lista numerowana (`ol`) z wcięciem i odstępem blokowym.',
      },
      source: {
        code: `<AbyssContent :html="orderedListHtml" />`,
      },
    },
  },
  args: {
    html: orderedListHtml,
    mode: 'html-note',
  },
  play: async ({ canvas }) => {
    const list = canvas.getByRole('list');
    await expect(list).toBeVisible();
    await expect(
      canvas.getByText(/Otwórz ustawienia aplikacji/i),
    ).toBeVisible();
  },
};

export const Headings: Story = {
  name: 'Nagłówki (slot)',
  parameters: {
    docs: {
      description: {
        story:
          'Hierarchia nagłówków H1–H3 przekazana przez slot — bez sanityzacji HTML.',
      },
      source: {
        code: `<AbyssContent>
  <h1>Nagłówek pierwszego poziomu</h1>
  <p>Akapit pod H1.</p>
  <h2>Nagłówek drugiego poziomu</h2>
  <p>Akapit pod H2.</p>
  <h3>Nagłówek trzeciego poziomu</h3>
  <p>Ostatni akapit.</p>
</AbyssContent>`,
      },
    },
  },
  render: () => ({
    components: { AbyssContent },
    template: `
      <AbyssContent>
        <h1>Nagłówek pierwszego poziomu</h1>
        <p>Akapit pod H1.</p>
        <h2>Nagłówek drugiego poziomu</h2>
        <p>Akapit pod H2.</p>
        <h3>Nagłówek trzeciego poziomu</h3>
        <p>Ostatni akapit.</p>
      </AbyssContent>
    `,
  }),
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole('heading', { level: 1, name: /pierwszego poziomu/i }),
    ).toBeVisible();
    await expect(
      canvas.getByRole('heading', { level: 2, name: /drugiego poziomu/i }),
    ).toBeVisible();
    await expect(
      canvas.getByRole('heading', { level: 3, name: /trzeciego poziomu/i }),
    ).toBeVisible();
  },
};

export const HeadingsChangelog: Story = {
  name: 'Nagłówki (html-changelog)',
  parameters: {
    docs: {
      description: {
        story: 'Nagłówki H1–H3 w HTML changelogu — preset `html-changelog`.',
      },
      source: {
        code: `<AbyssContent :html="headingsHtml" mode="html-changelog" />`,
      },
    },
  },
  args: {
    html: headingsHtml,
    mode: 'html-changelog',
  },
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole('heading', { level: 1, name: /pierwszego poziomu/i }),
    ).toBeVisible();
    await expect(
      canvas.getByRole('heading', { level: 2, name: /drugiego poziomu/i }),
    ).toBeVisible();
    await expect(
      canvas.getByRole('heading', { level: 3, name: /trzeciego poziomu/i }),
    ).toBeVisible();
  },
};

export const TimelineSize: Story = {
  name: 'Timeline (sm)',
  parameters: {
    docs: {
      description: {
        story: 'Mniejsza typografia dla wpisów na osi czasu.',
      },
      source: {
        code: `<AbyssContent :html="noteHtml" size="sm" />`,
      },
    },
  },
  args: {
    html: '<p>Krótka notatka z archiwum.</p>',
    mode: 'html-note',
    size: 'sm',
  },
  play: async ({ canvas }) => {
    const content = canvas.getByText('Krótka notatka z archiwum.');
    await expect(content).toBeVisible();
    await expect(content.closest('.abyss-content--sm')).toBeTruthy();
  },
};

export const ChangelogHtml: Story = {
  name: 'Changelog (html-changelog)',
  parameters: {
    docs: {
      description: {
        story: 'Treść changelogu w HTML — akapity i listy z pogrubieniem.',
      },
      source: {
        code: `<AbyssContent :html="changelogHtml" mode="html-changelog" />`,
      },
    },
  },
  args: {
    html: changelogHtml,
    mode: 'html-changelog',
  },
  play: async ({ canvas }) => {
    const content = canvas.getByText(/Synchronizacja LAN/);
    await expect(content).toBeVisible();
    await expect(content.closest('strong')).toBeTruthy();
  },
};
