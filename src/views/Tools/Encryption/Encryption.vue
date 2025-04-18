<template>
  <div>
    <textarea v-model="input"></textarea>
    <textarea v-model="output"></textarea>
    <MjButton @click="encrypt" :style="{ margin: '10px' }"> 加密 </MjButton>
  </div>
</template>
<script lang="ts" setup>
import MjButton from '@/components/MjButton/MjButton.vue';
import BinaryWriter from '@/lib/saver/BinaryWriter';
import { ref } from 'vue';

const input = ref('');
const output = ref('');

const encrypt = () => {
  const writer = new BinaryWriter('Write', input.value.length * 8);
  writer.writeString(input.value);
  output.value = writer.getRawDataStr();
};
</script>
<style scoped lang="scss"></style>
