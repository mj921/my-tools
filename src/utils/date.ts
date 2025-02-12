import { Lunar } from 'lunar-typescript';
import { addZero } from '.';
import type { DateItem } from '@/mobileComponents/MCalendar/interface';

export const dateFmt = (fmt = 'YYYY-MM-DD HH:mm:ss', date = new Date()) => {
  const map: Record<string, string> = {
    YYYY: date.getFullYear().toString(),
    MM: addZero(date.getMonth() + 1),
    M: (date.getMonth() + 1).toString(),
    DD: addZero(date.getDate()),
    D: date.getDate().toString(),
    HH: addZero(date.getHours()),
    H: date.getHours().toString(),
    mm: addZero(date.getMinutes()),
    m: date.getMinutes().toString(),
    ss: addZero(date.getSeconds()),
    s: date.getSeconds().toString(),
  };
  const reg = new RegExp('(' + Object.keys(map).join('|') + ')', 'g');
  return fmt.replace(reg, ($0, $1) => {
    return map[$1];
  });
};

/**
 * 获取月天数
 * @param year 年
 * @param month 月
 * @param fromZero 月份是否从0开始 默认从0开始
 */
export const getMonthDays = (year: number, month: number, fromZero = true) => {
  const m = fromZero ? month + 1 : month;
  if (m === 2) {
    if ((year % 100 === 0 ? year % 400 : year % 4) === 0) {
      return 29;
    }
    return 28;
  }
  if ([1, 3, 5, 7, 8, 10, 12].includes(m)) return 31;
  return 30;
};

/**
 * 获取上一个月，年月
 * @param year 年
 * @param month 月
 * @param fromZero 月份是否从0开始 默认从0开始
 */
export const getPrevMonth = (year: number, month: number, fromZero = true) => {
  const o = {
    month: fromZero ? month + 1 : month,
    year,
  };
  if (o.month > 1) {
    o.month--;
  } else {
    o.month = 12;
    o.year--;
  }
  if (fromZero) {
    o.month--;
  }
  return o;
};
/**
 * 获取下一个月，年月
 * @param year 年
 * @param month 月
 * @param fromZero 月份是否从0开始 默认从0开始
 */
export const getNextMonth = (year: number, month: number, fromZero = true) => {
  const o = {
    month: fromZero ? month + 1 : month,
    year,
  };
  if (o.month < 12) {
    o.month++;
  } else {
    o.month = 1;
    o.year++;
  }
  if (fromZero) {
    o.month--;
  }
  return o;
};

/**
 * 获取日历月份日期列表
 * @param year 年
 * @param month 月（从0开始）
 * @returns
 */
export const getMonthDateList = (year: number, month: number) => {
  const monthFirstDate = new Date(year, month, 1);
  const currDays = getMonthDays(year, month);
  const prevMonth = getPrevMonth(year, month);
  const nextMonth = getNextMonth(year, month);
  const prevDays = getMonthDays(prevMonth.year, prevMonth.month);
  const prevMonthDays = monthFirstDate.getDay();
  const dayCount = prevMonthDays + currDays > 35 ? 42 : 35;
  const dateList: Array<DateItem> = [];
  let i, len;
  for (i = 0; i < prevMonthDays; i++) {
    const date = Lunar.fromDate(
      new Date(prevMonth.year, prevMonth.month, prevDays - prevMonthDays + i + 1),
    );
    dateList.push({
      year: prevMonth.year,
      month: prevMonth.month,
      date: prevDays - prevMonthDays + i + 1,
      lunarYear: date.getYearInChinese(),
      lunarMonth: date.getMonthInChinese(),
      lunarDate: date.getDayInChinese(),
      week: dateList.length % 7,
    });
  }
  for (i = 0; i < currDays; i++) {
    const date = Lunar.fromDate(new Date(year, month, i + 1));
    dateList.push({
      year,
      month,
      date: i + 1,
      lunarYear: date.getYearInChinese(),
      lunarMonth: date.getMonthInChinese(),
      lunarDate: date.getDayInChinese(),
      week: dateList.length % 7,
    });
  }
  for (i = 0, len = dayCount - currDays - prevMonthDays; i < len; i++) {
    const date = Lunar.fromDate(new Date(nextMonth.year, nextMonth.month, i + 1));
    dateList.push({
      year: nextMonth.year,
      month: nextMonth.month,
      date: i + 1,
      lunarYear: date.getYearInChinese(),
      lunarMonth: date.getMonthInChinese(),
      lunarDate: date.getDayInChinese(),
      week: dateList.length % 7,
    });
  }
  return dateList;
};
