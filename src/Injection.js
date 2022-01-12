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
const AsyncValue_1 = __importDefault(require("./AsyncValue"));
class Injection {
    constructor(builder) {
        this.builder = builder;
        this.domain = '';
        this.result = new AsyncValue_1.default();
        this.onChange = (domain) => {
            this.domain = domain;
            this.result.use(this.builder(domain));
        };
        this.build = (domain) => __awaiter(this, void 0, void 0, function* () {
            // if (this.domain === '') {
            //   throw new Error('You must enter a domain name')
            // }
            // console.log('Injection onSubmit domains:', domain, this.domain)
            if (domain !== this.domain) {
                throw new Error("Domains don't match");
            }
            return this.result;
        });
    }
}
exports.default = Injection;
