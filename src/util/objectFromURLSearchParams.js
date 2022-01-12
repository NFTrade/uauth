"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-nocheck
function objectFromURLSearchParams(params) {
    const obj = {};
    params.forEach((_, key) => {
        if (params.getAll(key).length > 1) {
            obj[key] = params.getAll(key);
        }
        else {
            obj[key] = params.get(key);
        }
    });
    return obj;
}
exports.default = objectFromURLSearchParams;
