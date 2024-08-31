<template>
  <div class="mj-tab-panel" v-show="active"><slot></slot></div>
</template>
<script lang="ts" setup>
import { computed, getCurrentInstance, inject } from 'vue';
import type { MjTabPanelProps } from './interface';
import { injectTabsKey, type TabsContext } from './context';

const props = defineProps<MjTabPanelProps>();

const instance = getCurrentInstance();

const tabsContext = inject<Partial<TabsContext>>(injectTabsKey, {});
const active = computed(() => instance?.vnode.key === tabsContext.activeKey);
tabsContext.addPanel?.((instance?.vnode.key || '').toString(), props);
</script>
<style scoped lang="scss"></style>
