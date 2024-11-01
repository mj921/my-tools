<template>
  <form class="mj-form" @submit="onSubmit"><slot /></form>
</template>
<script lang="ts" setup>
import { provide, reactive, ref } from 'vue';
import type { MjFormField, MjFormInject, MjFormProps } from './interface';
import { MjFormInjectKey } from './context';

const props = withDefaults(defineProps<MjFormProps>(), {
  showColon: false,
  labelAlign: 'right',
  labelWidth: 80,
});

const fields = ref<MjFormField[]>([]);

const addField = (field: MjFormField) => {
  fields.value.push(field);
};

provide(
  MjFormInjectKey,
  reactive<MjFormInject>({
    showColon: props.showColon,
    labelWidth: props.labelWidth,
    labelAlign: props.labelAlign,
    addField,
  }),
);

const onSubmit = () => {};
</script>
<style lang="scss">
.mj-form {
  .mj-form-item {
    margin-bottom: 24px;
    display: flex;
    .mj-form-item__label {
      flex: 0;
      margin-right: 8px;
    }
    .mj-form-item__content {
      flex: 1;
    }
    &.mj-form-item--top {
      display: block;
      .mj-form-item__label {
        margin-right: 0;
      }
    }
  }
}
</style>
