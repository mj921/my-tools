export interface MjTextareaProps {
  disabled?: boolean;
  placeholder?: string;
  resize?: 'both' | 'horizontal' | 'vertical' | 'none';
  rows?: number;
}

export interface MjTextareaEmits {
  (e: 'change', value?: string | number): void;
  (e: 'enter', ev: KeyboardEvent): void;
}
