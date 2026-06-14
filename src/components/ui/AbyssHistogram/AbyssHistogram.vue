<template>
  <div
    ref="panelRef"
    class="abyss-histogram"
    :class="$props.class"
    :style="[
      histogramLayoutStyle,
      { height: `${height}px`, minHeight: `${height}px` },
      style,
    ]"
    v-bind="$attrs"
  >
    <template v-if="hasData">
      <div class="abyss-histogram__layout">
        <div class="abyss-histogram__y-scale" aria-hidden="true">
          <span class="abyss-histogram__y-scale-label">
            {{ formatAxisValue(histogramYAxisMax) }}
          </span>
          <span class="abyss-histogram__y-scale-label">{{
            formatAxisValue(0)
          }}</span>
        </div>

        <div ref="plotRef" class="abyss-histogram__plot">
          <component
            :is="VueApexCharts"
            v-if="isChartRuntimeReady && chartWidth > 0"
            class="abyss-histogram__canvas"
            type="bar"
            :height="plotHeight"
            :options="histogramOptions"
            :series="histogramSeries"
          />
        </div>

        <div class="abyss-histogram__axis" aria-hidden="true">
          <span
            v-for="index in visibleTickIndexList"
            :key="index"
            class="abyss-histogram__axis-label"
            :style="axisLabelStyle(index)"
            :title="histogramLabels[index]?.value"
          >
            {{ histogramLabels[index]?.shortValue }}
          </span>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { ApexOptions } from 'apexcharts';
import type { Component } from 'vue';
import { computed, onMounted, onUnmounted, ref, shallowRef } from 'vue';

import {
  ABYSS_HISTOGRAM_AXIS_LABEL_HEIGHT_PX,
  ABYSS_HISTOGRAM_INSET_PX,
} from '@/components/ui/AbyssHistogram/AbyssHistogram.constants';
import { loadAbyssChartRuntime } from '@/components/ui/AbyssChart/loadAbyssChartRuntime';
import type { AbyssChartLabel } from '@/types/abyss-chart';

export interface AbyssHistogramProps {
  data: number[];
  labels: AbyssChartLabel[];
  attributeName: string;
  yAxisFormat?: 'number' | 'percent';
  height?: number;
  style?: string | Record<string, string>;
  class?:
    | string
    | Record<string, boolean>
    | Array<string | Record<string, boolean>>;
}

const props = withDefaults(defineProps<AbyssHistogramProps>(), {
  yAxisFormat: 'number',
  height: 150,
  style: '',
  class: '',
});

const LABEL_MIN_WIDTH_PX = 28;
const MIN_VISIBLE_TICKS = 3;
const MAX_VISIBLE_TICKS = 100;

const histogramLayoutStyle = {
  '--abyss-histogram-inset': `${ABYSS_HISTOGRAM_INSET_PX}px`,
  '--abyss-histogram-axis-label-height': `${ABYSS_HISTOGRAM_AXIS_LABEL_HEIGHT_PX}px`,
} as const;

const plotHeight = computed(
  () =>
    props.height -
    ABYSS_HISTOGRAM_INSET_PX * 2 -
    ABYSS_HISTOGRAM_AXIS_LABEL_HEIGHT_PX,
);

const pointCount = computed(() =>
  Math.min(props.data.length, props.labels.length),
);

const hasData = computed(() => pointCount.value > 0);

const histogramLabels = computed(() =>
  props.labels.slice(0, pointCount.value),
);

const histogramValues = computed(() => props.data.slice(0, pointCount.value));

const shortAxisValues = computed(() =>
  histogramLabels.value.map((label) => label.shortValue),
);

const histogramYAxisMax = computed(() => {
  const peakValue = histogramValues.value.reduce(
    (peak, value) => Math.max(peak, value),
    0,
  );

  return Math.max(peakValue, 1);
});

function formatAxisValue(value: number): string {
  if (props.yAxisFormat === 'percent') {
    return `${value}%`;
  }

  return String(value);
}

