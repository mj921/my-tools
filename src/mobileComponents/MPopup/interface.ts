import type { CSSProperties } from 'vue';

export interface MPopupProps {
  /** 标题 */
  title?: string;
  renderToBody?: boolean;
  popupContainer?: string | HTMLElement;
  /** 关闭时是否卸载节点 */
  unmountOnClose?: boolean;
  /** 是否点击遮罩层可以关闭对话框 */
  maskClosable?: boolean;
  /** 是否显示关闭按钮 */
  closable?: boolean;
  mask?: boolean;
  width?: number | string;
  maskStyle?: CSSProperties;
  popupStyle?: CSSProperties;
  popupClass?: string | any[];
  bodyStyle?: CSSProperties;
  bodyClass?: string | any[];
  onBeforeOk?: () => boolean | Promise<boolean>;
  onBeforeCancel?: () => boolean | Promise<boolean>;
  position?: 'bottom' | 'top' | 'left' | 'right' | 'center';
}

export interface MPopupEmits {
  (e: 'cancel', closeType: 'cancel' | 'close' | 'mask'): void;
  (e: 'ok'): void;
}
