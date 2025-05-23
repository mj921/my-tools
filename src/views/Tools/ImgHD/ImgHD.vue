<template>
  <div class="img-hd" :style="{ '--img-width': currWidth + 'px' }">
    <input type="file" @change="onFileChange" />
    <MjSlider
      v-model="currWidth"
      :style="{ width: '200px', display: 'inline-block' }"
      :max="imgWidth || 100"
    />
    <mj-button
      :style="{ marginLeft: '20px' }"
      type="primary"
      @click="comparision"
      :disabled="selected.length !== 2"
    >
      对比
    </mj-button>

    <mj-button :style="{ marginLeft: '20px' }" type="primary" @click="download" :disabled="!base64">
      下载
    </mj-button>
    <div>
      <div v-for="(item, i) in outputSrc" :key="item.title" class="img-hd-item">
        <img :src="item.src" :title="item.title" />
        <div>耗时：{{ item.time }}ms</div>
        <mj-checkbox :label="item.title" @change="toggleImgSelect({ item, i }, $event)" />
      </div>
    </div>
  </div>
  <mj-modal
    v-model="showModal"
    title="对比"
    width="100%"
    :unmount-on-close="true"
    :class="$style['comparision-modal']"
    :footer="false"
  >
    <div :style="{ display: 'flex', justifyContent: 'center' }">
      <div
        v-for="i in selected"
        :key="`comparision-${i}`"
        class="img-hd-item"
        :style="{ maxWidth: 'calc(50% - 20px)' }"
      >
        <img :src="outputSrc[i].src" :title="outputSrc[i].title" />
        <div>耗时：{{ outputSrc[i].time }}ms</div>
        <div>{{ outputSrc[i].title }}</div>
      </div>
    </div>
  </mj-modal>
</template>
<script lang="ts" setup>
import MjSlider from '@/components/MjSlider/MjSlider.vue';
import { ref } from 'vue';
// import { getPinPu } from './fft';
import { BBcolor, checkInverse, computeSpectrum, denoiseImageByImageData } from './fft1';
// import { BBcolor } from './fft1';
// import { checkInverse, computeSpectrum, denoiseImageByImageData } from './fft2';
import MjCheckbox from '@/components/MjCheckbox/MjCheckbox.vue';
import MjButton from '@/components/MjButton/MjButton.vue';
import MjModal from '@/components/MjModal/MjModal.vue';

const imgWidth = ref(0);
const currWidth = ref(0);
const showModal = ref(false);

const outputSrc = ref<{ src: string; title: string; time: number }[]>([]);
const offsetCanvas = document.createElement('canvas');
const offsetCtx = offsetCanvas.getContext('2d');
const scale = 1;
const selected = ref<number[]>([]);
const base64 = ref('');
const download = () => {
  const a = document.createElement('a');

  const blob = new Blob([base64.value], {
    type: 'text/plain;charset=utf-8;',
  });
  a.href = URL.createObjectURL(blob);
  a.download = 'download.txt';
  a.style.visibility = 'hidden';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

const imgDataToUrl = async (imageData: ImageData) => {
  const c = document.createElement('canvas');
  c.width = imageData.width;
  c.height = imageData.height;
  const ctx = c.getContext('2d');
  ctx?.putImageData(imageData, 0, 0);
  return c.toDataURL('image/png');
};
const nonLocalMeansColor = async (
  imageData: ImageData,
  searchRadius = 7,
  patchRadius = 3,
  h = 10,
) => {
  console.log('nonLocalMeansColor');
  const data = imageData.data;
  const width = imageData.width;
  const height = imageData.height;
  const output = new Uint8ClampedArray(data.length);

  // 遍历每个像素
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let totalWeight = 0;
      const weightedSum = [0, 0, 0]; // 分别保存R/G/B通道的加权和

      // 搜索窗口范围
      const yStart = Math.max(0, y - searchRadius);
      const yEnd = Math.min(height - 1, y + searchRadius);
      const xStart = Math.max(0, x - searchRadius);
      const xEnd = Math.min(width - 1, x + searchRadius);

      // 遍历搜索窗口内的所有像素
      for (let j = yStart; j <= yEnd; j++) {
        for (let i = xStart; i <= xEnd; i++) {
          let distance = 0;

          // 计算当前块与目标块的RGB三通道联合距离
          for (let dy = -patchRadius; dy <= patchRadius; dy++) {
            for (let dx = -patchRadius; dx <= patchRadius; dx++) {
              const yp = y + dy,
                xp = x + dx;
              const yq = j + dy,
                xq = i + dx;

              if (yp < 0 || yp >= height || xp < 0 || xp >= width) continue;
              if (yq < 0 || yq >= height || xq < 0 || xq >= width) continue;

              // 目标块像素索引
              const idxP = (yp * width + xp) * 4;
              // 搜索块像素索引
              const idxQ = (yq * width + xq) * 4;

              // RGB三通道差异的平方和
              const diffR = data[idxP] - data[idxQ];
              const diffG = data[idxP + 1] - data[idxQ + 1];
              const diffB = data[idxP + 2] - data[idxQ + 2];
              distance += diffR * diffR + diffG * diffG + diffB * diffB;
            }
          }

          // 计算权重（高斯核函数）
          const weight = Math.exp(-distance / (h * h));
          const idxQ = (j * width + i) * 4;
          weightedSum[0] += data[idxQ] * weight; // R
          weightedSum[1] += data[idxQ + 1] * weight; // G
          weightedSum[2] += data[idxQ + 2] * weight; // B
          totalWeight += weight;
        }
      }

      // 归一化并更新输出像素
      const idxOut = (y * width + x) * 4;
      output[idxOut] = weightedSum[0] / totalWeight; // R
      output[idxOut + 1] = weightedSum[1] / totalWeight; // G
      output[idxOut + 2] = weightedSum[2] / totalWeight; // B
      output[idxOut + 3] = data[idxOut + 3]; // Alpha
    }
  }
  console.log('nonLocalMeansColorend');
  return { imageData: new ImageData(output, width, height), width, height };
};

