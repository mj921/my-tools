<template>
  <div class="caiyan-title">
    <div class="caiyan-ipts">
      <input class="caiyan-ipt" v-model="ipt" @keydown.enter="cai" :readonly="win" />
      <button class="caiyan-btn" @click="cai" :disabled="ipt.length !== 1 || win">猜</button>
      <button class="caiyan-btn" @click="random">换一个</button>
      <button class="caiyan-btn" @click="reset">重置</button>
    </div>
    <div class="caiyan-paragraph">
      <div
        :class="['text-cell', { 'text-cell-show': el.show }]"
        v-for="(el, i) in answer"
        :key="`answer-${i}`"
      >
        {{ el.show || win ? el.text : '' }}
      </div>
    </div>
    <div class="caiyan-paragraph" v-for="(paragraph, i) in data" :key="`paragraphs-${i}`">
      <div
        :class="[
          'text-cell',
          { 'text-cell-show': el.show, 'text-cell-win': win, 'text-cell-normal': !el.isText },
        ]"
        v-for="(el, j) in paragraph"
        :key="`text-${i}-${j}`"
      >
        {{ el.show || win ? el.text : '' }}
      </div>
    </div>
    <div class="caiyan-paragraph">
      <div
        :class="['text-cell', 'text-cell-error']"
        v-for="el in errorText"
        :key="`text-err-${el}`"
      >
        {{ el }}
      </div>
    </div>
    <div>
      你已经猜了 {{ ipted.size }} 次，{{
        Math.floor((allText.len * 10000) / (allText.allLen || 1)) / 100
      }}%
    </div>
  </div>
</template>
<script lang="ts" setup>
import message from '@/components/MjMessage';
import { computed, ref } from 'vue';
import request from '@/lib/request';

const otherText = ',.\'"[]<>?/\\-=+_!@#$%^&*(){};:`~|，。、；‘《》？：“【】「」、！￥…（）——”·²';
const props = defineProps<{
  type: string;
}>();
const key = ref(localStorage.getItem(`caiyan-${props.type}`));
const data = ref<{ text: string; show: boolean; isText: boolean }[][]>([]);
const answer = ref<{ text: string; show: boolean }[]>([]);

const keys = ref<string[]>([]);

const reset = async () => {
  ipt.value = '';
  errorText.value = [];
  ipted.value = new Set();
  win.value = false;
  const res = await request<{ title: string; content: { paragraphs: string[][] } }>({
    url: `/caiyan/${props.type}/${key.value}.json`,
  });
  data.value = (res.content.paragraphs?.[0] || [])
    .filter((el) => !!el)
    .map((el) =>
      el.split('').map((text) => ({
        text,
        show: otherText.includes(text),
        isText: !otherText.includes(text),
      })),
    );
  answer.value = res.title.split('').map((text) => ({
    text,
    show: otherText.includes(text),
  }));
};
const getData = async (random = false) => {
  if (keys.value.length === 0) {
    keys.value = await request<string[]>({ url: '/caiyan/baike/sum.json' });
  }
  if (!key.value || random) {
    key.value = keys.value[Math.floor(Math.random() * keys.value.length)];
    localStorage.setItem('caiyan-baike', key.value);
  }
  await reset();
};
getData();

const ipt = ref('');
const allText = computed(() => {
  let allLen = 0;
  let len = 0;
  const all = new Set<string>();
  answer.value.forEach((t) => all.add(t.text));
  data.value.forEach((p) => {
    p.forEach((t) => {
      if (t.isText) {
        allLen++;
        all.add(t.text);
        if (t.show) {
          len++;
        }
      }
    });
  });
  return { allText: all, allLen, len };
});
const errorText = ref<string[]>([]);
const ipted = ref<Set<string>>(new Set());
const win = ref(false);
const cai = () => {
  if (ipt.value.length !== 1 || win.value) return;
  if (ipted.value.has(ipt.value)) {
    message.warning('你已经猜过这个字');
  } else {
    ipted.value.add(ipt.value);
    if (allText.value.allText.has(ipt.value)) {
      for (let i = 0; i < data.value.length; i++) {
        for (let j = 0; j < data.value[i].length; j++) {
          const item = data.value[i][j];
          if (item.text === ipt.value) {
            item.show = true;
          }
        }
      }
      for (let i = 0; i < answer.value.length; i++) {
        const item = answer.value[i];
        if (item.text === ipt.value) {
          item.show = true;
          if (answer.value.every((el) => el.show)) {
            win.value = true;
            message.success('你赢了');
          }
        }
      }
    } else {
      message.warning('没有这个字');
      errorText.value.push(ipt.value);
    }
  }
  ipt.value = '';
};
const random = () => {
  ipt.value = '';
  errorText.value = [];
  ipted.value = new Set();
  win.value = false;
  getData(true);
};
</script>
<style scoped lang="scss">
.caiyan-title {
  max-width: 695px;
  width: 100vw;
  margin: 0 auto;
  height: 100vh;
  overflow: auto;
  .caiyan-ipts {
    position: sticky;
    top: 0;
    padding: 8px;
    background-color: #fff;
    .caiyan-ipt {
      width: calc(100% - 252px);
      line-height: 28px;
      font-size: 14px;
      margin: 0;
      border: 1px solid #cdcdcd;
      border-radius: 4px;
      outline: none;
      padding: 0 12px;
      &:focus {
        border-color: #4b8cf0;
      }
    }
    .caiyan-btn {
      margin-left: 8px;
      font-size: 14px;
      line-height: 30px;
      padding: 0 24px;
      border: none;
      background-color: #4b8cf0;
      color: #fff;
      border-radius: 6px;
      &:disabled {
        background-color: #cdcdcd;
        cursor: not-allowed;
      }
    }
  }
  .caiyan-paragraph {
    display: flex;
    flex-wrap: wrap;
    gap: 3px;
    align-items: center;
    padding: 0 3px;
    &:not(:last-child) {
      margin-bottom: 3px;
    }
    .text-cell {
      display: inline-block;
      flex: 0 0 20px;
      width: 20px;
      height: 20px;
      text-align: center;
      line-height: 18px;
      font-size: 18px;
      background-color: #000;
      vertical-align: top;
      border: 1px solid #000;
      font-weight: bold;
      color: #fff;
      &.text-cell-show {
        background-color: #006400;
        border-color: #006400;
      }
      &.text-cell-win {
        background-color: transparent;
        color: #000;
      }
      &.text-cell-normal {
        background-color: transparent;
        border-color: transparent;
        color: #000;
        font-weight: normal;
      }
      &.text-cell-error {
        background-color: #f05757;
        border-color: #f05757;
      }
    }
  }
}
</style>
