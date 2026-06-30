import type { Meta, StoryObj } from '@storybook/vue3';
import { ref } from 'vue';
import { expect } from 'storybook/test';
import AbyssToggle from '@/components/ui/AbyssToggle/AbyssToggle.vue';
import { withAbyssBackground } from '@/stories/AbyssBackgroundDecorator';

// Lokalny komponent wrapper dla stories
const StoryWrapper = {
  template: `
    <div style="display: flex; flex-direction: column; gap: 4px; align-items: flex-start; flex: 1; max-width: 600px;">
      <slot />
    </div>
  `,
};

// Wrapper dla story z wieloma przykładami (większy gap)
const MultiExampleWrapper = {
  template: `
    <div style="display: flex; flex-direction: column; gap: 8px; align-items: flex-start; flex: 1; max-width: 600px;">
      <slot />
    </div>
  `,
};

// Komponent dla wyświetlania wartości modelu
const ValueLabel = {
  props: ['value'],
  template: `
    <div style="opacity: 0.6; font-size: 14px;">
      Wartość: {{ value }}
    </div>
  `,
};

const meta: Meta<typeof AbyssToggle> = {
  title: 'UI/AbyssToggle',
  component: AbyssToggle,
  decorators: [withAbyssBackground],
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Komponent toggle (przełącznik) z supportem dla stanu nieokreślonego (indeterminate), własnych wartości i różnych ikon dla każdego stanu.\n\n**Domyślnie** etykieta wyświetla się po lewej stronie, a przełącznik po prawej — standardowy układ w formularzach i ustawieniach Abyss Design System. Użyj `right-label`, aby odwrócić kolejność.',
      },
    },
  },
  argTypes: {
    modelValue: {
      control: 'boolean',
      description:
        'Wartość modelu - może być boolean, dowolna wartość lub tablica (dla modelu tablicowego)',
    },
    'onUpdate:modelValue': { action: 'update:modelValue' },
    label: {
      control: 'text',
      description: 'Etykieta wyświetlana obok toggle',
    },
    rightLabel: {
      control: 'boolean',
      description: 'Czy etykieta ma być wyświetlana po prawej stronie toggle',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
    icon: {
      control: 'text',
      description: 'Ikona wyświetlana wewnątrz toggle',
    },
    checkedIcon: {
      control: 'text',
      description: 'Ikona wyświetlana gdy toggle jest zaznaczony',
    },
    uncheckedIcon: {
      control: 'text',
      description: 'Ikona wyświetlana gdy toggle jest odznaczony',
    },
    indeterminateIcon: {
      control: 'text',
      description:
        'Ikona wyświetlana gdy toggle jest w stanie nieokreślonym (indeterminate)',
    },
    trueValue: {
      control: 'text',
      description: 'Wartość używana dla stanu zaznaczonego',
      table: {
        defaultValue: { summary: 'true' },
      },
    },
    falseValue: {
      control: 'text',
      description: 'Wartość używana dla stanu odznaczonego',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
    toggleIndeterminate: {
      control: 'boolean',
      description:
        'Czy użytkownik ma cyklicznie przełączać przez stan indeterminate',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
    indeterminateValue: {
      control: 'text',
      description: 'Wartość używana dla stanu nieokreślonego (indeterminate)',
      table: {
        defaultValue: { summary: 'null' },
      },
    },
    toggleOrder: {
      control: 'select',
      options: ['tf', 'ft'],
      description:
        "Kolejność przełączania stanów ('t' = true, 'f' = false). Jeśli toggle-indeterminate jest włączone: indet -> pierwszy stan -> drugi stan -> indet",
      table: {
        defaultValue: { summary: 'tf' },
      },
    },
    disable: {
      control: 'boolean',
      description: 'Czy toggle jest nieaktywny',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
    style: {
      control: 'object',
      description: 'Dodatkowe style CSS dla toggle',
    },
    class: {
      control: 'text',
      description: 'Dodatkowe klasy CSS dla toggle',
    },
  },
};

export default meta;
type Story = StoryObj<typeof AbyssToggle>;

/**
 * Podstawowy toggle z etykietą po lewej stronie i ikoną powiadomień.
 */
export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Podstawowy przykład użycia komponentu AbyssToggle. Komponent działa jak standardowy przełącznik true/false z etykietą i ikoną.',
      },
      source: {
        code: `<AbyssToggle
  v-model="notifications"
  label="Włącz powiadomienia"
  icon="sym_r_notifications"
/>`,
      },
    },
  },
  args: {
    modelValue: false,
    label: 'Włącz powiadomienia',
    icon: 'sym_r_notifications',
  },
  render: (args) => ({
    components: { AbyssToggle, StoryWrapper },
    setup() {
      const model = ref(args.modelValue);
      return { args, model };
    },
    template: `
      <StoryWrapper>
        <AbyssToggle v-bind="args" v-model="model" />
        <div style="opacity: 0.6; font-size: 14px;">Wartość: {{ model }}</div>
      </StoryWrapper>
    `,
  }),
  play: async ({ canvas, userEvent }) => {
    const toggle = canvas.getByRole('switch', { name: /włącz powiadomienia/i });
    await expect(toggle).toBeVisible();
    const label = canvas.getByText('Włącz powiadomienia');
    await expect(label).toBeVisible();
    await expect(toggle).not.toBeChecked();
    await userEvent.click(toggle);
    await expect(toggle).toBeChecked();
  },
};

