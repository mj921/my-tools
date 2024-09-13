<template>
  <template v-for="line in doms" :key="line.id">
    <template v-if="line.type === 'text'">
      {{ line.value }}
    </template>
    <component v-bind="line.attr" :class="line.className" v-else :is="line.type">
      <mj-md-dom :doms="line.children" />
    </component>
  </template>
</template>
<script lang="ts" setup>
import type { MjMdDomProps } from './interface';

defineOptions({
  name: 'MjMdDom',
});

defineProps<MjMdDomProps>();
</script>
<style scoped lang="scss"></style>
