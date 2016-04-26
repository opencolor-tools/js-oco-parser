"use strict";
import {EntryValue} from "./entry_value";
export class ReferenceValue implements EntryValue {
  constructor(private _dotPath: string) {}
  get dotPath(): string {
    return this._dotPath;
  }
  toString(level: number): string {
    return `=${this._dotPath}`;
  }
}
