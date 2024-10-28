export const addZero = (val: number | string, num = 2) =>
  val.toString().length >= num
    ? val.toString()
    : (new Array(num).fill('0').join('') + val).slice(-num);

class Day {
  $d: Date;
  $Y!: number;
  $M!: number;
  $D!: number;
  $h!: number;
  $m!: number;
  $s!: number;
  $S!: number;
  constructor(
    date?: string | Date | number | number[] | Day,
    monthIndex?: number,
    day?: number,
    hours?: number,
    minutes?: number,
    seconds?: number,
    milliseconds?: number,
  ) {
    let _date = new Date();
    if (typeof date === 'string') {
      _date = new Date(date);
    } else if (typeof date === 'number') {
      _date =
        typeof monthIndex === 'number'
          ? new Date(date, monthIndex, day, hours, minutes, seconds, milliseconds)
          : new Date(date);
    } else if (date instanceof Date) {
      _date = new Date(date.getTime());
    } else if (Array.isArray(date)) {
      _date =
        date.length > 1
          ? new Date(date[0], date[1], date[2], date[3], date[4], date[5], date[6])
          : new Date(date[0]);
    } else if (date instanceof Day) {
      _date = new Date(date.$d);
    }
    this.$d = _date;
    this.init();
  }

  init() {
    this.$Y = this.$d.getFullYear();
    this.$M = this.$d.getMonth();
    this.$D = this.$d.getDate();
    this.$h = this.$d.getHours();
    this.$m = this.$d.getMinutes();
    this.$s = this.$d.getSeconds();
    this.$S = this.$d.getMilliseconds();
  }

  millisecond(val?: number) {
    if (typeof val === 'number') {
      this.$d.setMilliseconds(val);
      return this.$d.getTime();
    }
    return this.$d.getMilliseconds();
  }
  second(val?: number) {
    if (typeof val === 'number') {
      this.$d.setSeconds(val);
      this.init();
      return this.$d.getTime();
    }
    return this.$d.getSeconds();
  }
  minute(val?: number) {
    if (typeof val === 'number') {
      this.$d.setMinutes(val);
      this.init();
      return this.$d.getTime();
    }
    return this.$d.getMinutes();
  }
  hour(val?: number) {
    if (typeof val === 'number') {
      this.$d.setHours(val);
      this.init();
      return this.$d.getTime();
    }
    return this.$d.getHours();
  }
  date(val?: number) {
    if (typeof val === 'number') {
      this.$d.setDate(val);
      this.init();
      return this.$d.getTime();
    }
    return this.$d.getDate();
  }
  day(val?: number) {
    const day = this.$d.getDay();
    if (typeof val === 'number') {
      const d = val - day;
      this.add(d, 'd');
      this.init();
      return this.$d.getTime();
    }
    return day;
  }
  month(val?: number, dateCarry = false) {
    if (typeof val === 'number') {
      if (dateCarry) {
        this.$d.setMonth(val);
      } else {
        const year = this.$Y + Math.floor(val / 12);
        const month = val % 12;
        const days = Day.getMonthDays(year, month);
        this.$d.setDate(Math.min(days, this.$D));
        this.$d.setMonth(month);
        this.$d.setFullYear(year);
      }
      this.init();
      return this.$d.getTime();
    }
    return this.$d.getMonth();
  }
  year(val?: number, dateCarry = false) {
    if (typeof val === 'number') {
      if (!dateCarry && this.$M === 1 && this.$D >= 29 && !Day.isLeapYear(val)) {
        this.$d.setDate(28);
      }
      this.$d.setFullYear(val);
      this.init();
      return this.$d.getTime();
    }
    return this.$d.getFullYear();
  }

  /** 是否是闰年 */
  isLeapYear() {
    return Day.isLeapYear(this.$Y);
  }

  add(val: number, unit: string) {
    switch (unit) {
      case 'millisecond':
      case 'ms':
        this.$d.setMilliseconds(this.$d.getMilliseconds() + val);
        return this;
      case 'second':
      case 's':
        this.$d.setSeconds(this.$d.getSeconds() + val);
        return this;
      case 'minute':
      case 'm':
        this.$d.setMinutes(this.$d.getMinutes() + val);
        return this;
      case 'hour':
      case 'h':
        this.$d.setHours(this.$d.getHours() + val);
        return this;
      case 'day':
      case 'd':
        this.$d.setDate(this.$d.getDate() + val);
        return this;
      case 'month':
      case 'M':
        this.month(this.$d.getMonth() + val, true);
        return this;
      case 'year':
      case 'Y':
        this.year(this.$d.getFullYear() + val, true);
        return this;
      default:
        return this;
    }
  }
  subtract(val: number, unit: string) {
    return this.add(-val, unit);
  }

