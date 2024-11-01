export interface MjTableColumnProp {
  width?: number;
  minWidth?: number;
  title?: string;
  name: string;
  slotName?: string;
  align?: 'left' | 'center' | 'right';
  formatter?: (value: any, row: any, i: number) => any;
}

export interface MjTableRowSelection {
  type: 'checkbox' | 'radio';
  selectedRowKeys?: (string | number)[];
  showCheckedAll?: boolean;
  title?: string;
  width?: number;
}

export interface MjTableProps<T> {
  columns: MjTableColumnProp[];
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
