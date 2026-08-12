<template>
  <div
    ref="containerEl"
    class="abyss-sidebar-nav"
    :class="[
      `abyss-sidebar-nav--${layoutMode}`,
      `abyss-sidebar-nav--device-${props.device}`,
    ]"
  >
    <aside
      v-if="showListPane"
      :class="[
        isMobile
          ? 'abyss-sidebar-nav__pane abyss-sidebar-nav__pane--list'
          : 'abyss-sidebar-nav__sidebar',
      ]"
    >
      <div
        class="abyss-sidebar-nav__sidebar-content"
      >
        <slot name="sidebar-prepend" />

        <AbyssSeparator v-if="hasSidebarPrepend" />

        <div class="abyss-sidebar-nav__sidebar-list">
          <AbyssButton
            v-for="tab in tabs"
            :key="tab.id"
            :label="tab.label"
            embedded
            full-width
            v-bind="getTabButtonProps(tab)"
            :class="[
              'abyss-sidebar-nav__tab-button',
              {
                'abyss-sidebar-nav__tab-button--mobile': isMobile,
              },
            ]"
            @click="handleTabClick(tab.id)"
          />
        </div>

        <AbyssSeparator v-if="hasSidebarAppend" />

        <div
          v-if="hasSidebarAppend"
          class="abyss-sidebar-nav__sidebar-append"
        >
          <slot name="sidebar-append" />
        </div>

        <div
          v-else-if="isMobile"
          class="abyss-sidebar-nav__sidebar-end-spacer"
          aria-hidden="true"
        />
      </div>
    </aside>

    <section
      v-if="showDetailPane"
      :key="layoutMode"
      :class="[
        isMobile
          ? 'abyss-sidebar-nav__pane abyss-sidebar-nav__pane--detail'
          : 'abyss-sidebar-nav__content',
      ]"
    >
      <template v-if="isMobile">
        <header class="abyss-sidebar-nav__app-bar">
          <AbyssButton
            icon="sym_r_arrow_back"
            embedded
            :aria-label="t('common.navigation.back')"
            @click="back"
          />
          <AbyssTitle
            v-bind="activeTab?.icon ? { icon: activeTab.icon } : {}"
            :label="activeTab?.label ?? ''"
          />
        </header>
        <div class="abyss-sidebar-nav__detail-content">
          <div class="abyss-sidebar-nav__detail-content-inner">
            <div
              v-for="tab in tabs"
              v-show="tab.id === activeId"
              :key="tab.id"
              class="abyss-sidebar-nav__tab-panel"
            >
              <slot :name="tab.id" :active-id="activeId" />
            </div>
          </div>
        </div>
      </template>
      <template v-else>
        <div
          v-for="tab in tabs"
          v-show="tab.id === activeId"
          :key="tab.id"
          class="abyss-sidebar-nav__tab-panel"
        >
          <slot :name="tab.id" :active-id="activeId" />
        </div>
      </template>
    </section>
  </div>
</template>

<script setup lang="ts">
import {
  Comment,
  Fragment,
  Text,
  computed,
  onMounted,
  onUnmounted,
  ref,
  useSlots,
  watch,
} from 'vue';
import type { VNode } from 'vue';
import { useI18n } from 'vue-i18n';
import AbyssButton from '@/components/ui/AbyssButton/AbyssButton.vue';
import AbyssSeparator from '@/components/ui/AbyssSeparator/AbyssSeparator.vue';
import AbyssTitle from '@/components/ui/AbyssTitle/AbyssTitle.vue';
import { ABYSS_TEMPLATE_SIDEBAR_MOBILE_MAX_WIDTH } from './AbyssTemplateSidebar.constants';

export interface AbyssTemplateSidebarTab {
  id: string;
  label: string;
  icon?: string;
}

export interface AbyssTemplateSidebarProps {
  device?: 'desktop' | 'mobile' | 'web';
  tabs: AbyssTemplateSidebarTab[];
  modelValue?: string;
  detailOpen?: boolean;
}

/** @deprecated Use AbyssTemplateSidebarTab */
export type AbyssSidebarNavTab = AbyssTemplateSidebarTab;

/** @deprecated Use AbyssTemplateSidebarProps */
export type AbyssSidebarNavProps = AbyssTemplateSidebarProps;

/** @deprecated Use AbyssTemplateSidebarTab */
export type AbyssSettingsTab = AbyssTemplateSidebarTab;

