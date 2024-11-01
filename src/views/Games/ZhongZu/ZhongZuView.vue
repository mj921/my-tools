<template>
  <div>
    <mj-button @click="start">{{ isloop ? '停止' : '开始' }}衍化</mj-button>
    <mj-table :columns="columns" :data="showRank" primary-key="name">
      <template #name="{ value }">
        <span :style="{ color: data.zuMaps[value].color, fontWeight: 'bold' }">{{ value }}</span>
      </template>
      <template #levelList="{ value, row }">
        <div class="level-list">
          <template v-for="(lv, i) in value" :key="row.name + '-' + i">
            <span v-if="lv > 0" :style="{ color: levelConfig[i].color }">
              {{ levelConfig[i].name }}: {{ lv }}
            </span>
          </template>
        </div>
      </template>
    </mj-table>
    <div class="zz-log" ref="logRef">
      <dl v-for="log in logs" :key="log.id" v-html="log.content"></dl>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { reactive } from 'vue';
import { zus, levelConfig } from './config';
import MjButton from '@/components/MjButton/MjButton.vue';
import MjTable from '@/components/MjTable/MjTable.vue';
import { computed } from 'vue';
import { ref } from 'vue';
import { nextTick } from 'vue';

const columns = [
  {
    name: 'no',
    title: '排名',
    formatter: (val: any, row: any, i: number) => i + 1,
  },
  {
    name: 'name',
    title: '种族',
    slotName: 'name',
  },
  {
    name: 'power',
    title: '战力',
    formatter: (val: number) => Math.floor(val),
  },
  {
    name: 'num',
    title: '数量',
  },
  {
    name: 'levelList',
    title: '境界详情',
    slotName: 'levelList',
  },
];

const logRef = ref<HTMLDivElement>();
const logs = ref<{ id: number; content: string }[]>([]);
const isloop = ref(false);
let id = 1;
const addLog = (content: string) => {
  logs.value.push({
    id: id++,
    content,
  });
  nextTick(() => {
    if (logRef.value) {
      logRef.value.scrollTop = logRef.value.scrollHeight - logRef.value.offsetHeight;
    }
  });
};

const data = reactive<{
  zuMaps: Record<
    string,
    {
      name: string;
      levelList: number[];
      levelUpList: bigint[];
      levelUpRate: bigint;
      powerRate: number;
      num: number;
      power: number;
      color: string;
    }
  >;
  rank: string[];
}>({ zuMaps: {}, rank: [] });

const getRandomZu = () => {
  let totalWeight = 0;
  const weights = zus.map((el, i) => {
    const w = Math.pow(6 - (5 * data.rank.length) / zus.length, 10 - el.initLevel);
    totalWeight += w;
    return {
      w,
      name: el.name,
      i,
    };
  });
  let r = Math.random() * totalWeight;
  for (let i = 0; i < weights.length; i++) {
    r -= weights[i].w;
    if (r < 0) {
      return zus[i];
    }
  }
  return zus[zus.length - 1];
};

const showRank = computed(() => data.rank.map((el) => data.zuMaps[el]));

const broth = () => {
  const brothZu = getRandomZu();
  if (!data.zuMaps[brothZu.name]) {
    const levelList = new Array(10).fill(0);
    levelList[brothZu.initLevel] = brothZu.borthNum;
    data.zuMaps[brothZu.name] = {
      name: brothZu.name,
      levelList,
      levelUpList: new Array(10).fill(0n),
      levelUpRate: brothZu.levelUpRate,
      powerRate: brothZu.powerRate,
      num: brothZu.borthNum,
      power:
        brothZu.borthNum * levelConfig[brothZu.initLevel].power * (1 + brothZu.powerRate / 100),
      color: brothZu.color,
    };
    data.rank.push(brothZu.name);
  } else {
    data.zuMaps[brothZu.name].levelList[brothZu.initLevel] += brothZu.borthNum;
    data.zuMaps[brothZu.name].num += brothZu.borthNum;
    data.zuMaps[brothZu.name].power +=
      brothZu.borthNum * levelConfig[brothZu.initLevel].power * (1 + brothZu.powerRate / 100);
  }

  data.rank.sort((a, b) => data.zuMaps[b].power - data.zuMaps[a].power);
  addLog(
    `<b style="color: ${brothZu.color}">${brothZu.name}</b> 新增 <b>${brothZu.borthNum}</b> <b style="color: ${levelConfig[brothZu.initLevel].color}">${levelConfig[brothZu.initLevel].name}</b>`,
  );
};

