<template>
  <div class="basic">
    <div class="type-list_box">
      <ul class="type-list">
        <li
          v-for="typeItem in currConfig"
          :class="{ 'type-item': true, 'type-item--active': currentType === typeItem.name }"
          :key="typeItem.name"
          @click="selectType(typeItem)"
        >
          {{ typeItem.name.toUpperCase() }}
        </li>
      </ul>
    </div>
    <ul class="subtype-list">
      <li
        v-for="subTypeItem in subTypeList"
        :class="{
          'subtype-item': true,
          'subtype-item--active': currentSubType === subTypeItem,
        }"
        :key="subTypeItem"
        @click="selectSubType(subTypeItem)"
      >
        {{ subTypeItem }}
      </li>
    </ul>
    <animate-demo :animate-name="currentSubType" />
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import AnimateDemo from '@/components/Animates/AnimateDemo.vue';
import type { AnimateTypeItem, AnimateSubTypeItem } from './interface';
import { animateConfig } from './config';
import { useRoute } from 'vue-router';

const currentType = ref('scale-up');
const currentSubType = ref('scale-up-center');
const route = useRoute();

const currConfig = (animateConfig as any)[
  route.path.replace('/animates/', '')
] as AnimateTypeItem[];

const subTypeList = ref(currConfig[0].children);

const selectType = (typeItem: AnimateTypeItem) => {
  if (currentType.value !== typeItem.name) {
    currentType.value = typeItem.name;
    subTypeList.value = typeItem.children;
    currentSubType.value = typeItem.children[0];
  }
};
const selectSubType = (subTypeItem: string) => {
  if (currentSubType.value !== subTypeItem) {
    currentSubType.value = subTypeItem;
  }
};
</script>
<style scoped lang="scss">
.basic {
  .type-list_box {
    width: 100%;
    height: 121px;
    overflow: hidden;
    background-color: var(--animates-white);
    border-bottom: 1px solid var(--animates-gray);
    .type-list {
      padding: 10px 10px 20px;
      display: flex;
      gap: 5px;
      justify-content: flex-start;
      overflow-x: auto;
      .type-item {
        display: flex;
        justify-content: center;
        align-items: center;
        flex: 0 0 100px;
        width: 100px;
        height: 100px;
        border-radius: 50%;
        background-color: var(--animates-black);
        text-align: center;
        color: var(--animates-white);
        position: relative;
        font-weight: bold;
        word-wrap: break-word;
        line-height: 1.2em;
        cursor: pointer;
        padding: 10px;
        &::after {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          background-color: rgba($color: #fff, $alpha: 0.3);
          border-radius: 50%;
          transform: scale(0);
          transition: transform 0.1s;
        }
        &:not(.type-item--active):hover::after {
          transform: scale(1);
        }
        &.type-item--active {
          background-color: var(--animates-red);
        }
      }
    }
  }
  .subtype-list {
    display: flex;
    flex-wrap: wrap;
    padding: 10px 20px;
    background-color: var(--animates-white);
    .subtype-item {
      padding: 0 10px;
      text-align: center;
      line-height: 30px;
      color: var(--animates-black);
      cursor: pointer;
      border-radius: 2px;
      &:hover {
        color: var(--animates-red);
      }
      &.subtype-item--active {
        color: var(--animates-white);
        background-color: var(--animates-red);
      }
    }
  }
  .animate-box {
    position: relative;
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
    }
  }
}
@media only screen and (min-width: 768px) {
  .subtype-item {
    width: calc(100% / 4);
  }
}

@media only screen and (min-width: 992px) {
  .subtype-item {
    width: calc(100% / 5);
  }
}
@media only screen and (min-width: 1200px) {
  .subtype-item {
    width: calc(100% / 6);
  }
}
</style>
