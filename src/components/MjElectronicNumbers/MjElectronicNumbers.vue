<template>
  <div
    class="mj-electronic-numbers"
    :style="{
      padding: `${boxPaddingBlock}px ${boxPaddingInline}px`,
      backgroundColor: bgColor,
      '--mj-electronic-number-bg': bgColor,
      '--mj-electronic-number-default': defaultColor,
      '--mj-electronic-number-active': activeColor,
      '--mj-electronic-number-width': `${width}px`,
      '--mj-electronic-number-size': `${size}px`,
      '--mj-electronic-number-padding-block': `${paddingBlock}px`,
      '--mj-electronic-number-padding-inline': `${paddingInline}px`,
      '--mj-electronic-number-offset': `${offset}px`,
    }"
  >
    <mj-electronic-number v-for="(item, i) in numList" :key="i" :value="item" />
  </div>
</template>
<script lang="ts" setup>
import { computed } from 'vue';
import MjElectronicNumber from './MjElectronicNumber.vue';
import type { MjElectronicNumbersProps } from './interface';
import { addZero } from '@/utils';

const props = withDefaults(defineProps<MjElectronicNumbersProps>(), {
  value: 0,
  isTime: false,
  bgColor: '#000',
  defaultColor: '#333',
  activeColor: '#f00',
  width: 8,
  size: 40,
  offset: 1,
  paddingBlock: 8,
  paddingInline: 8,
  boxPaddingInline: 0,
  boxPaddingBlock: 0,
  minNumCount: 0,
});
const num = computed(() => +props.value || 0);
const numList = computed(() => {
  let time = num.value;
  if (props.isTime) {
    const arr = [];
    arr.unshift(...addZero(time % 60).split(''));
    time = Math.floor(time / 60);
    arr.unshift(...addZero(time % 60).split(''), ':');
    time = Math.floor(time / 60);
    if (time > 0) {
      arr.unshift(...time.toString().split(''), ':');
    }
    return arr;
  }
  const str = num.value.toString();

  return props.minNumCount <= str.length
    ? num.value.toString().split('')
    : addZero(num.value, props.minNumCount);
});
</script>
<style scoped lang="scss">
.mj-electronic-numbers {
  --mj-electronic-number-bg: #000;
  --mj-electronic-number-default: #333;
  --mj-electronic-number-active: #f00;
  --mj-electronic-number-width: 8px;
  --mj-electronic-number-size: 40px;
  --mj-electronic-number-padding-block: 8px;
  --mj-electronic-number-padding-inline: 8px;
  --mj-electronic-number-offset: 1px;
  display: flex;
}
</style>
