<template>
  <div ref="editorRef" class="blueprint-editor"></div>
</template>
<script lang="ts" setup>
import {
  Group,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Scene,
  SphereGeometry,
  Vector3,
  WebGLRenderer,
} from 'three';
import { onMounted, ref } from 'vue';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import { setRenderer } from '../DSP/Blueprint/utils';

const scale = ref(1);

console.log(123);

const size = {
  month: 237,
  earth: 1000,
  sun: 109000,
  venus: 950,
  mercury: 383,
};
const distance = {
  earth: 23481000,
  venus: 16984848,
  mercury: 9089650,
};

const editorRef = ref<HTMLDivElement>();

const renderer = new WebGLRenderer();
const scene = new Scene();
const camera = new PerspectiveCamera(50);
camera.near = 0.1;
camera.far = 100000000;
camera.position.z = 1000000;
setRenderer(editorRef, renderer, camera);

const sun = new Mesh(new SphereGeometry(size.sun), new MeshBasicMaterial({ color: 0xff0000 }));
scene.add(sun);

const mercury = new Mesh(
  new SphereGeometry(size.mercury),
  new MeshBasicMaterial({ color: 0x4b8cf0 }),
);
mercury.position.x = distance.mercury;
scene.add(mercury);

const mercury1 = new Mesh(new SphereGeometry(size.sun), new MeshBasicMaterial({ color: 0x4b8cf0 }));
mercury1.position.x = distance.mercury;
mercury1.position.y = size.sun * 2;
scene.add(mercury1);

const venus = new Mesh(new SphereGeometry(size.venus), new MeshBasicMaterial({ color: 0xffff00 }));
venus.position.x = distance.venus;
scene.add(venus);

const venus1 = new Mesh(new SphereGeometry(size.sun), new MeshBasicMaterial({ color: 0xffff00 }));
venus1.position.x = distance.venus;
venus1.position.y = size.sun * 2;
scene.add(venus1);

const earthGroup = new Group();
const earth = new Mesh(new SphereGeometry(size.earth), new MeshBasicMaterial({ color: 0x0000ff }));
earthGroup.add(earth);

const earth1 = new Mesh(new SphereGeometry(size.sun), new MeshBasicMaterial({ color: 0x0000ff }));
earth1.position.y = size.sun * 2;
earthGroup.add(earth1);

earthGroup.position.x = distance.earth;
scene.add(earthGroup);

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
  height: 100vh;
}
</style>
