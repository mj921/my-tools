<template>
  <div class="draw-circle">
    <div class="draw-circle-container">
      <div class="draw-circle-status-bar">
        <span>{{ radiusIndex + 1 }} / 5</span><span>{{ Math.floor(avgScore) }}</span>
      </div>
      <canvas ref="canvas" width="400" height="400"></canvas>
      <div class="draw-circle-dialog" v-show="dialogVisible">
        <div class="draw-circle-score-curr">{{ (scores[radiusIndex] || 0).toFixed(2) }}</div>
        <div class="draw-circle-pi">π={{ pis[radiusIndex] }}</div>
        <div class="draw-circle-message" :style="{ opacity: isError ? 1 : 0 }">这根本不是圆！</div>
        <mj-button type="primary" status="danger" @click="nextInit">{{
          isError ? '重画' : radiusIndex === 4 ? '再来一次' : '下一个'
        }}</mj-button>
      </div>
    </div>
    <div class="draw-circle-record">
      <mj-tabs default-active-key="score">
        <mj-tab-panel title="分数" key="score">
          <mj-table :columns="scoreColumns" :data="historyRecord.score" />
        </mj-tab-panel>
        <mj-tab-panel title="π" key="pi">
          <mj-table :columns="piColumns" :data="historyRecord.pi" />
        </mj-tab-panel>
        <mj-tab-panel title="单次分数" key="maxScore">
          <mj-table :columns="maxColumns" :data="historyRecord.maxScore" />
        </mj-tab-panel>
      </mj-tabs>
    </div>
  </div>
</template>
<script lang="ts" setup>
import MjButton from '@/components/MjButton/MjButton.vue';
import message from '@/components/MjMessage';
import MjTable from '@/components/MjTable/MjTable.vue';
import type { MjTableColumnProp } from '@/components/MjTable/interface';
import MjTabs from '@/components/MjTabs';
import BinaryWriter from '@/lib/saver/BinaryWriter';
import { sleep } from '@/utils';
import { dateFmt } from '@/utils/date';
import { computed, h, onMounted, ref } from 'vue';

const MjTabPanel = MjTabs.Panel;

interface Point {
  x: number;
  y: number;
}

type RecordItem = { pi?: number; time: number; score: number; max?: number; min?: number };

type HistoryRecord = Record<'pi' | 'score' | 'maxScore', RecordItem[]>;

const avgEvaluate: [number, string][] = [
  [95, '画圆大神'],
  [90, '画圆大师'],
  [85, '画圆大王'],
  [80, '画圆高手'],
  [75, '平均水平'],
  [70, '低于平均'],
];
const scoreColor: [number, string][] = [
  [95, '#f00'],
  [90, '#ffa500'],
  [85, '#ae00ff'],
  [80, '#0085ff'],
  [75, '#26ef26'],
  [70, '#000'],
];

const getEvaluate = (val: number) => {
  for (let i = 0; i < avgEvaluate.length; i++) {
    if (val >= avgEvaluate[i][0]) {
      return avgEvaluate[i][1];
    }
  }
  return '这是圆吗';
};

const getColor = (val: number) => {
  for (let i = 0; i < scoreColor.length; i++) {
    if (val >= scoreColor[i][0]) {
      return scoreColor[i][1];
    }
  }
  return '#000';
};

const historyRecord = ref<HistoryRecord>({
  pi: [],
  score: [],
  maxScore: [],
});

const read = () => {
  const str = localStorage.getItem('game-drawcircle') || '';
  if (!str) return;
  const reader = new BinaryWriter('Read', 1);
  reader.setRawData(str);
  const record: HistoryRecord = {
    pi: [],
    score: [],
    maxScore: [],
  };
  const keys: (keyof HistoryRecord)[] = ['pi', 'score', 'maxScore'];
  keys.forEach((key) => {
    record[key] = reader.readArray((reader1: BinaryWriter) => {
      const obj: RecordItem = { pi: 0, time: 0, score: 0, max: 0, min: 0 };
      (
        (key === 'score'
          ? ['time', 'score', 'max', 'min']
          : ['score', 'pi', 'time']) as (keyof RecordItem)[]
      ).forEach((k) => {
        if (k === 'time') {
          obj[k] = Number(reader1.readBigUint64());
        } else {
          obj[k] = reader1.readFloat64();
        }
      });
      return obj;
    });
  });
  historyRecord.value = record;
};
const write = () => {
  const writer = new BinaryWriter('Write', 10000);
  const keys: (keyof HistoryRecord)[] = ['pi', 'score', 'maxScore'];
  keys.forEach((key) => {
    writer.writeArray([...historyRecord.value[key]], (obj: RecordItem, writer1: BinaryWriter) => {
      (
        (key === 'score'
          ? ['time', 'score', 'max', 'min']
          : ['score', 'pi', 'time']) as (keyof RecordItem)[]
      ).forEach((k) => {
        if (k === 'time') {
          writer1.writeBigUInt64(BigInt(obj[k]));
        } else {
          writer1.writeFloat64(obj[k]!);
        }
      });
    });
  });
  localStorage.setItem('game-drawcircle', writer.getRawDataStr());
};

