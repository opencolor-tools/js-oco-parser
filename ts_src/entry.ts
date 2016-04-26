"use strict";
import {Metadata} from "./metadata";
import {PaletteEntry} from "./palette_entry";

import {EntryValue} from "./entry_value";

export abstract class Entry {

  private _metadata: Metadata = null;

  constructor(private _name: string, protected _value: EntryValue, protected _parent?: PaletteEntry) {
    this._metadata = new Metadata();
  }

  get name(): string {
    return this._name;
  }
  set name(newName: string) {
    this._name = newName;
  }
  get parent(): PaletteEntry {
    return this._parent
  }
  set parent(newParent: PaletteEntry) {
    if((<Entry>newParent) == this) {
      return;
    }
    this._parent = newParent;
  }
  get dotPath(): string {
    if(!this._parent) {
      return this.name;
    }
    return [this._parent.dotPath, this.name].filter(s => s != '').join('.');
  }
  get value(): EntryValue {
    return this._value;
  }
  set value(newValue: EntryValue) {
    this._value = newValue;
  }
  get metadata(): Metadata {
    return this._metadata;
  }
  set metadata(newMetadata: Metadata) {
    this._metadata = newMetadata;
  }
  toString(level = 0): string {
    let result = `${this._name}: ${this._value.toString(level)}`;
    if (this.metadata.isEmpty()) {
      return result;
    }
    result += this.metadata.toString(level + 1);
    return result;
  }
}
