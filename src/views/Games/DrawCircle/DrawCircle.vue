<template>
  <div class="draw-circle">
    <div class="draw-circle-container">
      <div class="draw-circle-status-bar">
        <span>{{ radiusIndex + 1 }} / 5</span><span>{{ Math.floor(avgScore) }}</span>
      </div>
      <canvas ref="canvas" width="400" height="400"></canvas>
      <div class="draw-circle-dialog" v-show="dialogVisible">
        <div class="draw-circle-score-curr">{{ scores[radiusIndex] }}</div>
        <div class="draw-circle-pi">π={{ pis[radiusIndex] }}</div>
        <div class="draw-circle-message" :style="{ opacity: isError ? 1 : 0 }">这根本不是圆！</div>
        <mj-button type="primary" status="danger" @click="nextInit">{{
          isError ? '重画' : radiusIndex === 4 ? '查看分数' : '下一个'
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
import MjTable from '@/components/MjTable/MjTable.vue';
import type { MjTableColumnProp } from '@/components/MjTable/interface';
import MjTabs from '@/components/MjTabs';
import BinaryWriter from '@/lib/saver/BinaryWriter';
import { dateFmt } from '@/utils/date';
import { computed, onMounted, ref } from 'vue';

const MjTabPanel = MjTabs.Panel;

interface Point {
  x: number;
  y: number;
}

type RecordItem = { pi?: number; time: number; score: number; max?: number; min?: number };

type HistoryRecord = Record<'pi' | 'score' | 'maxScore', RecordItem[]>;

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

const columnMap: Record<string, MjTableColumnProp> = {
  pi: {
    name: 'pi',
    label: 'π',
    align: 'center',
  },
  time: {
    name: 'time',
    label: '日期',
    formatter: (val: number) => dateFmt('YYYY-MM-DD HH:mm:ss', new Date(val)),
    width: 200,
    align: 'center',
  },
  score: {
    name: 'score',
    label: '得分',
    align: 'center',
  },
  max: {
    name: 'max',
    label: '最佳得分',
    width: 100,
    align: 'center',
  },
  min: {
    name: 'min',
    label: '最差得分',
    width: 100,
    align: 'center',
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
  if (denominator === 0) return false;
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
const calculateError = (diffPoints: Point[][], radius: number) => {
  let t = 0;
  for (let i = 0; i < diffPoints.length; i++) {
    const item = diffPoints[i];
    t += getDistance(item[0], item[1]) / (radius / 2);
  }
  const currentScore = (100 - (t / diffPoints.length) * 100).toFixed(2);
  scores.value.push(Number(currentScore));
  if (ctx.value) {
    ctx.value.strokeStyle = 'black';
    diffPoints.forEach(([cPoint, dPoint]) => {
      ctx.value!.beginPath();
      ctx.value!.moveTo(cPoint.x, cPoint.y);
      ctx.value!.lineTo(dPoint.x, dPoint.y);
      ctx.value!.stroke();
    });
    ctx.value.strokeStyle = 'red';
  }
};

const avgScore = computed(() =>
  scores.value.length > 0
    ? scores.value.reduce((prev, el) => prev + el, 0) / scores.value.length
    : 0,
);

const findDifferences = () => {
  const maxRadius = canvasWidth / 2;
  const radius = radiusList[radiusIndex.value];
  let i = 130;
  const n = 360 / totalVerifyingLines;
  const diffPoints: Point[][] = [];
  isError.value = false;
  for (; -230 !== i; ) {
    const xRatio = Math.sin(i * (Math.PI / 180)),
      yRatio = Math.cos(i * (Math.PI / 180)),
      maxCx = centerPoint.x + maxRadius * xRatio,
      maxCy = centerPoint.y + maxRadius * yRatio,
      cx = centerPoint.x + radius * xRatio,
      cy = centerPoint.y + radius * yRatio;
    let flag = true;
    for (let ti = 0; ti < points.value.length - 1; ti++) {
      const el = points.value[ti],
        nextEl = points.value[ti + 1],
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
      return;
    }
    i -= n;
  }
  calculateError(diffPoints, radius);
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
const nextInit = () => {
  if (radiusIndex.value < 4) {
    if (!isError.value) {
      radiusIndex.value++;
    }
    dialogVisible.value = false;
    init();
  }
};
const onMouseDown = (e: MouseEvent) => {
  isDown.value = true;
  points.value.push({
    x: e.clientX - canvasBcr.value.left,
    y: e.clientY - canvasBcr.value.top,
  });
};
const onMouseMove = (e: MouseEvent) => {
  if (isDown.value) {
    const lastPoint = points.value[points.value.length - 1];
    const newPoint = {
      x: e.clientX - canvasBcr.value.left,
      y: e.clientY - canvasBcr.value.top,
    };
    if (Math.sqrt((lastPoint.x - newPoint.x) ** 2 + (lastPoint.y - newPoint.y) ** 2) > 2) {
      points.value.push(newPoint);
      ctx.value!.beginPath();
      ctx.value!.moveTo(lastPoint.x, lastPoint.y);
      ctx.value!.lineTo(newPoint.x, newPoint.y);
      ctx.value!.stroke();
    }
  }
};
const finish = () => {
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
const onMouseUp = () => {
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
    findDifferences();
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
