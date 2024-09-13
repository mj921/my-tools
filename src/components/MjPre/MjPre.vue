<template>
  <div class="mj-pre">
    <template v-for="(item, i) in eleList" :key="i">
      <br v-if="item.type === 'br'" />
      <span v-else :class="`mj-pre-css-${item.type}`">
        <span
          class="mj-pre-css-color-preview"
          v-if="isColor(item.value)"
          :style="{ backgroundColor: item.value }"
        ></span>
        {{ item.value }}
      </span>
    </template>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import type { MjPreProps } from './interface';
import { computed } from 'vue';

const props = defineProps<MjPreProps>();

const isColor = (val: string) => /^(#([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8}))$/.test(val);

const parseCss = () => {
  const val = props.value;
  const list = [{ type: 'selector', value: '' }];
  let i = 0;
  let index = 0;
  while (i < val.length) {
    const str = val[i];
    if (list[index].type === 'selector') {
      if (str === '{') {
        list[index].value.trimEnd();
        index++;
        list[index] = { type: 'bracket', value: str };
        index++;
        list[index] = { type: 'br', value: '' };
        index++;
        list[index] = { type: 'propName', value: '' };
      } else {
        list[index].value += str;
      }
    } else if (list[index].type === 'propName') {
      if (str === ':') {
        list[index].value.trimEnd();
        index++;
        list[index] = { type: 'colon', value: ': ' };
        index++;
        list[index] = { type: 'propValue', value: '' };
      } else if (str === '}') {
        if (list[index].value.length > 0) {
          index++;
        }
        list[index] = { type: 'bracket', value: str };
        index++;
        list[index] = { type: 'br', value: '' };
        index++;
        list[index] = { type: 'selector', value: '' };
      } else if (list[index].value.length > 0 || str.replace(/[\s\n]/g, '').length > 0) {
        list[index].value += str;
      }
    } else if (list[index].type === 'propValue') {
      if (str === ';') {
        list[index].value.trimEnd();
        index++;
        list[index] = { type: 'semicolon', value: str };
        index++;
        list[index] = { type: 'br', value: '' };
        index++;
        list[index] = { type: 'propName', value: '' };
      } else if (list[index].value.length > 0 || str.replace(/[\s\n]/g, '').length > 0) {
        list[index].value += str;
      }
    }
    i++;
  }
  return list;
};
const eleList = computed<{ type: string; value: string }[]>(() => parseCss());
</script>
<style scoped lang="scss">
.mj-pre {
  background-color: #1f1f1f;
  padding: 16px;
  .mj-pre-css-selector {
    color: #d7ba7d;
  }
  .mj-pre-css-bracket {
    color: #ffd700;
  }
  .mj-pre-css-propName {
    color: #9cdcfe;
    margin-left: 2em;
  }
  .mj-pre-css-colon,
  .mj-pre-css-semicolon {
    color: #fff;
  }
  .mj-pre-css-propValue {
    color: #ce9178;
    .mj-pre-css-color-preview {
      display: inline-block;
      border: 1px solid #fff;
      width: 10px;
      height: 10px;
      box-sizing: border-box;
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
}
</style>
