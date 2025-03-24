<template>
  <div class="chinese-combination">
    <div class="combination-workbench">
      <div
        v-if="selectedShape"
        class="combination-selected-progress"
        :style="{
          width: selectedShape.size * 48 + 'px',
          height: selectedShape.size * 48 + 'px',
          transform: `scale(${Math.min(1, 5 / selectedShape.size)},${Math.min(1, 5 / selectedShape.size)})`,
        }"
      >
        <dd v-for="text in selectedShape.text.unlockProgress.list" :key="text.text">
          {{ text.locked ? '?' : text.text }}
        </dd>
      </div>
      <div class="combination-canvas" ref="canvasRef"></div>
    </div>
    <div class="chinese-list-scroll">
      <div class="chinese-list">
        <div
          v-for="item in showUnlockTextList"
          :key="item.text"
          class="text-item"
          :data-text="item.text"
          @click="addText(item)"
        >
          <div
            class="text-item-progress"
            :style="{
              width:
                item.unlockProgress.list.length === 0
                  ? '100%'
                  : `${(item.unlockProgress.unlockNum * 100) / item.unlockProgress.list.length}%`,
            }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ShapeRender } from '@/lib/canvas';
import { onMounted, ref } from 'vue';
import TextGroupShape from './TextGroupShape';
import combination from './chinese.json';
// import pinyin from 'pinyin';
import type { ShowTextItem, TextItem } from './interface';
import useCombination from './useCombination';

const canvasRef = ref<HTMLDivElement>();
const render = ref<ShapeRender>(
  new ShapeRender({
    allowDrop: true,
  }),
);
const texts = combination.map((el) => el.text).join('');
let ttt = texts;
let ddd = '';
while (ttt.length) {
  const el = ttt[0];
  ttt = ttt.slice(1);
  if (ttt.includes(el)) {
    console.log(el);
    ddd += el;
    ttt = ttt.replace(new RegExp(el, 'g'), '');
  }
}
console.log(ddd);

combination.forEach((el) => {
  if (
    el.combination &&
    el.combination.some((el) => !texts.includes(el[0]) || !texts.includes(el[1]))
  ) {
    console.log(el);
  }
});
const { combinationText, showUnlockTextList, getShowTextItem } = useCombination({ combination });

TextGroupShape.onCombination = ({ data = [] }) => {
  const res = combinationText(data.map((el) => el.text));
  if (res.length > 0) {
    data.forEach((el) => el.remove());
    res.forEach(addShape);
    render.value.render();
  }
};
TextGroupShape.onShapeRemove = () => {
  render.value.render();
};
const selectedShape = ref<{ text: ShowTextItem; size: number } | null>(null);
TextGroupShape.onShapeMouseDown = (e) => {
  const text = getShowTextItem((e.target as TextGroupShape).text);
  selectedShape.value = {
    text,
    size: Math.ceil(Math.sqrt(text.unlockProgress.list.length)),
  };
};
const logFlag = false;
if (logFlag) {
  console.log(texts);
  console.log(
    texts.replace(
      new RegExp(
        `(${combination
          .reduce((prev, el) => prev + (el.combination || []).join(''), '')
          .split('')
          .join('|')})`,
        'g',
      ),
      '',
    ),
  );
  const v = combination.filter((el) => !el.combination).length;
  console.log(combination.length, v, Math.round((v / combination.length) * 10000) / 100 + '%');
}

const addShape = (textItem: TextItem) => {
  const t = new TextGroupShape({
    x: render.value.width / 2 - Math.floor(Math.random() * 40),
    y: render.value.height / 2 - Math.floor(Math.random() * 50),
    text: textItem.text,
  });
  render.value.addShape(t);
};
const addText = (textItem: TextItem) => {
  addShape(textItem);
  render.value.render();
};

onMounted(() => {
  if (canvasRef.value) {
    render.value.setCanvasSize({
      width: canvasRef.value.offsetWidth,
      height: canvasRef.value.offsetHeight,
    });
    canvasRef.value.appendChild(render.value.canvasEle);
    render.value.render();
  }
});
</script>
<style scoped lang="scss">
.chinese-combination {
  background-color: #222;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  display: flex;

  .combination-workbench {
    width: calc(100vw - 315px);
    height: 100%;
    position: relative;
    .combination-canvas {
      position: relative;
      z-index: 9;
      width: 100%;
      height: 100%;
    }
    .combination-selected-progress {
      position: absolute;
      right: 20px;
      top: 20px;
      width: 100px;
      height: 100px;
      z-index: 8;
      color: #fff;
      transform-origin: right top;
      display: flex;
      flex-wrap: wrap;
      opacity: 0.618;
      pointer-events: none;
      dd {
        margin: 0;
        width: 48px;
        font-size: 36px;
        height: 48px;
        line-height: 48px;
        text-align: center;
        flex: 0 0 48px;
      }
    }
  }
  .chinese-list-scroll {
    width: 315px;
    height: 100%;
    border-left: 1px solid #fff;
    box-sizing: border-box;
    padding: 8px 0px 8px 4px;
    overflow: auto;
    .chinese-list {
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      align-items: flex-start;
      .text-item {
        width: 58px;
        height: 74px;
        box-sizing: border-box;
        border: 1px solid #000;
        color: #fff;
        background-color: #333;
        margin-right: 4px;
        margin-bottom: 8px;
        position: relative;
        z-index: 1;
        .text-item-progress {
          position: absolute;
          left: 0;
          top: 0;
          height: 100%;
          background-color: orange;
          z-index: 0;
        }
        &::after {
          content: attr(data-text);
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          z-index: 9;
          line-height: 74px;
          font-size: 28px;
          text-align: center;
        }
      }
    }
  }
}
</style>
