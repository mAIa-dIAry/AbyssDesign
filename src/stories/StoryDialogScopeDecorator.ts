import { nextTick, onMounted, onUnmounted, ref } from 'vue';
import type { Decorator } from '@storybook/vue3';
import AbyssBackground from '@/components/ui/AbyssBackground/AbyssBackground.vue';

const DIALOG_PORTAL_SELECTOR = '[id^="q-portal--dialog--"]';
const DIALOG_SCOPE_SELECTOR = '.abyss-bg-decorator--dialog-scope';

let bodyObserver: MutationObserver | null = null;
let observerRefCount = 0;

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

function getPortalHost(scope: HTMLElement): HTMLElement {
  const existingHost = scope.querySelector<HTMLElement>(
    '.abyss-bg-decorator__portal-host',
  );
  if (existingHost) {
    return existingHost;
  }

  const host = document.createElement('div');
  host.className = 'abyss-bg-decorator__portal-host';
  scope.appendChild(host);
  return host;
}

/**
 * Przypisuje osierocone portale q-dialog z body do brakujących scope'ów
 * w kolejności DOM — w Docs autodocs renderuje wiele story naraz.
 */
function syncDialogPortals(): void {
  releaseStorybookBodyScrollLock();

  const scopes = Array.from(
    document.querySelectorAll<HTMLElement>(DIALOG_SCOPE_SELECTOR),
  );
  const orphanPortals = Array.from(
    document.body.querySelectorAll<HTMLElement>(DIALOG_PORTAL_SELECTOR),
  ).filter((portal) => portal.parentElement === document.body);
  const scopesWithoutPortal = scopes.filter(
    (scope) => !scope.querySelector(DIALOG_PORTAL_SELECTOR),
  );

  orphanPortals.forEach((portal, index) => {
    const scope = scopesWithoutPortal[index];
    if (!scope) {
      return;
    }

    getPortalHost(scope).appendChild(portal);
  });
}

function ensureBodyObserver(): void {
  if (bodyObserver) {
    return;
  }

  bodyObserver = new MutationObserver(() => {
    syncDialogPortals();
  });
  bodyObserver.observe(document.body, { childList: true });
}

function releaseBodyObserver(): void {
  observerRefCount = Math.max(0, observerRefCount - 1);

  if (observerRefCount === 0 && bodyObserver) {
    bodyObserver.disconnect();
    bodyObserver = null;
  }
}

function schedulePortalSync(): void {
  syncDialogPortals();
  requestAnimationFrame(() => syncDialogPortals());
  window.setTimeout(() => syncDialogPortals(), 50);
  window.setTimeout(() => syncDialogPortals(), 250);
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
    const timeoutIds: number[] = [];

    onMounted(async () => {
      observerRefCount += 1;
      ensureBodyObserver();

      await nextTick();
      schedulePortalSync();

      timeoutIds.push(window.setTimeout(() => syncDialogPortals(), 500));
    });

    onUnmounted(() => {
      timeoutIds.forEach((timeoutId) => window.clearTimeout(timeoutId));
      releaseBodyObserver();
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
