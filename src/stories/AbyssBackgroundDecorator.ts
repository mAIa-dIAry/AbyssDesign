import type { Decorator } from '@storybook/vue3';
import AbyssBackground from '@/components/ui/AbyssBackground/AbyssBackground.vue';

export const withAbyssBackground: Decorator = () => ({
  components: { AbyssBackground },
  template: `
    <div class="abyss-bg-decorator">
      <AbyssBackground class="abyss-bg-decorator__background" />
      <div class="abyss-bg-decorator__overlay"></div>
      <div class="abyss-bg-decorator__content">
        <story />
      </div>
    </div>
  `,
});
