import type { Meta, StoryObj } from '@storybook/vue3';
import { ref } from 'vue';
import { expect, fn, waitFor } from 'storybook/test';
import AbyssButton from '@/components/ui/AbyssButton/AbyssButton.vue';
import AbyssButtonGroup from '@/components/ui/AbyssButtonGroup/AbyssButtonGroup.vue';
import AbyssNotify from '@/components/ui/AbyssNotify/AbyssNotify.vue';
import {
  createNotifyDemoQueue,
} from '@/components/ui/AbyssNotify/AbyssNotify.demo';
import { withAbyssBackground } from '@/stories/AbyssBackgroundDecorator';

const meta: Meta<typeof AbyssNotify> = {
  title: 'UI/AbyssNotify',
  component: AbyssNotify,
  tags: ['autodocs'],
  decorators: [withAbyssBackground],
  parameters: {
    docs: {
      description: {
        component:
          'Toast AbyssNotify służy do **efemerycznego feedbacku po akcji użytkownika** (zapis, błąd API, usunięcie). ' +
          'Strony wołają helper kolejki `notify()` w aplikacji. Host kolejki to `AbyssNotifyHost` w slocie `#overlay` `AbyssTemplateRoot` — nie montuj `AbyssNotify` ani `Teleport` ze strony. ' +
          'Nie zastępuje `AbyssInfo` — ten zostaje przy **statycznych** komunikatach w układzie strony. ' +
          'Typy (`info`, `warning`, `danger`, `success`, `hint`) używają tych samych semantycznych gradientów co `AbyssInfo`. ' +
          'Lewa ikona i treść leżą na zaokrąglonym overlayu `rgba(black, 0.5)` odsuniętym 1px od krawędzi toasta; tekst i obie ikony są zawsze białe. ' +
          'X to prostokąt 40×46px poza overlayem, na gradiencie (ripple od press). ' +
          '`description` jest opcjonalny i **domyślnie zwinięty**; przy niepustym opisie po prawej tytułu jest chevron. Kliknięcie paska tytułu (ripple od press) otwiera akordeon (0,2 s) na opisie i na tytule — od jednego wiersza z ellipsisem do pełnego zawinięcia, ze stałym odstępem pierwszego wiersza od góry. ' +
          'Opcjonalny `count` (od 2 wzwyż) pokazuje badge z liczbą powtórzeń tego samego toasta, na prawo od tytułu, przed chevronem. Przy zmianie liczby badge puszcza rozszerzający się, zanikający ripple (0,4 s). ' +
          'Opcjonalny `autoClose` (ms) sam zamyka toast; wokół przycisku X biegnie circular progress. Hover i `:focus-within` wstrzymują timer i ściszają pierścień do opacity 0,5. Zmiana `count` resetuje timer. ' +
          'W `AbyssTemplateRoot` montuj `AbyssNotifyHost` w slocie `#overlay`. Host overlay ma `padding: 12px 8px` i `max-height: 100%`; `overflow: auto` to przełącznik po 0,2 s ciszy — dodawanie nie zdejmuje `auto` od razu. Poza szablonem `AbyssNotifyHost` z `standalone` (klasa `abyss-notify-queue`). ' +
          'Wejście (z góry) i zejście (w dół) trwają **0,2 s**. Slot (toast + 8px odstęp jako `::after`) zwija wysokość, `overflow: visible` — toast wystaje ze slotu. Ostatni toast przy zejściu **nie zwija wysokości** — tylko `translateY` i opacity. Padding hosta (`12px 8px`) mieści `translateY`. Widoczność kontroluj `v-model` (`modelValue` domyślnie `true`); nowo zamontowany toast też wchodzi z `appear`. ' +
          'W kolejce nie zdejmuj instancji z `v-for` w `@close` — zostaw ją do `@after-leave`.\n\n' +
          '> Nie używaj `AbyssInfo` z `v-if` / `v-show` do wyniku operacji. Szczegóły: ' +
          '[`docs/architecture/abyss-design.md`](../../../docs/architecture/abyss-design.md#feedback-po-akcjach-użytkownika).',
      },
    },
  },
  argTypes: {
    type: {
      control: 'select',
      options: ['info', 'warning', 'danger', 'success', 'hint'],
      description: 'Typ toasta — semantyczny gradient tła i domyślna ikona',
      table: {
        defaultValue: { summary: 'info' },
        type: {
          summary: "'info' | 'warning' | 'danger' | 'success' | 'hint'",
        },
      },
    },
    message: {
      control: 'text',
      description:
        'Tytuł toasta. Zwinięty: jeden wiersz z ellipsisem. Przy `description` wysokość tytułu animuje się akordeonem do pełnego zawinięcia',
      table: { defaultValue: { summary: '""' } },
    },
    description: {
      control: 'text',
      description:
        'Opcjonalny opis. Domyślnie zwinięty; pusta wartość nie pokazuje chevronu ani akordeonu. Kliknięcie paska tytułu (ripple od press) otwiera akordeon opisu i tytułu',
      table: { defaultValue: { summary: '""' } },
    },
    count: {
      control: 'number',
      description:
        'Ile razy pojawiło się to samo powiadomienie. Badge od `2` wzwyż, na prawo od tytułu, przed chevronem. Przy zmianie liczby puszcza rozszerzający się, zanikający ripple (0,4 s)',
      table: { defaultValue: { summary: 'undefined' } },
    },
    icon: {
      control: 'text',
      description:
        'Ikona Material Symbols. Pusta wartość używa ikony domyślnej dla `type` (jak w AbyssInfo)',
      table: { defaultValue: { summary: '""' } },
    },
    closeable: {
      control: 'boolean',
      description: 'Pokazuje przycisk zamknięcia (X)',
      table: { defaultValue: { summary: 'true' } },
    },
    closeLabel: {
      control: 'text',
      description: 'Etykieta dostępności przycisku zamknięcia',
      table: { defaultValue: { summary: '"Zamknij"' } },
    },
    autoClose: {
      control: 'number',
      description:
        'Czas w milisekundach do automatycznego zamknięcia. Pusta / `0` wyłącza timer. Wokół X widać circular progress; hover i `:focus-within` wstrzymują odliczanie, zmiana `count` resetuje je',
      table: {
        defaultValue: { summary: 'undefined' },
        type: { summary: 'number' },
      },
    },
    modelValue: {
      control: 'boolean',
      description:
        'Widoczność toasta (`v-model`). Domyślnie `true` — toast jest widoczny bez `v-model`. `false` ukrywa z animacją 0,2 s',
      table: {
        defaultValue: { summary: 'true' },
        type: { summary: 'boolean' },
      },
    },
    class: {
      control: 'text',
      description:
        'Dodatkowe klasy CSS na korzeniu toasta. Dozwolone przy budowie komponentu złożonego (np. host overlay); niedozwolone w wzorcach formularzy i standardowych kart',
      table: { defaultValue: { summary: '""' } },
    },
    style: {
      control: 'object',
      description:
        'Style inline na korzeniu toasta. Dozwolone przy budowie komponentu złożonego; niedozwolone w wzorcach formularzy i standardowych kart',
      table: { defaultValue: { summary: '""' } },
    },
  },
  args: {
    modelValue: true,
    onClose: fn(),
    'onUpdate:modelValue': fn(),
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'Domyślny',
  parameters: {
    docs: {
      description: {
        story:
          'Toast sukcesu po zapisie — podstawowy podgląd wyglądu do dalszego stylowania w Storybooku.',
      },
      source: {
        code: `<AbyssNotify type="success" message="Notatka została zapisana." />`,
      },
    },
  },
  args: {
    type: 'success',
    message: 'Notatka została zapisana.',
  },
  render: (args) => ({
    components: { AbyssNotify },
    setup() {
      return { args };
    },
    template: `<AbyssNotify v-bind="args" />`,
  }),
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Notatka została zapisana.')).toBeVisible();
    await expect(canvas.getByRole('button', { name: 'Zamknij' })).toBeVisible();
  },
};

