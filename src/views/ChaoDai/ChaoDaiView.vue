<template>
  <div class="chaodai">
    <div class="chaodai-header">
      <div class="chaodai-header-year"></div>
      <div class="chaodai-header-list"></div>
    </div>
    <div class="chaodai-main">
      <div class="chaodai-main-year"></div>
      <div class="chaodai-main-list">
        <div
          :style="{
            backgroundImage: 'linear-gradient(135deg, black, white)',
            width: '3000px',
            height: '100%',
          }"
        ></div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup></script>
<style scoped lang="scss">
.chaodai {
  height: 100vh;
  width: 100vw;
  --chaodai-header-height: 20px;
  --chaodai0header-year-width: 60px;
  // background-image: linear-gradient(red, green);
  .chaodai-header {
    height: var(--chaodai-header-height);
    display: flex;
    width: 100vw;
    .chaodai-header-year {
      width: var(--chaodai0header-year-width);
      background-color: green;
      height: 100%;
    }
    .chaodai-header-list {
      width: calc(100vw - var(--chaodai0header-year-width));
      background-image: linear-gradient(to right, red, green);
      height: 100%;
      overflow: hidden;
    }
  }
  .chaodai-main {
    height: calc(100vh - var(--chaodai-header-height));
    overflow: auto;
    display: flex;
    width: 100vw;
    .chaodai-main-year {
      width: var(--chaodai0header-year-width);
      background-image: linear-gradient(yellow, blue);
      height: 50000px;
    }
    .chaodai-main-list {
      width: calc(100vw - var(--chaodai0header-year-width));
      overflow: auto;
      height: 50000px;
    }
  }
}
</style>
