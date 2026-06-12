<template>
  <div
    ref="panelRef"
    class="abyss-chart"
    :class="$props.class"
    :style="[
      chartLayoutStyle,
      { height: `${height}px`, minHeight: `${height}px` },
      style,
    ]"
    v-bind="$attrs"
  >
    <template v-if="hasData">
      <div class="abyss-chart__layout">
        <div class="abyss-chart__y-scale" aria-hidden="true">
          <span class="abyss-chart__y-scale-label">
            {{ chartYAxisMax }}
          </span>
          <span class="abyss-chart__y-scale-label">0</span>
        </div>

        <div ref="plotRef" class="abyss-chart__plot">
          <component
            :is="VueApexCharts"
            v-if="isChartRuntimeReady && chartWidth > 0"
            class="abyss-chart__canvas"
            type="area"
            :height="plotHeight"
            :options="chartOptions"
            :series="chartSeries"
          />
        </div>

        <div class="abyss-chart__axis" aria-hidden="true">
          <span
            v-for="index in visibleTickIndexList"
            :key="index"
            class="abyss-chart__axis-label"
            :style="axisLabelStyle(index)"
            :title="chartLabels[index]?.value"
          >
            {{ chartLabels[index]?.shortValue }}
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
  ABYSS_CHART_AXIS_LABEL_HEIGHT_PX,
  ABYSS_CHART_INSET_PX,
} from '@/components/ui/AbyssChart/AbyssChart.constants';
import { loadAbyssChartRuntime } from '@/components/ui/AbyssChart/loadAbyssChartRuntime';
import type { AbyssChartLabel } from '@/types/abyss-chart';

export interface AbyssChartProps {
  data: number[];
  labels: AbyssChartLabel[];
  attributeName: string;
  height?: number;
  style?: string | Record<string, string>;
  class?:
    | string
    | Record<string, boolean>
    | Array<string | Record<string, boolean>>;
}

const props = withDefaults(defineProps<AbyssChartProps>(), {
  height: 150,
  style: '',
  class: '',
});

const LABEL_MIN_WIDTH_PX = 28;
const MIN_VISIBLE_TICKS = 3;
const MAX_VISIBLE_TICKS = 100;

const chartLayoutStyle = {
  '--abyss-chart-inset': `${ABYSS_CHART_INSET_PX}px`,
  '--abyss-chart-axis-label-height': `${ABYSS_CHART_AXIS_LABEL_HEIGHT_PX}px`,
} as const;

const plotHeight = computed(
  () =>
    props.height - ABYSS_CHART_INSET_PX * 2 - ABYSS_CHART_AXIS_LABEL_HEIGHT_PX,
);

const pointCount = computed(() =>
  Math.min(props.data.length, props.labels.length),
);

const hasData = computed(() => pointCount.value > 0);

const chartLabels = computed(() => props.labels.slice(0, pointCount.value));

const chartValues = computed(() => props.data.slice(0, pointCount.value));

const shortAxisValues = computed(() =>
  chartLabels.value.map((label) => label.shortValue),
);

const chartYAxisMax = computed(() => {
  const peakValue = chartValues.value.reduce(
    (peak, value) => Math.max(peak, value),
    0,
  );

  return Math.max(peakValue, 1);
});

const chartSeries = computed(() => [
  {
    name: props.attributeName,
    data: chartValues.value,
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
 * Smallest regular index step that still fits within the available label budget.
 * Labels are counted from the last point backwards: floor(lastIndex / step) + 1.
 */
function resolveRegularLabelStep(length: number, maxLabels: number): number {
  const lastIndex = length - 1;

  if (lastIndex <= 0 || maxLabels <= 1) {
    return 1;
  }

  let step = 1;

  while (Math.floor(lastIndex / step) + 1 > maxLabels) {
    step += 1;
  }

  return step;
}

function buildVisibleTickIndices(
  length: number,
  maxLabels: number,
): Set<number> {
  const lastIndex = length - 1;

  if (lastIndex < 0) {
    return new Set<number>();
  }

  const clampedMaxLabels = Math.max(1, Math.min(maxLabels, length));
  const indices = new Set<number>([lastIndex]);

  if (clampedMaxLabels === 1 || length === 1) {
    return indices;
  }

  if (length <= clampedMaxLabels) {
    return new Set(
      Array.from({ length }, (_, index) => index).filter(
        (index) => index > 0 || length <= 2,
      ),
    );
  }

  const step = resolveRegularLabelStep(length, clampedMaxLabels);

  for (let index = lastIndex - step; index > 0; index -= step) {
    indices.add(index);
  }

  return indices;
}

const maxLabelCount = computed(() =>
  resolveMaxLabelCount(chartWidth.value, pointCount.value),
);

const visibleTickIndices = computed(() =>
  buildVisibleTickIndices(pointCount.value, maxLabelCount.value),
);

const visibleTickIndexList = computed(() =>
  [...visibleTickIndices.value].sort((left, right) => left - right),
);

function axisLabelStyle(index: number): Record<string, string> {
  const lastIndex = pointCount.value - 1;

  if (lastIndex <= 0) {
    return { left: '0%' };
  }

  const positionPercent = (index / lastIndex) * 100;

  if (index === 0) {
    return { left: '0%' };
  }

  if (index === lastIndex) {
    return { left: '100%', transform: 'translateX(-100%)' };
  }

  return {
    left: `${positionPercent}%`,
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

const chartOptions = computed<ApexOptions>(() => ({
  chart: {
    type: 'area',
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
  stroke: {
    curve: 'smooth',
    width: 2,
  },
  fill: {
    type: 'gradient',
    gradient: {
      shade: 'dark',
      type: 'vertical',
      shadeIntensity: 0.2,
      gradientToColors: ['#ffffff'],
      opacityFrom: 0.38,
      opacityTo: 0,
      stops: [0, 100],
    },
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
    max: chartYAxisMax.value,
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
        chartLabels.value[opts?.dataPointIndex ?? -1]?.value ?? '',
    },
    y: {
      formatter: (value: number) => String(value),
    },
  },
  legend: { show: false },
}));
</script>

<style scoped lang="scss">
$y-scale-gap: 8px;
$y-scale-font-size: 12px;

.abyss-chart {
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  min-width: 0;
  width: 100%;
  padding: var(--abyss-chart-inset);
  border-radius: 8px;
  background-color: rgba(white, 0.02);
  box-shadow: inset 0 0 0 1px rgba(white, 0.06);
  overflow: hidden;

  &__layout {
    display: grid;
    flex: 1 1 auto;
    grid-template-columns: auto minmax(0, 1fr);
    grid-template-rows: minmax(0, 1fr) var(--abyss-chart-axis-label-height);
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
    height: var(--abyss-chart-axis-label-height);
    min-height: var(--abyss-chart-axis-label-height);
    overflow: hidden;
  }

  &__axis-label {
    position: absolute;
    bottom: -2px;
    color: rgba(white, 0.55);
    font-size: 12px;
    line-height: var(--abyss-chart-axis-label-height);
    white-space: nowrap;
  }
}
</style>
