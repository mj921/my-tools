<template>
  <button @click="emits('click')" :class="className" :disabled="disabled">
    <span v-if="slots.icon || loading" class="m-btn-icon">
      <loading-icon v-if="loading" spin />
      <slot v-else name="icon"></slot>
    </span>
    <slot></slot>
  </button>
</template>
<script lang="ts" setup>
import { computed } from 'vue';
import LoadingIcon from '@/components/MjIcon/LoadingIcon.vue';
import type { MButtonEmits, MButtonProps, MButtonSlots } from './interface';
const slots = defineSlots<MButtonSlots>();
const emits = defineEmits<MButtonEmits>();
const props = withDefaults(defineProps<MButtonProps>(), {
  size: 'medium',
  type: 'default',
  status: 'normal',
  shape: 'square',
  long: false,
  disabled: false,
  loading: false,
});
const className = computed(() => {
  const classList = ['m-btn'];
  if (['mini', 'small', 'medium', 'large'].includes(props.size)) {
    classList.push(`m-btn-size-${props.size}`);
  } else {
    classList.push('m-btn-size-medium');
  }
  if (['primary', 'text', 'dashed', 'outline'].includes(props.type)) {
    classList.push(`m-btn-${props.type}`);
  }
  if (['success', 'warning', 'danger'].includes(props.status)) {
    classList.push(`m-btn-status-${props.status}`);
  }
  if (['circle', 'round'].includes(props.shape)) {
    classList.push(`m-btn-shape-${props.shape}`);
  }
  if (props.long) {
    classList.push('m-btn-long');
  }
  if (props.loading) {
    classList.push('m-btn-loading');
  }
  return classList;
});
</script>
<style scoped lang="scss">
.m-btn {
  --m-btn-bg: var(--mj-color-gray-bg);
  --m-btn-bg-hover: var(--mj-color-gray-bg-hover);
  --m-btn-bg-disabled: var(--mj-color-gray-bg-disabled);
  --m-btn-bg-active: var(--mj-color-gray-bg-active);
  --m-btn-color-text: var(--mj-color-black-text);
  --m-btn-color-text-hover: var(--mj-color-black-text-hover);
  --m-btn-color-text-disabled: var(--mj-color-black-text-disabled);
  --m-btn-color-text-active: var(--mj-color-black-text-active);
  --m-btn-border-color: var(--mj-color-gray-bg);
  --m-btn-border-color-hover: var(--mj-color-gray-bg-hover);
  --m-btn-border-color-disabled: var(--mj-color-gray-bg-disabled);
  --m-btn-border-color-active: var(--mj-color-gray-bg-disabled);
  padding: 0 16px;
  box-sizing: border-box;
  border: none;
  background-color: var(--m-btn-bg);
  color: var(--m-btn-color-text);
  border-color: var(--m-btn-border-color);
  &.m-btn-long {
    width: 100%;
  }
  &:hover:not([class*='m-btn-loading']):not([disabled]) {
    background-color: var(--m-btn-bg-hover);
    border-color: var(--m-btn-border-color-hover);
  }
  &:active:not([class*='m-btn-loading']):not([disabled]) {
    background-color: var(--m-btn-bg-active);
    border-color: var(--m-btn-border-color-active);
  }
  &[disabled] {
    background-color: var(--m-btn-bg-disabled);
    color: var(--m-btn-color-text-disabled);
    border-color: var(--m-btn-border-color-disabled);
    cursor: not-allowed;
  }
  &.m-btn-status-success {
    --m-btn-bg: var(--mj-color-success-bg);
    --m-btn-bg-hover: var(--mj-color-success-bg-hover);
    --m-btn-bg-disabled: var(--mj-color-success-bg-disabled);
    --m-btn-bg-active: var(--mj-color-success-bg-active);
    --m-btn-color-text: var(--mj-color-success);
    --m-btn-color-text-hover: var(--mj-color-success-hover);
    --m-btn-color-text-disabled: var(--mj-color-success-disabled);
    --m-btn-color-text-active: var(--mj-color-success-active);
  }
  &.m-btn-status-warning {
    --m-btn-bg: var(--mj-color-warning-bg);
    --m-btn-bg-hover: var(--mj-color-warning-bg-hover);
    --m-btn-bg-disabled: var(--mj-color-warning-bg-disabled);
    --m-btn-bg-active: var(--mj-color-warning-bg-active);
    --m-btn-color-text: var(--mj-color-warning);
    --m-btn-color-text-hover: var(--mj-color-warning-hover);
    --m-btn-color-text-disabled: var(--mj-color-warning-disabled);
    --m-btn-color-text-active: var(--mj-color-warning-active);
  }
  &.m-btn-status-danger {
    --m-btn-bg: var(--mj-color-error-bg);
    --m-btn-bg-hover: var(--mj-color-error-bg-hover);
    --m-btn-bg-disabled: var(--mj-color-error-bg-disabled);
    --m-btn-bg-active: var(--mj-color-error-bg-active);
    --m-btn-color-text: var(--mj-color-error);
    --m-btn-color-text-hover: var(--mj-color-error-hover);
    --m-btn-color-text-disabled: var(--mj-color-error-disabled);
    --m-btn-color-text-active: var(--mj-color-error-active);
  }
  &.m-btn-border {
    --m-btn-border-color: var(--mj-color-primary);
    --m-btn-border-color-hover: var(--mj-color-primary-hover);
    --m-btn-border-color-disabled: var(--mj-color-primary-disabled);
    --m-btn-border-color-active: var(--mj-color-primary-active);
    &.m-btn-status-success {
      --m-btn-color-text: var(--mj-color-success);
      --m-btn-color-text-hover: var(--mj-color-success-hover);
      --m-btn-color-text-disabled: var(--mj-color-success-disabled);
      --m-btn-color-text-active: var(--mj-color-success-active);
      --m-btn-border-color: var(--mj-color-success);
      --m-btn-border-color-hover: var(--mj-color-success-hover);
      --m-btn-border-color-disabled: var(--mj-color-success-disabled);
      --m-btn-border-color-active: var(--mj-color-success-active);
    }
    &.m-btn-status-warning {
      --m-btn-color-text: var(--mj-color-warning);
      --m-btn-color-text-hover: var(--mj-color-warning-hover);
      --m-btn-color-text-disabled: var(--mj-color-warning-disabled);
      --m-btn-color-text-active: var(--mj-color-warning-active);
      --m-btn-border-color: var(--mj-color-warning);
      --m-btn-border-color-hover: var(--mj-color-warning-hover);
      --m-btn-border-color-disabled: var(--mj-color-warning-disabled);
      --m-btn-border-color-active: var(--mj-color-warning-active);
    }
    &.m-btn-status-danger {
      --m-btn-color-text: var(--mj-color-error);
      --m-btn-color-text-hover: var(--mj-color-error-hover);
      --m-btn-color-text-disabled: var(--mj-color-error-disabled);
      --m-btn-color-text-active: var(--mj-color-error-active);
      --m-btn-border-color: var(--mj-color-error);
      --m-btn-border-color-hover: var(--mj-color-error-hover);
      --m-btn-border-color-disabled: var(--mj-color-error-disabled);
      --m-btn-border-color-active: var(--mj-color-error-active);
    }
  }

  &.m-btn-primary {
    --m-btn-bg: var(--mj-color-primary);
    --m-btn-bg-hover: var(--mj-color-primary-hover);
    --m-btn-bg-disabled: var(--mj-color-primary-disabled);
    --m-btn-bg-active: var(--mj-color-primary-active);
    --m-btn-color-text: #fff;
    --m-btn-color-text-hover: #fff;
    --m-btn-color-text-disabled: #fff;
    --m-btn-color-text-active: #fff;
    &.m-btn-status-success {
      --m-btn-bg: var(--mj-color-success);
      --m-btn-bg-hover: var(--mj-color-success-hover);
      --m-btn-bg-disabled: var(--mj-color-success-disabled);
      --m-btn-bg-active: var(--mj-color-success-active);
    }
    &.m-btn-status-warning {
      --m-btn-bg: var(--mj-color-warning);
      --m-btn-bg-hover: var(--mj-color-warning-hover);
      --m-btn-bg-disabled: var(--mj-color-warning-disabled);
      --m-btn-bg-active: var(--mj-color-warning-active);
    }
    &.m-btn-status-danger {
      --m-btn-bg: var(--mj-color-error);
      --m-btn-bg-hover: var(--mj-color-error-hover);
      --m-btn-bg-disabled: var(--mj-color-error-disabled);
      --m-btn-bg-active: var(--mj-color-error-active);
    }
  }

  &.m-btn-dashed {
    @extend .m-btn-border;
    border-width: 1px;
    border-style: dashed;
    &.m-btn-status-success {
      --m-btn-bg: var(--mj-color-success-bg);
      --m-btn-bg-hover: var(--mj-color-success-bg-hover);
      --m-btn-bg-disabled: var(--mj-color-success-bg-disabled);
      --m-btn-bg-active: var(--mj-color-success-bg-active);
    }
    &.m-btn-status-warning {
      --m-btn-bg: var(--mj-color-warning-bg);
      --m-btn-bg-hover: var(--mj-color-warning-bg-hover);
      --m-btn-bg-disabled: var(--mj-color-warning-bg-disabled);
      --m-btn-bg-active: var(--mj-color-warning-bg-active);
    }
    &.m-btn-status-danger {
      --m-btn-bg: var(--mj-color-error-bg);
      --m-btn-bg-hover: var(--mj-color-error-bg-hover);
      --m-btn-bg-disabled: var(--mj-color-error-bg-disabled);
      --m-btn-bg-active: var(--mj-color-error-bg-active);
    }
  }

  &.m-btn-text {
    --m-btn-bg: transparent;
    --m-btn-bg-hover: transparent;
    --m-btn-bg-disabled: transparent;
    --m-btn-bg-active: transparent;
    --m-btn-color-text: var(--mj-color-primary);
    --m-btn-color-text-hover: var(--mj-color-primary-hover);
    --m-btn-color-text-disabled: var(--mj-color-primary-disabled);
    --m-btn-color-text-active: var(--mj-color-primary-active);
    &.m-btn-status-success {
      --m-btn-color-text: var(--mj-color-success);
      --m-btn-color-text-hover: var(--mj-color-success-hover);
      --m-btn-color-text-disabled: var(--mj-color-success-disabled);
      --m-btn-color-text-active: var(--mj-color-success-active);
    }
    &.m-btn-status-warning {
      --m-btn-color-text: var(--mj-color-warning);
      --m-btn-color-text-hover: var(--mj-color-warning-hover);
      --m-btn-color-text-disabled: var(--mj-color-warning-disabled);
      --m-btn-color-text-active: var(--mj-color-warning-active);
    }
    &.m-btn-status-danger {
      --m-btn-color-text: var(--mj-color-error);
      --m-btn-color-text-hover: var(--mj-color-error-hover);
      --m-btn-color-text-disabled: var(--mj-color-error-disabled);
      --m-btn-color-text-active: var(--mj-color-error-active);
    }
  }

  &.m-btn-outline {
    @extend .m-btn-border;
    @extend .m-btn-text;
    border-width: 1px;
    border-style: solid;
  }

  & + .m-btn {
    margin-left: 12px;
  }
  &.m-btn-size-mini {
    height: 24px;
    padding: 0 11px;
    font-size: 12px;
    border-radius: 2px;
    &.m-btn-shape-circle {
      padding: 0;
      width: 24px;
      border-radius: 50%;
    }
    &.m-btn-shape-round {
      border-radius: 12px;
    }
    &.m-btn-text {
      padding: 0 4px;
    }
    &.m-btn-outline {
      padding: 0 10px;
    }
    & + .m-btn {
      margin-left: 8px;
    }
  }
  &.m-btn-size-small {
    height: 28px;
    padding: 0 15px;
    font-size: 14px;
    border-radius: 2px;
    &.m-btn-shape-circle {
      padding: 0;
      width: 28px;
      border-radius: 50%;
    }
    &.m-btn-shape-round {
      border-radius: 14px;
    }
    &.m-btn-text {
      padding: 0 5px;
    }
    &.m-btn-outline {
      padding: 0 14px;
    }
    & + .m-btn {
      margin-left: 10px;
    }
  }
  &.m-btn-size-medium {
    height: 32px;
    padding: 0 15px;
    font-size: 14px;
    border-radius: 2px;
    &.m-btn-shape-circle {
      padding: 0;
      width: 32px;
      border-radius: 50%;
    }
    &.m-btn-shape-round {
      border-radius: 16px;
    }
    &.m-btn-text {
      padding: 0 5px;
    }
    &.m-btn-outline {
      padding: 0 14px;
    }
    & + .m-btn {
      margin-left: 10px;
    }
  }
  &.m-btn-size-large {
    height: 36px;
    padding: 0 19px;
    font-size: 14px;
    border-radius: 2px;
    &.m-btn-shape-circle {
      padding: 0;
      width: 36px;
      border-radius: 50%;
    }
    &.m-btn-shape-round {
      border-radius: 18px;
    }
    &.m-btn-text {
      padding: 0 6px;
    }
    &.m-btn-outline {
      padding: 0 18px;
    }
    & + .m-btn {
      margin-left: 12px;
    }
  }
  &.m-btn-loading {
    position: relative;
    &::before {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      content: '';
      background-color: rgba($color: #fff, $alpha: 0.1);
    }
  }
  .m-btn-icon {
    margin-right: 8px;
  }
}
</style>
