<template>
  <div class="file-brower">
    <div class="file-wrapper">
      <template v-if="directoryTree.length > 0">
        <mj-tree
          :data="directoryTree"
          bg-color="rgb(24,24,24)"
          text-color="rgb(204,204,204)"
          :load-more="loadMore"
        />
        <mj-button @click="clear">清空</mj-button>
      </template>
      <mj-button v-else @click="selectDir">选择文件夹</mj-button>
    </div>
    <div class="file-content">
      <div class="file-content-tabs-wrapper">
        <div class="file-content-tabs">
          <div
            :class="{ 'file-content-tab': true, 'file-content-tab--active': tab === currTab }"
            v-for="tab in fileTabs"
            :key="tab"
            @click="toggleFileTab(tab)"
            @contextmenu.prevent="closeAll"
          >
            <span>{{ fileContents[tab].name }}</span>
            <close-icon @click.stop="closeFileTab(tab)" />
          </div>
        </div>
      </div>
      <div class="file-content-show" v-if="currTab && fileContents[currTab]">
        <img v-if="fileContents[currTab].type === 'url'" :src="fileContents[currTab].content" />
        <mj-md
          v-else-if="fileContents[currTab].type === 'md'"
          :content="fileContents[currTab].content"
        />
        <template v-else-if="fileContents[currTab].type === 'text'">
          <mj-slider
            v-if="showBase64"
            active-color="orange"
            style="margin-left: 20px; width: 200px"
            v-model="fileContents[currTab].opacity"
          />
          <img
            v-if="showBase64 && /^data:image\/[^;]*;base64,/.test(fileContents[currTab].content)"
            :src="fileContents[currTab].content"
            :style="{ opacity: fileContents[currTab].opacity / 100 }"
          />
          <img
            v-else-if="
              showBase64 &&
              /^https?:\/\/.+\.(jpg|jpeg|png|svg|bmpgif|webp)/.test(fileContents[currTab].content)
            "
            :src="fileContents[currTab].content"
            :style="{ opacity: fileContents[currTab].opacity / 100 }"
          />
          <mj-pre
            v-else
            :value="fileContents[currTab].content"
            :lang="fileContents[currTab].lang"
            :style="{ opacity: fileContents[currTab].opacity / 100 }"
          />
        </template>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { onBeforeUnmount, onMounted, ref } from 'vue';
import MjTree from '@/components/MjTree/MjTree.vue';
import MjButton from '@/components/MjButton/MjButton.vue';
import MjMd from '@/components/MjMd/MjMd.vue';
import MjPre from '@/components/MjPre/MjPre.vue';
import MjSlider from '@/components/MjSlider/MjSlider.vue';
import CloseIcon from '@/components/MjIcon/CloseIcon.vue';
import type { MjTreeNodeData } from '@/components/MjTree/interface';
import { useRoute } from 'vue-router';

const {
  query: { opacity },
} = useRoute();

const props = withDefaults(defineProps<{ showBase64?: boolean }>(), {
  showBase64: false,
});

const directoryTree = ref<MjTreeNodeData[]>([]);
const fileTabs = ref<string[]>([]);
const currTab = ref('');
const fileContents = ref<
  Record<
    string,
    {
      content: string;
      type: string;
      lang: string;
      name: string;
      key: string;
      opacity: number;
    }
  >
