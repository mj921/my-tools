<template>
  <div class="mine-clearance">
    <div class="mine-clearance-btn-bar" :style="{ width: `${cols * 20 + 26}px` }">
      <template v-if="gameStatus === 'init'">
        <mine-clearance-popper>
          <button>开始游戏</button>
          <template #content>
            <ul class="mine-clearance-difficulty">
              <li
                v-for="item in difficutyList"
                :key="'difficuty' + item.key"
                @click="startGame(item.key)"
              >
                {{ item.label }}
              </li>
            </ul>
          </template>
        </mine-clearance-popper>
        <button @click="visible = true">记录</button>
      </template>
      <template v-else-if="['playing', 'paused'].includes(gameStatus)">
        <mine-clearance-popper>
          <button>重新开始</button>
          <template #content>
            <ul class="mine-clearance-difficulty">
              <li
                v-for="item in difficutyList"
                :key="'difficuty' + item.key"
                @click="startGame(item.key)"
              >
                {{ item.label }}
              </li>
            </ul>
          </template>
        </mine-clearance-popper>
        <button @click="togglePlay">
          {{ gameStatus === 'playing' ? '暂停' : '继续' }}
        </button>
        <button @click="backMain">主菜单</button>
      </template>
    </div>
    <div class="mine-clearance-status-bar">
      <div class="mine-clearance-status-bar-box" :style="{ width: `${cols * 20 - 8}px` }">
        <mj-electronic-numbers
          is-time
          :value="Math.floor(time / 1000)"
          :width="2"
          :size="6"
          :offset="1"
          :padding-block="4"
          :padding-inline="2"
          :box-padding-inline="4"
        />
        <mj-electronic-numbers
          :value="nums - types"
          :width="2"
          :size="6"
          :offset="1"
          :padding-block="4"
          :padding-inline="2"
          :box-padding-inline="4"
          :min-num-count="nums > 99 ? 3 : 2"
        />
      </div>
    </div>
    <div class="mine-clearance-box">
      <div class="mc-panel" :style="{ width: `${cols * 20}px` }">
        <template v-for="(rows, i) in cells">
          <dl
            v-for="(cell, j) in rows"
            :key="`cell-${i}-${j}`"
            :data-kkk="`cell-${cell.x}-${cell.y}`"
            :data-iii="`cell-${i}-${j}`"
            :class="{
              open: cell.type === MineClearanceCellType.Opened,
              mark: cell.type === MineClearanceCellType.Mark,
              flicker:
                flickerArroundCell &&
                cell.type !== MineClearanceCellType.Opened &&
                cell.arroundCells.includes(flickerArroundCell),
            }"
            @click="onClick(i, j, $event)"
            @click.right="markCell(i, j, $event)"
          >
            <template v-if="cell.type === MineClearanceCellType.Opened">
              <img src="@/assets/icons/Games/MineClearance/mine.svg" v-if="cell.status === -1" />
              <span v-else>{{ cell.status || '' }}</span>
            </template>
            <img
              src="@/assets/icons/Games/MineClearance/mark.svg"
              v-else-if="cell.type === MineClearanceCellType.Mark"
            />
          </dl>
        </template>
      </div>
    </div>
    <div class="mc-dialog" v-show="visible">
      <div class="mc-dialog-mask">
        <div class="mc-dialog-box">
          <img
            class="mc-dialog-close"
            src="@/assets/icons/Games/FlipCard/close.svg"
            @click="visible = false"
          />
          <div class="mc-dialog-difficulties">
            <dl
              v-for="item in difficutyList"
              :key="`dialog-difficultiy${item.key}`"
              :class="{ 'mc-dialog-difficulties--active': dialogType === item.key }"
              @click="dialogType = item.key"
            >
              {{ item.label }}
            </dl>
          </div>
          <hr />
          <div class="mc-dialog-info">
            <dl><label for="">总次数</label>{{ historyRecord[dialogType].playNum || 0 }}</dl>
            <dl><label for="">胜利次数</label>{{ historyRecord[dialogType].successNum || 0 }}</dl>
            <dl>
              <label for="">胜率</label>
              {{
                (historyRecord[dialogType].playNum || 0) > 0
                  ? (
                      ((historyRecord[dialogType].successNum || 0) /
                        (historyRecord[dialogType].playNum || 0)) *
                      100
                    ).toFixed(2)
                  : 0
              }}%
            </dl>
          </div>
          <hr />
          <div class="mc-dialog-tabs">
            <dl
              key="best"
              :class="{ 'mc-dialog-tab--active': currentDialogTab === 'best' }"
              @click="currentDialogTab = 'best'"
            >
              用时最短
            </dl>
            <dl
              key="worst"
              :class="{ 'mc-dialog-tab--active': currentDialogTab === 'worst' }"
              @click="currentDialogTab = 'worst'"
            >
              用时最长
            </dl>
            <dl
              key="latest"
              :class="{ 'mc-dialog-tab--active': currentDialogTab === 'latest' }"
              @click="currentDialogTab = 'latest'"
            >
              最近游戏
            </dl>
          </div>
          <div class="mc-dialog-lists" v-if="dialogType && historyRecord[dialogType]">
            <ul
              :class="{
                'mc-dialog-list': true,
                'mc-dialog-list--active': currentDialogTab === 'best',
              }"
            >
              <li>
                <dd>用时</dd>
                <dd>时间</dd>
              </li>
              <li v-for="(item, i) in historyRecord[dialogType].best" :key="`best-${i}`">
                <dd
                  v-html="
                    millisecondsToMinutes(item[0], true).replace(/(\.\d{3})$/, '<small>$1</small>')
                  "
                ></dd>
                <dd>{{ item[1] ? dateFmt('YYYY-MM-DD HH:mm:ss', new Date(item[1])) : '-' }}</dd>
              </li>
            </ul>
            <ul
              :class="{
                'mc-dialog-list': true,
                'mc-dialog-list--active': currentDialogTab === 'worst',
              }"
            >
              <li>
                <dd>用时</dd>
                <dd>时间</dd>
              </li>
              <li v-for="(item, i) in historyRecord[dialogType].worst" :key="`worst-${i}`">
                <dd
                  v-html="
                    millisecondsToMinutes(item[0], true).replace(/(\.\d{3})$/, '<small>$1</small>')
                  "
                ></dd>
                <dd>{{ item[1] ? dateFmt('YYYY-MM-DD HH:mm:ss', new Date(item[1])) : '-' }}</dd>
              </li>
            </ul>
            <ul
              :class="{
                'mc-dialog-list': true,
                'mc-dialog-list--active': currentDialogTab === 'latest',
              }"
            >
              <li>
                <dd>用时</dd>
                <dd>时间</dd>
              </li>
              <li v-for="(item, i) in historyRecord[dialogType].latest" :key="`latest-${i}`">
                <dd
                  v-html="
                    millisecondsToMinutes(item[0], true).replace(/(\.\d{3})$/, '<small>$1</small>')
                  "
                ></dd>
                <dd>{{ item[1] ? dateFmt('YYYY-MM-DD HH:mm:ss', new Date(item[1])) : '-' }}</dd>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div class="mc-toast" v-show="!!finishInfo">
      {{ finishInfo }}
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import MineClearanceCell, { MineClearanceCellType } from './MineClearanceCell';
import MineClearancePopper from './MineClearancePopper';
import MjElectronicNumbers from '@/components/MjElectronicNumbers/MjElectronicNumbers.vue';
import { addZero } from '@/utils';
import { dateFmt } from '@/utils/date';

