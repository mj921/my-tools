<template>
  <div class="ds-setting" v-show="model">
    <div class="ds-setting-header">设置</div>
    <dt class="ds-setting-title">API设置</dt>
    <div class="ds-setting-card">
      <dl class="ds-setting-row">
        <label class="ds-setting-label" for="ds-aiType">aiType</label>
        <select
          class="ds-setting-select"
          id="ds-aiType"
          placeholder="请选择appid"
          v-model="config.aiType"
        >
          <option value="deepseek">deepseek</option>
          <option value="nebulablock">nebulablock</option>
          <option value="edgefn">edgefn</option>
        </select>
      </dl>
      <dl class="ds-setting-row" v-if="config.aiType === 'nebulablock'">
        <label class="ds-setting-label" for="ds-api">appid</label>
        <input
          class="ds-setting-ipt"
          id="ds-api"
          placeholder="请输入appid"
          v-model="config.nebulablockAppid"
          autocomplete="off"
        />
      </dl>
      <dl class="ds-setting-row" v-else-if="config.aiType === 'edgefn'">
        <label class="ds-setting-label" for="ds-api">appid</label>
        <input
          class="ds-setting-ipt"
          id="ds-api"
          placeholder="请输入appid"
          v-model="config.edgefnAppid"
          autocomplete="off"
        />
      </dl>
      <dl class="ds-setting-row" v-else>
        <label class="ds-setting-label" for="ds-api">appid</label>
        <input
          class="ds-setting-ipt"
          id="ds-api"
          placeholder="请输入appid"
          v-model="config.appid"
          autocomplete="off"
        />
      </dl>
      <dl class="ds-setting-row">
        <label class="ds-setting-label" for="ds-maxToken">最大token</label>
        <input
          class="ds-setting-ipt"
          id="ds-maxToken"
          placeholder="最大token"
          v-model="config.maxToken"
          autocomplete="off"
        />
      </dl>
    </div>
    <div class="ds-setting-btns">
      <button @click="model = false">取消</button>
      <button @click="save">保存</button>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { inject, toRefs } from 'vue';
import type DSDbTool from '../db';
import message from '@/components/MjMessage';

const model = defineModel<boolean>();
const { dbtool } = inject<{ dbtool: DSDbTool }>('ds')!;
const props = defineProps<{ config: Record<string, string> }>();
const { config } = toRefs(props);
const save = () => {
  dbtool
    .saveConfig(config.value)
    .then(() => {
      message.success('保存成功');
      model.value = false;
    })
    .catch((err) => {
      console.log(err);
      message.error('保存失败');
    });
};
</script>
<style scoped lang="scss">
.ds-setting {
  position: fixed;
  width: 525px;
  max-width: 100vw;
  padding: 20px;
  border-radius: 8px;
  background-color: var(--deepseek-sider-bg);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  max-height: 80vh;
  color: var(--deepseek-font-color);
  .ds-setting-header {
    line-height: 24px;
    font-size: 18px;
    font-weight: bold;
    padding-bottom: 12px;
    text-align: center;
  }
  .ds-setting-title {
    font-size: 16px;
    line-height: 32px;
    margin-bottom: 8px;
  }
  .ds-setting-card {
    background-color: var(--deepseek-container-bg);
    padding: 12px;
    border-radius: 8px;
    margin-bottom: 16px;
    .ds-setting-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      &:not(:last-child) {
        border-bottom: 1px solid var(--deepseek-border-color);
        padding-bottom: 8px;
      }
      &:not(:first-child) {
        padding-top: 8px;
      }
      .ds-setting-label {
        flex: 0 0 80px;
        margin-right: 8px;
      }
      .ds-setting-ipt {
        flex: 1;
        background-color: transparent;
        border: none;
        text-align: right;
        outline: none;
        color: var(--deepseek-font-color);
        &:focus {
          text-align: left;
        }
      }
      .ds-setting-select {
        flex: 1;
        background-color: transparent;
        border: none;
        text-align: right;
        outline: none;
        color: var(--deepseek-font-color);
      }
    }
  }
  .ds-setting-btns {
    display: flex;
    button {
      flex: 1;
      border: none;
      font-size: 14px;
      line-height: 36px;
      color: var(--deepseek-font-color);
      border-radius: 8px;
      background-color: var(--deepseek-container-bg);
      &:not(:last-child) {
        margin-right: 16px;
      }
    }
  }
}
</style>
