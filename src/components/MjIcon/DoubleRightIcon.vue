<template>
  <svg
    class="mj-icon mj-double-right-icon"
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
      d="M533.2 492.3L277.9 166.1c-3-3.9-7.7-6.1-12.6-6.1H188c-6.7 0-10.4 7.7-6.3 12.9L447.1 512 181.7 851.1c-4.1 5.2-0.4 12.9 6.3 12.9h77.3c4.9 0 9.6-2.3 12.6-6.1l255.3-326.1c9.1-11.7 9.1-27.9 0-39.5z"
    ></path>
    <path
      d="M837.2 492.3L581.9 166.1c-3-3.9-7.7-6.1-12.6-6.1H492c-6.7 0-10.4 7.7-6.3 12.9L751.1 512 485.7 851.1c-4.1 5.2-0.4 12.9 6.3 12.9h77.3c4.9 0 9.6-2.3 12.6-6.1l255.3-326.1c9.1-11.7 9.1-27.9 0-39.5z"
    ></path>
  </svg>
</template>
<script setup lang="ts">
import type { MjIconProps } from './interface';
defineProps<MjIconProps>();
</script>
<style src="./mjicon.scss" lang="scss"></style>