const avgFn = async (imageData: ImageData, scaleWidth: number, scaleHeight: number) => {
  console.log('avg');
  const data = [...imageData.data];
  for (let i = 0; i < imageData.data.length; i += 4) {
    let r = imageData.data[i];
    let g = imageData.data[i + 1];
    let b = imageData.data[i + 2];
    let count = 1;

    if (i % (4 * scaleWidth) !== 0) {
      r += imageData.data[i - 4];
      g += imageData.data[i - 4 + 1];
      b += imageData.data[i - 4 + 2];
      count++;
    }
    if (i >= 4 * scaleWidth) {
      r += imageData.data[i - 4 * scaleWidth];
      g += imageData.data[i - 4 * scaleWidth + 1];
      b += imageData.data[i - 4 * scaleWidth + 2];
      count++;
    }
    if (i !== 4 * (scaleWidth - 1)) {
      r += imageData.data[i + 4];
      g += imageData.data[i + 4 + 1];
      b += imageData.data[i + 4 + 2];
      count++;
    }
    if (i <= 4 * scaleWidth * (scaleHeight - 1)) {
      r += imageData.data[i - 4 * scaleWidth];
      g += imageData.data[i - 4 * scaleWidth + 1];
      b += imageData.data[i - 4 * scaleWidth + 2];
      count++;
    }
    data[i] = Math.floor(r / count);
    data[i + 1] = Math.floor(g / count);
    data[i + 2] = Math.floor(b / count);
  }
  const c = document.createElement('canvas');
  c.width = scaleWidth;
  c.height = scaleHeight;
  const ctx = c.getContext('2d');
  ctx?.putImageData(new ImageData(Uint8ClampedArray.from(data), scaleWidth, scaleHeight), 0, 0);
  console.log('avgend');
  return c.toDataURL('image/png');
};

const toGray = async (imageData: ImageData, scaleWidth?: number, scaleHeight?: number) => {
  scaleWidth = scaleWidth || imageData.width;
  scaleHeight = scaleHeight || imageData.height;
  const data = [];
  for (let w = 0; w < scaleWidth; w++) {
    for (let h = 0; h < scaleHeight; h++) {
      const index = (w + h * scaleWidth) * 4;
      const gray =
        0.299 * imageData.data[index] +
        0.587 * imageData.data[index + 1] +
        0.114 * imageData.data[index + 2];
      data[index] = gray;
      data[index + 1] = gray;
      data[index + 2] = gray;
      data[index + 3] = imageData.data[index + 3];
    }
  }
  return new ImageData(Uint8ClampedArray.from(data), scaleWidth, scaleHeight);
};

