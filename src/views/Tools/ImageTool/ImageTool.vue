<template>
  <div><mj-input v-model="url" /><mj-button @click="urlToBase64">转base64</mj-button></div>
</template>
<script lang="ts" setup>
import MjInput from '@/components/MjInput/MjInput.vue';
import MjButton from '@/components/MjButton/MjButton.vue';
import { ref } from 'vue';
import MjMessage from '@/components/MjMessage';

const url = ref('');
const urlToBase64 = () => {
  if (typeof url.value === 'string' && /https?:\/\//.test(url.value)) {
    const img = document.createElement('img');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const base64Url = canvas.toDataURL('image/png');
      navigator.clipboard
        .writeText(base64Url)
        .then(() => {
          MjMessage.success('已复制到剪切板');
        })
        .catch(() => {
          MjMessage.error('转换失败');
        });
    };
    img.onerror = () => {
      MjMessage.error('转换失败');
    };
    img.src = url.value;
  }
};
</script>
<style scoped lang="scss"></style>
