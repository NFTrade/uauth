"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function createError(name, message) {
    return class extends Error {
        constructor() {
            super(message);
            this.name = name;
        }
    };
}
exports.default = createError;
