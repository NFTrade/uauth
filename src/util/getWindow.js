"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-nocheck
const global_1 = __importDefault(require("global"));
const getWindow = () => global_1.default;
exports.default = getWindow;