const levelUp = (zuName: string, all = false, outLog?: string) => {
  const item = data.zuMaps[zuName];
  let upLogs = outLog ?? `<b style="color: ${item.color}">${zuName}</b>`;
  let flag = all;
  if (all) {
    item.levelUpList = item.levelUpList.map(
      (el, i) =>
        el + (BigInt(item.levelList[i]) * levelConfig[i].rate * (100n + item.levelUpRate)) / 100n,
    );
    item.levelUpList.map((el, i) => {
      const num = Number(el / 100000n);
      if (num > 0) {
        item.levelList[i] -= num;
        item.levelList[i + 1] += num;
        upLogs += `, ${num} <b style="color: ${levelConfig[i].color}">${levelConfig[i].name}</b> 成功突破至  <b style="color: ${levelConfig[i + 1].color}">${levelConfig[i + 1].name}</b>`;
      }
      return el % 100000n;
    });
  } else {
    const arr: number[] = [];
    item.levelList.forEach((el, i) => {
      if (el > 0) {
        arr.push(i);
      }
    });
    const i = arr[Math.floor(Math.random() * arr.length)];
    item.levelUpList[i] +=
      (BigInt(item.levelList[i]) * levelConfig[i].rate * (100n + item.levelUpRate)) / 100n;
    const num = Number(item.levelUpList[i] / 100000n);
    if (num > 0) {
      flag = true;
      item.levelList[i] -= num;
      item.levelList[i + 1] += num;
      item.levelUpList[i] %= 100000n;
      upLogs += `, ${num} <b style="color: ${levelConfig[i].color}">${levelConfig[i].name}</b> 成功突破至  <b style="color: ${levelConfig[i + 1].color}">${levelConfig[i + 1].name}</b>`;
    }
  }
  if (flag && !outLog) {
    item.power =
      item.levelList.reduce((prev, el, i) => prev + el * levelConfig[i].power, 0) *
      (1 + item.powerRate / 100);
    addLog(upLogs);
    data.rank.sort((a, b) => data.zuMaps[b].power - data.zuMaps[a].power);
  } else if (flag) {
    return upLogs;
  }
};
const punish = (zuName: string, deathRate?: number, outLog?: string) => {
  const item = data.zuMaps[zuName];
  let upLogs = outLog ?? `<b style="color: ${item.color}">${zuName}</b>受到天罚`;
  if (typeof deathRate !== 'number') {
    deathRate = Math.floor(Math.random() * 4) + 1;
  }
  let num = Math.max(1, Math.floor((item.num * deathRate) / 100));
  for (let i = 0; i < item.levelList.length; i++) {
    const nn = Math.min(num, Math.ceil((item.levelList[i] * deathRate) / 100));
    if (nn > 0) {
      item.levelList[i] -= nn;
      num -= nn;
      upLogs += `, ${nn} <b style="color: ${levelConfig[i].color}">${levelConfig[i].name}</b> 死亡`;
    }
    if (num <= 0) break;
  }
  if (!outLog) {
    addLog(upLogs);
    const [p, n] = item.levelList.reduce(
      (prev, el, i) => [prev[0] + el * levelConfig[i].power, prev[1] + el],
      [0, 0],
    );
    item.power = p * (1 + item.powerRate / 100);
    item.num = n;
    data.rank.sort((a, b) => data.zuMaps[b].power - data.zuMaps[a].power);
  } else {
    return upLogs;
  }
};
const fight = (zuName: string) => {
  let wt = 0;
  const pw: [number, string][] = data.rank.map((el) => {
    const cw = Math.abs(data.zuMaps[el].power - data.zuMaps[zuName].power);
    wt += cw;
    return [cw, el];
  });
  let r = wt * Math.random();
  let i = 0;
  while (i < pw.length && (r -= pw[i][0]) >= 0) {
    i++;
  }
  const otherName = data.rank[i];
  let defName = zuName;
  let successName = otherName;
  if (
    Math.random() <
    data.zuMaps[zuName].power / (data.zuMaps[zuName].power + data.zuMaps[otherName].power)
  ) {
    defName = otherName;
    successName = zuName;
  }
  let upLogs = `<span style="color: ${data.zuMaps[zuName].color}">${zuName}</span> 与 <span style="color: ${data.zuMaps[otherName].color}">${otherName}</span> 发生冲突, <span style="color: ${data.zuMaps[successName].color}">${successName}</span> 获胜`;
  upLogs = punish(successName, Math.random() * 2 + 1, upLogs) as string;
  upLogs = levelUp(successName, true, upLogs) as string;
  upLogs += `, <span style="color: ${data.zuMaps[defName].color}">${defName}</span> 战败`;
  upLogs = punish(defName, Math.random() * 5 + 5, upLogs) as string;
  addLog(upLogs);

  const [p, n] = data.zuMaps[successName].levelList.reduce(
    (prev, el, i) => [prev[0] + el * levelConfig[i].power, prev[1] + el],
    [0, 0],
  );
  data.zuMaps[successName].power = p * (1 + data.zuMaps[successName].powerRate / 100);
  data.zuMaps[successName].num = n;
  const [p1, n1] = data.zuMaps[defName].levelList.reduce(
    (prev, el, i) => [prev[0] + el * levelConfig[i].power, prev[1] + el],
    [0, 0],
  );
  data.zuMaps[defName].power = p1 * (1 + data.zuMaps[defName].powerRate / 100);
  data.zuMaps[defName].num = n1;
  data.rank.sort((a, b) => data.zuMaps[b].power - data.zuMaps[a].power);
};

