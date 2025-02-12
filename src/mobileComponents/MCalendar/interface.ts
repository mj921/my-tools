export interface DateItem {
  year: number;
  month: number;
  date: number;
  lunarYear: string;
  lunarMonth: string;
  lunarDate: string;
  week: number;
}
export interface MCalendarSlots {
  cell: () => void;
}

export interface MCalendarEmits {
  (e: 'dateClick', item: DateItem, currMonth: { year: number; month: number }): void;
  (e: 'change', params: { year: number; month: number; type: 'month' | 'year' }): void;
}
export interface MCalendarProps {
  hideOtherMonthDay?: boolean;
  rowHeight?: number;
  formatter?: (day: DateItem) => number | string;
}
