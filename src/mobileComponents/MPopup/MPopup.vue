<template>
  <Teleport :to="popupContainer" :disabled="!renderToBody">
    <Transition name="m-popup-scale">
      <div class="m-popup-container" v-if="!unmountOnClose || visible" v-show="visible">
        <div class="m-popup-mask" :style="maskStyle" v-if="mask" @click="onMaskClick"></div>
        <div class="m-popup-wrapper">
          <div
            :class="`m-popup ${attrs.class}`"
            :style="{ ...modalSizeStyle, ...(attrs.style || {}) }"
          >
            <div
              :class="['m-popup-body', ...(Array.isArray(bodyClass) ? bodyClass : [bodyClass])]"
              :style="bodyStyle"
            >
              <slot></slot>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
<script lang="ts" setup>
import type { MPopupProps, MPopupEmits } from './interface';
import { computed, useAttrs } from 'vue';

const attrs = useAttrs();

const visible = defineModel<boolean>({ required: true });

const props = withDefaults(defineProps<MPopupProps>(), {
  renderToBody: true,
  popupContainer: 'body',
  unmountOnClose: false,
  maskClosable: true,
  closable: true,
  titleAlign: 'center',
  mask: true,
  onBeforeOk: () => true,
  onBeforeCancel: () => true,
  position: 'center',
});

const emits = defineEmits<MPopupEmits>();

const modalSizeStyle = computed(() => {
  switch (props.position) {
    case 'bottom':
    case 'top':
      return { width: '100%', height: '30%' };
    case 'left':
    case 'right':
      return { width: '30%', height: '100%' };
    default:
      return { width: '30%', height: '30%' };
  }
});

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

const onMaskClick = () => {
  if (props.maskClosable) {
    cancelHandle('mask');
  }
};
</script>
<style scoped lang="scss">
.m-popup-container {
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  .m-popup-mask {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba($color: #000000, $alpha: 0.45);
  }
  .m-popup-scroll {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    .m-popup-wrapper {
      display: flex;
      justify-content: center;
      align-items: center;
      pointer-events: none;
      padding: 40px 0;
      .m-popup {
        position: relative;
        pointer-events: all;
        display: inline-block;
        vertical-align: middle;
        width: 520px;
        background-color: #fff;
        border-radius: 4px;
        .m-popup-header {
          padding: 0 20px;
          height: 48px;
          border-radius: 4px 4px 0 0;
          border-bottom: 1px solid var(--mj-color-gray-1);
          display: flex;
          justify-content: center;
          align-items: center;
          .m-popup-title {
            flex: 1;
            padding-left: 24px;
            text-align: center;
            color: var(--mj-color-gray-10);
            font-size: 16px;
            line-height: 1.5;
          }
          .m-popup-close-btn {
            flex: 0 0 12px;
            margin-left: 12px;
            width: 12px;
            font-size: 12px;
            display: flex;
            height: 24px;
            align-items: center;
            color: var(--mj-color-gray-10);
            cursor: pointer;
            .m-popup-close-hover {
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
        .m-popup-body {
          padding: 20px;
        }
        .m-popup-footer {
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
}

.m-popup-scale-enter-active,
.m-popup-scale-leave-active {
  transition: opacity 0.2s linear;
  .m-popup-wrapper {
    transition: transform 0.2s linear;
  }
}

.m-popup-scale-enter-from,
.m-popup-scale-leave-to {
  opacity: 0;
  .m-popup-wrapper {
    transform: scale(0.5);
  }
}

.m-popup-scale-enter-to,
.m-popup-scale-leave-from {
  opacity: 1;
  .m-popup-wrapper {
    transform: scale(1);
  }
}
</style>
