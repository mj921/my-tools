<template>
  <div :class="tableClassNames">
    <table class="mj-table-content" :style="{ width: `${tableMinWidth}px` }">
      <colgroup>
        <col
          v-if="rowSelection"
          :style="{
            width: `${rowSelection.width}px`,
            minWidth: `${rowSelection.width}px`,
          }"
        />
        <col
          v-for="column in columns"
          :key="`col-${column.name}`"
          :style="{
            width: `${column.width}px`,
            minWidth: `${column.width && column.minWidth ? Math.max(column.width, column.minWidth) : column.width || column.minWidth}px`,
            maxWidth: `${column.width && column.minWidth ? Math.max(column.width, column.minWidth) : column.width}px`,
          }"
        />
      </colgroup>
      <thead>
        <tr>
          <th v-if="rowSelection">
            <mj-checkbox v-if="rowSelection.showCheckedAll" :checked="selectAll" />
          </th>
          <th
            v-for="column in columns"
            :key="`thead-${column.name}`"
            :style="{
              textAlign: column.align,
            }"
          >
            {{ column.title ?? column.name }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(row, $index) in data"
          :key="`tbody-tr-${primaryKey ? (row as any)[primaryKey] : $index}`"
        >
          <td v-if="rowSelection">
            <mj-checkbox
              :checked="selectedList.includes((row as any)[primaryKey])"
              @change="onRowSelectChange(row, $event)"
            />
          </td>
          <td
            v-for="column in columns"
            :key="`tbody-td-${primaryKey ? (row as any)[primaryKey] : $index}-${column.name}`"
            :style="{ textAlign: column.align }"
          >
            <slot
              v-if="column.slotName"
              :name="column.slotName"
              :value="(data[$index] as any)[column.name]"
              :row="row"
              :index="$index"
            ></slot>
            <template v-else-if="column.render">
              <Component
                :is="column.render"
                :record="data[$index]"
                :value="(data[$index] as any)[column.name]"
                :index="$index"
              />
            </template>
            <template v-else>{{
              (column.formatter
                ? column.formatter((data[$index] as any)[column.name], row, $index)
                : (data[$index] as any)[column.name]) ?? tdDefaultValue
            }}</template>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script lang="ts" setup generic="T">
import { computed, ref } from 'vue';
import type { MjTableEmits, MjTableProps } from './interface';
import MjCheckbox from '../MjCheckbox/MjCheckbox.vue';

const props = withDefaults(defineProps<MjTableProps<T>>(), {
  border: true,
  tdDefaultValue: '-',
});
const emits = defineEmits<MjTableEmits>();
const tableClassNames = computed(() => {
  const list = ['mj-table'];
  if (props.border) {
    list.push('mj-table--border');
  }
  return list;
});
const tableMinWidth = computed(() =>
  props.columns.reduce((prev, el) => prev + Math.max(el.minWidth || 0, el.width || 0), 0),
);

const selectAll = ref(false);
const selectedList = ref<(string | number)[]>([]);

const onRowSelectChange = (row: T, checked: boolean) => {
  const rowKey = (row as any)[props.primaryKey];
  const index = selectedList.value.indexOf(rowKey);
  if (index === -1 && checked) {
    selectedList.value.push((row as any)[props.primaryKey]);
    emits('select', selectedList.value, rowKey, checked);
    emits('selection-change', selectedList.value);
  } else if (index > -1 && !checked) {
    selectedList.value.splice(index, 1);
    emits('select', selectedList.value, rowKey, checked);
    emits('selection-change', selectedList.value);
  } else {
    emits('select', selectedList.value, rowKey, checked);
  }
};
</script>
<style scoped lang="scss">
.mj-table {
  width: 100%;
  overflow: auto;
  .mj-table-content {
    border-collapse: collapse;
    text-align: center;
    min-width: 100%;
    th {
      font-weight: bold;
      position: sticky;
    }
    td,
    th {
      border: 1px solid #ccc;
      padding: 4px 10px;
      word-break: break-all;
      &:nth-child(3) {
        width: 200px;
      }
    }
  }
  &.mj-table--border {
    .mj-table-content {
      th,
      td {
        border: 1px solid #333;
      }
    }
  }
}
</style>
