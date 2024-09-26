<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div
    data-body-overflow="hidden"
    class="merge2048"
    :style="{
      '--merge2048-cols': cols,
      '--merge2048-gap': `${6 - cols / 2}px`,
    }"
  >
    <div class="merge2048-title" @mousedown.stop @touchstart.stop>
      <dt>2048</dt>
      <p>方向键、W/A/S/D、鼠标或手指滑动屏幕来控制数字移动</p>
    </div>
    <div class="merge2048-bar" @mousedown.stop @touchstart.stop>
      <dl class="merge2048-bar-btns">
        <button style="color: hsl(120, 100%, 40%)" @click="toggleSize(4)">4 x 4</button>
        <button style="color: hsl(240, 100%, 40%)" @click="toggleSize(6)">6 x 6</button>
        <button style="color: hsl(0, 100%, 40%)" @click="toggleSize(8)">8 x 8</button>
      </dl>
      <dl class="merge2048-scores">
        <div class="merge2048-score">
          <div>当前分数：{{ score }}</div>
          <div>最高分数：{{ hightScore }}</div>
        </div>
        <button @click="toggleSize(cols, true)">重新开始</button>
      </dl>
    </div>
    <div class="merge2048-board">
      <template v-for="(rows, i) in cells">
        <div class="merge2048-cell" v-for="(cell, j) in rows" :key="`cell-${i}-${j}`">
          <div
            class="merge2048-content"
            :style="{
              borderRadius: (Math.max(3, (cell || '').toString().length) / 3) * 8 + 'px',
              width: (Math.max(3, (cell || '').toString().length) / 3) * 100 + '%',
              height: (Math.max(3, (cell || '').toString().length) / 3) * 100 + '%',
              lineHeight: (Math.max(3, (cell || '').toString().length) / 3) * 2,
              transform: `scale(${3 / Math.max(3, (cell || '').toString().length)})`,
              color: `hsl(${(360 * 10 + 120 - Math.log2(cell || 1) * 18) % 360}, 100%, 40%)`,
            }"
          >
            {{ cell || '' }}
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { onBeforeUnmount } from 'vue';
import { onMounted } from 'vue';
import { ref } from 'vue';
import MjMessage from '@/components/MjMessage/mjmessage.ts';

const merge2048JSON = localStorage.getItem('merge2048');
let merge2048Obj = {
  4: { hightScore: 0, score: 0, arr: [] as number[], lv: 1 },
  6: { hightScore: 0, score: 0, arr: [] as number[], lv: 1 },
  8: { hightScore: 0, score: 0, arr: [] as number[], lv: 1 },
  prev: 4 as 4 | 6 | 8,
};
if (merge2048JSON) {
  try {
    merge2048Obj = JSON.parse(merge2048JSON);
  } catch (error) {
    /* empty */
  }
}
const merge2048Record = ref(merge2048Obj);

const prevObj = merge2048Obj[merge2048Obj.prev as 4 | 6 | 8];

const score = ref(prevObj.score);
const hightScore = ref(prevObj.hightScore);
const cols = ref<4 | 6 | 8>(merge2048Obj.prev);
const maxNum = ref(Math.pow(2, prevObj.lv));
const maxLevel = ref(prevObj.lv);
const weights = [6917, 3018, 64, 1];
const sumWeight = ref(weights.slice(0, prevObj.lv).reduce((p, el) => p + el, 0));
const cells = ref<number[][]>([]);

