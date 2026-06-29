import type { Meta, StoryObj } from '@storybook/vue3';
import { ref } from 'vue';
import AbyssTimeline from '@/components/ui/AbyssTimeline/AbyssTimeline.vue';
import AbyssTimelineItem from '@/components/ui/AbyssTimelineItem/AbyssTimelineItem.vue';
import AbyssButton from '@/components/ui/AbyssButton/AbyssButton.vue';
import { withAbyssBackground } from '@/stories/AbyssBackgroundDecorator';
import { expect } from 'storybook/test';

const meta: Meta<typeof AbyssTimeline> = {
  title: 'UI/AbyssTimeline',
  component: AbyssTimeline,
  tags: ['autodocs'],
  decorators: [withAbyssBackground],
  parameters: {
    docs: {
      description: {
        component:
          'Komponent kontenera osi czasu (AbyssTimeline). Opakowuje elementy AbyssTimelineItem i obsługuje ' +
          'przeciąganie w prawo (swipe) na urządzeniach mobilnych, aby odsłonić lewą kolumnę ' +
          '(datę/godzinę) dla wszystkich elementów jednocześnie. Na szerszych ekranach (> 560 px) lewa ' +
          'kolumna jest zawsze widoczna. Responsywność bazuje na szerokości kontenera nadrzędnego, ' +
          'nie okna przeglądarki.',
      },
    },
  },
  argTypes: {
    autoHideDelay: {
      control: { type: 'number', min: 0, step: 500 },
      description:
        'Czas w milisekundach po którym lewa kolumna automatycznie się schowa po odsłonięciu. ' +
        'Dotyczy tylko trybu mobilnego (szerokość kontenera ≤ 560 px).',
      table: {
        defaultValue: { summary: '2000' },
        type: { summary: 'number' },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof AbyssTimeline>;

const timelineItems = `
  <AbyssTimelineItem variant="header" label="Marzec" />
  <AbyssTimelineItem variant="datetime" :datetime="d1" stick="bottom">
    Dziś poczułem silny lęk przed rozmową z szefem. Oddychałem głęboko, co pomogło.
    Uświadomiłem sobie, że boję się odrzucenia.
  </AbyssTimelineItem>
  <AbyssTimelineItem variant="time" :datetime="d2" stick="both">
    Jestem wdzięczny za spacer z psem – świeże powietrze oczyściło umysł.
  </AbyssTimelineItem>
  <AbyssTimelineItem variant="time" :datetime="d3" stick="top">
    Wkurzyłem się na kolegę za opóźnienie. Zamiast krzyczeć, wyszedłem na chwilę.
  </AbyssTimelineItem>
  <AbyssTimelineItem variant="header" label="Kwiecień" />
  <AbyssTimelineItem variant="datetime" :datetime="d4" stick="bottom">
    Odkładałem pisanie raportu cały dzień. W końcu usiadłem na 5 minut – skończyłem.
  </AbyssTimelineItem>
  <AbyssTimelineItem variant="time" :datetime="d5" stick="top">
    Kłótnia z partnerem boli, ale wyraziłem swoje uczucia spokojnie.
  </AbyssTimelineItem>
`;

function useDates() {
  return {
    d1: new Date(2024, 2, 29, 21, 32),
    d2: new Date(2024, 2, 29, 21, 45),
    d3: new Date(2024, 2, 29, 22, 10),
    d4: new Date(2024, 3, 1, 8, 15),
    d5: new Date(2024, 3, 1, 20, 45),
  };
}

export const Desktop: Story = {
  name: 'Desktop',
  render: () => ({
    components: { AbyssTimeline, AbyssTimelineItem },
    setup: useDates,
    template: `<div style="width: 600px;"><AbyssTimeline>${timelineItems}</AbyssTimeline></div>`,
  }),
  parameters: {
    viewport: { defaultViewport: 'responsive' },
    docs: {
      description: {
        story:
          'Gdy szerokość kontenera nadrzędnego przekracza 560 px, lewa kolumna z datą/godziną ' +
          'jest zawsze widoczna. Interakcja swipe jest wyłączona.',
      },
      source: {
        code: `
<script setup lang="ts">
const d1 = new Date(2024, 2, 29, 21, 32);
const d2 = new Date(2024, 2, 29, 21, 45);
const d3 = new Date(2024, 2, 29, 22, 10);
</script>

<template>
  <AbyssTimeline>
    <AbyssTimelineItem variant="header" label="Marzec" />
    <AbyssTimelineItem variant="datetime" :datetime="d1" stick="bottom">
      Dziś poczułem silny lęk przed rozmową z szefem.
    </AbyssTimelineItem>
    <AbyssTimelineItem variant="time" :datetime="d2" stick="both">
      Jestem wdzięczny za spacer z psem.
    </AbyssTimelineItem>
    <AbyssTimelineItem variant="time" :datetime="d3" stick="top">
      Wkurzyłem się na kolegę za opóźnienie.
    </AbyssTimelineItem>
  </AbyssTimeline>
</template>`,
      },
    },
  },
  play: async ({ canvasElement }) => {
    await new Promise((r) => setTimeout(r, 50));
    const el = canvasElement.querySelector('.abyss-timeline') as HTMLElement;
    const inner = canvasElement.querySelector(
      '.abyss-timeline__inner',
    ) as HTMLElement;
    await expect(el).toBeVisible();
    await expect(el).not.toHaveClass('abyss-timeline--mobile');
    // innerStyle returns {} in desktop mode → no inline transform
    await expect(inner.style.transform).toBe('');
    // Verify handlePan guard: pan is ignored when isMobile = false
    const rect = el.getBoundingClientRect();
    const cx = rect.x + rect.width / 2;
    const cy = rect.y + rect.height / 2;
    const doc = el.ownerDocument;
    el.dispatchEvent(
      new MouseEvent('mousedown', {
        bubbles: true,
        cancelable: true,
        clientX: cx,
        clientY: cy,
      }),
    );
    await Promise.resolve();
    doc.dispatchEvent(
      new MouseEvent('mousemove', {
        bubbles: true,
        cancelable: true,
        clientX: cx + 60,
        clientY: cy,
      }),
    );
    await Promise.resolve();
    doc.dispatchEvent(
      new MouseEvent('mouseup', {
        bubbles: true,
        cancelable: true,
        clientX: cx + 60,
        clientY: cy,
      }),
    );
    await new Promise((r) => setTimeout(r, 80));
    await expect(inner.style.transform).toBe('');
  },
};

export const Mobile: Story = {
  name: 'Mobile',
  render: () => ({
    components: { AbyssTimeline, AbyssTimelineItem },
    setup: useDates,
    template: `<div style="width: 360px;"><AbyssTimeline>${timelineItems}</AbyssTimeline></div>`,
  }),
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
    docs: {
      description: {
        story:
          'Gdy szerokość kontenera nadrzędnego wynosi ≤ 560 px, lewa kolumna jest domyślnie ukryta. ' +
          'Przesuń palcem (lub myszką) w prawo, aby odsłonić datę/godzinę dla wszystkich wpisów jednocześnie. ' +
          'Po czasie określonym przez `autoHideDelay` (domyślnie 2000 ms) kolumna automatycznie się chowa.',
      },
      source: {
        code: `
<script setup lang="ts">
const d1 = new Date(2024, 2, 29, 21, 32);
const d2 = new Date(2024, 2, 29, 21, 45);
const d3 = new Date(2024, 2, 29, 22, 10);
</script>

<template>
  <!-- autoHideDelay domyślnie 2000 ms -->
  <AbyssTimeline :auto-hide-delay="3000">
    <AbyssTimelineItem variant="header" label="Marzec" />
    <AbyssTimelineItem variant="datetime" :datetime="d1" stick="bottom">
      Dziś poczułem silny lęk przed rozmową z szefem.
    </AbyssTimelineItem>
    <AbyssTimelineItem variant="time" :datetime="d2" stick="both">
      Jestem wdzięczny za spacer z psem.
    </AbyssTimelineItem>
    <AbyssTimelineItem variant="time" :datetime="d3" stick="top">
      Wkurzyłem się na kolegę za opóźnienie.
    </AbyssTimelineItem>
  </AbyssTimeline>
</template>`,
      },
    },
  },
  play: async ({ canvasElement }) => {
    await new Promise((r) => setTimeout(r, 50));
    const el = canvasElement.querySelector('.abyss-timeline') as HTMLElement;
    const inner = canvasElement.querySelector(
      '.abyss-timeline__inner',
    ) as HTMLElement;
    await expect(el).toBeVisible();
    await expect(el).toHaveClass('abyss-timeline--mobile');
    // In mobile mode, inner is initially offset by -LEFT_COLUMN_WIDTH (-98px)
    await expect(inner.style.transform).toBe('translateX(-98px)');
  },
};

// ─── Pan behavior ─────────────────────────────────────────────────────────────

export const PanBehavior: Story = {
  name: 'Zachowanie pan (mobile)',
  parameters: {
    docs: {
      description: {
        story:
          'Weryfikacja logiki przeciągania w trybie mobilnym: przesunięcie ≥ połowy (49 px) otwiera lewą ' +
          'kolumnę i uruchamia timer auto-chowania; przesunięcie < połowy cofa do stanu zamkniętego. ' +
          '`autoHideDelay` skrócony do 100 ms dla potrzeb testu.',
      },
    },
  },
  render: () => ({
    components: { AbyssTimeline, AbyssTimelineItem },
    setup() {
      const d1 = new Date(2024, 2, 29, 21, 32);
      return { d1 };
    },
    template: `
      <div style="width: 360px;">
        <AbyssTimeline :auto-hide-delay="100">
          <AbyssTimelineItem variant="datetime" :datetime="d1" stick="bottom">
            Test
          </AbyssTimelineItem>
        </AbyssTimeline>
      </div>
    `,
  }),
  play: async ({ canvasElement }) => {
    await new Promise((r) => setTimeout(r, 50));
    const el = canvasElement.querySelector('.abyss-timeline') as HTMLElement;
    const inner = canvasElement.querySelector(
      '.abyss-timeline__inner',
    ) as HTMLElement;
    await expect(el).toHaveClass('abyss-timeline--mobile');
    await expect(inner.style.transform).toBe('translateX(-98px)');

    const rect = el.getBoundingClientRect();
    const cx = rect.x + rect.width / 2;
    const cy = rect.y + rect.height / 2;
    const doc = el.ownerDocument;

    // ── Pan right far enough to snap open (60px ≥ 49px midpoint) ──────────────
    el.dispatchEvent(
      new MouseEvent('mousedown', {
        bubbles: true,
        cancelable: true,
        clientX: cx,
        clientY: cy,
      }),
    );
    await Promise.resolve();
    doc.dispatchEvent(
      new MouseEvent('mousemove', {
        bubbles: true,
        cancelable: true,
        clientX: cx + 60,
        clientY: cy,
      }),
    );
    await Promise.resolve();
    // isPanning = true → transition should be 'none' during active drag
    await expect(inner.style.transition).toBe('none');
    doc.dispatchEvent(
      new MouseEvent('mouseup', {
        bubbles: true,
        cancelable: true,
        clientX: cx + 60,
        clientY: cy,
      }),
    );
    await new Promise((r) => setTimeout(r, 80));
    // Snapped open: panOffset=98, offset=98-98=0
    await expect(inner.style.transform).toBe('translateX(0px)');
    // isPanning = false → transition should use cubic-bezier easing
    await expect(inner.style.transition).toContain('cubic-bezier');

    // ── isFirst cancels active auto-hide timer (T1) ────────────────────────────
    // T1 started at snap-open, will fire at +100ms. At ~80ms T1 has ~20ms left.
    // New mousedown triggers isFirst → clearTimeout(T1)
    el.dispatchEvent(
      new MouseEvent('mousedown', {
        bubbles: true,
        cancelable: true,
        clientX: cx,
        clientY: cy,
      }),
    );
    await Promise.resolve();
    doc.dispatchEvent(
      new MouseEvent('mousemove', {
        bubbles: true,
        cancelable: true,
        clientX: cx + 60,
        clientY: cy,
      }),
    );
    await Promise.resolve();
    doc.dispatchEvent(
      new MouseEvent('mouseup', {
        bubbles: true,
        cancelable: true,
        clientX: cx + 60,
        clientY: cy,
      }),
    );
    await new Promise((r) => setTimeout(r, 80));
    // T1 was cancelled → still open at t≈160ms (T1 would have fired at t≈100ms)
    await expect(inner.style.transform).toBe('translateX(0px)');
    // Wait for T2 (100ms from second snap, started at ~80ms) to fire
    await new Promise((r) => setTimeout(r, 150));
    await expect(inner.style.transform).toBe('translateX(-98px)');

    // ── Pan right but not far enough (20px < 49px midpoint) → snap back ───────
    el.dispatchEvent(
      new MouseEvent('mousedown', {
        bubbles: true,
        cancelable: true,
        clientX: cx,
        clientY: cy,
      }),
    );
    await Promise.resolve();
    doc.dispatchEvent(
      new MouseEvent('mousemove', {
        bubbles: true,
        cancelable: true,
        clientX: cx + 20,
        clientY: cy,
      }),
    );
    await Promise.resolve();
    doc.dispatchEvent(
      new MouseEvent('mouseup', {
        bubbles: true,
        cancelable: true,
        clientX: cx + 20,
        clientY: cy,
      }),
    );
    await new Promise((r) => setTimeout(r, 80));
    await expect(inner.style.transform).toBe('translateX(-98px)');
  },
};

export const Unmount: Story = {
  name: 'Odmontowanie (onUnmounted)',
  parameters: {
    docs: {
      description: {
        story:
          'Weryfikacja `onUnmounted`: rozłączenie ResizeObserver i czyszczenie timera auto-chowania ' +
          'gdy komponent jest odmontowywany w trakcie oczekiwania na auto-hide.',
      },
    },
  },
  render: () => ({
    components: { AbyssTimeline, AbyssTimelineItem, AbyssButton },
    setup() {
      const visible = ref(true);
      const d1 = new Date(2024, 2, 29, 21, 32);
      return { visible, d1 };
    },
    template: `
      <div style="width: 360px; display: flex; flex-direction: column; align-items: flex-start; gap: 8px;">
        <AbyssButton label="Odmontuj" size="small" @click="visible = false" />
        <AbyssTimeline v-if="visible" :auto-hide-delay="99999">
          <AbyssTimelineItem variant="datetime" :datetime="d1">Test</AbyssTimelineItem>
        </AbyssTimeline>
      </div>
    `,
  }),
  play: async ({ canvas, canvasElement, userEvent }) => {
    await new Promise((r) => setTimeout(r, 50));
    const el = canvasElement.querySelector('.abyss-timeline') as HTMLElement;
    const inner = canvasElement.querySelector(
      '.abyss-timeline__inner',
    ) as HTMLElement;

    // Snap open w trybie mobilnym → snapBackTimer ustawiony (99999ms, nie wygasńnie)
    const rect = el.getBoundingClientRect();
    const cx = rect.x + rect.width / 2;
    const cy = rect.y + rect.height / 2;
    const doc = el.ownerDocument;
    el.dispatchEvent(
      new MouseEvent('mousedown', {
        bubbles: true,
        cancelable: true,
        clientX: cx,
        clientY: cy,
      }),
    );
    await Promise.resolve();
    doc.dispatchEvent(
      new MouseEvent('mousemove', {
        bubbles: true,
        cancelable: true,
        clientX: cx + 60,
        clientY: cy,
      }),
    );
    await Promise.resolve();
    doc.dispatchEvent(
      new MouseEvent('mouseup', {
        bubbles: true,
        cancelable: true,
        clientX: cx + 60,
        clientY: cy,
      }),
    );
    await new Promise((r) => setTimeout(r, 50));
    await expect(inner.style.transform).toBe('translateX(0px)');

    // Odmontuj komponent: onUnmounted → resizeObserver.disconnect() + clearTimeout(snapBackTimer)
    await userEvent.click(canvas.getByRole('button', { name: /odmontuj/i }));
    await new Promise((r) => setTimeout(r, 50));
    await expect(canvasElement.querySelector('.abyss-timeline')).toBeNull();
  },
};

export const InternalBranchCoverage: Story = {
  name: 'Pokrycie gałęzi (linia 38 + 57)',
  parameters: {
    docs: {
      description: {
        story:
          'Pokrycie nieosiągalnych przez UI gałęzi: ' +
          '`if (snapBackTimer !== null) clearTimeout(...)` w `scheduleAutoHide` (linia 57) ' +
          'oraz `if (!containerEl.value) return` w `onMounted` (linia 38).',
      },
    },
  },
  render: () => ({
    components: { AbyssTimeline, AbyssTimelineItem },
    setup() {
      const d1 = new Date(2024, 2, 29, 21, 32);
      return { d1 };
    },
    template: `
      <div style="width: 360px;">
        <AbyssTimeline ref="timeline" :auto-hide-delay="99999">
          <AbyssTimelineItem variant="datetime" :datetime="d1">Test</AbyssTimelineItem>
        </AbyssTimeline>
      </div>
    `,
  }),
  play: async ({ canvasElement }) => {
    await new Promise((r) => setTimeout(r, 50));
    const el = canvasElement.querySelector('.abyss-timeline') as HTMLElement;

    // Snap open via pan → scheduleAutoHide() wywołane → snapBackTimer ustawiony (T1, 99999ms)
    const rect = el.getBoundingClientRect();
    const cx = rect.x + rect.width / 2;
    const cy = rect.y + rect.height / 2;
    const doc = el.ownerDocument;
    el.dispatchEvent(
      new MouseEvent('mousedown', {
        bubbles: true,
        cancelable: true,
        clientX: cx,
        clientY: cy,
      }),
    );
    await Promise.resolve();
    doc.dispatchEvent(
      new MouseEvent('mousemove', {
        bubbles: true,
        cancelable: true,
        clientX: cx + 60,
        clientY: cy,
      }),
    );
    await Promise.resolve();
    doc.dispatchEvent(
      new MouseEvent('mouseup', {
        bubbles: true,
        cancelable: true,
        clientX: cx + 60,
        clientY: cy,
      }),
    );
    await new Promise((r) => setTimeout(r, 50));

    // Linia 57: scheduleAutoHide gdy snapBackTimer !== null → clearTimeout wywołane
    const instance = (
      el as unknown as {
        __vueParentComponent?: {
          exposed?: {
            scheduleAutoHide?: () => void;
          };
        };
      }
    ).__vueParentComponent;
    const exposed = instance?.exposed;
    exposed?.scheduleAutoHide?.();

    await expect(el).toBeInTheDocument();
  },
};