/**
 * Toggle ze stanem nieokreślonym (indeterminate).
 * Użytkownik cyklicznie przełącza między trzema stanami: null (nieokreślony) -> true -> false -> null -> ...
 */
export const IndeterminateState: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Stan nieokreślony (indeterminate) jest przydatny, gdy odpowiedź nie jest jednoznacznie tak/nie, lub gdy wartość nie została jeszcze ustawiona. Użyj `toggle-indeterminate` aby włączyć cykliczne przełączanie przez ten stan.',
      },
      source: {
        code: `<AbyssToggle
  v-model="lunchStatus"
  label="Czy jadłeś dzisiaj lunch?"
  toggle-indeterminate
  :indeterminate-value="null"
  indeterminate-icon="sym_r_remove"
  checked-icon="sym_r_check"
  unchecked-icon="sym_r_close"
/>`,
      },
    },
  },
  args: {
    modelValue: null,
    label: 'Czy jadłeś dzisiaj lunch?',
    toggleIndeterminate: true,
    indeterminateValue: null,
    indeterminateIcon: 'sym_r_remove',
    checkedIcon: 'sym_r_check',
    uncheckedIcon: 'sym_r_close',
  },
  render: (args) => ({
    components: { AbyssToggle, StoryWrapper },
    setup() {
      const model = ref(args.modelValue);
      return { args, model };
    },
    template: `
      <StoryWrapper>
        <AbyssToggle v-bind="args" v-model="model" />
        <div style="opacity: 0.6; font-size: 14px;">
          Wartość modelu: {{ model === null ? 'null (nieokreślony)' : model }}
        </div>
      </StoryWrapper>
    `,
  }),
  play: async ({ canvas, userEvent }) => {
    const toggle = canvas.getByRole('switch');
    await expect(toggle).toHaveAttribute('aria-checked', 'mixed');
    await userEvent.click(toggle);
    await expect(toggle).toBeChecked();
    await userEvent.click(toggle);
    await expect(toggle).not.toBeChecked();
    await userEvent.click(toggle);
    await expect(toggle).toHaveAttribute('aria-checked', 'mixed');
  },
};

/**
 * Toggle z własnymi wartościami zamiast true/false/null.
 * Możesz określić dowolne wartości dla stanów zaznaczonego, odznaczonego i nieokreślonego.
 */
export const WithCustomValues: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Możesz określić własne wartości zamiast domyślnych boolean. Użyj `true-value`, `false-value` i `indeterminate-value` aby zdefiniować wartości dla każdego stanu. Przydatne przy integracji z API lub formularzami.',
      },
      source: {
        code: `<AbyssToggle
  v-model="answer"
  label="Czy jadłeś dzisiaj lunch?"
  toggle-indeterminate
  true-value="yes"
  false-value="no"
  indeterminate-value="maybe"
  indeterminate-icon="sym_r_help"
  checked-icon="sym_r_check"
  unchecked-icon="sym_r_close"
/>`,
      },
    },
  },
  args: {
    modelValue: 'maybe',
    label: 'Czy jadłeś dzisiaj lunch?',
    toggleIndeterminate: true,
    trueValue: 'yes',
    falseValue: 'no',
    indeterminateValue: 'maybe',
    indeterminateIcon: 'sym_r_help',
    checkedIcon: 'sym_r_check',
    uncheckedIcon: 'sym_r_close',
  },
  render: (args) => ({
    components: { AbyssToggle, StoryWrapper },
    setup() {
      const model = ref(args.modelValue);
      return { args, model };
    },
    template: `
      <StoryWrapper>
        <AbyssToggle v-bind="args" v-model="model" />
        <div style="opacity: 0.6; font-size: 14px;">
          Wartość modelu: "{{ model }}"
        </div>
      </StoryWrapper>
    `,
  }),
  play: async ({ canvas, userEvent }) => {
    const toggle = canvas.getByRole('switch');
    await expect(toggle).toHaveAttribute('aria-checked', 'mixed'); // 'maybe' = indeterminate
    await userEvent.click(toggle); // 'maybe' -> 'yes'
    await expect(toggle).toBeChecked();
    await userEvent.click(toggle); // 'yes' -> 'no'
    await expect(toggle).not.toBeChecked();
    await userEvent.click(toggle); // 'no' -> 'maybe'
    await expect(toggle).toHaveAttribute('aria-checked', 'mixed');
  },
};

