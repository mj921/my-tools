export interface MButtonEmits {
  (e: 'click'): void;
}

export interface MButtonProps {
  size?: 'mini' | 'small' | 'medium' | 'large';
  type?: 'default' | 'primary' | 'dashed' | 'outline' | 'text';
  status?: 'normal' | 'success' | 'warning' | 'danger';
  shape?: 'square' | 'round' | 'circle';
  long?: boolean;
  disabled?: boolean;
  loading?: boolean;
}

export interface MButtonSlots {
  default(): any;
  icon?: () => any;
}
