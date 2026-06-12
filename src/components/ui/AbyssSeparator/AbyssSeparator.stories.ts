import type { Meta, StoryObj } from '@storybook/vue3';
import { expect } from 'storybook/test';
import AbyssSeparator from '@/components/ui/AbyssSeparator/AbyssSeparator.vue';
import { withAbyssBackground } from '@/stories/AbyssBackgroundDecorator';

const meta: Meta<typeof AbyssSeparator> = {
  title: 'UI/AbyssSeparator',
  component: AbyssSeparator,
  tags: ['autodocs'],
  decorators: [withAbyssBackground],
};

export default meta;
type Story = StoryObj<typeof AbyssSeparator>;

export const Default: Story = {
  name: 'Domyślny',
  parameters: {
    docs: {
      description: {
        story: 'Podstawowy separator gotowy pod stylowanie.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const separator = canvasElement.querySelector('.abyss-separator');
    await expect(separator).toBeInTheDocument();
  },
};