/**
 * Kolejność przełączania stanów.
 * - 'tf' (domyślnie): false -> true -> false
 * - 'ft': true -> false -> true
 * Z toggle-indeterminate: indet -> pierwszy stan -> drugi stan -> indet
 */
export const ToggleOrder: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Właściwość `toggle-order` określa kolejność przełączania: 'tf' (false → true) lub 'ft' (true → false). W połączeniu z `toggle-indeterminate` stan nieokreślony jest dodawany na początku cyklu.",
      },
      source: {
        code: `<!-- Kolejność 'tf' (domyślnie) -->
<AbyssToggle
  v-model="model"
  toggle-order="tf"
/>

<!-- Kolejność 'ft' -->
<AbyssToggle
  v-model="model"
  toggle-order="ft"
/>

<!-- Z indeterminate -->
<AbyssToggle
  v-model="model"
  toggle-order="tf"
  toggle-indeterminate
/>`,
      },
    },
  },
  render: () => ({
    components: { AbyssToggle, MultiExampleWrapper, ValueLabel },
    setup() {
      const modelTF = ref(null);
      const modelFT = ref(null);
      const modelTFIndet = ref(null);
      const modelFTIndet = ref(null);
      return { modelTF, modelFT, modelTFIndet, modelFTIndet };
    },
    template: `
      <MultiExampleWrapper>
        <AbyssToggle
          v-model="modelTF"
          label="Kolejność 'tf' (false -> true)"
          toggle-order="tf"
          indeterminate-icon="sym_r_remove"
          checked-icon="sym_r_check"
          unchecked-icon="sym_r_close"
        />
        <ValueLabel :value="modelTF" />

        <AbyssToggle
          v-model="modelFT"
          label="Kolejność 'ft' (true -> false)"
          toggle-order="ft"
          indeterminate-icon="sym_r_remove"
          checked-icon="sym_r_check"
          unchecked-icon="sym_r_close"
        />
        <ValueLabel :value="modelFT" />

        <AbyssToggle
          v-model="modelTFIndet"
          label="'tf' + indeterminate (null -> false -> true -> null)"
          toggle-order="tf"
          toggle-indeterminate
          indeterminate-icon="sym_r_remove"
          checked-icon="sym_r_check"
          unchecked-icon="sym_r_close"
        />
        <ValueLabel :value="modelTFIndet === null ? 'null' : modelTFIndet" />

        <AbyssToggle
          v-model="modelFTIndet"
          label="'ft' + indeterminate (null -> true -> false -> null)"
          toggle-order="ft"
          toggle-indeterminate
          indeterminate-icon="sym_r_remove"
          checked-icon="sym_r_check"
          unchecked-icon="sym_r_close"
        />
        <ValueLabel :value="modelFTIndet === null ? 'null' : modelFTIndet" />
      </MultiExampleWrapper>
    `,
  }),
};

/**
 * Toggle z różnymi ikonami dla każdego stanu.
 */
