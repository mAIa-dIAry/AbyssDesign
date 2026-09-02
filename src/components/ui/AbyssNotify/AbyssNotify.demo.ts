import { ref } from 'vue';
import type { AbyssNotifyType } from '@/components/ui/AbyssNotify/AbyssNotify.vue';

export type NotifyDemoTemplate = {
  id: string;
  label: string;
  type: AbyssNotifyType;
  message: string;
  description: string;
};

export type NotifyDemoQueueItem = NotifyDemoTemplate & {
  instanceId: number;
  count: number;
  visible: boolean;
  autoClose?: number;
};

export const NOTIFY_DEMO_TEMPLATES: NotifyDemoTemplate[] = [
  {
    id: 'save',
    label: 'Zapis',
    type: 'success',
    message: 'Notatka została zapisana.',
    description: '',
  },
  {
    id: 'sync',
    label: 'Błąd sync',
    type: 'danger',
    message: 'Nie udało się zsynchronizować zmian.',
    description: 'Kolejka pozostanie na urządzeniu do udanej synchronizacji.',
  },
  {
    id: 'login',
    label: 'Logowanie',
    type: 'warning',
    message: 'Synchronizacja wymaga logowania.',
    description: '',
  },
  {
    id: 'session',
    label: 'Sesja',
    type: 'info',
    message: 'Sesja wygaśnie za 5 minut.',
    description: '',
  },
  {
    id: 'hint',
    label: 'Wskazówka',
    type: 'hint',
    message: 'Możesz przypiąć notatkę do pulpitu.',
    description: '',
  },
];

export function enqueueNotifyDemo(
  queue: { value: NotifyDemoQueueItem[] },
  template: NotifyDemoTemplate,
  nextId: { value: number },
  autoClose?: number,
): void {
  const newest = queue.value[0];
  if (newest?.id === template.id) {
    newest.count += 1;
    newest.visible = true;
    return;
  }

  queue.value.unshift({
    ...template,
    instanceId: nextId.value,
    count: 1,
    visible: true,
    ...(autoClose !== undefined ? { autoClose } : {}),
  });
  nextId.value += 1;
}

export function createNotifyDemoQueue() {
  const queue = ref<NotifyDemoQueueItem[]>([]);
  const nextId = { value: 1 };

  function enqueue(template: NotifyDemoTemplate, autoClose?: number): void {
    enqueueNotifyDemo(queue, template, nextId, autoClose);
  }

  function setVisible(instanceId: number | string, visible: boolean): void {
    const item = queue.value.find((entry) => entry.instanceId === instanceId);

    if (item) {
      item.visible = visible;
    }
  }

  function remove(instanceId: number | string): void {
    queue.value = queue.value.filter((item) => item.instanceId !== instanceId);
  }

  return {
    templates: NOTIFY_DEMO_TEMPLATES,
    queue,
    enqueue,
    setVisible,
    remove,
  };
}
