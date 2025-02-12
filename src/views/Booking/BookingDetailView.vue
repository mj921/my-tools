<template>
  <div class="booking-detail">
    <booking-title class="booking-detail__title" :date="date">
      <template #right>
        <router-link :to="`/booking/add/${date}`">新增</router-link>
      </template>
    </booking-title>
    <div class="booking-detail__list">
      <dl class="booking-detail__item" v-for="item in list" :key="item.id">
        <div class="booking-detail__row">
          <span class="booling-detail__name">{{ item.name }}</span>
          <span>{{ item.mobile }}</span>
          <m-button class="booling-detail__edit-btn" type="text">
            <router-link :to="`/booking/add/${date}/${item.id}`">修改</router-link>
          </m-button>
        </div>
        <div class="booking-detail__row">
          {{ item.tableNum }}桌
          <span v-if="item.largeTableNum > 0">(大桌 {{ item.largeTableNum }})</span>
          <mj-tag type="primary">{{ BookingPositionMapper[item.position] }}</mj-tag>
          <mj-tag type="success">{{ BookingTimeMapper[item.time] }}</mj-tag>
        </div>
        <div v-if="item.remark" class="booking-detail__row">{{ item.remark }}</div>
      </dl>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed, inject, ref } from 'vue';
import { useRoute } from 'vue-router';
import BookingTitle from './components/BookingTitle.vue';
import {
  BOOKING_STORE_INJECT,
  BookingPositionMapper,
  BookingStore,
  BookingTimeMapper,
  type Booking,
} from './store';
import MjTag from '@/components/MjTag/MjTag.vue';
import MButton from '@/mobileComponents/MButton/MButton.vue';

const route = useRoute();

const store = inject<BookingStore>(BOOKING_STORE_INJECT)!;

const date = computed(() => route.params.date as string);
const dateObj = computed(() => {
  const arr = date.value.split('-');
  return {
    year: +arr[0],
    month: +arr[1],
    date: +arr[2],
  };
});
const list = ref<Booking[]>([]);
list.value = store.getDateBookingList(dateObj.value.year, dateObj.value.month, dateObj.value.date);
</script>
<style scoped lang="scss">
.booking-detail {
  .booking-detail__title {
    height: 37px;
    border-bottom: 1px solid #efefef;
    small {
      font-weight: normal;
    }
    .booking-detail__title-left {
      position: absolute;
      height: 100%;
      left: 10px;
      top: 0;
      font-weight: normal;
      font-size: 16px;
    }
    .booking-detail__title-right {
      position: absolute;
      height: 100%;
      right: 10px;
      top: 0;
      color: #4b8cf0;
      font-size: 16px;
      font-weight: normal;
    }
  }
  .booking-detail__list {
    height: calc(100vh - 37px);
    padding: 0 10px;
    overflow: auto;
    .booking-detail__item {
      padding: 10px 0;
      border-bottom: 1px solid #efefef;
      .booking-detail__row {
        position: relative;
        .booling-detail__name {
          font-weight: bold;
          font-size: 18px;
        }
        .mj-tag {
          margin-left: 10px;
        }
        .booling-detail__edit-btn {
          position: absolute;
          right: 0;
        }
      }
    }
  }
}
</style>