export const WithIcons: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Możesz określić różne ikony dla stanów zaznaczonego (`checked-icon`) i odznaczonego (`unchecked-icon`). Ikony zmieniają się wraz ze stanem toggle.',
      },
      source: {
        code: `<AbyssToggle
  v-model="darkMode"
  label="Tryb jasny/ciemny"
  checked-icon="sym_r_light_mode"
  unchecked-icon="sym_r_dark_mode"
/>

<AbyssToggle
  v-model="playing"
  label="Odtwarzanie muzyki"
  checked-icon="sym_r_play_arrow"
  unchecked-icon="sym_r_pause"
/>`,
      },
    },
  },
  render: () => ({
    components: { AbyssToggle, StoryWrapper },
    setup() {
      const model1 = ref(false);
      const model2 = ref(true);
      const model3 = ref(false);
      return { model1, model2, model3 };
    },
    template: `
      <StoryWrapper>
        <AbyssToggle
          v-model="model1"
          label="Tryb jasny/ciemny"
          checked-icon="sym_r_light_mode"
          unchecked-icon="sym_r_dark_mode"
        />

        <AbyssToggle
          v-model="model2"
          label="Odtwarzanie muzyki"
          checked-icon="sym_r_play_arrow"
          unchecked-icon="sym_r_pause"
        />

        <AbyssToggle
          v-model="model3"
          label="Mikrofon"
          checked-icon="sym_r_mic"
          unchecked-icon="sym_r_mic_off"
        />
      </StoryWrapper>
    `,
  }),
};

/**
 * Toggle z pojedynczą ikoną dla wszystkich stanów.
 */
export const WithSingleIcon: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Użyj właściwości `icon` aby wyświetlić tę samą ikonę niezależnie od stanu toggle. Ikona pozostaje widoczna zawsze.',
      },
      source: {
        code: `<AbyssToggle
  v-model="notifications"
  label="Powiadomienia"
  icon="sym_r_notifications"
/>`,
      },
    },
  },
  args: {
    modelValue: false,
    label: 'Powiadomienia',
    icon: 'sym_r_notifications',
  },
  render: (args) => ({
    components: { AbyssToggle, StoryWrapper },
    setup() {
      const model = ref(args.modelValue);
      return { args, model };
    },
    template: `
      <StoryWrapper>
        <AbyssToggle v-bind="args" v-model="model" />
      </StoryWrapper>
    `,
  }),
};

/**
 * Pozycja etykiety - po lewej lub prawej stronie.
 */
export const LabelPosition: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Domyślnie etykieta jest wyświetlana po lewej stronie toggle. Użyj `right-label`, aby umieścić ją po prawej.',
      },
      source: {
        code: `<!-- Etykieta po lewej (domyślnie) -->
<AbyssToggle
  v-model="model"
  label="Etykieta po lewej"
/>

<!-- Etykieta po prawej -->
<AbyssToggle
  v-model="model"
  label="Etykieta po prawej"
  right-label
/>`,
      },
    },
  },
  render: () => ({
    components: { AbyssToggle, StoryWrapper },
    setup() {
      const model1 = ref(true);
      const model2 = ref(true);
      return { model1, model2 };
    },
    template: `
      <StoryWrapper>
        <AbyssToggle
          v-model="model1"
          label="Etykieta po lewej"
          icon="sym_r_check"
        />

        <AbyssToggle
          v-model="model2"
          label="Etykieta po prawej"
          right-label
          icon="sym_r_check"
        />
      </StoryWrapper>
    `,
  }),
};

/**
 * Toggle w stanie nieaktywnym (disabled).
 */
export const Disabled: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Stan nieaktywny (`disable`) blokuje interakcję użytkownika z togglem. Komponent otrzymuje wizualne oznaczenie (opacity, shadow-disabled) i nie reaguje na kliknięcia.',
      },
      source: {
        code: `<AbyssToggle
  v-model="model"
  label="Disabled toggle"
  disable
/>`,
      },
    },
  },
  render: () => ({
    components: { AbyssToggle, StoryWrapper },
    setup() {
      const model1 = ref(false);
      const model2 = ref(true);
      const model3 = ref(null);
      return { model1, model2, model3 };
    },
    template: `
      <StoryWrapper>
        <AbyssToggle
          v-model="model1"
          label="Disabled (off)"
          disable
          icon="sym_r_check"
        />

        <AbyssToggle
          v-model="model2"
          label="Disabled (on)"
          disable
          icon="sym_r_check"
        />

        <AbyssToggle
          v-model="model3"
          label="Disabled (indeterminate)"
          disable
          toggle-indeterminate
          indeterminate-icon="sym_r_remove"
        />
      </StoryWrapper>
    `,
  }),
  play: async ({ canvas, userEvent }) => {
    const toggles = canvas.getAllByRole('switch');
    const disabledToggle = toggles[0]!;
    await expect(disabledToggle).toHaveAttribute('aria-disabled', 'true');
    await userEvent.click(disabledToggle);
    await expect(disabledToggle).toHaveAttribute('aria-checked', 'false');
  },
};
