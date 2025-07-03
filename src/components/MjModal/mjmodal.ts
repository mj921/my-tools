import { createApp, h, nextTick, render } from 'vue';
import MjModal from './MjModal.vue';
import CheckCircleFillIcon from '../MjIcon/CheckCircleFillIcon.vue';
import CloseCircleFillIcon from '../MjIcon/CloseCircleFillIcon.vue';
import WarningCircleFillIcon from '../MjIcon/WarningCircleFillIcon.vue';
import InfoCircleFillIcon from '../MjIcon/InfoCircleFillIcon.vue';
import type { MjModalConfig, MjModalProps } from './interface';

const modal = (config: MjModalConfig) => {
  config = {
    // type: 'info',
    ...config,
  };
  // let icon = config.icon;
  // if (!icon) {
  //   if (config) {
  //     switch (config.type) {
  //       case 'success':
  //         icon = () => h(CheckCircleFillIcon, { color: 'var(--mj-color-success)' });
  //         break;
  //       case 'error':
  //         icon = () => h(CloseCircleFillIcon, { color: 'var(--mj-color-error)' });
  //         break;
  //       case 'warning':
  //         icon = () => h(WarningCircleFillIcon, { color: 'var(--mj-color-warning)' });
  //         break;
  //       default:
  //         icon = () => h(InfoCircleFillIcon, { color: 'var(--mj-color-primary)' });
  //     }
  //   }
  // }
  let close = () => {};
  const box = document.createElement('div');
  box.classList.add('mj-modal-wrapper');
  document.body.appendChild(box);
  const props = {
    title: config.title,
    modelValue: true,
    popupContainer: box,
    /** 确认按钮的内容 */
    okText: config.okText,
    /** 取消按钮的内容 */
    cancelText: config.cancelText,
    /** 是否隐藏取消按钮 */
    hideCancel: config.hideCancel,
    onBeforeOk: config.onBeforeOk,
    onBeforeCancel: config.onBeforeCancel,
    onCancel: () => {
      config.onCancel?.();
      close();
    },
    onOk: () => {
      config.onOk?.();
      close();
    },
  };
  const vm = h<MjModalProps>(MjModal, props, {
    default: () => config.content,
  });
  render(vm, box);
  close = () => {
    render(null, box);
    document.body.removeChild(box);
  };
  return {
    close: () => {
      if (vm.component?.props) {
        vm.component.props.visible = false;
      }
    },
    update: (updateConfig: MjModalConfig) => {
      const props = {
        okText: updateConfig.okText,
        cancelText: updateConfig.cancelText,
        hideCancel: updateConfig.hideCancel,
        onBeforeOk: updateConfig.onBeforeOk,
        onBeforeCancel: updateConfig.onBeforeCancel,
        onCancel: () => {
          updateConfig.onCancel?.();
          close();
        },
        onOk: () => {
          updateConfig.onOk?.();
          close();
        },
      };
      Object.entries(props).forEach(([key, value]) => {
        if (vm.component?.props) {
          vm.component.props[key] = value;
        }
      });
    },
  };
};

export default modal;

modal.confirm = ({ onOk, onCancel, ...config }: MjModalConfig) =>
  new Promise((resolve, reject) =>
    modal({
      ...config,
      onOk: (...rest) => {
        onOk?.();
        resolve(rest);
      },
      onCancel: (...rest) => {
        onCancel?.();
        reject(rest);
      },
    }),
  );
