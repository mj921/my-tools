<template>
  <div class="deepseek">
    <div
      v-if="isMobile"
      class="deepseek-mask"
      v-show="silderVisible"
      @click="silderVisible = false"
    >
      <div class="deepseek-sider" @click.stop>
        <div class="deepseek-list">
          <DSGroupChatList />
        </div>
        <div class="deepseek-sider-btns">
          <dl class="deepseek-sider-btn" @click="settingVisible = true">设置</dl>
        </div>
      </div>
    </div>
    <div class="deepseek-sider" v-else>
      <div class="deepseek-list">
        <DSGroupChatList />
      </div>
      <div class="deepseek-sider-btns">
        <dl class="deepseek-sider-btn" @click="settingVisible = true">设置</dl>
      </div>
    </div>
    <div class="deepseek-container">
      <MenuIcon color="#fff" v-if="isMobile" @click="silderVisible = true" />
      <DSGroupChatDetail
        v-if="route.params.chatKey && selectChat"
        :chat="selectChat"
        :streamContent="answer.content"
        :streamReason="answer.reasoning"
        :stream-key="answer.key"
        @re-create="reCreate"
        @modify-content="modifyContent"
        @chat-update="groupUpdate"
        @refresh-groupchat="refreshGroupChat"
      />

      <div
        v-if="route.params.chatKey"
        :style="{ zIndex: modifyContentItem.userContent ? 99999999 : 0 }"
        @click.stop
      >
        <MjTextarea
          resize="vertical"
          :rows="3"
          :placeholder="route.params.chatKey ? '在这里发送消息' : '在这里提问新建对话'"
          v-model="sendContent"
          @enter="sendEnter"
        />
        <div class="ds-send-btns">
          <MjSelect
            v-model="selectedModal"
            :options="
              AiModelList[(config.aiType || 'deepseek') as AiType].map((el) => ({
                label: el,
                value: el,
              }))
            "
          />
          <button :disabled="!sendContent" class="ds-send-btn" @click.stop="send">发送</button>
        </div>
      </div>
    </div>
    <DeepSeekSetting :config="config" v-model="settingVisible" />
    <div
      class="deepseek-mask"
      v-show="modifyContentItem.userContent"
      @click="
        () => {
          modifyContentItem = { userContent: null, assContent: null };
          sendContent = '';
        }
      "
    ></div>
  </div>
</template>
<script lang="ts" setup>
import { provide, reactive, ref, watch } from 'vue';
import DSDbTool, { type DSContent, type DSGroupChat, type DSMessageItem } from './db';
import DeepSeekSetting from './components/DeepSeekSetting.vue';
import { useRoute, useRouter } from 'vue-router';
import MjTextarea from '@/components/MjTextarea/MjTextarea.vue';
import MenuIcon from '@/components/MjIcon/MenuIcon.vue';
import { AiApiUrl, AiAppid, AiMaxToken, AiModelList, type AiType } from './aiConfig';
import MjSelect from '@/components/MjSelect/MjSelect.vue';
import DSGroupChatList from './components/DSGroupChatList.vue';
import DSGroupChatDetail from './components/DSGroupChatDetail.vue';

const route = useRoute();
const router = useRouter();
const dbtool = new DSDbTool();
const selectChat = ref<DSGroupChat | null>(null);
const settingVisible = ref(false);
const sendContent = ref('');
const isMobile = ref(window.innerWidth <= 750);
const silderVisible = ref(false);
const selectedModal = ref('');
provide('ds', {
  dbtool,
});
const groupUpdate = (group: DSGroupChat) => {
  selectChat.value = group;
};

const config = reactive<Record<string, string>>({});
dbtool.getConfig().then((res = []) => {
  res.forEach((el) => (config[el.name] = el.value));
  selectedModal.value = AiModelList[(config.aiType || 'deepseek') as AiType][0];
});
watch([settingVisible], () => {
  if (!settingVisible.value) {
    dbtool.getConfig().then((res = []) => {
      res.forEach((el) => (config[el.name] = el.value));
    });
  }
});

const answer = reactive({
  content: '',
  reasoning: '',
  key: 0,
  firstChatKey: 0,
  name: '',
});

