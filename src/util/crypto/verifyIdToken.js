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
const jose_jwe_jws_1 = require("jose-jwe-jws");
const verifyIdToken = (keyGetter, id_token, nonce) => __awaiter(void 0, void 0, void 0, function* () {
    const [verification] = yield new jose_jwe_jws_1.Jose.JoseJWS.Verifier(new jose_jwe_jws_1.Jose.WebCryptographer(), id_token, keyGetter).verify();
    if (!verification.verified) {
        throw new Error('Failed to verify id_token!');
    }
    const idToken = JSON.parse(verification.payload);
    idToken.__raw = id_token;
    if (nonce !== idToken.nonce) {
        throw new Error("nonces don't match");
    }
    return idToken;
});
exports.default = verifyIdToken;
