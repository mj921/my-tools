<template>
  <div class="flip-card">
    <div class="flip-main" v-if="scene === 'main'">
      <div
        :class="{ 'flip-main-item': true, 'flip-main-item--active': mainCardStatus[0] === 1 }"
        @click="mainToggle(0)"
      >
        <div class="flip-main-item--front">翻</div>
        <div class="flip-main-item--back flip-main-item-record">
          <div class="flip-main-record-box">
            <dt>
              <span>记录</span>
              <img src="@/assets/icons/Games/FlipCard/rank.svg" @click="() => (visible = true)" />
            </dt>
            <template v-for="item in recordKey" :key="item.key">
              <dl :data-difficulty="item.label">
                <span>
                  <label>最快时间</label>
                  <i v-if="!record?.[item.key]?.time?.best">-</i>
                  <template v-else>
                    <b>{{ millisecondsToMinutes(record?.[item.key]?.time?.best?.[0][0]) }}</b>
                    ({{ record?.[item.key]?.time?.best?.[0][1] }})
                  </template>
                </span>
                <span>
                  <label>最慢时间</label>
                  <i v-if="!record?.[item.key]?.time?.worst?.[0]">-</i>
                  <template v-else>
                    <b>{{ millisecondsToMinutes(record?.[item.key]?.time?.worst?.[0][0]) }}</b>
                    ({{ record?.[item.key]?.time?.worst?.[0][1] }})
                  </template>
                </span>
              </dl>
              <dl :data-difficulty="`${record?.[item.key]?.count || 0}次`">
                <span>
                  <label>最少次数</label>
                  <i v-if="!record?.[item.key]?.num?.best?.[0]">-</i>
                  <template v-else>
                    <b>{{ record?.[item.key]?.num?.best?.[0][1] }}</b>
                    ({{ millisecondsToMinutes(record?.[item.key]?.num?.best?.[0][0]) }})
                  </template>
                </span>
                <span>
                  <label>最多次数</label>
                  <i v-if="!record?.[item.key]?.num?.worst?.[0]">-</i>
                  <template v-else>
                    <b>{{ record?.[item.key]?.num?.worst?.[0][1] }}</b>
                    ({{ millisecondsToMinutes(record?.[item.key]?.num?.worst?.[0][0]) }})
                  </template>
                </span>
              </dl>
            </template>
          </div>
        </div>
      </div>
      <div class="flip-main-item">
        <div class="flip-main-item--back" style="z-index: 0">转</div>
      </div>
      <div
        :class="{ 'flip-main-item': true, 'flip-main-item--active': mainCardStatus[2] === 1 }"
        @click="mainToggle(2)"
      >
        <div class="flip-main-item--front">卡</div>
        <div class="flip-main-item--back flip-main-logo">
          <img src="@/assets/icons/Games/FlipCard/flip-card.svg" />
        </div>
      </div>
      <div
        :class="{ 'flip-main-item': true, 'flip-main-item--active': mainCardStatus[3] === 1 }"
        @click="mainToggle(3)"
      >
        <div class="flip-main-item--front">片</div>
        <div class="flip-main-item--back flip-main-item-difficulties">
          <dl
            v-for="item in recordKey"
            :key="'difficulty' + item.key"
            class="flip-main-difficulty"
            @click="createGame(+item.key)"
          >
            {{ item.label }}
          </dl>
        </div>
      </div>
    </div>
    <div class="flip-game" v-else>
      <dd
        v-for="(item, i) in board"
        :key="i"
        :class="{ 'flip-game-item': true, 'flip-game-item--active': activeCard.includes(i) }"
        :style="{
          width: `${100 / boardSize}vw`,
          height: `${100 / boardSize}vh`,
          fontSize: `min(${50 / boardSize}vw, ${50 / boardSize}vh)`,
        }"
      >
        <template v-if="item">
          <div class="flip-game-item--front" @click="cardClick(i)"></div>
          <div class="flip-game-item--back">
            <img v-if="item" :src="item" :style="{ width: '1em', height: '1em' }" />
          </div>
        </template>
      </dd>
    </div>
    <div class="flip-dialog" v-show="visible">
      <div class="flip-dialog-mask">
        <div class="flip-dialog-box">
          <img
            class="flip-dialog-close"
            src="@/assets/icons/Games/FlipCard/close.svg"
            @click="visible = false"
          />
          <div class="flip-dialog-difficulties">
            <dl
              v-for="item in recordKey"
              :key="`dialog-difficultiy${item.key}`"
              :class="{ 'flip-dialog-difficulties--active': dialogType === item.key }"
              @click="dialogType = item.key"
            >
              {{ item.label }}
            </dl>
          </div>
          <div class="flip-dialog-tabs">
            <dl
              key="besttime"
              :class="{ 'flip-dialog-tab--active': currentDialogTab === 'besttime' }"
              @click="currentDialogTab = 'besttime'"
            >
              用时最短
            </dl>
            <dl
              key="bestnum"
              :class="{ 'flip-dialog-tab--active': currentDialogTab === 'bestnum' }"
              @click="currentDialogTab = 'bestnum'"
            >
              步数最少
            </dl>
            <dl
              key="worsttime"
              :class="{ 'flip-dialog-tab--active': currentDialogTab === 'worsttime' }"
              @click="currentDialogTab = 'worsttime'"
            >
              用时最长
            </dl>
            <dl
              key="worstnum"
              :class="{ 'flip-dialog-tab--active': currentDialogTab === 'worstnum' }"
              @click="currentDialogTab = 'worstnum'"
            >
              步数最多
            </dl>
            <dl
              key="latest"
              :class="{ 'flip-dialog-tab--active': currentDialogTab === 'latest' }"
              @click="currentDialogTab = 'latest'"
            >
              最近游戏
            </dl>
          </div>
          <div class="flip-dialog-lists" v-if="dialogType && record[dialogType]">
            <ul
              :class="{
                'flip-dialog-list': true,
                'flip-dialog-list--active': currentDialogTab === 'besttime',
              }"
            >
              <li>
                <dd>用时</dd>
                <dd>步数</dd>
                <dd>时间</dd>
              </li>
              <li v-for="(item, i) in record[dialogType].time.best" :key="`besttime-${i}`">
                <dd
                  v-html="
                    millisecondsToMinutes(item[0], true).replace(/(\.\d{3})$/, '<small>$1</small>')
                  "
                ></dd>
                <dd>{{ item[1] }}</dd>
                <dd>{{ item[2] ? dateFmt('YYYY-MM-DD HH:mm:ss', new Date(item[2])) : '-' }}</dd>
              </li>
            </ul>
            <ul
              :class="{
                'flip-dialog-list': true,
                'flip-dialog-list--active': currentDialogTab === 'worsttime',
              }"
            >
              <li>
                <dd>用时</dd>
                <dd>步数</dd>
                <dd>时间</dd>
              </li>
              <li v-for="(item, i) in record[dialogType].time.worst" :key="`worsttime-${i}`">
                <dd
                  v-html="
                    millisecondsToMinutes(item[0], true).replace(/(\.\d{3})$/, '<small>$1</small>')
                  "
                ></dd>
                <dd>{{ item[1] }}</dd>
                <dd>{{ item[2] ? dateFmt('YYYY-MM-DD HH:mm:ss', new Date(item[2])) : '-' }}</dd>
              </li>
            </ul>
            <ul
              :class="{
                'flip-dialog-list': true,
                'flip-dialog-list--active': currentDialogTab === 'bestnum',
              }"
            >
              <li>
                <dd>步数</dd>
                <dd>用时</dd>
                <dd>时间</dd>
              </li>
              <li v-for="(item, i) in record[dialogType].num.best" :key="`bestnum-${i}`">
                <dd>{{ item[1] }}</dd>
                <dd
                  v-html="
                    millisecondsToMinutes(item[0], true).replace(/(\.\d{3})$/, '<small>$1</small>')
                  "
                ></dd>
                <dd>{{ item[2] ? dateFmt('YYYY-MM-DD HH:mm:ss', new Date(item[2])) : '-' }}</dd>
              </li>
            </ul>
            <ul
              :class="{
                'flip-dialog-list': true,
                'flip-dialog-list--active': currentDialogTab === 'worstnum',
              }"
            >
              <li>
                <dd>步数</dd>
                <dd>用时</dd>
                <dd>时间</dd>
              </li>
              <li v-for="(item, i) in record[dialogType].num.worst" :key="`worstnum-${i}`">
                <dd>{{ item[1] }}</dd>
                <dd
                  v-html="
                    millisecondsToMinutes(item[0], true).replace(/(\.\d{3})$/, '<small>$1</small>')
                  "
                ></dd>
                <dd>{{ item[2] ? dateFmt('YYYY-MM-DD HH:mm:ss', new Date(item[2])) : '-' }}</dd>
              </li>
            </ul>
            <ul
              :class="{
                'flip-dialog-list': true,
                'flip-dialog-list--active': currentDialogTab === 'latest',
              }"
            >
              <li>
                <dd>用时</dd>
                <dd>步数</dd>
                <dd>时间</dd>
              </li>
              <li v-for="(item, i) in record[dialogType].latest" :key="`latest-${i}`">
                <dd
                  v-html="
                    millisecondsToMinutes(item[0], true).replace(/(\.\d{3})$/, '<small>$1</small>')
                  "
                ></dd>
                <dd>{{ item[1] }}</dd>
                <dd>{{ item[2] ? dateFmt('YYYY-MM-DD HH:mm:ss', new Date(item[2])) : '-' }}</dd>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import { icons } from './config';
