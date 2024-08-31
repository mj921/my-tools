<template>
  <div class="mj-tabs">
    <div class="mj-tabs-header">
      <dl
        :class="{
          'mj-tabs-header-item': true,
          'mj-tabs-header-item--active': k === computedActiveKey,
        }"
        v-for="k in tabKeys"
        :key="'mj-tabs-header' + k"
        @click="toggleTab(k)"
      >
        <span>{{ panelMap[k].title }}</span>
      </dl>
    </div>
    <div class="mj-tabs-panels"><slot></slot></div>
  </div>
</template>
<script lang="ts" setup>
import type { MjTabsProps, MjTabPanelProps } from './interface';
import { injectTabsKey, type TabsContext } from './context';
import { provide, ref, reactive, computed } from 'vue';
import { isUndefined } from '@/utils';

const props = withDefaults(defineProps<MjTabsProps>(), {
  defaultActiveKey: '',
});

const _activeKey = ref(props.defaultActiveKey);
const tabKeys = ref<string[]>([]);
const panelMap = reactive<Record<string, MjTabPanelProps>>({});

const toggleTab = (k: string) => {
  _activeKey.value = k;
};

const computedActiveKey = computed(() => {
  const activeKey = props.activeKey ?? _activeKey.value;
  if (isUndefined(activeKey)) {
    return tabKeys.value[0];
  }
  return activeKey;
});
provide(
  injectTabsKey,
  reactive<TabsContext>({
    activeKey: computedActiveKey,
    addPanel: (panelKey: string, panelProps: MjTabPanelProps) => {
      tabKeys.value.push(panelKey);
      panelMap[panelKey] = panelProps;
    },
  }),
);
</script>
<style scoped lang="scss">
.mj-tabs {
  .mj-tabs-header {
    display: flex;
    border-bottom: 1px solid #efefef;
    .mj-tabs-header-item {
      padding: 0 8px;
      cursor: pointer;
      span {
        display: inline-block;
        padding: 8px 0;
        color: #333;
      }
      &.mj-tabs-header-item--active {
        span {
          position: relative;
          color: #4b8cf0;
          font-weight: bold;
          &::after {
            content: '';
            bottom: -1px;
            left: 0;
            position: absolute;
            width: 100%;
            height: 2px;
            background-color: #4b8cf0;
          }
        }
      }
    }
  }
}
</style>
