<template>
  <Teleport :to="popupContainer" :disabled="!renderToBody">
    <Transition name="mj-modal-scale">
      <div class="mj-modal-container" v-if="!unmountOnClose || visible" v-show="visible">
        <div class="mj-modal-mask" :style="maskStyle" v-if="mask" @click="onMaskClick"></div>
        <div class="mj-modal-wrapper">
          <div
            :class="['mj-modal', ...(Array.isArray(modalClass) ? modalClass : [modalClass])]"
            :style="{ width: modalWidth, ...modalStyle }"
          >
            <div class="mj-modal-header">
              <div v-if="!hideTitle" class="mj-modal-title" :style="{ textAlign: titleAlign }">
                <slot v-if="slots.title" name="title"></slot>
                <template v-else>{{ title }}</template>
              </div>
              <div v-if="closable" class="mj-modal-close-btn" @click="cancelHandle('close')">
                <div class="mj-modal-close-hover">
                  <CloseIcon />
                </div>
              </div>
            </div>
            <div
              :class="['mj-modal-body', ...(Array.isArray(bodyClass) ? bodyClass : [bodyClass])]"
              :style="bodyStyle"
            >
              <slot></slot>
            </div>
            <div class="mj-modal-footer" v-if="footer">
              <slot v-if="slots.footer" name="footer"></slot>
              <template v-else>
                <mj-button
                  v-if="!hideCancel"
                  @click="cancelHandle('cancel')"
                  v-bind="cancelButtonProps"
                >
                  {{ cancelText }}
                </mj-button>
                <mj-button @click="onOkClick" type="primary" v-bind="okButtonProps">
                  {{ okText }}
                </mj-button>
              </template>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
<script lang="ts" setup>
import CloseIcon from '@/components/MjIcon/CloseIcon.vue';
import MjButton from '@/components/MjButton/MjButton.vue';
import type { MjModalProps, MjModalEmits, MjModalSlots } from './interface';
import { computed } from 'vue';

const visible = defineModel<boolean>({ required: true });

const props = withDefaults(defineProps<MjModalProps>(), {
  renderToBody: true,
  popupContainer: 'body',
  unmountOnClose: false,
  maskClosable: true,
  closable: true,
  okText: '确定',
  cancelText: '取消',
  hideCancel: false,
  titleAlign: 'center',
  mask: true,
  footer: true,
  hideTitle: false,
  onBeforeOk: () => true,
  onBeforeCancel: () => true,
});

const emits = defineEmits<MjModalEmits>();

const slots = defineSlots<MjModalSlots>();

const modalWidth = computed(() =>
  typeof props.width === 'number' ? `${props.width}px` : props.width,
);

const onOk = () => {
  emits('ok');
  visible.value = false;
};
const onCancel = (closeType: 'cancel' | 'close' | 'mask') => {
  emits('cancel', closeType);
  visible.value = false;
};
const cancelHandle = (closeType: 'cancel' | 'close' | 'mask') => {
  const flag = props.onBeforeCancel();
  if (flag instanceof Promise) {
    flag.then(() => {
      onCancel(closeType);
    });
  } else if (flag) {
    onCancel(closeType);
  }
};

const onOkClick = () => {
  const flag = props.onBeforeOk();
  if (flag instanceof Promise) {
    flag.then(() => {
      onOk();
    });
  } else if (flag) {
    onOk();
  }
};
const onMaskClick = () => {
  if (props.maskClosable) {
    cancelHandle('mask');
  }
};
</script>
<style scoped lang="scss">
.mj-modal-container {
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  .mj-modal-mask {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba($color: #000000, $alpha: 0.45);
  }
  .mj-modal-wrapper {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    pointer-events: none;
    .mj-modal {
      position: relative;
      pointer-events: all;
      display: inline-block;
      margin: 0 auto;
      vertical-align: middle;
      width: 520px;
      background-color: #fff;
      border-radius: 4px;
      .mj-modal-header {
        padding: 0 20px;
        height: 48px;
        border-radius: 4px 4px 0 0;
        border-bottom: 1px solid var(--mj-color-gray-1);
        display: flex;
        justify-content: center;
        align-items: center;
        .mj-modal-title {
          flex: 1;
          padding-left: 24px;
          text-align: center;
          color: var(--mj-color-gray-10);
          font-size: 16px;
          line-height: 1.5;
        }
        .mj-modal-close-btn {
          flex: 0 0 12px;
          margin-left: 12px;
          width: 12px;
          font-size: 12px;
          display: flex;
          height: 24px;
          align-items: center;
          color: var(--mj-color-gray-10);
          cursor: pointer;
          .mj-modal-close-hover {
            position: relative;
            width: 12px;
            height: 12px;
            &:hover {
              &::before {
                position: absolute;
                z-index: 0;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                content: '';
                border-radius: 50%;
                transform-origin: center;
                transform: scale(1.4);
                background-color: var(--mj-color-gray-1);
              }
            }
          }
          .mj-icon {
            position: relative;
            z-index: 1;
          }
        }
      }
      .mj-modal-body {
        padding: 20px;
      }
      .mj-modal-footer {
        padding: 16px 20px;
        border-radius: 0 0 4px 4px;
        border-top: 1px solid var(--mj-color-gray-1);
        display: flex;
        justify-content: end;
        .mj-btn {
          margin-left: 12px;
        }
      }
    }
  }
}

.mj-modal-scale-enter-active,
.mj-modal-scale-leave-active {
  transition: opacity 0.2s linear;
  .mj-modal-wrapper {
    transition: transform 0.2s linear;
  }
}

.mj-modal-scale-enter-from,
.mj-modal-scale-leave-to {
  opacity: 0;
  .mj-modal-wrapper {
    transform: scale(0.5);
  }
}

.mj-modal-scale-enter-to,
.mj-modal-scale-leave-from {
  opacity: 1;
  .mj-modal-wrapper {
    transform: scale(1);
  }
}
</style>
