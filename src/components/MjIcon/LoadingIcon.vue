<template>
  <svg
    :class="['mj-icon', 'mj-loading-icon', spin ? 'mj-icon-spin' : '']"
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 1024 1024"
    fill="currentColor"
    :style="{
      '--mj-icon-color': color,
    }"
  >
    <path
      d="M512 170.666667C323.477333 170.666667 170.666667 323.477333 170.666667 512s152.810667 341.333333 341.333333 341.333333 341.333333-152.810667 341.333333-341.333333h85.333334c0 235.648-191.018667 426.666667-426.666667 426.666667S85.333333 747.648 85.333333 512 276.352 85.333333 512 85.333333v85.333334z"
    ></path>
  </svg>
</template>
<script setup lang="ts">
import type { MjIconProps } from './interface';
defineProps<MjIconProps>();
</script>
<style src="./mjicon.scss" lang="scss"></style>
