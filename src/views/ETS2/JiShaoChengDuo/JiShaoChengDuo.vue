<template>
  <div class="jishaochengduo">
    <div>
      <mj-alert
        :message="`总里程：${sum.mileage}公里，总经验：${sum.exp}，剩余里程：${Math.max(0, 10000 - sum.mileage)}公里，总经验：${Math.max(0, 20000 - sum.exp)}，总共跑了${uuidList.length}趟`"
      />
      <div>
        <div class="jishaochengduo-tags">
          <mj-tag type="primary">长途</mj-tag>
          <mj-tag type="error">易碎</mj-tag>
          <mj-tag type="warning">贵重</mj-tag>
          <mj-tag type="success">特快</mj-tag>
        </div>
        <span
          :class="[
            'jishaochengduo-result',
            getTip(95) === '失败'
              ? 'jishaochengduo-result-error'
              : getTip(95).substring(0, 4) === '可能失败'
                ? 'jishaochengduo-result-warning'
                : 'jishaochengduo-result-success',
          ]"
        >
          {{ getTip(95) }}
        </span>
      </div>
      <div>
        <div class="jishaochengduo-tags">
          <mj-tag type="primary">长途</mj-tag>
          <mj-tag type="error">易碎</mj-tag>
          <mj-tag type="warning">贵重</mj-tag>
          <mj-tag>普快</mj-tag>
        </div>
        <span
          :class="[
            'jishaochengduo-result',
            getTip(85) === '失败'
              ? 'jishaochengduo-result-error'
              : getTip(85).substring(0, 4) === '可能失败'
                ? 'jishaochengduo-result-warning'
                : 'jishaochengduo-result-success',
          ]"
        >
          {{ getTip(85) }}</span
        >
      </div>
      <div>
        <div class="jishaochengduo-tags">
          <mj-tag type="primary">长途</mj-tag>
          <mj-tag type="error">易碎</mj-tag>
          <mj-tag type="success">特快</mj-tag>
        </div>
        <span
          :class="[
            'jishaochengduo-result',
            getTip(77) === '失败'
              ? 'jishaochengduo-result-error'
              : getTip(77).substring(0, 4) === '可能失败'
                ? 'jishaochengduo-result-warning'
                : 'jishaochengduo-result-success',
          ]"
        >
          {{ getTip(77) }}</span
        >
      </div>
      <div>
        <div class="jishaochengduo-tags">
          <mj-tag type="primary">长途</mj-tag>
          <mj-tag type="warning">贵重</mj-tag>
          <mj-tag type="success">特快</mj-tag>
        </div>
        <span
          :class="[
            'jishaochengduo-result',
            getTip(73) === '失败'
              ? 'jishaochengduo-result-error'
              : getTip(73).substring(0, 4) === '可能失败'
                ? 'jishaochengduo-result-warning'
                : 'jishaochengduo-result-success',
          ]"
        >
          {{ getTip(73) }}</span
        >
      </div>
      <div>
        <div class="jishaochengduo-tags">
          <mj-tag type="primary">长途</mj-tag>
          <mj-tag type="error">易碎</mj-tag>
          <mj-tag>普快</mj-tag>
        </div>
        <span
          :class="[
            'jishaochengduo-result',
            getTip(67) === '失败'
              ? 'jishaochengduo-result-error'
              : getTip(67).substring(0, 4) === '可能失败'
                ? 'jishaochengduo-result-warning'
                : 'jishaochengduo-result-success',
          ]"
        >
          {{ getTip(67) }}</span
        >
      </div>
      <div>
        <div class="jishaochengduo-tags">
          <mj-tag type="primary">长途</mj-tag>
          <mj-tag type="error">易碎</mj-tag>
          <mj-tag type="warning">贵重</mj-tag>
        </div>
        <span
          :class="[
            'jishaochengduo-result',
            getTip(65) === '失败'
              ? 'jishaochengduo-result-error'
              : getTip(65).substring(0, 4) === '可能失败'
                ? 'jishaochengduo-result-warning'
                : 'jishaochengduo-result-success',
          ]"
        >
          {{ getTip(65) }}</span
        >
      </div>
      <div>
        <div class="jishaochengduo-tags">
          <mj-tag type="primary">长途</mj-tag>
          <mj-tag type="warning">贵重</mj-tag>
          <mj-tag>普快</mj-tag>
        </div>
        <span
          :class="[
            'jishaochengduo-result',
            getTip(63) === '失败'
              ? 'jishaochengduo-result-error'
              : getTip(63).substring(0, 4) === '可能失败'
                ? 'jishaochengduo-result-warning'
                : 'jishaochengduo-result-success',
          ]"
        >
          {{ getTip(63) }}</span
        >
      </div>
      <div>
        <div class="jishaochengduo-tags">
          <mj-tag type="primary">长途</mj-tag>
          <mj-tag type="success">特快</mj-tag>
        </div>
        <span
          :class="[
            'jishaochengduo-result',
            getTip(55) === '失败'
              ? 'jishaochengduo-result-error'
              : getTip(55).substring(0, 4) === '可能失败'
                ? 'jishaochengduo-result-warning'
                : 'jishaochengduo-result-success',
          ]"
        >
          {{ getTip(55) }}</span
        >
      </div>
      <div>
        <div class="jishaochengduo-tags">
          <mj-tag type="primary">长途</mj-tag>
          <mj-tag>普快</mj-tag>
        </div>
        <span
          :class="[
            'jishaochengduo-result',
            getTip(45) === '失败'
              ? 'jishaochengduo-result-error'
              : getTip(45).substring(0, 4) === '可能失败'
                ? 'jishaochengduo-result-warning'
                : 'jishaochengduo-result-success',
          ]"
        >
          {{ getTip(45) }}</span
        >
      </div>
      <div>
        <div class="jishaochengduo-tags">
          <mj-tag type="primary">长途</mj-tag>
        </div>
        <span
          :class="[
            'jishaochengduo-result',
            getTip(25) === '失败'
              ? 'jishaochengduo-result-error'
              : getTip(25).substring(0, 4) === '可能失败'
                ? 'jishaochengduo-result-warning'
                : 'jishaochengduo-result-success',
          ]"
        >
          {{ getTip(25) }}</span
        >
      </div>
      <div class="jishaochengduo-btns">
        <mj-button type="primary" @click="add">添加</mj-button>
      </div>
      <mj-table
        :columns="columns"
        :data="uuidList.map((uuid) => dataMap[uuid])"
        primary-key="uuid"
        @selection-change="onSelectionChange"
      >
        <template #operation="{ row }">
          <mj-button type="text" status="normal" size="small" @click="edit(row)">编辑</mj-button>
          <mj-button type="text" status="normal" size="small" @click="copy(row)">复制</mj-button>
          <mj-button type="text" status="danger" size="small" @click="del(row)">删除</mj-button>
        </template>
      </mj-table>
      <MjModal
        v-model="addVisible"
        :title="addType === 'add' ? '添加' : '编辑'"
        title-align="start"
        :width="300"
        @ok="onSave"
      >
        <mj-form ref="formRef" :model="formData" :label-width="40">
          <mj-form-item label="里程" name="mileage">
            <mj-input v-model="formData.mileage" />
          </mj-form-item>
          <mj-form-item label="经验" name="exp">
            <mj-input v-model="formData.exp" />
          </mj-form-item>
        </mj-form>
      </MjModal>
    </div>
  </div>
