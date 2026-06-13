import { setProjectAnnotations } from '@storybook/vue3-vite';

export function setupStorybookVitest(projectAnnotations: unknown): void {
  setProjectAnnotations([projectAnnotations]);
}
