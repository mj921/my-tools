<template>
  <div class="caiyan-container">
    <CaiTitle :data="data" :answer="answer" @reset="reset" @random="random" />
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import request from '@/lib/request';
import CaiTitle from './CaiTitle.vue';

const key = ref(localStorage.getItem('caiyan-baike'));
const data = ref<{ text: string; show: boolean }[][]>([]);
const answer = ref<{ text: string; show: boolean }[]>([]);

const keys = ref<string[]>([]);

const reset = async () => {
  const res = await request<{ title: string; content: { paragraphs: string[][] } }>({
    url: `/caiyan/baike/${key.value}.json`,
  });
  data.value = (res.content.paragraphs?.[0] || [])
    .filter((el) => !!el)
    .map((el) =>
      el.split('').map((text) => ({
        text,
        show: ',.\'"[]<>?/\\-=+_!@#$%^&*(){};:`~|，。、；‘《》？：“【】「」、！￥…（）——”'.includes(
          text,
        ),
      })),
    );
  answer.value = res.title.split('').map((text) => ({
    text,
    show: ',.\'"[]<>?/\\-=+_!@#$%^&*(){};:`~|，。、；‘《》？：“【】「」、！￥…（）——'.includes(
      text,
    ),
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
const random = () => {
  getData(true);
};
</script>
<style scoped lang="scss"></style>
