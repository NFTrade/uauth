"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function objectToKey(object) {
    const params = new URLSearchParams([...Object.entries(object)].filter(([k, v]) => k != null && v != null));
    params.sort();
    return params.toString();
}
exports.default = objectToKey;
