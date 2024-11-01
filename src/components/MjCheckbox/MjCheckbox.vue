<template>
  <label :class="`mj-checkbox mj-checkbox--${size}`">
    <input :checked="_checked" type="checkbox" @change="onChange" />
    <span v-if="label">{{ label }}</span>
  </label>
</template>
<script lang="ts" setup>
import { computed } from 'vue';
import type { MjCheckboxEmits, MjCheckboxProps } from './interface';

const props = withDefaults(defineProps<MjCheckboxProps>(), {
  label: '',
  size: 'small',
  checked: false,
});
const model = defineModel<boolean>();
const _checked = computed(() => (typeof model.value === 'undefined' ? props.checked : model.value));
const emits = defineEmits<MjCheckboxEmits>();
const onChange = () => {
  model.value = !_checked.value;
  emits('change', model.value);
};
</script>
<style scoped lang="scss">
.mj-checkbox {
  display: inline-flex;
  align-items: center;
  font-size: 14px;
  user-select: none;
  &.mj-checkbox--mini {
    font-size: 12px;
    span {
      margin-left: 4px;
    }
  }
  &.mj-checkbox--small {
    font-size: 14px;
    span {
      margin-left: 6px;
    }
  }
  &.mj-checkbox--middle {
    font-size: 16px;
    span {
      margin-left: 8px;
    }
  }
  &.mj-checkbox--large {
    font-size: 18px;
    span {
      margin-left: 10px;
    }
  }
}
</style>
