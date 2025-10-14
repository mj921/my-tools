<template>
  <div></div>
</template>
<script lang="ts" setup>
import request from '@/lib/request';
request({ url: '/caiyan/baike/sum.json' }).then(console.log);
</script>
<style scoped lang="scss"></style>