type DifficutyType = '简单' | '中等' | '困难' | '极难';

const difficulty: Record<
  string,
  {
    rows: number;
    cols: number;
    nums: number;
  }
> = {
  简单: {
    rows: 9,
    cols: 9,
    nums: 10,
  },
  中等: {
    rows: 16,
    cols: 16,
    nums: 40,
  },
  困难: {
    rows: 16,
    cols: 30,
    nums: 99,
  },
  极难: {
    rows: 24,
    cols: 30,
    nums: 180,
  },
};
const historyJson = localStorage.getItem('mineClearanceRecord');
// const oldVersion = ref(+(localStorage.getItem('mineClearanceVersion') || '') || 1);
const version = 1;

let historyObj = {
  简单: {
    best: [],
    worst: [],
    latest: [],
    playNum: 0,
    successNum: 0,
  },
  中等: {
    best: [],
    worst: [],
    latest: [],
    playNum: 0,
    successNum: 0,
  },
  困难: {
    best: [],
    worst: [],
    latest: [],
    playNum: 0,
    successNum: 0,
  },
  极难: {
    best: [],
    worst: [],
    latest: [],
    playNum: 0,
    successNum: 0,
  },
};
localStorage.setItem('mineClearanceVersion', version.toString());

if (historyJson) {
  try {
    historyObj = JSON.parse(historyJson);
  } catch (error) {
    /* empty */
  }
}