  clone() {
    return new Day(this);
  }

  startOf(unit: string) {
    const d = this.clone();
    switch (unit) {
      case 'second':
      case 's':
        d.millisecond(0);
        return d;
      case 'minute':
      case 'm':
        d.millisecond(0);
        d.second(0);
        return d;
      case 'hour':
      case 'h':
        d.millisecond(0);
        d.second(0);
        d.minute(0);
        return d;
      case 'day':
      case 'd':
        d.millisecond(0);
        d.second(0);
        d.minute(0);
        d.hour(0);
        return d;
      case 'month':
      case 'M':
        d.millisecond(0);
        d.second(0);
        d.minute(0);
        d.hour(0);
        d.date(1);
        return d;
      case 'year':
      case 'Y':
        d.millisecond(0);
        d.second(0);
        d.minute(0);
        d.hour(0);
        d.date(1);
        d.month(0);
        return d;
      default:
        return d;
    }
  }

  endOf(unit: string) {
    const d = this.clone();
    switch (unit) {
      case 'second':
      case 's':
        d.millisecond(999);
        return d;
      case 'minute':
      case 'm':
        d.millisecond(999);
        d.second(59);
        return d;
      case 'hour':
      case 'h':
        d.millisecond(999);
        d.second(59);
        d.minute(59);
        return d;
      case 'day':
      case 'd':
        d.millisecond(999);
        d.second(59);
        d.minute(59);
        d.hour(23);
        return d;
      case 'month':
      case 'M':
        d.millisecond(999);
        d.second(59);
        d.minute(59);
        d.hour(23);
        d.date(Day.getMonthDays(this.$Y, this.$M));
        return d;
      case 'year':
      case 'Y':
        d.millisecond(999);
        d.second(59);
        d.minute(59);
        d.hour(23);
        d.date(30);
        return d;
      default:
        return d;
    }
  }

  valueOf() {
    return this.$d.getTime();
  }

  format(format = 'YYYY-MM-DD HH:mm:ss') {
    const map: any = {
      BBBB: this.$Y + 543,
      BB: (this.$Y + 543).toString().slice(-2),
      YYYY: this.$Y,
      YY: this.$Y.toString().slice(-2),
      MM: addZero(this.$M + 1),
      M: this.$M + 1,
      DD: addZero(this.$D),
      D: this.$D,
      HH: addZero(this.$h),
      H: this.$h,
      hh: addZero(this.$h % 12),
      h: this.$h % 12,
      mm: addZero(this.$m),
      m: this.$m,
      ss: addZero(this.$s),
      s: this.$s,
      SSS: addZero(this.$S, 3),
      SS: addZero(this.$S),
      S: this.$S,
      A: this.$h < 12 ? 'AM' : 'PM',
      a: this.$h < 12 ? 'am' : 'pm',
    };
    return format.replace(
      /((?:YY){1,2}|M{1,4}|D{1,2}|H{1,2}|h{1,2}|m{1,2}|s{1,2}|S{1,3}|A|a)/g,
      ($0, $1) => map[$1],
    );
  }

  to(a: Day, showSuffix = true) {
    return Day.relationTime(this, a, showSuffix);
  }

  toNow(showSuffix = true) {
    return Day.relationTime(this, new Day(), showSuffix);
  }

  from(a: Day, showSuffix = true): string {
    return Day.relationTime(this, a, showSuffix);
  }

  fromNow(showSuffix = true) {
    return Day.relationTime(this, new Day(), showSuffix);
  }
  daysInMonth() {
    return Day.getMonthDays(this.$Y, this.$m);
  }

  toDate() {
    return new Date(this.$d);
  }

  toArray() {
    return [this.$Y, this.$M, this.$D, this.$h, this.$m, this.$s, this.$S];
  }

  toJSON() {
    return this.format('YYYY-MM-DD HH:mm:ss.SSS');
  }
  toString() {
    return this.format('YYYY-MM-DD HH:mm:ss.SSS');
  }
  toObject() {
    return {
      year: this.$Y,
      month: this.$M,
      date: this.$D,
      hour: this.$h,
      minute: this.$m,
      second: this.$s,
      millisecond: this.$S,
    };
  }
  toISOString() {
    return this.format('YYYY-MM-DDTHH:mm:ss.SSSZ');
  }
  toISOJSON() {
    return this.format('YYYY-MM-DDTHH:mm:ss.SSSZ');
  }

