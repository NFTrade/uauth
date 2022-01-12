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
const errors_1 = require("../errors/errors");
const util_1 = require("../util");
const toBase64_1 = __importDefault(require("../util/encoding/toBase64"));
const ApiError_1 = __importDefault(require("./ApiError"));
class Api {
    constructor(options) {
        this.options = options;
    }
    buildAuthorizeUrl(request) {
        return this._buildUrl(request);
    }
    buildLogoutUrl(request) {
        return this._buildUrl(request);
    }
    parseAuthorizeResponseFromFragment(url) {
        return this._validateResponse((0, util_1.objectFromURLSearchParams)(new URLSearchParams(new URL(url).hash.substring(1))));
    }
    parseAuthorizeResponseFromQuery(url) {
        return this._validateResponse((0, util_1.objectFromURLSearchParams)(new URL(url).searchParams));
    }
    authorizeWithPopup(request, config = {}) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.options.window) {
                throw new Error('no window in options');
            }
            const url = this.buildAuthorizeUrl(request);
            let popup = config.popup;
            const timeout = (_a = config.timeout) !== null && _a !== void 0 ? _a : 300000;
            if (!popup) {
                popup = this.options.window.open(url, 'uauth:authorize:popup', `left=${this.options.window.screenX +
                    (this.options.window.innerWidth - 400) / 2},top=${this.options.window.screenY +
                    (this.options.window.innerHeight - 600) / 2},width=400,height=600,resizable,scrollbars=yes,status=1`);
                if (!popup) {
                    throw new Error('popup failed to be constructed');
                }
            }
            else {
                popup.location.href = url;
            }
            let recievedMessage = false;
            const response = yield new Promise((resolve, reject) => {
                const timeoutId = setTimeout(() => {
                    if (!recievedMessage) {
                        clearInterval(intervalId);
                        popup.close();
                        reject(new errors_1.PopupTimeoutError());
                    }
                }, timeout);
                const intervalId = setInterval(() => {
                    // Check if popup is closed
                    if (!recievedMessage && (popup === null || popup === void 0 ? void 0 : popup.closed)) {
                        clearInterval(intervalId);
                        clearTimeout(timeoutId);
                        reject(new errors_1.PopupClosedError());
                    }
                    // Check if popup doesn't violate the "Same-Origin" policy and has a valid url
                    let href;
                    let url;
                    let redirectUrl;
                    try {
                        href = popup.location.href;
                        url = new URL(href);
                        redirectUrl = new URL(request.redirect_uri);
                    }
                    catch (error) {
                        return; // Exit if not
                    }
                    // Check to see that the redirect was correct
                    url.hash = '';
                    if (url.href === redirectUrl.href) {
                        recievedMessage = true;
                        clearInterval(intervalId);
                        clearTimeout(timeoutId);
                        popup.close();
                        try {
                            resolve(this.parseAuthorizeResponseFromFragment(href));
                        }
                        catch (error) {
                            reject(error);
                        }
                    }
                }, 10);
            });
            return response;
        });
    }
    authorizeWithDevice(request) {
        return __awaiter(this, void 0, void 0, function* () {
            return {};
        });
    }
    getToken(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const [input, init] = this._buildRequest(request, { method: 'POST' });
            return this._fetchJSON(input, init);
        });
    }
    introspect(request) {
        const [input, init] = this._buildRequest(request, { method: 'POST' });
        return this._fetchJSON(input, init);
    }
    revoke(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const [input, init] = this._buildRequest(request, { method: 'POST' });
            yield this._fetchJSON(input, init);
        });
    }
    userinfo(request) {
        const [input, init] = this._buildRequest(request, {
            method: 'GET',
            headers: { Authorization: `Basic ${request.access_token}` },
        });
        return this._fetchJSON(input, init);
    }
    jwks(request) {
        const [input, init] = this._buildRequest(request, { method: 'GET' });
        return this._fetchJSON(input, init);
    }
    getTokenWithAuthorizationCode(request) {
        return this.getToken(request);
    }
    getTokenWithRefreshToken(request) {
        return this.getToken(request);
    }
    getTokenWithDeviceCode(request) {
        return this.getToken(request);
    }
    getTokenWithPassword(request) {
        return this.getToken(request);
    }
    getTokenWithSAML(request) {
        return this.getToken(request);
    }
    getTokenWithClientCredentials(request) {
        return this.getToken(request);
    }
    _buildUrl(request) {
        const { url } = request, searchParams = __rest(request, ["url"]);
        const urlObject = new URL(url);
        const params = new URLSearchParams();
        for (const [k, v] of Object.entries(searchParams)) {
            if (k != null && v != null) {
                params.append(k, v);
            }
        }
        urlObject.search = params.toString();
        return urlObject.toString();
    }
    _buildRequest(request, options) {
        var _a;
        const { url, client_id, client_secret, client_auth_method } = request, rest = __rest(request, ["url", "client_id", "client_secret", "client_auth_method"]);
        const { headers: headersInit, method } = options;
        const headers = new Headers((_a = this.options.headers) !== null && _a !== void 0 ? _a : []);
        new Headers(headersInit !== null && headersInit !== void 0 ? headersInit : []).forEach((value, key) => {
            headers.set(key, value);
        });
        if (options.method === 'POST') {
            headers.set('Content-Type', 'application/x-www-form-urlencoded');
        }
        const body = Object.assign({ client_id }, rest);
        switch (client_auth_method) {
            case 'client_secret_basic':
                // throw new Error('only client_secret_post supported')
                if (client_secret == null) {
                    throw new Error('Client secret not present!');
                }
                headers.set('Authorization', `Basic ${(0, toBase64_1.default)(`${client_id}:${client_secret}`)}`);
                break;
            case 'client_secret_post':
                if (client_secret == null) {
                    throw new Error('Client secret not present!');
                }
                body.client_secret = client_secret;
                break;
            case 'none':
            case undefined:
            case null:
                break;
            default:
                throw new Error('Bad client_auth_method');
        }
        return [
            url,
            {
                method,
                headers,
                body: method === 'POST'
                    ? new URLSearchParams(Object.entries(body))
                    : undefined,
            },
        ];
    }
    _validateResponse(response) {
        if (response.error) {
            throw Api.Error.fromResponse(response);
        }
        return response;
    }
    _fetchJSON(input, init) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (init.headers) {
                const headers = new Headers(init.headers);
                headers.set('Accept', 'application/json');
                init.headers = headers;
            }
            else {
                init.headers = { Accept: 'application/json' };
            }
            if (!this.options.window) {
                throw new Error('no window in options');
            }
            const response = yield ((_a = this.options.window) === null || _a === void 0 ? void 0 : _a.fetch(input, init));
            const json = yield response.json();
            this._validateResponse(json);
            if (!response.ok) {
                throw new Error(`${response.status} ${response.statusText}: ${JSON.stringify(json)}`);
            }
            return json;
        });
    }
}
exports.default = Api;
Api.Error = ApiError_1.default;
