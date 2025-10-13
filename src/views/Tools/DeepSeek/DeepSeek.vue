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
          <DeepSeekGroup />
        </div>
        <div class="deepseek-sider-btns">
          <dl class="deepseek-sider-btn" @click="settingVisible = true">设置</dl>
        </div>
      </div>
    </div>
    <div class="deepseek-sider" v-else>
      <div class="deepseek-list">
        <DeepSeekGroup />
      </div>
      <div class="deepseek-sider-btns">
        <dl class="deepseek-sider-btn" @click="settingVisible = true">设置</dl>
      </div>
    </div>
    <div class="deepseek-container">
      <MenuIcon color="#fff" v-if="isMobile" @click="silderVisible = true" />
      <template v-if="route.params.chatKey">
        <DeepSeekChat
          v-if="selectChat && selectGroup"
          :chat="selectChat"
          :group="selectGroup"
          :streamContent="answer.content"
          :streamReason="answer.reasoning"
          :stream-key="answer.key"
          @re-create="reCreate"
          @modify-content="modifyContent"
        />
      </template>
      <template v-else-if="route.params.groupKey">
        <DeepSeekGroupDetail v-if="selectGroup" :group="selectGroup" @group-update="groupUpdate" />
      </template>

      <div
        v-if="route.params.groupKey"
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
              modelList.map((el) => ({
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
import DSDbTool, { type DSChat, type DSContent, type DSGroup, type DSMessageItem } from './db';
import DeepSeekSetting from './components/DeepSeekSetting.vue';
import DeepSeekGroup from './components/DeepSeekGroup.vue';
import { useRoute, useRouter } from 'vue-router';
import DeepSeekGroupDetail from './components/DeepSeekGroupDetail.vue';
import DeepSeekChat from './components/DeepSeekChat.vue';
import MjTextarea from '@/components/MjTextarea/MjTextarea.vue';
import MenuIcon from '@/components/MjIcon/MenuIcon.vue';
import { AiApiUrl, AiAppid, AiMaxToken, AiModelDef, type AiType } from './aiConfig';
import MjSelect from '@/components/MjSelect/MjSelect.vue';

const route = useRoute();
const router = useRouter();
const dbtool = new DSDbTool();
const selectGroup = ref<DSGroup | null>(null);
const selectChat = ref<DSChat | null>(null);
const settingVisible = ref(false);
const sendContent = ref('');
const isMobile = ref(window.innerWidth <= 750);
const silderVisible = ref(false);
const selectedModal = ref('');
const modelList = ref([]);
provide('ds', {
  dbtool,
});
const groupUpdate = (group: DSGroup) => {
  selectGroup.value = group;
};

const config = reactive<Record<string, string>>({});
dbtool.getConfig().then((res = []) => {
  res.forEach((el) => (config[el.name] = el.value));
  const aiType = (config.aiType || 'deepseek') as AiType;
  fetch(`${AiApiUrl[aiType]}/models`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${config[AiAppid[aiType]]}`,
      mode: 'no-cors',
    },
  })
    .then((res) => res.json())
    .then((res) => {
      modelList.value = (res?.data || []).map((el: { id: string }) => el.id);
      selectedModal.value = AiModelDef[aiType] || modelList.value[0];
    });
  // selectedModal.value = AiModelList[(config.aiType || 'deepseek') as AiType][0];
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
});

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
            if (config[AiAppid.nebulablock] && answer.firstChatKey) {
              getTitle(answer.content);
            }
            dbtool.updateChat(selectChat.value!.key, { lastMsg: answer.content });
            dbtool
              .updateContent(answer.key, {
                content: answer.content,
                reason: answer.reasoning,
                isStream: false,
              })
              .then((res) => {
                if (res.success) {
                  answer.key = 0;
                  answer.content = '';
                  answer.reasoning = '';
                }
              });
            return;
          }

          // 处理数据块
          const chunk = prev + decoder.decode(value, { stream: true });
          console.log(prev);

          prev = '';
          const lines = chunk.split('\n').filter((line) => line.trim());

          for (const line of lines) {
            if (line.startsWith('data:')) {
              const eventData = line.replace('data:', '').trim();
              console.log(eventData);

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
const getTitle = (content: string) => {
  fetch(`${AiApiUrl.edgefn}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${config[AiAppid.edgefn]}`,
      mode: 'no-cors',
    },
    body: JSON.stringify({
      messages: [
        {
          role: 'user',
          content: `精简提炼以下对话的标题，直接输出提炼后的标题，不要输出其他文字\n${content}`,
        },
      ],
      model: 'DeepSeek-R1-0528-Qwen3-8B',
      max_tokens: AiMaxToken.nebulablock,
      stream: false,
    }),
  })
    .then((res) => res.json())
    .then((res) => {
      dbtool
        .updateChat(answer.firstChatKey, { name: res?.choices?.[0]?.message?.content || '' })
        .then(() => {
          if (selectChat.value) {
            selectChat.value.name = res?.choices?.[0]?.message?.content || '';
          }
        });
    })
    .finally(() => {
      answer.firstChatKey = 0;
    });
};
const send = () => {
  if (sendContent.value) {
    dbtool
      .sendChatContent({
        content: sendContent.value.replace(/(^\s+|\s+$)/g, ''),
        groupKey: selectGroup.value!.key,
        chatKey: selectChat.value?.key ?? undefined,
        assContentKey: modifyContentItem.value?.assContent?.key,
        userContentKey: modifyContentItem.value?.userContent?.key,
      })
      .then((res) => {
        if (res.success) {
          sendContent.value = '';
          answer.key = res.data!.contentKey;
          fetchDeepseek(res.data!.historyContent);
          if (!route.params.chatKey) {
            answer.firstChatKey = res.data!.chatKey;
            router.push({
              name: 'tool-deepseek',
              params: {
                groupKey: selectGroup.value!.key,
                chatKey: res.data!.chatKey,
              },
            });
          }
          if (modifyContentItem.value.userContent) {
            modifyContentItem.value = { userContent: null, assContent: null };
          }
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
watch(
  () => route.params.groupKey,
  () => {
    if (route.params.groupKey) {
      dbtool.getGroup(+route.params.groupKey).then((res) => {
        if (!res) {
          router.push({
            name: 'tool-deepseek',
          });
        }
        selectGroup.value = res;
      });
    } else {
      selectGroup.value = null;
    }
  },
  {
    immediate: true,
  },
);

watch(
  () => route.params.chatKey,
  () => {
    if (route.params.chatKey) {
      dbtool.getChat(+route.params.chatKey).then((res) => {
        if (!res) {
          router.push({
            name: 'tool-deepseek',
            params: {
              groupKey: route.params.groupKey,
            },
          });
        }
        selectChat.value = res;
      });
    } else {
      selectChat.value = null;
    }
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
  user-select: none;
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
