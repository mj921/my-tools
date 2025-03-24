<template>
  <div></div>
</template>
<script lang="ts" setup>
import { PolygonShape, RectShape, RingShape, ShapeRender, StarShape } from '@/lib/canvas';
import { onMounted } from 'vue';

onMounted(() => {
  const dpr = window.devicePixelRatio;
  const render = new ShapeRender({
    width: window.innerWidth,
    height: window.innerHeight,
    dpr,
  });
  const star = new StarShape({
    x: 100,
    y: 100,
    width: 100,
    height: 200,
    fillColor: '#ff0000',
    innerRadius: 0.1,
    dpr,
  });
  render.addShape(star);
  const star1 = new StarShape({
    x: 100,
    y: 300,
    width: 100,
    height: 100,
    fillColor: '#ff0000',
    // innerRadius: 0.1,
    corners: 5,
    dpr,
  });
  render.addShape(star1);
  const star2 = new StarShape({
    x: 100,
    y: 400,
    width: 100,
    height: 100,
    fillColor: '#ff0000',
    // innerRadius: 0.1,
    corners: 6,
    dpr,
  });
  render.addShape(star2);
  const polygon = new PolygonShape({
    x: 100,
    y: 500,
    width: 100,
    height: 100,
    fillColor: '#ff0000',
    corners: 3,
    dpr,
  });
  render.addShape(polygon);

  const rect = new RectShape({
    x: 300,
    y: 200,
    width: 100,
    height: 200,
    fillColor: '#ff0000',
    radius: 20,
    dpr,
  });
  render.addShape(rect);

  const ring = new RingShape({
    rx: 500,
    ry: 300,
    outerRadius: 70,
    innerRadius: 30,
    fillColor: '#ff0000',
    dpr,
  });
  render.addShape(ring);
  star.addEventListener('click', () => {
    console.log(222);
  });

  render.render();
});
</script>
<style scoped lang="scss"></style>
