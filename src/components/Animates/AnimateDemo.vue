<template>
  <div class="animate-box">
    <div class="animate-config">
      <dt class="animate-config-title">选项</dt>
      <dl class="animate-config-row">
        <div class="animate-config-label">选择对象(select object)</div>
        <div class="animate-config-content">
          <mj-select
            v-model="animateForm.selectObject"
            :options="['dark box']"
            @change="onAnimateConfigChange('selectObject', $event)"
          />
        </div>
      </dl>
      <dl class="animate-config-row">
        <div class="animate-config-label">时长(duration)</div>
        <div class="animate-config-content">
          <mj-input v-model="animateForm.duration" />
          <mj-select
            v-model="animateForm.durationUnit"
            :options="['s', 'ms']"
            @change="onAnimateConfigChange('durationUnit', $event)"
          />
        </div>
      </dl>
      <dl class="animate-config-row">
        <div class="animate-config-label">缓动函数(easing-function)</div>
        <div class="animate-config-content">
          <mj-select
            v-model="animateForm.timingFunction"
            :options="timeFunctionOptions"
            :disabled="animateForm.useSteps"
            @change="onAnimateConfigChange('timingFunction', $event)"
          />
        </div>
      </dl>
      <dl class="animate-config-row">
        <div class="animate-config-label">
          <mj-checkbox v-model="animateForm.useSteps" label="使用steps" size="mini" />
        </div>
        <div class="animate-config-content">
          <mj-input v-model="animateForm.step" :disabled="!animateForm.useSteps" />
          <mj-select
            v-model="animateForm.stepType"
            :options="['start', 'end']"
            :disabled="!animateForm.useSteps"
            @change="onAnimateConfigChange('stepType', $event)"
          />
        </div>
      </dl>
      <dl class="animate-config-row">
        <div class="animate-config-label">延迟(dealy)</div>
        <div class="animate-config-content">
          <mj-input v-model="animateForm.dealy" />
          <mj-select
            v-model="animateForm.dealyUnit"
            :options="['s', 'ms']"
            @change="onAnimateConfigChange('dealyUnit', $event)"
          />
        </div>
      </dl>
      <dl class="animate-config-row">
        <div class="animate-config-label">循环此时(iteration-count)</div>
        <div class="animate-config-content">
          <mj-input v-model="animateForm.iterationCount" :disabled="animateForm.infinite" />
          <mj-checkbox v-model="animateForm.infinite" label="infinite(无限)" size="mini" />
        </div>
      </dl>
      <dl class="animate-config-row">
        <div class="animate-config-label">方向(direction)</div>
        <div class="animate-config-content">
          <mj-select
            v-model="animateForm.direction"
            :options="directionOptions"
            @change="onAnimateConfigChange('direction', $event)"
          />
        </div>
      </dl>
      <dl class="animate-config-row">
        <div class="animate-config-label">填充模式(fill-mode)</div>
        <div class="animate-config-content">
          <mj-select
            v-model="animateForm.fillMode"
            :options="fillModeOptions"
            @change="onAnimateConfigChange('fillMode', $event)"
          />
        </div>
      </dl>
    </div>
    <div class="animate-demo">
      <div class="animate-btns">
        <img src="@/assets/icons/reload.svg" @click="reloadAnimate" />
        <img src="@/assets/icons/code.svg" />
      </div>
      <div class="animate-object" :key="animateKey" :style="animateStyle"></div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { reactive, nextTick, ref } from 'vue';
import MjSelect from '@/components/MjSelect/MjSelect.vue';
import MjInput from '@/components/MjInput/MjInput.vue';
import MjCheckbox from '@/components/MjCheckbox/MjCheckbox.vue';
import { timeFunctionOptions, directionOptions, fillModeOptions } from './config';
import { computed } from 'vue';

export interface AnimateDemoProps {
  animateName: string;
}

const animateForm = reactive({
  selectObject: 'box dark',
  duration: 1,
  durationUnit: 's',
  timingFunction: 'ease',
  useSteps: false,
  step: 1,
  stepType: 'start',
  dealy: 0,
  dealyUnit: 's',
  iterationCount: 1,
  infinite: false,
  direction: 'normal',
  fillMode: 'both',
});

const props = defineProps<AnimateDemoProps>();
const animateStyle = computed(() => ({
  animation: `${animateForm.duration}${animateForm.durationUnit} ${animateForm.useSteps ? `steps(${animateForm.step})` : animateForm.timingFunction} ${animateForm.dealy}${animateForm.dealyUnit} ${animateForm.direction} ${props.animateName}`,
}));
const animateKey = ref(Date.now());
const reloadAnimate = () => {
  animateKey.value = Date.now();
};

const onAnimateConfigChange = (key: string, val: any) => {
  switch (key) {
    case 'durationUnit':
      if (val === 's') {
        animateForm.duration /= 1000;
      } else {
        animateForm.duration *= 1000;
      }
      break;
    case 'dealyUnit':
      if (val === 's') {
        animateForm.dealy /= 1000;
      } else {
        animateForm.dealy *= 1000;
      }
      break;
  }
};
</script>
<style src="./animate-keyframes.css"></style>
<style scoped lang="scss">
.animate-box {
  padding: 20px;
  display: flex;
  height: 565px;
  .animate-config {
    padding: 20px;
    background-color: var(--animates-white);
    border-radius: 4px;
    color: #585858;
    width: 300px;
    .animate-config-row {
      padding: 4px 0;
      .animate-config-label {
        font-size: 12px;
        color: #999;
      }
      .animate-config-content {
        width: 100%;
        .mj-select,
        .mj-input {
          &:first-child {
            width: 62%;
          }
          &:last-child {
            width: 37%;
            margin-left: 1%;
          }
          &:only-child {
            width: 100%;
          }
        }
        .mj-checkbox {
          vertical-align: middle;
          &:not(:first-child) {
            margin-left: 5px;
          }
        }
      }
    }
  }
  .animate-demo {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    .animate-btns {
      position: absolute;
      right: 0;
      top: 0;
      img {
        padding: 12px;
        background-color: var(--animates-white, #fff);
        border-radius: 50%;
        width: 42px;
        height: 42px;
        cursor: pointer;
        &:not(:first-child) {
          margin-left: 10px;
        }
      }
    }
    .animate-object {
      width: 160px;
      height: 160px;
      background-color: #3e3e3e;
    }
  }
}
</style>