/** @deprecated Use AbyssTemplateSidebarProps */
export type AbyssSettingsProps = AbyssTemplateSidebarProps;

const props = withDefaults(defineProps<AbyssTemplateSidebarProps>(), {
  device: 'desktop',
  modelValue: '',
  detailOpen: false,
});
const slots = useSlots();
const { t } = useI18n();
const containerEl = ref<HTMLElement | null>(null);
const containerWidth = ref(Number.POSITIVE_INFINITY);
const hasMeasuredLayout = ref(false);

const emit = defineEmits<{
  (e: 'update:modelValue', id: string): void;
  (e: 'open', id: string): void;
  (e: 'back'): void;
}>();

const internalId = ref<string>(props.modelValue || props.tabs[0]?.id || '');

const isMobile = computed(
  () => containerWidth.value <= ABYSS_TEMPLATE_SIDEBAR_MOBILE_MAX_WIDTH,
);
const isSinglePageMode = computed(
  () => hasMeasuredLayout.value && !isMobile.value,
);
const layoutMode = computed(() => (isMobile.value ? 'mobile' : 'desktop'));
const showListPane = computed(() => !isMobile.value || !props.detailOpen);
const showDetailPane = computed(() => !isMobile.value || props.detailOpen);

let resizeObserver: ResizeObserver | null = null;

function syncContainerWidth(nextWidth?: number) {
  const normalizedWidth =
    typeof nextWidth === 'number' && Number.isFinite(nextWidth)
      ? nextWidth
      : Number.POSITIVE_INFINITY;

  containerWidth.value = normalizedWidth;

  if (normalizedWidth !== Number.POSITIVE_INFINITY) {
    hasMeasuredLayout.value = true;
  }
}

onMounted(() => {
  if (!containerEl.value) {
    return;
  }

  syncContainerWidth(containerEl.value.getBoundingClientRect().width);

  resizeObserver = new ResizeObserver((entries) => {
    syncContainerWidth(entries[0]?.contentRect.width);
  });

  resizeObserver.observe(containerEl.value);
});

onUnmounted(() => {
  resizeObserver?.disconnect();
});

function slotHasContent(name: string): boolean {
  const slot = slots[name];
  if (!slot) return false;
  const nodes = slot();
  return nodes.some(hasRenderableNode);
}

function hasRenderableNode(node: VNode): boolean {
  if (node.type === Comment) return false;
  if (node.type === Text) {
    return typeof node.children === 'string' && node.children.trim() !== '';
  }
  if (node.type === Fragment) {
    const children = node.children;
    if (Array.isArray(children)) {
      return children.some((child) => hasRenderableNode(child as VNode));
    }
    return false;
  }
  return true;
}

const hasSidebarPrepend = computed(() => slotHasContent('sidebar-prepend'));
const hasSidebarAppend = computed(() => slotHasContent('sidebar-append'));
const activeId = computed(() => internalId.value);
const activeTab = computed(() =>
  props.tabs.find((tab) => tab.id === activeId.value),
);

watch(
  () => props.modelValue,
  (value) => {
    if (value && value !== internalId.value) {
      internalId.value = value;
    }
  },
);

watch(
  () => props.tabs,
  (tabs) => {
    if (!tabs.find((tab) => tab.id === internalId.value)) {
      internalId.value = tabs[0]?.id ?? '';
    }
  },
  { immediate: true },
);

function select(id: string) {
  internalId.value = id;
  emit('update:modelValue', id);
}

function handleTabClick(id: string) {
  select(id);
  emit('open', id);
}

function getTabButtonProps(tab: AbyssTemplateSidebarTab) {
  return {
    ...(tab.icon ? { icon: tab.icon } : {}),
    iconRight: 'sym_r_chevron_right',
    ...(isMobile.value && tab.id === activeId.value
      ? { style: { pointerEvents: 'auto' } }
      : {}),
    ...(isSinglePageMode.value && tab.id === activeId.value
      ? { current: true }
      : {}),
  };
}

function back() {
  if (isMobile.value && props.detailOpen) {
    emit('back');
    return;
  }
}
</script>

