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
class AsyncValue {
    constructor() {
        this.requestId = 0;
        this.canUse = true;
        this.then = (onfulfilled, onrejected) => {
            return this.promise.then(onfulfilled, onrejected);
        };
    }
    use(promise) {
        if (!this.canUse) {
            throw new Error('Cannot use new Promise');
        }
        const id = ++this.requestId;
        delete this.state;
        delete this.error;
        this._promise = promise
            .then(result => {
            if (this.requestId === id) {
                this.state = result;
                delete this._promise;
            }
        })
            .catch(error => {
            if (this.requestId === id) {
                this.error = error;
                delete this._promise;
            }
        });
    }
    get promise() {
        this.canUse = false;
        return (() => __awaiter(this, void 0, void 0, function* () {
            yield this._promise;
            if (this.error) {
                this.canUse = true;
                throw this.error;
            }
            this.canUse = true;
            return this.state;
        }))();
    }
}
exports.default = AsyncValue;
