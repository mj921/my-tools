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
            <dt>记录</dt>
            <template v-for="item in recordKey" :key="item.key">
              <dl :data-difficulty="item.label">
                <span>
                  <label>最快时间</label>
                  <i v-if="!record?.[item.key]?.time?.best">-</i>
                  <template v-else>
                    <b>{{ millisecondsToMinutes(record?.[item.key]?.time?.best[0]) }}</b>
                    ({{ record?.[item.key]?.time?.best[1] }})
                  </template>
                </span>
                <span>
                  <label>最慢时间</label>
                  <i v-if="!record?.[item.key]?.time?.worst">-</i>
                  <template v-else>
                    <b>{{ millisecondsToMinutes(record?.[item.key]?.time?.worst[0]) }}</b>
                    ({{ record?.[item.key]?.time?.worst[1] }})
                  </template>
                </span>
              </dl>
              <dl>
                <span>
                  <label>最多次数</label>
                  <i v-if="!record?.[item.key]?.num?.best">-</i>
                  <template v-else>
                    <b>{{ record?.[item.key]?.num?.best[1] }}</b>
                    ({{ millisecondsToMinutes(record?.[item.key]?.num?.best[0]) }})
                  </template>
                </span>
                <span>
                  <label>最少次数</label>
                  <i v-if="!record?.[item.key]?.num?.worst">-</i>
                  <template v-else>
                    <b>{{ record?.[item.key]?.num?.worst[1] }}</b>
                    ({{ millisecondsToMinutes(record?.[item.key]?.num?.worst[0]) }})
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
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import { icons } from './config';
import { nextTick } from 'vue';
import { reactive } from 'vue';
import { onMounted } from 'vue';

const mainCardStatus = ref([0, 0, 0, 0]);
const mainToggle = (index: number) => {
  const arr = [0, 0, 0, 0];
  if (mainCardStatus.value[index] === 0) {
    arr[index] = 1;
  }
  mainCardStatus.value = arr;
};
const recordStr = localStorage.getItem('flipCardRecord') || '{}';
let recordJson = {};
try {
  recordJson = JSON.parse(recordStr);
} catch {
  /* empty */
}
const recordKey = [
  { key: '4', label: '简单' },
  { key: '6', label: '中等' },
  { key: '8', label: '困难' },
];
const record =
  reactive<
    Record<
      string,
      { time: { best: number[]; worst: number[] }; num: { best: number[]; worst: number[] } }
    >
  >(recordJson);
const scene = ref('main');
const board = ref<string[]>([]);
const boardSize = ref(0);
const gameInfo = reactive({
  startTime: 0,
  cardNum: 0,
  flipNum: 0,
  size: 0,
});
const addZero = (n: number) => `0${n}`.slice(-2);
const millisecondsToMinutes = (t: number) =>
  `${addZero(Math.floor(t / 60000))}:${addZero(Math.floor((t % 60000) / 1000))}`;
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
  const time = Date.now() - gameInfo.startTime;
  if (record[gameInfo.size]) {
    if (
      record[gameInfo.size].time.best[0] > time ||
      (record[gameInfo.size].time.best[0] === time &&
        record[gameInfo.size].time.best[1] > gameInfo.flipNum)
    ) {
      record[gameInfo.size].time.best = [time, gameInfo.flipNum];
    }
    if (
      record[gameInfo.size].time.worst[0] < time ||
      (record[gameInfo.size].time.worst[0] === time &&
        record[gameInfo.size].time.worst[1] < gameInfo.flipNum)
    ) {
      record[gameInfo.size].time.worst = [time, gameInfo.flipNum];
    }
    if (
      record[gameInfo.size].num.best[1] > gameInfo.flipNum ||
      (record[gameInfo.size].num.best[1] === gameInfo.flipNum &&
        record[gameInfo.size].num.best[0] > time)
    ) {
      record[gameInfo.size].num.best = [time, gameInfo.flipNum];
    }
    if (
      record[gameInfo.size].num.worst[1] < gameInfo.flipNum ||
      (record[gameInfo.size].num.worst[1] === gameInfo.flipNum &&
        record[gameInfo.size].num.worst[0] < time)
    ) {
      record[gameInfo.size].num.worst = [time, gameInfo.flipNum];
    }
  } else {
    record[gameInfo.size] = {
      time: {
        best: [time, gameInfo.flipNum],
        worst: [time, gameInfo.flipNum],
      },
      num: {
        best: [time, gameInfo.flipNum],
        worst: [time, gameInfo.flipNum],
      },
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
        background-color: #16a085;
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
        background-color: #c0392b;
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
          }
          dl {
            padding-left: 3em;
            position: relative;
            span {
              display: inline-block;
              width: 12em;
              label {
                margin-right: 0.5em;
              }
            }
            &[data-difficulty]::before {
              content: attr(data-difficulty) ':';
              position: absolute;
              left: 0;
              top: 0;
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
        background-color: #16a085;
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
        background-color: #c0392b;
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
