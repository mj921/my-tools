<template>
  <div
    :class="classNames"
    :style="{
      '--mj-switch-checked-color': checkedColor || 'var(--mj-color-primary-6)',
      '--mj-switch-unchecked-color': uncheckedColor || 'var(--mj-color-gray-6)',
    }"
    @click="toggle"
  >
    <span class="mj-swithc-text">{{ model === checkedValue ? checkedText : uncheckedText }}</span>
  </div>
</template>
<script lang="ts" setup>
import { computed } from 'vue';
import type { MjSwitchProps } from './interface';
import type { MjSelectEmits } from '../MjSelect/interface';

const model = defineModel<string | number | boolean>();

const props = withDefaults(defineProps<MjSwitchProps>(), {
  checkedValue: true,
  uncheckedValue: false,
  size: 'medium',
});
const emits = defineEmits<MjSelectEmits>();

const classNames = computed(() => {
  const classList = ['mj-switch'];
  if (model.value === props.checkedValue) {
    classList.push('mj-switch--checked');
  }
  if (props.size === 'small') {
    classList.push('mj-switch--small');
  }
  return classList;
});
const toggle = () => {
  model.value = model.value === props.checkedValue ? props.uncheckedValue : props.checkedValue;
  emits('change', model.value);
};
</script>
<style scoped lang="scss">
.mj-switch {
  --mj-switch-size: 24px;
  background-color: var(--mj-switch-unchecked-color);
  height: var(--mj-switch-size);
  border-radius: 12px;
  display: inline-block;
  position: relative;
  cursor: pointer;
  &::after {
    position: absolute;
    content: '';
    left: 2px;
    top: 2px;
    background-color: #fff;
    width: calc(var(--mj-switch-size) - 4px);
    height: calc(var(--mj-switch-size) - 4px);
    border-radius: 50%;
    cursor: pointer;
    transition: left 0.1s linear;
  }
  .mj-swithc-text {
    padding: 0 calc(var(--mj-switch-size) / 2) 0 calc(var(--mj-switch-size));
    height: var(--mj-switch-size);
    display: inline-block;
    color: #fff;
    font-size: 12px;
    line-height: var(--mj-switch-size);
    vertical-align: top;
  }
  &.mj-switch--checked {
    background-color: var(--mj-switch-checked-color);
    &::after {
      left: calc(100% - var(--mj-switch-size) + 2px);
    }
    .mj-swithc-text {
      padding: 0 calc(var(--mj-switch-size) + 4px) 0 calc(var(--mj-switch-size) / 2);
    }
  }
  &.mj-switch--small {
    --mj-switch-size: 16px;
  }
}
</style>
