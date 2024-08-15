<template>
  <main class="animates">
    <nav class="nav">
      <span class="animates-name">动画</span>
      <ul class="nav-list">
        <li
          v-for="nav in navList"
          :class="{ 'nav-item': true, 'nav-item--active': group === nav.path }"
          :key="nav.path"
        >
          <RouterLink :to="`/animates/${nav.path}`">{{ nav.label }}</RouterLink>
        </li>
      </ul>
      <a href="https://animista.net/" target="_blank">参考</a>
    </nav>
    <section class="animates-box" :key="route.path">
      <div class="type-list_box">
        <ul class="type-list">
          <li
            v-for="typeItem in currConfig"
            :class="{ 'type-item': true, 'type-item--active': currentType === typeItem.name }"
            :key="typeItem.name"
          >
            <RouterLink :to="`/animates/${group}/${typeItem.name}`">
              {{ typeItem.name.toUpperCase() }}
            </RouterLink>
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
        >
          <RouterLink :to="`/animates/${group}/${currentType}/${subTypeItem}`">
            {{ subTypeItem }}
          </RouterLink>
        </li>
      </ul>
      <animate-demo :animate-name="currentSubType" />
    </section>
  </main>
</template>
<script lang="ts" setup>
import { onBeforeRouteUpdate, useRoute } from 'vue-router';
import { ref } from 'vue';
import AnimateDemo from '@/components/Animates/AnimateDemo.vue';
import type { AnimateTypeItem } from './interface';
import { animateConfig } from './config';

const route = useRoute();

const navList = [
  {
    label: '基础',
    path: 'basic',
  },
  {
    label: '入场',
    path: 'entrances',
  },
  {
    label: '退场',
    path: 'exits',
  },
  {
    label: '文字',
    path: 'text',
  },
  {
    label: '强调',
    path: 'attention',
  },
  {
    label: '背景',
    path: '/animates/background',
  },
];

const group = ref(route.params.group);
const currConfig = ref((animateConfig as any)[route.params.group as string] as AnimateTypeItem[]);
const currentType = ref(currConfig.value[0].name);
const subTypeList = ref(currConfig.value[0].children);
const currentSubType = ref(currConfig.value[0].children[0]);

const init = (params: { group: string; type: string; subtype: string }) => {
  group.value = params.group;
  currConfig.value = (animateConfig as any)[group.value as string] as AnimateTypeItem[];
  currentType.value = (params.type as string) || currConfig.value[0].name;
  const currTypeItem = currConfig.value.find((el) => el.name === currentType.value);
  subTypeList.value = currTypeItem?.children || [];
  currentSubType.value = params.subtype || currTypeItem?.children?.[0] || '';
};
init(route.params as { group: string; type: string; subtype: string });

onBeforeRouteUpdate((to) => {
  init(to.params as { group: string; type: string; subtype: string });
});
</script>
<style scoped lang="scss">
.animates {
  --animates-gray: #dfdfdf;
  --animates-red: #ff6060;
  --animates-black: #3e3e3e;
  --animates-white: #fff;
  height: 100vh;
  width: 100vw;
  background-color: var(--animates-gray);
  .nav {
    height: 50px;
    background-color: var(--animates-black);
    padding: 10px;
    display: flex;
    color: var(--animates-white);
    line-height: 30px;
    justify-content: space-between;
    .animates-name {
      width: 0 0 calc(2em + 20px);
      padding: 0 10px;
      font-size: 20px;
      font-weight: bold;
    }
    .nav-list {
      flex: 0 0 calc(100% - 4em - 50px);
      display: flex;
      .nav-item {
        padding: 0 10px;
        border-radius: 2px;
        justify-content: flex-start;
        cursor: pointer;
        &:hover {
          color: var(--animates-gray);
        }
        &.nav-item--active {
          background-color: var(--animates-red);
        }
      }
    }
  }
  .animates-box {
    height: calc(100vh - 50px);
    overflow: auto;
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
            pointer-events: none;
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
}

@media only screen and (min-width: 512px) {
  .subtype-item {
    width: calc(100% / 2);
  }
}

@media only screen and (min-width: 768px) {
  .subtype-item {
    width: calc(100% / 3);
  }
}

@media only screen and (min-width: 1024px) {
  .subtype-item {
    width: calc(100% / 4);
  }
}

@media only screen and (min-width: 1280px) {
  .subtype-item {
    width: calc(100% / 5);
  }
}
@media only screen and (min-width: 1600px) {
  .subtype-item {
    width: calc(100% / 6);
  }
}
</style>
