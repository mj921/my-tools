<template>
  <div class="booking">
    <router-view />
  </div>
</template>
<script lang="ts" setup>
import { provide } from 'vue';
import { BOOKING_STORE_INJECT, BookingStore } from './store';

const store = new BookingStore();

provide(BOOKING_STORE_INJECT, store);
</script>
<style scoped lang="scss"></style>
