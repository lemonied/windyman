export function isDate(val: any): val is Date {
  return toString.call(val) === '[object Date]';
}

export function isPlainObject(val: any): val is { [prop: string]: any } {
  return toString.call(val) === '[object Object]';
}

// null or undefined
export function isNull(val: any): val is null | undefined {
  return val === undefined || val === null;
}

// null | undefined | {}
export function isEmpty(val: any): boolean {
  if (typeof val === 'undefined') {
    return true;
  } else if (typeof val === 'object' && (val === null || Object.keys(val).length === 0)) {
    return true;
  }
  return false;
}

export function deepMerge(...args: any[]): any {
  const ret = Object.create(null);
  args.forEach(obj => {
    if (isPlainObject(obj)) {
      Object.keys(obj).forEach(key => {
        const val = obj[key];
        if (isPlainObject(val)) {
          if (isPlainObject(ret[key])) {
            ret[key] = deepMerge(ret[key], val);
          } else {
            ret[key] = deepMerge(val);
          }
        } else {
          ret[key] = val;
        }
      });
    }
  });
  return ret;
}

export function debounce(func: (args?: any) => any, delay = 300) {
  let timer: any;
  return (...args: any[]) => {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      func(...args);
    }, delay);
  };
}
