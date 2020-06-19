
interface DateDataSet {
  name: string;
  value: number;
  children: this[];
}

export class TimeManager {
  start: Date = new Date();
  end: Date = new Date();
  hours: DateDataSet[] = [];
  minutes: DateDataSet[] = [];
  seconds: DateDataSet[] = [];
  dataSet: DateDataSet[] = [];
  column = 6;
  timeColumn = 3;
  constructor() {
    for (let i = 0; i <= 23; i++) {
      this.hours.push({
        name: TimeManager.interZero(i) + '时',
        value: i,
        children: this.minutes
      });
    }
    for (let i = 0; i <= 59; i++) {
      this.minutes.push({
        name: TimeManager.interZero(i) + '分',
        value: i,
        children: this.seconds
      });
      this.seconds.push({
        name: TimeManager.interZero(i) + '秒',
        value: i,
        children: []
      });
    }
  }
  static interZero(val: number): number | string {
    if (val >= 10) {
      return val;
    }
    return '0' + val;
  }
  setRange(start: Date, end: Date, column = 3) {
    this.start = start;
    this.end = end;
    this.timeColumn = column;
    this.dataSet = this.getHours(start.getFullYear(), start.getMonth() + 1, start.getDate(), this.hours);
  }
  compareWithStartAndEnd(year?: number, month?: number, day?: number, hour?: number, minute?: number): boolean {
    return (typeof year !== 'undefined' && this.start.getFullYear() !== year && this.end.getFullYear() !== year) ||
      (typeof month !== 'undefined' && this.start.getMonth() + 1 !== month && this.end.getMonth() + 1 !== month) ||
      (typeof day !== 'undefined' && this.start.getDate() !== day && this.end.getDate() !== day) ||
      (typeof hour !== 'undefined' && this.start.getHours() !== hour && this.end.getHours() !== hour) ||
      (typeof minute !== 'undefined' && this.start.getMinutes() !== minute && this.end.getMinutes() !== minute);
  }
  getHours(year: number, month: number, day: number, hours: DateDataSet[]): DateDataSet[] {
    const current = new Date(year, month - 1, day);
    const currentTime = current.getTime();
    const startTime = this.start.getTime();
    const endTime = this.end.getTime();
    let ret: DateDataSet[] = [];
    if (
      currentTime > startTime &&
      currentTime < endTime &&
      this.compareWithStartAndEnd(year, month, day)
    ) {
      return hours;
    } else if (currentTime > startTime) {
      ret = hours.slice(0, this.end.getHours() + 1);
    } else if (currentTime < endTime) {
      ret = hours.slice(this.start.getHours());
    } else {
      return [];
    }
    ret = ret.map(hour => {
      return {
        name: hour.name,
        value: hour.value,
        children: this.timeColumn > 1 ? this.getMinutes(year, month, day, hour.value, hour.children) : []
      };
    });
    return ret;
  }
  getMinutes(year: number, month: number, day: number, hour: number, minutes: DateDataSet[]): DateDataSet[] {
    const current = new Date(year, month - 1, day, hour);
    const currentTime = current.getTime();
    const startTime = this.start.getTime();
    const endTime = this.end.getTime();
    let ret: DateDataSet[] = [];
    if (
      currentTime > startTime &&
      currentTime < endTime &&
      this.compareWithStartAndEnd(year, month, day, hour)
    ) {
      return minutes;
    } else if (currentTime > startTime) {
      ret = minutes.slice(0, this.end.getMinutes() + 1);
    } else if (currentTime < endTime) {
      ret = minutes.slice(this.start.getMinutes());
    } else {
      return [];
    }
    ret = ret.map(minute => {
      return {
        name: minute.name,
        value: minute.value,
        children: this.timeColumn > 2 ? this.getSeconds(year, month, day, hour, minute.value, minute.children) : []
      };
    });
    return ret;
  }
  getSeconds(year: number, month: number, day: number, hour: number, minute: number, seconds: DateDataSet[]) {
    const current = new Date(year, month - 1, day, hour, minute);
    const currentTime = current.getTime();
    const startTime = this.start.getTime();
    const endTime = this.end.getTime();
    if (
      currentTime > startTime &&
      currentTime < endTime &&
      this.compareWithStartAndEnd(year, month, day, hour, minute)
    ) {
      return seconds;
    } else if (currentTime > startTime) {
      return seconds.slice(0, this.end.getSeconds() + 1);
    } else if (currentTime < endTime) {
      return seconds.slice(this.start.getSeconds());
    } else {
      return [];
    }
  }
}