export const Interactive: Story = {
  name: 'Zamykanie',
  parameters: {
    docs: {
      description: {
        story:
          'Toast pojawia się po akcji i znika po kliknięciu X. Widoczność steruje `v-model`. `description` jest opcjonalny i startuje zwinięty.',
      },
      source: {
        code: `<script setup>
import { ref } from 'vue';

const visible = ref(false);
</script>

<template>
  <AbyssButton label="Zapisz" @click="visible = true" />
  <AbyssNotify
    v-model="visible"
    type="warning"
    message="Synchronizacja nie jest dostępna bez logowania."
    description="Zaloguj się, aby wysłać zmiany do chmury."
  />
</template>`,
      },
    },
  },
  args: {
    type: 'warning',
    message: 'Synchronizacja nie jest dostępna bez logowania.',
    description: 'Zaloguj się, aby wysłać zmiany do chmury.',
    modelValue: false,
  },
  render: (args) => ({
    components: { AbyssNotify, AbyssButton },
    setup() {
      const visible = ref(false);
      return { args, visible };
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px; align-items: flex-start;">
        <AbyssButton
          label="Pokaż powiadomienie"
          @click="visible = true"
        />
        <AbyssNotify v-bind="args" v-model="visible" />
      </div>
    `,
  }),
  play: async ({ canvas, userEvent }) => {
    await expect(
      canvas.queryByText('Synchronizacja nie jest dostępna bez logowania.'),
    ).toBeNull();

    await userEvent.click(
      canvas.getByRole('button', { name: 'Pokaż powiadomienie' }),
    );

    await expect(
      canvas.getByText('Synchronizacja nie jest dostępna bez logowania.'),
    ).toBeVisible();
    await expect(
      canvas.getByText('Zaloguj się, aby wysłać zmiany do chmury.'),
    ).not.toBeVisible();
    await expect(
      canvas.getByRole('button', {
        name: 'Synchronizacja nie jest dostępna bez logowania.',
      }),
    ).toHaveAttribute('aria-expanded', 'false');

    await userEvent.click(canvas.getByRole('button', { name: 'Zamknij' }));

    await waitFor(() => {
      expect(
        canvas.queryByText('Synchronizacja nie jest dostępna bez logowania.'),
      ).toBeNull();
    });
  },
};

export const Types: Story = {
  name: 'Typy',
  parameters: {
    docs: {
      description: {
        story:
          'Wszystkie typy semantyczne obok siebie — do porównania gradientu; overlay, biały tekst i białe ikony są stałe.',
      },
      source: {
        code: `<AbyssNotify type="info" message="Sesja wygaśnie za 5 minut." />
<AbyssNotify type="warning" message="Synchronizacja wymaga logowania." />
<AbyssNotify type="danger" message="Nie udało się usunąć zadania." />
<AbyssNotify type="success" message="Notatka została zapisana." />
<AbyssNotify type="hint" message="Możesz przypiąć notatkę do pulpitu." />`,
      },
    },
  },
  render: () => ({
    components: { AbyssNotify },
    setup() {
      const items = [
        { type: 'info', message: 'Sesja wygaśnie za 5 minut.' },
        { type: 'warning', message: 'Synchronizacja wymaga logowania.' },
        { type: 'danger', message: 'Nie udało się usunąć zadania.' },
        { type: 'success', message: 'Notatka została zapisana.' },
        { type: 'hint', message: 'Możesz przypiąć notatkę do pulpitu.' },
      ] as const;
      return { items };
    },
    template: `
      <div style="display: flex; flex-direction: column;">
        <AbyssNotify
          v-for="item in items"
          :key="item.type"
          :type="item.type"
          :message="item.message"
        />
      </div>
    `,
  }),
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Sesja wygaśnie za 5 minut.')).toBeVisible();
    await expect(
      canvas.getByText('Synchronizacja wymaga logowania.'),
    ).toBeVisible();
    await expect(
      canvas.getByText('Nie udało się usunąć zadania.'),
    ).toBeVisible();
  },
};

const longTitle =
  'Nie udało się zsynchronizować wszystkich zmian z chmurą, ponieważ połączenie sieciowe zostało przerwane w trakcie wysyłania notatek i załączników.';

const longDescription =
  'Spróbuj ponownie po odzyskaniu połączenia. Niezsynchronizowane notatki pozostaną na tym urządzeniu do czasu kolejnej udanej synchronizacji.';

export const LongTitle: Story = {
  name: 'Długi tytuł',
  parameters: {
    docs: {
      description: {
        story:
          'Tytuł dłuższy niż szerokość toasta jest obcinany ellipsisem, z chevronem po prawej. Po rozwinięciu wysokość tytułu i opisu animuje się akordeonem (0,2 s); tytuł się zawija, a pierwszy wiersz zostaje na tej samej wysokości.',
      },
      source: {
        code: `<AbyssNotify
  type="danger"
  message="${longTitle}"
  description="${longDescription}"
/>`,
      },
    },
  },
  args: {
    type: 'danger',
    message: longTitle,
    description: longDescription,
  },
  render: (args) => ({
    components: { AbyssNotify },
    setup() {
      return { args };
    },
    template: `<AbyssNotify v-bind="args" />`,
  }),
  play: async ({ canvas, userEvent }) => {
    await expect(canvas.getByText(longTitle)).toBeVisible();
    await expect(canvas.getByText(longDescription)).not.toBeVisible();

    await userEvent.click(canvas.getByRole('button', { name: longTitle }));

    await expect(canvas.getByText(longDescription)).toBeVisible();
    await expect(canvas.getByRole('button', { name: longTitle })).toHaveAttribute(
      'aria-expanded',
      'true',
    );

    await userEvent.click(canvas.getByRole('button', { name: longTitle }));
    await expect(canvas.getByText(longDescription)).not.toBeVisible();
  },
};

export const Count: Story = {
  name: 'Licznik powtórzeń',
  parameters: {
    docs: {
      description: {
        story:
          'Gdy to samo powiadomienie pojawia się wielokrotnie, `count` pokazuje badge z liczbą (od 2) na prawo od tytułu, przed chevronem. Zmiana liczby odpala rozszerzający się, zanikający ripple (0,4 s).',
      },
      source: {
        code: `<AbyssNotify
  type="danger"
  message="Nie udało się zsynchronizować zmian."
  description="Kolejka pozostanie na urządzeniu do udanej synchronizacji."
  :count="3"
/>`,
      },
    },
  },
  args: {
    type: 'danger',
    message: 'Nie udało się zsynchronizować zmian.',
    description:
      'Kolejka pozostanie na urządzeniu do udanej synchronizacji.',
    count: 3,
  },
  render: (args) => ({
    components: { AbyssNotify },
    setup() {
      return { args };
    },
    template: `<AbyssNotify v-bind="args" />`,
  }),
  play: async ({ canvas }) => {
    await expect(
      canvas.getByText('Nie udało się zsynchronizować zmian.'),
    ).toBeVisible();
    await expect(canvas.getByText('3')).toBeVisible();
    await expect(
      canvas.getByText('Kolejka pozostanie na urządzeniu do udanej synchronizacji.'),
    ).not.toBeVisible();
  },
};

export const AutoClose: Story = {
  name: 'Auto-close',
  parameters: {
    docs: {
      description: {
        story:
          'Przyciski dokładają toasty do kolejki (`abyss-notify-queue` — ograniczona wysokość i scrollbar). Każdy ma `autoClose` (ms) — sam znika, a wokół X ubywa circular progress. Hover i focus wstrzymują timer. Ten sam szablon pod rząd podbija `count` i resetuje timer. Instancję zdejmuj w `@after-leave`.',
      },
      source: {
        code: `<AbyssNotify
  v-for="item in queue"
  :key="item.instanceId"
  v-model="item.visible"
  :type="item.type"
  :message="item.message"
  :count="item.count"
  :auto-close="4000"
  @after-leave="remove(item.instanceId)"
/>`,
      },
    },
  },
  args: {
    autoClose: 4000,
  },
  render: (args) => ({
    components: { AbyssNotify, AbyssButton, AbyssButtonGroup },
    setup() {
      const { templates, queue, enqueue, remove } = createNotifyDemoQueue();

      return {
        templates,
        queue,
        enqueue,
        remove,
        autoClose: args.autoClose,
      };
    },
    template: `
      <div style="display: flex; gap: 16px; align-items: flex-start; width: min(100%, 720px);">
        <div style="flex: 0 0 180px;">
          <AbyssButtonGroup vertical>
            <AbyssButton
              v-for="template in templates"
              :key="template.id"
              :label="template.label"
              @click="enqueue(template)"
            />
          </AbyssButtonGroup>
        </div>
        <div class="abyss-notify-queue" style="flex: 1; min-width: 0;">
          <AbyssNotify
            v-for="item in queue"
            :key="item.instanceId"
            v-model="item.visible"
            :type="item.type"
            :message="item.message"
            :description="item.description"
            :count="item.count"
            :auto-close="autoClose"
            @after-leave="remove(item.instanceId)"
          />
        </div>
      </div>
    `,
  }),
  play: async ({ canvas, canvasElement, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Zapis' }));
    await waitFor(() => {
      expect(canvas.getByText('Notatka została zapisana.')).toBeVisible();
    });
    await expect(canvas.getByRole('button', { name: 'Zamknij' })).toBeVisible();
    await expect(
      canvasElement.querySelector('.abyss-notify__close-timer'),
    ).toBeTruthy();
  },
};

export const Queue: Story = {
  name: 'Kolejka',
  parameters: {
    docs: {
      description: {
        story:
          'Kolejka toastów w osobnej kolumnie, najnowsze na górze. Lista ma `padding: 12px 8px` i `overflow: visible`, a `overflow: auto` tylko gdy zmierzona wysokość przekracza `max-height` (debounce 0,2 s = animacja wejścia, zejścia i akordeonu). Ten sam szablon kliknięty pod rząd podbija `count` na ostatnim (najnowszym) wystąpieniu zamiast dodać nowy toast. Inny szablon otwiera kolejną pozycję. Nowy toast montuj od razu widoczny (wejście przez `appear`); instancję zdejmuj dopiero w `@after-leave`.',
      },
      source: {
        code: `<script setup>
const queue = ref([]);

function enqueue(template) {
  const newest = queue.value[0];
  if (newest?.id === template.id) {
    newest.count += 1;
    newest.visible = true;
    return;
  }
  queue.value.unshift({ ...template, instanceId: Date.now(), count: 1, visible: true });
}
</script>

<template>
  <div class="notify-queue">
    <AbyssButtonGroup vertical>
      <AbyssButton
        v-for="template in templates"
        :key="template.id"
        :label="template.label"
        @click="enqueue(template)"
      />
    </AbyssButtonGroup>
    <div class="abyss-notify-queue">
      <AbyssNotify
        v-for="item in queue"
        :key="item.instanceId"
        v-model="item.visible"
        :type="item.type"
        :message="item.message"
        :description="item.description"
        :count="item.count"
        @after-leave="queue = queue.filter((entry) => entry.instanceId !== item.instanceId)"
      />
    </div>
  </div>
</template>`,
      },
    },
  },
  render: () => ({
    components: { AbyssNotify, AbyssButton, AbyssButtonGroup },
    setup() {
      const { templates, queue, enqueue, remove } = createNotifyDemoQueue();

      return { templates, queue, enqueue, remove };
    },
    template: `
      <div style="display: flex; gap: 16px; align-items: flex-start; width: min(100%, 720px);">
        <div style="flex: 0 0 180px;">
          <AbyssButtonGroup vertical>
            <AbyssButton
              v-for="template in templates"
              :key="template.id"
              :label="template.label"
              @click="enqueue(template)"
            />
          </AbyssButtonGroup>
        </div>
        <div class="abyss-notify-queue" style="flex: 1; min-width: 0;">
          <AbyssNotify
            v-for="item in queue"
            :key="item.instanceId"
            v-model="item.visible"
            :type="item.type"
            :message="item.message"
            :description="item.description"
            :count="item.count"
            @after-leave="remove(item.instanceId)"
          />
        </div>
      </div>
    `,
  }),
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Zapis' }));
    await userEvent.click(canvas.getByRole('button', { name: 'Zapis' }));
    await waitFor(() => {
      expect(canvas.getByText('Notatka została zapisana.')).toBeVisible();
      expect(canvas.getByText('2')).toBeVisible();
      expect(canvas.getAllByRole('status')).toHaveLength(1);
    });

    await userEvent.click(canvas.getByRole('button', { name: 'Błąd sync' }));
    await waitFor(() => {
      expect(
        canvas.getByText('Nie udało się zsynchronizować zmian.'),
      ).toBeVisible();
      expect(canvas.getAllByRole('status')).toHaveLength(2);
      expect(canvas.getAllByText('2')).toHaveLength(1);
    });

    await userEvent.click(canvas.getByRole('button', { name: 'Błąd sync' }));
    await waitFor(() => {
      expect(canvas.getAllByRole('status')).toHaveLength(2);
      expect(canvas.getAllByText('2')).toHaveLength(2);
    });
  },
};
