"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-nocheck
const decodeState_1 = __importDefault(require("./decodeState"));
const encodeState_1 = __importDefault(require("./encodeState"));
describe('util/encoding/decodeState', () => {
    it('should encode and decode strings correctly', () => {
        const str = String.fromCharCode(...new Array(1000).keys());
        const encoded = (0, encodeState_1.default)(str);
        expect(str).toBe((0, decodeState_1.default)(encoded));
    });
});
