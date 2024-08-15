<template>
  <label :class="`mj-checkbox mj-checkbox--${size}`">
    <input v-model="model" type="checkbox" />{{ label }}
  </label>
</template>
<script lang="ts" setup>
import type { MjCheckboxProps } from './interface';

const model = defineModel<boolean>();

withDefaults(defineProps<MjCheckboxProps>(), { label: '', size: 'small' });
</script>
<style scoped lang="scss">
.mj-checkbox {
  display: inline-flex;
  align-items: center;
  font-size: 14px;
  user-select: none;
  &.mj-checkbox--mini {
    font-size: 12px;
    input {
      margin-right: 4px;
    }
  }
  &.mj-checkbox--small {
    font-size: 14px;
    input {
      margin-right: 6px;
    }
  }
  &.mj-checkbox--middle {
    font-size: 16px;
    input {
      margin-right: 8px;
    }
  }
  &.mj-checkbox--large {
    font-size: 18px;
    input {
      margin-right: 10px;
    }
  }
}
</style>
