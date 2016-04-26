"use strict";
import {Entry} from "./entry";
import {EntryValue} from "./entry_value";
import {PaletteEntryValue} from "./palette_value";

import {ColorEntry} from "./color_entry";
import {ColorEntryValue} from "./color_value";

import {ReferenceEntry} from "./reference_entry";
import {ReferenceValue} from "./reference_value";


export class PaletteEntry extends Entry {

  _value: PaletteEntryValue
  constructor(_name: string, _value?: PaletteEntryValue, _parent?: PaletteEntry) {
    if(!_value) {
      _value = new PaletteEntryValue();
    }
    super(_name, _value, _parent);
    _value.entries.forEach((entry) => {
      entry.parent = this;
    });
  }
  set(dotPath: String, value: EntryValue) {
    const pathParts: Array<string> = dotPath.split('.');
    const firstPathPart: string = pathParts.shift();
    let existingEntry = this._value.getEntryByName(firstPathPart);

    // check remainig path parts
    if(!pathParts.length) {
      // set entry in this palette
      let newEntry = PaletteEntry.createEntry(firstPathPart, value, this);
      if(existingEntry) {
        this._value.replaceEntry(existingEntry, newEntry);
      } else {
        this._value.addEntry(newEntry);
      }
      return newEntry;
    }
    if(existingEntry && existingEntry instanceof PaletteEntry) {
      return existingEntry.set(pathParts.join('.'), value);
    }
    let newGroup = new PaletteEntry(firstPathPart, null, this);
    this._value.addEntry(newGroup);
    return newGroup.set(pathParts.join('.'), value);
  }
  get(dotPath: String): Entry {
    const pathParts: Array<String> = dotPath.split('.');
    if(!pathParts.length) {
      return undefined;
    }
    const firstPathPart: String = pathParts.shift();
    if(!pathParts.length) {
      return this._value.getEntryByName(firstPathPart);
    }
    const paletteEntry = this._value.getEntryByNameAndType(firstPathPart, PaletteEntry);
    if(!paletteEntry) {
      return undefined;
    }
    return (<PaletteEntry>paletteEntry).get(pathParts.join('.'));
  }
  traverseTree(filterByTypes: Array<any>, callback: (entry: Entry) => void) {
    this._value.entries.forEach(function(entry: Entry) {
      if(!filterByTypes || filterByTypes.length || filterByTypes.filter(type => (entry instanceof type)).length) {
        callback.apply(this, [entry]);
      }
      
      if((entry instanceof PaletteEntry)) {
        entry.traverseTree(filterByTypes, callback);
      }
    });
  }
  toString(level = 0): string {
    level++;
    if(this.metadata.isEmpty()) {
        return `${this.name}: ${this._value.toString(level)}`;
    }
    return `${this.name}: ${this.metadata.toString(level)} ${this._value.toString(level)}`;
  }

  static createEntry(name: string, value: EntryValue, parent: PaletteEntry): Entry {

    if(value instanceof ColorEntryValue) {
      return new ColorEntry(name, value, parent);
    }
    if(value instanceof ReferenceValue) {
      return new ReferenceEntry(name, value, parent);
    }
    if(value instanceof PaletteEntryValue) {
      return new PaletteEntry(name, value, parent);
    }

    return null
  }
}
