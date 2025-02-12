<template>
  <div class="blueprint">
    <BlueprintEditor />
  </div>
</template>
<script lang="ts" setup>
import { demoCode } from './demo';
import { parseBlueprintCode } from './translateCode';
import BlueprintEditor from './BlueprintEditor.vue';

console.log(parseBlueprintCode(demoCode));
</script>
<style scoped lang="scss">
.blueprint {
  height: 100vh;
}
</style>
