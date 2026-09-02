const OVERFLOW_EPSILON_PX = 1;

/** Czas wejścia, zejścia i akordeonu — po ciszy tyle ms overflow zostaje przełączony. */
export const ABYSS_NOTIFY_MOTION_MS = 200;

type HostEntry = {
  count: number;
  mutationObserver: MutationObserver;
};

const hosts = new WeakMap<HTMLElement, HostEntry>();
const activeHosts = new Set<HTMLElement>();
const debounceTimers = new Map<HTMLElement, number>();

function onWindowResize(): void {
  for (const host of activeHosts) {
    scheduleNotifyQueueOverflow(host);
  }
}

function bindWindowResize(): void {
  if (activeHosts.size === 1) {
    window.addEventListener('resize', onWindowResize);
  }
}

function unbindWindowResize(): void {
  if (activeHosts.size === 0) {
    window.removeEventListener('resize', onWindowResize);
  }
}

export function isNotifyQueueHost(el: HTMLElement): boolean {
  return (
    el.classList.contains('abyss-notify-queue') ||
    el.classList.contains('abyss-template__overlay')
  );
}

export function findNotifyQueueHost(
  el: HTMLElement | null | undefined,
): HTMLElement | null {
  let current: HTMLElement | null | undefined = el;

  while (current) {
    if (isNotifyQueueHost(current)) {
      return current;
    }

    current = current.parentElement;
  }

  return null;
}

function layoutHeight(host: HTMLElement): number {
  let height = 0;

  for (const child of host.children) {
    if (!(child instanceof HTMLElement)) {
      continue;
    }

    if (getComputedStyle(child).display === 'contents') {
      height += layoutHeight(child);
      continue;
    }

    height += child.offsetHeight;
  }

  return height;
}

function resolveMaxHeightPx(
  maxHeight: string,
  parentHeight: number,
): number | null {
  const raw = maxHeight.trim();

  if (raw === 'none' || raw === '') {
    return parentHeight > 0 ? parentHeight : null;
  }

  if (raw.endsWith('%')) {
    const percent = parseFloat(raw);

    if (!Number.isFinite(percent) || parentHeight <= 0) {
      return null;
    }

    return (parentHeight * percent) / 100;
  }

  if (!raw.endsWith('px')) {
    return parentHeight > 0 ? parentHeight : null;
  }

  const pixels = parseFloat(raw);

  if (!Number.isFinite(pixels)) {
    return parentHeight > 0 ? parentHeight : null;
  }

  return parentHeight > 0 ? Math.min(pixels, parentHeight) : pixels;
}

function availableHeight(host: HTMLElement): number | null {
  const parent = host.parentElement;

  if (!parent) {
    return null;
  }

  const style = getComputedStyle(host);
  const parentHeight = parent.clientHeight;
  const cap = resolveMaxHeightPx(style.maxHeight, parentHeight);

  if (cap === null || cap <= 0) {
    return null;
  }

  const padding =
    parseFloat(style.paddingTop) + parseFloat(style.paddingBottom);

  return cap - padding;
}

function setOverflowVisible(host: HTMLElement): void {
  host.style.overflow = 'visible';
  host.style.removeProperty('overflow-x');
  host.style.removeProperty('overflow-y');
}

function applyOverflow(host: HTMLElement): void {
  const available = availableHeight(host);
  const content = layoutHeight(host);
  const needsScroll =
    available !== null && content > available + OVERFLOW_EPSILON_PX;

  if (needsScroll) {
    host.style.overflowX = 'hidden';
    host.style.overflowY = 'auto';
    return;
  }

  setOverflowVisible(host);
}

export function scheduleNotifyQueueOverflow(host: HTMLElement): void {
  const previous = debounceTimers.get(host);

  if (previous !== undefined) {
    window.clearTimeout(previous);
  }

  const timeoutId = window.setTimeout(() => {
    debounceTimers.delete(host);
    applyOverflow(host);
  }, ABYSS_NOTIFY_MOTION_MS);

  debounceTimers.set(host, timeoutId);
}

function releaseNotifyQueueOverflow(host: HTMLElement): void {
  const entry = hosts.get(host);

  if (!entry) {
    return;
  }

  entry.count -= 1;

  if (entry.count > 0) {
    scheduleNotifyQueueOverflow(host);
    return;
  }

  const pending = debounceTimers.get(host);

  if (pending !== undefined) {
    window.clearTimeout(pending);
    debounceTimers.delete(host);
  }

  entry.mutationObserver.disconnect();
  setOverflowVisible(host);
  hosts.delete(host);
  activeHosts.delete(host);
  unbindWindowResize();
}

export function attachNotifyQueueOverflow(host: HTMLElement): () => void {
  const existing = hosts.get(host);

  if (existing) {
    existing.count += 1;
    scheduleNotifyQueueOverflow(host);
    return () => {
      releaseNotifyQueueOverflow(host);
    };
  }

  const mutationObserver = new MutationObserver(() => {
    scheduleNotifyQueueOverflow(host);
  });

  hosts.set(host, {
    count: 1,
    mutationObserver,
  });
  activeHosts.add(host);
  bindWindowResize();
  mutationObserver.observe(host, { childList: true, subtree: true });
  scheduleNotifyQueueOverflow(host);

  return () => {
    releaseNotifyQueueOverflow(host);
  };
}
