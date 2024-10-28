<template>
  <table :class="tableClassNames">
    <colgroup>
      <col
        v-for="column in columns"
        :key="`col-${column.name}`"
        :style="{
          width: `${column.width || 80}px`,
        }"
      />
    </colgroup>
    <thead>
      <tr>
        <th
          v-for="column in columns"
          :key="`thead-${column.name}`"
          :style="{ textAlign: column.align }"
        >
          {{ column.label ?? column.name }}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="(row, $index) in data"
        :key="`tbody-tr-${primaryKey ? (row as any)[primaryKey] : $index}`"
      >
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
          <template v-else>{{
            (column.formatter
              ? column.formatter((data[$index] as any)[column.name], row, $index)
              : (data[$index] as any)[column.name]) ?? tdDefaultValue
          }}</template>
        </td>
      </tr>
    </tbody>
  </table>
</template>
<script lang="ts" setup generic="T">
import { computed } from 'vue';
import type { MjTableProps } from './interface';

const props = withDefaults(defineProps<MjTableProps<T>>(), {
  border: true,
  tdDefaultValue: '-',
});
const tableClassNames = computed(() => {
  const list = ['mj-table'];
  if (props.border) {
    list.push('mj-table--border');
  }
  return list;
});
</script>
<style scoped lang="scss">
.mj-table {
  border-collapse: collapse;
  th {
    font-weight: bold;
  }
  td,
  th {
    border: 1px solid #ccc;
    padding: 0 10px;
    &:nth-child(3) {
      width: 200px;
    }
  }
  &.mj-table--border {
    th,
    td {
      border: 1px solid #333;
    }
  }
}
</style>
