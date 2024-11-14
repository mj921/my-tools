<template>
  <div>
    <MjPre
      value=".flip-scale-2-ver-left { color: #f00; animation: 1s ease 0s normal flip-scale-2-ver-left;} @-webkit-keyframes flip-scale-2-ver-left { 0% { transform: translateX(0px) rotateY(0deg) scale(1); transform-origin: 0% 50%; } 50% { transform: translateX(-50%) rotateY(90deg) scale(2); transform-origin: 50% 50%; } 100% { transform: translateX(-100%) rotateY(180deg) scale(1); transform-origin: 100% 50%; } } @keyframes flip-scale-2-ver-left { 0% { transform: translateX(0px) rotateY(0deg) scale(1); transform-origin: 0% 50%; } 50% { transform: translateX(-50%) rotateY(90deg) scale(2); transform-origin: 50% 50%; } 100% { transform: translateX(-100%) rotateY(180deg) scale(1); transform-origin: 100% 50%; } }"
      lang="css"
    />
  </div>
</template>
<script lang="ts" setup>
import MjPre from '@/components/MjPre/MjPre.vue';
</script>
<style scoped lang="scss"></style>
