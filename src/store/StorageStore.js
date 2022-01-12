 // @ts-nocheck
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class StorageStore {
    constructor(storage) {
        this.storage = storage;
    }
    get(key) {
        const value = this.storage.getItem(key);
        if (value != null) {
            return JSON.parse(value);
        }
        return null;
    }
    delete(key) {
        this.storage.removeItem(key);
        return true;
    }
    set(key, value) {
        this.storage.setItem(key, JSON.stringify(value));
        return this;
    }
}
exports.default = StorageStore;
