<template>
  <div class="color-generator" :style="{ backgroundColor: selectedColor }">
    <div class="color-list">
      <div
        v-for="(color, index) in colors"
        :key="index"
        class="color-item"
        :style="{ backgroundColor: color }"
        @click="selectColor(color)"
      >
        <span>{{ color }}</span>
      </div>
    </div>
    <button @click="generateColorList">生成颜色</button>
  </div>
</template>
<script lang="ts" setup>
import message from '@/components/MjMessage';
import { ref } from 'vue';

const generateColor = () => {
  const color = ('000000' + Math.floor(Math.random() * 16777215).toString(16)).slice(-6);
  return `#${color}`;
};
const colors = ref<string[]>([]);
const generateColorList = () => {
  const colorList = [];
  for (let i = 0; i < 24; i++) {
    colorList.push(generateColor());
  }
  colors.value = colorList;
};
generateColorList();
const selectedColor = ref('');
const selectColor = (color: string) => {
  selectedColor.value = color;
  navigator.clipboard.writeText(color).then(() => {
    message.success(`颜色\`${color}\`已复制到剪贴板`);
  });
};
</script>
<style scoped lang="scss">
.color-generator {
  height: 100vh;
  overflow: auto;
  .color-list {
    display: flex;
    flex-wrap: wrap;
    width: 1152px;
    margin: 0 auto;
    padding-top: calc(50vh - 360px);
    .color-item {
      width: calc(100% / 6 - 20px);
      margin-right: 24px;
      height: 100px;
      margin-bottom: 24px;
      padding-top: 64px;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 0 10px 1px rgba($color: #000000, $alpha: 0.3);
      cursor: pointer;
      transition: transform 0.3s;
      &:nth-child(6n) {
        margin-right: 0;
      }
      span {
        display: block;
        line-height: 36px;
        font-size: 16px;
        text-align: center;
        background-color: #fff;
        font-weight: bold;
      }
      &:hover {
        transform: scale(1.1);
      }
    }
  }
  button {
    width: 200px;
    height: 48px;
    line-height: 48px;
    text-align: center;
    border-radius: 24px;
    border: none;
    background-color: #9c55dc;
    color: #fff;
    font-size: 18px;
    font-weight: bold;
    margin: 24px auto;
    display: block;
    cursor: pointer;
    box-shadow: 0 0 10px 1px rgba($color: #000000, $alpha: 0.3);
  }
}
@media screen and (max-width: 1200px) {
  .color-generator {
    .color-list {
      width: calc(100vw - 48px);
      margin: 0 auto;
    }
  }
}

@media screen and (max-height: 840px) {
  .color-generator {
    .color-list {
      padding-top: 48px;
    }
  }
}
</style>