const update = () => {
  if (data.rank.length < 2) {
    broth();
    return;
  }
  const ww = 10000;
  const actionList: [number, () => void][] = [
    [600, broth],
    [
      600,
      () => {
        levelUp(data.rank[Math.floor(Math.random() * data.rank.length)], true);
      },
    ],
    [
      400,
      () => {
        fight(data.rank[Math.floor(Math.random() * data.rank.length)]);
      },
    ],
    [
      400,
      () => {
        let wt = 0;
        const pw: [number, string][] = data.rank.map((el, i) => {
          const cw = data.rank.length * 2 - i;
          wt += cw;
          return [cw, el];
        });
        let r = wt * Math.random();
        let i = 0;
        while (i < pw.length && (r -= pw[i][0]) >= 0) {
          i++;
        }
        punish(pw[i][1]);
      },
    ],
    [
      8000,
      () => {
        data.rank.forEach((el) => levelUp(el));
      },
    ],
  ];
  let r = Math.random() * ww;
  let i = 0;
  while (i < actionList.length && (r -= actionList[i][0]) >= 0) {
    i++;
  }
  actionList[i][1]();
};
const loop = () => {
  if (!isloop.value) return;
  update();
  setTimeout(loop, 200);
};
const start = () => {
  isloop.value = !isloop.value;
  loop();
};
</script>
<style scoped lang="scss">
.level-list {
  span {
    &:not(:first-child)::before {
      content: ', ';
    }
  }
}
.zz-log {
  max-height: 368px;
  overflow: auto;
  padding: 8px 0;
}
</style>
