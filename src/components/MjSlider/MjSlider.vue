<template>
  <div
    class="mj-slider"
    :style="{
      '--mj-slider-bg-color': bgColor,
      '--mj-slider-active-color': activeColor,
    }"
  >
    <div class="mj-slider-track" ref="track">
      <div class="mj-slider-bar" :style="{ right: `${100 - btnLeft}%` }"></div>
      <div class="mj-slider-btn" :style="{ left: `${btnLeft}%` }" @mousedown="onMouseDown"></div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed } from 'vue';
import type { MjSliderProps } from './interface';
import { reactive } from 'vue';
import { onMounted } from 'vue';
import { ref } from 'vue';

const model = defineModel<number>({ default: 0 });
const props = withDefaults(defineProps<MjSliderProps>(), {
  activeColor: 'var(--mj-color-primary-7)',
  bgColor: 'var(--mj-color-gray-7)',
  min: 0,
  max: 100,
  step: 1,
});
model.value = Math.min(props.max, Math.max(props.min, model.value));
const track = ref<HTMLDivElement>();

const btnLeft = computed(() => ((model.value - props.min) / (props.max - props.min)) * 100);
const pointX = ref(0);
const prevValue = ref(0);
const isMouseDown = ref(false);
const onMouseDown = (e: MouseEvent) => {
  isMouseDown.value = true;
  pointX.value = e.clientX;
  prevValue.value = model.value;
};
const onMouseMove = (e: MouseEvent) => {
  if (!isMouseDown.value) return;
  const width = track.value?.offsetWidth || 1;
  model.value = Math.min(
    props.max,
    Math.max(
      props.min,
      prevValue.value +
        Math.floor((((e.clientX - pointX.value) / width) * (props.max - props.min)) / props.step) *
          props.step,
    ),
  );
};
const onMouseUp = (e: MouseEvent) => {
  if (!isMouseDown.value) return;
  const width = track.value?.offsetWidth || 1;
  model.value = Math.min(
    props.max,
    Math.max(
      props.min,
      prevValue.value +
        Math.floor((((e.clientX - pointX.value) / width) * (props.max - props.min)) / props.step) *
          props.step,
    ),
  );

  isMouseDown.value = false;
};
onMounted(() => {
  window.addEventListener('mousemove', onMouseMove);
  window.addEventListener('mouseup', onMouseUp);
});
</script>
<style scoped lang="scss">
.mj-slider {
  user-select: none;
  .mj-slider-track {
    width: 100%;
    height: 14px;
    position: relative;
    &::before {
      position: absolute;
      left: 0;
      top: 6px;
      right: 0;
      content: '';
      height: 2px;
      background-color: var(--mj-slider-bg-color);
    }
    .mj-slider-bar {
      position: absolute;
      left: 0;
      top: 6px;
      right: 0;
      height: 2px;
      background-color: var(--mj-slider-active-color);
    }
    .mj-slider-btn {
      position: absolute;
      left: 0;
      top: 0;
      transform: translateX(-50%);
      height: 14px;
      width: 14px;
      border-radius: 50%;
      border: 2px solid var(--mj-slider-active-color);
      background-color: #fff;
    }
  }
}
</style>
