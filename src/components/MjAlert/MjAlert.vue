<template>
  <div class="mj-alert">{{ message }}</div>
</template>
<script lang="ts" setup>
import type { MjAlertProps } from './interface';

defineProps<MjAlertProps>();
</script>
<style scoped lang="scss"></style>
