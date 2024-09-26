export interface MjButtonEmits {
  (e: 'click'): void;
}

export interface MjButtonProps {
  size?: 'mini' | 'small' | 'medium' | 'large';
  type?: 'default' | 'primary' | 'dashed' | 'outline' | 'text';
  status?: 'normal' | 'success' | 'warning' | 'danger';
  shape?: 'square' | 'round' | 'circle';
  long?: boolean;
  disabled?: boolean;
  loading?: boolean;
}

export interface MjButtonSlots {
  default(): any;
  icon?: () => any;
}