const replyList = ref<string[]>([]);
const replayNum = ref<Record<string, number>>({});
const prevContent = reactive({ name: '', content: '' });
const fetchDeepseek = (historyContent: DSMessageItem[], retry = 3) => {
  const aiType = (config.aiType || 'deepseek') as AiType;
  let prev = '';
  fetch(`${AiApiUrl[aiType]}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${config[AiAppid[aiType]]}`,
      mode: 'no-cors',
    },
    body: JSON.stringify({
      messages: historyContent,
      model: selectedModal.value,
      max_tokens: +config.maxToken || AiMaxToken[aiType],
      stream: true,
      temperature: 0.7,
      top_p: 0.9,
    }),
  })
    .then((res) => {
      if (res.ok) {
        const reader = res.body?.getReader();
        const decoder = new TextDecoder();
        answer.content = '';
        answer.reasoning = '';
        // 递归读取流数据
        const readChunk = async () => {
          const { value, done } = await reader!.read();
          if (done) {
            dbtool
              .updateGroupContent(answer.key, {
                content: answer.content,
                reason: answer.reasoning,
                isStream: false,
              })
              .then((res) => {
                if (res.success) {
                  replayNum.value[answer.name] = (replayNum.value[answer.name] || 0) + 1;
                  const total = Object.values(replayNum.value).reduce((sum, el) => sum + el, 0);
                  prevContent.content = answer.content;
                  answer.key = 0;
                  answer.content = '';
                  answer.reasoning = '';
                  if (replyList.value.length > 0 || Math.random() < 0.618 ** total) {
                    send();
                  } else {
                    prevContent.content = '';
                  }
                }
              });
            return;
          }

          // 处理数据块
          const chunk = prev + decoder.decode(value, { stream: true });

          prev = '';
          const lines = chunk.split('\n').filter((line) => line.trim());

          for (const line of lines) {
            if (line.startsWith('data:')) {
              const eventData = line.replace('data:', '').trim();

              if (eventData === '[DONE]') continue;

              try {
                const parsed = JSON.parse(eventData);
                const delta = parsed.choices?.[0]?.delta;

                if (delta?.content) {
                  answer.content += delta.content;
                }

                if (delta?.reasoning_content) {
                  answer.reasoning += delta.reasoning_content;
                }
              } catch (err) {
                prev += line;
                console.error('解析错误:', err);
              }
            }
          }

          readChunk(); // 继续读取下一块
        };

        readChunk();
      } else {
        if (res.status === 429 && retry > 0) {
          setTimeout(() => {
            fetchDeepseek(historyContent, retry - 1);
          }, 1000);
        }
      }
    })
    .catch((err) => {
      console.log(err, 'err');
    });
};

const reCreate = (reContent: DSContent, historyList: DSMessageItem[]) => {
  dbtool.updateContent(reContent.key, {
    content: '',
    reason: '',
    isStream: true,
  });
  answer.key = reContent.key;
  answer.content = '';
  answer.reasoning = '';
  fetchDeepseek(historyList);
};
const modifyContentItem = ref<{ userContent: DSContent | null; assContent: DSContent | null }>({
  userContent: null,
  assContent: null,
});
const modifyContent = async (userContent: DSContent, assContent: DSContent) => {
  if (userContent.content) {
    sendContent.value = userContent.content;
    modifyContentItem.value = { userContent, assContent };
  }
};
const send = () => {
  const memberList = [...(selectChat.value?.memberList || [])];
  if (sendContent.value) {
    prevContent.content = sendContent.value;
    prevContent.name = selectChat.value?.username || '林';
  }
  if (prevContent.content && selectChat.value && memberList.length > 0) {
    memberList.forEach((el) => {
      if (prevContent.content.includes(el.name) && prevContent.name !== el.name) {
        replyList.value.push(el.name);
      }
    });
    let memberIndex = -1;
    if (replyList.value.length > 0) {
      memberIndex = memberList.findIndex((el) => el.name === replyList.value[0]);
      replyList.value.shift();
    } else {
      const total = memberList.reduce(
        (sum, el) =>
          sum + (el.name === prevContent.name ? 0 : 1 / ((replayNum.value[el.name] || 0) + 1)),
        0,
      );
      let r = Math.random() * total;

      for (let i = 0; i < memberList.length; i++) {
        if (memberList[i].name !== prevContent.name) {
          const val = 1 / ((replayNum.value[memberList[i].name] || 0) + 1);
          if (r < val) {
            memberIndex = i;
          } else {
            r -= val;
          }
        }
      }
    }
    if (memberIndex === -1) return;
    const member = memberList[memberIndex];
    answer.name = member.name;
    memberList.splice(memberIndex, 1);
    const sysMsg = (selectChat.value.sysPreset ? [selectChat.value.sysPreset] : [])
      .concat(memberList.map((el) => `${el.name}:\n${el.sysPreset}`))
      .concat([`我是${selectChat.value?.username || '林'}\n${selectChat.value?.userPreset || ''}`])
      .join('\n');
    dbtool
      .sendGroupChatContent(
        selectChat.value!.key,
        member.name,
        sendContent.value
          ? {
              role: 'user',
              name: selectChat.value?.username || '林',
              content: prevContent.content,
            }
          : undefined,
      )
      .then((res) => {
        if (res.success) {
          answer.key = res.data!.contentKey;
          const historyContent: DSMessageItem[] = [
            {
              role: 'system',
              content: sysMsg,
            },
          ];
          historyContent.push(
            ...res.data.list.map((el) => ({ role: el.role, name: el.name, content: el.content })),
          );
          historyContent.push({
            role: 'system',
            content: `你是${member.name}:\n${member.sysPreset}`,
          });
          if (prevContent.name === (selectChat.value?.username || '林')) {
            historyContent.push({
              role: 'user',
              name: selectChat.value?.username || '林',
              content: prevContent.content,
            });
          }
          prevContent.name = member.name;
          sendContent.value = '';
          fetchDeepseek(historyContent);
        }
      });
  }
};
const sendEnter = (e: KeyboardEvent) => {
  if (!e.shiftKey) {
    e.preventDefault();
    send();
  }
};
const refreshGroupChat = () => {
  if (route.params.chatKey) {
    dbtool.getGroupChat(+route.params.chatKey).then((res) => {
      if (!res) {
        router.push({
          name: 'tool-ds-groupchat',
        });
      }
      selectChat.value = res;
    });
  } else {
    selectChat.value = null;
  }
};
watch(
  () => route.params.chatKey,
  () => {
    refreshGroupChat();
  },
  {
    immediate: true,
  },
);

