<template>
  <div>
    <mj-input v-model="peopleNum" placeholder="人数" />
    <mj-button @click="init">重新开始</mj-button>
    <mj-button @click="next">下一步</mj-button>
    <mj-table :columns="columns" :data="ids" primary-key="id">
      <template #attackList="{ row }">
        <span
          v-for="(el, j) in row.attackList"
          :style="{
            color: row.attackList.filter((v) => v === el).length > 1 ? 'red' : undefined,
          }"
          :key="`attackList-${j}-${el}`"
        >
          {{ el }}
        </span>
      </template>
    </mj-table>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import MjInput from '@/components/MjInput/MjInput.vue';
import MjButton from '@/components/MjButton/MjButton.vue';
import MjTable from '@/components/MjTable/MjTable.vue';

const peopleNum = ref(20);
const ids = ref<{ id: number; defTimes: number; attackList: number[] }[]>([]);
const currentIndex = ref(0);

const columns = [
  { name: 'id' },
  { title: '剩余防守次数', name: 'defTimes' },
  { title: '进攻列表', name: 'attackList', slotName: 'attackList' },
];

const next = () => {
  if (currentIndex.value >= peopleNum.value) return;
  const currentId = ids.value[currentIndex.value].id;
  const list: number[][][] = [];
  ids.value.forEach((item) => {
    if (![...ids.value[currentIndex.value].attackList, currentId].includes(item.id)) {
      if (!list[item.defTimes]) list[item.defTimes] = [[] as number[], [] as number[]];
      list[item.defTimes][item.attackList.length === 8 ? 1 : 0].push(item.id);
    }
  });
  const arr =
    list[list.length - 1][0].length > 0 ? list[list.length - 1][0] : list[list.length - 1][1];
  const atkId = arr[Math.floor(arr.length * Math.random())];
  ids.value[currentIndex.value].attackList.push(atkId);
  ids.value[atkId - 1].defTimes--;
  if (ids.value[currentIndex.value].attackList.length === 8) {
    currentIndex.value++;
  }
};

const init = () => {
  currentIndex.value = 0;
  ids.value = [];
  for (let i = 1; i <= peopleNum.value; i++) {
    ids.value.push({
      id: i,
      defTimes: 8,
      attackList: [],
    });
  }
};
init();
</script>
<style scoped lang="scss">
table {
  border-collapse: collapse;
  th {
    font-weight: bold;
  }
  td,
  th {
    border: 1px solid #ccc;
    padding: 0 10px;
    &:nth-child(3) {
      width: 200px;
    }
  }
  td span {
    &:not(:first-child)::before {
      content: ', ';
      color: #000;
    }
  }
}
</style>
