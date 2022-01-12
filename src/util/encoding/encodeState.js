"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const getRandomBytes_1 = __importDefault(require("../crypto/getRandomBytes"));
const stringFromBuffer_1 = __importDefault(require("./stringFromBuffer"));
const toUrlEncodedBase64_1 = __importDefault(require("./toUrlEncodedBase64"));
const encodeState = (state) => `${(0, toUrlEncodedBase64_1.default)((0, stringFromBuffer_1.default)((0, getRandomBytes_1.default)(32)))}.${state == null
    ? ''
    : (0, toUrlEncodedBase64_1.default)(
    /* escape */ encodeURIComponent(JSON.stringify(state)))}`;
exports.default = encodeState;
