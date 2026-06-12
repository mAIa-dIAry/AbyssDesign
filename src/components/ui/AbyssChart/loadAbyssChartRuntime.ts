import type { Component } from 'vue';

let apexChartsComponentPromise: Promise<Component> | null = null;

/**
 * Loads vue3-apexcharts on demand and caches the resolved component.
 */
export function loadAbyssChartRuntime(): Promise<Component> {
  apexChartsComponentPromise ??= import('vue3-apexcharts').then(
    (module) => module.default,
  );

  return apexChartsComponentPromise;
}
