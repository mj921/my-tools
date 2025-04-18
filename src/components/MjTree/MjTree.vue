<template>
  <ul
    :class="classList"
    :style="{
      '--mj-tree-text-color': textColor,
      '--mj-tree-bg-color': bgColor,
    }"
  >
    <mj-tree-node
      v-for="node in data"
      :node="node"
      :key="node.key"
      :nodeClickAction="nodeClickAction"
      :loadMore="loadMore"
    />
  </ul>
</template>
<script lang="ts" setup>
import { computed } from 'vue';
import type { MjTreeProps } from './interface';
import MjTreeNode from './MjTreeNode.vue';

const props = withDefaults(defineProps<MjTreeProps>(), {
  textColor: '#000',
  bgColor: '#fff',
  nodeClickAction: 'expand',
});
const classList = computed(() => {
  const list = ['mj-tree'];
  return list;
});
</script>
<style lang="scss">
.mj-tree {
  background-color: var(--mj-tree-bg-color);
  color: var(--mj-tree-text-color);
  user-select: none;
  ul {
    padding-left: 20px;
  }
  .mj-tree-node-title {
    cursor: default;
    display: inline-flex;
    align-items: center;
    width: 100%;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    .mj-icon {
      flex: 0 0 1em;
      margin-right: 4px;
      transform: scale(0.8);
    }
    .mj-tree-node-title-content {
      flex: 1;
      line-height: 1.5;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
  }
}
</style>
