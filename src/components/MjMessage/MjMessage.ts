import { createApp, defineComponent, h, type PropType, type RenderFunction } from 'vue';
// import MjMessage from './MjMessage.vue';
import './mjmessage.scss';
import type { MjMessageConfig } from './interface';
import CloseCircleFillIcon from '../MjIcon/CloseCircleFillIcon.vue';
import InfoCircleFillIcon from '../MjIcon/InfoCircleFillIcon.vue';
import WarningCircleFillIcon from '../MjIcon/WarningCircleFillIcon.vue';
import CheckCircleFillIcon from '../MjIcon/CheckCircleFillIcon.vue';

const MjMessage = defineComponent({
  props: {
    content: {
      type: String,
      required: true,
    },
    icon: {
      type: Object as PropType<RenderFunction>,
      required: true,
    },
  },
  setup({ content, icon }) {
    return () => {
      return h('div', { className: 'mj-message' }, [
        h('div', { className: 'mj-messsage-icon' }, [icon?.()]),
        h('div', { className: 'mj-messsage-content' }, content),
      ]);
    };
  },
});

const message = (config: string | MjMessageConfig) => {
  if (typeof config === 'string') {
    config = {
      content: config,
      duration: 2000,
      type: 'info',
    };
  } else {
    config = {
      duration: 2000,
      type: 'info',
      ...config,
    };
  }
  let icon = config.icon;
  if (!icon) {
    if (config) {
      switch (config.type) {
        case 'success':
          icon = () => h(CheckCircleFillIcon, { color: 'var(--mj-color-success)' });
          break;
        case 'error':
          icon = () => h(CloseCircleFillIcon, { color: 'var(--mj-color-error)' });
          break;
        case 'warning':
          icon = () => h(WarningCircleFillIcon, { color: 'var(--mj-color-warning)' });
          break;
        default:
          icon = () => h(InfoCircleFillIcon, { color: 'var(--mj-color-primary)' });
      }
    }
  }
  const app = createApp(MjMessage, {
    content: config.content,
    icon,
  });
  let box = document.querySelector('.mj-message-wrapper');
  if (!box) {
    box = document.createElement('div');
    box.classList.add('mj-message-wrapper');
  }
  const currentBox = document.createElement('div');
  currentBox.classList.add('mj-message-row');
  box.appendChild(currentBox);
  document.body.appendChild(box);
  app.mount(currentBox);
  setTimeout(() => {
    app.unmount();
    box.removeChild(currentBox);
    if (box.childNodes.length === 0) {
      document.body.removeChild(box);
    }
  }, config.duration);
};

message.success = (config: string | MjMessageConfig) => {
  if (typeof config === 'string') {
    config = {
      content: config,
      type: 'success',
    };
  } else {
    config = {
      ...config,
      type: 'success',
    };
  }
  message(config);
};

message.warning = (config: string | MjMessageConfig) => {
  if (typeof config === 'string') {
    config = {
      content: config,
      type: 'warning',
    };
  } else {
    config = {
      ...config,
      type: 'warning',
    };
  }
  message(config);
};

message.info = (config: string | MjMessageConfig) => {
  if (typeof config === 'string') {
    config = {
      content: config,
      type: 'info',
    };
  } else {
    config = {
      ...config,
      type: 'info',
    };
  }
  message(config);
};
message.error = (config: string | MjMessageConfig) => {
  if (typeof config === 'string') {
    config = {
      content: config,
      type: 'error',
    };
  } else {
    config = {
      ...config,
      type: 'error',
    };
  }
  message(config);
};

export default message;
