<template>
  <div ref="contentScroll" class="ds-chat">
    <div v-if="chat.name" class="chat-title">{{ chat.name }}</div>
    <div class="ds-groupchat-info">
      <div class="ds-groupchat-sys">
        <div class="ds-groupchat-sys-text" @click="updataSys">
          {{ chat.sysPreset || '添加指令' }}
        </div>
        <RightIcon />
      </div>
      <div @click="memberVisible = true" style="flex: 0; white-space: nowrap">
        {{ chat.memberList?.length || 0 }}人
      </div>
    </div>
    <div class="chat-content-list">
      <div
        :class="['chat-content-item', `chat-content-item--${chatRecord.role}`]"
        v-for="chatRecord in contentList"
        :key="chatRecord.key"
        :id="`chatRecord_${chatRecord.key}`"
        v-long-touch="{
          handler: (e: Touch) => {
            showMenu(chatRecord, e);
          },
          triggerTime: 1000,
        }"
        @contextmenu.prevent="showMenu(chatRecord, $event)"
      >
        <div v-if="chatRecord.name" class="chat-content-name">{{ chatRecord.name }}</div>
        <div
          class="chat-content-reason"
          v-if="
            chatRecord.role === 'assistant' &&
            (chatRecord.reason || (chatRecord.key === streamKey && streamReason))
          "
        >
          <div style="line-height: 22px" @click="chatRecord.reasonOpen = !chatRecord.reasonOpen">
            思考过程 <DownIcon :class="{ 'reason-open': chatRecord.reasonOpen }" />
          </div>
          <MjMd
            v-show="chatRecord.reasonOpen"
            :content="chatRecord.key === streamKey ? streamReason : chatRecord.reason || ''"
            :disabledTypes="['a']"
            theme="dark"
          />
        </div>
        <div class="chat-content-content">
          <div
            v-if="chatRecord.role === 'user'"
            v-html="chatRecord.content.replace('\n', '<br />')"
          ></div>
          <MjMd
            v-else
            :content="chatRecord.key === streamKey ? streamContent : chatRecord.content || ''"
            :disabledTypes="['a']"
            theme="dark"
          />
        </div>
      </div>
    </div>

    <div
      class="ds-content-more-opactions"
      v-show="menuContent"
      :style="{ left: `${menuPosition.x}px`, top: `${menuPosition.y}px` }"
    >
      <dl @click="copy()">复制</dl>
      <dl
        v-if="
          menuContent?.role === 'user' &&
          menuContent.key === contentList[contentList.length - 1]?.userContentKey
        "
        @click.stop="modifyContent"
      >
        修改
      </dl>
      <dl
        v-if="
          menuContent?.role === 'assistant' &&
          contentList[contentList.length - 1].key === menuContent.key
        "
        @click.stop="reCreate"
      >
        重新生成
      </dl>
      <dl v-if="menuContent?.role === 'user'" style="color: red" @click.stop="delContent">删除</dl>
    </div>

    <div class="deepseek-mask" v-show="visible">
      <div class="ds-groupchat-sys-modal">
        <div class="ds-groupchat-sys-modal-header">设置指令</div>
        <MjTextarea
          class="ds-groupchat-sys-modal-ipt"
          placeholder="请输入指令"
          v-model="sysContent"
          autocomplete="off"
        />
        <div class="ds-groupchat-sys-modal-btns">
          <button @click="visible = false">取消</button>
          <button @click="save">保存</button>
        </div>
      </div>
    </div>
    <div class="deepseek-mask" v-if="memberVisible">
      <div class="ds-groupchat-sys-modal">
        <div class="ds-groupchat-sys-modal-header">群成员</div>
        <MjButton @click="addMember">添加</MjButton>
        <MjTabs defaultActiveKey="主角">
          <MjTabs.Panel title="主角" key="主角">
            <MjInput v-model="chat.username" />
            <MjTextarea
              class="ds-groupchat-sys-modal-ipt"
              placeholder="请输入指令"
              v-model="chat.userPreset"
              autocomplete="off"
            />
          </MjTabs.Panel>
          <MjTabs.Panel
            v-for="(member, i) in chat.memberList || []"
            :title="member.name"
            :key="i.toString()"
          >
            <MjInput v-model="member.name" />
            <MjTextarea
              class="ds-groupchat-sys-modal-ipt"
              placeholder="请输入指令"
              v-model="member.sysPreset"
              autocomplete="off"
            />
          </MjTabs.Panel>
        </MjTabs>
        <div class="ds-groupchat-sys-modal-btns">
          <button @click="cancelMember">取消</button>
          <button @click="saveMember">保存</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import type { DSContent, DSGroupChat, DSGroupContent, DSMessageItem } from '../db';
import { inject, nextTick, onBeforeUnmount, onMounted, ref, toRefs, watch } from 'vue';
import type DSDbTool from '../db';
import MjMd from '@/components/MjMd/MjMd.vue';
import vLongTouch from '@/directives/vLongTouch';
import message from '@/components/MjMessage';
import MjTextarea from '@/components/MjTextarea/MjTextarea.vue';
import RightIcon from '@/components/MjIcon/RightIcon.vue';
import MjTabs from '@/components/MjTabs';
import MjButton from '@/components/MjButton/MjButton.vue';
import MjInput from '@/components/MjInput/MjInput.vue';
import DownIcon from '@/components/MjIcon/DownIcon.vue';

