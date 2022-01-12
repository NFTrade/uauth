"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const toBase64_1 = __importDefault(require("./toBase64"));
const toUrlEncodedBase64 = (str) => {
    return (0, toBase64_1.default)(str)
        .replace(/=+$/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');
};
exports.default = toUrlEncodedBase64;