const histogramSeries = computed(() => [
  {
    name: props.attributeName,
    data: histogramValues.value,
  },
]);

const panelRef = ref<HTMLElement | null>(null);
const plotRef = ref<HTMLElement | null>(null);
const VueApexCharts = shallowRef<Component | null>(null);
const isChartRuntimeReady = ref(false);
const chartWidth = ref(0);
let resizeObserver: ResizeObserver | null = null;
let chartRuntimeLoadId = 0;

function resolveMaxLabelCount(widthPx: number, pointCount: number): number {
  if (pointCount <= 0) {
    return MIN_VISIBLE_TICKS;
  }

  if (widthPx <= 0) {
    return Math.min(pointCount, MIN_VISIBLE_TICKS);
  }

  const labelsByWidth = Math.floor(widthPx / LABEL_MIN_WIDTH_PX);

  return Math.min(
    pointCount,
    MAX_VISIBLE_TICKS,
    Math.max(MIN_VISIBLE_TICKS, labelsByWidth),
  );
}

/**
 * Smallest step (1 = every bar, 2 = every other, …) so at most `maxLabels` fit on the grid.
 */
function resolveBarLabelStep(length: number, maxLabels: number): number {
  if (length <= 0) {
    return 1;
  }

  let step = 1;

  while (Math.ceil(length / step) > maxLabels) {
    step += 1;
  }

  return step;
}

/**
 * Label indices aligned to the bar grid: 0, step, 2×step, …
 */
function buildBarGridTickIndices(
  length: number,
  maxLabels: number,
): number[] {
  if (length <= 0) {
    return [];
  }

  if (length <= maxLabels) {
    return Array.from({ length }, (_, index) => index);
  }

  const step = resolveBarLabelStep(length, maxLabels);
  const indices: number[] = [];

  for (let index = 0; index < length; index += step) {
    indices.push(index);
  }

  return indices;
}

const maxLabelCount = computed(() =>
  resolveMaxLabelCount(chartWidth.value, pointCount.value),
);

const visibleTickIndices = computed(() =>
  buildBarGridTickIndices(pointCount.value, maxLabelCount.value),
);

const visibleTickIndexList = computed(() => visibleTickIndices.value);

/** Centers the label under bar `index` in an evenly spaced categorical grid. */
function axisLabelStyle(index: number): Record<string, string> {
  const count = pointCount.value;

  if (count <= 0) {
    return {};
  }

  const centerPercent = ((index + 0.5) / count) * 100;

  return {
    left: `${centerPercent}%`,
    transform: 'translateX(-50%)',
  };
}

function syncChartWidth(width: number): boolean {
  const roundedWidth = Math.round(width);

  if (roundedWidth <= 0 || roundedWidth === chartWidth.value) {
    return false;
  }

  chartWidth.value = roundedWidth;
  return true;
}

function syncPlotWidth(): void {
  const plot = plotRef.value;

  if (!plot) {
    return;
  }

  syncChartWidth(plot.clientWidth);
}

function observeElement(element: HTMLElement | null): void {
  if (!element || !resizeObserver) {
    return;
  }

  resizeObserver.observe(element);
}

onMounted(() => {
  const currentLoadId = ++chartRuntimeLoadId;

  void loadAbyssChartRuntime().then((component) => {
    if (currentLoadId !== chartRuntimeLoadId) {
      return;
    }

    VueApexCharts.value = component;
    isChartRuntimeReady.value = true;
  });

  syncPlotWidth();

  if (typeof ResizeObserver === 'undefined') {
    return;
  }

  resizeObserver = new ResizeObserver(() => {
    syncPlotWidth();
  });
  observeElement(plotRef.value);
  observeElement(panelRef.value);
});

onUnmounted(() => {
  chartRuntimeLoadId += 1;
  VueApexCharts.value = null;
  isChartRuntimeReady.value = false;
  resizeObserver?.disconnect();
  resizeObserver = null;
});

