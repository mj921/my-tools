<template>
  <component
    :is="props.tag"
    class="mj-row"
    :style="{ justifyContent: props.justify, alignItems: props.align, gap: props.gap }"
  >
    <slot></slot>
  </component>
</template>
<script lang="ts" setup>
import type { MjRowProps } from './interface';

const props = withDefaults(defineProps<MjRowProps>(), {
  tag: 'div',
  justify: 'start',
  align: 'center',
  gap: 0
});
</script>
<style scoped lang="scss">
.mj-row {
  display: flex;
}
</style>
