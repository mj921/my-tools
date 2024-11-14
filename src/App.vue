<script setup lang="ts">
import { RouterView, useRouter } from 'vue-router';

const router = useRouter();
router.afterEach((to) => {
  document.title = (to.meta?.title || to.name || 'my-tool') as string;
});
</script>

<template>
  <RouterView />
</template>

<style src="./assets/theme.css"></style>

<style scoped></style>
