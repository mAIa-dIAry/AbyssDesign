import type { Meta, StoryObj } from '@storybook/vue3';
import { expect } from 'storybook/test';
import { ref } from 'vue';
import {
  DEFAULT_GRADIENT_COLORS,
  useGradient,
} from '@/composables/useGradient';
import AbyssBackground from '@/components/ui/AbyssBackground/AbyssBackground.vue';

const meta = {
  title: 'UI/AbyssBackground',
  component: AbyssBackground,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
Podstawa kolorystyczna dla całej aplikacji - gradient używany wyłącznie jako tło dla półprzezroczystych elementów interfejsu.

**Kiedy używać:**
- ✅ Jako tło głównego layoutu aplikacji
- ✅ Pod półprzezroczystymi kartami, panelami i modales
- ✅ W miejscach wymagających efektu glassmorphism

**Kiedy NIE używać:**
- ❌ Jako tło dla pojedynczych komponentów UI
- ❌ W miejscach wymagających jednolitego koloru
- ❌ Jako warstwa pomiędzy innymi elementami UI
        `,
      },
    },
  },
  argTypes: {
    colors: {
      control: 'object',
      description:
        'Tablica kolorów gradientu (min. 2). Obsługiwane formaty: HSL, HSLA, HEX, RGB, RGBA, named colors. Gradient jest generowany przez composable `useGradient`.',
      table: {
        type: { summary: 'string[]' },
        defaultValue: { summary: JSON.stringify(DEFAULT_GRADIENT_COLORS) },
      },
    },
  },
  decorators: [
    () => ({
      template: '<div class="abyss-bg-decorator-self"><story /></div>',
    }),
  ],
} satisfies Meta<typeof AbyssBackground>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'Domyślny gradient',
  parameters: {
    docs: {
      description: {
        story:
          'Domyślny gradient aplikacji - różowy do turkusowego. Idealny jako tło głównego layoutu aplikacji.',
      },
    },
  },
  args: {
    colors: ['hsl(345, 100%, 72%)', 'hsl(188, 98%, 30%)'],
  },
  play: async ({ canvasElement }) => {
    const bg = canvasElement.querySelector('.abyss-background');
    const currentLayer = canvasElement.querySelector(
      '.abyss-background__layer--current',
    );
    await expect(bg).toBeInTheDocument();
    await expect(currentLayer).toBeInTheDocument();
    await expect(currentLayer).toHaveAttribute('style');
  },
};

export const CustomColors: Story = {
  name: 'Niestandardowe kolory',
  parameters: {
    docs: {
      description: {
        story:
          'Niestandardowe kolory - niebieski do fioletowego. Pokazuje możliwość dostosowania gradientu do konkretnych potrzeb.',
      },
    },
  },
  args: {
    colors: ['hsla(213, 81%, 48%, 1)', 'hsla(289, 81%, 21%, 1)'],
  },
  play: async ({ canvasElement }) => {
    const currentLayer = canvasElement.querySelector(
      '.abyss-background__layer--current',
    );
    await expect(currentLayer).toBeInTheDocument();
    await expect(currentLayer).toHaveStyle({
      backgroundImage:
        'linear-gradient(135deg, rgb(23, 112, 222), rgb(81, 10, 97))',
    });
  },
};

export const WarmGradient: Story = {
  name: 'Ciepły gradient',
  parameters: {
    docs: {
      description: {
        story:
          'Ciepły gradient - czerwień do pomarańczy. Użyj dla energetycznych, ciepłych interfejsów.',
      },
    },
  },
  args: {
    colors: ['hsl(30, 100%, 50%)', 'hsl(0, 100%, 60%)'],
  },
};

export const CoolGradient: Story = {
  name: 'Chłodny gradient',
  parameters: {
    docs: {
      description: {
        story:
          'Chłodny gradient - błękit do fioletu. Idealny dla spokojnych, relaksujących interfejsów.',
      },
    },
  },
  args: {
    colors: ['hsl(200, 100%, 50%)', 'hsl(260, 80%, 60%)'],
  },
};

export const MonochromeSoft: Story = {
  name: 'Monochromatyczny',
  parameters: {
    docs: {
      description: {
        story:
          'Monochromatyczny gradient - jasny do ciemnego szarego. Subtelny, profesjonalny wygląd bez rozpraszających kolorów.',
      },
    },
  },
  args: {
    colors: ['hsl(220, 10%, 85%)', 'hsl(220, 10%, 40%)'],
  },
};

export const WithGradientState: Story = {
  name: 'Stan composable (debug)',
  parameters: {
    docs: {
      description: {
        story:
          'Demonstracja stanu composable `useGradient`. Panel debugowania pokazuje reaktywny `snapshot` zwracany przez hook — kolory i wygenerowany string CSS gradientu.',
      },
    },
  },
  args: {
    colors: [
      'hsla(213, 81%, 48%, 1)',
      'hsla(289, 81%, 21%, 1)',
      'hsla(320, 70%, 35%, 1)',
    ],
  },
  render: (args) => ({
    components: { AbyssBackground },
    setup() {
      const { snapshot, setColors } = useGradient(args.colors);
      return { args, snapshot, setColors };
    },
    template: `
      <AbyssBackground v-bind="args" style="position: relative;">
        <div style="
          position: absolute;
          bottom: 12px;
          left: 12px;
          right: 12px;
          background: rgba(0, 0, 0, 0.55);
          backdrop-filter: blur(8px);
          border-radius: 10px;
          padding: 12px 16px;
          border: 1px solid rgba(255,255,255,0.15);
          font-family: monospace;
          font-size: 12px;
          color: #e0e0e0;
        ">
          <div style="margin-bottom: 6px; font-weight: bold; color: #aaa;">useGradient — snapshot</div>
          <div><span style="color:#79c0ff">colors:</span> {{ snapshot.colors }}</div>
          <div style="margin-top:4px"><span style="color:#79c0ff">gradientCss:</span> {{ snapshot.gradientCss }}</div>
        </div>
      </AbyssBackground>
    `,
  }),
};

export const WithGlassContent: Story = {
  name: 'Z efektem glassmorphism',
  parameters: {
    docs: {
      description: {
        story:
          'Przykład z półprzezroczystą zawartością demonstrujący efekt glassmorphism. Pokazuje zamierzone użycie komponentu jako tła.',
      },
      source: {
        code: `<AbyssBackground>
  <div class="glass-panel">
    <h3>Panel przykładowy</h3>
    <p>To jest przykład półprzezroczystego panelu na tle AbyssBackground.</p>
  </div>
</AbyssBackground>`,
      },
    },
  },
  args: {},
  render: (args) => ({
    components: { AbyssBackground },
    setup() {
      return { args };
    },
    template: `
      <AbyssBackground v-bind="args" style="position: relative;">
        <div style="
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(10px);
          border-radius: 16px;
          padding: 32px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        ">
          <h3 style="margin: 0 0 16px 0; color: white; font-size: 24px;">
            Panel przykładowy
          </h3>
          <p style="margin: 0; color: rgba(255, 255, 255, 0.9);">
            To jest przykład półprzezroczystego panelu na tle AbyssBackground.
          </p>
        </div>
      </AbyssBackground>
    `,
  }),
};

export const ColorsWatch: Story = {
  name: 'Reaktywna zmiana kolorów (setColors)',
  parameters: {
    docs: {
      description: {
        story:
          'Weryfikacja reaktywności – zmiana prop `colors` aktualizuje gradient przez `setColors` w watchu.',
      },
    },
  },
  render: () => ({
    components: { AbyssBackground },
    setup() {
      const colors = ref(['hsl(345, 100%, 72%)', 'hsl(188, 98%, 30%)']);
      function changeColors() {
        colors.value = ['hsl(200, 100%, 50%)', 'hsl(260, 80%, 60%)'];
      }
      return { colors, changeColors };
    },
    template: `
      <div>
        <button data-testid="change-colors" @click="changeColors" style="margin-bottom:8px;">Zmień kolory</button>
        <AbyssBackground :colors="colors" style="width:200px;height:100px;" />
      </div>
    `,
  }),
  play: async ({ canvasElement, userEvent }) => {
    const bg = canvasElement.querySelector('.abyss-background') as HTMLElement;
    const currentLayerSelector = '.abyss-background__layer--current';
    const btn = canvasElement.querySelector(
      '[data-testid="change-colors"]',
    ) as HTMLElement;
    const styleBefore = canvasElement
      .querySelector(currentLayerSelector)
      ?.getAttribute('style');
    await userEvent.click(btn);
    await new Promise((r) => setTimeout(r, 50));
    const styleAfter = canvasElement
      .querySelector(currentLayerSelector)
      ?.getAttribute('style');

    await expect(styleAfter).not.toBe(styleBefore);
    await expect(
      bg.querySelector('.abyss-background__layer--fading'),
    ).toBeInTheDocument();
  },
};
