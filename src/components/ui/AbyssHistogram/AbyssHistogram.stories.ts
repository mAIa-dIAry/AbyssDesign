import type { Meta, StoryObj } from '@storybook/vue3';
import { expect } from 'storybook/test';

import AbyssHistogram from '@/components/ui/AbyssHistogram/AbyssHistogram.vue';
import type { AbyssChartLabel } from '@/types/abyss-chart';
import { withAbyssBackground } from '@/stories/AbyssBackgroundDecorator';

const HOURS_IN_DAY = 24;

/** Przykładowa aktywność wg pory dnia — wyższa w godzinach roboczych i wieczorem. */
const HOURLY_ACTIVITY_PATTERN = [
  1, 0, 0, 0, 0, 1, 2, 4, 7, 9, 12, 14, 15, 13, 10, 8, 7, 9, 11, 10, 8, 5, 3, 1,
];

function toPercentages(values: number[]): number[] {
  const total = values.reduce((sum, value) => sum + value, 0);

  if (total <= 0) {
    return values.map(() => 0);
  }

  return values.map((value) => Math.round((value / total) * 100));
}

function buildSampleHistogramArgs(): {
  data: number[];
  labels: AbyssChartLabel[];
} {
  const data = toPercentages(HOURLY_ACTIVITY_PATTERN);
  const labels: AbyssChartLabel[] = [];

  for (let hour = 0; hour < HOURS_IN_DAY; hour += 1) {
    const paddedHour = String(hour).padStart(2, '0');

    labels.push({
      shortValue: paddedHour,
      value: `${paddedHour}:00`,
    });
  }

  return { data, labels };
}

const sampleHistogram = buildSampleHistogramArgs();
const samplePeakValue = Math.max(...sampleHistogram.data);

const WEEKDAY_LABELS: AbyssChartLabel[] = [
  { shortValue: 'pn', value: 'Poniedziałek' },
  { shortValue: 'wt', value: 'Wtorek' },
  { shortValue: 'śr', value: 'Środa' },
  { shortValue: 'cz', value: 'Czwartek' },
  { shortValue: 'pt', value: 'Piątek' },
  { shortValue: 'sb', value: 'Sobota' },
  { shortValue: 'nd', value: 'Niedziela' },
];

/** Wyższa aktywność w dni robocze, niższa w weekend. */
const WEEKDAY_ACTIVITY_PATTERN = [18, 16, 17, 15, 14, 9, 11];

function buildWeekdayHistogramArgs(): {
  data: number[];
  labels: AbyssChartLabel[];
} {
  return {
    data: toPercentages(WEEKDAY_ACTIVITY_PATTERN),
    labels: WEEKDAY_LABELS,
  };
}

const weekdayHistogram = buildWeekdayHistogramArgs();
const weekdayPeakValue = Math.max(...weekdayHistogram.data);

const meta: Meta<typeof AbyssHistogram> = {
  title: 'UI/AbyssHistogram',
  component: AbyssHistogram,
  tags: ['autodocs'],
  decorators: [withAbyssBackground],
  parameters: {
    docs: {
      description: {
        component:
          'Histogram słupkowy — koszyki / udział. Nie ciągła seria czasowa (to `AbyssChart`). `data` to wartości w przedziałach (np. udział procentowy w 24 godzinach doby), `labels` mapuje je na skrót osi (`shortValue`) i pełną etykietę w tooltipie (`value`).',
      },
    },
  },
  argTypes: {
    data: {
      control: 'object',
      description: 'Wartości w poszczególnych przedziałach',
      table: { defaultValue: { summary: '[]' } },
    },
    labels: {
      control: 'object',
      description:
        'Etykiety przedziałów: shortValue na osi, value w tooltipie i atrybucie title',
      table: { defaultValue: { summary: '[]' } },
    },
    attributeName: {
      control: 'text',
      description: 'Nazwa atrybutu w tooltipie (np. „Udział: 10%”)',
      table: { defaultValue: { summary: '—' } },
    },
    yAxisFormat: {
      control: 'select',
      options: ['number', 'percent'],
      description: 'Format etykiet osi Y i wartości w tooltipie',
      table: { defaultValue: { summary: 'number' } },
    },
    height: {
      control: { type: 'number', min: 80, max: 400, step: 10 },
      description: 'Wysokość panelu histogramu w px',
      table: { defaultValue: { summary: '150' } },
    },
  },
  args: {
    data: sampleHistogram.data,
    labels: sampleHistogram.labels,
    attributeName: 'Udział',
    yAxisFormat: 'percent',
    height: 150,
  },
};

export default meta;

type Story = StoryObj<typeof AbyssHistogram>;

