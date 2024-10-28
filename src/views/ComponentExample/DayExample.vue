<template>
  <div></div>
</template>
<script lang="ts" setup>
import Day from '@/lib/day/day';
const d = new Day('2024-02-29 00:00:00');
console.log(d.format());
d.year(2025);
console.log(d.format());
console.log(new Day('2000-01-01').toNow());
console.log(new Day('2024-10-22').from(new Day('2024-09-21')));
</script>
<style scoped lang="scss"></style>