const columnMap: Record<string, MjTableColumnProp<RecordItem>> = {
  pi: {
    name: 'pi',
    title: 'π',
    align: 'center',
    formatter: (val: number) => val.toFixed(7),
  },
  time: {
    name: 'time',
    title: '日期',
    formatter: (val: number) => dateFmt('YYYY-MM-DD HH:mm:ss', new Date(val)),
    width: 200,
    align: 'center',
  },
  score: {
    name: 'score',
    title: '得分',
    align: 'center',
    render: ({ value }: { value: number }) =>
      h('span', { style: { color: getColor(value) } }, [value.toFixed(2)]),
  },
  max: {
    name: 'max',
    title: '最佳得分',
    width: 100,
    align: 'center',
    render: ({ value }: { value: number }) =>
      h('span', { style: { color: getColor(value) } }, [value.toFixed(2)]),
  },
  min: {
    name: 'min',
    title: '最差得分',
    width: 100,
    align: 'center',
    render: ({ value }: { value: number }) =>
      h('span', { style: { color: getColor(value) } }, [value.toFixed(2)]),
  },
};

const piColumns = (['pi', 'time', 'score'] as (keyof RecordItem)[]).map((key) => columnMap[key]);
const scoreColumns = (['score', 'time', 'max', 'min'] as (keyof RecordItem)[]).map(
  (key) => columnMap[key],
);
const maxColumns = (['score', 'time', 'pi'] as (keyof RecordItem)[]).map((key) => columnMap[key]);

const canvasWidth = 400;
const totalVerifyingLines = 180;
const centerPoint = {
  x: canvasWidth / 2,
  y: canvasWidth / 2,
};
const radiusList = [60, 70, 80, 90, 100];

const canvas = ref<HTMLCanvasElement>();
const ctx = ref<CanvasRenderingContext2D>();
const points = ref<{ x: number; y: number }[]>([]);
const radiusIndex = ref(0);
const isDown = ref(false);
const canDraw = ref(true);
const dialogVisible = ref(false);
const isError = ref(false);
const scores = ref<number[]>([]);
const pis = ref<number[]>([]);
const canvasBcr = ref<{ left: number; top: number }>({
  left: 0,
  top: 0,
});

const intersect = (
  startX: number,
  startY: number,
  endX: number,
  endY: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
) => {
  if ((startX === endX && startY === endY) || (x1 === x2 && y1 === y2)) return false;
  /** 分母 */
  let denominator = 0;
  denominator = (y2 - y1) * (endX - startX) - (x2 - x1) * (endY - startY);
  if (denominator === 0) {
    return false;
  }
  let d = ((x2 - x1) * (startY - y1) - (y2 - y1) * (startX - x1)) / denominator,
    l = ((endX - startX) * (startY - y1) - (endY - startY) * (startX - x1)) / denominator;
  if (!(d < 0 || d > 1 || l < 0 || l > 1)) {
    return {
      x: startX + d * (endX - startX),
      y: startY + d * (endY - startY),
    };
  }
  return false;
};
const getDistance = (p1: Point, p2: Point) => {
  var dx = p1.x - p2.x,
    dy = p1.y - p2.y;
  return Math.sqrt(dx * dx + dy * dy);
};
const calculateError = async (diffPoints: (Point | null)[][], radius: number, len: number) => {
  let t = 0;
  for (let i = 0; i < diffPoints.length; i++) {
    const item = diffPoints[i];
    if (item[0] && item[1]) {
      t += getDistance(item[0], item[1]) / (radius / 2);
    }
  }
  const currentScore = 100 - (t / diffPoints.length) * 100;
  scores.value.push(Number(currentScore));
  if (ctx.value) {
    let i = 0;
    const drawLine = async () => {
      const el = diffPoints[i];
      if (el[0]) {
        const [cPoint, dPoint] = el as Point[];
        ctx.value!.strokeStyle = 'black';
        ctx.value!.beginPath();
        ctx.value!.moveTo(cPoint.x, cPoint.y);
        ctx.value!.lineTo(dPoint.x, dPoint.y);
        ctx.value!.stroke();
      } else {
        const [, cPoint, dPoint] = el as Point[];
        ctx.value!.strokeStyle = 'red';
        ctx.value!.beginPath();
        ctx.value!.moveTo(cPoint.x, cPoint.y);
        ctx.value!.lineTo(dPoint.x, dPoint.y);
        ctx.value!.stroke();
      }
      i++;
      if (i < diffPoints.length) {
        await sleep(16);
        await drawLine();
      }
    };
    await drawLine();
    ctx.value.strokeStyle = 'red';
  }
};

