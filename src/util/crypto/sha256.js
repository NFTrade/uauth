 // @ts-nocheck
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const getWindow_1 = __importDefault(require("../getWindow"));
const getCryptoSubtle_1 = __importDefault(require("./getCryptoSubtle"));
const sha256 = (buf) => __awaiter(void 0, void 0, void 0, function* () {
    const digestOp = (0, getCryptoSubtle_1.default)().digest({ name: 'SHA-256' }, buf);
    // This is for legacy IE Hashing
    if ((0, getWindow_1.default)().msCrypto) {
        return new Promise((res, rej) => {
            digestOp.oncomplete = (e) => res(e.target.result);
            digestOp.onerror = (e) => rej(e.error);
            digestOp.onabort = () => rej('The digest operation was aborted');
        });
    }
    return yield digestOp;
});
exports.default = sha256;
