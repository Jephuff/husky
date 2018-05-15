"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var execa = require("execa");
var readPkg = require("read-pkg");
var getConf_1 = require("../getConf");
/**
 * @param argv - process.argv
 */
function default_1(_a) {
    var scriptPath = _a[1], _b = _a[2], hookName = _b === void 0 ? '' : _b;
    var cwd = scriptPath.split('node_modules')[0];
    var pkg = readPkg.sync(cwd);
    var config = getConf_1.default(cwd);
    var command = config && config.hooks && config.hooks[hookName];
    var oldCommand = pkg && pkg.scripts && pkg.scripts[hookName.replace('-', '')];
    try {
        if (command) {
            console.log("husky > " + hookName + " (node " + process.version + ")");
            execa.shellSync(command, { cwd: cwd, stdio: 'inherit' });
            return 0;
        }
        if (oldCommand) {
            console.log();
            console.log("Warning: Setting " + hookName + " script in package.json > scripts will be deprecated in v1.0");
            console.log("Please move it to husky.hooks in package.json, a .huskyrc file, or a husky.config.js file");
            console.log("Or run ./node_modules/.bin/husky-upgrade for automatic update");
            console.log();
            console.log("See https://github.com/typicode/husky for usage");
            console.log();
            console.log("husky > " + hookName + " (node " + process.version + ")");
            execa.shellSync(oldCommand, { cwd: cwd, stdio: 'inherit' });
            return 0;
        }
        return 0;
    }
    catch (e) {
        var noVerifyMessage = hookName === 'prepare-commit-msg'
            ? '(cannot be bypassed with --no-verify due to Git specs)'
            : '(add --no-verify to bypass)';
        console.log("husky > " + hookName + " hook failed " + noVerifyMessage);
        return 1;
    }
}
exports.default = default_1;
