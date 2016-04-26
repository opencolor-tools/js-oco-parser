"use strict";
export class Metadata {
  constructor(private _data?: Map<string, any>) {
    if(!_data) {
      this._data = new Map();
    }
  }
  isEmpty(): boolean {
    return (this._data.size === 0);
  }
  get(key: string): any {
    return this._data.get(key);
  }
  set(key: string, value: any): void {
    this._data.set(key, value);
  }
  has(key): boolean {
    return this._data.has(key);
  }
  toObject(): Object {
    let obj: Object = {};
    this._data.forEach((value, key) => {
        obj[key] = value;
    });
    return obj;
  }
  toString(level: number) {
    let lines = [''];
    this._data.forEach((v, k) => lines.push(`${k}: ${v}`));
    return lines.join('\n' + '  '.repeat(level));
  }
  static fromObject(obj: Object): Metadata {
    var data: Map<string, any> = new Map();
    Object.keys(obj).forEach(function(key) {
      if(typeof key == 'string') {
        data.set(key, obj[key]);
      }
    });
    return new Metadata(data);
  }
}
