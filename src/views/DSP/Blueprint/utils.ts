import type { PerspectiveCamera, WebGLRenderer } from 'three';
import { onMounted, onUnmounted, type Ref } from 'vue';

export const setRenderer = (
  parent: Ref<HTMLElement | undefined>,
  render: WebGLRenderer,
  camera: PerspectiveCamera,
) => {
  const onResize = () => {
    const bcr = parent.value!.getBoundingClientRect();
    render.setPixelRatio(window.devicePixelRatio);
    render.setSize(bcr.width, bcr.height);
    camera.aspect = bcr.width / bcr.height;
    camera.updateProjectionMatrix();
  };
  onMounted(() => {
    onResize();
    parent.value!.appendChild(render.domElement);
    window.addEventListener('resize', onResize);
  });
  onUnmounted(() => {
    window.removeEventListener('resize', onResize);
    render.dispose();
  });
};
