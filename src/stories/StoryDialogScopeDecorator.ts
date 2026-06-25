import { nextTick, onMounted, onUnmounted, ref } from 'vue';
import type { Decorator } from '@storybook/vue3';
import AbyssBackground from '@/components/ui/AbyssBackground/AbyssBackground.vue';

const DIALOG_PORTAL_SELECTOR = '[id^="q-portal--dialog--"]';

/** Quasar blokuje scroll body przez q-body--prevent-scroll — w Docs to blokuje całą stronę. */
function releaseStorybookBodyScrollLock(): void {
  document.body.classList.remove('q-body--prevent-scroll');
  document.body.classList.remove('q-body--force-scrollbar-x');
  document.body.classList.remove('q-body--force-scrollbar-y');
  document.body.style.top = '';
  document.body.style.left = '';
  document.body.style.width = '';
  (document as Document & { qScrollPrevented?: boolean }).qScrollPrevented = false;
}

function reparentDialogPortal(scope: HTMLElement): void {
  if (scope.querySelector(DIALOG_PORTAL_SELECTOR)) {
    return;
  }

  const portal = document.body.querySelector(DIALOG_PORTAL_SELECTOR);
  if (portal?.parentElement === document.body) {
    scope.appendChild(portal);
  }
}

/**
 * Wariant `withAbyssBackground` dla stories z `AbyssDialog`.
 * Tło i overlay pozostają w dekoratorze, a teleportowany q-dialog
 * jest reparentowany do tego samego kontenera i ma rozmiar panelu dialogu.
 */
export const withAbyssBackgroundDialogScope: Decorator = () => ({
  components: { AbyssBackground },
  setup() {
    const scopeRef = ref<HTMLElement | null>(null);
    let timeoutId = 0;

    onMounted(async () => {
      await nextTick();
      releaseStorybookBodyScrollLock();

      const scope = scopeRef.value;
      if (!scope) {
        return;
      }

      reparentDialogPortal(scope);
      requestAnimationFrame(() => reparentDialogPortal(scope));
      timeoutId = window.setTimeout(() => reparentDialogPortal(scope), 50);
    });

    onUnmounted(() => {
      window.clearTimeout(timeoutId);
      releaseStorybookBodyScrollLock();
    });

    return { scopeRef };
  },
  template: `
    <div ref="scopeRef" class="abyss-bg-decorator abyss-bg-decorator--dialog-scope">
      <AbyssBackground class="abyss-bg-decorator__background" />
      <div class="abyss-bg-decorator__overlay"></div>
      <div class="abyss-bg-decorator__content">
        <story />
      </div>
    </div>
  `,
});
