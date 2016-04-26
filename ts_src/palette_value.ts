"use strict";
import {Entry} from "./entry";
import {EntryValue} from "./entry_value";

import {PaletteEntry} from "./palette_entry";

export class PaletteEntryValue implements EntryValue {

  constructor(private _entries?: Array<Entry>) {
    if(!_entries) {
      this._entries = [];
    }
  }
  get entries():Array<Entry> {
    return this._entries;
  }
  addEntry(newEntry: Entry) {
    this._entries.push(newEntry);
  }
  replaceEntry(existingEntry: Entry, newEntry: Entry) {
    var index = this._entries.indexOf(existingEntry);
    if(index !== -1) {
      this._entries[index] = newEntry;
    }
  }
  getEntryByName(name: String): Entry {
    let entries = this._entries.filter((e) => {
      return e.name == name;
    })
    return entries.pop();
  }
  getEntryByNameAndType(name: String, type: any): Entry {
    let entries = this._entries.filter((e) => {
      return e.name == name && e instanceof type;
    })
    return entries.pop();
  }
  toString(level: number): string {
    return [''].concat(this._entries.map(e => e.toString(level))).join('\n' + '  '.repeat(level));
  }
}
