"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PopupClosedError = exports.PopupTimeoutError = void 0;
const createError_1 = __importDefault(require("./createError"));
exports.PopupTimeoutError = (0, createError_1.default)('PopupTimeoutError', 'The popup has timed out.');
exports.PopupClosedError = (0, createError_1.default)('PopupClosedError', 'The popup was closed.');
