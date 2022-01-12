"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const uniqueElementsFromArray_1 = __importDefault(require("./uniqueElementsFromArray"));
const getSortedScope = (scope) => (0, uniqueElementsFromArray_1.default)(scope.trim().split(/\s+/)).sort().join(' ');
exports.default = getSortedScope;
