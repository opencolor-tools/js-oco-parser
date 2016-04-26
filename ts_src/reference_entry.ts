"use strict";
import {Entry} from "./entry";
import {Metadata} from "./metadata";
import {ReferenceValue} from "./reference_value";
import {PaletteEntry} from "./palette_entry";
export class ReferenceEntry extends Entry {

  _value: ReferenceValue
  constructor(_name: string, _value: ReferenceValue, _parent?: PaletteEntry) {
    super(_name, _value, _parent);
  }
  get resolvedEntry(): Entry {
    return this.resolvedEntries.pop();
  }
  get resolvedEntries(): Array<Entry> {
    if(!this._parent) {
      return [];
    }
    let entries: Array<Entry> = [];
    let scope: PaletteEntry = this._parent;
    while(true) {
      let entry = scope.get(this._value.dotPath);
      if((!entry && !scope.parent) || entries.indexOf(entry) !== -1) {
        break;
      }
      if(entry) {
        entries.push(entry);
        if(entry instanceof ReferenceEntry) {
          entries = entries.concat((<ReferenceEntry>entry).resolvedEntries);
        }
        break;
      }
      scope = scope.parent;
    }
    return entries;
  }
  get metadata(): Metadata {
    if(!this.resolvedEntries.length) {
      return super.metadata;
    }
    let obj: Object = Object.assign({},
      this.resolvedEntries.shift().metadata.toObject(),
      super.metadata.toObject()
    );
    return Metadata.fromObject(obj);
  }
  set metadata(newMetadata: Metadata) {
    super.metadata = newMetadata;
  }
  toString(level = 0): string {
    let result = `${this.name}: ${this._value.toString(level)}`;
    if (super.metadata.isEmpty()) {
      return result;
    }
    result += super.metadata.toString(level + 1);
    return result;
  }
}
