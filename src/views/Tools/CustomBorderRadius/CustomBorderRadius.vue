<template>
  <div class="custom-border-radius">
    <div
      class="custom-border-radius-wrapper"
      :style="{
        width: width + 2 + 'px',
        height: height + 2 + 'px',
      }"
    >
      <div
        class="custom-border-radius-slider"
        :style="{
          left: 0,
          top: pointPosition.left + '%',
          transform: 'translate(-50%, -50%)',
        }"
        @mousedown="onMouseDown('left', $event)"
      ></div>
      <div
        class="custom-border-radius-slider"
        :style="{
          right: 0,
          top: pointPosition.right + '%',
          transform: 'translate(50%, -50%)',
        }"
        @mousedown="onMouseDown('right', $event)"
      ></div>
      <div
        class="custom-border-radius-slider"
        :style="{
          top: 0,
          left: pointPosition.top + '%',
          transform: 'translate(-50%, -50%)',
        }"
        @mousedown="onMouseDown('top', $event)"
      ></div>
      <div
        class="custom-border-radius-slider"
        :style="{
          bottom: 0,
          left: pointPosition.bottom + '%',
          transform: 'translate(-50%, 50%)',
        }"
        @mousedown="onMouseDown('bottom', $event)"
      ></div>
      <div
        class="custom-border-radius-box"
        :style="{
          borderRadius,
        }"
      ></div>
    </div>
    <div class="custom-border-radius-result">
      <label for="">border-radius:</label>
      <div class="custom-border-radius-content">
        <div class="custom-border-radius-text">{{ borderRadius }}</div>
        <div class="custom-border-radius-copy" @click="copy">复制</div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { clamp, copyTextToClipboard } from '@/utils';
import { onBeforeUnmount } from 'vue';
import { onMounted } from 'vue';
import { computed, reactive, ref } from 'vue';

const pointPosition = reactive({
  left: 29,
  top: 92,
  right: 77,
  bottom: 21,
});
const width = ref(400);
const height = ref(400);

const borderRadius = computed(
  () =>
    `${pointPosition.top}% ${100 - pointPosition.top}% ${100 - pointPosition.bottom}% ${pointPosition.bottom}% / ${pointPosition.left}% ${pointPosition.right}% ${100 - pointPosition.right}% ${100 - pointPosition.left}%`,
);
const currentType = ref<'left' | 'right' | 'top' | 'bottom'>('left');
const startPoint = ref<{ x: number; y: number } | null>(null);
const oldVal = ref(0);
const onMouseDown = (type: 'left' | 'right' | 'top' | 'bottom', e: MouseEvent) => {
  currentType.value = type;
  oldVal.value = pointPosition[type];
  startPoint.value = { x: e.clientX, y: e.clientY };
};
const onMouseMove = (e: MouseEvent) => {
  if (!startPoint.value) return;
  if (['left', 'right'].includes(currentType.value)) {
    pointPosition[currentType.value] = clamp(
      oldVal.value + Math.floor(((e.clientY - startPoint.value.y) / height.value) * 100),
      0,
      100,
    );
  }
  if (['top', 'bottom'].includes(currentType.value)) {
    pointPosition[currentType.value] = clamp(
      oldVal.value + Math.floor(((e.clientX - startPoint.value.x) / width.value) * 100),
      0,
      100,
    );
  }
};
const copy = () => {
  copyTextToClipboard(borderRadius.value);
};
const onMouseUp = (e: MouseEvent) => {
  if (!startPoint.value) return;
  if (['left', 'right'].includes(currentType.value)) {
    pointPosition[currentType.value] = clamp(
      oldVal.value + Math.floor(((e.clientY - startPoint.value.y) / height.value) * 100),
      0,
      100,
    );
  }
  if (['top', 'bottom'].includes(currentType.value)) {
    pointPosition[currentType.value] = clamp(
      oldVal.value + Math.floor(((e.clientX - startPoint.value.x) / width.value) * 100),
      0,
      100,
    );
  }
  startPoint.value = null;
};
onMounted(() => {
  window.addEventListener('mousemove', onMouseMove);
  window.addEventListener('mouseup', onMouseUp);
});
onBeforeUnmount(() => {
  window.removeEventListener('mousemove', onMouseMove);
  window.removeEventListener('mouseup', onMouseUp);
});
</script>
<style scoped lang="scss">
.custom-border-radius {
  background-color: #222;
  min-height: 100vh;
  padding-top: 1px;
  .custom-border-radius-wrapper {
    position: relative;
    margin: 100px auto 0;
    box-sizing: border-box;
    border: 1px dashed #fff;
    user-select: none;
    .custom-border-radius-slider {
      position: absolute;
      width: 16px;
      height: 16px;
      border: 2px solid #000;
      background-color: #fff;
      box-sizing: border-box;
      cursor: pointer;
      transition: all ease 0.3s;
      &:hover {
        background-color: aqua;
        box-shadow: 0 0 0 4px #fff;
      }
    }
    .custom-border-radius-box {
      background-color: #d453c9;
      width: 100%;
      height: 100%;
    }
  }
  .custom-border-radius-result {
    width: 600px;
    margin: 20px auto;
    display: flex;
    align-items: center;
    label {
      color: #fff;
      font-size: 20px;
      margin-right: 12px;
    }
    .custom-border-radius-content {
      display: flex;
      flex: 1;
      height: 50px;
      border-radius: 4px;
      background-color: #ddd;
      font-size: 18px;
      line-height: 50px;
      overflow: hidden;
      .custom-border-radius-text {
        flex: 1;
        text-align: center;
      }
      .custom-border-radius-copy {
        width: 80px;
        color: #fff;
        background-color: #d453c9;
        text-align: center;
        cursor: pointer;
      }
    }
  }
}
</style>
