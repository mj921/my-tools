export interface MjIconProps {
  color?: string;
  spin?: boolean;
}

export interface MjIconEmits {
  (e: 'click', ev: MouseEvent): void;
}
