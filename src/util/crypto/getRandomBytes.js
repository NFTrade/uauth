"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const getCrypto_1 = __importDefault(require("./getCrypto"));
const getRandomBytes = (length) => (0, getCrypto_1.default)().getRandomValues(new Uint8Array(length));
exports.default = getRandomBytes;