</template>
<script lang="ts" setup>
import MjButton from '@/components/MjButton/MjButton.vue';
import MjForm from '@/components/MjForm';
import message from '@/components/MjMessage';
import MjModal from '@/components/MjModal/MjModal.vue';
import MjTable from '@/components/MjTable/MjTable.vue';
import MjInput from '@/components/MjInput/MjInput.vue';
import BinaryWriter from '@/lib/saver/BinaryWriter';
import { generateUuid } from '@/utils';
import { computed, ref, watch } from 'vue';
import MjAlert from '@/components/MjAlert/MjAlert.vue';
import MjTag from '@/components/MjTag/MjTag.vue';
interface RecordData {
  mileage: number;
  exp: number;
  uuid: string;
}

interface AddRecordData {
  mileage: string;
  exp: string;
  uuid: string;
}

const MjFormItem = MjForm.FormItem;
const addVisible = ref(false);
const formRef = ref();
const uuidList = ref<string[]>([]);
const addType = ref<'add' | 'edit'>('add');
const dataMap = ref<Record<string, RecordData>>({});

// 长途 25 易碎 22 贵重 18 普快 20 特快30

const sum = computed(() => {
  return uuidList.value.reduce(
    (prev, uuid) => ({
      mileage: prev.mileage + dataMap.value[uuid].mileage,
      exp: prev.exp + dataMap.value[uuid].exp,
    }),
    {
      mileage: 0,
      exp: 0,
    },
  );
});
const getTip = (bonus = 95) => {
  if (sum.value.exp >= 20000) return '完成';
  if (sum.value.mileage >= 10000) return '失败';
  const surplusMileage = 10000 - sum.value.mileage;
  const surplusExp = 20000 - sum.value.exp;
  const ratio = ((surplusExp - surplusMileage) * 100) / surplusMileage - bonus;
  if (ratio <= 0) return `>=250公里`;
  const maxMileage90 = (90 * 100) / ratio;
  if (maxMileage90 < 250) return `失败`;
  const maxMileage40 = (40 * 100) / ratio;
  if (maxMileage40 < 250) return `可能失败，250公里 ~ ${Math.floor(maxMileage90)}公里`;
  return `250公里 ~ ${Math.floor(maxMileage40)}公里`;
};
const columns = [
  {
    title: '里程',
    name: 'mileage',
  },
  {
    title: '经验',
    name: 'exp',
  },
  {
    title: '操作',
    name: 'operation',
    slotName: 'operation',
  },
];

