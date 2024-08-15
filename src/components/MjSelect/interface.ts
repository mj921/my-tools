export interface MjSelectOptionData {
  value: string | number | boolean;
  label?: string;
  disabled?: boolean;
}

export interface MjSelectOptionGroup {
  isGroup?: boolean;
  label: string;
  options: (number | string | boolean | MjSelectOptionData)[];
}

export interface MjSelectProps {
  options: (number | string | boolean | MjSelectOptionData | MjSelectOptionGroup)[];
  disabled?: boolean;
}

export interface MjSelectEmits {
  (e: 'change', value?: string | number | boolean): void;
}