const createNums = (n = 1) => {
  for (let i = 0; i < n; i++) {
    let ii = Math.floor(Math.random() * cols.value * cols.value);
    let x = Math.floor(ii / cols.value);
    let y = ii % cols.value;
    while (cells.value[x][y] !== 0) {
      ii = Math.floor(Math.random() * cols.value * cols.value);
      x = Math.floor(ii / cols.value);
      y = ii % cols.value;
    }
    if (maxLevel.value <= 2) {
      cells.value[x][y] = 2;
    } else {
      let r = Math.random() * sumWeight.value;
      for (let i = 3; i < Math.min(6, maxLevel.value) && r > 0; i++) {
        r -= weights[i - 2];
        if (r <= 0) {
          cells.value[x][y] = Math.pow(2, i - 1);
          console.log(Math.pow(2, i - 1));
        }
      }
      if (r > 0) {
        cells.value[x][y] = 2;
      }
    }
  }
};
const initCells = (reset = false) => {
  const prevRecord = merge2048Record.value[cols.value as 4 | 6 | 8];
  cells.value = [];
  for (let i = 0; i < cols.value; i++) {
    const arr: number[] = [];
    for (let j = 0; j < cols.value; j++) {
      arr.push(prevRecord.arr[i * cols.value + j] || 0);
    }
    cells.value.push(arr);
  }
  if (reset) {
    createNums();
  }
};
initCells(merge2048Record.value[cols.value as 4 | 6 | 8].arr.length === 0);
const saveData = () => {
  merge2048Record.value[cols.value as 4 | 6 | 8] = {
    hightScore: hightScore.value,
    score: score.value,
    arr: cells.value.reduce((prev, el) => [...prev, ...el], []),
    lv: maxLevel.value,
  };
  localStorage.setItem('merge2048', JSON.stringify(merge2048Record.value));
};
const toggleSize = (size: 4 | 6 | 8, reset = false) => {
  if (reset) {
    cols.value = size;
    score.value = 0;
    maxNum.value = 2;
    maxLevel.value = 1;
    sumWeight.value = weights[0];
    merge2048Record.value[cols.value as 4 | 6 | 8].arr = [];
    initCells(true);
    saveData();
  } else if (size !== cols.value) {
    const prevRecord = merge2048Obj[size];
    score.value = prevRecord.score;
    hightScore.value = prevRecord.hightScore;
    cols.value = size;
    maxLevel.value = prevRecord.lv;
    maxNum.value = Math.pow(2, maxLevel.value);
    sumWeight.value = weights.slice(0, maxLevel.value).reduce((p, el) => p + el, 0);
    initCells(merge2048Record.value[cols.value as 4 | 6 | 8].arr.length === 0);
    merge2048Record.value.prev = size;
    saveData();
  }
};
const mergeNum = (list: number[]) => {
  let startIndex = 0;
  let flag = false;
  for (let i = 1; i < cols.value; i++) {
    if (list[i] !== 0) {
      for (let j = i - 1; j >= startIndex; j--) {
        if (list[j] === 0) {
          list[j] = list[j + 1];
          list[j + 1] = 0;
          flag = true;
        } else if (list[j] === list[j + 1]) {
          list[j] *= 2;
          if (list[j] > maxNum.value) {
            maxNum.value = list[j];
            maxLevel.value = Math.log2(maxNum.value);
            if (maxLevel.value < 6 && maxLevel.value > 2) {
              sumWeight.value = weights
                .slice(0, maxLevel.value - 1)
                .reduce((prev, el) => prev + el, 0);
            }
          }
          score.value += list[j];
          if (score.value > hightScore.value) {
            hightScore.value = score.value;
          }
          list[j + 1] = 0;
          startIndex = j + 1;
          flag = true;
          break;
        } else {
          break;
        }
      }
    }
  }
  return flag;
};

const checkGameOver = () => {
  const rows: number[][][] = [[], [], [], []];
  for (let i = 0; i < cols.value; i++) {
    const arr: number[][] = [[], [], [], []];
    for (let j = 0; j < cols.value; j++) {
      arr[0].push(cells.value[j][i]);
      arr[1].push(cells.value[i][j]);
      arr[2].push(cells.value[cols.value - 1 - j][i]);
      arr[3].push(cells.value[i][cols.value - 1 - j]);
    }
    rows[0].push(arr[0]);
    rows[1].push(arr[1]);
    rows[2].push(arr[2]);
    rows[3].push(arr[3]);
  }
  for (let i = 0; i < cols.value; i++) {
    for (let j = 0; j < 4; j++) {
      if (mergeNum(rows[j][i])) {
        return false;
      }
    }
  }
  return true;
};

