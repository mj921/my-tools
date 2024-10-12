<template>
  <li class="mj-tree-node">
    <div class="mj-tree-node-title" @click="onNodeClick">
      <template v-if="!node.isLeaf">
        <down-icon v-if="expanded" />
        <right-icon v-else />
      </template>
      <span class="mj-tree-node-title-content">{{ node.title }}</span>
    </div>
    <ul v-if="!node.isLeaf && expanded">
      <mj-tree-node
        v-for="subNode in node.children"
        :node="subNode"
        :key="subNode.key"
        :nodeClickAction="nodeClickAction"
        :loadMore="loadMore"
      />
    </ul>
  </li>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import type { MjTreeNodeProps } from './interface';
import RightIcon from '../MjIcon/RightIcon.vue';
import DownIcon from '../MjIcon/DownIcon.vue';

const props = defineProps<MjTreeNodeProps>();
const expanded = ref(false);

const onNodeClick = () => {
  if (props.node.isLeaf && typeof props.loadMore === 'function') {
    props.loadMore(props.node);
  } else if (expanded.value) {
    expanded.value = false;
  } else if (props.node.children.length === 0 && typeof props.loadMore === 'function') {
    props.loadMore(props.node).then(() => {
      expanded.value = true;
    });
  } else {
    expanded.value = true;
  }
};
</script>
<style lang="scss"></style>