const historyRecord = ref<
  Record<
    DifficutyType,
    {
      best: number[][];
      worst: number[][];
      latest: number[][];
      playNum: number;
      successNum: number;
    }
  >
>(historyObj);

const difficutyList: {
  key: DifficutyType;
  label: DifficutyType;
}[] = [
  { key: '简单', label: '简单' },
  { key: '中等', label: '中等' },
  { key: '困难', label: '困难' },
  { key: '极难', label: '极难' },
];

const visible = ref(false);
const dialogType = ref<DifficutyType>('简单');
const currentDialogTab = ref('best');
const finishInfo = ref('');

const cells = ref<MineClearanceCell[][]>([]);
/** 行数 */
const rows = ref(9);
/** 列数 */
const cols = ref(9);
/** 炸弹数 */
const nums = ref(10);
/** 剩余格子数 */
const remaining = ref(0);
/** 标技数 */
const types = ref(0);
const currDifficulty = ref<DifficutyType>('简单');
const time = ref(0);
const oldTime = ref(0);
const startTime = ref(0);
const gameStatus = ref('init');
const sto = ref<number>(0);
const flickerArroundCell = ref<MineClearanceCell | null>(null);

const millisecondsToMinutes = (t = 0, showMilliseconds = false) =>
  `${addZero(Math.floor(t / 60000))}:${addZero(Math.floor((t % 60000) / 1000))}${showMilliseconds ? `.${addZero(t % 1000, 3)}` : ''}`;

