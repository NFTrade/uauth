"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function objectFromEntries(entries) {
    const object = {};
    for (const [k, v] of entries) {
        object[k] = v;
    }
    return object;
}
exports.default = objectFromEntries;
