<template>
  <div class="alarm-clock">
    <MjButton type="primary" @click="addClock">添加闹钟</MjButton>
    <div class="alarm-clock-list">
      <div class="alarm-clock-item" v-for="el in clockList" :key="el.uuid">
        <MjSelect v-model="el.type" :options="clockTypeList" :disabled="el.enable" />
        <MjSelect
          v-if="el.type === ClockType.Normal"
          v-model="el.interval"
          :options="normalInterval"
          :disabled="el.enable"
        />
        <MjInput
          v-else-if="el.type === ClockType.Random"
          v-model="el.interval"
          placeholder="请输入闹钟数量"
          :disabled="el.enable"
        />
        <mj-select
          v-if="el.type === ClockType.Normal"
          v-model="el.time[0]"
          :options="hoursList"
          :disabled="el.enable"
        />
        <mj-select
          v-if="el.type === ClockType.Normal"
          v-model="el.time[1]"
          :options="minutesList"
          :disabled="el.enable"
        />
        <MjSwitch v-model="el.enable" @change="toggleClock($event as boolean, el)" />
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import MjButton from '@/components/MjButton/MjButton.vue';
import MjInput from '@/components/MjInput/MjInput.vue';
import MjSelect from '@/components/MjSelect/MjSelect.vue';
import MjSwitch from '@/components/MjSwitch/MjSwitch.vue';
import { generateUuid } from '@/utils';
import { dateFmt } from '@/utils/date';
import { ref } from 'vue';

enum ClockType {
  Normal = 1,
  Random = 2,
}

interface NormalClock {
  uuid: string;
  type: ClockType.Normal;
  interval: number;
  enable: boolean;
  time: number[];
}

interface RandomClock {
  uuid: string;
  type: ClockType.Random;
  interval: number;
  enable: boolean;
  time: number[];
  sto: (number | null)[];
}

enum NormalClockInterval {
  Once = 1,
  EveryDay = 2,
}
const clockTypeList = [
  {
    label: '普通',
    value: ClockType.Normal,
  },
  {
    label: '随机',
    value: ClockType.Random,
  },
];
const clockList = ref<(RandomClock | NormalClock)[]>([]);

const normalInterval = [
  {
    label: '一次',
    value: NormalClockInterval.Once,
  },
  {
    label: '每天',
    value: NormalClockInterval.EveryDay,
  },
];
const hoursList = new Array(24).fill(1).map((el, i) => ({ label: `0${i}`.slice(-2), value: i }));
const minutesList = new Array(60).fill(1).map((el, i) => ({ label: `0${i}`.slice(-2), value: i }));

const addClock = () => {
  clockList.value.push({
    uuid: generateUuid(),
    type: ClockType.Normal,
    interval: NormalClockInterval.Once,
    enable: false,
    time: [0, 0],
  });
};
const randomNorif = ({
  i,
  delay,
  stos,
  times,
}: {
  i: number;
  delay: number;
  stos: (number | null)[];
  times: number[];
}) => {
  return setTimeout(
    () => {
      stos[i] = null;
      stos.forEach((el, j) => {
        if (el) {
          clearTimeout(el);
          stos[j] = randomNorif({ i: j, delay: Date.now() - times[j], stos, times });
        }
      });
      notif({ body: '随机' });
    },
    Math.max(0, delay),
  );
};
const toggleClock = (enable: boolean, el: NormalClock | RandomClock) => {
  const item = clockList.value.find((val) => val.uuid === el.uuid);
  if (enable) {
    if (item) {
      if (item.type === ClockType.Random) {
        item.time = [];
        item.sto = [];
        const startTime = new Date();
        startTime.setHours(9);
        startTime.setMinutes(30);
        startTime.setSeconds(0);
        for (let i = 0; i < item.interval; i++) {
          const minute = Math.floor(Math.random() * 540);
          const ct = startTime.getTime() + minute * 60000;
          item.time[i] = ct;
          if (ct > Date.now()) {
            item.sto[i] = randomNorif({
              i,
              delay: ct - Date.now(),
              stos: item.sto,
              times: item.time,
            });
          }
        }
        console.log(item.time.map((el) => dateFmt('YYYY-MM-DD HH:mm:ss', new Date(el))));
      }
    }
  } else {
    if (item) {
      if (item.type === ClockType.Random) {
        item.sto.forEach((el, i) => {
          if (el) {
            clearTimeout(el);
            item.sto[i] = null;
          }
        });
      }
    }
  }
};
const notif = ({ title = '闹钟', body = '内容' } = {}) => {
  switch (Notification.permission) {
    case 'default':
      Notification.requestPermission().then((res) => {
        if (res === 'granted') {
          new Notification(title, {
            body,
          });
        }
      });
      break;
    case 'granted':
      new Notification(title, {
        body,
      });
      break;
    case 'denied':
      console.warn('通知权限已被拒绝');
      break;
  }
};
</script>
<style scoped lang="scss">
.alarm-clock {
  text-align: center;
  .alarm-clock-list {
    display: flex;
    flex-direction: column;
    align-items: center;
    .alarm-clock-item {
      margin-top: 16px;
      display: flex;
      gap: 16px;
      align-items: center;
      .mj-tag {
        white-space: nowrap;
      }
      .mj-select {
        width: 100px;
      }
    }
  }
}
</style>
