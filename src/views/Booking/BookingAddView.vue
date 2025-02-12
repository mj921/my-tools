<template>
  <div class="booking-add">
    <booking-title class="booking-add__title" :date="date" />
    <div class="booking-add__form">
      <dl class="booking-add__form-item">
        <label class="booking-add__form-label">预订人</label>
        <div class="booking-add__form-content">
          <input v-model="formData.name" />
        </div>
      </dl>
      <dl class="booking-add__form-item">
        <label class="booking-add__form-label">桌数</label>
        <div class="booking-add__form-content">
          <input type="number" v-model="formData.tableNum" />
        </div>
      </dl>
      <dl class="booking-add__form-item">
        <label class="booking-add__form-label">大桌数</label>
        <div class="booking-add__form-content">
          <input type="number" v-model="formData.largeTableNum" />
        </div>
      </dl>
      <dl class="booking-add__form-item">
        <label class="booking-add__form-label">位置</label>
        <div class="booking-add__form-content">
          <select v-model="formData.position">
            <option
              v-for="option in bookingPositionList"
              :value="option.value"
              :key="`position-${option.value}`"
            >
              {{ option.label }}
            </option>
          </select>
        </div>
      </dl>
      <dl class="booking-add__form-item">
        <label class="booking-add__form-label">时间</label>
        <div class="booking-add__form-content">
          <select v-model="formData.time">
            <option
              v-for="option in bookingTimeList"
              :value="option.value"
              :key="`position-${option.value}`"
            >
              {{ option.label }}
            </option>
          </select>
        </div>
      </dl>
      <dl class="booking-add__form-item">
        <label class="booking-add__form-label">手机号</label>
        <div class="booking-add__form-content">
          <input type="number" v-model="formData.mobile" />
        </div>
      </dl>
      <dl class="booking-add__form-item booking-add__form-item-wrap">
        <label class="booking-add__form-label">备注</label>
        <div class="booking-add__form-content">
          <textarea :rows="3" v-model="formData.remark"></textarea>
        </div>
      </dl>
    </div>
    <div class="booking-add__footer">
      <m-button type="outline" size="large" @click="router.back()">返回</m-button>
      <m-button type="primary" size="large" @click="save">保存</m-button>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useRoute, useRouter } from 'vue-router';
import BookingTitle from './components/BookingTitle.vue';
import { computed, inject, reactive } from 'vue';
import MButton from '@/mobileComponents/MButton/MButton.vue';
import { BOOKING_STORE_INJECT, BookingStore, bookingPositionList, bookingTimeList } from './store';

const route = useRoute();
const router = useRouter();

const date = computed(() => route.params.date as string);
const id = computed(() => +route.params.id);
const dateObj = computed(() => {
  const arr = date.value.split('-');
  return {
    year: +arr[0],
    month: +arr[1],
    date: +arr[2],
  };
});

const store = inject<BookingStore>(BOOKING_STORE_INJECT)!;

const defaultFormData = (id.value ? store.getBookingById(id.value) : null) || {
  name: '',
  tableNum: '',
  largeTableNum: '',
  position: '',
  time: '',
  mobile: '',
  remark: '',
};
console.log(defaultFormData, id.value);

const formData = reactive(defaultFormData);

const save = () => {
  if (id.value) {
    store.updateBookingById(id.value, {
      name: formData.name,
      tableNum: +formData.tableNum,
      largeTableNum: +formData.largeTableNum,
      position: +formData.position,
      time: +formData.time,
      mobile: formData.mobile,
      remark: formData.remark,
      ...dateObj.value,
    });
  } else {
    store.addBooking({
      name: formData.name,
      tableNum: +formData.tableNum,
      largeTableNum: +formData.largeTableNum,
      position: +formData.position,
      time: +formData.time,
      mobile: formData.mobile,
      remark: formData.remark,
      ...dateObj.value,
    });
  }
  router.back();
};
</script>
<style scoped lang="scss">
.booking-add {
  .booking-add__title {
    height: 37px;
    border-bottom: 1px solid #efefef;
  }
  .booking-add__form {
    height: calc(100vh - 94px);
    padding: 0 10px;
    .booking-add__form-item {
      display: flex;
      border-bottom: 1px solid #efefef;
      .booking-add__form-label {
        width: 90px;
        flex: 0 0 90px;
        line-height: 40px;
        font-size: 16px;
      }
      .booking-add__form-content {
        width: calc(100% - 90px);
        flex: 1 1 calc(100% - 90px);
        input {
          height: 40px;
          line-height: 40px;
          font-size: 16px;
          border: none;
          width: 100%;
          outline: none;
          text-align: right;
          &:focus {
            text-align: left;
          }
        }
        select {
          height: 100%;
          width: 100%;
          outline: none;
          border: none;
          text-align: right;
          font-size: 16px;
        }
        textarea {
          line-height: 1.5;
          width: 100%;
          padding: 0 4px;
          border-color: #ccc;
          outline: none;
          resize: none;
        }
      }
      &.booking-add__form-item-wrap {
        flex-direction: column;
        .booking-add__form-label {
          width: 100%;
          flex: 1;
        }
        .booking-add__form-content {
          width: 100%;
          flex: 1;
        }
      }
    }
  }
  .booking-add__footer {
    height: 57px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-top: 1px solid #efefef;
    .m-btn {
      width: calc(50% - 25px);
    }
  }
}
</style>
