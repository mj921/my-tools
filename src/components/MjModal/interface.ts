import type { CSSProperties } from 'vue';
import type { MjButtonProps } from '../MjButton/interface';

export interface MjModalProps {
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
  /** 确认按钮的内容 */
  okText?: string;
  /** 取消按钮的内容 */
  cancelText?: string;
  okButtonProps?: MjButtonProps;
  cancelButtonProps?: MjButtonProps;
  /** 是否隐藏取消按钮 */
  hideCancel?: boolean;
  /** 标题的水平对齐方向 */
  titleAlign?: 'start' | 'center';
  mask?: boolean;
  width?: number | string;
  footer?: boolean;
  hideTitle?: boolean;
  maskStyle?: CSSProperties;
  modalStyle?: CSSProperties;
  modalClass?: string | any[];
  bodyStyle?: CSSProperties;
  bodyClass?: string | any[];
  onBeforeOk?: () => boolean | Promise<boolean>;
  onBeforeCancel?: () => boolean | Promise<boolean>;
}

export interface MjModalEmits {
  (e: 'cancel', closeType: 'cancel' | 'close' | 'mask'): void;
  (e: 'ok'): void;
}

export interface MjModalSlots {
  default?: () => void;
  title?: () => void;
  footer?: () => void;
}

export interface MjModalConfig {
  title: string;
  content: string;
  /** 确认按钮的内容 */
  okText?: string;
  /** 取消按钮的内容 */
  cancelText?: string;
  /** 是否隐藏取消按钮 */
  hideCancel?: boolean;
  onBeforeOk?: () => boolean | Promise<boolean>;
  onBeforeCancel?: () => boolean | Promise<boolean>;
  onOk?: () => any;
  onCancel?: () => any;
}
