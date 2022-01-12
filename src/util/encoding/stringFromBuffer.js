"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const stringFromBuffer = (buf) => String.fromCharCode.apply(null, Array.from(new Uint8Array(buf)));
exports.default = stringFromBuffer;
