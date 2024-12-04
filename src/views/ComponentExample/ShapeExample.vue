<template>
  <div></div>
</template>
<script lang="ts" setup>
import {
  PolygonShape,
  RectShape,
  RingShape,
  ShapeRender,
  StarShape,
  StarShapeOld,
} from '@/lib/canvas';
import { onMounted } from 'vue';

onMounted(() => {
  const render = new ShapeRender({
    width: window.innerWidth,
    height: window.innerHeight,
    dpr: window.devicePixelRatio,
  });
  const star = new StarShape({
    x: 100 * window.devicePixelRatio,
    y: 100 * window.devicePixelRatio,
    width: 100 * window.devicePixelRatio,
    height: 200 * window.devicePixelRatio,
    fillColor: '#ff0000',
    innerRadius: 0.1,
  });
  render.addShape(star);
  const star1 = new StarShape({
    x: 100 * window.devicePixelRatio,
    y: 300 * window.devicePixelRatio,
    width: 100 * window.devicePixelRatio,
    height: 100 * window.devicePixelRatio,
    fillColor: '#ff0000',
    // innerRadius: 0.1,
    corners: 5,
  });
  render.addShape(star1);
  const star2 = new StarShape({
    x: 100 * window.devicePixelRatio,
    y: 400 * window.devicePixelRatio,
    width: 100 * window.devicePixelRatio,
    height: 100 * window.devicePixelRatio,
    fillColor: '#ff0000',
    // innerRadius: 0.1,
    corners: 6,
  });
  render.addShape(star2);
  const polygon = new PolygonShape({
    x: 100 * window.devicePixelRatio,
    y: 500 * window.devicePixelRatio,
    width: 100 * window.devicePixelRatio,
    height: 100 * window.devicePixelRatio,
    fillColor: '#ff0000',
    corners: 3,
  });
  render.addShape(polygon);

  const star4 = new StarShapeOld({
    x: 100 * window.devicePixelRatio,
    y: 600 * window.devicePixelRatio,
    width: 100 * window.devicePixelRatio,
    height: 100 * window.devicePixelRatio,
    fillColor: '#ff0000',
    innerRadius: 0.1,
  });
  render.addShape(star4);

  const rect = new RectShape({
    x: 300 * window.devicePixelRatio,
    y: 200 * window.devicePixelRatio,
    width: 100 * window.devicePixelRatio,
    height: 200 * window.devicePixelRatio,
    fillColor: '#ff0000',
    radius: 20,
  });
  render.addShape(rect);

  const ring = new RingShape({
    rx: 500 * window.devicePixelRatio,
    ry: 300 * window.devicePixelRatio,
    outerRadius: 70 * window.devicePixelRatio,
    innerRadius: 30 * window.devicePixelRatio,
    fillColor: '#ff0000',
  });
  render.addShape(ring);
  star.addEventListener('click', () => {
    console.log(222);
  });

  render.render();
});
</script>
<style scoped lang="scss"></style>
