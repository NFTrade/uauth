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
// @ts-nocheck
const jose_jwe_jws_1 = require("jose-jwe-jws");
const createRemoteJWKGetter = (jwks_uri) => (kid) => __awaiter(void 0, void 0, void 0, function* () {
    const { keys } = yield fetch(jwks_uri).then(res => res.json());
    console.log('enter here please');
    const key = keys.find(k => k.kid === kid);
    if (key) {
        return jose_jwe_jws_1.Jose.Utils.importPublicKey(key, 'RS256');
    }
    throw new Error(`Unable to find a signing key that matches '${kid}'`);
});
exports.default = createRemoteJWKGetter;
