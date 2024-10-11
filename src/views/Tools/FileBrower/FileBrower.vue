<template>
  <div class="file-brower">
    <div class="file-tree">
      <mj-tree
        v-if="directoryTree.length > 0"
        :data="directoryTree"
        bg-color="rgb(24,24,24)"
        text-color="rgb(204,204,204)"
        :load-more="loadMore"
      />
      <mj-button v-else @click="selectDir">选择文件夹</mj-button>
    </div>
    <div class="file-content">
      <mj-slider
        v-if="showBase64"
        active-color="orange"
        style="margin-left: 20px; width: 200px"
        v-model="opacity"
      />
      <img v-if="fileContent.type === 'url'" :src="fileContent.content" />
      <mj-md v-else-if="fileContent.type === 'md'" :content="fileContent.content" />
      <template v-else-if="fileContent.type === 'text'">
        <img
          v-if="showBase64 && /^data:image\/[^;]*;base64,/.test(fileContent.content)"
          :src="fileContent.content"
          :style="{ opacity: opacity / 100 }"
        />
        <mj-pre
          v-else
          :value="fileContent.content"
          :lang="fileContent.lang"
          :style="{ opacity: opacity / 100 }"
        />
      </template>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import MjTree from '@/components/MjTree/MjTree.vue';
import MjButton from '@/components/MjButton/MjButton.vue';
import MjMd from '@/components/MjMd/MjMd.vue';
import MjPre from '@/components/MjPre/MjPre.vue';
import MjSlider from '@/components/MjSlider/MjSlider.vue';
import type { MjTreeNodeData } from '@/components/MjTree/interface.ts';
import { reactive } from 'vue';

const props = withDefaults(defineProps<{ showBase64?: boolean }>(), {
  showBase64: false,
});

const directoryTree = ref<MjTreeNodeData[]>([]);
const fileContent = reactive({
  content: '',
  type: 'null',
  lang: '',
});
const opacity = ref(0);

const selectDir = async () => {
  const rootDirectoryHandle = await (window as any).showDirectoryPicker();
  const rootDir = {
    title: rootDirectoryHandle.name,
    isLeaf: rootDirectoryHandle.kind === 'file',
    key: '/' + rootDirectoryHandle.name,
    children: [],
    handle: rootDirectoryHandle,
  };
  directoryTree.value.push(rootDir);
};
const loadMore = async (node: MjTreeNodeData) => {
  if (node.isLeaf) {
    const file: File = await node.handle.getFile();
    console.log(file);
    if (file.type.includes('image/')) {
      fileContent.type = 'url';
      fileContent.content = URL.createObjectURL(file);
      opacity.value = 100;
    } else {
      const reader = new FileReader();
      reader.onload = (evt) => {
        fileContent.content = (evt?.target?.result || '').toString();
        if (/\.md$/.test(file.name)) {
          fileContent.type = 'md';
          opacity.value = 100;
        } else {
          opacity.value = props.showBase64 ? 0 : 100;
          fileContent.type = 'text';
        }
        if (/\.css$/.test(file.name)) {
          fileContent.lang = 'css';
        } else {
          fileContent.lang = '';
        }
      };
      reader.readAsText(file);
    }
  } else {
    for await (let [name, currentHandle] of node.handle) {
      const currentNode = {
        title: currentHandle.name,
        isLeaf: currentHandle.kind === 'file',
        key: node.path + '/' + currentHandle.name,
        children: [],
        handle: currentHandle,
      };
      node.children.push(currentNode);
    }
    node.children.sort((a, b) => (a.title < b.title ? -1 : 1));
  }
};
</script>
<style scoped lang="scss">
.file-brower {
  background-color: #141414;
  height: 100vh;
  width: 100vw;
  display: flex;
  .file-tree {
    height: 100%;
    width: 160px;
    overflow: auto;
    .mj-tree {
      min-height: 100%;
      overflow-x: hidden;
    }
  }
  .file-content {
    width: calc(100% - 160px);
    color: #999;
    overflow: auto;
    height: 100%;
    p {
      word-break: break-all;
    }
  }
}
</style>
