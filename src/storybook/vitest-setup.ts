import { setProjectAnnotations } from '@storybook/vue3-vite';

type StorybookProjectAnnotations = Parameters<typeof setProjectAnnotations>[0];

export function setupStorybookVitest(projectAnnotations: StorybookProjectAnnotations): void {
  setProjectAnnotations(projectAnnotations);
}
