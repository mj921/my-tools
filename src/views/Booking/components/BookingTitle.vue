<template>
  <dt class="booking-title">
    <div class="booking-title-left">{{ dateObj.year }}</div>
    {{ lunarDate.getMonthInChinese() }}月{{ lunarDate.getDayInChinese() }}
    <small>({{ dateObj.month }}-{{ dateObj.date }})</small>
    <div class="booking-title-right">
      <slot name="right"></slot>
    </div>
  </dt>
</template>
<script lang="ts" setup>
import { Lunar } from 'lunar-typescript';
import { computed } from 'vue';

const props = defineProps<{ date: string }>();

const dateObj = computed(() => {
  const arr = props.date.split('-');
  return {
    year: +arr[0],
    month: +arr[1],
    date: +arr[2],
  };
});
const lunarDate = computed(() =>
  Lunar.fromDate(new Date(dateObj.value.year, dateObj.value.month, dateObj.value.date)),
);
</script>
<style scoped lang="scss">
.booking-title {
  height: 36px;
  text-align: center;
  position: relative;
  line-height: 36px;
  font-size: 18px;
  font-weight: bold;
  small {
    font-weight: normal;
  }
  .booking-title-left {
    position: absolute;
    height: 100%;
    left: 10px;
    top: 0;
    font-weight: normal;
    font-size: 16px;
  }
  .booking-title-right {
    position: absolute;
    height: 100%;
    right: 10px;
    top: 0;
    color: #4b8cf0;
    font-size: 16px;
    font-weight: normal;
  }
}
</style>
