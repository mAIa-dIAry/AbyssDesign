import type { Meta, StoryObj } from '@storybook/vue3';
import { ref } from 'vue';
import { expect, fn } from 'storybook/test';
import { QIcon } from 'quasar';
import AbyssRange from '@/components/ui/AbyssRange/AbyssRange.vue';
import { withAbyssBackground } from '@/stories/AbyssBackgroundDecorator';

const meta: Meta<typeof AbyssRange> = {
  title: 'UI/AbyssRange',
  component: AbyssRange,
  decorators: [withAbyssBackground],
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Komponent zakresu (range) – wrapper na `QRange` z stylowaniem Abyss Design System. Pozwala użytkownikowi wybrać przedział wartości między minimum a maksimum. Model to obiekt `{ min, max }`. Obsługuje etykiety, znaczniki, ograniczenia wewnętrzne, przeciąganie zakresu i orientację pionową.',
      },
    },
  },
  argTypes: {
    modelValue: {
      control: { type: 'object' },
      description: 'Bieżąca wartość zakresu jako obiekt `{ min, max }`',
    },
    'onUpdate:modelValue': { action: 'update:modelValue' },
    onChange: { action: 'change' },
    onPan: { action: 'pan' },
    min: {
      control: { type: 'number' },
      description: 'Minimalna wartość zakresu',
      table: { defaultValue: { summary: '0' } },
    },
    max: {
      control: { type: 'number' },
      description: 'Maksymalna wartość zakresu',
      table: { defaultValue: { summary: '100' } },
    },
    step: {
      control: { type: 'number' },
      description: 'Krok suwaka',
      table: { defaultValue: { summary: '1' } },
    },
    snap: {
      control: 'boolean',
      description: 'Zatrzaskiwanie kciuków na pozycjach kroku',
      table: { defaultValue: { summary: 'false' } },
    },
    vertical: {
      control: 'boolean',
      description: 'Orientacja pionowa',
      table: { defaultValue: { summary: 'false' } },
    },
    label: {
      control: 'boolean',
      description: 'Wyświetlaj etykiety podczas przeciągania',
      table: { defaultValue: { summary: 'false' } },
    },
    labelAlways: {
      control: 'boolean',
      description: 'Zawsze wyświetlaj etykiety',
      table: { defaultValue: { summary: 'false' } },
    },
    leftLabelValue: {
      control: 'text',
      description: 'Własna treść etykiety lewego kciuka',
    },
    rightLabelValue: {
      control: 'text',
      description: 'Własna treść etykiety prawego kciuka',
    },
    switchLabelSide: {
      control: 'boolean',
      description: 'Przełącz stronę wyświetlania etykiet',
      table: { defaultValue: { summary: 'false' } },
    },
    markers: {
      control: 'boolean',
      description: 'Pokaż znaczniki na torze',
      table: { defaultValue: { summary: 'false' } },
    },
    markerLabels: {
      control: 'boolean',
      description:
        'Wyświetla etykiety pod znacznikami. Przyjmuje `true/false`, tablicę `{ value, label }`, obiekt `{ value: label }` lub funkcję `(value) => label`',
      table: { defaultValue: { summary: 'false' } },
    },
    switchMarkerLabelsSide: {
      control: 'boolean',
      description: 'Przełącz stronę wyświetlania etykiet znaczników',
      table: { defaultValue: { summary: 'false' } },
    },
    dragRange: {
      control: 'boolean',
      description: 'Pozwala przeciągać cały wybrany zakres jako całość',
      table: { defaultValue: { summary: 'false' } },
    },
    dragOnlyRange: {
      control: 'boolean',
      description:
        'Przeciąganie tylko całego zakresu – brak regulacji pojedynczych kciuków',
      table: { defaultValue: { summary: 'false' } },
    },
    disable: {
      control: 'boolean',
      description: 'Wyłącz komponent – brak interakcji',
      table: { defaultValue: { summary: 'false' } },
    },
    readonly: {
      control: 'boolean',
      description: 'Tryb tylko do odczytu – widoczny, ale nieedytowalny',
      table: { defaultValue: { summary: 'false' } },
    },
    innerMin: {
      control: { type: 'number' },
      description: 'Wewnętrzna wartość minimalna (musi być >= min)',
    },
    innerMax: {
      control: { type: 'number' },
      description: 'Wewnętrzna wartość maksymalna (musi być <= max)',
    },
    name: {
      control: 'text',
      description: 'Nazwa pola formularza (dla natywnego form submit)',
    },
    style: { control: 'object' },
    class: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof AbyssRange>;

export const Default: Story = {
  name: 'Domyślny',
  parameters: {
    docs: {
      description: {
        story: 'Podstawowy zakres z zakresem 0–100 i bieżącym przedziałem.',
      },
    },
  },
  args: {
    modelValue: { min: 20, max: 70 },
    min: 0,
    max: 100,
    step: 1,
    snap: false,
    vertical: false,
    label: false,
    labelAlways: false,
    disable: false,
    readonly: false,
    markers: false,
  },
  render: (args) => ({
    components: { AbyssRange },
    setup() {
      const value = ref(args.modelValue ?? { min: 20, max: 70 });
      return { args, value };
    },
    template: `
      <div style="width: 320px;">
        <AbyssRange v-bind="args" v-model="value" />
      </div>
    `,
  }),
  play: async ({ canvas }) => {
    const sliders = canvas.getAllByRole('slider');
    await expect(sliders).toHaveLength(1);
    for (const slider of sliders) {
      await expect(slider).toBeVisible();
      await expect(slider).not.toHaveAttribute('aria-disabled', 'true');
    }
    await expect(sliders[0]).toHaveAttribute('aria-valuemin', '0');
    await expect(sliders[0]).toHaveAttribute('aria-valuemax', '100');
  },
};

export const EmitBehavior: Story = {
  name: 'Zachowanie emitów',
  parameters: {
    docs: {
      description: {
        story:
          'Weryfikacja emitów komponentu: `update:modelValue` i `change` wyzwalane przez klawiaturę (ArrowRight na suwaku), `pan` wyzwalany przez zdarzenia wskaźnika (mousedown/mouseup).',
      },
    },
  },
  args: {
    modelValue: { min: 20, max: 70 },
    min: 0,
    max: 100,
    step: 10,
    snap: true,
  },
  render: (args) => ({
    components: { AbyssRange },
    setup() {
      const value = ref({
        ...(args.modelValue as { min: number; max: number }),
      });
      const onUpdateModelValue = fn();
      const onChange = fn();
      const onPan = fn();
      // Eksponuj spy-e przez args, żeby play() mógł je sprawdzić
      (args as Record<string, unknown>)['onUpdate:modelValue'] =
        onUpdateModelValue;
      (args as Record<string, unknown>).onChange = onChange;
      (args as Record<string, unknown>).onPan = onPan;
      return { args, value, onUpdateModelValue, onChange, onPan };
    },
    template: `
      <div style="width: 320px;">
        <AbyssRange
          v-model="value"
          :min="args.min"
          :max="args.max"
          :step="args.step"
          :snap="args.snap"
          @update:modelValue="onUpdateModelValue"
          @change="onChange"
          @pan="onPan"
        />
      </div>
    `,
  }),
  play: async ({ args, canvas, userEvent }) => {
    // role="slider" jest na korzeniu q-range, klawiatura obsługiwana jest przez
    // wewnętrzne .q-slider__thumb[tabindex="0"] — trzeba tam wysłać focus
    const sliderRoot = canvas.getByRole('slider');
    const thumbs = Array.from(
      sliderRoot.querySelectorAll<HTMLElement>('.q-slider__thumb'),
    );
    await expect(thumbs.length).toBeGreaterThan(0);
    const firstThumb = thumbs[0] as HTMLElement;

    // Klik przez userEvent żeby Playwright śledził fokus, potem ArrowRight
    await userEvent.click(firstThumb);
    await userEvent.keyboard('{ArrowRight}');
    await expect(args['onUpdate:modelValue']).toHaveBeenCalled();
    await expect(args.onChange).toHaveBeenCalled();

    // pan przez pointer — Quasar v-touch-pan słucha mousemove/mouseup na document.
    // UWAGA: onPan({isFinal}) jest wywoływany przez setTimeout(50ms) w Quasarze
    // (patrz TouchPan.js - styleCleanup wraps final handler in 50ms timeout),
    // więc musimy poczekać po mouseup zanim sprawdzimy asercję.
    const rect = firstThumb.getBoundingClientRect();
    const cx = rect.x + rect.width / 2;
    const cy = rect.y + rect.height / 2;
    const storyDoc = firstThumb.ownerDocument;
    firstThumb.dispatchEvent(
      new MouseEvent('mousedown', {
        bubbles: true,
        cancelable: true,
        clientX: cx,
        clientY: cy,
      }),
    );
    await Promise.resolve();
    storyDoc.dispatchEvent(
      new MouseEvent('mousemove', {
        bubbles: true,
        clientX: cx + 15,
        clientY: cy,
      }),
    );
    await Promise.resolve();
    storyDoc.dispatchEvent(
      new MouseEvent('mouseup', {
        bubbles: true,
        clientX: cx + 15,
        clientY: cy,
      }),
    );
    await new Promise((r) => setTimeout(r, 80)); // poczekaj na setTimeout(50ms) w Quasarze
    await expect(args.onPan).toHaveBeenCalledWith('start');
    await expect(args.onPan).toHaveBeenCalledWith('end');
  },
};

export const LabelVariants: Story = {
  name: 'Warianty etykiety',
  parameters: {
    docs: {
      description: {
        story:
          'Porównanie trzech wariantów widoczności etykiet: **bez etykiet** (domyślnie), **etykiety podczas przeciągania** (`label: true`) oraz **etykiety zawsze widoczne** (`labelAlways: true`).',
      },
      source: {
        language: 'html',
        code: `
<script setup>
const v1 = ref({ min: 20, max: 70 });
const v2 = ref({ min: 20, max: 70 });
const v3 = ref({ min: 20, max: 70 });
</script>

<template>
  <!-- Bez etykiet -->
  <AbyssRange v-model="v1" :min="0" :max="100" :label="false" :label-always="false" />

  <!-- Etykiety podczas przeciągania -->
  <AbyssRange v-model="v2" :min="0" :max="100" :label="true" :label-always="false"
    :left-label-value="v2.min" :right-label-value="v2.max" />

  <!-- Etykiety zawsze widoczne -->
  <AbyssRange v-model="v3" :min="0" :max="100" :label="true" :label-always="true"
    :left-label-value="v3.min" :right-label-value="v3.max" />
</template>
        `,
      },
    },
  },
  args: {
    modelValue: { min: 20, max: 70 },
    min: 0,
    max: 100,
    step: 1,
    disable: false,
    readonly: false,
  },
  render: (args) => ({
    components: { AbyssRange },
    setup() {
      const v1 = ref({ ...(args.modelValue ?? { min: 20, max: 70 }) });
      const v2 = ref({ ...(args.modelValue ?? { min: 20, max: 70 }) });
      const v3 = ref({ ...(args.modelValue ?? { min: 20, max: 70 }) });
      return { args, v1, v2, v3 };
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 40px; width: 320px; padding-top: 8px;">
        <div>
          <div style="font-size: 11px; opacity: 0.5; margin-bottom: 8px;">Bez etykiet</div>
          <AbyssRange v-bind="args" v-model="v1" :label="false" :label-always="false" />
        </div>
        <div style="padding-top: 24px;">
          <div style="font-size: 11px; opacity: 0.5; margin-bottom: 8px;">Etykiety podczas przeciągania (label)</div>
          <AbyssRange v-bind="args" v-model="v2" :label="true" :label-always="false"
            :left-label-value="v2.min" :right-label-value="v2.max" />
        </div>
        <div style="padding-top: 24px;">
          <div style="font-size: 11px; opacity: 0.5; margin-bottom: 8px;">Etykiety zawsze widoczne (labelAlways)</div>
          <AbyssRange v-bind="args" v-model="v3" :label="true" :label-always="true"
            :left-label-value="v3.min" :right-label-value="v3.max" />
        </div>
      </div>
    `,
  }),
  play: async ({ canvas }) => {
    const sliders = canvas.getAllByRole('slider');
    await expect(sliders).toHaveLength(3);
    for (const slider of sliders) {
      await expect(slider).toBeVisible();
    }
  },
};

export const WithCustomLabelValue: Story = {
  name: 'Z własną etykietą (jednostka)',
  parameters: {
    docs: {
      description: {
        story:
          'Zakres z etykietami wyświetlającymi wartości z jednostką – np. do filtrowania cen, température itp.',
      },
    },
  },
  args: {
    modelValue: { min: 20, max: 80 },
    min: 0,
    max: 100,
    step: 1,
    label: true,
    labelAlways: true,
    disable: false,
    readonly: false,
  },
  render: (args) => ({
    components: { AbyssRange },
    setup() {
      const value = ref({ ...(args.modelValue ?? { min: 20, max: 80 }) });
      return { args, value };
    },
    template: `
      <div style="width: 320px; padding-top: 32px;">
        <AbyssRange v-bind="args" v-model="value"
          :left-label-value="value.min + ' zł'"
          :right-label-value="value.max + ' zł'" />
      </div>
    `,
  }),
  play: async ({ canvas }) => {
    const sliders = canvas.getAllByRole('slider');
    await expect(sliders).toHaveLength(1);
    for (const slider of sliders) {
      await expect(slider).toBeVisible();
    }
  },
};

export const WithMarkers: Story = {
  name: 'Ze znacznikami',
  parameters: {
    docs: {
      description: {
        story:
          'Zakres ze znacznikami na torze wskazującymi pozycje kroków. Ułatwia orientację przy wyborze wartości.',
      },
    },
  },
  args: {
    modelValue: { min: 2, max: 4 },
    min: 0,
    max: 6,
    step: 1,
    snap: false,
    markers: true,
    label: true,
    labelAlways: true,
    disable: false,
    readonly: false,
  },
  render: (args) => ({
    components: { AbyssRange },
    setup() {
      const value = ref({ ...(args.modelValue ?? { min: 2, max: 4 }) });
      return { args, value };
    },
    template: `
      <div style="width: 320px; padding-top: 32px;">
        <AbyssRange v-bind="args" v-model="value"
          :left-label-value="value.min"
          :right-label-value="value.max" />
      </div>
    `,
  }),
  play: async ({ canvas }) => {
    const sliders = canvas.getAllByRole('slider');
    await expect(sliders).toHaveLength(1);
    for (const slider of sliders) {
      await expect(slider).toBeVisible();
    }
  },
};

export const WithMarkerLabels: Story = {
  name: 'Z etykietami znaczników',
  parameters: {
    docs: {
      description: {
        story:
          'Prezentacja czterech wariantów prop `markerLabels`: **boolean**, **tablica obiektów**, **obiekt** z mapowaniem oraz **funkcja** zwracająca etykietę dynamicznie.',
      },
      source: {
        language: 'html',
        code: `
<script setup>
const v1 = ref({ min: 1, max: 4 });
const v2 = ref({ min: 1, max: 4 });
const v3 = ref({ min: 1, max: 4 });
const v4 = ref({ min: 1, max: 4 });

const arrayLabels = [
  { value: 0, label: '0°C' },
  { value: 2, label: '2°C' },
  { value: 4, label: '4°C' },
  { value: 6, label: '6°C' },
];
const objectLabels = { 0: '$0', 2: '$2', 4: '$4', 6: '$6' };
const fnLabel = (val) => val + '×';
</script>

<template>
  <!-- Boolean – automatyczne etykiety -->
  <AbyssRange v-model="v1" :min="0" :max="6" :step="1" :markers="true" :marker-labels="true" />

  <!-- Tablica – własne etykiety -->
  <AbyssRange v-model="v2" :min="0" :max="6" :step="1" :markers="true" :marker-labels="arrayLabels" />

  <!-- Obiekt – mapowanie value→label -->
  <AbyssRange v-model="v3" :min="0" :max="6" :step="1" :markers="true" :marker-labels="objectLabels" />

  <!-- Funkcja – dynamiczny label -->
  <AbyssRange v-model="v4" :min="0" :max="6" :step="1" :markers="true" :marker-labels="fnLabel" />
</template>
        `,
      },
    },
  },
  args: {
    modelValue: { min: 1, max: 4 },
    min: 0,
    max: 6,
    step: 1,
    markers: true,
    disable: false,
    readonly: false,
  },
  render: (args) => ({
    components: { AbyssRange },
    setup() {
      const v1 = ref({ ...(args.modelValue ?? { min: 1, max: 4 }) });
      const v2 = ref({ ...(args.modelValue ?? { min: 1, max: 4 }) });
      const v3 = ref({ ...(args.modelValue ?? { min: 1, max: 4 }) });
      const v4 = ref({ ...(args.modelValue ?? { min: 1, max: 4 }) });
      const arrayLabels = [
        { value: 0, label: '0°C' },
        { value: 2, label: '2°C' },
        { value: 4, label: '4°C' },
        { value: 6, label: '6°C' },
      ];
      const objectLabels = { 0: '$0', 2: '$2', 4: '$4', 6: '$6' };
      const fnLabel = (val: number) => `${val}×`;
      return { args, v1, v2, v3, v4, arrayLabels, objectLabels, fnLabel };
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 48px; width: 320px; padding-top: 12px; padding-bottom: 24px;">
        <div>
          <div style="font-size: 11px; opacity: 0.5; margin-bottom: 24px;">Boolean (automatyczne)</div>
          <AbyssRange v-bind="args" v-model="v1" :marker-labels="true" />
        </div>
        <div>
          <div style="font-size: 11px; opacity: 0.5; margin-bottom: 24px;">Tablica – własne etykiety</div>
          <AbyssRange v-bind="args" v-model="v2" :marker-labels="arrayLabels" />
        </div>
        <div>
          <div style="font-size: 11px; opacity: 0.5; margin-bottom: 24px;">Obiekt – mapowanie value→label</div>
          <AbyssRange v-bind="args" v-model="v3" :marker-labels="objectLabels" />
        </div>
        <div>
          <div style="font-size: 11px; opacity: 0.5; margin-bottom: 24px;">Funkcja – dynamiczny label</div>
          <AbyssRange v-bind="args" v-model="v4" :marker-labels="fnLabel" />
        </div>
      </div>
    `,
  }),
  play: async ({ canvas }) => {
    const sliders = canvas.getAllByRole('slider');
    await expect(sliders).toHaveLength(4);
    for (const slider of sliders) {
      await expect(slider).toBeVisible();
    }
  },
};

export const WithSnap: Story = {
  name: 'Z zatrzaskiwaniem',
  parameters: {
    docs: {
      description: {
        story:
          'Zakres z zatrzaskiwaniem kciuków na pozycjach kroku (`snap: true`). Oba kciuki mogą przyjmować tylko wartości będące wielokrotnością kroku.',
      },
    },
  },
  args: {
    modelValue: { min: 20, max: 60 },
    min: 0,
    max: 100,
    step: 10,
    snap: true,
    markers: true,
    label: true,
    labelAlways: false,
    disable: false,
    readonly: false,
  },
  render: (args) => ({
    components: { AbyssRange },
    setup() {
      const value = ref({ ...(args.modelValue ?? { min: 20, max: 60 }) });
      return { args, value };
    },
    template: `
      <div style="width: 320px;">
        <AbyssRange v-bind="args" v-model="value"
          :left-label-value="value.min"
          :right-label-value="value.max" />
      </div>
    `,
  }),
  play: async ({ canvas }) => {
    const sliders = canvas.getAllByRole('slider');
    await expect(sliders).toHaveLength(1);
    for (const slider of sliders) {
      await expect(slider).toBeVisible();
    }
  },
};

export const WithInnerRange: Story = {
  name: 'Z wewnętrznym zakresem',
  parameters: {
    docs: {
      description: {
        story:
          'Zakres z ograniczonym zakresem wewnętrznym (`innerMin`, `innerMax`). Kciuki poruszają się swobodnie w pełnym zakresie, ale wartości są ograniczone do zakresu wewnętrznego.',
      },
    },
  },
  args: {
    modelValue: { min: 30, max: 60 },
    min: 0,
    max: 100,
    step: 1,
    innerMin: 20,
    innerMax: 80,
    label: true,
    labelAlways: true,
    disable: false,
    readonly: false,
  },
  render: (args) => ({
    components: { AbyssRange },
    setup() {
      const value = ref({ ...(args.modelValue ?? { min: 30, max: 60 }) });
      return { args, value };
    },
    template: `
      <div style="width: 320px; padding-top: 32px;">
        <AbyssRange v-bind="args" v-model="value"
          :left-label-value="value.min"
          :right-label-value="value.max" />
      </div>
    `,
  }),
  play: async ({ canvas }) => {
    const sliders = canvas.getAllByRole('slider');
    await expect(sliders).toHaveLength(1);
    for (const slider of sliders) {
      await expect(slider).toBeVisible();
    }
  },
};

export const DragRange: Story = {
  name: 'Przeciąganie zakresu',
  parameters: {
    docs: {
      description: {
        story:
          'Porównanie trzech trybów przeciągania: **domyślny** (niezależne kciuki), **dragRange** (możliwość przeciągania całego zakresu) oraz **dragOnlyRange** (tylko przeciąganie całego zakresu, bez regulacji pojedynczych kciuków).',
      },
      source: {
        language: 'html',
        code: `
<script setup>
const v1 = ref({ min: 20, max: 65 });
const v2 = ref({ min: 20, max: 65 });
const v3 = ref({ min: 10, max: 40 });
</script>

<template>
  <!-- Domyślnie – niezależne kciuki -->
  <AbyssRange v-model="v1" :min="0" :max="100" :label="true" :label-always="true"
    :left-label-value="v1.min" :right-label-value="v1.max" />

  <!-- drag-range – można przeciągać cały zakres -->
  <AbyssRange v-model="v2" :min="0" :max="100" :drag-range="true" :label="true" :label-always="true"
    :left-label-value="v2.min" :right-label-value="v2.max" />

  <!-- drag-only-range – tylko przeciąganie całości -->
  <AbyssRange v-model="v3" :min="0" :max="100" :step="5" :drag-only-range="true"
    :label="true" :label-always="true"
    :left-label-value="v3.min" :right-label-value="v3.max" />
</template>
        `,
      },
    },
  },
  args: {
    min: 0,
    max: 100,
    step: 1,
    label: true,
    labelAlways: true,
    disable: false,
    readonly: false,
  },
  render: (args) => ({
    components: { AbyssRange },
    setup() {
      const v1 = ref({ min: 20, max: 65 });
      const v2 = ref({ min: 20, max: 65 });
      const v3 = ref({ min: 10, max: 40 });
      return { args, v1, v2, v3 };
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 40px; width: 320px; padding-top: 32px;">
        <div>
          <div style="font-size: 11px; opacity: 0.5; margin-bottom: 8px;">Domyślnie – niezależne kciuki</div>
          <AbyssRange v-bind="args" v-model="v1"
            :left-label-value="v1.min" :right-label-value="v1.max" />
        </div>
        <div>
          <div style="font-size: 11px; opacity: 0.5; margin-bottom: 8px;">dragRange – można przeciągać cały zakres</div>
          <AbyssRange v-bind="args" v-model="v2" :drag-range="true"
            :left-label-value="v2.min" :right-label-value="v2.max" />
        </div>
        <div>
          <div style="font-size: 11px; opacity: 0.5; margin-bottom: 8px;">dragOnlyRange – tylko przeciąganie całości (stały interwał)</div>
          <AbyssRange v-bind="args" v-model="v3" :step="5" :drag-only-range="true"
            :left-label-value="v3.min" :right-label-value="v3.max" />
        </div>
      </div>
    `,
  }),
  play: async ({ canvas }) => {
    const sliders = canvas.getAllByRole('slider');
    await expect(sliders).toHaveLength(3);
    for (const slider of sliders) {
      await expect(slider).toBeVisible();
    }
  },
};

export const MarkerLabelSlots: Story = {
  name: 'Sloty etykiet znaczników',
  parameters: {
    docs: {
      description: {
        story:
          'Demonstracja slotu `#marker-label-group` – kolorowe klikalne etykiety liczb dla zakresu z `innerMin`/`innerMax`.',
      },
      source: {
        language: 'html',
        code: `
<script setup>
const value = ref({ min: 2, max: 8 });
</script>

<template>
  <AbyssRange
    v-model="value"
    :min="1" :max="10"
    :inner-min="2" :inner-max="8"
    :label-always="true"
    :markers="true"
    :marker-labels="true"
  >
    <template #marker-label-group="{ markerList }">
      <div
        v-for="marker in markerList"
        :key="marker.index"
        :class="marker.classes"
        :style="[marker.style, { cursor: 'pointer' }]"
        @click="value = { ...value, min: Math.min(marker.value, value.max), max: Math.max(marker.value, value.min) }"
      >{{ marker.value }}</div>
    </template>
  </AbyssRange>
</template>
        `,
      },
    },
  },
  args: {
    disable: false,
    readonly: false,
  },
  render: () => ({
    components: { AbyssRange, QIcon },
    setup() {
      const value = ref({ min: 2, max: 8 });
      return { value };
    },
    template: `
      <div style="width: 320px; padding: 40px 0 32px;">
        <div style="font-size: 11px; opacity: 0.5; margin-bottom: 40px;">#marker-label-group – kolorowe numery, klikalne (innerMin/innerMax)</div>
        <AbyssRange
          v-model="value"
          :min="1" :max="10" :inner-min="2" :inner-max="8"
          :label-always="true" :markers="true" :marker-labels="true"
          :left-label-value="value.min" :right-label-value="value.max"
        >
          <template #marker-label-group="{ markerList }">
            <div
              v-for="marker in markerList"
              :key="marker.index"
              :class="marker.classes"
              :style="[marker.style, {
                cursor: 'pointer',
                color: (marker.value === value.min || marker.value === value.max)
                  ? '#fff'
                  : 'rgba(255,255,255,0.4)'
              }]"
              @click="value = { min: Math.min(marker.value, value.max), max: Math.max(marker.value, value.min) }"
            >{{ marker.value }}</div>
          </template>
        </AbyssRange>
      </div>
    `,
  }),
  play: async ({ canvas }) => {
    const sliders = canvas.getAllByRole('slider');
    await expect(sliders).toHaveLength(1);
    for (const slider of sliders) {
      await expect(slider).toBeVisible();
    }
  },
};

export const MarkerLabelSlot: Story = {
  name: 'Slot etykiety znacznika (marker-label)',
  parameters: {
    docs: {
      description: {
        story:
          'Demonstracja slotu `#marker-label` – niestandardowy wygląd etykiety pojedynczego znacznika. Na pierwszej i ostatniej pozycji renderowane są ikony (`sym_r_volume_off` / `sym_r_volume_up`), które podświetlają się gdy kciuk jest ustawiony dokładnie na tej pozycji. Pozostałe znaczniki wyświetlają liczby. Slot otrzymuje scope `{ marker, markerList, markerMap }`, gdzie `marker` zawiera `{ index, value, label, classes, style }`. Ważne: do kontenera etykiety **muszą** być przyłączone `marker.classes` i `marker.style`, żeby Quasar mógł ją poprawnie pozycjonować.',
      },
      source: {
        language: 'html',
        code: `
<script setup>
const value = ref({ min: 1, max: 4 });
</script>

<template>
  <AbyssRange
    v-model="value"
    :min="0" :max="5"
    :step="1"
    :markers="true"
    :marker-labels="true"
    :label-always="true"
  >
    <template #marker-label="{ marker }">
      <!-- ikona na pierwszym i ostatnim miejscu, podświetlona gdy kciuk na niej -->
      <q-icon
        v-if="marker.value === 0 || marker.value === 5"
        :class="marker.classes"
        :style="[
          marker.style,
          {
            color: (marker.value === value.min || marker.value === value.max)
              ? 'rgba(255,255,255,1)'
              : 'rgba(255,255,255,0.3)',
            filter: (marker.value === value.min || marker.value === value.max)
              ? 'drop-shadow(0 0 4px rgba(255,255,255,0.7))'
              : 'none',
            transition: 'color 0.2s, filter 0.2s',
          }
        ]"
        :name="marker.value === 0 ? 'sym_r_volume_off' : 'sym_r_volume_up'"
        size="18px"
      />
      <div
        v-else
        :class="marker.classes"
        :style="marker.style"
        style="color: rgba(255,255,255,0.4); font-size: 10px;"
      >
        {{ marker.label }}
      </div>
    </template>
  </AbyssRange>
</template>
        `,
      },
    },
  },
  args: {
    disable: false,
    readonly: false,
  },
  render: () => ({
    components: { AbyssRange, QIcon },
    setup() {
      const value = ref({ min: 1, max: 4 });
      return { value };
    },
    template: `
      <div style="width: 320px; padding: 40px 0 32px;">
        <div style="font-size: 11px; opacity: 0.5; margin-bottom: 40px;">#marker-label – ikony na krańcach podświetlają się gdy kciuk je dotyka</div>
        <AbyssRange
          v-model="value"
          :min="0" :max="5"
          :step="1"
          :markers="true"
          :marker-labels="true"
          :label-always="true"
          :left-label-value="value.min"
          :right-label-value="value.max"
        >
          <template #marker-label="{ marker }">
            <q-icon
              v-if="marker.value === 0 || marker.value === 5"
              :class="marker.classes"
              :style="[
                marker.style,
                {
                  color: (marker.value === value.min || marker.value === value.max)
                    ? 'rgba(255,255,255,1)'
                    : 'rgba(255,255,255,0.3)',
                  filter: (marker.value === value.min || marker.value === value.max)
                    ? 'drop-shadow(0 0 4px rgba(255,255,255,0.7))'
                    : 'none',
                  transition: 'color 0.2s, filter 0.2s',
                }
              ]"
              :name="marker.value === 0 ? 'sym_r_volume_off' : 'sym_r_volume_up'"
              size="18px"
            />
            <div
              v-else
              :class="marker.classes"
              :style="marker.style"
              style="color: rgba(255,255,255,0.4); font-size: 10px;"
            >
              {{ marker.label }}
            </div>
          </template>
        </AbyssRange>
      </div>
    `,
  }),
  play: async ({ canvas }) => {
    const sliders = canvas.getAllByRole('slider');
    await expect(sliders).toHaveLength(1);
    for (const slider of sliders) {
      await expect(slider).toBeVisible();
    }
  },
};

export const Disabled: Story = {
  name: 'Nieaktywny',
  parameters: {
    docs: {
      description: {
        story:
          'Zakres w stanie nieaktywnym – wyświetlany z obniżoną przejrzystością, nie reaguje na interakcje.',
      },
    },
  },
  args: {
    modelValue: { min: 25, max: 60 },
    min: 0,
    max: 100,
    step: 1,
    disable: true,
    label: true,
    labelAlways: true,
    readonly: false,
  },
  render: (args) => ({
    components: { AbyssRange },
    setup() {
      const value = ref({ ...(args.modelValue ?? { min: 25, max: 60 }) });
      return { args, value };
    },
    template: `
      <div style="width: 320px; padding-top: 32px;">
        <AbyssRange v-bind="args" v-model="value"
          :left-label-value="value.min"
          :right-label-value="value.max" />
      </div>
    `,
  }),
  play: async ({ canvas }) => {
    const sliders = canvas.getAllByRole('slider');
    await expect(sliders).toHaveLength(1);
    for (const slider of sliders) {
      await expect(slider).toBeVisible();
      await expect(slider).toHaveAttribute('aria-disabled', 'true');
    }
  },
};

export const Readonly: Story = {
  name: 'Tylko do odczytu',
  parameters: {
    docs: {
      description: {
        story:
          'Zakres w trybie tylko do odczytu – widoczny i aktywny wizualnie, ale wartości nie mogą być zmienione.',
      },
    },
  },
  args: {
    modelValue: { min: 30, max: 75 },
    min: 0,
    max: 100,
    step: 1,
    readonly: true,
    label: true,
    labelAlways: true,
    disable: false,
  },
  render: (args) => ({
    components: { AbyssRange },
    setup() {
      const value = ref({ ...(args.modelValue ?? { min: 30, max: 75 }) });
      return { args, value };
    },
    template: `
      <div style="width: 320px; padding-top: 32px;">
        <AbyssRange v-bind="args" v-model="value"
          :left-label-value="value.min"
          :right-label-value="value.max" />
      </div>
    `,
  }),
  play: async ({ canvas }) => {
    const sliders = canvas.getAllByRole('slider');
    await expect(sliders).toHaveLength(1);
    for (const slider of sliders) {
      await expect(slider).toBeVisible();
    }
  },
};

export const Vertical: Story = {
  name: 'Pionowy',
  parameters: {
    docs: {
      description: {
        story:
          'Zakres w orientacji pionowej – przydatny np. do miksera lub equalizera.',
      },
    },
  },
  args: {
    modelValue: { min: 30, max: 75 },
    min: 0,
    max: 100,
    step: 1,
    vertical: true,
    label: true,
    labelAlways: true,
    disable: false,
    readonly: false,
  },
  render: (args) => ({
    components: { AbyssRange },
    setup() {
      const value = ref({ ...(args.modelValue ?? { min: 30, max: 75 }) });
      return { args, value };
    },
    template: `
      <div style="height: 200px; padding-left: 32px;">
        <AbyssRange v-bind="args" v-model="value"
          :left-label-value="value.min"
          :right-label-value="value.max" />
      </div>
    `,
  }),
  play: async ({ canvas }) => {
    const sliders = canvas.getAllByRole('slider');
    await expect(sliders).toHaveLength(1);
    for (const slider of sliders) {
      await expect(slider).toBeVisible();
      await expect(slider).toHaveAttribute('aria-orientation', 'vertical');
    }
  },
};
