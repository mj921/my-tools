<template>
  <div class="pie-example">
    <MjPie :data="data" :radius="'50%'" :start-angle="180" :end-angle="360" />
  </div>
</template>
<script lang="ts" setup>
import MjPie from '@/components/MjChart/MjPie/MjPie.vue';
import { ref } from 'vue';

const data = ref([
  { value: 1048, name: 'Search Engine' },
  { value: 735, name: 'Direct' },
  { value: 580, name: 'Email' },
  { value: 484, name: 'Union Ads' },
  { value: 300, name: 'Video Ads' },
]);
</script>
<style scoped lang="scss">
.pie-example {
  width: 100vw;
  height: 100vh;
}
</style>
