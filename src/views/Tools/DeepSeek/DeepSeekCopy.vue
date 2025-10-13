<template>
  <textarea v-model="content" readonly style="width: 100%; height: 100%" rows="10"></textarea>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import DSDbTool from './db';
import { useRoute } from 'vue-router';

const dbtool = new DSDbTool();
const content = ref('');
const route = useRoute();
dbtool.getContentListByGhatKey(+route.params.chatKey).then((res) => {
  if (res.success) {
    content.value =
      'deepseekcopy' +
      JSON.stringify(
        (res.data || []).map(
          (el) => `${el.role}:${(el.content || '').replace(/(^[\n\s]+|[\n\s]+$)/g, '')}`,
        ),
      );
  }
});
</script>
<style scoped lang="scss"></style>
