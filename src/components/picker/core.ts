import { ReactNode, RefObject } from 'react';

export interface DataItem {
  name: ReactNode;
  value: string | number;
  disabled?: boolean;
  [prop: string]: any;
}
export interface MultiPickerDataItem extends DataItem {
  children?: this[];
}
export type MultiDataChildren = MultiPickerDataItem[];
export type MultiDataSet = MultiPickerDataItem[][];
export type PickerValues = string | number | (string | number)[];

export interface SelectorOpenOptions {
  data?: MultiDataChildren | MultiDataSet;
  defaultValue?: PickerValues;
  title?: ReactNode;
  wrapperClassName?: string;
}
export interface SelectorInterface {
  ele: Element | null;
  dataManager: MultiDataManager;
  ref: RefObject<any>;
  open(options: SelectorOpenOptions): Promise<any>;
  setData(data: MultiDataSet | MultiDataChildren): void;
  setValue(values?: PickerValues): void;
}

/*
* Data Manager
*/
export class MultiDataManager {
  dataSet: MultiDataSet = [];
  sources: MultiDataChildren | MultiDataSet = [];
  values: (string | number)[] = [];
  sourceValues: MultiDataChildren = [];
  selectedIndex: number[] = [];
  realSelectedIndex: number[] = [];
  multi = 1;
  constructor(multi = 1) {
    this.multi = multi;
  }
  static isArrayEqual(array1: Array<any>, array2: Array<any>): boolean {
    if (array1 === array2) {
      return true;
    }
    const length = Math.max(array1.length, array2.length);
    for (let i = 0; i < length; i++) {
      if (array1[i] !== array2[i]) {
        return false;
      }
    }
    return true;
  }
  static notEmpty(value: PickerValues | undefined): value is PickerValues {
    return typeof value !== 'undefined' && value !== '' && value !== null;
  }
  static isMultiDataSet(data: MultiDataChildren | MultiDataSet): data is MultiDataSet {
    return data.every((item: any) => Array.isArray(item));
  }
  disableSomeone(values: PickerValues) {
    if (!Array.isArray(values)) {
      values = [values];
    }
    const length = Math.min(this.dataSet.length, values.length);
    for (let i = 0; i < length; i++) {
      const index = this.dataSet[i].findIndex(val => val.value === (values as (string | number)[])[i]);
      if (index === -1) {
        break;
      }
      if (i === length - 1) {
        this.dataSet[i][index].disabled = true;
      }
    }
  }
  setData(data?: MultiDataChildren | MultiDataSet) {
    if (data) {
      this.sources = data;
    }
    if (MultiDataManager.isMultiDataSet(this.sources)) {
      this.dataSet = this.sources;
      return;
    }
    const multi = this.multi;
    const list: MultiDataSet = [];
    const deep = (children: MultiDataChildren, index: number) => {
      list.push(children);
      let value = this.values[index];
      if (typeof value === 'undefined' && children.length) {
        value = children[0].value;
      }
      for (let i = 0; i < children.length; i++) {
        if (
          children[i].value === value &&
          index + 1 < multi
        ) {
          if (children[i].children?.length) {
            deep(children[i].children as any, index + 1);
          }
          return;
        }
      }
      if (index + 1 < multi && children.length && children[0].children && children[0].children.length) {
        deep(children[0].children as any, index + 1);
      }
    };
    deep(this.sources, 0);
    this.dataSet = list;
  }
  setValues(values?: PickerValues) {
    let results: (string | number)[] = [];
    if (MultiDataManager.notEmpty(values) && Array.isArray(values)) {
      results = values;
    } else if (MultiDataManager.notEmpty(values) && !Array.isArray(values)) {
      results = [values];
    }
    if (!MultiDataManager.isArrayEqual(this.values, results)) {
      this.values = results;
    }
    this.setData();
    const data = this.dataSet;
    this.sourceValues = [];
    this.selectedIndex = [];
    this.realSelectedIndex = [];
    data.forEach((item, key) => {
      const value = this.values[key];
      const index = item.findIndex(val => val.value === value);
      this.selectedIndex.push(Math.max(0, index));
      if (index > -1) {
        this.realSelectedIndex.push(index);
        this.sourceValues.push(item[index]);
      }
    });
  }
  setIndex(index: number[]) {
    this.setValues(
      this.dataSet.map((item, key) => {
        const i = index[key];
        if (i && item[i]) {
          return item[i].value;
        }
        return item[0]?.value;
      })
    );
  }
}