const histogramOptions = computed<ApexOptions>(() => ({
  chart: {
    type: 'bar',
    width: '100%',
    height: plotHeight.value,
    toolbar: { show: false },
    zoom: { enabled: false },
    sparkline: { enabled: true },
    fontFamily: 'Roboto, sans-serif',
    background: 'transparent',
    parentHeightOffset: 0,
    animations: {
      enabled: true,
      easing: 'easeinout',
      speed: 500,
    },
  },
  colors: ['#ffffff'],
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: pointCount.value <= 12 ? '72%' : '88%',
      borderRadius: 3,
      borderRadiusApplication: 'end',
    },
  },
  fill: {
    type: 'gradient',
    gradient: {
      shade: 'dark',
      type: 'vertical',
      shadeIntensity: 0.2,
      gradientToColors: ['#ffffff'],
      opacityFrom: 0.48,
      opacityTo: 0,
      stops: [0, 100],
    },
  },
  stroke: {
    show: false,
  },
  dataLabels: { enabled: false },
  grid: {
    show: false,
    padding: {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
    },
  },
  xaxis: {
    categories: shortAxisValues.value,
    tickAmount: pointCount.value,
    axisBorder: { show: false },
    axisTicks: { show: false },
    labels: { show: false },
    crosshairs: { show: false },
    tooltip: { enabled: false },
  },
  yaxis: {
    show: false,
    min: 0,
    max: histogramYAxisMax.value,
    forceNiceScale: false,
  },
  markers: {
    size: 0,
    hover: { size: 0 },
  },
  tooltip: {
    theme: 'dark',
    x: {
      formatter: (_value, opts) =>
        histogramLabels.value[opts?.dataPointIndex ?? -1]?.value ?? '',
    },
    y: {
      formatter: (value: number) => formatAxisValue(value),
    },
  },
  legend: { show: false },
}));
</script>

<style scoped lang="scss">
$y-scale-gap: 8px;

.abyss-histogram {
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  min-width: 0;
  width: 100%;
  padding: var(--abyss-histogram-inset);
  border-radius: 8px;
  background-color: rgba(white, 0.02);
  box-shadow: inset 0 0 0 1px rgba(white, 0.06);
  overflow: hidden;

  &__layout {
    display: grid;
    flex: 1 1 auto;
    grid-template-columns: auto minmax(0, 1fr);
    grid-template-rows: minmax(0, 1fr) var(--abyss-histogram-axis-label-height);
    column-gap: $y-scale-gap;
    width: 100%;
    min-width: 0;
    min-height: 0;
  }

  &__y-scale {
    display: flex;
    grid-row: 1;
    grid-column: 1;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-end;
    box-sizing: border-box;
  }

  &__y-scale-label {
    width: 100%;
    color: rgba(white, 0.5);
    font-size: 12px;
    font-weight: 500;
    line-height: 1;
    text-align: right;
    font-variant-numeric: tabular-nums;
  }

  &__plot {
    display: flex;
    grid-row: 1;
    grid-column: 2;
    flex-direction: column;
    width: 100%;
    min-width: 0;
    overflow: hidden;
  }

  &__canvas {
    display: block;
    flex: 1 1 auto;
    width: 100%;
    min-height: 0 !important;
    line-height: 0;

    :deep(.apexcharts-canvas) {
      margin: 0 auto;
    }

    :deep(svg) {
      display: block;
    }
  }

  &__axis {
    position: relative;
    grid-row: 2;
    grid-column: 2;
    box-sizing: border-box;
    width: 100%;
    min-width: 0;
    flex-shrink: 0;
    height: var(--abyss-histogram-axis-label-height);
    min-height: var(--abyss-histogram-axis-label-height);
    overflow: hidden;
  }

  &__axis-label {
    position: absolute;
    bottom: -2px;
    color: rgba(white, 0.55);
    font-size: 12px;
    line-height: var(--abyss-histogram-axis-label-height);
    text-align: center;
    white-space: nowrap;
  }
}
</style>
