<template>
  <div class="mj-electronic-number">
    <div class="mj-electronic-number-box mj-electronic-number-box--colon" v-if="value === ':'">
      <div class="mj-electronic-number-dot-top"></div>
      <div class="mj-electronic-number-dot-bottom"></div>
    </div>
    <div class="mj-electronic-number-box" v-else>
      <div
        :class="{
          'mj-electronic-number-top': true,
          'mj-electronic-number--active': ['0', '2', '3', '5', '6', '7', '8', '9'].includes(
            value.toString(),
          ),
        }"
      ></div>
      <div
        :class="{
          'mj-electronic-number-topleft': true,
          'mj-electronic-number--active': ['0', '4', '5', '6', '8', '9'].includes(value.toString()),
        }"
      ></div>
      <div
        :class="{
          'mj-electronic-number-topright': true,
          'mj-electronic-number--active': ['0', '1', '2', '3', '4', '7', '8', '9'].includes(
            value.toString(),
          ),
        }"
      ></div>
      <div
        :class="{
          'mj-electronic-number-center': true,
          'mj-electronic-number--active': ['2', '3', '4', '5', '6', '8', '9', '-'].includes(
            value.toString(),
          ),
        }"
      ></div>
      <div
        :class="{
          'mj-electronic-number-bottomleft': true,
          'mj-electronic-number--active': ['0', '2', '6', '8'].includes(value.toString()),
        }"
      ></div>
      <div
        :class="{
          'mj-electronic-number-bottomright': true,
          'mj-electronic-number--active': ['0', '1', '3', '4', '5', '6', '7', '8', '9'].includes(
            value.toString(),
          ),
        }"
      ></div>
      <div
        :class="{
          'mj-electronic-number-bottom': true,
          'mj-electronic-number--active': ['0', '2', '3', '5', '6', '8', '9'].includes(
            value.toString(),
          ),
        }"
      ></div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import type { MjElectronicNumberProps } from './interface';
withDefaults(defineProps<MjElectronicNumberProps>(), {
  value: '',
});
</script>
<style scoped lang="scss">
.mj-electronic-number {
  padding: var(--mj-electronic-number-padding-block) var(--mj-electronic-number-padding-inline);
  background-color: var(--mj-electronic-number-bg);
  .mj-electronic-number-box {
    position: relative;
    width: calc(
      var(--mj-electronic-number-size) + var(--mj-electronic-number-width) +
        var(--mj-electronic-number-offset) * 2
    );
    height: calc(
      var(--mj-electronic-number-size) * 2 + var(--mj-electronic-number-width) +
        var(--mj-electronic-number-offset) * 4
    );
    .mj-electronic-number-horizontal {
      position: absolute;
      width: var(--mj-electronic-number-size);
      height: var(--mj-electronic-number-width);
      --mj-electronic-number-border-color: var(--mj-electronic-number-default);
      &::before {
        position: absolute;
        left: 0;
        top: 0;
        content: '';
        width: 100%;
        height: 0;
        border: calc(var(--mj-electronic-number-width) / 2) solid transparent;
        border-top: none;
        border-bottom-color: var(--mj-electronic-number-border-color);
        transition: border-color 0.3s linear;
      }
      &::after {
        position: absolute;
        left: 0;
        bottom: 0;
        content: '';
        width: 100%;
        height: 0;
        border: calc(var(--mj-electronic-number-width) / 2) solid transparent;
        border-bottom: none;
        border-top-color: var(--mj-electronic-number-border-color);
        transition: border-color 0.3s linear;
      }
      &.mj-electronic-number--active {
        --mj-electronic-number-border-color: var(--mj-electronic-number-active);
      }
    }
    .mj-electronic-number-vertical {
      position: absolute;
      height: var(--mj-electronic-number-size);
      width: var(--mj-electronic-number-width);
      --mj-electronic-number-border-color: var(--mj-electronic-number-default);
      &::before {
        position: absolute;
        left: 0;
        top: 0;
        content: '';
        width: 0;
        height: 100%;
        border: calc(var(--mj-electronic-number-width) / 2) solid transparent;
        border-left: none;
        border-right-color: var(--mj-electronic-number-border-color);
        transition: border-color 0.3s linear;
      }
      &::after {
        position: absolute;
        right: 0;
        top: 0;
        content: '';
        width: 0;
        height: 100%;
        border: calc(var(--mj-electronic-number-width) / 2) solid transparent;
        border-right: none;
        border-left-color: var(--mj-electronic-number-border-color);
        transition: border-color 0.3s linear;
      }
      &.mj-electronic-number--active {
        --mj-electronic-number-border-color: var(--mj-electronic-number-active);
      }
    }
    .mj-electronic-number-top {
      top: 0;
      left: calc(var(--mj-electronic-number-width) / 2 + var(--mj-electronic-number-offset));
      @extend .mj-electronic-number-horizontal;
    }
    .mj-electronic-number-center {
      top: calc(var(--mj-electronic-number-size) + var(--mj-electronic-number-offset) * 2);
      left: calc(var(--mj-electronic-number-width) / 2 + var(--mj-electronic-number-offset));
      @extend .mj-electronic-number-horizontal;
    }
    .mj-electronic-number-bottom {
      bottom: 0;
      left: calc(var(--mj-electronic-number-width) / 2 + var(--mj-electronic-number-offset));
      @extend .mj-electronic-number-horizontal;
    }
    .mj-electronic-number-topleft {
      left: 0;
      top: calc(var(--mj-electronic-number-width) / 2 + var(--mj-electronic-number-offset));
      @extend .mj-electronic-number-vertical;
    }
    .mj-electronic-number-bottomleft {
      left: 0;
      top: calc(
        var(--mj-electronic-number-width) / 2 + var(--mj-electronic-number-size) +
          var(--mj-electronic-number-offset) * 3
      );
      @extend .mj-electronic-number-vertical;
    }
    .mj-electronic-number-topright {
      right: 0;
      top: calc(var(--mj-electronic-number-width) / 2 + var(--mj-electronic-number-offset));
      @extend .mj-electronic-number-vertical;
    }
    .mj-electronic-number-bottomright {
      right: 0;
      top: calc(
        var(--mj-electronic-number-width) / 2 + var(--mj-electronic-number-size) +
          var(--mj-electronic-number-offset) * 3
      );
      @extend .mj-electronic-number-vertical;
    }
    &.mj-electronic-number-box--colon {
      width: calc(var(--mj-electronic-number-width) * 4);
    }
    .mj-electronic-number-dot-top {
      position: absolute;
      top: calc(var(--mj-electronic-number-offset) + var(--mj-electronic-number-size) / 2);
      left: var(--mj-electronic-number-width);
      width: calc(var(--mj-electronic-number-width) * 2);
      height: calc(var(--mj-electronic-number-width) * 2);
      border-radius: 50%;
      background-color: var(--mj-electronic-number-active);
    }
    .mj-electronic-number-dot-bottom {
      position: absolute;
      bottom: calc(var(--mj-electronic-number-offset) + var(--mj-electronic-number-size) / 2);
      left: var(--mj-electronic-number-width);
      width: calc(var(--mj-electronic-number-width) * 2);
      height: calc(var(--mj-electronic-number-width) * 2);
      border-radius: 50%;
      background-color: var(--mj-electronic-number-active);
    }
  }
}
</style>
