export interface MjInputProps {
  disabled?: boolean;
  placeholder?: string;
}

export interface MjInputEmits {
  (e: 'change', value?: string | number): void;
}