const formData = ref<AddRecordData>({
  mileage: '',
  exp: '',
  uuid: '',
});
const onSave = () => {
  if (!formData.value.mileage) {
    message.error('请输入里程');
    return;
  }
  if (!formData.value.exp) {
    message.error('请输入经验');
    return;
  }
  if (formData.value.uuid) {
    dataMap.value[formData.value.uuid] = {
      ...formData.value,
      mileage: +formData.value.mileage,
      exp: +formData.value.exp,
    };
  } else {
    const data = {
      mileage: +formData.value.mileage,
      exp: +formData.value.exp,
      uuid: generateUuid(),
    };
    dataMap.value[data.uuid] = data;
    uuidList.value.push(data.uuid);
  }
  save();
};
watch([addVisible], () => {
  if (addVisible.value === false) {
    formData.value = {
      mileage: '',
      exp: '',
      uuid: '',
    };
  }
});
const add = () => {
  addType.value = 'add';
  addVisible.value = true;
};
const edit = (row: RecordData) => {
  addType.value = 'edit';
  addVisible.value = true;
  formData.value = { ...row, mileage: row.mileage.toString(), exp: row.exp.toString() };
};
const copy = (row: RecordData) => {
  addType.value = 'add';
  addVisible.value = true;
  formData.value = { ...row, uuid: '', mileage: row.mileage.toString(), exp: row.exp.toString() };
};
const load = () => {
  const reader = new BinaryWriter('Read', 1);
  const dataStr = localStorage.getItem('ets2_JSCD');
  if (dataStr) {
    reader.setRawData(dataStr);
    const keys = reader.readArray((r1) => r1.readString());
    return reader.readArray((r1) => {
      const obj: any = {};
      keys.forEach((key) => {
        obj[key] = r1.readInt32();
      });
      return obj;
    });
  }
  return [];
};
uuidList.value = load().map((el) => {
  const uuid = generateUuid();
  dataMap.value[uuid] = {
    ...el,
    saveLocal: true,
    uuid,
  };
  return uuid;
});

const save = () => {
  const writer = new BinaryWriter('Write', 100000);
  const keys = ['mileage', 'exp'];
  writer.writeArray(keys, (val, w1) => {
    w1.writeString(val);
  });
  const list = uuidList.value.map((uuid) => dataMap.value[uuid]);
  writer.writeArray(list, (val, w1) => {
    keys.forEach((key) => {
      w1.writeInt32(val[key]);
    });
  });
  localStorage.setItem('ets2_JSCD', writer.getRawDataStr());
};
const del = (row: RecordData) => {
  delete dataMap.value[row.uuid];
  uuidList.value = uuidList.value.filter((el) => el !== row.uuid);
  save();
};

const selectList = ref<string[]>([]);
const onSelectionChange = (rowKeys: (string | number)[]) => {
  selectList.value = rowKeys as string[];
};
</script>
<style scoped lang="scss">
.jishaochengduo {
  padding: 10px;
  .jishaochengduo-tags {
    display: inline-block;
    margin-bottom: 8px;
    min-width: 115px;
  }
  .jishaochengduo-result {
    margin-left: 8px;
    &.jishaochengduo-result-success {
      color: var(--mj-color-success-6);
    }
    &.jishaochengduo-result-warning {
      color: var(--mj-color-warning-6);
    }
    &.jishaochengduo-result-error {
      color: var(--mj-color-error-6);
    }
  }
  .jishaochengduo-btns {
    margin-bottom: 16px;
  }
}
</style>
