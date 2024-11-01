export interface MjCheckboxProps {
  label?: string;
  checked?: boolean;
  size?: 'mini' | 'small' | 'middle' | 'large';
}

export interface MjCheckboxEmits {
  (e: 'change', val: boolean): void;
}
