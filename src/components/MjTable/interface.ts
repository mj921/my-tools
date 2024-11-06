import type { VNode } from 'vue';

export interface MjTableColumnProp<T> {
  width?: number;
  minWidth?: number;
  title?: string;
  name: string;
  slotName?: string;
  align?: 'left' | 'center' | 'right';
  formatter?: (value: any, row: any, i: number) => any;
  render?: (props: { record: T; value: any; index: number }) => VNode;
}

export interface MjTableRowSelection {
  type: 'checkbox' | 'radio';
  selectedRowKeys?: (string | number)[];
  showCheckedAll?: boolean;
  title?: string;
  width?: number;
}

export interface MjTableProps<T> {
  columns: MjTableColumnProp<T>[];
  data: T[];
  primaryKey?: keyof T;
  tdDefaultValue?: string;
  border?: boolean;
  rowSelection?: MjTableRowSelection;
}

export interface MjTableEmits {
  (e: 'select', rowKeys: (string | number)[], rowKey: string | number, checked: boolean): void;
  (e: 'selection-change', rowKeys: (string | number)[]): void;
}
