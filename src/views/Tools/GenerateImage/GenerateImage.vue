<template>
  <div class="generate-image">
    <dl><MjButton type="primary" @click="setting = true">设置</MjButton></dl>
    <dl class="generate-image-row">
      <label>关键词</label>
      <MjTextarea v-model="keyword" placeholder="关键词" :rows="10" />
      <MjButton :disabled="!appid || !fanyiKey" @click="fanyi" type="text">翻译</MjButton>
    </dl>
    <dl class="generate-image-row">
      <label>负面关键词</label>
      <MjTextarea v-model="negativePrompt" placeholder="负面关键词" :rows="10" />
      <MjButton :disabled="!appid || !fanyiKey" @click="negativeFanyi" type="text">翻译</MjButton>
    </dl>
    <dl class="generate-image-row">
      <label>比例</label
      ><MjSelect v-model="rate" placeholder="比例" :options="rateList" @change="rateChange" />
      <div style="margin-left: 8px"><MjCheckbox v-model="rateLook" label="锁定比例" /></div>
    </dl>
    <dl class="generate-image-row">
      <label>宽度</label
      ><MjInput v-model="imgParams.width" placeholder="宽度" @change="widthChange" />
    </dl>
    <dl class="generate-image-row">
      <label>高度</label
      ><MjInput v-model="imgParams.height" placeholder="高度" @change="heightChange" />
    </dl>
    <dl class="generate-image-row">
      <label>模式</label>
      <MjSelect
        v-model="imgParams.model"
        placeholder="模式"
        :options="['flux', 'turbo', 'gptimage']"
      />
    </dl>
    <dl class="generate-image-row">
      <label>种子</label>
      <MjInput :disabled="randomSeed" v-model="imgParams.seed" placeholder="种子" />
      <div style="margin-left: 8px"><MjCheckbox v-model="randomSeed" label="随机" /></div>
    </dl>
    <dl class="generate-image-row">
      <label>安全模式</label><MjCheckbox v-model="imgParams.safe" />
    </dl>
    <dl class="generate-image-btns"><MjButton type="primary" @click="generate">生成</MjButton></dl>
    <dl v-if="creating">生成中...</dl>
    <dl><MjButton @click="result = ''" type="text">清空</MjButton></dl>
    <img :src="result" @load="creating = false" />
    <MjModal v-model="setting" title="设置" @ok="saveFanyiKey">
      <dl class="generate-image-row">
        <label>百度翻译appId</label>
        <MjInput v-model="appid" placeholder="百度翻译appId" />
      </dl>
      <dl class="generate-image-row">
        <label>百度翻译秘钥</label>
        <MjInput v-model="fanyiKey" placeholder="百度翻译秘钥" />
      </dl>
    </MjModal>
  </div>
</template>
<script lang="ts" setup>
import MjButton from '@/components/MjButton/MjButton.vue';
import MjCheckbox from '@/components/MjCheckbox/MjCheckbox.vue';
import MjInput from '@/components/MjInput/MjInput.vue';
import MjMessage from '@/components/MjMessage';
import MjModal from '@/components/MjModal/MjModal.vue';
import MjSelect from '@/components/MjSelect/MjSelect.vue';
import MjTextarea from '@/components/MjTextarea/MjTextarea.vue';
import { baiduFanyi } from '@/utils/fanyi';
import { reactive, ref } from 'vue';
const keyword = ref('');
const randomSeed = ref(true);
const creating = ref(false);
const rate = ref('810:1440');
const rateLook = ref(false);
const negativePrompt = ref(
  'logo,text,badhandv4,EasyNegative,negative_hand-neg,mutated hands and fingers,poorly drawn face,extra limb,missing limb,disconnected limbs,malformed hands,ugly',
);
const setting = ref(false);
const appid = ref(localStorage.getItem('baidufanyiAppid') || '');
const fanyiKey = ref(localStorage.getItem('baidufanyiKey') || '');
const rateList = [
  {
    value: '1024:1024',
    label: '1:1 (1024x1024)',
  },
  {
    value: '960:1280',
    label: '3:4 (960:1280)',
  },
  {
    value: '810:1440',
    label: '9:16 (810x1440)',
  },
  {
    value: '720:1440',
    label: '1:2 (720:1440)',
  },
  {
    value: '880:1320',
    label: '2:3 (880:1320)',
  },
  {
    value: '1280:960',
    label: '4:3 (1280:960)',
  },
  {
    value: '1440:810',
    label: '16:9 (1440x810)',
  },
  {
    value: '1440:720',
    label: '2:1 (1440:720)',
  },
  {
    value: '1320:880',
    label: '3:2 (1320:880)',
  },
];
const imgParams = reactive({
  width: 810,
  height: 1440,
  model: 'flux',
  seed: '979158053',
  nologo: true,
  safe: false,
});

const saveFanyiKey = () => {
  localStorage.setItem('baidufanyiAppid', appid.value);
  localStorage.setItem('baidufanyiKey', fanyiKey.value);
};

const rateChange = () => {
  const [w, h] = rate.value.split(':');
  imgParams.width = +w;
  imgParams.height = +h;
};
const widthChange = () => {
  if (rateLook.value) {
    const [w, h] = rate.value.split(':');
    imgParams.height = Math.round((+h / +w) * imgParams.width);
  }
};
const heightChange = () => {
  if (rateLook.value) {
    const [w, h] = rate.value.split(':');
    imgParams.width = Math.round((+w / +h) * imgParams.height);
  }
};

const result = ref('');
const fanyi = () => {
  if (!keyword.value) {
    MjMessage.error('请输入要翻译的内容');
    return;
  }
  baiduFanyi({
    q: keyword.value,
    appid: appid.value,
    key: fanyiKey.value,
  }).then((res) => {
    keyword.value = res?.trans_result?.[0]?.dst || '';
  });
};
const negativeFanyi = () => {
  if (!negativePrompt.value) {
    MjMessage.error('请输入要翻译的内容');
    return;
  }
  baiduFanyi({
    q: negativePrompt.value,
    appid: '20250619002385235',
    key: 'riyDD1K58qpg5md2VWCa',
  }).then((res) => {
    negativePrompt.value = res?.trans_result?.[0]?.dst || '';
  });
};
const generate = () => {
  if (!keyword.value) {
    MjMessage.error('请输入关键词');
    return;
  }
  creating.value = true;
  if (randomSeed.value) {
    imgParams.seed = Math.round(Math.random() * 1000000000).toString();
  }
  result.value = `https://image.pollinations.ai/prompt/${keyword.value.replace(/\s+/g, '%2520')}?${Object.keys(
    imgParams,
  )
    .map((k) => `${k}=${(imgParams as any)[k]}`)
    .join('&')}`;
};
</script>
<style scoped lang="scss">
.generate-image {
  padding: 24px;
  .generate-image-row {
    display: flex;
    margin-bottom: 16px;
    align-items: flex-start;
    label {
      width: 80px;
      flex: 0 0 80px;
      line-height: 30px;
    }
    .mj-select,
    .mj-input,
    .mj-textarea {
      flex: 0 0 calc(90% - 200px);
    }
    .mj-checkbox {
      padding-top: 8px;
    }
  }
  .generate-image-btns {
    .mj-btn {
      width: calc(90% - 200px);
      margin-left: 80px;
    }
  }
  img {
    max-width: 100%;
    margin-top: 16px;
  }
}
</style>
