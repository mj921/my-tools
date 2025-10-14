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
        :class="['text-cell', { 'text-cell-show': el.show, 'text-cell-win': win }]"
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
    <div>你已经猜了 {{ ipted.size }} 次</div>
  </div>
</template>
<script lang="ts" setup>
import message from '@/components/MjMessage';
import { computed, ref } from 'vue';

const props = defineProps<{
  data: { text: string; show: boolean }[][];
  answer: { text: string; show: boolean }[];
}>();
const emits = defineEmits<{ (e: 'reset'): void; (e: 'random'): void }>();
const ipt = ref('');
const allText = computed(() => {
  const all = new Set<string>();
  props.answer.forEach((t) => all.add(t.text));
  props.data.forEach((p) => {
    p.forEach((t) => {
      all.add(t.text);
    });
  });
  return all;
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
    if (allText.value.has(ipt.value)) {
      for (let i = 0; i < props.data.length; i++) {
        for (let j = 0; j < props.data[i].length; j++) {
          const item = props.data[i][j];
          if (item.text === ipt.value) {
            item.show = true;
          }
        }
      }
      for (let i = 0; i < props.answer.length; i++) {
        const item = props.answer[i];
        if (item.text === ipt.value) {
          item.show = true;
          if (props.answer.every((el) => el.show)) {
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
const reset = () => {
  ipt.value = '';
  errorText.value = [];
  ipted.value = new Set();
  win.value = false;
  emits('reset');
};
const random = () => {
  ipt.value = '';
  errorText.value = [];
  ipted.value = new Set();
  win.value = false;
  emits('random');
};
</script>
<style scoped lang="scss">
.caiyan-title {
  max-width: 724px;
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
    gap: 4px;
    align-items: center;
    padding: 0 4px;
    &:not(:last-child) {
      margin-bottom: 4px;
    }
    .text-cell {
      display: inline-block;
      flex: 0 0 20px;
      width: 20px;
      height: 20px;
      text-align: center;
      line-height: 18px;
      font-size: 16px;
      background-color: #000;
      vertical-align: top;
      border: 1px solid #000;
      &.text-cell-show {
        background-color: transparent;
        border-color: transparent;
      }
      &.text-cell-win {
        background-color: transparent;
        color: #000;
      }
      &.text-cell-error {
        color: #fff;
        background-color: #f05757;
        border-color: transparent;
      }
    }
  }
}
</style>
