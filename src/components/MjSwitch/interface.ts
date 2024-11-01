export interface MjSwitchProps {
  checkedValue?: string | number | boolean;
  uncheckedValue?: string | number | boolean;
  checkedText?: string;
  uncheckedText?: string;
  checkedColor?: string;
  uncheckedColor?: string;
  disabled?: boolean;
  size?: 'medium' | 'small';
}

export interface MjSwitchEmits {
  (e: 'change', val: string | number | boolean): void;
}