const move = (direction: 'left' | 'right' | 'up' | 'down') => {
  const rows: number[][] = [];
  let canMove = false;
  for (let i = 0; i < cols.value; i++) {
    const arr = [];
    for (let j = 0; j < cols.value; j++) {
      let item = -1;
      switch (direction) {
        case 'up':
          item = cells.value[j][i];
          break;
        case 'left':
          item = cells.value[i][j];
          break;
        case 'down':
          item = cells.value[cols.value - 1 - j][i];
          break;
        case 'right':
          item = cells.value[i][cols.value - 1 - j];
          break;
      }
      arr.push(item);
    }
    rows.push(arr);
  }
  for (let i = 0; i < cols.value; i++) {
    if (mergeNum(rows[i])) {
      canMove = true;
    }
  }
  if (canMove) {
    for (let i = 0; i < cols.value; i++) {
      for (let j = 0; j < cols.value; j++) {
        switch (direction) {
          case 'up':
            cells.value[j][i] = rows[i][j];
            break;
          case 'left':
            cells.value[i][j] = rows[i][j];
            break;
          case 'down':
            cells.value[cols.value - 1 - j][i] = rows[i][j];
            break;
          case 'right':
            cells.value[i][cols.value - 1 - j] = rows[i][j];
            break;
        }
      }
    }
    createNums();

    saveData();
  }
  if (checkGameOver()) {
    MjMessage.error('游戏结束');
  }
};
const point = ref<{ x: number; y: number } | null>(null);
const onKeyup = (e: KeyboardEvent) => {
  switch (e.key) {
    case 'ArrowUp':
    case 'w':
      move('up');
      break;
    case 'ArrowLeft':
    case 'a':
      move('left');
      break;
    case 'ArrowDown':
    case 's':
      move('down');
      break;
    case 'ArrowRight':
    case 'd':
      move('right');
      break;
  }
};
const onMouseDown = (e: MouseEvent) => {
  point.value = { x: e.clientX, y: e.clientY };
};
const onMouseUp = (e: MouseEvent) => {
  if (point.value) {
    const changeX = e.clientX - point.value.x;
    const changeY = e.clientY - point.value.y;
    if (changeX !== 0 && changeY !== 0) {
      if (Math.abs(changeX) > Math.abs(changeY)) {
        if (changeX > 0) {
          move('right');
        } else {
          move('left');
        }
      } else if (changeY > 0) {
        move('down');
      } else {
        move('up');
      }
    }
    point.value = null;
  }
};
const onTouchStart = (e: TouchEvent) => {
  point.value = { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY };
};
const onTouchEnd = (e: TouchEvent) => {
  if (point.value) {
    const changeX = e.changedTouches[0].clientX - point.value.x;
    const changeY = e.changedTouches[0].clientY - point.value.y;
    if (changeX !== 0 && changeY !== 0) {
      if (Math.abs(changeX) > Math.abs(changeY)) {
        if (changeX > 0) {
          move('right');
        } else {
          move('left');
        }
      } else if (changeY > 0) {
        move('down');
      } else {
        move('up');
      }
    }
    point.value = null;
  }
};
onMounted(() => {
  window.addEventListener('keyup', onKeyup);
  window.addEventListener('mousedown', onMouseDown);
  window.addEventListener('mouseup', onMouseUp);
  window.addEventListener('touchstart', onTouchStart);
  window.addEventListener('touchend', onTouchEnd);
});
onBeforeUnmount(() => {
  window.removeEventListener('keyup', onKeyup);
  window.removeEventListener('mousedown', onMouseDown);
  window.removeEventListener('mouseup', onMouseUp);
  window.removeEventListener('touchstart', onTouchStart);
  window.removeEventListener('touchend', onTouchEnd);
});
</script>
<style scoped lang="scss">
.merge2048 {
  --merge2048-board-size: 400px;
  --merge2048-gap: 4px;
  --merge2048-top: 56%;
  user-select: none;
  overflow: hidden;
  height: 100%;
  .merge2048-title {
    position: absolute;
    width: var(--merge2048-board-size);
    top: calc(var(--merge2048-top) - var(--merge2048-board-size) / 2 - 220px);
    left: 50%;
    transform: translateX(-50%);
    text-align: center;
    dt {
      font-size: 42px;
      font-weight: bold;
      color: #ffd900;
    }
    p {
      font-size: 12px;
      color: #999;
    }
  }
  .merge2048-bar {
    position: absolute;
    width: var(--merge2048-board-size);
    top: calc(var(--merge2048-top) - var(--merge2048-board-size) / 2 - 120px);
    left: 50%;
    transform: translateX(-50%);
    .merge2048-bar-btns {
      display: flex;
      gap: 5%;
      button {
        width: 30%;
        border-radius: 8px;
        border: none;
        background-color: #ebe6c1;
        height: 48px;
        font-size: 24px;
        cursor: pointer;
      }
    }
    .merge2048-scores {
      padding: 12px 0;
      font-size: 16px;
      display: flex;
      justify-content: space-between;
      .merge2048-score {
        line-height: 20px;
        &:first-child {
          margin-bottom: 8px;
        }
      }
      button {
        width: 30%;
        border-radius: 8px;
        border: none;
        background-color: #ebe6c1;
        height: 48px;
        font-size: 18px;
        cursor: pointer;
      }
    }
  }
  .merge2048-board {
    --merge2048-size: calc(var(--merge2048-board-size) / var(--merge2048-cols));
    position: absolute;
    left: 50%;
    top: var(--merge2048-top);
    transform: translate(-50%, -50%);
    display: flex;
    width: calc(var(--merge2048-board-size) + var(--merge2048-gap) * 2);
    height: calc(var(--merge2048-board-size) + var(--merge2048-gap) * 2);
    box-sizing: border-box;
    flex-wrap: wrap;
    padding: var(--merge2048-gap);
    background-color: #d4d0d0;
    border-radius: calc(var(--merge2048-gap) * 2);
    .merge2048-cell {
      width: var(--merge2048-size);
      height: var(--merge2048-size);
      box-sizing: border-box;
      padding: var(--merge2048-gap);
      font-size: calc(var(--merge2048-size) / 2 - var(--merge2048-gap));
      .merge2048-content {
        width: 100%;
        height: 100%;
        transform-origin: left top;
        background-color: #fff;
        border-radius: calc(var(--merge2048-gap) * 2);
        text-align: center;
        line-height: 2;
      }
    }
  }
}

@media screen and (max-width: 450px) {
  .merge2048 {
    --merge2048-board-size: 92vw;
  }
}
@media screen and (max-height: 690px) {
  .merge2048 {
    --merge2048-top: 414px;
    --merge2048-top: max(60%, 414px);
  }
}
</style>
