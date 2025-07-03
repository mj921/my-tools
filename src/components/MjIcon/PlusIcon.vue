<template>
  <svg
    class="mj-icon mj-plus-icon"
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 1024 1024"
    fill="currentColor"
    :style="{
      '--mj-icon-color': color,
    }"
    @click="($event) => emits('click', $event)"
  >
    <path d="M474 152m8 0l60 0q8 0 8 8l0 704q0 8-8 8l-60 0q-8 0-8-8l0-704q0-8 8-8Z"></path>
    <path d="M168 474m8 0l672 0q8 0 8 8l0 60q0 8-8 8l-672 0q-8 0-8-8l0-60q0-8 8-8Z"></path>
  </svg>
</template>
<script setup lang="ts">
import type { MjIconEmits, MjIconProps } from './interface';
defineProps<MjIconProps>();
const emits = defineEmits<MjIconEmits>();
</script>
<style src="./mjicon.scss" lang="scss"></style>
