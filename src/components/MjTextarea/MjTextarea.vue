<template>
  <textarea
    ref="textareaRef"
    class="mj-textarea"
    v-model="model"
    :placeholder="placeholder"
    @input="onChange"
    :disabled="disabled"
    :rows="rows"
    @keyup.enter="emits('enter', $event)"
  ></textarea>
</template>
<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import type { MjTextareaProps, MjTextareaEmits } from './interface';

const model = defineModel<string>();

withDefaults(defineProps<MjTextareaProps>(), {
  resize: 'vertical',
});

const emits = defineEmits<MjTextareaEmits>();

const textareaRef = ref<HTMLTextAreaElement>();

const onChange = () => {
  emits('change', model.value);
};
onMounted(() => {});
</script>
<style scoped lang="scss">
.mj-textarea {
  appearance: none;
  border: none;
  background-color: #ddd;
  outline: none;
  padding: 10px;
  width: 100%;
  resize: v-bind(resize);
  &:focus {
    background-color: #eee;
  }
  &:disabled {
    background-color: #eee;
    color: #999;
    cursor: not-allowed;
  }
}
</style>
