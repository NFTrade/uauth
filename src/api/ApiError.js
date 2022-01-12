"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ApiError extends Error {
    constructor(code, description, uri) {
        super(`${code}: ${description}${uri ? `\nSee more at ${uri}.` : ''}`);
        this.code = code;
        this.description = description;
        this.uri = uri;
    }
    static fromResponse(response) {
        return new ApiError(response.error, response.error_description, response.error_uri);
    }
}
exports.default = ApiError;
