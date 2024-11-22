<template>
  <div></div>
</template>
<script lang="ts" setup>
import { onMounted } from 'vue';

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
