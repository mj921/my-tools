<template>
  <div class="api-test">
    <div>
      <div class="api-test-btns">
        <mj-button type="primary" @click="add">添加</mj-button>
        <mj-button type="outline" :disabled="selectList.length === 0" @click="batchRun"
          >批量运行</mj-button
        >
      </div>
      <mj-table
        :columns="columns"
        :data="apiList.map((uuid) => apiMap[uuid])"
        :row-selection="rowSelection"
        primary-key="uuid"
        @selection-change="onSelectionChange"
      >
        <template #saveLocal="{ row }">
          <mj-switch
            v-model="row.saveLocal"
            @change="toggleSaveLocal"
            checked-text="是"
            unchecked-text="否"
          />
        </template>
        <template #operation="{ row }">
          <mj-button type="text" status="normal" size="small" @click="edit(row)">编辑</mj-button>
          <mj-button type="text" status="normal" size="small" @click="copy(row)">复制</mj-button>
          <mj-button type="text" status="normal" size="small" @click="run(row)">运行</mj-button>
          <mj-button type="text" status="danger" size="small" @click="del(row)">删除</mj-button>
        </template>
      </mj-table>
      <MjModal
        v-model="addVisible"
        :title="addType === 'add' ? '添加' : '编辑'"
        title-align="start"
        @ok="onSave"
      >
        <mj-form ref="formRef" :model="formData">
          <mj-form-item label="url" name="url">
            <mj-textarea v-model="formData.url" />
          </mj-form-item>
          <mj-form-item label="method" name="method">
            <mj-select v-model="formData.method" :options="methodList" />
          </mj-form-item>
          <mj-form-item label="headers" name="headers">
            <mj-textarea v-model="formData.headers" rows="5" />
          </mj-form-item>
          <mj-form-item label="params" name="params">
            <mj-textarea v-model="formData.params" rows="5" />
          </mj-form-item>
        </mj-form>
      </MjModal>
    </div>
  </div>
</template>
<script lang="ts" setup>
import MjButton from '@/components/MjButton/MjButton.vue';
import MjSwitch from '@/components/MjSwitch/MjSwitch.vue';
import MjForm from '@/components/MjForm';
import message from '@/components/MjMessage';
import MjModal from '@/components/MjModal/MjModal.vue';
import MjSelect from '@/components/MjSelect/MjSelect.vue';
import MjTable from '@/components/MjTable/MjTable.vue';
import type { MjTableRowSelection } from '@/components/MjTable/interface';
import MjTextarea from '@/components/MjTextarea/MjTextarea.vue';
import request from '@/lib/request';
import BinaryWriter from '@/lib/saver/BinaryWriter';
import { generateUuid } from '@/utils';
import { reactive, ref, watch } from 'vue';
// 'oUy2kNTnwOPuwOJBaSYf', 'U6XYQrpNqjmzyAl6t5cP', 'VzDzMTGMXIuTwifB8wSv
interface ApiData {
  url: string;
  method: 'get' | 'post' | 'put' | 'delete' | 'options' | 'patch';
  headers: string;
  params: string;
  uuid: string;
  saveLocal: boolean;
}

const MjFormItem = MjForm.FormItem;
const addVisible = ref(false);
const formRef = ref();
const apiList = ref<string[]>([]);
const addType = ref<'add' | 'edit'>('add');
const apiMap = ref<Record<string, ApiData>>({});

const rowSelection = reactive<MjTableRowSelection>({
  type: 'checkbox',
  width: 40,
});

const methodList = ['get', 'post', 'put', 'delete', 'options', 'patch'];

const columns = [
  {
    title: 'url',
    name: 'url',
    minWidth: 80,
  },
  {
    title: 'method',
    name: 'method',
    width: 80,
  },
  {
    title: 'headers',
    name: 'headers',
    minWidth: 85,
  },
  {
    title: 'params',
    name: 'params',
    minWidth: 80,
  },
  {
    title: '存本地',
    name: 'saveLocal',
    slotName: 'saveLocal',
    width: 80,
  },
  {
    title: '操作',
    name: 'operation',
    slotName: 'operation',
    width: 205,
  },
];

const formData = ref<ApiData>({
  url: '',
  method: 'get',
  headers: '',
  params: '',
  uuid: '',
  saveLocal: false,
});
const onSave = () => {
  if (!formData.value.url) {
    message.error('请输入url');
    return;
  }
  if (!formData.value.method) {
    message.error('请输入method');
    return;
  }
  if (!formData.value.headers) {
    message.error('请输入headers');
    return;
  }
  if (!formData.value.params) {
    message.error('请输入params');
    return;
  }
  if (formData.value.uuid) {
    apiMap.value[formData.value.uuid] = { ...formData.value };
    if (formData.value.saveLocal) {
      save();
    }
  } else {
    const data = {
      ...formData.value,
      uuid: generateUuid(),
      saveLocal: false,
    };
    apiMap.value[data.uuid] = data;
    apiList.value.push(data.uuid);
  }
};
watch([addVisible], () => {
  if (addVisible.value === false) {
    formData.value = {
      url: '',
      method: 'get',
      headers: '',
      params: '',
      uuid: '',
      saveLocal: false,
    };
  }
});
const add = () => {
  addType.value = 'add';
  addVisible.value = true;
};
const edit = (row: ApiData) => {
  addType.value = 'edit';
  addVisible.value = true;
  formData.value = { ...row };
};
const copy = (row: ApiData) => {
  addType.value = 'add';
  addVisible.value = true;
  formData.value = { ...row, uuid: '', saveLocal: false };
};
const run = (row: ApiData) => {
  request({
    url: row.url,
    method: row.method,
    headers: JSON.parse(row.headers),
    data: JSON.parse(row.params),
  });
};
const load = () => {
  const reader = new BinaryWriter('Read', 1);
  const dataStr = localStorage.getItem('apitest');
  if (dataStr) {
    reader.setRawData(dataStr);
    const keys = reader.readArray((r1) => r1.readString());
    return reader.readArray((r1) => {
      const obj: any = {};
      keys.forEach((key) => {
        obj[key] = r1.readString();
      });
      return obj;
    });
  }
  return [];
};
apiList.value = load().map((el) => {
  const uuid = generateUuid();
  apiMap.value[uuid] = {
    ...el,
    saveLocal: true,
    uuid,
  };
  return uuid;
});

const save = () => {
  const writer = new BinaryWriter('Write', 100000);
  const keys = ['url', 'method', 'headers', 'params'];
  writer.writeArray(keys, (val, w1) => {
    w1.writeString(val);
  });
  const list: ApiData[] = [];
  apiList.value.forEach((uuid) => {
    const item = apiMap.value[uuid];
    if (item.saveLocal) {
      list.push(item);
    }
  });
  writer.writeArray(list, (val, w1) => {
    keys.forEach((key) => {
      w1.writeString(val[key]);
    });
  });
  localStorage.setItem('apitest', writer.getRawDataStr());
};
const toggleSaveLocal = () => {
  save();
};
const del = (row: ApiData) => {
  delete apiMap.value[row.uuid];
  apiList.value = apiList.value.filter((el) => el !== row.uuid);
  if (row.saveLocal) {
    save();
  }
};

const selectList = ref<string[]>([]);
const onSelectionChange = (rowKeys: (string | number)[]) => {
  selectList.value = rowKeys as string[];
};
const batchRun = () => {
  selectList.value.forEach((uuid) => run(apiMap.value[uuid]));
};
</script>
<style scoped lang="scss">
.api-test {
  padding: 20px;
  .api-test-btns {
    margin-bottom: 16px;
  }
}
</style>
