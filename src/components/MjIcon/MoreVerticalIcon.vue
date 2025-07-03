<template>
  <svg
    class="mj-icon mj-more-vertical-icon"
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 1024 1024"
    fill="currentColor"
    :style="{
      '--mj-icon-color': color,
    }"
    @click="emits('click', $event)"
  >
    <path
      d="M417.696 224c0-52.928 43.072-96 96-96s96 43.072 96 96-43.072 96-96 96S417.696 276.928 417.696 224z"
    ></path>
    <path
      d="M417.696 512c0-52.928 43.072-96 96-96s96 43.072 96 96-43.072 96-96 96S417.696 564.928 417.696 512z"
    ></path>
    <path
      d="M417.696 800c0-52.928 43.072-96 96-96s96 43.072 96 96-43.072 96-96 96S417.696 852.928 417.696 800z"
    ></path>
  </svg>
</template>
<script setup lang="ts">
import type { MjIconEmits, MjIconProps } from './interface';
defineProps<MjIconProps>();
const emits = defineEmits<MjIconEmits>();
</script>
<style src="./mjicon.scss" lang="scss"></style>
