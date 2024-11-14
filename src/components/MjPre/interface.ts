export interface MjPreProps {
  value: string;
  lang?: string;
  copyable?: boolean;
}

export interface MjPreMapItem {
  type: string;
  className?: string;
  value: string;
  children: string[];
  start?: boolean;
  startBracket?: string;
  endBracket?: string;
}

export interface MjPreItem {
  type: string;
  className?: string;
  value: string;
  level?: number;
  children: MjPreItem[];
  startBracket?: string;
  endBracket?: string;
}
