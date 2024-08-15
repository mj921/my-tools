<template>
  <select class="mj-select" v-model="model" @change="emits('change', model)" :disabled="disabled">
    <template v-for="item in options">
      <optgroup
        v-if="typeof item === 'object' && (item as MjSelectOptionGroup).isGroup"
        :key="`optionGroup-${item.label}`"
        :label="item.label"
      >
        <option
          v-for="option in (item as MjSelectOptionGroup).options"
          :key="`option-${item.label}-${(option as MjSelectOptionData).value ?? option}`"
        >
          {{
            (option as MjSelectOptionData).label ?? (option as MjSelectOptionData).value ?? option
          }}
        </option>
      </optgroup>
      <option
        v-else
        :key="`option-$${(item as MjSelectOptionData).value ?? item}`"
        :value="(item as MjSelectOptionData) ?? item"
      >
        {{ (item as MjSelectOptionData).label ?? (item as MjSelectOptionData).value ?? item }}
      </option>
    </template>
  </select>
</template>
<script lang="ts" setup>
import type {
  MjSelectProps,
  MjSelectEmits,
  MjSelectOptionGroup,
  MjSelectOptionData,
} from './interface';

const model = defineModel<string | number | boolean>();

defineProps<MjSelectProps>();

const emits = defineEmits<MjSelectEmits>();
</script>
<style scoped lang="scss">
.mj-select {
  appearance: none;
  border: none;
  background-color: #ddd;
  outline: none;
  height: 30px;
  padding: 0 30px 0 10px;
  background-image: url('@/assets/icons/down.svg');
  background-repeat: no-repeat;
  background-position: right 8px center;
  background-size: 14px;
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
