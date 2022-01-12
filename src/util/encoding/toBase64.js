"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const getWindow_1 = __importDefault(require("../getWindow"));
const toBase64 = (str) => (0, getWindow_1.default)().btoa(str);
exports.default = toBase64;