  static max(firstItem: Day | Day[], ...otherItem: Day[]) {
    const list = Array.isArray(firstItem) ? firstItem : [firstItem, ...otherItem];
    list.sort((a, b) => b.valueOf() - a.valueOf());
    return list[0];
  }

  static min(firstItem: Day | Day[], ...otherItem: Day[]) {
    const list = Array.isArray(firstItem) ? firstItem : [firstItem, ...otherItem];
    list.sort((a, b) => a.valueOf() - b.valueOf());
    return list[0];
  }
  static isLeapYear(year: number) {
    return year % 100 === 0 ? year % 400 === 0 : year % 4 === 0;
  }
  static getMonthDays(year: number, month: number) {
    const m = ((month % 12) + 12) % 12;
    if (m === 1) {
      if (Day.isLeapYear(year)) return 29;
      return 28;
    }
    if ([0, 2, 4, 6, 7, 9, 11].includes(m)) {
      return 31;
    }
    return 30;
  }

  /**
   * 0 to 44 seconds 几秒前
   * 45 to 89 seconds	m	1 分钟前
   * 90 seconds to 44 minutes	mm	2 分钟前 ... 44 分钟前
   * 45 to 89 minutes	h	1 小时前
   * 90 minutes to 21 hours	hh	2 小时前 ... 21 小时前
   * 2 to 35 hours	d	1 天前
   * 36 hours to 25 days	dd	2 天前 ... 25 天前
   * 26 to 45 days	M	1 个月前
   * 46 days to 10 months	MM	2 个月前 ... 10 个月前
   * 11 months to 17months	y	1 年前
   * 18 months+	yy	2 年前 ... 20 年前
   */
  static relationTime(a: Day, b: Day, showSuffix = true): string {
    let time = a.$d.getTime() - b.$d.getTime();
    let str = '前';
    if (time < 0) {
      [b, a] = [a, b];
      time *= -1;
      str = '后';
    }
    const suffix = showSuffix ? str : '';
    if (time === 0) return '刚刚';
    if (time < 45 * Day.MILLISECONDS_A_SECOND)
      return `${Math.round(time / Day.MILLISECONDS_A_SECOND)}秒${suffix}`;
    if (time < 90 * Day.MILLISECONDS_A_SECOND) return `1分钟${suffix}`;
    if (time < 45 * Day.MILLISECONDS_A_MINUTE)
      return `${Math.round(time / Day.MILLISECONDS_A_MINUTE)}分钟${suffix}`;
    if (time < 90 * Day.MILLISECONDS_A_MINUTE) return `1小时${suffix}`;
    if (time < 22 * Day.MILLISECONDS_A_HOUR)
      return `${Math.round(time / Day.MILLISECONDS_A_HOUR)}小时${suffix}`;
    if (time < 36 * Day.MILLISECONDS_A_HOUR) return `1天${suffix}`;
    if (time < 26 * Day.MILLISECONDS_A_DAY)
      return `${Math.round(time / Day.MILLISECONDS_A_DAY)}天${suffix}`;
    if (time < 46 * Day.MILLISECONDS_A_DAY) return `1个月${suffix}`;
    const dMonth = (a.$Y - b.$Y) * 12 + a.$M - b.$M;
    if (dMonth < 11) return `${dMonth}个月${suffix}`;
    if (dMonth < 18) return `1年${suffix}`;
    return `${Math.round(dMonth / 12)}年${suffix}`;
  }

  static isDay(d: Day) {
    return d instanceof Day;
  }

  static SECONDS_A_MINUTE = 60;
  static SECONDS_A_HOUR = Day.SECONDS_A_MINUTE * 60;
  static SECONDS_A_DAY = Day.SECONDS_A_HOUR * 24;
  static SECONDS_A_WEEK = Day.SECONDS_A_DAY * 7;

  static MILLISECONDS_A_SECOND = 1000;
  static MILLISECONDS_A_MINUTE = Day.SECONDS_A_MINUTE * Day.MILLISECONDS_A_SECOND;
  static MILLISECONDS_A_HOUR = Day.SECONDS_A_HOUR * Day.MILLISECONDS_A_SECOND;
  static MILLISECONDS_A_DAY = Day.SECONDS_A_DAY * Day.MILLISECONDS_A_SECOND;
  static MILLISECONDS_A_WEEK = Day.SECONDS_A_WEEK * Day.MILLISECONDS_A_SECOND;
}

export default Day;
