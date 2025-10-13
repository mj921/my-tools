<template>
  <div class="ds-group-detail">
    <h1>{{ group.name }}</h1>
    <div class="ds-group-detail-info">
      <div class="group-detail-sys">
        <div class="group-detail-sys-text" @click="updataSys">
          {{ group.sysPreset || '添加指令' }}
        </div>
        <RightIcon />
      </div>
      <div @click="importChat">粘贴</div>
    </div>
    <div class="group-chat-list">
      <div
        v-long-touch="{
          handler: (e: Touch) => {
            showMenu(chat, e);
          },
        }"
        class="group-chat-item"
        v-for="chat in chatList"
        :key="chat.key"
        @click="openChat(chat.key)"
        @contextmenu.prevent="showMenu(chat, $event)"
      >
        <div class="group-chat-name" v-if="chat.name">{{ chat.name }}</div>
        <div class="group-chat-content">{{ chat.lastMsg }}</div>
      </div>
    </div>
    <div class="deepseek-mask" v-show="visible">
      <div class="group-detail-sys-modal">
        <div class="group-detail-sys-modal-header">设置指令</div>
        <MjTextarea
          class="group-detail-sys-modal-ipt"
          placeholder="请输入指令"
          v-model="sysContent"
          autocomplete="off"
        />
        <div class="group-detail-sys-modal-btns">
          <button @click="visible = false">取消</button>
          <button @click="save">保存</button>
        </div>
      </div>
    </div>

    <div
      class="ds-chat-more-opactions"
      v-show="menuChat"
      :style="{ left: `${menuPosition.x}px`, top: `${menuPosition.y}px` }"
    >
      <dl @click.stop="copyChat">复制</dl>
      <dl style="color: red" @click.stop="delChat">删除</dl>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useRouter } from 'vue-router';
import type { DSChat, DSGroup } from '../db';
import { inject, onBeforeUnmount, onMounted, ref, toRefs, watch } from 'vue';
import MjTextarea from '@/components/MjTextarea/MjTextarea.vue';
import RightIcon from '@/components/MjIcon/RightIcon.vue';
import type DSDbTool from '../db';
import message from '@/components/MjMessage';
import modal from '@/components/MjModal/mjmodal';
import vLongTouch from '@/directives/vLongTouch';

const emits = defineEmits<{ (e: 'groupUpdate', group: DSGroup): void }>();
const router = useRouter();
const props = defineProps<{ group: DSGroup }>();
const { group } = toRefs(props);
const { dbtool } = inject<{ dbtool: DSDbTool }>('ds')!;
const chatList = ref<DSChat[]>([]);
const visible = ref(false);
const sysContent = ref('');
const menuChat = ref<DSChat | null>(null);
const menuPosition = ref({ x: 0, y: 0 });

