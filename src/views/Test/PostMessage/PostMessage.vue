<template>
  <div><button @click="windowOpen">打开</button></div>
</template>
<script lang="ts" setup>
import { onMounted } from 'vue';

const windowOpen = () => {
  const opener = window.open('https://mj921.github.io/my-tools/test/postmessage');
  window.addEventListener('message', (e) => {
    if (e.data.msgType === 'loaded') {
      opener?.postMessage({ msgType: 'test', value: { a: 1 } }, 'https://mj921.github.io');
    }
  });
};
onMounted(() => {
  setTimeout(() => {
    if (window.opener) {
      window.opener.postMessage(
        {
          msgType: 'loaded',
        },
        '*',
      );
      window.addEventListener('message', (e) => {
        if (e?.data?.msgType === 'test') {
          console.log('%onmessage', 'color: red');
          console.log(e);
        }
      });
    }
  }, 3000);
});
</script>
<style scoped lang="scss"></style>
