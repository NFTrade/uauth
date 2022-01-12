"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const getCrypto_1 = __importDefault(require("./getCrypto"));
//safari 10.x uses webkitSubtle
const getCryptoSubtle = () => { var _a; return (_a = (0, getCrypto_1.default)().subtle) !== null && _a !== void 0 ? _a : (0, getCrypto_1.default)().webkitSubtle; };
exports.default = getCryptoSubtle;