export class DateTimeManager extends TimeManager {
  static readonly weeks = ['日', '一', '二', '三', '四', '五', '六'];
  months: DateDataSet[] = [{
    name: '一月',
    value: 1,
    children: []
  }, {
    name: '二月',
    value: 2,
    children: []
  },{
    name: '三月',
    value: 3,
    children: []
  }, {
    name: '四月',
    value: 4,
    children: []
  }, {
    name: '五月',
    value: 5,
    children: []
  }, {
    name: '六月',
    value: 6,
    children: []
  }, {
    name: '七月',
    value: 7,
    children: []
  }, {
    name: '八月',
    value: 8,
    children: []
  }, {
    name: '九月',
    value: 9,
    children: []
  }, {
    name: '十月',
    value: 10,
    children: []
  }, {
    name: '十一月',
    value: 11,
    children: []
  }, {
    name: '十二月',
    value: 12,
    children: []
  }];
  leapMonth: DateDataSet[] = [];

  start: Date = new Date();
  end: Date = new Date();

  /* 1 3 5 7 8 10 12 */
  months31: DateDataSet[] = [];
  /* 4 6 9 11 */
  months30: DateDataSet[] = [];
  months29: DateDataSet[] = [];
  months28: DateDataSet[] = [];
  constructor() {
    super();
    this.leapMonth = this.months.slice();
    for (let i = 1; i <= 31; i++) {
      const item = {
        value: i,
        name: i + '日',
        children: this.hours
      };
      this.months31.push(item);
      if (i <= 30) {
        this.months30.push(item);
      }
      if (i <= 29) {
        this.months29.push(item);
      }
      if (i <= 28) {
        this.months28.push(item);
      }
    }
    for (let i = 0; i < 12; i++) {
      if ([1, 3, 5, 7, 8, 10, 12].includes(this.months[i].value)) {
        this.months[i].children = this.months31;
        this.leapMonth[i].children = this.months31;
      }
      if ([4, 6, 9, 11].includes(this.months[i].value)) {
        this.months[i].children = this.months30;
        this.leapMonth[i].children = this.months30;
      }
      if ([2].includes(this.months[i].value)) {
        this.months[i].children = this.months28;
        this.leapMonth[i].children = this.months29;
      }
    }
  }
  setRange(start: Date, end: Date, column = 6) {
    this.start = start;
    this.end = end;
    this.column = column;
    this.dataSet = this.getYears(start, end);
  }
  getYears(start: Date, end: Date): DateDataSet[] {
    const years: DateDataSet[] = [];
    const min = start.getFullYear();
    const max = end.getFullYear();
    for (let i = min; i <= max; i++) {
      years.push({
        name: i + '年',
        value: i,
        children: this.column > 1 ? this.getMonths(i) : []
      });
    }
    return years;
  }
  getMonths(year: number): DateDataSet[] {
    const startYear = this.start.getFullYear();
    const endYear = this.end.getFullYear();
    let ret: DateDataSet[] = [];
    if (year > startYear && year < endYear) {
      if (new Date(year, 1, 29).getMonth() === 1) {
        return this.leapMonth;
      }
      return this.months;
    } else if (year > startYear) {
      ret = this.months.slice(0, this.end.getMonth() + 1);
    } else if (year < endYear) {
      ret = this.months.slice(this.start.getMonth());
    } else {
      ret = this.months.slice(this.start.getMonth(), this.end.getMonth() + 1);
    }
    ret = ret.map(month => {
      return {
        name: month.name,
        value: month.value,
        children: this.getDays(year, month.value, month.children)
      };
    });
    return ret;
  }
  getDays(year: number, month: number, days: DateDataSet[]): DateDataSet[] {
    const date = new Date(year, month - 1);
    const startTime = this.start.getTime();
    const endTime = this.end.getTime();
    const currentTime = date.getTime();
    let ret: DateDataSet[] = [];
    if (currentTime > startTime && currentTime < endTime && this.compareWithStartAndEnd(year, month)) {
      return days;
    } else if (currentTime > startTime) {
      ret = days.slice(0, this.end.getDate());
    } else if (currentTime < endTime) {
      ret = days.slice(this.start.getDate() - 1);
    } else {
      return [];
    }
    ret = ret.map(day => {
      return {
        name: day.name,
        value: day.value,
        children: this.getHours(year, month, day.value, day.children)
      };
    });
    return ret;
  }
}

// time format
export function dateFormat(date: string | number | Date, fmt: string) {
  if (typeof date === 'string') {
    date = new Date(date.replace(/-/g, '/'));
  } else if (typeof date === 'number') {
    date = new Date(date);
  }
  const o: any = {
    'M+': date.getMonth() + 1, // 月份
    'd+': date.getDate(), // 日
    'h+': date.getHours(), // 小时
    'm+': date.getMinutes(), // 分
    's+': date.getSeconds(), // 秒
    'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
    'S': date.getMilliseconds() // 毫秒
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  for (const k in o) {
    if (o.hasOwnProperty(k) && new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
    }
  }
  return fmt;
}
