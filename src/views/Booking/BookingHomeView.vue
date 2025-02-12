<template>
  <div class="booking-home">
    <m-calendar @date-click="onDateClick" @change="onCalendarChange">
      <template #cell="{ day }">
        <div class="booking-home__date">
          {{ day.date }}
          <span v-if="dateMapper[day.date]" class="booking-home__badge">
            {{ dateMapper[day.date] }}桌
          </span>
        </div>
      </template>
    </m-calendar>
  </div>
</template>
<script lang="ts" setup>
import MCalendar from '@/mobileComponents/MCalendar/MCalendar.vue';
import { BOOKING_STORE_INJECT, BookingStore } from './store';
import { inject, ref } from 'vue';
import type { DateItem } from '@/mobileComponents/MCalendar/interface';
import { useRouter } from 'vue-router';
const router = useRouter();

const store = inject<BookingStore>(BOOKING_STORE_INJECT)!;

const dateMapper = ref<Record<string, number>>({});
const today = new Date();
const year = ref(today.getFullYear());
const month = ref(today.getMonth());

const onCalendarChange = ({ year: y, month: m }: { year: number; month: number }) => {
  year.value = y;
  month.value = m;
};

dateMapper.value = store.getBookingCountByMonthGroupByDate(year.value, month.value + 1);

const onDateClick = ({ year, month, date }: DateItem) => {
  router.push(`/booking/detail/${year}-${month + 1}-${date}`);
};
</script>
<style scoped lang="scss">
.booking-home {
  .booking-home__date {
    position: relative;
    overflow: hidden;
    .booking-home__badge {
      position: absolute;
      right: 4px;
      top: 4px;
      line-height: 1em;
      color: red;
      font-size: 14px;
    }
  }
}
</style>