const createCells = () => {
  cells.value = [];
  for (let i = 0; i < rows.value; i++) {
    const cs: MineClearanceCell[] = [];
    for (let j = 0; j < cols.value; j++) {
      cs.push(new MineClearanceCell(i, j, 0));
    }
    cells.value.push(cs);
  }
  const arr: number[] = [];
  let r = 0;
  arr[0] = Math.floor(Math.random() * rows.value * cols.value);
  cells.value[arr[0] % rows.value][Math.floor(arr[0] / rows.value)].status = -1;
  while (arr.length < nums.value) {
    r = Math.floor(Math.random() * rows.value * cols.value);
    if (!arr.includes(r)) {
      cells.value[r % rows.value][Math.floor(r / rows.value)].status = -1;
      arr.push(r);
    }
  }

  for (let i = 0; i < rows.value; i++) {
    for (let j = 0; j < cols.value; j++) {
      const flag = cells.value[i][j].status === -1;
      if (i > 0) {
        if (j > 0) {
          if (flag && cells.value[i - 1][j - 1].status > -1) {
            cells.value[i - 1][j - 1].status++;
          }
          cells.value[i - 1][j - 1].arroundCells.push(cells.value[i][j]);
        }
        if (flag && cells.value[i - 1][j].status > -1) {
          cells.value[i - 1][j].status++;
        }
        cells.value[i - 1][j].arroundCells.push(cells.value[i][j]);
        if (j < cols.value - 1) {
          if (flag && cells.value[i - 1][j + 1].status > -1) {
            cells.value[i - 1][j + 1].status++;
          }
          cells.value[i - 1][j + 1].arroundCells.push(cells.value[i][j]);
        }
      }
      if (i < rows.value - 1) {
        if (j > 0) {
          if (flag && cells.value[i + 1][j - 1].status > -1) {
            cells.value[i + 1][j - 1].status++;
          }
          cells.value[i + 1][j - 1].arroundCells.push(cells.value[i][j]);
        }
        if (flag && cells.value[i + 1][j].status > -1) {
          cells.value[i + 1][j].status++;
        }
        cells.value[i + 1][j].arroundCells.push(cells.value[i][j]);
        if (j < cols.value - 1) {
          if (flag && cells.value[i + 1][j + 1].status > -1) {
            cells.value[i + 1][j + 1].status++;
          }
          cells.value[i + 1][j + 1].arroundCells.push(cells.value[i][j]);
        }
      }

      if (j > 0) {
        if (flag && cells.value[i][j - 1].status > -1) {
          cells.value[i][j - 1].status++;
        }
        cells.value[i][j - 1].arroundCells.push(cells.value[i][j]);
      }
      if (j < cols.value - 1) {
        if (flag && cells.value[i][j + 1].status > -1) {
          cells.value[i][j + 1].status++;
        }
        cells.value[i][j + 1].arroundCells.push(cells.value[i][j]);
      }
    }
  }
};
const init = () => {
  createCells();
};
const togglePlay = () => {
  const now = Date.now();
  if (gameStatus.value === 'playing') {
    gameStatus.value = 'paused';
    oldTime.value += now - startTime.value;
    time.value = oldTime.value;
    if (sto.value) {
      clearTimeout(sto.value);
    }
  } else if (gameStatus.value === 'paused') {
    gameStatus.value = 'playing';
    startTime.value = now;
    sto.value = setTimeout(gameTimeLoop, 1000);
  }
};
const gameTimeLoop = () => {
  if (gameStatus.value !== 'playing') return;
  time.value = oldTime.value + Date.now() - startTime.value;

  sto.value = setTimeout(gameTimeLoop, 1000);
};
const startGame = (diff: DifficutyType = '简单') => {
  if (sto.value) {
    clearTimeout(sto.value);
  }
  currDifficulty.value = diff;
  const diffConfig = difficulty[diff];
  rows.value = diffConfig.rows;
  cols.value = diffConfig.cols;
  nums.value = diffConfig.nums;
  createCells();
  remaining.value = cols.value * rows.value;
  startTime.value = Date.now();
  oldTime.value = 0;
  time.value = 0;
  gameStatus.value = 'playing';
  types.value = 0;
  sto.value = setTimeout(gameTimeLoop, 1000);
};
init();
const backMain = () => {
  if (sto.value) {
    clearTimeout(sto.value);
  }
  finishInfo.value = '';
  time.value = 0;
  gameStatus.value = 'init';
  createCells();
};
const gameReset = (success = true) => {
  const now = Date.now();
  time.value += now - startTime.value;
  if (sto.value) {
    clearTimeout(sto.value);
  }
  gameStatus.value = 'finish';
  if (success) {
    historyRecord.value[currDifficulty.value].best.push([time.value, now]);
    historyRecord.value[currDifficulty.value].best.sort((a, b) => a[0] - b[0]);
    if (historyRecord.value[currDifficulty.value].best.length > 10) {
      historyRecord.value[currDifficulty.value].best.pop();
    }

    historyRecord.value[currDifficulty.value].worst.push([time.value, now]);
    historyRecord.value[currDifficulty.value].worst.sort((a, b) => b[0] - a[0]);
    if (historyRecord.value[currDifficulty.value].worst.length > 10) {
      historyRecord.value[currDifficulty.value].worst.pop();
    }
    historyRecord.value[currDifficulty.value].latest.unshift([time.value, now]);
    if (historyRecord.value[currDifficulty.value].latest.length > 10) {
      historyRecord.value[currDifficulty.value].latest.shift();
    }
    historyRecord.value[currDifficulty.value].successNum++;
    finishInfo.value = `通关${currDifficulty.value}难度，用时${millisecondsToMinutes(time.value)}！`;
  } else {
    finishInfo.value = '游戏结束！';
  }
  historyRecord.value[currDifficulty.value].playNum++;
  localStorage.setItem('mineClearanceRecord', JSON.stringify(historyRecord.value));
  setTimeout(() => {
    startTime.value = 0;
    finishInfo.value = '';
    time.value = 0;
    gameStatus.value = 'init';
    createCells();
  }, 2000);
};
const gameOver = () => {
  gameReset(false);
};
const checkSuccess = () => {
  if (remaining.value === nums.value) {
    gameReset();
  }
};
const openCell = (i: number, j: number) => {
  const currentCell = cells.value[i][j];
  if (currentCell.type === MineClearanceCellType.Closed) {
    remaining.value--;
    if (currentCell.status === -1) {
      currentCell.type = MineClearanceCellType.Opened;
      gameOver();
    } else if (currentCell.status === 0) {
      const arr: MineClearanceCell[] = [currentCell];
      let c = arr.shift();
      while (c) {
        c.type = MineClearanceCellType.Opened;
        c.arroundCells.forEach((arroundCell) => {
          if (arroundCell.type === MineClearanceCellType.Closed && arroundCell.status === 0) {
            arr.push(arroundCell);
          }
          if (arroundCell.type === MineClearanceCellType.Closed && arroundCell.status !== -1) {
            remaining.value--;
            arroundCell.type = MineClearanceCellType.Opened;
          }
        });
        c = arr.shift();
      }
    } else {
      currentCell.type = MineClearanceCellType.Opened;
    }
    checkSuccess();
  }
};
const markCell = (x: number, y: number, e: MouseEvent) => {
  e.preventDefault();
  if (gameStatus.value === 'playing' && cells.value[x][y].type !== MineClearanceCellType.Opened) {
    if (cells.value[x][y].type === MineClearanceCellType.Closed) {
      cells.value[x][y].type = MineClearanceCellType.Mark;
      types.value++;
    } else {
      cells.value[x][y].type = MineClearanceCellType.Closed;
      types.value--;
    }
  }
};
const hasLandmines = (targetCell: MineClearanceCell) => {
  var flag = false;
  var n = 0;
  targetCell.arroundCells.forEach((arroundCell) => {
    if (arroundCell.type === MineClearanceCellType.Mark) {
      n++;
      if (arroundCell.status !== -1) {
        flag = true;
      }
    }
  });
  if (flag && n >= targetCell.status) {
    gameOver();
    return 'gameOver';
  }
  if (!flag && n === targetCell.status) {
    return 'open';
  }
  return 'show';
};
const openArroundCell = (currentCell: MineClearanceCell) => {
  const arr: MineClearanceCell[] = [];
  currentCell.arroundCells.forEach((arroundCell) => {
    if (arroundCell.status === 0) {
      arr.push(arroundCell);
    }
    if (arroundCell.status !== -1 && arroundCell.type === MineClearanceCellType.Closed) {
      arroundCell.type = MineClearanceCellType.Opened;
      remaining.value--;
    }
  });
  let c = arr.shift();
  while (c) {
    c.type = MineClearanceCellType.Opened;
    c.arroundCells.forEach((arroundCell) => {
      if (arroundCell.type === MineClearanceCellType.Closed && arroundCell.status === 0) {
        arr.push(arroundCell);
      }
      if (arroundCell.status !== -1 && arroundCell.type === MineClearanceCellType.Closed) {
        arroundCell.type = MineClearanceCellType.Opened;
        remaining.value--;
      }
    });
    c = arr.shift();
  }
  checkSuccess();
};
const flickerArroundCells = (x: number, y: number) => {
  const currentCell = cells.value[x][y];
  if (currentCell.type === MineClearanceCellType.Opened) {
    switch (hasLandmines(currentCell)) {
      case 'open':
        openArroundCell(currentCell);
        break;
      case 'show':
        flickerArroundCell.value = currentCell;
        setTimeout(() => {
          flickerArroundCell.value = null;
        }, 300);
        break;
    }
  }
};
const onClick = (x: number, y: number, e: MouseEvent) => {
  if (gameStatus.value === 'playing') {
    if (e.altKey) {
      flickerArroundCells(x, y);
    } else {
      openCell(x, y);
    }
  }
};
</script>
<style scoped lang="scss">
.mine-clearance-difficulty {
  color: #000;
  background-color: #efefef;
  padding: 4px;
  min-width: 60px;
  text-align: center;
  line-height: 1.5;
  li {
    cursor: pointer;
    &:hover {
      background-color: #ddd;
      border-radius: 4px;
    }
  }
}
.mine-clearance {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  flex-direction: column;
  .mine-clearance-box {
    border: 10px solid #c0c0c0;
    box-sizing: content-box;
    .mc-panel {
      box-sizing: content-box;
      margin: 0 auto;
      padding: 1px;
      border-left: 3px solid #808080;
      border-top: 3px solid #808080;
      border-right: 1px solid #fff;
      border-bottom: 1px solid #fff;
      width: 500px;
      zoom: 1;
      background-color: #fff;
      &:after {
        content: '';
        display: block;
        clear: both;
      }
      dl {
        float: left;
        margin: 0 1px 1px 0;
        width: 19px;
        height: 19px;
        line-height: 18px;
        text-align: center;
        box-sizing: border-box;
        border-left: 1px solid #fff;
        border-top: 1px solid #fff;
        border-right: 2px solid #808080;
        border-bottom: 2px solid #808080;
        background-color: #c0c0c0;
        cursor: pointer;
        &.open {
          border-right: 0px solid #808080;
          border-bottom: 0px solid #808080;
          cursor: default;
          color: #427edb;
          font-size: 12px;
          font-weight: bold;
        }
        &.mark {
          border-left: 1px solid #fff;
          border-top: 1px solid #fff;
          border-right: 2px solid #808080;
          border-bottom: 2px solid #808080;
          cursor: default;
          color: #427edb;
          font-size: 12px;
          font-weight: bold;
          img {
            width: 70%;
          }
        }
        &.flicker {
          background-color: #ddd;
        }
        img {
          width: 100%;
        }
      }
    }
  }
  .mine-clearance-btn-bar {
    display: flex;
    height: 25px;
    justify-content: start;
    align-items: end;
    padding: 5px 10px 0;
    gap: 10px;
    background-color: #c0c0c0;
    button {
      width: 62px;
      border: none;
      background-color: transparent;
      box-shadow: none;
    }
  }
  .mine-clearance-status-bar {
    border: 10px solid #c0c0c0;
    box-sizing: content-box;
    .mine-clearance-status-bar-box {
      display: flex;
      justify-content: space-between;
      box-sizing: content-box;
      margin: 0 auto;
      padding: 5px;
      border-left: 3px solid #808080;
      border-top: 3px solid #808080;
      border-right: 1px solid #fff;
      border-bottom: 1px solid #fff;
      width: 500px;
      zoom: 1;
      background-color: #c0c0c0;
    }
  }

  .mc-dialog {
    position: fixed;
    width: 100vw;
    height: 100vh;
    left: 0;
    top: 0;
    .mc-dialog-mask {
      width: 100%;
      height: 100%;
      background-color: rgba($color: #000000, $alpha: 0.3);
      position: absolute;
      display: flex;
      align-items: center;
      justify-content: center;
      .mc-dialog-box {
        background-color: #fff;
        color: #000;
        width: 800px;
        height: 1000px;
        padding: 20px;
        transform: scale(0.6);
        transform-origin: 50% 50%;
        position: relative;
        .mc-dialog-close {
          position: absolute;
          right: -60px;
          top: -60px;
          width: 60px;
          cursor: pointer;
        }
        .mc-dialog-difficulties {
          font-size: 32px;
          display: flex;
          gap: 40px;
          padding: 20px;
          dl {
            width: 33%;
            text-align: center;
            line-height: 1.5;
            cursor: pointer;
            opacity: 0.8;
            &.mc-dialog-difficulties--active {
              opacity: 1;
              position: relative;
              font-weight: bold;
              font-size: larger;
              color: var(--mc-color-red);
              text-shadow: 0 0 3px #fff;
            }
          }
        }
        .mc-dialog-info {
          display: flex;
          font-size: 26px;
          padding: 20px 0;
          dl {
            width: 33%;
            align-items: center;
            text-align: center;
          }
        }
        .mc-dialog-tabs {
          font-size: 26px;
          display: flex;
          gap: 40px;
          padding: 20px;
          dl {
            width: 33.3%;
            text-align: center;
            line-height: 1.5;
            cursor: pointer;
            &.mc-dialog-tab--active {
              position: relative;
              font-weight: bold;
              &::after {
                content: '';
                position: absolute;
                bottom: -14px;
                left: 50%;
                transform: translateX(-50%);
                width: 4em;
                height: 6px;
                background-color: #fff;
              }
            }
          }
        }
        .mc-dialog-lists {
          .mc-dialog-list {
            display: none;
            font-size: 24px;
            &.mc-dialog-list--active {
              display: block;
            }
            li {
              display: flex;
              line-height: 1.9;
              dd {
                width: 33%;
                text-align: center;
                &:last-child {
                  width: 66%;
                }
                :deep small {
                  font-size: 0.9em;
                  opacity: 0.7;
                  font-weight: 275;
                }
              }
            }
          }
        }
      }
    }
  }
  .mc-toast {
    position: fixed;
    z-index: 99;
    padding: 12px 24px;
    color: #fff;
    font-size: 12px;
    left: 50%;
    transform: translateX(-50%);
    top: 50px;
    background-color: #c0c0c0;
  }
}
</style>
