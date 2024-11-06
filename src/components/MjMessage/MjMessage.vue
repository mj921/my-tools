<template>
  <div class="mj-message">
    <div class="mj-messsage-icon" v-if="icon">
      <component :is="icon" />
    </div>
    <div class="mj-messsage-content">{{ content }}</div>
  </div>
</template>
<script lang="ts" setup>
import type { MjMessageProps } from './interface';

defineProps<MjMessageProps>();
</script>
<style scoped lang="scss"></style>