import { nextTick } from 'vue';
import { reactive } from 'vue';
import { onMounted } from 'vue';
import { dateFmt } from '@/utils/date';
import { addZero } from '@/utils';

const version = 1;

const mainCardStatus = ref([0, 0, 0, 0]);
const mainToggle = (index: number) => {
  const arr = [0, 0, 0, 0];
  if (mainCardStatus.value[index] === 0) {
    arr[index] = 1;
  }
  mainCardStatus.value = arr;
};
const recordStr = localStorage.getItem('flipCardRecord') || '{}';
const recordVersion = +(localStorage.getItem('recordVersion') || '0');
let recordJson: any = {};
try {
  recordJson = JSON.parse(recordStr);
  if (recordStr !== '{}') {
    if (recordVersion === 0) {
      for (let key in recordJson) {
        recordJson[key] = {
          time: {
            best: [recordJson[key].time.best],
            worst: [recordJson[key].time.worst],
          },
          num: {
            best: [recordJson[key].num.best],
            worst: [recordJson[key].num.worst],
          },
          count: recordJson[key].count,
          latest: [],
        };
      }
      localStorage.setItem('flipCardRecord', JSON.stringify(recordJson));
      localStorage.setItem('recordVersion', version.toString());
    }
  }
} catch {
  /* empty */
}

