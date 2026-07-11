import type { Meta, StoryObj } from '@storybook/vue3';
import { expect } from 'storybook/test';

import AbyssPanel from '@/components/ui/AbyssPanel/AbyssPanel.vue';
import AbyssTile from '@/components/ui/AbyssTile/AbyssTile.vue';
import AbyssGrid from '@/components/ui/AbyssGrid/AbyssGrid.vue';
import { withAbyssBackground } from '@/stories/AbyssBackgroundDecorator';

type AbyssPanelStoryArgs = {
  title?: string;
};

const STORY_FRAME_STYLE = 'width: 100%; max-width: 720px; min-width: 320px;';

const meta: Meta<AbyssPanelStoryArgs> = {
  title: 'UI/AbyssPanel',
  component: AbyssPanel,
  tags: ['autodocs'],
  decorators: [withAbyssBackground],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Panel z obramowaniem i opcjonalnym nagłówkiem. Nie styluje treści HTML — ' +
          'proza i Markdown idą przez AbyssContent w slocie (np. ChangeLog w MaiaApp) lub AbyssMarkdown z przełącznikiem preview/code.',
      },
    },
  },
  argTypes: {
    title: {
      control: 'text',
      description: 'Nagłówek panelu renderowany jako h2',
    },
  },
  args: {
    title: 'Stan sieci',
  },
};

export default meta;

type Story = StoryObj<AbyssPanelStoryArgs>;

export const Default: Story = {
  name: 'Domyślny',
  parameters: {
    docs: {
      description: {
        story:
          'Typowy układ jak w panelu synchronizacji: siatka kafelków pod nagłówkiem panelu.',
      },
      source: {
        code: `<AbyssPanel title="Stan sieci">
  <AbyssGrid :max-columns="3" column-size="minmax(0, 1fr)">
    <AbyssTile title="Status">Połączono</AbyssTile>
    <AbyssTile title="Sieć" monospace>net-42</AbyssTile>
    <AbyssTile title="Urządzenia">3</AbyssTile>
  </AbyssGrid>
</AbyssPanel>`,
      },
    },
  },
  render: (args) => ({
    components: { AbyssPanel, AbyssGrid, AbyssTile },
    setup: () => ({ args, storyFrameStyle: STORY_FRAME_STYLE }),
    template: `
      <div :style="storyFrameStyle">
        <AbyssPanel :title="args.title">
          <AbyssGrid :max-columns="3" column-size="minmax(0, 1fr)">
            <AbyssTile title="Status">Połączono</AbyssTile>
            <AbyssTile title="Sieć" monospace>net-a1b2-c3d4</AbyssTile>
            <AbyssTile title="Urządzenia">3</AbyssTile>
          </AbyssGrid>
        </AbyssPanel>
      </div>
    `,
  }),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('heading', { level: 2 })).toHaveTextContent(
      'Stan sieci',
    );
    await expect(canvas.getByText('Połączono')).toBeVisible();
    await expect(canvas.getByText('net-a1b2-c3d4')).toBeVisible();
  },
};
