export interface MjTableColumnProp {
  label?: string;
  name: string;
  slotName?: string;
  formatter?: (value: any, row: any, i: number) => any;
}

export interface MjTableProps<T> {
  columns: MjTableColumnProp[];
  data: T[];
  primaryKey?: keyof T;
  tdDefaultValue?: string;
  border?: boolean;
}
