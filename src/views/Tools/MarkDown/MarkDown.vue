<template>
  <div class="markdown">
    <div>
      <textarea name="" id="" v-model="content"></textarea>
    </div>
    <div><mj-md :content="content" /></div>
  </div>
</template>
<script lang="ts" setup>
import MjMd from '@/components/MjMd/MjMd.vue';
import mdDemo from './demo';
import { ref } from 'vue';

const content = ref(mdDemo);
</script>
<style scoped lang="scss">
.markdown {
  display: flex;
  height: 100vh;
  & > div {
    width: 50%;
    overflow: auto;
    height: 100%;
    &:first-child {
      border-right: 1px solid #ddd;
    }
  }
  textarea {
    width: 100%;
    height: 100%;
    padding: 20px;
    outline: none;
    border: none;
  }
}
</style>
