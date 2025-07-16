<template>
  <div ref="contentScroll" class="ds-chat">
    <div class="chat-content-list">
      <div
        :class="['chat-content-item', `chat-content-item--${chatRecord.role}`]"
        v-for="chatRecord in contentList"
        :key="chatRecord.key"
        :id="`chatRecord_${chatRecord.key}`"
        @contextmenu.prevent="showMenu(chatRecord, $event)"
      >
        <div
          class="chat-content-reason"
          v-if="
            chatRecord.role === 'assistant' &&
            (chatRecord.reason || (chatRecord.key === streamKey && streamReason))
          "
        >
          <!-- {{ chatRecord.key === streamKey ? streamReason : chatRecord.reason }} -->
          <MjMd :content="chatRecord.key === streamKey ? streamReason : chatRecord.reason || ''" />
        </div>
        <div class="chat-content-content">
          <template v-if="chatRecord.role === 'user'">{{ chatRecord.content }}</template>
          <MjMd
            v-else
            :content="chatRecord.key === streamKey ? streamContent : chatRecord.content || ''"
          />
        </div>
      </div>
    </div>

    <div
      class="ds-content-more-opactions"
      v-show="menuContent"
      :style="{ left: `${menuPosition.x}px`, top: `${menuPosition.y}px` }"
    >
      <dl
        v-if="
          menuContent?.role === 'user' &&
          menuContent.key === contentList[contentList.length - 1]?.userContentKey
        "
        @click.stop="modifyContent"
      >
        修改
      </dl>
      <dl v-if="menuContent?.role === 'assistant'" @click.stop="reCreate">重新生成</dl>
      <dl v-if="menuContent?.role === 'user'" style="color: red" @click.stop="delContent">删除</dl>
    </div>
  </div>
</template>
<script lang="ts" setup>
import type { DSChat, DSGroup, DSContent, DSMessageItem } from '../db';
import { inject, nextTick, onBeforeUnmount, onMounted, ref, toRefs, watch } from 'vue';
import type DSDbTool from '../db';
import MjMd from '@/components/MjMd/MjMd.vue';

const contentScroll = ref<HTMLDivElement>();
const emits = defineEmits<{
  (e: 'reCreate', content: DSContent, historyList: DSMessageItem[]): void;
  (e: 'modifyContent', content: DSContent): void;
}>();
const props = defineProps<{
  group: DSGroup;
  chat: DSChat;
  streamKey: number;
  streamReason: string;
  streamContent: string;
}>();
const { chat } = toRefs(props);
const { dbtool } = inject<{ dbtool: DSDbTool }>('ds')!;
const contentList = ref<DSContent[]>([]);

const menuContent = ref<DSContent | null>(null);
const menuPosition = ref({ x: 0, y: 0 });

const showMenu = (item: DSContent, e: MouseEvent) => {
  menuContent.value = item;
  menuPosition.value = { x: e.clientX, y: e.clientY };
};
const getContentList = () => {
  dbtool.getContentListByGhatKey(chat.value.key).then((res) => {
    if (res.success) {
      contentList.value = res.data || [];
      if (contentList.value.length > 0) {
        nextTick(() => {
          document
            .getElementById(`chatRecord_${contentList.value[contentList.value.length - 1].key}`)
            ?.scrollIntoView({ block: 'end' });
        });
      }
    }
  });
};
const delContent = () => {
  if (menuContent.value) {
    dbtool.deleteContent(menuContent.value.key).then(() => {
      getContentList();
    });
  }
};
const reCreate = () => {
  if (menuContent.value) {
    menuContent.value.isStream = true;
    const arr: DSMessageItem[] = contentList.value
      .slice(0, contentList.value.length - 1)
      .map((el) => ({
        role: el.role,
        content: el.content,
      }));
    if (props.group.sysPreset) {
      arr.unshift({ role: 'system', content: props.group.sysPreset });
    }
    emits('reCreate', menuContent.value!, arr);
    menuContent.value = null;
  }
};
const modifyContent = async () => {
  if (menuContent.value) {
    const assContent = (await dbtool.getContentByUserContentKey(menuContent.value.key))?.data;
    if (assContent) {
      emits('modifyContent', assContent);
    }
  }
};
watch(
  () => props.streamKey,
  () => {
    getContentList();
  },
);
watch([() => props.streamReason + props.streamContent], () => {
  nextTick(() => {
    document.getElementById(`chatRecord_${props.streamKey}`)?.scrollIntoView({ block: 'end' });
  });
});
getContentList();
const outerclick = () => {
  menuContent.value = null;
};
onMounted(() => {
  window.addEventListener('click', outerclick);
});
onBeforeUnmount(() => {
  window.removeEventListener('click', outerclick);
});
</script>
<style scoped lang="scss">
.ds-chat {
  height: calc(100% - 100px);
  flex: 1 1 calc(100% - 100px);
  overflow: auto;
  margin-bottom: 16px;
  h1 {
    padding-top: 20%;
    margin-bottom: 16px;
  }
  .chat-sys {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 16px;
    border: 1px solid var(--deepseek-border-color);
    border-radius: 8px;
    background-color: var(--deepseek-sider-bg);
    font-size: 14px;
    cursor: pointer;
    .chat-sys-text {
      width: calc(100% - 30px);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  .chat-content-list {
    margin-top: 24px;
    display: flex;
    flex-direction: column;
    .chat-content-item {
      color: var(--deepseek-font-color);
      border-radius: 16px;
      margin-top: 8px;
      padding: 8px 16px;
      &--user {
        align-self: flex-end;
        background-color: var(--deepseek-sider-bg);
      }
      .chat-content-reason {
        font-size: 14px;
        opacity: 0.7;
      }
      .chat-content-content {
        font-size: 16px;
      }
      .mj-md {
        padding: 0;
        p {
          margin-left: 0;
        }
      }
    }
  }

  .chat-sys-modal {
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
    .chat-sys-modal-header {
      line-height: 24px;
      font-size: 18px;
      font-weight: bold;
      padding-bottom: 12px;
      text-align: center;
    }
    .chat-sys-modal-ipt {
      flex: 1;
      background-color: transparent;
      border: none;
      outline: none;
      color: var(--deepseek-font-color);
      background-color: var(--deepseek-container-bg);
      margin-bottom: 16px;
    }
    .chat-sys-modal-btns {
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

  .ds-content-more-opactions {
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
