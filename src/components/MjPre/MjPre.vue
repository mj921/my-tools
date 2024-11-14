<template>
  <div class="mj-pre">
    <CopyIcon v-if="copyable" @click="copyPre" />
    <pre ref="preBox" class="mj-pre-container">
      <mj-pre-css-ele v-if="lang === 'css'" :list="eleList" />
      <template v-else>
        <p v-for="(item, i) in eleList" :key="i">{{ item.value }}</p>
      </template>
    </pre>
  </div>
</template>
<script lang="ts" setup>
import { copyTextToClipboard, generateUuid } from '@/utils';
import type { MjPreItem, MjPreMapItem, MjPreProps } from './interface';
import { computed, ref } from 'vue';
import MjPreCssEle from './MjPreCssEle.vue';
import CopyIcon from '../MjIcon/CopyIcon.vue';
import message from '../MjMessage';

const props = withDefaults(defineProps<MjPreProps>(), {
  copyable: true,
});

interface PreItem {
  type: string;
  value: string;
  className?: string;
  children: string[];
}
const preBox = ref<HTMLPreElement>();

const parseCss = () => {
  const map: Record<string, MjPreMapItem> = {};
  const val = props.value.replace(/(^\s+|\s+$)/g, '');
  const list: MjPreMapItem[] = [{ type: '', value: '', className: '', children: [] }];
  let i = 0;
  let index = 0;
  let keyIndex = 1;
  let keys = [generateUuid(), generateUuid()];
  const root: PreItem = { type: 'root', value: '', className: '', children: [] };
  map[keys[0]] = root;
  while (i < val.length) {
    const str = val[i];
    if (!map[keys[keyIndex]]) {
      if (str === '\n' || str === ' ') {
        i++;
        continue;
      } else if (map[keys[keyIndex - 1]].type === 'root') {
        if (str === '@') {
          map[keys[keyIndex]] = {
            type: 'keyframes',
            value: '',
            className: 'keyword',
            children: [],
          };
        } else {
          map[keys[keyIndex]] = { type: 'selector', value: '', className: '', children: [] };
        }
        root.children.push(keys[keyIndex]);
      } else if (str === '}') {
        map[keys[keyIndex - 1]].endBracket = '}';

        keyIndex--;
        keys[keyIndex] = generateUuid();
        i++;
        continue;
      } else if (map[keys[keyIndex - 1]].type === 'keyframes') {
        map[keys[keyIndex]] = { type: 'selector', value: '', className: '', children: [] };
        map[keys[keyIndex - 1]].children.push(keys[keyIndex]);
      } else if (map[keys[keyIndex - 1]].type === 'selector') {
        if (map[keys[keyIndex - 1]].children.length) {
          map[keys[keyIndex]] = { type: 'br', value: '', className: '', children: [] };
          map[keys[keyIndex - 1]].children.push(keys[keyIndex]);
          keys[keyIndex] = generateUuid();
        }
        map[keys[keyIndex]] = { type: 'propName', value: '', className: '', children: [] };
        map[keys[keyIndex - 1]].children.push(keys[keyIndex]);
      }
    }
    if (map[keys[keyIndex]].type === 'keyframes') {
      if (str === '{') {
        map[keys[keyIndex]].value = map[keys[keyIndex]].value.replace(/(^\s+|\s+$)/g, '');
        map[keys[keyIndex]].startBracket = '{';
        keyIndex++;
        keys[keyIndex] = generateUuid();
      } else if (!map[keys[keyIndex]].startBracket) {
        map[keys[keyIndex]].value += str;
      }
    } else if (map[keys[keyIndex]].type === 'selector') {
      if (str === '{') {
        map[keys[keyIndex]].value = map[keys[keyIndex]].value.replace(/(^\s+|\s+$)/g, '') + ' ';
        map[keys[keyIndex]].startBracket = '{';
        keyIndex++;
        keys[keyIndex] = generateUuid();
      } else if (!map[keys[keyIndex]].startBracket) {
        map[keys[keyIndex]].value += str;
      }
    } else if (map[keys[keyIndex]].type === 'propName') {
      if (str === ':') {
        map[keys[keyIndex]].value = map[keys[keyIndex]].value.replace(/(^\s+|\s+$)/g, '');

        keys[keyIndex] = generateUuid();
        map[keys[keyIndex]] = { type: 'colon', value: ': ', children: [] };
        map[keys[keyIndex - 1]].children.push(keys[keyIndex]);

        keys[keyIndex] = generateUuid();
        map[keys[keyIndex]] = { type: 'propValue', value: '', children: [] };
        map[keys[keyIndex - 1]].children.push(keys[keyIndex]);
      } else if (map[keys[keyIndex]].value.length > 0 || str.replace(/[\s\n]/g, '').length > 0) {
        map[keys[keyIndex]].value += str;
      }
    } else if (map[keys[keyIndex]].type === 'propValue') {
      if (str === ';') {
        map[keys[keyIndex]].value = map[keys[keyIndex]].value.replace(/(^\s+|\s+$)/g, '');
        keys[keyIndex] = generateUuid();
        map[keys[keyIndex]] = { type: 'semicolon', value: str, children: [] };
        map[keys[keyIndex - 1]].children.push(keys[keyIndex]);

        keys[keyIndex] = generateUuid();
      } else if (list[index].value.length > 0 || str.replace(/[\n]/g, '').length > 0) {
        map[keys[keyIndex]].value += str;
      }
    }
    i++;
  }
  const idToItem = (children: string[], level = 0): MjPreItem[] => {
    return children.map((uuid: string) => {
      return {
        ...map[uuid],
        level,
        children: idToItem(map[uuid].children, level + 1),
      };
    });
  };
  return idToItem(root.children);
};
const parseText = () => {
  return props.value
    .split(/[\n\r]/)
    .map((el) => ({ type: 'text', value: el, children: [] })) as MjPreItem[];
};
const eleList = computed<MjPreItem[]>(() => {
  switch (props.lang) {
    case 'css':
      return parseCss();
    default:
      return parseText();
  }
});
const copyPre = () => {
  if (preBox.value) {
    copyTextToClipboard(preBox.value.innerText, () => {
      message.success('复制成功');
    });
  } else {
    copyTextToClipboard(props.value);
  }
};
</script>
<style lang="scss">
.mj-pre {
  position: relative;
  background-color: #1f1f1f;
  padding: 16px;
  .mj-copy-icon {
    position: absolute;
    right: 8px;
    top: 8px;
    color: var(--mj-color-gray-4);
    font-size: 20px;
    cursor: pointer;
  }
  .mj-pre-container * {
    overflow-wrap: break-word;
    word-break: break-all;
    white-space: pre-wrap;
  }
  .mj-pre-css-selector {
    color: #d7ba7d;
  }
  .mj-pre-css-keyword {
    color: #c586c0;
  }
  .mj-pre-css-bracket {
    color: #ffd700;
  }
  .mj-pre-css-funname {
    color: #dcdcaa;
  }
  .mj-pre-css-propName {
    color: #9cdcfe;
  }
  .mj-pre-css-colon,
  .mj-pre-css-semicolon {
    color: #fff;
  }
  .mj-pre-css-propValue {
    color: #ce9178;
    &.mj-pre-css-color-preview::before {
      content: '';
      display: inline-block;
      border: 1px solid #fff;
      width: 10px;
      height: 10px;
      box-sizing: border-box;
      background-color: var(--mj-pre-css-color-preview);
      margin-right: 2px;
    }
  }
  &.mj-pre--light {
    background-color: #fff;
    .mj-pre-css-colon,
    .mj-pre-css-semicolon {
      color: #1f1f1f;
    }
    .mj-pre-css-propValue {
      .mj-pre-css-color-preview {
        border-color: #1f1f1f;
      }
    }
  }
  .mj-pre-css-block .mj-pre-css-block {
    margin-left: 1em;
  }
}
</style>
