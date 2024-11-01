export interface MjTextareaProps {
  disabled?: boolean;
  placeholder?: string;
  resize?: 'both' | 'horizontal' | 'vertical' | 'none';
}

export interface MjTextareaEmits {
  (e: 'change', value?: string | number): void;
}
