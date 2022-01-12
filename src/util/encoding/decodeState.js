"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-nocheck
const fromBase64_1 = __importDefault(require("./fromBase64"));
const decodeState = (state) => {
    const [, v, ...b] = state.split('.');
    if (b.length > 0) {
        throw new Error('failed to decode state');
    }
    return (v === null || v === void 0 ? void 0 : v.length) > 0
        ? JSON.parse(decodeURIComponent(/* unescape */ (0, fromBase64_1.default)(v)))
        : undefined;
};
exports.default = decodeState;
