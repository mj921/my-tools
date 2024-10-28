export interface MjTableColumnProp {
  width?: number;
  label?: string;
  name: string;
  slotName?: string;
  align?: 'left' | 'center' | 'right';
  formatter?: (value: any, row: any, i: number) => any;
}

export interface MjTableProps<T> {
  columns: MjTableColumnProp[];
  data: T[];
  primaryKey?: keyof T;
  tdDefaultValue?: string;
  border?: boolean;
}
