"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var cosmiconfig = require("cosmiconfig");
function getConf(dir) {
    var _a = (cosmiconfig('husky', {
        rcExtensions: true,
        sync: true
    }).load(dir) || {}).config, config = _a === void 0 ? {} : _a;
    var defaults = {
        skipCI: true
    };
    return __assign({}, defaults, config);
}
exports.default = getConf;
