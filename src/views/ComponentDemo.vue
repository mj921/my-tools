<template>
  <div>
    <mj-button @click="showMessage">message</mj-button>
    <br />
    <mj-button @click="showModal">modal</mj-button>
    <mj-button @click="showModal1">modal1</mj-button>
    <mj-modal v-model="modalVisible" title="标题">123</mj-modal>
  </div>
</template>
<script lang="ts" setup>
import MjButton from '@/components/MjButton/MjButton.vue';
import mjmessage from '@/components/MjMessage/mjmessage';
import MjModal from '@/components/MjModal/MjModal.vue';
import modal from '@/components/MjModal/mjmodal';
import { ExampleClass } from '@/lib/tsdemo/decorator';
import { ref } from 'vue';

const count = ref(0);
const modalVisible = ref(false);

const showMessage = () => {
  const list: Array<'error' | 'success' | 'warning' | 'info'> = [
    'info',
    'success',
    'warning',
    'error',
  ];
  mjmessage({
    content: Math.random().toString(),
    type: list[count.value++ % 4],
  });
};
const showModal = () => {
  modalVisible.value = true;
};
const showModal1 = () => {
  modal({
    title: 'ttt',
    content: '222',
  });
};
const demo = new ExampleClass();
</script>
<style scoped lang="scss">
.mj-btn {
  margin: 4px;
}
</style>
