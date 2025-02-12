<template>
  <div ref="editorRef" class="blueprint-editor"></div>
</template>
<script lang="ts" setup>
import {
  BoxGeometry,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Scene,
  SphereGeometry,
  WebGLRenderer,
} from 'three';
import { onMounted, ref } from 'vue';
import { setRenderer } from './utils';
import { OrbitControls } from 'three/examples/jsm/Addons.js';

const R = 200.2;
const SEGMENT = 200;
const BASE_SIZE = (Math.PI * R * 2) / SEGMENT;

const editorRef = ref<HTMLDivElement>();

const renderer = new WebGLRenderer();
const scene = new Scene();
const camera = new PerspectiveCamera(50);
camera.near = 0.1;
camera.far = 3000;
camera.position.z = 3 * R;
setRenderer(editorRef, renderer, camera);

const planetLineMesh = new Mesh(
  new SphereGeometry(R, SEGMENT, SEGMENT / 2),
  new MeshBasicMaterial({
    color: 0x10d62b,
    wireframe: true,
  }),
);
scene.add(planetLineMesh);
const planetMesh = new Mesh(
  new SphereGeometry(SEGMENT, SEGMENT, SEGMENT / 2),
  new MeshBasicMaterial({
    color: 0xdba260,
  }),
);
scene.add(planetMesh);

const box = new Mesh(
  new BoxGeometry(3 * BASE_SIZE, 3 * BASE_SIZE, 3 * BASE_SIZE),
  new MeshBasicMaterial({ color: 0xff0000 }),
);
box.position.z = R;
scene.add(box);
const animate = () => {
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
};

onMounted(() => {
  const control = new OrbitControls(camera, editorRef.value);
  animate();
});
</script>
<style scoped lang="scss">
.blueprint-editor {
  height: 100%;
}
</style>
