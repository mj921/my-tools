import type { ComputedRef } from 'vue';
import type { MjTabPanelProps } from './interface';

export const injectTabsKey = Symbol('TabsContextKey');

export interface TabsContext {
  activeKey: ComputedRef<string>;
  addPanel: (key: string, panelProps: MjTabPanelProps) => void;
}
