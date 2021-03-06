"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var path = require("path");
var readPkg = require("read-pkg");
var hookList = {
    applypatchmsg: 'applypatch-msg',
    commitmsg: 'commit-msg',
    postapplypatch: 'post-applypatch',
    postcheckout: 'post-checkout',
    postcommit: 'post-commit',
    postmerge: 'post-merge',
    postreceive: 'post-receive',
    postrewrite: 'post-rewrite',
    postupdate: 'post-update',
    preapplypatch: 'pre-applypatch',
    preautogc: 'pre-auto-gc',
    precommit: 'pre-commit',
    preparecommitmsg: 'prepare-commit-msg',
    prepush: 'pre-push',
    prerebase: 'pre-rebase',
    prereceive: 'pre-receive',
    pushtocheckout: 'push-to-checkout',
    sendemailvalidate: 'sendemail-validate',
    update: 'update'
};
function migrate(dir) {
    var pkgFile = path.join(dir, 'package.json');
    if (fs.existsSync(pkgFile)) {
        var pkg_1 = readPkg.sync(dir, { normalize: false });
        console.log("husky > upgrading " + pkgFile);
        // Don't overwrite pkg.husky if it exists
        if (pkg_1.husky) {
            return console.log("husky field in package.json isn't empty, skipping automatic upgrade");
        }
        // Create empty husky.hooks field
        pkg_1.husky = { hooks: {} };
        // Loop trhough hooks and move them to husky.hooks
        Object.keys(hookList).forEach(function (name) {
            var script = pkg_1.scripts[name];
            if (script) {
                delete pkg_1.scripts[name];
                var newName = hookList[name];
                pkg_1.husky.hooks[newName] = script;
                console.log("moved scripts." + name + " to husky.hooks." + newName);
            }
        });
        // Update package.json
        fs.writeFileSync(pkgFile, JSON.stringify(pkg_1, null, 2), 'utf-8');
        console.log("husky > done");
    }
}
exports.default = migrate;
