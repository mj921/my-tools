<template>
  <div
    class="m-calendar"
    :style="{
      '--m-calendar-row-height': `${rowHeight}px`,
      '--m-calendar-bg-fontsize': `${rowHeight * 2}px`,
    }"
  >
    <div class="m-calendar__header">
      <div class="m-calendar__switch">
        <div class="m-calendar__switch-left">
          <DoubleLeftIcon color="#4b8cf0" @click="toPrevYear" />
          <LeftIcon color="#4b8cf0" @click="toPrevMonth" />
        </div>
        <div class="m-calendar__switch-text">{{ year }}年{{ month + 1 }}月</div>
        <div class="m-calendar__switch-right">
          <RightIcon color="#4b8cf0" @click="toNextMonth" />
          <DoubleRightIcon color="#4b8cf0" @click="toNextYear" />
        </div>
      </div>
      <div class="m-calendar__title">
        <dd class="m-calendar__title-item">日</dd>
        <dd class="m-calendar__title-item">一</dd>
        <dd class="m-calendar__title-item">二</dd>
        <dd class="m-calendar__title-item">三</dd>
        <dd class="m-calendar__title-item">四</dd>
        <dd class="m-calendar__title-item">五</dd>
        <dd class="m-calendar__title-item">六</dd>
      </div>
    </div>
    <div class="m-calendar__body" :data-month="month + 1">
      <dd
        :class="[
          'm-calendar__body-item',
          {
            'm-calendar__body-other': item.month !== month,
            'm-calendar__body-other--hide': hideOtherMonthDay && item.month !== month,
            'm-calendar__body-today': `${item.year}-${item.month + 1}-${item.date}` === todayStr,
          },
        ]"
        v-for="item in dayList"
        :key="`${item.year}-${item.month}-${item.date}`"
        @click="onCellClick(item)"
      >
        <slot
          name="cell"
          v-if="slots.cell"
          :day="item"
          :hideOtherMonthDay="hideOtherMonthDay"
          :year="year"
          :month="month"
          :is-today="`${item.year}-${item.month}-${item.date}` === todayStr"
        ></slot>
        <template v-else>
          {{ hideOtherMonthDay && item.month !== month ? '' : formatter(item) }}
        </template>
      </dd>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { getMonthDateList, getNextMonth, getPrevMonth } from '@/utils/date';
import { computed, ref } from 'vue';
import type { DateItem, MCalendarEmits, MCalendarProps } from './interface';
import DoubleLeftIcon from '@/components/MjIcon/DoubleLeftIcon.vue';
import LeftIcon from '@/components/MjIcon/LeftIcon.vue';
import RightIcon from '@/components/MjIcon/RightIcon.vue';
import DoubleRightIcon from '@/components/MjIcon/DoubleRightIcon.vue';

withDefaults(defineProps<MCalendarProps>(), {
  hideOtherMonthDay: true,
  rowHeight: 64,
  formatter: ({ date }: DateItem) => date,
});

const emits = defineEmits<MCalendarEmits>();

const slots = defineSlots();

const today = new Date();
const todayStr = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
const month = ref(today.getMonth());
const year = ref(today.getFullYear());
const dayList = computed(() => getMonthDateList(year.value, month.value));
const toPrevYear = () => {
  year.value--;
  emits('change', {
    year: year.value,
    month: month.value,
    type: 'year',
  });
};
const toNextYear = () => {
  year.value++;
  emits('change', {
    year: year.value,
    month: month.value,
    type: 'year',
  });
};
const toPrevMonth = () => {
  const o = getPrevMonth(year.value, month.value);
  year.value = o.year;
  month.value = o.month;
  emits('change', {
    year: year.value,
    month: month.value,
    type: 'month',
  });
};
const toNextMonth = () => {
  const o = getNextMonth(year.value, month.value);
  year.value = o.year;
  month.value = o.month;
  emits('change', {
    year: year.value,
    month: month.value,
    type: 'month',
  });
};
const onCellClick = (item: DateItem) => {
  emits('dateClick', item, { year: year.value, month: month.value });
};
</script>
<style scoped lang="scss">
.m-calendar {
  width: 100%;
  .m-calendar__header {
    .m-calendar__switch {
      width: 100%;
      display: flex;
      height: 32px;
      line-height: 32px;
      .m-calendar__switch-text {
        width: 130px;
        flex: 0 0 130px;
        text-align: center;
        font-weight: bold;
      }
      .m-calendar__switch-left,
      .m-calendar__switch-right {
        flex: 0 0 calc(50% - 65px);
        font-size: 16px;
        padding: 8px 0;
      }
      .m-calendar__switch-left {
        padding-left: 10px;
        .mj-icon:first-child {
          margin-right: 10px;
        }
      }
      .m-calendar__switch-right {
        padding-right: 10px;
        text-align: right;
        .mj-icon:last-child {
          margin-left: 10px;
        }
      }
    }
    .m-calendar__title {
      width: 100%;
      display: flex;
      .m-calendar__title-item {
        width: calc(100% / 7);
        flex: 0 0 calc(100% / 7);
        font-size: 16px;
        height: 32px;
        line-height: 32px;
        text-align: center;
      }
    }
  }
  .m-calendar__body {
    display: flex;
    flex-wrap: wrap;
    position: relative;
    z-index: 1;
    &::before {
      content: attr(data-month);
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      font-size: var(--m-calendar-bg-fontsize);
      pointer-events: none;
      z-index: -1;
      color: #eee;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .m-calendar__body-item {
      width: calc(100% / 7);
      flex: 0 0 calc(100% / 7);
      font-size: 18px;
      height: var(--m-calendar-row-height);
      line-height: var(--m-calendar-row-height);
      text-align: center;
      &.m-calendar__body-other {
        color: #ccc;
      }
      &.m-calendar__body-today {
        background-color: #4b8cf0;
        color: #fff;
        border-radius: 4px;
      }
    }
  }
}
</style>
