<template>
  <div class="file-brower" v-if="token">
    <template v-if="directoryTree.length > 0">
      <div class="file-wrapper">
        <mj-tree
          :data="directoryTree"
          bg-color="rgb(24,24,24)"
          text-color="rgb(204,204,204)"
          :load-more="loadMore"
        />
        <mj-button @click="clear">清空</mj-button>
        <mj-button @click="logout">退出登录</mj-button>
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
              active-color="orange"
              style="margin-left: 20px; width: 200px"
              v-model="fileContents[currTab].opacity"
            />
            <img
              v-if="/^data:image\/[^;]*;base64,/.test(fileContents[currTab].content)"
              :src="fileContents[currTab].content"
              :style="{ opacity: fileContents[currTab].opacity / 100 }"
            />
            <img
              v-else-if="
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
    </template>
    <template v-else>
      <mj-input v-model="url" placeholder="gitee仓库地址" /><br />
      <mj-button @click="selectDir">打开仓库</mj-button>
      <mj-button @click="logout">退出登录</mj-button>
    </template>
  </div>
  <div class="file-brower" v-else>
    <mj-input v-model="clientId" placeholder="client_id" style="width: calc(50% - 60px)" />
    <mj-input v-model="clientSecret" placeholder="client_secret" style="width: calc(50% - 60px)" />
    <mj-button @click="login">登录</mj-button>
  </div>
</template>
<script lang="ts" setup>
import { onBeforeUnmount, onMounted, reactive, ref } from 'vue';
import MjInput from '@/components/MjInput/MjInput.vue';
import MjTree from '@/components/MjTree/MjTree.vue';
import MjButton from '@/components/MjButton/MjButton.vue';
import MjMd from '@/components/MjMd/MjMd.vue';
import MjPre from '@/components/MjPre/MjPre.vue';
import MjSlider from '@/components/MjSlider/MjSlider.vue';
import CloseIcon from '@/components/MjIcon/CloseIcon.vue';
import type { MjTreeNodeData } from '@/components/MjTree/interface';
import { useRoute } from 'vue-router';

interface FileNode {
  title: string;
  isLeaf: boolean;
  key: string;
  children: FileNode[];
  path: string;
}

const {
  query: { opacity, code },
} = useRoute();

let cache = { url: '', tree: [] };
try {
  cache = JSON.parse(localStorage.getItem('getee_tree') || '');
} catch (error) {
  console.log(error);
}
const token = ref(localStorage.getItem('gitee_access_token') || '');

const refreshToken = () => {
  const refreshToken = localStorage.getItem('gitee_refresh_token');
  if (refreshToken) {
    fetch('https://gitee.com/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        token.value = data.access_token;
        localStorage.setItem('gitee_access_token', data.access_token);
        localStorage.setItem('gitee_refresh_token', data.refresh_token);
        localStorage.setItem(
          'gitee_token_expires',
          ((data.created_at + data.expires_in - 600) * 1000).toString(),
        );
      })
      .catch(() => {
        console.error('刷新令牌失败');
      });
  }
};

if (localStorage.getItem('gitee_access_token')) {
  if (
    !localStorage.getItem('gitee_token_expires') ||
    Date.now() >= Number(localStorage.getItem('gitee_token_expires'))
  ) {
    if (localStorage.getItem('gitee_refresh_token')) {
      refreshToken();
    } else {
      localStorage.removeItem('gitee_access_token');
      localStorage.removeItem('gitee_refresh_token');
      localStorage.removeItem('gitee_token_expires');
      token.value = '';
    }
  }
}