const avgScore = computed(() =>
  scores.value.length > 0
    ? scores.value.reduce((prev, el) => prev + el, 0) / scores.value.length
    : 0,
);

const findDifferences = async () => {
  const maxRadius = canvasWidth / 2;
  const radius = radiusList[radiusIndex.value];
  let i = 130;
  const n = 360 / totalVerifyingLines;
  const diffPoints: (Point | null)[][] = [];
  isError.value = false;
  for (; -230 !== i; ) {
    const xRatio = Math.sin(i * (Math.PI / 180)),
      yRatio = Math.cos(i * (Math.PI / 180)),
      maxCx = centerPoint.x + maxRadius * xRatio,
      maxCy = centerPoint.y + maxRadius * yRatio,
      cx = centerPoint.x + radius * xRatio,
      cy = centerPoint.y + radius * yRatio;
    let flag = true;
    for (let ti = 0; ti < points.value.length; ti++) {
      const el = points.value[ti],
        nextEl = points.value[ti === points.value.length - 1 ? 0 : ti + 1],
        n = intersect(centerPoint.x, centerPoint.y, maxCx, maxCy, el.x, el.y, nextEl.x, nextEl.y);
      if (n) {
        flag = false;
        diffPoints.push([
          { x: cx, y: cy },
          { x: n.x, y: n.y },
        ]);
        break;
      }
    }
    if (flag) {
      isError.value = true;
      diffPoints.push([null, { ...centerPoint }, { x: maxCx, y: maxCy }]);
    }
    i -= n;
  }
  await calculateError(diffPoints, radius, 180);
};

