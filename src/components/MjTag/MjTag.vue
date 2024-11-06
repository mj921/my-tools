<template>
  <div
    :class="classNames"
    :style="{
      '--mj-tag-color-text-custom': color || 'var(--mj-color-black-7)',
      '--mj-tag-color-bg-custom': bgColor || 'var(--mj-color-gray-1)',
    }"
  >
    <slot />
  </div>
</template>
<script lang="ts" setup>
import { computed } from 'vue';
import type { MjTagProps } from './interface';

const props = defineProps<MjTagProps>();

const classNames = computed(() => {
  const classList = ['mj-tag'];
  if (props.type && ['info', 'primary', 'success', 'error', 'warning'].includes(props.type)) {
    classList.push(`mj-tag--${props.type}`);
  }
  return classList;
});
</script>
<style scoped lang="scss">
.mj-tag {
  display: inline-block;
  color: var(--mj-tag-color-text, var(--mj-tag-color-text-custom));
  background-color: var(--mj-tag-color-bg, var(--mj-tag-color-bg-custom));
  font-size: 12px;
  line-height: 20px;
  padding: 0 4px;
  &.mj-tag--success {
    --mj-tag-color-text: var(--mj-color-success-6);
    --mj-tag-color-bg: var(--mj-color-success-1);
  }
  &.mj-tag--error {
    --mj-tag-color-text: var(--mj-color-error-6);
    --mj-tag-color-bg: var(--mj-color-error-1);
  }
  &.mj-tag--warning {
    --mj-tag-color-text: var(--mj-color-warning-6);
    --mj-tag-color-bg: var(--mj-color-warning-1);
  }
  &.mj-tag--primary {
    --mj-tag-color-text: var(--mj-color-primary-6);
    --mj-tag-color-bg: var(--mj-color-primary-1);
  }
  & + .mj-tag {
    margin-left: 8px;
  }
}
</style>
