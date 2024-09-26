<template>
  <button @click="emits('click')" :class="className" :disabled="disabled">
    <span v-if="slots.icon || loading" class="mj-btn-icon">
      <loading-icon v-if="loading" spin />
      <slot v-else name="icon"></slot>
    </span>
    <slot></slot>
  </button>
</template>
<script lang="ts" setup>
import { computed } from 'vue';
import LoadingIcon from '../MjIcon/LoadingIcon.vue';
import type { MjButtonEmits, MjButtonProps, MjButtonSlots } from './interface';
const slots = defineSlots<MjButtonSlots>();
const emits = defineEmits<MjButtonEmits>();
const props = withDefaults(defineProps<MjButtonProps>(), {
  size: 'medium',
  type: 'default',
  status: 'normal',
  shape: 'square',
  long: false,
  disabled: false,
  loading: false,
});
const className = computed(() => {
  const classList = ['mj-btn'];
  if (['mini', 'small', 'medium', 'large'].includes(props.size)) {
    classList.push(`mj-btn-size-${props.size}`);
  } else {
    classList.push('mj-btn-size-medium');
  }
  if (['primary', 'text', 'dashed', 'outline'].includes(props.type)) {
    classList.push(`mj-btn-${props.type}`);
  }
  if (['success', 'warning', 'danger'].includes(props.status)) {
    classList.push(`mj-btn-status-${props.status}`);
  }
  if (['circle', 'round'].includes(props.shape)) {
    classList.push(`mj-btn-shape-${props.shape}`);
  }
  if (props.long) {
    classList.push('mj-btn-long');
  }
  if (props.loading) {
    classList.push('mj-btn-loading');
  }
  return classList;
});
</script>
<style scoped lang="scss">
.mj-btn {
  --mj-btn-bg: var(--mj-color-gray-bg);
  --mj-btn-bg-hover: var(--mj-color-gray-bg-hover);
  --mj-btn-bg-disabled: var(--mj-color-gray-bg-disabled);
  --mj-btn-bg-active: var(--mj-color-gray-bg-active);
  --mj-btn-color-text: var(--mj-color-black-text);
  --mj-btn-color-text-hover: var(--mj-color-black-text-hover);
  --mj-btn-color-text-disabled: var(--mj-color-black-text-disabled);
  --mj-btn-color-text-active: var(--mj-color-black-text-active);
  --mj-btn-border-color: var(--mj-color-gray-bg);
  --mj-btn-border-color-hover: var(--mj-color-gray-bg-hover);
  --mj-btn-border-color-disabled: var(--mj-color-gray-bg-disabled);
  --mj-btn-border-color-active: var(--mj-color-gray-bg-disabled);
  padding: 0 16px;
  box-sizing: border-box;
  border: none;
  background-color: var(--mj-btn-bg);
  color: var(--mj-btn-color-text);
  border-color: var(--mj-btn-border-color);
  &.mj-btn-long {
    width: 100%;
  }
  &:hover:not([class*='mj-btn-loading']):not([disabled]) {
    background-color: var(--mj-btn-bg-hover);
    border-color: var(--mj-btn-border-color-hover);
  }
  &:active:not([class*='mj-btn-loading']):not([disabled]) {
    background-color: var(--mj-btn-bg-active);
    border-color: var(--mj-btn-border-color-active);
  }
  &[disabled] {
    background-color: var(--mj-btn-bg-disabled);
    color: var(--mj-btn-color-text-disabled);
    border-color: var(--mj-btn-border-color-disabled);
    cursor: not-allowed;
  }
  &.mj-btn-status-success {
    --mj-btn-bg: var(--mj-color-success-bg);
    --mj-btn-bg-hover: var(--mj-color-success-bg-hover);
    --mj-btn-bg-disabled: var(--mj-color-success-bg-disabled);
    --mj-btn-bg-active: var(--mj-color-success-bg-active);
    --mj-btn-color-text: var(--mj-color-success);
    --mj-btn-color-text-hover: var(--mj-color-success-hover);
    --mj-btn-color-text-disabled: var(--mj-color-success-disabled);
    --mj-btn-color-text-active: var(--mj-color-success-active);
  }
  &.mj-btn-status-warning {
    --mj-btn-bg: var(--mj-color-warning-bg);
    --mj-btn-bg-hover: var(--mj-color-warning-bg-hover);
    --mj-btn-bg-disabled: var(--mj-color-warning-bg-disabled);
    --mj-btn-bg-active: var(--mj-color-warning-bg-active);
    --mj-btn-color-text: var(--mj-color-warning);
    --mj-btn-color-text-hover: var(--mj-color-warning-hover);
    --mj-btn-color-text-disabled: var(--mj-color-warning-disabled);
    --mj-btn-color-text-active: var(--mj-color-warning-active);
  }
  &.mj-btn-status-danger {
    --mj-btn-bg: var(--mj-color-error-bg);
    --mj-btn-bg-hover: var(--mj-color-error-bg-hover);
    --mj-btn-bg-disabled: var(--mj-color-error-bg-disabled);
    --mj-btn-bg-active: var(--mj-color-error-bg-active);
    --mj-btn-color-text: var(--mj-color-error);
    --mj-btn-color-text-hover: var(--mj-color-error-hover);
    --mj-btn-color-text-disabled: var(--mj-color-error-disabled);
    --mj-btn-color-text-active: var(--mj-color-error-active);
  }
  &.mj-btn-border {
    --mj-btn-border-color: var(--mj-color-primary-bg);
    --mj-btn-border-color-hover: var(--mj-color-primary-bg-hover);
    --mj-btn-border-color-disabled: var(--mj-color-primary-bg-disabled);
    --mj-btn-border-color-active: var(--mj-color-primary-bg-active);
    &.mj-btn-status-success {
      --mj-btn-color-text: var(--mj-color-success);
      --mj-btn-color-text-hover: var(--mj-color-success-hover);
      --mj-btn-color-text-disabled: var(--mj-color-success-disabled);
      --mj-btn-color-text-active: var(--mj-color-success-active);
      --mj-btn-border-color: var(--mj-color-success);
      --mj-btn-border-color-hover: var(--mj-color-success-hover);
      --mj-btn-border-color-disabled: var(--mj-color-success-disabled);
      --mj-btn-border-color-active: var(--mj-color-success-active);
    }
    &.mj-btn-status-warning {
      --mj-btn-color-text: var(--mj-color-warning);
      --mj-btn-color-text-hover: var(--mj-color-warning-hover);
      --mj-btn-color-text-disabled: var(--mj-color-warning-disabled);
      --mj-btn-color-text-active: var(--mj-color-warning-active);
      --mj-btn-border-color: var(--mj-color-warning);
      --mj-btn-border-color-hover: var(--mj-color-warning-hover);
      --mj-btn-border-color-disabled: var(--mj-color-warning-disabled);
      --mj-btn-border-color-active: var(--mj-color-warning-active);
    }
    &.mj-btn-status-danger {
      --mj-btn-color-text: var(--mj-color-error);
      --mj-btn-color-text-hover: var(--mj-color-error-hover);
      --mj-btn-color-text-disabled: var(--mj-color-error-disabled);
      --mj-btn-color-text-active: var(--mj-color-error-active);
      --mj-btn-border-color: var(--mj-color-error);
      --mj-btn-border-color-hover: var(--mj-color-error-hover);
      --mj-btn-border-color-disabled: var(--mj-color-error-disabled);
      --mj-btn-border-color-active: var(--mj-color-error-active);
    }
  }

  &.mj-btn-primary {
    --mj-btn-bg: var(--mj-color-primary);
    --mj-btn-bg-hover: var(--mj-color-primary-hover);
    --mj-btn-bg-disabled: var(--mj-color-primary-disabled);
    --mj-btn-bg-active: var(--mj-color-primary-active);
    --mj-btn-color-text: #fff;
    --mj-btn-color-text-hover: #fff;
    --mj-btn-color-text-disabled: #fff;
    --mj-btn-color-text-active: #fff;
    &.mj-btn-status-success {
      --mj-btn-bg: var(--mj-color-success);
      --mj-btn-bg-hover: var(--mj-color-success-hover);
      --mj-btn-bg-disabled: var(--mj-color-success-disabled);
      --mj-btn-bg-active: var(--mj-color-success-active);
    }
    &.mj-btn-status-warning {
      --mj-btn-bg: var(--mj-color-warning);
      --mj-btn-bg-hover: var(--mj-color-warning-hover);
      --mj-btn-bg-disabled: var(--mj-color-warning-disabled);
      --mj-btn-bg-active: var(--mj-color-warning-active);
    }
    &.mj-btn-status-danger {
      --mj-btn-bg: var(--mj-color-error);
      --mj-btn-bg-hover: var(--mj-color-error-hover);
      --mj-btn-bg-disabled: var(--mj-color-error-disabled);
      --mj-btn-bg-active: var(--mj-color-error-active);
    }
  }

  &.mj-btn-dashed {
    @extend .mj-btn-border;
    &.mj-btn-status-success {
      --mj-btn-bg: var(--mj-color-success-bg);
      --mj-btn-bg-hover: var(--mj-color-success-bg-hover);
      --mj-btn-bg-disabled: var(--mj-color-success-bg-disabled);
      --mj-btn-bg-active: var(--mj-color-success-bg-active);
    }
    &.mj-btn-status-warning {
      --mj-btn-bg: var(--mj-color-warning-bg);
      --mj-btn-bg-hover: var(--mj-color-warning-bg-hover);
      --mj-btn-bg-disabled: var(--mj-color-warning-bg-disabled);
      --mj-btn-bg-active: var(--mj-color-warning-bg-active);
    }
    &.mj-btn-status-danger {
      --mj-btn-bg: var(--mj-color-error-bg);
      --mj-btn-bg-hover: var(--mj-color-error-bg-hover);
      --mj-btn-bg-disabled: var(--mj-color-error-bg-disabled);
      --mj-btn-bg-active: var(--mj-color-error-bg-active);
    }
    border-width: 1px;
    border-style: dashed;
  }

  &.mj-btn-text {
    --mj-btn-bg: transparent;
    --mj-btn-bg-hover: transparent;
    --mj-btn-bg-disabled: transparent;
    --mj-btn-bg-active: transparent;
    --mj-btn-color-text: var(--mj-color-primary);
    --mj-btn-color-text-hover: var(--mj-color-primary-hover);
    --mj-btn-color-text-disabled: var(--mj-color-primary-disabled);
    --mj-btn-color-text-active: var(--mj-color-primary-active);
    &.mj-btn-status-success {
      --mj-btn-color-text: var(--mj-color-success);
      --mj-btn-color-text-hover: var(--mj-color-success-hover);
      --mj-btn-color-text-disabled: var(--mj-color-success-disabled);
      --mj-btn-color-text-active: var(--mj-color-success-active);
    }
    &.mj-btn-status-warning {
      --mj-btn-color-text: var(--mj-color-warning);
      --mj-btn-color-text-hover: var(--mj-color-warning-hover);
      --mj-btn-color-text-disabled: var(--mj-color-warning-disabled);
      --mj-btn-color-text-active: var(--mj-color-warning-active);
    }
    &.mj-btn-status-danger {
      --mj-btn-color-text: var(--mj-color-error);
      --mj-btn-color-text-hover: var(--mj-color-error-hover);
      --mj-btn-color-text-disabled: var(--mj-color-error-disabled);
      --mj-btn-color-text-active: var(--mj-color-error-active);
    }
  }

  &.mj-btn-outline {
    @extend .mj-btn-border;
    @extend .mj-btn-text;
    border-width: 1px;
    border-style: solid;
  }

  &.mj-btn-size-mini {
    height: 24px;
    padding: 0 11px;
    font-size: 12px;
    border-radius: 2px;
    &.mj-btn-shape-circle {
      padding: 0;
      width: 24px;
      border-radius: 50%;
    }
    &.mj-btn-shape-round {
      border-radius: 12px;
    }
  }
  &.mj-btn-size-small {
    height: 28px;
    padding: 0 15px;
    font-size: 14px;
    border-radius: 2px;
    &.mj-btn-shape-circle {
      padding: 0;
      width: 28px;
      border-radius: 50%;
    }
    &.mj-btn-shape-round {
      border-radius: 14px;
    }
  }
  &.mj-btn-size-medium {
    height: 32px;
    padding: 0 15px;
    font-size: 14px;
    border-radius: 2px;
    &.mj-btn-shape-circle {
      padding: 0;
      width: 32px;
      border-radius: 50%;
    }
    &.mj-btn-shape-round {
      border-radius: 16px;
    }
  }
  &.mj-btn-size-large {
    height: 36px;
    padding: 0 19px;
    font-size: 14px;
    border-radius: 2px;
    &.mj-btn-shape-circle {
      padding: 0;
      width: 36px;
      border-radius: 50%;
    }
    &.mj-btn-shape-round {
      border-radius: 18px;
    }
  }
  &.mj-btn-loading {
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
  .mj-btn-icon {
    margin-right: 8px;
  }
}
</style>
