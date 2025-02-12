<template>
  <svg
    class="mj-icon mj-double-left-icon"
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
      d="M272.9 512l265.4-339.1c4.1-5.2 0.4-12.9-6.3-12.9h-77.3c-4.9 0-9.6 2.3-12.6 6.1L186.8 492.3c-9.1 11.6-9.1 27.9 0 39.5l255.3 326.1c3 3.9 7.7 6.1 12.6 6.1H532c6.7 0 10.4-7.7 6.3-12.9L272.9 512z"
    ></path>
    <path
      d="M576.9 512l265.4-339.1c4.1-5.2 0.4-12.9-6.3-12.9h-77.3c-4.9 0-9.6 2.3-12.6 6.1L490.8 492.3c-9.1 11.6-9.1 27.9 0 39.5l255.3 326.1c3 3.9 7.7 6.1 12.6 6.1H836c6.7 0 10.4-7.7 6.3-12.9L576.9 512z"
    ></path>
  </svg>
</template>
<script setup lang="ts">
import type { MjIconProps } from './interface';
defineProps<MjIconProps>();
</script>
<style src="./mjicon.scss" lang="scss"></style>
