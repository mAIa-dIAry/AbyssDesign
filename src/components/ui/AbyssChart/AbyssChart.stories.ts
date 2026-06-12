import type { Meta, StoryObj } from '@storybook/vue3';
import { expect } from 'storybook/test';

import AbyssChart from '@/components/ui/AbyssChart/AbyssChart.vue';
import type { AbyssChartLabel } from '@/types/abyss-chart';
import { withAbyssBackground } from '@/stories/AbyssBackgroundDecorator';

function buildSampleChartArgs(): {
  data: number[];
  labels: AbyssChartLabel[];
} {
  const data: number[] = [];
  const labels: AbyssChartLabel[] = [];

  for (let daysAgo = 0; daysAgo < 30; daysAgo += 1) {
    const day = new Date();
    day.setDate(day.getDate() - daysAgo);

    data.push((daysAgo % 5) + 1);
    labels.push({
      shortValue: String(day.getDate()).padStart(2, '0'),
      value: day.toLocaleDateString('pl-PL', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
    });
  }

  return {
    data: data.reverse(),
    labels: labels.reverse(),
  };
}

const sampleChart = buildSampleChartArgs();

const meta: Meta<typeof AbyssChart> = {
  title: 'UI/AbyssChart',
  component: AbyssChart,
  tags: ['autodocs'],
  decorators: [withAbyssBackground],
  parameters: {
    docs: {
      description: {
        component:
          'Wykres area z responsywnymi etykietami osi X. `data` to wartości liczbowe, `labels` mapuje je na skrót osi (`shortValue`) i pełną etykietę w tooltipie (`value`).',
      },
    },
  },
  argTypes: {
    data: {
      control: 'object',
      description: 'Wartości liczbowe wykresu',
      table: { defaultValue: { summary: '[]' } },
    },
    labels: {
      control: 'object',
      description:
        'Etykiety osi: shortValue na osi, value w tooltipie i atrybucie title',
      table: { defaultValue: { summary: '[]' } },
    },
    attributeName: {
      control: 'text',
      description: 'Nazwa atrybutu w tooltipie (np. „Notatki: 5”)',
      table: { defaultValue: { summary: '—' } },
    },
    height: {
      control: { type: 'number', min: 80, max: 400, step: 10 },
      description: 'Wysokość panelu wykresu w px',
      table: { defaultValue: { summary: '150' } },
    },
  },
  args: {
    data: sampleChart.data,
    labels: sampleChart.labels,
    attributeName: 'Notatki',
    height: 150,
  },
};

export default meta;

type Story = StoryObj<typeof AbyssChart>;

export const Default: Story = {
  name: 'Domyślny',
  parameters: {
    docs: {
      description: {
        story: '30 dni aktywności z automatycznym doborem widocznych etykiet.',
      },
      source: {
        code: `<AbyssChart
  :data="data"
  :labels="labels"
  attribute-name="Notatki"
  :height="150"
/>`,
      },
    },
  },
  render: (args) => ({
    components: { AbyssChart },
    setup() {
      return { args };
    },
    template: '<AbyssChart v-bind="args" />',
  }),
  play: async ({ canvasElement }) => {
    const chart = canvasElement.querySelector('.abyss-chart');
    await expect(chart).toBeInTheDocument();

    const yScaleLabels = canvasElement.querySelectorAll(
      '.abyss-chart__y-scale-label',
    );
    await expect(yScaleLabels).toHaveLength(2);
    await expect(yScaleLabels[0]?.textContent).toBe('5');
    await expect(yScaleLabels[1]?.textContent).toBe('0');

    const axisLabels = canvasElement.querySelectorAll(
      '.abyss-chart__axis-label',
    );
    await expect(axisLabels.length).toBeGreaterThan(0);

    const lastLabel = sampleChart.labels[sampleChart.labels.length - 1];
    await expect(axisLabels[axisLabels.length - 1]?.textContent).toBe(
      lastLabel?.shortValue,
    );
    await expect(axisLabels[axisLabels.length - 1]?.getAttribute('title')).toBe(
      lastLabel?.value,
    );
  },
};

export const Narrow: Story = {
  name: 'Wąski kontener',
  parameters: {
    docs: {
      description: {
        story:
          'Przy mniejszej szerokości wykres pokazuje mniej etykiet, zachowując ostatni punkt.',
      },
      source: {
        code: `<AbyssChart
  :data="data"
  :labels="labels"
  attribute-name="Notatki"
  :height="150"
/>`,
      },
    },
  },
  render: (args) => ({
    components: { AbyssChart },
    setup() {
      return { args };
    },
    template: `
      <div style="width: 100%; max-width: 240px;">
        <AbyssChart v-bind="args" />
      </div>
    `,
  }),
  play: async ({ canvasElement }) => {
    const axisLabels = canvasElement.querySelectorAll(
      '.abyss-chart__axis-label',
    );
    await expect(axisLabels.length).toBeLessThan(12);

    const lastLabel = sampleChart.labels[sampleChart.labels.length - 1];
    await expect(axisLabels[axisLabels.length - 1]?.textContent).toBe(
      lastLabel?.shortValue,
    );
  },
};
