<template>
  <div class="ds-group">
    <dt class="ds-group-header">分组 <PlusIcon @click="addGroup" /></dt>
    <div class="ds-group-list">
      <dl
        :class="[
          'ds-group-item',
          { 'ds-group-item--active': group.key.toString() === route.params.groupKey },
        ]"
        v-for="group in groupList"
        :key="group.key"
        @click="selectGroup(group.key)"
      >
        {{ group.name }} <MoreVerticalIcon @click.stop="showMenu(group, $event)" />
      </dl>
    </div>
    <div class="deepseek-mask" v-show="visible">
      <div class="ds-group-modal">
        <div class="ds-group-modal-header">分组</div>
        <div class="ds-group-modal-card">
          <dl class="ds-group-modal-row">
            <label class="ds-group-modal-label" for="ds-groupname">名称</label>
            <input
              class="ds-group-modal-ipt"
              id="ds-groupname"
              placeholder="请输入分组名称"
              v-model="groupName"
              autocomplete="off"
            />
          </dl>
        </div>
        <div class="ds-group-modal-btns">
          <button @click="visible = false">取消</button>
          <button @click="save">保存</button>
        </div>
      </div>
    </div>
    <div
      class="ds-group-more-opactions"
      v-show="menuGroup"
      :style="{ left: `${menuPosition.x}px`, top: `${menuPosition.y}px` }"
    >
      <dl @click="editGroup">编辑名称</dl>
      <dl style="color: red" @click="delGroup">删除</dl>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { inject, onBeforeUnmount, onMounted, ref } from 'vue';
import type DSDbTool from '../db';
import type { DSGroup } from '../db';
import PlusIcon from '@/components/MjIcon/PlusIcon.vue';
import MoreVerticalIcon from '@/components/MjIcon/MoreVerticalIcon.vue';
import message from '@/components/MjMessage';
import modal from '@/components/MjModal/mjmodal';
import { useRoute, useRouter } from 'vue-router';

const router = useRouter();
const route = useRoute();

const groupList = ref<DSGroup[]>([]);
const { dbtool } = inject<{ dbtool: DSDbTool }>('ds')!;
const visible = ref(false);
const groupName = ref('');
const editKey = ref(0);
const menuGroup = ref<DSGroup | null>(null);
const menuPosition = ref({ x: 0, y: 0 });
const save = () => {
  if (editKey.value) {
    dbtool.updateGroup(editKey.value, groupName.value).then((res) => {
      if (!res?.success) {
        message.error(res?.msg || '编辑失败');
      } else {
        message.success(res?.msg || '编辑成功');
      }
    });
  } else {
    dbtool.addGroup(groupName.value).then((res) => {
      if (!res?.success) {
        message.error(res?.msg || '添加失败');
      } else {
        message.success(res?.msg || '添加成功');
      }
    });
  }
  visible.value = false;
  dbtool.getGroupList().then((res) => {
    groupList.value = res;
  });
};
const addGroup = () => {
  visible.value = true;
  editKey.value = 0;
  groupName.value = '';
};
const editGroup = () => {
  if (menuGroup.value) {
    visible.value = true;
    editKey.value = menuGroup.value.key;
    groupName.value = menuGroup.value.name;
    menuGroup.value = null;
  }
};
const delGroup = () => {
  if (menuGroup.value) {
    editKey.value = menuGroup.value.key;
    menuGroup.value = null;
    modal
      .confirm({ title: '删除', content: '是否确定删除' })
      .then(() => {
        dbtool.deleteGroup(editKey.value).then((res) => {
          if (!res?.success) {
            message.error(res?.msg || '删除失败');
          } else {
            message.success(res?.msg || '删除成功');
            dbtool.getGroupList().then((res) => {
              groupList.value = res;
            });
          }
        });
      })
      .catch((res) => {
        console.log(res);
      })
      .finally(() => {
        editKey.value = 0;
      });
  }
};
const selectGroup = (groupKey: number) => {
  router.push({
    name: 'tool-deepseek',
    params: {
      groupKey,
    },
  });
};
const showMenu = (item: DSGroup, e: MouseEvent) => {
  menuGroup.value = item;
  menuPosition.value = { x: e.clientX, y: e.clientY };
};
dbtool.getGroupList().then((res) => {
  groupList.value = res;
});
const outerclick = () => {
  menuGroup.value = null;
};
onMounted(() => {
  window.addEventListener('click', outerclick);
});
onBeforeUnmount(() => {
  window.removeEventListener('click', outerclick);
});
</script>
<style scoped lang="scss">
.ds-group {
  height: 100%;
  .ds-group-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;
    padding: 0 8px;
  }
  .ds-group-list {
    height: calc(100% - 32px);
    overflow: auto;
    .ds-group-item {
      padding: 8px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      &.ds-group-item--active {
        background-color: var(--deepseek-active-1);
      }
    }
  }

  .ds-group-modal {
    position: absolute;
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
    .ds-group-modal-title {
      font-size: 16px;
      line-height: 32px;
      margin-bottom: 8px;
    }
    .ds-group-modal-card {
      background-color: var(--deepseek-container-bg);
      padding: 12px;
      border-radius: 8px;
      margin-bottom: 16px;
      .ds-group-modal-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        &:not(:last-child) {
          border-bottom: 1px solid var(--deepseek-bg);
        }
        .ds-group-modal-label {
          flex: 0 0 80px;
          margin-right: 8px;
        }
        .ds-group-modal-ipt {
          flex: 1;
          background-color: transparent;
          border: none;
          text-align: right;
          outline: none;
          color: var(--deepseek-font-color);
          &:focus {
            text-align: left;
          }
        }
      }
    }
    .ds-group-modal-btns {
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
  .ds-group-more-opactions {
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