const contentScroll = ref<HTMLDivElement>();
const emits = defineEmits<{
  (e: 'reCreate', content: DSContent, historyList: DSMessageItem[]): void;
  (e: 'modifyContent', content: DSContent, assContent: DSContent): void;
  (e: 'chatUpdate', chat: DSGroupChat): void;
  (e: 'refreshGroupchat'): void;
}>();
const props = defineProps<{
  chat: DSGroupChat;
  streamKey: number;
  streamReason: string;
  streamContent: string;
}>();
const { chat } = toRefs(props);
const { dbtool } = inject<{ dbtool: DSDbTool }>('ds')!;
const contentList = ref<(DSGroupContent & { reasonOpen?: boolean })[]>([]);

const menuContent = ref<DSContent | null>(null);
const menuPosition = ref({ x: 0, y: 0 });

const showMenu = (item: DSContent, e: MouseEvent | Touch) => {
  menuContent.value = item;
  menuPosition.value = { x: e.clientX, y: e.clientY };
};
const getContentList = () => {
  dbtool.getGroupContentListByGhatKey(chat.value.key).then((res) => {
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
const copy = () => {
  if (menuContent.value) {
    navigator.clipboard.writeText(menuContent.value.content).then(() => {
      message.success('复制成功');
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
    if (props.chat.sysPreset) {
      arr.unshift({ role: 'system', content: props.chat.sysPreset });
    }
    emits('reCreate', menuContent.value!, arr);
    menuContent.value = null;
  }
};
const modifyContent = async () => {
  if (menuContent.value) {
    if (contentList.value[contentList.value.length - 1]) {
      emits('modifyContent', menuContent.value, contentList.value[contentList.value.length - 1]);
      nextTick(() => {
        menuContent.value = null;
      });
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

const visible = ref(false);
const sysContent = ref('');
const updataSys = () => {
  sysContent.value = chat.value.sysPreset;
  visible.value = true;
};
const save = () => {
  dbtool
    .updateGroupChat({ key: chat.value.key, name: chat.value.name, sysPreset: sysContent.value })
    .then(() => {
      visible.value = false;
      emits('chatUpdate', { ...chat.value, sysPreset: sysContent.value });
      sysContent.value = '';
    });
};

const memberVisible = ref(false);
const addMember = () => {
  const memberList = chat.value.memberList || [];
  const maxNum = Math.max(
    0,
    ...memberList
      .filter((el) => /^未命名\d+$/.test(el.name))
      .map((el) => +el.name.replace('未命名', '')),
  );
  memberList.push({ name: `未命名${maxNum + 1}`, sysPreset: '' });
  chat.value.memberList = memberList;
};
const cancelMember = () => {
  memberVisible.value = false;
  emits('refreshGroupchat');
};
const saveMember = () => {
  const names: string[] = [];
  let flag = '';
  (chat.value.memberList || []).forEach((el) => {
    if (names.includes(el.name)) {
      flag = el.name;
    } else {
      names.push(el.name);
    }
  });
  if (flag) {
    message.error(`${flag}已存在`);
  } else {
    dbtool.updateGroupChat(chat.value).then(() => {
      memberVisible.value = false;
      emits('refreshGroupchat');
    });
  }
};
defineExpose({
  getContentList,
});
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
  position: relative;
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
  .chat-title {
    line-height: 32px;
    font-size: 18px;
    position: sticky;
    top: 0;
    background-color: var(--deepseek-bg);
    z-index: 9;
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
      .chat-content-name {
        font-weight: bold;
      }
      .chat-content-reason {
        font-size: 14px;
        opacity: 0.7;
        :deep .mj-down-icon {
          padding: 4px 0;
          font-size: 22px;
          transition: transform 0.3s;
          transform: rotate(180deg);
        }
        .reason-open {
          transform: rotate(0);
        }
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

  .ds-groupchat-sys {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 16px;
    border: 1px solid var(--deepseek-border-color);
    border-radius: 8px;
    background-color: var(--deepseek-sider-bg);
    font-size: 14px;
    flex: 1 0 calc(100% - 80px);
    width: calc(100% - 80px);
    box-sizing: border-box;
    cursor: pointer;
    .ds-groupchat-sys-text {
      width: calc(100% - 30px);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  .ds-groupchat-info {
    display: flex;
    gap: 0 16px;
  }

  .ds-groupchat-sys-modal {
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
    .ds-groupchat-sys-modal-header {
      line-height: 24px;
      font-size: 18px;
      font-weight: bold;
      padding-bottom: 12px;
      text-align: center;
    }
    :deep .mj-tabs-header-item span {
      color: #fff;
    }
    .ds-groupchat-sys-modal-ipt {
      flex: 1;
      background-color: transparent;
      border: none;
      outline: none;
      color: var(--deepseek-font-color);
      background-color: var(--deepseek-container-bg);
      margin-bottom: 16px;
    }
    .ds-groupchat-sys-modal-btns {
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
}
</style>