const showMenu = (item: DSChat, e: MouseEvent | Touch) => {
  menuChat.value = item;
  menuPosition.value = { x: e.clientX, y: e.clientY };
};
const getChatList = () => {
  chatList.value = [];
  dbtool.getChatListByGroupKey(group.value.key).then((res) => {
    if (res.success) {
      chatList.value = res.data || [];
    }
  });
};
const delChat = () => {
  if (menuChat.value) {
    modal
      .confirm({ title: '删除', content: '是否确定删除' })
      .then(() => {
        dbtool.deleteChat(menuChat.value!.key).then((res) => {
          if (!res?.success) {
            message.error(res?.msg || '删除失败');
          } else {
            message.success(res?.msg || '删除成功');
            getChatList();
          }
        });
      })
      .catch((res) => {
        console.log(res);
      })
      .finally(() => {
        menuChat.value = null;
      });
  }
};
const copyChat = () => {
  dbtool.getContentListByGhatKey(menuChat.value!.key).then((res) => {
    if (res.success) {
      navigator.clipboard
        .writeText(
          'deepseekcopy' +
            JSON.stringify(
              (res.data || []).map(
                (el) => `${el.role}:${(el.content || '').replace(/(^[\n\s]+|[\n\s]+$)/g, '')}`,
              ),
            ),
        )
        .then(() => {
          message.success('复制成功');
        });
    }
  });
};
const importChat = () => {
  navigator.clipboard.readText().then((res) => {
    if (typeof res === 'string' && /^deepseekcopy/.test(res)) {
      try {
        const data = JSON.parse(res.slice(12));
        const list = data.map((el: string) => {
          const [role, content] = el.match(/(^[^:]+|(?<=:)[\w\W]+$)/g) || [];
          return { role, content };
        });
        if (list.length > 0) {
          dbtool.importContentList({ contentList: list, groupKey: group.value.key }).then(() => {
            getChatList();
            message.success('粘贴成功');
          });
        }
      } catch (error) {
        message.error('粘贴失败');
      }
    } else {
      message.error('粘贴失败');
    }
  });
};
watch(
  () => group.value.key,
  () => {
    getChatList();
  },
  { immediate: true },
);
const updataSys = () => {
  sysContent.value = group.value.sysPreset;
  visible.value = true;
};
const save = () => {
  dbtool.updateGroup(group.value.key, group.value.name, sysContent.value).then(() => {
    visible.value = false;
    emits('groupUpdate', { ...group.value, sysPreset: sysContent.value });
    sysContent.value = '';
  });
};
const openChat = (chatKey: number) => {
  router.push({
    name: 'tool-deepseek',
    params: {
      groupKey: group.value.key,
      chatKey,
    },
  });
};
const outerclick = () => {
  menuChat.value = null;
};
onMounted(() => {
  window.addEventListener('click', outerclick);
});
onBeforeUnmount(() => {
  window.removeEventListener('click', outerclick);
});
</script>
<style scoped lang="scss">
.ds-group-detail {
  height: calc(100% - 100px);
  flex: 1 1 calc(100% - 100px);
  overflow: auto;
  margin-bottom: 16px;
  h1 {
    padding-top: 20%;
    margin-bottom: 16px;
  }

  .ds-group-detail-info {
    display: flex;
    gap: 0 16px;
    align-items: center;
  }
  .group-detail-sys {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 16px;
    border: 1px solid var(--deepseek-border-color);
    border-radius: 8px;
    background-color: var(--deepseek-sider-bg);
    font-size: 14px;
    width: calc(100% - 48px);
    cursor: pointer;
    .group-detail-sys-text {
      width: calc(100% - 30px);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  .group-chat-list {
    margin-top: 24px;
    .group-chat-item {
      color: var(--deepseek-font-color);
      border-radius: 8px;
      margin-top: 8px;
      padding: 8px 16px;
      cursor: pointer;
      &:hover {
        background-color: var(--deepseek-container-bg);
      }
      .group-chat-name {
        font-size: 14px;
      }
      .group-chat-content {
        font-size: 12px;
        opacity: 0.7;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }
    }
  }

  .group-detail-sys-modal {
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
    .group-detail-sys-modal-header {
      line-height: 24px;
      font-size: 18px;
      font-weight: bold;
      padding-bottom: 12px;
      text-align: center;
    }
    .group-detail-sys-modal-ipt {
      flex: 1;
      background-color: transparent;
      border: none;
      outline: none;
      color: var(--deepseek-font-color);
      background-color: var(--deepseek-container-bg);
      margin-bottom: 16px;
    }
    .group-detail-sys-modal-btns {
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

  .ds-chat-more-opactions {
    position: fixed;
    padding: 8px 0;
    border-radius: 8px;
    background-color: var(--deepseek-sider-bg);
    border: 1px solid var(--deepseek-border-color);
    dl {
      padding: 0 8px;
      font-size: 14px;
      text-align: center;
      line-height: 24px;
      cursor: pointer;
    }
  }
}
</style>
