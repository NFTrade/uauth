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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@uauth/common");
const dom_ui_1 = __importDefault(require("@uauth/dom-ui"));
const resolution_1 = __importStar(require("@unstoppabledomains/resolution"));
const api_1 = require("./api");
const ClientStore_1 = __importDefault(require("./ClientStore"));
const store_1 = require("./store");
const util = __importStar(require("./util"));
class Client {
    constructor(options) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
        this.util = util;
        this._clientStore = new ClientStore_1.default(this);
        this.window = (_a = options.window) !== null && _a !== void 0 ? _a : window;
        this.fallbackIssuer =
            (_b = options.fallbackIssuer) !== null && _b !== void 0 ? _b : 'https://auth.unstoppabledomains.com';
        this.resolution = (_c = options.resolution) !== null && _c !== void 0 ? _c : new resolution_1.default();
        if (options.ui) {
            this.ui = options.ui;
        }
        else {
            if (options.uiOptions) {
                this.ui = new dom_ui_1.default(options.uiOptions);
            }
            else {
                this.ui = new dom_ui_1.default();
            }
        }
        if (options.store) {
            this.store = options.store;
        }
        else {
            const storeType = (_d = options.storeType) !== null && _d !== void 0 ? _d : 'localstore';
            switch (storeType) {
                case 'localstore':
                    this.store = new store_1.StorageStore(this.window.localStorage);
                    break;
                case 'sessionstore':
                    this.store = new store_1.StorageStore(this.window.sessionStorage);
                    break;
                case 'memory':
                    this.store = new Map();
                    break;
                default:
                    throw new Error('Bad storeType provided');
            }
        }
        this.cacheOptions = Object.assign({ issuer: false, userinfo: true, getDefaultUsername: () => { var _a; return (_a = this.window.localStorage.getItem('uauth-default-username')) !== null && _a !== void 0 ? _a : ''; } }, ((_e = options.cacheOptions) !== null && _e !== void 0 ? _e : {}));
        if (!((_f = options.cacheOptions) === null || _f === void 0 ? void 0 : _f.getDefaultUsername) &&
            !((_g = options.cacheOptions) === null || _g === void 0 ? void 0 : _g.setDefaultUsername)) {
            this.cacheOptions.setDefaultUsername = (username) => {
                this.window.localStorage.setItem('uauth-default-username', username);
            };
        }
        this.api = new api_1.Api({
            headers: {},
            window: this.window,
        });
        this.fallbackLoginOptions = {
            clientID: options.clientID,
            clientSecret: options.clientSecret,
            clientAuthMethod: (_h = options.clientAuthMethod) !== null && _h !== void 0 ? _h : (options.clientSecret ? 'client_secret_post' : 'none'),
            maxAge: (_j = options.maxAge) !== null && _j !== void 0 ? _j : 300000,
            prompt: (_k = options.prompt) !== null && _k !== void 0 ? _k : 'login',
            resource: options.resource,
            redirectUri: options.redirectUri,
            responseMode: (_l = options.responseMode) !== null && _l !== void 0 ? _l : 'fragment',
            scope: (_m = options.scope) !== null && _m !== void 0 ? _m : 'openid wallet',
        };
        this.fallbackLogoutOptions = {
            rpInitiatedLogout: (_o = options.rpInitiatedLogout) !== null && _o !== void 0 ? _o : typeof options.postLogoutRedirectUri === 'string',
            postLogoutRedirectUri: options.postLogoutRedirectUri,
        };
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const self = this;
        this.issuerResolver = new common_1.DefaultIssuerResolver({
            webfingerResolver: new common_1.DefaultWebFingerResolver({
                ipfsResolver: new common_1.DefaultIPFSResolver((...args) => (options.createIpfsUrl || common_1.DefaultIPFSResolver.defaultCreateUrl)(...args)),
                domainResolver: {
                    records(domain, keys) {
                        return __awaiter(this, void 0, void 0, function* () {
                            try {
                                const records = yield self.resolution.records(domain, keys);
                                return records;
                            }
                            catch (error) {
                                if (error instanceof resolution_1.ResolutionError &&
                                    error.code === resolution_1.ResolutionErrorCode.UnspecifiedResolver) {
                                    return {};
                                }
                                throw error;
                            }
                        });
                    },
                },
            }),
        });
    }
    _createAuthorizeRequestBuilder(options) {
        // TODO: Ensure nothing is missing
        const loginOptions = Object.assign(Object.assign({}, this.fallbackLoginOptions), options);
        const builder = (username) => __awaiter(this, void 0, void 0, function* () {
            yield new Promise(r => setTimeout(r, 2000));
            const openidConfiguration = yield this.getOpenIdConfiguration(username);
            const { verifier, challenge } = yield util.crypto.createCodeChallengeAndVerifier(43, 'S256');
            const nonce = util.encoding.toBase64(util.encoding.stringFromBuffer(util.crypto.getRandomBytes(32)));
            const state = util.encoding.encodeState(loginOptions.state);
            const request = {
                // Generated options
                url: openidConfiguration.authorization_endpoint,
                code_challenge: challenge,
                nonce,
                state,
                // Parameterized options
                client_id: loginOptions.clientID,
                client_secret: loginOptions.clientSecret,
                client_auth_method: loginOptions.clientAuthMethod,
                login_hint: username,
                max_age: loginOptions.maxAge,
                prompt: loginOptions.prompt,
                resource: loginOptions.resource,
                redirect_uri: loginOptions.redirectUri,
                response_mode: loginOptions.responseMode,
                scope: loginOptions.scope,
                // Constant options
                code_challenge_method: 'S256',
                response_type: 'code',
            };
            yield this._clientStore.setAuthorizeRequest(request);
            yield this._clientStore.setVerifier(challenge, verifier);
            return request;
        });
        return builder;
    }
    buildAuthorizeRequest(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const builder = this._createAuthorizeRequestBuilder(options);
            if (options.username) {
                return builder(options.username);
            }
            return this.ui.open({
                closeOnFinish: false,
                defaultValue: yield this.cacheOptions.getDefaultUsername(),
                submit: builder,
            });
        });
    }
    loginWithPopup(options = {}, config) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                ;
                options.responseMode = 'fragment';
                const request = yield this.buildAuthorizeRequest(options);
                console.log('enter here please');
                const response = yield this.api.authorizeWithPopup(request, config);
                const authorization = yield this.verifyAuthorizeResponse(request, response);
                return authorization;
            }
            finally {
                this.ui.close();
            }
        });
    }
    login(options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const request = yield this.buildAuthorizeRequest(options);
            const url = this.api.buildAuthorizeUrl(request);
            if (typeof options.beforeRedirect === 'function') {
                yield options.beforeRedirect(url);
            }
            this.window.location.href = url;
        });
    }
    loginCallback(options) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const url = (_a = options === null || options === void 0 ? void 0 : options.url) !== null && _a !== void 0 ? _a : this.window.location.href;
            const request = yield this._clientStore.getAuthorizeRequest();
            let response;
            if (request.response_mode === 'fragment') {
                response = this.api.parseAuthorizeResponseFromFragment(url);
            }
            else if (request.response_mode === 'query') {
                response = this.api.parseAuthorizeResponseFromQuery(url);
            }
            else {
                throw new Error('Unsupported response_mode');
            }
            return {
                authorization: yield this.verifyAuthorizeResponse(request, response),
                state: util.encoding.decodeState(request.state),
            };
        });
    }
    verifyAuthorizeResponse(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            if (request.state !== response.state) {
                throw new Error("states don't match");
            }
            const openidConfiguration = yield this.getOpenIdConfiguration(request.login_hint);
            const tokenRequest = {
                url: openidConfiguration.token_endpoint,
                client_id: request.client_id,
                client_secret: request.client_secret,
                client_auth_method: request.client_auth_method,
                grant_type: 'authorization_code',
                code: response.code,
                code_verifier: yield this._clientStore.getVerifier(request.code_challenge),
                redirect_uri: request.redirect_uri,
            };
            const tokenResponse = yield this.api.getTokenWithAuthorizationCode(tokenRequest);
            const idToken = yield util.crypto.verifyIdToken(util.crypto.createRemoteJWKGetter(openidConfiguration.jwks_uri), tokenResponse.id_token, request.nonce);
            const authorization = {
                accessToken: tokenResponse.access_token,
                // TODO: The server isn't returning the scope along with the callback and
                // I havn't found the oidc docs to figure out if this is a bug.
                expiresAt: Date.now() + tokenResponse.expires_in * 1000,
                idToken,
                scope: util.getSortedScope(request.scope),
                resource: request.resource,
            };
            yield this._clientStore.setAuthorization(authorization);
            return authorization;
        });
    }
    getOpenIdConfiguration(username) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.cacheOptions.issuer) {
                const openidConfiguration = yield this._clientStore.getOpenIdConfiguration(username);
                if (openidConfiguration) {
                    return openidConfiguration;
                }
            }
            const openidConfiguration = yield this.issuerResolver.resolve(username, this.fallbackIssuer);
            yield this._clientStore.setOpenIdConfiguration(username, openidConfiguration, typeof this.cacheOptions.issuer === 'number'
                ? this.cacheOptions.issuer
                : 3600000);
            return openidConfiguration;
        });
    }
    authorization(options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._clientStore.getAuthorization(options);
        });
    }
    user(options = {}) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const claims = (_a = options.claims) !== null && _a !== void 0 ? _a : [
                'name',
                'given_name',
                'family_name',
                'middle_name',
                'nickname',
                'preferred_username',
                'profile',
                'picture',
                'website',
                'email',
                'email_verified',
                'gender',
                'birthdate',
                'zoneinfo',
                'locale',
                'phone_number',
                'phone_number_verified',
                'address',
                'updated_at',
                'wallet_address',
                'wallet_type_hint',
            ];
            const authorization = yield this.authorization(options);
            const userinfo = {
                sub: authorization.idToken.sub,
            };
            // If we should only read from cache.
            if (this.cacheOptions.userinfo) {
                for (const claim of claims) {
                    if (authorization.idToken[claim]) {
                        userinfo[claim] = authorization.idToken[claim];
                    }
                }
                return userinfo;
            }
            const openidConfiguration = yield this.getOpenIdConfiguration(authorization.idToken.sub);
            const request = {
                client_id: this.fallbackLoginOptions.clientID,
                client_secret: this.fallbackLoginOptions.clientSecret,
                client_auth_method: this.fallbackLoginOptions.clientAuthMethod,
                access_token: authorization.accessToken,
                url: openidConfiguration.userinfo_endpoint,
            };
            const response = yield this.api.userinfo(request);
            for (const claim of claims) {
                if (response[claim]) {
                    userinfo[claim] = response[claim];
                }
            }
            return userinfo;
        });
    }
    buildLogoutRequest(options) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const authorization = yield this.authorization(options);
            const openidConfiguration = yield this.getOpenIdConfiguration(authorization.idToken.sub);
            if (openidConfiguration.end_session_endpoint == null) {
                throw new Error('end_session_endpoint must exist');
            }
            const postLogoutRedirectUri = (_a = options.postLogoutRedirectUri) !== null && _a !== void 0 ? _a : this.fallbackLogoutOptions.postLogoutRedirectUri;
            if (postLogoutRedirectUri == null) {
                throw new Error('postLogoutRedirectUri must be supplied');
            }
            const request = {
                client_id: this.fallbackLoginOptions.clientID,
                client_secret: this.fallbackLoginOptions.clientSecret,
                client_auth_method: this.fallbackLoginOptions.clientAuthMethod,
                url: openidConfiguration.end_session_endpoint,
                id_token_hint: authorization.idToken.__raw,
                post_logout_redirect_uri: postLogoutRedirectUri,
                state: util.encoding.encodeState(options.state),
            };
            yield this._clientStore.setLogoutRequest(request);
            return request;
        });
    }
    logout(_a = {}) {
        var { clientID, username, scope, resource } = _a, options = __rest(_a, ["clientID", "username", "scope", "resource"]);
        return __awaiter(this, void 0, void 0, function* () {
            const logoutOptions = Object.assign(Object.assign({}, this.fallbackLogoutOptions), options);
            const authorizationOptions = { clientID, username, scope, resource };
            if (!logoutOptions.rpInitiatedLogout) {
                yield this._clientStore.deleteAuthorization(authorizationOptions);
                return;
            }
            const request = yield this.buildLogoutRequest(logoutOptions);
            const url = this.api.buildLogoutUrl(request);
            if (typeof logoutOptions.beforeRedirect === 'function') {
                yield logoutOptions.beforeRedirect(url);
            }
            yield this._clientStore.deleteAuthorization(authorizationOptions);
            this.window.location.href = url;
        });
    }
    logoutCallback(options = {}) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const url = (_a = options === null || options === void 0 ? void 0 : options.url) !== null && _a !== void 0 ? _a : this.window.location.href;
            const request = yield this._clientStore.getLogoutRequest();
            const response = this.api.parseAuthorizeResponseFromQuery(url);
            yield this.verifyLogoutResponse(request, response);
            return util.encoding.decodeState(request.state);
        });
    }
    verifyLogoutResponse(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            if (request.state !== response.state) {
                throw new Error("states don't match");
            }
        });
    }
}
exports.default = Client;
