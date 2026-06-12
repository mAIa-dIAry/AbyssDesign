import type { Meta, StoryObj } from '@storybook/vue3';
import { ref } from 'vue';
import { expect, fn } from 'storybook/test';
import { QIcon } from 'quasar';
import AbyssSlider from '@/components/ui/AbyssSlider/AbyssSlider.vue';
import { withAbyssBackground } from '@/stories/AbyssBackgroundDecorator';

const meta: Meta<typeof AbyssSlider> = {
  title: 'UI/AbyssSlider',
  component: AbyssSlider,
  decorators: [withAbyssBackground],
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Komponent suwaka (slider) – wrapper na `QSlider` z stylowaniem Abyss Design System. Pozwala użytkownikowi wybrać wartość liczbową z określonego zakresu. Obsługuje etykiety, znaczniki, ograniczenia wewnętrzne, orientację pionową oraz tryb tylko do odczytu.',
      },
    },
  },
  argTypes: {
    modelValue: {
      control: { type: 'number' },
      description: 'Bieżąca wartość suwaka',
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
      description: 'Zatrzaskiwanie kciuka na pozycjach kroku',
      table: { defaultValue: { summary: 'false' } },
    },
    vertical: {
      control: 'boolean',
      description: 'Orientacja pionowa suwaka',
      table: { defaultValue: { summary: 'false' } },
    },
    label: {
      control: 'boolean',
      description: 'Wyświetlaj etykietę z wartością podczas przeciągania',
      table: { defaultValue: { summary: 'false' } },
    },
    labelAlways: {
      control: 'boolean',
      description: 'Zawsze wyświetlaj etykietę z wartością',
      table: { defaultValue: { summary: 'false' } },
    },
    labelValue: {
      control: 'text',
      description: 'Własna treść etykiety (np. wartość z jednostką)',
    },
    switchLabelSide: {
      control: 'boolean',
      description: 'Przełącz stronę wyświetlania etykiety',
      table: { defaultValue: { summary: 'false' } },
    },
    markers: {
      control: 'boolean',
      description: 'Pokaż znaczniki na torze suwaka',
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
    disable: {
      control: 'boolean',
      description: 'Wyłącz suwak – brak interakcji',
      table: { defaultValue: { summary: 'false' } },
    },
    readonly: {
      control: 'boolean',
      description: 'Tryb tylko do odczytu – suwak widoczny, ale nieedytowalny',
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
type Story = StoryObj<typeof AbyssSlider>;

export const Default: Story = {
  name: 'Domyślny',
  parameters: {
    docs: {
      description: {
        story: 'Podstawowy suwak z zakresem 0–100 i bieżącą wartością.',
      },
    },
  },
  args: {
    modelValue: 40,
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
    components: { AbyssSlider },
    setup() {
      const value = ref(args.modelValue ?? 40);
      return { args, value };
    },
    template: `
      <div style="width: 320px;">
        <AbyssSlider v-bind="args" v-model="value" />
      </div>
    `,
  }),
  play: async ({ canvas }) => {
    const slider = canvas.getByRole('slider');
    await expect(slider).toBeVisible();
    await expect(slider).not.toHaveAttribute('aria-disabled', 'true');
    await expect(slider).toHaveAttribute('aria-valuemin', '0');
    await expect(slider).toHaveAttribute('aria-valuemax', '100');
    await expect(slider).toHaveAttribute('aria-valuenow', '40');
  },
};

export const EmitBehavior: Story = {
  name: 'Zachowanie emitów',
  parameters: {
    docs: {
      description: {
        story:
          'Weryfikacja emitów komponentu: `update:modelValue` i `change` wyzwalane przez klawiaturę (ArrowRight na suwaku), `pan` wyzwalany przez zdarzenia wskaźnika (mousedown → mousemove → mouseup).',
      },
    },
  },
  args: {
    modelValue: 40,
    min: 0,
    max: 100,
    step: 10,
    snap: true,
  },
  render: (args) => ({
    components: { AbyssSlider },
    setup() {
      const value = ref(args.modelValue ?? 40);
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
        <AbyssSlider
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
    // role="slider" jest na korzeniu q-slider, klawiatura obsługiwana jest przez
    // wewnętrzne .q-slider__thumb[tabindex="0"] — trzeba tam wysłać focus
    const sliderRoot = canvas.getByRole('slider');
    const thumbs = Array.from(
      sliderRoot.querySelectorAll<HTMLElement>('.q-slider__thumb'),
    );
    await expect(thumbs.length).toBeGreaterThan(0);
    const thumb = thumbs[0] as HTMLElement;

    // Klik przez userEvent żeby Playwright śledził fokus, potem ArrowRight
    await userEvent.click(thumb);
    await userEvent.keyboard('{ArrowRight}');
    await expect(args['onUpdate:modelValue']).toHaveBeenCalled();
    await expect(args.onChange).toHaveBeenCalled();

    // pan przez pointer — Quasar v-touch-pan słucha mousemove/mouseup na document.
    // UWAGA: onPan({isFinal}) jest wywoływany przez setTimeout(50ms) w Quasarze
    // (patrz TouchPan.js - styleCleanup wraps final handler in 50ms timeout),
    // więc musimy poczekać po mouseup zanim sprawdzimy asercję.
    const rect = thumb.getBoundingClientRect();
    const cx = rect.x + rect.width / 2;
    const cy = rect.y + rect.height / 2;
    const storyDoc = thumb.ownerDocument;
    thumb.dispatchEvent(
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
          'Porównanie trzech wariantów widoczności etykiety: **bez etykiety** (domyślnie), **etykieta podczas przeciągania** (`label: true`) oraz **etykieta zawsze widoczna** (`labelAlways: true`). Wszystkie suwaki mają tę samą wartość startową.',
      },
      source: {
        language: 'html',
        code: `
<script setup>
const v1 = ref(60);
const v2 = ref(60);
const v3 = ref(60);
</script>

<template>
  <!-- Bez etykiety -->
  <AbyssSlider v-model="v1" :min="0" :max="100" :label="false" :label-always="false" />

  <!-- Etykieta podczas przeciągania -->
  <AbyssSlider v-model="v2" :min="0" :max="100" :label="true" :label-always="false" :label-value="v2" />

  <!-- Etykieta zawsze widoczna -->
  <AbyssSlider v-model="v3" :min="0" :max="100" :label="true" :label-always="true" :label-value="v3" />
</template>
        `,
      },
    },
  },
  args: {
    modelValue: 60,
    min: 0,
    max: 100,
    step: 1,
    disable: false,
    readonly: false,
  },
  render: (args) => ({
    components: { AbyssSlider },
    setup() {
      const v1 = ref(args.modelValue ?? 60);
      const v2 = ref(args.modelValue ?? 60);
      const v3 = ref(args.modelValue ?? 60);
      return { args, v1, v2, v3 };
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 40px; width: 320px; padding-top: 8px;">
        <div>
          <div style="font-size: 11px; opacity: 0.5; margin-bottom: 8px;">Bez etykiety</div>
          <AbyssSlider v-bind="args" v-model="v1" :label="false" :label-always="false" />
        </div>
        <div style="padding-top: 24px;">
          <div style="font-size: 11px; opacity: 0.5; margin-bottom: 8px;">Etykieta podczas przeciągania (label)</div>
          <AbyssSlider v-bind="args" v-model="v2" :label="true" :label-always="false" :label-value="v2" />
        </div>
        <div style="padding-top: 24px;">
          <div style="font-size: 11px; opacity: 0.5; margin-bottom: 8px;">Etykieta zawsze widoczna (labelAlways)</div>
          <AbyssSlider v-bind="args" v-model="v3" :label="true" :label-always="true" :label-value="v3" />
        </div>
      </div>
    `,
  }),
  play: async ({ canvas }) => {
    const sliders = canvas.getAllByRole('slider');
    await expect(sliders).toHaveLength(3);
    for (const slider of sliders) {
      await expect(slider).toBeVisible();
      await expect(slider).toHaveAttribute('aria-valuenow', '60');
    }
  },
};

export const WithCustomLabelValue: Story = {
  name: 'Z własną etykietą (jednostka)',
  parameters: {
    docs: {
      description: {
        story:
          'Suwak z etykietą wyświetlającą wartość z jednostką – np. do regulacji głośności, temperatury itp.',
      },
    },
  },
  args: {
    modelValue: 72,
    min: 0,
    max: 100,
    step: 1,
    label: true,
    labelAlways: true,
    disable: false,
    readonly: false,
  },
  render: (args) => ({
    components: { AbyssSlider },
    setup() {
      const value = ref(args.modelValue ?? 72);
      return { args, value };
    },
    template: `
      <div style="width: 320px; padding-top: 32px;">
        <AbyssSlider v-bind="args" v-model="value" :label-value="value + ' %'" />
      </div>
    `,
  }),
  play: async ({ canvas }) => {
    const slider = canvas.getByRole('slider');
    await expect(slider).toBeVisible();
    await expect(slider).toHaveAttribute('aria-valuenow', '72');
  },
};

export const WithMarkerLabels: Story = {
  name: 'Z etykietami znaczników',
  parameters: {
    docs: {
      description: {
        story:
          'Prezentacja czterech wariantów prop `markerLabels`: **boolean** (automatyczne etykiety liczbowe), **tablica obiektów** z własnymi labelami, **obiekt** z mapowaniem wartość→etykieta oraz **funkcja** zwracająca etykietę dynamicznie.',
      },
      source: {
        language: 'html',
        code: `
<script setup>
const v1 = ref(3);
const v2 = ref(3);
const v3 = ref(3);
const v4 = ref(3);

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
  <AbyssSlider v-model="v1" :min="0" :max="6" :step="1" :markers="true" :marker-labels="true" />

  <!-- Tablica – własne etykiety -->
  <AbyssSlider v-model="v2" :min="0" :max="6" :step="1" :markers="true" :marker-labels="arrayLabels" />

  <!-- Obiekt – mapowanie value→label -->
  <AbyssSlider v-model="v3" :min="0" :max="6" :step="1" :markers="true" :marker-labels="objectLabels" />

  <!-- Funkcja – dynamiczny label -->
  <AbyssSlider v-model="v4" :min="0" :max="6" :step="1" :markers="true" :marker-labels="fnLabel" />
</template>
        `,
      },
    },
  },
  args: {
    modelValue: 3,
    min: 0,
    max: 6,
    step: 1,
    snap: false,
    markers: true,
    disable: false,
    readonly: false,
  },
  render: (args) => ({
    components: { AbyssSlider },
    setup() {
      const v1 = ref(args.modelValue ?? 3);
      const v2 = ref(args.modelValue ?? 3);
      const v3 = ref(args.modelValue ?? 3);
      const v4 = ref(args.modelValue ?? 3);
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
          <AbyssSlider v-bind="args" v-model="v1" :marker-labels="true" />
        </div>
        <div>
          <div style="font-size: 11px; opacity: 0.5; margin-bottom: 24px;">Tablica – własne etykiety</div>
          <AbyssSlider v-bind="args" v-model="v2" :marker-labels="arrayLabels" />
        </div>
        <div>
          <div style="font-size: 11px; opacity: 0.5; margin-bottom: 24px;">Obiekt – mapowanie value→label</div>
          <AbyssSlider v-bind="args" v-model="v3" :marker-labels="objectLabels" />
        </div>
        <div>
          <div style="font-size: 11px; opacity: 0.5; margin-bottom: 24px;">Funkcja – dynamiczny label</div>
          <AbyssSlider v-bind="args" v-model="v4" :marker-labels="fnLabel" />
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

export const SwitchMarkerLabelsSide: Story = {
  name: 'Etykiety znaczników – zmiana strony',
  parameters: {
    docs: {
      description: {
        story:
          'Porównanie domyślnego położenia etykiet znaczników (pod torem) z `switchMarkerLabelsSide: true` (etykiety nad torem). Przydatne gdy pod suwakiem brakuje miejsca lub etykiety nakładają się na inne treści strony.',
      },
      source: {
        language: 'html',
        code: `
<script setup>
const v1 = ref(3);
const v2 = ref(3);
</script>

<template>
  <!-- Etykiety pod torem (domyślnie) -->
  <AbyssSlider
    v-model="v1"
    :min="0" :max="6" :step="1"
    :markers="true" :marker-labels="true"
    :switch-marker-labels-side="false"
  />

  <!-- Etykiety nad torem -->
  <AbyssSlider
    v-model="v2"
    :min="0" :max="6" :step="1"
    :markers="true" :marker-labels="true"
    :switch-marker-labels-side="true"
  />
</template>
        `,
      },
    },
  },
  args: {
    modelValue: 3,
    min: 0,
    max: 6,
    step: 1,
    markers: true,
    markerLabels: true,
    disable: false,
    readonly: false,
  },
  render: (args) => ({
    components: { AbyssSlider },
    setup() {
      const v1 = ref(args.modelValue ?? 3);
      const v2 = ref(args.modelValue ?? 3);
      return { args, v1, v2 };
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 64px; width: 320px; padding: 16px 0 40px;">
        <div>
          <div style="font-size: 11px; opacity: 0.5; margin-bottom: 24px;">Domyślnie – etykiety pod torem</div>
          <AbyssSlider v-bind="args" v-model="v1" :switch-marker-labels-side="false" />
        </div>
        <div>
          <div style="font-size: 11px; opacity: 0.5; margin-bottom: 8px;">switchMarkerLabelsSide: true – etykiety nad torem</div>
          <AbyssSlider v-bind="args" v-model="v2" :switch-marker-labels-side="true" />
        </div>
      </div>
    `,
  }),
  play: async ({ canvas }) => {
    const sliders = canvas.getAllByRole('slider');
    await expect(sliders).toHaveLength(2);
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
          'Odwzorowanie przykładu z dokumentacji Quasar. Trzy warianty użycia slotów `#marker-label-group` i `#marker-label`: **kolorowe numery klikalne** (z `innerMin`/`innerMax`), **numery + ikony głośności** (mix elementów w jednej grupie) oraz **ikony gwiazdek** odzwierciedlające aktualną wartość (`markerMap`).',
      },
      source: {
        language: 'html',
        code: `
<!--
  SLOTY ETYKIET ZNACZNIKÓW

  Aby sloty działały, prop :marker-labels musi być ustawiony (nawet na true).
  Oba sloty otrzymują ten sam scope z use-slider.js:
    markerList  – tablica obiektów { index, value, label, classes, style }
                  gdzie classes/style pozycjonują etykietę na osi suwaka
    markerMap   – obiekt { [value]: { index, value, label, classes, style } }
                  przydatny gdy chcemy odwołać się do konkretnej wartości

  Slot #marker-label-group zastępuje CAŁĄ grupę etykiet – renderujesz
  wszystkie elementy samodzielnie wewnątrz jednego template.

  Slot #marker-label renderuje JEDNĄ etykietę na raz; scope zawiera
  dodatkowo pole "marker" z tym samym kształtem co element markerList.
-->

<script setup>
import { ref } from 'vue';

const firstModel  = ref(2);   // zakres 1–10, innerMin=2, innerMax=8
const secondModel = ref(3);   // zakres 0–5, mieszane elementy (tekst + ikona)
const thirdModel  = ref(3.5); // zakres 0–5, krok 0.5, gwiazdki przy bieżącej wartości
</script>

<template>
  <!--
    PRZYKŁAD 1: #marker-label-group z markerList
    Iterujemy po markerList – każdy element ma gotowe classes i style
    do pozycjonowania. Kliknięcie etykiety ustawia model (jak snap labels).
    innerMin/innerMax ogranicza ruch kciuka, ale etykiety wciąż pokrywają
    pełen zakres min–max.
  -->
  <AbyssSlider
    v-model="firstModel"
    :min="1" :max="10"
    :inner-min="2" :inner-max="8"
    :label-always="true"
    :markers="true"
    :marker-labels="true"
  >
    <template #marker-label-group="{ markerList }">
      <!--
        marker.classes – klasy pozycjonujące (translateX, standard/switched)
        marker.style   – left/right jako % od początku toru
        marker.value   – wartość liczbowa znacznika
      -->
      <div
        v-for="marker in markerList"
        :key="marker.index"
        :class="marker.classes"
        :style="marker.style"
        style="cursor: pointer;"
        @click="firstModel = marker.value"
      >{{ marker.value }}</div>
    </template>
  </AbyssSlider>

  <!--
    PRZYKŁAD 2: #marker-label-group – mix różnych typów elementów
    markerList[val] – dostęp do konkretnego znacznika po jego wartości
    (indeks tablicy markerList odpowiada wartości, bo min=0 i step=1).
    Możemy renderować zupełnie różne elementy dla różnych pozycji.
  -->
  <AbyssSlider v-model="secondModel" :min="0" :max="5" :markers="true" :marker-labels="true">
    <template #marker-label-group="{ markerList }">
      <!-- wartości 1–4: zwykły tekst -->
      <div
        v-for="val in 4"
        :key="val"
        :class="markerList[val].classes"
        :style="markerList[val].style"
        style="cursor: pointer;"
        @click="secondModel = val"
      >{{ val }}</div>

      <!-- wartości 0 i 5: ikona zamiast liczby -->
      <q-icon
        v-for="val in [0, 5]"
        :key="val"
        :class="markerList[val].classes"
        :style="markerList[val].style"
        size="sm"
        :name="val === 0 ? 'sym_r_volume_off' : 'sym_r_volume_up'"
        style="cursor: pointer;"
        @click="secondModel = val"
      />
    </template>
  </AbyssSlider>

  <!--
    PRZYKŁAD 3: #marker-label-group z markerMap + switch-marker-labels-side
    markerMap[key] – dostęp przez wartość modelu bezpośrednio.
    Renderujemy TYLKO etykietę dla bieżącej wartości (gwiazdki ratingu).
    switch-marker-labels-side przenosi grupę etykiet nad tor suwaka.
    Math.floor + sprawdzenie ułamka obsługuje wartości połówkowe (0.5, 1.5…).
  -->
  <AbyssSlider
    v-model="thirdModel"
    :min="0" :max="5" :step="0.5"
    :snap="true"
    :marker-labels="true"
    :switch-marker-labels-side="true"
  >
    <template #marker-label-group="{ markerMap }">
      <!--
        markerMap[thirdModel].classes/.style – pozycja odpowiadająca
        aktualnej wartości modelu. Renderujemy tylko jeden element.
      -->
      <div
        style="display: flex; align-items: center;"
        :class="markerMap[thirdModel].classes"
        :style="markerMap[thirdModel].style"
      >
        <q-icon v-if="thirdModel === 0" size="xs" name="sym_r_star" style="opacity: 0.3;" />
        <template v-else>
          <q-icon v-for="i in Math.floor(thirdModel)" :key="i" size="xs" name="sym_r_star" />
          <q-icon v-if="thirdModel > Math.floor(thirdModel)" size="xs" name="sym_r_star_half" />
        </template>
      </div>
    </template>
  </AbyssSlider>
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
    components: { AbyssSlider, QIcon },
    setup() {
      const firstModel = ref(2);
      const secondModel = ref(3);
      const thirdModel = ref(3.5);
      return { firstModel, secondModel, thirdModel };
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 56px; width: 320px; padding: 16px 0 64px;">
        <div>
          <div style="font-size: 11px; opacity: 0.5; margin-bottom: 40px;">#marker-label-group – kolorowe numery, klikalne (innerMin/innerMax)</div>
          <AbyssSlider
            v-model="firstModel"
            :min="1" :max="10" :inner-min="2" :inner-max="8"
            :label-always="true" :markers="true" :marker-labels="true"
          >
            <template #marker-label-group="{ markerList }">
              <div
                v-for="marker in markerList"
                :key="marker.index"
                :class="marker.classes"
                :style="[marker.style, { cursor: 'pointer', color: marker.value === firstModel ? '#fff' : 'rgba(255,255,255,0.4)' }]"
                @click="firstModel = marker.value"
              >{{ marker.value }}</div>
            </template>
          </AbyssSlider>
        </div>
        <div>
          <div style="font-size: 11px; opacity: 0.5; margin-bottom: 24px;">#marker-label-group – numery 1–4 + ikony głośności dla 0 i 5</div>
          <AbyssSlider
            v-model="secondModel"
            :min="0" :max="5" :markers="true" :marker-labels="true"
          >
            <template #marker-label-group="{ markerList }">
              <div
                v-for="val in 4"
                :key="val"
                :class="markerList[val].classes"
                :style="[markerList[val].style, { cursor: 'pointer' }]"
                @click="secondModel = val"
              >{{ val }}</div>
              <QIcon
                v-for="val in [0, 5]"
                :key="val"
                :class="markerList[val].classes"
                :style="[markerList[val].style, { cursor: 'pointer' }]"
                size="sm"
                :name="val === 0 ? 'sym_r_volume_off' : 'sym_r_volume_up'"
                @click="secondModel = val"
              />
            </template>
          </AbyssSlider>
        </div>
        <div>
          <div style="font-size: 11px; opacity: 0.5; margin-bottom: 8px;">#marker-label-group – gwiazdki dla aktualnej wartości (markerMap)</div>
          <AbyssSlider
            v-model="thirdModel"
            :min="0" :max="5" :step="0.5"
            :snap="true" :marker-labels="true" :switch-marker-labels-side="true"
          >
            <template #marker-label-group="{ markerMap }">
              <div
                style="display: flex; align-items: center;"
                :class="markerMap[thirdModel].classes"
                :style="markerMap[thirdModel].style"
              >
                <QIcon v-if="thirdModel === 0" size="xs" name="sym_r_star" style="opacity: 0.3;" />
                <template v-else>
                  <QIcon v-for="i in Math.floor(thirdModel)" :key="i" size="xs" name="sym_r_star" />
                  <QIcon v-if="thirdModel > Math.floor(thirdModel)" size="xs" name="sym_r_star_half" />
                </template>
              </div>
            </template>
          </AbyssSlider>
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

export const MarkerLabelSlot: Story = {
  name: 'Slot etykiety znacznika (marker-label)',
  parameters: {
    docs: {
      description: {
        story:
          'Demonstracja slotu `#marker-label` – niestandardowy wygląd etykiety pojedynczego znacznika. Na pierwszej i ostatniej pozycji renderowane są ikony (`sym_r_volume_off` / `sym_r_volume_up`), które podświetlają się gdy kciuk jest ustawiony dokładnie na tej pozycji. Pozostałe znaczniki wyświetlają liczby.',
      },
      source: {
        language: 'html',
        code: `
<script setup>
const value = ref(2);
</script>

<template>
  <AbyssSlider
    v-model="value"
    :min="0" :max="5"
    :step="1"
    :markers="true"
    :marker-labels="true"
    :label-always="true"
  >
    <template #marker-label="{ marker }">
      <q-icon
        v-if="marker.value === 0 || marker.value === 5"
        :class="marker.classes"
        :style="[marker.style, { color: marker.value === value ? 'rgba(255,255,255,1)' : 'rgba(255,255,255,0.3)' }]"
        :name="marker.value === 0 ? 'sym_r_volume_off' : 'sym_r_volume_up'"
        size="18px"
      />
      <div
        v-else
        :class="marker.classes"
        :style="marker.style"
        style="color: rgba(255,255,255,0.4); font-size: 10px;"
      >{{ marker.label }}</div>
    </template>
  </AbyssSlider>
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
    components: { AbyssSlider, QIcon },
    setup() {
      const value = ref(2);
      return { value };
    },
    template: `
      <div style="width: 320px; padding: 40px 0 32px;">
        <div style="font-size: 11px; opacity: 0.5; margin-bottom: 40px;">#marker-label – ikony na krańcach podświetlają się gdy kciuk je dotyka</div>
        <AbyssSlider
          v-model="value"
          :min="0" :max="5"
          :step="1"
          :markers="true"
          :marker-labels="true"
          :label-always="true"
          :label-value="value"
        >
          <template #marker-label="{ marker }">
            <QIcon
              v-if="marker.value === 0 || marker.value === 5"
              :class="marker.classes"
              :style="[
                marker.style,
                {
                  color: marker.value === value ? 'rgba(255,255,255,1)' : 'rgba(255,255,255,0.3)',
                  filter: marker.value === value ? 'drop-shadow(0 0 4px rgba(255,255,255,0.7))' : 'none',
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
        </AbyssSlider>
      </div>
    `,
  }),
  play: async ({ canvas }) => {
    const slider = canvas.getByRole('slider');
    await expect(slider).toBeVisible();
  },
};

export const WithMarkers: Story = {
  name: 'Ze znacznikami',
  parameters: {
    docs: {
      description: {
        story:
          'Suwak ze znacznikami na torze wskazującymi pozycje kroków. Ułatwia orientację przy wyborze wartości.',
      },
    },
  },
  args: {
    modelValue: 3,
    min: 0,
    max: 5,
    step: 1,
    snap: false,
    markers: true,
    label: true,
    labelAlways: true,
    disable: false,
    readonly: false,
  },
  render: (args) => ({
    components: { AbyssSlider },
    setup() {
      const value = ref(args.modelValue ?? 3);
      return { args, value };
    },
    template: `
      <div style="width: 320px; padding-top: 32px;">
        <AbyssSlider v-bind="args" v-model="value" :label-value="value" />
      </div>
    `,
  }),
  play: async ({ canvas }) => {
    const slider = canvas.getByRole('slider');
    await expect(slider).toBeVisible();
    await expect(slider).toHaveAttribute('aria-valuemin', '0');
    await expect(slider).toHaveAttribute('aria-valuemax', '5');
    await expect(slider).toHaveAttribute('aria-valuenow', '3');
  },
};

export const WithSnap: Story = {
  name: 'Z zatrzaskiwaniem',
  parameters: {
    docs: {
      description: {
        story:
          'Suwak z zatrzaskiwaniem kciuka na pozycjach kroku (`snap: true`). Użytkownik może wybrać tylko wartości będące wielokrotnością kroku.',
      },
    },
  },
  args: {
    modelValue: 20,
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
    components: { AbyssSlider },
    setup() {
      const value = ref(args.modelValue ?? 20);
      return { args, value };
    },
    template: `
      <div style="width: 320px;">
        <AbyssSlider v-bind="args" v-model="value" :label-value="value" />
      </div>
    `,
  }),
  play: async ({ canvas }) => {
    const slider = canvas.getByRole('slider');
    await expect(slider).toBeVisible();
    await expect(slider).toHaveAttribute('aria-valuenow', '20');
  },
};

export const WithInnerRange: Story = {
  name: 'Z wewnętrznym zakresem',
  parameters: {
    docs: {
      description: {
        story:
          'Suwak z ograniczonym zakresem wewnętrznym (`innerMin`, `innerMax`). Kciuk porusza się swobodnie w pełnym zakresie, ale wartość jest ograniczona do zakresu wewnętrznego.',
      },
    },
  },
  args: {
    modelValue: 50,
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
    components: { AbyssSlider },
    setup() {
      const value = ref(args.modelValue ?? 50);
      return { args, value };
    },
    template: `
      <div style="width: 320px; padding-top: 32px;">
        <AbyssSlider v-bind="args" v-model="value" :label-value="value" />
      </div>
    `,
  }),
  play: async ({ canvas }) => {
    const slider = canvas.getByRole('slider');
    await expect(slider).toBeVisible();
    await expect(slider).toHaveAttribute('aria-valuenow', '50');
  },
};

export const Disabled: Story = {
  name: 'Nieaktywny',
  parameters: {
    docs: {
      description: {
        story:
          'Suwak w stanie nieaktywnym – wyświetlany z obniżoną przejrzystością, nie reaguje na interakcje użytkownika.',
      },
    },
  },
  args: {
    modelValue: 35,
    min: 0,
    max: 100,
    step: 1,
    disable: true,
    label: true,
    labelAlways: true,
    readonly: false,
  },
  render: (args) => ({
    components: { AbyssSlider },
    setup() {
      const value = ref(args.modelValue ?? 35);
      return { args, value };
    },
    template: `
      <div style="width: 320px; padding-top: 32px;">
        <AbyssSlider v-bind="args" v-model="value" :label-value="value" />
      </div>
    `,
  }),
  play: async ({ canvas }) => {
    const slider = canvas.getByRole('slider');
    await expect(slider).toBeVisible();
    await expect(slider).toHaveAttribute('aria-disabled', 'true');
  },
};

export const Readonly: Story = {
  name: 'Tylko do odczytu',
  parameters: {
    docs: {
      description: {
        story:
          'Suwak w trybie tylko do odczytu – widoczny i aktywny wizualnie, ale wartość nie może być zmieniona przez użytkownika.',
      },
    },
  },
  args: {
    modelValue: 55,
    min: 0,
    max: 100,
    step: 1,
    readonly: true,
    label: true,
    labelAlways: true,
    disable: false,
  },
  render: (args) => ({
    components: { AbyssSlider },
    setup() {
      const value = ref(args.modelValue ?? 55);
      return { args, value };
    },
    template: `
      <div style="width: 320px; padding-top: 32px;">
        <AbyssSlider v-bind="args" v-model="value" :label-value="value" />
      </div>
    `,
  }),
  play: async ({ canvas }) => {
    const slider = canvas.getByRole('slider');
    await expect(slider).toBeVisible();
    await expect(slider).toHaveAttribute('aria-valuenow', '55');
  },
};

export const Vertical: Story = {
  name: 'Pionowy',
  parameters: {
    docs: {
      description: {
        story:
          'Suwak w orientacji pionowej – przydatny np. do regulacji poziomu głośności lub miksera.',
      },
    },
  },
  args: {
    modelValue: 65,
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
    components: { AbyssSlider },
    setup() {
      const value = ref(args.modelValue ?? 65);
      return { args, value };
    },
    template: `
      <div style="height: 200px; padding-left: 32px;">
        <AbyssSlider v-bind="args" v-model="value" :label-value="value" />
      </div>
    `,
  }),
  play: async ({ canvas }) => {
    const slider = canvas.getByRole('slider');
    await expect(slider).toBeVisible();
    await expect(slider).toHaveAttribute('aria-orientation', 'vertical');
    await expect(slider).toHaveAttribute('aria-valuenow', '65');
  },
};
