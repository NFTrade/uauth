"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const getWindow_1 = __importDefault(require("../getWindow"));
//ie 11.x uses msCrypto
const getCrypto = () => { var _a; return ((_a = (0, getWindow_1.default)().crypto) !== null && _a !== void 0 ? _a : (0, getWindow_1.default)().msCrypto); };
exports.default = getCrypto;