<style lang="scss" scoped>
.abyss-sidebar-nav {
  .abyss-sidebar-nav__sidebar-list {
    :deep(.abyss-button) {
      .q-btn__content {
        width: 100%;
        justify-content: flex-start;
      }

      .block {
        flex: 1;
        text-align: left;
      }
    }
  }

  .abyss-sidebar-nav__sidebar-end-spacer {
    flex-shrink: 0;
    height: 12px;
  }

  .abyss-sidebar-nav__sidebar-append {
    flex-shrink: 0;
    padding: 12px 16px 8px;
  }

  .abyss-sidebar-nav__sidebar {
    overflow: auto;
    min-height: 0;

    &-content {
      display: flex;
      flex-direction: column;
      min-height: 100%;
      justify-content: space-between;
    }

    &-list {
      display: flex;
      flex-direction: column;
      gap: 4px;
      padding: 12px 8px;
      margin-bottom: auto;
    }
  }

  &--desktop {
    display: flex;
    height: 100%;
    overflow: hidden;

    .abyss-sidebar-nav__sidebar,
    .abyss-sidebar-nav__content {
      @include scrollbar;
    }

    .abyss-sidebar-nav__sidebar {
      max-width: 320px;
      flex: 1;
      min-width: 240px;
      box-shadow: $shadow-sidebar;
    }

    .abyss-sidebar-nav__content {
      background: rgba(black, 0.25);
      padding: 24px;
      flex: 2;
      overflow: auto;
      min-height: 0;
    }

    .abyss-sidebar-nav__tab-panel {
      min-height: 0;
    }

    &.abyss-sidebar-nav--device-mobile {
      --landscape-safe-top: env(safe-area-inset-top, 0px);
      --landscape-safe-bottom: env(safe-area-inset-bottom, 0px);
      --landscape-bottom-offset: max(
        8px,
        calc(var(--screen-radius, 12px) - env(safe-area-inset-left, 0px))
      );
      height: 100%;

      .abyss-sidebar-nav__sidebar {
        max-width: 280px;
      }

      .abyss-sidebar-nav__sidebar-content {
        padding-top: var(--landscape-safe-top);
        padding-bottom: calc(var(--landscape-bottom-offset) - 8px);
      }

      .abyss-sidebar-nav__sidebar-list {
        gap: 2px;
        padding: 8px 6px;
      }

      .abyss-sidebar-nav__sidebar-append {
        padding: 12px 6px 8px;
      }

      .abyss-sidebar-nav__content {
        background: linear-gradient(
          to right,
          rgba(black, 0.25) 0,
          rgba(black, 0.25) calc(100% - 24px),
          rgba(black, 0) 100%
        );
        padding: calc(8px + var(--landscape-safe-top)) 28px
          calc(8px + var(--landscape-bottom-offset)) 16px;
      }
    }
  }

  &--mobile {
    height: 100%;
    overflow: hidden;

    &.abyss-sidebar-nav--device-desktop {
      height: 100%;

      .abyss-sidebar-nav__detail-content {
        background: rgba(black, 0.25);
      }
    }

    .abyss-sidebar-nav__sidebar-content {
      padding-top: env(safe-area-inset-top, 0px);
    }

    .abyss-sidebar-nav__pane {
      height: 100%;
      min-height: 0;

      &--list {
        height: 100%;
        overflow: auto;
        box-sizing: border-box;

        @include scrollbar;
      }

      &--detail {
        height: 100%;
        display: flex;
        flex-direction: column;

        .abyss-sidebar-nav__app-bar {
          display: flex;
          align-items: center;
          box-shadow: $shadow-sidebar;
          clip-path: inset(0 -16px -16px -16px);
          padding-top: env(safe-area-inset-top, 0px);

          .abyss-title__content {
            font-size: 16px;
          }
        }

        .abyss-sidebar-nav__detail-content {
          background: linear-gradient(
            to bottom,
            rgba(black, 0.25) 0,
            rgba(black, 0.25) calc(100% - 24px),
            rgba(black, 0) 100%
          );

          .abyss-sidebar-nav--device-desktop & {
            background: rgba(black, 0.25);
          }

          flex: 1;
          overflow: auto;

          @include scrollbar;

          &-inner {
            padding: 12px 8px 24px 8px;
          }
        }
      }
    }

    .abyss-sidebar-nav__sidebar-append {
      padding: 12px 8px 24px;
    }

    &.abyss-sidebar-nav--device-desktop {
      .abyss-sidebar-nav__detail-content {
        background-color: rgba(black, 0.25);
        background-image: none;
      }
    }
  }
}
</style>