export const Default: Story = {
  name: 'Domyślny',
  parameters: {
    docs: {
      description: {
        story:
          'Udział procentowy aktywności w 24 godzinach doby z automatycznym doborem widocznych etykiet osi.',
      },
      source: {
        code: `<AbyssHistogram
  :data="data"
  :labels="labels"
  attribute-name="Udział"
  y-axis-format="percent"
  :height="150"
/>`,
      },
    },
  },
  render: (args) => ({
    components: { AbyssHistogram },
    setup() {
      return { args };
    },
    template: '<AbyssHistogram v-bind="args" />',
  }),
  play: async ({ canvasElement }) => {
    const histogram = canvasElement.querySelector('.abyss-histogram');
    await expect(histogram).toBeInTheDocument();

    const yScaleLabels = canvasElement.querySelectorAll(
      '.abyss-histogram__y-scale-label',
    );
    await expect(yScaleLabels).toHaveLength(2);
    await expect(yScaleLabels[0]?.textContent).toBe(`${samplePeakValue}%`);
    await expect(yScaleLabels[1]?.textContent).toBe('0%');

    const axisLabels = canvasElement.querySelectorAll(
      '.abyss-histogram__axis-label',
    );
    await expect(axisLabels.length).toBeGreaterThan(0);
    await expect(axisLabels[0]?.textContent).toBe('00');

    const lastVisibleLabel = axisLabels[axisLabels.length - 1]?.textContent;
    await expect(lastVisibleLabel).toBeDefined();
    await expect(
      sampleHistogram.labels.some(
        (label) => label.shortValue === lastVisibleLabel,
      ),
    ).toBe(true);
    await expect(axisLabels[axisLabels.length - 1]?.getAttribute('title')).toBe(
      sampleHistogram.labels.find((label) => label.shortValue === lastVisibleLabel)
        ?.value,
    );
  },
};

export const Narrow: Story = {
  name: 'Wąski kontener',
  parameters: {
    docs: {
      description: {
        story:
          'Przy mniejszej szerokości histogram pokazuje rzadszą siatkę etykiet (co drugi, co trzeci słupek).',
      },
      source: {
        code: `<AbyssHistogram
  :data="data"
  :labels="labels"
  attribute-name="Udział"
  y-axis-format="percent"
  :height="150"
/>`,
      },
    },
  },
  render: (args) => ({
    components: { AbyssHistogram },
    setup() {
      return { args };
    },
    template: `
      <div style="width: 100%; max-width: 240px;">
        <AbyssHistogram v-bind="args" />
      </div>
    `,
  }),
  play: async ({ canvasElement }) => {
    const axisLabels = canvasElement.querySelectorAll(
      '.abyss-histogram__axis-label',
    );
    await expect(axisLabels.length).toBeLessThan(HOURS_IN_DAY);
    await expect(axisLabels[0]?.textContent).toBe('00');
    await expect(axisLabels[axisLabels.length - 1]?.textContent).not.toBe('23');
  },
};

export const Weekdays: Story = {
  name: 'Dni tygodnia',
  parameters: {
    docs: {
      description: {
        story:
          'Udział procentowy aktywności w poszczególne dni tygodnia (pn–nd).',
      },
      source: {
        code: `<AbyssHistogram
  :data="[18, 16, 17, 15, 14, 9, 11]"
  :labels="[
    { shortValue: 'pn', value: 'Poniedziałek' },
    { shortValue: 'wt', value: 'Wtorek' },
    { shortValue: 'śr', value: 'Środa' },
    { shortValue: 'cz', value: 'Czwartek' },
    { shortValue: 'pt', value: 'Piątek' },
    { shortValue: 'sb', value: 'Sobota' },
    { shortValue: 'nd', value: 'Niedziela' },
  ]"
  attribute-name="Udział"
  y-axis-format="percent"
  :height="150"
/>`,
      },
    },
  },
  args: {
    data: weekdayHistogram.data,
    labels: weekdayHistogram.labels,
    attributeName: 'Udział',
    yAxisFormat: 'percent',
    height: 150,
  },
  render: (args) => ({
    components: { AbyssHistogram },
    setup() {
      return { args };
    },
    template: '<AbyssHistogram v-bind="args" />',
  }),
  play: async ({ canvasElement }) => {
    const axisLabels = canvasElement.querySelectorAll(
      '.abyss-histogram__axis-label',
    );
    await expect(axisLabels).toHaveLength(WEEKDAY_LABELS.length);
    await expect(axisLabels[0]?.textContent).toBe('pn');
    await expect(axisLabels[0]?.getAttribute('title')).toBe('Poniedziałek');
    await expect(axisLabels[6]?.textContent).toBe('nd');
    await expect(axisLabels[6]?.getAttribute('title')).toBe('Niedziela');

    const yScaleLabels = canvasElement.querySelectorAll(
      '.abyss-histogram__y-scale-label',
    );
    await expect(yScaleLabels[0]?.textContent).toBe(`${weekdayPeakValue}%`);
  },
};