const calcPI = (e = 5) => {
  let n = [points.value[0]];
  for (let o = 1; o < points.value.length; o++) {
    if (getDistance(n[n.length - 1], points.value[o]) > e) {
      n.push(points.value[o]);
    }
  }
  let perimeter = 0;
  for (let t = 0; t < n.length - 1; t++) perimeter += getDistance(n[t], n[t + 1]);
  perimeter += getDistance(n[n.length - 1], n[0]);
  let maxDiameter = 0;
  for (let t = 0; t < n.length; t++)
    for (let e = t + 1; e < n.length; e++) {
      const o = getDistance(n[t], n[e]);
      if (o > maxDiameter) maxDiameter = o;
    }
  return perimeter / maxDiameter;
};
const init = () => {
  if (ctx.value) {
    const r = radiusList[radiusIndex.value];
    points.value = [];
    ctx.value.clearRect(0, 0, canvasWidth, canvasWidth);
    ctx.value.beginPath();
    ctx.value.arc(canvasWidth / 2, canvasWidth / 2, 5, 0, Math.PI * 2);
    ctx.value.fillStyle = 'gray';
    ctx.value.fill();
    ctx.value.beginPath();
    ctx.value.moveTo(canvasWidth / 2, canvasWidth / 2);
    ctx.value.lineTo(
      canvasWidth / 2 + Math.cos((Math.PI / 180) * 310) * r,
      canvasWidth / 2 + Math.sin((Math.PI / 180) * 310) * r,
    );
    ctx.value.strokeStyle = 'green';
    ctx.value.lineWidth = 2;
    ctx.value.stroke();
    ctx.value.lineWidth = 1;
    ctx.value.strokeStyle = 'red';
  }
};
const restart = () => {
  dialogVisible.value = false;
  radiusIndex.value = 0;
  scores.value = [];
  pis.value = [];
  init();
};
const nextInit = () => {
  if (radiusIndex.value < 4) {
    if (!isError.value) {
      radiusIndex.value++;
    }
    dialogVisible.value = false;
    init();
  } else {
    restart();
  }
};
const onMouseDown = (e: MouseEvent) => {
  if (canDraw.value) {
    isDown.value = true;
    canDraw.value = false;
    points.value.push({
      x: e.clientX - canvasBcr.value.left,
      y: e.clientY - canvasBcr.value.top,
    });
  }
};
const onMouseMove = (e: MouseEvent) => {
  if (isDown.value) {
    const lastPoint = points.value[points.value.length - 1];
    const newPoint = {
      x: e.clientX - canvasBcr.value.left + Math.random() * 0.01 * (Math.random() > 0.5 ? 1 : -1),
      y: e.clientY - canvasBcr.value.top + Math.random() * 0.01 * (Math.random() > 0.5 ? 1 : -1),
    };
    const d = Math.sqrt(
      (lastPoint.x - newPoint.x) * (lastPoint.x - newPoint.x) +
        (lastPoint.y - newPoint.y) * (lastPoint.y - newPoint.y),
    );
    if (d > 0) {
      points.value.push(newPoint);
      ctx.value!.beginPath();
      ctx.value!.moveTo(lastPoint.x, lastPoint.y);
      ctx.value!.lineTo(newPoint.x, newPoint.y);
      ctx.value!.stroke();
    }
  }
};
const finish = () => {
  message.success(`${getEvaluate(avgScore.value)}`);
  const max = Math.max(...scores.value);
  const min = Math.min(...scores.value);
  const time = Date.now();
  historyRecord.value.pi.push(
    ...pis.value.map((el, i) => ({
      pi: el,
      time,
      score: scores.value[i],
    })),
  );
  historyRecord.value.pi.sort((a, b) =>
    b.pi === a.pi ? a.time - b.time : Math.abs(a.pi! - Math.PI) - Math.abs(b.pi! - Math.PI),
  );
  historyRecord.value.pi = historyRecord.value.pi.slice(0, 10);
  historyRecord.value.score.push({
    time,
    score: avgScore.value,
    max,
    min,
  });
  historyRecord.value.score.sort((a, b) =>
    b.score === a.score ? a.time - b.time : b.score - a.score,
  );
  historyRecord.value.score = historyRecord.value.score.slice(0, 10);
  historyRecord.value.maxScore.push(
    ...pis.value.map((el, i) => ({
      pi: el,
      time,
      score: scores.value[i],
    })),
  );
  historyRecord.value.maxScore.sort((a, b) =>
    b.score === a.score ? a.time - b.time : b.score - a.score,
  );
  historyRecord.value.maxScore = historyRecord.value.maxScore.slice(0, 10);
  write();
};
const onMouseUp = async () => {
  if (isDown.value) {
    isDown.value = false;
    const lastPoint = points.value[points.value.length - 1];
    const newPoint = points.value[0];
    ctx.value!.beginPath();
    ctx.value!.moveTo(lastPoint.x, lastPoint.y);
    ctx.value!.lineTo(newPoint.x, newPoint.y);
    ctx.value!.stroke();
    ctx.value!.beginPath();
    ctx.value!.strokeStyle = 'black';
    ctx.value!.arc(canvasWidth / 2, canvasWidth / 2, radiusList[radiusIndex.value], 0, Math.PI * 2);
    ctx.value!.stroke();
    ctx.value!.strokeStyle = 'red';
    await findDifferences();
    canDraw.value = true;
    if (!isError.value) {
      const PI = calcPI();
      pis.value.push(PI);
      if (radiusIndex.value === 4) {
        finish();
      }
    }
    dialogVisible.value = true;
  }
};
read();
onMounted(() => {
  ctx.value = canvas.value?.getContext('2d')!;
  canvasBcr.value = canvas.value?.getBoundingClientRect()!;
  canvas.value!.addEventListener('mousedown', onMouseDown);
  window.addEventListener('mousemove', onMouseMove);
  window.addEventListener('mouseup', onMouseUp);
  init();
});
</script>
<style scoped lang="scss">
.draw-circle {
  width: 100vw;
  height: 100vh;
  position: relative;
  .draw-circle-container {
    position: absolute;
    width: 404px;
    height: 440px;
    left: 50%;
    top: 0;
    transform: translate(-50%);
    .draw-circle-status-bar {
      display: flex;
      justify-content: space-between;
      line-height: 36px;
    }
    canvas {
      box-sizing: content-box;
      border: 2px solid gray;
    }
    .draw-circle-dialog {
      position: absolute;
      left: 0;
      top: 36px;
      width: 404px;
      height: 404px;
      text-align: center;
      box-sizing: border-box;
      padding-top: 16px;
      .draw-circle-score-curr {
        font-size: 32px;
        line-height: 36px;
        height: 36px;
        margin-bottom: 8px;
      }
      .draw-circle-pi {
        font-size: 32px;
        line-height: 36px;
        height: 36px;
        color: red;
      }
      .draw-circle-message {
        margin-top: 196px;
        font-size: 32px;
        line-height: 36px;
        color: red;
        height: 36px;
      }
      .mj-btn {
        margin-top: 8px;
      }
    }
  }
  .draw-circle-record {
    padding-top: 480px;
    width: 600px;
    margin: 0 auto;
  }
  .mj-table {
    margin-top: 8px;
  }
}
</style>
