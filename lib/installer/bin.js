"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var isCI = require("is-ci");
var path = require("path");
var _1 = require("./");
// Just for testing
if (process.env.HUSKY_DEBUG) {
    console.log(process.env.INIT_CWD);
}
// Action can be "install" or "uninstall"
// huskyDir is ONLY used in dev, don't use this arguments
var _a = process.argv, action = _a[2], _b = _a[3], huskyDir = _b === void 0 ? path.join(__dirname, '../..') : _b;
// Find Git dir
try {
    // Run installer
    if (action === 'install') {
        _1.install(huskyDir, undefined, isCI);
    }
    else {
        _1.uninstall(huskyDir);
    }
}
catch (error) {
    console.log("husky > failed to " + action);
    console.log(error.message);
}
