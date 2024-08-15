<template>
  <button @click="emits('click')"><slot></slot></button>
</template>
<script lang="ts" setup>
import type { MjButtonEmits } from './interface';
const emits = defineEmits<MjButtonEmits>();
</script>
<style scoped lang="scss"></style>
