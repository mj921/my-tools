<template>
  <template v-for="(item, i) in list" :key="i">
    <br v-if="item.type === 'br'" />
    <div v-else-if="item.startBracket" class="mj-pre-css-block">
      <template v-if="item.className === 'keyword'">
        <span
          v-for="(el, j) in item.value.split(/\s+/)"
          :key="`${i}_keyword_${j}`"
          :class="j === 0 ? 'mj-pre-css-keyword' : 'mj-pre-css-funname'"
        >
          {{ el + ' ' }}
        </span>
      </template>
      <span
        v-else
        :class="`mj-pre-css-${item.className || item.type} ${item.type === 'propValue' && isColor(item.value) ? 'mj-pre-css-color-preview' : ''}`"
        :style="
          item.type === 'propValue' && isColor(item.value)
            ? { '--mj-pre-css-color-preview': item.value }
            : []
        "
      >
        {{ item.value }}
      </span>
      <span class="mj-pre-css-bracket" v-if="item.startBracket">
        {{ item.startBracket }}
      </span>
      <div v-if="item.children.length > 0" class="mj-pre-css-block">
        <mj-pre-css-ele :list="item.children" />
      </div>
      <span class="mj-pre-css-bracket" v-if="item.endBracket">
        {{ item.endBracket }}
      </span>
    </div>
    <span
      v-else
      :class="`mj-pre-css-${item.className || item.type} ${item.type === 'propValue' && isColor(item.value) ? 'mj-pre-css-color-preview' : ''}`"
      :style="
        item.type === 'propValue' && isColor(item.value)
          ? { '--mj-pre-css-color-preview': item.value }
          : []
      "
    >
      {{ item.value }}
    </span>
  </template>
</template>
<script lang="ts" setup>
import type { MjPreItem } from './interface';

defineProps<{ list: MjPreItem[] }>();
const isColor = (val: string) => /^(#([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8}))$/.test(val);
</script>
<style lang="scss"></style>
