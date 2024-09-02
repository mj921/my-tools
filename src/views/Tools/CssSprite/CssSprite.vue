<template>
  <div class="css-sprite">
    <input type="file" multiple @change="fileChange" ref="uploadRef" />
    <input type="number" v-model="splitNum" />
    <div class="preview-imgs" ref="imgsRef"></div>
    <mj-tabs default-active-key="img">
      <mj-tab-panel title="图片" key="img">
        <div class="canvas-box" ref="canvasBox"></div>
      </mj-tab-panel>
      <mj-tab-panel title="css" key="css">
        <pre>{{ cssContent }}</pre>
        <!-- <textarea cols="100" rows="30" v-model="cssContent" readonly></textarea> -->
      </mj-tab-panel>
      <mj-tab-panel title="css模板" key="temp">
        <textarea cols="100" rows="6" v-model="temp" @change="tempChange"></textarea>
      </mj-tab-panel>
      <mj-tab-panel title="下载" key="download">
        <div ref="downloadRef" class="downloads"></div>
      </mj-tab-panel>
    </mj-tabs>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import MjTabs from '@/components/MjTabs';

const MjTabPanel = MjTabs.Panel;

const uploadRef = ref();
const downloadRef = ref();
const imgsRef = ref();
const canvasBox = ref();
const offset = ref(0);
const splitNum = ref(9);
const temp = ref(
  localStorage.getItem('cssSpriteTemp') ||
    `.<%=name%> {
  background: url(./css_sprites<%=num%>.png) <%=size%>px -<%=x%>px -<%=y%>px no-repeat;
  width: <%=w%>px;
  height: <%=h%>px;
}`,
);

const cssContent = ref('');

const tempChange = () => {
  localStorage.setItem('cssSpriteTemp', temp.value);
};

const imgs = ref<
  { src: string; name: string; width: number; height: number; size: number; el: HTMLImageElement }[]
>([]);
const num = ref(0);
const generateCssSpriteChild = (
  list: {
    src: string;
    name: string;
    width: number;
    height: number;
    size: number;
    el: HTMLImageElement;
  }[],
  index: number,
) => {
  const canvas = document.createElement('canvas');
  canvasBox.value.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  const hArr: number[] = [];
  let cw = offset.value;
  list.forEach((el) => {
    hArr.push(el.height);
    cw += el.width + offset.value;
  });
  const ch = Math.max(...hArr) + offset.value * 2;
  canvas.width = cw;
  canvas.height = ch;
  let left = offset.value;
  list.forEach((el) => {
    ctx!.drawImage(el.el, left, offset.value);
    const ns = el.name.split('.');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const map = {
      x: left,
      y: offset.value,
      w: el.width,
      h: el.height,
      name: ns.slice(0, ns.length - 1).join('_'),
      num: index,
      size: cw,
    };
    cssContent.value +=
      temp.value.replace(/<%=([^%]+)%>/g, ($0, $1) => {
        return eval($1.replace(/(x|y|w|h|name|num|size)/g, 'map.$1'));
      }) + '\n';
    left += el.width + offset.value;
  });
  const a = document.createElement('a');
  a.innerText = `css_sprite${index}.png`;
  a.href = canvas.toDataURL();
  a.download = `css_sprite${index}.png`;
  downloadRef.value.appendChild(a);
};
const generateCssSprite = () => {
  canvasBox.value.innerHTML = '';
  downloadRef.value.innerHTML = '';
  let num = 1;
  for (let i = 0; i < imgs.value.length; i += splitNum.value) {
    generateCssSpriteChild(
      imgs.value.slice(i, Math.min(i + splitNum.value, imgs.value.length)),
      num++,
    );
  }
};
const fileChange = () => {
  const list = Array.from<File>(uploadRef.value.files || []);
  const startIndex = imgs.value.length;
  list.forEach((file: File, index: number) => {
    const render = new FileReader();
    render.readAsDataURL(file);
    render.onload = () => {
      if (render.result) {
        const img = document.createElement('img');
        imgs.value.push({
          src: render.result.toString(),
          el: img,
          name: file.name,
          width: 0,
          height: 0,
          size: file.size,
        });
        img.onload = () => {
          imgs.value[startIndex + index].width = img.width;
          imgs.value[startIndex + index].height = img.height;
          imgsRef.value.appendChild(img);
          num.value++;
          if (num.value === list.length) {
            console.log(num.value, imgs.value.length);
            generateCssSprite();
          }
        };
        img.src = render.result.toString();
      }
    };
  });
};
</script>

<style scoped lang="scss">
.css-sprite {
  .preview-imgs {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    max-height: 40vh;
    overflow: auto;
    :deep img {
      width: 100px;
      height: 100px;
      object-fit: cover;
    }
  }
  .css-sprite-tab {
    display: flex;
    dl {
      padding: 4px 8px;
    }
  }
  .canvas-box {
    width: 100vw;
    overflow: auto;
    max-height: 40vh;
    overflow: auto;
  }
  .downloads {
    :deep a {
      display: block;
    }
  }
}
.asdasd {
  padding: 20px;
}
</style>