const chazhi = async (imageData: ImageData, scaleWidth: number, scaleHeight: number) => {
  console.log('chazhi');
  const data = [];
  const oldWidth = imageData.width;
  const oldHeight = imageData.height;
  const getVal = (x: number, y: number, z: number) => {
    if (x < 0 || x >= oldWidth || y < 0 || y >= oldHeight) {
      return 0;
    }
    return imageData.data[(x + y * oldWidth) * 4 + z];
  };
  for (let w = 0; w < scaleWidth; w++) {
    for (let h = 0; h < scaleHeight; h++) {
      const sx = (w * oldWidth) / scaleWidth;
      const sy = (h * oldHeight) / scaleHeight;
      const fx = Math.floor(sx);
      const fy = Math.floor(sy);
      const cx = Math.ceil(sx);
      const cy = Math.ceil(sy);
      const dx = fx - sx;
      const dy = fy - sy;
      for (let i = 0; i < 4; i++) {
        const index = (w + h * scaleWidth) * 4 + i;
        const a = getVal(cx, cy, i);
        const b = getVal(cx, fy, i);
        const c = getVal(fx, cy, i);
        const d = getVal(fx, fy, i);
        data[index] = Math.min(
          255,
          Math.max(
            0,
            Math.round(
              dx * dy * a + dx * (1 - dy) * b + (1 - dx) * dy * c + (1 - dx) * (1 - dy) * d,
            ),
          ),
        );
      }
    }
  }
  const c = document.createElement('canvas');
  c.width = scaleWidth;
  c.height = scaleHeight;
  const ctx = c.getContext('2d');
  ctx?.putImageData(new ImageData(Uint8ClampedArray.from(data), scaleWidth, scaleHeight), 0, 0);
  console.log('chazhiend');
  return c.toDataURL('image/png');
};

const ruihua = async (imageData: ImageData, scaleWidth: number, scaleHeight: number) => {
  console.log('ruihua');
  const rateList = [0, -1, 0, -1, 4, -1, 0, -1, 0];
  const data = [...imageData.data];
  for (let w = 0; w < scaleWidth; w++) {
    for (let h = 0; h < scaleHeight; h++) {
      for (let offset = 0; offset < 3; offset++) {
        const index = (w + h * scaleWidth) * 4 + offset;
        let sum = 0;
        for (let kw = 0; kw < 3; kw++) {
          for (let kh = 0; kh < 3; kh++) {
            const x = w + kw - 1;
            const y = h + kh - 1;
            if (x >= 0 && x < scaleWidth && y >= 0 && y < scaleHeight) {
              const index1 = (x + y * scaleWidth) * 4 + offset;
              sum += rateList[kw * 3 + kh] * imageData.data[index1];
            }
          }
        }
        data[index] = Math.min(Math.max(data[index] + sum, 0), 255);
      }
    }
  }

  const c = document.createElement('canvas');
  c.width = scaleWidth;
  c.height = scaleHeight;
  const ctx = c.getContext('2d');
  ctx?.putImageData(new ImageData(Uint8ClampedArray.from(data), scaleWidth, scaleHeight), 0, 0);
  console.log('ruihuaend');
  return c.toDataURL('image/png');
};

const medianFilter = async (imageData: ImageData, kernelSize = 3) => {
  const { width, height, data } = imageData;
  const output = new Uint8ClampedArray(data.length);
  const halfKernel = Math.floor(kernelSize / 2);

  // 遍历每个像素（跳过边缘）
  for (let y = halfKernel; y < height - halfKernel; y++) {
    for (let x = halfKernel; x < width - halfKernel; x++) {
      const idx = (y * width + x) * 4;
      const neighbors = [];

      // 收集邻域像素
      for (let ky = -halfKernel; ky <= halfKernel; ky++) {
        for (let kx = -halfKernel; kx <= halfKernel; kx++) {
          const kidx = ((y + ky) * width + (x + kx)) * 4;
          const r = data[kidx];
          const g = data[kidx + 1];
          const b = data[kidx + 2];
          neighbors.push({
            rgb: [r, g, b],
            gray: 0.299 * r + 0.587 * g + 0.114 * b,
          }); // R通道（灰度图适用）
        }
      }

      // 排序取中值
      neighbors.sort((a, b) => a.gray - b.gray);
      const median = neighbors[Math.floor(neighbors.length / 2)];

      // 更新输出（处理RGBA四通道）
      for (let c = 0; c < 4; c++) {
        output[idx + c] = c === 3 ? data[idx + 3] : median.rgb[c]; // 保留Alpha通道
      }
    }
  }
  return new ImageData(output, width, height);
};