const recordKey = [
  { key: '4', label: '简单' },
  { key: '6', label: '中等' },
  { key: '8', label: '困难' },
];
const record = reactive<
  Record<
    string,
    {
      time: { best: number[][]; worst: number[][] };
      num: { best: number[][]; worst: number[][] };
      latest: number[][];
      count: number;
    }
  >
>(recordJson);
const visible = ref(false);
const dialogType = ref('4');
const currentDialogTab = ref('besttime');
const scene = ref('main');
const board = ref<string[]>([]);
const boardSize = ref(0);
const gameInfo = reactive({
  startTime: 0,
  cardNum: 0,
  flipNum: 0,
  size: 0,
});
const millisecondsToMinutes = (t: number, showMilliseconds = false) =>
  `${addZero(Math.floor(t / 60000))}:${addZero(Math.floor((t % 60000) / 1000))}${showMilliseconds ? `.${addZero(t % 1000, 3)}` : ''}`;

const activeCard = ref<number[]>([]);
const createGame = (size: number) => {
  activeCard.value = [];
  gameInfo.flipNum = 0;
  const count = (size * size) / 2;
  boardSize.value = size;
  icons.sort(() => (Math.random() < 0.5 ? 1 : -1));
  const types = icons.slice(0, count).concat(icons.slice(0, count));
  types.sort(() => (Math.random() < 0.5 ? 1 : -1));
  board.value = types;
  scene.value = 'board';
  gameInfo.cardNum = board.value.length;
  gameInfo.size = size;
  nextTick(() => {
    gameInfo.startTime = Date.now();
  });
};
const win = () => {
  const now = Date.now();
  const time = now - gameInfo.startTime;
  if (record[gameInfo.size]) {
    record[gameInfo.size].time.best.push([time, gameInfo.flipNum, now]);
    record[gameInfo.size].time.best.sort((a, b) =>
      a[0] > b[0] ||
      (a[0] === b[0] && a[1] > b[1]) ||
      (a[0] === b[0] && a[1] === b[1] && (a[2] || 0) > (b[2] || 0))
        ? 1
        : -1,
    );
    if (record[gameInfo.size].time.best.length > 10) {
      record[gameInfo.size].time.best.pop();
    }

    record[gameInfo.size].time.worst.push([time, gameInfo.flipNum, now]);
    record[gameInfo.size].time.worst.sort((a, b) =>
      a[0] < b[0] ||
      (a[0] === b[0] && a[1] < b[1]) ||
      (a[0] === b[0] && a[1] === b[1] && (a[2] || 0) > (b[2] || 0))
        ? 1
        : -1,
    );
    if (record[gameInfo.size].time.worst.length > 10) {
      record[gameInfo.size].time.worst.pop();
    }

    record[gameInfo.size].num.best.push([time, gameInfo.flipNum, now]);
    record[gameInfo.size].num.best.sort((a, b) =>
      a[1] > b[1] ||
      (a[1] === b[1] && a[0] > b[0]) ||
      (a[0] === b[0] && a[1] === b[1] && (a[2] || 0) > (b[2] || 0))
        ? 1
        : -1,
    );
    if (record[gameInfo.size].num.best.length > 10) {
      record[gameInfo.size].num.best.pop();
    }

    record[gameInfo.size].num.worst.push([time, gameInfo.flipNum, now]);
    record[gameInfo.size].num.worst.sort((a, b) =>
      a[1] < b[1] ||
      (a[1] === b[1] && a[0] < b[0]) ||
      (a[0] === b[0] && a[1] === b[1] && (a[2] || 0) > (b[2] || 0))
        ? 1
        : -1,
    );
    record[gameInfo.size].num.worst.slice(0, 10);
    if (record[gameInfo.size].num.worst.length > 10) {
      record[gameInfo.size].num.worst.pop();
    }
    record[gameInfo.size].latest.unshift([time, gameInfo.flipNum, now]);
    if (record[gameInfo.size].latest.length > 10) {
      record[gameInfo.size].latest.pop();
    }
    record[gameInfo.size].count = (record[gameInfo.size]?.count || 0) + 1;
  } else {
    record[gameInfo.size] = {
      time: {
        best: [[time, gameInfo.flipNum, now]],
        worst: [[time, gameInfo.flipNum, now]],
      },
      num: {
        best: [[time, gameInfo.flipNum, now]],
        worst: [[time, gameInfo.flipNum, now]],
      },
      latest: [[time, gameInfo.flipNum, now]],
      count: 1,
    };
  }
  localStorage.setItem('flipCardRecord', JSON.stringify(record));
  scene.value = 'main';
};
const cardClick = (index: number) => {
  if (activeCard.value.length < 2) {
    gameInfo.flipNum++;
    activeCard.value.push(index);
    if (activeCard.value.length === 2) {
      setTimeout(() => {
        if (board.value[activeCard.value[0]] === board.value[activeCard.value[1]]) {
          board.value[activeCard.value[0]] = '';
          board.value[activeCard.value[1]] = '';
          gameInfo.cardNum -= 2;
          if (gameInfo.cardNum === 0) {
            win();
          }
        }
        activeCard.value = [];
      }, 500);
    }
  }
};
const onKeyUp = (e: KeyboardEvent) => {
  if (e.code === 'Escape') {
    scene.value = 'main';
  }
};
onMounted(() => {
  window.addEventListener('keyup', onKeyUp);
});
</script>
<style scoped lang="scss">
.flip-card {
  position: relative;
  background-color: #333;
  width: 100vw;
  height: 100vh;
  user-select: none;
  --flip-main-size: 300px;
  --flip-main-item-size: 150px;
  --flip-main-record-fontsize: 20px;
  --flip-main-record-fontsize-dt: 28px;
  --flip-color-green: #16a085;
  --flip-color-red: #c0392b;
  .flip-main {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: var(--flip-main-size);
    height: var(--flip-main-size);
    display: flex;
    flex-wrap: wrap;
    .flip-main-item {
      width: var(--flip-main-item-size);
      height: var(--flip-main-item-size);
      position: relative;
      .flip-main-item--front {
        background-color: var(--flip-color-green);
        text-align: center;
        line-height: var(--flip-main-item-size);
        font-weight: bold;
        font-size: calc(var(--flip-main-size) / 4);
        border: 1px solid #333;
        color: #fff;
        box-sizing: border-box;
        width: 100%;
        height: 100%;
        transform: rotateY(0deg);
        transition: all ease 0.3s;
        cursor: pointer;
        backface-visibility: hidden;
        z-index: 1;
        position: absolute;
        left: 0;
        top: 0;
      }
      .flip-main-item--back {
        background-color: var(--flip-color-red);
        width: 100%;
        height: 100%;
        text-align: center;
        line-height: var(--flip-main-item-size);
        font-weight: bold;
        font-size: calc(var(--flip-main-size) / 4);
        border: 1px solid #333;
        color: #fff;
        transform: rotateY(180deg);
        transition: all ease 0.3s;
        box-sizing: border-box;
        z-index: -1;
        position: absolute;
        left: 0;
        top: 0;
        cursor: pointer;
        &.flip-main-item-difficulties {
          padding: calc(var(--flip-main-size) * 1 / 40) 0;
          .flip-main-difficulty {
            font-size: calc(var(--flip-main-size) / 12);
            line-height: calc(var(--flip-main-size) * 3 / 20);
            box-sizing: border-box;
            &:hover {
              background-color: rgba($color: #fff, $alpha: 0.1);
            }
          }
        }
        &.flip-main-item-record {
          width: 200%;
          font-size: var(--flip-main-record-fontsize);
          line-height: 1.8;
          text-align: left;
          font-weight: normal;
          .flip-main-record-box {
            padding: 20px;
            width: 200%;
            height: 200%;
            transform: scale(0.5) translate(-50%, -50%);
          }
          dt {
            font-size: var(--flip-main-record-fontsize-dt);
            font-weight: bold;
            vertical-align: middle;
            img {
              width: var(--flip-main-record-fontsize-dt);
              margin-left: 0.5em;
              display: inline-block;
              vertical-align: middle;
              cursor: pointer;
            }
          }
          dl {
            padding-left: 5em;
            position: relative;
            span {
              display: inline-block;
              width: 11em;
              label {
                margin-right: 0.5em;
              }
            }
            &[data-difficulty]::before {
              content: attr(data-difficulty);
              position: absolute;
              width: 4em;
              left: 0;
              top: 0;
            }
            &:nth-child(odd)[data-difficulty]::before {
              font-size: 0.8em;
            }
          }
        }
        &.flip-main-logo {
          display: flex;
          justify-content: center;
          align-items: center;
          img {
            width: calc(var(--flip-main-size) / 4);
          }
        }
      }
      &.flip-main-item--active {
        .flip-main-item--front {
          transform: rotateY(180deg);
          z-index: -1;
        }
        .flip-main-item--back {
          transform: rotateY(0deg);
          z-index: 2;
        }
      }
    }
  }
  .flip-game {
    display: flex;
    flex-wrap: wrap;
    .flip-game-item {
      position: relative;
      .flip-game-item--front {
        background-color: var(--flip-color-green);
        box-sizing: border-box;
        border: 1px solid #333;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        transform: rotateY(0deg);
        transition: all ease 0.3s;
        cursor: pointer;
        backface-visibility: hidden;
        z-index: 1;
        position: absolute;
        left: 0;
        top: 0;
      }
      .flip-game-item--back {
        width: 100%;
        height: 100%;
        background-color: var(--flip-color-red);
        box-sizing: border-box;
        border: 1px solid #333;
        display: flex;
        align-items: center;
        justify-content: center;
        transform: rotateY(180deg);
        transition: all ease 0.3s;
        box-sizing: border-box;
        z-index: -1;
        position: absolute;
        left: 0;
        top: 0;
        cursor: pointer;
      }
      &.flip-game-item--active {
        .flip-game-item--front {
          transform: rotateY(180deg);
          z-index: -1;
        }
        .flip-game-item--back {
          transform: rotateY(0deg);
          z-index: 2;
        }
      }
    }
  }
  .flip-dialog {
    position: fixed;
    width: 100vw;
    height: 100vh;
    left: 0;
    top: 0;
    .flip-dialog-mask {
      width: 100%;
      height: 100%;
      background-color: rgba($color: #000000, $alpha: 0.3);
      position: absolute;
      display: flex;
      align-items: center;
      justify-content: center;
      .flip-dialog-box {
        background-color: var(--flip-color-green);
        color: #fff;
        width: calc(var(--flip-main-size) * 2);
        height: calc(var(--flip-main-size) * 2);
        padding: 20px;
        transform: scale(0.5);
        transform-origin: 50% 50%;
        position: relative;
        .flip-dialog-close {
          position: absolute;
          right: calc(var(--flip-main-record-fontsize) * -3);
          top: calc(var(--flip-main-record-fontsize) * -3);
          width: calc(var(--flip-main-record-fontsize) * 3);
          cursor: pointer;
        }
        .flip-dialog-difficulties {
          font-size: var(--flip-main-record-fontsize);
          display: flex;
          gap: 40px;
          padding: 20px;
          dl {
            width: 33%;
            text-align: center;
            line-height: 1.5;
            cursor: pointer;
            opacity: 0.8;
            &.flip-dialog-difficulties--active {
              opacity: 1;
              position: relative;
              font-weight: bold;
              font-size: larger;
              color: var(--flip-color-red);
              text-shadow: 0 0 3px #fff;
            }
          }
        }
        .flip-dialog-tabs {
          font-size: calc(var(--flip-main-record-fontsize) * 0.8);
          display: flex;
          gap: 40px;
          padding: 20px;
          dl {
            width: 20%;
            text-align: center;
            line-height: 1.5;
            cursor: pointer;
            &.flip-dialog-tab--active {
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
        .flip-dialog-lists {
          .flip-dialog-list {
            display: none;
            font-size: var(--flip-main-record-fontsize);
            &.flip-dialog-list--active {
              display: block;
            }
            li {
              display: flex;
              line-height: 1.9;
              dd {
                width: 25%;
                text-align: center;
                &:last-child {
                  width: 50%;
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
}
@media screen and (min-width: 960px) {
  .flip-card {
    --flip-main-size: 400px;
    --flip-main-item-size: 200px;
    --flip-main-record-fontsize: 26px;
    --flip-main-record-fontsize-dt: 44px;
  }
}
@media screen and (min-width: 1200px) {
  .flip-card {
    --flip-main-size: 500px;
    --flip-main-item-size: 250px;
    --flip-main-record-fontsize: 32px;
    --flip-main-record-fontsize-dt: 56px;
  }
}
</style>