//
</script>
<style scoped lang="scss">
.deepseek {
  display: flex;
  height: 100vh;
  width: 100vw;
  --deepseek-sider-bg: #252525;
  --deepseek-bg: #000;
  --deepseek-font-color: rgba(255, 255, 255, 0.9);
  --deepseek-hover-1: #2d2d2d;
  --deepseek-active-1: #424242;
  --deepseek-border-color: #3a3a3a;
  --deepseek-container-bg: #303030;
  color: var(--deepseek-font-color);
  .deepseek-sider {
    flex: 0 0 260px;
    background-color: var(--deepseek-sider-bg);
    height: 100%;
    overflow: auto;
    display: flex;
    flex-direction: column;
    padding: 16px 0;
    .deepseek-list {
      flex: 1;
      overflow: auto;
    }
    .deepseek-sider-btns {
      flex: 0;
      color: var(--deepseek-font-color);
      .deepseek-sider-btn {
        text-align: center;
        padding: 8px 0;
        font-size: 14px;
        cursor: pointer;
        &:hover {
          background-color: var(--deepseek-hover-1);
        }
      }
    }
  }
  .deepseek-container {
    flex: 1 0 calc(100% - 260px);
    background-color: var(--deepseek-bg);
    height: 100%;
    overflow: auto;
    padding: 0 40px 40px;
    display: flex;
    flex-direction: column;

    :deep .mj-textarea {
      padding: 8px;
      background-color: var(--deepseek-sider-bg);
      border-radius: 8px;
      line-height: 1.5;
      font-size: 14px;
      max-height: 121px;
      min-height: 79px;
      color: var(--deepseek-font-color);
    }
    .ds-send-btns {
      display: flex;
      justify-content: flex-end;
      .mj-select {
        max-width: 350px;
        margin-right: 8px;
      }
      .ds-send-btn {
        flex: 0;
        padding: 8px 24px;
        background-color: dodgerblue;
        border: none;
        font-size: 14px;
        color: var(--deepseek-font-color);
        font-weight: bold;
        line-height: 1em;
        border-radius: 4px;
        cursor: pointer;
        white-space: nowrap;
        &:disabled {
          background-color: #7195d8;
          cursor: not-allowed;
        }
      }
    }
  }
}
@media screen and (max-width: 750px) {
  .deepseek {
    display: block;
    position: relative;
    .deepseek-sider {
      flex: initial;
      position: fixed;
      left: 0;
      top: 0;
      height: 100%;
      width: 260px;
      max-width: 90%;
      z-index: 99;
    }
    .mj-menu-icon {
      position: fixed;
      left: 16px;
      top: 16px;
      font-size: 24px;
    }
  }
}
</style>
<style lang="scss">
.deepseek-mask {
  position: fixed;
  width: 100vw;
  height: 100vh;
  left: 0;
  top: 0;
  background-color: rgba($color: #000, $alpha: 0.6);
  z-index: 99999;
}
</style>
