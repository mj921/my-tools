<template>
  <div :class="classNames">
    <div class="mj-form-item__label" :style="labelStyle">
      <label>{{ label }}</label>
    </div>
    <div class="mj-form-item__content"><slot /></div>
  </div>
</template>
<script lang="ts" setup>
import { computed, inject, type StyleValue } from 'vue';
import type { MjFormInject, MjFormItemProps } from './interface';
import { MjFormInjectKey } from './context';

defineProps<MjFormItemProps>();
const formInject = inject<MjFormInject>(MjFormInjectKey);
const classNames = computed(() => {
  const classList = ['mj-form-item'];
  if (formInject?.labelAlign === 'top') {
    classList.push('mj-form-item--top');
  }
  return classList;
});
const labelWidth = computed(() => formInject?.labelWidth);
const labelStyle = computed<StyleValue>(() => ({
  width: `${labelWidth.value}px`,
  flex: `0 0 ${labelWidth.value}px`,
  textAlign: formInject?.labelAlign === 'top' ? undefined : formInject?.labelAlign,
}));
</script>
<style lang="scss"></style>
