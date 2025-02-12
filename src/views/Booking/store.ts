import BinaryWriter from '@/lib/saver/BinaryWriter';

export enum BookingTime {
  /** 中午 */
  Noon = 1,
  /** 晚上 */
  Evening = 2,
}

export const BookingTimeMapper = {
  [BookingTime.Noon]: '中午',
  [BookingTime.Evening]: '晚上',
};

export const bookingTimeList = [
  {
    value: BookingTime.Evening,
    label: BookingTimeMapper[BookingTime.Evening],
  },
  {
    value: BookingTime.Noon,
    label: BookingTimeMapper[BookingTime.Noon],
  },
];

export enum BookingPosition {
  /** 大棚 */
  GreenHouse = 1,
  /** 西面 */
  East = 2,
  /** 南面 */
  North = 3,
  /** 家里 */
  Home = 4,
  /** 后面 */
  RearHall = 5,
}

export const BookingPositionMapper = {
  [BookingPosition.GreenHouse]: '大棚',
  [BookingPosition.East]: '西面',
  [BookingPosition.North]: '南面',
  [BookingPosition.Home]: '家里',
  [BookingPosition.RearHall]: '后面',
};

export const bookingPositionList = [
  {
    value: BookingPosition.GreenHouse,
    label: BookingPositionMapper[BookingPosition.GreenHouse],
  },
  {
    value: BookingPosition.East,
    label: BookingPositionMapper[BookingPosition.East],
  },
  {
    value: BookingPosition.North,
    label: BookingPositionMapper[BookingPosition.North],
  },
  {
    value: BookingPosition.Home,
    label: BookingPositionMapper[BookingPosition.Home],
  },
  {
    value: BookingPosition.RearHall,
    label: BookingPositionMapper[BookingPosition.RearHall],
  },
];
export interface Booking {
  id: number;
  name: string;
  year: number;
  month: number;
  date: number;
  time: BookingTime;
  tableNum: number;
  largeTableNum: number;
  position: BookingPosition;
  mobile: string;
  money: number;
  remark: string;
}

export type AddBooking = Omit<Booking, 'id' | 'money'>;

const STORE_KEY = 'bookingStore';

export const BOOKING_STORE_INJECT = 'bookingStore';

export class BookingStore {
  data: Booking[] = [];
  reader = new BinaryWriter('Read', 1);
  maxId: number;
  mapper: Map<number, Booking> = new Map();
  constructor() {
    const str = localStorage.getItem(STORE_KEY);
    if (str) {
      try {
        this.reader.setRawData(str);
        this.data = this.reader.readArray<Booking>((r) => {
          const obj: Booking = {
            id: r.readInt16(),
            name: r.readString(),
            year: r.readInt16(),
            month: r.readInt8(),
            date: r.readInt8(),
            time: r.readInt8(),
            tableNum: r.readInt8(),
            largeTableNum: r.readInt8(),
            position: r.readInt8(),
            money: r.readInt16(),
            mobile: r.readString(),
            remark: r.readString(),
          };
          this.mapper.set(obj.id, obj);
          return obj;
        });
      } catch (error) {
        console.log(error);
      }
    }
    this.maxId = this.data.length > 0 ? Math.max(...this.data.map((el) => el.id)) : 0;
  }

  saveStore() {
    const writer = new BinaryWriter('Write', this.data.length * 384);
    writer.writeArray(this.data, (val: Booking, w) => ({
      id: w.writeInt16(val.id),
      name: w.writeString(val.name),
      year: w.writeInt16(val.year),
      month: w.writeInt8(val.month),
      date: w.writeInt8(val.date),
      time: w.writeInt8(val.time),
      tableNum: w.writeInt8(val.tableNum),
      largeTableNum: w.writeInt8(val.largeTableNum),
      position: w.writeInt8(val.position),
      money: w.writeInt16(val.money || 0),
      mobile: w.writeString(val.mobile),
      remark: w.writeString(val.remark),
    }));
    localStorage.setItem(STORE_KEY, writer.getRawDataStr());
  }

  addBooking(booking: AddBooking) {
    const id = ++this.maxId;
    const obj = {
      ...booking,
      id,
      money: 0,
    };
    this.data.push(obj);
    this.mapper.set(id, obj);
    this.saveStore();
  }
  updateBookingById(id: number, booking: AddBooking) {
    const index = this.data.findIndex((el) => el.id === id);
    this.data[index] = {
      ...this.data[index],
      ...booking,
    };
    this.mapper.set(id, this.data[index]);
  }

  getDateBookingList(year: number, month: number, date: number) {
    return this.data.filter((el) => el.year === year && el.month === month && el.date === date);
  }

  getBookingById(id: number) {
    return this.mapper.get(id);
  }

  getBookingListByMonthGroupByDate(year: number, month: number) {
    const map: Record<string, Booking[]> = {};
    for (let i = 0, len = this.data.length; i < len; i++) {
      const item = this.data[i];
      if (year === item.year && month === item.month) {
        if (!map[item.date]) {
          map[item.date] = [];
        }
        map[item.date].push(item);
      }
    }
    return map;
  }
  getBookingCountByMonthGroupByDate(year: number, month: number) {
    const map: Record<string, number> = {};
    for (let i = 0, len = this.data.length; i < len; i++) {
      const item = this.data[i];
      if (year === item.year && month === item.month) {
        if (!map[item.date]) {
          map[item.date] = 0;
        }
        map[item.date]++;
      }
    }
    return map;
  }
}
