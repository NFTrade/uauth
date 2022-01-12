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
Object.defineProperty(exports, "__esModule", { value: true });
function retry(fn, retries = 4, timeout = 250, factor = 2, err = null) {
    if (retries <= 0) {
        return Promise.reject(err);
    }
    return fn().catch((err) => __awaiter(this, void 0, void 0, function* () {
        yield new Promise(r => setTimeout(r, timeout));
        return retry(fn, retries - 1, timeout * factor, factor, err);
    }));
}
exports.default = retry;
