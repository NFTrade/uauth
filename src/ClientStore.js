"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const util = __importStar(require("./util"));
class ClientStore {
    constructor(client) {
        this.client = client;
    }
    get(key, { mustExist = false, deleteAfter = false } = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const entry = yield this.client.store.get(key);
            if (entry == null) {
                if (mustExist) {
                    throw new Error(`${key} does not exist in store`);
                }
                return;
            }
            const { value, expiresAt } = entry;
            if (expiresAt !== 0 && expiresAt < Date.now()) {
                yield this.client.store.delete(key);
                if (mustExist) {
                    throw new Error(`${key} does not exist in store`);
                }
                return;
            }
            if (deleteAfter) {
                yield this.client.store.delete(key);
            }
            return value;
        });
    }
    set(key, value, timeout = 0) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.client.store.set(key, {
                expiresAt: timeout === 0 ? 0 : Date.now() + timeout,
                value,
            });
        });
    }
    setAuthorizeRequest(request) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.set('request', request, 300000 /* 5 minutes */);
        });
    }
    getAuthorizeRequest() {
        return this.get('request', {
            mustExist: true,
            deleteAfter: true,
        });
    }
    setLogoutRequest(request) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.set('logout-request', request, 300000 /* 5 minutes */);
        });
    }
    getLogoutRequest() {
        return this.get('logout-request', {
            mustExist: true,
            deleteAfter: true,
        });
    }
    setVerifier(challenge, verifier) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.set(`verifier:${challenge}`, verifier, 300000 /* 5 minutes */);
        });
    }
    getVerifier(challenge) {
        return this.get(`verifier:${challenge}`, {
            mustExist: true,
            deleteAfter: true,
        });
    }
    setOpenIdConfiguration(username, openidConfiguration, timeout) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.set(`openidConfiguration:${username}`, openidConfiguration, timeout);
        });
    }
    getOpenIdConfiguration(username) {
        return this.get(`openidConfiguration:${username}`);
    }
    setAuthorization(authorization) {
        return __awaiter(this, void 0, void 0, function* () {
            const authorizationOptions = {
                clientID: authorization.idToken.aud,
                resource: authorization.resource,
                scope: authorization.scope,
                username: authorization.idToken.sub,
            };
            const expiresIn = authorization.expiresAt - Date.now();
            if (this.client.cacheOptions.setDefaultUsername) {
                yield this.client.cacheOptions.setDefaultUsername(authorization.idToken.sub);
            }
            yield this.set('username', authorizationOptions.username, expiresIn);
            yield this.set(yield this._getAuthorizationKey(authorizationOptions), authorization, expiresIn);
        });
    }
    deleteAuthorization(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const fallbackUsername = yield this.get('username');
            options.username = yield this._getUsername(options.username, fallbackUsername);
            if (options.username === fallbackUsername) {
                yield this.client.store.delete('username');
            }
            return this.client.store.delete(yield this._getAuthorizationKey(options));
        });
    }
    getAuthorization(options) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.get(yield this._getAuthorizationKey(options), {
                mustExist: true,
            });
        });
    }
    _getAuthorizationKey(options) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            return `authorization?${util.objectToKey({
                username: yield this._getUsername(options.username, yield this.get('username')),
                clientID: (_a = options.clientID) !== null && _a !== void 0 ? _a : this.client.fallbackLoginOptions.clientID,
                scope: util.getSortedScope((_b = options.scope) !== null && _b !== void 0 ? _b : this.client.fallbackLoginOptions.scope),
                resource: (_c = options.resource) !== null && _c !== void 0 ? _c : this.client.fallbackLoginOptions.resource,
            })}`;
        });
    }
    _getUsername(username, fallbackUsername) {
        return __awaiter(this, void 0, void 0, function* () {
            if (username == null && fallbackUsername == null) {
                throw new Error('no username given');
            }
            return username !== null && username !== void 0 ? username : fallbackUsername;
        });
    }
}
exports.default = ClientStore;
