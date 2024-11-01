export interface MjFormField {}
export interface MjFormItemProps {
  label: string;
  name: string;
}
export interface MjFormProps {
  /** 是否展示冒号 */
  showColon?: boolean;
  labelWidth?: number;
  labelAlign?: 'left' | 'right' | 'top';
  model: Object;
}

export interface MjFormInject {
  showColon: boolean;
  labelWidth: number;
  labelAlign: 'left' | 'right' | 'top';
  addField: (field: MjFormField) => void;
}
