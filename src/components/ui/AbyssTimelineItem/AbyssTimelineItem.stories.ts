import type { Meta, StoryObj } from '@storybook/vue3';
import { expect } from 'storybook/test';
import AbyssTimelineItem from '@/components/ui/AbyssTimelineItem/AbyssTimelineItem.vue';
import { withAbyssBackground } from '@/stories/AbyssBackgroundDecorator';

const meta: Meta<typeof AbyssTimelineItem> = {
  title: 'UI/AbyssTimelineItem',
  component: AbyssTimelineItem,
  tags: ['autodocs'],
  decorators: [withAbyssBackground],
  parameters: {
    docs: {
      description: {
        component:
          'Komponent elementu osi czasu (AbyssTimelineItem) służy do wyświetlania wpisów dziennika lub innych zdarzeń ' +
          'na osi czasu. Dostępne są trzy warianty: datetime (wpis z datą i ikoną notatki), ' +
          'entry-time (wpis wyłącznie z godziną i kropką) oraz header (nagłówek miesiąca). ' +
          'Data i czas przyjmowane są jako obiekt JavaScript Date.',
      },
    },
  },
  argTypes: {
    variant: {
      control: 'radio',
      options: ['datetime', 'time', 'header'],
      description: 'Wariant elementu osi czasu',
      table: {
        defaultValue: { summary: 'time' },
        type: { summary: "'datetime' | 'time' | 'header'" },
      },
    },
    datetime: {
      control: 'date',
      description:
        'Obiekt Date – data wyświetlana w wariancie datetime, godzina w wariantach datetime i entry-time',
      table: {
        type: { summary: 'Date' },
      },
    },
    label: {
      control: 'text',
      description:
        'Etykieta nagłówka, np. nazwa miesiąca (tylko wariant header)',
      table: {
        type: { summary: 'string' },
      },
    },
    stick: {
      control: 'radio',
      options: ['top', 'bottom', 'both'],
      description:
        'Grupowanie wpisów z tego samego dnia. ' +
        'Usuwa padding i zeruje border-radius po stronie łączenia oraz wyrównuje cień na krawędzi styku. ' +
        'bottom – pierwszy wpis grupy, both – środkowy, top – ostatni.',
      table: {
        type: { summary: "'top' | 'bottom' | 'both'" },
      },
    },
    icon: {
      control: 'text',
      description:
        'Własna ikona Material Symbols zastępująca domyślną. ' +
        'Dla header domyślnie sym_r_calendar_month, dla datetime sym_r_note_stack.',
      table: {
        type: { summary: 'string' },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof AbyssTimelineItem>;

export const Datetime: Story = {
  name: 'Wpis z datą i godziną',
  render: () => ({
    components: { AbyssTimelineItem },
    setup() {
      const dt = new Date(2024, 2, 29, 21, 32);
      return { dt };
    },
    template: `
      <AbyssTimelineItem variant="datetime" :datetime="dt">
        Dziś poczułem silny lęk przed rozmową z szefem. Oddychałem głęboko, co pomogło.
        Uświadomiłem sobie, że boję się odrzucenia. Jutro spróbuję przygotować się wcześniej.
      </AbyssTimelineItem>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Wariant datetime wyświetla datę i godzinę z obiektu Date po lewej stronie oraz ikonę notatki w centrum.',
      },
      source: {
        code: `
<script setup lang="ts">
const dt = new Date(2024, 2, 29, 21, 32);
</script>

<template>
  <AbyssTimelineItem variant="datetime" :datetime="dt">
    Dziś poczułem silny lęk przed rozmową z szefem. Oddychałem głęboko, co pomogło.
    Uświadomiłem sobie, że boję się odrzucenia. Jutro spróbuję przygotować się wcześniej.
  </AbyssTimelineItem>
</template>`,
      },
    },
  },
  play: async ({ canvas }) => {
    const date = canvas.getByText(/29\.03\.2024/);
    await expect(date).toBeVisible();
  },
};

export const Time: Story = {
  name: 'Wpis z godziną',
  render: () => ({
    components: { AbyssTimelineItem },
    setup() {
      const dt = new Date(2024, 2, 29, 21, 32);
      return { dt };
    },
    template: `
      <AbyssTimelineItem variant="time" :datetime="dt">
        Jestem wdzięczny za spacer z psem – świeże powietrze oczyściło umysł.
        Zapomniałem o stresie z pracy. To małe rzeczy budują spokój.
      </AbyssTimelineItem>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Wariant time wyświetla tylko godzinę z obiektu Date po lewej stronie i okrągłą kropkę w centrum.',
      },
      source: {
        code: `
<script setup lang="ts">
const dt = new Date(2024, 2, 29, 21, 32);
</script>

<template>
  <AbyssTimelineItem variant="time" :datetime="dt">
    Jestem wdzięczny za spacer z psem – świeże powietrze oczyściło umysł.
    Zapomniałem o stresie z pracy. To małe rzeczy budują spokój.
  </AbyssTimelineItem>
</template>`,
      },
    },
  },
  play: async ({ canvas }) => {
    const time = canvas.getByText(/21:32/);
    await expect(time).toBeVisible();
  },
};

export const Header: Story = {
  name: 'Nagłówek',
  args: {
    variant: 'header',
    label: 'Kwiecień',
  },
  render: (args) => ({
    components: { AbyssTimelineItem },
    setup() {
      return { args };
    },
    template: `<AbyssTimelineItem v-bind="args" />`,
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Wariant header służy jako nagłówek miesiąca lub inny separator na osi czasu. ' +
          'Wyświetla ikonę kalendarza i etykietę.',
      },
      source: {
        code: `
<template>
  <AbyssTimelineItem variant="header" label="Kwiecień" />
</template>`,
      },
    },
  },
  play: async ({ canvas }) => {
    const label = canvas.getByText('Kwiecień');
    await expect(label).toBeVisible();
  },
};

export const CustomIcon: Story = {
  name: 'Własna ikona',
  render: () => ({
    components: { AbyssTimelineItem },
    setup() {
      const dt1 = new Date(2026, 2, 4, 7, 30);
      const dt2 = new Date(2026, 2, 4, 21, 0);
      const dt3 = new Date(2026, 2, 4, 12, 0);
      return { dt1, dt2, dt3 };
    },
    template: `
      <div style="display: flex; flex-direction: column; width: 100%; max-width: 560px;">
        <AbyssTimelineItem variant="header" label="Trening" icon="sym_r_fitness_center" />
        <AbyssTimelineItem variant="datetime" :datetime="dt1" icon="sym_r_psychiatry">
          Poranny trening siłowy – 45 minut. Czuję się naenergetyzowany na cały dzień.
        </AbyssTimelineItem>
        <AbyssTimelineItem variant="time" :datetime="dt3">
          Zwykły wpis bez ikony – używa domyślnej kropki.
        </AbyssTimelineItem>
        <AbyssTimelineItem variant="header" label="Medytacja" icon="sym_r_self_improvement" />
        <AbyssTimelineItem variant="datetime" :datetime="dt2" icon="sym_r_bedtime">
          Wieczorna sesja medytacji – 20 minut. Spokój i wyciszenie przed snem.
        </AbyssTimelineItem>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Prop `icon` pozwala podmienić domyślną ikonę w wariantach `header` i `datetime`. ' +
          'Przyjmuje nazwę ikony Material Symbols (np. `sym_r_fitness_center`). ' +
          'Jeśli nie podany, używane są wartości domyślne: `sym_r_calendar_month` dla header ' +
          'i `sym_r_note_stack` dla datetime.',
      },
      source: {
        code: `
<script setup lang="ts">
const dt = new Date(2026, 2, 4, 7, 30);
</script>

<template>
  <AbyssTimelineItem variant="header" label="Trening" icon="sym_r_fitness_center" />
  <AbyssTimelineItem variant="datetime" :datetime="dt" icon="sym_r_psychiatry">
    Poranny trening siłowy – 45 minut.
  </AbyssTimelineItem>
</template>`,
      },
    },
  },
};

export const StickGrouping: Story = {
  name: 'Grupowanie wpisów (stick)',
  render: () => ({
    components: { AbyssTimelineItem },
    setup() {
      const d1 = new Date(2024, 2, 29, 8, 0);
      const d2 = new Date(2024, 2, 29, 9, 0);
      const d3 = new Date(2024, 2, 29, 9, 45);
      const d4 = new Date(2024, 2, 29, 10, 0);
      const d5 = new Date(2024, 2, 29, 10, 30);
      const d6 = new Date(2024, 2, 29, 11, 15);
      return { d1, d2, d3, d4, d5, d6 };
    },
    template: `
      <div style="display: flex; flex-direction: column; width: 100%; max-width: 560px; gap: 24px;">

        <div>
          <p style="color: rgba(255,255,255,0.4); font-size: 12px; margin: 0 0 4px 102px;">
            Jeden wpis – brak stick
          </p>
          <AbyssTimelineItem variant="datetime" :datetime="d1">
            Pojedynczy wpis danego dnia.
          </AbyssTimelineItem>
        </div>

        <div>
          <p style="color: rgba(255,255,255,0.4); font-size: 12px; margin: 0 0 4px 102px;">
            Dwa wpisy → stick="bottom" + stick="top"
          </p>
          <AbyssTimelineItem variant="datetime" :datetime="d2" stick="bottom">
            Pierwszy wpis dnia – przyklejony od dołu.
          </AbyssTimelineItem>
          <AbyssTimelineItem variant="time" :datetime="d3" stick="top">
            Drugi wpis dnia – przyklejony od góry.
          </AbyssTimelineItem>
        </div>

        <div>
          <p style="color: rgba(255,255,255,0.4); font-size: 12px; margin: 0 0 4px 102px;">
            Trzy wpisy → bottom + both + top
          </p>
          <AbyssTimelineItem variant="datetime" :datetime="d4" stick="bottom">
            Pierwszy wpis dnia – przyklejony od dołu.
          </AbyssTimelineItem>
          <AbyssTimelineItem variant="time" :datetime="d5" stick="both">
            Środkowy wpis dnia – przyklejony z obu stron.
          </AbyssTimelineItem>
          <AbyssTimelineItem variant="time" :datetime="d6" stick="top">
            Ostatni wpis dnia – przyklejony od góry.
          </AbyssTimelineItem>
        </div>

      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Prop `stick` służy do wizualnego grupowania wpisów z tego samego dnia w jeden blok. ' +
          'Usuwa padding i zeruje radius po stronie łączenia oraz wyrównuje cień na granicy styku.\n\n' +
          '- `stick="bottom"` – **pierwszy** wpis grupy (przyklejony od dołu)\n' +
          '- `stick="both"` – **środkowy** wpis grupy (przyklejony z obu stron)\n' +
          '- `stick="top"` – **ostatni** wpis grupy (przyklejony od góry)',
      },
      source: {
        code: `
<script setup lang="ts">
const d1 = new Date(2024, 2, 29, 9, 0);
const d2 = new Date(2024, 2, 29, 9, 45);
const d3 = new Date(2024, 2, 29, 10, 30);
</script>

<template>
  <!-- Dwa wpisy tego samego dnia -->
  <AbyssTimelineItem variant="datetime" :datetime="d1" stick="bottom">
    Pierwszy wpis dnia – przyklejony od dołu.
  </AbyssTimelineItem>
  <AbyssTimelineItem variant="time" :datetime="d2" stick="top">
    Drugi wpis dnia – przyklejony od góry.
  </AbyssTimelineItem>

  <!-- Trzy wpisy: bottom + both + top -->
  <AbyssTimelineItem variant="datetime" :datetime="d1" stick="bottom">
    Pierwszy wpis dnia.
  </AbyssTimelineItem>
  <AbyssTimelineItem variant="time" :datetime="d2" stick="both">
    Środkowy wpis dnia.
  </AbyssTimelineItem>
  <AbyssTimelineItem variant="time" :datetime="d3" stick="top">
    Ostatni wpis dnia.
  </AbyssTimelineItem>
</template>`,
      },
    },
  },
};

export const AllVariants: Story = {
  name: 'Wszystkie warianty',
  render: () => ({
    components: { AbyssTimelineItem },
    setup() {
      return {
        d1: new Date(2024, 2, 29, 21, 32),
        d2: new Date(2024, 2, 29, 21, 45),
        d3: new Date(2024, 2, 29, 22, 10),
        d4: new Date(2024, 3, 1, 8, 15),
        d5: new Date(2024, 3, 1, 20, 45),
      };
    },
    template: `
      <div style="display: flex; flex-direction: column; width: 100%; max-width: 560px;">
        <AbyssTimelineItem variant="header" label="Marzec" />
        <AbyssTimelineItem variant="datetime" :datetime="d1" stick="bottom">
          Dziś poczułem silny lęk przed rozmową z szefem. Oddychałem głęboko, co pomogło.
          Uświadomiłem sobie, że boję się odrzucenia. Jutro spróbuję przygotować się wcześniej.
        </AbyssTimelineItem>
        <AbyssTimelineItem variant="time" :datetime="d2" stick="both">
          Jestem wdzięczny za spacer z psem – świeże powietrze oczyściło umysł.
          Zapomniałem o stresie z pracy. To małe rzeczy budują spokój.
        </AbyssTimelineItem>
        <AbyssTimelineItem variant="time" :datetime="d3" stick="top">
          Wkurzyłem się na kolegę za opóźnienie. Zamiast krzyczeć, wyszedłem na chwilę.
          Teraz widzę, że to nie celowe. Pracuję nad cierpliwością.
        </AbyssTimelineItem>
        <AbyssTimelineItem variant="header" label="Kwiecień" />
        <AbyssTimelineItem variant="datetime" :datetime="d4" stick="bottom">
          Odkładałem pisanie raportu cały dzień. W końcu usiadłem na 5 minut – skończyłem.
          Czuję dumę z małego kroku. To działa!
        </AbyssTimelineItem>
        <AbyssTimelineItem variant="time" :datetime="d5" stick="top">
          Kłótnia z partnerem boli, ale wyraziłem swoje uczucia spokojnie.
          Słuchaliśmy się nawzajem. Relacja się wzmacnia. Uczę się komunikacji.
        </AbyssTimelineItem>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Wszystkie trzy warianty na osi czasu – odwzorowanie typowego widoku dziennika.',
      },
      source: {
        code: `
<script setup lang="ts">
const d1 = new Date(2024, 2, 29, 21, 32);
const d2 = new Date(2024, 2, 29, 21, 45);
const d3 = new Date(2024, 2, 29, 22, 10);
const d4 = new Date(2024, 3, 1, 8, 15);
const d5 = new Date(2024, 3, 1, 20, 45);
</script>

<template>
  <AbyssTimelineItem variant="header" label="Marzec" />
  <AbyssTimelineItem variant="datetime" :datetime="d1" stick="bottom">
    Dziś poczułem silny lęk przed rozmową z szefem...
  </AbyssTimelineItem>
  <AbyssTimelineItem variant="time" :datetime="d2" stick="both">
    Jestem wdzięczny za spacer z psem...
  </AbyssTimelineItem>
  <AbyssTimelineItem variant="time" :datetime="d3" stick="top">
    Wkurzyłem się na kolegę za opóźnienie...
  </AbyssTimelineItem>
  <AbyssTimelineItem variant="header" label="Kwiecień" />
  <AbyssTimelineItem variant="datetime" :datetime="d4" stick="bottom">
    Odkładałem pisanie raportu cały dzień...
  </AbyssTimelineItem>
  <AbyssTimelineItem variant="time" :datetime="d5" stick="top">
    Kłótnia z partnerem boli...
  </AbyssTimelineItem>
</template>`,
      },
    },
  },
};

export const NoDatetime: Story = {
  name: 'Bez daty (formattedDate/formattedTime = "")',
  parameters: {
    docs: {
      description: {
        story:
          'Warianty datetime i time bez przekazanej daty – `formattedDate` i `formattedTime` zwracają pusty string.',
      },
    },
  },
  render: () => ({
    components: { AbyssTimelineItem },
    template: `
      <div style="display: flex; flex-direction: column; width: 100%; max-width: 560px;">
        <AbyssTimelineItem variant="datetime">Wpis bez daty</AbyssTimelineItem>
        <AbyssTimelineItem variant="time">Wpis bez godziny</AbyssTimelineItem>
      </div>
    `,
  }),
  play: async ({ canvasElement }) => {
    const items = canvasElement.querySelectorAll('.abyss-timeline-item');
    await expect(items.length).toBeGreaterThan(0);
  },
};
