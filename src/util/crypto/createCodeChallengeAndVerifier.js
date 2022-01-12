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
const stringFromBuffer_1 = __importDefault(require("../encoding/stringFromBuffer"));
const textEncoder_1 = __importDefault(require("../encoding/textEncoder"));
const toUrlEncodedBase64_1 = __importDefault(require("../encoding/toUrlEncodedBase64"));
const getRandomBytes_1 = __importDefault(require("./getRandomBytes"));
const sha256_1 = __importDefault(require("./sha256"));
const pkceMask = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_~.';
const createCodeVerifier = (length) => {
    return Array.from((0, getRandomBytes_1.default)(length))
        .map(v => pkceMask[v % pkceMask.length])
        .join('');
};
const createCodeChallengeAndVerifier = (length = 43, method = 'S256') => __awaiter(void 0, void 0, void 0, function* () {
    const verifier = createCodeVerifier(length);
    switch (method) {
        case 'plain':
            return { verifier, challenge: verifier };
        case 'S256':
            return {
                verifier,
                challenge: (0, toUrlEncodedBase64_1.default)((0, stringFromBuffer_1.default)(yield (0, sha256_1.default)(textEncoder_1.default.encode(verifier).buffer))),
            };
        default:
            throw new Error('bad challenge method');
    }
});
exports.default = createCodeChallengeAndVerifier;
