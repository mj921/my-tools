<template>
  <input
    class="mj-input"
    v-model="model"
    :placeholder="placeholder"
    @change="emits('change', model)"
    :disabled="disabled"
  />
</template>
<script lang="ts" setup>
import type { MjInputProps, MjInputEmits } from './interface';

const model = defineModel<string | number>();

defineProps<MjInputProps>();

const emits = defineEmits<MjInputEmits>();
</script>
<style scoped lang="scss">
.mj-input {
  appearance: none;
  border: none;
  background-color: #ddd;
  outline: none;
  height: 30px;
  padding: 0 10px;
  &:focus {
    background-color: #eee;
  }
  &:disabled {
    background-color: #eee;
    color: #999;
    cursor: not-allowed;
  }
}
</style>