>({});
const clear = () => {
  directoryTree.value = [];
  fileTabs.value = [];
  currTab.value = '';
  fileContents.value = {};
};
const toggleFileTab = (tab: string) => {
  currTab.value = tab;
};
const closeAll = () => {
  fileTabs.value = [];
  currTab.value = '';
};
const closeFileTab = (tab: string) => {
  const index = fileTabs.value.indexOf(tab);
  if (index > -1) {
    if (index > 0) {
      currTab.value = fileTabs.value[index - 1];
    } else if (fileTabs.value.length > 1) {
      currTab.value = fileTabs.value[index + 1];
    } else {
      currTab.value = '';
    }
    fileTabs.value.splice(index, 1);
    delete fileContents.value[tab];
  }
};

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
    if (fileTabs.value.includes(node.key)) {
      currTab.value = node.key;
      return;
    }
    const file: File = await node.handle.getFile();
    const fileContent: {
      content: string;
      type: string;
      lang: string;
      name: string;
      key: string;
      opacity: number;
    } = {
      type: 'text',
      lang: '',
      name: file.name,
      content: '',
      key: node.key,
      opacity: 100,
    };
    if (file.type.includes('image/')) {
      fileContent.type = 'url';
      fileContent.content = URL.createObjectURL(file);
      fileContent.opacity = 100;
      fileContents.value[node.key] = fileContent;
      fileTabs.value.push(node.key);
      currTab.value = node.key;
    } else {
      const reader = new FileReader();
      reader.onload = (evt) => {
        fileContent.content = (evt?.target?.result || '').toString();
        if (/\.md$/.test(file.name)) {
          fileContent.type = 'md';
          fileContent.opacity = 100;
        } else {
          fileContent.opacity = props.showBase64 ? +(opacity || '0') : 100;
          fileContent.type = 'text';
        }
        if (/\.css$/.test(file.name)) {
          fileContent.lang = 'css';
        } else {
          fileContent.lang = '';
        }
        fileContents.value[node.key] = fileContent;
        fileTabs.value.push(node.key);
        currTab.value = node.key;
      };
      reader.readAsText(file);
    }
  } else {
    for await (let [, currentHandle] of node.handle) {
      const currentNode = {
        title: currentHandle.name,
        isLeaf: currentHandle.kind === 'file',
        key: node.key + '/' + currentHandle.name,
        children: [],
        handle: currentHandle,
      };
      node.children.push(currentNode);
    }
    node.children.sort((a, b) => (a.title < b.title ? -1 : 1));
  }
};
const onKeyup = (e: KeyboardEvent) => {
  switch (e.key) {
    case 'ArrowLeft':
      if (currTab.value && fileTabs.value.length > 0) {
        const index = fileTabs.value.indexOf(currTab.value);
        if (index > 0) {
          currTab.value = fileTabs.value[index - 1];
        } else {
          currTab.value = fileTabs.value[fileTabs.value.length - 1];
        }
      }
      break;
    case 'ArrowRight':
      if (currTab.value && fileTabs.value.length > 0) {
        const index = fileTabs.value.indexOf(currTab.value);
        if (index < fileTabs.value.length - 1) {
          currTab.value = fileTabs.value[index + 1];
        } else {
          currTab.value = fileTabs.value[0];
        }
      }
      break;
    case 'Backspace':
      closeFileTab(currTab.value);
      break;
  }
};
onMounted(() => {
  window.addEventListener('keyup', onKeyup);
});
onBeforeUnmount(() => {
  window.removeEventListener('keyup', onKeyup);
});
</script>
<style scoped lang="scss">
.file-brower {
  background-color: #141414;
  height: 100vh;
  width: 100vw;
  display: flex;
  .file-wrapper {
    height: 100%;
    width: 166px;
    overflow: auto;
    padding-right: 5px;
    background-color: #181818;
    border-right: 1px solid #333;
    margin-right: 5px;
    .mj-tree {
      height: calc(100% - 40px);
      overflow-x: auto;
      width: 100%;
    }
  }
  .file-content-tabs-wrapper {
    width: 100%;
    overflow: auto;
    .file-content-tabs {
      display: flex;
      height: 32px;
      flex-wrap: nowrap;
      .file-content-tab {
        padding: 4px 8px;
        border-right: 1px solid #333;
        line-height: 1.5;
        white-space: nowrap;
        cursor: pointer;
        &.file-content-tab--active {
          background-color: #1f1f1f;
        }
        .mj-icon {
          display: inline-block;
          vertical-align: baseline;
          font-size: 0.8em;
          margin-left: 8px;
          cursor: pointer;
        }
      }
    }
  }
  .file-content {
    width: calc(100% - 171px);
    color: #999;
    overflow: auto;
    height: 100%;
    .file-content-show {
      width: 100%;
      height: calc(100vh - 32px);
      overflow: auto;
    }
    .mj-pre {
      :deep p {
        word-break: break-all;
        word-wrap: break-word;
        overflow-wrap: break-word;
        white-space: wrap;
        overflow: hidden;
      }
    }
  }
}
</style>
