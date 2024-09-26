import type { RenderFunction } from 'vue';

export interface MjMessageProps {
  content: string;
  icon?: RenderFunction;
}

export interface MjMessageConfig {
  content: string;
  duration?: number;
  type?: 'info' | 'success' | 'error' | 'warning';
  icon?: RenderFunction;
}
