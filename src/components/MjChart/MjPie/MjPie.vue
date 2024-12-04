<template>
  <div class="mj-chart mj-chart-pie">
    <canvas ref="chartRef"></canvas>
  </div>
</template>
<script lang="ts" setup>
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
import type { MjChartPieProps } from '../interface';
import PieChart from '@/lib/charts/PieChart';

const chartRef = ref<HTMLCanvasElement>();
const props = withDefaults(defineProps<MjChartPieProps>(), {
  radius: '75%',
  startAngle: 90,
});

const pieChart = ref<PieChart | null>(null);

const render = () => {
  if (chartRef.value) {
    if (!pieChart.value) {
      pieChart.value = new PieChart(chartRef.value);
      pieChart.value.setOption({
        radius: props.radius,
        startAngle: props.startAngle,
        endAngle: props.endAngle,
        data: props.data,
      });
    } else {
      pieChart.value.render();
    }
  }
};

watch(
  [props],
  () => {
    render();
  },
  {
    immediate: false,
  },
);

const resizeObserver = ref<ResizeObserver>(
  new ResizeObserver(() => {
    render();
  }),
);

onMounted(() => {
  if (chartRef.value) {
    resizeObserver.value.observe(chartRef.value);
  }
});
onBeforeUnmount(() => {
  resizeObserver.value.disconnect();
});
</script>
<style lang="scss">
.mj-chart {
  width: 100%;
  height: 100%;
  canvas {
    width: 100%;
    height: 100%;
    display: block;
  }
}
</style>