const url = ref(cache?.url || '');
const clientId = ref(localStorage.getItem('gitee_client_id') || '');
const clientSecret = ref(localStorage.getItem('gitee_client_secret') || '');
const login = () => {
  if (clientId.value && clientSecret.value) {
    if (code) {
      const query = new URLSearchParams({
        grant_type: 'authorization_code',
        code: code as string,
        client_id: clientId.value,
        redirect_uri: `${window.location.origin}${window.location.pathname}`,
        client_secret: clientSecret.value,
      }).toString();
      fetch('https://gitee.com/oauth/token?' + query, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((response) => response.json())
        .then((data) => {
          token.value = data.access_token;
          localStorage.setItem('gitee_access_token', data.access_token);
          localStorage.setItem('gitee_refresh_token', data.refresh_token);
          localStorage.setItem(
            'gitee_token_expires',
            ((data.created_at + data.expires_in - 600) * 1000).toString(),
          );
        })
        .catch(() => {
          console.error('登录失败');
        });
    } else {
      localStorage.setItem('gitee_client_id', clientId.value);
      localStorage.setItem('gitee_client_secret', clientSecret.value);
      window.location.href = `https://gitee.com/oauth/authorize?client_id=${clientId.value}&redirect_uri=${encodeURIComponent(`${window.location.origin}${window.location.pathname}`)}&response_type=code`;
    }
  }
};
if (clientId.value && clientSecret.value && !token.value && code) {
  login();
}
const logout = () => {
  localStorage.removeItem('gitee_access_token');
  localStorage.removeItem('gitee_refresh_token');
  token.value = '';
};

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

const listToTree = (
  list: {
    path: string;
    sha: string;
    type: string;
  }[],
) => {
  const map: Record<string, FileNode> = {};
  const tree: FileNode[] = [];
  list.forEach((item) => {
    const parts = item.path.split('/');
    const parentPath = parts.slice(0, parts.length - 1).join('/');
    const filename = parts[parts.length - 1];
    const node = {
      title: filename,
      path: item.path,
      isLeaf: item.type !== 'tree',
      key: item.sha,
      children: [],
    };
    if (item.type === 'tree') {
      map[item.path] = node;
    }
    if (map[parentPath]) {
      map[parentPath].children.push(item.type === 'tree' ? map[item.path] : node);
    } else {
      tree.push(item.type === 'tree' ? map[item.path] : node);
    }
  });
  directoryTree.value = tree;
};

const info = reactive({
  owner: '',
  repo: '',
  branch: '',
});

const getTree = () => {
  const match = url.value.match(/^https:\/\/gitee.com\/([^/]+)\/([^/]+)\/([^/]+)/);
  info.owner = match?.[1] || '';
  info.repo = match?.[2] || '';
  info.branch = match?.[3] || '';
  if (cache.url === url.value && cache.tree.length > 0) {
    listToTree(cache.tree);
    return;
  }
  fetch(
    `https://gitee.com/api/v5/repos/${info.owner}/${info.repo}/git/trees/${info.branch}?access_token=${token.value}&recursive=${1}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  )
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Network response was not ok');
      }
    })
    .then((res) => {
      const treeList = res.tree.map((el: any) => ({
        path: el.path,
        sha: el.sha,
        type: el.type,
      }));
      treeList.sort((a: any, b: any) => {
        if (a.type === b.type) {
          return a.path.localeCompare(b.path);
        }
        return a.type === 'tree' ? -1 : 1;
      });
      localStorage.setItem('getee_tree', JSON.stringify({ tree: treeList, url: url.value }));
      listToTree(treeList);
    })
    .catch(() => {
      console.error('转换失败');
    });
};

const selectDir = async () => {
  getTree();
};
const getContent = async (path: string) => {
  return await fetch(
    `https://gitee.com/api/v5/repos/${info.owner}/${info.repo}/raw/${encodeURIComponent(path)}?access_token=${token.value}&ref=${info.branch}`,
    {
      method: 'GET',
    },
  ).then((response) => {
    if (response.ok) {
      return response.text();
    } else {
      throw new Error('Network response was not ok');
    }
  });
};
const loadMore = async (node: MjTreeNodeData) => {
  if (node.isLeaf) {
    if (fileTabs.value.includes(node.key)) {
      currTab.value = node.key;
      return;
    }
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
      name: node.title,
      content: '',
      key: node.key,
      opacity: 100,
    };

    if (/\.(ico|jpg|jpeg|png|webp|gif)$/.test(node.title)) {
      fileContent.type = 'url';
      fileContent.content = `https://gitee.com/api/v5/repos/${info.owner}/${info.repo}/raw/${encodeURIComponent(node.path)}?access_token=${token.value}&ref=${info.branch}`;
      fileContent.opacity = 100;
      fileContents.value[node.key] = fileContent;
      fileTabs.value.push(node.key);
      currTab.value = node.key;
    } else {
      const content = await getContent(node.path);
      fileContent.content = content;
      if (/\.md$/.test(node.title)) {
        fileContent.type = 'md';
        fileContent.opacity = 100;
      } else {
        fileContent.opacity = +(opacity || '0');
        fileContent.type = 'text';
      }
      if (/\.css$/.test(node.title)) {
        fileContent.lang = 'css';
      } else {
        fileContent.lang = '';
      }
      fileContents.value[node.key] = fileContent;
      fileTabs.value.push(node.key);
      currTab.value = node.key;
    }
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
  & > .mj-input {
    flex: 0 0 calc(100vw - 210px);
    margin-right: 16px;
  }
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