const sleep = (ms = 0) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, ms);
  });
};
const nextAsync = sleep;
const onFileChange = (e: any) => {
  outputSrc.value = [];
  selected.value = [];
  const file: File = e.target.files[0];
  if (file && file.type.startsWith('image/')) {
    const img = new Image();
    img.onload = async () => {
      const width = img.width;
      const height = img.height;
      imgWidth.value = Math.max(width, 400);
      currWidth.value = Math.min(width, 100);
      offsetCanvas.width = width;
      offsetCanvas.height = height;
      offsetCtx!.imageSmoothingEnabled = true;
      offsetCtx!.imageSmoothingQuality = 'high';
      offsetCtx?.drawImage(img, 0, 0, width, height);
      outputSrc.value.push({ src: offsetCanvas.toDataURL('image/png'), time: 0, title: '源' });
      const imageData = offsetCtx?.getImageData(0, 0, width, height);
      base64.value = offsetCanvas.toDataURL('image/png');
      if (imageData) {
        let time = Date.now();
        let res = await avgFn(imageData, width, height);
        outputSrc.value.push({ src: res, time: Date.now() - time, title: '上下左右平均' });
        await nextAsync();
        time = Date.now();
        res = await ruihua(imageData, width, height);
        outputSrc.value.push({ src: res, time: Date.now() - time, title: '锐化' });
        await nextAsync();
        time = Date.now();
        res = await chazhi(imageData, Math.floor(width * 1.5), Math.floor(height * 1.5));
        outputSrc.value.push({ src: res, time: Date.now() - time, title: '插值' });
        await nextAsync();

        time = Date.now();
        const mediaImageData = await medianFilter(imageData);
        res = await imgDataToUrl(mediaImageData);
        outputSrc.value.push({ src: res, time: Date.now() - time, title: '中值滤波' });
        res = await ruihua(mediaImageData, mediaImageData.width, mediaImageData.height);
        outputSrc.value.push({ src: res, time: Date.now() - time, title: '中值滤波+锐化' });
        await nextAsync();
        // time = Date.now();
        // const pinpu = await getPinPu(imageData);
        // res = await imgDataToUrl(pinpu.imageData);
        // outputSrc.value.push({ src: res, time: Date.now() - time, title: '频谱' });

        time = Date.now();
        const pinpu1 = await computeSpectrum(imageData);
        res = await imgDataToUrl(pinpu1);
        outputSrc.value.push({ src: res, time: Date.now() - time, title: '频谱1' });
        await nextAsync();

        time = Date.now();
        const gaussian = await denoiseImageByImageData(imageData);
        res = await imgDataToUrl(gaussian);
        outputSrc.value.push({ src: res, time: Date.now() - time, title: '高斯滤波器' });
        await nextAsync();

        time = Date.now();
        const ideal = await denoiseImageByImageData(imageData, { type: 'ideal' });
        res = await imgDataToUrl(ideal);
        outputSrc.value.push({ src: res, time: Date.now() - time, title: 'ideal' });
        await nextAsync();

        time = Date.now();
        const grayImgData = await toGray(imageData);
        res = await imgDataToUrl(grayImgData);
        outputSrc.value.push({ src: res, time: Date.now() - time, title: '灰度' });
        const grayMediaImageData = await medianFilter(grayImgData);
        res = await imgDataToUrl(grayMediaImageData);
        outputSrc.value.push({ src: res, time: Date.now() - time, title: '灰度+中值滤波' });
        await nextAsync();

        time = Date.now();
        const checkImgData = await checkInverse(grayImgData);
        res = await imgDataToUrl(checkImgData);
        outputSrc.value.push({ src: res, time: Date.now() - time, title: '校验逆向' });
        await nextAsync();

        time = Date.now();
        const bbImageData = await BBcolor(imageData);
        res = await imgDataToUrl(bbImageData);
        outputSrc.value.push({ src: res, time: Date.now() - time, title: '双边滤波' });

        // await nextAsync();
        // time = Date.now();
        // const p4 = await nonLocalMeansColor(imageData);
        // res = await imgDataToUrl(p4.imageData);
        // outputSrc.value.push({ src: res, time: Date.now() - time, title: '非局部均值滤波' });
        // res = await ruihua(p4.imageData, p4.width, p4.height);
        // outputSrc.value.push({ src: res, time: Date.now() - time, title: '非局部均值滤波 + 锐化' });
      }
    };
    img.src = URL.createObjectURL(file);
  }
};
const toggleImgSelect = (
  {
    i,
  }: {
    item: {
      src: string;
      title: string;
      time: number;
    };
    i: number;
  },
  checked: boolean,
) => {
  const index = selected.value.indexOf(i);
  if (checked) {
    if (index === -1) {
      selected.value.push(i);
    }
  } else if (i > -1) {
    selected.value.splice(index, 1);
  }
};
const comparision = () => {
  showModal.value = true;
};
</script>
<style scoped lang="scss">
.img-hd {
  img {
    width: var(--img-width);
  }
}
.img-hd-item {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 10px;
  font-size: 12px;
  color: #666;
  img {
    height: auto;
    max-width: 100%;
    max-height: 100%;
  }
}
</style>
<style module lang="scss">
.comparision-modal {
  color: #fff;
  :global {
    .mj-modal-scroll .mj-modal-wrapper .mj-modal {
      background-color: transparent !important;
      .mj-modal-header {
        border: none !important;
        .mj-modal-close-btn {
          color: #fff !important;
          font-size: 24px !important;
          width: 1em !important;
          flex: 0 0 1em !important;
          .mj-modal-close-hover {
            width: 1em !important;
            height: 1em !important;
            &:hover {
              color: #000;
            }
          }
        }
        .mj-modal-title {
          color: #fff !important;
          font-size: 24px !important;
        }
      }
    }
  }
}
</style>
